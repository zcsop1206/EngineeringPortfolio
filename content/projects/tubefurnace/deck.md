# Why

## Origin

Toronto Hacker Fab has a tube furnace for growing oxide on silicon. I took on its rework: make it safe, and make it a process tool with known numbers.

![The furnace, to scale](furnace_v1_section.png)

# What

## Approach

A simulator of the furnace as built. It predicts every number the first logged run will produce, each with a band, so the run is a test with a way to fail.

# Problem

## Requirement

Oxide growth is exponential in temperature. The tool has to say where the temperature is flat, how well it is held, and what the gas is.

## Difficulty

One thermocouple, both ends open, and eighteen inputs not yet measured.

# Work

## Model

One-dimensional along the tube, verified by 230 tests against analytic limits and by hand.

## Profile

End losses fade over 7 to 9 cm and the winding is 15 cm, so the profile is one arch. The flat zone is 26 mm at ±5 °C.

![Predicted profile at 700 and 1000 °C](furnace_v1_profile.png)

## Safety

The relay fails closed. From a stuck relay to the quartz limit is 48 seconds, which sizes the independent limiter. The mains wiring is resleeved and checked before any run.

![The predicted first run](furnace_v1_first_run.mp4)

## Humidity

Water oxidises silicon about 30 times faster than oxygen per atmosphere. In room air the two contribute equally, so every run logs humidity.

## Experiments

The model ranks its unknowns by how much each widens the bands. Cold measurements in that order, then five experiments that each pin down named parameters.

## Next

The same model over 36 worst cases picks the next furnace's heater: three independent zones, the only layout that holds ±1 K across a boat.

![Uniform, graded and zoned heaters at 1000 °C](furnace_axial_profiles.png)

## Questions

- How the model is verified
- The limiter and the wiring
- The oxide chemistry
- Why zones beat a graded winding
