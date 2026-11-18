---
study: basic
id: el-equivalents
title: Thevenin, Norton and superposition
area: el
needs: [el-dc-analysis]
build: 1
tracks: [mie342, interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [KCL](el-dc-analysis.md#^kcl) and [KVL](el-dc-analysis.md#^kvl), [reference directions and the passive sign convention](el-dc-analysis.md#^psc), [series and parallel reduction](el-dc-analysis.md#^series-parallel), the [node method](el-dc-analysis.md#^node-method), [dependent sources](el-dc-analysis.md#^dependent-sources) and the [power balance](el-dc-analysis.md#^power-balance).
^needs

Seen from two of its nodes, a circuit of resistors and sources, however large, behaves as one source and one resistor. That is the use of this doc: replace the part of a circuit you do not care about by two numbers, then finish in one line. It rests on linearity, which gives superposition and, through it, Thevenin's theorem. RC and RL circuits lean on the result: a circuit with one capacitor or one inductor is one source and one resistor driving that element ([first-order form](el-first-order.md#^first-order-form)).
^thread

## Linearity and superposition

> [!def] Linear resistive circuit; zeroing a source
> A **linear resistive circuit** is built from resistors, independent sources and [dependent sources](el-dc-analysis.md#^dependent-sources) of all four kinds, each a constant gain times its controlling variable. **Zeroing** an independent source sets its value to zero: a voltage source at 0 V is a wire (a short circuit), a current source at 0 A is a gap (an open circuit). A dependent source is never zeroed by hand; it is zero only when its controlling variable is.
^linear-circuit

> [!thm] Theorem 1 (linearity)
> In a linear resistive circuit with a unique solution, every voltage and every current is a fixed linear combination of the independent source values, $x = k_1s_1 + k_2s_2 + \dots + k_ns_n$, whose coefficients $k_j$ depend only on the resistances and the gains.
^linearity

> [!proof]- Proof (d 2.5)
> 1. Take as unknowns the node voltages and the current through every voltage source, independent or dependent. Write [KCL](el-dc-analysis.md#^kcl) at every node but the reference, and one equation per voltage source fixing the difference of its two node voltages: as many equations as unknowns.
> 2. A resistor's current is $(v_a - v_b)/R$, linear in the unknowns. A dependent source's value is its gain times a voltage or current that is itself linear in the unknowns and the source values (a current source's current is its value). So every term is linear in the unknowns and the source values, with coefficients made of resistances and gains.
> 3. Independent source values enter only as constants, alone or times a gain: a current source's value in a KCL equation, a voltage source's value in its own equation. Moving them to the right gives $A\mathbf x = B\mathbf s$, with $\mathbf s$ the list of source values and $A$, $B$ built from resistances and gains alone.
> 4. A unique solution means $A$ is invertible, so $\mathbf x = A^{-1}B\mathbf s$: each unknown is a fixed combination of the source values.
> 5. Any other voltage or current, such as a resistor's current or the voltage across a current source, is a linear combination of the unknowns and the source values, hence of the source values.
^p-linearity

> [!thm] Theorem 2 (superposition)
> In a linear resistive circuit with a unique solution, any voltage or current is the sum of its values with each independent source acting alone, the other independent sources zeroed and every dependent source left in place.
^superposition

> [!proof]- Proof (d 1.5)
> 1. By [Theorem 1](#^linearity), $x = \sum_j k_js_j$, and the $k_j$ do not depend on the source values.
> 2. Source $j$ acting alone is the same circuit with $s_i = 0$ for every $i \ne j$. Zeroing changes source values, not the matrix $A$, so the same $k_j$ apply and $x$ becomes $k_js_j$.
> 3. Sum over $j$. A dependent source's gain sits in $A$, so removing it would change the $k_j$: it stays in every sub-circuit.
^p-superposition

Superposition pays when the sources are of different kinds, or when one source will change and the rest will not: each sub-circuit is often a single divider. It costs one analysis per source, so with three or more sources one [node analysis](el-dc-analysis.md#^node-method) is usually faster. Linearity alone gives a further shortcut: scaling every source by the same factor scales every voltage and current by it.
^superposition-use

> [!trap] Superposing powers
> Power is a product, $p = vi = Ri^2$, so it is not linear in the sources. Smallest counterexample: two 1 A current sources in parallel driving a 1 Ω resistor. Each alone gives it 1 W; together it carries 2 A and absorbs 4 W, not 2 W. Superpose currents and voltages, then compute the power once.
^trap-power

> [!example] A source pair and a controlled source
> Find $i_1$ by superposition. Then find the power the 2 Ω resistor absorbs, and compare it with the sum of its powers in the two sub-circuits.
> ![Schematic: a 36 V source drives a 2 Ω resistor carrying i_1 into a node; from that node a 4 Ω resistor in series with a controlled voltage source 6 i_1 (plus on top) runs to ground, and a 3 A current source pushes current up into the node.](el-equivalents--ex-two-sources.svg)
^ex-two-sources

> [!solution]- Solution
> methods: superposition
> ![Schematic: the two sub-circuits. Left, the 3 A source removed (open) and the 36 V source driving one loop. Right, the 36 V source replaced by a wire and the 3 A source alone. The controlled source stays in both, controlled by that sub-circuit's own i_1.](el-equivalents--ex-two-sources-split.svg)
> 1. The 36 V source alone: one loop. KVL: $36 = 2i_1' + 4i_1' + 6i_1'$, so $i_1' = 3$ A.
> 2. The 3 A source alone: the left end of the 2 Ω is now at 0 V, so the node sits at $-2i_1''$. KCL there, with the bottom of the 4 Ω at $6i_1''$: $i_1'' + 3 = (-2i_1'' - 6i_1'')/4 = -2i_1''$, so $i_1'' = -1$ A.
> 3. $i_1 = 3 - 1 = 2$ A, and the node sits at $36 - 2\cdot2 = 32$ V (30 V and 2 V from the two sub-circuits).
> 4. The 2 Ω absorbs $2\cdot2^2 = 8$ W. The sub-circuits give $2\cdot3^2 = 18$ W and $2\cdot1^2 = 2$ W, which sum to 20 W; the missing cross term is $2\cdot2\cdot3\cdot(-1) = -12$ W.
> 5. Check by power balance: the 36 V source delivers $36\cdot2 = 72$ W and the 3 A source $32\cdot3 = 96$ W. The 4 Ω carries $2 + 3 = 5$ A and absorbs 100 W; the controlled source sits at $6i_1 = 12$ V with those 5 A entering its $+$ terminal, so it absorbs 60 W. $72 + 96 = 8 + 100 + 60$.

## Source transformations

> [!def] Two-terminal circuit; equivalence
> A **two-terminal circuit** is a circuit joined to the outside only at two nodes, its **terminals** $a$ and $b$. Its **terminal relation** is the set of pairs $(v, i)$ it allows, with $v = v_a - v_b$ and $i$ the current entering at $a$ and leaving at $b$. Two two-terminal circuits are **equivalent** if they have the same terminal relation. Either can then replace the other inside a larger circuit without changing any voltage or current outside it, because the outside meets each only through $v$ and $i$, provided no dependent source on one side is controlled by a variable on the other (the terminal $v$ and $i$ belong to both sides, so control by them is allowed). A **test source** is a source placed across the terminals only to probe the relation; whatever else is connected there is the **load**.
^equivalent

> [!thm] Theorem 3 (source transformation)
> A voltage source $v_s$ in series with a resistor $R$ is equivalent to a current source $v_s/R$ in parallel with the same $R$, the current source's arrow pointing toward the terminal on the voltage source's $+$ side.
> ![Schematic: left, a source v_s with plus on top, in series with R to terminal a, its minus side to terminal b. Right, a current source v_s/R with its arrow up toward terminal a, in parallel with R, between a and b.](el-equivalents--transform.svg)
^source-transform

> [!proof]- Proof
> 1. Series form, with $i$ entering at $a$ and flowing through $R$ into the $+$ terminal: KVL gives $v = Ri + v_s$.
> 2. Parallel form: KCL at $a$, $i + v_s/R = v/R$, so again $v = Ri + v_s$.
> 3. The terminal relations agree, so the two are equivalent.
^p-source-transform

The equivalence holds at the terminals only. Left open, the series form dissipates nothing and the parallel form dissipates $v_s^2/R$, so a power inside a transformed part must be computed in the original circuit. The same comparison of terminal relations gives two more rules: a resistor in parallel with an ideal voltage source, or in series with an ideal current source, changes nothing at the terminals and may be dropped there, though not from that source's own power. And a dependent source transforms like an independent one, provided its controlling variable lies outside the pair being transformed.
^transform-limits

> [!example] A ladder fed from both ends
> Find $i_x$ by a chain of source transformations. Then compare the power the 72 V source delivers with the power of the current source that replaces it in the chain.
> ![Schematic: a ladder. A 72 V source behind 18 Ω feeds a node with 9 Ω to ground; a 2 Ω resistor leads to a second node with 4 Ω to ground carrying i_x downward; an 8 Ω resistor leads from there to a 40 V source, plus on top.](el-equivalents--ex-ladder.svg)
^ex-ladder

> [!solution]- Solution
> methods: source-transformation
> ![Schematic: three panels. (1) The 72 V source with its 18 Ω becomes 4 A in parallel with 18 Ω, merged with the 9 Ω into 4 A in parallel with 6 Ω. (2) That becomes 24 V behind 6 Ω, which with the 2 Ω is 24 V behind 8 Ω. (3) Both ends as current sources, 3 A and 5 A, each beside 8 Ω, merged into 8 A beside 4 Ω, across the 4 Ω that carries i_x.](el-equivalents--ex-ladder-chain.svg)
> 1. Left end: 72 V behind 18 Ω (in series) is 4 A beside 18 Ω (in parallel); with the 9 Ω also in parallel, 4 A beside 6 Ω (panel 1).
> 2. Back to a voltage source, 24 V behind 6 Ω, now in series with the 2 Ω: 24 V behind 8 Ω (panel 2).
> 3. Both ends as current sources: 3 A beside 8 Ω, and 5 A beside 8 Ω. Parallel current sources add, and so do parallel conductances ($1/R$): 8 A beside 4 Ω (panel 3).
> 4. The middle node sits at $8\cdot(4\parallel4) = 16$ V, so $i_x = 4$ A.
> 5. Back in the original circuit, the 2 Ω carries $(24 - 16)/8 = 1$ A, so the left node sits at $16 + 2\cdot1 = 18$ V, the 18 Ω carries $(72 - 18)/18 = 3$ A, and the 72 V source delivers 216 W. The 4 A source of panel 1 would deliver $4\cdot18 = 72$ W: the transformed part matches the original at its terminals only.
> 6. Check, KCL at the middle node: 1 A in from the left and $(40 - 16)/8 = 3$ A in from the right make the 4 A down.

## Thevenin and Norton

> [!thm] Theorem 4 (Thevenin)
> Let $N$ be a linear resistive two-terminal circuit, none of whose dependent sources is controlled from outside it (its terminal voltage $v$ and current $i$ count as its own), with a unique solution when a current source of any value drives its terminals. Then for every terminal current $i$ entering at $a$,
> $$v = V_{th} + R_{th}\,i,$$
> where $V_{th}$ is the **open-circuit voltage** $V_{oc}$ (the value of $v$ at $i = 0$) and $R_{th}$ is the ratio $v/i$ with $N$'s independent sources zeroed. So $N$ is equivalent to a source $V_{th}$ in series with $R_{th}$, its $+$ side toward $a$: the **Thevenin equivalent**.
> ![Schematic: left, a box N with terminals a and b, a current i entering at a and the voltage v across a to b. Right, the same terminals on a source V_th, plus on top, in series with R_th.](el-equivalents--thevenin.svg)
^thevenin

> [!proof]- Proof (d 3)
> 1. Drive the terminals with a current source of value $i$, entering $N$ at $a$. The driven circuit is linear with a unique solution, and its independent sources are $N$'s own and the test source. A dependent source controlled by $i$ is now controlled by the test source's value.
> 2. By [superposition](#^superposition), $v = v' + v''$: $v'$ with the test source acting alone ($N$'s sources zeroed), $v''$ with $N$'s sources alone (the test source zeroed, which opens it).
> 3. With the test source open the terminals are open, so $v'' = V_{oc}$.
> 4. With $N$'s sources zeroed the test source is the only independent source, so by [linearity](#^linearity) $v' = R_{th}i$ for a constant $R_{th}$ fixed by $N$'s resistances and gains.
> 5. So $v = V_{oc} + R_{th}i$ for every $i$. KVL around $V_{th}$ in series with $R_{th}$ gives the same relation, so the two are [equivalent](#^equivalent).
^p-thevenin

The load can be anything, a resistor, a source, a capacitor, even a diode: [equivalence](#^equivalent) holds for every outside circuit, and only $N$ has to be linear. With the usual load current $i_L = -i$, leaving at $a$, the relation reads $v = V_{th} - R_{th}i_L$.
^thevenin-use

> [!thm] Theorem 5 (Norton)
> If $R_{th} \ne 0$, the circuit $N$ of Theorem 4 is also equivalent to a current source $I_N$ in parallel with $R_{th}$, its arrow toward $a$: the **Norton equivalent**. Here
> $$I_N = I_{sc} = \frac{V_{oc}}{R_{th}},$$
> where the **short-circuit current** $I_{sc}$ is the current from $a$ to $b$ through a wire joining the terminals.
> ![Schematic: a current source I_N with its arrow up toward terminal a, in parallel with R_th, between terminals a and b.](el-equivalents--norton.svg)
^norton

> [!proof]- Proof
> 1. [Transform](#^source-transform) the Thevenin equivalent: $V_{oc}$ behind $R_{th}$ becomes $V_{oc}/R_{th}$ in parallel with $R_{th}$, arrow toward $a$.
> 2. Short the terminals of this form: $R_{th}$ then has no voltage, so the whole source current flows through the short from $a$ to $b$, and $I_{sc} = V_{oc}/R_{th}$.
^p-norton

At the two extremes one form is missing. With $R_{th} = 0$ the circuit is an ideal voltage source $V_{oc}$, which has no Norton form. When no current can be forced into the zeroed circuit, $R_{th}$ is infinite and the circuit is an ideal current source $I_{sc}$, which has no Thevenin form.
^extremes

## Three routes to $R_{th}$

**Route 1, zero and reduce.** With no dependent source, zero the independent sources and reduce the resistors that remain by [series and parallel](el-dc-analysis.md#^series-parallel); where they do not reduce (a bridge), use a test source (route 3). A network of resistors has terminal ratio $v/i$ equal to its equivalent resistance, so this is $R_{th}$ by Theorem 4. A dependent source blocks the route: it is not a resistor, and zeroing it as well gives a wrong $R_{th}$ ([the example below](#^ex-transconductance)).
^rth-zeroed

**Route 2, open and short.** Find $V_{oc}$ and $I_{sc}$ in the full circuit, dependent sources included, and divide: $R_{th} = V_{oc}/I_{sc}$ ([Norton](#^norton)). It works with dependent sources and costs two analyses of the circuit, each often easy: a short across the terminals silences every resistor directly across them. It fails when $V_{oc} = I_{sc} = 0$, which is what happens with no independent source ([below](#^dependent-only)).
^rth-oc-sc

**Route 3, test source.** Zero the independent sources, keep every dependent source, drive the terminals with a test source and compute $R_{th} = v_T/i_T$, with $i_T$ entering at $a$. Choose $i_T = 1$ A or $v_T = 1$ V, whichever shortens the algebra. This is Theorem 4's own definition, so it always works, including with no independent source. A dependent source controlled by the terminal current is now controlled by $i_T$, or by $-i_T$ if its reference arrow points out of $a$.
^rth-test-source

> [!example] A voltage-controlled current source at the terminals
> Find the Thevenin equivalent at $a$, $b$ by routes 2 and 3. Then find what route 1 would give if the controlled source were zeroed along with the 30 V source.
> ![Schematic: a 30 V source behind 10 Ω feeds a node with 10 Ω to ground, whose voltage is v_x (plus on top); a 5 Ω resistor runs from that node to terminal a, where a controlled current source 0.1 v_x pushes current up from the bottom rail, terminal b, into a.](el-equivalents--ex-transconductance.svg)
^ex-transconductance

> [!solution]- Solution
> methods: open-short-circuit, test-source
> ![Schematic: top, the terminals joined by a wire, with I_sc flowing down through it from a to b. Bottom, the 30 V source replaced by a wire and a test current source i_T driving terminal a, with v_T across a and b.](el-equivalents--ex-transconductance-routes.svg)
> 1. Open circuit: the 5 Ω carries only the controlled source's current, $0.1v_x$, from $a$ back to the middle node, so $v_a = v_x + 5\cdot0.1v_x = 1.5v_x$. KCL at the middle node: $(30 - v_x)/10 = v_x/10 - 0.1v_x = 0$, so $v_x = 30$ V and $V_{oc} = 45$ V. (The series 10 Ω carries nothing: the controlled source returns exactly what the 10 Ω to ground draws.)
> 2. Short circuit (top panel): $v_a = 0$, so the 5 Ω carries $v_x/5$ into the short. KCL at the middle node: $(30 - v_x)/10 = v_x/10 + v_x/5$, so $v_x = 7.5$ V and $I_{sc} = 7.5/5 + 0.1\cdot7.5 = 1.5 + 0.75 = 2.25$ A.
> 3. Route 2: $R_{th} = 45/2.25 = 20$ Ω. The equivalent is 45 V in series with 20 Ω, or 2.25 A beside 20 Ω.
> 4. Route 3 (bottom panel), $i_T = 1$ A: the two 10 Ω now both run from the middle node to ground, so the 5 Ω carries $v_x/5$ toward them and $v_a = 2v_x$. KCL at $a$: $1 + 0.1v_x = v_x/5$, so $v_x = 10$ V, $v_a = 20$ V and $R_{th} = 20$ Ω.
> 5. Route 1 with the controlled source zeroed too: $5 + 10\parallel10 = 10$ Ω, wrong by a factor of two. The controlled source adds its own current to the test current, so a given $i_T$ raises more voltage than the resistors alone would.

## Circuits with only dependent sources

> [!thm] Corollary 6 (no independent source)
> If the circuit $N$ of Theorem 4 has dependent sources but no independent source, then $V_{th} = V_{oc} = 0$, and $I_{sc} = 0$ whenever $R_{th} \ne 0$: $N$ is equivalent to the resistance $R_{th}$ alone, which a [test source](#^rth-test-source) finds.
^dependent-only

> [!proof]- Proof (d 1.5)
> 1. With open terminals, $N$ is driven by a current source of value 0, so it has a unique solution. By [linearity](#^linearity) every voltage and current is then a combination of no source values: zero. So $V_{oc} = 0$.
> 2. Theorem 4 now gives $v = R_{th}i$, and for $R_{th} \ne 0$ [Theorem 5](#^norton) gives $I_{sc} = V_{oc}/R_{th} = 0$.
> 3. Route 2 reads $0/0$ and route 1 needs the dependent sources gone, which leaves the test source.
^p-dependent-only

A dependent source can make $R_{th}$ negative. The test source then sees $v_Ti_T = R_{th}i_T^2 < 0$ with $i_T$ entering at $a$: the circuit delivers power out of its terminals, and the dependent source supplies it. (A dependent source models a transistor or an amplifier, whose own supply the model hides.) A load $R_L = -R_{th}$ then turns the loop equation $(R_{th} + R_L)\,i = V_{th}$ into $0 = V_{th}$: no solution at all, or, with $V_{th} = 0$, every $i$, so never a unique one.
^negative-rth

> [!example] A controlled source with nothing to drive it
> Find the resistance seen at $a$, $b$. Where does the power come from when a 1 A test source drives the terminals? What current flows when a 4 Ω resistor is connected across $a$, $b$, and when a 6 Ω resistor is?
> ![Schematic: terminal a feeds a 2 Ω resistor carrying i_1 to a node; from the node a 4 Ω resistor and a controlled current source 3 i_1, arrow down, run to the bottom rail, which is terminal b.](el-equivalents--ex-negative.svg)
^ex-negative

> [!solution]- Solution
> methods: dependent-only, test-source
> 1. Drive $a$ with $i_T = 1$ A, so $i_1 = 1$ A. KCL at the node: $1 = v_n/4 + 3\cdot1$, so $v_n = -8$ V.
> 2. $v_a = v_n + 2\cdot1 = -6$ V, so $R_{th} = -6$ Ω, and $V_{th} = 0$ by Corollary 6.
> 3. Powers: the 2 Ω absorbs 2 W and the 4 Ω $8^2/4 = 16$ W. The controlled source has $-8$ V across it with 3 A flowing down through it, so it absorbs $-24$ W: it delivers 24 W, of which 18 W heats the resistors and 6 W leaves through the terminals into the test source.
> 4. A 4 Ω load: $(-6 + 4)\,i = 0$, so $i = 0$. Nothing drives the circuit and nothing flows.
> 5. A 6 Ω load: $(-6 + 6)\,i = 0$ holds for every $i$. The model does not fix the current; what the real circuit does is set by what the model leaves out, such as the amplifier's supply limits.

## Maximum power transfer

> [!thm] Theorem 7 (maximum power transfer)
> A load resistor $R_L$ across the terminals of a circuit with Thevenin equivalent $V_{th}$, $R_{th} > 0$ absorbs
> $$P_L = \frac{V_{th}^2R_L}{(R_{th} + R_L)^2},$$
> which is largest at $R_L = R_{th}$, where $P_{max} = V_{th}^2/(4R_{th})$. At that point the load takes exactly half the power that the equivalent's source $V_{th}$ delivers.
^max-power

> [!proof]- Proof (d 2)
> 1. The loop current is $i = V_{th}/(R_{th} + R_L)$, so $P_L = i^2R_L = V_{th}^2R_L/(R_{th} + R_L)^2$.
> 2. $(R_{th} + R_L)^2 - 4R_{th}R_L = (R_{th} - R_L)^2 \ge 0$, with equality only at $R_L = R_{th}$. So $P_L \le V_{th}^2/(4R_{th})$, with equality only there.
> 3. The source $V_{th}$ delivers $V_{th}i$, of which the load takes $i^2R_L$. Their ratio is $R_L/(R_{th} + R_L)$, which is $\tfrac12$ at $R_L = R_{th}$.
^p-max-power

![Plot: load power over P_max, and the efficiency R_L/(R_th + R_L), against R_L/R_th on a log axis from 0.05 to 20. The power peaks at 1 where R_L = R_th, with the efficiency there at 50 %; the efficiency keeps rising with R_L.](el-equivalents--max-power-curve.svg)
^max-power-curve

The peak is flat: a load three times too large or three times too small still takes 75 % of $P_{max}$. The **efficiency**, the load's share of the power delivered, rises with $R_L$ and is 50 % at the peak; that is the equivalent's share, and the real sources' share must be computed in the original circuit ([terminals only](#^transform-limits)). Batteries and the grid run with $R_L \gg R_{th}$, for efficiency: a battery at its maximum-power point would heat itself as much as its load ([peak power of a pack](el-power-batteries.md#^inv-el-pack-power)). Matching $R_L = R_{th}$ is for weak signals, where the signal's power is scarce and the wasted half does not matter. If instead $R_L$ is fixed and $R_{th}$ is the choice, the load power only rises as $R_{th}$ falls.
^max-power-efficiency

## Problems

> [!problem] A bridge between two dividers (d 2)
> Find the Thevenin equivalent seen across $a$, $b$, and draw it. Then find the current through a 5 Ω resistor, and through a 20 Ω resistor, connected from $a$ to $b$.
> ![Schematic: a 24 V source feeds two dividers in parallel: 3 Ω over 6 Ω on the left with terminal a at their midpoint, 12 Ω over 4 Ω on the right with terminal b at their midpoint.](el-equivalents--p-bridge.svg)
^inv-el-bridge-dividers

> [!solution]- Solution
> methods: zeroed-sources
> 1. With $a$, $b$ open each divider works alone: $v_a = 24\cdot6/9 = 16$ V and $v_b = 24\cdot4/16 = 6$ V, so $V_{th} = v_a - v_b = 10$ V.
> 2. Zero the 24 V source: the top and bottom rails join, so from $a$ the 3 Ω and 6 Ω are in parallel (2 Ω), from $b$ the 12 Ω and 4 Ω are in parallel (3 Ω), and the two pairs are in series between $a$ and $b$: $R_{th} = 5$ Ω.
> 3. The drawing: 10 V in series with 5 Ω, $+$ toward $a$.
>    ![Schematic: the Thevenin equivalent, a 10 V source with plus on top in series with 5 Ω to terminal a, its minus side to terminal b.](el-equivalents--p-bridge-answer.svg)
> 4. A 5 Ω load carries $10/(5 + 5) = 1$ A from $a$ to $b$; a 20 Ω load carries $10/25 = 0.4$ A.
> 5. Check by route 2: a wire from $a$ to $b$ holds both at 12 V (2.4 Ω above, 2.4 Ω below); the 3 Ω brings 4 A into $a$ and the 6 Ω takes 2 A, so 2 A crosses the wire, and $10/5 = 2$.
> Answer: 10 V behind 5 Ω; 1 A and 0.4 A. (The 5 Ω load takes 5 W, the most any resistor across $a$, $b$ can take.)

> [!problem] A sensor read with two loads (d 2.5)
> A sensor, linear and resistive inside, reads 3.0 V across a 1.0 kΩ load and 4.0 V across a 3.0 kΩ load. What would an ideal voltmeter read across its terminals? Which load resistance takes the most power from it, and how much?
> ![Schematic: a box labelled sensor with terminals a and b, loaded by an adjustable resistor R_L with the voltage v across it.](el-equivalents--p-sensor.svg)
^inv-el-sensor-two-loads

> [!solution]- Solution
> methods: thevenin, max-power-transfer
> 1. The sensor is a Thevenin equivalent, so $v = V_{th}R_L/(R_{th} + R_L)$. With resistances in kΩ: $V_{th} = 3(1 + R_{th})$ and $V_{th} = 4(3 + R_{th})/3$.
> 2. Equate: $9 + 9R_{th} = 12 + 4R_{th}$, so $R_{th} = 0.6$ kΩ and $V_{th} = 4.8$ V, which is what the ideal voltmeter reads.
> 3. The most power goes into $R_L = 600$ Ω: $4.8^2/(4\cdot600) = 9.6$ mW, at 2.4 V.
> 4. Check: $4.8\cdot1/1.6 = 3.0$ V and $4.8\cdot3/3.6 = 4.0$ V, the two readings.
> Answer: 4.8 V; 600 Ω; 9.6 mW.

> [!problem] A source adjusted until one branch carries nothing (d 3)
> The source $V_x$ is adjusted until $i_o = 0$. Find $V_x$, then check the result with a power balance.
> ![Schematic: a 30 V source behind 10 Ω, which carries i_1, feeds a node with 20 Ω to ground; an 8 Ω resistor carrying i_o leads to a second node, from which a controlled current source 3 i_1, arrow down, runs to ground and a 5 Ω resistor leads to the adjustable source V_x, plus on top.](el-equivalents--p-null.svg)
^inv-el-null-branch

> [!solution]- Solution
> methods: node-voltage, power-balance
> 1. Use the condition first: with $i_o = 0$ the 8 Ω has no voltage across it, so both its ends sit at one voltage, and the left part is a plain divider: $30\cdot20/30 = 20$ V, with $i_1 = 1$ A.
> 2. KCL at the right node: the 5 Ω brings in $(V_x - 20)/5$, the controlled source takes out $3i_1 = 3$ A, the 8 Ω takes nothing. So $V_x = 20 + 5\cdot3 = 35$ V.
> 3. Power balance: the 30 V source delivers $30\cdot1 = 30$ W and $V_x$ delivers $35\cdot3 = 105$ W, 135 W in all. Absorbed: 10 W in the 10 Ω, 20 W in the 20 Ω, nothing in the 8 Ω, $5\cdot3^2 = 45$ W in the 5 Ω, and 60 W in the controlled source, which has 20 V across it with 3 A flowing down through it. Total 135 W.
> Answer: $V_x = 35$ V.

> [!problem] A controlled source in the series path (d 3)
> Find the Thevenin equivalent at $a$, $b$ and draw it. Confirm $R_{th}$ with a test source, then find the current in a 12 Ω load.
> ![Schematic: a 20 V source behind 2 Ω feeds a node with 3 Ω to ground carrying i_Δ downward; from that node a controlled voltage source 12 i_Δ, plus toward a, leads to terminal a, which has 6 Ω to the bottom rail, terminal b.](el-equivalents--p-series-ccvs.svg)
^inv-el-series-ccvs

> [!solution]- Solution
> methods: open-short-circuit, test-source
> 1. Call the middle node's voltage $v_2$, so $i_\Delta = v_2/3$. The controlled source fixes $v_a = v_2 + 12i_\Delta = 5v_2$, whatever is connected.
> 2. Open circuit: the 6 Ω's current, $v_a/6 = 5v_2/6$, comes through the controlled source from the middle node. KCL there: $(20 - v_2)/2 = v_2/3 + 5v_2/6$, so $v_2 = 6$ V and $V_{oc} = 30$ V.
> 3. Short circuit: $v_a = 0$ forces $5v_2 = 0$, so $i_\Delta = 0$ and the controlled source sits at 0 V. All of $20/2 = 10$ A goes through it into the short: $I_{sc} = 10$ A and $R_{th} = 30/10 = 3$ Ω.
> 4. Test source, 1 A into $a$ with the 20 V source a wire: the 6 Ω takes $5v_2/6$, the rest flows through the controlled source into the middle node, where the 2 Ω and 3 Ω take $v_2/2 + v_2/3 = 5v_2/6$. So $1 = 5v_2/3$, $v_2 = 0.6$ V and $v_a = 3$ V: 3 Ω again.
> 5. The drawing: 30 V in series with 3 Ω, $+$ toward $a$. A 12 Ω load carries $30/(3 + 12) = 2$ A.
>    ![Schematic: the Thevenin equivalent, a 30 V source with plus on top in series with 3 Ω to terminal a, its minus side to terminal b.](el-equivalents--p-series-ccvs-answer.svg)
> Answer: 30 V behind 3 Ω; 2 A. (Shorting the controlled source and reducing would give $6\parallel2\parallel3 = 1$ Ω.)

> [!problem] A voltage-controlled source behind two resistors (d 3.5)
> Find the resistance $R_{th}$ seen at $a$, $b$ as a function of the gain $\mu$, and sketch it for $0 \le \mu \le 8$. For which $\mu$ is it negative? For which $\mu$ do the terminals act as a short circuit, and for which as an open circuit?
> ![Schematic: terminal a feeds a 2 Ω resistor to a node; the node has 3 Ω to the bottom rail (terminal b), across which v_x is taken (plus on top), and 6 Ω to a controlled voltage source μ v_x, plus on top, which returns to the bottom rail, terminal b.](el-equivalents--p-gain.svg)
^inv-el-gain-sweep

> [!solution]- Solution
> methods: dependent-only, test-source
> ![Plot: R_th against μ from 0 to 8. It rises from 4 Ω at μ = 0 through 5 and 8 Ω toward plus infinity as μ approaches 3, returns from minus infinity just above 3, passes −4 Ω at μ = 4 and zero at μ = 6, and approaches 2 Ω from below as μ grows. The band 3 < μ < 6, where R_th is negative, is shaded.](el-equivalents--p-gain-sweep.svg)
> 1. No independent source, so a test source: 1 A into $a$. KCL at the node, whose voltage is $v_x$: $1 = v_x/3 + (v_x - \mu v_x)/6$, so $v_x = 6/(3 - \mu)$.
> 2. $R_{th} = 2 + v_x = 2 + \dfrac{6}{3 - \mu}$ Ω. Checks: $\mu = 0$ gives $2 + 3\parallel6 = 4$ Ω; $\mu = 1$ gives 5 Ω, since the 6 Ω then has equal voltages at both ends and carries nothing.
> 3. Negative when $6/(3 - \mu) < -2$, that is for $3 < \mu < 6$; at $\mu = 4$ it is $-4$ Ω.
> 4. A short ($R_{th} = 0$) at $\mu = 6$. An open circuit at $\mu = 3$: the node then draws $v_x/3 + (v_x - 3v_x)/6 = 0$ for every $v_x$, so no current can be forced into $a$.
> Answer: $R_{th} = 2 + 6/(3 - \mu)$ Ω; negative for $3 < \mu < 6$; a short at $\mu = 6$, an open circuit at $\mu = 3$.

> [!problem] A voltage amplifier with feedback into an adjustable load (d 3.5)
> $R_L$ is adjusted to take the most power it can. Find that $R_L$ and the power. What percentage of the power the sources deliver then reaches $R_L$?
> ![Schematic: a 24 V source behind 2 Ω feeds a node with 2 Ω to ground, whose voltage is v_x (plus on top); a 3 Ω resistor runs from that node to the output node, which also connects through 6 Ω to a controlled voltage source 4 v_x, plus on top, and through the adjustable load R_L to ground.](el-equivalents--p-feedback-load.svg)
^inv-el-feedback-load

> [!solution]- Solution
> methods: open-short-circuit, max-power-transfer, power-balance
> 1. Open circuit, output voltage $v$: KCL at the output, $(v_x - v)/3 + (4v_x - v)/6 = 0$, so $v = 2v_x$. KCL at the $v_x$ node: $(24 - v_x)/2 = v_x/2 + (v_x - 2v_x)/3$, so $v_x = 18$ V and $V_{oc} = 36$ V.
> 2. Short circuit, $v = 0$: KCL at the $v_x$ node, $(24 - v_x)/2 = v_x/2 + v_x/3$, so $v_x = 9$ V, and $I_{sc} = 9/3 + 4\cdot9/6 = 9$ A. $R_{th} = 36/9 = 4$ Ω.
> 3. $R_L = 4$ Ω takes $36^2/(4\cdot4) = 81$ W, at 18 V and 4.5 A.
> 4. Back in the circuit with $R_L = 4$ Ω: KCL at the output, $(v_x - 18)/3 + (4v_x - 18)/6 = 4.5$, gives $v_x = 13.5$ V. The 24 V source supplies $(24 - 13.5)/2 = 5.25$ A, so 126 W; the controlled source sits at 54 V and supplies $(54 - 18)/6 = 6$ A, so 324 W. The sources deliver 450 W.
> 5. The load takes $81/450 = 18\,\%$, not 50 %: the controlled source supplies most of the power, and the 6 Ω in series with it burns 216 W.
> 6. Check: the five resistors absorb $55.125 + 91.125 + 6.75 + 216 + 81 = 450$ W.
> Answer: 4 Ω, 81 W, 18 %.

> [!problem] A resistor chosen inside a network (d 4)
> $R_x$ can take any value. Find $i_x$ as a function of $R_x$. Which $R_x$ absorbs the most power, and how much? Which $R_x$ gives $i_x = 0.4$ A?
> ![Schematic: a 40 V source behind 10 Ω feeds a node with 40 Ω to ground; the adjustable resistor R_x, carrying i_x to the right, joins it to a second node, which has 20 Ω in series with a 20 V source (plus on top) to ground, and a controlled current source 0.5 i_x, arrow down, to ground.](el-equivalents--p-inner-resistor.svg)
^inv-el-inner-resistor

> [!solution]- Solution
> methods: thevenin, test-source, max-power-transfer
> 1. Remove $R_x$ and find the Thevenin equivalent seen from its two nodes, left node $+$. With $R_x$ gone $i_x = 0$, so the controlled source is dead: the left node is a divider at $40\cdot40/50 = 32$ V, and the 20 Ω carries nothing, so the right node sits at 20 V. $V_{th} = 12$ V.
> 2. $R_{th}$, sources zeroed. The controlled source follows $i_x$, so drive the gap with a test current $i_x = 1$ A leaving the left node and entering the right node. Left node, at $v_2$: $-1 = v_2/10 + v_2/40$, so $v_2 = -8$ V. Right node, at $v_3$: $1 = 0.5 + v_3/20$, so $v_3 = 10$ V.
>    ![Schematic: the network with both sources zeroed (the 40 V and 20 V sources replaced by wires) and R_x replaced by a 1 A test current source pointing from the left node, at v_2, to the right node, at v_3. The left node has 10 Ω and 40 Ω to ground; the right node has 20 Ω and the controlled source 0.5 i_x, arrow down, to ground.](el-equivalents--p-inner-resistor-test.svg)
> 3. The current leaving at the $+$ node is $i_x$, so $v_2 - v_3 = -R_{th}\,i_x$ and $R_{th} = 18$ Ω. With $R_x$ back, $R_xi_x = 12 - 18i_x$, so $i_x = \dfrac{12}{18 + R_x}$ A.
> 4. The most power at $R_x = 18$ Ω: $12^2/(4\cdot18) = 2$ W. And $i_x = 0.4$ A needs $18 + R_x = 30$, so $R_x = 12$ Ω.
> 5. Check in the full circuit at $R_x = 12$ Ω: $v_2 = 28.8$ V and $v_3 = 24$ V put $4.8/12 = 0.4$ A through $R_x$, and KCL holds at both nodes, $1.12 = 0.72 + 0.4$ and $0.4 = 0.2 + 0.2$.
> Answer: $i_x = 12/(18 + R_x)$ A; 18 Ω, 2 W; 12 Ω. (Removing the controlled source before reducing would give $10\parallel40 + 20 = 28$ Ω.)

## Derive

> [!derive] Prove that $n$ branches, each a source $V_k$ in series with a resistor $R_k$, all joined between the same two nodes with every $+$ toward the same node, are equivalent to one source $\sum_k (V_k/R_k) \big/ \sum_k (1/R_k)$, its $+$ toward that node, in series with $1 \big/ \sum_k (1/R_k)$.
^d-millman

> [!solution]- Solution
> methods: source-transformation
> 1. Transform each branch into $V_k/R_k$ beside $R_k$.
> 2. Parallel current sources add, and parallel conductances add: $\sum_k V_k/R_k$ beside $1/\sum_k(1/R_k)$.
> 3. Transform back. (Check: 12 V behind 2 Ω, 6 V behind 3 Ω and 0 V behind 6 Ω give 8 A beside 1 Ω, that is 8 V behind 1 Ω.)

> [!derive] Prove that a current source controlled by its own voltage, or a voltage source controlled by its own current, is equivalent to a resistor, and find the resistance, with its sign, for $g\,v$ and for $r\,i$.
^d-self-controlled

> [!solution]- Solution
> methods: el-equivalents/equivalent
> 1. Take $v$ and $i$ on the source itself with the [passive sign convention](el-dc-analysis.md#^psc). A current source $g\,v$ whose arrow runs through it from its $+$ end to its $-$ end has terminal relation $i = gv$: a resistor $1/g$.
> 2. With the arrow the other way, $i = -gv$: a resistance $-1/g$. A voltage source $r\,i$ whose $+$ terminal is where $i$ enters gives $v = ri$, a resistor $r$; reversed, $-r$.
> 3. Equal terminal relations mean [equivalence](#^equivalent), so after the swap route 1 applies. (Check: a source $0.25\,v$ whose arrow points toward its own $+$ end is $-4$ Ω, and beside 2 Ω it leaves $+4$ Ω.)

> [!derive] Prove that the most power a linear two-terminal circuit with $R_{th} > 0$ can deliver to a resistor is $V_{oc}I_{sc}/4$, and that the load voltage is then $V_{oc}/2$.
^d-max-power-oc-sc

> [!solution]- Solution
> methods: max-power-transfer, el-equivalents/norton
> 1. $P_{max} = V_{th}^2/(4R_{th})$ and $I_{sc} = V_{th}/R_{th}$, so $P_{max} = V_{oc}I_{sc}/4$.
> 2. At $R_L = R_{th}$ the divider halves $V_{th}$. (Check with the voltage-controlled current source example: $45\cdot2.25/4 = 25.3$ W $= 45^2/(4\cdot20)$.)

> [!derive] A current-controlled voltage source $r\,i_c$ sits in series with a resistor $R$, and $i_c$ flows in some other branch. Prove that the pair may be replaced by a current source $r\,i_c/R$ in parallel with $R$, its arrow as in Theorem 3. What goes wrong if $i_c$ is the current through $R$ itself?
^d-transform-dependent

> [!solution]- Solution
> methods: source-transformation
> 1. The proof of [Theorem 3](#^p-source-transform) compares $v = Ri + v_s$ with $i + v_s/R = v/R$ at one instant. It never uses that $v_s$ is constant, only that $v_s$ does not depend on the pair's own current. With $v_s = r\,i_c$ and $i_c$ outside the pair, both forms still give $v = Ri + r\,i_c$.
> 2. If $i_c$ is the current through $R$, flowing on into the source's $+$ terminal, the series pair is the resistor $R + r$ ([self-controlled sources](#^d-self-controlled)). In the parallel form the current through $R$ is $v/R$, no longer the terminal current, so the controlling variable has changed meaning and the swap is wrong.
