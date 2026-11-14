# Why

## Origin

Toronto Hacker Fab is building a maskless lithography stepper. I took on the optics column and the analysis of the stage it sits on.

![The column on the stage](column.png)

# What

## Machine

A DLP projector shows the pattern, a microscope objective shrinks it onto resist, and a camera watches under red light. The chip rides on an open 3D-printed parallel-kinematic stage.

## Approach

Model the stage and draw the column before building, so the first measurements test predictions.

# Problem

## Requirement

Depth of focus at 410 nm and NA 0.25 is ±3.3 µm. Five things share it. The stage's share allows 0.84 mrad of tilt across a 1 mm field.

## Difficulty

Printed rods and balls are never exact, and nobody has measured by how much.

# Work

## Kinematics

The firmware model, ported and checked by hand: 15 mm/rad per motor, 1.1 to 1.5 nm per encoder count, a ±8.3 mm reachable cube.

## Errors

Every rod and ball given its own error, over three bands of print quality. Accuracy can be calibrated with the camera. Tilt, 0.2 to 3.6 mrad, cannot: the stage has no tilt axis.

## Test

A mirror on the stage, a laser spot on a wall 2 m away. It resolves 0.13 mrad and decides whether the stage needs a tilt actuator.

## Options

A hexapod from the same parts, a piezo tripod under the chuck, piezo XY on top, or crossed-roller stages. The piezo tripod is the long-stroke / short-stroke split real steppers use.

## Column

Six parametric printed parts. Every unknown is a named placeholder, and every fit reads from a test print.

![The printed parts](parts.png)

## Prints

Bore and pocket ladders, insert bosses, slotted flanges, and a creep coupon read over a week.

## Questions

- How the six-rod model works
- Why tilt, not resolution
- The depth-of-focus budget
- What the test prints decide
