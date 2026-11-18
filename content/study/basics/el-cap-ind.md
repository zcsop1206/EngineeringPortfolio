---
study: basic
id: el-cap-ind
title: Capacitors and inductors
area: el
needs: [el-dc-analysis]
build: 1
tracks: [mie342, interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [Kirchhoff's current law](el-dc-analysis.md#^kcl) and [voltage law](el-dc-analysis.md#^kvl), the [passive sign convention](el-dc-analysis.md#^psc) and the power it defines, [series and parallel reduction](el-dc-analysis.md#^series-parallel), and calculus up to the fundamental theorem. What a circuit does after a switch moves (RC and RL circuits) is in [el-first-order](el-first-order.md#^first-order-form), which stands on this doc.
^needs

A resistor ties its voltage to its current at the same instant. A capacitor ties its current to how fast its voltage changes, and an inductor ties its voltage to how fast its current changes. So both remember: what they do now depends on their whole past, carried in one number, a voltage or a current. Everything below follows from the two laws.
^thread

## The two laws

> [!def] Capacitor
> A **capacitor** is two conductors, the **plates**, separated by an insulator. In a circuit the plates hold equal and opposite charges, $q$ and $-q$: the current "through" a capacitor brings charge to one plate while the same charge leaves the other, and none crosses the insulator. The voltage $v$ from the $+q$ plate to the other is proportional to the charge: $q = Cv$. The constant $C > 0$ is the **capacitance**, in farads (1 F = 1 C/V; circuits use pF to mF).
^cap-def

> [!def] Inductor
> An **inductor** is a coil of wire. Its current $i$ makes a magnetic flux through the turns. The **flux linkage** $\lambda$, that flux added up over every turn it passes through, is proportional to the current: $\lambda = Li$, in webers (Wb). The constant $L > 0$ is the **inductance**, in henries (1 H = 1 Wb/A; circuits use µH to H). By Faraday's law a changing flux linkage induces a voltage $v = d\lambda/dt$ across the coil, positive at the terminal where $i$ enters.
^ind-def

Both laws read $v$ and $i$ in the [passive sign convention](el-dc-analysis.md#^psc): the reference current enters the terminal marked $+$.
^ref-directions

![Schematic: a capacitor (top plate +q, bottom plate −q) and an inductor, each with i entering the + terminal of v](el-cap-ind--elements.svg)

> [!thm] Theorem 1 (capacitor law)
> In the passive sign convention, $i = C\,\dfrac{dv}{dt}$.
^cap-law

> [!proof]- Proof
> 1. The reference current carries charge onto the $+$ plate, so $i = dq/dt$.
> 2. $q = Cv$ with $C$ constant, so $dq/dt = C\,dv/dt$.
^p-cap-law

> [!thm] Theorem 2 (inductor law)
> In the passive sign convention, $v = L\,\dfrac{di}{dt}$.
^ind-law

> [!proof]- Proof
> 1. Faraday's law, with $+$ at the terminal where $i$ enters: $v = d\lambda/dt$.
> 2. $\lambda = Li$ with $L$ constant, so $d\lambda/dt = L\,di/dt$.
^p-ind-law

A constant voltage, however large, draws no capacitor current, and a constant current puts no voltage across an inductor. With one reference reversed (the current leaving the $+$ terminal) each law gains a minus sign: $i = -C\,dv/dt$ and $v = -L\,di/dt$.
^law-signs

The two laws are one law with $v \leftrightarrow i$, $C \leftrightarrow L$ and $q \leftrightarrow \lambda$ exchanged. Every statement below has a **dual**, made by those swaps together with series $\leftrightarrow$ parallel, KCL $\leftrightarrow$ KVL and open $\leftrightarrow$ short, and proved by the same swaps in its proof. (An **open circuit** is a gap: no current, whatever the voltage. A **short circuit** is a wire: no voltage, whatever the current.)
^duality

## Integral forms

> [!def] Just before and just after
> For an instant $t_0$, $f(t_0^-)$ and $f(t_0^+)$ are the limits of $f(t)$ as $t$ approaches $t_0$ from below and from above. A quantity **jumps** (has an instantaneous change) at $t_0$ when the two differ. Switching problems write $0^-$ and $0^+$.
^one-sided

> [!thm] Theorem 3 (capacitor voltage from its current)
> For any instants $t_0$ and $t$,
> $$v(t) = v(t_0) + \frac1C\int_{t_0}^{t} i(s)\,ds.$$
> The **initial voltage** $v(t_0)$ carries everything that happened before $t_0$.
^cap-integral

> [!proof]- Proof
> 1. The charge on the $+$ plate changes only by the charge the current brings: $q(t) = q(t_0) + \int_{t_0}^t i\,ds$.
> 2. Divide by $C$, using $q = Cv$.
^p-cap-integral

> [!thm] Theorem 4 (inductor current from its voltage)
> For any instants $t_0$ and $t$,
> $$i(t) = i(t_0) + \frac1L\int_{t_0}^{t} v(s)\,ds.$$
> The **initial current** $i(t_0)$ carries everything that happened before $t_0$.
^ind-integral

> [!proof]- Proof
> 1. Faraday's law integrated: the flux linkage changes by the volt-seconds applied, $\lambda(t) = \lambda(t_0) + \int_{t_0}^t v\,ds$.
> 2. Divide by $L$, using $\lambda = Li$.
^p-ind-integral

To get $v_C$ from a sketch of $i_C$, run the area: from its initial value, $v_C$ moves by the area under $i_C$ divided by $C$. A constant current gives a ramp, a ramp gives a parabola, and a step in the current gives a corner, never a step. The other way round, $i_C$ is $C$ times the slope of $v_C$, so a voltage made of straight pieces gives a current made of constant pieces. For an inductor, read $v_L$ for $i_C$, $i_L$ for $v_C$ and $L$ for $C$. Units that keep the arithmetic small: mA times ms is µC, and µC over µF is V; V times ms is mWb, and mWb over mH is A; µF times V² is µJ, and mH times A² is mJ.
^area

As circuits, Theorems 3 and 4 say this: from $t_0$ on, a capacitor holding $V_0$ behaves at its terminals like an uncharged capacitor in series with a constant voltage source $V_0$, its $+$ toward the $+$ terminal, and an inductor carrying $I_0$ behaves like an inductor with no initial current in parallel with a constant current source $I_0$ in the direction of $i$ ([derive](#^d-ic-models)).
^ic-models

![Schematic: a capacitor at V0 equals an uncharged capacitor in series with a voltage source V0, + toward the + terminal; an inductor carrying I0 equals an inductor with no current in parallel with a source I0 in the direction of i](el-cap-ind--ic-models.svg)

## Energy

> [!thm] Theorem 5 (stored energy)
> A capacitor at voltage $v$ stores $w_C = \tfrac12Cv^2$; an inductor carrying $i$ stores $w_L = \tfrac12Li^2$. The power each absorbs, $p = vi$, is exactly the rate of change of that energy, so an ideal capacitor or inductor dissipates nothing. It absorbs power while $|v_C|$ (or $|i_L|$) grows and returns it while $|v_C|$ (or $|i_L|$) shrinks.
^energy

> [!proof]- Proof (d 2)
> 1. In the passive sign convention the power absorbed is $p = vi$.
> 2. Capacitor: by Theorem 1, $p = Cv\,\dfrac{dv}{dt} = \dfrac{d}{dt}\left(\tfrac12Cv^2\right)$.
> 3. So the energy absorbed from $t_1$ to $t_2$ is $\int_{t_1}^{t_2}p\,dt = \tfrac12Cv(t_2)^2 - \tfrac12Cv(t_1)^2$: it depends only on the two end voltages, never on the path between them.
> 4. An uncharged capacitor holds no energy. With $v(t_1) = 0$: any route to $v$ stores $\tfrac12Cv^2$, all of which returns when $v$ returns to zero.
> 5. Inductor: by Theorem 2, $p = Li\,\dfrac{di}{dt} = \dfrac{d}{dt}\left(\tfrac12Li^2\right)$; repeat steps 3 and 4.
> 6. $\tfrac12Cv^2 = \tfrac12C|v|^2$ rises exactly while $|v|$ rises, and $p$ is its rate of change.
^p-energy

The energy stored at an instant needs only $v_C$ or $i_L$ at that instant. The sign of the power is the sign of $vi$, not of $i$: a capacitor fed a positive current still returns energy while its voltage is negative and rising toward zero.
^energy-reading

## What cannot jump

> [!thm] Theorem 6 (continuity)
> If the current through a capacitor stays bounded near $t_0$, its voltage does not jump: $v_C(t_0^+) = v_C(t_0^-)$. If the voltage across an inductor stays bounded near $t_0$, its current does not jump: $i_L(t_0^+) = i_L(t_0^-)$. Nothing else is protected: the capacitor's current, the inductor's voltage, and the voltages and currents of resistors and sources may all jump.
^continuity

> [!proof]- Proof (d 2)
> 1. Let $|i| \le M$ near $t_0$. By Theorem 3, $|v(t) - v(t_0)| = \frac1C\left|\int_{t_0}^t i\,ds\right| \le \frac MC|t - t_0|$.
> 2. The bound tends to zero as $t \to t_0$ from either side, so $v(t_0^-) = v(t_0^+) = v(t_0)$.
> 3. Inductor: the same with Theorem 4 and a bound on $v$.
> 4. The rest can jump: switch 10 V through 1 kΩ onto an uncharged capacitor at $t = 0$. At $0^+$ the capacitor still reads 0 V, so the resistor's voltage jumps from 0 to 10 V, and its current, the capacitor's too, from 0 to 10 mA.
>
>    ![Schematic: a 10 V source, a switch closing at t = 0, 1 kΩ carrying i, and an uncharged capacitor C in one loop](el-cap-ind--switch-on.svg)
^p-continuity

At a switching instant, carry $v_C$ and $i_L$ across unchanged and recompute everything else from them ([the 0⁺ circuit](el-first-order.md#^zero-plus)). To test a quantity given by formulas for a jump at $t_0$, compare its one-sided values: for $v_C$ or $i_L$ the two formulas, which must agree; for $i_C = C\,dv_C/dt$ or $v_L = L\,di_L/dt$ the two one-sided slopes. Joining a capacitor straight to an ideal voltage source, or to another capacitor, at a different voltage forces $v_C$ to jump: the bounded-current condition of Theorem 6 fails.
^switch-rule

## Reading waveforms

$v_C$ rises while $i_C > 0$ and falls while $i_C < 0$, so $v_C$ peaks where $i_C$ changes sign from positive to negative, whether it crosses zero smoothly or jumps across it ([derive](#^d-peak-at-zero)). The extreme values of $v_L = L\,di/dt$ sit where $d^2i/dt^2$ changes sign, smoothly or by jumping across zero (a corner in $v_L$), where $di/dt$ jumps (compare the one-sided values), or at the ends of the interval: check all three. Swap $v$ and $i$ for the duals.
^extremes

> [!example] A capacitor fed a ramp, then a step
> A 2 µF capacitor holds −8 V at $t = 0$. Its current, in the passive sign convention, is the waveform below: a ramp from 0 to 10 mA over the first 4 ms, then −10 mA until 6 ms, then zero. Find $v(t)$, the energy stored at 2 ms, and when the capacitor delivers power.
>
> ![Plot: the current, a ramp from 0 to 10 mA over 0 to 4 ms, −10 mA from 4 to 6 ms, then zero](el-cap-ind--ramp-step-given.svg)
^ex-ramp-step

> [!solution]- Solution
> methods: capacitor-integral, stored-energy
> 1. On 0 to 4 ms, $i = 2.5t$ mA ($t$ in ms), whose area since 0 is $1.25t^2$ µC: $v = -8 + 0.625t^2$ V, a parabola reaching 2 V at 4 ms.
> 2. On 4 to 6 ms, −10 mA moves $v$ at $-10/2 = -5$ V/ms from 2 V: $v = 2 - 5(t - 4)$ V, down to −8 V at 6 ms, where it stays.
> 3. At 2 ms, $v = -5.5$ V and $w = \tfrac12(2)(5.5)^2 = 30.3$ µJ.
> 4. It delivers where $vi < 0$: from 0 until $v$ crosses zero at $\sqrt{12.8} = 3.58$ ms, and from 4 ms until $v$ crosses zero at 4.4 ms.
> 5. Check: the net charge is $20 - 20 = 0$ µC, so $v$ ends where it began, at −8 V with 64 µJ. It has a corner where the current jumps, never a step.
>
>    ![Plot: current, voltage and energy; v is a parabola up to 2 V at 4 ms, then a line down to −8 V; w touches zero at 3.58 and 4.4 ms; delivering intervals shaded](el-cap-ind--ramp-step.svg)
>
> Answer: $v(t)$ as in steps 1 and 2; 30.3 µJ at 2 ms; delivers on 0 to 3.58 ms and 4 to 4.4 ms.

> [!example] An inductor current that rings up
> A 20 mH inductor carries no current before $t = 0$, and $i = 2 - 2e^{-300t}(\cos 400t + 0.75\sin 400t)$ A after ($t$ in s, passive sign convention). When is its voltage largest, and what is it? What energy does it hold then, and after a long time? Does the current or the voltage jump at $t = 0$?
^ex-ringing

> [!solution]- Solution
> methods: inductor-law, stored-energy, continuity
> 1. Differentiate: the cosine terms cancel, $di/dt = 2(300\cdot0.75 + 400)e^{-300t}\sin 400t = 1250e^{-300t}\sin 400t$ A/s, so $v = L\,di/dt = 25e^{-300t}\sin 400t$ V.
> 2. $dv/dt = 25e^{-300t}(400\cos 400t - 300\sin 400t)$ is first zero where $\tan 400t = 4/3$: $t_1 = \arctan(4/3)/400 = 2.32$ ms, with $\sin 400t_1 = 0.8$ and $\cos 400t_1 = 0.6$.
> 3. $v(t_1) = 25e^{-0.6955}(0.8) = 9.98$ V. Later extremes alternate in sign and shrink by $e^{-300\pi/400} = 0.095$ each, and $v(0^+) = 0$, so this is the largest.
> 4. $i(t_1) = 2 - 2e^{-0.6955}(0.6 + 0.6) = 0.8028$ A, so $w = \tfrac12(20)(0.8028)^2 = 6.44$ mJ. In the end $i \to 2$ A and $w \to 40$ mJ.
> 5. Nothing jumps: $i(0^+) = 0 = i(0^-)$ and $v(0^+) = 0 = v(0^-)$. The coefficient $0.75 = 300/400$ is what makes $di/dt$ start at zero.
>
>    ![Plot: i rises from 0, overshoots 2 A and settles; v rises to 9.98 V at 2.32 ms, where i is 0.803 A (marked), then dips slightly negative](el-cap-ind--ringing.svg)
>
> Answer: 9.98 V at 2.32 ms; 6.44 mJ then and 40 mJ in the end; nothing jumps.

## DC steady state

> [!def] DC steady state
> A circuit is in **DC steady state** when every voltage and current in it is constant. A circuit with constant sources reaches it if its [natural response](el-first-order.md#^natural) dies away. That can fail: a controlled source can make the response grow ([negative τ](el-first-order.md#^dependent-tau)), and a capacitor and an inductor with no resistance to damp them ring forever. "The switch has been in this position for a long time" says that the circuit has reached it.
^dc-def

> [!thm] Theorem 7 (capacitors and inductors at DC)
> In DC steady state every capacitor carries no current and every inductor has no voltage. So the circuit can be solved with each capacitor replaced by an open circuit and each inductor by a short circuit. The capacitor keeps its voltage and the inductor its current, and they store $\tfrac12Cv_C^2$ and $\tfrac12Li_L^2$.
^dc-steady

> [!proof]- Proof
> 1. $v_C$ is constant, so $dv_C/dt = 0$ and $i_C = 0$ by Theorem 1.
> 2. $i_L$ is constant, so $v_L = 0$ by Theorem 2.
^p-dc-steady

A dependent source controlled by $v_C$ or $i_L$ keeps working. Two things DC analysis cannot settle: how capacitors in series share a voltage, and how inductors in parallel share a current. Both depend on the past ([Theorem 11](#^trapped-energy)).
^dc-notes

> [!example] A controlled source, long after the circuit was connected
> The circuit below has been connected for a long time. Find the energy stored in the capacitor and in the inductor, and check that the powers balance.
>
> ![Schematic: 24 V source, 3 Ω, 20 mH carrying i_L into a node with 6 Ω to ground and a source 0.5 i_L pushing up into it; 100 µF from the source top to that node, v_C + on the source side](el-cap-ind--dc-circuit.svg)
^ex-dc-energy

> [!solution]- Solution
> methods: dc-steady-state, dependent-source, power-balance
> 1. Redraw for DC: the capacitor opens; the inductor becomes a short that still carries $i_L$, so the controlled source still pushes $0.5i_L$.
>
>    ![Schematic: the same circuit with the inductor a short carrying i_L and the capacitor an open circuit across which v_C appears](el-cap-ind--dc-equivalent.svg)
> 2. KCL at the right-hand node, at voltage $v$: $1.5i_L = v/6$, so $v = 9i_L$. KVL around the left loop: $24 = 3i_L + 9i_L$, so $i_L = 2$ A and $v = 18$ V.
> 3. $v_C = 24 - 18 = 6$ V. Energies: $\tfrac12(100)(6)^2 = 1800$ µJ $= 1.8$ mJ and $\tfrac12(20)(2)^2 = 40$ mJ.
> 4. Check: the 24 V source delivers $24\cdot2 = 48$ W and the controlled source $18\cdot1 = 18$ W; the resistors absorb $3\cdot2^2 = 12$ W and $18^2/6 = 54$ W; both sides make 66 W.
> Answer: 1.8 mJ in the capacitor, 40 mJ in the inductor.

## Series and parallel

> [!thm] Theorem 8 (capacitors combined)
> Capacitors in parallel act at their two terminals as one capacitor $C_{eq} = C_1 + \cdots + C_n$. Capacitors in series act as one with $\dfrac1{C_{eq}} = \dfrac1{C_1} + \cdots + \dfrac1{C_n}$.
^combine-c

> [!proof]- Proof (d 1.5)
> 1. In parallel they share one voltage $v$ (KVL), and the terminal current is the sum of theirs (KCL): $i = \sum C_k\,dv/dt = \left(\sum C_k\right)dv/dt$.
> 2. In series they carry one current $i$ (KCL), and $v = \sum v_k$ (KVL): $dv/dt = \sum i/C_k = i\sum 1/C_k$.
^p-combine-c

> [!thm] Theorem 9 (inductors combined)
> Inductors in series act at their two terminals as one inductor $L_{eq} = L_1 + \cdots + L_n$. Inductors in parallel act as one with $\dfrac1{L_{eq}} = \dfrac1{L_1} + \cdots + \dfrac1{L_n}$. (The inductors must not share flux: each one's linkage comes from its own current.)
^combine-l

> [!proof]- Proof (d 1.5)
> 1. In series they carry one current: $v = \sum L_k\,di/dt = \left(\sum L_k\right)di/dt$.
> 2. In parallel they share one voltage: $di/dt = \sum di_k/dt = v\sum 1/L_k$.
^p-combine-l

So capacitors combine like conductances and inductors like resistances: reduce a network of either exactly as a [resistor network](el-dc-analysis.md#^series-parallel). Theorems 8 and 9 fix the terminal law; Theorem 10 fixes where the equivalent starts.
^combine-rule

> [!thm] Theorem 10 (initial value of an equivalent)
> (a) Capacitors in series: the equivalent starts at $v(t_0) = \sum_k v_k(t_0)$, each initial voltage counted positive when its $+$ faces the string's $+$ terminal.
> (b) Inductors in parallel: the equivalent starts at $i(t_0) = \sum_k i_k(t_0)$, each initial current counted positive when it flows the same way as the total current $i$.
> (c) Capacitors in parallel share their voltage at every instant, so they and their equivalent start at one common voltage. Inductors in series likewise start at one common current.
^combine-ic

> [!proof]- Proof (d 2)
> 1. Series string, one current $i$: by Theorem 3, $v_k(t) = v_k(t_0) + \frac1{C_k}\int_{t_0}^t i\,ds$.
> 2. Add them (KVL): $v(t) = \sum v_k(t_0) + \left(\sum\frac1{C_k}\right)\int_{t_0}^t i\,ds$, which is Theorem 3 for one capacitor $C_{eq}$ starting at $\sum v_k(t_0)$.
> 3. Parallel inductors, one voltage $v$: by Theorem 4, $i_k(t) = i_k(t_0) + \frac1{L_k}\int_{t_0}^t v\,ds$; add them (KCL) the same way.
> 4. (c) is KVL around the loop of two parallel capacitors, and KCL at the node between two series inductors, at $t_0$.
^p-combine-ic

In the figure, the string reads $4 + 5 - 3 = 6$ V from a to b (the 2 µF capacitor's $+$ faces b) on $1/(1/3 + 1/6 + 1/2) = 1$ µF, and the parallel inductors carry $1 + 0.5 = 1.5$ A in $20\cdot30/50 = 12$ mH.
^combine-example

![Schematic: 3 µF at 4 V, 6 µF at 5 V (both + toward a) and 2 µF at 3 V (+ toward b) in series, equivalent to 1 µF at 6 V; 20 mH at 1 A and 30 mH at 0.5 A in parallel, equivalent to 12 mH at 1.5 A](el-cap-ind--combine.svg)

> [!thm] Theorem 11 (trapped energy)
> Capacitors $C_1, \dots, C_n$ in series hold charges $Q_k = C_kv_k$ (voltages read along the string); their equivalent holds $Q = C_{eq}v$ with $v = \sum v_k$. Then
> $$\sum_k \tfrac12C_kv_k^2 - \tfrac12C_{eq}v^2 = \sum_k \frac{(Q_k - Q)^2}{2C_k} \ \ge\ 0.$$
> This **trapped energy** stays fixed while current flows through the string, whatever the rest of the circuit does: the terminals can deliver at most $\tfrac12C_{eq}v^2$, and the rest stays in the capacitors. It is zero exactly when all the charges are equal, as when the string was charged from empty. Dually, inductors in parallel with flux linkages $\lambda_k = L_ki_k$ trap $\sum_k(\lambda_k - \lambda)^2/(2L_k)$, with $\lambda = L_{eq}i$, as a current circulating among them.
^trapped-energy

> [!proof]- Proof (d 3.5)
> 1. $v = \sum Q_k/C_k$, so $Q = C_{eq}\sum_k Q_k/C_k$: a weighted mean of the charges, with weights $C_{eq}/C_k$ that sum to 1 (Theorem 8).
> 2. Expand the right side: $\sum_k\frac{Q_k^2}{2C_k} - Q\sum_k\frac{Q_k}{C_k} + \frac{Q^2}{2}\sum_k\frac1{C_k} = \sum_k\tfrac12C_kv_k^2 - Qv + \frac{Q^2}{2C_{eq}} = \sum_k\tfrac12C_kv_k^2 - \tfrac12C_{eq}v^2$.
> 3. It is a sum of squares over positive $C_k$: never negative, and zero exactly when every $Q_k = Q$.
> 4. Current through the string adds the same charge to every $Q_k$ (one current), and so, by step 1, the same charge to $Q$. Every $Q_k - Q$ stays fixed, and the trapped energy with them.
> 5. The terminals see one capacitor $C_{eq}$ (Theorem 10), so by Theorem 5 they take out $\tfrac12C_{eq}v(t_0)^2 - \tfrac12C_{eq}v(t)^2$, at most $\tfrac12C_{eq}v(t_0)^2$.
> 6. Inductors in parallel: the dual, with flux linkages for charges; their one voltage adds the same volt-seconds to every $\lambda_k$ and to $\lambda$.
^p-trapped-energy

For two capacitors the trapped energy is $(Q_1 - Q_2)^2/(2(C_1 + C_2))$, and for two inductors $(\lambda_1 - \lambda_2)^2/(2(L_1 + L_2))$. In the figure, the string's parts hold $24 + 75 + 9 = 108$ µJ and its equivalent $\tfrac12(1)(6)^2 = 18$ µJ, so 90 µJ can never leave through a and b; the inductors hold 13.75 mJ against the equivalent's 13.5 mJ, trapping 0.25 mJ.
^trapped-two

> [!example] Two capacitors charged apart, then discharged as a string
> A 2 µF and a 6 µF capacitor were each charged to 10 V on their own, then joined in series so that their voltages add. At $t = 0$ the switch puts the string across 2 kΩ. Find the energy the resistor receives, each capacitor's final voltage, and the energy left in them.
>
> ![Schematic: 2 µF (v1) above 6 µF (v2), both + toward the top, switched at t = 0 across 2 kΩ](el-cap-ind--string.svg)
^ex-string

> [!solution]- Solution
> methods: combine-capacitors, combine-initial-values, trapped-energy
> 1. The string is $C_{eq} = 2\cdot6/8 = 1.5$ µF at $10 + 10 = 20$ V, holding $\tfrac12(1.5)(20)^2 = 300$ µJ; the resistor takes all of it as the string's voltage falls to zero.
> 2. The parts hold $100 + 300 = 400$ µJ, so 100 µJ is trapped: $(Q_1 - Q_2)^2/(2(C_1 + C_2)) = (20 - 60)^2/16 = 100$ µJ.
> 3. The string reaches 0 V once $C_{eq}\cdot20 = 30$ µC has left both capacitors: $v_1 = 10 - 30/2 = -5$ V and $v_2 = 10 - 30/6 = 5$ V. Check: $\tfrac12(2)(5)^2 + \tfrac12(6)(5)^2 = 100$ µJ.
> 4. The 2 kΩ sets only the time scale ([time constant](el-first-order.md#^tau) $RC_{eq} = 3$ ms).
>
>    ![Plot: v1 falls from 10 V to −5 V, v2 from 10 V to 5 V, their sum from 20 V to 0, with τ = 3 ms marked](el-cap-ind--string-discharge.svg)
>
> Answer: 300 µJ; $v_1 = -5$ V and $v_2 = 5$ V, holding 100 µJ.

## Problems

> [!problem] A ramp-and-hold voltage across a capacitor (d 2)
> The voltage across a 10 µF capacitor is the waveform below: 0 before $t = 0$, a ramp to 20 V at 2 ms, held until 5 ms, a ramp down to −10 V at 8 ms, then held. Sketch the current under it first. Then find $i(t)$ (passive sign convention), the energy stored at 6 ms, the largest power the capacitor absorbs, and when it delivers power.
>
> ![Plot: the voltage, a ramp from 0 to 20 V over 0 to 2 ms, held to 5 ms, a ramp to −10 V at 8 ms, then held](el-cap-ind--ramp-hold-given.svg)
^inv-el-ramp-hold

> [!solution]- Solution
> methods: capacitor-law, stored-energy
> 1. $i = C\,dv/dt$ on each straight piece (µF times V/ms is mA): $10 \times 10 = 100$ mA, then 0, then $10 \times (-10) = -100$ mA, then 0. The current jumps at every corner; the voltage never does.
> 2. At 6 ms, $v = 10$ V: $w = \tfrac12(10)(10)^2 = 500$ µJ $= 0.5$ mJ.
> 3. $vi$ grows along the first ramp to $20 \times 0.1 = 2$ W just before 2 ms; nothing later is larger.
> 4. It delivers where $vi < 0$: from 5 to 7 ms, while $|v|$ falls to zero. From 7 to 8 ms the same current charges it the other way.
> 5. Check: the current's area, $0.2 - 0.3 = -0.1$ mC, over 10 µF is the final −10 V.
>
>    ![Plot: the voltage with the current under it, 100 mA, 0, −100 mA, 0; shaded from 5 to 7 ms](el-cap-ind--ramp-hold.svg)
>
> Answer: 100, 0, −100, 0 mA; 0.5 mJ; 2 W; from 5 to 7 ms.

> [!problem] An inductor given a voltage pulse while carrying current (d 2)
> A 50 mH inductor carries −0.4 A at $t = 0$ (it flows against the reference direction; $v$ and $i$ follow the passive sign convention). Its voltage is the waveform below: 5 V from 0 to 10 ms, −2 V from 10 to 20 ms, zero otherwise. Sketch $i(t)$. Then find when the current passes through zero, the energy at 10 ms and after 20 ms, and the constant voltage that, applied from 20 ms, would bring the current to zero at 25 ms.
>
> ![Plot: the voltage, 5 V from 0 to 10 ms, −2 V from 10 to 20 ms, zero otherwise](el-cap-ind--l-pulse-given.svg)
^inv-el-l-pulse

> [!solution]- Solution
> methods: inductor-integral, stored-energy
> 1. The slope of $i$ is $v/L$: $5/50 = 0.1$ A/ms on 0 to 10 ms, so $i = -0.4 + 0.1t$ A ($t$ in ms), zero at 4 ms and 0.6 A at 10 ms.
> 2. Then $-2/50 = -0.04$ A/ms: 0.2 A at 20 ms, held there once the voltage is zero.
> 3. $\tfrac12(50)(0.6)^2 = 9$ mJ at 10 ms; $\tfrac12(50)(0.2)^2 = 1$ mJ after 20 ms (4 mJ at the start).
> 4. $v = L\,\Delta i/\Delta t = 50 \times (-0.2)/5 = -2$ V (mH times A/ms is V).
>
>    ![Plot: the voltage with the current under it, from −0.4 A through zero at 4 ms to 0.6 A at 10 ms, down to 0.2 A at 20 ms, then flat](el-cap-ind--l-pulse.svg)
>
> Answer: 4 ms; 9 mJ and 1 mJ; −2 V.

> [!problem] Two capacitors, two inductors and a controlled source (d 2.5)
> The circuit below has been in this state for a long time. Redraw it as it then stands. Find the energy stored in each capacitor and each inductor, and the power the controlled source delivers.
>
> ![Schematic: 36 V source; 4 Ω; 10 mH carrying i_Δ; 6 Ω in parallel with 25 mH; a controlled voltage source 2 i_Δ, + on its right; 16 Ω and 10 µF to ground; from the node after the 4 Ω, 20 µF in series with 3 Ω to ground](el-cap-ind--four-store.svg)
^inv-el-four-store

> [!solution]- Solution
> methods: dc-steady-state, dependent-source, power-balance
> 1. The inductors are shorts, so the 6 Ω, shorted by the 25 mH, carries nothing. The capacitors are open, so the 3 Ω in series with the 20 µF carries and drops nothing.
>
>    ![Schematic: the same circuit after a long time, inductors shorted, capacitors open with v1 and v2 across them, the 6 Ω and 3 Ω greyed](el-cap-ind--four-store-dc.svg)
> 2. One loop carries $i_\Delta$, and the controlled source raises the voltage by $2i_\Delta$ along it: $36 - 4i_\Delta + 2i_\Delta - 16i_\Delta = 0$, so $i_\Delta = 2$ A.
> 3. $v_1 = 36 - 8 = 28$ V and $v_2 = 28 + 4 = 32$ V.
> 4. Energies: $\tfrac12(20)(28)^2 = 7840$ µJ and $\tfrac12(10)(32)^2 = 5120$ µJ in the capacitors; $\tfrac12(10)(2)^2 = 20$ mJ and $\tfrac12(25)(2)^2 = 50$ mJ in the inductors.
> 5. The controlled source delivers $2i_\Delta \cdot i_\Delta = 8$ W. Check: $72 + 8 = 16 + 64$ W (the two sources; the 4 Ω and the 16 Ω).
> Answer: 7.84 mJ (20 µF), 5.12 mJ (10 µF), 20 mJ (10 mH), 50 mJ (25 mH); 8 W.

> [!problem] A capacitor current made of two exponentials (d 3)
> A 2 µF capacitor holds −4 V at $t = 0$, when the current $i = 12e^{-2000t} - 4e^{-500t}$ mA ($t$ in s, passive sign convention) starts to flow into it. Find $v(t)$; the instant at which $v$ stops rising, and $v$ then; the energy stored then and as $t \to \infty$; and when the capacitor delivers energy.
>
> ![Plot: the current, zero before 0, 8 mA at 0, crossing zero near 0.7 ms, then slightly negative and decaying](el-cap-ind--two-exp-given.svg)
^inv-el-two-exp

> [!solution]- Solution
> methods: capacitor-integral, stored-energy
> 1. The charge delivered by $t$ is $6(1 - e^{-2000t}) - 8(1 - e^{-500t})$ µC, so $v = -4 + 3(1 - e^{-2000t}) - 4(1 - e^{-500t}) = -5 - 3e^{-2000t} + 4e^{-500t}$ V.
> 2. $v$ rises while $i > 0$ and stops where $12e^{-2000t} = 4e^{-500t}$: $t_1 = \ln 3/1500 = 0.732$ ms, where $v = -5 - 3\cdot3^{-4/3} + 4\cdot3^{-1/3} = -2.92$ V.
> 3. Energy then: $\tfrac12(2)(2.92)^2 = 8.53$ µJ, the least it ever holds, since $v < 0$ throughout. As $t \to \infty$, $v \to -5$ V and $w \to 25$ µJ (16 µJ at the start).
> 4. It delivers while $|v|$ shrinks: from 0 to 0.732 ms.
>
>    ![Plot: current and voltage; v rises from −4 V to −2.92 V at 0.732 ms, then falls toward −5 V; shaded where the capacitor delivers energy](el-cap-ind--two-exp.svg)
>
> Answer: $v = -5 - 3e^{-2000t} + 4e^{-500t}$ V; −2.92 V at 0.732 ms; 8.53 µJ, then 25 µJ; from 0 to 0.732 ms.

> [!problem] An inductor current given before and after t = 0 (d 3)
> A 20 mH inductor carries 3 A for $t \le 0$ and $i = 1 + e^{-250t}(2\cos 500t + 2\sin 500t)$ A for $t \ge 0$ ($t$ in s, passive sign convention). Sketch $i(t)$ for the first few milliseconds. Find $v(t)$ for $t < 0$ and for $t > 0$. Is there an instantaneous change in the current at $t = 0$? In the voltage? When is the current largest, and is the energy stored then more or less than at $t = 0$? What energy is stored as $t \to \infty$?
^inv-el-jump-test

> [!solution]- Solution
> methods: inductor-law, continuity, stored-energy
> 1. For $t < 0$, $i$ is constant, so $v = 0$.
> 2. For $t > 0$: $di/dt = e^{-250t}(500\cos 500t - 1500\sin 500t)$ A/s, so $v = e^{-250t}(10\cos 500t - 30\sin 500t)$ V.
> 3. $i(0^+) = 1 + 2 = 3$ A $= i(0^-)$: no jump, as a bounded voltage requires. But $v(0^-) = 0$ and $v(0^+) = 10$ V: the voltage jumps.
> 4. $i$ peaks where $v = 0$: $\tan 500t = 1/3$, $t = 0.644$ ms, $i = 3.154$ A. It then holds $\tfrac12(20)(3.154)^2 = 99.5$ mJ, more than the 90 mJ at $t = 0$: with $v > 0$ and $i > 0$ it was absorbing. Each later peak rises above 1 A by $e^{-\pi} = 0.043$ times the one before.
> 5. As $t \to \infty$, $i \to 1$ A: 10 mJ.
>
>    ![Plot: i is 3 A before 0, rises to 3.15 A at 0.644 ms, then rings toward 1 A; v is 0 before 0, jumps to 10 V at 0, then rings](el-cap-ind--jump.svg)
>
> Answer: $v = 0$, then $e^{-250t}(10\cos 500t - 30\sin 500t)$ V; $i$ does not jump, $v$ jumps by 10 V; 3.15 A at 0.644 ms, holding 99.5 mJ, more than 90 mJ; 10 mJ.

> [!problem] A capacitor network with initial voltages (d 3.5)
> The network below has the initial voltages shown. (a) Find its equivalent capacitance at a, b and the equivalent's initial voltage $v_{ab}$. (b) At $t = 0$ a resistor is connected across a, b. How much energy does it receive in all, and how much stays in the network? (c) What does the 3 µF capacitor read at the end?
>
> ![Schematic: from a, 6 µF at 10 V (+ toward a); then 4 µF at 6 V in parallel with two 4 µF in series at 5 V and 1 V (all + toward a); then 3 µF at 4 V (+ toward b) down to b](el-cap-ind--cap-network.svg)
^inv-el-cap-network

> [!solution]- Solution
> methods: combine-capacitors, combine-initial-values, trapped-energy
> 1. Inner pair: two 4 µF in series make 2 µF at $5 + 1 = 6$ V, matching the 4 µF across them as KVL requires; together 6 µF at 6 V.
> 2. The string from a to b: 6 µF at +10 V, 6 µF at +6 V, 3 µF at −4 V (its $+$ faces b). $C_{eq} = 1/(1/6 + 1/6 + 1/3) = 1.5$ µF at $v_{ab} = 10 + 6 - 4 = 12$ V.
> 3. The resistor receives the equivalent's $\tfrac12(1.5)(12)^2 = 108$ µJ of the parts' $300 + 72 + 50 + 2 + 24 = 448$ µJ; 340 µJ stays.
> 4. $v_{ab}$ reaches zero once $1.5 \times 12 = 18$ µC has left every string element. The 3 µF's charge, read along the string, goes from $-12$ to $-30$ µC: 10 V, its $+$ still toward b. Check: the others end at $(60 - 18)/6 = 7$ V and $(36 - 18)/6 = 3$ V, and $7 + 3 - 10 = 0$.
> Answer: (a) 1.5 µF, 12 V; (b) 108 µJ, 340 µJ; (c) 10 V, $+$ toward b.

> [!problem] Three inductors with initial currents across a resistor (d 3.5)
> In the circuit below, at $t = 0$ the 20 mH inductor carries $i_2 = 3$ A and the 80 mH inductor $i_3 = -0.5$ A, in the directions shown. (a) What does the 4 mH inductor carry at $t = 0$, and what equivalent inductance does the 10 Ω resistor see? (b) How much energy does the resistor absorb in all? (c) What currents are left in the three inductors after a long time, and what energy?
>
> ![Schematic: 10 Ω on the left; 4 mH carrying i1 rightward along the top to a node; 20 mH and 80 mH from that node down to the bottom rail, with i2 and i3 both flowing down](el-cap-ind--ind-network.svg)
^inv-el-ind-network

> [!solution]- Solution
> methods: combine-inductors, combine-initial-values, trapped-energy
> 1. KCL: $i_1 = 3 - 0.5 = 2.5$ A. $L_{eq} = 4 + 20\cdot80/100 = 20$ mH, carrying 2.5 A.
> 2. The resistor absorbs the equivalent's $\tfrac12(20)(2.5)^2 = 62.5$ mJ of the parts' $12.5 + 90 + 10 = 112.5$ mJ; 50 mJ is trapped in the parallel pair.
> 3. The pair shares one voltage, so the same volt-seconds $\Lambda$ change $i_2$ by $\Lambda/(20\text{ mH})$ and $i_3$ by $\Lambda/(80\text{ mH})$, and their sum falls by 2.5 A: $\Lambda(50 + 12.5) = -2.5$, $\Lambda = -0.04$ V s. So $i_2$ goes from 3 to 1 A, $i_3$ from −0.5 to −1 A, and $i_1$ to 0: 1 A circulates around the pair.
> 4. Check: $\tfrac12(20)(1)^2 + \tfrac12(80)(1)^2 = 50$ mJ $= (0.06 + 0.04)^2/(2 \times 0.1)$ J.
> Answer: (a) 2.5 A, 20 mH; (b) 62.5 mJ; (c) $i_1 = 0$, $i_2 = 1$ A, $i_3 = -1$ A, holding 50 mJ.

> [!problem] Two charged capacitors joined through a resistor (d 4)
> A 10 µF capacitor at 60 V and a 20 µF capacitor at 15 V, with its $+$ at the bottom, are joined at $t = 0$ through a resistor $R$ as shown. (a) At what voltage do they end? (b) How much energy does $R$ dissipate, and how does that depend on $R$? (c) What current $i$ flows at $0^+$ for $R = 50$ Ω, and for $R = 5$ Ω? (d) What do these answers say about joining the two with no resistor at all?
>
> ![Schematic: 10 µF at 60 V (+ on top), a switch closing at t = 0, a resistor R carrying i toward the 20 µF, and 20 µF at 15 V (+ at the bottom)](el-cap-ind--two-caps.svg)
^inv-el-two-caps

> [!solution]- Solution
> methods: trapped-energy, continuity, combine-initial-values
> 1. The joined top plates keep their total charge, $10 \times 60 - 20 \times 15 = 300$ µC, on 30 µF: both end at 10 V, top $+$.
> 2. Seen from $R$, the capacitors are in series around the loop: $10\cdot20/30 = 20/3 = 6.67$ µF at $60 + 15 = 75$ V. $R$ takes all of that equivalent's $\tfrac12(20/3)(75)^2 = 18.75$ mJ, whatever $R$ is; $R$ sets only the speed.
> 3. Check: $18 + 2.25 = 20.25$ mJ before, $\tfrac12(30)(10)^2 = 1.5$ mJ after (the pair's trapped energy), and $20.25 - 1.5 = 18.75$.
> 4. At $0^+$ neither voltage has moved, so all 75 V is across $R$: 1.5 A for 50 Ω, 15 A for 5 Ω.
> 5. As $R \to 0$ the current grows without bound while the loss stays 18.75 mJ. With no resistor the voltages jump, Theorem 6 no longer applies, and the energy goes into the wires' resistance, sparks and radiation. [Charging from a fixed source](dd-boolean-cmos.md#^dynamic-power) shows the same independence from $R$.
> Answer: (a) 10 V, top $+$ on both (the 20 µF reverses); (b) 18.75 mJ for any $R$; (c) 1.5 A and 15 A; (d) no resistance, however small, avoids the loss.

## Derive

> [!derive] Prove that from $t_0$ on, a capacitor holding $V_0$ at $t_0$ is equivalent at its terminals to an uncharged capacitor in series with a constant voltage source $V_0$, its $+$ toward the $+$ terminal, and that an inductor carrying $I_0$ at $t_0$ is equivalent to an inductor with no current at $t_0$ in parallel with a constant current source $I_0$ in the direction of $i$.
^d-ic-models

> [!solution]- Solution
> methods: capacitor-integral, inductor-integral
> 1. Series pair, one current $i$: the terminal voltage is $V_0 + \frac1C\int_{t_0}^t i\,ds$, which is Theorem 3 for the charged capacitor.
> 2. Parallel pair, one voltage $v$: the terminal current is $I_0 + \frac1L\int_{t_0}^t v\,ds$, which is Theorem 4.

> [!derive] Prove that inductors in series divide the voltage across the string in proportion to their inductances, and that capacitors in series that start uncharged divide it in inverse proportion to their capacitances. Then give each capacitor's voltage when they start charged.
^d-dividers

> [!solution]- Solution
> methods: combine-inductors, combine-capacitors, combine-initial-values
> 1. Series inductors share $di/dt = v/L_{eq}$, so $v_k = L_k\,di/dt = (L_k/L_{eq})\,v$.
> 2. Series capacitors share $i$. Uncharged, $v_k = \frac1{C_k}\int i$ and $v = \frac1{C_{eq}}\int i$, so $v_k = (C_{eq}/C_k)\,v$.
> 3. Charged: $v_k(t) = v_k(t_0) + (C_{eq}/C_k)\left[v(t) - v(t_0)\right]$: the divider acts on the change only.

> [!derive] Prove that a capacitor's voltage can have a maximum or a minimum at an instant where its current is continuous only if the current is zero there. State and prove the dual for an inductor, and give a waveform where $v_C$ peaks with a current that is never zero near the peak.
^d-peak-at-zero

> [!solution]- Solution
> methods: capacitor-law, capacitor-integral
> 1. Where $i$ is continuous, $v$ is differentiable with $dv/dt = i/C$ (Theorem 3 and the fundamental theorem). At an interior extremum the derivative is zero, so $i = 0$.
> 2. Dual: an inductor's current has an extremum where its voltage is continuous only if the voltage is zero there.
> 3. Where $i$ jumps from positive to negative, $v$ has a corner and peaks with $i \ne 0$ on both sides, as in the [ramp-then-step example](#^ex-ramp-step) at 4 ms.

> [!derive] Prove that in any circuit of sources (independent or dependent), resistors, capacitors and inductors, the total energy stored in the capacitors and inductors rises at exactly the rate the sources deliver power minus the rate the resistors absorb it.
^d-energy-balance

> [!solution]- Solution
> methods: power-balance, stored-energy
> 1. The absorbed powers of all the elements sum to zero at every instant ([power balance](el-dc-analysis.md#^power-balance); its proof uses only KCL and KVL at one instant).
> 2. Group them: $\sum_{C,L} p + \sum_R p + \sum_{\text{sources}} p = 0$.
> 3. Each capacitor's or inductor's $p$ is the rate of change of its stored energy (Theorem 5), and a source's absorbed power is minus the power it delivers. Rearrange.
