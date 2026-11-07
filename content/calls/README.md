# Calls

A ledger of modelling calls made before the answer exists, and a script that counts them. The skill kept here is choosing the model: which theory applies, what to assume, how much fidelity is enough to decide or ship. Under deadline that choice goes to the tool at the first missing prerequisite, and studying the result afterwards recovers nothing, because nothing was committed to. So the commitment is written first, tested later, and the misses are kept. One rule: no tool prompt on a modelling question until the call line is typed.

## The line

Two kinds of line, both in calls.md. Everything else in the file is ignored.

    c<N> <domain>: <text> [<conf>]
    c<N> held|missed|moot[: <text>]

N is a positive integer, unique, no leading zeros. The domain is one token starting with a letter; math, putnam, asic, furnace and retro-<x> are the conventions. The text is the model, what is assumed, how much fidelity, for which decision. The confidence is an optional 0 to 100 at the end. held: what was called was what was needed. missed: it was not, and the text says what was. moot: never found out. The last settle for an id wins. A call cites an earlier one by writing its id in the text.

    c1 furnace: 1-D along the axis, radial lumped, ends open to the room, no radiation. Enough to rank what to measure first. 70
    c2 math: pigeonhole on residues mod n. Assume n prime first, generalise after. 10 minutes before I switch. 55
    c1 missed: radiation off the element matters above 900 C; the ranking held anyway.
    c2 held
    c9 asic: cycle-accurate only at the interface, behavioural inside, as in c1 where lumping the inside was enough. 60

A line may start with a list marker and a date, as in `- 2026-12-05 c14 putnam: ...`. A typed date wins; otherwise the date comes from git blame, and an uncommitted line is dated the day the tally runs. Earlier means by date, then id. Adit is the only writer of calls.md. readout.md is generated, not Adit's, and deletable.

## The rule

A modelling question is any point where which theory, what assumption or how much fidelity is being decided. The line takes fifteen seconds. After it exists the tool is fair game, at once. A call written after the tool has answered is not a call, and the miss rate will show it.

## Running the tally

From the repo root, on the laptop:

    node content/calls/tally.mjs            writes readout.md, prints the verdict
    node content/calls/tally.mjs --check    no write; prints problems, exit 1 if any
    node content/calls/tally.mjs --stdout   prints the readout instead of writing it

readout.md: a header with the run date and where the dates came from; Verdict, one row per check below; Next id; Open, oldest first, with ask on those past the window; Arrivals; Misses, newest first, which is the skill written down; Domains, with each domain's first call; Weeks, the last eight; Problems. It needs Node. Without git, undated lines are dated the run day and silent weeks are not assessed. The iPad only writes calls.

## How the experiment reads out

Working, read off the Verdict:

- calls happen: a call in every week since the start, and math plus putnam calls per week at or above the knob from the week of 2026-11-09
- calls get settled: no open calls older than the settle window; moot share at or below the knob
- calls are real bets: miss rate over settled non-moot calls inside the band once five are settled; below it the calls are too safe or written after the fact, above it fidelity is not being asked
- calibration: mean confidence of settled non-moot calls that carry one is within the knob of their held percent
- transfer: from the second month with calls, at least the knob's number of call-text citations that settle held per month, and one arrival by 2027-01-18

Not working: a completed week with commits under content/projects/ and no call; open calls past the window piling up; a miss rate below the band; no arrival by 2027-01-18.

Putnam, 2026-12-05: calls on paper per problem during the exam, typed in after with the date, settled against the published solutions. Evidence: the putnam row under Domains and its lines under Misses. ASIC, due 2027-01-18: the first asic call dated before the first tool prompt. Evidence: the asic date in the Verdict row "test domains first call", the asic row under Domains, and Arrivals.

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
| test domains | putnam, asic | 2026-11-07 |

## First week

Start with [retro.md](retro.md): the furnace and the ASIC decision points as questions, called cold in a retro-<x> domain and settled against the code. The first misses in an hour. Then live calls. The bottom of calls.md shows the last id.

## Not verified

(filled in by the orchestrator after integration)

## Deleting it

calls.md is the only file Adit types in. Copy it anywhere, then delete content/calls/ and the two mentions in CONTEXT.md (the layout line and the paragraph). Nothing else refers to it; the site never reads it.

## Coexistence

content/edge/ and the installed copy of its plugin (content/.obsidian/plugins/edge, gitignored) were removed on 2026-11-07 in the first commit on this branch, recoverable from history before it. The plugin's own repo at Documents/obsidian-edge is untouched. This system shares nothing with it.
