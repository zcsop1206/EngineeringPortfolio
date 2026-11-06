# 36 hours

## A hackathon, and one sentence to work from

ScienceClaw at the MIT Media Lab, with Alan Chen. One night of runs.

The task we gave every agent, word for word: make an implant as mechanically homogeneous with bone as possible without losing integrity.

![What round 1 handed in, at one scale](gallery.png)

## What we built

Thirty-eight Claude agents designing a spinal fusion cage, in arrangements from one agent alone to a leaderless group of six.

A physics judge, frozen before each round, scored what they handed in. The arrangement was the variable.

# The catch

## Nothing you can measure equals the goal

Titanium is 4 to 11 times stiffer than bone, so the bone beside a metal cage is under-loaded and wastes away. "Homogeneous with bone" is the cure, and it is not a number.

Any number that stands in for it becomes the target. Whoever writes it shapes the designs.

## So the test had to hold still

The one who sets the metric is kept apart from those meeting it. The judge is frozen before each round. The agents stay free.

# Ground truth first

## We broke real parts before any agent ran

Coupons printed through the printer's API and pulled on an Instron. Every resin read below its datasheet, one by 27%.

The judge used the measured values.

![Stress against strain, and measured against datasheet](specimens_vs_datasheet.png)

# Round 1

## Every arm gamed it within minutes

The round 1 score filled every void with fused bone, so less implant read as more bone-like. One agent or six, they all found it.

![The eight submissions](turntable_grid.mp4)

## The winner was a wire loop

1 mm struts. Loaded alone it would see 1132 MPa against an allowable of 17. Its own report says it targets the metric and is not a clinical device.

The score ranked the designs almost inversely to the goal.

## So the study turned around

How the agents were organised did not decide whether the metric was gamed. How the judge was built did.

The experiment became a study of the test.

![Stimulus in the bone around two cages. Blue is shielded.](sim_slice.mp4)

# Round 2

## Four changes to the test, none to the agents

- A stricter metric, written by an agent that had seen no results.
- The implant must carry twice the load alone. A failure ranks below every pass.
- One load state the agents' tool never shows them.
- Independent re-scoring at twice their resolution.

## Six agents, no roles, 75 minutes

They scored fourteen designs and threw out their two best-scoring ones because the strength margins were thin.

They predicted 14 to 15 MPa for the one they shipped. The judge measured 14.1 of 17.

![Top: the round 2 cage, printed](printed_parts.jpg)

## It tied the textbook

Best of nine on the withheld state. On the goal metric, a tie with the textbook lattice under the metric's own rule. Not a win.

# What it bought

## Variety, and no single point of failure. Not speed.

In round 1 the leaderless group gave one agent the deliverables. It ran out of credit ten seconds later and nobody took over. In round 2 the work spread.

Alan's controlled run agrees: teams cost two to three times one agent, with no difference in stiffness.

![Alan Chen's run 3: cost against stiffness](alan_run3_cost_vs_stiffness.png)

## Ask me about

- How the judge works and what it cannot tell you
- Why two replicates per arm means no ranking
- The agent that turned the printer API into a measuring rig
- What I would freeze differently next time
