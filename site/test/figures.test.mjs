import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeFigureClass from '../src/build/rehype-figure-class.mjs';
import rehypeFigures, { writeupSlug } from '../src/build/rehype-figures.mjs';

const contentDir = path.resolve('content');
const base = '/EngineeringPortfolio';

/** Run the markdown through the same stages Astro does before rehype-raw. */
async function figures(md, file = path.join(contentDir, 'projects', 'demo', 'index.md')) {
  const vfile = { value: md, path: file, data: {} };
  const out = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeFigureClass)
    .use(rehypeFigures, { contentDir, base })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(vfile);
  return { figures: out.data.astro?.frontmatter?.figures ?? [], html: String(out) };
}

test('writeupSlug accepts projects/<slug>/index.md only', () => {
  assert.equal(writeupSlug(contentDir, path.join(contentDir, 'projects', 'cact', 'index.md')), 'cact');
  assert.equal(writeupSlug(contentDir, path.join(contentDir, 'projects', 'cact', 'log', '2026-01-01.md')), undefined);
  assert.equal(writeupSlug(contentDir, undefined), undefined);
});

test('an image paragraph with a Figure caption, under its h2, with the asset URL', async () => {
  const { figures: f, html } = await figures(
    '# T\n\nIntro.\n\n## One\n\n![A block](./block.jpeg)\n\n*Figure 1. The block, with a [link](x).*\n\n## Two\n\n![B](b.png)\n\nText.\n',
  );
  assert.equal(f.length, 2);
  assert.equal(f[0].id, 'fig-1');
  assert.equal(f[0].section, 0);
  assert.equal(f[0].caption, 'Figure 1. The block, with a link.');
  assert.match(f[0].captionHtml, /<a href="x">link<\/a>/);
  assert.match(f[0].html, /src="\/EngineeringPortfolio\/projects\/demo\/block\.jpeg"/);
  assert.match(f[0].html, /loading="lazy"/);
  assert.equal(f[1].section, 1);
  assert.equal(f[1].caption, 'B', 'alt text stands in for a missing caption');
  assert.equal(f[1].captionHtml, undefined);
  // The writeup keeps its relative src (Astro's image pipeline needs it) and gains the anchor.
  assert.match(html, /<p class="figure" id="fig-1"><img src="\.\/block\.jpeg"/);
});

test('raw blocks: an inline SVG, a <video> paragraph, a <div> wrapper, and a widget with its script', async () => {
  const md = [
    '## S',
    '<svg viewBox="0 0 10 10" role="img" aria-label="Two graphs" style="display:block">',
    '<rect x="0" y="0" width="1" height="1"/>',
    '</svg>',
    '',
    '*Figure 2. Two graphs.*',
    '',
    '<video controls src="/EngineeringPortfolio/projects/demo/run.mp4" aria-label="The run"></video>',
    '',
    '<div style="max-width:640px">',
    '<video controls src="/EngineeringPortfolio/projects/demo/orbit.mp4" aria-label="Orbit"></video>',
    '</div>',
    '',
    'Prose with <code>inline</code> html is not a figure.',
    '',
    '<div id="sb-widget" style="margin:0">',
    '<svg viewBox="0 0 2 2" role="group" aria-label="Grid"><rect/></svg>',
    '</div>',
    '',
    '<script>',
    'var x = 1;',
    '</script>',
    '',
    '*Click a cell.*',
    '',
  ].join('\n');
  const { figures: f, html } = await figures(md);
  assert.deepEqual(
    f.map((x) => [x.id, x.caption]),
    [
      ['fig-1', 'Figure 2. Two graphs.'],
      ['fig-2', 'The run'],
      ['fig-3', 'Orbit'],
      ['sb-widget', 'Click a cell.'],
    ],
  );
  assert.match(f[0].html, /^<svg id="fig-1" viewBox="0 0 10 10" role="img"/);
  assert.match(f[2].html, /^<div id="fig-3" style="max-width:640px">/);
  assert.match(f[3].html, /<\/div>\n<script>\nvar x = 1;\n<\/script>$/);
  assert.equal(f.every((x) => x.section === 0), true);
  // The writeup carries the same ids.
  assert.match(html, /<svg id="fig-1" viewBox="0 0 10 10"/);
  assert.match(html, /<p id="fig-2"><video controls/);
  assert.match(html, /<div id="fig-3" style="max-width:640px">/);
});

test('a paragraph that mixes an image with text is not a figure, and log entries are skipped', async () => {
  const mixed = await figures('Shown below:\n![A](a.png)\n\n![B](b.png) ![C](c.png)\nCaption-like text.\n');
  assert.equal(mixed.figures.length, 0);
  const entry = await figures('![A](a.png)\n', path.join(contentDir, 'projects', 'demo', 'log', '2026-01-01.md'));
  assert.equal(entry.figures.length, 0);
});
