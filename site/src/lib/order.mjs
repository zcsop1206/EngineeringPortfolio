// Pure ordering of projects for the home page and the sidebar. Plain JS so
// node --test can import it without Astro (test/order.test.mjs).
//
// A project is { id, data } with data.title, data.start (Date) and the optional
// data.short, data.parent, data.featured, data.hook.

const file = (p) => `content/projects/${p.id}/index.md`;

/** Short title for home rows and the sidebar; the full title elsewhere. */
export function shortTitle(p) {
  return p.data.short ?? p.data.title;
}

/**
 * Parts of a project: visible projects whose `parent` is another visible project,
 * keyed by the parent's slug, oldest first. A project whose parent is hidden,
 * missing or itself is treated as top level. Parts nest one level only.
 */
export function childrenByParent(projects) {
  const byId = new Map(projects.map((p) => [p.id, p]));
  const isPart = (p) => Boolean(p.data.parent) && p.data.parent !== p.id && byId.has(p.data.parent);
  const m = new Map();
  for (const p of projects) {
    if (!isPart(p)) continue;
    const parent = byId.get(p.data.parent);
    if (isPart(parent)) {
      throw new Error(
        parent.data.parent === p.id
          ? `${file(p)}: parent "${parent.id}" names this project as its parent. Remove parent from one of the two.`
          : `${file(p)}: parent "${parent.id}" is itself a part of "${parent.data.parent}". Parts nest one level only; set parent: ${parent.data.parent}.`,
      );
    }
    m.set(parent.id, [...(m.get(parent.id) ?? []), p]);
  }
  for (const list of m.values()) {
    list.sort((a, b) => a.data.start.getTime() - b.data.start.getTime() || a.id.localeCompare(b.id));
  }
  return m;
}

/**
 * Home page split: featured projects in `featured` order, then the rest in the
 * given order. Parts (projects with a visible parent) are in neither list; their
 * parent's row links to them.
 */
export function homeProjects(projects) {
  const children = childrenByParent(projects);
  const parts = new Set([...children.values()].flat().map((p) => p.id));
  for (const p of projects) {
    if (parts.has(p.id) && (p.data.featured !== undefined || p.data.hook !== undefined)) {
      throw new Error(
        `${file(p)}: featured and hook are for home page rows, and this project is a part of "${p.data.parent}". Move them to content/projects/${p.data.parent}/index.md.`,
      );
    }
  }
  const top = projects.filter((p) => !parts.has(p.id));
  const featured = top
    .filter((p) => p.data.featured !== undefined)
    .sort((a, b) => a.data.featured - b.data.featured || a.id.localeCompare(b.id));
  for (let i = 1; i < featured.length; i++) {
    if (featured[i].data.featured === featured[i - 1].data.featured) {
      throw new Error(
        `${file(featured[i])}: featured: ${featured[i].data.featured} is also set in ${file(featured[i - 1])}. Give each featured project its own number.`,
      );
    }
  }
  const rest = top.filter((p) => p.data.featured === undefined);
  return { featured, rest, children };
}

/** Sidebar order: each top-level project followed by its parts, marked `child: true`. */
export function navOrder(projects) {
  const children = childrenByParent(projects);
  const parts = new Set([...children.values()].flat().map((p) => p.id));
  return projects
    .filter((p) => !parts.has(p.id))
    .flatMap((p) => [{ p, child: false }, ...(children.get(p.id) ?? []).map((c) => ({ p: c, child: true }))]);
}
