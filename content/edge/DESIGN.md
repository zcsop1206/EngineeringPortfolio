# Edge — design v0.1

What changed from v0, why, and what the evidence was. PROTOCOL.md is the rules;
this file is the reasoning. Read this when the rules feel arbitrary.

## 1. Self-sufficiency is defined, not hoped for

A transition (UK→KK, KU→KK, UU→KU) **counts only if I performed it by hand**: wrote
the derivation, drew the picture, built the thing, named the question. Software and
models are allowed to do exactly three things:

1. **Surface a signal**: a number, a highlighted token, a neighbour's name, a feature
   label, a due date. Never a sentence that could stand in for my derivation.
2. **Schedule**: tell me what is due.
3. **Count**: show where knowledge is sitting.

Rule of thumb: *signals, not sentences*. If a tool's output could be pasted into a
schema file, the tool is doing my transition for me and is misdesigned.

## 2. The Socratic gate now guarantees feedback

v0 said "attempt first, AI withheld". The pretesting literature is more specific:
unsuccessful retrieval attempts improve later learning **when feedback follows**
(Kornell, Hays & Bjork 2009; Richland, Kornell & Kao 2009). An attempt with no
feedback is just a guess that decays. So the gate is now a two-step contract:

1. Attempt in writing.
2. Then feedback, from the cheapest source that preserves my derivation:
   - **reality** (run it, build it, measure it). Best, because it never hands me words.
   - **a primary source I read myself**
   - **a counterexample or error-check** from a person or model: "wrong, here is a case
     where it fails" tells me *that* I am wrong without telling me *what is right*
   - **a hint one level up**: the next sub-question, never the answer

The boundary question (when is attempting wasteful?) stays open. One datum: the
pretesting effect was shown with *weakly related* cue-target pairs, i.e. where some
prior structure existed. Zero-structure domains may be where reading first is right.

## 3. Obsidian is the interface; the script becomes optional

The folder is designed to be dropped into a vault as `edge/`. Native features used:

| need | Obsidian feature | replaces |
|---|---|---|
| what is due, what is open, where knowledge sits | **Bases** (`views/*.base`, core since 1.9) | `edge due`, `edge stats` |
| links between questions, schemata, projects | wikilinks + graph view; orphan nodes = isolated knowledge | nothing; new |
| spatial representation of a schema | **Canvas** (core) or Excalidraw | nothing; new |
| templates | core Templates plugin pointed at `edge/templates`, `{{date}}` | `edge new` |
| capture on phone | Obsidian mobile, append to `inbox/inbox.md` | `edge capture` |

Drills no longer live in `drills.md`. They live **on the schema** as frontmatter
(`drill_prompt`, `drill_next`, `drill_interval`, `drill_mode`), so a schema and its
drill cannot drift apart, and `views/due.base` filters `drill_next <= today()`.
Pass/fail is a two-property edit by hand; `edge.py drill` does the same arithmetic if
I want it.

Frontmatter uses true/false booleans and no inline comments, because Obsidian's
property editor rewrites frontmatter and would drop the comments.

## 4. Representations: the schema is not its sentence

Wammes, Meade & Fernandes (2016): drawing a to-be-remembered item beats writing it,
across seven experiments, and the effect survives a four-second time limit. Their
account is that drawing integrates semantic, visual and motor traces. That is a
mechanism I can use deliberately, so every schema now has a `## Representations`
section with four slots:

- **verbal**: the statement (required for `cold: true`)
- **visual**: a sketch with no words, as a canvas, excalidraw file or photo
- **spatial / kinesthetic**: a gesture, a physical layout, a walk-through, an analogy
  to a body movement
- **built**: a circuit, a sim, a jig, code, a physical model

Two consequences:

1. **Drills rotate modality.** `drill_mode` is one of `verbal | visual | built |
   constrained`. Confidence 3 requires the schema produced cold in at least two modes.
2. **Translation failure is an unknown-unknown detector.** When I try to draw a
   verbal schema and cannot place something, that something is an unstated quantity
   or relation. Log it as `!`. This costs nothing and needs no model.

## 5. Linguistic constraints as derivation paths (`constrained` drills)

Cheap, derivation-preserving, no tooling. Restate the schema under a constraint and
note where it breaks:

- **taboo**: restate without its three key terms
- **budget**: restate in exactly 12 words, then in 40
- **negation**: state three things it is *not*, and why each is close
- **audience**: to a first-year, to a specialist in a neighbouring field
- **other language**: if I hold one, restate in it; what has no word there?

Each constraint forces a different path through the derivation. Where I stall is
where the schema is held as a phrase, not an understanding.

## 6. Computational probes: what "schema aligned with a vector" can mean

The idea was to check whether a schema aligns with a direction in an open-weight
model's representation. The interpretability literature supports a version of this:

- **Linear representation hypothesis** (Park, Choe & Veitch 2023, ICML 2024): many
  concepts are directions in a model's representation space, with a formalisation on
  both the input (context) and output (unembedding) side. Follow-up (Park et al.
  2024, ICLR 2025): categorical concepts are polytopes and hierarchy shows up as
  orthogonality, validated on Gemma and Llama-3 with 900+ WordNet concepts.
- **Gemma Scope** (Lieberum et al. 2024): open sparse autoencoders on every layer of
  Gemma 2 2B and 9B, weights on Hugging Face, feature labels browsable on
  Neuronpedia. This gives named, human-readable directions.

Two honest limits:

1. A schema is a paragraph, not a token. The unembedding matrix has a vector per
   *token*; it has nothing to say about a sentence. The right objects are residual
   activations, SAE features, and sentence embeddings.
2. Alignment measures agreement with **written consensus**, not truth. A schema that
   aligns strongly may be a borrowed cliché. One that does not may be original or
   confused. The signal is two-sided and I must do the interpreting.

Given that, three probes, ordered by cost. Specs and the first script are in
`probes/`. Every probe emits signals only (section 1).

| probe | model | signal | what it detects |
|---|---|---|---|
| **A surprisal** | any small local LM (Gemma 2 2B, Qwen, Llama) | per-token surprisal of the statement; completion of its second half from its first | *where* my wording departs from consensus; whether the schema is well-worn (borrowed) or mine |
| **B footprint** | Gemma 2 2B + Gemma Scope SAE, mid layer | top active features with Neuronpedia labels | concepts latent in my own words that I have not named (UK); features present in a question but absent from every schema (gap) |
| **C neighbourhood** | local embedding model + a concept corpus (WordNet, Wikipedia titles, domain glossaries) | nearest unknown concepts to each schema; pairwise distances between my schemata | adjacent unknown unknowns; two schemata that are secretly one; isolated schemata to sweep |

Probe A is the first to build: one model, no corpus, and the token-level view is the
most directly useful.

## 7. Open questions carried into v0.1 (tracked in questions/)

- when does attempting become wasteful, and how do I detect that in the moment
- is daily triage the ritual that survives, or does capture need to be even cheaper
- which single probe signal, if any, changes a decision I would otherwise make
- do non-verbal modalities need their own `cold` flag, or is two-mode confidence enough

## Sources

- Obsidian Bases: https://obsidian.md/help/bases/syntax , https://obsidian.md/help/bases/functions , https://obsidian.md/changelog/2025-05-21-desktop-v1.9.0
- Gemma Scope: https://arxiv.org/abs/2408.05147 (weights: huggingface.co/google/gemma-scope, demo: neuronpedia.org/gemma-scope)
- Linear representation hypothesis: https://arxiv.org/abs/2311.03658 ; categorical/hierarchical geometry: https://arxiv.org/abs/2406.01506
- Drawing effect: Wammes, Meade & Fernandes 2016, https://fermatslibrary.com/s/the-surprisingly-powerful-influence-of-drawing-on-memory
- Pretesting: Richland, Kornell & Kao 2009, https://learninglab.uchicago.edu/Pre-Testing_files/RichlandKornellKao.pdf ; review https://journalofcognition.org/articles/455
