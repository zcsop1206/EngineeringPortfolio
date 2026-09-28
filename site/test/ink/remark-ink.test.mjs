import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import remarkInk from '../../src/ink/remark-ink.mjs';
import { firstInkPage } from '../../src/ink/index.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
// The fixture stands in for content/: sample.md sits at the top of contentDir.
const contentDir = path.join(here, 'fixture');
const mdPath = path.join(contentDir, 'sample.md');
const BASE = '/EngineeringPortfolio';

const run = (tree, file, opts = { contentDir, base: BASE }) => {
  remarkInk(opts)()(tree, file);
  return tree;
};
const fileFor = (frontmatter, p = mdPath) => ({ path: p, history: [p], data: { astro: { frontmatter } } });
const image = url => ({ type: 'image', url, alt: '', title: null });
const para = (...children) => ({ type: 'paragraph', children });
const heading = text => ({ type: 'heading', depth: 1, children: [{ type: 'text', value: text }] });
const attrs = html => Object.fromEntries([...html.matchAll(/(\w+)="([^"]*)"/g)].map(m => [m[1], m[2]]));

function sampleTree() {
  return {
    type: 'root',
    children: [
      heading('Sample ink note'),
      para({ type: 'text', value: 'Some text.' }),
      para(image('sample/p-8c5afe.svg')),
      para(image('./sample/p-e6b13d.svg')),
      para(image('sample/p-34ed86.svg')),
      para(image('other/p-5b002e.svg')),
      para(image('photo.png')),
    ],
  };
}

test('replaces page embeds with img tags', () => {
  const tree = run(sampleTree(), fileFor({ ink: 1, paper: 'letter', template: 'blank' }));
  const nodes = tree.children.slice(2, 5).map(p => p.children[0]);
  assert.deepEqual(nodes.map(n => n.type), ['html', 'html', 'html']);
  const a = nodes.map(n => attrs(n.value));
  assert.equal(a[0].class, 'ink-page');
  assert.equal(a[0].src, '/EngineeringPortfolio/sample/p-8c5afe.svg');
  assert.equal(a[1].src, '/EngineeringPortfolio/sample/p-e6b13d.svg');
  assert.equal(a[0].width, '816');
  assert.equal(a[0].height, '1056');
  assert.equal(a[0].alt, 'Handwritten page 1 of 3: Sample ink note');
  assert.equal(a[2].alt, 'Handwritten page 3 of 3: Sample ink note');
  assert.deepEqual(a.map(x => x.loading), ['eager', 'lazy', 'lazy']);
  assert.deepEqual(a.map(x => x.decoding), ['async', 'async', 'async']);
  assert.ok(nodes[0].value.startsWith('<img ') && nodes[0].value.endsWith('>'));
  // Not this note's pages, or not pages at all: untouched.
  assert.equal(tree.children[5].children[0].type, 'image');
  assert.equal(tree.children[6].children[0].type, 'image');
});

test('the title comes from frontmatter, then the first heading, then the stem', () => {
  const alt = (fm, tree) => attrs(run(tree, fileFor(fm)).children.find(p => p.type === 'paragraph' && p.children[0].type === 'html').children[0].value).alt;
  assert.equal(alt({ ink: 1, title: 'Bench notes & "fixes"' }, sampleTree()), 'Handwritten page 1 of 3: Bench notes &amp; &quot;fixes&quot;');
  const noHeading = sampleTree();
  noHeading.children.shift();
  assert.equal(alt({ ink: 1 }, noHeading), 'Handwritten page 1 of 3: sample');
});

test('the src is relative to contentDir, each segment URL-encoded, and base may end in a slash', () => {
  const tree = run({ type: 'root', children: [para(image('sample/p-8c5afe.svg'))] }, fileFor({ ink: 1 }),
    { contentDir: path.dirname(here), base: '/EngineeringPortfolio/' });
  assert.equal(attrs(tree.children[0].children[0].value).src, '/EngineeringPortfolio/ink/fixture/sample/p-8c5afe.svg');
});

test('percent-encoded and file URL paths work', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'remark-ink-'));
  try {
    fs.mkdirSync(path.join(dir, 'log', 'my note'), { recursive: true });
    fs.copyFileSync(path.join(contentDir, 'sample', 'p-88153a.svg'), path.join(dir, 'log', 'my note', 'p-88153a.svg'));
    const md = path.join(dir, 'log', 'my note.md');
    const file = { path: pathToFileURL(md).href, data: { astro: { frontmatter: { ink: '1' } } } };
    const tree = run({ type: 'root', children: [para(image('my%20note/p-88153a.svg'))] }, file, { contentDir: dir, base: BASE });
    assert.equal(attrs(tree.children[0].children[0].value).src, '/EngineeringPortfolio/log/my%20note/p-88153a.svg');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a file without ink frontmatter is untouched', () => {
  for (const fm of [{}, { ink: 0 }, { ink: false }, { title: 'x' }, undefined]) {
    const tree = sampleTree();
    const before = JSON.stringify(tree);
    run(tree, fileFor(fm));
    assert.equal(JSON.stringify(tree), before);
  }
  const tree = sampleTree();
  const before = JSON.stringify(tree);
  run(tree, { path: mdPath, data: {} });
  assert.equal(JSON.stringify(tree), before);
});

test('a missing page leaves the node and warns with its path', () => {
  const warnings = [];
  const warn = console.warn;
  console.warn = msg => warnings.push(msg);
  try {
    const tree = run({ type: 'root', children: [para(image('sample/p-8c5afe.svg')), para(image('sample/p-000000.svg'))] },
      fileFor({ ink: 1 }));
    assert.equal(tree.children[0].children[0].type, 'html');
    assert.equal(tree.children[1].children[0].type, 'image');
    assert.equal(tree.children[1].children[0].url, 'sample/p-000000.svg');
    assert.equal(attrs(tree.children[0].children[0].value).alt, 'Handwritten page 1 of 2: sample');
  } finally {
    console.warn = warn;
  }
  assert.equal(warnings.length, 1);
  assert.ok(warnings[0].includes(path.join(contentDir, 'sample', 'p-000000.svg')));
});

test('falls back to the width and height attributes without a viewBox', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'remark-ink-'));
  try {
    fs.mkdirSync(path.join(dir, 'a4'));
    fs.writeFileSync(path.join(dir, 'a4', 'p-abcdef.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="794px" height="1123"></svg>');
    const md = path.join(dir, 'a4.md');
    const tree = run({ type: 'root', children: [para(image('a4/p-abcdef.svg'))] }, fileFor({ ink: 1 }, md), { contentDir: dir, base: BASE });
    const a = attrs(tree.children[0].children[0].value);
    assert.equal(a.width, '794');
    assert.equal(a.height, '1123');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('firstInkPage finds the first embedded page', () => {
  assert.equal(firstInkPage(mdPath), path.join(contentDir, 'sample', 'p-8c5afe.svg'));
  assert.equal(firstInkPage(path.join(contentDir, 'nope.md')), null);
});
