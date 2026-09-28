// Ink notes on the site: the remark plugin, the SVG stripper and the copy-asset transform.
import fs from 'node:fs';
import path from 'node:path';
import { isInkSvg, stripInkSvg } from './strip.mjs';
import remarkInk, { pageFileOf } from './remark-ink.mjs';

export { isInkSvg, stripInkSvg, remarkInk };

/**
 * A transform for the site's copy-asset integration: page SVGs lose their stroke data on the
 * way to dist/, every other SVG passes through unchanged.
 */
export function inkTransform() {
  return {
    match: relPath => relPath.toLowerCase().endsWith('.svg'),
    apply: async (buffer, _relPath) => {
      const text = buffer.toString('utf8');
      return isInkSvg(text) ? Buffer.from(stripInkSvg(text), 'utf8') : buffer;
    },
  };
}

/**
 * The absolute path of the first page SVG the note embeds, or null if the file is not an ink
 * note, embeds no page, or that page's file is missing. For Open Graph images.
 */
export function firstInkPage(markdownAbsPath) {
  let text;
  try {
    text = fs.readFileSync(markdownAbsPath, 'utf8');
  } catch {
    return null;
  }
  const lines = text.split(/\r?\n/);
  const fence = l => /^---[ \t]*$/.test(l);
  if (!fence(lines[0])) return null;
  const end = lines.findIndex((l, i) => i > 0 && fence(l));
  if (end < 0) return null;
  const ink = lines.slice(1, end).map(l => /^ink\s*:\s*["']?(\d+)["']?\s*$/.exec(l)).find(Boolean);
  if (!ink || Number(ink[1]) < 1) return null;

  const stem = path.basename(markdownAbsPath, path.extname(markdownAbsPath));
  const embed = /!\[[^\]]*\]\(\s*(<[^>]*>|[^\s)]+)/g;
  for (const line of lines.slice(end + 1)) {
    for (const m of line.matchAll(embed)) {
      const url = m[1].startsWith('<') ? m[1].slice(1, -1) : m[1];
      const name = pageFileOf(url, stem);
      if (!name) continue;
      const svg = path.join(path.dirname(path.resolve(markdownAbsPath)), stem, name);
      return fs.existsSync(svg) ? svg : null;
    }
  }
  return null;
}
