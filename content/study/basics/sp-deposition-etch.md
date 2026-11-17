---
study: basic
id: sp-deposition-etch
title: Deposition and etch
area: sp
needs: [sp-vacuum-plasma]
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [wall flux](sp-vacuum-plasma.md#^kinetic), [mean free path](sp-vacuum-plasma.md#^mean-free-path) and [the sheath](sp-vacuum-plasma.md#^sheath).
^needs

## Chemical vapour deposition

> [!def] CVD
> Precursor gases react on a heated surface and leave a solid film: silane gives polysilicon, dichlorosilane and ammonia give silicon nitride. **LPCVD** runs at roughly 0.1 to 1 Torr in a hot-walled tube with wafers stacked close together; **PECVD** lets a plasma supply the energy so the wafer can be cooler; **APCVD** runs at atmospheric pressure. The growth rate is film thickness per time.
^def-cvd

> [!thm] Theorem 1 (two regimes of CVD)
> Let the precursor reach the surface through a gas boundary layer with mass-transfer coefficient $h_g$ (a velocity, about $D_g/\delta$ for gas diffusivity $D_g$ and layer thickness $\delta$) and react there at first order with rate constant $k_s$. With $C_g$ the precursor concentration in the bulk gas and $N$ precursor molecules per unit volume of film, the growth rate is
> $$G = \frac{C_g}{N}\,\frac{k_sh_g}{k_s + h_g}.$$
> If $k_s \ll h_g$ the process is **reaction-limited**: $G \approx k_sC_g/N$, Arrhenius in temperature, and uniformity needs uniform temperature. If $h_g \ll k_s$ it is **transport-limited**: $G \approx h_gC_g/N$, nearly independent of temperature, and uniformity needs uniform gas flow.
^cvd

> [!proof]- Proof
> 1. Through the boundary layer, $F = h_g(C_g - C_s)$, with $C_s$ the concentration at the surface. At the surface, $F = k_sC_s$.
> 2. Equate them: $C_s = h_gC_g/(k_s + h_g)$, so $F = C_gk_sh_g/(k_s + h_g)$, two resistances $1/k_s$ and $1/h_g$ in series.
> 3. Each $N$ molecules make a unit volume of film: $G = F/N$.
> 4. When one resistance dominates, the other drops out.
^p-cvd

This is the same series-flux structure as [oxidation](sp-oxidation-diffusion.md#^deal-grove), without the growing barrier. It explains why LPCVD works with wafers packed millimetres apart: at low pressure $D_g$ is large (a derive prompt below), $h_g \gg k_s$, and the reaction, which is the same on every wafer at the same temperature, sets the rate.
^lpcvd

## Atomic layer deposition

> [!def] ALD
> The surface is exposed to two precursors in turn, with a purge between. Each exposure reacts only with the sites left by the other and stops when they are used up (**self-limiting**), so each cycle adds a fixed thickness, the **growth per cycle**, about 0.1 nm for aluminium oxide from trimethylaluminium and water (about). Because every reachable surface saturates, given enough dose the film is conformal on any shape.
^ald

> [!thm] Theorem 2 (Langmuir saturation)
> A surface with $N_s$ sites per area receives a flux $\Gamma$ of precursor. A molecule that lands on an empty site sticks with probability $s$; one that lands on a filled site leaves. The filled fraction is
> $$\theta(t) = 1 - \exp(-s\Gamma t/N_s).$$
> It depends on pressure and time only through the **exposure** $pt$, counted in langmuirs (1 L = $10^{-6}$ Torr·s).
^langmuir

> [!proof]- Proof
> 1. Of the $\Gamma$ molecules arriving per area per time, a fraction $1 - \theta$ land on empty sites and $s$ of those stick: $N_s\,d\theta/dt = s\Gamma(1 - \theta)$.
> 2. Solve with $\theta(0) = 0$.
> 3. $\Gamma \propto p$ ([wall flux](sp-vacuum-plasma.md#^kinetic)), so the exponent is proportional to $pt$.
^p-langmuir

At the bottom of a deep hole the precursor arrives only after many wall bounces, so the exposure needed grows steeply with aspect ratio, roughly as its square (stated, not derived here; check).
^ald-deep

## Physical vapour deposition

> [!def] PVD
> **Evaporation**: a source heated in high vacuum emits atoms that fly straight to the substrate. A surface at its vapour pressure $p_v$ evaporates at most $p_v/\sqrt{2\pi mk_BT}$ molecules per area per time (a derive prompt below). **Sputtering**: ions from a plasma, usually argon, hit a target and knock atoms out; the **sputter yield** $Y$ (atoms per ion) is measured, not derived here, and depends on ion energy, the two masses and the target. A magnetron's magnets trap electrons near the target, which raises the plasma density there. At sputtering pressures the mean free path is about a centimetre, so sputtered atoms arrive from many directions; evaporated atoms arrive in a beam.
^pvd

> [!thm] Theorem 3 (thickness from a small evaporation source)
> A small flat source emits with intensity per solid angle proportional to $\cos\theta$, $\theta$ measured from its normal. A flat substrate parallel to it at height $h$ receives a thickness that falls with radial distance $r$ as
> $$\frac{t(r)}{t(0)} = \frac{1}{[1 + (r/h)^2]^2}.$$
^evaporation-uniformity

> [!proof]- Proof
> 1. The point at radius $r$ is at distance $R = \sqrt{h^2 + r^2}$, in direction $\theta$ with $\cos\theta = h/R$.
> 2. The flux per solid angle there is $\propto\cos\theta$; a solid angle $d\Omega$ covers area $R^2d\Omega/\cos\phi$ on the substrate, with $\phi$ the arrival angle from the substrate normal, here equal to $\theta$.
> 3. So the deposition per area is $\propto\cos\theta\cos\phi/R^2 = h^2/R^4$.
> 4. Divide by its value at $r = 0$, $1/h^2$.
^p-evaporation-uniformity

## Step coverage

> [!def] Step coverage
> The film thickness on the bottom (or the sidewall) of a feature divided by the thickness on the flat top. The **aspect ratio** of a feature is its depth over its width. Conformal processes (ALD, LPCVD with a low sticking coefficient) give near 100 %; line-of-sight processes give less, and their thicker deposits at the top corners can close the opening over a void.
^def-step-coverage

> [!thm] Theorem 4 (line of sight into a trench)
> Flux arrives from every direction above the wafer with equal intensity per solid angle, sticks where it first lands, and is never re-emitted. The bottom centre of a long trench of width $w$ and depth $h$ receives the fraction
> $$\frac{1}{\sqrt{1 + 4\,\mathrm{AR}^2}}, \qquad \mathrm{AR} = h/w,$$
> of the flux on the flat top surface.
^step-coverage

> [!proof]- Proof (d 4.5)
> 1. A surface element receives $I\cos\theta\,d\Omega$ from each direction at angle $\theta$ to its normal, with $I$ the uniform intensity; over a full open hemisphere this is $\pi I$, the top surface's share.
> 2. Describe a direction by $\varphi$, the angle of its projection onto the trench's cross-section, and $\beta$, its angle out of that plane: unit vector $(\sin\varphi\cos\beta, \sin\beta, \cos\varphi\cos\beta)$, with $d\Omega = \cos\beta\,d\beta\,d\varphi$.
> 3. $\cos\theta = \cos\varphi\cos\beta$, so the directions in $d\varphi$ deliver $I\cos\varphi\,d\varphi\int_{-\pi/2}^{\pi/2}\cos^2\beta\,d\beta = \tfrac{\pi}{2}I\cos\varphi\,d\varphi$.
> 4. The trench is long, so a direction from the bottom centre escapes through the opening exactly when $|\varphi| \le \varphi_0$, with $\tan\varphi_0 = (w/2)/h$.
> 5. The bottom centre receives $\tfrac{\pi}{2}I \cdot 2\sin\varphi_0 = \pi I\sin\varphi_0$. Divide by $\pi I$: $\sin\varphi_0 = (w/2)/\sqrt{h^2 + w^2/4} = 1/\sqrt{1 + 4\,\mathrm{AR}^2}$.
^p-step-coverage

A trench of aspect ratio 1 gets 45 % at the bottom centre, aspect ratio 2 gets 24 %. A low sticking coefficient lets molecules bounce and spread, which is how CVD and ALD beat this.
^step-coverage-numbers

## Wet etching

> [!def] Wet etch
> A liquid dissolves the film. Most wet etches are **isotropic**: they etch sideways under the mask as fast as down, so a line loses about the etch depth from each side. If the rate is reaction-limited it is Arrhenius in temperature; if it is limited by transport of etchant through the liquid, stirring changes it, which is the quick test. Hydrofluoric acid etches silicon dioxide and barely touches silicon; buffered HF etches thermal oxide at the order of 100 nm/min at room temperature (check). Hot KOH or TMAH etch crystalline silicon **anisotropically**: {111} planes etch far slower than {100}, so pits on a (100) wafer are bounded by {111} sidewalls.
^wet-etch

> [!thm] Theorem 5 (KOH grooves on (100) silicon)
> The {111} sidewalls meet a (100) surface at $\arccos(1/\sqrt3) = 54.74°$. A mask slot of width $W$ along a ⟨110⟩ direction, etched to depth $d$, has bottom width $W - \sqrt2\,d$, and the groove closes into a V at $d = W/\sqrt2$.
^koh

> [!proof]- Proof
> 1. The angle between planes is the angle between their normals: $\cos\alpha = [100]\cdot[111]/(1 \cdot \sqrt3) = 1/\sqrt3$.
> 2. $\tan\alpha = \sqrt2$, so each sidewall recedes $d/\tan\alpha = d/\sqrt2$ horizontally at depth $d$.
> 3. Bottom width $W - 2d/\sqrt2 = W - \sqrt2d$, zero at $d = W/\sqrt2$.
^p-koh

## Reactive ion etching

> [!def] RIE
> A plasma makes reactive radicals (fluorine from $\mathrm{SF_6}$ or $\mathrm{CF_4}$, chlorine from $\mathrm{Cl_2}$) and ions. The wafer sits on the powered electrode, where the [sheath](sp-vacuum-plasma.md#^sheath) accelerates ions straight down. Ion bombardment makes the chemical reaction far faster on the surfaces it hits than chemistry or sputtering alone (an empirical synergy), so floors etch and sidewalls barely do: the etch is **anisotropic**. A polymer deposited on sidewalls protects them further; deep silicon etching alternates short etch and passivation steps. Narrow, deep features etch more slowly than wide ones, because fewer radicals and ions reach their bottoms (the same geometry as Theorem 4). The end of an etch is detected by the change in the plasma's emission when the film clears.
^rie

> [!thm] Theorem 6 (loading)
> Radicals are made at rate $g$ per unit volume in a plasma of volume $V$, are pumped away with residence time $\tau_r$, and are consumed on an etching area $A$ at rate $kn$ per unit area, where $n$ is their density. The etch rate is
> $$R = \frac{R_0}{1 + k\tau_rA/V},$$
> with $R_0$ its value as $A \to 0$: the more area exposed, the slower each part of it etches.
^loading

> [!proof]- Proof
> 1. Radical balance: $V\,dn/dt = gV - nV/\tau_r - knA$.
> 2. In steady state $n = g\tau_r/(1 + k\tau_rA/V)$.
> 3. The etch rate is proportional to $kn$; at $A \to 0$ it is $R_0 \propto kg\tau_r$, and the ratio gives the formula.
^p-loading

## Selectivity and over-etch

> [!def] Selectivity
> The **selectivity** of an etch to a material is the film's etch rate divided by that material's: the mask above or the layer below. Film thickness and etch rate vary across a wafer, so the etch runs until the slowest point clears (**over-etch**), and the layer below is etched wherever the film cleared earlier. A mask must survive the whole etch: thickness at least $t_{\rm film}(1 + f)/S_{\rm mask}$ for an over-etch fraction $f$.
^selectivity

## Examples

> [!example] Evaporation across a wafer
> A small evaporation source sits 300 mm below a 100 mm wafer, centred. How much thinner is the film at the wafer's edge?
^ex-evap-wafer

> [!solution]- Solution
> methods: sp-deposition-etch/evaporation-uniformity
> 1. $r/h = 50/300$; $t/t_0 = 1/(1 + 0.0278)^2 = 0.947$.
> 2. 5.3 % thinner at the edge. A taller chamber or rotating the wafers on a planetary mount evens it out.

> [!example] A KOH groove
> A 500 µm slot on a (100) wafer, along ⟨110⟩, is etched 100 µm deep in KOH. Find the bottom width and the depth at which the groove self-terminates.
^ex-koh

> [!solution]- Solution
> methods: sp-deposition-etch/koh
> 1. Bottom width $500 - \sqrt2 \times 100 = 358.6$ µm.
> 2. V at $500/\sqrt2 = 353.6$ µm deep.

> [!example] Saturating a surface
> Water vapour at $10^{-6}$ Torr and 300 K strikes a surface with $10^{19}$ sites per m², and sticks to an empty site with probability 0.01. What exposure fills 99 % of the sites, and how long is that at 0.1 Torr?
^ex-ald-dose

> [!solution]- Solution
> methods: sp-deposition-etch/langmuir, sp-vacuum-plasma/kinetic
> 1. $\Gamma = p/\sqrt{2\pi mk_BT} = 4.8\times10^{18}$ m⁻²s⁻¹ at $10^{-6}$ Torr.
> 2. 99 % needs $s\Gamma t/N_s = \ln 100 = 4.6$: $t = 4.6\times10^{19}/(0.01 \times 4.8\times10^{18}) = 964$ s at $10^{-6}$ Torr, i.e. about 960 L.
> 3. At 0.1 Torr: 9.6 ms. That is why ALD pulses are milliseconds at fractions of a Torr.

## Derive

> [!derive] Using the mean free path and the mean speed, show that a gas's diffusivity scales as $T^{3/2}/p$, and say what that does to $h_g$ and to the CVD regime when the pressure drops from 760 Torr to 0.5 Torr.
^d-gas-diffusivity

> [!solution]- Solution
> methods: sp-vacuum-plasma/mean-free-path, sp-vacuum-plasma/kinetic, scaling
> 1. Kinetic estimate: $D_g \approx \tfrac13\lambda\bar v$, with $\lambda \propto T/p$ and $\bar v \propto T^{1/2}$, so $D_g \propto T^{3/2}/p$.
> 2. Dropping the pressure 1500 times raises $D_g$ 1500 times; the boundary layer thickens only as $p^{-1/2}$ at fixed gas velocity (its thickness goes as the square root of the kinematic viscosity, which is $\propto 1/p$), so $h_g = D_g/\delta$ rises as $p^{-1/2}$, about 39 times, and the process moves toward reaction-limited.

> [!derive] Show that the bottom centre of a round hole of diameter $w$ and depth $h$, under the assumptions of Theorem 4, receives the fraction $1/(1 + 4\,\mathrm{AR}^2)$ of the top flux.
^d-via-coverage

> [!solution]- Solution
> methods: sp-deposition-etch/step-coverage
> 1. The opening is a cone of half-angle $\varphi_0$ with $\tan\varphi_0 = (w/2)/h$.
> 2. Received: $\int_0^{\varphi_0}I\cos\theta\,2\pi\sin\theta\,d\theta = \pi I\sin^2\varphi_0$; divide by $\pi I$.
> 3. $\sin^2\varphi_0 = (w/2)^2/(h^2 + w^2/4) = 1/(1 + 4\,\mathrm{AR}^2)$.

> [!derive] With $k_s = k_0e^{-E_a/k_BT}$ and $h_g$ independent of temperature, show that the CVD growth rate has local apparent activation energy $E_a\,h_g/(k_s + h_g)$.
^d-apparent-activation

> [!solution]- Solution
> methods: sp-deposition-etch/cvd
> 1. $\ln G = \ln k_s + \ln h_g - \ln(k_s + h_g) + \text{const}$.
> 2. With $u = 1/k_BT$, $d\ln k_s/du = -E_a$, so $d\ln G/du = -E_a + E_a k_s/(k_s + h_g) = -E_ah_g/(k_s + h_g)$.

> [!derive] Show that a surface held at temperature $T$ in vacuum evaporates at most $p_v/\sqrt{2\pi mk_BT}$ molecules per area per time, with $p_v$ the equilibrium vapour pressure.
^d-hertz-knudsen

> [!solution]- Solution
> methods: sp-vacuum-plasma/kinetic
> 1. In equilibrium with its vapour at $p_v$ the surface gains no mass, so it emits exactly as many molecules as strike it: $p_v/\sqrt{2\pi mk_BT}$, from the [wall flux](sp-vacuum-plasma.md#^kinetic) (taking every arrival to stick).
> 2. Emission depends on the surface, not on the vapour, so in vacuum it is the same; with a sticking probability below 1 both sides scale by it, which makes this the maximum.

## Problems

> [!problem] A resist for an oxide etch (d 2.5)
> An 800 nm oxide is etched with 20 % over-etch using a process whose selectivity of oxide to resist is 4. What is the least resist thickness?
^inv-sp-resist-thickness

> [!solution]- Solution
> methods: sp-deposition-etch/selectivity
> 1. Oxide-equivalent etch: $800 \times 1.2 = 960$ nm.
> 2. Resist lost: $960/4 = 240$ nm.
> Answer: 240 nm, before any margin for rounding of the resist edges.

> [!problem] Clearing a film everywhere (d 3.5)
> A 500 nm film varies by ±5 % across the wafer and etches at 100 nm/min ±4 %, the two variations independent and placed worst-case. The layer below etches 20 times slower than the film. How much over-etch time is needed past the first point to clear, and how much of the layer below is lost at worst?
^inv-sp-overetch

> [!solution]- Solution
> methods: sp-deposition-etch/selectivity
> 1. Last point to clear: thickest film at the slowest rate, $525/96 = 5.47$ min.
> 2. First point to clear: thinnest at the fastest, $475/104 = 4.57$ min.
> 3. That point then sees $0.90$ min at $104/20 = 5.2$ nm/min.
> Answer: 0.90 min more; about 4.7 nm of the layer below.

> [!problem] A sputtered copper film (d 2.5)
> Argon ions strike a copper target at 10 mA/cm², with a sputter yield of 2.5 copper atoms per ion; 30 % of the sputtered atoms land on the substrate, over the same area. Copper has $8.49\times10^{22}$ atoms/cm³. What is the deposition rate?
^inv-sp-sputter-rate

> [!solution]- Solution
> methods: sp-deposition-etch/pvd
> 1. Ions: $0.01/1.602\times10^{-19} = 6.24\times10^{16}$ cm⁻²s⁻¹; atoms out: $1.56\times10^{17}$; landing: $4.68\times10^{16}$ cm⁻²s⁻¹.
> 2. Rate $= 4.68\times10^{16}/8.49\times10^{22} = 5.5\times10^{-7}$ cm/s.
> Answer: about 5.5 nm/s, 330 nm/min.

> [!problem] A CVD process between regimes (d 4)
> A surface reaction has activation energy 1.7 eV. Near 650 °C the measured growth rate's local apparent activation energy is 1.2 eV. Find $k_s/h_g$ there, and the fractional change in growth rate for a 5 K rise in temperature.
^inv-sp-cvd-regime

> [!solution]- Solution
> methods: sp-deposition-etch/cvd
> 1. $E_{\rm app}/E_a = h_g/(k_s + h_g) = 1.2/1.7 = 0.706$, so $k_s/h_g = 0.42$: mostly reaction-limited.
> 2. $d\ln G/dT = E_{\rm app}/k_BT^2 = 1.2/(8.617\times10^{-5} \times 923^2) = 1.63\,\%$/K.
> Answer: $k_s/h_g \approx 0.42$; about 8 % faster for +5 K (8.5 % if the same activation energy held over the whole step).

> [!problem] Half coverage at the bottom (d 4.5)
> Under the assumptions of Theorem 4, what aspect ratio gives the bottom centre half the top's flux for a long trench, and for a round hole?
^inv-sp-half-coverage

> [!solution]- Solution
> methods: sp-deposition-etch/step-coverage
> 1. Trench: $1/\sqrt{1 + 4\,\mathrm{AR}^2} = 1/2$ gives $\mathrm{AR} = \sqrt3/2 = 0.87$.
> 2. Hole: $1/(1 + 4\,\mathrm{AR}^2) = 1/2$ gives $\mathrm{AR} = 0.5$.
> A hole sees less sky than a trench of the same aspect ratio, so line-of-sight deposition fails in holes first.
