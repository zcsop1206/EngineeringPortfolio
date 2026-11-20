// Kinematics of the Open Micro-Manipulator v4, ported from the stepper repo's
// stepper/kinematics.py (itself a port of the stage firmware's
// kinematic_model_delta3d.cpp). Same names, same steps, same conventions:
// base frame with the end effector (EE) at the origin at the neutral pose, mm
// and rad; vectors are [x, y, z] arrays and matrices are arrays of rows.
//
//   ik, fk     the firmware's model: each rod pair is one virtual rod, so the
//              EE can only translate. This is what the controller believes.
//   fkFull     six real rods, each with its own length and ball centres; the
//              EE may translate and rotate. Where the stage really goes.
//
// test/stepper-kinematics.test.mjs checks this file against vectors written by
// the Python model (cad/web/export_kinematics.py in the stepper repo).

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => Math.sqrt(dot(a, a));
export const matVec = (M, v) => [dot(M[0], v), dot(M[1], v), dot(M[2], v)];
export const matTVec = (M, v) => [
  M[0][0] * v[0] + M[1][0] * v[1] + M[2][0] * v[2],
  M[0][1] * v[0] + M[1][1] * v[1] + M[2][1] * v[2],
  M[0][2] * v[0] + M[1][2] * v[1] + M[2][2] * v[2],
];
export const matMul = (A, B) =>
  A.map((row) => [0, 1, 2].map((j) => row[0] * B[0][j] + row[1] * B[1][j] + row[2] * B[2][j]));
export const transpose = (A) => [0, 1, 2].map((i) => [A[0][i], A[1][i], A[2][i]]);
export const identity = () => [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

/** Rotation matrix about `axis` (any length) by `angle` rad, Rodrigues' formula. */
export function rot(axis, angle) {
  const k = scale(axis, 1 / norm(axis));
  const K = [[0, -k[2], k[1]], [k[2], 0, -k[0]], [-k[1], k[0], 0]];
  const KK = matMul(K, K);
  const s = Math.sin(angle);
  const c = 1 - Math.cos(angle);
  return [0, 1, 2].map((i) => [0, 1, 2].map((j) => (i === j ? 1 : 0) + s * K[i][j] + c * KK[i][j]));
}

/** Rotation matrix for rotation vector phi (axis * angle). Identity for phi = 0. */
export function rotvec(phi) {
  const a = norm(phi);
  return a < 1e-15 ? identity() : rot(phi, a);
}

/** Small-angle rotation vector of a rotation matrix (the study's _rv). */
export function rotationVector(R) {
  return [(R[2][1] - R[1][2]) / 2, (R[0][2] - R[2][0]) / 2, (R[1][0] - R[0][1]) / 2];
}

const zeros32 = () => [0, 1, 2].map(() => [0, 1].map(() => [0, 0, 0]));

/** HW v4 geometry exactly as the firmware states it (params.stage from params.json). */
export function nominal(S) {
  const off = S.base_offset;
  return {
    L: [0, 1, 2].map(() => [S.rod_length, S.rod_length]),
    r: [S.rotor_radius, S.rotor_radius, S.rotor_radius],
    theta0: [0, 1, 2].map(() => (S.theta_neutral_deg * Math.PI) / 180),
    R: S.actuator_axis_angle.map(([ax, deg]) => rot(ax, (deg * Math.PI) / 180)),
    t: S.actuator_translation.map((t) => add(t, off)),
    e: S.ee_attach.map((e) => [...e]),
    s: S.pair_half_spacing,
    dA: zeros32(),
    dE: zeros32(),
  };
}

/** Deep copy of a geometry. */
export const copyGeometry = (g) => structuredClone(g);

/** (3) rotor axis of each actuator in the base frame = pair offset direction. */
export const axes = (g) => g.R.map((R) => [R[0][2], R[1][2], R[2][2]]);

export const THETA_RANGE = (S) => S.theta_range_deg.map((d) => (d * Math.PI) / 180);

// --- firmware model (virtual rods) -----------------------------------------

/** Ball-pair midpoint on rotor i, base frame. */
export function rotorPoint(g, i, theta) {
  const a = theta - g.theta0[i];
  return add(matVec(g.R[i], [g.r[i] * Math.cos(a), -g.r[i] * Math.sin(a), 0]), g.t[i]);
}

/** Both intersection points of three spheres, or null. */
export function threeSphere(p1, p2, p3, r1, r2, r3) {
  let ex = sub(p2, p1);
  const d = norm(ex);
  ex = scale(ex, 1 / d);
  const i = dot(ex, sub(p3, p1));
  let ey = sub(sub(p3, p1), scale(ex, i));
  ey = scale(ey, 1 / norm(ey));
  const ez = cross(ex, ey);
  const j = dot(ey, sub(p3, p1));
  const x = (r1 ** 2 - r2 ** 2 + d ** 2) / (2 * d);
  const y = (r1 ** 2 - r3 ** 2 + i ** 2 + j ** 2 - 2 * i * x) / (2 * j);
  const z2 = r1 ** 2 - x ** 2 - y ** 2;
  if (z2 < 0) return null;
  const base = add(add(p1, scale(ex, x)), scale(ey, y));
  const z = Math.sqrt(z2);
  return [add(base, scale(ez, z)), sub(base, scale(ez, z))];
}

/** Firmware forward kinematics: joint angles (3) -> EE position (3), or null. */
export function fk(g, theta) {
  const c = [0, 1, 2].map((i) => sub(rotorPoint(g, i, theta[i]), g.e[i]));
  const Lm = g.L.map((l) => (l[0] + l[1]) / 2);
  const sol = threeSphere(c[0], c[1], c[2], Lm[0], Lm[1], Lm[2]);
  if (!sol) return null;
  return sol[0][0] > sol[1][0] ? sol[0] : sol[1];
}

/** Firmware inverse kinematics: EE position (3) -> joint angles (3), or null. */
export function ik(g, P) {
  const th = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    const p = matTVec(g.R[i], sub(add(P, g.e[i]), g.t[i]));
    const L = (g.L[i][0] + g.L[i][1]) / 2;
    const rp2 = L ** 2 - p[2] ** 2;
    if (rp2 < 0) return null;
    const d2 = p[0] ** 2 + p[1] ** 2;
    const r = g.r[i];
    const a = (r ** 2 - rp2 + d2) / (2 * Math.sqrt(d2));
    const h2 = r ** 2 - a ** 2;
    if (h2 < 1e-12) return null;
    const d = Math.sqrt(d2);
    const h = Math.sqrt(h2);
    const c = [(p[0] * a) / d, (p[1] * a) / d];
    const off = [(-p[1] * h) / d, (p[0] * h) / d];
    const qp = [c[0] + off[0], c[1] + off[1]];
    const qm = [c[0] - off[0], c[1] - off[1]];
    const q = qp[0] > qm[0] ? qp : qm;
    th[i] = g.theta0[i] - Math.atan2(q[1], q[0]);
  }
  return th;
}

// --- full six-rod model -----------------------------------------------------

const SIGN = [1, -1];

/** Rotor-side ball centres B[i][k] (base frame) and EE-side ball centres E[i][k] (EE frame). */
export function balls(g, theta) {
  const n = axes(g);
  const B = [];
  const E = [];
  for (let i = 0; i < 3; i++) {
    B.push([]);
    E.push([]);
    for (let k = 0; k < 2; k++) {
      const o = scale(n[i], SIGN[k] * g.s);
      B[i].push(add(add(rotorPoint(g, i, theta[i]), o), g.dA[i][k]));
      E[i].push(add(add(g.e[i], o), g.dE[i][k]));
    }
  }
  return { B, E };
}

/** Solve A x = b (n x n) by Gaussian elimination with partial pivoting. */
function solve(A, b) {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = c + 1; r < n; r++) {
      const f = M[r][c] / M[c][c];
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) {
    let s = M[r][n];
    for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k];
    x[r] = s / M[r][r];
  }
  return x;
}

/**
 * Six-rod forward kinematics: joint angles -> { P, Q }, EE position and rotation
 * matrix. Newton on |P + Q E_ik - B_ik| = L_ik, rotation applied on the left,
 * started from the firmware solution (exact for perfect geometry) unless a
 * previous pose { P0, Q0 } is given to warm-start from.
 */
export function fkFull(g, theta, { P0, Q0, tol = 1e-12, iters = 30 } = {}) {
  const { B, E } = balls(g, theta);
  let P = P0 ? [...P0] : fk(g, theta);
  let Q = Q0 ? Q0.map((r) => [...r]) : identity();
  for (let it = 0; it < iters; it++) {
    const res = [];
    const J = [];
    for (let i = 0; i < 3; i++) {
      for (let k = 0; k < 2; k++) {
        const w = matVec(Q, E[i][k]);
        const v = sub(add(P, w), B[i][k]);
        const nv = norm(v);
        const u = scale(v, 1 / nv);
        res.push(nv - g.L[i][k]);
        J.push([...u, ...cross(w, u)]);
      }
    }
    const step = solve(J, res.map((x) => -x));
    P = add(P, step.slice(0, 3));
    Q = matMul(rotvec(step.slice(3)), Q);
    if (Math.max(...step.map(Math.abs)) < tol) break;
  }
  return { P, Q };
}

/** Rotation angle of Q in rad (0 = no tilt). */
export function tilt(Q) {
  return Math.acos(Math.min(1, Math.max(-1, (Q[0][0] + Q[1][1] + Q[2][2] - 1) / 2)));
}
