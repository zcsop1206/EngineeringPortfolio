---
study: basic
id: th-convection
title: "Convection: boundary layers, correlations and heat exchangers"
area: th
needs: [th-conduction]
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [Fourier's law](th-conduction.md#^fourier), the [heat equation](th-conduction.md#^heat-eq) and its derivation, [thermal resistance](th-conduction.md#^resistance), and the [steady-flow energy equation](th-thermo.md#^first-law). Dimensional analysis is in [gen-dimensions](gen-dimensions.md#^pi-theorem).
^needs

## The heat transfer coefficient

> [!def] Heat transfer coefficient
> When a surface at $T_s$ meets a moving fluid whose temperature far away (or mean temperature, in a duct) is $T_\infty$, the **heat transfer coefficient** $h$ (W/(m² K)) is *defined* by
> $$q''_s = h\,(T_s - T_\infty).$$
> This is **Newton's law of cooling**, but it is a definition, not a law of nature: it moves every difficulty of the flow into $h$, which depends on the fluid, the flow, the geometry, position on the surface, and sometimes on $T_s - T_\infty$ itself.
^newton

> [!thm] Theorem 1 (where $h$ comes from)
> At a solid wall the fluid does not slip, so heat leaves the wall into the fluid by conduction alone: with $y$ the distance from the wall and $k_f$ the fluid's conductivity,
> $$h = \frac{-k_f\,\partial T/\partial y\,|_{y=0}}{T_s - T_\infty}.$$
> A large $h$ means a thin layer of fluid near the wall carries the whole temperature change.
^h-wall

> [!proof]- Proof
> 1. No slip: the fluid touching the wall is at rest, so no flow carries enthalpy away from the wall itself.
> 2. The heat leaving the wall therefore crosses that layer by Fourier's law, $q''_s = -k_f\,\partial T/\partial y|_0$.
> 3. Set it equal to the definition of $h$.
^p-h-wall

| situation | typical $h$, W/(m² K) |
|---|---|
| gas, natural convection | 2 to 25 |
| liquid, natural convection | 50 to 1000 |
| gas, forced convection | 25 to 250 |
| liquid, forced convection | 100 to 20 000 |
| boiling or condensing | 2500 to 100 000 |
^h-table

## Governing equations and dimensionless groups

> [!thm] Theorem 2 (energy equation of a flowing fluid)
> For a fluid of constant density, specific heat $c_p$ and conductivity $k$, at low speed (kinetic energy and viscous heating negligible), with velocity field $\mathbf u$,
> $$\rho c_p\left(\frac{\partial T}{\partial t} + \mathbf u\cdot\nabla T\right) = k\,\nabla^2 T.$$
^fluid-energy

> [!proof]- Proof (d 2.5)
> 1. Take a fixed box $dx\,dy\,dz$ in the flow. Law 1 for a control volume: storage = conduction in + enthalpy carried in by the flow.
> 2. Storage per unit volume: $\rho c_p\,\partial T/\partial t$. For a liquid $c_p \approx c_v$; for a gas at nearly constant pressure the enthalpy form is the right one.
> 3. Conduction in per unit volume: $k\nabla^2 T$, as in the heat equation's derivation.
> 4. Enthalpy carried in per unit volume, by the same face-by-face count applied to the flux $\rho c_p T\mathbf u$: $-\nabla\cdot(\rho c_p T\mathbf u) = -\rho c_p(\mathbf u\cdot\nabla T + T\,\nabla\cdot\mathbf u)$.
> 5. Mass conservation at constant density is $\nabla\cdot\mathbf u = 0$, so the last term vanishes. Collect.
^p-fluid-energy

The velocity field comes from the momentum equation, stated here and derived in the fluids basics: for a Newtonian fluid of constant density and kinematic viscosity $\nu = \mu/\rho$, $\partial_t\mathbf u + (\mathbf u\cdot\nabla)\mathbf u = -\nabla p/\rho + \nu\nabla^2\mathbf u + \mathbf g$, with buoyancy entering through small density changes $\Delta\rho/\rho = -\beta\,\Delta T$ ($\beta$ the thermal expansion coefficient, $1/T$ for an ideal gas).
^momentum

> [!def] Dimensionless groups
> With a length $L$, a velocity $U$, and fluid properties at a stated temperature:
> - **Reynolds** $\mathrm{Re} = UL/\nu$: inertia over viscous forces.
> - **Prandtl** $\Pr = \nu/\alpha$: how fast momentum diffuses against heat; about 0.7 for gases, 2 to 13 for water, 100 and up for oils.
> - **Nusselt** $\mathrm{Nu} = hL/k_f$: the wall gradient over the gradient conduction alone would give across $L$. It uses the *fluid's* $k$, unlike the [Biot number](th-conduction.md#^biot).
> - **Grashof** $\mathrm{Gr} = g\beta\,\Delta T\,L^3/\nu^2$ and **Rayleigh** $\mathrm{Ra} = \mathrm{Gr}\Pr = g\beta\,\Delta T\,L^3/(\nu\alpha)$: buoyancy against viscosity and diffusion.
^groups

> [!thm] Theorem 3 (what Nu can depend on)
> For steady forced convection with constant properties over a body of given shape, $\mathrm{Nu} = f(x/L, \mathrm{Re}, \Pr)$ locally, and the surface average $\overline{\mathrm{Nu}} = F(\mathrm{Re}, \Pr)$. For natural convection, $\mathrm{Nu} = f(x/L, \mathrm{Gr}, \Pr)$ and $\overline{\mathrm{Nu}} = F(\mathrm{Ra}, \Pr)$ in practice. Correlations are fits of these functions to experiment or to numerical solutions.
^nu-form

> [!proof]- Proof (d 3)
> 1. Scale lengths by $L$, velocity by $U$, pressure by $\rho U^2$, and write $\theta = (T - T_\infty)/(T_s - T_\infty)$.
> 2. Momentum, steady, without gravity: $(\mathbf u^*\cdot\nabla^*)\mathbf u^* = -\nabla^* p^* + \mathrm{Re}^{-1}\nabla^{*2}\mathbf u^*$, with $\mathbf u^* = 0$ on the body and $1$ far away.
> 3. Energy: $\mathbf u^*\cdot\nabla^*\theta = (\mathrm{Re}\Pr)^{-1}\nabla^{*2}\theta$, with $\theta = 1$ on the body and $0$ far away.
> 4. So $\mathbf u^*$ depends only on position and Re, and $\theta$ only on position, Re and Pr.
> 5. By Theorem 1, $\mathrm{Nu} = hL/k_f = -\partial\theta/\partial y^*|_0$, a function of the same arguments. Averaging over the surface removes position.
> 6. Natural convection: no imposed $U$; scale velocity by $\nu/L$ and the buoyancy term $g\beta(T - T_\infty)$ becomes $\mathrm{Gr}\,\theta$, so Gr replaces Re.
^p-nu-form

Properties are evaluated at the **film temperature** $(T_s + T_\infty)/2$ for external flows and at the mean fluid temperature for duct flows, which is how correlations absorb property variation they do not otherwise model.
^film-temperature

## Boundary layers

> [!thm] Theorem 4 (boundary-layer scaling)
> On a flat plate in a uniform stream $U$, laminar flow, at distance $x$ from the leading edge, the velocity boundary layer has thickness $\delta \sim x\,\mathrm{Re}_x^{-1/2}$ with $\mathrm{Re}_x = Ux/\nu$. The thermal layer has thickness $\delta_t \sim \delta\Pr^{-1/3}$ for $\Pr \gtrsim 1$, so $\mathrm{Nu}_x \sim \mathrm{Re}_x^{1/2}\Pr^{1/3}$; for $\Pr \ll 1$, $\mathrm{Nu}_x \sim (\mathrm{Re}_x\Pr)^{1/2}$.
^bl-scaling

> [!proof]- Proof (d 4)
> 1. Inside the layer, streamwise inertia $u\,\partial u/\partial x \sim U^2/x$ balances viscous diffusion across it, $\nu\,\partial^2 u/\partial y^2 \sim \nu U/\delta^2$.
> 2. So $\delta^2 \sim \nu x/U$, that is, $\delta/x \sim \mathrm{Re}_x^{-1/2}$.
> 3. For $\Pr > 1$, $\delta_t < \delta$, and inside the thermal layer the velocity rises linearly from the wall: $u \sim U\delta_t/\delta$.
> 4. Energy: convection $u\,\Delta T/x \sim U(\delta_t/\delta)\Delta T/x$ balances conduction $\alpha\,\Delta T/\delta_t^2$.
> 5. So $\delta_t^3 \sim \alpha x\delta/U$; divide by $\delta^3$ and use step 2: $(\delta_t/\delta)^3 \sim \alpha/\nu = \Pr^{-1}$.
> 6. By Theorem 1, $h \sim k_f/\delta_t$, so $\mathrm{Nu}_x = hx/k_f \sim x/\delta_t \sim \mathrm{Re}_x^{1/2}\Pr^{1/3}$.
> 7. For $\Pr \ll 1$, $\delta_t \gg \delta$ and $u \approx U$ across most of the thermal layer: $U\Delta T/x \sim \alpha\Delta T/\delta_t^2$ gives $\delta_t \sim (\alpha x/U)^{1/2}$ and $\mathrm{Nu}_x \sim (\mathrm{Re}_x\Pr)^{1/2}$.
^p-bl-scaling

Scaling gives exponents, not constants. The constants for the laminar plate come from solving the boundary-layer equations exactly by a similarity substitution (Blasius 1908 for velocity, Pohlhausen 1921 for temperature), which reduces them to ordinary differential equations solved numerically: $\delta_{99} \approx 5.0\,x\,\mathrm{Re}_x^{-1/2}$ and $\mathrm{Nu}_x = 0.332\,\mathrm{Re}_x^{1/2}\Pr^{1/3}$. The power $1/3$ on Pr is a fit to those numerical solutions, accurate for $0.6 < \Pr < 50$.
^bl-exact

Laminar flow on a plate becomes turbulent near $\mathrm{Re}_x \approx 5\times10^5$; the true value runs from about $3\times10^5$ to $3\times10^6$ with free-stream turbulence, roughness and pressure gradient. Turbulent mixing thins the wall layer and raises $h$ sharply.
^transition

## External flow

> [!thm] Correlations for external flow (empirical unless marked)
> Properties at the film temperature. $\overline{\mathrm{Nu}}$ is the surface average.
> - **Flat plate, laminar** ($\mathrm{Re}_L < 5\times10^5$, $\Pr > 0.6$; from the exact similarity solution): $\mathrm{Nu}_x = 0.332\,\mathrm{Re}_x^{1/2}\Pr^{1/3}$, $\overline{\mathrm{Nu}}_L = 0.664\,\mathrm{Re}_L^{1/2}\Pr^{1/3}$.
> - **Flat plate, turbulent** ($5\times10^5 < \mathrm{Re}_x < 10^7$, $0.6 < \Pr < 60$): $\mathrm{Nu}_x = 0.0296\,\mathrm{Re}_x^{4/5}\Pr^{1/3}$, from the Colburn analogy $\mathrm{St}\Pr^{2/3} = C_f/2$ (St $= h/(\rho c_p U)$) with a measured friction coefficient $C_f = 0.0592\,\mathrm{Re}_x^{-1/5}$. A plate laminar up to $5\times10^5$ and turbulent after averages $\overline{\mathrm{Nu}}_L = (0.037\,\mathrm{Re}_L^{4/5} - 871)\Pr^{1/3}$.
> - **Cylinder in cross flow** (Churchill and Bernstein 1977, fitted to data from many sources, $\mathrm{Re}_D\Pr > 0.2$):
> $$\overline{\mathrm{Nu}}_D = 0.3 + \frac{0.62\,\mathrm{Re}_D^{1/2}\Pr^{1/3}}{[1 + (0.4/\Pr)^{2/3}]^{1/4}}\left[1 + \left(\frac{\mathrm{Re}_D}{282\,000}\right)^{5/8}\right]^{4/5}.$$
> - **Sphere**: $\overline{\mathrm{Nu}}_D \to 2$ as $\mathrm{Re}_D \to 0$, which is pure conduction into still fluid (exact). For drops and small particles, $\overline{\mathrm{Nu}}_D = 2 + 0.6\,\mathrm{Re}_D^{1/2}\Pr^{1/3}$ (Ranz and Marshall 1952, fitted to evaporating drops).
>
> Expect 20 to 25 % scatter about any of the empirical fits.
^external

## Internal flow

> [!def] Mean temperature
> In a duct with cross-section $A_c$ and mass flow $\dot m$, the **mean** (bulk) temperature is the one the fluid would reach if mixed: $T_m = \int_{A_c}\rho u c_p T\,dA/(\dot m c_p)$. For internal flow $h$ is defined against it: $q''_s = h(T_s - T_m)$. The **hydraulic diameter** of a non-circular duct is $D_h = 4A_c/P$, $P$ the wetted perimeter.
^mean-temperature

> [!thm] Theorem 5 (mean temperature along a duct)
> Along a duct of perimeter $P$, $\dot m c_p\,dT_m/dx = q''_s P$. If the wall is held at a uniform $T_s$ and $\bar h$ is the average coefficient over length $x$,
> $$\frac{T_s - T_m(x)}{T_s - T_{m,i}} = \exp\!\left(-\frac{\bar h P x}{\dot m c_p}\right),$$
> and the heat transferred is $q = \bar h A\,\Delta T_{lm}$ with $A = Px$ and $\Delta T_{lm}$ the log-mean of the inlet and outlet differences $T_s - T_m$ (defined in Theorem 7).
^internal-balance

> [!proof]- Proof
> 1. Steady-flow energy equation on the slice from $x$ to $x + dx$: the enthalpy rise $\dot m c_p\,dT_m$ equals the heat in through the wall, $q''_s P\,dx$.
> 2. With $q''_s = h(T_s - T_m)$ and $\Delta T = T_s - T_m$: $d\Delta T/\Delta T = -hP\,dx/(\dot m c_p)$.
> 3. Integrate from the inlet; the integral of $h$ over $x$ is $\bar h x$.
> 4. Total heat: $q = \dot m c_p(\Delta T_i - \Delta T_o)$, and step 3 gives $\dot m c_p = \bar h A/\ln(\Delta T_i/\Delta T_o)$. Substitute.
^p-internal-balance

> [!thm] Correlations for internal flow (empirical unless marked)
> Circular tube; $\mathrm{Re}_D = \rho u_m D/\mu = 4\dot m/(\pi D\mu)$, properties at the mean temperature.
> - **Laminar** ($\mathrm{Re}_D < 2300$), fully developed: $\mathrm{Nu}_D = 48/11 = 4.36$ for uniform wall flux (exact, derive prompt below); $\mathrm{Nu}_D = 3.66$ for uniform wall temperature (exact, but the number is set by the first eigenvalue of the Graetz problem and is found numerically).
> - **Entry lengths**, laminar: the velocity profile develops over $x \approx 0.05\,\mathrm{Re}_D D$, the temperature profile over $x \approx 0.05\,\mathrm{Re}_D\Pr\,D$. In the entry region $h$ is higher than the fully developed value. Turbulent flow develops within about $10D$.
> - **Turbulent**, Dittus and Boelter (1930): $\mathrm{Nu}_D = 0.023\,\mathrm{Re}_D^{4/5}\Pr^n$, $n = 0.4$ heating the fluid, $0.3$ cooling it; for $\mathrm{Re}_D > 10^4$, $0.6 < \Pr < 160$, $L/D > 10$, small property variation. Errors up to about 25 %.
> - **Turbulent and transitional**, Gnielinski (1976): $\mathrm{Nu}_D = \dfrac{(f/8)(\mathrm{Re}_D - 1000)\Pr}{1 + 12.7(f/8)^{1/2}(\Pr^{2/3} - 1)}$ with Petukhov's smooth-tube friction factor $f = (0.790\ln\mathrm{Re}_D - 1.64)^{-2}$; for $3000 < \mathrm{Re}_D < 5\times10^6$, $0.5 < \Pr < 2000$. Errors about 10 %.
> - **Non-circular ducts**: turbulent correlations work with $D_h$ in place of $D$; laminar Nusselt numbers depend on the shape and are tabulated per shape.
^internal

## Natural convection

> [!thm] Correlations for natural convection (empirical)
> Properties at the film temperature, $\beta = 1/T_f$ for a gas.
> - **Vertical plate** of height $L$, all Ra (Churchill and Chu 1975):
> $$\overline{\mathrm{Nu}}_L = \left\{0.825 + \frac{0.387\,\mathrm{Ra}_L^{1/6}}{[1 + (0.492/\Pr)^{9/16}]^{8/27}}\right\}^2.$$
> The layer is laminar below $\mathrm{Ra}_L \approx 10^9$.
> - **Horizontal cylinder** of diameter $D$, $\mathrm{Ra}_D < 10^{12}$ (Churchill and Chu 1975): the same form with $0.60$ in place of $0.825$ and $0.559$ in place of $0.492$.
> - **Horizontal plate**, hot face up or cold face down, length $L = A/P$ (Lloyd and Moran 1974): $\overline{\mathrm{Nu}}_L = 0.54\,\mathrm{Ra}_L^{1/4}$ for $10^4 < \mathrm{Ra}_L < 10^7$, $0.15\,\mathrm{Ra}_L^{1/3}$ for $10^7 < \mathrm{Ra}_L < 10^{11}$.
^natural

The exponents in these fits are the scaling ones: $\mathrm{Ra}^{1/4}$ for a laminar buoyant layer and $\mathrm{Ra}^{1/3}$ for a turbulent one (derive prompts below). Natural convection in air gives $h$ of a few W/(m² K), the same size as radiation from a painted surface at modest temperatures, so the two must be added.
^natural-reading

## Radiation, linearised

> [!thm] Theorem 6 (radiation coefficient)
> A grey surface of emissivity $\varepsilon$ at $T_s$, small compared with surroundings at $T_{sur}$ that enclose it, exchanges $q'' = \varepsilon\sigma(T_s^4 - T_{sur}^4)$, $\sigma = 5.670\times10^{-8}$ W/(m² K⁴), temperatures in kelvin. Exactly, $q'' = h_r(T_s - T_{sur})$ with
> $$h_r = \varepsilon\sigma\,(T_s + T_{sur})(T_s^2 + T_{sur}^2) \approx 4\varepsilon\sigma\bar T^3.$$
> When the surroundings are at the air temperature, the surface sees $h + h_r$ in parallel.
^rad-linear

> [!proof]- Proof
> 1. $a^4 - b^4 = (a - b)(a + b)(a^2 + b^2)$.
> 2. With $\bar T = (T_s + T_{sur})/2$ and $T_s \approx T_{sur}$, $(a + b)(a^2 + b^2) \approx 2\bar T \cdot 2\bar T^2$.
^p-rad-linear

The Stefan–Boltzmann law is physics, not a fit; "grey" (emissivity independent of wavelength) is the approximation. A painted or oxidised surface has $\varepsilon \approx 0.8$ to $0.95$, polished metal $0.03$ to $0.1$.
^rad-note

## Heat exchangers

> [!def] Overall coefficient and heat capacity rates
> Two streams separated by a wall exchange heat through the series resistance $1/(UA) = 1/(h_iA_i) + R_{wall} + 1/(h_oA_o) + R_{fouling}$, which defines the **overall coefficient** $U$ on a chosen area $A$ ([resistances in series](th-conduction.md#^resistance)). Each stream has a **heat capacity rate** $C = \dot m c_p$ (W/K); the hot stream's temperature falls by $q/C_h$, the cold one's rises by $q/C_c$.
^ua

> [!thm] Theorem 7 (log-mean temperature difference)
> For a parallel-flow or a counterflow exchanger with constant $U$ and $c_p$,
> $$q = UA\,\Delta T_{lm}, \qquad \Delta T_{lm} = \frac{\Delta T_1 - \Delta T_2}{\ln(\Delta T_1/\Delta T_2)},$$
> where $\Delta T_1$ and $\Delta T_2$ are the hot-minus-cold differences at the two ends. For crossflow and shell-and-tube exchangers, $q = UAF\,\Delta T_{lm,cf}$, with $\Delta T_{lm,cf}$ computed as if counterflow and a correction factor $F \le 1$ taken from the exact solution for that arrangement.
^lmtd

> [!proof]- Proof (d 3)
> 1. On an element $dA$: $dq = U\,dA\,(T_h - T_c)$.
> 2. Measure position along the hot stream, from end 1 (hot inlet) to end 2. The hot fluid cools: $dT_h = -dq/C_h$.
> 3. In parallel flow the cold fluid travels the same way and warms: $dT_c = +dq/C_c$. In counterflow it travels the other way, so it is colder further along: $dT_c = -dq/C_c$.
> 4. With $\Delta T = T_h - T_c$: $d(\Delta T) = -dq\,(1/C_h \pm 1/C_c)$, $+$ for parallel, $-$ for counter.
> 5. Divide by step 1: $d(\Delta T)/\Delta T = -U\,dA\,(1/C_h \pm 1/C_c)$. Integrate: $\ln(\Delta T_2/\Delta T_1) = -UA\,(1/C_h \pm 1/C_c)$.
> 6. Overall balances: $\Delta T_1 - \Delta T_2$ is the hot stream's fall $q/C_h$ plus (parallel) or minus (counter) the cold stream's rise $q/C_c$. So $1/C_h \pm 1/C_c = (\Delta T_1 - \Delta T_2)/q$.
> 7. Substitute into step 5 and solve for $q$.
^p-lmtd

> [!thm] Theorem 8 (effectiveness and NTU)
> Define the **effectiveness** $\varepsilon = q/q_{max}$ with $q_{max} = C_{min}(T_{h,i} - T_{c,i})$, the **number of transfer units** $\mathrm{NTU} = UA/C_{min}$ and $C_r = C_{min}/C_{max}$. Then
> $$\text{counterflow: } \varepsilon = \frac{1 - e^{-\mathrm{NTU}(1 - C_r)}}{1 - C_r\,e^{-\mathrm{NTU}(1 - C_r)}}, \qquad \text{parallel: } \varepsilon = \frac{1 - e^{-\mathrm{NTU}(1 + C_r)}}{1 + C_r}.$$
> When one stream boils or condenses, $C_r = 0$ and every arrangement gives $\varepsilon = 1 - e^{-\mathrm{NTU}}$.
^ntu

> [!proof]- Proof of the counterflow form (d 3.5)
> 1. Take $C_h = C_{min}$ (the other case follows by swapping the roles of the streams) and $\Delta T_{max} = T_{h,i} - T_{c,i}$.
> 2. $T_{h,o} = T_{h,i} - \varepsilon\Delta T_{max}$ and $T_{c,o} = T_{c,i} + C_r\varepsilon\Delta T_{max}$.
> 3. In counterflow the hot inlet faces the cold outlet: $\Delta T_1 = T_{h,i} - T_{c,o} = \Delta T_{max}(1 - C_r\varepsilon)$; $\Delta T_2 = T_{h,o} - T_{c,i} = \Delta T_{max}(1 - \varepsilon)$.
> 4. Step 5 of Theorem 7 with the minus sign: $\Delta T_2/\Delta T_1 = e^{-UA(1/C_h - 1/C_c)} = e^{-\mathrm{NTU}(1 - C_r)} =: E$.
> 5. So $1 - \varepsilon = E(1 - C_r\varepsilon)$; solve for $\varepsilon$.
^p-ntu

Effectiveness answers the rating question (given the exchanger, what are the outlets?) without iteration; LMTD answers the sizing question (given the duty, what $UA$?). In parallel flow $\varepsilon$ can never exceed $1/(1 + C_r)$, and the cold outlet can never pass the hot outlet. In counterflow it can, and $\varepsilon \to 1$ as $\mathrm{NTU} \to \infty$ for every $C_r$.
^hx-reading

## Examples

> [!example] Air over a plate
> Air at 300 K ($\nu = 15.89\times10^{-6}$ m²/s, $k = 0.0263$ W/(m K), $\Pr = 0.707$) flows at 5 m/s along a plate 0.10 m long. Find the average $h$, the local $h$ at the trailing edge and the boundary-layer thickness there.
^ex-plate-air

> [!solution]- Solution
> methods: th-convection/external, th-convection/bl-scaling
> 1. $\mathrm{Re}_L = 5 \times 0.1/15.89\times10^{-6} = 3.15\times10^4$: laminar throughout.
> 2. $\overline{\mathrm{Nu}}_L = 0.664 \times 177.4 \times 0.891 = 105$; $\bar h = 105 \times 0.0263/0.1 = 27.6$ W/(m² K).
> 3. Local at $x = L$: half the average, 13.8 W/(m² K), because $h_x \propto x^{-1/2}$ averages to twice its end value.
> 4. $\delta_{99} \approx 5L/\sqrt{\mathrm{Re}_L} = 2.8$ mm.
^sol-ex-plate-air

> [!example] The side of a furnace box
> A vertical steel wall 0.15 m tall, painted ($\varepsilon = 0.9$), sits at 80 °C in still room air at 20 °C, the box of the [tube furnace](../../projects/tubefurnace/index.md) (the page assumes a 150 mm box and predicts an 80 °C surface; the emissivity is invented). Air at the 323 K film temperature: $\nu = 18.2\times10^{-6}$ m²/s, $\alpha = 25.9\times10^{-6}$ m²/s, $k = 0.0280$ W/(m K), $\Pr = 0.704$. Find the convective and radiative coefficients and the heat flux.
^ex-box-wall

> [!solution]- Solution
> methods: th-convection/natural, th-convection/rad-linear
> 1. $\mathrm{Ra}_L = 9.81 \times (1/323.15) \times 60 \times 0.15^3/(18.2\times10^{-6} \times 25.9\times10^{-6}) = 1.3\times10^7$: laminar.
> 2. Churchill and Chu: $\overline{\mathrm{Nu}} = 33.6$, $h_c = 33.6 \times 0.0280/0.15 = 6.3$ W/(m² K).
> 3. $h_r = 0.9 \times 5.67\times10^{-8} \times (353.15 + 293.15)(353.15^2 + 293.15^2) = 6.9$ W/(m² K).
> 4. $h = 13.2$ W/(m² K); $q'' = 13.2 \times 60 = 790$ W/m². Radiation carries just over half.
^sol-ex-box-wall

> [!example] A water-to-water exchanger
> Hot water at 0.2 kg/s enters at 80 °C; cold water at 0.3 kg/s enters at 20 °C; $UA = 1000$ W/K, $c_p = 4180$ J/(kg K). Find the duty and outlet temperatures in counterflow, check them by LMTD, and compare with parallel flow.
^ex-water-hx

> [!solution]- Solution
> methods: th-convection/ntu, th-convection/lmtd
> 1. $C_h = 836$ W/K $= C_{min}$, $C_c = 1254$ W/K, $C_r = 0.667$, $\mathrm{NTU} = 1000/836 = 1.196$.
> 2. Counterflow: $E = e^{-1.196 \times 0.333} = 0.671$; $\varepsilon = (1 - 0.671)/(1 - 0.667 \times 0.671) = 0.595$.
> 3. $q = 0.595 \times 836 \times 60 = 29.9$ kW; $T_{h,o} = 44.3$ °C, $T_{c,o} = 43.8$ °C.
> 4. Check: $\Delta T_1 = 80 - 43.8 = 36.2$, $\Delta T_2 = 44.3 - 20 = 24.3$, $\Delta T_{lm} = 29.85$ K, and $UA\,\Delta T_{lm} = 29.9$ kW.
> 5. Parallel: $\varepsilon = (1 - e^{-1.196 \times 1.667})/1.667 = 0.518$, $q = 26.0$ kW.
^sol-ex-water-hx

## Derive

> [!derive] Show that fully developed laminar flow in a circular tube with uniform wall heat flux has $\mathrm{Nu}_D = 48/11$, given the parabolic velocity profile $u = 2u_m(1 - r^2/R^2)$.
^d-nu-48-11

> [!solution]- Solution
> methods: th-convection/fluid-energy, th-convection/h-wall
> 1. Uniform flux and fully developed: $\partial T/\partial x = dT_m/dx = c$, a constant, at every $r$. The energy equation becomes $u\,c = \alpha\,r^{-1}(rT')'$.
> 2. Integrate once with $T'(0) = 0$: $rT' = (2u_mc/\alpha)(r^2/2 - r^4/(4R^2))$.
> 3. Again: $T - T(0) = (2u_mc/\alpha)(r^2/4 - r^4/(16R^2))$, so $T_s - T(0) = (3/16)(2u_mcR^2/\alpha)$.
> 4. Mean temperature, weighted by $u\,r$: $T_m - T(0) = (7/96)(2u_mcR^2/\alpha)$.
> 5. $T_s - T_m = (3/16 - 7/96)(2u_mcR^2/\alpha) = (11/96)(2u_mcR^2/\alpha)$.
> 6. Wall flux: $kT'(R) = k(2u_mc/\alpha)(R/4)$.
> 7. $\mathrm{Nu}_D = q''_s\,2R/(k(T_s - T_m)) = 2R \cdot (R/4)/((11/96)R^2) = 48/11$. Checked symbolically.
^sol-d-nu-48-11

> [!derive] For a vertical plate of height $L$ in a fluid with $\Pr \gtrsim 1$, laminar natural convection, find how $h$ depends on $L$ and on $\Delta T$, up to a constant.
^d-natural-scaling

> [!solution]- Solution
> methods: scaling
> 1. Across the thermal layer $\delta_t$, buoyancy $g\beta\Delta T$ balances viscous drag $\nu u/\delta_t^2$: $u \sim g\beta\Delta T\delta_t^2/\nu$.
> 2. Energy: $u\Delta T/L \sim \alpha\Delta T/\delta_t^2$.
> 3. Eliminate $u$: $\delta_t^4 \sim \nu\alpha L/(g\beta\Delta T)$, so $\delta_t/L \sim \mathrm{Ra}_L^{-1/4}$ and $\mathrm{Nu}_L \sim \mathrm{Ra}_L^{1/4}$.
> 4. $h \sim k/\delta_t \propto (\Delta T/L)^{1/4}$.
^sol-d-natural-scaling

> [!derive] Show that if $\overline{\mathrm{Nu}}_L \propto \mathrm{Ra}_L^{1/3}$, the heat transfer coefficient does not depend on $L$.
^d-turbulent-natural

> [!solution]- Solution
> methods: dimensional-analysis
> 1. $hL/k \propto (g\beta\Delta T/(\nu\alpha))^{1/3}L$.
> 2. Divide by $L/k$: $h \propto k\,(g\beta\Delta T/(\nu\alpha))^{1/3}$, free of $L$.
^sol-d-turbulent-natural

> [!derive] Show that a counterflow exchanger with $C_r = 1$ has $\varepsilon = \mathrm{NTU}/(1 + \mathrm{NTU})$, and that its two end temperature differences are equal.
^d-balanced-counterflow

> [!solution]- Solution
> methods: th-convection/ntu, limiting-case
> 1. With $C_h = C_c$ both streams change by the same amount, so $\Delta T_1 = \Delta T_2$ and $\Delta T$ is the same everywhere.
> 2. Then $q = UA\,\Delta T$ and $q = C(T_{h,i} - T_{h,o})$, with $\Delta T = T_{h,o} - T_{c,i} = \Delta T_{max} - q/C$.
> 3. $q = UA(\Delta T_{max} - q/C)$ gives $q/(C\Delta T_{max}) = \mathrm{NTU}/(1 + \mathrm{NTU})$. The general formula is $0/0$ at $C_r = 1$ and tends to the same limit.
^sol-d-balanced-counterflow

## Problems

> [!problem] A cold-plate channel (d 3)
> Water at 30 °C ($\rho = 996$ kg/m³, $\mu = 7.97\times10^{-4}$ Pa s, $k = 0.615$ W/(m K), $\Pr = 5.42$) flows at 0.2 L/min through a round channel of 4 mm diameter, 150 mm long, under a uniform heat flux. Find the Reynolds number, the fully developed $h$, and decide whether the fully developed value is the right one to use.
^inv-th-cold-plate

> [!solution]- Solution
> methods: th-convection/internal
> 1. $\dot m = 3.32\times10^{-3}$ kg/s; $\mathrm{Re}_D = 4\dot m/(\pi D\mu) = 1330$: laminar.
> 2. Fully developed: $h = 4.36 \times 0.615/0.004 = 670$ W/(m² K).
> 3. Thermal entry length: $0.05 \times 1330 \times 5.42 \times 0.004 = 1.44$ m, ten times the channel. The whole channel is in the entry region, where $h$ is higher; 670 W/(m² K) is a conservative floor, not the answer.
> Answer: 1330; 670 W/(m² K), an underestimate.
^sol-inv-th-cold-plate

> [!problem] Doubling the fan speed (d 2.5)
> A heat sink's air speed is doubled. By what factor does $h$ rise if the flow over its fins is laminar, and if it is turbulent? By roughly what factor does the fan power rise, taking the pressure drop to scale with the square of the speed?
^inv-th-fan-speed

> [!solution]- Solution
> methods: th-convection/bl-scaling, scaling
> 1. Laminar, $h \propto U^{1/2}$: factor 1.41. Turbulent, $h \propto U^{4/5}$: factor 1.74.
> 2. Power is pressure drop times volume flow, $\propto U^2 \cdot U$: factor 8.
> Answer: 1.41 or 1.74 for eight times the power.
^sol-inv-th-fan-speed

> [!problem] A thermocouple in hot gas (d 3.5)
> A thermocouple bead ($\varepsilon = 0.8$) in a gas stream reads 800 K. The duct walls are at 600 K, and the gas-to-bead coefficient is 100 W/(m² K). Ignoring conduction along the wires, find the gas temperature. What coefficient would hold the error to 5 K, and what does the bead read if a smaller bead raises $h$ to 400 W/(m² K)?
^inv-th-tc-radiation

> [!solution]- Solution
> methods: energy-balance, th-convection/rad-linear
> 1. Steady bead: $h(T_g - T_b) = \varepsilon\sigma(T_b^4 - T_w^4) = 0.8 \times 5.67\times10^{-8} \times (800^4 - 600^4) = 12\,700$ W/m².
> 2. $T_g = 800 + 12\,700/100 = 927$ K: the reading is 127 K low.
> 3. Error 5 K needs $h = 2540$ W/(m² K), out of reach for a bare bead in gas; a radiation shield is the usual fix.
> 4. With $h = 400$: solve $400(927 - T_b) = 0.8\sigma(T_b^4 - 600^4)$, giving $T_b = 875$ K, still 52 K low.
> Answer: 927 K; 2540 W/(m² K); 875 K.
^sol-inv-th-tc-radiation

> [!problem] Two water loops (d 4)
> A secondary loop carries 2.4 kg/s of water in at 45 °C; facility water at 2.0 kg/s enters at 30 °C. The exchanger must move 80 kW. Take $c_p = 4180$ J/(kg K). Find the outlet temperatures and the $UA$ needed in counterflow. Can parallel flow do the job?
^inv-th-two-loops

> [!solution]- Solution
> methods: th-convection/lmtd, th-convection/ntu
> 1. $C_h = 10\,032$ W/K, $C_c = 8360$ W/K. $T_{h,o} = 45 - 80\,000/10\,032 = 37.0$ °C; $T_{c,o} = 30 + 80\,000/8360 = 39.6$ °C.
> 2. Counterflow: $\Delta T_1 = 45 - 39.6 = 5.43$ K, $\Delta T_2 = 37.0 - 30 = 7.03$ K, $\Delta T_{lm} = 6.19$ K, $UA = 12.9$ kW/K.
> 3. The cold outlet (39.6 °C) is above the hot outlet (37.0 °C), which parallel flow cannot reach. Equivalently, parallel flow caps $\varepsilon$ at $1/(1 + C_r) = 0.545$, that is 68.4 kW, against a required $\varepsilon = 0.638$.
> Answer: 37.0 °C and 39.6 °C; 12.9 kW/K; no.
^sol-inv-th-two-loops

> [!problem] Process gas in a furnace tube (d 3.5)
> Nitrogen at 2 standard litres per minute (litres at 0 °C and 101.325 kPa, where $\rho = 1.2506$ kg/m³) enters a 12.7 mm bore at 20 °C; the bore is the current tube's on the [tube furnace](../../projects/tubefurnace/index.md) page and the flow the one that page uses for the next furnace. The tube wall is at 1000 °C. Using properties at 800 K ($\mu = 3.5\times10^{-5}$ Pa s, $k = 0.055$ W/(m K), $c_p = 1120$ J/(kg K)) and fully developed flow, find the distance over which the gas's shortfall from the wall falls by $e$, the length to come within 1 %, and the heat the gas carries off once at wall temperature. Is the fully developed assumption fair?
^inv-th-process-gas

> [!solution]- Solution
> methods: th-convection/internal-balance, th-convection/internal
> 1. $\dot m = (2\times10^{-3}/60) \times 1.2506 = 4.17\times10^{-5}$ kg/s; $\mathrm{Re}_D = 4\dot m/(\pi D\mu) = 119$: laminar.
> 2. Uniform wall temperature: $h = 3.66 \times 0.055/0.0127 = 15.9$ W/(m² K).
> 3. Decay length $\dot m c_p/(hP) = 0.0467/(15.9 \times 0.0399) = 74$ mm; within 1 % after $74 \ln 100 = 340$ mm.
> 4. Heat carried: $\dot m c_p \times 980 = 46$ W.
> 5. Thermal entry length $0.05\,\mathrm{Re}\Pr\,D = 53$ mm, comparable with the decay length, so the real gas heats somewhat faster near the inlet than this estimate says. Radiation from the wall, which nitrogen does not absorb, does not heat the gas directly.
> Answer: about 7 cm; about 34 cm; about 46 W.
^sol-inv-th-process-gas

> [!problem] How hot the box gets (d 4.5)
> A vertical wall 0.15 m tall must shed 600 W/m² by natural convection and radiation into still air and surroundings at 20 °C. Find its temperature if it is painted ($\varepsilon = 0.9$) and if it is bare polished sheet ($\varepsilon = 0.1$). Air properties (SI) at 250, 300, 350 and 400 K, interpolate linearly: $\nu \times 10^6$ = 11.44, 15.89, 20.92, 26.41; $k \times 10^3$ = 22.3, 26.3, 30.0, 33.8; $\alpha \times 10^6$ = 15.9, 22.5, 29.9, 38.3; Pr = 0.720, 0.707, 0.700, 0.690.
^inv-th-box-temperature

> [!solution]- Solution
> methods: th-convection/natural, th-convection/rad-linear, energy-balance
> 1. Unknown $T_s$ appears in Ra, in the film properties and in $T_s^4$; solve $h_c(T_s)(T_s - T_\infty) + \varepsilon\sigma(T_s^4 - T_\infty^4) = 600$ by iteration.
> 2. Painted: $T_s = 68.0$ °C, with $\mathrm{Ra} = 1.1\times10^7$ (laminar), $h_c = 5.9$ W/(m² K); convection carries 285 W/m², radiation 315 W/m².
> 3. Polished: radiation falls to about 67 W/m² and $T_s = 99$ °C.
> 4. The painted wall just meets a 70 °C touch limit; at 70 °C it can shed 631 W/m². Paint is worth 31 K.
> Answer: 68 °C painted; 99 °C polished.
^sol-inv-th-box-temperature
