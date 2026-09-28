// Remark plugin: rewrite relative markdown image URLs that match `test` to the
// copied-asset URL <base>/projects/<slug>/<path>, and add width and height
// read from the file.
//
// By default it only matches SVG. Astro's image pipeline gains nothing on SVG
// (it cannot resize it) and would publish a second, untransformed copy under
// _astro/, so SVGs (including ink pages) are served from the copied assets,
// where the copy-assets transforms apply. Raster images are left for Astro.
//
// It runs before Astro's remarkCollectImages, which ignores URLs starting
// with "/", so rewritten images bypass the Astro pipeline.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

function svgSize(file) {
  const head = fs.readFileSync(file, 'utf8').slice(0, 4096);
  const tag = head.match(/<svg\b[^>]*>/i)?.[0] ?? '';
  const attr = (n) => tag.match(new RegExp(`\\s${n}\\s*=\\s*["']([\\d.]+)(px)?["']`, 'i'))?.[1];
  let w = attr('width');
  let h = attr('height');
  if (!w || !h) {
    const vb = tag.match(/viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
    if (vb) { w = vb[1]; h = vb[2]; }
  }
  return w && h ? { width: Math.round(+w), height: Math.round(+h) } : null;
}

async function imageSize(file) {
  if (/\.svg$/i.test(file)) return svgSize(file);
  try {
    const m = await sharp(file).metadata();
    return m.width && m.height ? { width: m.width, height: m.height } : null;
  } catch {
    return null;
  }
}

function visitImages(node, fn) {
  if (node.type === 'image') fn(node);
  if (node.children) for (const c of node.children) visitImages(c, fn);
}

export default function remarkAssetUrls({ contentDir, base, test = (url) => /\.svg$/i.test(url) }) {
  const projectsDir = path.resolve(contentDir, 'projects');
  const prefix = `${base.replace(/\/$/, '')}/projects/`;
  return async (tree, file) => {
    if (typeof file?.path !== 'string') return;
    const jobs = [];
    visitImages(tree, (node) => {
      const raw = node.url;
      if (!raw || raw.startsWith('/') || raw.startsWith('#') || URL.canParse(raw)) return;
      let url;
      try { url = decodeURI(raw); } catch { url = raw; }
      if (!test(url)) return;
      const abs = path.resolve(path.dirname(file.path), url);
      const rel = path.relative(projectsDir, abs);
      if (rel.startsWith('..') || path.isAbsolute(rel)) return;
      if (!fs.existsSync(abs)) {
        throw new Error(`Image not found: ${url} in ${file.path}`);
      }
      jobs.push((async () => {
        node.url = prefix + rel.split(path.sep).map(encodeURIComponent).join('/');
        const size = await imageSize(abs);
        node.data ??= {};
        node.data.hProperties = {
          ...(node.data.hProperties ?? {}),
          ...(size ?? {}),
          loading: 'lazy',
          decoding: 'async',
        };
      })());
    });
    await Promise.all(jobs);
  };
}
