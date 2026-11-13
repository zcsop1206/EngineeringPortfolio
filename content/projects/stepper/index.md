---
title: Lithography stepper stage and optics
description: Toronto Hacker Fab's maskless stepper projects a DMD pattern through a microscope objective onto resist, on a 3D-printed parallel-kinematic stage. Before building it I modelled the stage and drew the optics column so the first measurements test predictions. Its encoders count 1.5 nm at the tool, but its tilt, invisible to those encoders, decides whether it can hold focus across a 1 mm field.
status: in-progress
start: 2026-11-13
cover: column.png
publish: false
short: Litho stepper
result: "Modelled the stepper's stage before building it: 1.1 to 1.5 nm per encoder count, a ±8.3 mm reachable cube, and 0.2 to 3.6 mrad of tilt over a die field against 0.84 mrad allowed by the depth of focus."
hook:
  label: Not yet measured
  text: Every number on this page is a prediction with a band. One cheap test, a mirror on the stage and a laser spot on a wall, decides which band the real stage is in and whether it needs a tilt actuator.
---
![The optics column on the stage: the DLP light engine at the top, a 30 mm beamsplitter cube in a printed holder, the camera arm to the side, the objective pointing down at the chip, and the Open Micro-Manipulator stage underneath](column.png)

*Figure 1. The column as modelled. Tubes, cube, objective, camera and light engine are stand-ins at nominal size; every printed part is parametric.*

## Summary

The chapter's stepper is a maskless lithography tool:
- A TI DLP projector, with its blue LED swapped for 410 nm, shows the pattern on a micromirror array.
- A microscope objective shrinks it onto resist.
- A camera looks through a beamsplitter cube under red light, which the resist ignores.
- The chip rides on the Open Micro-Manipulator, an open 3D-printed stage: three motors, magnetic encoders and six rods on ball joints.

CMU's Hacker Fab has built the same stage and projector and measured them ([Gonzalez et al. 2025](https://arxiv.org/abs/2510.15082)). I took on the optics column and the analysis.

Before printing anything final, I ported the stage firmware's kinematics to Python and checked it by hand. I added a model in which each of the six rods and twelve balls can be slightly wrong. Then I asked what the depth of focus demands of it:
- Resolution is not the problem.
- Accuracy is a calibration problem.
- Tilt is a hardware problem. The stage cannot sense it or correct it, and whether it matters depends on how well the stage was printed.

The optics parts are drawn with every unknown as a named placeholder, and test prints come before final prints.

| Item | Detail |
| --- | --- |
| Organisation | Toronto Hacker Fab |
| Period | November 2026 to present |
| Role | Optics column design and the stage analysis |
| Deliverables | Kinematics port and six-rod error model, a 6-DOF variant, fine-stage sizing, six parametric printed parts and the column assembly, test-print coupons with protocols, 19 hand-check tests |
| Tools | Python, NumPy, pytest, CadQuery, Onshape FeatureScript |

## 1. What the stage has to do

Depth of focus sets everything. At 410 nm through an NA 0.25 objective, it is λ/2NA² = ±3.28 µm.

Five things share that ±3.28 µm:

| Share | ± µm |
| --- | --- |
| Autofocus repeatability | 0.5 |
| Chip bow and resist | 1.0 |
| Drift during exposure | 0.5 |
| Levelling, once | 0.5 |
| Stage tilt changing with position | 0.5 |
| Margin | 0.28 |

Across the 1.04 × 0.58 mm field, the stage's ±0.5 µm share allows 0.84 mrad of tilt.

For 2 µm features, image motion during an exposure should stay under 0.2 µm, and neighbouring fields should land within 0.5 µm.

## 2. The stage as modelled

Each motor turns a crank of radius 15 mm. Each pair of 72.5 mm rods forms a parallelogram, so the platform translates without rotating.

At the centre of travel, the Jacobian is 15 mm/rad times the identity: each motor drives one axis. One encoder count is 0.2/2²¹ rad of crank, which is 1.1 to 1.5 nm at the tool across a ±5 mm field. CMU measured 0.30 ± 0.13 µm of apparent motion on zero-length moves. So the encoder is about 200 times finer than anything the servo, friction or vibration let through.

The firmware assumes perfect parallelograms. I gave every rod its own length and every ball its own position error, then solved for where the platform really goes when the firmware commands a point. A 10 µm length mismatch within one rod pair tilts the platform by exactly 10 µm / 17 mm = 588 µrad, the pair spacing being 17 mm.

Because nobody has measured how well these parts print, I ran three bands of print quality, 60 random stages each, over a ±5 mm die field. Tilt spread is how much the platform's tilt changes across that field. Each cell gives the median, then the 95th percentile:

| Print quality | Scale error | Error left after an affine fit | Focus part of it | Tilt spread |
| --- | --- | --- | --- | --- |
| Good (5 µm rods, 10 µm balls) | 0.09 / 0.16 % | 0.7 / 1.1 µm | 0.4 / 0.7 µm | 0.23 / 0.39 mrad |
| Middling (20 µm, 50 µm) | 0.44 / 0.83 % | 3.5 / 6.2 µm | 2.0 / 4.2 µm | 1.2 / 1.9 mrad |
| Poor (50 µm, 100 µm) | 0.73 / 1.6 % | 7.0 / 14 µm | 4.1 / 6.9 µm | 2.1 / 3.6 mrad |

CMU measured 2 to 9 % scale error. The bottom of that range overlaps the poor band, but 9 % does not come from geometry alone. Their camera's pixel scale, which they did not separate from the stage, is the first suspect.

## 3. What that means

Repeatability passes: CMU measured 0.15 to 0.4 µm. Accuracy fails in every band, but a lookup table built by moving to marks and measuring them with the camera fixes it in software.

Tilt is different. In the middling and poor bands, it varies by more than 0.84 mrad across the die field. A tilted chip is out of focus on one side of the exposure, and no software fixes that: the stage has no tilt axis.

So the first measurement is a mirror on the platform, a laser pointer, and the spot on a wall 2 m away. Step a 5 × 5 grid over ±5 mm and mark the spot each time. The spot moves by twice the tilt times the distance, so it resolves about 0.13 mrad.

## 4. If it tilts too much

| Option | What it does | Cost |
| --- | --- | --- |
| Every rod on its own crank (a 6-DOF hexapod from the same parts) | Tilt becomes an axis: 0.88 rad per radian of crank difference, 119 nrad per count. Cancelling the poor band costs 0.06 mm of stepping range | Three more motors and drivers, 6-axis firmware, and a measured tilt map, because its encoders cannot see ball errors either |
| Three piezo stacks under the chuck | Z, tip and tilt, separate from the coarse stage. 11 to 97 µm of stroke depending on band and radius. Open loop is good enough for tilt, since 15 % hysteresis leaves 0.29 mrad in the middling band | High-voltage drivers, machined flexures |
| Piezo XY on top | Removes servo dither during exposure | Worse than the coarse stage when run open loop, so it needs the camera as its sensor. Worth it only once features shrink toward the objective's 1 µm limit |
| Crossed-roller stages instead | 100 to 150 µrad pitch and yaw out of the box | Manual, or expensive when motorised, and every stacked stage adds height |

I lean towards the piezo tripod. It is the long-stroke / short-stroke split real steppers use: the coarse stage travels, and the fine stage only corrects. It leaves the proven three-motor stage alone. The laser test decides whether either is needed.

## 5. The optics column

![The six printed parts: beamsplitter holder with its light trap and flange, the holder lid, one half of the camera cradle, the projector bracket, an SM1 tube clamp, and the objective shroud](parts.png)

*Figure 2. Six of the eight printed pieces, each drawn to its own scale; the baffle rings and the second cradle half are not shown.*

The printed parts:
- The holder presses the cube onto a felt pad. It clamps the projector tube above, the objective tube below and the camera tube to one side. The fourth side is a light trap that swallows the half of the projector light the cube throws away.
- The camera cradle clamps the camera body and its tube on one axis.
- The projector bracket replaces the projector's lens.
- Tube clamps hold the long tubes to the frame, baffle rings cut reflections inside them, and a shroud over the objective tip keeps room light off the chip.

Every dimension I have not measured is a named placeholder: the camera body, the projector's mounting holes, the frame size, the objective. Every fit-critical dimension reads from a test-print result. Changing a number regenerates every part that uses it.

Drawing the parts gave one more result. A printed bore that slides on a 30.5 mm tube with 0.1 mm of clearance lets the tube tilt up to 10 mrad over 10 mm of engagement. Focus needs under about 0.8 mrad between objective and chip. So that tilt has to come from an adjustment, not from the fit.

## 6. Test prints first

Coupons come before any final part:
- Bore ladders from 30.50 to 30.90 mm in 0.05 mm steps, printed twice. Horizontal holes sag, so the camera bore gets its own ladder.
- A cube pocket ladder from 30.1 to 30.5 mm, with relief holes at the corners. Without them, the printer's rounded inside corners hold the cube's sharp edges off the walls and every pocket reads tight.
- Heat-set insert bosses and slotted flanges.
- A creep coupon: a 60 mm cantilever in PETG and PLA, loaded to 5 and 10 MPa (127 g and 255 g) and read with a dial indicator over a week, at room temperature and at 40 °C. Printed parts under constant load drift, and the focus budget is ±3 µm.

Each coupon has an acceptance number, and its result changes one line that every part reads.

## 7. Measurements, in order

1. Tilt spread over ±5 mm, from the laser and mirror. This decides section 4.
2. The coupons. These set the final fits and pick the material.
3. Stage jitter during an exposure, with the camera at its highest frame rate. This decides whether XY needs a piezo.
4. A focus-exposure matrix on resist. This checks the ±3.28 µm the whole budget rests on.

The code, the derivations and the CAD are on GitHub, in the [`hackerfab_stepper` folder of my fork of the stage](https://github.com/zcsop1206/MicroManipulatorStepper/tree/hackerfab-stepper/hackerfab_stepper).
