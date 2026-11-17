---
study: basic
id: pd-error-budget
title: Error budgets, Abbe and thermal drift
area: pd
needs: [pd-exact-constraint, th-conduction, pd-measurement]
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [constraint lines and exact constraint](pd-exact-constraint.md#^exact-constraint), [thermal resistance](th-conduction.md#^resistance), [uncertainty](pd-measurement.md#^uncertainty) and [its propagation](pd-measurement.md#^propagation); thermal strain and bending from [mc-solids](mc-solids.md#^hooke).
^needs

## Words that get mixed up

> [!def] Resolution, repeatability, accuracy
> - **Resolution**: the smallest change a system can command or detect, such as one encoder count or one display digit.
> - **Repeatability**: the spread of results when the same move or measurement is repeated under the same conditions, quoted as $\pm2\sigma$ or $\pm3\sigma$ of the scatter. Unidirectional repeatability approaches from one side; bidirectional includes backlash and hysteresis.
> - **Accuracy**: how close a result is to the true value, after whatever calibration is applied. It is bounded by the systematic errors left uncorrected plus the random scatter.
> - **Reproducibility**: repeatability when conditions change (another day, operator or setup).
>
> **Systematic** errors repeat, so they can be mapped and subtracted ([calibration](pd-measurement.md#^calibration)); **random** errors cannot, and only average down as $1/\sqrt N$ over $N$ readings. So a machine is made repeatable first and accurate by calibration second, and resolution finer than the repeatability buys nothing.
^accuracy-terms

## Small motions at a distance

> [!thm] Theorem 1 (error motions at a point)
> A rigid body is displaced by a small translation $\delta t$ of a reference point $O$ on it and a small rotation $\delta\theta$ (a vector along the rotation axis, length the angle). A point at $r$ from $O$ moves by $\delta p = \delta t + \delta\theta \times r$ to first order. Through a chain of bodies, the error at the tool is the sum of such terms, each rotation multiplied by its lever arm from that body's reference to the tool.
^error-transfer

> [!proof]- Proof (d 2)
> 1. A rotation by a small angle vector $\delta\theta$ is $R = I + [\delta\theta]_\times + O(\delta\theta^2)$, where $[\delta\theta]_\times r = \delta\theta \times r$.
> 2. The point moves from $O + r$ to $O + \delta t + Rr$.
> 3. Subtract: $\delta p = \delta t + (R - I)r = \delta t + \delta\theta \times r + O(\delta\theta^2r)$.
> 4. In a chain, each body's motion adds its own such term with $r$ taken from its reference to the tool; products of two error motions are second order and drop.
^p-error-transfer

> [!thm] Corollary (Abbe error)
> If a scale measures along a line offset by $h$ from the point whose position matters, a tilt $\delta\theta$ of the carriage about an axis perpendicular to both the scale and the offset makes the reading wrong by $h\,\delta\theta$. **Abbe principle**: put the scale on the line through the functional point, $h = 0$; if that is impossible, keep $h$ small or measure the tilt and correct for it. In its general form: a displacement sensor's line of measurement should pass through the point being measured.
^abbe

> [!proof]- Proof
> 1. Take the scale's reading point as $O$ and the functional point at $r$, length $h$ perpendicular to the scale. By Theorem 1, $\delta\theta \times r$ lies along the scale with magnitude $h\,\delta\theta$.
> 2. The scale reads only $\delta t$ along its own line, so it misses that term.
^p-abbe

A sensor sees only what moves inside its **metrology loop**, the chain of parts from its reference to its target. Anything that moves the functional point outside that chain, such as a part that tilts while the sensor reads a crank or a motor, is invisible to it, however fine its resolution. Keep the metrology loop short, unloaded and thermally quiet, and separate from the **structural loop** that carries the forces. The stepper stage page is a case of a large error outside the encoders' loop ([stepper](../../projects/stepper/index.md)).
^metrology-loop

> [!thm] Theorem 2 (cosine error)
> A displacement sensor whose axis is tilted by $\alpha$ from the direction of motion reads the projection $L\cos\alpha$ of a true travel $L$, short by $L(1 - \cos\alpha) \approx L\alpha^2/2$. (Some contact geometries read long, $L/\cos\alpha$; the error is the same to second order.) Being second order, it is small for small $\alpha$, and the reading is stationary at $\alpha = 0$, so a sensor is aligned by turning it until the reading peaks.
^cosine

> [!proof]- Proof
> 1. The sensor measures the component of the displacement along its axis: $L\cos\alpha$.
> 2. $\cos\alpha = 1 - \alpha^2/2 + O(\alpha^4)$, and $1/\cos\alpha = 1 + \alpha^2/2 + O(\alpha^4)$.
^p-cosine

## Thermal drift

> [!thm] Theorem 3 (thermal growth and bending)
> A free part warmed uniformly by $\Delta T$ grows by $\alpha L\Delta T$ in every length $L$, without stress. A free beam whose temperature varies linearly through its depth $h$, by $\Delta T$ from one face to the other, bends to curvature $\kappa = \alpha\Delta T/h$, again without stress; over a span $S$ it sags $\kappa S^2/8$. Restrain the motion and stress appears instead: $E\alpha\Delta T$ in a fully restrained bar.
^thermal-drift

> [!proof]- Proof (d 2.5)
> 1. A temperature change adds the free strain $\alpha\Delta T$ to each normal strain ([Hooke's law](mc-solids.md#^hooke)).
> 2. Uniform $\Delta T$: the free strain is the same everywhere, which is the strain of a uniformly scaled copy, so the part can take it without any mechanical strain; each length grows by $\alpha L\Delta T$.
> 3. A linear profile gives free strain $\varepsilon_0 + (\alpha\Delta T/h)y$, linear in the depth $y$: exactly the strain field of a beam bent to curvature $\alpha\Delta T/h$ ([bending](mc-solids.md#^bending)).
> 4. A free beam can take that strain field, so the mechanical strain, and the stress, is zero.
> 5. A circular arc of curvature $\kappa$ over a chord $S$ has sagitta $\kappa S^2/8$ to leading order.
> 6. A fully restrained bar keeps zero total strain, so its mechanical strain is $-\alpha\Delta T$ and its stress $-E\alpha\Delta T$.
^p-thermal-drift

Approximate expansion coefficients near room temperature, in $10^{-6}$/K: aluminium 23, copper 17, austenitic stainless steel 17, carbon steel 12, alumina 7 to 8, silicon 2.6, a 36 % nickel–iron alloy 1.2, fused silica 0.5, printed polymers 50 to 100. One kelvin on 100 mm of aluminium is 2.3 µm.
^cte-table

Design rules that follow:
- Gradients bend; a uniform change only scales. Aim for an isothermal structure rather than merely a cool one, and remember a steady heat flow $Q$ through a resistance $R$ holds a gradient $\Delta T = QR$ ([thermal resistance](th-conduction.md#^resistance)).
- Fix a part by exact constraint, a pin and a slot pointing at it, so it grows about the pin without stress; the pin is the **thermal centre**. Put it at the functional point when you can.
- Symmetric structures grow symmetrically and do not tilt.
- Two materials in series can be sized so their growths cancel (a problem below).
- Wait out the thermal time constant before measuring, and keep heat sources (motors, people, lamps) out of the metrology loop.
^thermal-rules

## The budget

> [!def] Error budget
> A table of every source that moves the functional point in the sensitive direction. Each row gives the physical cause, the size at the source, the sensitivity (a lever arm from Theorem 1, a cosine factor, a thermal length), the size at the functional point, and its kind: **systematic** (repeats; calibrate it out or carry it at worst case) or **random** (independent scatter, given as $\sigma$). Combine
> $$\text{total} = \sum\left|\text{systematic}\right| + k\sqrt{\sum\sigma_i^2},$$
> with $k = 2$ or $3$ for the coverage wanted; independent random terms add in quadrature by the [propagation law](pd-measurement.md#^propagation). Written before the hardware exists, a budget shows which term dominates, so the effort goes there, and it allocates the total among subsystems. Correlated terms (two errors with one cause) add linearly, not in quadrature.
^budget

The stepper stage page sets its focus budget this way: the depth of focus is split among autofocus, chip, drift, levelling and stage tilt, and the stage's share fixes the tilt it may have ([stepper](../../projects/stepper/index.md)).
^budget-stepper

## Tolerance stacks

> [!thm] Theorem 4 (worst-case and statistical stacks)
> A dimension $y = \sum s_ix_i$ is built from parts $x_i = \bar x_i \pm t_i$, with sensitivities $s_i$ ($\pm1$ in a simple chain). Worst case, $y$ stays within $\bar y \pm \sum|s_i|t_i$, guaranteed. If the $x_i$ are independent and each $t_i$ is the same multiple $k$ of its standard deviation, $y$ has standard deviation $\sqrt{\sum s_i^2\sigma_i^2}$ and the statistical tolerance $\pm\sqrt{\sum s_i^2t_i^2}$ is $k$ of them; with normal distributions the same fraction of assemblies falls outside as of each part.
^stack

> [!proof]- Proof
> 1. $|\Delta y| \le \sum|s_i||\Delta x_i| \le \sum|s_i|t_i$, with equality when every part sits at the extreme that pushes $y$ the same way.
> 2. Independence: $\mathrm{Var}\,y = \sum s_i^2\,\mathrm{Var}\,x_i$ ([propagation](pd-measurement.md#^propagation)).
> 3. With $t_i = k\sigma_i$: $k\sigma_y = \sqrt{\sum s_i^2k^2\sigma_i^2} = \sqrt{\sum s_i^2t_i^2}$.
> 4. A sum of independent normal variables is normal, so the fraction beyond $k\sigma$ is the same for $y$ as for each $x_i$.
^p-stack

The statistical stack is only as good as its assumptions: independent parts, processes centred on nominal, and enough assemblies for the averaging to happen. A process mean that drifts (tool wear) adds linearly. For a few parts, or a fit that must never fail, use worst case; some practices split the difference by inflating the statistical result by about 1.5.
^stack-caveats

## GD&T, the basics

> [!def] Geometric dimensioning and tolerancing
> GD&T states each feature's allowed zone relative to a **datum reference frame**.
> - **Datums**: the primary datum plane touches the part at three points (removing $z$, tip and tilt), the secondary at two, the tertiary at one. A 3-2-1 frame is [exact constraint](pd-exact-constraint.md#^exact-constraint), which is why parts are fixtured and inspected that way.
> - **Feature control frame**: the symbol, the zone size (with ⌀ if the zone is cylindrical) and a material modifier, then the datums in order of precedence.
> - **Form** controls need no datum: flatness, straightness, circularity, cylindricity. **Orientation**: parallelism, perpendicularity, angularity. **Location**: position, a zone about the true position given by exact (basic) dimensions; and profile. **Runout**: the wobble a feature shows when the part spins about a datum axis.
> - **Material condition**: maximum material condition (MMC) is the size with the most material (the smallest hole, the largest pin), least material condition (LMC) the opposite. A position tolerance stated at MMC grows by a **bonus** equal to how far the actual size departs from MMC.
> - **Virtual condition**: the worst-case boundary a mating part must clear. For a hole, its MMC size minus its position tolerance at MMC; for a pin, its MMC size plus its position tolerance.
^gdt

> [!thm] Theorem 5 (floating fastener)
> Two plates each have a pattern of clearance holes, MMC diameter $H$, at the same basic positions, and are joined by bolts of largest diameter $F$ with nuts. A position tolerance of $\varnothing T = H - F$ at MMC on each plate's holes guarantees that every bolt passes.
^floating-fastener

> [!proof]- Proof (d 2.5)
> 1. A hole of diameter $H$ whose axis lies within $\varnothing T$ of its true position is off by at most $T/2$, so it contains the cylinder of diameter $H - T = F$ centred on the true position.
> 2. A larger actual hole, $H + b$, may be off by $(T + b)/2$ with the bonus, and still contains that same cylinder.
> 3. Both plates are located on the same datums and basic pattern, so each pair of holes contains the same cylinder of diameter $F$ at the true position.
> 4. A bolt of diameter at most $F$ placed there passes through both plates.
^p-floating-fastener

## Examples

> [!example] Ten readings of a gauge block
> A height gauge resolving 1 µm measures a 10 mm gauge block ten times, reading these deviations in µm: 3, 5, 4, 6, 4, 5, 3, 5, 4, 6. Separate its resolution, repeatability and accuracy.
^ex-gauge-readings

> [!solution]- Solution
> methods: pd-error-budget/accuracy-terms
> 1. Resolution: 1 µm, the display step.
> 2. Mean 4.5 µm, sample standard deviation 1.08 µm: repeatability about $\pm2.2$ µm at $2\sigma$.
> 3. The mean sits 4.5 µm off the block's calibrated size: a systematic offset.
> Answer: before calibration the gauge is accurate to about $4.5 \pm 2.2$ µm; subtracting the offset leaves the repeatability as the limit. The mean of the ten is known to about $1.08/\sqrt{10} = 0.34$ µm.

> [!example] A scale below the work
> A linear stage's scale runs 25 mm below the surface of the part it positions. The carriage pitches by 20 µrad over its travel. How large is the error the scale cannot see?
^ex-abbe-offset

> [!solution]- Solution
> methods: pd-error-budget/abbe
> 1. Abbe error $= h\,\delta\theta = 25\ \text{mm} \times 20\ \text{µrad}$.
> Answer: 0.5 µm, many times a typical scale's resolution; the fix is to raise the scale to the work's height or to measure the pitch.

> [!example] A small budget
> A positioning axis has these terms at the work, in nm: systematic, thermal growth 200 and cosine error 50; random ($1\sigma$), scale noise 10, floor vibration 30, carriage pitch through the Abbe offset 40. Find the total at $k = 2$, and what it would be with every term at worst case.
^ex-small-budget

> [!solution]- Solution
> methods: error-budget
> 1. Systematic sum: $200 + 50 = 250$ nm.
> 2. Random: $\sqrt{10^2 + 30^2 + 40^2} = 51.0$ nm, times 2 is 102 nm.
> 3. Total $352$ nm; adding the random $2\sigma$ terms linearly instead gives $250 + 160 = 410$ nm.
> Answer: about 350 nm, and the thermal term is the one to work on; halving vibration would barely move the total.

## Derive

> [!derive] One plate has threaded holes (the bolts are fixed in it) and the other has clearance holes of MMC diameter $H$ for bolts of diameter $F$. Show that every bolt passes when the two plates' position tolerances at MMC satisfy $T_1 + T_2 \le H - F$, and that equality is the largest such split.
^d-fixed-fastener

> [!derive] Show that the smallest circular position zone containing a $\pm a$ square coordinate zone has $\pi/2$ times its area.
^d-zone-area

> [!derive] Show that $n$ equal independent random terms of $\sigma$ each combine to $\sigma\sqrt n$, and find the $n$ at which the statistical total is a third of the worst-case total.
^d-rss-n

> [!derive] A plate is located by a round pin at one point and a second pin in a slot whose length points at the first pin. Show that under a uniform temperature change the plate grows about the first pin, stays against both pins, and carries no stress.
^d-pin-slot

## Problems

> [!problem] A stage with its scale below the sample (d 2.5)
> A stage pitches by up to ±10 µrad. How far below the sample may its scale sit if the unseen error must stay within ±100 nm?
^inv-pd-scale-offset

> [!solution]- Solution
> methods: pd-error-budget/abbe
> 1. $h\,\delta\theta \le 100$ nm with $\delta\theta = 10$ µrad.
> Answer: $h \le 10$ mm.

> [!problem] A spacer of two metals (d 3.5)
> A steel post ($\alpha = 12 \times 10^{-6}$/K) stands on a base, and an aluminium sleeve ($\alpha = 23 \times 10^{-6}$/K) hangs down from the post's top, so the sleeve's lower end sits 50 mm above the base. Choose the two lengths so that the 50 mm does not change with a uniform temperature change.
^inv-pd-two-metal-spacer

> [!solution]- Solution
> methods: pd-error-budget/thermal-drift
> 1. The end's height is $L_s - L_a = 50$ mm.
> 2. Its drift is $(\alpha_sL_s - \alpha_aL_a)\Delta T = 0$, so $L_s/L_a = 23/12$.
> 3. Solve: $L_a(23/12 - 1) = 50$, $L_a = 54.5$ mm, $L_s = 104.5$ mm.
> Answer: steel 104.5 mm, aluminium 54.5 mm. It cancels only for uniform temperature; the two parts must also share temperature, so the slow one sets the transient error.

> [!problem] Five spacers in a housing (d 3)
> Five spacers, each $10.00 \pm 0.05$ mm with the tolerance at $\pm3\sigma$, stack inside a housing. Give the stack's worst-case and statistical tolerances, and the fraction of stacks longer than 50.15 mm if each spacer is normal and centred.
^inv-pd-spacer-stack

> [!solution]- Solution
> methods: pd-error-budget/stack
> 1. Worst case: $\pm5 \times 0.05 = \pm0.25$ mm.
> 2. Statistical: $\pm\sqrt5 \times 0.05 = \pm0.112$ mm.
> 3. $\sigma_y = \sqrt5 \times 0.05/3 = 0.0373$ mm; $0.15/0.0373 = 4.02\sigma$.
> 4. One-sided normal tail beyond $4.02\sigma$: $2.8 \times 10^{-5}$.
> Answer: $\pm0.25$ mm worst case, $\pm0.11$ mm statistical, about 28 stacks per million over 50.15 mm, if the processes really are centred.

> [!problem] Two plates and four bolts (d 3)
> Two plates are bolted together with four bolts and nuts. The bolts are at most 6.0 mm in diameter; the holes in both plates are $6.6 \pm 0.1$ mm. What position tolerance at MMC should the holes carry, and how much position error is acceptable on a hole that came out at 6.7 mm?
^inv-pd-four-bolts

> [!solution]- Solution
> methods: pd-error-budget/floating-fastener, pd-error-budget/gdt
> 1. MMC of the hole is 6.5 mm.
> 2. Theorem 5: $\varnothing T = 6.5 - 6.0 = \varnothing0.5$ at MMC on each plate.
> 3. At 6.7 mm the bonus is 0.2 mm: $\varnothing0.7$.
> Answer: $\varnothing0.5$ at MMC; a 6.7 mm hole may be anywhere within $\varnothing0.7$ of true position, 0.35 mm off centre.

> [!problem] An aluminium plate on a warm bench (d 3.5)
> A 300 mm long, 10 mm thick aluminium plate rests on a bench that keeps its bottom face 0.5 K warmer than its top. How much does it bow over its length, and how does that compare with what a uniform 0.5 K change would do to its length?
^inv-pd-plate-bow

> [!solution]- Solution
> methods: pd-error-budget/thermal-drift
> 1. $\kappa = \alpha\Delta T/h = 23 \times 10^{-6} \times 0.5/0.01 = 1.15 \times 10^{-3}$ per m (radius 870 m).
> 2. Sag over the 300 mm: $\kappa S^2/8 = 1.15 \times 10^{-3} \times 0.09/8 = 12.9$ µm. The warmer bottom is the longer face, so the plate curves with its top on the inside: the ends lift and it rocks on its middle.
> 3. A uniform 0.5 K: $\alpha L\Delta T = 3.45$ µm of length.
> Answer: about 13 µm of bow against 3.5 µm of growth: the gradient, not the temperature, is what spoils flatness.

> [!problem] A focus allocation (d 4.5)
> An exposure tool has a focus tolerance of ±2.0 µm. Systematic terms, carried at worst case: thermal drift 0.4 µm, chuck flatness 0.3 µm. Random terms, given at $2\sigma$: autofocus 0.5 µm, vibration 0.3 µm, coating thickness 0.4 µm. The chip may also be tilted by $\theta$ about the field centre, a systematic term; the field's diagonal is 1.5 mm. Find the largest allowed tilt, and what it would be if every term were added at worst case.
^inv-pd-focus-allocation

> [!solution]- Solution
> methods: error-budget, pd-error-budget/error-transfer
> 1. Tilt lifts the field's corner by $\theta d/2$ with $d/2 = 0.75$ mm, the farthest point from the centre.
> 2. Random at $2\sigma$: $\sqrt{0.5^2 + 0.3^2 + 0.4^2} = 0.707$ µm.
> 3. Budget: $0.4 + 0.3 + 0.707 + 0.75\,\text{mm}\cdot\theta \le 2.0$ µm, so $\theta \le 0.593\ \text{µm}/0.75\ \text{mm} = 0.79$ mrad.
> 4. All worst case: $0.4 + 0.3 + 1.2 + 0.75\,\text{mm}\cdot\theta \le 2.0$ µm gives $\theta \le 0.13$ mrad.
> Answer: 0.79 mrad statistically, 0.13 mrad at full worst case; how the random terms combine decides a factor of six in the tilt requirement.
