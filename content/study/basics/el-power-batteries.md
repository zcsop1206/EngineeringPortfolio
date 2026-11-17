---
study: basic
id: el-power-batteries
title: Circuits, power conversion and battery cells
area: el
needs: []
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: none. Thermal ideas come from [lumped capacitance](th-transient.md#^lumped) and the [first law](th-thermo.md#^first-law), each linked where used.

The thread of this doc: a battery cell is a voltage source with resistances and capacitances inside it, a converter is a few switches, an inductor and a capacitor, and both are governed by the same first- and second-order transients and the same bookkeeping of energy and heat. Interview questions in this area are mostly that bookkeeping done fast and right.

## Transients in R, L and C

> [!def] The three elements
> A **resistor** obeys $v = Ri$. An **inductor** obeys $v = L\,di/dt$ and stores $\tfrac12 Li^2$: its current cannot jump. A **capacitor** obeys $i = C\,dv/dt$ and stores $\tfrac12 Cv^2$: its voltage cannot jump. A circuit with one storage element is **first order**, with one time constant: $\tau = RC$ for a capacitor, $\tau = L/R$ for an inductor, where $R$ is the resistance the element sees. With an inductor and a capacitor together it is **second order**, described by the **natural frequency** $\omega_0 = 1/\sqrt{LC}$ and the **damping ratio** $\zeta$.
^rlc

After a step, every voltage and current of a first-order circuit obeys $\tau\dot x = x_\infty - x$, so it relaxes as $x(t) = x_\infty + (x_0 - x_\infty)e^{-t/\tau}$ ([first-order response](th-transient.md#^time-constant)): 95% of the way after $3\tau$, 99% after $4.6\tau$. ^first-order

Charging a capacitor from a fixed voltage $V$ through any resistance wastes $\tfrac12CV^2$ in the resistance, as much as it stores ([dynamic power](dd-boolean-cmos.md#^dynamic-power)). ^charging-loss

> [!thm] Theorem 1 (series RLC)
> A source $V$ is switched at $t = 0$ onto a resistor $R$, inductor $L$ and capacitor $C$ in series. The capacitor voltage obeys $\ddot v + 2\zeta\omega_0\dot v + \omega_0^2 v = \omega_0^2 V$ with $\omega_0 = 1/\sqrt{LC}$ and $\zeta = \tfrac R2\sqrt{C/L}$. It is overdamped (no overshoot) for $\zeta > 1$, critically damped at $\zeta = 1$, and for $\zeta < 1$ it rings at $\omega_d = \omega_0\sqrt{1-\zeta^2}$ inside an envelope $e^{-\zeta\omega_0 t}$.
^rlc-roots

> [!proof]- Proof (d 2)
> 1. Kirchhoff's voltage law: $L\,di/dt + Ri + v = V$, with $i = C\,dv/dt$.
> 2. Substitute: $LC\ddot v + RC\dot v + v = V$; divide by $LC$ and match coefficients to get $\omega_0$ and $\zeta$.
> 3. This is the damped oscillator with $v \leftrightarrow x$, $L \leftrightarrow m$, $R \leftrightarrow c$, $1/C \leftrightarrow k$; its free solutions in the three regimes are those of [damping](mc-vibration.md#^damping).
> 4. The full response is $V$ plus a free solution, with its constants set by $v(0)$ and $i(0)$.
^p-rlc-roots

> [!example] Plugging into a bus
> A board's 10 µF ceramic input capacitor is connected through 10 µH of cable inductance to a 12 V supply. Find $\omega_0$ and $\zeta$ when the loop resistance is 2 Ω and when it is 0.2 Ω, and the peak capacitor voltage in the second case.
^ex-hot-plug

> [!solution]- Solution
> methods: el-power-batteries/rlc-roots
> 1. $\omega_0 = 1/\sqrt{10^{-10}} = 10^5$ rad/s (15.9 kHz).
> 2. $\zeta = \tfrac R2\sqrt{C/L} = R/2$ here: 1.0 at 2 Ω (critically damped), 0.1 at 0.2 Ω.
> 3. At $\zeta = 0.1$ the overshoot is $e^{-\pi\zeta/\sqrt{1-\zeta^2}} = 0.729$, so the peak is $12\cdot1.729 = 20.7$ V, at $\pi/\omega_d = 31.6$ µs. A 16 V-rated part downstream would be destroyed. (A time-stepped simulation agrees.)

## Phasors

> [!def] Phasor and impedance
> At a single angular frequency $\omega$, a sinusoid $v(t) = |V|\cos(\omega t + \theta)$ is written $v = \operatorname{Re}(Ve^{j\omega t})$ with the complex **phasor** $V = |V|e^{j\theta}$. The **impedance** of a two-terminal element is $Z = V/I$, a complex number whose magnitude is the ratio of amplitudes and whose angle is the phase by which voltage leads current. Impedances combine like resistances. The **rms** value of a sinusoid is its amplitude over $\sqrt2$.
^phasors

> [!thm] Theorem 2 (element impedances and average power)
> $Z_R = R$, $Z_L = j\omega L$, $Z_C = 1/(j\omega C)$. The average power into an element is $P = \tfrac12\operatorname{Re}(VI^*) = V_{rms}I_{rms}\cos\varphi$, where $\varphi$ is the angle of $Z$.
^impedance

> [!proof]- Proof (d 1.5)
> 1. For real $\omega$, $\frac{d}{dt}\operatorname{Re}(Ie^{j\omega t}) = \operatorname{Re}(j\omega Ie^{j\omega t})$: differentiating multiplies the phasor by $j\omega$.
> 2. So $v = L\,di/dt$ becomes $V = j\omega LI$, and $i = C\,dv/dt$ becomes $I = j\omega CV$.
> 3. With $v = |V|\cos(\omega t + \theta_v)$ and $i = |I|\cos(\omega t + \theta_i)$, the product is $\tfrac12|V||I|[\cos(\theta_v - \theta_i) + \cos(2\omega t + \theta_v + \theta_i)]$.
> 4. The second term averages to zero over a period, leaving $\tfrac12|V||I|\cos(\theta_v - \theta_i) = \tfrac12\operatorname{Re}(VI^*)$.
^p-impedance

## The buck converter

> [!def] Buck converter
> A **buck converter** steps a DC voltage down. A switch (the high-side transistor) connects the input $V_{in}$ to a node, the **switch node**, for a fraction $D$ (the **duty cycle**) of each period $T_s = 1/f_s$; for the rest of the period a second switch (the low-side transistor, or a diode) connects that node to ground. An inductor $L$ runs from the switch node to the output, and a capacitor $C$ across the output smooths the voltage $V_{out}$ delivered to the load current $I_{out}$. In **continuous conduction mode** (CCM) the inductor current never falls to zero. In **periodic steady state** every voltage and current repeats each period.
^buck

> [!thm] Theorem 3 (volt-second and charge balance)
> In periodic steady state, the average voltage across an inductor is zero and the average current into a capacitor is zero.
^volt-second

> [!proof]- Proof
> 1. $i_L(T_s) - i_L(0) = \frac1L\int_0^{T_s}v_L\,dt$, and periodicity makes the left side zero.
> 2. Likewise $v_C(T_s) - v_C(0) = \frac1C\int_0^{T_s}i_C\,dt = 0$.
^p-volt-second

> [!thm] Theorem 4 (buck in CCM)
> For an ideal buck in CCM with small output ripple: $V_{out} = DV_{in}$; the inductor current is a triangle of peak-to-peak ripple $\Delta I_L = \dfrac{V_{out}(1-D)}{Lf_s}$ around the average $I_{out}$; and CCM holds exactly when $I_{out} > \Delta I_L/2$.
^buck-ccm

> [!proof]- Proof (d 2)
> 1. With the high side on, the inductor sees $V_{in} - V_{out}$ for $DT_s$; with it off, $-V_{out}$ for $(1-D)T_s$.
> 2. Volt-second balance (Theorem 3): $(V_{in} - V_{out})D - V_{out}(1-D) = 0$, so $V_{out} = DV_{in}$.
> 3. Off, the current falls at slope $V_{out}/L$ for $(1-D)T_s$: $\Delta I_L = V_{out}(1-D)/(Lf_s)$.
> 4. Charge balance on the capacitor: the inductor's average current is the load current $I_{out}$.
> 5. The triangle's minimum is $I_{out} - \Delta I_L/2$, which stays positive exactly when $I_{out} > \Delta I_L/2$.
^p-buck-ccm

> [!thm] Theorem 5 (output ripple)
> If all the ripple current flows into an ideal output capacitor, the output voltage ripple is $\Delta V = \dfrac{\Delta I_L}{8Cf_s}$ peak to peak.
^buck-ripple

> [!proof]- Proof (d 2.5)
> 1. The capacitor current is $i_L - I_{out}$: a zero-mean triangle with peak-to-peak $\Delta I_L$.
> 2. It is positive from the middle of the rising ramp to the middle of the falling ramp: $DT_s/2 + (1-D)T_s/2 = T_s/2$ in one stretch.
> 3. The charge delivered then is a triangle of base $T_s/2$ and height $\Delta I_L/2$: $Q = T_s\Delta I_L/8$.
> 4. The voltage rises by $Q/C$ during that stretch and falls back over the rest: $\Delta V = \Delta I_L/(8Cf_s)$.
^p-buck-ripple

A real capacitor adds its series resistance times $\Delta I_L$, which dominates for electrolytics; the formula is for ceramics. ^esr

## Losses in switches

> [!def] Conduction and switching loss
> A transistor switch dissipates power in two ways. **Conduction loss**: while on, a MOSFET acts as a resistance $R_{DS(on)}$ and dissipates $I_{rms}^2R_{DS(on)}$, with $I_{rms}$ the rms of its own current; a diode dissipates about $V_fI_{avg}$ for forward drop $V_f$. **Switching loss**: during each transition, voltage across and current through the switch overlap. Smaller terms, each proportional to $f_s$: charging the switch's output capacitance $C_{oss}$ costs about $\tfrac12C_{oss}V_{in}^2$ per cycle; driving the gate costs $Q_gV_{drive}$ per cycle for gate charge $Q_g$; a diode's reverse recovery costs about $Q_{rr}V_{in}$; during **dead time** (both switches off, to avoid shorting the input) the low-side body diode conducts. The inductor adds copper loss (DC and ripple) and core loss.
^switching-loss

> [!thm] Theorem 6 (rms of a rippled current)
> A current that is a DC level $I$ plus a zero-mean triangular ripple of peak-to-peak $\Delta I$, of any duty cycle, has $I_{rms}^2 = I^2 + \Delta I^2/12$.
^rms-ripple

> [!proof]- Proof (d 2)
> 1. Write $i = I + r(t)$ with $r$ the zero-mean triangle.
> 2. $\overline{i^2} = I^2 + 2I\bar r + \overline{r^2} = I^2 + \overline{r^2}$.
> 3. On each ramp $r$ sweeps uniformly between $-\Delta I/2$ and $\Delta I/2$; the mean square of a uniform sweep over $[-a, a]$ is $a^2/3$.
> 4. Both ramps give the same mean square whatever their lengths, so $\overline{r^2} = (\Delta I/2)^2/3 = \Delta I^2/12$.
^p-rms-ripple

> [!thm] Theorem 7 (overlap loss)
> With an inductive load clamped by a freewheeling path (current $I$ held by the inductor, voltage $V$ held by the input), a switch whose current and voltage change linearly in times $t_i$ and $t_v$ loses $E = \tfrac12VI(t_i + t_v)$ per transition, so turning on and off once per cycle costs $P_{sw} = \tfrac12VI(t_{on} + t_{off})f_s$, with $t_{on}, t_{off}$ the total transition times. With a resistive load, where both change at once over $t_s$, the loss is $VIt_s/6$ per transition.
^overlap

> [!proof]- Proof (d 2)
> 1. Turning on into a clamped inductive load, the switch must take the whole current $I$ from the freewheeling path before the switch-node voltage can move, so its current ramps $0 \to I$ over $t_i$ with $V$ across it.
> 2. That phase costs $\int_0^{t_i}V\,I\frac{t}{t_i}dt = \tfrac12VIt_i$.
> 3. Then the voltage falls $V \to 0$ over $t_v$ at full current: $\tfrac12VIt_v$.
> 4. Turning off runs the same two phases in reverse order, with the same total.
> 5. Resistive load: $v = V(1-s)$ and $i = Is$ with $s = t/t_s$, so the loss is $VIt_s\int_0^1 s(1-s)\,ds = VIt_s/6$.
^p-overlap

> [!example] A 12 V to 3.3 V buck
> 12 V in, 3.3 V and 5 A out, $f_s = 500$ kHz, $L = 4.7$ µH, $C = 22$ µF (ceramic). The high-side MOSFET has $R_{DS(on)} = 10$ mΩ and total transition time 20 ns per cycle (on plus off); the low side has 5 mΩ and switches at near-zero voltage. Find the duty cycle, ripple current, output ripple, minimum load for CCM, the main losses and the efficiency from them alone.
^ex-buck

> [!solution]- Solution
> methods: el-power-batteries/buck-ccm, el-power-batteries/buck-ripple, el-power-batteries/rms-ripple, el-power-batteries/overlap
> 1. $D = 3.3/12 = 0.275$.
> 2. $\Delta I_L = 3.3\cdot0.725/(4.7\times10^{-6}\cdot5\times10^5) = 1.02$ A; CCM down to $0.51$ A of load.
> 3. $\Delta V = 1.02/(8\cdot22\times10^{-6}\cdot5\times10^5) = 11.6$ mV.
> 4. $I_{rms}^2 = 25 + 1.02^2/12 = 25.09$ A²; the ripple barely matters at this load.
> 5. High-side conduction $0.275\cdot25.09\cdot0.010 = 0.069$ W; low-side $0.725\cdot25.09\cdot0.005 = 0.091$ W.
> 6. Switching: $\tfrac12\cdot12\cdot5\cdot20\times10^{-9}\cdot5\times10^5 = 0.30$ W, the largest term.
> 7. Efficiency $16.5/(16.5 + 0.46) = 97.3\%$, before gate, $C_{oss}$, dead-time and inductor losses.

## The cell model

> [!def] Equivalent circuit of a cell
> A lithium-ion cell stores charge in its electrodes; its **open-circuit voltage** $U$ (OCV) is the voltage at rest, set by the electrode chemistry, the **state of charge** and the temperature. Under a current $I$ (positive in discharge) the terminal voltage $V$ is lower, and an **equivalent circuit model** reproduces it with an ideal source $U$ in series with:
> - $R_0$, the **ohmic resistance** (electrolyte, contacts, current collectors), which acts instantly;
> - one or more **RC pairs** $R_k \parallel C_k$, each a delayed drop: the fast one (milliseconds to seconds) stands for charge transfer at the electrode surfaces, the slow one (tens of seconds to minutes) for lithium diffusion in the solids.
>
> So $V = U - IR_0 - \sum_k v_k$ with $C_k\dot v_k = I - v_k/R_k$. Every resistance rises steeply in the cold and at low state of charge.
^cell-model

For a step of current $I$ from rest, each RC voltage follows the [first-order response](#^first-order) with $\tau_k = R_kC_k$: $V(t) = U - IR_0 - \sum_k IR_k(1 - e^{-t/\tau_k})$. That is how the model is fit to a pulse test: the instant drop gives $R_0$, the final extra drop gives $R_1$, and the shape gives $\tau_1$. ^pulse-fit

> [!example] Reading a pulse
> A cell rests at 3.700 V. A 10 A discharge step pulls it instantly to 3.620 V; after 10 s it reads 3.600 V; it settles at 3.570 V. Fit a one-RC model.
^ex-pulse

> [!solution]- Solution
> methods: el-power-batteries/first-order
> 1. $R_0 = (3.700 - 3.620)/10 = 8$ mΩ.
> 2. $R_1 = (3.620 - 3.570)/10 = 5$ mΩ.
> 3. At 10 s the RC drop is $0.020$ V of its final $0.050$ V: $1 - e^{-10/\tau} = 0.40$, so $\tau = -10/\ln 0.60 = 19.6$ s, and $C_1 = \tau/R_1 \approx 3900$ F.

## State of charge and open-circuit voltage

> [!def] Capacity, SOC and OCV
> **Capacity** $Q$ is the charge a cell delivers from full to empty under stated conditions, in ampere-hours (1 Ah = 3600 C); energy is $\int V\,dq$, in watt-hours. A **C-rate** of $n$C is the current that would drain the capacity in $1/n$ hours. **State of charge** (SOC) is the remaining charge as a fraction of $Q$. **Coulomb counting** tracks it as $\text{SOC}(t) = \text{SOC}(0) - \frac1Q\int_0^t \eta I\,dt$, with $\eta$ the coulombic efficiency (near 1 for lithium-ion). It drifts: a current-sensor offset $I_{off}$ adds an error $I_{off}t/Q$ that grows while the car is parked, and a gain error $g$ adds $g$ times the charge passed. The **OCV-SOC curve**, measured after the cell has rested long enough for the RC voltages to decay (tens of minutes to hours), resets that drift: read the rest voltage, look up the SOC. That works on chemistries whose curve slopes (nickel-rich cathodes run from about 3.0 to 4.2 V) and poorly on lithium iron phosphate, whose curve is nearly flat near 3.3 V over most of its range and shows hysteresis. Good estimators combine the two, typically with a Kalman filter on the cell model. **State of health** (SOH) tracks capacity fade and resistance growth; 80% of initial capacity is a common end-of-life line.
^soc-ocv

## Heat in a cell

> [!thm] Theorem 8 (cell heat generation)
> A cell at uniform temperature $T$ and uniform composition (no concentration gradients) delivers current $I$ (positive in discharge) at terminal voltage $V$. It generates heat at the rate
> $$\dot Q = I(U - V) - IT\frac{\partial U}{\partial T}.$$
> The first term is **irreversible** (it is $I^2R$ for a purely ohmic cell); the second is **reversible**, the entropy change of the reaction, and changes sign with the current.
^cell-heat

> [!proof]- Proof (d 3.5)
> 1. Discharging moves $I/(nF)$ moles of reaction per second, with $n$ electrons per reaction and $F$ the Faraday constant.
> 2. At equilibrium the electrical work available per mole equals the drop in Gibbs energy: $\Delta G = -nFU$.
> 3. Entropy is $-\partial G/\partial T$ at constant pressure, so $\Delta S = nF\,\partial U/\partial T$.
> 4. Enthalpy $\Delta H = \Delta G + T\Delta S = -nF(U - T\,\partial U/\partial T)$.
> 5. The [first law](th-thermo.md#^first-law) for the cell at constant pressure and steady temperature: enthalpy released per second equals electrical power out plus heat out.
> 6. Enthalpy released per second: $-\Delta H\cdot I/(nF) = I(U - T\,\partial U/\partial T)$; electrical power out: $IV$.
> 7. Subtract: $\dot Q = I(U - V) - IT\,\partial U/\partial T$.
^p-cell-heat

> [!def] Cell thermal behaviour
> With heat generation $\dot Q$, mass $m$, specific heat $c$ and a surface conductance $hA$ to coolant or air, a cell whose internal temperature is nearly uniform (small [Biot number](th-conduction.md#^biot)) follows the [lumped model](th-transient.md#^lumped) $mc\,\dot T = \dot Q - hA(T - T_{amb})$, with time constant $mc/(hA)$ of minutes to an hour. Lithium-ion cells age fastest when hot (above about 40 °C), plate lithium metal on graphite if charged in the cold (near or below 0 °C), and above roughly 80 to 120 °C, depending on chemistry, begin exothermic decomposition reactions that speed up with temperature. If those produce heat faster than the cell can shed it, the temperature runs away.
^cell-thermal

> [!example] A cell at 2C
> A 5 Ah cell (mass 70 g, $c = 1000$ J/(kg K)) discharges at 10 A with an effective resistance of 20 mΩ at 298 K, and $\partial U/\partial T = -0.1$ mV/K. (a) Heat generation? (b) Temperature rise over the 30 min discharge with no cooling? (c) With $hA = 0.042$ W/K to ambient?
^ex-cell-heat

> [!solution]- Solution
> methods: el-power-batteries/cell-heat, lumped-capacitance
> 1. Irreversible $10^2\cdot0.020 = 2.0$ W; reversible $-10\cdot298\cdot(-10^{-4}) = 0.30$ W; total 2.30 W.
> 2. Adiabatic: $2.30/(0.07\cdot1000) = 0.033$ K/s, so 59 K over 1800 s.
> 3. Cooled: $\tau = 70/0.042 = 1667$ s and steady rise $2.30/0.042 = 55$ K; after 1800 s, $55(1 - e^{-1800/1667}) = 36$ K. Still too hot for a long life; it needs real cooling.

## The battery management system

> [!def] Battery management system
> A **battery management system** (BMS) keeps every cell of a pack inside its safe window and tells the rest of the system what the pack can do. Its jobs:
> - **sense**: every series group's voltage, pack current (shunt or Hall sensor), temperatures at several points, and the insulation resistance between the high-voltage pack and the chassis;
> - **protect**: open the contactors or switches on over-voltage, under-voltage, over-current, over- or under-temperature; fuses back it up;
> - **estimate**: SOC, SOH and the power available, from the cell model; the discharge current that keeps a cell at its minimum voltage $V_{min}$ is $(U - V_{min})/R$ for an effective resistance $R$;
> - **balance**: cells in series carry the same current, so the cell with least charge ends every discharge and the fullest ends every charge, wasting the others' capacity. Cells drift apart through unequal self-discharge and capacity. **Passive** balancing bleeds the fullest cells through resistors; **active** balancing moves charge between cells;
> - **control** the cooling or heating and the contactors, including **precharge**: closing the main contactor onto an empty inverter capacitor would draw a huge current, so a resistor charges it first;
> - **log and communicate** faults and limits to the vehicle or system controller.
^bms

Passive balancing is slow by design. To remove a 2% imbalance in a 50 Ah cell, 1 Ah, at a 100 mA bleed takes 10 h, and dissipates 0.4 W per cell at 4 V. Balancing therefore runs during long charges and rests. ^balance-time

## Derive

> [!derive] Prove that an underdamped series RLC circuit switched from rest onto a step $V$ first peaks at $t = \pi/\omega_d$, with capacitor voltage $V\left(1 + e^{-\pi\zeta/\sqrt{1-\zeta^2}}\right)$.
^d-rlc-overshoot

> [!solution]- Solution
> methods: el-power-batteries/rlc-roots
> 1. From rest ($v = 0$, $\dot v = 0$): $v = V\left[1 - e^{-\zeta\omega_0t}\left(\cos\omega_dt + \tfrac{\zeta}{\sqrt{1-\zeta^2}}\sin\omega_dt\right)\right]$; check both initial conditions.
> 2. Differentiate: $\dot v = V\frac{\omega_0}{\sqrt{1-\zeta^2}}e^{-\zeta\omega_0t}\sin\omega_dt$, first zero after $0$ at $t = \pi/\omega_d$.
> 3. There $\cos = -1$, $\sin = 0$: $v = V(1 + e^{-\zeta\omega_0\pi/\omega_d})$, and $\zeta\omega_0/\omega_d = \zeta/\sqrt{1-\zeta^2}$.

> [!derive] Prove that a series RLC circuit driven at $\omega_0$ has a purely resistive impedance, and that the capacitor's voltage amplitude is then $Q$ times the source's, with $Q = \frac1R\sqrt{L/C} = 1/(2\zeta)$.
^d-series-resonance

> [!solution]- Solution
> methods: el-power-batteries/impedance
> 1. $j\omega_0L + 1/(j\omega_0C) = j(\omega_0L - 1/(\omega_0C)) = 0$ since $\omega_0^2LC = 1$, so $Z = R$ and $|I| = |V|/R$.
> 2. $|V_C| = |I|/(\omega_0C) = \frac{|V|}{R}\sqrt{L/C}$. Compare with $\zeta = \frac R2\sqrt{C/L}$: $Q = 1/(2\zeta)$. (Check: $L = 10$ µH, $C = 10$ µF, $R = 0.2$ Ω gives $Q = 5$.)

> [!derive] A boost converter has the inductor from the input to the switch node, a switch from that node to ground, and a diode from that node to the output. Find $V_{out}/V_{in}$ in CCM.
^d-boost-ratio

> [!solution]- Solution
> methods: el-power-batteries/volt-second
> 1. Switch on ($DT_s$): $v_L = V_{in}$. Switch off: $v_L = V_{in} - V_{out}$.
> 2. Volt-second balance: $V_{in}D + (V_{in} - V_{out})(1-D) = 0$, so $V_{out} = V_{in}/(1-D)$.

> [!derive] A source of open-circuit voltage $U$ and internal resistance $R$ drives a load. Find the largest power it can deliver, the current at which it does, and the efficiency there.
^d-max-power

> [!solution]- Solution
> methods: el-power-batteries/cell-model
> 1. $P = I(U - IR)$, a downward parabola in $I$.
> 2. Maximum at $I = U/(2R)$: $P = U^2/(4R)$, with terminal voltage $U/2$, so half the energy is lost inside: efficiency 50%.

> [!derive] Show that a cell whose OCV rises with temperature cools itself while discharging below a certain current, and find that current for an ohmic cell of resistance $R$.
^d-cooling-current

> [!solution]- Solution
> methods: el-power-batteries/cell-heat
> 1. Ohmic cell: $\dot Q = I^2R - IT\,\partial U/\partial T$.
> 2. With $\partial U/\partial T > 0$ this is negative for $0 < I < T(\partial U/\partial T)/R$. For $+0.1$ mV/K, 298 K and 20 mΩ: below 1.49 A.

## Problems

> [!problem] Switching frequency of a 3.3 V rail (d 4)
> A 12 V to 3.3 V buck at a 5 A load uses $L = 4.7$ µH and $C = 22$ µF. Its frequency-dependent loss is a switching loss $af_s$ with $a = 0.6$ µJ, plus the inductor's ripple loss $R_{ac}\Delta I_L^2/12$ with $R_{ac} = 20$ mΩ. (a) Which frequency minimises this loss, and how do the two terms compare there? (b) What is the output ripple at that frequency? (c) The rail allows 20 mV of ripple. What is the lowest frequency that meets it, and what does the loss become?
^inv-el-buck-frequency

> [!solution]- Solution
> methods: el-power-batteries/buck-ccm, el-power-batteries/buck-ripple, el-power-batteries/rms-ripple
> 1. $\Delta I_L = K/f_s$ with $K = 3.3\cdot0.725/4.7\times10^{-6} = 5.09\times10^5$ A/s, so the loss is $af_s + c/f_s^2$ with $c = R_{ac}K^2/12 = 4.32\times10^8$ W Hz².
> 2. Setting the derivative to zero: $a = 2c/f_s^3$, $f^* = (2c/a)^{1/3} = 113$ kHz. There $af^* = 2c/f^{*2}$: switching loss is twice ripple loss (0.068 W and 0.034 W).
> 3. At 113 kHz, $\Delta I_L = 4.51$ A and $\Delta V = 4.51/(8\cdot22\times10^{-6}\cdot1.13\times10^5) = 0.23$ V, 7% of the rail.
> 4. $\Delta V = K/(8Cf_s^2) \le 0.02$ V needs $f_s \ge \sqrt{K/(8C\cdot0.02)} = 380$ kHz, where $\Delta I_L = 1.34$ A and the loss is 0.23 W.
> Answer: (a) 113 kHz, switching twice ripple; (b) 0.23 V; (c) 380 kHz at 0.23 W. The ripple limit, not the loss optimum, sets the frequency.

> [!problem] Peak power of a pack (d 3.5)
> A pack has 96 groups in series, each of 4 cells in parallel. Each cell has OCV 3.6 V at this state of charge and effective resistance 6 mΩ for a 10 s pulse; no cell may fall below 3.0 V. (a) What pack current and power are available for 10 s? (b) How much heat does the pack make meanwhile, as a fraction of the power delivered? (c) Drawing more current would raise the power further, up to a maximum. Why can the BMS not allow that maximum?
^inv-el-pack-power

> [!solution]- Solution
> methods: el-power-batteries/bms, el-power-batteries/cell-model
> 1. A group is 4 cells in parallel: $R = 1.5$ mΩ. Group current at the limit: $(3.6 - 3.0)/0.0015 = 400$ A, which is the pack current.
> 2. Power: $96\cdot3.0\cdot400 = 115$ kW.
> 3. Heat: per cell $100^2\cdot0.006 = 60$ W, pack $384\cdot60 = 23$ kW, 20% of the output: in general $(U - V)/V = 0.6/3.0$.
> 4. Maximum power transfer would need $V = U/2 = 1.8$ V per cell (207 kW), far below the 3.0 V limit, with half the energy turned into heat.
> Answer: (a) 400 A, 115 kW; (b) 23 kW, 20%; (c) the voltage limit binds long before.

> [!problem] Precharging an inverter (d 3)
> An inverter's DC-link capacitor of 1 mF is precharged from a 400 V pack through a resistor, with the precharge current limited to 2 A. (a) Resistance, and time to reach 99% of pack voltage? (b) Energy the resistor must absorb? (c) The main contactor then closes with 4 V left across it and 50 mΩ in the loop. What current flows at that instant?
^inv-el-precharge

> [!solution]- Solution
> methods: el-power-batteries/first-order, el-power-batteries/charging-loss
> 1. $R = 400/2 = 200$ Ω; $\tau = RC = 0.2$ s; 99% at $\tau\ln100 = 0.92$ s.
> 2. $\tfrac12CV^2 = \tfrac12\cdot10^{-3}\cdot400^2 = 80$ J, whatever the resistance: size the resistor for an 80 J pulse.
> 3. $4/0.05 = 80$ A, brief and harmless; closing at 0 V would have tried for 8000 A.
> Answer: (a) 200 Ω, 0.92 s; (b) 80 J; (c) 80 A.

> [!problem] Drift of a charge counter (d 3)
> A 50 Ah pack counts charge with a current sensor that has a 50 mA offset and a 1% gain error. (a) What SOC error does the offset add over 24 h parked? (b) What does the gain error add over one discharge of 30 Ah? (c) Which cell chemistry lets the BMS remove these errors at the next long rest, and why?
^inv-el-soc-drift

> [!solution]- Solution
> methods: el-power-batteries/soc-ocv
> 1. $0.05\cdot24 = 1.2$ Ah, 2.4% of 50 Ah.
> 2. $0.01\cdot30 = 0.3$ Ah, 0.6%.
> 3. A sloped OCV curve: after rest, the measured voltage maps to one SOC. On a flat curve (iron phosphate) a few millivolts of error spans many percent of SOC, so the correction waits for the steep ends of the curve.
> Answer: (a) 2.4%; (b) 0.6%; (c) a sloped-OCV chemistry.

> [!problem] Core of a cylindrical cell (d 3)
> A cylindrical cell 21 mm in diameter and 70 mm long generates 2.30 W uniformly through its volume. Its radial conductivity (across the wound layers) is 0.5 W/(m K). Ignoring heat flow along the axis, how much hotter is the core than the can? Compare with the 55 K steady rise of the can over ambient in the cell example.
^inv-el-cell-core

> [!solution]- Solution
> methods: th-conduction/heat-eq, energy-balance
> 1. Volume $\pi\cdot0.0105^2\cdot0.07 = 2.42\times10^{-5}$ m³, so $q''' = 9.49\times10^4$ W/m³.
> 2. A solid cylinder with uniform generation and its surface held fixed peaks on its axis, $q'''r_o^2/(4k)$ above the surface (from the [heat equation](th-conduction.md#^heat-eq); proved in [th-conduction](th-conduction.md)).
> 3. $9.49\times10^4\cdot0.0105^2/(4\cdot0.5) = 5.2$ K.
> Answer: about 5 K, a tenth of the can-to-ambient rise, so cooling the outside is the first problem. (Along the axis conductivity is far higher, which helps a little more.)
