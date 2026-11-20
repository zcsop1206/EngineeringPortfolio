// The <!-- <name>-sim --> marker swap and the stepper sim's exposure model.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import rehypeSims from '../src/build/rehype-sims.mjs';
import { markup } from '../src/sims/stepper/markup.mjs';
import { nominal } from '../src/sims/stepper/kinematics.mjs';
import { exposeAll, randomStage, sites, typicalSeed } from '../src/sims/stepper/model.mjs';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const params = read('../src/sims/stepper/params.json');
const rig = read('../src/sims/stepper/rig.json');

test('the stepper-sim marker becomes the sim markup; other comments stay', () => {
  const tree = {
    type: 'root',
    children: [
      { type: 'raw', value: '<!-- stepper-sim -->' },
      { type: 'raw', value: '<!-- nothing-sim -->' },
      { type: 'raw', value: '<!-- a note -->' },
      { type: 'element', tagName: 'p', children: [{ type: 'raw', value: ' <!--stepper-sim--> ' }] },
    ],
  };
  rehypeSims()(tree);
  assert.equal(tree.children[0].value, markup);
  assert.equal(tree.children[1].value, '<!-- nothing-sim -->');
  assert.equal(tree.children[2].value, '<!-- a note -->');
  assert.equal(tree.children[3].children[0].value, markup);
});

test('the sim markup reserves its boxes and is not a figure for the visuals page', () => {
  assert.match(markup, /data-sim="stepper"/);
  assert.match(markup, /data-pagefind-ignore/);
  // rehype-figures collects raw blocks holding svg, video, img or iframe
  assert.doesNotMatch(markup, /<(svg|video|img|iframe)\b/);
  for (const box of ['sim-pad', 'sim-stage', 'sim-chip', 'sim-field']) assert.match(markup, new RegExp(`class="sim-box ${box}"`));
});

test('the die grid is 5 x 5 at 2.5 mm, visited row by row, back and forth', () => {
  const S = sites(params);
  assert.equal(S.length, 25);
  assert.deepEqual([S[0].x, S[0].y], [-5, 5]);
  assert.deepEqual([S[5].x, S[5].y], [5, 2.5]);
  assert.deepEqual([S[24].x, S[24].y], [5, -5]);
});

test('a perfect stage exposes every field where it was meant to land, flat', () => {
  const g0 = nominal(params.stage);
  const { stage, fields } = exposeAll(g0, g0, params, rig);
  assert.ok(stage.raw < 1e-9 && stage.cal < 1e-9, 'placement');
  assert.ok(stage.wedge < 1e-9 && stage.tiptilt < 1e-12, 'tilt');
  assert.ok(Math.abs(stage.scale) < 1e-12, 'scale');
  assert.equal(fields.length, 25);
});

test('a built stage: aligned on the centre field, and a typical stage sits near its band median', () => {
  const g0 = nominal(params.stage);
  const { fields, centre, stage } = exposeAll(randomStage(params, 1, 7), g0, params, rig);
  assert.deepEqual(fields[centre].err.raw.map((v) => Math.abs(v) < 1e-12), [true, true]);
  assert.ok(fields[centre].tiptilt < 1e-12);
  assert.ok(stage.cal < stage.raw, 'calibration removes the scale error');
  for (const band of [0, 1, 2]) {
    const seed = typicalSeed(params, rig, band);
    const tt = exposeAll(randomStage(params, band, seed), g0, params, rig).stage.tiptilt;
    const median = params.study[params.bands[band].name].tiptilt[0];
    assert.ok(Math.abs(tt - median) / median < 0.2, `${params.bands[band].name}: ${tt} vs ${median}`);
  }
});
