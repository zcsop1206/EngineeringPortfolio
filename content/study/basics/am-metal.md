---
study: basic
id: am-metal
title: Laser powder bed fusion
area: mat
needs: [th-transient, mat-structure-props]
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [the semi-infinite solid](th-transient.md#^semi-infinite) for heat flowing from a surface into a body; [defects](mat-structure-props.md#^defects) and [fatigue](mat-structure-props.md#^fatigue) for what pores do to a part.

**Laser powder bed fusion** (L-PBF) builds metal parts from powder. A recoater spreads a layer of powder 20 to 60 µm thick on a metal build plate, inside argon or nitrogen. A laser of 100 to 400 W, focused to a spot 50 to 100 µm across, scans each cross-section at around 1 m/s, melting a track of powder into the layer below. The plate drops one layer and the cycle repeats. Every interesting question is about the **melt pool**, the small moving puddle under the beam: how big it is, how it behaves, and what it leaves behind.

## Energy density

> [!def] Volumetric energy density
> With laser power $P$, scan speed $v$, hatch spacing $h$ (distance between neighbouring tracks) and layer thickness $t$, the **volumetric energy density** is
> $$\text{VED} = \frac{P}{v\,h\,t},$$
> usually in J/mm³. It is the laser energy delivered per unit volume of layer built. Dense parts of a given alloy on a given machine are often found in a band of VED.
^energy-density

VED is a weak predictor, for three reasons that the rest of this doc makes precise. First, it merges four settings into one number, but the melt pool depends on them separately: its width goes as $\sqrt{P/v}$, its length as $P$, and its cooling rate as $v/P$ (Theorems 1 and 2), so raising $P$ and $v$ together keeps VED and width but stretches the pool until it breaks up. Second, $h$ and $t$ enter VED as a product, while full fusion is a geometric condition on each of them (Theorem 3), so two settings with the same VED can differ between dense and porous. Third, it leaves out the material (absorptance, diffusivity, melting point), the spot size, and the change of absorptance when the pool switches mode. Use VED to compare settings near a known-good one, on one machine and one powder; groups built from the melt-pool model below transfer better. ^ved-weak

## The moving point source

> [!thm] Theorem R (Rosenthal's moving point source, stated)
> A point source absorbs power $AP$ ($A$ is the absorptance, the fraction of laser power taken in) and moves at speed $v$ along $x$ over the surface $z = 0$ of a semi-infinite body that is otherwise at $T_0$. Assume constant conductivity $k$, density $\rho$ and specific heat $c$, diffusivity $\alpha = k/(\rho c)$, no latent heat, no fluid flow, no heat loss from the surface, and a steady state in the frame of the source. With $\xi = x - vt$ the distance ahead of the source and $R = \sqrt{\xi^2 + y^2 + z^2}$,
> $$T - T_0 = \frac{AP}{2\pi k R}\exp\!\left(-\frac{v(\xi + R)}{2\alpha}\right).$$
^rosenthal

Ahead of the source ($\xi > 0$) the exponent is about $-v\xi/\alpha$ and the field dies within a few $\alpha/v$; behind it ($\xi < 0$) the exponent nearly vanishes and a long warm tail trails. The ratio of the beam's length scale to the diffusion length, the **Péclet number** $\text{Pe} = vr_b/\alpha$ for beam radius $r_b$, says which regime holds; L-PBF runs at Pe of order 1 to 10. The model's flaws are known: it is infinite at the source, ignores melting's latent heat and the stirring of the pool by surface tension gradients, and uses one set of properties for solid and liquid. It still gives the right scalings. ^rosenthal-regime

> [!thm] Theorem 1 (pool shape, tail and cooling rate)
> In the Rosenthal field, with $\Delta T_m = T_m - T_0$ for melting point $T_m$:
> 1. every cross-section's isotherms are semicircles centred on the scan line, so the predicted pool is exactly half as deep as it is wide;
> 2. on the centre line behind the source, $T - T_0 = AP/(2\pi k s)$ at distance $s$, so the pool extends $L_t = AP/(2\pi k\Delta T_m)$ behind the source;
> 3. the centre line solidifies while cooling at $\dot T = 2\pi k v \Delta T_m^2/(AP)$.
^rosenthal-tail

> [!proof]- Proof (d 2.5)
> 1. At fixed $\xi$, $T$ depends on $y$ and $z$ only through $R$, that is, through $y^2 + z^2$.
> 2. So isotherms in a cross-section are circles about the scan line, cut in half by the surface: in every cross-section, and so for the pool, depth equals half the width.
> 3. On the centre line behind the source, $y = z = 0$ and $\xi = -s$, so $R = s$ and $\xi + R = 0$: $T - T_0 = AP/(2\pi ks)$.
> 4. Setting this to $\Delta T_m$ gives $s = L_t = AP/(2\pi k \Delta T_m)$.
> 5. A fixed material point has $d\xi/dt = -v$, so it cools at $|\dot T| = v\,\partial T/\partial\xi = v\,AP/(2\pi k s^2)$.
> 6. Eliminate $s$ with step 3, $1/s^2 = (2\pi k(T - T_0)/(AP))^2$: $|\dot T| = 2\pi k v(T - T_0)^2/(AP)$, and at $T = T_m$ this is the stated rate.
^p-rosenthal-tail

> [!thm] Theorem 2 (pool width at high speed)
> When $vw/(8\alpha) \gg 1$, the Rosenthal pool has width
> $$w = \sqrt{\frac{8AP}{\pi e\,\rho c\, v\,\Delta T_m}},$$
> independent of $k$. It depends on power and speed only through the absorbed energy per unit length $AP/v$.
^rosenthal-width

> [!proof]- Proof (d 4)
> 1. On the surface at lateral offset $r$ and distance $s$ behind the source, $R = \sqrt{s^2 + r^2}$ and $\xi + R = R - s$.
> 2. For $s \gg r$: $R - s \approx r^2/(2s)$ and $1/R \approx 1/s$, so $T - T_0 \approx \dfrac{AP}{2\pi k s}\exp\!\left(-\dfrac{vr^2}{4\alpha s}\right)$.
> 3. The widest point of the isotherm at offset $r$ is where this is largest over $s$. With $u = vr^2/(4\alpha)$, $\frac{d}{ds}\left[\frac1s e^{-u/s}\right] = e^{-u/s}\left(\frac{u}{s^3} - \frac1{s^2}\right)$ vanishes at $s = u$.
> 4. The maximum is $\dfrac{AP}{2\pi k u e} = \dfrac{2\alpha AP}{\pi e k v r^2} = \dfrac{2AP}{\pi e\rho c v r^2}$, using $\alpha = k/(\rho c)$.
> 5. The pool edge is where this maximum equals $\Delta T_m$ at $r = w/2$: $\dfrac{w^2}{4} = \dfrac{2AP}{\pi e\rho c v\Delta T_m}$, which gives $w$.
> 6. Step 2 needed $s \gg r$ at $s = u$: $u/r = vr/(4\alpha) = vw/(8\alpha) \gg 1$.
^p-rosenthal-width

> [!example] A stainless track
> Take a stainless steel with $\rho = 7900$ kg/m³, $c = 600$ J/(kg K), $k = 25$ W/(m K) (assumed high-temperature averages), $\Delta T_m = 1375$ K and $A = 0.35$, scanned at 200 W and 1 m/s. Estimate the pool width, depth, tail length and solidification cooling rate.
^ex-rosenthal-track

> [!solution]- Solution
> methods: am-metal/rosenthal-width, am-metal/rosenthal-tail
> 1. $\alpha = 25/(7900\cdot600) = 5.27\times10^{-6}$ m²/s.
> 2. $w = \sqrt{8\cdot0.35\cdot200/(\pi e\cdot 4.74\times10^6\cdot 1\cdot 1375)} = 100$ µm; depth 50 µm.
> 3. Validity: $vw/(8\alpha) = 2.4$, only moderately large; evaluating the full Rosenthal field numerically gives 98 µm, so the formula holds to 2%.
> 4. Tail: $70/(2\pi\cdot25\cdot1375) = 324$ µm.
> 5. Cooling: $2\pi\cdot25\cdot1\cdot1375^2/70 = 4.2\times10^6$ K/s. Such rates freeze very fine solidification cells, one reason as-built L-PBF metal is stronger than cast metal of the same alloy.

## Fusing a layer

> [!thm] Theorem 3 (full-fusion bound)
> Model each track's melted cross-section as a semicircle of diameter $w$ centred on the scan line at the layer's top surface (Theorem 1), with tracks $h$ apart and layers $t$ thick. Every point of the new layer and of its interface with the layer below is melted if and only if
> $$\left(\frac{h}{w}\right)^2 + \left(\frac{2t}{w}\right)^2 \le 1.$$
^lof-bound

> [!proof]- Proof (d 2)
> 1. Put the top surface at $z = 0$ (depth $z$ positive downward), track axes at $x = jh$, and the interface with the layer below at $z = t$.
> 2. A point $(x, z)$ is melted by track $j$ when $(x - jh)^2 + z^2 \le (w/2)^2$.
> 3. On the interface, the point farthest from every axis is midway between two tracks, at $x = h/2$.
> 4. It is melted when $(h/2)^2 + t^2 \le (w/2)^2$, which rearranges to the stated bound; if it fails, that point stays unmelted.
> 5. Any other point of the layer has no larger horizontal distance to its nearest axis and no larger depth, so it is melted whenever the midpoint is.
^p-lof-bound

The bound is the edge, not a target: a sound process puts the pool well into the layer below, to remelt surface oxide and absorb the scatter in powder layer thickness. ^lof-margin

> [!example] Same energy density, different outcome
> With the 100 µm pool of the previous example, compare $(h, t) = (70, 30)$ µm with $(35, 60)$ µm.
^ex-same-ved

> [!solution]- Solution
> methods: am-metal/lof-bound, am-metal/energy-density
> 1. Both give $\text{VED} = 200/(1000\cdot0.07\cdot0.03) = 200/(1000\cdot0.035\cdot0.06) = 95$ J/mm³.
> 2. First: $0.7^2 + 0.6^2 = 0.85 \le 1$, fused.
> 3. Second: $0.35^2 + 1.2^2 = 1.55 > 1$: the pool is only 50 µm deep and cannot reach through a 60 µm layer. Same VED, lack of fusion.

## Melt-pool modes

> [!def] Melt-pool modes
> - **Conduction mode**: the surface stays below boiling, heat spreads by conduction, and the pool is shallow, with depth near half its width (Theorem 1).
> - **Keyhole mode**: the surface reaches boiling; the recoil of evaporating metal pushes the liquid down into a deep, narrow vapour cavity (the **keyhole**). Light reflects several times inside it, so absorptance rises well above that of a flat surface, and the pool becomes deeper than it is wide. The cavity is unstable; when it collapses it can trap vapour as a pore at the pool bottom.
> - **Transition mode**: between the two, with a shallow depression.
> - **Balling and humping**: a long, thin pool breaks into beads, because a liquid column is unstable to ripples longer than about its circumference (the Plateau-Rayleigh instability). Pools longer than about $\pi$ times their width are at risk. At low energy, poor wetting of the layer below also makes beads.
>
> Spatter (ejected droplets) and denudation (powder swept away beside the track by the vapour plume's flow) are side effects of the vapour jet.
^melt-pool-modes

## Porosity

> [!def] Porosity in L-PBF
> - **Lack-of-fusion pores**: irregular voids between tracks or layers, often with unmelted powder inside, from too little energy or too wide a hatch or too thick a layer (Theorem 3). Their sharp edges make them the worst for [fatigue](mat-structure-props.md#^fatigue).
> - **Keyhole pores**: near-spherical voids at the bottom of the pool, from too much energy per length.
> - **Gas pores**: small spherical voids from gas trapped inside the powder particles or from moisture and dissolved gas.
>
> Density is measured by the Archimedes method (below), by polished cross-sections, or by X-ray computed tomography. Hot isostatic pressing (heat with high gas pressure) closes internal pores but not those open to the surface.
^porosity

> [!thm] Theorem 4 (Archimedes density)
> A part weighs $m_a$ in air and apparently $m_w$ when hung fully submerged in water of density $\rho_w$. Ignoring the buoyancy of air, its density is $\rho = \dfrac{m_a\,\rho_w}{m_a - m_w}$.
^archimedes

> [!proof]- Proof
> 1. Submerged, the water pushes up with the weight of the water displaced: $(m_a - m_w)g = \rho_w V g$.
> 2. So $V = (m_a - m_w)/\rho_w$ and $\rho = m_a/V$ is the stated formula.
^p-archimedes

> [!example] Relative density of a cube
> A printed cube weighs 10.000 g in air and 8.720 g in water at 20 °C ($\rho_w = 0.9982$ g/cm³). The wrought alloy has density 7.99 g/cm³. What is the cube's relative density?
^ex-archimedes

> [!solution]- Solution
> methods: am-metal/archimedes
> 1. $\rho = 10.000\cdot0.9982/1.280 = 7.798$ g/cm³.
> 2. Relative density $7.798/7.99 = 97.6\%$: about 2.4% porosity, a lot for L-PBF, where 99.5% and better is routine.

## Residual stress

> [!def] Residual stress in L-PBF
> **Residual stress** is stress left in a part with no load on it. L-PBF makes a lot, in two ways. While the laser heats the top, the hot layer expands against the cooler, stiffer material below, which holds it in compression; hot metal is weak, so it yields. When it cools it wants to be shorter than the material that held it, so it ends in tension. Each new layer also shrinks on cooling onto the layers below, adding tension at the top and compression underneath. The result is tension near the top surface and the outer walls, balanced by compression inside, at magnitudes up to the yield stress. On release from the build plate, the part springs and curls. Remedies: heat the build plate, scan in short islands and rotate the scan direction between layers, and stress-relieve by heat treatment before cutting the part off the plate.
^residual-stress

> [!thm] Theorem 5 (stress in a constrained layer)
> A thin layer is bonded to a substrate too stiff to deform and cools by $\Delta T$ from a stress-free state. With modulus $E$, Poisson's ratio $\nu$ and expansion coefficient $\alpha_T$, it carries the equal-biaxial tension $\sigma = \dfrac{E\alpha_T\Delta T}{1 - \nu}$ until that reaches the yield stress.
^layer-stress

> [!proof]- Proof (d 2)
> 1. Bonded to a rigid substrate, the layer's in-plane total strains stay zero: $\varepsilon_x = \varepsilon_y = 0$.
> 2. Total strain is elastic plus thermal, and the thermal part on cooling is $-\alpha_T\Delta T$ in each direction.
> 3. The layer is thin with a free top, so $\sigma_z = 0$, and [Hooke's law](mc-solids.md#^hooke) gives $\varepsilon_x^{el} = (\sigma_x - \nu\sigma_y)/E$.
> 4. By symmetry $\sigma_x = \sigma_y = \sigma$, so $0 = \sigma(1-\nu)/E - \alpha_T\Delta T$.
> 5. Solve for $\sigma$. With $\sigma_z = 0$ and equal in-plane stresses, the [von Mises](mc-solids.md#^yield-criteria) equivalent stress is $\sigma$ itself, so yield caps it at the yield stress.
^p-layer-stress

> [!example] A titanium layer
> A titanium alloy ($E = 114$ GPa, $\nu = 0.34$, $\alpha_T = 9\times10^{-6}$ /K, yield about 900 MPa) is assumed stress-free 1000 K above the substrate. What stress would elastic cooling produce?
^ex-layer-stress

> [!solution]- Solution
> methods: am-metal/layer-stress
> 1. $\sigma = 114\times10^9\cdot9\times10^{-6}\cdot1000/0.66 = 1.55$ GPa.
> 2. That exceeds yield, so the layer yields and is left near 900 MPa in tension. Equivalently, the thermal strain 0.9% exceeds the biaxial yield strain $(1-\nu)\sigma_y/E = 0.66\cdot900/114{,}000 = 0.52\%$.

## Supports

> [!def] Supports
> **Supports** are thin structures printed under a part to do three jobs. They **anchor** it to the plate so residual stress cannot curl it up into the recoater. They **conduct heat** away from regions over loose powder, which conducts around a hundred times worse than solid metal, so an unsupported overhang overheats, sags and grows dross. They **carry overhangs**: surfaces facing down at less than about 45° from horizontal (alloy and machine dependent) need them. Every support costs material, build time, removal labour and a rough surface where it was cut off, so designs aim to be self-supporting (chamfers instead of flat ceilings, teardrop or diamond holes instead of round ones above a few millimetres).
^supports

## Derive

> [!derive] Prove that the Rosenthal field satisfies the heat equation in the frame of the moving source, $\alpha\nabla^2 T + v\,\partial T/\partial\xi = 0$.
^d-rosenthal-pde

> [!solution]- Solution
> methods: am-metal/rosenthal
> 1. In the source's frame, $\partial T/\partial t|_x = -v\,\partial T/\partial\xi$, so the heat equation becomes $\alpha\nabla^2T + vT_\xi = 0$.
> 2. Write $T - T_0 = e^{-v\xi/(2\alpha)}\phi$. Substituting turns the equation into $\nabla^2\phi = (v/(2\alpha))^2\phi$.
> 3. For a function of $R$ alone, $\nabla^2\phi = \frac1R(R\phi)''$. So $(R\phi)'' = (v/2\alpha)^2 R\phi$, whose decaying solution is $R\phi = Ke^{-vR/(2\alpha)}$.
> 4. Then $T - T_0 = \frac KR e^{-v(\xi + R)/(2\alpha)}$, Rosenthal's form. (Also checked numerically by finite differences.)

> [!derive] Prove that the heat flowing out through a small hemisphere around the Rosenthal source tends to $AP$ as its radius shrinks, which fixes the prefactor $AP/(2\pi k)$.
^d-rosenthal-flux

> [!solution]- Solution
> methods: am-metal/rosenthal
> 1. Near the source the exponential tends to 1, so $T - T_0 \approx K/R$ with $K = AP/(2\pi k)$.
> 2. Radial flux $-k\,\partial T/\partial R = kK/R^2$.
> 3. Times the hemisphere's area $2\pi R^2$: $2\pi kK = AP$. The exponential's corrections are of order $vR/\alpha$, which vanishes as $R \to 0$.

> [!derive] Show that in the high-speed regime of Theorem 2, the ratio of the pool's tail length to its width grows as $\sqrt{Pv}$, and find the constant.
^d-length-width

> [!solution]- Solution
> methods: am-metal/rosenthal-width, am-metal/rosenthal-tail
> 1. $L_t/w = \dfrac{AP}{2\pi k\Delta T_m}\sqrt{\dfrac{\pi e\rho c v\Delta T_m}{8AP}}$.
> 2. Simplify: $L_t/w = \sqrt{\dfrac{e\,AP\,v}{32\pi\,k\,\alpha\,\Delta T_m}}$, using $\rho c = k/\alpha$. So doubling both $P$ and $v$ doubles the ratio at fixed width.

> [!derive] A part has closed pores (fraction $p_c$ of its volume) and pores open to the surface (fraction $p_o$) that fill with water when it is submerged. Show that the Archimedes method reports a relative density of $(1 - p_c - p_o)/(1 - p_o)$, higher than the true $1 - p_c - p_o$.
^d-open-pores

> [!solution]- Solution
> methods: am-metal/archimedes
> 1. Solid volume $V(1 - p_c - p_o)$, so $m_a = \rho_s V(1 - p_c - p_o)$.
> 2. Submerged, the water fills the open pores, so the displaced volume is $V(1 - p_o)$: $m_a - m_w = \rho_w V(1 - p_o)$.
> 3. Theorem 4 then reports $\rho_s(1 - p_c - p_o)/(1 - p_o)$. Open porosity hides; seal or coat the part, or use tomography.

## Problems

> [!problem] Widest hatch for a stainless track (d 3.5)
> For the 200 W, 1 m/s track of the stainless example (pool width 100.3 µm), find the widest hatch that still fuses fully at layer thickness 30 µm and at 40 µm. Compare the VED and the volume melted per second at the two limits. What does the thicker layer buy?
^inv-mat-lpbf-hatch

> [!solution]- Solution
> methods: am-metal/lof-bound, am-metal/energy-density
> 1. $h_{max} = w\sqrt{1 - (2t/w)^2}$.
> 2. $t = 30$ µm: $h_{max} = 100.3\sqrt{1 - 0.598^2} = 80.4$ µm; VED $= 200/(1000\cdot0.0804\cdot0.03) = 82.9$ J/mm³; rate $vht = 2.41$ mm³/s.
> 3. $t = 40$ µm: $h_{max} = 60.5$ µm; VED $= 82.6$ J/mm³; rate 2.42 mm³/s.
> 4. At fixed power and speed the melted volume per second is nearly the same. The thicker layer buys fewer layers, so fewer recoats, at the cost of a rougher side surface and a thinner margin.
> Answer: 80 µm and 60 µm; both near 83 J/mm³ and 2.4 mm³/s.

> [!problem] Doubling build rate (d 4.5)
> The stainless steel of the example (same properties) runs at 150 W, 0.75 m/s, $h = 70$ µm, $t = 30$ µm. Three ways to double the melted volume per second are proposed: (a) 300 W and 1.5 m/s; (b) 300 W, 0.75 m/s, $t = 60$ µm; (c) 300 W, 0.75 m/s, $h = 140$ µm. Treat a pool longer than $\pi$ times its width as at risk of breaking up, and judge each. (Ignore keyholing.)
^inv-mat-lpbf-throughput

> [!solution]- Solution
> methods: am-metal/rosenthal-width, am-metal/rosenthal-tail, am-metal/lof-bound
> 1. Baseline: $w = 100.3$ µm (same $P/v$ as the example), $L_t = AP/(2\pi k\Delta T_m) = 243$ µm, $L_t/w = 2.42$; fusion $0.70^2 + 0.60^2 = 0.84$. VED 95 J/mm³, 1.58 mm³/s.
> 2. All three options keep VED at 95 J/mm³ and give 3.15 mm³/s.
> 3. (a) $P/v$ unchanged, so $w = 100.3$ µm and fusion is unchanged (0.84), but $L_t = 486$ µm and $L_t/w = 4.85 > \pi$: humping risk.
> 4. (b) and (c): $P/v$ doubles, so $w = 100.3\sqrt2 = 141.9$ µm, $L_t = 486$ µm, $L_t/w = 3.43$, just over $\pi$.
> 5. (b) fusion: $(70/141.9)^2 + (120/141.9)^2 = 0.96$: fused, with almost no margin. (At 0.75 m/s the high-speed formula is only roughly valid; the full Rosenthal field gives 139 µm and 0.996, no margin at all.)
> 6. (c) fusion: $(140/141.9)^2 + (60/141.9)^2 = 1.15 > 1$: lack of fusion.
> Answer: (c) fails on fusion; (a) keeps fusion but doubles the pool length and risks humping; (b) is the only candidate, marginal on both counts, so test it first, with a slightly smaller hatch. VED could not tell the three apart.

> [!problem] Weighing a small coupon (d 3)
> A balance reads to ±1 mg (standard uncertainty) on each weighing. (a) For a 1.000 g steel coupon that weighs 0.872 g in water ($\rho_w = 0.9982$ g/cm³), what is the standard uncertainty of the Archimedes density? (b) Repeat for a coupon ten times heavier with the same density. (c) To tell 99.5% from 99.8% relative density with the uncertainty at most half that gap, roughly how heavy must the coupon be?
^inv-mat-archimedes-uncertainty

> [!solution]- Solution
> methods: uncertainty-propagation, am-metal/archimedes
> 1. $\rho = m_a\rho_w/(m_a - m_w) = 7.798$ g/cm³. Partial derivatives: $\partial\rho/\partial m_a = -\rho_w m_w/(m_a - m_w)^2 = -53.1$ and $\partial\rho/\partial m_w = \rho_w m_a/(m_a - m_w)^2 = 60.9$ (per gram).
> 2. [Propagate](pd-measurement.md#^propagation) in quadrature: $u = 0.001\sqrt{53.1^2 + 60.9^2} = 0.081$ g/cm³, 1.04%.
> 3. Ten times the mass divides both derivatives by 10: $u = 0.10\%$.
> 4. The relative uncertainty scales as $1/m$; half the 0.3% gap is 0.15%, so $m \gtrsim 1.04/0.15 \approx 7$ g.
> Answer: (a) 0.08 g/cm³ (1.0%); (b) 0.10%; (c) about 7 g or more.

> [!problem] Hours on the machine (d 2.5)
> A part of 50 cm³ and 60 mm height is printed at 1 m/s, 70 µm hatch and 30 µm layers, and each recoat takes 8 s. Ignore contour scans and jumps. (a) How long does one part take? (b) How long do four identical parts side by side take, and what is the time per part?
^inv-mat-lpbf-build-time

> [!solution]- Solution
> methods: estimation, am-metal/energy-density
> 1. Melt rate $vht = 1000\cdot0.07\cdot0.03 = 2.1$ mm³/s $= 7.56$ cm³/h; scanning one part takes $50/7.56 = 6.61$ h.
> 2. Layers: $60/0.03 = 2000$; recoating takes $2000\cdot8$ s $= 4.44$ h whatever is on the plate.
> 3. One part: $11.1$ h. Four parts: $4\cdot6.61 + 4.44 = 30.9$ h, 7.7 h per part.
> Answer: (a) about 11 h; (b) about 31 h, 7.7 h each. Recoating is 40% of a lone part's time, which is why plates are filled.

> [!problem] Heat under an overhang (d 2.5)
> A downward-facing surface sits 3 mm above solid material. Underneath it is either loose powder (effective conductivity 0.2 W/(m K)) or a support lattice that is 15% solid by area, of an alloy with conductivity 15 W/(m K). (a) Compare the thermal resistance per unit area of the two paths. (b) If the surface may run at most 500 K above the material below, what steady heat flux can each path carry away?
^inv-mat-overhang-heat

> [!solution]- Solution
> methods: resistance-network
> 1. Powder: $R'' = 0.003/0.2 = 0.015$ m²K/W.
> 2. Lattice: effective conductivity $0.15\cdot15 = 2.25$ W/(m K) (parallel paths, [resistance](th-conduction.md#^resistance)), so $R'' = 0.003/2.25 = 1.33\times10^{-3}$ m²K/W.
> 3. Ratio: 11.
> 4. Flux at 500 K: powder $500/0.015 = 33$ kW/m²; lattice $500/1.33\times10^{-3} = 375$ kW/m².
> Answer: (a) the lattice path is 11 times less resistive; (b) 33 kW/m² against 375 kW/m².
