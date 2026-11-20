// The stepper sim's JS kinematics against the Python model it was ported from.
// Vectors: cad/web/export_kinematics.py in the stepper repo (inputs and outputs
// of stepper/kinematics.py), copied to test/fixtures/stepper-vectors.json.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { axes, balls, fk, fkFull, ik, nominal, tilt } from '../src/sims/stepper/kinematics.mjs';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const V = read('./fixtures/stepper-vectors.json');
const params = read('../src/sims/stepper/params.json');
const g0 = nominal(params.stage);

// 1 picometre in mm: a thousand times under the nanometre the port must hold.
const TOL_MM = 1e-9;
const TOL_RAD = 1e-12;

function maxDiff(a, b) {
  const fa = [a].flat(Infinity);
  const fb = [b].flat(Infinity);
  assert.equal(fa.length, fb.length);
  return Math.max(...fa.map((x, i) => Math.abs(x - fb[i])));
}

function geometry(c) {
  return { ...structuredClone(g0), L: c.L, r: c.r, theta0: c.theta0, dA: c.dA, dE: c.dE };
}

test('nominal geometry matches the Python build of the firmware constants', () => {
  assert.ok(maxDiff(g0.R, V.nominal.R) < 1e-15);
  assert.ok(maxDiff(g0.t, V.nominal.t) < 1e-12);
  assert.ok(maxDiff(g0.e, V.nominal.e) === 0);
  assert.ok(maxDiff(axes(g0), V.nominal.n) < 1e-15);
  assert.ok(maxDiff(g0.theta0, V.nominal.theta0) < 1e-15);
});

test('ik agrees with Python, including the unreachable point', () => {
  let worst = 0;
  for (const c of V.ik) {
    const th = ik(g0, c.P);
    if (c.theta === null) {
      assert.equal(th, null);
      continue;
    }
    worst = Math.max(worst, maxDiff(th, c.theta));
  }
  assert.ok(worst < TOL_RAD, `ik worst ${worst} rad`);
});

test('firmware fk agrees with Python', () => {
  let worst = 0;
  for (const c of V.fk) worst = Math.max(worst, maxDiff(fk(g0, c.theta), c.P));
  assert.ok(worst < TOL_MM, `fk worst ${worst} mm`);
});

test('ball centres of a perturbed stage agree with Python', () => {
  const { B, E } = balls(geometry(V.balls.geom), V.balls.theta);
  assert.ok(maxDiff(B, V.balls.B) < TOL_MM);
  assert.ok(maxDiff(E, V.balls.E) < TOL_MM);
});

test('six-rod fk agrees with Python to well under a nanometre on stages from all three bands', () => {
  let dP = 0;
  let dQ = 0;
  let dT = 0;
  for (const c of V.fk_full) {
    const { P, Q } = fkFull(geometry(c.geom), c.theta);
    dP = Math.max(dP, maxDiff(P, c.P));
    dQ = Math.max(dQ, maxDiff(Q, c.Q));
    dT = Math.max(dT, Math.abs(tilt(Q) - c.tilt));
  }
  assert.equal(V.fk_full.length, 72);
  assert.ok(dP < TOL_MM, `position worst ${dP} mm`);
  assert.ok(dQ < TOL_RAD, `rotation worst ${dQ}`);
  assert.ok(dT < 1e-9, `tilt worst ${dT} rad`);
  console.log(`six-rod fk vs Python: position ${dP.toExponential(1)} mm, rotation ${dQ.toExponential(1)}, tilt ${dT.toExponential(1)} rad`);
});

test('a warm start reaches the same pose as a cold one', () => {
  const c = V.fk_full[40];
  const g = geometry(c.geom);
  const cold = fkFull(g, c.theta);
  const near = fkFull(g, c.theta.map((t) => t + 0.01));
  const warm = fkFull(g, c.theta, { P0: near.P, Q0: near.Q });
  assert.ok(maxDiff(warm.P, cold.P) < TOL_MM);
  assert.ok(maxDiff(warm.Q, cold.Q) < TOL_RAD);
});
