// Astro integration: serve every non-markdown file under
// <contentDir>/projects/<slug>/ at <base>/projects/<slug>/<relative path>.
//
// Build: copies into dist/ on astro:build:done. Dev: a Vite middleware serves
// the same URLs straight from the content dir.
//
// Skipped: hidden projects (publish: false or status: abandoned), the files of
// hidden entries (log/<stem>.* and the folder log/<stem>/), *.md, and any path
// with a segment starting with ".".
//
// transforms: [{ match(relPath) => boolean, apply(buffer, relPath) => Promise<Buffer> }]
// relPath is relative to contentDir with forward slashes, e.g.
// "projects/openvinyl/log/2026-09-26-sketch/p-8c5afe.svg". The first matching
// transform is applied; unmatched files are copied byte for byte.
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanVisibility } from './visibility.mjs';

const TYPES = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.pdf': 'application/pdf',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime', '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav', '.m4a': 'audio/mp4', '.json': 'application/json', '.txt': 'text/plain',
  '.csv': 'text/csv', '.stl': 'model/stl', '.glb': 'model/gltf-binary', '.zip': 'application/zip',
};

const toPosix = (p) => p.split(path.sep).join('/');

/** True if a path relative to the project folder should be published. */
function isPublishable(relInProject, slug, hiddenEntries) {
  const parts = relInProject.split('/');
  if (parts.some((s) => s.startsWith('.'))) return false;
  if (relInProject.toLowerCase().endsWith('.md')) return false;
  if (parts[0] === 'log' && parts.length >= 2) {
    const first = parts[1];
    const stem = parts.length === 2 ? first.replace(/\.[^.]*$/, '') : first;
    if (hiddenEntries.has(`${slug}/log/${stem}`)) return false;
  }
  return true;
}

/** List publishable files: [{ abs, relFromContent, relFromProjects }]. */
export function listAssets(contentDir) {
  const { hiddenProjects, hiddenEntries } = scanVisibility(contentDir);
  const projectsDir = path.join(contentDir, 'projects');
  const out = [];
  if (!fs.existsSync(projectsDir)) return out;
  for (const slug of fs.readdirSync(projectsDir)) {
    if (slug.startsWith('.') || hiddenProjects.has(slug)) continue;
    const dir = path.join(projectsDir, slug);
    if (!fs.statSync(dir).isDirectory()) continue;
    const walk = (d) => {
      for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
        if (ent.name.startsWith('.')) continue;
        const abs = path.join(d, ent.name);
        if (ent.isDirectory()) { walk(abs); continue; }
        if (!ent.isFile()) continue;
        const relInProject = toPosix(path.relative(dir, abs));
        if (!isPublishable(relInProject, slug, hiddenEntries)) continue;
        out.push({
          abs,
          relFromContent: toPosix(path.relative(contentDir, abs)),
          relFromProjects: `${slug}/${relInProject}`,
        });
      }
    };
    walk(dir);
  }
  return out;
}

async function readTransformed(abs, relFromContent, transforms) {
  const buf = await fsp.readFile(abs);
  const t = transforms.find((x) => x.match(relFromContent));
  return t ? await t.apply(buf, relFromContent) : buf;
}

export default function copyAssets({ contentDir, transforms = [] }) {
  let base = '/';
  return {
    name: 'content-assets',
    hooks: {
      'astro:config:done': ({ config }) => {
        base = config.base.replace(/\/$/, '');
      },
      'astro:server:setup': ({ server }) => {
        // Astro's dev server strips the base before later middlewares see the
        // request, so accept the URL with or without it.
        const prefixes = [`${base}/projects/`, '/projects/'];
        server.middlewares.use(async (req, res, next) => {
          try {
            const url = decodeURIComponent((req.originalUrl || req.url || '').split('?')[0]);
            const prefix = prefixes.find((p) => url.startsWith(p));
            if (!prefix || url.endsWith('/')) return next();
            const rel = url.slice(prefix.length);
            const hit = listAssets(contentDir).find((a) => a.relFromProjects === rel);
            if (!hit) return next();
            const body = await readTransformed(hit.abs, hit.relFromContent, transforms);
            res.setHeader('Content-Type', TYPES[path.extname(hit.abs).toLowerCase()] || 'application/octet-stream');
            res.setHeader('Content-Length', body.length);
            res.end(body);
          } catch (err) {
            next(err);
          }
        });
      },
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const assets = listAssets(contentDir);
        let bytes = 0;
        for (const a of assets) {
          const dest = path.join(outDir, 'projects', ...a.relFromProjects.split('/'));
          if (fs.existsSync(dest)) {
            throw new Error(`content-assets: ${a.relFromContent} would overwrite ${dest}`);
          }
          await fsp.mkdir(path.dirname(dest), { recursive: true });
          const body = await readTransformed(a.abs, a.relFromContent, transforms);
          await fsp.writeFile(dest, body);
          bytes += body.length;
        }
        logger.info(`copied ${assets.length} content assets (${(bytes / 1e6).toFixed(1)} MB)`);
      },
    },
  };
}
