import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeMathJax from 'rehype-mathjax';
import copyAssets from './src/build/copy-assets.mjs';
import remarkAssetUrls from './src/build/remark-asset-urls.mjs';
import rehypeFigureClass from './src/build/rehype-figure-class.mjs';
import { resolveContentDir } from './src/build/visibility.mjs';

const siteRoot = fileURLToPath(new URL('.', import.meta.url));
const contentDir = resolveContentDir(siteRoot);
if (!fs.existsSync(path.join(contentDir, 'projects'))) {
  throw new Error(`No projects folder in ${contentDir}. Set CONTENT_DIR (relative to site/).`);
}
process.env.CONTENT_DIR_ABS = contentDir; // read by src/content.config.ts
const base = '/EngineeringPortfolio';

export default defineConfig({
  site: 'https://zcsop1206.github.io',
  base,
  output: 'static',
  build: { format: 'directory' },
  // Markdown images get a srcset; no injected layout styles (site.css owns layout).
  image: { layout: 'constrained', responsiveStyles: false },
  markdown: {
    syntaxHighlight: false, // code stays black on white
    remarkPlugins: [remarkMath, [remarkAssetUrls, { contentDir, base }]],
    rehypePlugins: [rehypeMathJax, rehypeFigureClass],
  },
  integrations: [
    // transforms: the ink page SVG metadata stripper is wired here later.
    copyAssets({ contentDir, transforms: [] }),
    // With a base and no trailing slash the sitemap lists the home page twice,
    // once without the "/"; keep directory URLs only.
    sitemap({ filter: (page) => page.endsWith('/') && !page.endsWith('/404/') }),
  ],
  vite: {
    server: { fs: { allow: [siteRoot, contentDir] } },
  },
});
