// The stepper sim's optics, job, error model and chip: checks against physics
// that can be worked out by hand.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fft2 } from '../src/sims/stepper/fft.mjs';
import { Imager, mirrorKernel, OPTICS, R } from '../src/sims/stepper/optics.mjs';
import { allFields, areaGeometry, exposureOrder, homeAngles, homeTime, MACHINE, moveDistance, moveTime, program } from '../src/sims/stepper/job.mjs';
import { budget, drawChip, exposeFields, printedAt, rigidFit, seams } from '../src/sims/stepper/errors.mjs';
import { Chip } from '../src/sims/stepper/litho.mjs';
import { nominal } from '../src/sims/stepper/kinematics.mjs';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const params = read('../src/sims/stepper/params.json');
const rig = read('../src/sims/stepper/rig.json');
const p = OPTICS.pitch;
const g0 = nominal(params.stage);
const geo = areaGeometry(p);

test('2D FFT matches a direct DFT and inverts', () => {
  const nx = 8;
  const ny = 4;
  const re = Float64Array.from({ length: nx * ny }, (_, i) => Math.sin(i * 1.3) + (i % 3));
  const im = new Float64Array(nx * ny);
  const r0 = re.slice();
  fft2(re, im, nx, ny, false);
  for (const [u, v] of [[0, 0], [1, 2], [5, 3]]) {
    let sr = 0;
    let si = 0;
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        const a = -2 * Math.PI * ((u * x) / nx + (v * y) / ny);
        sr += r0[y * nx + x] * Math.cos(a);
        si += r0[y * nx + x] * Math.sin(a);
      }
    }
    assert.ok(Math.abs(re[v * nx + u] - sr) < 1e-9 && Math.abs(im[v * nx + u] - si) < 1e-9);
  }
  fft2(re, im, nx, ny, true);
  assert.ok(Math.max(...re.map((v, i) => Math.abs(v - r0[i]))) < 1e-12);
});

test('one mirror images as a symmetric spot carrying all the light', () => {
  const n = 2 * R + 1;
  const K = mirrorKernel(0, 0);
  assert.ok(Math.abs(K.reduce((a, b) => a + b, 0) - 1) < 1e-12);
  for (const [u, v] of [[1, 0], [3, 2], [7, 5]]) {
    const at = (a, b) => K[(b + R) * n + (a + R)];
    assert.ok(Math.abs(at(u, v) - at(-u, -v)) < 1e-9 && Math.abs(at(u, v) - at(v, u)) < 1e-9);
  }
  // defocus spreads it: the centre gets dimmer
  assert.ok(mirrorKernel(5, 0)[R * n + R] < K[R * n + R]);
});

/** Width (um) above threshold along a row, with linear interpolation at the edges. */
function width(row, thr) {
  let w = 0;
  for (let i = 1; i < row.length; i++) {
    const a = row[i - 1] - thr;
    const b = row[i] - thr;
    if (a >= 0 && b >= 0) w += 1;
    else if (a >= 0 || b >= 0) w += (a >= 0 ? a : b) / Math.abs(a - b);
  }
  return w * p;
}

function lineImage(mirrors, z, smear = 0) {
  const W = 120;
  const H = 40;
  const m = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 60 - Math.floor(mirrors / 2); x < 60 - Math.floor(mirrors / 2) + mirrors; x++) m[y * W + x] = 1;
  const img = new Imager().image(m, W, H, { piston: z, gx: 0, gy: 0 }, smear);
  return Array.from({ length: img.w }, (_, x) => img.data[(20 + R) * img.w + x]);
}

test('an edge falls through half the clear-field dose where it was drawn, and wide lines print true', () => {
  const W = 120;
  const H = 40;
  const m = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < 60; x++) m[y * W + x] = 1;
  const img = new Imager().image(m, W, H, { piston: 0, gx: 0, gy: 0 });
  const row = Array.from({ length: img.w }, (_, x) => img.data[(20 + R) * img.w + x]);
  const at = (x) => row[x + R];
  assert.ok(Math.abs((at(59) + at(60)) / 2 - 0.5) < 0.005, 'symmetric about the edge');
  assert.ok(at(20) > 0.99 && at(100) < 0.01);
  assert.ok(Math.abs(width(lineImage(18, 0), 0.5) - 18 * p) < 0.05, '9.75 um line');
});

test('focus and dose: fine lines thin out of focus and vanish under-dosed; wide lines do not care', () => {
  // the numbers the readout's claims rest on (threshold 0.5 / dose)
  const fine0 = width(lineImage(4, 0), 0.5 / 0.7);
  const fine5 = width(lineImage(4, 5), 0.5 / 0.7);
  assert.ok(fine0 > 1.5 && fine5 < fine0 - 0.3, `2 um line at 70 % dose: ${fine0} in focus, ${fine5} at 5 um`);
  assert.equal(width(lineImage(2, 0), 0.5 / 0.7), 0, '1 um line at 70 % dose prints nothing');
  const wide = [0, 3.3].map((z) => width(lineImage(18, z), 0.5));
  assert.ok(Math.abs(wide[0] - wide[1]) < 0.02, 'a 10 um line keeps its width through the depth of focus');
  // stage jitter during the exposure (smear) blurs the image
  assert.ok(Math.max(...lineImage(2, 0, 0.6)) < Math.max(...lineImage(2, 0, 0)));
});

test('the job: fields in serpentine order, the firmware G-code and its machine time', () => {
  const fields = allFields(geo);
  assert.equal(fields.length, 16);
  assert.ok(Math.abs(geo.fw - 1.04) < 1e-12 && Math.abs(geo.fh - 0.585) < 1e-12);
  const order = exposureOrder(fields, new Set([0, 1, 4, 5]));
  assert.deepEqual(order.map((f) => f.index), [0, 1, 5, 4]);
  // trapezoid: 1 mm at 10 mm/s and 500 mm/s^2 = 0.1 s cruising + 0.02 s of ramps
  assert.ok(Math.abs(moveTime(1) - 0.12) < 1e-12);
  assert.ok(Math.abs(moveTime(0.1) - 2 * Math.sqrt(0.1 / 500)) < 1e-12);
  // the planner's trapezoid covers the move exactly, symmetric in time
  for (const d of [0.05, 1, 19]) {
    const T = moveTime(d);
    assert.ok(Math.abs(moveDistance(d, T) - d) < 1e-12 && Math.abs(moveDistance(d, T / 2) - d / 2) < 1e-9);
  }
  // homing from the neutral 42 deg: down at 1 rad/s, then back off a quarter electrical turn
  const start = [0.733, 0.7, 0.6];
  assert.ok(Math.abs(homeTime(start) - (0.733 + MACHINE.home_back / MACHINE.home_back_speed)) < 1e-12);
  assert.deepEqual(homeAngles(start, 0.7).map((a) => +a.toFixed(3)), [0.033, 0, 0]);
  assert.deepEqual(homeAngles(start, homeTime(start)), start.map(() => MACHINE.home_back));
  const prog = program(order.map((f) => ({ field: f, cmd: [-f.x, -f.y, 0] })), { dose: 1.5, geo, start, homed: [-10.9, -10.9, -10.9] });
  const text = prog.lines.map((l) => l.text);
  assert.ok(text.includes('G28                 ; home every joint'));
  assert.equal(text.filter((t) => /^G0 X-?\d\.\d{3} Y/.test(t)).length, 4, 'one move per field');
  const back = prog.lines.find((l) => l.text.startsWith('G0 X0 Y0 Z0'));
  assert.deepEqual(back.from, [-10.9, -10.9, -10.9], 'after homing the stage comes back to the centre');
  assert.equal(text.filter((t) => t.startsWith('G4 P3000')).length, 4, '150 % of a 2 s exposure');
  assert.ok(text.at(-1).startsWith('M18'));
});

test('errors: none on, a perfect print; each source leaves its own mark at the seams', () => {
  const fields = exposureOrder(allFields(geo), new Set([...Array(16).keys()]));
  const run = (on, calibrated) => {
    const ex = exposeFields(drawChip(params, 1, 11, on), g0, params, rig, geo, fields, { calibrated });
    const s = seams(ex, geo);
    return { place: Math.max(...ex.map((e) => Math.hypot(...e.error_um))), gap: Math.max(...s.map((x) => Math.abs(x.gap))) };
  };
  const none = run({}, false);
  assert.ok(none.place < 1e-6 && none.gap < 1e-6);
  const stage = run({ stage: true }, false);
  const stageCal = run({ stage: true }, true);
  assert.ok(stage.gap > 1 && stageCal.gap < stage.gap / 5, `stage seams ${stage.gap} -> ${stageCal.gap} um calibrated`);
  const proj = run({ projector: true }, false);
  const projCal = run({ projector: true }, true);
  assert.ok(proj.place < 1e-6, 'the projector moves no field centre');
  assert.ok(proj.gap > 0.5 && projCal.gap < proj.gap / 5, `projector seams ${proj.gap} -> ${projCal.gap} um calibrated`);
  // a rigid fit recovers a pure rotation and shift
  const t = [[0, 0], [1, 0], [0, 1], [2, 3]];
  const phi = 0.01;
  const l = t.map(([x, y]) => [Math.cos(phi) * x - Math.sin(phi) * y + 5, Math.sin(phi) * x + Math.cos(phi) * y - 2]);
  const fit = rigidFit(t, l);
  assert.ok(Math.abs(fit.phi - phi) < 1e-12 && Math.abs(fit.t[0] - 5) < 1e-12 && Math.abs(fit.t[1] + 2) < 1e-12);
});

test('the error budget: with one source on, that source is the whole error at the field corners', () => {
  const fields = exposureOrder(allFields(geo), new Set([...Array(16).keys()]));
  const hw = (geo.fw * 1e3) / 2;
  const hh = (geo.fh * 1e3) / 2;
  const worst = (on, calibrated = false) =>
    exposeFields(drawChip(params, 1, 11, on), g0, params, rig, geo, fields, { calibrated }).map((e) => budget(e, hw, hh));
  for (const [src, key] of [['stage', 'stage'], ['servo', 'servo'], ['projector', 'projector']]) {
    for (const b of worst({ [src]: true })) {
      const others = ['stage', 'servo', 'projector'].filter((k) => k !== key).map((k) => b.place[k]);
      assert.ok(Math.max(...others) < 1e-6, `${src}: other sources zero`);
      assert.ok(Math.abs(b.place[key] - b.place.total) < 0.02 * b.place.total + 1e-3, `${src}: ${b.place[key]} vs ${b.place.total} um`);
    }
  }
  for (const b of worst({ focus: true })) assert.ok(Math.abs(b.focus.focus - b.focus.total) < 1e-9 && b.focus.stage === 0);
  for (const b of worst({ stage: true })) assert.ok(Math.abs(b.focus.stage - b.focus.total) < 1e-9 && b.focus.focus === 0);
  // all on: the shares cannot add to less than the whole
  for (const b of worst({ stage: true, servo: true, projector: true, focus: true })) {
    assert.ok(b.place.stage + b.place.servo + b.place.projector >= b.place.total * 0.98);
    assert.ok(b.focus.stage + b.focus.focus >= b.focus.total - 1e-9);
  }
});

test('the chip: a bar across a seam prints whole with a perfect stage, and opens a gap when the projector shrinks the image', () => {
  const W = 1920;
  const H = 1080;
  const fields = allFields(geo);
  const pair = [fields[0], fields[1]];
  const yc = pair[0].y * 1000;
  const xa = pair[0].x * 1000;
  const xb = pair[1].x * 1000;
  const mask = (f) => {
    const m = new Uint8Array(W * H);
    for (let j = 0; j < H; j++) {
      const y = f.y * 1000 + (H / 2 - j - 0.5) * p;
      if (Math.abs(y - yc) >= 10) continue;
      for (let i = 0; i < W; i++) {
        const x = f.x * 1000 + (i + 0.5 - W / 2) * p;
        if (x >= xa && x <= xb) m[j * W + i] = 1;
      }
    }
    return m;
  };
  const imager = new Imager();
  const imgs = pair.map((f) => imager.image(mask(f), W, H, { piston: 0, gx: 0, gy: 0 }, 0));
  const print = (chipErr) => {
    const ex = exposeFields(chipErr, g0, params, rig, geo, pair);
    const c = new Chip(geo, p);
    pair.forEach((f) => c.setDesign(f.col, f.row, mask(f)));
    ex.forEach((e, k) => c.expose(e, imgs[k], 1));
    return { stats: c.stats(1, ex, printedAt), gap: seams(ex, geo)[0].gap };
  };
  const perfect = print(drawChip(params, 1, 3, {}));
  assert.equal(perfect.stats.printed[1], perfect.stats.designed[1]);
  assert.equal(perfect.stats.missing, 0);
  assert.equal(perfect.stats.extra, 0);
  // find a chip draw whose projector shrinks the image by more than 0.3 %
  let seed = 1;
  let chipErr;
  do chipErr = drawChip(params, 1, seed++, { projector: true });
  while (chipErr.proj.mag > -0.003);
  const shrunk = print(chipErr);
  // in each field's own frame the bar printed whole; on the chip a strip of it is missing
  assert.ok(shrunk.stats.designed[1] - shrunk.stats.printed[1] <= 5, 'all but a corner sample or two');
  const missing = shrunk.stats.missing;
  // the unexposed strip is the gap wide and the 20 um bar tall, in samples
  const expected = (shrunk.gap * 20) / (p * p);
  assert.ok(shrunk.gap > 3, `gap ${shrunk.gap} um`);
  assert.ok(Math.abs(missing - expected) / expected < 0.35, `missing ${missing} samples, expected about ${expected}`);
});
