# Calls

A ledger of modelling calls made before the answer exists, and a script that counts them. The skill kept here is choosing the model: which theory applies, what to assume, how much fidelity is enough to decide or ship. Under deadline that choice goes to the tool at the first missing prerequisite, and studying the result afterwards recovers nothing, because nothing was committed to. So the commitment is written first, tested later, and the misses are kept. One rule: no tool prompt on a modelling question until the call line is typed.

## Writing

Open calls.md, go to the end, type one line. No id, no date, no form:

    furnace: 1-D along the axis, radial lumped, ends open, no radiation. Enough to rank what to measure. 70

The first word is the domain (math, putnam, asic, furnace, retro-furnace, system, or anything), then the model, what is assumed, how much fidelity and for which decision, then an optional 0 to 100 for how sure you are. When you find out, one more line, on its own, anywhere below:

    missed: radiation off the element matters above 900 C; the ranking held anyway.

held: it was what was needed. missed: the right model was on your list and you chose wrong. blind: it was never on your list. moot: never found out. A bare settle applies to the nearest open call above it. The tally numbers the lines (c1, c2, ...) the next time it runs on the laptop, so an older call can be settled or cited by its id: `c9 held`, or "as in c1" inside a new call's text. The ids appear in your file; nothing else in it is ever changed. Dates come from git; type one only when a line is written later than the thought, as on the Putnam day: `2026-12-05 putnam: ...`.

Adit is the only writer of calls.md. readout.md, nudge.md and profile.md are generated, not Adit's, and deletable.

## The rule

A modelling question is any point where which theory, what assumption or how much fidelity is being decided. The line takes fifteen seconds. After it exists the tool is fair game, at once. A call written after the tool has answered is not a call, and the miss rate will show it. Changes to the system are calls too, in the domain system, settled by the readout later; a knob's since cell may carry that id.

## Set up once

- Obsidian, laptop: open calls.md, right-click its tab, Pin. It stays open; Ctrl+End goes to the bottom.
- Obsidian, iPad: in Shortcuts, add an Open URL action with `obsidian://open?vault=content&file=calls%2Fcalls.md` and put it on the home screen.
- Laptop watcher: double-click [watch.cmd](watch.cmd), or run it from a shell; `watch.cmd stop` stops it. It starts at logon through the shortcut "Calls watcher" in the Startup folder (Win+R, `shell:startup`), added 2026-11-07.

## While working

With the watcher running, every save of calls.md regenerates readout.md and numbers new lines. The system speaks in exactly two shapes, both quoting only your own lines, to nudge.md and a Windows notification: once a day, on your first new call, what is dormant; and on a new call that shares enough words with an earlier miss without citing it, that miss. Nothing else, ever. Keep nudge.md in a side pane and it updates on its own.

## The readout

readout.md: a header with the run date and where the dates came from; Verdict, one row per check below; Next id; Open, with ask on those past the window; Arrivals; Misses, which is the skill written down; Known, what held per domain with its lineage; Dormant; Domains; Weeks; Problems. By hand, from the repo root: `node content/calls/tally.mjs` writes it, `--check` only lists problems, `--stdout` prints it, `--watch` is what watch.cmd runs.

Weekly, in Claude Code opened at this repo: `/profile` clusters the misses into named weaknesses, says which later calls applied them, lists what is dormant, sets up to three analogy drills (A : B :: C : ?, from your own lines, blank left blank), and asks at most three one-word questions. The docs that rewrite to your level are the separate [teach](../teach/README.md) layer, run with `/teach`.

## How the experiment reads out

Working, read off the Verdict:

- calls happen: a call in every week since the start, and math plus putnam calls per week at or above the knob from the week of 2026-11-09
- calls get settled: no open calls older than the settle window; moot share at or below the knob
- calls are real bets: miss rate over settled non-moot calls inside the band once five are settled; below it the calls are too safe or written after the fact, above it fidelity is not being asked
- calibration: mean confidence of settled non-moot calls that carry one is within the knob of their held percent
- transfer: from the second month with calls, at least the knob's number of call-text citations that settle held per month; one arrival by 2027-01-18; every blind later cited by a call that held
- nothing dormant past the window: no domain without a call, no miss without a later citation

Not working: a completed week with commits under content/projects/ and no call; open calls past the window piling up; a miss rate below the band; no arrival by 2027-01-18.

Putnam, 2026-12-05: four 90-minute sessions of three problems, a call per problem on the exam's scratch paper at the start of each. That paper is handed in, so the lines are rewritten from memory in the breaks and kept off the vault, which is public, because the rules forbid discussing the questions online before Tuesday 2026-12-08. From that day they are typed in with 2026-12-05 at the start of each line and settled against the published solutions. Evidence: the putnam row under Domains and its lines under Misses. ASIC, due 2027-01-18: the first asic call dated before the first tool prompt. Evidence: the asic date in the Verdict row "test domains first call", the asic row under Domains, and Arrivals.

The knobs. Change one value and its date at a time; tally.mjs reads this table.

| knob | value | since |
|---|---|---|
| settle window days | 14 | 2026-11-07 |
| math calls per week | 6 | 2026-11-07 |
| miss rate low | 20 | 2026-11-07 |
| miss rate high | 60 | 2026-11-07 |
| calibration gap points | 15 | 2026-11-07 |
| citations per month | 1 | 2026-11-07 |
| moot share max | 25 | 2026-11-07 |
| dormant weeks | 4 | 2026-11-07 |
| resemblance | 25 | 2026-11-07 |
| test domains | putnam, asic | 2026-11-07 |

## First week

Start with [retro.md](retro.md): the furnace and the ASIC decision points as questions, called cold in a retro-<x> domain and settled against the code. The first misses in an hour. Then live calls.

## Not verified

Built 2026-11-07 without opening Obsidian: how the vault shows the .mjs and .cmd files, and what the iPad sync does with the folder, were not checked. No real call has been made yet; every readout section, the nudges and the numbering were exercised on fixtures and on a scratch clone, where git dated a committed call correctly; lines synced from the iPad carry the sync time. The rule itself cannot be checked by the system. The toast was triggered but not seen on screen. The site's tests and the publish guard pass; the full site build was not run. retro.md's pointers were checked as of 2026-11-07; the ASIC uniqueness run (question 7) has no code in its repo. 2026-12-05 is assumed to be the Putnam date.

## Deleting it

calls.md is the only file Adit types in. Copy it anywhere, then delete content/calls/, the two mentions in CONTEXT.md (the layout line and the paragraph), the shortcut "Calls watcher" in the Startup folder, and .claude/skills/profile. The teach layer is deleted separately. Nothing else refers to it; the site never reads it.

## Coexistence

content/edge/ and the installed copy of its plugin (content/.obsidian/plugins/edge, gitignored) were removed on 2026-11-07 in the first commit on this branch, recoverable from history before it. The plugin's own repo at Documents/obsidian-edge is untouched. This system shares nothing with it.
