# Site

Plain Astro 5 site for https://zcsop1206.github.io/EngineeringPortfolio/. Content lives outside this folder, in `../content` (an Obsidian vault).

## Commands

Run from `site/`:

```
npm install
npm run dev       # http://localhost:4321/EngineeringPortfolio/
npm run build     # astro build, then pagefind indexes dist/
npm run preview
```

`CONTENT_DIR` points at a different content folder, relative to `site/`. The fixture is a small copy of real pages plus hidden cases:

```
CONTENT_DIR=test/fixture-content npm run build          # bash
$env:CONTENT_DIR = "test/fixture-content"; npm run build  # PowerShell
```

The build stops if `<CONTENT_DIR>/projects` does not exist. Search only works in a build, since the Pagefind index is made after `astro build`.

## Content

```
content/projects/<slug>/index.md                    writeup
content/projects/<slug>/log/YYYY-MM-DD[-title].md   entries
content/projects/<slug>/...                         images, pdfs, videos, ink pages
```

The schema is in `src/content.config.ts`. A writeup with `publish: false` or `status: abandoned` is hidden, and so are all its entries and files. An entry with `publish: false` is hidden, along with `log/<stem>/` and `log/<stem>.*`. Hidden content is excluded before Astro loads anything, so it never reaches `dist/`.

## Asset URLs

Every file under `content/projects/<slug>/` except `*.md` and dotfiles is published at

```
/EngineeringPortfolio/projects/<slug>/<path inside the project folder>
```

byte for byte, unless a transform in `astro.config.mjs` (`copyAssets({ transforms })`) matches it. `src/build/copy-assets.mjs` copies them into `dist/` after the build and serves them in dev.

In markdown, relative raster images (`![](photo.jpg)`, `![](../photo.jpg)` from a log entry) go through Astro's image pipeline and come out as resized WebP under `_astro/`. Relative SVG images are rewritten to the asset URL above, so ink pages get the transforms. Raw HTML must use the full asset URL, for example `<video src="/EngineeringPortfolio/projects/<slug>/clip.mp4">`.

## Layout

- `src/pages/` home, project and entry pages, notebook, search, 404, `rss.xml`, and `og/` (Open Graph images rendered with sharp)
- `src/layouts/Base.astro` the only layout
- `src/styles/site.css` the only stylesheet
- `src/lib/content.ts` visibility, ordering, dates, URLs
- `src/build/` the asset integration and the markdown plugins
