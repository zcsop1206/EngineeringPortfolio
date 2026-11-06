import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deckSections, parseDeck, visualKind } from '../src/lib/deck.mjs';

const md = [
  '---',
  'note: frontmatter is ignored',
  '---',
  '# Why',
  '',
  '## First',
  'One sentence.',
  '',
  '![The block](block.jpeg)',
  '',
  '# The work',
  '',
  '## Second',
  '- a',
  '- b',
  '',
  '## Third',
  'Text with an inline ![icon](i.png) stays in the body.',
  '![](#fig-3)',
  '![ignored second visual](x.png)',
].join('\n');

test('beats carry their section, body and visual', () => {
  const { beats } = parseDeck(md);
  assert.deepEqual(beats.map((b) => [b.section, b.headline]), [['Why', 'First'], ['The work', 'Second'], ['The work', 'Third']]);
  assert.equal(beats[0].body, 'One sentence.');
  assert.deepEqual(beats[0].visual, { caption: 'The block', src: 'block.jpeg' });
  assert.equal(beats[1].body, '- a\n- b');
  assert.equal(beats[1].visual, null);
  assert.deepEqual(beats[2].visual, { caption: '', src: '#fig-3' });
  assert.match(beats[2].body, /inline !\[icon\]\(i\.png\)/);
  assert.match(beats[2].body, /ignored second visual/);
  assert.deepEqual(deckSections(beats), ['Why', 'The work']);
});

test('a beat without a visual keeps the previous one', () => {
  const { beats } = parseDeck(md);
  assert.deepEqual(beats.map((b) => b.shown), [0, 0, 2]);
  assert.equal(parseDeck('## Only\ntext').beats[0].shown, -1);
});

test('visualKind', () => {
  assert.equal(visualKind('#fig-1'), 'figure');
  assert.equal(visualKind('run.mp4'), 'video');
  assert.equal(visualKind('a.svg'), 'image');
});
