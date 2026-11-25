// What the stepper exposes, field by field, for one modelled stage.
//
// The firmware commands the ideal model (`ik` on the nominal geometry); the
// real stage is the six-rod model with its own rod lengths and ball-seat errors
// (`fkFull`), drawn from the same assumed bands as the stepper repo's
// studies/kinematics_study.py. The projector shows the same die at every site
// and the stage steps the chip between sites (step and repeat).
//
// Per field this gives where the image lands on the chip (at the chip's top
// surface, 18.6 mm above the point the firmware positions, so the Abbe error of
// the tilt is included) and how the chip surface tilts across the field. The
// chip is levelled and aligned once at the centre field and autofocused at every
// field, as in the post's Video 1.
import { fkFull, ik, matMul, nominal, rotationVector, transpose } from './kinematics.mjs';

/** Seeded uniform and normal random numbers (mulberry32 and Box-Muller). */
export function makeRng(seed) {
  let a = seed >>> 0;
  const uniform = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  let spare = null;
  const normal = (sd) => {
    if (spare !== null) {
      const s = spare;
      spare = null;
      return s * sd;
    }
    let u = 0;
    while (u === 0) u = uniform();
    const m = Math.sqrt(-2 * Math.log(u));
    const v = 2 * Math.PI * uniform();
    spare = m * Math.sin(v);
    return m * Math.cos(v) * sd;
  };
  return { uniform, normal };
}

/** One built stage: every rod, rotor radius, home angle and ball seat off by a draw from its band. */
export function randomStage(params, band, seed) {
  const B = params.bands[band];
  const { normal } = makeRng(seed);
  const g = nominal(params.stage);
  g.L = g.L.map((row) => row.map((l) => l + normal(B.rod_length_sd)));
  g.r = g.r.map((r) => r + normal(B.rotor_radius_sd));
  g.theta0 = g.theta0.map((t) => t + (normal(B.theta_offset_sd_deg) * Math.PI) / 180);
  g.dA = g.dA.map((joint) => joint.map(() => [0, 1, 2].map(() => normal(B.ball_centre_sd))));
  g.dE = g.dE.map((joint) => joint.map(() => [0, 1, 2].map(() => normal(B.ball_centre_sd))));
  return g;
}

/** Die sites on the chip (mm, chip centre at 0, y up) in the order the stage visits them: rows, back and forth. */
export function sites(params) {
  const { n, pitch_mm: p } = params.dies;
  const half = ((n - 1) / 2) * p;
  const out = [];
  for (let row = 0; row < n; row++) {
    const cols = [...Array(n).keys()];
    if (row % 2) cols.reverse();
    for (const col of cols) out.push({ row, col, x: -half + col * p, y: half - row * p });
  }
  return out;
}

/** The end-effector position that puts chip point (x, y) under the optical axis. */
export const commandFor = (x, y) => [-x, -y, 0];

/** Where the stage really is for a commanded position: { theta, P, Q }. */
export function poseAt(g, g0, command, warm) {
  const theta = ik(g0, command);
  const { P, Q } = fkFull(g, theta, warm ? { P0: warm.P, Q0: warm.Q } : undefined);
  return { theta, P, Q };
}

/** Chip-top point (EE frame x, y; the chip top is the plane z = c) that sits on the optical axis, base x = y = 0. */
export function underAxis(P, Q, c) {
  const rx = -(P[0] + Q[0][2] * c);
  const ry = -(P[1] + Q[1][2] * c);
  const det = Q[0][0] * Q[1][1] - Q[0][1] * Q[1][0];
  return [(rx * Q[1][1] - Q[0][1] * ry) / det, (Q[0][0] * ry - Q[1][0] * rx) / det];
}

/** Least-squares affine map u = A [x, y] + b over the sites: { A, b }. */
export function affineFit(xs, us) {
  // normal equations for each output axis with regressors [x, y, 1]
  const N = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  const R = [[0, 0], [0, 0], [0, 0]];
  xs.forEach(([x, y], i) => {
    const v = [x, y, 1];
    for (let a = 0; a < 3; a++) {
      for (let b = 0; b < 3; b++) N[a][b] += v[a] * v[b];
      R[a][0] += v[a] * us[i][0];
      R[a][1] += v[a] * us[i][1];
    }
  });
  const inv = invert3(N);
  const coef = [0, 1].map((k) => [0, 1, 2].map((a) => inv[a][0] * R[0][k] + inv[a][1] * R[1][k] + inv[a][2] * R[2][k]));
  return { A: [[coef[0][0], coef[0][1]], [coef[1][0], coef[1][1]]], b: [coef[0][2], coef[1][2]] };
}

function invert3(m) {
  const [[a, b, c], [d, e, f], [g, h, i]] = m;
  const A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g;
  const det = a * A + b * B + c * C;
  return [
    [A / det, -(b * i - c * h) / det, (b * f - c * e) / det],
    [B / det, (a * i - c * g) / det, -(a * f - c * d) / det],
    [C / det, -(a * h - b * g) / det, (a * e - b * d) / det],
  ];
}

/**
 * Expose every site with stage g. Returns { fields, stage } where each field has
 *   x, y        the site, mm on the chip
 *   pose        { theta, P, Q } of the stage there
 *   err.raw     where the field landed minus where it should, mm, after aligning on the centre field
 *   err.cal     the same after an affine calibration over all sites (what a camera map would leave)
 *   rot         rotation of the field on the chip relative to the centre field, rad
 *   slope       [gx, gy]: chip surface height across the field, h = gx a + gy b (a, b mm from the field centre)
 *   tiptilt     tilt relative to the centre field, rad
 *   wedge       largest |h| at the field's corners, um
 */
export function exposeAll(g, g0, params, rig) {
  const S = sites(params);
  const c = rig.chip_top_above_ee;
  let warm;
  const poses = S.map((s) => (warm = poseAt(g, g0, commandFor(s.x, s.y), warm)));
  const ic = S.findIndex((s) => s.x === 0 && s.y === 0);
  const QcT = transpose(poses[ic].Q);
  const [hx, hy] = params.litho.field_mm.map((v) => v / 2);
  const landed = poses.map(({ P, Q }) => underAxis(P, Q, c));
  const centreErr = [landed[ic][0] - S[ic].x, landed[ic][1] - S[ic].y];
  const fit = affineFit(S.map((s) => [s.x, s.y]), landed);
  const fields = S.map((s, i) => {
    const rel = matMul(poses[i].Q, QcT);
    const rv = rotationVector(rel);
    const n = [rel[0][2], rel[1][2], rel[2][2]];
    const slope = [-n[0] / n[2], -n[1] / n[2]];
    const corners = [[-hx, -hy], [hx, -hy], [hx, hy], [-hx, hy]].map(([a, b]) => (slope[0] * a + slope[1] * b) * 1e3);
    const u = landed[i];
    const pred = [
      fit.A[0][0] * s.x + fit.A[0][1] * s.y + fit.b[0],
      fit.A[1][0] * s.x + fit.A[1][1] * s.y + fit.b[1],
    ];
    return {
      ...s,
      index: i,
      pose: poses[i],
      err: {
        raw: [u[0] - s.x - centreErr[0], u[1] - s.y - centreErr[1]],
        cal: [u[0] - pred[0], u[1] - pred[1]],
      },
      rot: -rv[2],
      slope,
      tiptilt: Math.hypot(rv[0], rv[1]),
      wedge: Math.max(...corners.map(Math.abs)),
    };
  });
  const len = (v) => Math.hypot(v[0], v[1]);
  return {
    fields,
    centre: ic,
    stage: {
      scale: Math.max(Math.abs(fit.A[0][0] - 1), Math.abs(fit.A[1][1] - 1)),
      tiptilt: Math.max(...fields.map((f) => f.tiptilt)),
      wedge: Math.max(...fields.map((f) => f.wedge)),
      raw: Math.max(...fields.map((f) => len(f.err.raw))),
      cal: Math.max(...fields.map((f) => len(f.err.cal))),
    },
  };
}

/**
 * A stage near the middle of its band: of the first `tries` seeds, the one whose
 * tip/tilt spread over the sites is closest to the band's median in the study.
 */
export function typicalSeed(params, rig, band, tries = 24) {
  const g0 = nominal(params.stage);
  const target = params.study?.[params.bands[band].name]?.tiptilt?.[0];
  if (target === undefined) return 1;
  let best = { seed: 1, d: Infinity };
  for (let seed = 1; seed <= tries; seed++) {
    const { stage } = exposeAll(randomStage(params, band, seed), g0, params, rig);
    const d = Math.abs(stage.tiptilt - target);
    if (d < best.d) best = { seed, d };
  }
  return best.seed;
}
