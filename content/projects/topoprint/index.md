---
title: Topoprint
description: A slicer that starts from the load instead of the shape. Finite element analysis on a mesh that refines itself, topology optimization with the infill treated as a material, and toolpaths written directly from the result. On a 200 N wall bracket the model predicts 1.25 times the stiffness of a 20% gyroid print at 36% less plastic. Nothing is printed yet.
status: in-progress
start: 2026-11-13
cover: topoprint_toolpaths.png
publish: true
short: Topoprint
result: "A 200 N bracket optimized and sliced to G-code in 18 minutes on a laptop: predicted deflection 0.79 mm at 21% of the envelope mass, against 0.99 mm for a 20% gyroid print at 33%."
hook:
  label: Not yet printed
  text: Every number on this page is from the solver. The first print and a load test decide which of them survive.
---
![Toolpaths at three heights of the optimized bracket: solid first layers, then perimeters around a triangular infill whose walls are thicker along the top flange and the lower strut](topoprint_toolpaths.png)

*Figure 1. Toolpaths at three heights. Dark lines are perimeters, orange is solid fill, blue is infill. The thick blue walls sit where the part carries the most load and point along it.*

## Summary

A slicer takes a shape and fills it with one pattern at one density. The part's job never enters. If it has to carry a load, the usual answer is more perimeters and more infill everywhere, then a test print.

Topoprint takes the job first: where the part is held, where it is loaded, how much plastic it may use, and which way is up on the bed. It returns G-code. In between it runs finite element analysis (FEA), which solves for how a part deforms under load, and topology optimization, which moves material to where the analysis says it is working. Infill is not decoration added afterwards. It is a design variable, with stiffness computed from the actual printed pattern.

On the test part, a wall bracket under 200 N, the model predicts 0.79 mm of deflection at 21% of the envelope mass. The same envelope printed the usual way, two perimeters and 20% gyroid, deflects 0.99 mm at 33%. That is 1.25 times the stiffness for 36% less plastic, and the part needs no support.

| Item | Detail |
| --- | --- |
| Period | November 2026 to present |
| Role | Sole author, with groups of Claude agents working two sub-problems |
| Deliverables | The `topoprint` package: adaptive FEA, unit-cell homogenizer, optimizer, slicer; a bracket design with G-code; 10 verification tests |
| Tools | Python, NumPy, SciPy, PyTorch (for gradients), PyAMG |

## 1. What a print needs before it is a part

A print that carries load in service needs four things known before the spool turns.

| Requirement | Usual slicer workflow | Here |
| --- | --- | --- |
| Stiffness under the real load | found by printing and testing | predicted, with the mesh error stated |
| Material where the load is | uniform infill, chosen by feel | density and wall direction set per 2 mm voxel |
| Prints without support | checked by eye, supports added | enforced during optimization |
| Tolerance to a load that is a bit off | not considered | worst direction in a stated cone is designed for |

The fifth requirement is strength, and it is not here yet. Section 7 says what is missing.

## 2. The loop

![Density and analysis mesh at three stages of the optimization, mid-height slice](topoprint_evolution.png)

*Figure 2. Top: material density at cycles 1, 3 and 7. Bottom: the analysis mesh, darker is finer.*

Two fields live on a grid of 2 mm voxels. Occupancy says where the part is. Infill density, between 15% and 70%, says how much wall each voxel gets. One cycle does five things:

- builds a mesh for the current design, coarse where it is uniform and fine where the error estimate is large;
- solves for the deflection under every load case;
- moves both fields along the gradient at fixed mass;
- applies the print rules: every voxel supported from below within 45°, a solid shell on every outer surface;
- once, tries eight load directions on the rim of a 20° cone and adds the worst one as a second load case.

The mesh is an octree of cubes, each one splitting into eight where more resolution is needed. The final check used 73,257 unknowns. A uniform mesh at the same finest size would need 470,547.

## 3. Infill as a material

![Homogenized stiffness against density for triangular, grid and gyroid infill](topoprint_laws.png)

*Figure 3. Stiffness of three infill patterns as a fraction of solid plastic. Left: the weakest in-plane direction. Right: along the build axis.*

Topology optimization normally treats half-dense material as a fiction to be penalized away. A printer makes half-dense material all the time. So each infill pattern is solved once as a repeating cell, at eight densities, and the resulting stiffness becomes the material law. Stiffness at 30% is then the stiffness of a printable 30% infill, in every direction.

Two things fall out of Figure 3. A square grid is stiff along its walls and has almost no shear stiffness, so a load 15° off its axis finds very little. And any pattern that is constant along the build axis is as good as solid per gram in that direction, which gyroid is not.

## 4. The bracket

| | Optimized | Shell + 12% gyroid | Shell + 20% gyroid |
| --- | --- | --- | --- |
| Deflection at the load, mm | 0.79 | 1.70 | 0.99 |
| Deflection, worst direction in the cone, mm | 0.78 | 1.71 | 1.01 |
| Mass, fraction of the 96 × 48 × 32 mm envelope | 0.214 | 0.267 | 0.333 |

Inside the part, infill density follows the work the material does. Ranking interior voxels by strain energy, the least-loaded quarter averages 17% infill and the most-loaded quarter 34%. Most of the interior sits near the 15% floor, because for stiffness it is usually better to remove lightly loaded material than to thin it, and the solid shell already carries the peak bending stress.

Over the last three mesh refinements, from 37,605 to 73,257 unknowns, compliance moved 1.1%, and 0.4% on the final step.

## 5. From fields to G-code

The slicer is written for this job. Each 0.2 mm layer gets two perimeters, solid skins where the part starts or ends within four layers, solid fill under the load pad, and a triangular infill whose walls are one to six extrusion passes wide. The walls never overhang, because the pattern is the same on every layer.

| Check | Result |
| --- | --- |
| Voxels with no support within 45° below | 0 of 6,441 |
| Separate bodies | 1 |
| Layers | 160 |
| Extruded path | 150 m perimeter, 39 m solid, 188 m infill |

## 6. What the agents found

Two sub-problems went to groups of Claude agents. Each candidate was Python code scored by the solver, then re-scored on cases the agents never saw.

Which infill cell is stiffest per gram when stress is larger in one direction? Two independent runs converged on the same answer: a triangular lattice with one family of walls 2.4 times thicker, turned toward the larger principal stress. Along the thick walls it is about 55% stiffer than the plain lattice, across them about 30% softer. Each voxel of the bracket now chooses which of the three wall directions gets the thick walls. That alone cut deflection from 0.97 mm to 0.79 mm at the same mass.

Where should the mesh refine for a fixed number of unknowns? The runs showed my refinement rule was leaving half its budget unused: 3.1% error where 0.3% was available by marking twice as many elements per step. I took that fix. The agents' own rules were better still on a rotated load they had not seen, 0.19% against 0.66%, and worse on a second unseen design, so they are not in yet.

One negative result. Random ligament networks, after a 2026 Nature paper on scale-rich metamaterials, are a natural fit for extrusion lines. For stiffness they lose badly: 0.18 to 0.31 of the ideal against 0.44 to 0.52 for the lattices, because walls that end on other walls carry load in bending.

## 7. What stands between this and a part I would trust

- Nothing is printed. The plan is the optimized bracket and the 20% gyroid baseline, loaded on an Instron, with measured stiffness fed back into the material law.
- No strength model. The optimizer minimizes deflection. It does not limit stress, buckling of thin walls, or tension across layers, which is where a print is weakest.
- The G-code extrudes 33.9 cm³ against the 23.8 cm³ the optimizer assumed, mostly because crossing infill lines are counted twice. Flow has to drop at the crossings before the mass numbers above are real.
- The infill-as-material assumption was checked on one layer. With every wall resolved, the layer is 0.73 times as compliant as the model says, so the model is on the safe side, but that solve also carried a third more wall material.
- The base plastic is taken as isotropic at 3,000 MPa. The start block in the G-code is generic.
