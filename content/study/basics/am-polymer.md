---
study: basic
id: am-polymer
title: Photopolymer and powder-bed polymer printing
area: mat
needs: [th-transient, mat-structure-props]
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [the semi-infinite solid](th-transient.md#^semi-infinite) and [contact temperature](th-transient.md#^contact-temperature) for heat entering a fresh layer; [phases](mat-structure-props.md#^phase-diagram) for melting and crystallisation, and [diffusion by vacancies](mat-structure-props.md#^defects) for solid-state sintering.

Two families of polymer printers. Resin printers (vat photopolymerisation) turn liquid into solid with light, one layer at a time; the questions are how deep light cures, what stops it curing where you do not want it, and how much the part shrinks. Powder-bed printers (selective laser sintering, SLS) melt a thin layer of polymer powder with a laser on a bed held just below melting; the questions are how hot the bed can sit, how much energy a layer needs, and how fast molten grains merge.

## Photopolymers

> [!def] Photopolymer resin
> A **photopolymer resin** is a liquid of small reactive molecules that joins into a solid network when lit. It contains:
> - **monomers and oligomers**: molecules carrying reactive groups (in acrylates, carbon-carbon double bonds) that link into chains; molecules with two or more groups link chains into a **network**;
> - a **photoinitiator** (PI): a molecule that absorbs a photon and splits into **radicals**, fragments with an unpaired electron that attack a double bond and start a chain;
> - an **absorber** (a dye or UV blocker) that limits how deep light reaches.
>
> **Conversion** is the fraction of reactive groups that have reacted. At the **gel point**, a conversion of typically a few to 20 percent, a network first spans the sample and the liquid becomes a soft solid; printing needs a layer to pass its gel point. Two chemistries dominate. In **radical** curing (acrylates, methacrylates) chains grow fast and stop when two radicals meet. In **cationic** curing (epoxies, vinyl ethers) the active ends are positive ions, which do not react with each other or with oxygen, so they keep curing after the light is off, but water poisons them.
^photopolymer

> [!thm] Theorem 1 (radical cure rate)
> In radical curing, let radicals be created at rate $R_i$ per unit volume, proportional to the local light intensity $I$, and destroyed when two meet, at rate $2k_t[R\cdot]^2$. If the radical population reaches a steady state quickly compared with the change in monomer concentration $[M]$, the cure rate is
> $$R_p = k_p[M]\sqrt{\frac{R_i}{2k_t}} \propto [M]\sqrt I,$$
> where $k_p$ and $k_t$ are the propagation and termination rate constants.
^rate-sqrt

> [!proof]- Proof (d 3)
> 1. Radical balance: $\dfrac{d[R\cdot]}{dt} = R_i - 2k_t[R\cdot]^2$.
> 2. Steady state: the left side is negligible, so $[R\cdot] = \sqrt{R_i/(2k_t)}$.
> 3. Each radical adds monomer at rate $k_p[M]$, so $R_p = k_p[M][R\cdot] = k_p[M]\sqrt{R_i/(2k_t)}$.
> 4. A photoinitiator absorbs photons at a rate proportional to $I$, so $R_i \propto I$ and $R_p \propto \sqrt I$.
^p-rate-sqrt

So doubling intensity raises the cure rate only by $\sqrt2$: at dose $E = It$, conversion grows as $E/\sqrt I$, and a brighter source buys less conversion per unit energy. A resin calibrated at one intensity must be recalibrated at another. ^reciprocity

## The working curve

> [!def] Dose, penetration depth, critical dose
> The **dose** (exposure) $E$ is light energy delivered per unit area, $E = \int I\,dt$, usually in mJ/cm². The **penetration depth** $D_p$ is the depth at which intensity falls to $1/e$ of its surface value; if the absorbing species have decadic molar absorptivities $\varepsilon_i$ and concentrations $c_i$, then $1/D_p = \ln(10)\sum_i \varepsilon_i c_i$. The **critical dose** $E_c$ is the dose that just brings resin to its gel point. The **cure depth** $C_d$ is the thickness of solid formed by a surface dose $E_0$.
^dp-def

> [!thm] Theorem 2 (working curve)
> If intensity decays by absorption alone (no scattering) and resin solidifies wherever its dose reaches $E_c$, a surface dose $E_0 > E_c$ cures to depth
> $$C_d = D_p \ln\frac{E_0}{E_c}.$$
> A plot of $C_d$ against $\ln E_0$ is a straight line with slope $D_p$ that crosses zero at $E_c$.
^working-curve

> [!proof]- Proof (d 2)
> 1. In a thin slice $dz$ a fraction $dz/D_p$ of the light is absorbed (this is what $D_p$ means): $dI = -I\,dz/D_p$.
> 2. Integrate: $I(z) = I_0 e^{-z/D_p}$ (the Beer-Lambert law).
> 3. Every depth is lit for the same time, so the dose follows the same law: $E(z) = E_0 e^{-z/D_p}$.
> 4. $E(z)$ falls with depth, so the cured region is $0 \le z \le C_d$ with $E(C_d) = E_c$.
> 5. Solve $E_0 e^{-C_d/D_p} = E_c$: $C_d = D_p\ln(E_0/E_c)$.
^p-working-curve

A layer of thickness $t$ is printed with $C_d$ somewhat larger than $t$, so the new layer reaches into the one below and bonds. The excess also cures liquid under any overhang, by the same law; this unwanted cure (print-through) is the reason resins carry absorber, which shortens $D_p$ and costs exposure time. ^overcure

> [!example] Fitting a resin
> Two test exposures of a resin give a cure depth of 120 µm at 10 mJ/cm² and 280 µm at 40 mJ/cm². Find $D_p$ and $E_c$, and the dose for a 100 µm layer cured 50% deeper than its thickness.
^ex-working-curve

> [!solution]- Solution
> methods: am-polymer/working-curve
> 1. Slope: $D_p = (280 - 120)/\ln 4 = 115$ µm.
> 2. $E_c = 10\,e^{-120/115.4} = 3.54$ mJ/cm².
> 3. For $C_d = 150$ µm: $E_0 = 3.54\,e^{150/115.4} = 13.0$ mJ/cm².

## Oxygen inhibition

> [!def] Oxygen inhibition
> Dissolved oxygen reacts with growing radical chain ends far faster than monomer does, and the product (a peroxyl radical) barely continues the chain. So in radical curing, oxygen must be used up before a resin can gel. This causes an **induction period** at the start of every exposure, a tacky uncured skin wherever resin touches air (oxygen keeps diffusing in), and a dose threshold that partly measures the dissolved oxygen. Remedies: inert gas, higher intensity or initiator concentration (more radicals to burn the oxygen), and additives such as amines and thiols. The effect can also be used: a window that lets oxygen through keeps a thin layer of liquid next to it uncured, so the part never sticks to the window and printing can run continuously.
^oxygen-inhibition

> [!example] Induction time
> Air-saturated resin holds about 1 mM of oxygen (assumed). Under the projector, radicals are created at $R_i = 2$ mM/s, and each radical removes one oxygen molecule. How long until curing can start, and what fraction of a 3.4 s layer exposure is that?
^ex-induction

> [!solution]- Solution
> methods: am-polymer/oxygen-inhibition
> 1. Oxygen is removed at the radical creation rate: $t_{ind} = 1/2 = 0.5$ s.
> 2. That is about 15% of the exposure, spent before any monomer reacts. It shows up in the fitted $E_c$.

> [!thm] Theorem 3 (uncured layer at an oxygen-permeable window)
> Resin lies on a window that holds the dissolved oxygen at concentration $c_s$. In the resin, oxygen diffuses with diffusivity $D$ and is consumed at rate $kc$ (first order, with $k$ uniform over the region of interest). In steady state, with no resin flow, the oxygen profile is $c(z) = c_s e^{-z/\ell}$ with $\ell = \sqrt{D/k}$, and if curing is blocked wherever $c > c_{crit}$, the uncured layer is
> $$\delta = \ell \ln\frac{c_s}{c_{crit}}.$$
^dead-zone

> [!proof]- Proof (d 2)
> 1. Steady one-dimensional conservation of oxygen: $0 = D c'' - kc$.
> 2. General solution: $c = Ae^{-z/\ell} + Be^{z/\ell}$ with $\ell = \sqrt{D/k}$.
> 3. The concentration stays bounded deep in the resin, so $B = 0$; at the window $c(0) = c_s$, so $A = c_s$.
> 4. $c$ falls with $z$, so the blocked region is $0 \le z < \delta$ with $c(\delta) = c_{crit}$.
> 5. Solve: $\delta = \ell\ln(c_s/c_{crit})$.
^p-dead-zone

## The SLS processing window

> [!def] Processing window
> A **semicrystalline** polymer (nylon 12 is the common SLS powder) is partly crystalline: ordered regions that melt over a narrow range, embedded in disordered (amorphous) regions. Heated in a calorimeter it shows a melting peak; cooled, it crystallises at a lower temperature, because crystals need undercooling to nucleate. The gap between the **onset of melting** on heating and the **onset of crystallisation** on cooling is the **processing window**. The powder bed is held inside it:
> - above crystallisation onset, so the melted part stays molten and crystallises slowly and evenly after the build, rather than layer by layer (a lower layer that crystallises early shrinks under the ones above and the part curls);
> - below melting onset, so loose powder does not fuse to itself or to the part (caking).
>
> The window is typically a few tens of kelvin wide, and the bed must be held to within a few kelvin. Amorphous polymers soften gradually with no sharp melt, so they have no such window and give porous parts. Powder held near melting for hours degrades, so used powder is mixed with fresh. The laser delivers an **area energy density** $E_A = P/(vh)$, with laser power $P$, scan speed $v$ and **hatch spacing** $h$ (distance between neighbouring scan lines).
^sls-window

Each new layer is spread cold onto the hot bed. What that costs, why preheating the feed is not the fix, and how long the layer takes to come back to bed temperature are worked through in Adit's public note on the fresh-layer problem ([SLS note](../../notes/sls/index.md)). Its two ingredients are the [contact temperature](th-transient.md#^contact-temperature) of two bodies that touch and the [semi-infinite solid](th-transient.md#^semi-infinite); this doc does not repeat them. ^fresh-layer

> [!thm] Theorem 4 (energy to melt a layer)
> A powder layer of thickness $L$ and bulk (powder) density $\rho_b$ sits at bed temperature $T_b$. The polymer has specific heat $c_p$, melting point $T_m$ and heat of melting $\Delta h_m$ per unit mass, and absorbs a fraction $A$ of the laser light. Melting the full layer needs
> $$A\,\frac{P}{vh} \;\ge\; \rho_b L\left[c_p(T_m - T_b) + \Delta h_m\right].$$
^melt-energy

> [!proof]- Proof
> 1. A line scanned at speed $v$ receives $P/v$ per unit length; lines $h$ apart give $P/(vh)$ per unit area, of which $A$ is absorbed.
> 2. Unit area of the layer holds mass $\rho_b L$.
> 3. By the [first law](th-thermo.md#^first-law), heating it to $T_m$ and melting it takes $\rho_b L[c_p(T_m - T_b) + \Delta h_m]$.
> 4. Heat conducted away into the part and powder only adds to the need, so the absorbed energy must at least cover step 3.
^p-melt-energy

Practical settings sit several times above this bound: the melt must reach into the layer below to bond, must be hot enough to flow, and loses heat while it does. A bed close to melting is what keeps the bound small: most of the energy goes into the heat of melting, not into heating. ^melt-energy-margin

## Sintering

> [!def] Sintering
> **Sintering** is the merging of particles into a solid, driven by the drop in surface energy as their total surface area shrinks. Molten polymer particles merge by **viscous flow**: surface tension $\gamma$ (energy per area) pulls, viscosity $\eta$ resists. Metal and ceramic particles below melting merge by **diffusion** of atoms toward the necks, which is thermally activated like [vacancy diffusion](mat-structure-props.md#^defects). A **neck** is the bridge between two touching particles; **densification** is the loss of pore volume. SLS polymer parts end with a few percent porosity.
^sintering

> [!thm] Theorem 5 (neck growth between molten spheres)
> Two molten spheres of radius $a$, surface tension $\gamma$ and viscosity $\eta$ touch at $t = 0$. While the neck radius $x$ is small compared with $a$,
> $$\left(\frac{x}{a}\right)^2 = C\,\frac{\gamma t}{\eta a},$$
> with $C$ a constant of order one. (A uniform-extension flow field gives $C = 3/2$; that model is stated, not derived here.) The time to reach a given $x/a$ therefore scales as $\eta a/\gamma$.
^frenkel

> [!proof]- Proof of the scaling (d 3)
> 1. Let each centre have moved a distance $h$ toward the contact plane. For overlapping spheres, $x^2 = a^2 - (a-h)^2 \approx 2ah$ when $h \ll a$.
> 2. Each sphere has lost a cap of area $2\pi ah = \pi x^2$, so surface energy is released at rate $\gamma\,\frac{d}{dt}(2\pi x^2) = 4\pi\gamma a\dot h$.
> 3. The flow strains a region of size about $a$ at rate $\dot\varepsilon \sim \dot h/a$.
> 4. Viscous flow dissipates about $\eta\dot\varepsilon^2$ per unit volume, so about $\eta(\dot h/a)^2 a^3 = \eta a \dot h^2$ in total.
> 5. Released energy equals dissipated energy: $\gamma a\dot h \sim \eta a\dot h^2$, so $\dot h \sim \gamma/\eta$, constant in time.
> 6. Then $h \sim \gamma t/\eta$, and by step 1, $x^2 \sim 2a\gamma t/\eta$, that is $(x/a)^2 \sim \gamma t/(\eta a)$.
^p-frenkel

The time scale $\eta a/\gamma$ is why powder size and melt viscosity, not only temperature, set how dense an SLS part gets: viscosity falls steeply with temperature (Arrhenius-like), while finer powder sinters faster but spreads worse. ^sinter-time

## Shrinkage

> [!def] Cure and process shrinkage
> Curing a resin turns contacts between molecules (about 0.3 to 0.4 nm apart) into covalent bonds (about 0.15 nm), so the solid is denser than the liquid. The volume lost is roughly proportional to the number of double bonds reacted per unit volume, so resins of small monomers shrink more than those of large oligomers. A volumetric shrinkage $\Delta V/V$ gives a free linear shrinkage $(1 - \Delta V/V)^{1/3} - 1 \approx -\Delta V/(3V)$ when isotropic. A layer that shrinks after it has bonded to the layer below bends the pair toward itself (curl), and post-curing adds more shrinkage. In SLS, the powder packs at a fraction $\phi \approx 0.4$ to 0.5 of full density, so each layer thins as it melts; on cooling, thermal contraction and crystallisation shrink the part by a few percent in every direction, which slicers compensate with scale factors, and uneven cooling warps it.
^shrinkage

## Derive

> [!derive] A Gaussian beam of power $P$ and $1/e^2$ radius $w_0$, intensity $I = \frac{2P}{\pi w_0^2}e^{-2r^2/w_0^2}$, is scanned once in a straight line at speed $v$. Prove that the dose on the line's centre is $\sqrt{2/\pi}\,P/(w_0 v)$, and find the dose at distance $y$ from the line.
^d-line-dose

> [!solution]- Solution
> methods: am-polymer/working-curve
> 1. A point at offset $y$ receives $E(y) = \int I\,dt = \frac1v\int_{-\infty}^{\infty} I(x, y)\,dx$.
> 2. $\int e^{-2x^2/w_0^2}dx = w_0\sqrt{\pi/2}$.
> 3. $E(y) = \frac{2P}{\pi w_0^2 v}\,w_0\sqrt{\pi/2}\;e^{-2y^2/w_0^2} = \sqrt{\tfrac2\pi}\frac{P}{w_0 v}e^{-2y^2/w_0^2}$. (Checked against numerical integration.)

> [!derive] For the scanned line of the previous prompt, show that the cured cross-section is bounded by a parabola, and that the cured line width is $w_0\sqrt{2C_d/D_p}$, where $C_d$ is the cure depth on the centre line.
^d-line-width

> [!solution]- Solution
> methods: am-polymer/working-curve
> 1. Theorem 2 at offset $y$: depth $z(y) = D_p\ln(E(y)/E_c) = D_p\ln(E(0)/E_c) - 2D_p y^2/w_0^2 = C_d - 2D_p y^2/w_0^2$, a parabola.
> 2. It reaches zero at $y^2 = w_0^2 C_d/(2D_p)$, so the width is $2y = w_0\sqrt{2C_d/D_p}$.

> [!derive] Suppose the gel point is reached when the accumulated conversion $\int R_p\,dt$ reaches a fixed value, with $R_p \propto \sqrt I$ (Theorem 1) and light decaying as in Theorem 2. Show that cure depth is still linear in the logarithm of exposure time, with slope $2D_p$, and that the critical dose then depends on intensity.
^d-sqrt-working-curve

> [!solution]- Solution
> methods: am-polymer/rate-sqrt, am-polymer/working-curve
> 1. At depth $z$, $\sqrt{I(z)} = \sqrt{I_0}e^{-z/(2D_p)}$, so after exposure time $t$ the conversion is $\propto \sqrt{I_0}\,t\,e^{-z/(2D_p)}$.
> 2. Setting it equal to the threshold gives $C_d = 2D_p\ln(\sqrt{I_0}\,t/K)$ for a constant $K$: linear in $\ln t$ (or in $\ln E_0$ at fixed $I_0$) with slope $2D_p$.
> 3. Zero cure depth at $\sqrt{I_0}t = K$, so $E_c = I_0 t = K\sqrt{I_0}$ grows with intensity. A fitted slope is a working value, not necessarily the optical $D_p$.

> [!derive] In SLS, each layer the platform drops by $L$ and the roller fills the bed level. Powder packs at fraction $\phi$ and melts to full density without spreading sideways. Show that the powder thickness over a part converges to $L/\phi$, and find how fast.
^d-steady-layer

> [!solution]- Solution
> methods: am-polymer/shrinkage
> 1. Powder thickness $t_n$ melts to $\phi t_n$, leaving a dip of $(1-\phi)t_n$ below the bed level.
> 2. The next layer fills the drop plus the dip: $t_{n+1} = L + (1-\phi)t_n$, with $t_1 = L$.
> 3. Fixed point $t^* = L/\phi$; the error shrinks by a factor $(1-\phi)$ each layer. For $\phi = 0.5$: $L, 1.5L, 1.75L, \dots \to 2L$.

> [!derive] Two bonded layers of equal thickness $h$ and equal modulus have a mismatch strain $\varepsilon$ (the top one would, if free, be shorter by $\varepsilon$). Prove that the pair bends to curvature $3\varepsilon/(4h)$, concave on the top.
^d-bilayer-curl

> [!solution]- Solution
> methods: mc-solids/bending
> 1. Let the strain be $\varepsilon_0 + \kappa z$, with $z$ from $-h$ to $h$ and the interface at $0$. Stress is $E(\varepsilon_0 + \kappa z)$ in the bottom and $E(\varepsilon_0 + \kappa z + \varepsilon)$ in the top.
> 2. No net force: $2h\varepsilon_0 + h\varepsilon = 0$.
> 3. No net moment: $\kappa\,\tfrac{2h^3}{3} + \varepsilon\,\tfrac{h^2}{2} = 0$, so $\kappa = -\tfrac{3\varepsilon}{4h}$: magnitude $3\varepsilon/(4h)$, curving toward the shrinking side.

## Problems

> [!problem] Layer time on a projector printer (d 3)
> A projector delivers 5 mW/cm² to a resin with $D_p = 100$ µm and $E_c = 8$ mJ/cm². Layers are 50 µm, cured to 75 µm. (a) What exposure time per layer? (b) Adding absorber halves $D_p$ (assume $E_c$ unchanged). What is the new exposure time? (c) For a part 30 mm tall with 4 s per layer of peeling and moving, how much longer does the build take, and what did the absorber buy?
^inv-mat-dlp-exposure

> [!solution]- Solution
> methods: am-polymer/working-curve
> 1. $E_0 = 8e^{75/100} = 16.9$ mJ/cm², so $t = 16.9/5 = 3.39$ s.
> 2. With $D_p = 50$ µm: $E_0 = 8e^{1.5} = 35.9$ mJ/cm², $t = 7.17$ s.
> 3. 600 layers: $600(3.39 + 4) = 1.23$ h before, $600(7.17 + 4) = 1.86$ h after, 0.63 h more.
> 4. The overcure of one layer is 25 µm either way. What changes is the stray dose from every later layer, which reaches down through the cured resin with decay length $D_p$. Summed over the layers above, the dose at the cure front under an overhang is $E_c/(1 - e^{-t/D_p})$: $2.54E_c$ before, $1.58E_c$ after, so the liquid below cures a further $D_p\ln$ of that, 93 µm before and 23 µm after (assuming doses add).
> Answer: (a) 3.4 s; (b) 7.2 s; (c) about 38 min longer, for print-through under an overhang of about 48 µm instead of about 118 µm.

> [!problem] Liquid layer above an oxygen-permeable window (d 4)
> Resin over an oxygen-permeable window has oxygen diffusivity $5\times10^{-10}$ m²/s, consumption constant $k = 5$ s⁻¹ under the working light, and stops curing only where oxygen falls below 10% of its air-saturated level. (a) How thick is the liquid layer when the window's underside is open to air? (b) When it is fed pure oxygen? (c) At four times the light intensity, assuming $k$ is proportional to the radical concentration, with air?
^inv-mat-dead-zone

> [!solution]- Solution
> methods: am-polymer/dead-zone, am-polymer/rate-sqrt
> 1. $\ell = \sqrt{5\times10^{-10}/5} = 10$ µm.
> 2. (a) $c_s/c_{crit} = 10$: $\delta = 10\ln 10 = 23$ µm.
> 3. (b) Pure oxygen raises $c_s$ by $1/0.21$: $\delta = 10\ln(10/0.21) = 38.6$ µm.
> 4. (c) Radical concentration goes as $\sqrt I$ (Theorem 1), so $k$ doubles and $\ell$ falls by $\sqrt2$: $\delta = 23.0/\sqrt2 = 16.3$ µm.
> Answer: (a) 23 µm; (b) 39 µm; (c) 16 µm.

> [!problem] Scan speed for a nylon powder bed (d 3.5)
> A nylon powder has bulk density 450 kg/m³, $c_p = 2000$ J/(kg K) and heat of melting 100 J/g. The bed sits 15 K below melting, layers are 100 µm, and the powder absorbs 90% of the laser. (a) What is the smallest area energy density that can melt a layer? (b) A 20 W laser with 0.2 mm hatch is run at three times that bound. What scan speed? (c) How long does the laser take on a layer where parts cover 20% of a 150 × 150 mm bed (ignore jumps between lines)?
^inv-mat-sls-scan-speed

> [!solution]- Solution
> methods: am-polymer/melt-energy
> 1. Need per area: $450 \cdot 10^{-4}\,(2000\cdot15 + 10^5) = 5850$ J/m²; divide by $A = 0.9$: 6500 J/m² $= 0.0065$ J/mm².
> 2. Three times: $0.0195$ J/mm². $v = P/(E_A h) = 20/(0.0195 \cdot 0.2) = 5130$ mm/s.
> 3. Area 4500 mm², swept at $vh = 1026$ mm²/s: 4.4 s.
> Answer: (a) 0.0065 J/mm²; (b) about 5.1 m/s; (c) about 4.4 s.

> [!problem] Merging molten nylon grains (d 4)
> Molten nylon at 190 °C has viscosity 1000 Pa s and surface tension 0.03 N/m; grains have radius 25 µm. Take the constant of the neck-growth law as $3/2$. (a) How long until the neck reaches half the grain radius? (b) The viscosity follows an Arrhenius law with activation energy 50 kJ/mol. By what factor does that time change if the melt is at 200 °C? (c) How much hotter must the melt be to halve the time from (a), and how else could you halve it?
^inv-mat-neck-growth

> [!solution]- Solution
> methods: am-polymer/frenkel, sp-oxidation-diffusion/arrhenius
> 1. $t = (x/a)^2\,\eta a/(C\gamma) = 0.25 \cdot 1000 \cdot 25\times10^{-6}/(1.5 \cdot 0.03) = 0.139$ s.
> 2. $\eta(200)/\eta(190) = \exp\!\left[\dfrac{50{,}000}{8.314}\left(\dfrac1{473.15} - \dfrac1{463.15}\right)\right] = 0.76$; time scales with $\eta$, so 0.76 times.
> 3. Need $\exp[(E_a/R)(1/T - 1/463.15)] = 0.5$: $1/T = 1/463.15 + (8.314\ln0.5)/50{,}000$, so $T = 489.3$ K, 26 K hotter.
> 4. Time scales with $a$ at fixed $x/a$: halve the grain radius (at the cost of worse powder flow).
> Answer: (a) 0.14 s; (b) 0.76; (c) about 26 K, or half the grain size.

> [!problem] Shrinkage of an acrylate resin (d 3)
> A resin has one double bond per 150 g of monomer and density 1.10 g/cm³. Each mole of double bonds reacted removes 22 cm³ of volume (assume). The printed part reaches 70% conversion. (a) Volumetric shrinkage? (b) Free linear shrinkage, exact and by the small-strain rule?
^inv-mat-resin-shrink

> [!solution]- Solution
> methods: am-polymer/shrinkage
> 1. Molar volume per double bond: $150/1.10 = 136.4$ cm³/mol.
> 2. $\Delta V/V = 0.7 \cdot 22/136.4 = 0.113$.
> 3. Exact: $(1 - 0.113)^{1/3} - 1 = -3.92\%$; small-strain: $-0.113/3 = -3.76\%$.
> Answer: (a) 11.3%; (b) 3.9% (3.8% by the approximation). A larger oligomer per double bond would cut both.
