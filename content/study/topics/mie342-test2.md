---
study: topic
id: mie342-test2
title: "MIE342 test 2: circuits"
area: el
needs: [el-dc-analysis, el-equivalents, el-cap-ind, el-first-order]
build: 2
tracks: [mie342]
---

> Written by a model for Adit. Not Adit's words.

Test 2 is on 2026-11-18, 11:20 to 12:30: node voltages and mesh currents (one question names the method, the rest leave it to you), Thevenin equivalents, capacitors and inductors, and RC and RL circuits. That is problem sets 4 to 7 without the op-amp problems 7.15 and 7.16. Every result below is proved in one of four basics and only named here: [node voltages and mesh currents](../basics/el-dc-analysis.md), [Thevenin, Norton and superposition](../basics/el-equivalents.md), [capacitors and inductors](../basics/el-cap-ind.md), and [RC and RL circuits](../basics/el-first-order.md). The course problems are in the [bank](../bank/mie342.md) by number, mie342-4-1 to mie342-7-14. This morning: about 40 minutes on the theory, down Recognise and then First moves and Traps, saying each cue's result before opening its link and reading the linked statement only when you cannot; about 70 minutes on Try, in order, making the call first, with a timer on; then 20 to 30 minutes on the linked passages for whatever you missed. The basics are for misses and for the final, not for reading cover to cover today.
^intro

## Recognise

- A single loop or a single pair of nodes: [KVL](../basics/el-dc-analysis.md#^kvl) around it or [KCL](../basics/el-dc-analysis.md#^kcl) at it, with Ohm's law $v = Ri$ for each resistor in the [passive sign convention](../basics/el-dc-analysis.md#^psc). An ideal [source](../basics/el-dc-analysis.md#^sources) fixes only its own voltage or current; the rest of the circuit sets the other. ^cue-one-loop
- "Equivalent resistance", resistors end to end or between the same two nodes, a voltage split along a string or a current split between branches: [series, parallel and dividers](../basics/el-dc-analysis.md#^series-parallel). ^cue-series-parallel
- The question names the method, "use the node-voltage method" or "use the mesh-current method": that method, even where the other is shorter ([node voltages](../basics/el-dc-analysis.md#^node-method), [mesh currents](../basics/el-dc-analysis.md#^mesh-method)). ^cue-named-method
- "Which would you use, node voltages or mesh currents, and why?": the method with fewer equations, counted on [essential nodes and meshes](../basics/el-dc-analysis.md#^graph) before solving ([choosing a method](../basics/el-dc-analysis.md#^choose-method)). ^cue-which-method
- A voltage source, independent or dependent, alone in a branch between two essential nodes, neither of them the reference: a [supernode](../basics/el-dc-analysis.md#^supernode). From a node to the reference, it simply fixes that node's voltage. ^cue-floating-source
- A current source in a branch two meshes share: a [supermesh](../basics/el-dc-analysis.md#^supermesh). On the outer boundary, it simply fixes that mesh's current. ^cue-shared-source
- A diamond labelled with a multiple of another quantity, such as $5i_\Delta$ or $0.4v_a$: a [dependent source](../basics/el-dc-analysis.md#^dependent-sources), whose controlling quantity has to be written in the unknowns. It may be the only link between two parts of the drawing: each part then gets its own equations (for node voltages, its own reference node), coupled through the controlling quantities. ^cue-diamond
- "Power developed" (power delivered: minus the power absorbed), "power absorbed by the dependent source", "show that the power dissipated equals the power developed": the [passive sign convention](../basics/el-dc-analysis.md#^psc) for each element and the [power balance](../basics/el-dc-analysis.md#^power-balance) for the check. ^cue-power
- A source value to be chosen so that some current is zero, or meets some other condition: the condition is one more equation and the source value one more unknown, and [linearity](../basics/el-equivalents.md#^linearity) says one value does it, provided the source moves that current at all. ^cue-zero-condition
- "Use superposition", or one source's share of a voltage or current: [superposition](../basics/el-equivalents.md#^superposition), each independent source alone with the others zeroed, every dependent source kept in each sub-circuit. ^cue-superposition
- "A succession of source transformations": [source transformation](../basics/el-equivalents.md#^source-transform); a resistor across an ideal voltage source, or in series with an ideal current source, changes nothing outside and [can be dropped](../basics/el-equivalents.md#^transform-limits), unless that source's power is asked. ^cue-source-transform
- "The Thevenin (or Norton) equivalent with respect to a, b": [Thevenin](../basics/el-equivalents.md#^thevenin) and [Norton](../basics/el-equivalents.md#^norton). With independent sources only, [zero them and reduce](../basics/el-equivalents.md#^rth-zeroed); with dependent sources too, [$V_{oc}$ over $I_{sc}$](../basics/el-equivalents.md#^rth-oc-sc) or a [test source](../basics/el-equivalents.md#^rth-test-source). ^cue-thevenin
- Terminals with no independent source anywhere behind them: $V_{th} = 0$ ([dependent sources alone](../basics/el-equivalents.md#^dependent-only)), and $R_{th}$ from a [test source](../basics/el-equivalents.md#^rth-test-source). ^cue-no-independent
- "The load resistance that receives the most power": [maximum power transfer](../basics/el-equivalents.md#^max-power). ^cue-max-power
- One element's voltage or current given as a waveform or a formula, the other asked or to be sketched: the [capacitor law](../basics/el-cap-ind.md#^cap-law) $i = C\,dv/dt$ or the [inductor law](../basics/el-cap-ind.md#^ind-law) $v = L\,di/dt$ to differentiate, the [capacitor's](../basics/el-cap-ind.md#^cap-integral) or [inductor's](../basics/el-cap-ind.md#^ind-integral) integral form, with the initial value, to integrate. "The instant of maximum voltage": check where the voltage's slope is zero or jumps, where the voltage itself jumps, and the ends of the interval ([extremes](../basics/el-cap-ind.md#^extremes)). ^cue-waveform
- "Energy stored at $t$", "at $t = \infty$": the [stored energy](../basics/el-cap-ind.md#^energy), $\tfrac12Cv^2$ or $\tfrac12Li^2$, at that instant. ^cue-energy-stored
- "Is there an instantaneous change at $t = 0$?", or why one quantity has the same value at $0^-$ and $0^+$ and another does not: only $v_C$ and $i_L$ are sure to be [continuous](../basics/el-cap-ind.md#^continuity); every other value at $0^+$ comes from the [0⁺ circuit](../basics/el-first-order.md#^zero-plus). ^cue-jump
- Capacitors or inductors joined in a network, "the equivalent capacitance (inductance) at a, b", initial voltages or currents marked: [capacitors](../basics/el-cap-ind.md#^combine-c) and [inductors](../basics/el-cap-ind.md#^combine-l) in series and parallel, [the equivalent's initial value](../basics/el-cap-ind.md#^combine-ic), the voltage across one member of a series string ([dividers](../basics/el-cap-ind.md#^d-dividers)), and [trapped energy](../basics/el-cap-ind.md#^trapped-energy) once energies are compared. ^cue-network
- "The switch has been in position a for a long time": the circuit before the switch is at DC, with [C open and L short](../basics/el-cap-ind.md#^dc-steady). ^cue-long-time
- No independent source acting after the switch, or a constant one switched in: the [natural](../basics/el-first-order.md#^natural) or the [step](../basics/el-first-order.md#^step) response, with the [time constant](../basics/el-first-order.md#^tau) $\tau = R_{th}C$ or $L/R_{th}$. ^cue-natural-step
- A switch at $t = 0$ and a quantity asked "for $t \ge 0$": [the recipe](../basics/el-first-order.md#^recipe) and [the general solution](../basics/el-first-order.md#^general-solution), once everything but the C or L is [reduced to a Thevenin equivalent](../basics/el-first-order.md#^first-order-form). ^cue-switch
- A dependent source still connected after the switch moves: it changes the resistance the C or L sees, and so [the time constant](../basics/el-first-order.md#^dependent-tau); a negative $R_{th}$ makes the response grow. ^cue-controlled-tau
- Switching at two different times: [sequential switching](../basics/el-first-order.md#^sequential). ^cue-two-times
- A switch that puts a charged capacitor in series with another capacitor, or a coil carrying current in parallel with another coil: from then on they act as one element with [the equivalent's initial value](../basics/el-cap-ind.md#^combine-ic). Each one's final value comes from the charge (or volt-seconds) that passes, not from the DC circuit ([members of an equivalent](../basics/el-first-order.md#^form-reading)), and only the equivalent's energy can leave; the rest stays [trapped](../basics/el-cap-ind.md#^trapped-energy). ^cue-combine-switch
- "Find $L$ (or $C$) so that a quantity has fallen to a given fraction by a given time", "when does a current reach a given value?": [solving the exponential for a time or a value](../basics/el-first-order.md#^time-to-value). ^cue-design
- "What share of the stored energy has one resistor absorbed by $t$?", "how many time constants until a given share of it is delivered?": [energy decay](../basics/el-first-order.md#^energy-decay). ^cue-energy-fraction

## First moves

1. Redraw before writing: name every node, put the reference node where most elements meet, and give every element a current arrow and a polarity. A switching problem gets one drawing for each side of $t = 0$. ^m-redraw
2. Node or mesh: count first, on essential nodes, where three or more elements meet. Node voltages need one equation per essential node less one, and one fewer per voltage source alone in its branch; mesh currents need one per mesh, less one per branch holding a current source. Take the smaller count unless the question names the method, and on a tie the method whose unknowns are asked ([counts](../basics/el-dc-analysis.md#^choose-method)). ^m-node-mesh
3. A dependent source: write its controlling quantity in your unknowns at once (the "constraint equation") and substitute it. The source then counts like an independent source of its kind, so the number of node or mesh equations does not change. It stays alive when you find $R_{th}$ or $\tau$. ^m-dependent
4. Thevenin: with only independent sources, zero them and reduce; with dependent sources too, find $V_{oc}$ and $I_{sc}$, or $V_{oc}$ and a test source; with dependent sources only, $V_{th} = 0$ and a test source. ^m-thevenin
5. A network of capacitors or inductors with initial values: combine from the end far from the terminals, carrying each step's initial voltage or current with its sign. ^m-combine
6. Switching, in four small circuits. $0^-$ (C open, L short) gives $v_C(0^-)$ or $i_L(0^-)$. $0^+$ (C a voltage source, L a current source, at those values) gives every other value at $0^+$. $\infty$ (C open, L short again) gives $y(\infty)$. The circuit after the switch, independent sources zeroed, gives $R_{th}$ and $\tau = R_{th}C$ or $L/R_{th}$. Then $y(t) = y(\infty) + [y(0^+) - y(\infty)]\,e^{-t/\tau}$ for any voltage or current $y$. ^m-switching
7. Sketch $y(t)$ from its start, its end and $\tau$ before writing the formula, so that a wrong sign shows at once. A growing exponential is right only when a dependent source makes $R_{th}$ negative ([growth](../basics/el-first-order.md#^dependent-tau)); otherwise recheck $R_{th}$. ^m-sketch
8. Energy: $\tfrac12Cv^2$ and $\tfrac12Li^2$ at the instant asked. In a decay the stored energy falls as $e^{-2t/\tau}$, and resistors share the power in proportion to $1/R$ in parallel and to $R$ in series. ^m-energy
9. Check: the absorbed powers sum to zero; the element laws hold at $0^+$ and at $\infty$; the units come out. ^m-power-check

## Traps

> [!trap] A dependent source zeroed for $R_{th}$
> Between a and b, a 2 Ω resistor in series with a dependent source $3i$, where $i$ enters at a. A 1 A test source gives $2 + 3 = 5$ V, so $R_{th} = 5$ Ω, and $V_{th} = 0$ since nothing independent drives it. Replacing the dependent source by a short gives 2 Ω. Only independent sources are zeroed.
> ![Schematic: terminal a, then a 2 Ω resistor carrying i to the right, then a diamond source 3i with + on the side i enters, then terminal b](mie342-test2--trap-zero-dep.svg)
^trap-zero-dependent

> [!trap] KCL at one node of a supernode
> A 4 A source feeds node a, a 4 V source runs from a (+) to b, each node has 2 Ω to the reference, and a 1 A source draws current out of b. KCL at a written as $4 = v_a/2$ leaves out the current through the 4 V source and gives $v_a = 8$ V. KCL on the closed surface around a, b and the source, $4 = v_a/2 + v_b/2 + 1$ with $v_a - v_b = 4$, gives $v_a = 5$ V and $v_b = 1$ V: the source carries 1.5 A from a to b.
> ![Schematic: a 4 A source pointing up into node a; 2 Ω from a to the reference; a 4 V source from a (+) to b; 2 Ω from b to the reference; a 1 A source pointing down from b to the reference; a dashed closed surface around a, the 4 V source and b](mie342-test2--trap-supernode.svg)
^trap-supernode

> [!trap] A dependent source assumed to deliver power
> A 12 V source, a 2 Ω resistor and a dependent source $4i$ in one loop, with $i$ entering the dependent source's + terminal: $i = 12/6 = 2$ A. The dependent source absorbs $4i \cdot i = 16$ W, the 12 V source delivers 24 W, the resistor takes 8 W. A source delivers power when $p = vi$, with $i$ entering its + terminal, comes out negative; for a positive source value, that means its current leaves the + terminal.
> ![Schematic: one loop: a 12 V source, a 2 Ω resistor with i flowing clockwise, and a diamond source 4i with + at the top, where i enters](mie342-test2--trap-power-sign.svg)
^trap-power-sign

> [!trap] Series capacitances added
> Two 2 µF capacitors in series make 1 µF, not 4 µF. The same current flows through both, so they gain the same charge and their voltage changes add: $1/C_{eq} = 1/C_1 + 1/C_2$. Capacitors combine the way conductances do, inductors the way resistances do.
> ![Schematic: terminal a, a 2 µF capacitor, a second 2 µF capacitor, terminal b, all in series; C_eq = 1 µF marked below](mie342-test2--trap-series.svg)
^trap-series-c

> [!trap] $\tau$ from the wrong circuit
> 10 V charges 1 µF through 1 kΩ, with a second 1 kΩ across the capacitor, and the switch opens at $t = 0$. Afterwards the capacitor sees only the 1 kΩ across it: $\tau = 1$ ms. The charging circuit's 500 Ω gives 0.5 ms, which is wrong: $R_{th}$ comes from the circuit that exists for $t > 0$.
> ![Schematic: a 10 V source, 1 kΩ and a closed switch that opens at t = 0 in series, feeding 1 µF and a second 1 kΩ in parallel](mie342-test2--trap-tau.svg)
^trap-tau-circuit

> [!trap] A resistor current carried across the switch
> 10 V has charged 1 µF through 1 kΩ, so $i_R(0^-) = 0$. At $t = 0$ the switch swaps the source for a short, and $v_C$ is still 10 V, so $i_R(0^+) = -10$ mA. Only $v_C$ and $i_L$ are sure to carry across $t = 0$.
> ![Schematic: a switch moving from position 1 (a 10 V source) to position 2 (a short to the bottom rail), its common terminal feeding 1 kΩ with i_R flowing down, then 1 µF to the bottom rail](mie342-test2--trap-jump.svg)
^trap-resistor-jump

> [!trap] $e^{-t/\tau}$ used for energy
> Energy goes as $v^2$ or $i^2$, so it decays as $e^{-2t/\tau}$. After one time constant the current is at 37% and the energy at 13.5%. Half the energy is gone at $\tfrac12\tau\ln 2 = 0.35\tau$, not at $\tau\ln 2 = 0.69\tau$.
> ![Plot against t over τ: the voltage or current falls as e^(−t/τ) to 0.37 at one time constant; the stored energy falls as e^(−2t/τ) to 0.135 there, and is half gone at 0.35 τ](mie342-test2--trap-energy.svg)
^trap-energy-exponent

> [!trap] The clock not restarted at the second switching
> A capacitor at 10 V decays with $\tau_1 = 1$ ms until $t_1 = 2$ ms, then with $\tau_2 = 4$ ms. At 2 ms it is at $10e^{-2} = 1.35$ V, and at 3 ms at $1.35e^{-(3 - 2)/4} = 1.05$ V. Writing $1.35e^{-3/4}$ gives 0.64 V, from a curve that does not even start at 1.35 V.
> ![Plot, log scale: v_C falls from 10 V with τ = 1 ms to 1.35 V at 2 ms, then more slowly with τ = 4 ms to 1.05 V at 3 ms; the wrong formula, dashed red, starts at 0.82 V at 2 ms and reaches 0.64 V at 3 ms](mie342-test2--trap-shifted.svg)
^trap-shifted-time

## Where it hides

- [inv-th-steel-ball](../basics/th-transient.md#^inv-th-steel-ball), [inv-th-relay-runaway](../basics/th-transient.md#^inv-th-relay-runaway) and [d-two-node](../basics/th-transient.md#^d-two-node) ([th-transient](../basics/th-transient.md#^lumped))
- [inv-el-precharge](../basics/el-power-batteries.md#^inv-el-precharge) and [ex-pulse](../basics/el-power-batteries.md#^ex-pulse) ([el-power-batteries](../basics/el-power-batteries.md#^rlc))
- [ex-rc](../basics/dd-boolean-cmos.md#^ex-rc) ([dd-boolean-cmos](../basics/dd-boolean-cmos.md))
- [ex-bead](../basics/pd-measurement.md#^ex-bead) ([pd-measurement](../basics/pd-measurement.md))
^hides

## Try

> [!problem] Three charged capacitors switched onto a source (d 2.5)
> Between a and b sit a 4 µF capacitor at 12 V in series with a 3 µF and a 9 µF capacitor in parallel, both at 4 V, polarities as drawn. (a) Find the equivalent capacitance at a, b and its initial voltage $v_{ab}$. (b) At $t = 0$ the switch connects the 20 V source through 2 kΩ. Find $i(t)$ and the current in the 9 µF at $0^+$. (c) Find each capacitor's final voltage. (d) How much energy does the source deliver, how much does the resistor absorb, and how much do the capacitors gain?
> ![Schematic: a 20 V source, then 2 kΩ carrying i to the right and a switch that closes at t = 0, lead to terminal a; from a, a 4 µF capacitor at 12 V (+ at a) to a node, and from that node 3 µF and 9 µF in parallel down to the bottom rail, both at 4 V with + at the bottom; terminal b on the bottom rail](mie342-test2--caps.svg)
^d-caps

> [!solution]- Solution
> methods: combine-capacitors, combine-initial-values, general-solution, stored-energy
> 1. The parallel pair is one 12 µF capacitor at 4 V. In series with the 4 µF: $C_{eq} = 4 \cdot 12/(4 + 12) = 3$ µF.
> 2. From a to b: +12 V across the 4 µF, then −4 V across the pair, whose + faces b. So $v_{ab}(0) = 8$ V.
> 3. The source sees a 3 µF capacitor at 8 V behind 2 kΩ: $\tau = 6$ ms, $i(0^+) = (20 - 8)/2\text{ kΩ} = 6$ mA and $i(\infty) = 0$. So $i = 6e^{-t/6\,\text{ms}}$ mA, and $v_{ab} = 20 - 12e^{-t/6\,\text{ms}}$ V.
> 4. The pair shares one voltage, so its current splits in proportion to capacitance: the 9 µF carries $\tfrac{9}{12}$ of $i$, 4.5 mA at $0^+$, from the middle node toward b.
> 5. The charge delivered, $C_{eq} \cdot 12\text{ V} = 36$ µC, passes through every capacitor of the string. It raises the 4 µF by $36/4 = 9$ V, to 21 V, and lowers the pair by $36/12 = 3$ V, to 1 V with its + still at b. Check: $21 - 1 = 20$ V.
> 6. Energy: the source delivers $20\text{ V} \cdot 36\text{ µC} = 720$ µJ. The capacitors go from $288 + 96 = 384$ µJ to $882 + 6 = 888$ µJ, a gain of 504 µJ, so by the [energy balance](../basics/el-cap-ind.md#^d-energy-balance) the resistor takes $720 - 504 = 216$ µJ.
> 7. Check: $\int i^2R\,dt = (6\text{ mA})^2 \cdot 2\text{ kΩ} \cdot \tau/2 = 216$ µJ.
> ![Plot against time, two panels: top, the 4 µF rises from 12 V to 21 V, v_ab from 8 V to 20 V, and the pair falls from 4 V to 1 V, with τ = 6 ms marked; bottom, i falls from 6 mA and the 9 µF's current from 4.5 mA](mie342-test2--caps-waves.svg)
> Answer: (a) 3 µF at 8 V. (b) $i = 6e^{-t/6\,\text{ms}}$ mA; 4.5 mA, from the middle node toward b. (c) 21 V on the 4 µF, 1 V on the pair. (d) 720 µJ, 216 µJ and 504 µJ.

> [!problem] Two loops joined by a current-controlled current source (d 2.5)
> (a) Count the equations node voltages and mesh currents would each need here. (b) With mesh currents, find $i_x$ and the voltage across the dependent source. (c) Find the power each source develops, and check that the absorbed powers sum to zero.
> ![Schematic: two meshes side by side; a 52 V source on the left; 4 Ω and 3 Ω along the top; 2 Ω and 1 Ω along the bottom; a dependent current source 0.5 i_x pointing up in the branch the two meshes share; 6 Ω on the right carrying i_x downward; the reference node at the bottom of the shared branch](mie342-test2--mesh.svg)
^d-mesh

> [!solution]- Solution
> methods: method-choice, mesh-current, supermesh, dependent-source, power-balance
> 1. Only the two dots are essential nodes: every corner joins just two elements. The 52 V source sits in series with the 4 Ω and the 2 Ω, so it removes no equation, and node voltages need $2 - 1 = 1$. Mesh currents need 2, less 1 for the current source the meshes share: also 1.
> 2. Clockwise $i_1$ (left) and $i_2$ (right). The 6 Ω is in mesh 2 alone, so $i_x = i_2$. The dependent source fixes the shared branch: $i_2 - i_1 = 0.5i_x$, so $i_1 = 0.5i_2$.
> 3. Supermesh, around the outside of both meshes: $4i_1 + 3i_2 + 6i_2 + 1 \cdot i_2 + 2i_1 = 52$, that is $6i_1 + 10i_2 = 52$. With $i_1 = 0.5i_2$, $13i_2 = 52$: $i_x = i_2 = 4$ A and $i_1 = 2$ A.
> ![Schematic: the same circuit with clockwise mesh currents i1 and i2, and a dashed clockwise loop just inside the outer boundary of both meshes, around the dependent source](mie342-test2--mesh-loops.svg)
> 4. The dependent source carries $0.5 \cdot 4 = 2$ A upward. KVL around the left mesh puts $52 - 4 \cdot 2 - 2 \cdot 2 = 40$ V across it, + at the top.
> 5. Powers: the 52 V source passes 2 A out of its + terminal, so it develops 104 W; the dependent source passes 2 A out of its + terminal at 40 V, so it develops 80 W.
> 6. Check: the resistors absorb $16 + 48 + 96 + 16 + 8 = 184$ W, which is $104 + 80$.
> Answer: (a) One each. (b) $i_x = 4$ A; 40 V, + at the top. (c) 104 W and 80 W.

> [!problem] A port across the resistor that controls a source (d 3)
> (a) Use the node-voltage method to find the open-circuit voltage and the short-circuit current at a, b. Give the Thevenin equivalent and draw it. (b) Find its resistance again with a 1 A test source. (c) Which load resistance across a, b takes the most power? How much does it take, and what power does the dependent source develop then?
> ![Schematic: a 48 V source and 6 Ω along the top to the top rail; from the rail, 2 Ω above a dependent source 4 i_x (+ at the top) down to the bottom rail; then 3 Ω from the rail down to the bottom rail, carrying i_x downward; terminals a and b at the right ends of the two rails, across the 3 Ω](mie342-test2--thevenin.svg)
^d-thevenin

> [!solution]- Solution
> methods: node-voltage, open-short-circuit, test-source, dependent-source, max-power-transfer
> 1. Open circuit: the 3 Ω sits across a, b, so $i_x = v_a/3$ and the dependent source is at $4v_a/3$. KCL at a: $(48 - v_a)/6 = v_a/3 + (v_a - 4v_a/3)/2 = v_a/6$, so $V_{oc} = 24$ V.
> 2. Short circuit: $v_a = 0$ makes $i_x = 0$, so the dependent source is at 0 V and the 2 Ω and 3 Ω carry nothing. All of $48/6 = 8$ A goes through the short: $I_{sc} = 8$ A.
> 3. $R_{th} = 24/8 = 3$ Ω.
> 4. Test source: the 48 V becomes a short and 1 A goes into a. The 2 Ω branch draws $(v_a - 4v_a/3)/2 = -v_a/6$: it pushes current back into a, like a −6 Ω resistor. KCL: $1 = v_a/6 + v_a/3 - v_a/6 = v_a/3$, so $v_a = 3$ V: 3 Ω again. Zeroing the dependent source would give $6 \parallel 2 \parallel 3 = 1$ Ω.
> 5. Maximum power: $R_L = R_{th} = 3$ Ω takes $V_{th}^2/(4R_{th}) = 24^2/12 = 48$ W, at $v_{ab} = 12$ V.
> ![Schematic, two panels: top, the circuit with a and b joined and I_sc flowing down the short; bottom, the Thevenin equivalent, 24 V in series with 3 Ω, with a 3 Ω load across a and b](mie342-test2--thevenin-routes.svg)
> 6. With that load, $i_x = 4$ A and the dependent source sits at 16 V, so $(16 - 12)/2 = 2$ A flows out of the dependent source's + terminal and up through the 2 Ω: it develops 32 W.
> 7. Check: the 48 V source supplies $(48 - 12)/6 = 6$ A, so 288 W, and $288 + 32 = 320$ W, the sum of 216, 8, 48 and 48 W in the 6 Ω, the 2 Ω, the 3 Ω and the load.
> Answer: (a) 24 V in series with 3 Ω. (b) 3 Ω. (c) 3 Ω, 48 W; the dependent source develops 32 W.

> [!problem] A capacitor emptying into a resistor and a string of two (d 3)
> The switch has been closed for a long time and opens at $t = 0$. Sketch $v_C(t)$ and the stored energy against time before computing anything. (a) Find $v_C(0^-)$ and the capacitor's current just after the switch opens. (b) Find $v_C(t)$ for $t > 0$. (c) What share of the initial energy does the string's 2 kΩ resistor absorb in all, and how much has it absorbed by 4 ms? (d) When has 75% of the initial energy been dissipated, and what is $v_C$ then?
> ![Schematic: a 30 V source, 2 kΩ and a closed switch that opens at t = 0 along the top; then three branches to the bottom rail: a 2 µF capacitor with v_C (+ at top), 6 kΩ, and a string of 1 kΩ over 2 kΩ](mie342-test2--energy.svg)
^d-energy

> [!solution]- Solution
> methods: dc-steady-state, zero-plus-circuit, general-solution, energy-decay, time-to-value
> 1. Before: the capacitor is open, and the 30 V source sees 2 kΩ, then 6 kΩ in parallel with the 3 kΩ string, which is 2 kΩ: $v_C(0^-) = 15$ V.
> 2. At $0^+$ the capacitor holds 15 V across the 6 kΩ and the 3 kΩ string, so it supplies $15/6 + 15/3 = 7.5$ mA, out of its + terminal.
> 3. After: the capacitor sees $6 \parallel 3 = 2$ kΩ, so $\tau = 4$ ms and $v_C = 15e^{-t/4\,\text{ms}}$ V.
> 4. The initial energy is $\tfrac12 \cdot 2\text{ µF} \cdot 15^2 = 225$ µJ. The 6 kΩ and the string share one voltage, so power divides as $1/R$ and the string takes $\tfrac23$. Inside the string one current flows, so power divides as $R$ and the 2 kΩ takes $\tfrac23$ of that. In all it absorbs $\tfrac49$ of 225 µJ, 100 µJ.
> 5. By 4 ms, one time constant, $1 - e^{-2} = 86.5\%$ of the energy has gone, so the 2 kΩ has 86.5 µJ of its 100 µJ.
> 6. 75% is gone when $e^{-2t/\tau} = \tfrac14$: $t = \tau\ln 2 = 2.77$ ms, when $v_C = 7.5$ V. A quarter of the energy is left when the voltage has halved.
> ![Plot against time, two panels: top, v_C falls from 15 V with τ = 4 ms, passing 7.5 V at 2.77 ms; bottom, the stored energy falls from 225 µJ, with 75% gone at 2.77 ms, and the energy absorbed by the 2 kΩ rises to 100 µJ, passing 86.5 µJ at 4 ms](mie342-test2--energy-split.svg)
> 7. Check: the 6 kΩ takes $\tfrac13$ of the energy, 75 µJ, and the string's 1 kΩ $\tfrac29$, 50 µJ; with the 2 kΩ's 100 µJ, that is all 225 µJ.
> Answer: (a) 15 V; 7.5 mA out of its + terminal. (b) $v_C = 15e^{-t/4\,\text{ms}}$ V. (c) $\tfrac49$, 100 µJ; 86.5 µJ by 4 ms. (d) 2.77 ms, at 7.5 V.

> [!problem] A capacitor moved onto a network with two sources (d 3.5)
> The switch has been at 1 for a long time and moves to 2 at $t = 0$ without breaking contact. (a) Find $v_C(0^-)$, $i_o(0^-)$ and $i_o(0^+)$. (b) Redraw the circuit for $t > 0$ and sketch $v_C(t)$; then find $v_C(t)$ and $i_o(t)$ for $t > 0$. (c) When does $v_C$ pass through zero?
> ![Schematic: on the left a 20 V source and 5 kΩ reach position 1 of a switch; the switch's common terminal holds the top of a 1 µF capacitor with v_C (+ at top); position 2 leads to a network of three branches to the bottom rail: 4 kΩ carrying i_o downward, 2 kΩ above a dependent source 2000 i_o (+ at top), and a 5 mA source pointing down](mie342-test2--rc.svg)
^d-rc

> [!solution]- Solution
> methods: dc-steady-state, zero-plus-circuit, controlled-source-tau, general-solution, time-to-value
> 1. Before: on the left the capacitor is an open circuit, so $v_C(0^-) = 20$ V. The network on the right runs on its own. With $v$ at its top, $i_o = v/4\text{ kΩ}$ and KCL reads $v/4\text{ kΩ} + (v - 2000\,i_o)/2\text{ kΩ} + 5\text{ mA} = 0$, so $v = -10$ V and $i_o(0^-) = -2.5$ mA.
> 2. At $0^+$ the capacitor is a 20 V source across the 4 kΩ: $i_o(0^+) = 5$ mA. The jump is allowed; only $v_C$ is held.
> ![Schematic: the circuit for t > 0: the 1 µF capacitor with v_C across the same three branches, 4 kΩ with i_o, 2 kΩ above 2000 i_o, and 5 mA pointing down](mie342-test2--rc-after.svg)
> 3. At $\infty$ the capacitor is open again and the network is as it was before $t = 0$: $v_C(\infty) = -10$ V and $i_o(\infty) = -2.5$ mA.
> 4. $R_{th}$: open the 5 mA source and drive the top with a voltage $v$. The current drawn is $v/4\text{ kΩ} + (v - v/2)/2\text{ kΩ} = v/2\text{ kΩ}$, so $R_{th} = 2$ kΩ and $\tau = 2$ ms. With the dependent source zeroed it would be 1.33 kΩ.
> 5. $v_C(t) = -10 + 30e^{-t/2\,\text{ms}}$ V, and $i_o = v_C/4\text{ kΩ} = -2.5 + 7.5e^{-t/2\,\text{ms}}$ mA.
> 6. $v_C = 0$ when $e^{-t/\tau} = 1/3$: $t = 2\ln 3 = 2.20$ ms.
> ![Plot against time from −1 ms to 10 ms: v_C holds 20 V, then falls toward −10 V with τ = 2 ms, crossing zero at 2.20 ms; i_o sits at −2.5 mA, jumps to 5 mA at t = 0, and decays back to −2.5 mA](mie342-test2--rc-waves.svg)
> 7. Check at $0^+$: the three branches draw $5 + 5 + 5 = 15$ mA at 20 V, and $C\,dv_C/dt = 1\ \mu\text{F} \cdot (-30\text{ V}/2\text{ ms}) = -15$ mA.
> Answer: (a) 20 V, −2.5 mA and 5 mA. (b) $v_C = -10 + 30e^{-t/2\,\text{ms}}$ V and $i_o = -2.5 + 7.5e^{-t/2\,\text{ms}}$ mA. (c) 2.20 ms.

> [!problem] Two inductors in parallel behind a current-controlled voltage source (d 3.5)
> Neither inductor carries current before the switch closes at $t = 0$. (a) Find $v_o(0^-)$, $v_o(0^+)$, and the voltage across the inductors at $0^+$, + at the top. (b) Find $i_1 + i_2$ and $v_o$ for $t > 0$. (c) How does the final current divide between the two inductors, and how much energy does each store at the end?
> ![Schematic: a 24 V source, a switch that closes at t = 0 and 4 Ω along the top to a node; 12 Ω from that node to the bottom rail, with v_o across it (+ at top) and i_Δ flowing down; from the node, along the top, a dependent source 4 i_Δ (+ on the node's side) and 2 Ω; then 30 mH carrying i_1 and 60 mH carrying i_2 down to the bottom rail](mie342-test2--rl.svg)
^d-rl

> [!solution]- Solution
> methods: zero-plus-circuit, combine-inductors, first-order-reduction, controlled-source-tau, general-solution
> 1. Before: the switch is open and nothing flows, so $v_o(0^-) = 0$.
> 2. At $0^+$ both inductors still carry nothing, so neither do the 2 Ω and the dependent source. The 4 Ω and 12 Ω form a divider: $v_o(0^+) = 24 \cdot 12/16 = 18$ V and $i_\Delta = 1.5$ A. The inductors' top sits at $18 - 4 \cdot 1.5 = 12$ V.
> 3. The pair acts as one inductor of $30 \cdot 60/90 = 20$ mH, and the rest of the circuit as a Thevenin source. $V_{th} = 12$ V, the voltage just found with no current drawn. For $R_{th}$, zero the 24 V and drive the pair's node with a current $i$: the 12 Ω's node sits at $(4 \parallel 12)\,i = 3i$, so $i_\Delta = i/4$, and the pair's node at $3i - 4 \cdot i/4 + 2i = 4i$. So $R_{th} = 4$ Ω; with the dependent source zeroed it would be 5 Ω.
> 4. $\tau = 20\text{ mH}/4\ \Omega = 5$ ms, and the current settles at $12/4 = 3$ A: $i_1 + i_2 = 3(1 - e^{-t/5\,\text{ms}})$ A.
> 5. In the end, KCL at the top node, $(24 - v_o)/4 = v_o/12 + 3$, gives $v_o = 9$ V. So $v_o = 9 + 9e^{-t/5\,\text{ms}}$ V.
> 6. The two inductors share one voltage, so they gain equal flux $\int v\,dt$, and from zero their currents stay in inverse ratio to their inductances: 2 A in the 30 mH and 1 A in the 60 mH. They store $\tfrac12 \cdot 30\text{ mH} \cdot 2^2 = 60$ mJ and $\tfrac12 \cdot 60\text{ mH} \cdot 1^2 = 30$ mJ, together the equivalent's $\tfrac12 \cdot 20\text{ mH} \cdot 3^2 = 90$ mJ.
> ![Plot against time from −2 ms to 30 ms: i1 + i2 rises to 3 A with τ = 5 ms, split 2 A in the 30 mH and 1 A in the 60 mH; v_o jumps from 0 to 18 V at t = 0 and decays to 9 V](mie342-test2--rl-waves.svg)
> Answer: (a) 0, 18 V and 12 V. (b) $i_1 + i_2 = 3(1 - e^{-t/5\,\text{ms}})$ A and $v_o = 9 + 9e^{-t/5\,\text{ms}}$ V. (c) 2 A and 1 A; 60 mJ and 30 mJ.

## Changes

- build 2, 2026-11-18: rebuilt in the topic shape on four new basics, with a schematic in every problem and in every trap built on a circuit, a plot for every waveform asked, and every number checked by a circuit solver; course problems 4.1 to 7.14 listed by number in the new mie342 bank.
