// Remark plugin: turns the page embeds of an ink note (frontmatter `ink: 1`) into plain
// <img> tags pointing at the page SVGs where the site serves them. It runs before Astro's
// own image collection, so Astro's image pipeline never sees these SVGs; the files are
// copied, and stripped of their stroke data, by the site's copy-asset integration.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PAGE_RE = /^p-[0-9a-f]{6}\.svg$/;

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function safeDecode(s) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/** The markdown file's absolute path from a vfile, or null. */
function filePathOf(file) {
  let p = file && (file.path || (file.history && file.history[0]));
  if (!p) return null;
  if (p instanceof URL || (typeof p === 'string' && p.startsWith('file:'))) p = fileURLToPath(p);
  return path.resolve(p);
}

/** Whether frontmatter marks an ink note: `ink` is a number (or numeric string) of at least 1. */
export function isInkFrontmatter(fm) {
  if (!fm || fm.ink === undefined || fm.ink === null || fm.ink === '' || typeof fm.ink === 'boolean') return false;
  const n = Number(fm.ink);
  return Number.isFinite(n) && n >= 1;
}

/** The page file name (`p-xxxxxx.svg`) if `url` embeds a page of the note `stem`, else null. */
export function pageFileOf(url, stem) {
  if (typeof url !== 'string') return null;
  for (let u of [url, safeDecode(url)]) {
    if (u.startsWith('./')) u = u.slice(2);
    if (!u.startsWith(stem + '/')) continue;
    const name = u.slice(stem.length + 1);
    if (PAGE_RE.test(name)) return name;
  }
  return null;
}

/** The page size from the root <svg> tag: the viewBox's width and height, else the width and height attributes. */
export function readSvgSize(svgPath) {
  const fd = fs.openSync(svgPath, 'r');
  let head;
  try {
    const buf = Buffer.alloc(4096);
    const n = fs.readSync(fd, buf, 0, buf.length, 0);
    head = buf.subarray(0, n).toString('utf8');
  } finally {
    fs.closeSync(fd);
  }
  const tag = /<svg\b[^>]*>/.exec(head);
  if (!tag) return null;
  const attr = name => {
    const m = new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`).exec(tag[0]);
    return m ? (m[1] ?? m[2]) : null;
  };
  const vb = attr('viewBox');
  if (vb) {
    const parts = vb.trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) return { width: parts[2], height: parts[3] };
  }
  const w = parseFloat(attr('width') ?? ''), h = parseFloat(attr('height') ?? '');
  if (w > 0 && h > 0) return { width: w, height: h };
  return null;
}

function textOf(node) {
  if (node.type === 'text' || node.type === 'inlineCode') return node.value;
  return (node.children || []).map(textOf).join('');
}

/** Calls fn(node, index, parent) for every node, depth first, in document order. */
function walk(node, fn, parent = null, index = null) {
  fn(node, index, parent);
  if (node.children) node.children.forEach((child, i) => walk(child, fn, node, i));
}

/**
 * remarkInk({ contentDir, base }) returns a remark plugin. `contentDir` is the directory the
 * served paths are relative to; `base` is the site's base path, e.g. `/EngineeringPortfolio`.
 */
export default function remarkInk({ contentDir, base = '' } = {}) {
  if (!contentDir) throw new Error('remarkInk: contentDir is required');
  const root = path.resolve(contentDir);
  const prefix = base.replace(/\/+$/, '');

  return function attacher() {
    return function transformer(tree, file) {
      const fm = file && file.data && file.data.astro && file.data.astro.frontmatter;
      if (!isInkFrontmatter(fm)) return;
      const mdPath = filePathOf(file);
      if (!mdPath) return;
      const stem = path.basename(mdPath, path.extname(mdPath));
      const dir = path.dirname(mdPath);

      const embeds = [];
      let heading = null;
      walk(tree, (node, index, parent) => {
        if (node.type === 'heading' && node.depth === 1 && heading === null) heading = textOf(node).trim() || null;
        if (node.type !== 'image' || !parent) return;
        const name = pageFileOf(node.url, stem);
        if (name) embeds.push({ node, index, parent, name });
      });
      if (!embeds.length) return;

      const title = (typeof fm.title === 'string' && fm.title.trim()) || heading || stem;
      embeds.forEach(({ node, index, parent, name }, k) => {
        const svgPath = path.join(dir, stem, name);
        if (!fs.existsSync(svgPath)) {
          console.warn(`[remark-ink] page not found, embed left as is: ${svgPath}`);
          return;
        }
        const size = readSvgSize(svgPath);
        if (!size) {
          console.warn(`[remark-ink] no viewBox or width and height in ${svgPath}, embed left as is`);
          return;
        }
        const rel = path.relative(root, svgPath).split(path.sep);
        const src = prefix + '/' + rel.map(encodeURIComponent).join('/');
        const alt = `Handwritten page ${k + 1} of ${embeds.length}: ${title}`;
        const html =
          `<img class="ink-page" src="${escapeHtml(src)}" width="${Math.round(size.width)}" ` +
          `height="${Math.round(size.height)}" alt="${escapeHtml(alt)}" ` +
          `loading="${k === 0 ? 'eager' : 'lazy'}" decoding="async">`;
        parent.children[index] = { type: 'html', value: html, position: node.position };
      });
    };
  };
}
