# Edge — the core

v0.1 is procedure without a theory of what it is procedure *for*. It says capture,
triage, drill, sweep, but not what a schema is, what makes one valid, when it is
held, or why these four moves and not others. This note evaluates candidate cores
and recommends one. The test for a core: it must say, in a sentence each,

1. what a schema **is** (its parts),
2. when a schema is **held** (the test for known known),
3. what each **transition** mechanically consists of,
4. how a schema is **verified** without the verification doing my thinking,
5. why **unknown unknowns** exist at all, so that finding them is systematic
   rather than lucky.

A core that answers these should *shrink* the surface of v0.1, not add to it.

## Candidates

### A. Kuhn: a schema is a micro-paradigm

Kuhn's paradigm, in the 1969 postscript, is a disciplinary matrix with four parts:
symbolic generalizations (the laws you can write down), model commitments (what
kinds of things exist and what they are like), values (what counts as a good
solution: accuracy, scope, simplicity, fruitfulness), and **exemplars**, the shared
concrete problem-solutions through which the paradigm is actually learned. His
claim about learning is the one that matters here: scientists acquire a paradigm
by working exemplars, not by learning rules, and often cannot state the rules
afterwards. Normal science is puzzle-solving inside the matrix. Anomalies are
results the matrix cannot absorb. Enough anomalies make a crisis; a rival matrix
wins when it solves the anomalies and the old puzzles; the two are
incommensurable, which means they do not even agree on what the facts are.

Mapped onto the four states:

- **Known known**: I can solve a *new* puzzle of this type by exemplar transfer,
  and I can also state the generalization. Both halves. Kuhn's scientists
  typically have only the first.
- **Unknown known**: exemplars worked, rule never articulated. This is a *theory*
  of why unknown knowns exist, and it predicts where they are: wherever I am
  fluent but cannot teach.
- **Known unknown**: a puzzle the matrix defines as legitimate and solvable but
  that I have not solved.
- **Unknown unknown**: what the matrix makes invisible. Kuhn is explicit that a
  paradigm determines what counts as a fact. Unknown unknowns are therefore
  *structurally produced*, not random, and there are exactly two systematic ways
  in: anomalies (facts that resist the matrix) and an incommensurable matrix
  (another paradigm that sees different facts). v0.1's surprise log and lens
  sweep are these two, which is a justification v0.1 did not have.

Costs: Kuhn describes communities and centuries, not one person and a week.
Scaling down to "micro-paradigms" is my move, not his. Values are hard to make
operational for an individual. Incommensurability is contested and, taken
strictly, would make lens sweeps impossible (you cannot translate between
matrices); taken loosely it is the whole point of them.

### B. Lakatos: a schema is a research programme with a health metric

Hard core (commitments not revised), protective belt (auxiliary hypotheses revised
freely), negative heuristic (do not touch the core), positive heuristic (what to
try next). A programme is **progressive** if it predicts novel facts that are then
confirmed, **degenerating** if it only accommodates facts after they are known.

The gift here is a measurable health criterion that falls straight out of the
predictions table already in every project note. A schema that has made a dated
prediction, before the outcome, that came true, is progressive. One whose only
changes are after-the-fact patches to `fails_when` is degenerating and should be
replaced, not polished. Nothing else in the candidates gives a number this clean.

Costs: silent on tacit knowledge and on learning. Says nothing about how a schema
is acquired, only how it is judged.

### C. Piaget and Bartlett: assimilation and accommodation

The word "schema" comes from here. New information is **assimilated** into an
existing schema, or the schema is **accommodated** to fit it, and the system seeks
equilibration between the two. Transition mechanics in two verbs: known unknown to
known known is assimilation (the puzzle fits), unknown unknown to known unknown is
the failure of assimilation that forces accommodation.

Costs: no account of verification, no structure for what a schema contains, and a
developmental theory of children that is stretched when applied to a working
engineer. Keep the two verbs, not the theory.

### D. Bayesian: a schema is a hypothesis with a calibrated credence

Confidence becomes a credence, predictions become likelihoods, the whole system is
scored by calibration (Brier score over the predictions tables). This is the only
candidate with a built-in test of *me*, not just of the schemata: am I 70 percent
right when I say 0.7.

Costs: structureless. A credence on "retrieval attempts help recall" says nothing
about what the claim is made of, how to drill it, or what it makes invisible.
Calibration is a thermometer, not an anatomy. Keep the scoring, under B.

### E. Threshold concepts and skill stages

Meyer and Land's threshold concepts are transformative, irreversible, integrative
and troublesome: once you hold one, you see the field differently and cannot go
back. Dreyfus's novice-to-expert ladder says experts act from exemplars and lose
the ability to state rules, which independently confirms Kuhn on tacit knowledge.
Useful for **prioritising** which schemata to pursue (the troublesome,
transformative ones) and for the `cold` test (an expert's cold is exemplar
transfer, not recitation). Not a core on its own.

### F. LLM geometry: a schema is a set of directions in a model's representation

The proposal: the encoding (token embedding) and decoding (unembedding) matrices of
an open-weight model, plus its residual stream, carry concepts as directions.
Identify a schema's elements with directions; verify the schema by checking the
geometry. What the literature actually licenses:

- **Binary concepts are directions** (Park, Choe and Veitch, 2023): a concept
  with counterfactual word pairs (hot/cold, series/parallel) is a direction in the
  unembedding space, with a causal inner product under which unrelated concepts
  are orthogonal. This is estimated from word pairs, so a schema element has a
  direction only if I can write pairs for it.
- **Categories are polytopes, hierarchy is orthogonality** (Park et al., 2024): a
  child concept's direction, relative to its parent, is orthogonal to the parent's.
  So an *is-a* relation that my schema asserts has a geometric correlate I can
  check. Causal and functional relations do not; there is no "A causes B" geometry.
- **Sparse autoencoders give named directions** (Gemma Scope): a schema statement
  activates features with human-readable labels. Features active in my words that I
  did not name are latent content. Features active in an anomaly but in no schema
  are the gap the anomaly sits in.
- **Surprisal and completion** (probe A, built): where my phrasing leaves the
  consensus path, and whether the second half of my statement is predictable from
  the first.

The decisive reading, and the reason F belongs inside A rather than replacing it:
an open-weight model is a compression of the written record, and the written
record of a field *is* its dominant paradigm in Kuhn's sense. So every one of
these probes measures **position relative to the consensus paradigm**, never
truth. Low surprisal means my statement is normal science. High surprisal means
pre-paradigmatic, novel, or confused, and the geometry cannot tell which. Two
terms of mine collapsing onto one direction means the consensus does not
distinguish them, which is either my redundancy or the consensus's blind spot.

That is exactly the instrument a Kuhnian core needs and could not otherwise have:
a way to locate a schema in the space of the paradigm without reading the
paradigm's literature first. It is also the precise shape of the dependence risk.
If I let "the consensus holds this" stand in for "I derived this", the model has
done my thinking by proxy. The rule that prevents it: probe output is **where to
look**, never **what is true**, and no probe result changes a schema's
`confidence` or `cold`; only an exemplar solved by hand does that.

## Evaluation

| | A Kuhn | B Lakatos | C Piaget | D Bayes | E Threshold | F Geometry |
|---|---|---|---|---|---|---|
| what a schema is | yes: four parts | partly: core and belt | no | no | no | partly: directions |
| when it is held | yes: solve a new exemplar | no | no | no | yes: expert transfer | no |
| transition mechanics | anomaly, crisis, rival | predict, confirm | assimilate, accommodate | update | cross the threshold | no |
| verification without dependence | weak alone | **yes: novel prediction** | no | yes: calibration | no | position only |
| why unknown unknowns exist | **yes: the matrix makes them** | no | partly | no | no | no |
| shrinks v0.1 | yes, if exemplars replace drills | yes, if health replaces confidence | no | no | no | no |

No single candidate passes all five tests. A passes three and is the only one with
a theory of unknown unknowns. B is the only one with a non-dependent verification.
F is the only one that locates a schema without my reading the field first.

## Recommendation

A schema is a **micro-paradigm** (A) with a **health metric** (B), located by
**geometry** (F). In five sentences:

1. A schema has four parts: a **generalization** I can state, the **commitments**
   it presupposes about what exists, a set of **exemplars** I have worked by hand,
   and an **anomaly ledger** of what it has failed to absorb.
2. I **hold** a schema when I can solve a new exemplar cold *and* state the
   generalization. Exemplar transfer alone is an unknown known; the statement alone
   is a slogan.
3. The transitions: an anomaly is an unknown unknown becoming a known unknown; a
   worked exemplar with the rule articulated is an unknown known becoming a known
   known; a known unknown becomes a known known when it joins a schema's exemplars.
   A schema whose anomalies outnumber its confirmed predictions is in **crisis**,
   and the lens sweep with my other schemata is how I look for its successor.
4. A schema is **progressive** if it has a dated prediction, made before the
   outcome, that came true; **degenerating** if it has only been patched after the
   fact. Health replaces the hand-set `confidence` field.
5. Probes locate a schema relative to the consensus paradigm and never change its
   health or its held status. Signals, not sentences, now has a reason.

### What this removes from v0.1

- `confidence` (hand-set 0 to 3). Replaced by health, computed from predictions.
- `drill_prompt` as "re-derive X". Replaced by **solve a new exemplar**, which is
  what the testing-effect literature supports most strongly anyway (transfer, not
  recall). Constrained restatement and drawing stay as ways of working an exemplar.
- `Applies when` and `Fails when` as prose. Folded into commitments and the anomaly
  ledger, which are the same information with a mechanism attached.
- `Derivation` as a separate section. The derivation *is* the first exemplar.

### What it adds

- `## Exemplars`: dated, worked by hand, each one a concrete problem this schema
  solved. The count of exemplars is the one number that tracks unknown known to
  known known.
- `## Anomalies`: dated, what resisted. Links to the question each raised. An
  anomaly resolved into an exemplar is the schema accommodating; one that cannot be
  is a vote for crisis.
- `## Commitments`: what has to exist and be true for the generalization to make
  sense. This is where lens sweeps bite: another schema's commitments make these
  visible.
- Health, computed: progressive, holding, degenerating, crisis.

### Schema file, after

```
---
held: false            # new exemplar solved cold AND generalization stated
exemplars: 0           # count, maintained by hand or the plugin
anomalies: 0
predictions: 0         # dated, before outcome
confirmed: 0
domain:
created:
drill_next:
drill_interval:
---
# name
## Generalization
## Commitments
## Exemplars
## Anomalies
## Lens
## Probe notes
```

Health is a function of the frontmatter: confirmed > 0 and anomalies ≤ confirmed is
progressive; confirmed = 0 and exemplars > 0 is holding; anomalies > confirmed is
degenerating; anomalies > exemplars is crisis.

## What this means for the plugin

The GUI follows the core, not the CLI. Five surfaces:

1. **Capture**: one hotkey, a modal with six tag buttons and a text field. Appends
   to the inbox. Nothing else.
2. **Triage**: the inbox as a list; each line has buttons for what it becomes
   (question, anomaly on a schema, surprise or prediction on a project, exemplar on
   a schema, delete). Each button opens the target with the line pasted under the
   right heading, dated. The user writes the rest.
3. **Due**: schemata with `drill_next` today or earlier, each with "solve a new
   exemplar" and pass/fail. Pass requires typing the exemplar into the schema
   first; the button is disabled until the Exemplars section grew.
4. **Health**: a schemata table with the computed state, crisis at the top.
5. **Sweep**: pick a project; each schema's lens with a text box; answers land in
   the project's Lens sweeps section, dated; an empty answer offers "make this a
   question".

Probes stay in Python, desktop only, run from a button that shells out and opens
the output note. They never write to a schema.

## Open questions this core raises

- How big is a micro-paradigm? If every rule of thumb is a schema the matrix is
  noise; if only field-level theories are, there are three. The exemplar test
  suggests the answer: a schema is as large as the set of puzzles one exemplar
  transfers to.
- Can values (Kuhn's fourth part) be made operational for one person, or are they
  the lens sweep's job?
- Which probe result, if any, ever changes what I do next? If none does after a
  month, probes are a toy and F leaves the core.
- Is "anomalies > exemplars means crisis" the right threshold, or should
  anomalies be weighted by how central the commitment they violate is?

## Sources

- Kuhn, *The Structure of Scientific Revolutions*, 2nd ed. 1970, Postscript (disciplinary matrix, exemplars, tacit rules).
- Lakatos, "Falsification and the Methodology of Scientific Research Programmes", 1970.
- Piaget, assimilation and accommodation; Bartlett, *Remembering*, 1932 (schema).
- Meyer and Land, "Threshold Concepts and Troublesome Knowledge", 2003. Dreyfus and Dreyfus, *Mind over Machine*, 1986.
- Park, Choe and Veitch, "The Linear Representation Hypothesis and the Geometry of Large Language Models", https://arxiv.org/abs/2311.03658
- Park, Choe, Jiang and Veitch, "The Geometry of Categorical and Hierarchical Concepts in Large Language Models", https://arxiv.org/abs/2406.01506
- Lieberum et al., "Gemma Scope", https://arxiv.org/abs/2408.05147
