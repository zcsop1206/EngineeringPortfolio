# Why

## Origin

I joined the Centre for Advanced Coating Technologies in May 2026. The lab's wickless heat pipe needed a condenser that could actually condense.

![The condenser block I machined](cact_condenser.jpeg)

# What

## Device

A vapor chamber where a sprayed sawtooth coating pumps the liquid instead of a wick. I designed and machined its copper top plate, instrumented the assembly, and tested it charged and dry.

![The substrate with the sawtooth coating, being filled](cact_vapor_chamber.jpeg)

# Problem

## Requirement

Vapor has to give up its heat at the top plate. The plate must seal at 25 psi, mate with existing parts, and bring chiller water close to the vapor face.

## Difficulty

One block seals, conducts and carries thermocouples, machined from solid copper on a manual mill. Then the test has to show the fluid is doing the work, not the copper.

# Work

## Tolerances

Position on the bolt pattern and ports, flatness on the vapor face, 0.1 mm elsewhere. Only what the assembly needs.

![](cact_condenser.jpeg)

## Instrumentation

Calibrated thermocouples in the heater block, substrate centre and edge, condenser, and water in and out. Enough to split the stack into resistances.

![Where the thermocouple beads sit](cact_thermocouple_map.svg)

## Charged

Steady at 410 W, 46 W/cm². The chiller water carried away the electrical input to within 7%.

![The charged run](cact_test1_history.svg)

## Control

The same assembly with no fluid, stepped to 318 W.

![The dry control](cact_control_history.svg)

## Resistance

Substrate to condenser: 0.074 K/W charged against 0.26 to 0.28 dry. Heater to substrate is unchanged, since the fluid is not in that path.

## Gradient

The centre ran 18 °C above the edge, the same per watt charged and dry. A conduction model fitted to eight thermocouples recovers the heater power to within 8%, so the gradient is the copper plate, and that is the next thing to design out.

![The fitted temperature field. Dots are measurements.](cact_test1_field.mp4)

## Questions

- The drawing and its tolerances
- Machining the block
- The energy balance
- Next experiments
