---
study: basic
id: th-thermo
title: "Thermodynamics: the two laws and the cycles that use them"
area: th
needs: []
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: nothing beyond single-variable calculus. The heat-transfer basics ([conduction](th-conduction.md), [convection](th-convection.md)) say how fast heat moves; this one says how much energy moves and which directions are allowed.
^needs

## Systems, states and properties

> [!def] System, control volume, state
> A **closed system** is a fixed quantity of matter; its boundary may move but no mass crosses it. A **control volume** (CV) is a fixed region of space; mass crosses its boundary at inlets and outlets. A **property** is a quantity fixed by the state of the matter at an instant (temperature $T$, pressure $p$, specific volume $v$, specific internal energy $u$), not by how it got there. **Heat** $Q$ and **work** $W$ are not properties: they are energy crossing a boundary, heat because of a temperature difference, work by any other means (a moving piston, a turning shaft, an electric current).
^def-system

Sign convention for this doc: $Q$ is positive into the system, $W$ positive out of it. Rates carry a dot: $\dot Q$ in W, $\dot m$ in kg/s.
^signs

## The first law

> [!thm] Law 1 (first law)
> **Closed system** (a postulate, the summary of experiment): over any process, $\Delta E = Q - W$, where $E = m(u + \tfrac12 V^2 + g z)$ is the system's energy, $V$ its speed and $z$ its height.
> **Control volume** (a theorem): with inlets $i$ and outlets $e$,
> $$\frac{dE_{cv}}{dt} = \dot Q - \dot W_s + \sum_i \dot m_i\left(h_i + \tfrac12 V_i^2 + g z_i\right) - \sum_e \dot m_e\left(h_e + \tfrac12 V_e^2 + g z_e\right),$$
> where $\dot W_s$ is shaft and electrical work only and $h = u + p v$. At steady state with one inlet and one outlet this is the **steady-flow energy equation** $q - w_s = \Delta h + \Delta(\tfrac12 V^2) + g\,\Delta z$ per unit mass.
^first-law

> [!proof]- Proof of the control-volume form (d 3)
> 1. Over a short time $dt$, follow the closed system made of the matter inside the CV at $t$ plus the parcel $dm_i = \dot m_i\,dt$ about to enter at each inlet.
> 2. At $t + dt$ that same matter fills the CV plus the parcels $dm_e = \dot m_e\,dt$ that have left at each outlet, so $dE_{sys} = dE_{cv} + \sum_e e_e\,dm_e - \sum_i e_i\,dm_i$ with $e = u + \tfrac12 V^2 + g z$.
> 3. The fluid behind each inlet parcel pushes it across the boundary at pressure $p_i$, sweeping volume $v_i\,dm_i$: work $p_i v_i\,dm_i$ done on the system. Likewise the system does $p_e v_e\,dm_e$ on the fluid ahead of each outlet parcel.
> 4. The closed-system law over $dt$ reads $dE_{sys} = \delta Q - \delta W_s - \sum_e p_e v_e\,dm_e + \sum_i p_i v_i\,dm_i$.
> 5. Substitute step 2, collect $u + pv = h$ in each parcel term and divide by $dt$.
^p-first-law

> [!def] Enthalpy and specific heats
> **Enthalpy** $h = u + p v$ is the energy a flowing parcel carries across a boundary: its internal energy plus the flow work needed to push it in. The specific heats are $c_v = (\partial u/\partial T)_v$ and $c_p = (\partial h/\partial T)_p$. For an **ideal gas** ($p v = R T$, $R$ the gas constant per kg) $u$ and $h$ depend on $T$ alone and $c_p - c_v = R$. For an **incompressible** substance $c_p = c_v = c$ and $\Delta h = c\,\Delta T + v\,\Delta p$.
^enthalpy

The ideal-gas facts above rest on one experimental fact (Joule's free expansion: $u$ of a dilute gas does not change when it expands into vacuum, so $u = u(T)$); the identity $c_p - c_v = R$ is a derive prompt below.
^enthalpy-note

## The second law

> [!thm] Law 2 (second law, entropy statement)
> There is a property, **entropy** $S$, with $dS = \delta Q_{rev}/T$ along any reversible process, $T$ the absolute temperature. For any closed system and any process, $dS \ge \delta Q / T_b$, where $T_b$ is the temperature of the boundary where $\delta Q$ crosses. Equality holds exactly when the process is reversible.
^second-law

This is a postulate, equivalent to the older statements: no cyclic device turns heat from one reservoir entirely into work (Kelvin–Planck), and heat does not flow by itself from cold to hot (Clausius). A derive prompt below gets Kelvin–Planck from it. A **reservoir** is a body so large that heat in or out leaves its temperature unchanged. A **reversible** process is one that can be run backwards leaving no change anywhere; friction, heat flow across a finite temperature difference, unrestrained expansion and mixing are the usual reasons a real one cannot.
^second-law-note

> [!thm] Theorem 2 (entropy balance and entropy generation)
> For a control volume with heat $\dot Q_k$ crossing its boundary where the temperature is $T_k$,
> $$\frac{dS_{cv}}{dt} = \sum_k \frac{\dot Q_k}{T_k} + \sum_i \dot m_i s_i - \sum_e \dot m_e s_e + \dot S_{gen}, \qquad \dot S_{gen} \ge 0,$$
> with $\dot S_{gen} = 0$ exactly for a reversible process. $\dot S_{gen}$ (W/K) is the **entropy generation rate**.
^entropy-gen

> [!proof]- Proof
> 1. Write Law 2 for a closed system as an equality by naming the excess: $dS = \delta Q/T_b + \delta S_{gen}$, $\delta S_{gen} \ge 0$.
> 2. Follow the same closed system as in the proof of Law 1: $dS_{sys} = dS_{cv} + \sum_e s_e\,dm_e - \sum_i s_i\,dm_i$.
> 3. Flow work carries no entropy (work is not heat), so only $\delta Q_k / T_k$ and $\delta S_{gen}$ appear on the right. Substitute and divide by $dt$.
^p-entropy-gen

> [!thm] Theorem 3 (Gibbs relations)
> Between equilibrium states of a simple compressible substance, $T\,ds = du + p\,dv = dh - v\,dp$. Consequences: an ideal gas with constant $c_p$ has $s_2 - s_1 = c_p \ln(T_2/T_1) - R \ln(p_2/p_1)$; an incompressible substance has $s_2 - s_1 = c \ln(T_2/T_1)$.
^gibbs

> [!proof]- Proof
> 1. For a reversible process of a closed system, Law 1 gives $du = \delta q_{rev} - p\,dv$ (the only work is boundary work $p\,dv$), and Law 2 gives $\delta q_{rev} = T\,ds$.
> 2. So $T\,ds = du + p\,dv$ along reversible paths. Every term is a property, so it holds between any two nearby equilibrium states, however the process ran.
> 3. With $h = u + pv$, $dh = du + p\,dv + v\,dp$, so $T\,ds = dh - v\,dp$.
> 4. Ideal gas: $ds = c_p\,dT/T - R\,dp/p$; integrate. Incompressible: $dv = 0$, so $ds = c\,dT/T$; integrate.
^p-gibbs

## Cycles

> [!def] Efficiency and coefficient of performance
> A **heat engine** takes $Q_H$ from a hot reservoir at $T_H$, rejects $Q_C$ to a cold one at $T_C$, and delivers $W = Q_H - Q_C$; its **efficiency** is $\eta = W/Q_H$. A **refrigerator** takes $Q_C$ from the cold side using work $W$ and rejects $Q_H = Q_C + W$; its **coefficient of performance** is $\mathrm{COP}_R = Q_C / W$. A **heat pump** is the same machine valued for its hot side: $\mathrm{COP}_{HP} = Q_H / W = \mathrm{COP}_R + 1$.
^cop

> [!thm] Theorem 4 (Carnot limits)
> A cyclic device exchanging heat only with reservoirs at $T_H$ and $T_C$ satisfies
> $$\eta \le 1 - \frac{T_C}{T_H}, \qquad \mathrm{COP}_R \le \frac{T_C}{T_H - T_C}, \qquad \mathrm{COP}_{HP} \le \frac{T_H}{T_H - T_C},$$
> with equality exactly when it is reversible. Every reversible device between the same two reservoirs reaches the same bound, whatever its working fluid.
^carnot

> [!proof]- Proof (d 2.5)
> 1. Over a whole cycle the device returns to its state, so $\Delta E = 0$ and $\Delta S = 0$.
> 2. Energy: $W = Q_H - Q_C$, with $Q_H, Q_C$ the magnitudes of the two heats.
> 3. Entropy balance on the device over a cycle: $0 = Q_H/T_H - Q_C/T_C + S_{gen}$, so $Q_C = T_C\,(Q_H/T_H + S_{gen}) \ge Q_H\,T_C/T_H$.
> 4. Engine: $\eta = 1 - Q_C/Q_H \le 1 - T_C/T_H$.
> 5. Refrigerator: the heats reverse sign, $0 = Q_C/T_C - Q_H/T_H + S_{gen}$, so $Q_H \ge Q_C\,T_H/T_C$ and $W = Q_H - Q_C \ge Q_C (T_H - T_C)/T_C$.
> 6. Divide: $\mathrm{COP}_R \le T_C/(T_H - T_C)$, and add 1 for the heat pump. Equality in each line is $S_{gen} = 0$.
^p-carnot

Two readings that matter in practice. The bound depends on the reservoir temperatures, so every kelvin of temperature difference spent across a heat exchanger (to make heat flow at a finite rate) is taken out of the cycle's span and lowers its ceiling. And a refrigerator's ceiling explodes as $T_H - T_C \to 0$: lifting heat over a small temperature span is cheap, which is why chillers that run warm chilled water use far less power.
^carnot-reading

> [!def] Vapour-compression cycle
> The machine in refrigerators, chillers and heat pumps. A refrigerant circulates through four steady-flow components:
> 1. **Compressor** (1 to 2): saturated or slightly superheated vapour at low pressure is compressed, ideally at constant entropy, to the condenser pressure. Work in: $w = h_2 - h_1$.
> 2. **Condenser** (2 to 3): the hot vapour rejects heat and condenses at the high pressure, leaving as saturated (or subcooled) liquid. Heat out: $q_H = h_2 - h_3$.
> 3. **Expansion valve** (3 to 4): the liquid is throttled to the low pressure. No work, negligible heat, so $h_4 = h_3$: the valve is isenthalpic, and partly flashes the liquid to vapour.
> 4. **Evaporator** (4 to 1): the cold two-phase mixture boils at low pressure, taking heat from the cooled space. Heat in: $q_L = h_1 - h_4$.
>
> So $\mathrm{COP}_R = (h_1 - h_4)/(h_2 - h_1)$, each component treated with the steady-flow energy equation of Law 1.
^vapor-compression

The ideal cycle falls short of the Carnot refrigerator for two reasons that do not depend on hardware quality: the throttle generates entropy (an expansion with nothing extracted), and the vapour leaves the compressor superheated above the condensing temperature, so heat is rejected partly across a finite temperature difference. Real cycles add compressor inefficiency, pressure drop and the temperature differences across both heat exchangers.
^vc-losses

## Phase change

> [!thm] Theorem 5 (Clausius–Clapeyron)
> Along the saturation line between liquid and vapour,
> $$\frac{dp_{sat}}{dT} = \frac{h_{fg}}{T\,v_{fg}},$$
> where $h_{fg} = h_g - h_f$ and $v_{fg} = v_g - v_f$ are the jumps in enthalpy and specific volume from saturated liquid ($f$) to saturated vapour ($g$). Far below the critical point, with $v_f \ll v_g$, the vapour an ideal gas and $h_{fg}$ taken constant,
> $$\ln\frac{p_2}{p_1} = \frac{h_{fg}}{R}\left(\frac{1}{T_1} - \frac{1}{T_2}\right).$$
^clausius-clapeyron

> [!proof]- Proof (d 3.5)
> 1. Define the specific **Gibbs function** $g = h - T s$. For a closed system held at fixed $T$ and $p$ by its surroundings, Law 1 gives $\delta Q = dU + p\,dV$ and Law 2 gives $\delta Q \le T\,dS$.
> 2. Combine: $dU + p\,dV - T\,dS \le 0$, which at fixed $T$ and $p$ is $dG \le 0$ with $G = H - TS$. Equilibrium is a minimum of $G$.
> 3. Moving mass $dm$ from liquid to vapour at fixed $T$, $p$ changes $G$ by $(g_g - g_f)\,dm$. Both signs of $dm$ must give $dG \ge 0$ at equilibrium, so $g_g = g_f$.
> 4. Move along the saturation line: $dg_g = dg_f$.
> 5. From Theorem 3, $dg = dh - T\,ds - s\,dT = v\,dp - s\,dT$ for each phase.
> 6. So $(v_g - v_f)\,dp = (s_g - s_f)\,dT$.
> 7. The phase change at fixed $T$, $p$ is reversible with heat $h_{fg}$ per kg (Law 1 at constant pressure), so $s_g - s_f = h_{fg}/T$. Substitute.
> 8. For the integrated form put $v_{fg} \approx v_g = RT/p$: $dp/p = (h_{fg}/R)\,dT/T^2$, and integrate with $h_{fg}$ constant.
^p-clausius-clapeyron

The integrated form is an approximation twice over: $h_{fg}$ of water falls from about 2454 kJ/kg at 20 °C to 2257 kJ/kg at 100 °C, and the vapour is ideal only well below the critical point (374 °C, 22.1 MPa for water). Over tens of kelvin it is good to a few percent.
^cc-validity

## Examples

> [!example] Water in room air
> Room air at 20 °C and 50 % relative humidity sits around the open-ended [tube furnace](../../projects/tubefurnace/index.md), whose oxide rate depends on the water it carries. Relative humidity is the partial pressure of water over its saturation pressure at the same temperature. Estimate the partial pressure of water in atm from the one fact that water boils at 100 °C under 101.325 kPa. Take $R = 461.5$ J/(kg K) for water vapour.
^ex-room-water

> [!solution]- Solution
> methods: th-thermo/clausius-clapeyron
> 1. Integrated Clausius–Clapeyron from $(373.15\text{ K}, 101.325\text{ kPa})$ down to $293.15$ K, with $h_{fg}$ at the middle of the range, about $2.36 \times 10^6$ J/kg.
> 2. $\ln(p/101.325) = -(2.36\times10^6/461.5)(1/293.15 - 1/373.15) = -3.74$, so $p_{sat} \approx 2.41$ kPa. Tables give 2.34 kPa; the 3 % gap is the constant-$h_{fg}$ assumption.
> 3. At 50 % RH, $p_w \approx 1.2$ kPa $\approx 0.012$ atm, against 0.21 atm of oxygen.
> 4. Sensitivity: using $h_{fg}$ at 100 °C gives 2.83 kPa, at 20 °C 2.07 kPa. The choice of $h_{fg}$ moves the answer by $\pm 17$ %, so take it at the middle of the range.
^sol-ex-room-water

> [!example] Where an electric furnace generates entropy
> A furnace at steady state draws 100 W of electrical power. The element sits at 1400 K and all the heat leaks through the insulation to a room at 293.15 K. Find the entropy generation rate in the element, in the insulation, and in total.
^ex-furnace-entropy

> [!solution]- Solution
> methods: th-thermo/entropy-gen, energy-balance
> 1. Element (CV at steady state): electrical work in, heat $\dot Q = 100$ W out at 1400 K. Entropy balance: $0 = -100/1400 + \dot S_{gen}$, so $\dot S_{gen} = 0.071$ W/K. Work carries no entropy, so dissipating it creates all of the heat's entropy.
> 2. Insulation (steady): 100 W in at 1400 K, out at 293.15 K. $\dot S_{gen} = 100\,(1/293.15 - 1/1400) = 0.270$ W/K.
> 3. Total: $100/293.15 = 0.341$ W/K. At steady state every watt of electrical input ends as heat at room temperature, whatever the internal temperatures; they only decide where the entropy is generated.
^sol-ex-furnace-entropy

> [!example] An ideal vapour-compression chiller
> A chiller evaporates its refrigerant at 0 °C and condenses it at 40 °C. Data, taken as given (kJ/kg): saturated vapour at 0 °C, $h_1 = 398.6$; after isentropic compression to the condensing pressure, $h_2 = 423.0$; saturated liquid at 40 °C, $h_3 = 256.4$. For 10 kW of cooling, find the COP, the refrigerant flow, the compressor power, the heat rejected and the COP as a fraction of the Carnot bound between 0 °C and 40 °C.
^ex-chiller

> [!solution]- Solution
> methods: energy-balance, th-thermo/vapor-compression, th-thermo/carnot
> 1. Throttle: $h_4 = h_3 = 256.4$. Evaporator: $q_L = 398.6 - 256.4 = 142.2$ kJ/kg. Compressor: $w = 423.0 - 398.6 = 24.4$ kJ/kg.
> 2. $\mathrm{COP}_R = 142.2/24.4 = 5.83$.
> 3. $\dot m = 10/142.2 = 0.0703$ kg/s; $\dot W = 10/5.83 = 1.72$ kW; $\dot Q_H = 11.72$ kW.
> 4. Carnot: $273.15/40 = 6.83$, so the ideal cycle reaches 85 % of it. The missing 15 % is the throttle and the superheated discharge, before any hardware loss.
^sol-ex-chiller

## Derive

> [!derive] Show that $c_p - c_v = R$ for an ideal gas.
^d-cp-cv

> [!solution]- Solution
> methods: th-thermo/enthalpy
> 1. $h = u + pv = u(T) + RT$, so $h$ depends on $T$ alone.
> 2. Differentiate in $T$: $c_p = dh/dT = du/dT + R = c_v + R$.
^sol-d-cp-cv

> [!derive] Show that a throttling valve is isenthalpic, that an ideal gas leaves it at its inlet temperature, and find its entropy generation per unit mass for an ideal gas throttled from $p_1$ to $p_2$.
^d-throttle

> [!solution]- Solution
> methods: energy-balance, th-thermo/gibbs
> 1. Steady flow, no work, negligible heat and kinetic energy change: Law 1 gives $h_2 = h_1$.
> 2. Ideal gas: $h = h(T)$, so $T_2 = T_1$.
> 3. Adiabatic steady flow: $s_{gen} = s_2 - s_1 = -R\ln(p_2/p_1) = R \ln(p_1/p_2) > 0$.
^sol-d-throttle

> [!derive] Show that the entropy statement of Law 2 forbids a cyclic device that takes heat from a single reservoir and delivers an equal amount of work (the Kelvin–Planck statement).
^d-kelvin-planck

> [!solution]- Solution
> methods: th-thermo/entropy-gen
> 1. Over a cycle $\Delta S = 0$; the only heat is $Q > 0$ in at $T$.
> 2. Entropy balance: $0 = Q/T + S_{gen}$, so $S_{gen} = -Q/T < 0$, which Law 2 forbids.
^sol-d-kelvin-planck

> [!derive] A device exchanges heat with the environment at $T_0$ and with other bodies, and delivers work. Show that the work it delivers falls short of the work a reversible device would deliver between the same end states by exactly $T_0 S_{gen}$.
^d-gouy-stodola

> [!solution]- Solution
> methods: energy-balance, th-thermo/entropy-gen
> 1. Let $Q_0$ be heat taken from the environment and fix the end states, so $\Delta E$ and $\Delta S$ are fixed, together with the other heats $Q_k$ at $T_k$.
> 2. Energy: $W = Q_0 + \sum Q_k - \Delta E$.
> 3. Entropy: $\Delta S = Q_0/T_0 + \sum Q_k/T_k + S_{gen}$, so $Q_0 = T_0(\Delta S - \sum Q_k/T_k) - T_0 S_{gen}$.
> 4. Substitute: $W = [\text{terms fixed by the end states and the } Q_k] - T_0 S_{gen}$. The reversible device has $S_{gen} = 0$, so $W_{rev} - W = T_0 S_{gen}$.
^sol-d-gouy-stodola

> [!derive] Show that an ideal gas with constant specific heats compressed at constant entropy follows $T p^{-(\gamma-1)/\gamma} = \text{const}$, with $\gamma = c_p/c_v$.
^d-isentropic

> [!solution]- Solution
> methods: th-thermo/gibbs
> 1. $s_2 - s_1 = c_p\ln(T_2/T_1) - R\ln(p_2/p_1) = 0$.
> 2. $R/c_p = (c_p - c_v)/c_p = (\gamma - 1)/\gamma$, so $T_2/T_1 = (p_2/p_1)^{(\gamma-1)/\gamma}$.
^sol-d-isentropic

## Problems

> [!problem] Two litres of water (d 2)
> One kilogram of water at 10 °C and one at 90 °C are mixed in an insulated jug. Take $c = 4180$ J/(kg K). Find the final temperature and the entropy generated.
^inv-th-mixing-water

> [!solution]- Solution
> methods: energy-balance, th-thermo/gibbs
> 1. Equal masses, no heat out: $T_f = 50$ °C $= 323.15$ K.
> 2. $S_{gen} = \Delta S = c[\ln(323.15/283.15) + \ln(323.15/363.15)] = 64.5$ J/K.
> Answer: 50 °C, 64.5 J/K.
^sol-inv-th-mixing-water

> [!problem] A house in January (d 2.5)
> A house loses 5 kW when it is held at 20 °C with −10 °C outside. A heat pump between these two temperatures reaches 45 % of the Carnot bound. Find its electrical power, and compare with resistance heating.
^inv-th-heat-pump

> [!solution]- Solution
> methods: th-thermo/carnot
> 1. $\mathrm{COP}_{HP,max} = 293.15/30 = 9.77$; at 45 %, $\mathrm{COP} = 4.40$.
> 2. $\dot W = 5/4.40 = 1.14$ kW, against 5 kW for resistance heating.
> Answer: 1.14 kW, 4.4 times less.
^sol-inv-th-heat-pump

> [!problem] An air compressor (d 4)
> Air ($c_p = 1005$ J/(kg K), $\gamma = 1.4$, ideal gas) enters a steady adiabatic compressor at 300 K and leaves at 8 times the inlet pressure. The compressor's isentropic efficiency (isentropic work over actual work) is 0.85. Find the actual outlet temperature, the actual work per kg, the entropy generated per kg, and $T_0 s_{gen}$ with $T_0 = 300$ K. Explain why $T_0 s_{gen}$ is smaller than the extra work the real compressor needs.
^inv-th-air-compressor

> [!solution]- Solution
> methods: energy-balance, th-thermo/gibbs, th-thermo/entropy-gen
> 1. Isentropic outlet: $T_{2s} = 300 \cdot 8^{0.2857} = 543.4$ K; $w_s = 1005 \times 243.4 = 244.7$ kJ/kg.
> 2. Actual: $w = 244.7/0.85 = 287.8$ kJ/kg; $T_2 = 300 + 287.8/1.005 = 586.4$ K.
> 3. Same outlet pressure, so $s_{gen} = s_2 - s_{2s} = c_p\ln(586.4/543.4) = 76.5$ J/(kg K).
> 4. $T_0 s_{gen} = 22.9$ kJ/kg, against $43.2$ kJ/kg of extra work.
> 5. The extra work is not all destroyed: it leaves as a hotter outlet stream, which could still drive an engine against $T_0$. Only $T_0 s_{gen}$ is lost for good.
> Answer: 586 K, 288 kJ/kg, 76.5 J/(kg K), 22.9 kJ/kg.
^sol-inv-th-air-compressor

> [!problem] A pressure cooker (d 3)
> A cooker's valve holds 100 kPa above an atmosphere of 101.325 kPa. Estimate the boiling temperature inside, taking $h_{fg} = 2257$ kJ/kg and $R = 461.5$ J/(kg K) for water vapour.
^inv-th-pressure-cooker

> [!solution]- Solution
> methods: th-thermo/clausius-clapeyron
> 1. $1/T_2 = 1/373.15 - (461.5/2.257\times10^6)\ln(201.325/101.325)$.
> 2. $T_2 = 393.8$ K $= 120.6$ °C. Tables give about 120.4 °C at this pressure; $h_{fg}$ at 100 °C is the right one to use because the whole range sits within 21 K above 100 °C.
> Answer: about 121 °C.
^sol-inv-th-pressure-cooker

> [!problem] Cooling from waste heat (d 4.5)
> Waste heat at 120 °C drives a chiller that takes heat from a chilled loop at 10 °C and rejects everything it takes in to cooling water at 30 °C. No work crosses its boundary. Find the largest possible ratio of heat removed from the chilled loop to heat drawn from the 120 °C source, and the least waste heat needed for 50 kW of cooling.
^inv-th-heat-driven-chiller

> [!solution]- Solution
> methods: energy-balance, th-thermo/entropy-gen
> 1. Heats: $Q_g$ in at $T_g = 393.15$ K, $Q_c$ in at $T_c = 283.15$ K, $Q_a = Q_g + Q_c$ out at $T_a = 303.15$ K.
> 2. Entropy over a cycle: $Q_g/T_g + Q_c/T_c - (Q_g + Q_c)/T_a + S_{gen} = 0$.
> 3. With $S_{gen} \ge 0$: $Q_c(1/T_c - 1/T_a) \le Q_g(1/T_a - 1/T_g)$.
> 4. $Q_c/Q_g \le (1 - T_a/T_g)\,T_c/(T_a - T_c) = 0.229 \times 14.16 = 3.24$: a Carnot engine driving a Carnot refrigerator.
> 5. For 50 kW: $Q_g \ge 50/3.24 = 15.4$ kW.
> Answer: 3.24; 15.4 kW.
^sol-inv-th-heat-driven-chiller
