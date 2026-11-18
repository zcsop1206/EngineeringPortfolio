---
study: guide
---

# How to use study mode

Written by a model for Adit. Not Adit's words. Last updated 2026-11-18, early morning, for MIE342 test 2 (Notebook 0.15.0 is released).

## This morning: MIE342 test 2 (11:20 to 12:30)

Open `topics/mie342-test2` ("MIE342 test 2: circuits") first. Its first paragraph is the plan:
- about 40 minutes on the theory: down Recognise, then First moves and Traps, saying each cue's result before you open its link;
- about 70 minutes on its six Try problems, in order, call first, with a timer;
- 20 to 30 minutes on the linked passages for whatever you missed.

The four circuits basics (el-dc-analysis, el-equivalents, el-cap-ind, el-first-order) hold the proofs and more problems. Today, open them from a link when you miss something, not cover to cover; they stay for the final. Your problem sets are in the `mie342` bank by number: the statement is in your PDF.

Figures: every circuit problem has its schematic, and every waveform asked has a plot. They sit inside the passage or problem, so the Pencil writes over them in the doc; the plots that give an answer away are inside the folded solution.

One 0.15.0 bug to know about: in the study view, a worked example (an `example` callout in a basic) shows no solution. To see one, open that basic from the file list instead, where the folded solution under the example opens with a tap. 0.15.1 fixes it.

## The docs (work now, with or without the plugin)

Open any file in `study/` in Obsidian. Proofs and solutions are folded: try first, then tap the fold open. Links go to the one place a result is proved; follow one when you need it, not before.

| folder | what | start with |
|---|---|---|
| basics/ | fundamentals, each proved once, ending in derive prompts and problems | today the circuits four, from links; then the Putnam ones: nt-congruence, alg-polynomials, an-limits-series |
| topics/ | first moves for a test or a contest: recognise, first moves, traps, where it hides, try | mie342-test2 this morning; then putnam-polynomials, and putnam-sums-limits from 11-23 |
| bank/ | course, Putnam and seminar problems by number, with links to the papers where they are public | the Try sections point into it |
| figures/ | the schematics and plots the docs embed | nothing to open on its own |
| katas/ | digital-design katas with test vectors; the study view runs your Verilog against them | k-shift-out, then k-uart-tx |
| cards/ | numbers cards for your public projects: recall prompts, answers folded | before any interview |

Without the plugin, a problem's call still goes first: write the call on paper or in calls.md before you open the solution.

## The plugin (Notebook 0.15, study mode)

**Install:** 0.15.0 is released; BRAT updates Notebook on the iPad (BRAT, check for updates, if it has not yet). Settings, Notebook, Study: the study folder is `study`; the device name fills itself in (ipad, desktop), so the two devices never share a log file; weekday minutes sets how much Today plans.

**Open:** the ribbon has a study icon (the library) and a Today icon. Commands: "Open study", "Open Today", "Open study map", and "Open as study doc" in a study doc's file menu.

**Reading:**
- A finger tap on a link follows it; Back returns to where you were. A finger hold peeks at the target without leaving.
- The Pencil writes anywhere on the page, also over links and formulas, and never follows a link. Your ink stays with the passage it was written on, even after the doc is rewritten (changed passages show their old ink faded, with keep or delete).
- Each passage has a dot in the right margin: tap it for **lost**, **easy** or **forgot**.

**What "lost" does (the ration):**
- In a **basic**: it asks for the whole basic to be rebuilt from its prerequisites (two taps to confirm). `/teach` on the laptop does the rebuild.
- Anywhere else: first a scaffold appears, with the basics that passage stands on, their stages, and an attempt box. Work in the box. After 24 hours, with ink in the box, you can request a rewrite (two taps; 3 per doc). After 3, it offers a drill on the weakest basic instead.

**Proof fog:** at first a proof shows one step per reveal, and a reveal needs three new strokes of your own. As a basic's stage rises, proofs come in chunks, then cold from a blank page, then as a problem before the proof (a "hook"). Ink written after a reveal is drawn in a second colour, so you can see what was yours.

**Drills:** derive prompts and cold proofs open a blank page; Done after three strokes; then the steps; grade yourself clean, shaky or failed. Clean moves the basic up a stage (1, 2, 4, 7, 14, 30 days); failed sends it back to the start.

**Problems:** ink your call first; the confidence chips unlock after ink; a timer runs; settle held, held after help, missed, blind or moot (two taps); then tick the methods you called and the ones the solution used ("Skip ticks" if you must); then the solution opens. Some of Today's problems hide their topic ("?"), to train naming the method; those are picked a little easier, and get harder as you name methods right. One known gap: finish a problem where you started it. A problem begun inside its doc and reopened from Today shows an empty call band.

**Katas:** sketch the design call first (the Pencil alone unlocks the chips), then write the Verilog in the editor, Run, and the first mismatching cycle and signal show. Settle and tick as with problems.

**Today and Map:** Today lists 2 to 4 drills, up to three problems for each area with a live deadline (you should solve about two in three), the kata slot while the ASIC track is live, and the next deadline. Map shows the basics as a graph coloured by stage, your rating per area, how often you name the method, and which weak basics block each track.

## On the laptop

- `/teach` in Claude Code (portfolio repo): answers the rebuild and rewrite requests from the iPad, keeps every anchor, bumps the doc's build, and adds a Changes line. Sync afterwards so the iPad gets the new build.
- `node ../obsidian-notebook/scripts/study-scan.mjs content/study` shows what the iPad asked for and what you settled.
- `node pm/timeline.mjs` writes `pm/timeline.md`: hard dates, every dated deadline week by week, then the undated ones ranked. Add a date to a line in `pm/tasks.md` and run it again.
- `content/study/tracks.md` sets the deadlines the schedule works toward; edit it there.
- The circuits figures come from scripts in `drafts/study-private/figures/` (laptop only, not in the repo): `python <doc-id>.py` redraws one doc's figures, and every circuit in them is solved by `circuitlib.py`, not typed in.

## The next three weeks

| when | what |
|---|---|
| Wed 11-18 | MIE342 test 2, 11:20 to 12:30: topics/mie342-test2 this morning |
| now to 11-22 | polynomials week: basics alg-polynomials and nt-congruence, topic putnam-polynomials, one problem a day |
| 11-23 to 11-27 | sums, integrals and limits: an-limits-series, an-integration, ineq-convexity, topic putnam-sums-limits |
| Sat 11-28 | timed half paper |
| Wed 12-02 | mock |
| 12-03 to 12-04 | taper: drills only |
| Sat 12-05 | Putnam |
| 12-07 on | ASIC: dd-* basics and the katas, then the entry's own milestones (pm/timeline.md) |

Interviews: drill one numbers card a day (cards/), and read the private company map (`interview-prep/companies-2027.md`, laptop only) for which basics each screen probes.
