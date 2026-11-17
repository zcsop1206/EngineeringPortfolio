---
study: card
id: card-stepper
title: "Litho stepper stage and optics: numbers card"
area: [pd, op, sp]
needs: [sp-litho, op-wave, pd-exact-constraint, pd-error-budget, pd-measurement, mat-structure-props]
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [sp-litho](../basics/sp-litho.md), [op-wave](../basics/op-wave.md), [pd-exact-constraint](../basics/pd-exact-constraint.md), [pd-error-budget](../basics/pd-error-budget.md), [pd-measurement](../basics/pd-measurement.md), [mat-structure-props](../basics/mat-structure-props.md). ^needs

Source: the public page /projects/stepper/. Nothing is built; every number on it is a prediction paired with the measurement that will test it. Say "predicted" or "modelled" every time. Every answer below quotes the page and names its section. ^source

## Numbers

> [!recall] Stepper: the depth of focus, the wavelength and numerical aperture it comes from, and the formula.
^n1

> [!solution]- Answer
> Focus sets the budget: at 410 nm through an NA 0.25 objective, depth of focus λ/2NA² = ±3.3 µm. Everything that moves the chip surface up or down has to fit inside it: autofocus repeatability, chip bow and resist thickness, drift during an exposure, levelling, and tilt that changes as the stage moves.

> [!recall] Stepper: the stage's share of the focus budget and the tilt it allows, with the length it is taken over.
^n2

> [!solution]- Answer
> Focus sets the budget: the stage gets ±0.5 µm. Across the 1.19 mm diagonal of one exposure field that allows 0.84 mrad of tilt.

> [!recall] Stepper: the stage's resolution per encoder count, how it follows from the crank, and what the published reference build measured as apparent motion.
^n3

> [!solution]- Answer
> What the encoders miss: at the centre of travel each motor moves one axis 15 mm per radian; one encoder count is 0.2/2²¹ rad, so 1.1 to 1.5 nm at the tool. The other hacker fab's published measurements (Gonzalez et al. 2025) found 0.3 µm of apparent motion on moves of zero length, 200 times coarser. Resolution is not the limit.

> [!recall] Stepper: the modelled tilt and scale error for the three print qualities, the part errors behind each, and how the figures were taken.
^n4

> [!solution]- Answer
> What the encoders miss: every rod its own length and every ball its own position error, 60 random stages per level over a ±5 mm square, each value the 95th percentile. Good (rod 5 µm, ball 10 µm sd): scale 0.16%, tip and tilt 0.4 mrad. Middling (20 µm, 50 µm): 0.8%, 1.9 mrad. Poor (50 µm, 100 µm): 1.6%, 3.6 mrad. Against 0.84 mrad allowed. Figure 2: a 10 µm mismatch between the two 72.5 mm rods of a pair, 17 mm apart, tilts the platform 0.59 mrad, and the encoder reads the same crank angle either way.

> [!recall] Stepper: the test that decides whether the stage needs a tilt axis: setup, geometry, and resolution.
^n5

> [!solution]- Answer
> One test decides: glue a small mirror to the platform, bounce a laser pointer off it onto a wall 2 m away, step the stage over the ±5 mm square and mark the spot. The spot moves twice the tilt times the distance, so a 0.5 mm reading resolves about 0.13 mrad. Under 0.84 mrad the stage stays as it is; over it, the stage needs a tilt axis.

## Decisions

> [!recall] Stepper: if the stage tilts too much, which fix comes first, over which two alternatives, and why.
^d1

> [!solution]- Answer
> One test decides: three piezo stacks under the chuck for Z, tip and tilt, separate from the travelling stage, the coarse-plus-fine split production steppers use; it needs 11 to 97 µm of stroke depending on the print and the leg spacing. Over a hexapod (each of the six rods on its own crank and motor), which costs three more motors and six-axis firmware, and over bought crossed-roller stages, which tilt only 0.1 to 0.15 mrad but are manual, or expensive once motorised.

> [!recall] Stepper: which stage error is corrected in software and which is not, and why.
^d2

> [!solution]- Answer
> What the encoders miss: scale error is corrected in software (move to marks, measure where they land with the camera, correct with a lookup table). Tilt is not, because the stage has no tilt axis to correct it with.

> [!recall] Stepper: why not add a piezo stage for nanometre XY now.
^d3

> [!solution]- Answer
> One test decides: run open loop, its hysteresis is coarser than the stage's own repeatability; run closed loop on the camera, it only pays once features shrink from the reference build's 2 µm toward the objective's 1 µm limit.

## Failure

> [!recall] Stepper: the tilt problem that drawing the printed column parts turned up, its size, and the rule it set.
^f1

> [!solution]- Answer
> The column, printed: a printed bore sliding on a 30.5 mm tube with 0.1 mm of clearance lets the tube tilt up to 10 mrad, twelve times what focus allows between objective and chip. The tilt has to come from an adjustment, not from the fit. This is the page's only wrong turn: nothing has been built, so it reports no failed hardware.

## Story

> [!recall] Stepper: the two-minute story, in five lines.
^s1

> [!solution]- Answer
> 1. Object: the hacker fab's maskless stepper: a micromirror projector with its blue LED swapped for 410 nm and its lens removed, a microscope objective used backwards, a beamsplitter cube with a light trap and a camera, on an open-source 3D-printed stage (the Open Micro-Manipulator). The work is the optics column and the stage analysis.
> 2. Hard part: not the 1.5 nm step. Hand-cut rods and printed ball seats are never exactly the right size, and the mismatch tilts the chip by an amount the encoders cannot see.
> 3. Measured: nothing yet. The firmware kinematics are ported to Python and checked by hand, with a six-rod error model run over 60 random stages at three print qualities; 19 hand-check tests.
> 4. Number: depth of focus ±3.3 µm, a stage share of ±0.5 µm and so 0.84 mrad of tilt allowed, against 0.4 to 3.6 mrad predicted.
> 5. What it changed: one laser-and-mirror test decides. Under 0.84 mrad, correct scale with the camera and autofocus every field; over it, three piezo stacks under the chuck. Test prints (bore ladders, inserts, a creep cantilever) come before any final print.

## Follow-ups

What a technical follow-up probes, and where it is taught. ^follow-ups

- Where λ/2NA² comes from, and resolution against depth of focus: [depth of focus](../basics/sp-litho.md#^dof), [resolution](../basics/sp-litho.md#^resolution), [diffraction](../basics/op-wave.md#^diffraction). ^fu-focus
- Overlay and alignment with a camera: [overlay](../basics/sp-litho.md#^overlay), [alignment](../basics/sp-litho.md#^alignment). ^fu-overlay
- Why equal rod pairs keep the platform from rotating, and what a tilt axis adds: [parallelogram](../basics/pd-exact-constraint.md#^parallelogram), [degrees of freedom](../basics/pd-exact-constraint.md#^dof), [overconstraint](../basics/pd-exact-constraint.md#^overconstraint). ^fu-kinematics
- Splitting the focus budget, and errors the encoder cannot see: [error budget](../basics/pd-error-budget.md#^budget), [Abbe](../basics/pd-error-budget.md#^abbe), [cosine error](../basics/pd-error-budget.md#^cosine). ^fu-budget
- The optical lever's resolution: [uncertainty](../basics/pd-measurement.md#^uncertainty). ^fu-lever
- Printed parts under load: [creep](../basics/mat-structure-props.md#^creep). ^fu-creep
