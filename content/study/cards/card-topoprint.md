---
study: card
id: card-topoprint
title: "Topoprint: numbers card"
area: [mc, mat]
needs: [mc-solids, mat-structure-props, sp-yield-spc, gen-dimensions]
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [mc-solids](../basics/mc-solids.md), [mat-structure-props](../basics/mat-structure-props.md), [sp-yield-spc](../basics/sp-yield-spc.md), [gen-dimensions](../basics/gen-dimensions.md). The finite element method itself is a wave 2 basic (mc-fea), not yet written. ^needs

Source: the public page /projects/topoprint/. Nothing is printed; every number is from the solver. Say "predicted" every time. Every answer below quotes the page and names its section. ^source

## Numbers

> [!recall] Topoprint: the bracket result: load, deflection and mass for the optimized part and for the usual print, and the two ratios.
^n1

> [!solution]- Answer
> Summary and Section 4 (The bracket): under 200 N, the optimized bracket deflects 0.79 mm at 0.214 of the 96 × 48 × 32 mm envelope mass; two perimeters and 20% gyroid deflect 0.99 mm at 0.333 (12% gyroid: 1.70 mm at 0.267). That is 1.25 times the stiffness for 36% less plastic, with no support. Worst direction in the 20° cone: 0.78 against 1.01 mm.

> [!recall] Topoprint: the adaptive mesh: unknowns in the final check, what a uniform mesh would need, and the convergence evidence.
^n2

> [!solution]- Answer
> Section 2 (The loop): an octree of cubes, 73,257 unknowns in the final check against 470,547 for a uniform mesh at the same finest size. Section 4: over the last three refinements, from 37,605 to 73,257 unknowns, compliance moved 1.1%, and 0.4% on the final step.

> [!recall] Topoprint: the infill cell the agent groups converged on, its anisotropy, and what it did to the bracket.
^n3

> [!solution]- Answer
> Section 6 (What the agents found): a triangular lattice with one family of walls 2.4 times thicker, turned toward the larger principal stress; about 55% stiffer along the thick walls and about 30% softer across them than the plain lattice. Each voxel chooses which of the three wall directions gets the thick walls. That alone cut deflection from 0.97 mm to 0.79 mm at the same mass. Two independent runs converged on it.

> [!recall] Topoprint: the sanding drum's shank: its stress over allowable at sparse infill, printed solid, and by hand, and the fix.
^n4

> [!solution]- Answer
> Section 8 (A second part): the shank prints with its layers along the axis, so drive torque is carried as shear between layers. With 15% infill it sits at 1.07 of its allowable; printed solid with the hub, 0.34 in the model; a hand calculation at the shank surface gives 0.84, above the safety-factor-2 target. A printed 10 mm shank is not trusted beyond light passes; a bolt through the hub as the arbor is the real fix. Allowables assumed for PLA: 45 MPa in plane, 25 MPa tension across layers, 20 MPa shear between layers.

> [!recall] Topoprint: the drum's slicer-settings search: grid size against runs used, the chosen settings' filament and time against the default, and how the choice was confirmed.
^n5

> [!solution]- Answer
> Section 8: seven settings; a full grid is 1,458 slices, a Taguchi L18 array covers them in 18, each scored under four noise conditions. Choice (0.28 mm layers, 2 walls, 5% gyroid, 3 top and 2 bottom layers, 0.42 mm lines), shank and hub solid: 67.9 g and 1 h 30 against the vendor default's 86.8 g and 2 h 06, saving 22% filament and 29% time; worst stress over allowable 0.50, exactly the safety factor of 2, no margin. The additive prediction from the 18 runs, 68.9 g and 1 h 28, was within 2% of the confirmation run.

## Decisions

> [!recall] Topoprint: how half-dense material is treated in the optimization, over the usual practice, and why.
^d1

> [!solution]- Answer
> Section 3 (Infill as a material): each infill pattern is solved once as a repeating cell at eight densities and the resulting stiffness becomes the material law, over penalizing half-dense material away as a fiction, because a printer makes half-dense material all the time. Stiffness at 30% is then the stiffness of a printable 30% infill, in every direction.

> [!recall] Topoprint: the drum's infill pattern, over the one filament and time alone would pick, and why.
^d2

> [!solution]- Answer
> Section 8: gyroid over lightning infill. Lightning is lightest but leaves the rim and spokes unsupported; the strength check moved the choice to gyroid.

> [!recall] Topoprint: which of the agents' mesh-refinement results were adopted, which were not, and why.
^d3

> [!solution]- Answer
> Section 6: adopted the finding that the existing refinement rule left half its budget unused, 3.1% error where 0.3% was available by marking twice as many elements per step. Not adopted: the agents' own rules, which were better on a rotated load they had not seen (0.19% against 0.66%) but worse on a second unseen design.

## Failure

> [!recall] Topoprint: the check on the infill-as-material assumption, what it found, and what an earlier version of the page got wrong.
^f1

> [!solution]- Answer
> Section 7 (What stands between this and a part I would trust): checked on one layer with every wall resolved, the layer is 1.17 times as compliant as the model says, so the deflections are optimistic by roughly that much. An earlier version of the page said the opposite, because that check had run on toolpaths that printed the shell twice. Same section: the file extrudes 27.5 cm³ against the 23.8 cm³ the optimizer counted, about a sixth light.

## Story

> [!recall] Topoprint: the two-minute story, in five lines.
^s1

> [!solution]- Answer
> 1. Object: a slicer that starts from the load: where the part is held and loaded, how much plastic it may use, which way is up; it returns G-code.
> 2. Hard part: making infill a design variable, with stiffness from the actual printed pattern, while the optimizer moves material on a self-refining mesh under print rules (support within 45°, a solid shell).
> 3. Measured: nothing printed. The solver's mesh converges to 0.4% on the last step, and every G-code file is replayed before it reaches the printer (bed bounds, 0 mm outside the outline, peak flow 11.5 against 12 mm³/s, byte-identical on a second run).
> 4. Number: a 200 N bracket at 0.79 mm and 21% of the envelope mass, against 0.99 mm and 33% for a 20% gyroid print: 1.25 times the stiffness for 36% less plastic.
> 5. What it changed: on the sanding drum, physics pruning plus an 18-run orthogonal array saved 22% filament and 29% time at a safety factor of 2. Next is a load test of the bracket against the gyroid baseline, with measured stiffness fed back into the material law.

## Follow-ups

What a technical follow-up probes, and where it is taught. ^follow-ups

- Deflection of a loaded bracket, and why the shell carries the peak bending stress: [bending](../basics/mc-solids.md#^bending), [deflection](../basics/mc-solids.md#^deflection), [Hooke's law](../basics/mc-solids.md#^hooke). ^fu-beam
- Interlayer shear in the shank, and three separate stress limits: [stress](../basics/mc-solids.md#^stress), [torsion](../basics/mc-solids.md#^torsion), [yield criteria](../basics/mc-solids.md#^yield-criteria). ^fu-shank
- Thin walls the model does not check: [buckling](../basics/mc-solids.md#^buckling). ^fu-buckling
- Why a printed part is anisotropic: [defects](../basics/mat-structure-props.md#^defects), [strengthening](../basics/mat-structure-props.md#^strengthening). ^fu-anisotropy
- Orthogonal arrays and confirmation runs: [design of experiments](../basics/sp-yield-spc.md#^doe). ^fu-doe
- Why noise conditions were free (linear in load) and how stiffness scales with density: [scaling](../basics/gen-dimensions.md#^scaling). ^fu-scaling
