---
study: basic
id: th-electronics-cooling
title: Electronics cooling and thermal test
area: th
needs: [th-conduction, th-convection, th-transient]
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [thermal resistance](th-conduction.md#^resistance), [contact resistance](th-conduction.md#^contact), [spreading resistance](th-conduction.md#^spreading) and [fin efficiency](th-conduction.md#^fin-efficiency) from th-conduction; [internal flow](th-convection.md#^internal) and [effectiveness–NTU](th-convection.md#^ntu) from th-convection; the [semi-infinite solid](th-transient.md#^semi-infinite) and [RC networks](th-transient.md#^rc-networks) from th-transient. ^needs

A chip's limit is its junction temperature, and everything between the junction and the coolant is a chain of resistances someone has to measure. This doc covers the metrics a datasheet uses, the parts of the chain (interface materials, heat sinks, cold plates), and the transient test that measures the chain from the junction outward. Where a definition belongs to a standard it says which; where the field only has a habit, it says so. Clause numbers are not quoted from memory: check the document before citing one. ^intro

## Junction metrics

> [!def] Junction temperature and thermal resistance
> The **junction temperature** $T_J$ is the temperature of the die's active layer; in practice it is what an on-die sensor reads, a **temperature-sensitive parameter** (TSP) calibrated against temperature. For a device dissipating total power $P$, the thermal resistance from $X$ to $Y$ is $\theta_{XY} = (T_X - T_Y)/P$. It is a true resistance of a path only when all of $P$ flows from $X$ to $Y$.
^junction-def

The common metrics, and where each is defined. All but the last row come from the JEDEC JESD51 family. ^junction-metrics

| metric | definition | environment | defined in |
|---|---|---|---|
| $\theta_{JA}$ | $(T_J - T_A)/P$ | device on a standard test board in a still-air enclosure | environment JESD51-2A; boards JESD51-3 (low effective conductivity) and JESD51-7 (high effective conductivity); moving air JESD51-6 |
| $\theta_{JB}$ | $(T_J - T_B)/P$ | board clamped in a ring cold plate so the heat goes into the board | JESD51-8 |
| $\theta_{JC}$ | $(T_J - T_C)/P$ | heat forced out through one case surface into a cold plate | JESD51-14 (transient dual interface method) |
| $\Psi_{JT}$ | $(T_J - T_T)/P$, $T_T$ at the top centre of the package | the $\theta_{JA}$ environment; most heat does not go through the top | the JESD51 environment documents (check which clause) |
| $\Psi_{JB}$ | $(T_J - T_B)/P$, $T_B$ on the board next to the package | the $\theta_{JA}$ environment | the JESD51 environment documents (check which clause) |
| $R_{th(j\text{-}c)}$, $Z_{th(j\text{-}c)}$ | junction to case, steady and transient | power semiconductors on a heat sink | IEC 60747 series (check the part) |
^metrics-table

Three rules follow. $\theta_{JA}$ belongs to the package, the board and the air together, so a datasheet value only compares packages in the standard setting; it does not predict a system. $\Psi$ parameters are not resistances: they let one infer $T_J = T_T + \Psi_{JT}P$ from a measured top temperature in a setting close to the one they were measured in. $\theta_{JC}$ is the right number when nearly all the heat leaves through that case surface, as with a lidded processor under a cold plate. Older $\theta_{JC}$ values were often measured with a thermocouple in the case surface (for example under MIL-STD-883 method 1012; check), which under-reads the case and gives different numbers from the transient method; a datasheet that does not say how it measured $\theta_{JC}$ has not told you what it means. ^metrics-rules

**Specific (area) resistance**, $R'' = R\cdot A$ in K·cm²/W or K·mm²/W, is the convention for interfaces and layers, because it does not depend on the part's size. Which area (die, heater, lid, contact) is a convention, not a standard: always state it. ^specific-resistance

> [!thm] Theorem 1 (two-path package)
> A package at power $P$ loses heat through the top, junction $\xrightarrow{\theta_1}$ top $\xrightarrow{\theta_2}$ ambient, and through the board, junction $\xrightarrow{\theta_3}$ board $\xrightarrow{\theta_4}$ ambient. Then the fraction leaving through the top is $f = (\theta_3+\theta_4)/(\theta_1+\theta_2+\theta_3+\theta_4)$, and
> $$\Psi_{JT} = f\,\theta_1 \le \theta_1, \qquad \theta_{JA} = \frac{(\theta_1+\theta_2)(\theta_3+\theta_4)}{\theta_1+\theta_2+\theta_3+\theta_4}.$$
^psi-two-path

> [!proof]- Proof (d 2)
> 1. Both paths run between the same two temperatures $T_J$ and $T_A$, so the top path carries $(T_J - T_A)/(\theta_1+\theta_2)$ and the board path $(T_J - T_A)/(\theta_3+\theta_4)$.
> 2. Their sum is $P$, so $T_J - T_A = P\,\theta_{JA}$ with $\theta_{JA}$ the parallel combination stated.
> 3. Divide the top path's flow by $P$ to get $f$.
> 4. The top-centre temperature sits one resistance $\theta_1$ below the junction on a path carrying $fP$: $T_J - T_T = fP\theta_1$.
^p-psi-two-path

> [!example] The same package with and without a heat sink
> A package has $\theta_1 = 0.4$ K/W (junction to top), $\theta_3 = 5$ K/W (junction to board), $\theta_4 = 15$ K/W (board to air). Bare, the top sees the air through $\theta_2 = 20$ K/W; with a heat sink, $\theta_2 = 1$ K/W. Find $f$, $\Psi_{JT}$ and $\theta_{JA}$ for both.
^ex-psi

> [!solution]- Solution
> methods: resistance-network
> 1. Bare: $f = 20/40.4 = 0.495$, $\Psi_{JT} = 0.198$ K/W, $\theta_{JA} = 20.4\times20/40.4 = 10.1$ K/W.
> 2. Sink: $f = 20/21.4 = 0.935$, $\Psi_{JT} = 0.374$ K/W, $\theta_{JA} = 1.31$ K/W.
> 3. $\Psi_{JT}$ nearly doubles when the environment changes. A $\Psi_{JT}$ measured bare, applied to the heat-sunk part, would under-predict $T_J - T_T$ by half.

## Thermal interface materials

> [!def] Thermal interface material
> A **thermal interface material** (TIM) fills the gap between two nominally flat solid surfaces, which otherwise touch only at asperities with air between (see [contact resistance](th-conduction.md#^contact)). Its specific resistance in place is
> $$R''_\text{TIM} = \frac{\text{BLT}}{k_\text{TIM}} + R''_{c1} + R''_{c2},$$
> where BLT is the **bond line thickness** and $R''_{c1}, R''_{c2}$ are its contact resistances to each surface.
^tim

By convention TIM1 sits between the die and a lid (integrated heat spreader), TIM2 between the lid and the heat sink or cold plate, and TIM0 or "direct die" between a bare die and the sink. The families, from thin to thick: solder TIMs (indium and its alloys, reflowed), liquid metals (gallium alloys; they attack aluminium), greases and pastes, phase-change pads, gels, and compliant gap pads. Thin layers win on resistance; thick, soft ones absorb flatness and height variation. Greases fail by **pump-out** (power cycling flexes the gap and pushes material out) and by drying; solder fails by voiding and fatigue cracking. Order of magnitude in place: a few mm²·K/W for solder, roughly 5 to 30 mm²·K/W for greases at their working BLT (check the data for a specific product). ^tim-families

ASTM D5470 measures thermal interface resistance in steady state: the specimen sits between two metered bars carrying a known heat flow, measured from the temperature gradient along each bar, and the surface temperatures are extrapolated from those gradients. Measured at several thicknesses, $R''$ against thickness is a line: the slope is $1/k$ of the bulk material, the intercept the total contact resistance. A datasheet's "thermal conductivity" is that slope, and says nothing about the intercept. ^d5470

> [!trap] Bulk conductivity as the whole story
> A paste with $k = 3$ W/m·K at a 30 µm bond line has $\text{BLT}/k = 10$ mm²·K/W. If its contact resistances total 5 mm²·K/W, a third of the joint is contact, which the conductivity on the datasheet does not show; a paste with twice the $k$ but twice the contact resistance is no better at this BLT.
^trap-bulk-k

> [!example] A lidded package's two interfaces
> A 300 W die is 20 × 20 mm; TIM1 between die and lid has $R'' = 0.08$ K·cm²/W over the die. The lid is 40 × 40 mm; TIM2 between lid and cold plate has $R'' = 0.15$ K·cm²/W over the lid. Find each layer's temperature drop, assuming the heat crosses TIM2 uniformly over the lid.
^ex-tim-stack

> [!solution]- Solution
> methods: resistance-network, th-electronics-cooling/specific-resistance
> 1. TIM1: $R = 0.08/4 = 0.020$ K/W, drop $300\times0.020 = 6.0$ K.
> 2. TIM2: $R = 0.15/16 = 0.0094$ K/W, drop $2.8$ K.
> 3. TIM2 has the worse material and the smaller drop: the lid spreads the heat over four times the area first. The uniform-flux assumption flatters TIM2; the lid's [spreading resistance](th-conduction.md#^spreading) concentrates flux over the die.

## Heat sinks

A **heat sink** moves heat from a base into air through fins. Its resistance from base to inlet air is the sum of conduction and [spreading](th-conduction.md#^spreading) in the base and the fin array's convection. The array is summarised by its **overall surface efficiency** $\eta_o = 1 - (A_f/A)(1 - \eta_f)$, with $A_f$ the fin area, $A$ the total wetted area and $\eta_f$ the [fin efficiency](th-conduction.md#^fin-efficiency); the array then behaves as a surface of conductance $\eta_o h A$. ^heat-sink

> [!thm] Theorem 2 (base-to-inlet resistance)
> A heat sink whose wetted surface is at a uniform temperature $T_b$, cooled by a stream of capacity rate $\dot m c_p$ entering at $T_\text{in}$, has
> $$R_{b\text{-}in} = \frac{T_b - T_\text{in}}{Q} = \frac{1}{\dot m c_p\,(1 - e^{-\text{NTU}})},\qquad \text{NTU} = \frac{\eta_o h A}{\dot m c_p},$$
> and $R_{b\text{-}in} \ge \max\left(1/(\eta_o hA),\ 1/(\dot m c_p)\right)$.
^sink-inlet

> [!proof]- Proof
> 1. A stream along a wall at uniform temperature leaves at $T_\text{out} = T_b - (T_b - T_\text{in})e^{-\text{NTU}}$ ([effectiveness–NTU](th-convection.md#^ntu)).
> 2. The heat it picks up is $Q = \dot m c_p(T_\text{out} - T_\text{in}) = \dot m c_p(1 - e^{-\text{NTU}})(T_b - T_\text{in})$; divide.
> 3. Since $1 - e^{-x} \le 1$ and $1 - e^{-x} \le x$, $R_{b\text{-}in} \ge 1/(\dot m c_p)$ and $R_{b\text{-}in} \ge 1/(\eta_o hA)$.
^p-sink-inlet

$1/(\dot m c_p)$ is the **caloric resistance**: no amount of fin area beats it, because the air cannot leave hotter than the base. Below an NTU of about 1 the sink is limited by area and $h$; above about 2, by flow. ^caloric

A fan delivers the flow where its pressure–flow curve meets the **system curve** of the sink and duct, $\Delta p \propto \dot V^n$: $n \approx 2$ where form and turbulent losses dominate, $n \approx 1$ for fully developed laminar flow between fins. More fins add area and $h$ but raise the system curve and cut the flow, so at a fixed fan there is a best fin count. In natural convection the best spacing is where the boundary layers of facing fins just meet at the top of the channel. ^fan-system

## Cold plates

A **cold plate** carries liquid through channels in a metal plate pressed against the heat source. Its resistance from the contact face to the coolant inlet has the same parts as a heat sink: conduction and spreading in the base, $1/(\eta_o h A_w)$ for the channel walls as fins, and the caloric term, combined as in Theorem 2. Vendors quote cold-plate resistance against the inlet temperature or against the mean of inlet and outlet; neither is standardised, and the two differ by exactly $1/(2\dot m c_p)$, so ask. ^cold-plate

In laminar, fully developed channel flow the Nusselt number is a constant set by the channel shape and the heating condition ([internal flow](th-convection.md#^internal)), so $h = \text{Nu}\,k/D_h$ rises as the hydraulic diameter $D_h$ falls: the reason for microchannels. The price is pressure drop. With the Fanning friction factor, $\Delta p = 4f(L/D_h)\,\rho\bar u^2/2 = 2(f\text{Re})\,\mu\bar u L/D_h^2$, with $f\text{Re}$ another shape constant, and pumping power $\Delta p\,\dot V$. A thermally developing flow, one shorter than about $0.05\,\text{Re}\Pr D_h$, has a higher mean Nusselt number than the fully developed value, so short channels do better than the constant suggests. ^cold-plate-channels

Practical constraints decide as much as the thermal numbers: water has the highest $c_p$ and $k$ of practical coolants, and glycol mixtures trade both for freeze protection; copper and aluminium in one loop corrode galvanically; microchannels clog without filtration; two-phase cold plates (pumped refrigerant or dielectric fluid) hold the surface near saturation and are limited by [critical heat flux](th-two-phase.md#^chf). ^cold-plate-practice

## Test vehicles and the junction thermometer

> [!def] Thermal test vehicle
> A **thermal test vehicle** (TTV) replaces the product die with one built for measurement: heater resistors laid out in cells so a known power map (uniform, or a hot spot) can be applied, and temperature sensors (diodes or resistors) spread across it. It exists because product silicon cannot be run at a controlled, known power map. JEDEC publishes a thermal test chip guideline (JESD51-4; check the current revision).
^test-vehicle

The usual TSP is the forward voltage $V_F$ of a p-n junction at a fixed small sense current, small enough that its own dissipation is negligible. It is calibrated by holding the device at several known temperatures (oven or stirred bath) with no other power applied. The slope is the **K-factor**; JESD51-1, the electrical test method, uses it as temperature per voltage, while many labs quote mV/K: write the units every time. ^k-factor

> [!thm] Theorem 3 (diode temperature coefficient)
> If the saturation current varies as $I_s = C\,T^\eta e^{-qV_{g0}/(kT)}$, then at a fixed forward current $I \gg I_s$
> $$\left.\frac{dV_F}{dT}\right|_I = \frac{V_F - V_{g0}}{T} - \frac{\eta k}{q}.$$
^diode-tc

> [!proof]- Proof (d 3.5)
> 1. In forward bias well above $kT/q$, $I = I_s e^{qV_F/(kT)}$, so $V_F = (kT/q)\ln(I/I_s)$.
> 2. Substitute $I_s$: $V_F = V_{g0} + (kT/q)\left[\ln(I/C) - \eta\ln T\right]$.
> 3. Differentiate at fixed $I$: $dV_F/dT = (k/q)\left[\ln(I/C) - \eta\ln T\right] - \eta k/q$.
> 4. By step 2 the first term is $(V_F - V_{g0})/T$.
^p-diode-tc

For silicon, $V_{g0} \approx 1.17$ to $1.21$ V depending on the model, and $\eta \approx 3$. At $V_F = 0.65$ V and 300 K the coefficient is $-1.99$ mV/K with 1.17 V and $-2.11$ mV/K with 1.205 V: about $-2$ mV/K, nearly constant over the working range, which is why the diode is calibrated with two or three points and a line. ^diode-numbers

## Transient thermal test

> [!def] Thermal impedance
> Apply a power step $\Delta P$ at $t = 0$ to a device in thermal equilibrium. Its **thermal impedance** is $Z_{th}(t) = [T_J(t) - T_J(0)]/\Delta P$. With constant properties and boundary conditions the system is linear and time invariant, $Z_{th}$ is its step response, and $Z_{th}(\infty)$ is the steady resistance to wherever the heat goes.
^transient-test

The electrical test method (JESD51-1) heats the device with a heating current, then switches to the sense current and records the TSP as the device cools. Cooling is recorded because during heating the TSP voltage is mixed with the heating current's drop. ^etm

> [!thm] Theorem 4 (cooling curve)
> If the device has been at constant power $P$ long enough to reach steady state and the power is cut to zero at $t = 0$, then $T_J(t) - T_\text{ref} = P\,[Z_{th}(\infty) - Z_{th}(t)]$.
^cooling-curve

> [!proof]- Proof
> 1. The input is a step $+P$ applied long ago plus a step $-P$ at $t = 0$.
> 2. By linearity the response is the sum of the two step responses: $P Z_{th}(\infty) - P Z_{th}(t)$.
^p-cooling-curve

The first tens of microseconds after switching are lost to the electrical transient. At those times the heat has not left the die's surface region, so the die acts as a [semi-infinite solid](th-transient.md#^semi-infinite) under a surface flux and the temperature change goes as $\sqrt t$. Fitting $T_J$ against $\sqrt t$ over a window just after the disturbance and extrapolating to $t = 0$ recovers the lost start. ^sqrt-t

**The transient dual interface method** (JESD51-14) measures $\theta_{JC}$ for a device whose heat leaves through one case surface. $Z_{th}$ is measured twice with the case pressed to a cold plate, once with a poor interface (dry, or a thin oil film) and once with a good one (thermal grease). While the heat is inside the package the two curves coincide; once it reaches the case surface they separate, and $\theta_{JC}$ is read at the separation. The standard defines the separation criterion and gives a second evaluation through structure functions (check its threshold definitions before using them). ^tdim

## Structure functions

> [!def] Foster and Cauer networks
> A **Foster** network is a chain of parallel RC pairs in series: $Z_{th}(t) = \sum_i R_i\,(1 - e^{-t/\tau_i})$ with $\tau_i = R_iC_i$. It fits any measured curve but its internal nodes are not places in the device. A **Cauer** ladder has series resistances from the junction outward with a capacitance from each node to the reference: a discretised one-dimensional conduction path ([RC networks](th-transient.md#^rc-networks)), whose nodes are places. Both describe the same driving-point impedance, and each converts uniquely to the other through the impedance's partial-fraction and continued-fraction expansions.
^foster-cauer

> [!thm] Theorem 5 (time-constant spectrum)
> Let $z = \ln t$ and $\zeta_i = \ln\tau_i$. Then
> $$\frac{dZ_{th}}{dz} = \sum_i R_i\, w(z - \zeta_i),\qquad w(u) = \exp(u - e^u).$$
> The derivative of $Z_{th}$ against log time is the spectrum of time constants blurred by the fixed kernel $w$.
^tc-spectrum

> [!proof]- Proof (d 3)
> 1. Differentiate the Foster sum: $dZ_{th}/dt = \sum_i (R_i/\tau_i)\,e^{-t/\tau_i}$.
> 2. Change variable: $dZ_{th}/dz = t\,dZ_{th}/dt = \sum_i R_i\,(t/\tau_i)\,e^{-t/\tau_i}$.
> 3. With $t/\tau_i = e^{z - \zeta_i}$, each term is $R_i\exp\left((z-\zeta_i) - e^{z-\zeta_i}\right) = R_i\,w(z-\zeta_i)$.
^p-tc-spectrum

The kernel's full width at half maximum is 2.45 in $\ln t$, a factor of about 12 in time. Recovering the spectrum is a deconvolution by $w$, which amplifies noise, so time constants closer than about that factor are hard to separate, and the measured curve's noise sets the resolution. ^tc-resolution

> [!def] Structure function
> Convert the time-constant spectrum to a Cauer ladder and accumulate from the junction: the **cumulative structure function** plots the summed capacitance $C_\Sigma$ against the summed resistance $R_\Sigma$. The **differential structure function** is $K = dC_\Sigma/dR_\Sigma$. The curve ends where the capacitance becomes unbounded, the ambient or coolant; the $R_\Sigma$ there is $Z_{th}(\infty)$.
^structure-function

> [!thm] Theorem 6 (what the differential structure function measures)
> Along a heat path that is one-dimensional in a coordinate $x$, through material of conductivity $k$, density $\rho$ and specific heat $c$, with cross-section $A(x)$,
> $$K = \frac{dC_\Sigma}{dR_\Sigma} = c\rho k\,A(x)^2.$$
^sf-area

> [!proof]- Proof (d 2)
> 1. A slice of thickness $dx$ adds resistance $dR_\Sigma = dx/(kA)$.
> 2. The same slice adds capacitance $dC_\Sigma = \rho c A\,dx$.
> 3. Divide.
^p-sf-area

Read a structure function from the junction outward. A flat stretch (small $K$) is a layer that adds resistance with little capacitance: die attach, a TIM, a thin bond. A steep stretch is a large, high-capacity part: a lid, a spreader, a cold plate. $K$ rising with $R_\Sigma$ inside one material shows the heat spreading into a growing cross-section. Two structure functions of the same device, before and after a change (a different interface, a power-cycling test that cracks the die attach), coincide up to the changed layer and separate there; that separation locates the change in K/W. ^sf-reading

> [!example] A two-node ladder in both forms
> A Cauer ladder has $C_1 = 0.01$ J/K at the junction, $R_1 = 0.5$ K/W to a second node with $C_2 = 1$ J/K, and $R_2 = 1$ K/W from there to the coolant. Find its Foster form, $Z_{th}$ at 5 ms, 50 ms and 1 s, and its cumulative structure function.
^ex-cauer-foster

> [!solution]- Solution
> methods: th-electronics-cooling/foster-cauer, th-transient/rc-networks
> 1. Driving-point impedance: $Z(s) = \dfrac{R_1 + R_2/(1+sC_2R_2)}{1 + sC_1\left(R_1 + R_2/(1+sC_2R_2)\right)} = \dfrac{0.5s + 1.5}{0.005s^2 + 1.015s + 1}$.
> 2. Poles at the roots of $0.005s^2 + 1.015s + 1 = 0$: $s = -0.990$ and $s = -202.0$ per second, so $\tau = 1.010$ s and $4.95$ ms.
> 3. Residues give the Foster resistances: $R = 1.010$ K/W at 1.010 s and $0.490$ K/W at 4.95 ms; they sum to 1.5 K/W, as they must.
> 4. $Z_{th}(t) = 0.490(1 - e^{-t/0.00495}) + 1.010(1 - e^{-t/1.010})$: 0.317, 0.539 and 1.125 K/W at 5 ms, 50 ms and 1 s.
> 5. Cumulative structure function: $C_\Sigma = 0.01$ J/K over $0 \le R_\Sigma < 0.5$, then $1.01$ J/K over $0.5 \le R_\Sigma < 1.5$, then unbounded at $R_\Sigma = 1.5$ K/W. Note that neither Foster pair is either Cauer stage.

## Derive

> [!derive] Show that in the two-path package $\Psi_{JT} \le \theta_1$, the junction-to-top resistance, and find when equality holds.
^d-psi

> [!derive] Derive the base-to-inlet resistance of a heat sink with a uniform surface temperature, and show it is never below the caloric resistance.
^d-sink-inlet

> [!derive] Derive the temperature coefficient of a diode's forward voltage at constant current, given how its saturation current depends on temperature.
^d-diode

> [!derive] Prove that the cooling curve after long heating is the complement of the heating step response.
^d-cooling-curve

> [!derive] Prove that the differential structure function of a one-dimensional heat path equals $c\rho k A^2$.
^d-sf-area

> [!derive] Show that the fin spacing which maximises heat transfer from an isothermal vertical array of parallel plates in natural convection scales as $L\,\text{Ra}_L^{-1/4}$, with $L$ the plate height.
^d-fin-spacing

> [!solution]- Solution
> methods: scaling, th-convection/bl-scaling
> 1. A laminar natural-convection boundary layer on a plate of height $L$ has thickness $\delta \sim L\,\text{Ra}_L^{-1/4}$ ([boundary-layer scaling](th-convection.md#^bl-scaling)).
> 2. If the spacing $S \gg \delta$, the layers do not interact; each plate behaves alone, and adding plates (smaller $S$) adds area at no cost per plate.
> 3. If $S \ll \delta$, the channel is fully developed and the flow is choked by viscosity; heat per plate falls steeply with $S$, faster than the plate count grows.
> 4. The total is therefore largest where the regimes meet, $S \sim \delta(L) \sim L\,\text{Ra}_L^{-1/4}$. Bar-Cohen and Rohsenow's constant is about 2.7 (check before quoting).

## Problems

> [!problem] Interface material on a meter bar (d 3)
> Four samples of one paste are measured on a steady meter-bar rig at bond lines of 50, 100, 150 and 200 µm, giving 21.9, 38.0, 55.3 and 71.5 mm²·K/W. Find the paste's bulk conductivity, the total contact resistance and their standard uncertainties, and the specific resistance and contact share at a 30 µm bond line.
^inv-th-tim-fit

> [!solution]- Solution
> methods: th-electronics-cooling/tim, pd-measurement/propagation
> 1. Least-squares line of $R''$ (mm²·K/W) on BLT (µm): slope $0.3322$, intercept $5.15$.
> 2. The slope in (mm²·K/W)/µm equals m·K/W, so $k = 1/0.3322 = 3.01$ W/m·K.
> 3. Residuals $0.14, -0.37, 0.32, -0.09$; $s = 0.365$ with 2 degrees of freedom; $u(\text{slope}) = s/\sqrt{\sum(t-\bar t)^2} = 0.0033$, so $u(k) = u(\text{slope})/\text{slope}^2 = 0.03$ W/m·K; $u(\text{intercept}) = 0.45$ mm²·K/W.
> 4. At 30 µm: $5.15 + 0.3322\times30 = 15.1$ mm²·K/W, of which contact is $5.15/15.1 = 34\ \%$.

> [!problem] Fan on a finned sink (d 3.5)
> A fan's curve is $\Delta p = 60\ \text{Pa}\,(1 - \dot V/10\ \text{L/s})$; the sink and duct have $\Delta p = 4\times10^5\,\dot V^2$ (Pa, with $\dot V$ in m³/s). The sink has $A = 0.25$ m² of wetted area, $\eta_o = 0.85$, and $h = 30\ \text{W/m}^2\text{K}\,(\dot V/5\ \text{L/s})^{0.8}$. Air: $\rho = 1.16$ kg/m³, $c_p = 1007$ J/kg·K, entering at 35 °C. A 150 W device has $\theta_{JC} = 0.10$ K/W and a TIM of 0.05 K/W to the sink base. Find the flow, the base-to-inlet resistance and $T_J$. Treat the base as isothermal.
^inv-th-fan-sink

> [!solution]- Solution
> methods: resistance-network, th-electronics-cooling/sink-inlet
> 1. Operating point: $4\times10^5\dot V^2 + 6000\dot V - 60 = 0$, so $\dot V = 6.86$ L/s at $\Delta p = 18.8$ Pa.
> 2. $h = 30\times(6.86/5)^{0.8} = 38.6$ W/m²·K; $\eta_o hA = 8.21$ W/K.
> 3. $\dot m c_p = 1.16\times6.86\times10^{-3}\times1007 = 8.01$ W/K; NTU $= 1.02$.
> 4. $R_{b\text{-}in} = 1/(8.01\times(1 - e^{-1.02})) = 0.195$ K/W, against 0.122 for $1/\eta_o hA$ alone and 0.125 for the caloric term alone.
> 5. $T_J = 35 + 150\times(0.10 + 0.05 + 0.195) = 86.7$ °C.

> [!problem] Microchannel cold plate (d 4.5)
> A copper cold plate (k = 390 W/m·K) over a 30 × 30 mm source has 60 channels, each 0.3 mm wide and 1.5 mm deep, separated by 0.2 mm walls, 30 mm long, under a 1 mm base, with a lid on top. Water at 25 °C flows at 1.0 L/min total: $\rho = 997$ kg/m³, $c_p = 4180$ J/kg·K, $\mu = 0.89\times10^{-3}$ Pa·s, $k = 0.607$ W/m·K. For this channel shape take the fully developed values $\text{Nu} = 5.7$ and $f\text{Re} = 19.1$ (Fanning). Count the channel floors and side walls as wetted, ignore the lid's inner face, and treat each wall as a fin with an insulated tip. Find the base-to-inlet resistance including the base, the source temperature rise at 300 W, the water's temperature rise, the pressure drop and the pumping power. Say whether the fully developed values are conservative here.
^inv-th-microchannel

> [!solution]- Solution
> methods: th-electronics-cooling/sink-inlet, th-conduction/fin-efficiency, th-convection/internal
> 1. Flow area $60\times0.3\times1.5 = 27$ mm², $\bar u = 0.617$ m/s; $D_h = 2ab/(a+b) = 0.5$ mm; $\text{Re} = 346$, laminar.
> 2. $h = 5.7\times0.607/0.0005 = 6.92$ kW/m²·K.
> 3. Walls: $m = \sqrt{2h/(k t_w)} = 421$ m⁻¹, $mb = 0.632$, $\eta_f = \tanh(mb)/(mb) = 0.885$.
> 4. Area: fins $60\times2\times1.5\times30 = 5400$ mm², floors $540$ mm², total 59.4 cm²; $\eta_o = 0.896$; $\eta_o hA = 36.8$ W/K.
> 5. $\dot m c_p = 69.5$ W/K; NTU $= 0.53$; $R_{b\text{-}in} = 1/(69.5\times(1-e^{-0.53})) = 0.0350$ K/W. Base: $0.001/(390\times9\times10^{-4}) = 0.0028$ K/W. Total 0.038 K/W.
> 6. At 300 W: source 11.4 K above the inlet; water rises $300/69.5 = 4.3$ K.
> 7. $\Delta p = 2(f\text{Re})\mu\bar u L/D_h^2 = 2.5$ kPa; pumping power $2.5\times10^3\times1.67\times10^{-5} = 0.042$ W.
> 8. Thermal entry length $0.05\,\text{Re}\Pr D_h = 53$ mm with $\Pr = 6.1$, longer than the 30 mm channel: the flow is thermally developing throughout, the mean Nu is higher than 5.7, and the estimate is conservative.

> [!problem] Diode reading after switch-off (d 4.5)
> A test die's sense diode reads 0.650 V at 25.0 °C and 0.530 V at 85.0 °C at the sense current, linear between. The die runs at 10.0 W to steady state on a cold plate at 25.0 °C; the power is cut at $t = 0$, and the first clean readings are 0.5480 V at 50 µs and 0.5520 V at 200 µs. Find the junction temperature at switch-off and the junction-to-cold-plate resistance. Then, treating the heat as entering the silicon uniformly over a heated area at its surface ($k = 148$ W/m·K, $\rho = 2330$ kg/m³, $c = 705$ J/kg·K), estimate that area, and check the model's validity at 200 µs.
^inv-th-diode-transient

> [!solution]- Solution
> methods: th-electronics-cooling/cooling-curve, semi-infinite-solid
> 1. Slope $-0.120/60 = -2.0$ mV/K: $T = 25 + (V - 0.650)/(-0.002)$, so 76.0 °C at 50 µs and 74.0 °C at 200 µs.
> 2. Early cooling follows $T_J(0) - b\sqrt t$. Since $\sqrt{200} = 2\sqrt{50}$, $T_J(0) = 2\times76.0 - 74.0 = 78.0$ °C.
> 3. Resistance: $(78.0 - 25.0)/10.0 = 5.3$ K/W.
> 4. $b = 2.0\ \text{K}\,/\,\big((\sqrt{200} - \sqrt{50})\times10^{-3}\ \text{s}^{1/2}\big) = 283$ K/s$^{1/2}$.
> 5. Semi-infinite surface under flux $P/A$: $b = 2P/(A\sqrt{\pi}\,e)$ with $e = \sqrt{k\rho c} = 1.56\times10^4$ W·s$^{1/2}$/m²·K, so $A = 2P/(\sqrt\pi\,e\,b) = 2.6$ mm².
> 6. Penetration depth $\sqrt{\alpha t}$ with $\alpha = 9.0\times10^{-5}$ m²/s is 0.13 mm at 200 µs, small against a heated patch about 1.6 mm across, so the one-dimensional semi-infinite model holds if the die is thicker than that.

> [!problem] Two-stage network from a measured curve (d 5)
> A measured thermal impedance is fitted by $Z_{th}(t) = 0.1984(1 - e^{-t/0.398\ \text{ms}}) + 0.8016(1 - e^{-t/0.4016\ \text{s}})$ K/W. Find the two-node Cauer ladder (junction capacitance, first resistance, second capacitance, last resistance) and its cumulative structure function. Which element is a thin layer and which a heavy one?
^inv-th-foster-to-cauer

> [!solution]- Solution
> methods: th-electronics-cooling/foster-cauer
> 1. $Z(s) = \dfrac{R_a}{1+s\tau_a} + \dfrac{R_b}{1+s\tau_b} = \dfrac{(R_a\tau_b + R_b\tau_a)s + (R_a+R_b)}{\tau_a\tau_b s^2 + (\tau_a+\tau_b)s + 1}$.
> 2. The admittance $1/Z$ grows like $sC_1$ as $s \to \infty$: $C_1 = \tau_a\tau_b/(R_a\tau_b + R_b\tau_a) = 2.0$ mJ/K.
> 3. Subtract $sC_1$ and invert; the remainder tends to $R_1$ as $s \to \infty$: $R_1 = (R_a\tau_b + R_b\tau_a)/(\tau_a + \tau_b - C_1(R_a+R_b)) = 0.200$ K/W.
> 4. What is left is $R_2/(1 + sC_2R_2)$ with $R_2 = R_a + R_b - R_1 = 0.800$ K/W and $C_2 = 0.500$ J/K.
> 5. Cumulative structure function: $C_\Sigma = 0.002$ J/K up to $R_\Sigma = 0.2$, then $0.502$ J/K up to 1.0 K/W, then unbounded. The first stage, 0.2 K/W with 2 mJ/K, is the thin, low-capacity layer near the junction; the second, with 250 times the capacitance, is the heavy part.
