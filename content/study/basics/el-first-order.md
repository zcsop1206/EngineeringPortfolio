---
study: basic
id: el-first-order
title: RC and RL circuits
area: el
needs: [el-cap-ind, el-equivalents]
build: 1
tracks: [mie342, interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: the [capacitor](el-cap-ind.md#^cap-law) and [inductor](el-cap-ind.md#^ind-law) laws and their [stored energy](el-cap-ind.md#^energy); the [one-sided values](el-cap-ind.md#^one-sided) $x(t_0^-)$ and $x(t_0^+)$; the [continuity](el-cap-ind.md#^continuity) of $v_C$ and $i_L$; the [DC steady state](el-cap-ind.md#^dc-steady); the [Thevenin](el-equivalents.md#^thevenin) and [Norton](el-equivalents.md#^norton) equivalents, with the [test source](el-equivalents.md#^rth-test-source) for circuits with dependent sources; the [power balance](el-dc-analysis.md#^power-balance).
^needs

A circuit with one capacitor or one inductor obeys a single first-order differential equation. So between switching instants every voltage and current in it moves from one value to another along one exponential, with one time constant. Solving such a circuit comes down to four small resistive problems: the circuit just before the switch moves, just after, long after, and the resistance the element sees. The same equation governs a body cooling in a fluid ([lumped capacitance](th-transient.md#^lumped)).
^thread

## The first-order form

> [!def] First-order circuit
> A **first-order circuit** is made of resistors, independent and dependent sources, switches, and one capacitor or one inductor (or several that combine into one by the [series and parallel rules](el-cap-ind.md#^combine-rule)). Its independent sources are constant between **switching instants**, the times at which switches move. The element's **state** $x$ is $v_C$ for a capacitor and $i_L$ for an inductor: the quantity that holds its energy and does not jump.
^first-order-def

> [!def] Resistance seen and time constant
> On an interval between switching instants, the **resistance the element sees** is the Thevenin resistance $R_{th}$ of the rest of the circuit at the element's two terminals, with the switches as they are on that interval: independent sources zeroed, every [dependent source](el-dc-analysis.md#^dependent-sources) kept, which calls for a [test source](el-equivalents.md#^rth-test-source) when there is one. The **time constant** is
> $$\tau = R_{th}C \ \text{(capacitor)}, \qquad \tau = \frac{L}{R_{th}} \ \text{(inductor)}.$$
> Ohms times farads and henries over ohms are both seconds.
^tau

> [!thm] Theorem 1 (first-order form)
> On an interval with no switching, let the rest of the circuit, seen from the element's terminals, have Thevenin voltage $V_{th}$ (with the polarity of $v_C$, or of the voltage that drives $i_L$ through the inductor) and resistance $R_{th} \ne 0$, so its Norton current is $I_N = V_{th}/R_{th}$. Then the state obeys
> $$\tau\,\frac{dx}{dt} + x = x_\infty, \qquad x_\infty = V_{th} \ \text{(capacitor)}, \quad x_\infty = I_N \ \text{(inductor)},$$
> and every other voltage or current $y$ in the circuit is $y = a\,x + b$, with constants $a$ and $b$ fixed by the circuit on that interval.
> ![Schematic: left, a Thevenin source V_th, plus on top, in series with R_th, charging a capacitor C whose voltage v_C has plus on top, labelled τ = R_th C; right, a Norton source I_N, arrow up, in parallel with R_th, feeding an inductor L whose current i_L flows down, labelled τ = L/R_th](el-first-order--form.svg)
^first-order-form

> [!proof]- Proof (d 2)
> 1. On the interval the rest of the circuit is linear and resistive with constant sources, so at the element's terminals it acts as its Thevenin equivalent: the voltage it puts across the element is $V_{th} - R_{th}i$, with $i$ the current it sends into the element's $+$ terminal ([Thevenin, as a source](el-equivalents.md#^thevenin-use)).
> 2. Capacitor: $i = C\,dv_C/dt$ and the voltage is $v_C$, so $v_C = V_{th} - R_{th}C\,dv_C/dt$. Rearrange.
> 3. Inductor: the current is $i_L$ and the voltage is $L\,di_L/dt$, so $L\,di_L/dt = V_{th} - R_{th}i_L$. Divide by $R_{th}$.
> 4. At any instant, replace the capacitor by an independent voltage source of value $v_C$, or the inductor by a current source of value $i_L$. No voltage or current changes: the rest of the circuit sees the same terminal voltage and current, its own equations are untouched, and with $R_{th}$ finite and nonzero they have one solution.
> 5. That circuit is resistive, and its independent sources are the constant ones plus the one source $x$. By [superposition](el-equivalents.md#^superposition), each voltage or current is $a\,x$ plus the part due to the constant sources, $b$.
^p-first-order-form

For $\tau > 0$ the capacitor charges toward $V_{th}$, the voltage it would hold as an open circuit; the inductor's current heads for $I_N$, the current it would carry as a short. Where several capacitors or inductors combine into one, the theorems in this doc describe the equivalent and the circuit outside it. Each member follows the same exponential from its own initial value, toward a final value set by the charge (or volt-seconds) that passes, not by the DC circuit ([initial value of an equivalent](el-cap-ind.md#^combine-ic)), and the members can keep [trapped energy](el-cap-ind.md#^trapped-energy) after the equivalent's is gone. A circuit with a capacitor and an inductor that cannot be combined is second order instead ([series RLC](el-power-batteries.md#^rlc-roots)).
^form-reading

## The switching instant

> [!thm] Theorem 2 (the 0⁺ circuit)
> Let switches move at $t_0$, with the currents into capacitors and the voltages across inductors bounded there. Then every voltage and current at $t_0^+$ is the solution of the **0⁺ circuit**: the circuit with the switches in their new positions and the capacitor replaced by an independent voltage source $v_C(t_0^-)$, or the inductor by an independent current source $i_L(t_0^-)$. The state carries across unchanged; $i_C$, $v_L$ and the resistors' voltages and currents come out of the 0⁺ circuit and may differ from their values at $t_0^-$.
> ![Schematic grid, element then its stand-in at 0⁻, 0⁺ and t → ∞: a capacitor is an open circuit at 0⁻ and at infinity and a voltage source v_C(0⁻) at 0⁺; an inductor is a short at 0⁻ and at infinity and a current source i_L(0⁻), arrow along i_L, at 0⁺](el-first-order--substitutions.svg)
^zero-plus

> [!proof]- Proof
> 1. With bounded current or voltage, [continuity](el-cap-ind.md#^continuity) gives $x(t_0^+) = x(t_0^-)$.
> 2. For $t_0 < t < t_1$, with $t_1$ the next switching instant, the switches are in their new positions. By steps 4 and 5 of Theorem 1's proof the element can be replaced by a source of its state $x(t)$, and every quantity is $a\,x(t) + b$; as $t \to t_0^+$ it tends to $a\,x(t_0^+) + b$, its value with the source at $x(t_0^+)$.
> 3. What is left is a resistive circuit, and its solution is every quantity at $t_0^+$. It is not the circuit that held before $t_0$, so nothing but the state need match its value at $t_0^-$.
^p-zero-plus

Two readings of the grid. An uncharged capacitor is a short at $0^+$, and an inductor with no current is an open circuit at $0^+$. And the $0^-$ column needs the circuit to have sat at [DC](el-cap-ind.md#^dc-def) before the switch moved; otherwise $x(t_0^-)$ comes from the previous interval's exponential. The bounded condition fails only where a switch forces $v_C$ or $i_L$ to jump ([switch rule](el-cap-ind.md#^switch-rule)).
^zero-plus-reading

## Natural and step responses

> [!thm] Theorem 3 (natural response)
> A **natural response** is one with no independent source acting after $t_0$, so $V_{th} = 0$ and $x_\infty = 0$; for $\tau > 0$ the element gives back what it stored. With $\tau \ne 0$,
> $$x(t) = x(t_0^+)\,e^{-(t - t_0)/\tau}.$$
^natural

> [!proof]- Proof (d 1.5)
> 1. Theorem 1 with $x_\infty = 0$: $\tau\,dx/dt = -x$.
> 2. Then $\dfrac{d}{dt}\left(x\,e^{(t - t_0)/\tau}\right) = e^{(t - t_0)/\tau}\left(\dfrac{dx}{dt} + \dfrac{x}{\tau}\right) = 0$, so $x\,e^{(t - t_0)/\tau}$ is constant after $t_0$.
> 3. Its value at $t_0^+$ is $x(t_0^+)$. Divide by the exponential.
^p-natural

> [!thm] Theorem 4 (step response)
> A **step response** is one with a constant $x_\infty$ after $t_0$, from any starting state. With $\tau \ne 0$,
> $$x(t) = x_\infty + \left[x(t_0^+) - x_\infty\right]e^{-(t - t_0)/\tau}.$$
> For $\tau > 0$ the state settles at $x_\infty$, its value in the DC circuit of the interval: $V_{th}$ across the open capacitor, $I_N$ through the shorted inductor.
^step

> [!proof]- Proof
> 1. Let $u = x - x_\infty$. As $x_\infty$ is constant, $\tau\,du/dt + u = 0$.
> 2. Steps 2 and 3 of Theorem 3's proof apply to $u$; add $x_\infty$ back.
> 3. For $\tau > 0$ the exponential and its slope die away, so $x \to x_\infty$ with $dx/dt \to 0$: no capacitor current, or no inductor voltage, which is the [DC steady state](el-cap-ind.md#^dc-steady).
^p-step

> [!thm] Theorem 5 (any voltage or current)
> On an interval $t_0 < t < t_1$ with no switching and $\tau \ne 0$, every voltage or current $y$ in a first-order circuit is
> $$y(t) = y(\infty) + \left[y(t_0^+) - y(\infty)\right]e^{-(t - t_0)/\tau},$$
> with the same $\tau$ for every $y$. Here $y(t_0^+)$ comes from the 0⁺ circuit (Theorem 2) and $y(\infty)$ from the DC circuit of the interval (C open, L short). The formula holds up to $t_1$ even when the interval ends long before $y$ gets near $y(\infty)$.
^general-solution

> [!proof]- Proof (d 2)
> 1. By Theorem 1, $y = a\,x + b$ on the interval.
> 2. Substitute Theorem 4: $y = (a\,x_\infty + b) + a\left[x(t_0^+) - x_\infty\right]e^{-(t - t_0)/\tau}$.
> 3. A state held at $x_\infty$ has $dx/dt = 0$: no capacitor current, or no inductor voltage, which is the DC circuit. So $a\,x_\infty + b = y(\infty)$.
> 4. At $t_0^+$, $y(t_0^+) = a\,x(t_0^+) + b$. Subtract step 3: $a\left[x(t_0^+) - x_\infty\right] = y(t_0^+) - y(\infty)$.
^p-general-solution

Every first-order transient is therefore one curve, stretched by $\tau$ in time and by $y(t_0^+) - y(\infty)$ in value. After $\tau$, $2\tau$, $3\tau$ and $5\tau$ the change is 63.2%, 86.5%, 95.0% and 99.3% done; after $5\tau$ it is over for any exam purpose. The tangent at the start reaches the final value one $\tau$ later ([derive](#^d-tangent)): that sketches the curve in three strokes and reads $\tau$ off a measured trace.
^universal

![Plot: the universal exponential against time in units of τ. The change done, 1 − e^(−t/τ), passes 63.2% at τ, 86.5% at 2τ, 95.0% at 3τ and 99.3% at 5τ; the change left, e^(−t/τ), passes 36.8%, 13.5%, 5.0% and 0.7%. Dashed tangents from t = 0 reach the end of the change at t = τ.](el-first-order--universal.svg)

> [!thm] Theorem 6 (time to reach a value)
> If $\tau > 0$, a quantity $y$ that follows Theorem 5 from $t_0$ passes a value $y^*$ strictly between $y(t_0^+)$ and $y(\infty)$ exactly once, at
> $$t^* = t_0 + \tau\ln\frac{y(t_0^+) - y(\infty)}{y^* - y(\infty)}.$$
> If $\tau < 0$, the same formula gives the one time at which $y$ passes a value $y^*$ beyond $y(t_0^+)$, on the side away from $y(\infty)$. Either way, if $t^*$ falls after the next switching instant, $y$ never gets there on this interval. Read the other way, one value $y^*$ measured at a known $t^*$ fixes $\tau$, and with it $C = \tau/R_{th}$ or $L = \tau R_{th}$.
^time-to-value

> [!proof]- Proof
> 1. Set $y(t^*) = y^*$ in Theorem 5: $e^{-(t^* - t_0)/\tau} = \dfrac{y^* - y(\infty)}{y(t_0^+) - y(\infty)}$.
> 2. For $\tau > 0$ the left side falls continuously from 1 toward 0, and the right side lies in $(0, 1)$ exactly when $y^*$ lies strictly between the two values. For $\tau < 0$ the left side rises from 1 without bound, and the right side exceeds 1 exactly when $y^*$ lies beyond $y(t_0^+)$, away from $y(\infty)$. Either way there is one solution; take logarithms. Theorem 5, and with it the solution, holds only up to the next switching instant.
^p-time-to-value

## The recipe

> [!note] One switching instant $t_0$, in five steps
> 1. **The 0⁻ circuit**: the circuit before $t_0$, at DC (C open, L short). Find the state $x(t_0^-)$, and only the state: nothing else carries across.
> 2. **The 0⁺ circuit**: switches in their new positions, the capacitor a voltage source $v_C(t_0^-)$ or the inductor a current source $i_L(t_0^-)$. Find $y(t_0^+)$ for each quantity asked.
> 3. **The ∞ circuit**: new switch positions, at DC. Find $y(\infty)$.
> 4. **The time constant**: $R_{th}$ seen by the element in the new circuit, independent sources zeroed, dependent sources kept; $\tau = R_{th}C$ or $L/R_{th}$.
> 5. **Write and check**: $y(t) = y(\infty) + [y(t_0^+) - y(\infty)]e^{-(t - t_0)/\tau}$ for $t > t_0$. Check the units of $\tau$, the sign of $y$ at one instant, and the power balance in the 0⁺ circuit.
^recipe

> [!example] A coil, a current source and a switch that opens
> The switch has been closed for a long time and opens at $t = 0$. Find $i_L(t)$ and $v_o(t)$ for $t > 0$, say which quantities jump at $t = 0$, and find when $v_o$ passes through zero.
> ![Schematic: a 30 V source, plus on top, then 3 Ω and a closed switch that opens at t = 0, into the top node; from that node, 6 Ω to the bottom rail with v_o across it, plus on top; a 2 A source pushing up into the node; and 2 Ω in series with a 40 mH inductor whose current i_L flows down](el-first-order--ex1.svg)
^ex-coil-switch

> [!solution]- Solution
> methods: switching-recipe, zero-plus-circuit, general-solution, time-to-value
> ![Schematic: the example's three circuits. Top, t = 0⁻: switch closed, the inductor a short carrying 6 A, 12 V across the 6 Ω. Bottom left, t = 0⁺: the source branch cut off, the inductor a 6 A current source, −24 V across the 6 Ω. Bottom right, t → ∞: the inductor a short carrying 1.5 A, 3 V across the 6 Ω.](el-first-order--ex1-states.svg)
>
> 1. 0⁻, L a short: KCL at the top node, $(30 - v_o)/3 + 2 = v_o/6 + v_o/2$, so $v_o(0^-) = 12$ V and $i_L(0^-) = 12/2 = 6$ A.
> 2. 0⁺, L a 6 A source: the open switch cuts off the 30 V branch. KCL at the top node, $2 = v_o/6 + 6$, so $v_o(0^+) = -24$ V, and the inductor's voltage is $v_o - 2\cdot6 = -36$ V.
> 3. ∞, L a short: the 2 A divides between the 6 Ω and the 2 Ω, so $i_L(\infty) = 2\cdot6/8 = 1.5$ A and $v_o(\infty) = 6\cdot0.5 = 3$ V.
> 4. τ: the 2 A source zeroed is an open circuit, so the inductor sees $2 + 6 = 8$ Ω and $\tau = 40\text{ mH}/8\ \Omega = 5$ ms.
> 5. $i_L(t) = 1.5 + 4.5e^{-t/5\,\text{ms}}$ A and $v_o(t) = 3 - 27e^{-t/5\,\text{ms}}$ V for $t > 0$.
>
>    ![Plot: i_L falls smoothly from 6 A toward 1.5 A with τ = 5 ms; v_o jumps from 12 V to −24 V at t = 0, then rises toward 3 V and crosses zero at 11.0 ms](el-first-order--ex1-response.svg)
> 6. What jumps: $v_o$ (12 V to −24 V) and with it the 6 Ω current (2 A to −4 A), the inductor's voltage (0 to −36 V) and the 3 Ω current (6 A to 0). $i_L$ does not, nor does the 2 Ω current, which is $i_L$.
> 7. $v_o = 0$ when $27e^{-t/\tau} = 3$: $t = 5\ln 9 = 11.0$ ms (Theorem 6).
> 8. Check, power at 0⁺: the inductor delivers $36\cdot6 = 216$ W. The 6 Ω takes $24^2/6 = 96$ W, the 2 Ω $6^2\cdot2 = 72$ W and the current source $2\cdot24 = 48$ W: it pushes 2 A into a node at −24 V, so it absorbs.

## Controlled sources and growth

> [!thm] Theorem 7 (the sign of $R_{th}$)
> A network of resistors alone, with its independent sources zeroed, presents $R_{th} \ge 0$ at any two terminals. With dependent sources it can present $R_{th} < 0$. Then $\tau < 0$, Theorems 3 to 5 still hold, and $e^{-(t - t_0)/\tau} = e^{(t - t_0)/|\tau|}$ grows: every quantity that depends on the state runs away from its $y(\infty)$, which is now a balance point the circuit leaves unless it starts exactly on it. Between the two cases, an inductor that sees $R_{th} = 0$ has the constant voltage $V_{th}$ across it, and a capacitor that sees an open circuit has the constant current $I_N$ into it: the state ramps, at $V_{th}/L$ or $I_N/C$.
^dependent-tau

> [!proof]- Proof (d 2.5)
> 1. Drive the zeroed network with a test current $I$. Its terminal voltage is $R_{th}I$ ([test source](el-equivalents.md#^rth-test-source)), so it absorbs $R_{th}I^2$, and by the [power balance](el-dc-analysis.md#^power-balance) that is the sum of what its elements absorb.
> 2. Each resistor absorbs $R_ki_k^2 \ge 0$, so with resistors alone $R_{th}I^2 \ge 0$ and $R_{th} \ge 0$.
> 3. A dependent source can deliver power, so with one the sum, and $R_{th}$, can be negative ([negative $R_{th}$](el-equivalents.md#^negative-rth)).
> 4. The proofs of Theorems 3 to 5 used only $\tau \ne 0$, so they hold for $\tau < 0$, where the exponential grows.
> 5. Inductor with $R_{th} = 0$: step 3 of Theorem 1's proof, before the division, reads $L\,di_L/dt = V_{th}$.
> 6. Capacitor facing an open circuit: the rest of the circuit is a current source $I_N$ ([extremes](el-equivalents.md#^extremes)), so $C\,dv_C/dt = I_N$.
^p-dependent-tau

In hardware the growth stops when the amplifier the dependent source stands for saturates, or when something fails.
^growth-reading

> [!example] A charged capacitor handed to a network with a controlled source
> The 2 µF capacitor has sat on the 10 V source for a long time. At $t = 0$ the switch moves it onto the network, in which a current-controlled current source $\beta i_1$ ($\beta$ a pure number) feeds the node between the 2 kΩ and the 8 kΩ. (a) Find the resistance the capacitor sees as a function of $\beta$. (b) For $\beta = 2$, find $v_C(t)$ and the 8 kΩ current $i_o(t)$. (c) For which $\beta$ does $v_C$ decay? (d) For $\beta = 3$, when does $v_C$ reach the capacitor's 100 V rating?
> ![Schematic: a 10 V source, plus on top; a two-way switch above a 2 µF capacitor (v_C, plus on top) moves it at t = 0 from the source on the left to the network on the right: 10 kΩ to the bottom rail carrying i_1 downward, then 2 kΩ along the top to a node with 8 kΩ to the bottom rail, carrying i_o downward, and a controlled current source β i_1 pushing up into it](el-first-order--ex2.svg)
^ex-controlled-cap

> [!solution]- Solution
> methods: controlled-source-tau, test-source, time-to-value
> 1. Test voltage $v$ on the network (it has no independent source to zero). In mA and kΩ: $i_1 = v/10$, and KCL at the middle node, $(v - v_b)/2 + \beta v/10 = v_b/8$, gives $v_b = (0.8 + 0.16\beta)v$.
> 2. The test current is $i_1 + (v - v_b)/2 = (0.2 - 0.08\beta)v$, so the network's conductance is $(0.2 - 0.08\beta)$ mS and $R_{th} = 1/(0.2 - 0.08\beta)$ kΩ $= 12.5/(2.5 - \beta)$ kΩ.
> 3. (b) $\beta = 2$: 0.04 mS, $R_{th} = 25$ kΩ, $\tau = 25\text{ kΩ}\cdot2\ \mu\text{F} = 50$ ms. No independent source acts after $t = 0$, so $v_C = 10e^{-t/50\,\text{ms}}$ V.
> 4. The 8 kΩ current is $i_o = v_b/8 = 1.12v_C/8 = 1.4e^{-t/50\,\text{ms}}$ mA. The middle node sits above the capacitor, so at $0^+$ the 2 kΩ carries 0.6 mA back toward it, and of the 1 mA the 10 kΩ draws the capacitor supplies only 0.4 mA: hence the slow decay.
> 5. (c) Decay needs $R_{th} > 0$: $\beta < 2.5$. At $\beta = 2.5$ the network takes no current, looks open, and $v_C$ holds at 10 V.
> 6. (d) $\beta = 3$: $-0.04$ mS, $R_{th} = -25$ kΩ, $\tau = -50$ ms, so $v_C = 10e^{t/50\,\text{ms}}$ V, which reaches 100 V at $t = 50\ln 10 = 115$ ms.
> 7. Check at 0⁺ for $\beta = 2$: the capacitor delivers $10 \cdot 0.4 = 4$ mW and the controlled source $11.2\cdot2 = 22.4$ mW, 26.4 mW in all; the 10 kΩ, 2 kΩ and 8 kΩ absorb 10, 0.72 and 15.68 mW, the same 26.4 mW.
>
>    ![Plot: v_C from 10 V for three gains: β = 2 decays with τ = 50 ms, β = 2.5 holds at 10 V, β = 3 grows and crosses the 100 V rating at 115 ms](el-first-order--ex2-gain.svg)

## Energy

> [!thm] Theorem 8 (energy in a natural response)
> In a natural response with $\tau > 0$ from $t_0$, the stored energy is
> $$w(t) = w(t_0^+)\,e^{-2(t - t_0)/\tau},$$
> so it decays with time constant $\tau/2$. By time $t$ the element has delivered $w(t_0^+)\left(1 - e^{-2(t - t_0)/\tau}\right)$ to the rest of the circuit, and a fraction $f$ of its energy after $\tfrac12\ln\frac{1}{1 - f}$ time constants: 0.69 for 75%, 1.50 for 95%, 2.30 for 99%. Each resistor takes a fixed share of the delivered energy: its power over the power the element delivers, both at $t_0^+$. With resistors alone the shares sum to 1; a dependent source takes or adds a share of its own, so one resistor's share can exceed 1.
^energy-decay

> [!proof]- Proof (d 2)
> 1. $w = \tfrac12Cv_C^2$ or $\tfrac12Li_L^2$ ([stored energy](el-cap-ind.md#^energy)); square Theorem 3.
> 2. The element stores without loss, so the energy it has lost by $t$, $w(t_0^+) - w(t)$, has gone into the rest of the circuit.
> 3. $1 - e^{-2s/\tau} = f$ gives $s = \tfrac{\tau}{2}\ln\frac{1}{1 - f}$.
> 4. With no independent source, $b = 0$ in Theorem 1, so each current is a constant times $x$. Resistor $k$ then absorbs $R_ka_k^2x^2$, a fixed fraction of the element's output power, which is also proportional to $x^2$.
^p-energy-decay

![Plot: in a natural response the state falls as e^(−t/τ) and the stored energy as e^(−2t/τ); 75% of the energy has been delivered at 0.69τ and 95% at 1.50τ](el-first-order--energy.svg)

The state is down to 5% after $3\tau$, the energy after $1.5\tau$. In a step response the source's energy splits between the resistances and the element: charging a capacitor from zero to $V$ through any resistance wastes $\tfrac12CV^2$, as much as it stores ([charging loss](el-power-batteries.md#^charging-loss)).
^energy-reading

## Several switching instants

When switches move at $t_0 < t_1 < \cdots$, solve one interval at a time. Each interval is a first-order circuit with its own $\tau$ and $y(\infty)$. Its starting state is the state at the end of the previous interval, carried across by [continuity](el-cap-ind.md#^continuity), and its exponential runs in $t - t_k$, the time since its own switching instant. Where the previous interval was heading no longer matters, only where it had got to.
^sequential

> [!example] A capacitor charged, then loaded
> The capacitor is uncharged. The left switch closes at $t = 0$ and the right one at $t = 10$ ms. Sketch $v_C$ for $0 \le t \le 40$ ms before computing it. Then find $v_C(t)$ on both intervals, $v_C$ at 15 ms, and $i_C$ just before and just after 10 ms.
> ![Schematic: a 12 V source, plus on top, a switch closing at t = 0 and 4 kΩ into the top of a 2.5 µF capacitor (v_C plus on top, i_C flowing down into it); from that node a switch closing at t = 10 ms connects 4 kΩ to the bottom rail](el-first-order--ex3.svg)
^ex-two-stage-cap

> [!solution]- Solution
> methods: sequential-switching, general-solution, zero-plus-circuit
> 1. $0 < t < 10$ ms: $v_C(0^+) = 0$, $v_C(\infty) = 12$ V, $\tau_1 = 4\text{ kΩ}\cdot2.5\ \mu\text{F} = 10$ ms, so $v_C = 12(1 - e^{-t/10\,\text{ms}})$ V and $i_C(0^+) = 12/4 = 3$ mA.
> 2. At 10 ms, $v_C = 12(1 - e^{-1}) = 7.59$ V, carried across the switching instant.
> 3. $t > 10$ ms: the capacitor sees 6 V behind $4 \parallel 4 = 2$ kΩ, so $v_C(\infty) = 6$ V, $\tau_2 = 5$ ms, and $v_C = 6 + 1.59e^{-(t - 10\,\text{ms})/5\,\text{ms}}$ V.
> 4. $v_C(15\text{ ms}) = 6 + 1.59e^{-1} = 6.58$ V.
> 5. $i_C(10^-) = (12 - 7.59)/4 = 1.10$ mA, and $i_C(10^+) = 1.10 - 7.59/4 = -0.79$ mA. The current reverses at once: the capacitor now sits above its new final value.
>
>    ![Plot: v_C rises toward 12 V with τ = 10 ms until 10 ms (dashed, the path had the right switch stayed open), then falls toward 6 V with τ = 5 ms; i_C starts at 3 mA, decays to 1.10 mA, jumps to −0.79 mA at 10 ms and decays to zero](el-first-order--ex3-curves.svg)
> 6. Check, from the slope of step 3: $i_C(10^+) = C\,dv_C/dt = 2.5\ \mu\text{F}\cdot(-1.59\text{ V}/5\text{ ms}) = -0.79$ mA.

## Problems

> [!problem] A supply disconnected from a capacitor (d 2)
> The switch has been closed for a long time and opens at $t = 0$. (a) Redraw the circuit for $t > 0$ and find $v_C(t)$. (b) Find $v_o(0^-)$ and $v_o(0^+)$. Which currents jump at $t = 0$? (c) When does $v_o$ fall to 3 V?
> ![Schematic: a 36 V source, plus on top, 6 kΩ and a closed switch that opens at t = 0 into the top node; 12 kΩ from that node to the bottom rail with v_o across it, plus on top; 4 kΩ from the node to the top of a 0.25 µF capacitor with v_C, plus on top](el-first-order--p-supply-off.svg)
^inv-el-supply-off

> [!solution]- Solution
> methods: switching-recipe, zero-plus-circuit, time-to-value
> 1. 0⁻, C open: the 4 kΩ carries nothing, so $v_C(0^-) = v_o(0^-) = 36\cdot12/18 = 24$ V.
> 2. $t > 0$: the capacitor, 4 kΩ and 12 kΩ form one loop, $R_{th} = 16$ kΩ, $\tau = 4$ ms, and no source acts: $v_C = 24e^{-t/4\,\text{ms}}$ V.
>
>    ![Schematic: the circuit for t > 0, one loop: 12 kΩ on the left with v_o across it, plus on top; 4 kΩ along the top; the 0.25 µF capacitor on the right with v_C, plus on top; R_th = 16 kΩ, τ = 4 ms](el-first-order--p-supply-off-after.svg)
> 3. 0⁺: 24 V across 16 kΩ drives 1.5 mA round the loop, so $v_o(0^+) = 18$ V, and $v_o = \tfrac34v_C = 18e^{-t/4\,\text{ms}}$ V.
> 4. Jumps: the 4 kΩ current (0 to 1.5 mA), the 12 kΩ current (2 mA to 1.5 mA) and the 6 kΩ current (2 mA to 0). $v_C$ does not.
> 5. $18e^{-t/4\,\text{ms}} = 3$ at $t = 4\ln 6 = 7.17$ ms.
> 6. Check, power at 0⁺: the capacitor delivers $24\cdot1.5 = 36$ mW; the 12 kΩ takes $18^2/12 = 27$ mW and the 4 kΩ $1.5^2\cdot4 = 9$ mW.
> Answer: (a) $24e^{-t/4\,\text{ms}}$ V; (b) 24 V, then 18 V; the 4 kΩ, 12 kΩ and 6 kΩ currents jump; (c) 7.17 ms.

> [!problem] A coil whose series resistor is shorted (d 2.5)
> The switch has been open for a long time and closes at $t = 0$, shorting the 12 Ω resistor. (a) Find $i_L(0^+)$, $v_L(0^+)$ and $i_L(\infty)$. (b) Choose $L$ so that $v_L$ has fallen to a quarter of $v_L(0^+)$ at $t = 2$ ms. (c) Sketch $i_L$ and $v_L$ on one time axis.
> ![Schematic: a 36 V source, plus on top, then along the top 10 Ω, the inductor L (i_L to the right, v_L plus on its left) and 8 Ω, down through 12 Ω to the bottom rail, with a switch across the 12 Ω that closes at t = 0](el-first-order--p-shorted-resistor.svg)
^inv-el-shorted-resistor

> [!solution]- Solution
> methods: switching-recipe, time-to-value
> 1. 0⁻, L a short in one loop: $i_L(0^-) = 36/30 = 1.2$ A, which is $i_L(0^+)$.
> 2. After: $R_{th} = 10 + 8 = 18$ Ω and $i_L(\infty) = 36/18 = 2$ A. KVL at 0⁺: $v_L(0^+) = 36 - 18\cdot1.2 = 14.4$ V.
> 3. $v_L(\infty) = 0$, so $v_L = 14.4e^{-t/\tau}$ V, and a quarter at 2 ms means $\tau = 2\text{ ms}/\ln 4 = 1.44$ ms.
> 4. $L = R_{th}\tau = 18 \cdot 1.44\text{ ms} = 26.0$ mH.
> 5. Sketch: $i_L$ rises from 1.2 A toward 2 A while $v_L$ jumps from 0 to 14.4 V and falls back to 0. Since $v_L = R_{th}(i_L(\infty) - i_L)$ at every instant, $i_L$ has made three quarters of its rise at 2 ms: 1.8 A.
>
>    ![Plot: on one time axis, i_L holds 1.2 A before t = 0, then rises toward 2 A, reaching 1.8 A at 2 ms; v_L is 0 before t = 0, jumps to 14.4 V, and falls to 3.6 V, a quarter, at 2 ms; τ = 1.44 ms marked](el-first-order--p-shorted-resistor-curves.svg)
>
> Answer: (a) 1.2 A, 14.4 V, 2 A; (b) 26.0 mH.

> [!problem] A coil handed over by a make-before-break switch (d 3)
> The switch has been in the left position for a long time. At $t = 0$ it moves to the right position, making the new contact before it breaks the old one. (a) Find $i_L(t)$ for $t \ge 0$. (b) How much energy does the 15 Ω resistor receive in all? (c) After how many time constants has it received 90% of that? (d) What would happen if the switch broke before it made?
> ![Schematic: a 40 V source, plus on top, and 5 Ω reach the left contact of a two-way switch whose common terminal sits on top of a 50 mH inductor (i_L flowing down); at t = 0 the switch moves to the right contact, which feeds 15 Ω and 10 Ω in parallel to the bottom rail](el-first-order--p-make-before-break.svg)
^inv-el-make-before-break

> [!solution]- Solution
> methods: el-first-order/natural, energy-decay
> 1. Before: the inductor is a short across the source branch, so $i_L(0^-) = 40/5 = 8$ A.
> 2. After: it sees $15 \parallel 10 = 6$ Ω, $\tau = 50\text{ mH}/6\ \Omega = 8.33$ ms, and $i_L = 8e^{-t/8.33\,\text{ms}}$ A. The resistors' top node jumps from 0 to $-6\cdot8 = -48$ V, since the current now flows up through them.
> 3. Stored energy: $\tfrac12 \cdot 0.05 \cdot 8^2 = 1.6$ J. In parallel the resistors share power in inverse proportion to resistance, so the 15 Ω takes $10/25 = 40\%$: 0.64 J.
> 4. 90% of it: $\tfrac12\ln 10 = 1.15$ time constants, 9.59 ms.
> 5. Breaking first would leave the current no path, and the contacts would arc ([inductive kick](#^d-inductive-kick)). Making first keeps a path at every instant; the brief overlap only puts the 6 Ω across the source branch.
> 6. Check: the 10 Ω takes the other 60%, 0.96 J, and $0.64 + 0.96 = 1.6$ J, all that was stored.
> Answer: (a) $8e^{-t/8.33\,\text{ms}}$ A; (b) 0.64 J; (c) 1.15 (9.59 ms); (d) an arc across the switch.

> [!problem] A coil discharging through a controlled source (d 3)
> The switch has been closed for a long time and opens at $t = 0$. (a) Find $i_L(t)$ for $t \ge 0$. (b) Find $v_L(t)$ and $i_\Delta(t)$ for $t > 0$. (c) Find the power the controlled source absorbs at $t = 0^+$, and check the power balance.
> ![Schematic: an 18 V source, plus on top, 3 Ω and a closed switch that opens at t = 0 into the top node; from that node a 30 mH inductor to the bottom rail (i_L down, v_L plus on top), 12 Ω to the bottom rail carrying i_Δ upward, and 6 Ω along the top to a controlled voltage source 6 i_Δ, plus on top, down to the bottom rail](el-first-order--p-controlled-coil.svg)
^inv-el-controlled-coil

> [!solution]- Solution
> methods: switching-recipe, test-source, power-balance
> 1. 0⁻: the inductor shorts the network on its right, so the top node is at 0 V, $i_\Delta = 0$, the controlled source is 0 V, and $i_L(0^-) = 18/3 = 6$ A.
> 2. Test voltage $v$ on the top node, switch open: $i_\Delta = -v/12$, so the source is $6i_\Delta = -v/2$. The 6 Ω then carries $(v + v/2)/6 = v/4$ and the 12 Ω carries $v/12$: $v/3$ in all, so $R_{th} = 3$ Ω. (Zeroing the controlled source would give $12 \parallel 6 = 4$ Ω, and the wrong $\tau$.)
> 3. $\tau = 30\text{ mH}/3\ \Omega = 10$ ms and no source acts: $i_L = 6e^{-t/10\,\text{ms}}$ A.
> 4. The inductor's current returns up through the network, so $v_L = -R_{th}i_L = -18e^{-t/10\,\text{ms}}$ V, and $i_\Delta = -v_L/12 = 1.5e^{-t/10\,\text{ms}}$ A.
> 5. At 0⁺ the source is $6\cdot1.5 = 9$ V and the 6 Ω carries $(-18 - 9)/6 = -4.5$ A toward it, so the source absorbs $9\cdot(-4.5) = -40.5$ W: it delivers 40.5 W.
> 6. Balance: the inductor delivers $18\cdot6 = 108$ W and the source 40.5 W; the 12 Ω takes 27 W and the 6 Ω 121.5 W. Both sides are 148.5 W.
> Answer: $i_L = 6e^{-t/10\,\text{ms}}$ A, $v_L = -18e^{-t/10\,\text{ms}}$ V, $i_\Delta = 1.5e^{-t/10\,\text{ms}}$ A; the source absorbs −40.5 W.

> [!problem] A capacitor switched from one load to another (d 3)
> The left switch has been closed and the right one open for a long time. At $t = 0$ the left one opens and the right one closes. (a) Find $v_C(t)$. (b) How much energy has the right-hand 10 kΩ resistor absorbed by $t = 16$ ms? (c) When has 80% of the energy stored at $t = 0$ been dissipated? (d) How much does the 40 kΩ resistor absorb in all?
> ![Schematic: a 50 V source, plus on top, 10 kΩ and a closed switch that opens at t = 0 into the top node; from that node a 4 µF capacitor (v_C plus on top) and 40 kΩ to the bottom rail, then a switch that closes at t = 0 leading to a 10 kΩ resistor to the bottom rail](el-first-order--p-two-loads.svg)
^inv-el-two-loads

> [!solution]- Solution
> methods: el-first-order/natural, energy-decay
> 1. 0⁻: $v_C = 50\cdot40/50 = 40$ V, storing $\tfrac12\cdot4\ \mu\text{F}\cdot40^2 = 3.2$ mJ.
> 2. $t > 0$: the capacitor sees $40 \parallel 10 = 8$ kΩ, $\tau = 32$ ms: $v_C = 40e^{-t/32\,\text{ms}}$ V.
> 3. The two resistors left share one voltage, so the right-hand 10 kΩ takes $40/(40 + 10) = 80\%$ of the power at every instant.
> 4. By 16 ms, which is $\tau/2$: $0.8\cdot3.2\text{ mJ}\cdot(1 - e^{-1}) = 1.62$ mJ.
> 5. 80%: $t = \tfrac{\tau}{2}\ln 5 = 25.8$ ms, 0.80 time constants.
> 6. The 40 kΩ absorbs the other 20%, 0.64 mJ.
> Answer: (a) $40e^{-t/32\,\text{ms}}$ V; (b) 1.62 mJ; (c) 25.8 ms; (d) 0.64 mJ.

> [!problem] Two charged capacitors in series, discharged together (d 3.5)
> At $t = 0^-$, $v_1 = 10$ V and $v_2 = 20$ V with the polarities shown, and the switch closes at $t = 0$. (a) Find $v_o(t)$. (b) Find $v_1(t)$ and $v_2(t)$. (c) When does $v_1$ pass through zero?
> ![Schematic: a 3 µF capacitor (v_1, plus on top) above a 6 µF capacitor (v_2, plus on top) on the left; from the top a switch closing at t = 0 leads to a 5 kΩ resistor on the right with v_o across it, plus on top, and the bottom rail closes the loop](el-first-order--p-series-caps.svg)
^inv-el-series-caps

> [!solution]- Solution
> methods: combine-initial-values, el-first-order/natural, time-to-value
> 1. In series the two act as $3\cdot6/9 = 2$ µF starting at $10 + 20 = 30$ V ([initial value of an equivalent](el-cap-ind.md#^combine-ic)), so $\tau = 5\text{ kΩ}\cdot2\ \mu\text{F} = 10$ ms and $v_o = 30e^{-t/10\,\text{ms}}$ V.
> 2. The loop current $i = 6e^{-t/10\,\text{ms}}$ mA leaves the top capacitor's $+$ plate and carries $6\text{ mA}\cdot10\text{ ms} = 60$ µC in all. So $v_1$ falls by $60/3 = 20$ V and $v_2$ by $60/6 = 10$ V, each along the same exponential: $v_1 = -10 + 20e^{-t/10\,\text{ms}}$ V and $v_2 = 10 + 10e^{-t/10\,\text{ms}}$ V. The DC circuit cannot give these final values: with both capacitors open, the node between them floats.
> 3. $v_1 = 0$ when $20e^{-t/\tau} = 10$: $t = 10\ln 2 = 6.93$ ms.
> 4. Check, energy: the capacitors start with $\tfrac12\cdot3\cdot10^2 + \tfrac12\cdot6\cdot20^2 = 1350$ µJ. The resistor receives the equivalent's $\tfrac12\cdot2\cdot30^2 = 900$ µJ, and $\tfrac12(3 + 6)\cdot10^2 = 450$ µJ stays [trapped](el-cap-ind.md#^trapped-energy), with $v_1 = -10$ V and $v_2 = 10$ V: $900 + 450 = 1350$.
> Answer: (a) $30e^{-t/10\,\text{ms}}$ V; (b) $v_1 = -10 + 20e^{-t/10\,\text{ms}}$ V, $v_2 = 10 + 10e^{-t/10\,\text{ms}}$ V; (c) 6.93 ms.

> [!problem] A coil charged, then cut loose (d 3.5)
> The coil carries no current before $t = 0$. The left switch closes at $t = 0$ and the right one opens at $t = 10$ ms. (a) Sketch $i_L$ and $v_o$ for $0 \le t \le 20$ ms before computing anything. (b) Find $i_L(t)$ on both intervals. (c) Find $v_o$ just before and just after 10 ms. (d) When has $i_L$ fallen to 0.5 A?
> ![Schematic: a 12 V source, plus on top, a switch closing at t = 0, a closed switch opening at t = 10 ms and 4 Ω into the top node; from that node a 40 mH inductor (i_L down) and 12 Ω (v_o across it, plus on top) to the bottom rail](el-first-order--p-two-stage-coil.svg)
^inv-el-two-stage-coil

> [!solution]- Solution
> methods: sequential-switching, zero-plus-circuit, time-to-value
> 1. $0 < t < 10$ ms: the coil sees $4 \parallel 12 = 3$ Ω, $\tau_1 = 40/3 = 13.3$ ms, and $i_L(\infty) = 12/4 = 3$ A: $i_L = 3(1 - e^{-t/13.3\,\text{ms}})$ A.
> 2. $v_o$ is the coil's voltage. At 0⁺ the coil is an open circuit, so $v_o(0^+) = 12\cdot12/16 = 9$ V, and $v_o = 9e^{-t/13.3\,\text{ms}}$ V.
> 3. At 10 ms: $i_L = 3(1 - e^{-0.75}) = 1.58$ A and $v_o(10^-) = 9e^{-0.75} = 4.25$ V.
> 4. $t > 10$ ms: the coil drives its 1.58 A up through the 12 Ω alone, so $v_o(10^+) = -12\cdot1.58 = -19.0$ V, $\tau_2 = 40/12 = 3.33$ ms and $i_L = 1.58e^{-(t - 10\,\text{ms})/3.33\,\text{ms}}$ A.
> 5. $1.58e^{-(t - 10)/3.33} = 0.5$ at $t = 10 + 3.33\ln(1.58/0.5) = 13.8$ ms.
> 6. Check, KCL at $10^-$: the 4 Ω carries $(12 - 4.25)/4 = 1.94$ A, and $4.25/12 + 1.58 = 1.94$ A leaves through the 12 Ω and the coil.
>
>    ![Plot: i_L rises from 0 with τ = 13.3 ms to 1.58 A at 10 ms, then falls with τ = 3.33 ms, passing 0.5 A at 13.8 ms; v_o jumps from 0 to 9 V at t = 0, decays to 4.25 V at 10 ms, jumps to −19.0 V, then decays to zero](el-first-order--p-two-stage-coil-curves.svg)
>
> Answer: (b) as in steps 1 and 4; (c) 4.25 V, then −19.0 V; (d) 13.8 ms.

> [!problem] A coil with a current-controlled source in its loop (d 4.5)
> The coil carries no current before the switch closes at $t = 0$. A fuse in series with the coil, not drawn, blows at 10 A. (a) Draw the Thevenin equivalent the coil sees, with $V_{th}$ and $R_{th}$ as functions of $r$. (b) For $r = 2.5$ Ω, find $i_L(t)$. Does the fuse blow? (c) For $r = 7.5$ Ω, find $i_L(t)$ and when the fuse blows. (d) What happens at $r = 5$ Ω?
> ![Schematic: a 10 V source, plus on top, a switch closing at t = 0 and 5 Ω carrying i_1 to the right into a node; 20 Ω from that node to the bottom rail; a 50 mH inductor along the top from that node (i_L to the right), then a controlled voltage source r i_1 down to the bottom rail with its plus at the bottom](el-first-order--p-runaway-coil.svg)
^inv-el-runaway-coil

> [!solution]- Solution
> methods: test-source, controlled-source-tau, time-to-value
> 1. KCL at the node, with the coil current $i_L$ leaving it: $(10 - v_b)/5 = v_b/20 + i_L$, so $v_b = 8 - 4i_L$ and $i_1 = 0.4 + 0.8i_L$.
> 2. The source's $+$ is at the bottom, so the coil's voltage, $+$ at its left end, is $v_b + r\,i_1 = (8 + 0.4r) - (4 - 0.8r)\,i_L$. That is $V_{th} - R_{th}i_L$ with $V_{th} = 8 + 0.4r$ V and $R_{th} = 4 - 0.8r$ Ω, $V_{th}$'s $+$ facing the coil's left end.
>
>    ![Schematic: the Thevenin equivalent the coil sees: a source V_th = 8 + 0.4r V, plus on top, and R_th = 4 − 0.8r Ω along the top, driving the 50 mH coil with i_L to the right, so V_th's plus faces the coil's left end, the 5 Ω/20 Ω node](el-first-order--p-runaway-coil-thevenin.svg)
> 3. $r = 2.5$: $V_{th} = 9$ V, $R_{th} = 2$ Ω, $\tau = 25$ ms, and $i_L = 4.5(1 - e^{-t/25\,\text{ms}})$ A. It settles at 4.5 A; the fuse holds.
> 4. $r = 7.5$: $V_{th} = 11$ V, $R_{th} = -2$ Ω, $\tau = -25$ ms. The DC solution is $11/(-2) = -5.5$ A, and the current runs away from it: $i_L = -5.5 + 5.5e^{t/25\,\text{ms}}$ A, positive and growing.
> 5. $-5.5 + 5.5e^{t/25\,\text{ms}} = 10$ at $t = 25\ln(15.5/5.5) = 25.9$ ms.
> 6. $r = 5$: $R_{th} = 0$, so $L\,di_L/dt = V_{th} = 10$ V, a ramp of 200 A/s that reaches 10 A at 50 ms.
> 7. Check, $r = 0$: $R_{th} = 5 \parallel 20 = 4$ Ω and $V_{th} = 10\cdot20/25 = 8$ V, the plain Thevenin equivalent.
> Answer: (a) $V_{th} = 8 + 0.4r$ V, $R_{th} = 4 - 0.8r$ Ω; (b) it rises to 4.5 A, no; (c) 25.9 ms; (d) a ramp, fuse at 50 ms.

## Derive

> [!derive] Prove that for a first-order response with $\tau > 0$, the tangent to $y(t)$ at any instant $t_1$ of an interval reaches $y(\infty)$ at $t_1 + \tau$.
^d-tangent

> [!solution]- Solution
> methods: general-solution
> 1. By Theorem 5, $dy/dt = -[y(t) - y(\infty)]/\tau$ at every instant of the interval.
> 2. The tangent at $t_1$ is $y(t_1) + (t - t_1)\,y'(t_1)$; at $t = t_1 + \tau$ it is $y(t_1) - [y(t_1) - y(\infty)] = y(\infty)$.
> 3. Check, Example 1 at 2 ms: $i_L + \tau\,di_L/dt = 4.52 - 3.02 = 1.50$ A.

> [!derive] An inductor carrying $I_0$ is cut off from its source at $t = 0$, leaving a resistor $R$ as its only path. Find the inductor's voltage at $0^+$, the time constant and the energy dissipated in $R$. What happens to each as $R \to \infty$, and what does that say about opening a switch in series with an inductor?
^d-inductive-kick

> [!solution]- Solution
> methods: zero-plus-circuit, energy-decay
> 1. At $0^+$ the inductor is a current source $I_0$ (Theorem 2) whose only path is $R$, so its voltage has size $I_0R$, with the polarity that keeps the current flowing: it delivers power.
> 2. $\tau = L/R$, and $R$ dissipates all of $\tfrac12LI_0^2$, whatever its value (Theorem 8).
> 3. As $R \to \infty$ the voltage grows without bound and $\tau$ shrinks to zero, while the energy stays $\tfrac12LI_0^2$. An opening switch with no other path is that limit: the voltage rises until the contacts arc, and the arc takes the energy. Flyback diodes, snubbers and make-before-break contacts exist to give the current a path.
> 4. Check: 2 A in 0.1 H released into 1 kΩ gives a 2 kV kick at $0^+$ (−2 kV across the inductor in the passive sign convention), $\tau = 100$ µs and 0.2 J.

> [!derive] A source steps from 0 to $V$ at $t = 0$ and back to 0 at $t = T$, driving an uncharged capacitor through a resistor, $\tau = RC$. Find $v_C$ for all $t > 0$ and its peak, and the peak's limits for $T \ll \tau$ and $T \gg \tau$.
^d-pulse

> [!solution]- Solution
> methods: sequential-switching, el-first-order/step
> 1. $0 < t < T$: $v_C = V(1 - e^{-t/\tau})$.
> 2. $t > T$: the source reads 0 V, so this is a natural response from $v_C(T)$: $v_C = V(1 - e^{-T/\tau})\,e^{-(t - T)/\tau}$. It rises before $T$ and falls after, so the peak is $v_C(T) = V(1 - e^{-T/\tau})$.
> 3. $T \ll \tau$: $1 - e^{-T/\tau} \approx T/\tau$, so the peak is about $VT/\tau$: a short pulse is integrated, $v_C \approx \frac{1}{RC}\int v_s\,dt$. $T \gg \tau$: the peak is $V$.
> 4. Check: 5 V for 1 ms into 10 kΩ and 1 µF peaks at 0.476 V, against $VT/\tau = 0.5$ V, and is down to 0.175 V one $\tau$ later.

> [!derive] The same source now repeats forever: $V$ for a time $T$, then 0 for a time $T$. Show that in periodic steady state, where each period repeats the one before, $v_C$ swings between $V/(1 + e^{T/\tau})$ and $V/(1 + e^{-T/\tau})$, a swing of $V\tanh\big(T/(2\tau)\big)$.
^d-square-wave

> [!solution]- Solution
> methods: sequential-switching, el-first-order/step
> 1. Let $q = e^{-T/\tau}$, and let $v_1$ and $v_2$ be $v_C$ at the start and end of a high half. High half: $v_2 = V + (v_1 - V)q$. Low half, back to the start: $v_1 = v_2q$.
> 2. Substitute: $v_2 = V(1 - q) + q^2v_2$, so $v_2 = V/(1 + q)$ and $v_1 = Vq/(1 + q) = V/(1 + e^{T/\tau})$.
> 3. The swing is $v_2 - v_1 = V(1 - q)/(1 + q) = V\tanh\big(T/(2\tau)\big)$.
> 4. Check: 10 V with $T = \tau = 10$ ms swings between 2.69 V and 7.31 V, 4.62 V; twenty simulated periods settle there.

> [!derive] A first-order quantity is sampled at three equally spaced instants, giving $y_1$, $y_2$, $y_3$ with spacing $\Delta$. Find $\tau$ and $y(\infty)$ from these three numbers alone.
^d-three-samples

> [!solution]- Solution
> methods: general-solution
> 1. Write $y_k = y(\infty) + Aq^k$ with $q = e^{-\Delta/\tau}$. Then $y_1 - y_2 = Aq(1 - q)$ and $y_2 - y_3 = Aq^2(1 - q)$, whose ratio is $q$: $\tau = \Delta\big/\ln\dfrac{y_1 - y_2}{y_2 - y_3}$.
> 2. The distances from $y(\infty)$ form a geometric sequence, so $(y_2 - y_\infty)^2 = (y_1 - y_\infty)(y_3 - y_\infty)$. The squares of $y_\infty$ cancel: $y(\infty) = \dfrac{y_1y_3 - y_2^2}{y_1 + y_3 - 2y_2}$.
> 3. Check: Example 1's $v_o$ at 2, 4 and 6 ms, −15.10, −9.13 and −5.13 V, gives back 5.0 ms and 3.0 V.
