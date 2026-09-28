// Decide which content is hidden before Astro loads it, so hidden writeups,
// entries and their files never reach the content store, the image pipeline
// or dist/. Used by content.config.ts (glob exclusions) and copy-assets.mjs.
//
// Only the top-level scalar keys `publish`, `status` and `project` are read,
// with a deliberately small parser. The zod schema in content.config.ts
// validates the full frontmatter; lib/content.ts filters again at page time.
import fs from 'node:fs';
import path from 'node:path';

export function readFrontmatter(file) {
  const text = fs.readFileSync(file, 'utf8');
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  const out = {};
  if (!m) return out;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w -]*?):\s*(.*?)\s*$/);
    if (!kv) continue;
    let v = kv[2].replace(/\s+#.*$/, '');
    if (/^(['"]).*\1$/.test(v)) v = v.slice(1, -1);
    else if (v === 'true') v = true;
    else if (v === 'false') v = false;
    out[kv[1]] = v;
  }
  return out;
}

export function isHiddenProject(fm) {
  return fm.publish === false || fm.status === 'abandoned';
}

export function isHiddenEntry(fm) {
  return fm.publish === false;
}

/**
 * Scan <contentDir>/projects. Returns the hidden project slugs and the hidden
 * entries of visible projects (as "<slug>/log/<stem>").
 */
export function scanVisibility(contentDir) {
  const root = path.join(contentDir, 'projects');
  const hiddenProjects = new Set();
  const hiddenEntries = new Set();
  if (!fs.existsSync(root)) return { hiddenProjects, hiddenEntries };
  for (const slug of fs.readdirSync(root)) {
    if (slug.startsWith('.')) continue;
    const dir = path.join(root, slug);
    if (!fs.statSync(dir).isDirectory()) continue;
    const index = path.join(dir, 'index.md');
    if (!fs.existsSync(index) || isHiddenProject(readFrontmatter(index))) {
      hiddenProjects.add(slug);
      continue;
    }
    const log = path.join(dir, 'log');
    if (!fs.existsSync(log)) continue;
    for (const f of fs.readdirSync(log)) {
      if (!f.endsWith('.md') || f.startsWith('.')) continue;
      if (isHiddenEntry(readFrontmatter(path.join(log, f)))) {
        hiddenEntries.add(`${slug}/log/${f.slice(0, -3)}`);
      }
    }
  }
  return { hiddenProjects, hiddenEntries };
}

/** Resolve the content dir: CONTENT_DIR relative to site/, else ../content. */
export function resolveContentDir(siteRoot) {
  return path.resolve(siteRoot, process.env.CONTENT_DIR || '../content');
}
