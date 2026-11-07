# Teach

Docs that rewrite themselves to Adit's level, and a record of that level per topic. A layer beside the calls ledger, not part of it: the ledger records judgment, this records understanding, and they meet only through readout.md.

## Marking a doc

Read a doc here in Obsidian. Where it misjudges you, append one comment after the passage, on the laptop or the iPad:

    %% lost %%      beyond me
    %% easy %%      too easy
    %% forgot %%    I knew this and it is gone

A reason is optional: `%% lost: where does the second term come from %%`. Comments are invisible in reading view.

## Running the pass

From Claude Code opened at the repo root:

    follow content/teach/teach-prompt.md
    follow content/teach/teach-prompt.md and write a doc on <topic>

The pass rewrites only the marked passages (lost: from further back, with terms defined; easy: compressed to the result; forgot: the shortest derivation from something you still hold), removes the marks, logs what moved under the doc's Changes, and regenerates levels.md. It also reads the Misses and Dormant sections of content/calls/readout.md: a miss whose words match a topic counts as a lost mark, a dormant one as a forgot. It never writes to calls.md and never speaks during work.

## levels.md

One line per topic: level 1 to 5, a foundations flag (never lost, easy twice or level 5), a forgets flag (forgot twice, or easy then lost), the evidence newest first, the date last touched. Then two lists: Foundations, and Difficult or forgotten. Generated, not yours, regenerated whole on every run.

## Every doc here is a model's

The first line of each doc says so. This folder is public on GitHub and syncs to the iPad, so nothing here should be mistaken for Adit's writing; the notebook's own rule, that prose is the owner's, does not apply inside content/teach/.

## Deleting it

Delete content/teach/ and the line about it in CONTEXT.md. Nothing in the ledger or the site refers to it.
