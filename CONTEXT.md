# Context for working on this repo

Read this first. It records what the repo is, how it is laid out, what has been decided, and what to check before changing things. Update it when a decision changes.

## What this is

Adit Bhargava's engineering portfolio and public engineering notebook. The site is at `https://aditbhargava.me/`, built with plain Astro 5 and deployed by GitHub Actions on every push to `main`.

The notebook is kept in Obsidian. On the laptop the vault is the `content/` folder of this checkout, pushed with plain git. On the iPad the same folder is synced through the GitHub API by the plugin `zcsop1206/obsidian-github-sync`; handwriting comes from `zcsop1206/obsidian-notebook`. Both plugins keep their design notes in their own `CONTEXT.md`.

The notebook is public by default. Anything private goes in `content/private/`, which is gitignored and never read by the site.

## Layout

```
content/                         the Obsidian vault (open this folder in Obsidian)
  .obsidian/                     shared settings only; plugins and per-device state are ignored
  projects/<slug>/index.md       a project's writeup
  projects/<slug>/log/<date>[-title].md   dated entries: log, test, decision, sketch
  projects/<slug>/log/<entry>/p-xxxxxx.svg  pages of a handwritten entry (notebook-ink/1)
  projects/<slug>/<images, pdfs, videos>    the project's media, referenced by relative path
  private/                       gitignored escape hatch
site/                            the Astro site; run every npm command from here
  src/content.config.ts          the two collections and their frontmatter schema
  src/ink/                       ink notes: strip stroke data, rewrite page embeds
  src/build/                     the visibility scan, the markdown plugins, and copy-assets (content media into dist/)
  test/fixture-content/          a small content tree for building without the real one
scripts/guard.mjs                fails on files that must not be published (see scripts/README.md)
.github/workflows/deploy.yml     guard, npm ci, npm test, build in site/, deploy site/dist
```

Local-only folders that git ignores: `social/`, `drafts/`, `interview-prep/`, `content/learning/`. The learning notes vault lives outside the repo at `Documents/learning-vault/`.

## Content rules

- URLs: a project is at `/projects/<slug>/`, where the slug is the folder name. The site moved to https://aditbhargava.me/ on Oct 28 2026; GitHub Pages redirects the old `zcsop1206.github.io/EngineeringPortfolio/` links shared on LinkedIn and X, so slugs must not change. Entries are at `/projects/<slug>/log/<file stem>/`. Every non-markdown file under `content/projects/<slug>/` is served at `/projects/<slug>/<relative path>`.
- Writeup frontmatter: `title`, `description` (one line: the lede under the title and the meta description), `status` (built-and-tested, design-study, in-progress, abandoned), `start`, `end` (omit while ongoing), `cover` (an image next to index.md), `publish` (default true).
- Home page frontmatter, all optional: `short` (the title on the home page and in the sidebar), `result` (one line: what was built and the number that proves it), `featured` (1, 2 or 3: a featured row, in that order), `hook` (`{label, text}`, shown on featured rows only), `parent` (the slug this is a part of; parts are not listed on the home page, they are linked as "Part N" from the parent's row).
- `cover_on_page: false` keeps the cover for the home page and link previews but leaves it off the top of the writeup. Both ASIC parts use it (in part 2 the cover is the solved grid, which would spoil the puzzle).
- Entry frontmatter: `date`, `type` (log, test, decision, sketch; default log), `title` (optional), `publish` (default true). `project` is derived from the folder. Handwritten entries carry `ink: 1` and are written by the ink plugin.
- Hidden from the site: `publish: false`, `status: abandoned`, and every entry of a hidden project. Hidden media is not copied to `dist/`.
- Prose is the owner's. Edits by tools change only frontmatter, paths and links. Never regenerate a note from a template.
- Style for anything added to the site: no bold lead phrases, no `<style>` blocks, no `<details>` in markdown content (the site's own mobile nav uses it), no asides, no decorative images. Visuals only when they communicate. ISO dates.
- Notebook index at `/notebook/` exists but is not linked from the home page.
- Visuals pages (added 2026-10-13): `/projects/<slug>/visuals/` shows a writeup's cover (when the writeup shows it) and every top-level figure, in order, one per screen, with its caption and a link back to its place in the writeup (`#fig-N`). For walking someone through a project. Built by `site/src/build/rehype-figures.mjs` from the markdown: a paragraph of only images, an inline SVG or video block, or a `<div>` holding one, each with the following `*Figure N. …*` paragraph as its caption, else the media's alt text or aria-label. A paragraph that mixes an image with text is not a figure. The writeup links the page from its meta line; the pages are `noindex` and out of the sitemap. The one layout variation is a 960 px column (`wide` on `Base`).

## The site

- Plain Astro 5, content collections over `../content` (override with `CONTENT_DIR`, relative to `site/`), Pagefind search at `/search/`, RSS at `/rss.xml` (projects and entries), a sitemap, an Open Graph image per page.
- Look: black type on white, dark mode follows the OS only, one system text face and a mono face for numbers, underlined links, a 680 px text column, and figures on the text column too. No toggle: the ink SVGs switch colour through `prefers-color-scheme` inside `<img>`, so a site toggle would put white ink on a white page.
- Design rule: the simplest baseline, with variation only where it serves a stated intention. One left edge, the text column. One type scale: body, `--small`, `--lede`, headings. Media sits flush left with square corners. Mono only for metadata.
- Home page: the intro, then one row per project on the text column: cover, short title, result, status. The featured three come first, with a 300 px cover and a hook; then a rule; then the rest with 150 px covers. No "Now" section.
- Markdown bodies may contain inline SVG and HTML, MathJax, and one inline `<script>` (the Star Battle widget). An inline `<script>` needs a blank line before it and no blank lines inside.
- Ink page SVGs lose their `<metadata>` (the raw stroke points, about half the bytes) on the way to `dist/`. The vault files are never modified.

## Sync plugin settings for the iPad

- Repo `zcsop1206/EngineeringPortfolio`, branch `main`, vault folder empty (the whole iPad vault), repo folder `content`.
- With the plugin's "Honour the repo's .gitignore" setting on (plugin branch `honour-gitignore`), the root `.gitignore` applies on the iPad too. Until that version is installed, paste this into the plugin's Ignore setting so the two lists agree:

  ```
  .obsidian/
  private/
  .trash/
  _spike/
  learning/
  drafts/
  interview-prep/
  node_modules/
  .astro/
  dist/
  .vite/
  .cache/
  .vscode/
  *.m4a
  *.webm
  *.ogg
  *.mp3
  *.wav
  *.log
  *.tmp
  *.swp
  .DS_Store
  Thumbs.db
  desktop.ini
  .env
  .env.local
  .env.production
  ```
- The plugin pushes through the GitHub API, so a file it lets through is public before CI's guard can fail the deploy. The plugin's ignore rules are the first line of defence; the guard only stops publishing to the site.
- The token lives in `.obsidian/plugins/github-api-sync/data.json`, which is gitignored and never synced.

## Checks before pushing

- `node scripts/guard.mjs` from anywhere in the repo.
- `cd site && npm test && npm run build`; serve `dist/` at the root of a local server (the base path is `/`).
- A commit builds cleanly in a fresh `git worktree add` plus `npm ci` in `site/`.
