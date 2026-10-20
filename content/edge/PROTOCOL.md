# Edge — protocol v0.2

The rules. The reasoning is in CORE.md (what a schema is and why) and DESIGN.md (the
evidence behind the rituals). Obsidian setup is in OBSIDIAN.md.

## What a schema is

A schema is a micro-paradigm with four parts:

- **Generalization**: a statement I can make.
- **Commitments**: what has to exist and be true for the statement to make sense.
- **Exemplars**: concrete problems it has solved, worked by hand. The first one is the
  derivation.
- **Anomalies**: what it has failed to absorb.

I **hold** a schema when I can solve a new exemplar cold *and* state the generalization.
Exemplar transfer alone is an unknown known. The statement alone is a slogan.

## The four states, in these terms

| state | what it is here |
|---|---|
| known known | a held schema |
| known unknown | a puzzle my schemata say is solvable, not yet solved: a question file |
| unknown known | exemplars worked, generalization never articulated: fluent but cannot teach |
| unknown unknown | what my schemata make invisible. Found only through anomalies and through another schema's lens |

## The moves

1. **Unknown unknown to known unknown.** An anomaly (`!`), a prediction miss (`p` scored
   wrong), or a lens I cannot answer. Each becomes a question.
2. **Known unknown to known known.** A question is attempted in writing, gets feedback,
   and closes by joining a schema as an exemplar, or by founding a new schema.
3. **Unknown known to known known.** A hunch (`~`) is worked until the generalization
   can be stated. Then it is an exemplar with a rule.
4. **Crisis.** A schema whose anomalies outnumber its exemplars is in crisis. The weekly
   sweep with my other schemata is how I look for its successor. Patching the
   generalization after the fact is not a fix; it is degeneration.

## Health, computed

| state | condition |
|---|---|
| progressive | a dated prediction, made before the outcome, came true, and anomalies ≤ confirmed |
| holding | exemplars > 0, no confirmed prediction yet |
| degenerating | anomalies > confirmed |
| crisis | anomalies > exemplars |

Health replaces any hand-set confidence. The only way to raise it is a prediction that
comes true or an anomaly resolved into an exemplar.

## Capture signals

During work, capture only. One line in `inbox/inbox.md`. Never resolve during work.

| tag | meaning | becomes |
|---|---|---|
| `?` | a question I can't answer | a question file |
| `!` | a surprise: outcome differed from expectation | an anomaly on a schema, or a surprise on a project |
| `~` | a hunch: it worked and I don't know why | a question, until the rule is stated |
| `=` | a derivation: I now understand and can re-derive | an exemplar on a schema |
| `x` | an error I made, with the cause if known | an anomaly, or a question |
| `p` | a prediction, with a probability, before the outcome | a row in a project's Predictions table |

## Rituals

- **During work**: capture only.
- **Daily, ten minutes**: empty the inbox. Each line becomes a file, an edit, or nothing.
- **Drills, when due**: solve a **new exemplar** of the schema. Not "re-derive the
  statement". Work it in whichever mode fits: written, drawn with no words, restated under
  a constraint (taboo, word budget, negation, audience, other language), or built. Pass
  only if the exemplar went into the file. Pass doubles the interval; fail resets it to
  one day and is captured as `x`.
- **Weekly, half an hour**: one project. Every schema's lens against it. Score
  predictions whose outcomes are known. Anything worth showing becomes a dated log entry
  in `projects/<slug>/log/`, in my own words.
- **Monthly**: run the loop on the system itself (`projects/edge.md`).

## Self-sufficiency rule

A transition counts only if I performed it by hand. Tools and models may surface a
signal, schedule, or count. **Signals, not sentences.** No tool output changes `held`,
the counters, or the drill fields except through my own edit after my own work.

## The gate (attempt, then feedback)

1. **Attempt first.** Before asking a model anything about a question, write the attempt
   under `## Attempts`. No written attempt, no model.
2. **Feedback must follow**, from the cheapest source that preserves my derivation:
   reality (run, build, measure); a primary source I read myself; a counterexample or
   error-check from a person or model; a hint one level up. Record it under `## Feedback`.
3. **A model may**: ask me questions, point at a blindspot or error, check a derivation I
   wrote, give a counterexample, name a lens or schema I have not applied.
4. **A model may not**: give the answer, write the derivation, write an exemplar, write a
   generalization.
5. **Unlock**: after three logged attempts, or a time-box set in advance, a model may give
   one hint one level up.
6. Anything a model produced is tagged `ai:` and cannot become an exemplar until I have
   re-derived it by hand in my own words.

## Probes

Probes locate a schema relative to the consensus paradigm encoded in an open-weight
model. They say where my phrasing leaves the consensus, whether two of my terms collapse
onto one direction, whether a hierarchy I assert has a geometric correlate. They never say
what is true, and they never change health or `held`. Specs in `probes/`.

Two probes need no model and come first: try to draw the generalization with no words,
and restate it under a constraint. Whatever cannot be placed or restated is an unstated
commitment. Log it.

## Growth rules

- Plain markdown, flat folders, small vocabulary. Nothing enforced by software that a text
  editor can't do by hand.
- Fields are conventions. Add one when a real need appears, retire it when unused.
- The system is a project inside the system. Changes to this protocol go through the same
  loop: an anomaly in how the system behaves, a question, an exemplar.
- Any tooling must be deletable without losing information.
