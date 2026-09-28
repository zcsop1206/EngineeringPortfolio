import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isInkSvg, stripInkSvg } from '../../src/ink/strip.mjs';
import { inkTransform } from '../../src/ink/index.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(here, 'fixture', 'sample');
const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.svg')).sort();

// The removal done the naive way, as a reference for the bytes that must stay.
const naive = text => text.replace(/<metadata>[\s\S]*?<\/metadata>\n/, '');

test('the fixture has six pages', () => {
  assert.equal(pages.length, 6);
});

for (const name of pages) {
  test(`strips ${name}`, () => {
    const original = fs.readFileSync(path.join(pagesDir, name), 'utf8');
    assert.ok(isInkSvg(original));
    const stripped = stripInkSvg(original);
    assert.ok(!stripped.includes('<metadata'), 'no <metadata> left');
    assert.ok(!stripped.includes('notebook-ink/1'), 'no stroke data left');
    assert.ok(stripped.includes('id="template"'), 'template layer kept');
    assert.ok(stripped.includes('<style>'), 'style kept');
    assert.equal(stripped, naive(original), 'everything outside <metadata> is byte-identical');
    assert.ok(!/\n\s*\n/.test(stripped), 'no blank line left behind');
    assert.ok(!isInkSvg(stripped));
    assert.equal(stripInkSvg(stripped), stripped, 'stripping twice changes nothing');

    const before = Buffer.byteLength(original), after = Buffer.byteLength(stripped);
    const pct = ((1 - after / before) * 100).toFixed(1);
    console.log(`${name}: ${before} -> ${after} bytes (${pct}% smaller)`);
  });
}

test('keeps CRLF line ends outside the removed element', () => {
  const original = fs.readFileSync(path.join(pagesDir, 'p-88153a.svg'), 'utf8').replace(/\n/g, '\r\n');
  const stripped = stripInkSvg(original);
  assert.equal(stripped, original.replace(/<metadata>[\s\S]*?<\/metadata>\r\n/, ''));
});

test('a non-ink SVG is returned unchanged', () => {
  const plain = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">\n' +
    '<metadata>some other tool</metadata>\n<rect width="10" height="10"/>\n</svg>\n';
  assert.equal(isInkSvg(plain), false);
  assert.equal(stripInkSvg(plain), plain);
});

test('inkTransform strips page SVGs and passes other files through', async () => {
  const t = inkTransform();
  assert.equal(t.match('projects/x/log/e/p-8c5afe.svg'), true);
  assert.equal(t.match('projects/x/photo.png'), false);
  const original = fs.readFileSync(path.join(pagesDir, 'p-e6b13d.svg'));
  const out = await t.apply(original, 'projects/x/log/sample/p-e6b13d.svg');
  assert.ok(Buffer.isBuffer(out));
  assert.equal(out.toString('utf8'), naive(original.toString('utf8')));
  const plain = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>');
  assert.equal(await t.apply(plain, 'icon.svg'), plain);
});
