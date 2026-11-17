---
name: teach
description: Run the teach pass. First answer the study view's pending rewrite and rebuild requests in content/study (study mode), then the old %% lost %% / %% easy %% / %% forgot %% marks in content/teach. With an argument, also write a new study doc on that topic.
---

## 1. Study mode (content/study)

1. Run `node "../obsidian-notebook/scripts/study-scan.mjs" content/study --json --lint` from the portfolio root (the script is in the obsidian-notebook repo, branch study-mode or main). Read `obsidian-notebook/docs/study/FORMAT.md` and `content/study/registry.md` before editing anything.
2. For each pending **rebuild** request (a lost mark on a basic): rebuild the whole basic from its prerequisites. Read the basic, its `needs`, the passage that was marked and its attempt ink count, and the drills on it (`drills` in the scan). Rewrite the basic so the marked idea is reached in smaller steps from what the prerequisites already give, without proving anything another basic owns (link it instead).
3. For each pending **rewrite** request (a lost mark elsewhere that has waited 24 hours with attempt ink): rewrite only that passage. If the gap is a missing step, add the step; if it is a missing idea that no basic holds, add at most one bridge lemma (statement plus a folded proof) and link back. Never copy a basic's proof into a topic.
4. In every doc you change: keep every anchor (rename or delete none; a retired anchor stays on the passage that replaced it), add 1 to `build:`, and add a line at the end under `## Changes`: `- build N, YYYY-MM-DD: <what changed and why, one sentence>`. Keep the label line, the folded proofs and solutions, and the no-hints rule (method names only inside folded solutions).
5. Do nothing for lost marks still in their scaffold: the plugin's ration decides when a rewrite is due. Never write in `content/study/log/` or `content/study/ink/`, and never in `content/calls/`.
6. Run the scan with `--lint` again: the parser warnings must not grow. Fix any you introduced.
7. Reply with each doc changed, its new Changes line, and what the scan says is still pending.

## 2. The old teach docs (content/teach)

Read content/teach/teach-prompt.md and follow its "Instructions to the model" section exactly for any `%%` marks there. Edit only files under content/teach/ in this part. List each doc changed with its new Changes lines, and the two lists from levels.md.

## 3. With an argument

If `$ARGUMENTS` is not empty, write a new study doc on that topic in content/study: a basic if it is a fundamental no basic holds yet, otherwise a topic that links basics. Follow FORMAT.md exactly, add its row to registry.md (id, title, area, needs, key anchors), check every invented answer numerically, and label it.
