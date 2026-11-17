---
study: basic
id: dd-boolean-cmos
title: Boolean logic and CMOS gates
area: dd
needs: []
build: 1
tracks: [asic]
---

> Written by a model for Adit. Not Adit's words.

Needs: nothing. This basic starts from two voltage levels and a switch, and ends at how long a gate takes to switch and how much energy it burns doing so. Three proofs borrow a tool from elsewhere: [induction](found-induction.md#^induction), [AM-GM](ineq-convexity.md#^am-gm) and the [first-order response](th-transient.md#^time-constant). ^needs

## Boolean algebra

> [!def] Boolean values, operations and functions
> A **Boolean variable** takes a value in $\{0,1\}$. AND, written $xy$, is 1 exactly when both inputs are 1. OR, written $x+y$, is 1 when at least one input is 1. NOT, written $\bar x$, is 1 exactly when $x$ is 0. A **Boolean function** of $n$ inputs is a map $\{0,1\}^n \to \{0,1\}$; its **truth table** lists its value on all $2^n$ input **rows**. Two expressions are **equal** when they define the same function.
^bool-def

> [!thm] Laws of Boolean algebra
> For all $x, y, z \in \{0,1\}$:
>
> | law | AND form | OR form |
> |---|---|---|
> | identity | $x \cdot 1 = x$ | $x + 0 = x$ |
> | null | $x \cdot 0 = 0$ | $x + 1 = 1$ |
> | idempotence | $xx = x$ | $x + x = x$ |
> | complement | $x \bar x = 0$ | $x + \bar x = 1$ |
> | involution | $\bar{\bar x} = x$ | |
> | commutative | $xy = yx$ | $x + y = y + x$ |
> | associative | $(xy)z = x(yz)$ | $(x+y)+z = x+(y+z)$ |
> | distributive | $x(y+z) = xy + xz$ | $x + yz = (x+y)(x+z)$ |
> | absorption | $x(x+y) = x$ | $x + xy = x$ |
^boolean-algebra

> [!proof]- Proof
> 1. Each side of each law is a Boolean function of at most three variables, so it has at most $2^3 = 8$ rows, and two functions are equal exactly when they agree on every row.
> 2. Check the rows. The only law that surprises is OR distributing over AND: if $x = 1$ both $x + yz$ and $(x+y)(x+z)$ are 1; if $x = 0$ both reduce to $yz$.
^p-boolean-algebra

Proving an identity by checking every row is called **perfect induction**. Each law's OR form is its AND form with AND and OR swapped and 0 and 1 swapped; that swap is called taking the **dual**. ^perfect-induction

> [!thm] De Morgan's laws
> For every $n \ge 1$:
> $$\overline{x_1 x_2 \cdots x_n} = \bar x_1 + \bar x_2 + \dots + \bar x_n, \qquad \overline{x_1 + x_2 + \dots + x_n} = \bar x_1 \bar x_2 \cdots \bar x_n.$$
^de-morgan

> [!proof]- Proof (d 1.5)
> 1. For $n = 1$ both sides are $\bar x_1$. For $n = 2$, $\overline{x_1 x_2}$ is 0 only on the row $x_1 = x_2 = 1$, and so is $\bar x_1 + \bar x_2$.
> 2. Assume the first law for $n$ variables and let $P = x_1 \cdots x_n$, so $x_1 \cdots x_{n+1} = P\,x_{n+1}$ by associativity.
> 3. The two-variable case gives $\overline{P x_{n+1}} = \bar P + \bar x_{n+1}$; replace $\bar P$ using the assumption.
> 4. For the second law, apply the first to $\bar x_1, \dots, \bar x_n$, use involution, and complement both sides.
^p-de-morgan

## Canonical forms

> [!def] Literals, minterms and two-level forms
> A **literal** is a variable or its complement. A **product term** is an AND of literals. A **minterm** of $n$ variables is a product term containing every variable once, plain or complemented, so it is 1 on exactly one row. A **sum of products** (SOP) is an OR of product terms. Dually, a **maxterm** is an OR containing every variable once (0 on exactly one row), and a **product of sums** (POS) is an AND of ORs of literals.
^minterm-def

> [!thm] Shannon expansion and canonical forms
> For every function $f$ and every input $x$,
> $$f = x \, f|_{x=1} + \bar x \, f|_{x=0},$$
> where $f|_{x=c}$ is $f$ with $x$ fixed to $c$ (a **cofactor**). Consequently every function equals the OR of the minterms of its 1-rows (its **canonical SOP**) and the AND of the maxterms of its 0-rows (its **canonical POS**), and each is unique up to order.
^canonical-forms

> [!proof]- Proof (d 1.5)
> 1. If $x = 1$ the right side is $f|_{x=1}$, and if $x = 0$ it is $f|_{x=0}$; on every row it equals $f$.
> 2. Expand $f$ on $x_1$, each cofactor on $x_2$, and so on through $x_n$. The result is an OR of $2^n$ terms, each a minterm times the constant $f(c_1, \dots, c_n)$ of its row.
> 3. Drop the terms whose constant is 0; the OR of the minterms of the 1-rows remains.
> 4. A minterm is 1 on its own row only, so two different sets of minterms give two different functions: the form is unique.
> 5. Apply steps 2 to 4 to $\bar f$ and complement with [De Morgan](dd-boolean-cmos.md#^de-morgan) to get the canonical POS.
^p-canonical-forms

Canonical forms are long. An **implicant** of $f$ is a product term that is 1 only on rows where $f$ is 1; it is **prime** if deleting any literal breaks that. A minimal SOP is an OR of prime implicants, because a non-prime term can always lose a literal. The merging step behind every simplification is $xP + \bar x P = P$. A Karnaugh map draws the truth table of up to four variables on a grid ordered so that neighbouring cells, including wrap-around neighbours, differ in one variable; a rectangle of $2^k$ ones is then a product term with $k$ fewer literals than a minterm. ^implicants

> [!def] Monotone functions
> Order rows bitwise: $u \le v$ when $u_i \le v_i$ for every $i$. A function is **monotone increasing** (positive unate) if $u \le v$ implies $f(u) \le f(v)$, and **monotone decreasing** (negative unate) if $u \le v$ implies $f(u) \ge f(v)$.
^monotone-def

> [!thm] Lemma (positive sum of products)
> A function is monotone increasing exactly when it is an OR of products of uncomplemented variables (the empty OR is 0, the empty product is 1).
^monotone-sop

> [!proof]- Proof (d 2)
> 1. A product or sum of uncomplemented variables is monotone increasing, and AND and OR of monotone increasing functions stay monotone increasing; so every such SOP is.
> 2. Conversely, let $f$ be monotone increasing. For each 1-row $u$, let $P_u$ be the AND of the variables that are 1 in $u$.
> 3. $P_u(v) = 1$ exactly when $v \ge u$, and then $f(v) \ge f(u) = 1$; so $P_u$ is an implicant of $f$.
> 4. The OR of all $P_u$ is 1 on each 1-row $u$ (through $P_u$) and, by step 3, nowhere else. It equals $f$.
^p-monotone-sop

> [!example] XOR from one gate type
> The NAND gate outputs $\overline{ab}$. Build $a \oplus b$ (1 exactly when $a \ne b$) from NAND gates alone, using as few as you can.
^ex-xor-nand

> [!solution]- Solution
> methods: dd-boolean-cmos/de-morgan, dd-boolean-cmos/boolean-algebra
> 1. Let $n = \overline{ab}$. Then $\overline{a n} = \bar a + ab = \bar a + b$ by De Morgan, and similarly $\overline{b n} = a + \bar b$.
> 2. A fourth NAND gives $\overline{(\bar a + b)(a + \bar b)} = \overline{\bar a \bar b + ab}$, which is 1 exactly when $a \ne b$.
> 3. Four NAND gates; the shared first gate is what saves the fifth. Checked on all four rows.

## CMOS gates

> [!def] MOSFETs as switches
> A MOSFET has a gate, a source and a drain. In the **switch model**, an **nMOS** transistor connects source to drain when its gate is at logic 1 ($V_{DD}$) and is open when its gate is at 0 (ground). A **pMOS** transistor connects when its gate is 0 and is open when its gate is 1. An nMOS passes a 0 cleanly but a 1 only up to a threshold voltage below $V_{DD}$; a pMOS passes a 1 cleanly but a 0 poorly. So nMOS transistors pull outputs down and pMOS transistors pull them up.
^switch-model

> [!def] CMOS inverter
> One pMOS from $V_{DD}$ to the output and one nMOS from the output to ground, both gates driven by the input $A$. When $A = 1$ only the nMOS conducts and the output is 0; when $A = 0$ only the pMOS conducts and the output is 1. In either steady state no path joins $V_{DD}$ to ground, so the gate draws no current except leakage, and its output sits at a full rail.
^cmos-inverter

> [!def] Static complementary CMOS gate
> A **pull-down network** of nMOS transistors between the output and ground, and a **pull-up network** of pMOS transistors between $V_{DD}$ and the output, each transistor gate driven by an input, arranged so that on every input row exactly one network conducts. The output is 0 when the pull-down conducts and 1 when the pull-up does. A network is **series-parallel** if it is one transistor, or two series-parallel networks in series, or two in parallel. Its **dual** is the same tree with every series joint made parallel and every parallel joint made series.
^static-gate-def

> [!thm] Lemma (dual networks)
> Let $g$ be 1 on the rows where a series-parallel nMOS network conducts. The dual network, built of pMOS transistors on the same inputs, conducts exactly on the rows where $g = 0$.
^dual-network

> [!proof]- Proof
> 1. Induct on how the network is built, one joint at a time ([induction](found-induction.md#^induction)).
> 2. One transistor on input $a$: the nMOS conducts when $a = 1$; its dual, one pMOS on $a$, conducts when $a = 0$, which is when $g = 0$.
> 3. Two networks in series: $g = g_1 g_2$. The dual puts their duals in parallel, which conducts when $\bar g_1 + \bar g_2 = 1$, that is when $\overline{g_1 g_2} = 1$ by [De Morgan](dd-boolean-cmos.md#^de-morgan).
> 4. Two networks in parallel: $g = g_1 + g_2$. The dual puts their duals in series, which conducts when $\bar g_1 \bar g_2 = \overline{g_1 + g_2} = 1$.
^p-dual-network

> [!thm] Theorem (what one static CMOS stage computes)
> A non-constant function $f$ of inputs $x_1, \dots, x_n$ is computed by one static complementary CMOS gate whose transistors are driven by the uncomplemented inputs exactly when $f$ is monotone decreasing. For such $f$, a pull-down network that realises a positive SOP of $\bar f$ (each product as transistors in series, the products in parallel), with its dual as the pull-up, works.
^cmos-gates

> [!proof]- Proof (d 3)
> 1. Raising an input from 0 to 1 closes nMOS switches and opens none, so the pull-down's set of conducting paths only grows: its conduction $g$ is monotone increasing.
> 2. Exactly one network conducts, so the output is $\bar g$, which is monotone decreasing.
> 3. Conversely, let $f$ be non-constant and monotone decreasing. Then $\bar f$ is non-constant and monotone increasing, so by the [lemma](dd-boolean-cmos.md#^monotone-sop) it is a non-empty OR of non-empty products of uncomplemented variables.
> 4. Build the pull-down from that SOP: series for each product, parallel across products. It is series-parallel and conducts exactly when $\bar f = 1$.
> 5. Use its dual in pMOS as the pull-up. By the [dual lemma](dd-boolean-cmos.md#^dual-network) it conducts exactly when $\bar f = 0$; so exactly one network conducts on each row and the output is $f$.
^p-cmos-gates

So NAND is nMOS in series with pMOS in parallel, NOR is the reverse, and AND or OR costs a gate plus an inverter. A static gate uses two transistors per input occurrence. Complex single-stage gates such as AND-OR-INVERT are often cheaper than building the same function from NANDs. ^gate-consequences

> [!example] An AND-OR-INVERT gate
> Draw the pull-down and pull-up networks for $Y = \overline{AB + C}$, count the transistors, and check the row $A = 1, B = 0, C = 0$.
^ex-aoi21

> [!solution]- Solution
> methods: dd-boolean-cmos/cmos-gates, dd-boolean-cmos/dual-network
> 1. $\bar Y = AB + C$ is already a positive SOP. Pull-down: nMOS on $A$ and $B$ in series, that pair in parallel with an nMOS on $C$.
> 2. Pull-up, the dual: pMOS on $A$ and $B$ in parallel, that pair in series with a pMOS on $C$.
> 3. Six transistors. On $A = 1, B = 0, C = 0$ the pull-down has no path ($B$ and $C$ off); in the pull-up the $B$ pMOS is on and the $C$ pMOS is on, so the output is 1, matching $\overline{0 + 0}$. A switch-level model agrees with $\overline{AB+C}$ on all eight rows.

## Delay

> [!def] RC model of a switching gate
> For delay, a conducting transistor of width $W$ (in multiples of a unit width) is a resistor $R/W$ if nMOS and $\mu R/W$ if pMOS. Here $\mu$, about 2 to 3 in bulk silicon because holes are less mobile than electrons, is the pMOS-to-nMOS resistance ratio at equal width. Transistors in series add their resistances. Each transistor's gate loads whatever drives it with capacitance $W C_g$. The **load** $C$ on an output node is the input capacitance of every gate it drives, plus the wire, plus the driver's own drain capacitance.
^rc-model

> [!thm] Step response of an RC node
> A node of capacitance $C$ at $V_{DD}$, joined at $t = 0$ to ground through resistance $R$, follows $v(t) = V_{DD} e^{-t/RC}$ and crosses $V_{DD}/2$ at $t_{pd} = RC \ln 2 \approx 0.69\,RC$. Charging from 0 through $R$ crosses $V_{DD}/2$ at the same time.
^rc-delay

> [!proof]- Proof
> 1. The current leaving the capacitor flows through the resistor: $C \, dv/dt = -v/R$, a [first-order system](th-transient.md#^time-constant) with $\tau = RC$.
> 2. With $v(0) = V_{DD}$ that gives $v = V_{DD} e^{-t/RC}$; setting $v = V_{DD}/2$ gives $t = RC \ln 2$.
> 3. For charging, $v = V_{DD}(1 - e^{-t/RC})$, which reaches $V_{DD}/2$ at the same $t$.
^p-rc-delay

> [!example] One RC delay
> A pull-down of $10\ \text{k}\Omega$ discharges a $20\ \text{fF}$ node. Find the 50% delay.
^ex-rc

> [!solution]- Solution
> methods: dd-boolean-cmos/rc-delay
> $RC = 10^4 \times 2 \times 10^{-14} = 2 \times 10^{-10}$ s, so $t_{pd} = 0.693 \times 200\ \text{ps} \approx 139\ \text{ps}$.

> [!def] Logical effort, electrical effort and parasitic delay
> Size a gate so that its worst-case pull-down and pull-up resistances equal a unit inverter's (nMOS width 1, pMOS width $\mu$): $k$ transistors in series each get $k$ times the unit width; transistors in parallel keep it. The gate's **logical effort** $g$ is the capacitance of one of its inputs divided by the inverter's input capacitance $(1+\mu)C_g$. Its **electrical effort** is $h = C_{\text{out}}/C_{\text{in}}$. In units of $\tau$, the delay of an inverter driving an identical inverter with its own drain capacitance ignored, the gate's delay is $d = gh + p$, where the **parasitic delay** $p$ comes from its own drain capacitance ($p \approx 1$ for an inverter). With $\mu = 2$, a two-input NAND has $g = 4/3$ and a two-input NOR has $g = 5/3$.
^logical-effort

> [!def] Fanout
> The **fanout** of a net is the number of gate inputs it drives. Its load is the sum of their input capacitances, so a gate's delay grows linearly with fanout. The **FO4 delay**, an inverter driving four copies of itself ($h = 4$, $d = 4 + 1 = 5\tau$), is the usual process-independent yardstick: a clock period is quoted as so many FO4 delays.
^fanout

> [!thm] Theorem (equal stage effort)
> A path of $N$ gates drives a fixed load from a fixed input capacitance. The product $F = \prod g_i h_i$ (its **path effort**) is then fixed, and the path delay $\sum (g_i h_i + p_i)$ is smallest when every stage effort $g_i h_i$ equals $F^{1/N}$, giving $D = N F^{1/N} + \sum p_i$. (No branching: each stage drives only the next.)
^stage-effort

> [!proof]- Proof (d 2.5)
> 1. Each stage's load is the next stage's input, so $\prod h_i = C_{\text{load}}/C_{\text{in}}$ is fixed; the $g_i$ depend only on gate types, so $F = \prod g_i h_i$ is fixed.
> 2. The $p_i$ do not depend on sizing, so minimise $\sum f_i$ with $f_i = g_i h_i > 0$ and $\prod f_i = F$.
> 3. By [AM-GM](ineq-convexity.md#^am-gm), $\sum f_i \ge N F^{1/N}$, with equality exactly when all $f_i$ are equal.
> 4. Equal stage efforts are reachable: size the gates from the load backwards so that each input capacitance is $g_i C_{\text{out},i}/F^{1/N}$.
^p-stage-effort

## Power

> [!thm] Theorem (dynamic power)
> Charging a node of capacitance $C$ from 0 to $V_{DD}$ draws $C V_{DD}^2$ from the supply, of which $\tfrac12 C V_{DD}^2$ is dissipated in the pull-up, whatever its resistance, and $\tfrac12 C V_{DD}^2$ is stored and later dissipated in the pull-down. If the node rises with probability $\alpha$ per clock cycle (its **activity factor**) at clock frequency $f$, its average power is
> $$P = \alpha C V_{DD}^2 f.$$
^dynamic-power

> [!proof]- Proof (d 2)
> 1. During the rise the supply delivers the charge $Q = C V_{DD}$ at the fixed voltage $V_{DD}$, so it supplies energy $Q V_{DD} = C V_{DD}^2$.
> 2. The capacitor ends with energy $\int_0^{V_{DD}} C v \, dv = \tfrac12 C V_{DD}^2$.
> 3. The rest, $\tfrac12 C V_{DD}^2$, is dissipated in the pull-up; no step used the pull-up's resistance.
> 4. On the fall the supply delivers nothing and the stored $\tfrac12 C V_{DD}^2$ is dissipated in the pull-down.
> 5. A full rise and fall costs $C V_{DD}^2$ from the supply. With $\alpha f$ rises per second the average power is $\alpha C V_{DD}^2 f$.
^p-dynamic-power

Two other terms add to it. **Short-circuit** current flows briefly while both networks are partly on during a slow input edge. **Leakage** current flows through transistors that are nominally off, giving a static power $V_{DD} I_{\text{leak}}$ that grows quickly as threshold voltages drop in newer processes. ^other-power

> [!example] A block's switching power
> A block has 50 000 switching nodes of 5 fF each, activity factor 0.1, supply 1.8 V, clock 50 MHz. Estimate its dynamic power.
^ex-block-power

> [!solution]- Solution
> methods: dd-boolean-cmos/dynamic-power
> Total switched capacitance $C = 5 \times 10^4 \times 5 \times 10^{-15} = 2.5 \times 10^{-10}$ F. Then $P = 0.1 \times 2.5 \times 10^{-10} \times 1.8^2 \times 5 \times 10^7 \approx 4.05$ mW.

## Derive

> [!derive] Prove that every Boolean function can be built from two-input NAND gates alone.
^d-nand-complete

> [!derive] Prove that $xy + \bar x z + yz = xy + \bar x z$ for all $x, y, z$, without a truth table.
^d-consensus

> [!derive] Prove that if an identity between two expressions built from AND, OR, NOT, 0 and 1 holds, so does its dual (AND and OR swapped, 0 and 1 swapped).
^d-duality

> [!derive] Prove that no single static complementary CMOS gate driven by uncomplemented $A$ and $B$ computes $A \oplus B$.
^d-xor-one-stage

> [!derive] For a chain of inverters with path effort $F$ and parasitic delay $p$ per stage, treating the number of stages as continuous, prove that the delay-minimising stage effort $\rho$ satisfies $\rho(\ln \rho - 1) = p$, and that $\rho = e$ when $p = 0$.
^d-optimal-effort

## Problems

> [!problem] A block at a new operating point (d 2)
> A block burns 12 mW at 1.8 V and 40 MHz, nearly all of it dynamic. It is moved to 1.5 V and 60 MHz with the same logic and the same activity. What does it burn now? Which assumption would fail first if the supply kept dropping?
^inv-dd-power-scaling

> [!solution]- Solution
> methods: dd-boolean-cmos/dynamic-power, scaling
> 1. $P \propto V_{DD}^2 f$ with $\alpha$ and $C$ fixed, so $P = 12 \times (1.5/1.8)^2 \times (60/40) \approx 12.5$ mW.
> 2. Gates slow down as $V_{DD}$ approaches the threshold voltage (less drive current, so larger effective $R$), so at some lower supply the block can no longer close timing at the higher clock; leakage, which does not scale with $f$, also becomes a larger share.
> Answer: about 12.5 mW.

> [!problem] Driving a pad (d 3)
> An inverter whose input capacitance is 4 fF must drive a 4 pF pad through a chain of inverters ($g = 1$, $p = 1$ each). (a) How many inverters minimise the delay, and what is that delay in $\tau$? (b) If the pad must see the same polarity as the input, what changes?
^inv-dd-inverter-chain

> [!solution]- Solution
> methods: dd-boolean-cmos/stage-effort
> 1. $F = H = 4000/4 = 1000$. The delay is $D(N) = N \cdot 1000^{1/N} + N$.
> 2. $D(4) \approx 26.5$, $D(5) \approx 24.9$, $D(6) \approx 25.0$, $D(7) \approx 25.8$. Minimum at $N = 5$, stage effort $1000^{1/5} \approx 3.98$, $D \approx 24.9\tau$.
> 3. Five inverters invert. For the same polarity $N$ must be even: $N = 6$ costs $\approx 25.0\tau$, almost nothing extra.
> Answer: (a) 5 stages, about $24.9\tau$; (b) 6 stages, about $25.0\tau$.

> [!problem] Three-input majority in CMOS (d 3)
> $M(A,B,C)$ is 1 when at least two inputs are 1. Show that no single static complementary CMOS gate driven by $A, B, C$ computes $M$. Then build $M$ as one complex gate followed by an inverter with as few transistors as you can, and count them.
^inv-dd-majority-gate

> [!solution]- Solution
> methods: dd-boolean-cmos/cmos-gates, dd-boolean-cmos/dual-network
> 1. $M(0,0,0) = 0$ and $M(1,1,1) = 1$: $M$ rises when its inputs rise, so it is not monotone decreasing and the theorem rules out one stage.
> 2. Build $\bar M$ in one stage: its pull-down realises $M = AB + BC + CA$. Factor it as $AB + C(A + B)$: five literals, so five nMOS: a series pair on $A$ and $B$, in parallel with a branch made of an nMOS on $C$ in series with a parallel pair on $A$ and $B$.
> 3. The pull-up is the dual: five pMOS. Add the output inverter: $5 + 5 + 2 = 12$ transistors. The unfactored SOP would need $6 + 6 + 2 = 14$.
> 4. A switch-level model of the 12-transistor circuit matches $M$ on all eight rows.
> Answer: 12 transistors.

> [!problem] Three-input NAND against three-input NOR (d 2.5)
> Take $\mu = 2$ and parasitic delay equal to the number of inputs ($p = 3$ for both gates). Size a three-input NAND and a three-input NOR for unit-inverter drive, find each one's logical effort, and compare their delays when each drives four copies of itself.
^inv-dd-nor3-effort

> [!solution]- Solution
> methods: dd-boolean-cmos/logical-effort, dd-boolean-cmos/fanout
> 1. NAND3: three nMOS in series, each width 3; three pMOS in parallel, each width 2. Input capacitance $3 + 2 = 5$ against the inverter's 3: $g = 5/3$.
> 2. NOR3: three nMOS in parallel, width 1; three pMOS in series, each width $3 \times 2 = 6$. Input $1 + 6 = 7$: $g = 7/3$.
> 3. Driving four copies of itself, $h = 4$: NAND3 $d = 4 \cdot 5/3 + 3 \approx 9.67\tau$, NOR3 $d = 4 \cdot 7/3 + 3 \approx 12.33\tau$. The series pMOS stack is what makes NOR slow.
> Answer: $g = 5/3$ and $7/3$; about $9.7\tau$ against $12.3\tau$.

> [!problem] Functions one stage can compute (d 4)
> How many of the 256 Boolean functions of three inputs $A, B, C$ can a single static complementary CMOS gate driven by the uncomplemented inputs compute? (Constant outputs need no transistors and do not count.)
^inv-dd-one-stage-count

> [!solution]- Solution
> methods: dd-boolean-cmos/cmos-gates, dd-boolean-cmos/monotone-sop
> 1. By the theorem, the answer is the number of non-constant monotone decreasing functions of three inputs. Complementing is a bijection with monotone increasing functions, so count those.
> 2. By the lemma, a monotone increasing function is fixed by its set of minimal 1-rows, which is a set of rows none of which lies below another (an antichain in the cube).
> 3. Count antichains of $\{0,1\}^3$ by size. Empty: 1 (the constant 0). The single row $000$: 1 (the constant 1). Single non-zero rows: 7.
> 4. Pairs of incomparable rows: 3 among the weight-1 rows, 3 among the weight-2 rows, and 3 mixing a weight-1 row with the one weight-2 row that does not contain its 1. Row $111$ is comparable to everything. Total 9.
> 5. Triples: the three weight-1 rows, or the three weight-2 rows: 2. No antichain has four rows. Total $1 + 1 + 7 + 9 + 2 = 20$; an enumeration of all 256 truth tables agrees.
> 6. Removing the two constants leaves 18.
> Answer: 18.
