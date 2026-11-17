---
study: basic
id: th-two-phase
title: Boiling, condensation, heat pipes and vapor chambers
area: th
needs: [th-thermo, th-convection]
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: the [Clausius–Clapeyron relation](th-thermo.md#^clausius-clapeyron) and [enthalpy](th-thermo.md#^enthalpy) from th-thermo; the [heat transfer coefficient](th-convection.md#^newton), the [dimensionless groups](th-convection.md#^groups) and [natural convection](th-convection.md#^natural) from th-convection. ^needs

Phase change moves heat at a fixed temperature, and the latent heat of a kilogram of water is about 540 times the sensible heat of warming it by one kelvin. Every device here uses that: a boiling surface, a condensing wall, a heat pipe, a vapor chamber. The theory comes in three parts: what sets the temperature (saturation), what limits the flux at a surface (boiling and condensation), and what pumps the liquid back (capillarity). ^intro

## Saturation

> [!def] Saturation
> A pure substance with liquid and vapor in equilibrium is **saturated**. At a given pressure $p$ there is exactly one such temperature, the **saturation temperature** $T_\text{sat}(p)$; equivalently $p_\text{sat}(T)$. The **quality** $x$ is the vapor mass fraction. The **latent heat** $h_{fg} = h_g - h_f$ is the enthalpy difference between saturated vapor and saturated liquid at the same pressure, and $v_{fg} = v_g - v_f$ the specific volume difference. A surface at $T_s$ in contact with saturated fluid has **excess temperature** (wall superheat) $\Delta T_e = T_s - T_\text{sat}$.
^saturation

The [Clausius–Clapeyron relation](th-thermo.md#^clausius-clapeyron), $dp_\text{sat}/dT = h_{fg}/(T v_{fg})$, read the other way gives the slope of the saturation temperature. Far below the critical point $v_f \ll v_g = 1/\rho_v$, so
$$\frac{dT_\text{sat}}{dp} = \frac{T\,v_{fg}}{h_{fg}} \approx \frac{T}{\rho_v h_{fg}}.$$
^sat-slope

| $T$, °C | $p_\text{sat}$, kPa | $h_{fg}$, kJ/kg | $v_g$, m³/kg | $dT_\text{sat}/dp$, K/kPa |
|---|---|---|---|---|
| 25 | 3.17 | 2441.7 | 43.34 | 5.29 |
| 60 | 19.95 | 2357.7 | 7.667 | 1.08 |
| 80 | 47.41 | 2308.0 | 3.405 | 0.521 |
| 100 | 101.42 | 2256.4 | 1.672 | 0.276 |
^water-table

Water: $p_\text{sat}$ from the IAPWS-IF97 saturation equation, $h_{fg}$ and $v_g$ from a standard steam table; the last column is the slope above, and it agrees with the numerical derivative of $p_\text{sat}$ to 0.1 %. Near room temperature a pressure drop of 1 kPa costs 5 K of saturation temperature; at 100 °C it costs 0.28 K. Every vapor-side pressure loss in a device is a temperature loss through this slope, and low-temperature operation makes it twenty times worse. ^sat-slope-reading

> [!def] Non-condensable gas
> A gas that does not condense at the operating conditions (air in a water device, hydrogen from corrosion). In a closed volume the total pressure is $p = p_\text{sat}(T) + p_\text{gas}$ (Dalton). At a condensing surface the vapor drags the gas along and leaves it there, so the gas piles up as a layer the vapor must diffuse through. A heat pipe with gas in it has a blocked, cold end of the condenser.
^ncg

> [!example] A sealed chamber at 80 °C
> A sealed, fully evacuated chamber holds water and its vapor at 80 °C. Find the pressure inside, and the temperature drop that a 100 Pa vapor pressure loss costs at 80 °C and at 25 °C.
^ex-sat

> [!solution]- Solution
> methods: th-two-phase/sat-slope
> 1. Saturated, so $p = p_\text{sat}(80\ \text{°C}) = 47.4$ kPa, about 0.47 atm absolute: the chamber is under vacuum relative to the room.
> 2. $\Delta T = (dT_\text{sat}/dp)\,\Delta p = 0.521 \times 0.1 = 0.052$ K at 80 °C.
> 3. At 25 °C: $5.29 \times 0.1 = 0.53$ K, ten times more for the same pressure loss.

## Capillarity

> [!def] Surface tension and contact angle
> **Surface tension** $\sigma$ (N/m) is the free energy per unit area of a liquid–vapor interface, equivalently a tension per unit length along any line in it. The **contact angle** $\theta$ is the angle at which the interface meets a solid, measured through the liquid; $\theta < 90°$ is wetting.
^surface-tension

> [!thm] Theorem 1 (Young–Laplace)
> Across a curved interface with principal radii $R_1, R_2$ the pressure is higher on the concave side by $\Delta p = \sigma(1/R_1 + 1/R_2)$. For a sphere of radius $R$, $\Delta p = 2\sigma/R$. A liquid wetting a cylindrical pore of radius $r$ at contact angle $\theta$ forms a meniscus that sustains
> $$\Delta p_\text{cap} = \frac{2\sigma\cos\theta}{r}.$$
^capillary

> [!proof]- Proof of the spherical and pore cases (d 2)
> 1. Take a spherical bubble of radius $R$ with pressures $p_i$ inside and $p_o$ outside, in equilibrium.
> 2. Let it grow by $dR$ at fixed pressures: the pressure difference does work $(p_i - p_o)\,4\pi R^2\,dR$.
> 3. The interface area grows by $8\pi R\,dR$, which costs $\sigma\,8\pi R\,dR$ of surface energy.
> 4. At equilibrium the first variation of the free energy vanishes, so $(p_i - p_o)\,4\pi R^2 = 8\pi\sigma R$, which gives $\Delta p = 2\sigma/R$.
> 5. In a pore of radius $r$, a meniscus meeting the wall at angle $\theta$ is a spherical cap whose radius is $r/\cos\theta$, so $\Delta p = 2\sigma\cos\theta/r$.
^p-capillary

> [!thm] Theorem 2 (nucleation superheat)
> A spherical vapor embryo of radius $r$ in liquid at pressure $p_l$ is in equilibrium when the liquid is superheated by
> $$T_l - T_\text{sat}(p_l) \approx \frac{2\sigma\,T_\text{sat}}{\rho_v h_{fg}\, r},$$
> to first order and with $\rho_v \ll \rho_l$. A hotter liquid makes it grow; a cooler one makes it collapse.
^nucleation

> [!proof]- Proof (d 3.5)
> 1. The vapor in the embryo is at the liquid's temperature and in phase equilibrium with it, so its pressure is $p_v = p_\text{sat}(T_l)$.
> 2. Mechanical equilibrium of the interface (Theorem 1): $p_v - p_l = 2\sigma/r$.
> 3. Since $p_l = p_\text{sat}(T_\text{sat}(p_l))$, the requirement is $p_\text{sat}(T_l) - p_\text{sat}(T_\text{sat}) = 2\sigma/r$.
> 4. Linearise with Clausius–Clapeyron: the left side is $\dfrac{h_{fg}}{T_\text{sat} v_{fg}}\,(T_l - T_\text{sat})$.
> 5. Put $v_{fg} \approx 1/\rho_v$ and solve for $T_l - T_\text{sat}$.
> 6. If $T_l$ exceeds this value, $p_\text{sat}(T_l) - p_l > 2\sigma/r$, the vapor pushes the interface outward, $r$ grows and the required superheat falls further: growth runs away. Below it the embryo shrinks.
^p-nucleation

Boiling therefore starts from gas or vapor trapped in surface cavities, and the cavity mouth radius sets the superheat at onset. Fluids that wet very well (refrigerants, dielectric coolants) flood small cavities, so they need a large superheat to start and then the wall temperature drops once boiling begins: the temperature overshoot seen at the onset of boiling with those fluids. ^cavities

> [!example] Cavity size and onset superheat
> Water boils at 1 atm on a surface whose active cavities have mouth radius 1 µm on one finish and 10 µm on another. Take $\sigma = 0.0589$ N/m, $\rho_v = 0.598$ kg/m³, $h_{fg} = 2256$ kJ/kg. Find the superheat each needs.
^ex-nucleation

> [!solution]- Solution
> methods: th-two-phase/nucleation
> 1. $2\sigma T_\text{sat} = 2 \times 0.0589 \times 373.15 = 43.96$ N·K/m.
> 2. $\rho_v h_{fg} = 0.598 \times 2.2564\times10^6 = 1.349\times10^6$ J/m³.
> 3. $r = 1$ µm: $43.96 / (1.349\times10^6 \times 10^{-6}) = 32.6$ K. $r = 10$ µm: $3.3$ K.
> 4. At 1 µm the first-order step is coarse: $2\sigma/r = 118$ kPa, and solving $p_\text{sat}(T_l) = 101.3 + 118$ kPa exactly gives $T_l \approx 123$ °C, a superheat of about 23 K. At 10 µm the two agree to 0.2 K.
> 5. Rough, larger-cavity surfaces start boiling at a few kelvin; a polished surface with only micron cavities can hold tens of kelvin of superheat in natural convection first.

## The boiling curve

The **boiling curve** is the wall heat flux $q''$ against the excess temperature $\Delta T_e$ for a surface in a pool of saturated liquid, usually drawn on log-log axes. Its regimes, in order of rising $\Delta T_e$: ^boiling-curve

- **Natural convection.** No bubbles; single-phase [natural convection](th-convection.md#^natural), $q'' \propto \Delta T_e^{5/4}$ or so. ^bc-natural
- **Onset of nucleate boiling.** The superheat reaches the value of Theorem 2 for the largest available cavities. ^bc-onb
- **Nucleate boiling.** Isolated bubbles, then jets and columns. Bubble departure stirs the liquid next to the wall, and $q''$ rises steeply, roughly as $\Delta T_e^3$. ^bc-nucleate
- **Critical heat flux** (CHF), $q''_\text{max}$: the peak. Vapor leaving the surface blocks liquid from reaching it. ^bc-chf
- **Transition boiling.** Patches of the wall dry out and rewet; $q''$ falls as $\Delta T_e$ rises. ^bc-transition
- **Minimum heat flux** (the Leidenfrost point): the vapor film first becomes stable. ^bc-leidenfrost
- **Film boiling.** A continuous vapor blanket; heat crosses it by conduction and, at high $\Delta T_e$, radiation. ^bc-film

> [!thm] Correlation 3 (Rohsenow, nucleate pool boiling)
> $$q'' = \mu_l h_{fg}\left[\frac{g(\rho_l - \rho_v)}{\sigma}\right]^{1/2}\left[\frac{c_{p,l}\,\Delta T_e}{C_{s,f}\,h_{fg}\,\Pr_l^{\,n}}\right]^3,$$
> with $C_{s,f}$ and $n$ fitted to the fluid–surface pair ($n = 1$ for water, 1.7 for most other fluids). Properties of the saturated liquid.
^rohsenow

This is an empirical fit, not a theorem, and $C_{s,f}$ depends on the surface finish in ways no table fully captures. Because $q'' \propto (\Delta T_e/C_{s,f})^3$, an error of a factor 2 in $C_{s,f}$ is a factor 8 in $q''$ at a given $\Delta T_e$, but only a factor 2 in $\Delta T_e$ at a given $q''$. Use it to predict the wall superheat at a known flux, not the flux at a known superheat. The cube also means $h = q''/\Delta T_e \propto q''^{2/3}$: a boiling surface gets better as it is pushed harder, up to CHF. ^rohsenow-reading

> [!example] Nucleate boiling of water on copper
> Water at 1 atm boils on polished copper. Take $C_{s,f} = 0.013$, $n = 1$, $\mu_l = 2.82\times10^{-4}$ Pa·s, $c_{p,l} = 4217$ J/kg·K, $\Pr_l = 1.75$, $\rho_l = 957.9$ kg/m³, $\rho_v = 0.598$ kg/m³, $\sigma = 0.0589$ N/m, $h_{fg} = 2256.4$ kJ/kg. Find $q''$ at $\Delta T_e = 10$ K, the same with $C_{s,f}$ halved, and the superheat that carries 0.5 MW/m².
^ex-rohsenow

> [!solution]- Solution
> methods: th-two-phase/rohsenow
> 1. Prefactor: $\mu_l h_{fg}\sqrt{g(\rho_l-\rho_v)/\sigma} = 2.82\times10^{-4}\times 2.2564\times10^6 \times \sqrt{9.81\times957.3/0.0589} = 636.3 \times 399.3 = 2.54\times10^5$ W/m².
> 2. Bracket at 10 K: $4217\times10/(0.013\times2.2564\times10^6\times1.75) = 0.8215$; cubed, 0.554.
> 3. $q'' = 1.41\times10^5$ W/m² $= 0.14$ MW/m², so $h \approx 14$ kW/m²·K.
> 4. Halving $C_{s,f}$ multiplies by 8: $1.13$ MW/m², already at the critical heat flux of the next section, past which the correlation does not apply.
> 5. At 0.5 MW/m²: $\Delta T_e = 10\times(0.5/0.141)^{1/3} = 15.3$ K.

> [!thm] Theorem 4 (stability under imposed heat flux)
> A heater of heat capacity $C$ per unit area receives a fixed flux $q''_\text{in}$ and rejects $q''(\Delta T_e)$ to the pool. An equilibrium $\Delta T^*$ with $q''(\Delta T^*) = q''_\text{in}$ is stable if $dq''/d\Delta T_e > 0$ there and unstable if $dq''/d\Delta T_e < 0$.
^boiling-stability

> [!proof]- Proof (d 2.5)
> 1. Energy balance on the heater per unit area: $C\,d\Delta T_e/dt = q''_\text{in} - q''(\Delta T_e)$.
> 2. Write $\Delta T_e = \Delta T^* + \delta$ and expand $q''$ to first order: $C\,d\delta/dt = -q''{}'(\Delta T^*)\,\delta$.
> 3. The solution is $\delta(t) = \delta(0)\,e^{-q''{}'(\Delta T^*)\,t/C}$, which decays when the slope is positive and grows when it is negative.
^p-boiling-stability

So an electrically heated surface cannot sit on the transition branch. If $q''_\text{in}$ is raised past $q''_\text{max}$, no nucleate or transition state can carry it and the surface jumps at the same flux to the film branch, hundreds or thousands of kelvin hotter: **burnout**. A surface heated by a fluid at a fixed temperature (condensing steam inside a tube, say) controls $\Delta T_e$ instead, and the whole curve can be traversed. ^burnout

## Critical heat flux

> [!thm] Correlation 5 (hydrodynamic CHF, Zuber form)
> For a large, horizontal, upward-facing heater in a saturated pool of a wetting liquid,
> $$q''_\text{max} = C\,h_{fg}\,\rho_v\left[\frac{\sigma g(\rho_l - \rho_v)}{\rho_v^2}\right]^{1/4},$$
> with $C = \pi/24 \approx 0.131$ in Zuber's analysis and $C \approx 0.149$ recommended for large flat heaters (Lienhard and Dhir).
^chf

The form follows from dimensions once one assumes the vapor mass flux leaving the surface at CHF is set by $\sigma$, $g(\rho_l-\rho_v)$ and $\rho_v$ alone, a hydrodynamic instability; the constant comes from the instability wavelength and is not derived here. Some versions carry a factor $(1 + \rho_v/\rho_l)^{1/2}$, negligible at low pressure. CHF rises with liquid subcooling and with forced flow, and falls for small heaters, other orientations and poor wetting; these are corrections to look up, not to guess. ^chf-reading

> [!example] Pool CHF for water at 1 atm
> With the water properties of the Rohsenow example, find $q''_\text{max}$ for both constants.
^ex-chf

> [!solution]- Solution
> methods: th-two-phase/chf
> 1. $\sigma g(\rho_l - \rho_v)/\rho_v^2 = 0.0589\times9.81\times957.3/0.598^2 = 1547$ m⁴/s⁴; fourth root 6.27 m/s.
> 2. $h_{fg}\rho_v = 2.2564\times10^6 \times 0.598 = 1.349\times10^6$ J/m³.
> 3. $q''_\text{max} = 0.131 \times 1.349\times10^6 \times 6.27 = 1.11$ MW/m², or 1.26 MW/m² with 0.149: about 110 to 130 W/cm².

## Film condensation

> [!thm] Theorem 6 (Nusselt, laminar film condensation on a vertical plate)
> Saturated vapor at $T_\text{sat}$ condenses on a vertical plate of height $L$ held at $T_s < T_\text{sat}$. If the condensate film is laminar, its inertia, the vapor shear on it and the condensate's subcooling are negligible, and the temperature across the film is linear, then the film thickness and the mean heat transfer coefficient are
> $$\delta(x) = \left[\frac{4\mu_l k_l (T_\text{sat} - T_s)\,x}{\rho_l(\rho_l - \rho_v) g\, h_{fg}}\right]^{1/4},\qquad \bar h_L = 0.943\left[\frac{\rho_l(\rho_l-\rho_v) g\, h_{fg}\, k_l^3}{\mu_l (T_\text{sat} - T_s) L}\right]^{1/4}.$$
^film-condensation

> [!proof]- Proof (d 4)
> 1. Force balance on the film at distance $y$ from the wall, with the vapor's hydrostatic gradient acting on it: $\mu_l\,d^2u/dy^2 = -(\rho_l - \rho_v) g$, with $u = 0$ at the wall and $du/dy = 0$ at the free surface $y = \delta$.
> 2. Integrate twice: $u(y) = \dfrac{(\rho_l - \rho_v) g}{\mu_l}\left(\delta y - \dfrac{y^2}{2}\right)$.
> 3. Mass flow per unit width: $\Gamma = \int_0^\delta \rho_l u\,dy = \dfrac{\rho_l(\rho_l-\rho_v) g\,\delta^3}{3\mu_l}$.
> 4. Energy balance on a strip $dx$: heat conducted across the film, $k_l (T_\text{sat}-T_s)\,dx/\delta$, condenses $h_{fg}\,d\Gamma$ of new liquid.
> 5. From step 3, $d\Gamma = \rho_l(\rho_l-\rho_v) g\,\delta^2 d\delta/\mu_l$; substituting gives $\delta^3 d\delta = \dfrac{\mu_l k_l (T_\text{sat}-T_s)}{\rho_l(\rho_l-\rho_v) g\, h_{fg}}\,dx$.
> 6. Integrate from $\delta(0) = 0$: $\delta^4/4$ equals the right side times $x$, which is the stated $\delta(x)$.
> 7. The local coefficient is $h(x) = k_l/\delta(x) \propto x^{-1/4}$.
> 8. Average over the height: $\bar h_L = \frac{1}{L}\int_0^L h\,dx = \frac{4}{3}h(L)$.
> 9. Substitute $\delta(L)$: $\frac{4}{3}\cdot 4^{-1/4} = 0.943$, giving the stated $\bar h_L$.
^p-film-condensation

Use $h'_{fg} = h_{fg} + 0.68\,c_{p,l}(T_\text{sat} - T_s)$ in place of $h_{fg}$ to account for the condensate cooling below saturation (Rohsenow's correction), and take liquid properties at the film temperature $(T_\text{sat}+T_s)/2$. The film Reynolds number $\text{Re}_\delta = 4\Gamma/\mu_l$ says whether the assumptions hold: below about 30 the film is wave-free and the theory fits; from 30 to about 1800 it is wavy, and waves raise $h$ by tens of percent; above that it is turbulent. On the outside of a horizontal tube of diameter $D$ the same analysis gives the constant 0.729 with $D$ in place of $L$. ^film-condensation-use

Two departures matter more than any correction. **Dropwise condensation**, on a surface the condensate does not wet, gives coefficients several times higher, but promoter coatings rarely survive long. **Non-condensable gas** (a [definition](#^ncg) above) cuts film condensation sharply even at a few percent by mass, because the vapor must diffuse through the gas layer it leaves at the wall; how much depends on the flow, so check a correlation for the case rather than assume one. ^condensation-departures

## Heat pipes

> [!def] Heat pipe and thermosyphon
> A **heat pipe** is a sealed, evacuated tube holding a small charge of working fluid at saturation, with a **wick** (grooves, mesh or sintered powder) lining the wall. Heat enters at the **evaporator**, evaporates liquid from the wick, the vapor flows down the core to the **condenser**, condenses, and the liquid returns through the wick by capillary pumping. An **adiabatic section** may lie between. A **thermosyphon** has no wick: the condenser sits above the evaporator and gravity returns the liquid.
^heat-pipe

A wick is described by its **effective pore radius** $r_\text{eff}$ (sets the capillary pressure), its **permeability** $K$ (m², sets the liquid flow resistance through Darcy's law, superficial velocity $= -(K/\mu)\,dp/dz$) and its cross-section $A_w$. A small pore pumps harder but flows worse; that trade-off is the design. ^wick

> [!thm] Theorem 7 (capillary limit)
> A heat pipe with evaporator, adiabatic and condenser lengths $L_e, L_a, L_c$, total length $L_t$, uniform heat input and removal, inclined so the evaporator is $L_t\sin\varphi$ above the condenser, carries at most
> $$Q_\text{cap} = \underbrace{\frac{\rho_l\sigma h_{fg}}{\mu_l}}_{M}\cdot\frac{K A_w}{L_\text{eff}}\cdot\frac{2\cos\theta}{r_\text{eff}}\left(1 - \frac{\rho_l g L_t \sin\varphi\; r_\text{eff}}{2\sigma\cos\theta}\right),\qquad L_\text{eff} = L_a + \frac{L_e + L_c}{2},$$
> when the vapor pressure drop is negligible. $M$ is the fluid's **merit number**.
^capillary-limit

> [!proof]- Proof (d 4)
> 1. Darcy flow in the wick: the liquid mass flow at position $z$ is $\dot m(z) = -\dfrac{\rho_l K A_w}{\mu_l}\dfrac{dp_l}{dz}$.
> 2. At steady state the liquid at $z$ carries back the latent heat of the axial heat flow there: $\dot m(z) = Q(z)/h_{fg}$, where $Q(z)$ rises linearly from 0 across the condenser, stays $Q$ across the adiabatic section and falls linearly to 0 across the evaporator.
> 3. Integrate along the pipe: $\Delta p_l = \dfrac{\mu_l}{\rho_l K A_w h_{fg}}\displaystyle\int Q(z)\,dz = \dfrac{\mu_l\, Q\, L_\text{eff}}{\rho_l K A_w h_{fg}}$, since the triangles contribute half their lengths.
> 4. The menisci supply at most $2\sigma\cos\theta/r_\text{eff}$ (Theorem 1): nearly flat at the wet condenser end, most curved at the evaporator end.
> 5. Around the loop the capillary head must cover the liquid loss, the vapor loss and the lift: $2\sigma\cos\theta/r_\text{eff} \ge \Delta p_l + \Delta p_v + \rho_l g L_t\sin\varphi$.
> 6. Drop $\Delta p_v$, set equality and solve for $Q$.
^p-capillary-limit

The merit number ranks fluids independently of the wick. For water it is about $4.5\times10^{11}$ W/m² at 100 °C and $3.3\times10^{11}$ W/m² at 60 °C (with $\sigma$, $\mu_l$, $\rho_l$, $h_{fg}$ from standard tables), the highest of the common fluids between roughly 50 and 200 °C. The bracket shows that tilting the evaporator up spends capillary head on lift; once $\rho_l g L_t\sin\varphi$ reaches $2\sigma\cos\theta/r_\text{eff}$ the pipe carries nothing. ^merit

The operating envelope of a heat pipe, $Q_\text{max}$ against vapor temperature, is bounded by several limits. In the usual order as temperature rises (check the order for a given design; it is not universal): ^heat-pipe-limits

- **Viscous (vapor pressure) limit.** At low temperature the vapor pressure is so low that viscous loss along the core uses all of it; the condenser-end pressure cannot fall below zero. Matters at start-up. ^lim-viscous
- **Sonic limit.** The vapor leaving the evaporator chokes at the speed of sound. Levy's estimate is $Q_s \approx A_v\rho_v h_{fg}\sqrt{\gamma R_v T_v/(2(\gamma+1))}$ (check the form against a heat-pipe text before quoting it). Reaching it raises the axial temperature drop but does not by itself dry the wick. ^lim-sonic
- **Entrainment limit.** Fast vapor shears droplets off the liquid surface of the wick and carries them back to the condenser, starving the evaporator. ^lim-entrainment
- **Capillary limit.** Theorem 7. The usual design limit in the middle of the range. ^lim-capillary
- **Boiling limit.** High radial flux in the evaporator nucleates vapor inside the wick (Theorem 2), which blocks liquid return. Set by the wick's conductivity and pore size. ^lim-boiling

## Vapor chambers

> [!def] Vapor chamber
> A **vapor chamber** is a flat heat pipe: a sealed, thin enclosure with the heat source on one face and the condenser (a heat sink, a cold plate or chiller water) on the opposite face or the ends. Its job is **spreading**: heat leaves through a much larger area than it enters, and the vapor space between the faces is nearly isothermal. Its resistance is a series stack: evaporator wall, evaporator wick (liquid-filled, often the largest term), vapor, condenser wick, condenser wall. A wickless chamber returns liquid by gravity (a flat thermosyphon, orientation dependent) or by some other pump built into the surface.
^vapor-chamber

> [!thm] Theorem 8 (in-plane conductance of the vapor core)
> Heat carried as latent heat by laminar, fully developed vapor flow through a gap $h$ between parallel plates gives the core an in-plane effective conductivity
> $$k_\text{eff} = \frac{\rho_v^2 h_{fg}^2\, h^2}{12\,\mu_v\, T},$$
> with $T$ the absolute vapor temperature.
^vapor-keff

> [!proof]- Proof (d 3.5)
> 1. Over a run of length $L$ and width $w$, heat $Q$ travels as vapor mass flow $\dot m = Q/h_{fg}$.
> 2. Laminar flow between parallel plates has mean velocity $\bar u = h^2\,|dp/dx|/(12\mu_v)$, and $\bar u = \dot m/(\rho_v w h)$, so $\Delta p = 12\mu_v \dot m L/(\rho_v w h^3)$.
> 3. The vapor stays saturated, so its temperature follows its pressure: $\Delta T = (dT_\text{sat}/dp)\,\Delta p = T\Delta p/(\rho_v h_{fg})$.
> 4. Combine: $\Delta T = 12\mu_v Q L T/(\rho_v^2 h_{fg}^2 w h^3)$.
> 5. Define $k_\text{eff}$ by $Q = k_\text{eff}\,(wh)\,\Delta T/L$ and solve.
^p-vapor-keff

The vapor core is rarely the bottleneck at normal temperatures: at 60 °C a 0.5 mm gap gives $k_\text{eff}$ in the hundreds of thousands of W/m·K. What a chamber's overall number reflects is the evaporator wick, the walls, the contacts on either side and the fill. Too little liquid dries the evaporator; too much floods it, so heat must conduct through a liquid layer (water: about 0.6 W/m·K) before it can evaporate. The factor $\rho_v^2$ makes the core strongly temperature dependent, so chambers that start cold perform worst at start-up. ^vapor-chamber-reading

A test that reads temperatures inside the plate under a chamber sees the chamber only through the conductance it presents to that plate's surface. The in-plane gradient in the plate is then set by the plate's own conduction and by how that conductance is distributed; a uniform conductance per area, however large, does not by itself flatten the plate under a concentrated source. ^vapor-chamber-plate

## Derive

> [!derive] Prove that the pressure inside a spherical bubble of radius $R$ exceeds the pressure outside by $2\sigma/R$, and find the capillary pressure of a meniscus in a pore of radius $r$ with contact angle $\theta$.
^d-young-laplace

> [!derive] Derive the liquid superheat at which a vapor embryo of radius $r$ is in equilibrium, to first order in the superheat.
^d-nucleation

> [!derive] Prove that a heater with imposed flux cannot rest stably at an operating point where the rejected flux decreases with wall superheat.
^d-boiling-stability

> [!derive] Derive Nusselt's mean heat transfer coefficient for laminar film condensation on a vertical plate, including the constant 0.943.
^d-nusselt

> [!derive] Derive the capillary limit of an inclined heat pipe with a uniform evaporator and condenser, including the effective length.
^d-capillary-limit

> [!derive] Show that if the vapor mass flux leaving a boiling surface at its critical heat flux depends only on $\rho_v$, $\sigma$ and the combination $g(\rho_l - \rho_v)$, the critical heat flux has the form $C\,h_{fg}\rho_v[\sigma g(\rho_l-\rho_v)/\rho_v^2]^{1/4}$.
^d-chf-form

> [!solution]- Solution
> methods: dimensional-analysis
> 1. Each kilogram of vapor leaving carries $h_{fg}$, so $q''_\text{max} = h_{fg}\,G_v$ with $G_v$ the vapor mass flux (kg/m²·s).
> 2. Four quantities, $G_v$, $\rho_v$ (kg/m³), $\sigma$ (kg/s²) and $G = g(\rho_l-\rho_v)$ (kg/m²·s²), in three base dimensions: one group ([pi theorem](gen-dimensions.md#^pi-theorem)).
> 3. $(\sigma G/\rho_v^2)^{1/4}$ has units $(\text{kg}^2\,\text{m}^{-2}\text{s}^{-4}\cdot\text{m}^6\,\text{kg}^{-2})^{1/4} = $ m/s, a velocity, so $G_v/[\rho_v(\sigma G/\rho_v^2)^{1/4}]$ is dimensionless.
> 4. The only group must be a constant $C$; multiply by $h_{fg}$.

## Problems

> [!problem] Chamber filled at room temperature (d 3)
> A rigid copper chamber is filled with water by syringe at 25 °C and 101.3 kPa without pumping the air out, then sealed; the vapor space is mostly air at that moment. It is then heated until everything inside is at 110 °C. Ignoring changes in the vapor-space volume and the air dissolved in the water, find the absolute pressure and the gauge pressure in psi. Compare with the same chamber properly evacuated before filling. Take $p_\text{sat} = 3.17$ kPa at 25 °C and 143.4 kPa at 110 °C.
^inv-th-ncg-chamber

> [!solution]- Solution
> methods: th-two-phase/ncg, th-two-phase/saturation
> 1. At filling the vapor space is at 101.3 kPa total, so the air's partial pressure is $101.3 - 3.17 = 98.2$ kPa.
> 2. Fixed volume and fixed moles of air: $p_\text{air} \propto T$, so at 383.15 K it is $98.2 \times 383.15/298.15 = 126.1$ kPa.
> 3. The water vapor is saturated at 110 °C: 143.4 kPa.
> 4. Total $269.5$ kPa absolute $= 39.1$ psia, so $24.4$ psig.
> 5. Evacuated: only the 143.4 kPa of vapor, $6.1$ psig. The air quadruples the gauge pressure, and in operation it also sits at the condenser and blocks it.

> [!problem] Flux-heated plate in a pool (d 4)
> A thin electrically heated plate in saturated water has the model boiling curve: $q'' = 140\,\Delta T_e^3$ (W/m², $\Delta T_e$ in K) up to $q''_\text{max} = 1.1$ MW/m²; then a straight line down to $(120\ \text{K},\ 30\ \text{kW/m}^2)$; then $q'' = 250\,\Delta T_e$. The heater imposes $0.6$ MW/m². Find every steady $\Delta T_e$, say which are stable, and find where the plate goes if the input is raised to just above $q''_\text{max}$. Copper melts at 1085 °C.
^inv-th-boiling-heater

> [!solution]- Solution
> methods: th-two-phase/boiling-stability
> 1. End of the nucleate branch: $\Delta T_c = (1.1\times10^6/140)^{1/3} = 19.9$ K.
> 2. Nucleate root: $(0.6\times10^6/140)^{1/3} = 16.2$ K. Slope positive: stable.
> 3. Transition root: $19.9 + \frac{1.1 - 0.6}{1.1 - 0.03}(120 - 19.9) = 66.7$ K. Slope negative: unstable.
> 4. Film root: $0.6\times10^6/250 = 2400$ K. Slope positive, so stable in the model, but far above melting.
> 5. Just above $q''_\text{max}$ only the film branch has a root, at $1.1\times10^6/250 = 4400$ K: the plate heats until it melts (burnout).

> [!problem] Steam on a cold wall (d 3)
> Saturated steam at 1 atm condenses on a vertical plate 0.2 m high and 0.5 m wide held at 80 °C. Find the mean heat transfer coefficient, the heat rate, the condensate flow and the film Reynolds number, and say whether the laminar wave-free assumption holds. Liquid at 90 °C: $\rho_l = 965.3$ kg/m³, $\mu_l = 3.15\times10^{-4}$ Pa·s, $k_l = 0.675$ W/m·K, $c_{p,l} = 4206$ J/kg·K. Vapor: $\rho_v = 0.598$ kg/m³, $h_{fg} = 2256.4$ kJ/kg. Take $T_\text{sat} = 100$ °C.
^inv-th-condensing-plate

> [!solution]- Solution
> methods: th-two-phase/film-condensation
> 1. $h'_{fg} = 2256.4 + 0.68\times4.206\times20 = 2313.6$ kJ/kg.
> 2. $\bar h = 0.943\,[9.81\times965.3\times964.7\times0.675^3\times2.3136\times10^6/(3.15\times10^{-4}\times20\times0.2)]^{1/4} = 7.99$ kW/m²·K.
> 3. $Q = \bar h\,(0.2\times0.5)\times20 = 16.0$ kW.
> 4. $\dot m = Q/h'_{fg} = 6.91$ g/s.
> 5. $\text{Re}_\delta = 4\dot m/(w\mu_l) = 4\times6.91\times10^{-3}/(0.5\times3.15\times10^{-4}) = 175$: above 30, so the film is wavy and the true $\bar h$ is somewhat higher; laminar, so the model is still the right order. Film thickness at the bottom: 0.11 mm.

> [!problem] Tilted heat pipe (d 4)
> A 6 mm copper heat pipe with water at 60 °C has a sintered wick of $r_\text{eff} = 50$ µm, $K = 4\times10^{-11}$ m², filling the annulus between radii 2.2 and 2.7 mm. $L_e = 40$ mm, $L_a = 100$ mm, $L_c = 60$ mm, contact angle 0. Water at 60 °C: $\rho_l = 983.3$ kg/m³, $\sigma = 0.0662$ N/m, $\mu_l = 4.67\times10^{-4}$ Pa·s, $h_{fg} = 2357.7$ kJ/kg. Neglecting the vapor pressure drop, find the capillary limit horizontal, with the evaporator 30° above horizontal, and with it straight above the condenser.
^inv-th-heat-pipe-tilt

> [!solution]- Solution
> methods: th-two-phase/capillary-limit
> 1. $M = 983.3\times0.0662\times2.3577\times10^6/4.67\times10^{-4} = 3.29\times10^{11}$ W/m².
> 2. $A_w = \pi(2.7^2 - 2.2^2) = 7.70$ mm²; $L_\text{eff} = 100 + 50 = 150$ mm.
> 3. Horizontal: $Q = 3.29\times10^{11}\times(4\times10^{-11}\times7.70\times10^{-6}/0.15)\times(2/50\times10^{-6}) = 27.0$ W.
> 4. Lift factor: $\rho_l g L_t r_\text{eff}/(2\sigma) = 983.3\times9.81\times0.2\times50\times10^{-6}/0.1324 = 0.729$.
> 5. At 30°: $27.0\times(1 - 0.729\times0.5) = 17.2$ W. Vertical, evaporator up: $27.0\times0.271 = 7.3$ W.

> [!problem] Vapor gap in a flat chamber (d 5)
> A water vapor chamber has a vapor gap of 0.5 mm. Compare the in-plane effective conductivity of the vapor core at 60 °C and at 25 °C, and find the gap at which the core only matches a copper sheet of the same thickness ($k = 400$ W/m·K) at each temperature. Check the laminar assumption for 100 W crossing a 50 mm wide section. Vapor: at 60 °C $\rho_v = 0.1304$ kg/m³, $\mu_v = 1.08\times10^{-5}$ Pa·s, $h_{fg} = 2357.7$ kJ/kg; at 25 °C $\rho_v = 0.02307$ kg/m³, $\mu_v = 0.987\times10^{-5}$ Pa·s, $h_{fg} = 2441.7$ kJ/kg.
^inv-th-vapor-gap

> [!solution]- Solution
> methods: th-two-phase/vapor-keff, th-two-phase/sat-slope
> 1. At 60 °C: $k_\text{eff} = 0.1304^2\times(2.3577\times10^6)^2\times(5\times10^{-4})^2/(12\times1.08\times10^{-5}\times333.15) = 5.5\times10^5$ W/m·K.
> 2. At 25 °C: $2.2\times10^4$ W/m·K, 24 times lower, almost all from $\rho_v^2$.
> 3. Matching copper: $h = \sqrt{12\mu_v T k}/(\rho_v h_{fg})$: 13.5 µm at 60 °C, 67 µm at 25 °C.
> 4. Flow check: $\dot m = 100/h_{fg}$; mean velocity $\dot m/(\rho_v w h)$ is 13 m/s at 60 °C and 71 m/s at 25 °C; $\text{Re} = \rho_v\bar u h/\mu_v \approx 80$ in both cases (the product $\rho_v \bar u$ is fixed by $\dot m$), so laminar. At 71 m/s the Mach number is about 0.17 and the entrance length about 2 mm, so the estimate is fair but optimistic at 25 °C.
