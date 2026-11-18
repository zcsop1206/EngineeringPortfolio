---
study: basic
id: el-dc-analysis
title: Node voltages and mesh currents
area: el
needs: []
build: 1
tracks: [mie342, interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: none. Two proofs use [rank-nullity](la-core.md#^rank-nullity), linked where used.
^needs

Two laws and one law per element give as many equations as unknowns. The node-voltage and mesh-current methods choose the unknowns so that one of Kirchhoff's laws holds by itself and only the other is written; sources fix some unknowns outright, and the faster method has fewer left. One sum checks every answer: the powers absorbed by all the elements add to zero.
^thread

## Circuits as graphs

> [!def] Elements, nodes, branches, loops, meshes
> The **lumped model** treats a circuit as two-terminal elements joined by ideal wires, each element described only by the current $i$ through it (charge per unit time) and the voltage $v$ across it (energy per unit charge). A **node** is a point where two or more elements join, with every wire attached to it: a wire has no voltage across it, so everything it connects is one node, however many junctions are drawn. An **essential node** joins three or more elements. A **branch** is one element; an **essential branch** is a path between two essential nodes through no other essential node, so elements joined end to end through non-essential nodes, such as a source and the resistor after it, form one. A **loop** is a closed path that visits no node twice. A circuit is **planar** if it can be drawn without crossing branches; a **mesh** is a loop of such a drawing with no branch inside it, a window. $n$ counts nodes and $b$ branches; $n_e$ and $b_e$ count the essential ones.
> ![Schematic: source v_s and resistors R_0 to R_5; nodes s, a, b, c; a bottom rail joining v_s, R_2 and R_4, one node, with the ground symbol; R_5 bridges over the top from a to c; mesh currents i_1, i_2, i_3](el-dc-analysis--graph.svg)
^graph

In the figure the bottom rail is one node. Node s joins only $v_s$ and $R_0$, so it is not essential, and $v_s$ with $R_0$ is one essential branch. All nodes: $n = 5$, $b = 7$; essential ones: $n_e = 4$, $b_e = 6$. Both give $b - n + 1 = 3$ windows, because a non-essential node adds one node and one branch.
^count-example

> [!def] Reference directions and the passive sign convention
> Each element gets a **reference direction** for its current (an arrow) and a **reference polarity** for its voltage ($+$ and $-$) before anything is solved: bookkeeping, not predictions, so a negative answer means the actual quantity points the other way. Under the **passive sign convention** the current arrow enters the $+$ terminal, and $p = vi$ is the power the element **absorbs**; if the arrow enters the $-$ terminal, the element absorbs $p = -vi$. Negative absorbed power is power **delivered** (the problem sets say **developed**). A resistor obeys **Ohm's law**, $v = Ri$, in this convention and absorbs $i^2R = v^2/R \ge 0$, the power it **dissipates** as heat; a source can absorb or deliver.
> ![Two panels: the current arrow i enters the + terminal (the element absorbs p = vi) or the − terminal (it absorbs p = −vi)](el-dc-analysis--psc.svg)
^psc

Why $vi$: in time $dt$ a charge $i\,dt$ passes from $+$ to $-$ and gives up energy $v$ per unit charge, $vi\,dt$ in all, to the element.
^why-vi

> [!def] Independent sources
> An **independent voltage source** holds its terminal voltage at a set value whatever current flows; an **independent current source** holds its current at a set value whatever voltage appears across it. Both are drawn as circles, a voltage source's with $+$ and $-$ inside and a current source's with an arrow. The current through a voltage source, and the voltage across a current source, are set by the rest of the circuit.
^sources

> [!def] Dependent sources
> A **dependent** (controlled) source holds a voltage or a current equal to a constant, its **gain**, times a voltage or current elsewhere in the circuit, its **controlling variable**. Four kinds: the voltage-controlled voltage source (VCVS) $v = \mu v_x$, the current-controlled voltage source (CCVS) $v = ri_x$ ($r$ in ohms), the voltage-controlled current source (VCCS) $i = gv_x$ ($g$ in siemens), the current-controlled current source (CCCS) $i = \beta i_x$. They are drawn as diamonds, with $+$ and $-$ for the two voltage kinds and an arrow for the two current kinds. In node or mesh analysis a dependent source enters as a source of its kind whose value is written through its controlling variable in the method's unknowns: one substitution, not a new simultaneous equation, so the counts below still hold. Like any element it absorbs $p = vi$ at its own terminals, and $p$ can have either sign.
> ![The four symbols: circles for independent sources, v_s with + and − inside, i_s with an arrow; diamonds for dependent ones, μ v_x (VCVS) or r i_x (CCVS) with + and −, g v_x (VCCS) or β i_x (CCCS) with an arrow](el-dc-analysis--sources.svg)
^dependent-sources

## Kirchhoff's laws

> [!thm] Law 1 (Kirchhoff's current law, KCL)
> The currents leaving any node sum to zero. So do the currents leaving any closed surface that cuts only through branches.
^kcl

> [!proof]- Proof (from the lumped model)
> 1. The lumped model stores no charge on a node: wires hold none, and an element that stores charge (a capacitor) holds equal and opposite charges on its plates, so it stays neutral.
> 2. Charge is conserved, so the net current leaving a node is minus the rate of change of its charge, which is zero.
> 3. For a closed surface, add the equations of the nodes inside: a branch with both ends inside appears twice with opposite signs, and a branch crossing the surface appears once, as a current leaving.
^p-kcl

> [!thm] Law 2 (Kirchhoff's voltage law, KVL)
> The voltage drops around any closed path sum to zero. Equivalently, every node has a **potential** (its voltage relative to one fixed node), and the voltage across each element is the potential of its $+$ terminal minus that of its $-$ terminal.
^kvl

> [!proof]- Proof (from the lumped model)
> 1. The lumped model lets no changing magnetic flux link a path outside the elements (an inductor keeps its flux inside), so outside them the electric field is conservative.
> 2. So each node has a potential, fixed by setting one node's to $0$, and each element's voltage is the difference of its terminals' potentials.
> 3. Around a closed path through nodes $1, \dots, k$ the differences telescope: $(e_1 - e_2) + (e_2 - e_3) + \dots + (e_k - e_1) = 0$.
> 4. Conversely, if every closed path sums to zero, define a node's potential as the drop along any path from it to the fixed node: two such paths form a closed path, so they agree.
^p-kvl

KVL holds around any closed path, including one through a current source or an open gap, whose voltage is whatever KVL makes it.
^kvl-any-path

## Power

> [!thm] Theorem 1 (power balance)
> In any circuit the powers absorbed by all the elements, each in the passive sign convention, sum to zero: power delivered equals power absorbed. More generally (Tellegen's theorem), if branch voltages $v_k$ satisfy KVL and branch currents $i_k$ satisfy KCL on the same graph, each pair in the passive sign convention, then $\sum_k v_ki_k = 0$, even when they come from two different circuits with that graph.
^power-balance

> [!proof]- Proof (d 2.5)
> 1. By KVL every node $m$ has a potential $e_m$. Branch $k$ runs from node $p$, its $+$ end where its current arrow enters, to node $q$, so $v_k = e_p - e_q$.
> 2. Regroup $\sum_k (e_p - e_q)i_k$ by nodes: node $m$ collects $e_m$ times the currents of the branches leaving $m$ minus those entering it.
> 3. That bracket is the net current leaving $m$, zero by KCL, so the sum is zero.
> 4. No element law was used, so the voltages and the currents may come from different circuits.
^p-power-balance

After solving, list every element's absorbed power, dependent sources included; the list must sum to zero. A nonzero sum proves an error. A zero sum cannot catch a circuit misread the same way everywhere, such as a source reversed in both the equations and the list.
^power-check

## Series, parallel and dividers

> [!def] Series, parallel, equivalent resistance
> Elements are in **series** when they are joined end to end at nodes that touch nothing else, so they carry one current. They are in **parallel** when they join the same two nodes, so they share one voltage. A two-terminal network has **equivalent resistance** $R_{eq}$ if $v = R_{eq}i$ at its terminals whatever is connected. The **conductance** of a resistor is $G = 1/R$, in siemens.
^series-parallel-def

> [!thm] Theorem 2 (series, parallel, dividers)
> Resistances in series add: $R_{eq} = R_1 + R_2 + \dots$. Conductances in parallel add, so two resistors in parallel give $R_1 \parallel R_2 = R_1R_2/(R_1 + R_2)$. A voltage $v$ across a series string divides in proportion to resistance, $v_k = vR_k/R_{eq}$. A current $i$ into parallel resistors divides in proportion to conductance, $i_k = iG_k/G_{eq}$, which for two resistors is $i_1 = iR_2/(R_1 + R_2)$.
> ![Two panels. Left: R_1, R_2 and R_3 in series, the current i entering at the left, v across the whole string and v_2 across R_2, each with + on the left. Right: a current i into R_1 and R_2 in parallel, splitting into i_1 and i_2, both flowing down](el-dc-analysis--dividers.svg)
^series-parallel

> [!proof]- Proof
> 1. Series: one current $i$ flows through all; KVL along the string gives $v = \sum R_ki$, so $R_{eq} = \sum R_k$ and $v_k = R_ki = vR_k/R_{eq}$.
> 2. Parallel: one voltage $v$ is across all; KCL at either end gives $i = \sum G_kv$, so $G_{eq} = \sum G_k$ and $i_k = G_kv = iG_k/G_{eq}$.
> 3. For two resistors, $G_1/(G_1 + G_2) = R_2/(R_1 + R_2)$.
^p-series-parallel

A divider formula holds only while the string carries one current, or the group shares one voltage. A load on the middle of a voltage divider breaks the formula until the load is combined into the string.
^divider-loading

> [!example] A five-resistor ladder
> Find the current $i$ in the 5 Ω resistor, and check the power balance.
> ![Schematic: 50 V source; 4 Ω in series, 15 Ω across, 6 Ω in series, then 20 Ω and 5 Ω in parallel; i down the 5 Ω in blue](el-dc-analysis--ladder.svg)
^ex-ladder

> [!solution]- Solution
> methods: series-parallel, power-balance
> ![The ladder with nested dashed boxes: 20 Ω and 5 Ω marked = 4 Ω; with the 6 Ω, = 10 Ω; with the 15 Ω, = 6 Ω](el-dc-analysis--ladder-reduce.svg)
> 1. Reduce from the far end: $20 \parallel 5 = 4$ Ω; plus 6 Ω, 10 Ω; in parallel with 15 Ω, 6 Ω; plus 4 Ω, $R_{eq} = 10$ Ω. The source current is $50/10 = 5$ A.
> 2. Expand back with current dividers: the 10 Ω path takes $5 \cdot 15/25 = 3$ A, and the 5 Ω takes $3 \cdot 20/25 = 2.4$ A of that.
> 3. Check: the source delivers $50 \cdot 5 = 250$ W; the 4, 15, 6, 20 and 5 Ω absorb $100 + 60 + 54 + 7.2 + 28.8 = 250$ W.
> Answer: $i = 2.4$ A.

## The node-voltage method

> [!def] Reference node and node voltages
> Pick one node as the **reference** (ground, potential 0), usually the one with the most branches. The **node voltage** of every other node is its potential relative to the reference. Every branch voltage is the difference of two node voltages.
^node-voltage-def

> [!thm] Theorem 3 (node-voltage method)
> In a connected circuit with $n$ nodes, take the $n - 1$ node voltages as the unknowns. Then KVL holds automatically, and the KCL equations at the $n - 1$ non-reference nodes are independent and imply KCL at the reference. When every branch current is a function of node voltages (resistors, current sources, voltage-controlled current sources), these are $n - 1$ equations in the $n - 1$ unknowns carrying all of Kirchhoff's laws.
^node-method

> [!proof]- Proof (d 3)
> 1. KVL: each branch voltage is $e_p - e_q$, so the drops around any closed path telescope to zero (Law 2).
> 2. Each branch current appears in exactly two node equations, leaving one node and entering the other, so all $n$ equations add to $0 = 0$: any one follows from the rest.
> 3. If a combination of the node equations with coefficients $y_m$ vanishes identically, a branch from $p$ to $q$ has total coefficient $y_p - y_q$, which must be $0$.
> 4. The circuit is connected, so $y$ is the same at every node; leaving out the reference's equation makes its $y$, hence every $y$, zero. The other $n - 1$ equations are independent.
> 5. The element laws write each branch current through node voltages: $n - 1$ equations in $n - 1$ unknowns.
^p-node-method

> [!thm] Theorem 4 (conductance-matrix form)
> For a circuit of positive resistors and independent current sources, the node equations are $\mathbf G\mathbf v = \mathbf i_s$: $\mathbf v$ lists the node voltages, $G_{kk}$ is the sum of the conductances touching node $k$, $G_{jk}$ for $j \ne k$ is minus the sum of the conductances joining $j$ and $k$, and $i_{s,k}$ is the net source current pushed into node $k$. $\mathbf G$ is symmetric, and it is invertible, so the solution is unique, when every node is joined to the reference by a path of resistors.
^conductance-matrix

> [!proof]- Proof (d 3)
> 1. KCL at node $k$, currents leaving: $\sum_j G_{kj}^{\text{br}}(v_k - v_j) + G_{k0}v_k = i_{s,k}$, with $G_{kj}^{\text{br}}$ the conductance joining $k$ and $j$ and $G_{k0}$ that to the reference; collect coefficients.
> 2. A conductance between $j$ and $k$ enters $G_{jk}$ and $G_{kj}$ alike, so $\mathbf G$ is symmetric.
> 3. Expanding each resistor's $G(v_j - v_k)^2$ and comparing with step 1 gives $\mathbf v^\top\mathbf G\mathbf v = \sum_{\text{resistors}} G\,(\text{its voltage})^2$, with $v = 0$ at the reference.
> 4. If $\mathbf G\mathbf v = 0$, every resistor has zero voltage, so along a resistor path to the reference every node voltage is $0$. The kernel is $\{0\}$, so $\mathbf G$ is invertible ([rank-nullity](la-core.md#^rank-nullity)).
^p-conductance-matrix

By inspection, row $k$ reads: (sum of the conductances at $k$) $\times\, v_k$, minus (conductance to each neighbour $j$) $\times\, v_j$, equals the source current pushed into $k$. Substituting a dependent source's controlling variable moves terms left, which breaks the symmetry and can break the invertibility. A thermal network has the same matrix ([networks of resistances and capacitances](th-transient.md#^rc-networks)).
^by-inspection

> [!thm] Theorem 5 (supernode)
> Let a voltage source, independent or dependent and alone in its branch, join two non-reference nodes $a$ and $b$, fixing $v_b - v_a = v_s$, and call its current $i_V$. KCL for a closed surface around $a$, $b$ and the source (the **supernode**), which $i_V$ does not cross, together with the constraint, replaces KCL at $a$ and at $b$. Substituting the constraint leaves one unknown fewer, and $i_V$ follows from KCL at $a$ alone. A voltage source from a node to the reference makes that node's voltage known (a dependent one, in terms of its controlling variable), and that node's KCL equation only gives the source's current $i_V$. Either way, if another dependent source is controlled by $i_V$, the equation that gives $i_V$ stays, as the substitution that writes $i_V$ in the node voltages.
> ![Schematic: v_1 and R_1 feed node a; voltage source v_s, + at b, from a to b; R_2 and R_3 from a and b to the rail; R_4 and current source i_2 on the right; a dashed surface encloses a, v_s and b, cutting R_1 to R_4](el-dc-analysis--supernode.svg)
^supernode

> [!proof]- Proof
> 1. No element law fixes the source's current $i_V$: take it as one more unknown, with the source law as one more equation.
> 2. KCL at $a$ and at $b$ contain the branch current $i_V$ with opposite signs, so it cancels in their sum; the sum is KCL for the closed surface (Law 1).
> 3. The pair (sum, KCL at $a$) is equivalent to (KCL at $a$, KCL at $b$). If nothing else depends on $i_V$, KCL at $a$ is the only equation containing it and only determines it; otherwise it serves to eliminate $i_V$ from the rest.
> 4. A source to the reference fixes its node's voltage (through its controlling variable, if dependent), and KCL at that node plays the part of KCL at $a$ in step 3.
^p-supernode

A voltage source in series with a resistor between two essential nodes is not a supernode: the node between them is not essential, and the branch current is written directly. With the source's $-$ terminal on the side of node $p$, the current from $p$ to $q$ is $(v_p + v_s - v_q)/R$.
![Schematic: node p at v_p, then a source v_s with − toward p and + toward R, then R, then node q at v_q; the current i through R points from p to q](el-dc-analysis--branch.svg)
^not-supernode

## The mesh-current method

> [!def] Mesh currents
> In a planar drawing, a **mesh current** circulates around one mesh, clockwise by convention. A branch's current is the sum of the mesh currents through it, each counted $+$ when it runs along the branch's arrow: a branch on the outer boundary (an **outer branch**) carries one mesh current, an inner branch the difference of two.
^mesh-current-def

> [!thm] Lemma 6 (Euler's formula)
> A connected planar drawing with $n$ nodes and $b$ branches divides the plane into $f$ regions, the outer one included, with $n - b + f = 2$. So it has $b - n + 1$ meshes.
^euler

> [!proof]- Proof (d 2.5)
> 1. One node alone: $1 - 0 + 1 = 2$.
> 2. Build the drawing from one node by adding branches one at a time, each touching what is already drawn.
> 3. A branch to a new node adds one node and one branch and no region: $n - b + f$ is unchanged.
> 4. A branch between two drawn nodes splits one region into two: one branch and one region more, unchanged.
> 5. The meshes are the $f - 1$ bounded regions, and $f - 1 = b - n + 1$.
^p-euler

> [!thm] Theorem 7 (mesh-current method)
> In a connected planar circuit with $n$ nodes and $b$ branches, take the $b - n + 1$ mesh currents as the unknowns. Then KCL holds automatically, every set of branch currents satisfying KCL comes from exactly one set of mesh currents, and the mesh KVL equations are independent and imply KVL around every loop. When every branch voltage is a function of branch currents (resistors, voltage sources, current-controlled voltage sources), these are $b - n + 1$ equations in the $b - n + 1$ unknowns carrying all of Kirchhoff's laws.
^mesh-method

> [!proof]- Proof (d 3.5)
> 1. KCL: a mesh current passing through a node enters it on one branch and leaves it on the next.
> 2. Only one set: if mesh currents give zero in every branch, a mesh with an outer branch is zero, since that branch carries it alone; a mesh sharing a branch with a zero mesh is then zero too, and so on to every mesh.
> 3. Every set: the KCL solutions form a space of dimension $b - (n - 1)$ (Theorem 3 and [rank-nullity](la-core.md#^rank-nullity)), and by step 2 the mesh currents fill a subspace of dimension $b - n + 1$ (Lemma 6): all of it.
> 4. Independence: a branch's voltage appears in the equations of the meshes on its two sides with opposite signs, or in one if the branch is outer. So if a combination with coefficients $y_m$ vanishes, $y_p = y_q$ across every inner branch and $y_p = 0$ beside an outer one; spreading as in step 2, every $y$ is $0$.
> 5. KVL around any loop, clockwise, is the sum of the KVL equations of the meshes inside it: a branch inside the loop borders two of those meshes, which run through it in opposite directions, so it cancels, and each branch of the loop is run once, clockwise.
> 6. The element laws write the $b - n + 1$ KVL equations in the mesh currents.
^p-mesh-method

> [!thm] Theorem 8 (supermesh)
> Let a current source, independent or dependent, lie in a branch shared by meshes $p$ and $q$, fixing $i_p - i_q = i_s$ (the sign from its arrow), and call its voltage $v_I$. KVL around the boundary of the two meshes together (the **supermesh**), which avoids the source's branch, together with the constraint, replaces KVL around $p$ and around $q$, and $v_I$ follows from KVL around $p$ alone. A current source in an outer branch fixes that mesh's current (a dependent one, in terms of its controlling variable), and that mesh's KVL equation only gives the source's voltage $v_I$. Either way, if another dependent source is controlled by $v_I$, the equation that gives $v_I$ stays, as the substitution that writes $v_I$ in the mesh currents.
> ![Schematic: three windows; v_1 on the left; R_1, R_2, R_4 along the top; current source i_s shared by windows 1 and 2; R_3 shared by 2 and 3; R_5 on the right; a dashed clockwise loop around windows 1 and 2, passing around i_s](el-dc-analysis--supermesh.svg)
^supermesh

> [!proof]- Proof
> 1. No element law fixes the source's voltage $v_I$: take it as one more unknown, with the constraint as one more equation.
> 2. The two meshes run through the shared branch in opposite directions, so the drop $v_I$ enters their KVL equations with opposite signs and cancels in their sum; the sum is KVL around the union's boundary, every shared branch cancelling.
> 3. As for the supernode, (sum, KVL around $p$) is equivalent to the original pair, and KVL around $p$ only determines $v_I$, or eliminates it if a dependent source depends on it.
> 4. In an outer branch the source's current is one mesh current, which is then known (through its controlling variable, if dependent); that mesh's KVL plays the part of KVL around $p$ in step 3.
^p-supermesh

Write each controlling variable in the unknowns as soon as it is defined. In the node method a resistor current is $(v_p - v_q)/R$, but a current through a voltage source has no such formula and comes from KCL at one of its nodes. In the mesh method a branch current is a mesh current or a difference of two, but a voltage across a current source comes only from [KVL](#^kvl-any-path).
^controlling-variable

## Choosing a method

> [!thm] Proposition 9 (equation counts)
> Count essential nodes $n_e$ and essential branches $b_e$, and suppose no loop is made of voltage sources alone and no closed surface is crossed by current sources alone. The node-voltage method needs $n_e - 1 - s_v$ simultaneous equations, where $s_v$ counts the essential branches that are a voltage source alone; the mesh-current method, in a planar circuit, needs $b_e - n_e + 1 - s_i$, where $s_i$ counts the essential branches containing a current source. Dependent sources count like independent ones.
^choose-method

> [!proof]- Proof
> 1. Elements in series carry one current, so no non-essential node needs an unknown: the node method has $n_e - 1$ unknowns, the mesh method $b - n + 1 = b_e - n_e + 1$ (a non-essential node adds one node and one branch).
> 2. A voltage source alone in an essential branch fixes one node voltage relative to another (Theorem 5): one unknown fewer.
> 3. A current source in an essential branch fixes its current, one mesh current or a difference of two (Theorem 8): one unknown fewer.
> 4. The assumptions keep two sources from fixing one quantity twice (as a loop of voltage sources, or a surface crossed only by current sources, would), so the reductions add.
^p-choose-method

Take the method with fewer equations. On a tie, take the one whose unknowns are what is asked (node voltages for voltages, mesh currents for currents), or the one with fewer substitutions. A question that names the method is answered in it; its supernodes or supermeshes are where it is slow. A circuit that cannot be drawn flat has no meshes, but the node method always applies.
^choose-tiebreak

## Examples

> [!example] A floating controlled source
> Use the node-voltage method to find $v_a$, $v_b$ and $v_c$ and the power the controlled source absorbs. Check the power balance.
> ![Schematic: 5 A up into node a; 6 Ω from a to the rail; 3 Ω from a to b carrying i_x; 12 Ω from b down; controlled source 2 i_x, + at b, from b to c; 4 Ω from c down; 1 A up into c; v_a, v_b, v_c in blue](el-dc-analysis--ex-node.svg)
^ex-node

> [!solution]- Solution
> methods: supernode, dependent-source, power-balance
> 1. Count: nodes $3 - 1 = 2$, the controlled source tying $b$ to $c$; meshes $4 - 2 = 2$. A tie, and the method is named.
> 2. KCL at $a$, currents leaving: $v_a/6 + (v_a - v_b)/3 = 5$, so $3v_a - 2v_b = 30$.
> 3. Supernode around $b$, $c$ and the controlled source: $(v_b - v_a)/3 + v_b/12 + v_c/4 - 1 = 0$.
> 4. Constraint: $v_b - v_c = 2i_x$ with $i_x = (v_a - v_b)/3$, so $v_c = \tfrac53v_b - \tfrac23v_a$.
> 5. Substitute into step 3 and multiply by 12: $10v_b - 6v_a = 12$. With step 2, $3v_b = 36$: $v_b = 12$ V, $v_a = 18$ V, $v_c = 8$ V, $i_x = 2$ A.
> 6. KCL at $c$: 2 A leave through the 4 Ω and 1 A arrives from the current source, so 1 A flows from $b$ to $c$ through the controlled source, into its $+$ terminal: it absorbs $(v_b - v_c)(1) = 4$ W.
> 7. Check: the current sources deliver $5 \cdot 18 + 1 \cdot 8 = 98$ W; the 6, 3, 12 and 4 Ω absorb $54 + 12 + 12 + 16 = 94$ W, and the controlled source 4 W.
> Answer: $v_a = 18$ V, $v_b = 12$ V, $v_c = 8$ V; the controlled source absorbs 4 W.

> [!example] A current source between two meshes
> Use the mesh-current method to find the power delivered by the 1 A source and by the controlled source. Check the power balance.
> ![Schematic: 20 V on the left; 3 Ω, 2 Ω, 6 Ω along the top; 1 A pointing up between windows 1 and 2; 8 Ω carrying i_Δ down between 2 and 3; controlled source 4 i_Δ, + at the bottom, on the right; mesh currents i_1, i_2, i_3](el-dc-analysis--ex-mesh.svg)
^ex-mesh

> [!solution]- Solution
> methods: supermesh, dependent-source, power-balance
> 1. Count: meshes $3 - 1 = 2$, nodes $2$; the method is named.
> 2. The 1 A source points up; mesh 2 runs up through it and mesh 1 down: $i_2 - i_1 = 1$.
> 3. Supermesh, clockwise around meshes 1 and 2 together: $-20 + 3i_1 + 2i_2 + 8(i_2 - i_3) = 0$.
> 4. Mesh 3, where going down through the controlled source runs from $-$ to $+$, a rise: $8(i_3 - i_2) + 6i_3 - 4i_\Delta = 0$. With $i_\Delta = i_2 - i_3$: $i_3 = \tfrac23 i_2$.
> 5. Substitute $i_2 = i_1 + 1$ and $i_3 = \tfrac23(i_1 + 1)$ into step 3, times 3: $23i_1 = 46$. So $i_1 = 2$ A, $i_2 = 3$ A, $i_3 = 2$ A, $i_\Delta = 1$ A.
> 6. KVL up the 20 V source and across the 3 Ω: the current source has $20 - 3i_1 = 14$ V across it, $+$ on top, and pushes 1 A out there: it delivers 14 W.
> 7. The controlled source holds $4i_\Delta = 4$ V, $+$ at the bottom, and $i_3 = 2$ A leaves through its $+$ terminal: it delivers 8 W.
> 8. Check: with the 20 V source's $20 \cdot 2 = 40$ W, 62 W are delivered; the resistors absorb $12 + 18 + 8 + 24 = 62$ W.
> ![Bar chart of absorbed power: 20 V source −40 W, 1 A source −14 W, controlled source −8 W; 3, 2, 8 and 6 Ω: 12, 18, 8 and 24 W; the bars sum to zero](el-dc-analysis--ex-mesh-power.svg)
> Answer: the 1 A source delivers 14 W at 14 V; the controlled source delivers 8 W.

## Problems

> [!problem] Two current sources and a 12 V source (d 2.5)
> Find $v_a$ and $v_b$ and the power of each source, and say which sources deliver power.
> ![Schematic: 2 A up into node a; 20 Ω from a down; 4 Ω from a to b carrying i_x; controlled current source 3 i_x up into b; 1 Ω from b to the + of a 12 V source; v_a, v_b in blue](el-dc-analysis--p-two-node.svg)
^inv-el-dc-two-node-cccs

> [!solution]- Solution
> methods: method-choice, supermesh, power-balance
> 1. Count: nodes 2; meshes $3 - 2 = 1$. Clockwise mesh currents $i_1, i_2, i_3$ from the left.
> 2. The 2 A source is on the outside of mesh 1: $i_1 = 2$ A. The controlled source points up, mesh 3 running up through it and mesh 2 down: $i_3 - i_2 = 3i_x = 3i_2$.
> 3. Supermesh around meshes 2 and 3, with $i_3 = 4i_2$: $20(i_2 - 2) + 4i_2 + i_3 + 12 = 0$, so $28i_2 = 28$: $i_x = i_2 = 1$ A, $i_3 = 4$ A.
> 4. $v_a = 20(i_1 - i_2) = 20$ V and $v_b = 12 + 1 \cdot i_3 = 16$ V.
> 5. The 2 A source delivers $2 \cdot 20 = 40$ W; the controlled source pushes 3 A into $b$ at 16 V, 48 W; the 12 V source takes 4 A into its $+$ terminal and absorbs 48 W (a battery in its place would be charging).
> 6. Check: 88 W delivered; $20 + 4 + 16 + 48 = 88$ W absorbed.
> Answer: $v_a = 20$ V, $v_b = 16$ V; the 2 A source delivers 40 W, the controlled source 48 W; the 12 V source absorbs 48 W.

> [!problem] Three sources, one voltage-controlled (d 3)
> Use the node-voltage method to find $v_x$ and the power each source delivers.
> ![Schematic: 10 V and 2 Ω feed node b, marked v_b; 6 Ω from b down with v_x across it in blue, + on top; controlled source 3 v_x, + at c, from b to c; node c marked v_c; 12 Ω from c down; 4 Ω from c to a 1 A source pushing up](el-dc-analysis--p-floating-vcvs.svg)
^inv-el-dc-floating-vcvs

> [!solution]- Solution
> methods: supernode, dependent-source, power-balance
> 1. The controlled source joins the two essential nodes: $v_c = v_b + 3v_x = 4v_b$, since $v_x = v_b$. One unknown.
> 2. Supernode around $b$, $c$ and the controlled source: $(v_b - 10)/2 + v_b/6 + v_c/12 - 1 = 0$. The 4 Ω does not appear: its branch carries the source's 1 A whatever its value.
> 3. With $v_c = 4v_b$, times 6: $6v_b - 30 = 6$, so $v_x = 6$ V and $v_c = 24$ V.
> 4. 2 A arrive through the 2 Ω and 1 A leaves down the 6 Ω, so 1 A goes from $b$ to $c$ through the controlled source, out at its $+$: it delivers $18 \cdot 1 = 18$ W.
> 5. The current source's top is at $24 + 4 \cdot 1 = 28$ V: it delivers 28 W, of which the 4 Ω takes 4 W. The 10 V source delivers $10 \cdot 2 = 20$ W.
> 6. Check: 66 W delivered; $8 + 6 + 48 + 4 = 66$ W absorbed.
> Answer: $v_x = 6$ V; the 10 V source delivers 20 W, the controlled source 18 W, the 1 A source 28 W.

> [!problem] A ladder bridged over the top (d 3.5)
> Draw your mesh currents on the figure, then use the mesh-current method to find the voltage across the 2 A source and the power of each source.
> ![Schematic: 20 V on the left; 2 A pointing right from its top to node b; 12 Ω from b down carrying i_Δ; 4 Ω from b to c; controlled source 8 i_Δ, + on top, from c down; 6 Ω over the top from the 20 V source to c](el-dc-analysis--p-top-branch.svg)
^inv-el-dc-bridged-ladder

> [!solution]- Solution
> methods: supermesh, dependent-source, power-balance
> 1. Clockwise: $i_1$ lower left, $i_2$ lower right, $i_3$ top. Mesh 1 runs through the 2 A source along its arrow and mesh 3 against it: $i_1 - i_3 = 2$.
> 2. Supermesh around meshes 1 and 3, through the 20 V, 6 Ω, 4 Ω and 12 Ω: $-20 + 6i_3 + 4(i_3 - i_2) + 12(i_1 - i_2) = 0$.
> 3. Mesh 2, with $i_\Delta = i_1 - i_2$: $12(i_2 - i_1) + 4(i_2 - i_3) + 8(i_1 - i_2) = 0$, so $i_1 + i_3 = 2i_2$.
> 4. With $i_1 = i_3 + 2$, step 3 gives $i_2 = i_3 + 1$, and step 2 becomes $6i_3 + 8 = 20$: $i_3 = 2$ A, $i_2 = 3$ A, $i_1 = 4$ A, $i_\Delta = 1$ A.
> 5. The 2 A source's left end is at 20 V and its right end, the top of the 12 Ω, at $12i_\Delta = 12$ V: 8 V, $+$ at the arrow's tail, where its current enters, so it absorbs 16 W.
> 6. The controlled source holds $8i_\Delta = 8$ V, $+$ on top, where $i_2 = 3$ A enters: it absorbs 24 W. The 20 V source delivers $20i_1 = 80$ W.
> 7. Check: $16 + 24 + 4 + 12 + 24 = 80$ W absorbed (2 A source, controlled source, 4, 12, 6 Ω).
> Answer: 8 V, $+$ at the tail of the arrow; the 20 V source delivers 80 W; the 2 A source absorbs 16 W and the controlled source 24 W.

> [!problem] A 12 V source beside a controlled current source (d 3.5)
> (a) Mark the essential nodes and the meshes on the figure, and count the simultaneous equations each method needs. (b) Find the power delivered by the 12 V source and by the controlled source.
> ![Schematic: 20 V and 2 Ω feed node b; 6 Ω from b down carrying i_x; 12 V source, + at c, from b to c; controlled current source 0.5 i_x up into c; 3 Ω from c, then 5 Ω down; the 12 V and 0.5 i_x labels in blue](el-dc-analysis--p-source-chain.svg)
^inv-el-dc-floating-source-cccs

> [!solution]- Solution
> methods: method-choice, supernode, dependent-source
> 1. Essential nodes: $b$ (top of the 6 Ω), $c$ (top of the controlled source) and the rail; the corners at the 20 V source and the 5 Ω are not essential. Nodes: $2 - 1 = 1$, the 12 V source alone joining $b$ and $c$. Meshes: $3 - 1 = 2$. Use nodes.
> 2. Supernode with $v_c = v_b + 12$ and $i_x = v_b/6$; the 3 Ω and 5 Ω in series carry $v_c/8$: $(v_b - 20)/2 + v_b/6 - 0.5\,v_b/6 + (v_b + 12)/8 = 0$.
> 3. Times 24: $17v_b = 204$, so $v_b = 12$ V, $v_c = 24$ V, $i_x = 2$ A, and the controlled source pushes 1 A into $c$.
> 4. KCL at $c$: 3 A leave through the 3 Ω and 1 A arrives from the controlled source, so 2 A arrive through the 12 V source, out of its $+$ terminal: it delivers $12 \cdot 2 = 24$ W, and the controlled source $24 \cdot 1 = 24$ W.
> 5. Check: with the 20 V source's $20 \cdot 4 = 80$ W, 128 W delivered; $32 + 24 + 27 + 45 = 128$ W absorbed.
> Answer: (a) nodes 1, meshes 2; (b) 24 W each.

> [!problem] A ladder with a resistor in its ground return (d 4)
> (a) Mark the essential nodes and the meshes on the figure, and count the simultaneous equations each method needs. (b) Find the power each current source delivers.
> ![Schematic: 12 V and 1 Ω feed a 10 Ω, with v_y across the 1 Ω, + on the left; 3 Ω along the top to a 2 A source pointing up; 4 Ω to a controlled current source 1.5 v_y pointing down; a 6 Ω in the bottom rail between the 10 Ω and the 2 A source; ground on the left](el-dc-analysis--p-split-ground.svg)
^inv-el-dc-ground-return

> [!solution]- Solution
> methods: method-choice, supermesh, dependent-source
> 1. Essential nodes: the top of the 10 Ω, the top and the bottom of the 2 A source, and the reference: 3 node equations, no voltage source being alone in a branch. Meshes: $3 - 2 = 1$, the controlled source on the outside of the right mesh and the 2 A source shared. Clockwise $i_1, i_2, i_3$ from the left.
> 2. The controlled source points the way mesh 3 runs: $i_3 = 1.5v_y$, and the 1 Ω carries $i_1$ in at its $+$ end, so $v_y = 1 \cdot i_1$ and $i_3 = 1.5i_1$. The 2 A source points up, mesh 3 running up through it and mesh 2 down: $i_2 = i_3 - 2 = 1.5i_1 - 2$.
> 3. Mesh 1: $-12 + 1 \cdot i_1 + 10(i_1 - i_2) = 0$ becomes $8 - 4i_1 = 0$: $i_1 = 2$ A, $i_2 = 1$ A, $i_3 = 3$ A.
> 4. The top of the 2 A source is at $10(i_1 - i_2) - 3i_2 = 7$ V and its bottom at $6i_2 = 6$ V, the 6 Ω carrying $i_2$ to the reference: it delivers $1 \cdot 2 = 2$ W.
> 5. The controlled source's top is at $7 - 4i_3 = -5$ V. It pushes 3 A out at its bottom, 11 V above its top: it delivers 33 W.
> 6. Check: with the 12 V source's 24 W, 59 W delivered; $4 + 10 + 3 + 6 + 36 = 59$ W absorbed.
> Answer: (a) nodes 3, meshes 1; (b) the 2 A source delivers 2 W, the controlled source 33 W.

> [!problem] A source controlled by another source's current (d 4.5)
> Use the node-voltage method to find $v_c$ and the power of each source, and check the balance.
> ![Schematic: 24 V and 3 Ω feed node b, marked v_b; 15 Ω from b down; 5 V source, + at b, from b to c, with i_s flowing into it from b; 2 Ω from c down; controlled current source 1.5 i_s up into c; v_c in blue](el-dc-analysis--p-source-current.svg)
^inv-el-dc-source-current

> [!solution]- Solution
> methods: supernode, dependent-source, power-balance
> 1. The 5 V source joins the essential nodes: $v_b = v_c + 5$. No node-voltage formula gives $i_s$, so keep it as an unknown.
> 2. KCL at $b$ alone: $i_s = (24 - v_b)/3 - v_b/15$. KCL at $c$ alone: $2.5i_s = v_c/2$, so $v_c = 5i_s$. (The two add up to the supernode equation.)
> 3. With $v_b = 5i_s + 5$, the first times 15 gives $15i_s = 90 - 30i_s$: $i_s = 2$ A, $v_c = 10$ V, $v_b = 15$ V.
> 4. The 24 V source drives 3 A through the 3 Ω: 72 W. The 5 V source takes 2 A into its $+$ terminal: it absorbs 10 W. The controlled source pushes 3 A into $c$ at 10 V: 30 W.
> 5. Check: 102 W delivered; $27 + 15 + 50 + 10 = 102$ W absorbed.
> Answer: $v_c = 10$ V; the 24 V source delivers 72 W, the controlled source 30 W; the 5 V source absorbs 10 W.

## Derive

> [!derive] For a planar circuit of positive resistors and independent voltage sources, with clockwise mesh currents $\mathbf i$, prove that the mesh equations are $\mathbf R\mathbf i = \mathbf v_s$, where $R_{kk}$ is the total resistance around mesh $k$, $R_{jk}$ for $j \ne k$ is minus the total resistance of the branches meshes $j$ and $k$ share, and $v_{s,k}$ is the net rise in source voltage going clockwise around mesh $k$. Prove that $\mathbf R$ is symmetric, and invertible when no loop is made of voltage sources alone.
^d-mesh-inspection

> [!solution]- Solution
> methods: mesh-current
> 1. Two clockwise meshes run through a branch they share in opposite directions. So in mesh $k$'s KVL, drops counted clockwise, a resistor $R$ shared with mesh $j$ drops $R(i_k - i_j)$, and one in an outer branch drops $Ri_k$.
> 2. Collect: $i_k$ has coefficient the total resistance around mesh $k$, and $i_j$ minus the resistance shared with mesh $j$. The source voltages are known; moved to the right, they give the net clockwise rise $v_{s,k}$. That is row $k$.
> 3. A resistor shared by meshes $j$ and $k$ enters $R_{jk}$ and $R_{kj}$ alike, so $\mathbf R$ is symmetric.
> 4. Adding $i_k$ times row $k$ over all $k$ gives $\mathbf i^\top\mathbf R\mathbf i = \sum R\,(\text{its current})^2$ over the resistors, so $\mathbf R\mathbf i = 0$ makes every resistor's current $0$.
> 5. The branches still carrying current are voltage sources and contain no loop, so if there were any, some node would meet exactly one of them, and KCL there would make its current $0$. So every branch current is $0$, hence every mesh current (Theorem 7, step 2), and $\mathbf R$ is invertible.

> [!derive] In the bridge of the figure, with $v_s \ne 0$, prove that the current in $R_d$ is zero, whatever $R_d$ is, exactly when $R_1/R_2 = R_3/R_4$.
> ![Schematic: a source v_s across two strings in parallel, R_1 over R_2 and R_3 over R_4; R_d, in blue, joins the two midpoints](el-dc-analysis--bridge.svg)
^d-bridge-balance

> [!solution]- Solution
> methods: series-parallel, node-voltage
> 1. With $R_d$ removed, the midpoints sit at $v_sR_2/(R_1 + R_2)$ and $v_sR_4/(R_3 + R_4)$, equal exactly when $R_2R_3 = R_1R_4$ (dividing by $v_s \ne 0$), that is $R_1/R_2 = R_3/R_4$.
> 2. If equal, these voltages with no current in $R_d$ satisfy every law with $R_d$ in place, and the solution is unique: with the top node at $v_s$, the two midpoint voltages solve a 2-by-2 system of Theorem 4's form, each midpoint having a resistor to the reference.
> 3. If not, no current in $R_d$ would leave a voltage across it with no current, which $v = R_di$ forbids.

> [!derive] In a connected circuit of positive resistors and one independent voltage source $V > 0$ with its $-$ terminal on the reference, prove that every node voltage lies between $0$ and $V$.
^d-no-gain

> [!solution]- Solution
> methods: node-voltage
> 1. At a node that is not a source terminal, KCL gives $v = \sum_j (v_j/R_j)\big/\sum_j (1/R_j)$ over its neighbours: a weighted average of their voltages.
> 2. Let $M$ be the largest node voltage and suppose $M > V$. A node at $M$ is not a source terminal, and an average equals its largest term only if all terms do, so its neighbours are at $M$ too.
> 3. Along a path from that node to the source, step 2 repeats up to the first source terminal, which is then at $M$; but the terminals are at $0$ and $V$, both below $M$: a contradiction. The smallest voltage is handled the same way.
