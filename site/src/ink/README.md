# Ink notes on the site

Handwritten notebook pages from the Obsidian notebook plugin (format `notebook-ink/1`, spec in zcsop1206/obsidian-notebook issue #3) shown as plain `<img>` tags. No dependencies beyond Node built-ins.

An ink note is a markdown file with frontmatter `ink: 1` and one image embed per page, `![](<stem>/p-xxxxxx.svg)`, with the page SVGs in a folder named after the note. On the site that is `content/projects/<slug>/log/<entry>.md` with pages in `content/projects/<slug>/log/<entry>/`.

## Modules

`strip.mjs`

- `stripInkSvg(text: string): string` removes the page's `<metadata>` element (the raw stroke points, about half the file) together with the line it sat on. Everything else, including the `<style>` that switches colours for dark mode and the template layer, stays byte-identical. Input that is not a `notebook-ink/1` page comes back unchanged.
- `isInkSvg(text: string): boolean` is true for a page that still holds its `notebook-ink/1` metadata.

`remark-ink.mjs`

- `remarkInk({ contentDir, base })` (default export) returns a remark plugin. In a markdown file whose frontmatter has `ink` of 1 or more, each image whose url is `<stem>/p-xxxxxx.svg` or `./<stem>/p-xxxxxx.svg` (percent-encoded forms too) becomes an `html` node:
  `<img class="ink-page" src="<base>/<svg path relative to contentDir, each segment URL-encoded>" width="W" height="H" alt="Handwritten page N of M: <title>" loading="eager|lazy" decoding="async">`
- W and H come from the SVG's `viewBox`, else its `width` and `height`. The first page loads eagerly, the rest lazily. The title is frontmatter `title`, else the first `# ` heading, else the file stem.
- A page whose file is missing is left as a normal image node and a warning with its path is printed. Files without `ink` frontmatter are not touched.
- Because the plugin runs before Astro's image collection, Astro never processes these SVGs (checked with `@astrojs/markdown-remark` 6.3.8: the fixture note renders six `<img class="ink-page">` tags and `localImagePaths` is empty).

`index.mjs` re-exports the above and adds:

- `inkTransform(): { match(relPath: string): boolean, apply(buffer: Buffer, relPath: string): Promise<Buffer> }` for the copy-asset integration. `match` is true for `.svg` paths; `apply` strips ink pages and returns any other SVG unchanged.
- `firstInkPage(markdownAbsPath: string): string | null`, the absolute path of the first page the note embeds (null if the file is not an ink note, embeds no page, or the page is missing). For Open Graph images.

## Wiring

```js
// astro.config.mjs
import { remarkInk, inkTransform } from './src/ink/index.mjs';

markdown: { remarkPlugins: [remarkInk({ contentDir: 'content', base: '/EngineeringPortfolio' })] }
// the copy-asset integration:
transforms: [inkTransform()]
```

`contentDir` must be the directory the served URLs are relative to: a page at `content/projects/<slug>/log/<entry>/p-xxxxxx.svg` is served at `/EngineeringPortfolio/projects/<slug>/log/<entry>/p-xxxxxx.svg`. A relative `contentDir` resolves against the working directory of the build.

## CSS

```css
.ink-page { display: block; width: 100%; max-width: 816px; margin: 1rem auto; height: auto; background: white; }
@media (prefers-color-scheme: dark) { .ink-page { background: #111; } }
```

Pages have a transparent background. The SVG's own `<style>` draws default ink and template lines dark in light mode and light in dark mode, following the operating system's colour scheme even inside an `<img>`, so the background behind the page has to follow the same media query. If the site gets a manual theme toggle, the page background should still follow `prefers-color-scheme`, not the toggle, because the SVG cannot see the toggle.

## What was checked

`node --test "site/test/ink/*.test.mjs"` (Node 22 wants a file glob, not a directory) covers the stripper, the transform and the plugin, using the fixture copied verbatim from the notebook repo into `site/test/ink/fixture/`.

`python site/test/ink/render_check.py [out_dir]` renders every fixture page as an `<img>` in headless Chromium, original and stripped, in light and dark with the CSS above. All six pages were pixel-identical after stripping in both modes when rendered at the same position; side by side at different x offsets Chromium's antialiasing differs by 1 or 2 levels in a few pixels whatever the content, which is why the script compares them one at a time. At the centre of a default-ink stroke the luminance was 31 in light mode and 227 in dark mode, so the colour switch works inside `<img>`.

Stripping the fixture pages: 765,088 to 392,344 bytes (49%), 421,990 to 222,044 (47%), 303,731 to 149,769 (51%), 102,383 to 102,215 (a dots page with no strokes), 1,729 to 1,561 and 467 to 314.

## Audio

Audio recordings are not published for now. If a published-clips path is ever agreed, each recorded segment has to be rendered as its own `<audio>` element labelled with the segment's start time from the recorder's `meta.json`. The recorder skips the time the app spent in the background, so a playback position within one file does not map to wall-clock time.
