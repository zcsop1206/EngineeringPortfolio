# Teach

Docs that rewrite themselves to Adit's level, and a record of that level per topic. A layer beside the calls ledger, not part of it: the ledger records judgment, this records understanding, and they meet only through readout.md.

## What a doc is

A pair. The detailed document is LaTeX, `<name>/<name>.tex` with one file per section in `<name>/parts/` and a shared `_preamble.tex`, built to `<name>/<name>.pdf`; read the PDF in Obsidian on either device. Each technique section is also built on its own from a wrapper in `<name>/split/` to `<name>/split/topic-<slug>.pdf`, for reading one technique on the iPad without the whole document. The summary is `<name>.md` beside it, one compact paragraph per section under the same headings, with the PDF embedded at the top. Marks go on the summary; the pass rewrites both. The first doc is [putnam.md](putnam.md) with [putnam/putnam.pdf](putnam/putnam.pdf); the second is [mie312.md](mie312.md) with [mie312/mie312.pdf](mie312/mie312.pdf), for MIE312 Midterm 2.

## Marking

Read the summary or the PDF. Where it misjudges you, put one comment after the passage in the summary:

    lost      beyond me
    easy      too easy
    forgot    I knew this and it is gone

Each is an Obsidian comment, two percent signs on either side, as in the examples the plugin inserts; a reason is optional after a colon. Three ways to do it. With the Calls plugin: select the passage, run "Teach: mark lost" (or easy, forgot) from the command palette, add a reason or not. By hand: type the comment. From the PDF: highlight the passage in Obsidian's PDF viewer, copy it as a quote, paste it as a blockquote line under the matching heading in the summary, and mark that line; the pass finds the passage in the LaTeX.

## Running the pass

In Claude Code opened at the repo root:

    /teach                 rewrite the marked passages, rebuild the PDFs, regenerate levels.md
    /teach <topic>         the same, and write a new doc on that topic at your level

The pass rewrites only the marked passages (lost: from further back, with terms defined; easy: compressed to the result; forgot: the shortest derivation from something you still hold), in the summary and in the LaTeX part, removes the marks, logs what moved under the summary's Changes, rebuilds the PDF with `content\teach\build.cmd`, and regenerates levels.md. It also reads the Misses and Dormant sections of content/calls/readout.md: a miss whose words name a topic's heading is recorded as evidence on that topic. It never writes to calls.md and never speaks during work.

## Building by hand

`content\teach\build.cmd` builds every doc and its per-topic wrappers; `build.cmd putnam` builds one doc. It uses TinyTeX's xelatex at `%APPDATA%\TinyTeX\bin\windows\` and deletes the auxiliary files. Laptop only; the iPad reads the PDFs the sync brings.

## levels.md

One line per topic: level 1 to 5, a foundations flag (never lost, easy twice or level 5), a forgets flag (two forgots, or easy then lost), the evidence newest first, the date last touched. Then two lists: Foundations, and Difficult or forgotten. Generated, not yours, regenerated whole on every run.

## Every doc here is a model's

The first line of each summary and the header of each PDF say so. This folder is public on GitHub and syncs to the iPad, so nothing here should be mistaken for Adit's writing; the notebook's own rule, that prose is the owner's, does not apply inside content/teach/. Nothing in any doc is copied from a book, a paper or a competition: standard results are stated and proved, problems are named by source and number, and every worked example is invented for the doc.

## Deleting it

Delete content/teach/, the line and paragraph about it in CONTEXT.md, and .claude/skills/teach. The plugin's mark commands then do nothing useful and can stay or go with the plugin. Nothing in the ledger or the site refers to this folder.
