# Engineering portfolio and notebook

The site at https://zcsop1206.github.io/EngineeringPortfolio/ and the Obsidian vault behind it.

- `content/` is the vault: project writeups, dated entries, images, handwritten pages. Open this folder in Obsidian.
- `site/` is the Astro site. Run `npm install` and `npm run build` there.
- `scripts/guard.mjs` fails on files that must not be published. It runs in CI before every build.

`CONTEXT.md` records the layout, the content rules and the decisions behind them. Read it before changing anything.
