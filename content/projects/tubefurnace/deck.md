# Inherited

## I did not build this furnace

Three members of Toronto Hacker Fab built it from a build video. It reaches 1000 °C and glows. I took on the rework afterwards.

Nobody knew its temperature profile, its ramp, or its oxide rate.

![The build, to scale](furnace_v1_section.png)

## And it can short to its own case

Mains conductors run unsheathed past earthed steel. The earth turns a short into a tripped breaker. It does not stop the short.

So it does not run again until that is fixed.

# The bet

## Write the answers down first

Before the next run I modelled the furnace as it stands and made it predict every number the first logged run will produce.

Each prediction has a band, from the eighteen dimensions I have not measured.

## Nothing here is measured

That is the point. The first run is a test with a way to fail, not a survey.

# What the model says

## There is no plateau

An end loss fades over 7 to 9 cm. The winding is 15 cm. The two ends meet in the middle, so the profile is one arch.

The flat zone is the top of it: 26 mm at ±5 °C.

![Predicted profile at 700 and 1000 °C](furnace_v1_profile.png)

## 48 seconds

The relay fails closed, and the heater is seven times the losses. From a stuck relay to the quartz limit is 48 seconds.

That is the number the independent limiter has to beat.

![The predicted first run](furnace_v1_first_run.mp4)

## The weather grows the oxide

Per atmosphere, water oxidises silicon about 30 times faster than oxygen. Room air holds enough that the two contribute about equally.

A "dry" oxidation in this furnace depends on the humidity that day.

## My thermometer does not work

I wanted to read position differences off oxide colour. The chart resolves 10 nm. The differences are 1 to 9 nm.

The model killed that plan before I spent a run on it.

# The test

## An hour with a tape measure

The model ranks its own unknowns by how much each widens the bands. The cold measurements come in that order, furnace unplugged.

## Then five experiments

Each one is built to pin down named parameters to a stated resolution. The fault test runs at 300 °C, where a stuck relay does no harm.

# After

## The same model picks the next furnace

Three heater layouts over 36 worst cases. Only three independent zones hold ±1 K across a boat of wafers.

One sensor sets the level. It cannot fix a tilt.

![Uniform, graded and zoned heaters at 1000 °C](furnace_axial_profiles.png)

## Ask me about

- How I trust a model with no data: 230 tests and a hand check
- What happens if the first run disagrees
- The wiring fix and the limiter
- Why the gas flow tilts the profile
