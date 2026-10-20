# Obsidian setup

This folder lives in the engineering portfolio vault at `content/edge/` (moved
2026-10-17). Open `content/` in Obsidian, as the repo's CONTEXT.md says; the stray vault
config at `content/projects/.obsidian/` is from opening the wrong folder. Bases, Templates
and Canvas are enabled in the tracked settings, and the per-device Templates folder is set
to `edge/templates`. If Obsidian was open during the move, restart it once.

Every project in the portfolio has a stub in `edge/projects/<slug>.md` whose Intent is
the writeup's own lede and whose `writeup` property links to it. Ongoing projects collect
predictions; completed ones get lens sweeps that ask what the writeup leaves unstated.
Anything from here worth showing is written by hand as a dated entry in
`projects/<slug>/log/`, in the site's own format. Nothing in `edge/` is rendered by the site (the
collections glob only `projects/*/index.md` and `projects/*/log/*.md`), but the folder is
committed, so it is public on GitHub and syncs to the iPad. Capture on the iPad goes
straight into `inbox/inbox.md`. Anything that should not be public goes in
`content/private/`, which is gitignored.

Still to do by hand, once:

1. Open `edge/views/due.base`, `questions.base`, `schemata.base` so Obsidian indexes
   them. Pin `due.base` to the right sidebar.
2. **Hotkeys**: bind "Templates: Insert template". Keep `inbox/inbox.md` pinned.

No community plugins are required. Optional ones that fit:

- **Excalidraw** for the visual representation slot. Save as `schemata/<name>.excalidraw.md`
  and link it from the schema. Canvas (core) works too for spatial layouts.
- **QuickAdd** if a one-key capture to `inbox/inbox.md` turns out to matter (the
  first prediction in `projects/edge.md` says it will).

## The rituals in Obsidian terms

- **During work**: append one line to `inbox/inbox.md`. Tag first. Nothing else.
- **Daily**: open `inbox/inbox.md`. Each line becomes a new note from a template, an
  edit to a schema, or is deleted. Graph view's orphans are schemata nothing links to.
- **Drill**: open `views/due.base`. Solve a *new exemplar* of the schema, in scratch,
  before opening it. Put the exemplar under `## Exemplars`, bump the `exemplars` counter,
  then edit two properties: pass means `drill_next` = today + double `drill_interval`;
  fail means interval 1, due tomorrow, and a `x` line in the inbox with the cause.
- **Health**: `views/schemata.base` computes progressive / holding / degenerating / crisis
  from the counters. Crisis sits at the top; that is next Sunday's sweep.
- **Weekly**: pick one project. For each schema, read its `## Lens` and answer it in
  the project's `## Lens sweeps`. Score predictions and bump `confirmed` on the schemata they came from. Set `held` only after a new exemplar solved cold.

## What the script still does

`edge.py` is optional. It duplicates nothing Obsidian shows; it only saves typing:
`capture`, `new`, `drill <schema> pass|fail` (the date arithmetic), `sweep <project>`
(prints every lens in one place), `stats` (same as the bases, in a terminal).
