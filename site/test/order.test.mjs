import { test } from 'node:test';
import assert from 'node:assert/strict';
import { childrenByParent, homeProjects, navOrder, shortTitle } from '../src/lib/order.mjs';

/** A fake project: { id, data } with a title and a start date. */
function project(id, data = {}) {
  return { id, data: { title: `Title ${id}`, start: new Date('2026-01-01'), ...data } };
}
const ids = (list) => list.map((p) => p.id);

test('featured projects are sorted by number, the rest keep input order', () => {
  const projects = [
    project('a'),
    project('b', { featured: 2 }),
    project('c'),
    project('d', { featured: 1 }),
    project('e'),
  ];
  const { featured, rest } = homeProjects(projects);
  assert.deepEqual(ids(featured), ['d', 'b']);
  assert.deepEqual(ids(rest), ['a', 'c', 'e']);
});

test('a child of a visible parent appears only in children, sorted by start', () => {
  const projects = [
    project('parent'),
    project('late', { parent: 'parent', start: new Date('2026-03-01') }),
    project('early', { parent: 'parent', start: new Date('2026-02-01') }),
    project('other'),
  ];
  const { featured, rest, children } = homeProjects(projects);
  assert.deepEqual(ids(featured), []);
  assert.deepEqual(ids(rest), ['parent', 'other']);
  assert.deepEqual([...children.keys()], ['parent']);
  assert.deepEqual(ids(children.get('parent')), ['early', 'late']);
});

test('a hidden or missing parent and a self-parent leave the project at top level', () => {
  // "hidden" is not in the list, as getProjects() leaves hidden projects out.
  const projects = [project('a', { parent: 'hidden' }), project('b', { parent: 'b' }), project('c')];
  const { rest, children } = homeProjects(projects);
  assert.deepEqual(ids(rest), ['a', 'b', 'c']);
  assert.equal(children.size, 0);
});

test('a grandchild throws', () => {
  const projects = [project('a'), project('b', { parent: 'a' }), project('c', { parent: 'b' })];
  assert.throws(() => childrenByParent(projects), /content\/projects\/c\/index\.md: .*nest one level only/);
});

test('a parent cycle throws', () => {
  const projects = [project('a', { parent: 'b' }), project('b', { parent: 'a' })];
  assert.throws(() => childrenByParent(projects), /content\/projects\/a\/index\.md: .*names this project as its parent/);
});

test('two projects with the same featured number throw', () => {
  const projects = [project('a', { featured: 1 }), project('b', { featured: 1 })];
  assert.throws(() => homeProjects(projects), /content\/projects\/b\/index\.md: featured: 1 is also set in content\/projects\/a\/index\.md/);
});

test('featured or hook on a part throws', () => {
  const featuredPart = [project('a'), project('b', { parent: 'a', featured: 1 })];
  assert.throws(() => homeProjects(featuredPart), /content\/projects\/b\/index\.md: featured and hook/);
  const hookPart = [project('a'), project('b', { parent: 'a', hook: { label: 'Why', text: 'x' } })];
  assert.throws(() => homeProjects(hookPart), /content\/projects\/b\/index\.md: featured and hook/);
});

test('navOrder lists each parent followed by its children', () => {
  const projects = [
    project('x'),
    project('p'),
    project('p2', { parent: 'p', start: new Date('2026-05-01') }),
    project('p1', { parent: 'p', start: new Date('2026-04-01') }),
    project('y'),
  ];
  assert.deepEqual(
    navOrder(projects).map(({ p, child }) => [p.id, child]),
    [['x', false], ['p', false], ['p1', true], ['p2', true], ['y', false]],
  );
});

test('shortTitle falls back to title', () => {
  assert.equal(shortTitle(project('a', { short: 'Short' })), 'Short');
  assert.equal(shortTitle(project('a')), 'Title a');
});
