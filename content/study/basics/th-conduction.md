---
study: basic
id: th-conduction
title: Conduction and thermal resistance
area: th
needs: []
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: the first law as an energy balance ([first law](th-thermo.md#^first-law)), and partial derivatives. Convection enters only as a boundary condition whose coefficient $h$ is defined in [convection](th-convection.md#^newton).
^needs

## Fourier's law and the heat equation

> [!def] Heat flux and Fourier's law
> The **heat flux** $\mathbf q''$ (W/m²) is the rate of heat flow per unit area through a surface, as a vector. **Fourier's law** is the constitutive law of conduction in an isotropic solid or still fluid:
> $$\mathbf q'' = -k\,\nabla T,$$
> with **thermal conductivity** $k$ (W/(m K)), a measured property. It is empirical, like Ohm's law: it holds when gradients are gentle on the scale of the carriers' mean free path, which covers every engineering case here except gases at very low pressure and films thinner than about 100 nm.
^fourier

| material | $k$, W/(m K), near room temperature |
|---|---|
| copper | 400 |
| aluminium (pure; common alloys 120 to 200) | 237 |
| carbon steel; stainless steel | 50; 15 |
| nickel-chromium heating alloy | 11 to 15 |
| fused silica; window glass | 1.4; 1.0 |
| water; typical polymers | 0.6; 0.2 |
| ceramic fibre blanket (rises steeply with temperature) | 0.05 to 0.3 |
| polymer powder bed (the [SLS note](../../notes/sls/index.md)) | 0.10 |
| air | 0.026 |
^k-table

> [!thm] Theorem 1 (heat equation)
> In a solid with density $\rho$, specific heat $c$, conductivity $k$ and volumetric heat generation $\dot q'''$ (W/m³),
> $$\rho c\,\frac{\partial T}{\partial t} = \nabla\cdot(k\nabla T) + \dot q'''.$$
> With constant $k$ this is $\partial T/\partial t = \alpha\nabla^2 T + \dot q'''/(\rho c)$, where $\alpha = k/(\rho c)$ (m²/s) is the **thermal diffusivity**. For radial conduction in a cylinder, $\nabla\cdot(k\nabla T) = r^{-1}\,\partial_r(k r\,\partial_r T)$; in a sphere, $r^{-2}\,\partial_r(k r^2\,\partial_r T)$.
^heat-eq

> [!proof]- Proof (d 2)
> 1. Take a fixed box $dx\,dy\,dz$ of solid as the control volume; no mass crosses it and no work is done, so Law 1 is: rate of energy storage = heat in − heat out + generation.
> 2. Storage: $\rho c\,(\partial T/\partial t)\,dx\,dy\,dz$, since a solid's $du = c\,dT$.
> 3. Net conduction in the $x$ direction: $q''_x\,dy\,dz$ enters at $x$ and $(q''_x + \partial_x q''_x\,dx)\,dy\,dz$ leaves at $x + dx$; the net is $-\partial_x q''_x\,dx\,dy\,dz$.
> 4. Add the $y$ and $z$ faces: net conduction in is $-\nabla\cdot\mathbf q''\,dx\,dy\,dz$. Generation adds $\dot q'''\,dx\,dy\,dz$.
> 5. Divide by the volume and substitute Fourier's law, $\mathbf q'' = -k\nabla T$.
^p-heat-eq

> [!def] Boundary conditions
> The heat equation needs one condition on each boundary: a **fixed temperature** $T = T_s$; a **fixed flux** $-k\,\partial T/\partial n = q''_s$ (zero for an insulated or symmetry plane); or **convection** $-k\,\partial T/\partial n = h\,(T - T_\infty)$ to a fluid at $T_\infty$, with $n$ the outward normal and $h$ the [heat transfer coefficient](th-convection.md#^newton). At an interface between two solids, the flux is continuous; the temperature is continuous only if the contact is perfect (see contact resistance below).
^bcs

## Thermal resistance

> [!thm] Theorem 2 (steady one-dimensional resistances)
> With no generation and constant $k$, steady heat flow $q$ (W) through each shape is $q = \Delta T / R$ with
> - a slab of thickness $L$ and area $A$: $R = L/(kA)$;
> - a cylindrical shell from $r_1$ to $r_2$, length $\ell$: $R = \ln(r_2/r_1)/(2\pi k\ell)$;
> - a spherical shell from $r_1$ to $r_2$: $R = (1/r_1 - 1/r_2)/(4\pi k)$;
> - a convecting surface of area $A$: $R = 1/(hA)$.
>
> Resistances carrying the same heat add in series; paths sharing the same two temperatures add as conductances in parallel.
^resistance

> [!proof]- Proof
> 1. Steady, no generation: the heat equation is $\nabla\cdot(k\nabla T) = 0$, so the total heat $q$ through every surface of constant $x$ (or $r$) is the same.
> 2. Slab: $q = -kA\,dT/dx$ with $q$ constant, so $T$ is linear and $q = kA(T_1 - T_2)/L$.
> 3. Cylinder: $q = -k\,(2\pi r\ell)\,dT/dr$, so $dT = -q\,dr/(2\pi k\ell r)$. Integrate from $r_1$ to $r_2$.
> 4. Sphere: $q = -k\,(4\pi r^2)\,dT/dr$; integrate $dr/r^2$.
> 5. Convection: $q = hA\,(T_s - T_\infty)$ by the definition of $h$.
> 6. Series: the same $q$ crosses each, so the temperature drops add. Parallel: the same $\Delta T$ drives each, so the heats add.
^p-resistance

The network picture is exact only when every resistance is genuinely one-dimensional. When a parallel-path wall has strips of very different $k$, heat crosses sideways between them and the true resistance lies between the "isotherms are planes" and "flow lines are straight" estimates. When the geometry is two-dimensional, the **conduction shape factor** $S$ (m) packs the geometry into $q = kS\,\Delta T$, $R = 1/(kS)$. One shape factor used below: a cylinder of diameter $D$ centred in a square bar of side $w > D$, both of length $\ell$, has $S \approx 2\pi\ell/\ln(1.08\,w/D)$, a fit to the exact two-dimensional solution that treats the square as a circle of diameter $1.08\,w$.
^shape-factor

> [!def] Contact resistance
> Two solid surfaces pressed together touch only at the peaks of their roughness, a few percent of the nominal area; the gaps hold air or vacuum. The temperature therefore jumps across the joint, and the **thermal contact resistance** is defined by $R''_c = \Delta T_{joint}/q''$ (m² K/W), so $R_c = R''_c / A$. It is measured, not derived: for bare metal pairs in air it runs from about $10^{-5}$ to $10^{-3}$ m² K/W, falling with clamping pressure, with smoother or softer surfaces, and with a gap filler that conducts better than air.
^contact

For scale, a uniform air gap of 10 µm alone is $10\times10^{-6}/0.026 = 3.8\times10^{-4}$ m² K/W, the resistance of 70 mm of aluminium alloy. Fillers made for the joint are [thermal interface materials](th-electronics-cooling.md#^tim).
^contact-scale

> [!thm] Theorem 3 (spreading resistance)
> Heat entering a half-space of conductivity $k$ through a circular patch of radius $a$, the rest of the surface insulated, meets a resistance $R = C/(k a)$ to a far-away sink, with $C$ a pure number that depends only on the boundary condition on the patch: $C = 1/4$ for an isothermal patch; for a uniform flux, $C = 8/(3\pi^2) \approx 0.270$ using the patch's average temperature and $C = 1/\pi \approx 0.318$ using its centre.
^spreading

> [!proof]- Proof of the form $C/(ka)$; the constants are stated
> 1. The steady temperature solves $\nabla^2 T = 0$ in the half-space; the only lengths in the problem are $a$ and position, and the only property is $k$.
> 2. Scale all lengths by $a$: the problem for $\tilde T(\mathbf x/a)$ is the same for every $a$, so $\Delta T = (q/(k a))\,F$ with $F$ a number fixed by the patch condition.
> 3. The constants come from solving that one problem exactly; for the isothermal patch it is the same mathematics as the capacitance of a charged disk, which needs oblate spheroidal coordinates and is not done here.
^p-spreading

Spreading resistance falls as $1/a$, not $1/a^2$: halving a hot spot's radius doubles it. A real heat spreader is a finite plate, not a half-space; its resistance is between the half-space value and the one-dimensional value through its thickness, and published fits for that case are approximations to series solutions.
^spreading-note

## Generation

> [!thm] Theorem 4 (uniform generation)
> With uniform $\dot q'''$ and constant $k$, at steady state:
> - a slab of thickness $2L$ with both faces at $T_s$ peaks at its mid-plane, $T_{max} - T_s = \dot q''' L^2/(2k)$;
> - a solid cylinder of radius $r_0$ with surface at $T_s$ peaks on its axis, $T_{max} - T_s = \dot q''' r_0^2/(4k) = \dot q'/(4\pi k)$, where $\dot q' = \pi r_0^2\,\dot q'''$ is the heat per unit length.
^generation

> [!proof]- Proof
> 1. Slab: $k\,T'' = -\dot q'''$ with $T'(0) = 0$ by symmetry, so $T = T_s + \dot q'''(L^2 - x^2)/(2k)$.
> 2. Cylinder: $k\,r^{-1}(r T')' = -\dot q'''$; integrate once: $r T' = -\dot q''' r^2/(2k) + c_1$, and $c_1 = 0$ for $T'$ finite on the axis.
> 3. Integrate again: $T = T_s + \dot q'''(r_0^2 - r^2)/(4k)$, and $\dot q''' r_0^2 = \dot q'/\pi$.
^p-generation

## Fins

> [!thm] Theorem 5 (fin equation)
> A bar of cross-section $A_c$ and perimeter $P$, thin enough that its temperature is uniform over each cross-section, conducts along its axis $z$ and loses heat from its sides to fluid at $T_\infty$ with coefficient $h$. With $\theta = T - T_\infty$, axial conductance $K = kA_c$ (W m/K), side conductance per unit length $G = hP$ (W/(m K)) and heat input per unit length $\dot q'(z)$,
> $$\frac{d}{dz}\left(K\frac{d\theta}{dz}\right) - G\,\theta + \dot q' = 0.$$
> With constant $K$ and $G$ and no input, $\theta'' = m^2\theta$ with $m = \sqrt{hP/(kA_c)}$; $1/m = \sqrt{K/G}$ is the **decay length**.
^fins

> [!proof]- Proof
> 1. Control volume: the slice between $z$ and $z + dz$, steady.
> 2. Conduction in at $z$ is $-K\theta'(z)$; out at $z + dz$ is $-K\theta'(z+dz)$; the net in is $(K\theta')'\,dz$.
> 3. Side loss is $hP\,dz\,\theta = G\theta\,dz$; input is $\dot q'\,dz$.
> 4. Balance and divide by $dz$.
^p-fins

The fin model needs the cross-section to be isothermal, which holds when the Biot number across it (defined below) is small: $h t/k \ll 1$ for a plate fin of thickness $t$.
^fins-validity

> [!thm] Theorem 6 (fin heat flow)
> For a uniform fin with base excess $\theta_b$, and $M = \sqrt{hPkA_c}\;\theta_b$:
> - infinitely long: $\theta = \theta_b e^{-mz}$ and $q_f = M$;
> - length $L$ with an insulated tip: $\theta = \theta_b\cosh m(L - z)/\cosh mL$ and $q_f = M\tanh mL$.
^fin-heat

> [!proof]- Proof
> 1. The general solution of $\theta'' = m^2\theta$ is $\theta = c_1 e^{-mz} + c_2 e^{mz}$, or any pair of $\cosh$ and $\sinh$ of $m(L - z)$.
> 2. Infinite: $\theta$ bounded forces $c_2 = 0$, and $\theta(0) = \theta_b$ gives $c_1 = \theta_b$.
> 3. Insulated tip: $\theta'(L) = 0$ kills the $\sinh m(L - z)$ term; $\theta(0) = \theta_b$ fixes the $\cosh$ coefficient.
> 4. All the fin's heat enters through its base: $q_f = -kA_c\,\theta'(0)$. Differentiate each solution at $z = 0$.
^p-fin-heat

> [!def] Fin efficiency and effectiveness
> **Fin efficiency** $\eta_f$ is the fin's heat over the heat it would shed if all of it sat at the base temperature: $\eta_f = q_f/(h A_f \theta_b)$, $A_f$ the fin's wetted area. For the insulated-tip fin, $\eta_f = \tanh(mL)/(mL)$. A tip that convects is handled by the **corrected length** $L_c = L + A_c/P$ ($L + t/2$ for a plate, $L + D/4$ for a pin), an approximation whose error is negligible when $h t/k$ or $h D/(2k)$ is below about 0.06. **Fin effectiveness** $\varepsilon_f = q_f/(h A_c\theta_b)$ compares the fin with the bare base it covers. For an array, the **overall surface efficiency** of fins plus exposed base, total area $A$, is $\eta_o = 1 - (A_f/A)(1 - \eta_f)$, and the array sheds $\eta_o h A\theta_b$.
^fin-efficiency

Fins pay when $\varepsilon_f$ is large, roughly $\varepsilon_f > 2$. For a long fin $\varepsilon_f = \sqrt{kP/(hA_c)}$: fins help most with a conductive material, thin sections, and a low $h$. In a boiling liquid, where $h$ is already huge, fins buy little.
^fin-pay

## The Biot number

> [!def] Biot number
> For a solid of conductivity $k$ cooled at its surface with coefficient $h$, and a length $L$ over which heat must cross the solid, $\mathrm{Bi} = hL/k$. It is the ratio of the internal conduction resistance $L/(kA)$ to the surface convection resistance $1/(hA)$. Its $k$ is the solid's; the [Nusselt number](th-convection.md#^groups) looks the same but uses the fluid's $k$ and measures something else.
^biot

> [!thm] Theorem 7 (what the Biot number measures)
> A slab of thickness $L$ with one face held at $T_1$ and the other convecting to $T_\infty$ carries steady heat with $(T_1 - T_s)/(T_s - T_\infty) = \mathrm{Bi}$, $T_s$ its convecting face. Small Bi means the solid is nearly isothermal and the drop sits in the fluid; large Bi means the reverse.
^biot-thm

> [!proof]- Proof
> 1. The same $q$ crosses both resistances in series.
> 2. $T_1 - T_s = q\,L/(kA)$ and $T_s - T_\infty = q/(hA)$; divide.
^p-biot-thm

## Examples

> [!example] Insulation around a furnace tube
> A heated tube of 15 mm outer radius and 0.15 m heated length sits at 1000 °C inside insulation of $k = 0.12$ W/(m K), the setting of the [tube furnace](../../projects/tubefurnace/index.md) with invented numbers. Room air is at 20 °C with a combined surface coefficient $h = 10$ W/(m² K). Find the heat loss and outer surface temperature (a) for a round insulation jacket of 60 mm outer radius, (b) for a square box of 120 mm side, length 0.15 m. Ignore the ends.
^ex-furnace-insulation

> [!solution]- Solution
> methods: resistance-network, th-conduction/shape-factor
> 1. (a) $R_{ins} = \ln 4/(2\pi \cdot 0.12 \cdot 0.15) = 12.26$ K/W; $R_{conv} = 1/(10 \cdot 2\pi \cdot 0.06 \cdot 0.15) = 1.77$ K/W.
> 2. $q = 980/14.03 = 69.9$ W; $T_s = 20 + 69.9 \times 1.77 = 144$ °C.
> 3. (b) $S = 2\pi(0.15)/\ln(1.08 \times 0.12/0.03) = 0.644$ m, so $R_{ins} = 1/(0.12 \times 0.644) = 12.94$ K/W. Outer area $4 \times 0.12 \times 0.15 = 0.072$ m², $R_{conv} = 1.39$ K/W.
> 4. $q = 980/14.33 = 68.4$ W; $T_s = 20 + 68.4 \times 1.39 = 115$ °C (an average; corners run cooler than face centres).
> 5. The insulation carries almost all the resistance, so the loss barely changes; the surface temperature moves more, because it is set by the small film resistance.
^sol-ex-furnace-insulation

> [!example] An aluminium pin
> A pin of aluminium alloy ($k = 180$ W/(m K)), 3 mm diameter and 25 mm long, stands on a base 40 K above air with $h = 40$ W/(m² K). Find its efficiency, its heat and its effectiveness.
^ex-pin-fin

> [!solution]- Solution
> methods: th-conduction/fin-heat, th-conduction/fin-efficiency
> 1. $m = \sqrt{4h/(kD)} = \sqrt{160/0.54} = 17.2$ m⁻¹. $hD/(2k) = 3.3\times10^{-4}$, so the corrected length is safe: $L_c = 25.75$ mm, $mL_c = 0.443$.
> 2. $\eta_f = \tanh(0.443)/0.443 = 0.94$.
> 3. $\sqrt{hPkA_c} = 0.0219$ W/K, so $q_f = 0.0219 \times 40 \times \tanh 0.443 = 0.365$ W. The exact convecting-tip solution gives the same to five digits.
> 4. $\varepsilon_f = 0.365/(40 \times 7.07\times10^{-6} \times 40) = 32$.
^sol-ex-pin-fin

> [!example] A bolted joint
> Two aluminium parts meet over 1 cm² with $R''_c = 2\times10^{-4}$ m² K/W. Compare the joint with 2 mm of the aluminium ($k = 180$ W/(m K)) beside it.
^ex-joint

> [!solution]- Solution
> methods: resistance-network
> 1. Joint: $R_c = 2\times10^{-4}/10^{-4} = 2.0$ K/W.
> 2. Plate: $0.002/(180 \times 10^{-4}) = 0.11$ K/W.
> 3. The joint is 18 times the plate. In a stack of thin metal parts the interfaces, not the metal, set the resistance.
^sol-ex-joint

## Derive

> [!derive] Derive the steady radial heat equation with uniform generation in a cylinder, $k\,r^{-1}(rT')' + \dot q''' = 0$, without using the general vector form of Theorem 1.
^d-cyl-heat-eq

> [!solution]- Solution
> methods: energy-balance
> 1. Shell from $r$ to $r + dr$, length $\ell$, steady: conduction in minus out plus generation is zero.
> 2. Conduction outward through radius $r$ is $Q(r) = -k\,2\pi r\ell\,T'$; the net in is $-Q'(r)\,dr$.
> 3. Generation: $\dot q'''\,2\pi r\ell\,dr$. Balance: $(k r T')' \cdot 2\pi\ell + \dot q''' 2\pi r\ell = 0$; divide by $2\pi r\ell$.
^sol-d-cyl-heat-eq

> [!derive] Show that steady conduction from a sphere of diameter $D$ into an infinite still medium of conductivity $k_f$ gives an effective heat transfer coefficient with $hD/k_f = 2$.
^d-sphere-nu2

> [!solution]- Solution
> methods: th-conduction/resistance, limiting-case
> 1. Spherical shell with $r_2 \to \infty$: $R = 1/(4\pi k_f r_1)$.
> 2. Write it as $1/(hA)$ with $A = 4\pi r_1^2$: $h = k_f/r_1$.
> 3. So $hD/k_f = h\,(2r_1)/k_f = 2$.
^sol-d-sphere-nu2

> [!derive] Show that adding insulation of conductivity $k$ to a sphere of radius $r_i < 2k/h$ convecting with coefficient $h$ increases its heat loss until the outer radius reaches $2k/h$.
^d-critical-sphere

> [!solution]- Solution
> methods: th-conduction/resistance
> 1. $R(r) = (1/r_i - 1/r)/(4\pi k) + 1/(4\pi h r^2)$.
> 2. $R'(r) = 1/(4\pi k r^2) - 1/(2\pi h r^3)$, zero at $r = 2k/h$; negative below it, positive above.
> 3. So $R$ falls, and the loss rises, until $r = 2k/h$.
^sol-d-critical-sphere

> [!derive] Show that an insulated-tip fin delivers 99 % of the heat of an infinitely long one once $mL \ge 2.65$, and find the efficiency at that length.
^d-fin-length

> [!solution]- Solution
> methods: th-conduction/fin-heat
> 1. The ratio of heats is $\tanh mL$; $\tanh 2.65 = 0.990$.
> 2. $\eta_f = \tanh(2.65)/2.65 = 0.37$: past this length a fin adds metal and almost no heat.
^sol-d-fin-length

## Problems

> [!problem] A double-glazed window (d 2)
> A 1.2 m² window has two 4 mm glass panes ($k = 1.0$ W/(m K)) around a 10 mm still air gap ($k = 0.026$ W/(m K), conduction only). Inside, 20 °C with $h = 8$ W/(m² K); outside, −10 °C with $h = 25$ W/(m² K). Find the heat loss, the same for one pane, and the inner glass surface temperature in each case.
^inv-th-window

> [!solution]- Solution
> methods: resistance-network
> 1. Double: $R = (1/8 + 0.004 + 0.010/0.026 + 0.004 + 1/25)/1.2 = 0.465$ K/W; $q = 30/0.465 = 64.6$ W.
> 2. Single: $R = (1/8 + 0.004 + 1/25)/1.2 = 0.141$ K/W; $q = 213$ W.
> 3. Inner glass: $T = 20 - q/(8 \times 1.2)$: 13.3 °C double, −2.2 °C single, so the single pane frosts on the inside.
> Answer: 65 W against 213 W; 13.3 °C against −2.2 °C.
^sol-inv-th-window

> [!problem] An insulated wire (d 3)
> A wire of 1 mm diameter in air ($h = 10$ W/(m² K)) is sleeved with plastic of $k = 0.2$ W/(m K) to 3 mm outer diameter. Does the sleeve raise or lower the heat the wire can shed at a given wire temperature, and by what factor? At what outer radius is the loss largest?
^inv-th-insulated-wire

> [!solution]- Solution
> methods: th-conduction/resistance
> 1. Per metre: bare, $R = 1/(10 \cdot \pi \cdot 0.001) = 31.8$ m K/W.
> 2. Sleeved: $R = \ln 3/(2\pi \cdot 0.2) + 1/(10 \cdot \pi \cdot 0.003) = 0.874 + 10.6 = 11.5$ m K/W.
> 3. The loss rises by $31.8/11.5 = 2.77$: the extra surface outweighs the added conduction resistance.
> 4. $R(r) = \ln(r/r_i)/(2\pi k) + 1/(2\pi h r)$ is least at $r = k/h = 20$ mm, where the loss is 8.5 times the bare wire's.
> Answer: raises it, by 2.77; largest at 20 mm radius.
^sol-inv-th-insulated-wire

> [!problem] Inside a heating element (d 3)
> A nickel-chromium wire 0.65 mm in diameter (the element size on the [tube furnace](../../projects/tubefurnace/index.md) page), $k = 15$ W/(m K), dissipates 110 W per metre of length. How much hotter is its axis than its surface? What happens to that difference if the same heat per metre is carried by a wire twice as thick?
^inv-th-element-core

> [!solution]- Solution
> methods: th-conduction/generation
> 1. $T_{max} - T_s = \dot q'/(4\pi k) = 110/(4\pi \cdot 15) = 0.58$ K.
> 2. The result depends on $\dot q'$ and $k$ only, not on the radius: the same 0.58 K for the thicker wire. The element's real temperature question is the surface-to-surroundings drop, not the inside.
> Answer: 0.58 K, unchanged.
^sol-inv-th-element-core

> [!problem] A hot spot on copper (d 3.5)
> A device dissipates 2 W through a circular footprint of 1 mm radius, held nearly isothermal by a thin metal pad. Option A: the pad sits directly on a large copper block ($k = 400$ W/(m K)). Option B: it sits on a copper post of the same 1 mm radius and 5 mm length, which joins the same block. Estimate the temperature rise from the footprint to the far body of the block in each.
^inv-th-hot-spot

> [!solution]- Solution
> methods: th-conduction/spreading, resistance-network
> 1. A: isothermal patch on a half-space, $R = 1/(4ka) = 1/(4 \cdot 400 \cdot 0.001) = 0.625$ K/W; rise 1.25 K.
> 2. B: the post is a slab, $R = 0.005/(400 \cdot \pi \cdot 10^{-6}) = 3.98$ K/W, in series with roughly the same spreading resistance at its foot: $4.60$ K/W, rise 9.2 K.
> 3. A narrow post costs seven times the direct mount. Spreading into bulk metal is cheap; a long narrow path is not.
> Answer: about 1.3 K against 9 K.
^sol-inv-th-hot-spot

> [!problem] A furnace tube's protruding end (d 4)
> A fused-silica tube (outer diameter 15.9 mm and bore 12.7 mm as on the [tube furnace](../../projects/tubefurnace/index.md) page, $k = 1.5$ W/(m K)) leaves a furnace's insulation at 300 °C into a 20 °C room. Take a constant combined outside coefficient of 25 W/(m² K) and ignore the bore (no gas flow, no radiation down it). How far from the insulation is the tube within 5 % of room temperature (relative to the excess at the exit), and how much heat leaves through one protruding end?
^inv-th-tube-end

> [!solution]- Solution
> methods: th-conduction/fins, th-conduction/fin-heat
> 1. Fin validity: the wall is 1.6 mm, and its Biot number $ht/k = 25 \times 0.0016/1.5 = 0.027$, so each cross-section is isothermal.
> 2. $P = \pi D_o = 0.0500$ m; $A_c = \pi(D_o^2 - D_i^2)/4 = 7.19\times10^{-5}$ m². $m = \sqrt{hP/(kA_c)} = 108$ m⁻¹: a decay length of 9.3 mm.
> 3. Long enough to treat as infinite: $\theta/\theta_b = e^{-mz} = 0.05$ at $z = \ln 20/m = 28$ mm.
> 4. $q = \sqrt{hPkA_c}\,\theta_b = 0.0116 \times 280 = 3.2$ W.
> Answer: about 28 mm; about 3 W per end. Silica's low $k$ makes the tube a poor fin; the bore, ignored here, usually carries more.
^sol-inv-th-tube-end

> [!problem] A heated band on a long rod (d 5)
> A long rod with axial conductance $K$ and side conductance per length $G$, decay length $\ell = \sqrt{K/G} = 80$ mm, is heated uniformly over $|z| < a$ with $a = 75$ mm and nowhere else. The centre sits 980 K above ambient. Find the length of the zone around the centre within 5 K of the centre temperature, the excess at the ends of the heated band, and the zone length if the heated band is doubled at the same centre excess.
^inv-th-heated-band

> [!solution]- Solution
> methods: th-conduction/fins, th-conduction/fin-heat
> 1. Inside, $K\theta'' - G\theta + \dot q' = 0$: $\theta = \theta_\infty(1 - A\cosh(z/\ell))$ with $\theta_\infty = \dot q'/G$, even in $z$. Outside, $\theta = B e^{-|z|/\ell}$.
> 2. Match $\theta$ and $\theta'$ at $z = a$: $A = e^{-a/\ell}$, so $\theta(0) = \theta_\infty(1 - e^{-a/\ell})$.
> 3. $e^{-a/\ell} = e^{-0.9375} = 0.392$, so $\theta_\infty = 980/0.608 = 1611$ K.
> 4. Zone: $\theta(0) - \theta(z) = \theta_\infty e^{-a/\ell}(\cosh(z/\ell) - 1) \le 5$ K gives $\cosh(z/\ell) \le 1.0079$, $z \le 0.126\,\ell = 10.1$ mm: a zone of 20 mm.
> 5. Band ends: $\theta(a) = \theta_\infty(1 - e^{-a/\ell}\cosh(a/\ell)) = 682$ K, 298 K below the centre.
> 6. Doubled band, $a = 150$ mm: the same steps give a zone of 38 mm. Doubling the heater less than doubles the zone. A finite-difference solution of the first case agrees to 0.1 mm.
> Answer: 20 mm; 682 K; 38 mm.
^sol-inv-th-heated-band
