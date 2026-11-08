---
name: teach
description: Run the teach pass over content/teach: rewrite the passages Adit marked with %% lost %%, %% easy %% or %% forgot %% to their level and regenerate levels.md. With an argument, also write a new doc on that topic at their level.
---

Read content/teach/teach-prompt.md and follow its "Instructions to the model" section exactly. If `$ARGUMENTS` is not empty, also write a new doc on that topic as the prompt describes. Edit only files under content/teach/. When done, list in the reply each doc changed with its new Changes lines, and the two lists from levels.md.
