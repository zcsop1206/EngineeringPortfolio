# Edge — protocol v0.1

Reasoning and sources for every rule here are in DESIGN.md. Obsidian setup is in OBSIDIAN.md.

Goal: increase discretional agency. Knowledge is useful here only when I can act on it
without assistance and can say how I got there.

## The four states and the three moves that matter

| state | short | what it feels like |
|---|---|---|
| known known | KK | I can produce it cold and explain the derivation |
| known unknown | KU | I can name the question |
| unknown known | UK | I act correctly without knowing why, or I knew once and forgot |
| unknown unknown | UU | I cannot even name the question yet |

Moves the system is built around:

1. **UK → KK: act first, capture second.** Produce before looking up. When something
   comes out right without a derivation, log it as a hunch (`~`) and derive it later.
2. **KU → KK: question → derivation or experiment → schema → drill.** A question is not
   closed when answered. It is closed when the answer is a schema I can re-derive cold.
3. **UU → KU: mine the edges.** Three edge detectors: surprises (`!`), prediction
   misses, and lens sweeps (apply every schema I hold to a project and see where it
   produces a question I can't answer).

The fourth transition, KK → UK (forgetting), is fought with drills on derivations,
not facts.

## Capture signals

During work, capture only. One line in `inbox/inbox.md`. Never resolve during work;
that is where agency is exercised.

| tag | meaning | state it signals |
|---|---|---|
| `?` | a question I can't answer | KU |
| `!` | a surprise: outcome differed from expectation | UU leaking in |
| `~` | a hunch: it worked and I don't know why | UK |
| `=` | a derivation: I now understand and can re-derive | KK candidate |
| `x` | an error I made, with the cause if known | blindspot |
| `p` | a prediction, with a confidence, before the outcome is known | calibration |

## Rituals

- **During work:** capture only. `edge capture "? why does X happen"`.
- **Daily, 10 min:** triage the inbox. Each line becomes a question file, a schema
  edit, a drill, or gets deleted. Inbox should be empty at the end.
- **Weekly:** one lens sweep on one project (`edge sweep <project>`). Score any
  predictions whose outcomes are now known. Promote or demote schema confidence.
- **Monthly:** run the loop on the system itself (`projects/edge.md`).

## Self-sufficiency rule

A transition counts only if I performed it by hand. Tools and models may surface a
signal, schedule, or count. **Signals, not sentences.** If a tool's output could be
pasted into a schema, the tool is misdesigned.

## The gate (attempt, then feedback)

The system exists partly because I have been outsourcing thinking. So:

1. **Attempt first.** Before asking a model anything about a question, write the attempt
   under `## Attempts` in the question file. No written attempt, no model.
2. **Feedback must follow.** An attempt without feedback decays into a guess. Take it
   from the cheapest source that preserves my derivation, in this order: reality (run,
   build, measure); a primary source I read myself; a counterexample or error-check
   from a person or model; a hint one level up. Record it under `## Feedback`.
3. **A model may:** ask me questions, point at a blindspot or error, check a derivation I
   wrote, give a counterexample, name a lens or schema I might not have applied.
4. **A model may not:** give the answer, write the derivation, write the schema.
5. **Unlock:** after three logged attempts, or a hard time-box I set in advance, a model
   may give one hint one level up (the next sub-question, not the answer).
6. Anything a model produced is tagged `ai:` and cannot be promoted to a schema until I
   have re-derived it by hand in my own words.

## Metacognition fields

Every schema carries:

- `confidence`: 0 untested, 1 used once, 2 used in several contexts, 3 I would bet on it
- `cold`: true/false, can I re-derive the verbal statement with no notes
- `modes`: which of verbal, visual, spatial, built I have produced it in cold
- `## Derivation`: how it follows from things I already hold
- `## Fails when`: known limits
- `## Lens`: the question it lets me ask of any new problem
- `## Representations`: the four slots. A schema is not its sentence.

A schema with `cold: false` is not a known known yet, whatever its confidence.
Confidence 3 requires at least two modes.

## Drills

Generative recall, not flashcards. A drill prompt is "re-derive X", "draw X with no
words", "build X", or "restate X under a constraint", never "what is X". The drill
lives on the schema (`drill_prompt`, `drill_mode`, `drill_next`, `drill_interval`).
Intervals double on pass (1, 2, 4, 8, 16, 32, 64 days) and reset to 1 on fail. A fail
is also a capture: `x` with the cause. Rotate `drill_mode` after each pass.

Constrained restatements (mode `constrained`): taboo (no key terms), budget (exactly
12 words, then 40), negation (three things it is not), audience, other language.

## Two free unknown-unknown detectors

- **Translation failure.** Drawing or building a verbal schema and being unable to
  place something means that something is an unstated quantity or relation. Log `!`.
- **Constraint failure.** Where a constrained restatement stalls, the schema is held
  as a phrase, not an understanding. Log `?`.

Computational probes (surprisal, SAE footprint, embedding neighbourhood) are specified
in `probes/`. They emit signals only. They come after the free detectors.

## Growth rules

- Plain markdown, flat folders, small vocabulary. Nothing enforced by software that a
  text editor can't do by hand.
- Fields are conventions. Add one when a real need appears, retire it when unused.
- The system is a project inside the system. Changes to this protocol go through the
  same loop: capture, question, attempt, schema.
- Any tooling (edge.py) must be deletable without losing information.
