# Alternatives

What was fitted against the brief on 2026-11-07 and why the ledger won. For reading once.

The brief: the skill of choosing the model (which theory, what assumptions, how much fidelity) goes to the tool at the first missing prerequisite under deadline, and studying the tool's output afterwards does not form it. Three constraints came with it:

- nothing that interrupts the work
- nothing that asks for patience, which Adit has trained out on purpose
- nothing that becomes a third thing to maintain

## What was fitted

A checklist or schema per decision, with fields for theory, assumptions and fidelity. Rejected. It is a form, and a form does not get filled under deadline. The tool can also fill it faster and better than Adit, so a completed one captures nothing the tool did not already do.

Spaced repetition of past models: situation on the front, model on the back. Rejected. It preserves recall of models, and recall is not choice; the skill is picking under uncertainty, not remembering what was picked. It gives no evidence about new domains, since there are no cards for them yet. And it is a third thing to maintain.

Reconstruct after the fact: study the tool's output and write why that model. Rejected by the brief itself. There was no commitment, so there is no error signal, only agreement with an answer already seen. Adit already does this and reports that it does not form judgment.

Decision entries in the project log, as type: decision under content/projects/<slug>/log/. Rejected. Each decision is a file with frontmatter, public on the site by default, and the cost per record is above the cost of the thought it records. There is nowhere for Putnam, which is not a project.

Timed solo work before the tool: N minutes alone, then ask. Rejected. This is patience under another name, which Adit has explicitly trained out and does not want back. It also measures endurance, not the choice; a person can sit for N minutes and still not commit.

A model in the loop that asks "what is your model?" before each prompt, as a plugin or hook. Rejected. It interrupts, and not interrupting is non-negotiable. Once the asker is software, the answer becomes a form, and the first rejection applies.

The previous edge system: content/edge/, prediction and lens-sweep notes, Bases views, a plugin. Not read, by instruction. Removed on 2026-11-07 at Adit's choice, in the first commit on the branch; recoverable from git history before it. The contract is that the new system shares nothing with it.

The chosen design: a ledger of calls and settles with ids, so a later call can cite an earlier one, and a tally that counts, flags open calls, and lists misses and arrivals. Two moving parts.

## Why this one

The record is made before the answer, so it carries an error signal; everything rejected above either had none or had to be filled after the fact. The cost is one typed line, and a line is cheaper than the thought it records. The tool is allowed immediately after the line, so pace is kept and nothing is waited out. The citation gives a concrete, cheap, falsifiable definition of transfer: a call in a new domain that names an earlier settled call from another domain and then holds. The misses list is the skill written down, and it is about Adit, not the domain. Every pre-registered criterion is readable off one generated file. The knobs are in one table.

## Variations inside the chosen design

Each pair was fitted both ways. The choice and the reason:

Ids typed by Adit or assigned by the tally: typed.
A citation has to work before the tally runs, on the iPad, with no script. The cost is a glance at the last line.

Dates typed or from git: from git, with a typed date winning when present.
A typed date is friction on every line and git already knows when the line arrived. The typed form exists for the exam, where the lines are written on paper and entered later.

One ledger, or one file per domain or per call: one ledger.
Appending a line is the cheapest act on both devices, and the tally does the splitting by domain.

Settle lines appended, or edited into the call line: appended.
The date of finding out is information; the gap between call and settle is one of the readout's columns. Appending also needs no navigation to the old line.

Confidence required or optional: optional.
Calibration is computed only over calls that carry one. This is the knob most likely to be turned, so it starts loose.

A weekly scheduled tally, or run by hand: by hand first.
A schedule is a third part. If the readout shows the tally is not being run, add a schedule then, as a knob change.

Calls allowed anywhere in the vault and swept by the tally, or only in calls.md: only calls.md.
Ids need a last line to read, and one file is one place to look.

Not fitted as an alternative, but used: retroactive seeding in retro.md, the same two parts run against known answers from past projects. Weaker evidence, since the answer is known, but the fastest way to the first misses.

## The two unknowns

Adit said they did not know what the skill looks like written down. The position taken: it is the misses list in readout.md, each line a model that was called and what was actually needed instead. That list is about Adit and not about the domain, because the same person made each call; it is the portable part. If the list stays empty over thirty settled calls, the calls are too safe, and the band on miss rate is there to say so.

Adit said they did not know what counts as arrival in a new domain. The position taken: a call in a domain with no earlier calls that cites an earlier call from another domain by id, one already settled on or before the day of the citing call, written before the answer is known, and that then settles as held. Earlier means by date, then id, so the Putnam lines typed in after the exam with their date sort where they were written. The citation is the carrier, since it is the only visible trace of one domain's judgment being used in another. It is cheap to write, it can be wrong, and the readout lists each one. If it turns out to be too narrow, the definition lives in one place and the knob for citations per month is the first thing to loosen.
