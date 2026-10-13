// Rehype plugin: collect a writeup's figures for its /projects/<slug>/visuals/
// page, and give each one an id in the writeup so that page can link back.
//
// Runs after rehypeFigureClass and before Astro's own rehype-raw, so markdown
// images are <p class="figure"> elements while raw HTML (inline SVG, <video>,
// an embed in a <div>) is still unparsed `raw` nodes, as a block or inside a
// paragraph of its own. A figure is any of those at the top level of the body. The paragraph after it counts as its
// caption when it is a single emphasised run (*Figure 1. ...*); otherwise the
// alt text, aria-label or title of the media stands in.
//
// The result goes to file.data.astro.frontmatter.figures, which the page reads
// through render()'s remarkPluginFrontmatter:
//   { id, html, caption, captionHtml?, section }
// `html` is the figure as served; relative image paths become the asset URL
// (copy-assets serves every project file there). `section` is the index of the
// h2 the figure sits under, or -1 before the first one; the page maps it to the
// heading's slug once Astro has assigned ids.
import path from 'node:path';
import { toHtml } from 'hast-util-to-html';

/** The project slug when `filePath` is a writeup, projects/<slug>/index.md. */
export function writeupSlug(contentDir, filePath) {
  if (!filePath) return undefined;
  const rel = path.relative(contentDir, filePath).split(path.sep);
  return rel.length === 3 && rel[0] === 'projects' && rel[2] === 'index.md' ? rel[1] : undefined;
}

const MEDIA_START = /^\s*<(svg|video|img|iframe|figure|div)\b/i;
const HAS_MEDIA = /<(svg|video|img|iframe)\b/i;
const FIRST_TAG = /^(\s*<[a-zA-Z][\w-]*)([^>]*)>/;

/** Whether a raw HTML block is a figure: a media element, or a wrapper that holds one. */
function rawIsFigure(value) {
  return MEDIA_START.test(value) && HAS_MEDIA.test(value);
}

/** Add id="…" to a raw block's first tag unless it has one; returns [html, id]. */
function rawWithId(value, id) {
  const m = value.match(FIRST_TAG);
  if (!m) return [value, id];
  const existing = m[2].match(/\sid="([^"]*)"/);
  if (existing) return [value, existing[1]];
  return [value.replace(FIRST_TAG, `$1 id="${id}"$2>`), id];
}

/** The joined HTML of a paragraph made only of raw media tags, else undefined. */
function rawParagraph(node) {
  const kids = node.children.filter((k) => !isBlank(k));
  if (kids.length === 0 || !kids.every((k) => k.type === 'raw')) return undefined;
  const html = kids.map((k) => k.value).join('');
  return rawIsFigure(html) ? html : undefined;
}

function isBlank(n) {
  return n.type === 'text' && !n.value.trim();
}

function toText(node) {
  if (node.type === 'text') return node.value;
  if (node.type === 'raw') return '';
  return (node.children ?? []).map(toText).join('');
}

/** A caption paragraph: its only non-blank child is an <em>. */
function captionOf(node) {
  if (!node || node.type !== 'element' || node.tagName !== 'p') return undefined;
  const kids = node.children.filter((k) => !isBlank(k));
  if (kids.length !== 1 || kids[0].type !== 'element' || kids[0].tagName !== 'em') return undefined;
  const em = kids[0];
  return { caption: toText(em).replace(/\s+/g, ' ').trim(), captionHtml: toHtml(em.children) };
}

/** First alt="…", aria-label="…" or title="…" in raw HTML, as plain text. */
function rawFallbackCaption(value) {
  const m = value.match(/\b(?:alt|aria-label|title)="([^"]*)"/);
  return m ? decodeEntities(m[1]) : '';
}

function decodeEntities(s) {
  return s.replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

/** Site URL of a project file referenced relatively from its writeup. */
function assetUrl(base, slug, src) {
  let rel = src;
  try { rel = decodeURI(src); } catch { /* keep raw */ }
  rel = path.posix.normalize(rel.replace(/^\.\//, ''));
  return `${base}/projects/${slug}/${rel.split('/').map(encodeURIComponent).join('/')}`;
}

function isRelative(src) {
  return typeof src === 'string' && !src.startsWith('/') && !/^[a-z]+:/i.test(src) && !src.startsWith('#');
}

/** A copy of a figure paragraph with image paths resolved and pipeline-only attributes dropped. */
function servedCopy(node, base, slug) {
  const copy = structuredClone(node);
  for (const k of copy.children) {
    if (k.type !== 'element' || k.tagName !== 'img') continue;
    if (isRelative(k.properties.src)) k.properties.src = assetUrl(base, slug, k.properties.src);
    delete k.properties.sizes;
    k.properties.loading = 'lazy';
    k.properties.decoding = 'async';
  }
  return copy;
}

export default function rehypeFigures({ contentDir, base }) {
  return (tree, file) => {
    const slug = writeupSlug(contentDir, file.path ?? file.history?.[0]);
    if (!slug) return;
    const figures = [];
    let section = -1;
    const kids = tree.children;
    const nextNonBlank = (i) => {
      for (let j = i + 1; j < kids.length; j++) if (!isBlank(kids[j])) return j;
      return -1;
    };
    for (let i = 0; i < kids.length; i++) {
      const node = kids[i];
      if (node.type === 'element' && node.tagName === 'h2') { section++; continue; }
      let html;
      let id = `fig-${figures.length + 1}`;
      let fallback = '';
      if (node.type === 'element' && node.tagName === 'p' && (node.properties.className ?? []).includes('figure')) {
        node.properties.id ??= id;
        id = node.properties.id;
        html = toHtml(servedCopy(node, base, slug));
        fallback = node.children
          .filter((k) => k.type === 'element' && (k.properties.alt || k.properties.ariaLabel))
          .map((k) => String(k.properties.alt || k.properties.ariaLabel).trim())
          .join(' ');
      } else if (node.type === 'element' && node.tagName === 'p' && rawParagraph(node)) {
        // A media tag written on its own line but not a CommonMark HTML block
        // (<video …></video> is one): inline HTML in a paragraph of its own.
        node.properties.id ??= id;
        id = node.properties.id;
        html = rawParagraph(node);
        fallback = rawFallbackCaption(html);
      } else if (node.type === 'raw' && rawIsFigure(node.value)) {
        [html, id] = rawWithId(node.value, id);
        node.value = html;
        fallback = rawFallbackCaption(node.value);
        // A widget: the <script> block right after the figure belongs to it.
        const j = nextNonBlank(i);
        if (j !== -1 && kids[j].type === 'raw' && /^\s*<script\b/i.test(kids[j].value)) {
          html += `\n${kids[j].value}`;
          i = j;
        }
      } else {
        continue;
      }
      const j = nextNonBlank(i);
      const cap = j === -1 ? undefined : captionOf(kids[j]);
      figures.push({ id, html, caption: cap?.caption ?? fallback, captionHtml: cap?.captionHtml, section });
    }
    const fm = (file.data.astro ??= {}).frontmatter ??= {};
    fm.figures = figures;
  };
}
