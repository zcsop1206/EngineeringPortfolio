# Calls

A ledger of modelling calls made before the answer exists, and a script that counts them. The skill kept here is choosing the model: which theory applies, what to assume, how much fidelity is enough to decide or ship. Under deadline that choice goes to the tool at the first missing prerequisite, and studying the result afterwards recovers nothing, because nothing was committed to. So the commitment is written first, tested later, and the misses are kept. One rule: no tool prompt on a modelling question until the call line is typed.

## The line

Two kinds of line, both in calls.md. Everything else in the file is ignored.

    c<N> <domain>: <text> [<conf>]
    c<N> held|missed|blind|moot[: <text>]

N is a positive integer, unique, no leading zeros. The domain is one token starting with a letter; math, putnam, asic, furnace and retro-<x> are the conventions. The text is the model, what is assumed, how much fidelity, for which decision. The confidence is an optional 0 to 100 at the end. held: what was called was what was needed. missed: it was not, the right model was on your list and you chose wrong, and the text says what was. blind: the right model was never on your list. moot: never found out. Together these are the frame: known known, known unknown, unknown unknown, and a blind later cited by a call that held is the transition the readout counts. The last settle for an id wins. A call cites an earlier one by writing its id in the text.

    c1 furnace: 1-D along the axis, radial lumped, ends open to the room, no radiation. Enough to rank what to measure first. 70
    c2 math: pigeonhole on residues mod n. Assume n prime first, generalise after. 10 minutes before I switch. 55
    c1 missed: radiation off the element matters above 900 C; the ranking held anyway.
    c2 held
    c9 asic: cycle-accurate only at the interface, behavioural inside, as in c1 where lumping the inside was enough. 60

A line may start with a list marker and a date, as in `- 2026-12-05 c14 putnam: ...`. A typed date wins; otherwise the date comes from git blame, and an uncommitted line is dated the day the tally runs. Earlier means by date, then id. Adit is the only writer of calls.md. readout.md is generated, not Adit's, and deletable.

## The rule

A modelling question is any point where which theory, what assumption or how much fidelity is being decided. The line takes fifteen seconds. After it exists the tool is fair game, at once. A call written after the tool has answered is not a call, and the miss rate will show it.

Changes to the system are calls too, in the domain system: what the change will do to the readout, with a confidence, settled by the readout later. A knob's since cell may carry that id, as in `2026-12-01 c50`.

## While working

The system speaks during work in exactly two shapes, both quoting only your own lines, and only when `node content/calls/tally.mjs --watch` is running on the laptop. Once a day, on the first new call, it lists what is dormant. On any new call that shares enough words with one of your earlier misses without citing it, it says so, with that miss's settle text. Nothing else, ever: no hints, no models, no questions. Each nudge goes to nudge.md beside the ledger and to a Windows notification; keep nudge.md open in a side pane in Obsidian and it updates on its own. `--no-toast` keeps the file only. `--nudge` runs it once without watching.

## Running the tally

From the repo root, on the laptop:

    node content/calls/tally.mjs            writes readout.md, prints the verdict
    node content/calls/tally.mjs --check    no write; prints problems, exit 1 if any
    node content/calls/tally.mjs --stdout   prints the readout instead of writing it
    node content/calls/tally.mjs --watch    reruns on every save of calls.md and nudges (see While working)

readout.md: a header with the run date and where the dates came from; Verdict, one row per check below; Next id; Open, oldest first, with ask on those past the window; Arrivals; Misses, newest first, which is the skill written down; Known, the calls that held, per domain, in your words; Dormant, domains with no call and misses no later call has cited in the dormant window; Domains, with each domain's first call; Weeks, the last eight; Problems. It needs Node. Without git, undated lines are dated the run day and silent weeks are not assessed. The iPad only writes calls.

## How the experiment reads out

Working, read off the Verdict:

- calls happen: a call in every week since the start, and math plus putnam calls per week at or above the knob from the week of 2026-11-09
- calls get settled: no open calls older than the settle window; moot share at or below the knob
- calls are real bets: miss rate over settled non-moot calls inside the band once five are settled; below it the calls are too safe or written after the fact, above it fidelity is not being asked
- calibration: mean confidence of settled non-moot calls that carry one is within the knob of their held percent
- transfer: from the second month with calls, at least the knob's number of call-text citations that settle held per month, and one arrival by 2027-01-18
- nothing dormant: no domain without a call, and no miss without a later citation, for longer than the dormant window

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
| dormant weeks | 4 | 2026-11-07 |
| resemblance | 25 | 2026-11-07 |
| test domains | putnam, asic | 2026-11-07 |

## The profile pass

The tally counts; it cannot say that three misses in two domains are the same weakness. [profile-prompt.md](profile-prompt.md) is a prompt a model runs over the ledger to write profile.md: what has held per domain in your words, the misses clustered into named weaknesses with whether any later call applied them, what is dormant, at most three one-word questions, and at most three analogy drills of the form A : B :: C : ? built from your own calls, with the blank left blank. It only links, counts, flags and asks. It is the one part with a model in the loop, it is run by hand, the tally never depends on it, and profile.md can be deleted on its own.

## First week

Start with [retro.md](retro.md): the furnace and the ASIC decision points as questions, called cold in a retro-<x> domain and settled against the code. The first misses in an hour. Then live calls. The bottom of calls.md shows the last id.

## Not verified

Built 2026-11-07 without opening Obsidian: how the vault shows the two .mjs files, and what the iPad sync plugin does with the folder, were not checked. No real call has been made yet, so every readout section beyond the empty state was exercised on fixtures and on a scratch clone with one committed call, where git dated it correctly; lines synced from the iPad will carry the sync time, not the writing time. The rule itself cannot be checked by the system: a call typed after the tool answered looks the same in the file. The site's tests and the publish guard pass; the full site build was not run. retro.md's pointers were checked against the repos as of 2026-11-07 and will drift as those files change; the ASIC uniqueness run (question 7) has no code in its repo. 2026-12-05 is assumed to be the Putnam date.

## Deleting it

calls.md is the only file Adit types in. Copy it anywhere, then delete content/calls/ (profile.md, readout.md and nudge.md are generated) and the two mentions in CONTEXT.md (the layout line and the paragraph). Nothing else refers to it; the site never reads it.

## Coexistence

content/edge/ and the installed copy of its plugin (content/.obsidian/plugins/edge, gitignored) were removed on 2026-11-07 in the first commit on this branch, recoverable from history before it. The plugin's own repo at Documents/obsidian-edge is untouched. This system shares nothing with it.
