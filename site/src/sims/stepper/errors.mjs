// Every error the simulated stepper makes, drawn once per chip from labelled
// sources, then applied field by field.
//
// For each exposed field this gives where its image lands on the chip, how it
// is rotated and scaled there, and how the chip surface sits against focus
// across it. The stage part comes from the six-rod model (kinematics.mjs) at
// the chip's top surface, so tilt adds its Abbe error. Comparison with the
// design uses the print as a whole, aligned by the best rigid fit (the chip
// is placed by hand, so its absolute position and angle do not matter).
import { matMul, nominal, rotationVector, transpose } from './kinematics.mjs';
import { affineFit, commandFor, makeRng, poseAt, randomStage, underAxis } from './model.mjs';
import { allFields } from './job.mjs';

export const SOURCES = {
  stage: {
    label: 'Stage geometry',
    kind: 'modelled',
    note: 'rod lengths, rotor radii, home angles and ball seats drawn from the print-quality bands, which are assumptions until the test prints measure them',
  },
  servo: {
    label: 'Servo noise',
    kind: 'measured',
    place_um: 0.4, // sd per axis of where a move ends
    smear_um: 0.3, // rms motion during an exposure
    note: "CMU's build of the same stage: 0.4 um repeatability on 250 um moves, 0.30 um of apparent motion on moves of zero length",
  },
  focus: {
    label: 'Focus budget',
    kind: 'assumed',
    af_um: 0.5,
    resist_um: 1.0,
    drift_um: 0.5,
    level_um: 0.5,
    note: "the post's focus budget (autofocus, chip bow and resist, drift, levelling), each plus-or-minus taken as two standard deviations",
  },
  projector: {
    label: 'Projector alignment',
    kind: 'assumed',
    rot_mrad: 2, // sd of the image's rotation against the stage axes, hand aligned
    mag_pct: 0.5, // sd of the objective's magnification error
    cal_rot_mrad: 0.05, // what is left after measuring it on the camera
    cal_mag_pct: 0.02,
    note: 'a hand-aligned projector and the objective magnification tolerance; calibration measures both on the camera and corrects the image',
  },
};

/** One chip's draw of every source that is on (on = { stage, servo, focus, projector } booleans). */
export function drawChip(params, band, seed, on) {
  const rng = makeRng((seed ^ 0x5bd1e995) >>> 0);
  const P = SOURCES.projector;
  const halfDiag = Math.hypot(...params.litho.field_mm) / 2; // mm
  const levelSd = (SOURCES.focus.level_um / 2) * 1e-3 / halfDiag; // rad per axis: corner at +/- level_um, 2 sd
  const proj = { rot: rng.normal(P.rot_mrad * 1e-3), mag: rng.normal(P.mag_pct / 100) };
  const projCal = { rot: rng.normal(P.cal_rot_mrad * 1e-3), mag: rng.normal(P.cal_mag_pct / 100) };
  const level = [rng.normal(levelSd), rng.normal(levelSd)];
  return {
    band,
    seed,
    on: { ...on },
    g: on.stage ? randomStage(params, band, seed) : nominal(params.stage),
    proj: on.projector ? proj : { rot: 0, mag: 0 },
    projCal: on.projector ? projCal : { rot: 0, mag: 0 },
    level: on.focus ? level : [0, 0],
    fieldSeed: Math.floor(rng.uniform() * 2 ** 31),
  };
}

function invertAffine({ A, b }, [x, y]) {
  const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
  const u = x - b[0];
  const v = y - b[1];
  return [(A[1][1] * u - A[0][1] * v) / det, (A[0][0] * v - A[1][0] * u) / det];
}

/** Best rigid fit landed ~ R(phi) target + t over paired points (mm): { phi, t }. */
export function rigidFit(targets, landed) {
  const n = targets.length;
  const mt = [0, 0];
  const ml = [0, 0];
  targets.forEach((p, i) => {
    mt[0] += p[0] / n; mt[1] += p[1] / n;
    ml[0] += landed[i][0] / n; ml[1] += landed[i][1] / n;
  });
  let s = 0;
  let c = 0;
  targets.forEach((p, i) => {
    const a = [p[0] - mt[0], p[1] - mt[1]];
    const b = [landed[i][0] - ml[0], landed[i][1] - ml[1]];
    s += a[0] * b[1] - a[1] * b[0];
    c += a[0] * b[0] + a[1] * b[1];
  });
  const phi = n > 1 && (s || c) ? Math.atan2(s, c) : 0;
  const cs = Math.cos(phi);
  const sn = Math.sin(phi);
  return { phi, t: [ml[0] - (cs * mt[0] - sn * mt[1]), ml[1] - (sn * mt[0] + cs * mt[1])] };
}

/**
 * Expose the given fields (stage order) on a chip. Returns per field:
 *   field, cmd (mm, what the G-code commands), pose
 *   centre: where the field's centre lands, mm, in the design's frame (after the rigid fit)
 *   rot, mag: net rotation (rad) and magnification error of the field's image against the design
 *   pre: { rot, mag } the image is pre-warped by on the projector (calibration), zero otherwise
 *   focus: { piston, gx, gy } focus error across the field (um, and um per um)
 *   smear: rms jitter during the exposure, um
 *   parts: each source's share, for the readout
 */
export function exposeFields(chip, g0, params, rig, geo, fields, { calibrated = false } = {}) {
  const { g, on } = chip;
  const c = rig.chip_top_above_ee;
  const S = SOURCES;
  const ref = poseAt(g, g0, commandFor(0, 0));
  const refT = transpose(ref.Q);
  let cal = null;
  if (calibrated && on.stage) {
    // the camera measures where a grid of marks lands, one per field of the area, and fits an affine map
    const grid = allFields(geo);
    const landed = grid.map((f) => {
      const { P, Q } = poseAt(g, g0, commandFor(f.x, f.y));
      return underAxis(P, Q, c);
    });
    cal = affineFit(grid.map((f) => [f.x, f.y]), landed);
  }
  // net projector error left on the chip; when calibrated the image is pre-warped by the measured part
  const proj = calibrated ? chip.projCal : chip.proj;
  const pre = calibrated && on.projector
    ? { rot: chip.proj.rot - chip.projCal.rot, mag: (1 + chip.proj.mag) / (1 + chip.projCal.mag) - 1 }
    : { rot: 0, mag: 0 };
  let warm;
  const raw = fields.map((f) => {
    const rng = makeRng((chip.fieldSeed + 7919 * (f.index + 1)) >>> 0);
    const aim = cal ? invertAffine(cal, [f.x, f.y]) : [f.x, f.y];
    const cmd = commandFor(aim[0], aim[1]);
    const pose = (warm = poseAt(g, g0, cmd, warm));
    const u = underAxis(pose.P, pose.Q, c);
    const servo = on.servo ? [rng.normal(S.servo.place_um), rng.normal(S.servo.place_um)] : [0, 0];
    const rel = matMul(pose.Q, refT);
    const rv = rotationVector(rel);
    const n = [rel[0][2], rel[1][2], rel[2][2]];
    const tilt = [-n[0] / n[2], -n[1] / n[2]];
    const af = on.focus ? rng.normal(S.focus.af_um / 2) : 0;
    const resist = on.focus ? rng.normal(S.focus.resist_um / 2) : 0;
    const drift = on.focus ? rng.normal(S.focus.drift_um / 2) : 0;
    return {
      field: f,
      cmd,
      pose,
      landedRaw: [u[0] + servo[0] * 1e-3, u[1] + servo[1] * 1e-3],
      spin: -rv[2],
      focus: { piston: af + resist + drift, gx: tilt[0] + chip.level[0], gy: tilt[1] + chip.level[1] },
      smear: on.servo ? S.servo.smear_um : 0,
      parts: {
        stage_um: [(u[0] - f.x) * 1e3, (u[1] - f.y) * 1e3],
        servo_um: servo,
        stage_tilt: tilt,
        level: chip.level,
        af_um: af,
        resist_um: resist,
        drift_um: drift,
      },
    };
  });
  // align the print as a whole on the design: the best rigid fit of the field
  // centres, applied to every field's position and turn alike
  const nominalAt = raw.map((r) => [r.field.x, r.field.y]);
  const align = (fit, p) => {
    const cs = Math.cos(-fit.phi);
    const sn = Math.sin(-fit.phi);
    const d = [p[0] - fit.t[0], p[1] - fit.t[1]];
    return [cs * d[0] - sn * d[1], sn * d[0] + cs * d[1]];
  };
  const fit = rigidFit(nominalAt, raw.map((r) => r.landedRaw));
  // each source's share: what it alone would leave once the print is aligned (the
  // shares add up to the whole to first order, the angles being microradians)
  const share = (key) => {
    const moved = raw.map((r) => [r.field.x + r.parts[key][0] * 1e-3, r.field.y + r.parts[key][1] * 1e-3]);
    const f = rigidFit(nominalAt, moved);
    return { phi: f.phi, um: moved.map((p, i) => align(f, p).map((v, k) => (v - nominalAt[i][k]) * 1e3)) };
  };
  const stage = share('stage_um');
  const servo = share('servo_um');
  return raw.map((r, i) => {
    const centre = align(fit, r.landedRaw);
    return {
      ...r,
      centre,
      rot: proj.rot + r.spin - fit.phi,
      mag: proj.mag,
      pre,
      error_um: [(centre[0] - r.field.x) * 1e3, (centre[1] - r.field.y) * 1e3],
      parts: {
        ...r.parts,
        stage_um: stage.um[i],
        servo_um: servo.um[i],
        spin_mrad: (r.spin - stage.phi) * 1e3, // the stage's turn of this field, against the print
        servo_spin_mrad: -servo.phi * 1e3,
        proj_rot_mrad: proj.rot * 1e3,
        proj_mag_ppm: proj.mag * 1e6,
      },
    };
  });
}

/**
 * Each source's share of one field's error at its corners, um: placement in
 * the chip plane (stage geometry: where the stage puts the field and how it
 * turns it; servo noise; projector: the image's turn and size) and height
 * against focus (stage geometry: the chip's tilt; focus budget: autofocus,
 * resist, drift and levelling). Each at the corner where that kind of error is
 * worst; total is the field as printed there. hw, hh: half the field, um.
 */
export function budget(e, hw, hh) {
  const p = e.parts;
  const spin = p.spin_mrad * 1e-3;
  const sspin = p.servo_spin_mrad * 1e-3;
  const rot = p.proj_rot_mrad * 1e-3;
  const mag = p.proj_mag_ppm * 1e-6;
  const corners = [[-hw, hh], [hw, hh], [hw, -hh], [-hw, -hh]];
  const place = corners.map(([a, b]) => {
    const q = printedAt(e, a, b);
    return {
      corner: [a, b],
      stage: Math.hypot(p.stage_um[0] - spin * b, p.stage_um[1] + spin * a),
      servo: Math.hypot(p.servo_um[0] - sspin * b, p.servo_um[1] + sspin * a),
      projector: Math.hypot(mag * a - rot * b, mag * b + rot * a),
      total: Math.hypot(q[0] - (e.field.x * 1e3 + a), q[1] - (e.field.y * 1e3 + b)),
    };
  });
  const focus = corners.map(([a, b]) => ({
    corner: [a, b],
    stage: Math.abs(p.stage_tilt[0] * a + p.stage_tilt[1] * b),
    focus: Math.abs(p.af_um + p.resist_um + p.drift_um + p.level[0] * a + p.level[1] * b),
    total: Math.abs(e.focus.piston + e.focus.gx * a + e.focus.gy * b),
  }));
  const worst = (list) => list.reduce((m, x) => (x.total > m.total ? x : m));
  return { place: worst(place), focus: worst(focus) };
}

/** Map a point (a, b) in um from a field's nominal centre, as designed, to where it prints, um in the design frame. */
export function printedAt(e, a, b) {
  const k = 1 + e.mag;
  const cs = Math.cos(e.rot);
  const sn = Math.sin(e.rot);
  return [e.centre[0] * 1e3 + k * (cs * a - sn * b), e.centre[1] * 1e3 + k * (sn * a + cs * b)];
}

/**
 * Seams between neighbouring exposed fields: gap (um, positive = an unexposed
 * strip, negative = double exposure) across the seam and shear along it, at the
 * seam's middle.
 */
export function seams(exposed, geo) {
  const at = new Map(exposed.map((e) => [`${e.field.col},${e.field.row}`, e]));
  const hw = (geo.fw * 1e3) / 2;
  const hh = (geo.fh * 1e3) / 2;
  const out = [];
  for (const e of exposed) {
    const { col, row } = e.field;
    const right = at.get(`${col + 1},${row}`);
    if (right) {
      const a = printedAt(e, hw, 0);
      const b = printedAt(right, -hw, 0);
      out.push({ a: e, b: right, dir: 'x', gap: b[0] - a[0], shear: b[1] - a[1], at: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] });
    }
    const below = at.get(`${col},${row + 1}`);
    if (below) {
      const a = printedAt(e, 0, -hh);
      const b = printedAt(below, 0, hh);
      out.push({ a: e, b: below, dir: 'y', gap: a[1] - b[1], shear: b[0] - a[0], at: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] });
    }
  }
  return out;
}
