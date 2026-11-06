# probes

Computational instruments that read schemata and questions and emit **signals only**:
numbers, highlighted tokens, feature labels, neighbour names. Never prose that could
be pasted into a schema. See DESIGN.md section 1 and 6.

Each probe writes its output to `probes/out/<schema>.<probe>.<model>.md` so it can be linked
from the schema's `## Probe notes` section. The interpretation is written by hand.

## A. surprisal (first to build) — `surprisal.py`

Needs: `pip install torch transformers`, a small local causal LM. Default is
`google/gemma-2-2b` (needs Hugging Face login once). Any causal LM works; try
`Qwen/Qwen2.5-1.5B` if Gemma is a hassle.

Reads the `## Generalization` of one schema file (older files: `## Statement`). Emits:

1. per-token surprisal (bits), rendered as the statement with tokens above a
   threshold wrapped in `==highlight==`. These are the words where my phrasing leaves
   the consensus path. Decide by hand: original, idiosyncratic, or confused.
2. mean surprisal per token, as one number, for comparison across schemata.
3. **completion test**: the model greedy-completes from the first half of the
   statement. Printed next to my real second half. If it lands on my phrasing, the
   schema is well-worn in language: likely borrowed, go check the derivation is mine.
   If it lands elsewhere, note where it diverges.

Signal, not verdict: high surprisal is not bad, low surprisal is not good.

```
python probes/surprisal.py schemata/attempt-before-assist.md
python probes/surprisal.py schemata/*.md --model Qwen/Qwen2.5-1.5B
```

Untested as of 2026-10-17: written without a model present. First run is itself a
prediction to log: "it runs on the first try, p=0.4".

## M. map (built 2026-10-20) — `map.py`

Embeds every unit in the vault (writeup sections, log entries, schemata, exemplars,
questions) with all-MiniLM-L6-v2 through transformers, offline, and projects to 2-D with
t-SNE. Clusters activity into regions by meaning. Emits `probes/out/map.svg` and
`probes/out/map.md` (embed the SVG in a note; the md lists each region's sections as links).

What the four states look like on it: held schemata are solid dots; open questions are
rings; a region of activity with no schema inside is an unknown known, and one that spans
projects is the strongest candidate; the dashed hull is the edge of what is documented.
Unknown unknowns are kept unmapped, by decision (2026-10-20): nothing is drawn beyond the
frontier, because it would be a reference corpus's map rather than mine. They enter through
anomalies and lens sweeps. `--reference FILE` exists in the code but is dormant.

```
python probes/map.py
python probes/map.py --threshold 0.5
```

## B. footprint (second) — not built

Gemma 2 2B + a Gemma Scope SAE at a middle layer (residual stream, layer ~12 of 26).
For each schema: top-k active SAE features by max activation over the statement's
tokens, with Neuronpedia labels fetched by feature id. Emit:

- the feature labels, ranked. Labels I do not recognise as part of the schema are
  concepts latent in my own words: candidate unknown knowns.
- feature overlap matrix across all schemata. Shared features across schemata from
  different domains: candidate meta-schema I have not named.
- features active in a question's text but in no schema: the gap the question sits in.

Cost: ~5 GB of weights plus one SAE (~300 MB). Build after probe A has changed at
least one decision, else it is a toy.

## C. neighbourhood (third) — not built

Local embedding model (e.g. `nomic-embed-text` or `bge-small`) over two sets: my
schemata, and a concept corpus for my domains (WordNet synsets, Wikipedia titles in a
category tree, textbook glossaries). Emit:

- for each schema, the ten nearest corpus concepts I have **no file for**. Adjacent
  unknown unknowns, by construction.
- pairwise distances between my schemata. Two very close: possibly one schema under
  two names. One far from all: isolated, sweep it next.

Depends on a corpus choice, which is itself a lens decision. Do not pick the corpus
before probe A exists.

## Non-computational probes (already in PROTOCOL.md, cheaper, do these first)

- **translation failure**: draw the schema with no words; whatever cannot be placed
  is an unstated quantity or relation.
- **constrained restatement**: taboo, word budget, negation, audience, other language.
