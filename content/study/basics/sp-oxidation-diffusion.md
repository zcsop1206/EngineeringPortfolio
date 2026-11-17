---
study: basic
id: sp-oxidation-diffusion
title: Oxidation, diffusion and implant
area: sp
needs: [th-transient, op-wave]
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: the [semi-infinite solid](th-transient.md#^semi-infinite) (the diffusion equation here is the same equation) and [thin-film interference](op-wave.md#^thin-film) (for oxide colours).
^needs

A furnace grows oxide and moves dopants, and both run at Arrhenius rates, so what a wafer receives is set by its temperature, the time, and the ambient. The [tube furnace](../../projects/tubefurnace/index.md) page is a worked case of every section below.
^intro

## Arrhenius rates

> [!def] Arrhenius law (empirical)
> Many thermally activated rates follow $r = r_0 \exp(-E_a/k_B T)$, with $T$ the absolute temperature, $k_B = 8.617 \times 10^{-5}$ eV/K the Boltzmann constant, $E_a$ the **activation energy** and $r_0$ the prefactor. The reason it works is that the fraction of events with energy above a barrier $E_a$ goes as the Boltzmann factor $e^{-E_a/k_B T}$. The law itself is a fit: $E_a$ and $r_0$ are read off a plot of $\ln r$ against $1/T$ over a measured range and should not be trusted far outside it.
^arrhenius

## Thermal oxidation

Silicon oxidises in dry oxygen ($\mathrm{Si} + \mathrm{O_2} \to \mathrm{SiO_2}$) or in steam ($\mathrm{Si} + 2\mathrm{H_2O} \to \mathrm{SiO_2} + 2\mathrm{H_2}$). The oxidant diffuses through the oxide already there and reacts at the silicon interface, so new oxide forms underneath the old, consuming silicon as it goes.
^oxidation-setup

> [!def] The quantities in the oxidation model
> $C^*$: the oxidant concentration the oxide surface would hold in equilibrium with the gas; by Henry's law $C^* = Hp$, proportional to the oxidant's partial pressure $p$. $C_o$, $C_i$: the actual concentrations at the oxide surface and at the silicon interface. $h$: the gas-phase mass-transfer coefficient (a velocity). $D$: the oxidant's diffusivity in the oxide. $k_s$: the interface reaction rate constant (first order: flux $= k_s C_i$). $N_1$: oxidant molecules built into a unit volume of oxide, about $2.2 \times 10^{22}$ cm⁻³ for $\mathrm O_2$ (one per $\mathrm{SiO_2}$) and twice that for $\mathrm{H_2O}$.
^oxidation-defs

> [!thm] Theorem 1 (Deal-Grove)
> Assume the three oxidant fluxes (gas to surface, across the oxide, into the reaction) are equal at each moment; this quasi-steady state holds because the oxide thickens slowly compared with the time to diffuse across it. Then the oxide thickness $x(t)$, starting from $x_i$ at $t = 0$, obeys
> $$x^2 + Ax = B(t + \tau), \qquad A = 2D\Big(\frac{1}{k_s} + \frac{1}{h}\Big), \quad B = \frac{2DC^*}{N_1}, \quad \tau = \frac{x_i^2 + Ax_i}{B},$$
> so $x = \frac{A}{2}\Big[\sqrt{1 + 4B(t + \tau)/A^2} - 1\Big]$.
^deal-grove

> [!proof]- Proof (d 4.5)
> 1. Gas to surface: $F_1 = h(C^* - C_o)$.
> 2. Across the oxide: steady diffusion with no sink inside gives a linear profile, so $F_2 = D(C_o - C_i)/x$.
> 3. Into the reaction: $F_3 = k_s C_i$.
> 4. Set $F_1 = F_2 = F_3 = F$ and write each drop in terms of $F$: $C^* - C_o = F/h$, $C_o - C_i = Fx/D$, $C_i = F/k_s$. Adding them, $C^* = F(1/h + x/D + 1/k_s)$.
> 5. So $F = C^*/(1/k_s + 1/h + x/D)$: three resistances in series.
> 6. Every $N_1$ oxidant molecules make a unit volume of oxide: $dx/dt = F/N_1$.
> 7. Separate and multiply by $2D$: $(A + 2x)\, dx = B\, dt$.
> 8. Integrate from $x_i$ at $t = 0$: $x^2 + Ax - x_i^2 - Ax_i = Bt$, which is $x^2 + Ax = B(t + \tau)$.
> 9. The quadratic formula gives the explicit $x$.
^p-deal-grove

The structure is the general one for a surface reaction fed through a growing barrier: a resistance that grows with $x$ in series with fixed ones. Thin oxides grow linearly at the rate $B/A$, set by the interface reaction; thick ones grow as $\sqrt{Bt}$, set by diffusion across the oxide. The crossover thickness is about $A$. Both limits are a derive prompt below.
^deal-grove-limits

What is empirical, not derived:
- **Constants.** Commonly quoted fits for dry $\mathrm O_2$ at 1 atm on (111) silicon are $B \approx 772\ \mu\mathrm{m^2/h}\, e^{-1.23\text{ eV}/k_BT}$ and $B/A \approx 6.23 \times 10^6\ \mu\mathrm{m/h}\, e^{-2.0\text{ eV}/k_BT}$; on (100) silicon $B/A$ is about 1.7 times smaller. In steam $B$ is much larger, with an activation energy of about 0.7 to 0.8 eV, and $B/A$ again near 2 eV. Check these against a current table before using them in a design.
- **Thin dry oxide.** The first 20 to 30 nm of dry oxide grow faster than the model allows. The usual fix is to start the model at $x_i \approx 25$ nm with the matching $\tau$.
- **Pressure.** The model makes both $B$ and $B/A$ proportional to $p$ through $C^*$. $B$ follows that; for dry oxidation $B/A$ grows more slowly, roughly as $p^{0.7}$ to $p^{0.8}$ (check).
^deal-grove-empirical

## Oxide colour

By [Theorem 1 of op-wave](op-wave.md#^thin-film), oxide on silicon reflects least at the wavelengths with $2 n d = (m + \tfrac12)\lambda$, with $n \approx 1.46$. The visible colour is what is left after those wavelengths are removed. Three consequences:
- Below about 65 nm there is no minimum between 380 and 750 nm, so thin oxide only shades the silicon; colour cannot measure it.
- The minima repeat every $\lambda/2n$ of thickness, about 190 nm in green, so one colour fits several thicknesses. A 100 nm film and a 300 nm film both have their only visible minimum at 584 nm and can be mistaken for each other (the thicker film's minimum is narrower, so its colour is more saturated); 500 nm has two, at 584 and 417 nm.
- Charts that name a colour for each thickness are empirical: they depend on the lamp, the viewing angle (which moves every minimum to shorter wavelength by $\cos\theta_1$) and the eye. Counting bands along a taper or measuring a spectrum fixes the order.
^oxide-colour

## Diffusion

> [!def] Fick's laws
> A dopant's flux runs down its concentration gradient, $J = -D\, \partial C/\partial x$, with $D$ the diffusivity (cm²/s). Conservation of dopant, $\partial C/\partial t = -\partial J/\partial x$, then gives, for constant $D$,
> $$\frac{\partial C}{\partial t} = D\frac{\partial^2 C}{\partial x^2}.$$
> This is the heat equation with $D$ in place of the thermal diffusivity, and $\sqrt{Dt}$ is the diffusion length.
^fick

Dopant diffusivities are Arrhenius. For boron in intrinsic silicon, about $D \approx 0.76\ \mathrm{cm^2/s}\, e^{-3.46\text{ eV}/k_BT}$ (check), which is $1.5 \times 10^{-14}$ cm²/s at 1000 °C and gives $\sqrt{Dt} = 74$ nm in an hour. $D$ also rises at concentrations above the intrinsic carrier density and during oxidation; both are empirical corrections.
^diffusivity

> [!thm] Theorem 2 (the two profiles, thermal budget and junction depth)
> (a) **Predeposition.** If the surface is held at $C_s$ from $t = 0$ in undoped silicon, $C = C_s \operatorname{erfc}(x/2\sqrt{Dt})$ ([the semi-infinite solution](th-transient.md#^semi-infinite)), and the dose that has entered is $Q = 2C_s\sqrt{Dt/\pi}$.
>
> (b) **Drive-in.** If a dose $Q$ (per unit area) sits in a thin layer at a sealed surface (no flux out), then once $\sqrt{Dt}$ is much larger than that layer,
> $$C = \frac{Q}{\sqrt{\pi Dt}}\, e^{-x^2/4Dt}.$$
>
> (c) **Thermal budget.** If $D$ changes with time (a ramp, several steps), the profile is the constant-$D$ one with $Dt$ replaced by $\int_0^t D\, dt'$.
>
> (d) **Junction depth.** In a background of the opposite type at concentration $C_B$, the junction sits where $C = C_B$; for (b), $x_j = 2\sqrt{Dt}\,\sqrt{\ln\!\big(Q/C_B\sqrt{\pi Dt}\big)}$.
^profiles

> [!proof]- Proof (d 4)
> 1. (a) $\int_0^\infty \operatorname{erfc}(x/2\sqrt{Dt})\,dx = 2\sqrt{Dt}\int_0^\infty \operatorname{erfc}u\, du$, and by parts $\int_0^\infty \operatorname{erfc}u\,du = \int_0^\infty u\,\tfrac{2}{\sqrt\pi}e^{-u^2}du = 1/\sqrt\pi$.
> 2. (b) For $G = (Q/\sqrt{\pi Dt})\,e^{-x^2/4Dt}$: $\partial G/\partial t = G(x^2/4Dt^2 - 1/2t)$ and $D\,\partial^2 G/\partial x^2 = G(x^2/4Dt^2 - 1/2t)$, so $G$ solves the equation.
> 3. $\partial G/\partial x = -Gx/2Dt$ is zero at $x = 0$: no flux through the surface.
> 4. $\int_0^\infty G\, dx = Q$ for every $t$, and as $t \to 0$ the profile shrinks onto the surface: it is the solution that starts as a thin sheet of dose $Q$ (solutions of the diffusion equation with given initial and boundary data are unique).
> 5. (c) Put $\theta(t) = \int_0^t D\,dt'$. Then $\partial C/\partial t = D(t)\,\partial^2 C/\partial x^2$ becomes $\partial C/\partial\theta = \partial^2 C/\partial x^2$, the constant-$D$ equation with $Dt$ replaced by $\theta$.
> 6. (d) Set $G(x_j) = C_B$, take logarithms, and solve for $x_j$.
^p-profiles

A two-step process (a short predeposition, then a long drive-in with the source removed) gives the Gaussian of (b) once the drive-in's $Dt$ far exceeds the predeposition's, with $Q$ from (a).
^two-step

## Implant

> [!def] Ion implantation
> Dopant ions accelerated to an energy $E$ (keV to MeV) are scanned over the wafer. The **dose** $\Phi$ (ions/cm²) is counted as charge: for singly charged ions on area $A$, $\Phi = \int I\, dt/(qA)$, with $q = 1.602 \times 10^{-19}$ C. To first order the implanted profile is a Gaussian about the **projected range** $R_p$ with **straggle** $\Delta R_p$:
> $$C(x) = \frac{\Phi}{\sqrt{2\pi}\,\Delta R_p}\exp\!\Big(-\frac{(x - R_p)^2}{2\Delta R_p^2}\Big),$$
> peak $\approx 0.4\,\Phi/\Delta R_p$. $R_p$ and $\Delta R_p$ come from tables or Monte Carlo codes, not from a formula here. Real profiles are skewed, and ions aligned with a crystal axis travel deep (**channelling**); wafers are tilted a few degrees to reduce it.
^implant

## Anneal

Implantation knocks silicon atoms off their sites, and at high doses makes the surface amorphous; most implanted atoms do not sit on lattice sites and do not donate or accept carriers. An **anneal** regrows the lattice and puts dopants on sites (**activation**), and it also diffuses them.
^anneal-intro

> [!thm] Theorem 3 (an anneal widens a buried Gaussian)
> Far from the surface (both $\Delta R_p$ and $\sqrt{Dt}$ much smaller than $R_p$), a Gaussian implant of variance $\sigma^2 = \Delta R_p^2$ stays Gaussian under diffusion with the same dose and centre, and its variance becomes $\sigma^2 + 2Dt$.
^anneal

> [!proof]- Proof (d 3.5)
> 1. Far from the surface the silicon acts as an infinite line. On the line a sheet of dose $Q$ at $x_0$ spreads as $\frac{Q}{2\sqrt{\pi Dt}}e^{-(x - x_0)^2/4Dt}$ (the profile of Theorem 2(b), halved because it now spreads both ways): a Gaussian of variance $2Dt$.
> 2. The equation is linear, so the profile at time $t$ is the initial profile convolved with that spreading Gaussian.
> 3. The Fourier transform of a centred Gaussian of variance $s^2$ is $e^{-s^2k^2/2}$; convolution multiplies transforms: $e^{-\sigma^2k^2/2}\, e^{-2Dt\,k^2/2} = e^{-(\sigma^2 + 2Dt)k^2/2}$.
> 4. That is the transform of a Gaussian of variance $\sigma^2 + 2Dt$, with the same area (dose) and the same centre.
^p-anneal

Empirical: in the first seconds to minutes of an anneal the excess interstitials left by the implant make boron diffuse many times faster than its equilibrium $D$ (transient enhanced diffusion). Short, hot rapid thermal anneals activate dopants while keeping $\int D\,dt$ small.
^anneal-empirical

## Examples

> [!example] A dry oxide at 1000 °C
> Using the dry-oxygen constants above and $x_i = 25$ nm, how thick is the oxide after 1 hour at 1000 °C in 1 atm of $\mathrm O_2$?
^ex-dry-1000

> [!solution]- Solution
> methods: sp-oxidation-diffusion/deal-grove, sp-oxidation-diffusion/arrhenius
> 1. $k_BT = 0.1097$ eV. $B = 772\, e^{-1.23/0.1097} = 0.0104$ µm²/h; $B/A = 6.23\times10^6\, e^{-2.0/0.1097} = 0.0754$ µm/h; $A = 0.138$ µm.
> 2. $\tau = (0.025^2 + 0.138 \times 0.025)/0.0104 = 0.39$ h.
> 3. $x^2 + 0.138x = 0.0104 \times 1.39$ gives $x = 0.070$ µm.
> Answer: about 70 nm. Room air holds 0.21 atm of oxygen, so the [tube furnace](../../projects/tubefurnace/index.md) predicts less, and its humidity adds a second oxidant.

> [!example] Which step of a thermal budget counts
> A boron profile sees 30 min at 950 °C and then 20 min at 1050 °C. With the boron diffusivity above, compare the two steps' $Dt$ and give the equivalent time at 1050 °C alone.
^ex-budget

> [!solution]- Solution
> methods: sp-oxidation-diffusion/profiles, sp-oxidation-diffusion/arrhenius
> 1. $D(950\text{ °C}) = 4.2 \times 10^{-15}$ cm²/s, so $Dt = 7.6 \times 10^{-12}$ cm². $D(1050\text{ °C}) = 5.0 \times 10^{-14}$ cm²/s, so $Dt = 6.0 \times 10^{-11}$ cm².
> 2. Total $6.8 \times 10^{-11}$ cm²; the 950 °C step is 11 % of it.
> 3. Equivalent time at 1050 °C: $6.8\times10^{-11}/5.0\times10^{-14}$ s $= 22.5$ min.
> The hottest step dominates; the cooler one is a correction.

> [!example] Implant time from beam current
> How long does a 100 µA beam of singly charged ions take to implant $10^{15}$ cm⁻² uniformly over a 100 mm wafer?
^ex-implant-time

> [!solution]- Solution
> methods: sp-oxidation-diffusion/implant
> 1. Area $\pi \times 5^2 = 78.5$ cm²; ions $7.85 \times 10^{16}$; charge $0.0126$ C.
> 2. $t = 0.0126/(100 \times 10^{-6}) = 126$ s.

## Derive

> [!derive] From Theorem 1, show that $x \approx (B/A)(t + \tau)$ when $t + \tau \ll A^2/4B$ and $x \approx \sqrt{Bt}$ when $t \gg A^2/4B$ and $t \gg \tau$, and that $B/A = C^*/[N_1(1/k_s + 1/h)]$. Say which physical step controls each limit and which activation energy each limit therefore shows.
^d-dg-limits

> [!solution]- Solution
> methods: sp-oxidation-diffusion/deal-grove, limiting-case
> 1. Write $u = 4B(t + \tau)/A^2$. For $u \ll 1$, $\sqrt{1 + u} \approx 1 + u/2$, so $x \approx (A/2)(u/2) = (B/A)(t + \tau)$.
> 2. For $u \gg 1$, $x \approx (A/2)\sqrt u = \sqrt{B(t + \tau)} \approx \sqrt{Bt}$.
> 3. $B/A = (2DC^*/N_1)/(2D(1/k_s + 1/h)) = C^*/N_1(1/k_s + 1/h)$: $D$ drops out. With $h \gg k_s$ it is $k_sC^*/N_1$: the interface reaction controls thin oxide, and $B$, which carries $D$, controls thick oxide.

> [!derive] Taking thermal oxide at 2.2 g/cm³ (molar mass 60.08 g/mol) and silicon at $5.0 \times 10^{22}$ atoms/cm³, show that growing an oxide of thickness $x$ consumes about $0.44x$ of silicon.
^d-si-consumed

> [!solution]- Solution
> methods: sp-oxidation-diffusion/oxidation-defs, estimation
> 1. Oxide: $2.2/60.08 \times 6.022\times10^{23} = 2.2\times10^{22}$ SiO₂ units per cm³, each holding one silicon atom.
> 2. A unit area of oxide of thickness $x$ holds $2.2\times10^{22}x$ silicon atoms, which came from a silicon layer $2.2\times10^{22}x/5.0\times10^{22} = 0.44x$ thick.

> [!derive] Show that a small temperature error $\Delta T$ changes an Arrhenius rate by the fraction $E_a\Delta T/k_BT^2$, and evaluate it for $E_a = 2.0$ eV at 1000 °C and $\Delta T = 5$ K.
^d-arrhenius-sensitivity

> [!solution]- Solution
> methods: sp-oxidation-diffusion/arrhenius
> 1. $d\ln r/dT = E_a/k_BT^2$; multiply by $\Delta T$.
> 2. $2.0 \times 5/(8.617\times10^{-5} \times 1273^2) = 7.2\,\%$ (the exact ratio is 7.4 %).

> [!derive] Show that a mask of thickness $x_m$ over a Gaussian implant (range $R_p$, straggle $\Delta R_p$ in the mask material) lets through the dose $\tfrac{\Phi}{2}\operatorname{erfc}\big((x_m - R_p)/\sqrt2\,\Delta R_p\big)$.
^d-mask-dose

> [!solution]- Solution
> methods: sp-oxidation-diffusion/implant
> 1. The ions that pass are those that would have stopped deeper than $x_m$: $\int_{x_m}^\infty C\,dx$.
> 2. Substitute $u = (x - R_p)/\sqrt2\Delta R_p$: $\frac{\Phi}{\sqrt\pi}\int_{u_m}^\infty e^{-u^2}du = \frac{\Phi}{2}\operatorname{erfc}(u_m)$.

## Problems

> [!problem] Temperature uniformity for a 100 nm oxide (d 3)
> A 100 nm dry oxide is grown at 1000 °C with the constants above, taking $\tau = 0$. To first order, what fractional thickness change does a 1 K error cause, and what temperature uniformity holds the thickness to ±2 %?
^inv-sp-oxide-uniformity

> [!solution]- Solution
> methods: sp-oxidation-diffusion/deal-grove, sp-oxidation-diffusion/arrhenius
> 1. $B = 0.0104$ µm²/h, $A = 0.138$ µm; the growth time is $t = (x^2 + Ax)/B = 2.28$ h.
> 2. Differentiate $x^2 + Ax = Bt$ at fixed $t$: $(2x + A)\,dx + x\,dA = t\,dB$.
> 3. $dB/B = (1.23/k_BT^2)\,dT$ and $dA/A = ((1.23 - 2.0)/k_BT^2)\,dT$; $1/k_BT^2 = 0.716\,\%$/K per eV.
> 4. $\frac{dx}{x\,dT} = \frac{Bt(0.880\,\%) - xA(-0.551\,\%)}{(2x + A)x} = 0.85\,\%$/K.
> Answer: 0.85 % per kelvin, so about ±2.4 K for ±2 %.

> [!problem] Two reflectance minima (d 3)
> A spectrometer on an oxidised silicon piece sees adjacent reflectance minima at 542.3 nm and 421.8 nm, and no other minimum between them. Taking $n = 1.46$ at both wavelengths, how thick is the oxide, and which orders are these?
^inv-sp-two-minima

> [!solution]- Solution
> methods: sp-oxidation-diffusion/oxide-colour, op-wave/thin-film
> 1. Adjacent minima: $2nd = (m + \tfrac12)\lambda_1 = (m + \tfrac32)\lambda_2$ with $\lambda_1 > \lambda_2$.
> 2. Subtract the reciprocals: $1/\lambda_2 - 1/\lambda_1 = 1/2nd$, so $d = 1/[2n(1/\lambda_2 - 1/\lambda_1)] = 650$ nm.
> 3. $2nd/\lambda_1 = 3.5$: $m = 3$ at 542.3 nm and $m = 4$ at 421.8 nm.
> Answer: 650 nm (rounding the minima to whole nanometres moves this by a few nm).

> [!problem] A boron drive-in (d 4.5)
> A predeposition leaves $Q = 10^{14}$ cm⁻² of boron at the surface of n-type silicon doped $10^{16}$ cm⁻³. The drive-in runs at 1100 °C, where take $D = 1.52 \times 10^{-13}$ cm²/s, with the surface sealed. How long until the junction is 1 µm deep, and what is the surface concentration then?
^inv-sp-drive-in

> [!solution]- Solution
> methods: sp-oxidation-diffusion/profiles
> 1. $x_j^2 = 4Dt\,\ln(Q/C_B\sqrt{\pi Dt})$ has $t$ inside the logarithm; solve by iteration: guess $t$, evaluate the log, update $t = x_j^2/4D\ln(\dots)$.
> 2. Starting from 3000 s it settles in two passes at $t = 2944$ s.
> 3. Surface: $Q/\sqrt{\pi Dt} = 2.7 \times 10^{18}$ cm⁻³.
> Answer: about 49 min; $2.7\times10^{18}$ cm⁻³ at the surface.

> [!problem] A resist that stops an implant (d 3.5)
> A $5 \times 10^{15}$ cm⁻² implant has, in resist, $R_p = 0.20$ µm and $\Delta R_p = 0.07$ µm. How thick must the resist be so that at most $10^{11}$ cm⁻² gets through?
^inv-sp-resist-implant

> [!solution]- Solution
> methods: sp-oxidation-diffusion/implant
> 1. Passed dose $\frac{\Phi}{2}\operatorname{erfc}(u_m) \le 10^{11}$ gives $\operatorname{erfc}(u_m) \le 4 \times 10^{-5}$, so $u_m \ge 2.904$.
> 2. $x_m = R_p + \sqrt2\,\Delta R_p\, u_m = 0.20 + 0.0990 \times 2.904 = 0.488$ µm.
> Answer: about 0.49 µm, $R_p$ plus 4.1 straggles.

> [!problem] Oxygen and water at once (d 5)
> Silicon oxidises in an ambient with two oxidants. Assume each oxidant reaches the interface by its own independent Deal-Grove path, so the growth rates add. Take, for this ambient and temperature, oxygen: $B = 0.0022$ µm²/h, $B/A = 0.0158$ µm/h; water: $B = 0.00374$ µm²/h, $B/A = 0.009875$ µm/h. Ignore the thin-oxide offset. How long does 40 nm take from bare silicon? Compare with each oxidant alone, and with a single Deal-Grove law whose $B$ and $B/A$ are the sums.
^inv-sp-two-oxidants

> [!solution]- Solution
> methods: sp-oxidation-diffusion/deal-grove
> 1. Each oxidant alone gives $dx/dt = B_j/(A_j + 2x)$, from Theorem 1; $A_O = 0.139$ µm, $A_W = 0.379$ µm.
> 2. Together $dx/dt = B_O/(A_O + 2x) + B_W/(A_W + 2x)$, so $t = \int_0^{0.04} dx \big/ [\dots]$; numerically $t = 1.88$ h.
> 3. Alone: oxygen $(x^2 + A_Ox)/B_O = 3.26$ h; water 4.48 h.
> 4. The summed law ($B = 0.00594$, $B/A = 0.0257$, $A = 0.231$ µm) gives 1.83 h, 3 % short: it matches the true rate at $x = 0$ and as $x \to \infty$ but not between, because the two $A$ values differ.
> Answer: about 1.9 h; one combined Deal-Grove law is close here but is not exact.
