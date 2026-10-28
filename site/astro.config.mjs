import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import copyAssets from './src/build/copy-assets.mjs';
import remarkAssetUrls from './src/build/remark-asset-urls.mjs';
import rehypeA11y from './src/build/rehype-a11y.mjs';
import rehypeFigureClass from './src/build/rehype-figure-class.mjs';
import rehypeFigures from './src/build/rehype-figures.mjs';
import rehypeMathLabels from './src/build/rehype-math-labels.mjs';
import { resolveContentDir } from './src/build/visibility.mjs';
import { remarkInk, inkTransform } from './src/ink/index.mjs';

const siteRoot = fileURLToPath(new URL('.', import.meta.url));
const contentDir = resolveContentDir(siteRoot);
if (!fs.existsSync(path.join(contentDir, 'projects'))) {
  throw new Error(`No projects folder in ${contentDir}. Set CONTENT_DIR (relative to site/).`);
}
process.env.CONTENT_DIR_ABS = contentDir; // read by src/content.config.ts
// The custom domain serves the site at the root. GitHub Pages redirects the old
// zcsop1206.github.io/EngineeringPortfolio/ links to it.
const base = '/';
// /notebook/ stays out of the sitemap until some project has a log entry.
const projectsDir = path.join(contentDir, 'projects');
const hasEntries = fs.readdirSync(projectsDir).some((slug) => {
  const log = path.join(projectsDir, slug, 'log');
  return fs.existsSync(log) && fs.readdirSync(log).some((f) => f.endsWith('.md'));
});

export default defineConfig({
  site: 'https://aditbhargava.me',
  base,
  output: 'static',
  build: { format: 'directory' },
  // Markdown images get a srcset; no injected layout styles (site.css owns layout).
  image: { layout: 'constrained', responsiveStyles: false },
  markdown: {
    syntaxHighlight: false, // code stays black on white
    // remarkInk runs before remarkAssetUrls so ink page embeds become plain <img> tags
    // with alt text and lazy loading; remarkAssetUrls then handles any other SVG.
    remarkPlugins: [remarkMath, remarkInk({ contentDir, base }), [remarkAssetUrls, { contentDir, base }]],
    // rehypeMathLabels runs rehype-mathjax and names each formula's SVG with its TeX.
    // rehypeFigures collects a writeup's figures for its /visuals/ page.
    rehypePlugins: [rehypeMathLabels, rehypeFigureClass, [rehypeFigures, { contentDir, base }], rehypeA11y],
  },
  integrations: [
    // Ink page SVGs lose their raw stroke data (<metadata>) on the way to dist/.
    copyAssets({ contentDir, transforms: [inkTransform()] }),
    // With a base and no trailing slash the sitemap lists the home page twice,
    // once without the "/"; keep directory URLs only.
    sitemap({
      filter: (page) =>
        page.endsWith('/') &&
        !page.endsWith('/404/') &&
        !page.endsWith('/search/') &&
        !page.endsWith('/visuals/') &&
        (hasEntries || !page.endsWith('/notebook/')),
    }),
  ],
  vite: {
    server: { fs: { allow: [siteRoot, contentDir] } },
  },
});
