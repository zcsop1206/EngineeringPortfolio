---
study: basic
id: dd-asic-flow
title: "From RTL to GDS: synthesis, timing and an open tapeout"
area: dd
needs: [dd-sequential, dd-verilog]
build: 1
tracks: [asic, interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [setup and hold](dd-sequential.md#^setup-hold), [the maximum clock frequency](dd-sequential.md#^max-freq), [hold checks](dd-sequential.md#^hold-check), [clock skew](dd-sequential.md#^clock-skew), and [what synthesises](dd-verilog.md#^sim-synth).
^needs

A chip is made from mask layouts, one per layer, in a file format called GDSII (GDS for short). The flow turns register-transfer-level Verilog (RTL) into those layouts in steps, each with an input, an output and a check that the output still means the input:
^intro

1. **Simulate** the RTL against a reference model ([testbenches](dd-verification.md#^tb-structure)).
2. **Synthesise**: RTL to a netlist of standard cells.
3. **Floorplan**: die and core size, pin positions, power grid.
4. **Place** the cells in rows.
5. **Build the clock tree.**
6. **Route** the wires.
7. **Sign off**: static timing with the extracted wire parasitics, design-rule check, layout-versus-schematic check, then write GDS.

In open flows, synthesis is done by Yosys and steps 3 to 7 by OpenROAD with OpenSTA for timing and Magic, KLayout and Netgen for the physical checks, driven by a flow script (OpenLane and its successors; check the current name and version before you install one).
^flow-overview

## Synthesis

> [!def] Synthesis
> **Synthesis** turns RTL into a gate-level netlist in four passes. **Elaboration** parses the design, fixes parameters, and infers a flip-flop for each register assigned in `always @(posedge clk)` and a latch for each signal a combinational block leaves unassigned on some path ([inferred latches](dd-verilog.md#^inferred-latch)). **Generic optimisation** propagates constants, removes logic nobody reads, shares common terms and minimises the Boolean functions. **Technology mapping** covers the logic with cells from the target library. **Sizing and buffering** pick drive strengths and insert buffers until timing is met. What has no hardware meaning is dropped: `initial` blocks, `#` delays, and `x` assignments, which become free don't-cares (the source of [simulation and synthesis disagreeing](dd-verilog.md#^sim-synth)).
^synthesis

Technology mapping is cleanest to state on a tree. Write the logic as a tree of base gates (two-input NANDs and inverters). Each library cell is a small **pattern** tree of base gates with an area. A **cover** chooses pattern matches so that every gate of the tree is inside exactly one match, and each match's inputs are tree inputs or roots of other matches.
^mapping-setup

> [!thm] Theorem 1 (mapping a tree)
> For a node $v$ let $\operatorname{cost}(v)$ be the least, over the patterns that match with their root at $v$, of the pattern's area plus $\operatorname{cost}(u)$ summed over the match's inputs $u$ that are gates (tree inputs cost 0). Then $\operatorname{cost}(v)$ is the least area of any cover of the subtree under $v$, and computing it from the leaves up finds the cover.
^tree-cover

> [!proof]- Proof (d 3)
> 1. Induct on the height of $v$. Every cover of the subtree under $v$ contains exactly one match rooted at $v$, since $v$ must be covered and no match rooted elsewhere in the subtree contains $v$.
> 2. Removing that match leaves, for each of its inputs $u$ that is a gate, a cover of the subtree under $u$; these subtrees are disjoint.
> 3. So any cover costs the match's area plus the costs of those sub-covers, which is at least the match's area plus $\sum \operatorname{cost}(u)$ by induction, which is at least $\operatorname{cost}(v)$.
> 4. Conversely, the best match at $v$ together with the best covers under its gate inputs is a cover of exactly that cost.
^p-tree-cover

Real netlists are not trees: a gate with two readers is shared. Mappers cut the network into trees at shared gates, or enumerate small cuts of the network directly; the dynamic program is then a good heuristic rather than an optimum.
^mapping-dag

## Standard cells

> [!def] Standard cells and their library
> A **standard cell** is a fixed-height layout of one logic function (inverter, NAND2, flip-flop, ...) whose power rails run along its top and bottom edges, so cells placed side by side in a **row** share rails by touching. Each function comes in several **drive strengths** (suffixes `_1`, `_2`, `_4`): larger transistors, more input capacitance, less delay into a heavy load ([RC delay](dd-boolean-cmos.md#^rc-delay), [fanout](dd-boolean-cmos.md#^fanout)). A **library** ships in several views: **Liberty** (`.lib`) tables give each timing arc's delay and output slew as functions of input slew and output load, plus power, at one process, voltage and temperature **corner** each; **LEF** gives the abstract (outline, pins, blocked areas) that placement and routing see; **GDS** gives the full layout. In the high-density library of the sky130 open PDK a row is 2.72 µm tall and a placement site 0.46 µm wide; a NAND2 of the smallest drive is about 3.8 µm² and a D flip-flop about 20 µm² (check these against the library's own LEF and Liberty files).
^std-cells

## Static timing analysis

> [!def] Static timing analysis
> **Static timing analysis** (STA) checks every path without simulating. The design becomes a **timing graph**: a node per pin, an edge per cell arc and per net, each with a delay. Paths begin at **start points** (input ports, and flip-flop clock pins through to Q) and end at **end points** (flip-flop D pins, output ports). The **arrival time** at a node is the latest time a transition can reach it; the **required time** is the latest it may arrive, set at each end point by the clock period minus setup time and skew ([setup](dd-sequential.md#^setup-hold), [skew](dd-sequential.md#^clock-skew)) and carried backwards; **slack** is required minus arrival, and a negative slack is a violation. Reports give the worst negative slack (WNS) and the total negative slack (TNS). Hold is checked the same way with earliest arrivals ([hold](dd-sequential.md#^hold-check)). Constraints come in SDC: `create_clock` sets the period, `set_input_delay` and `set_output_delay` model the world outside, and `set_false_path` and `set_multicycle_path` mark paths that need not, or need not every cycle, meet one period. Setup is checked at the slow corner and hold at the fast one.
^sta

> [!thm] Theorem 2 (one pass finds the worst path)
> In a timing graph without cycles, set the arrival time of each start point to its launch time and of every other node $v$ to $\max_{u \to v}(\operatorname{arr}(u) + d(u, v))$, in topological order. Then $\operatorname{arr}(v)$ is the largest delay of any path from a start point to $v$, the whole computation takes time proportional to the number of nodes plus edges, and, with required times carried backwards the same way, $\operatorname{req}(v) - \operatorname{arr}(v)$ is the least slack of any path through $v$.
^sta-dp

> [!proof]- Proof (d 2.5)
> 1. A synchronous design's timing graph has no cycles: every loop in the logic passes through a flip-flop, which ends one path and starts another.
> 2. Claim: $\operatorname{arr}(v)$ equals the longest path delay to $v$. It holds at start points; process nodes in topological order.
> 3. Any path to $v$ ends with an edge $u \to v$; its delay is at most $\operatorname{arr}(u) + d(u, v) \le \operatorname{arr}(v)$.
> 4. The $u$ that attains the maximum, followed by a longest path to $u$ extended by that edge, has delay exactly $\operatorname{arr}(v)$.
> 5. Each edge is read once going forward, so the work is linear in nodes plus edges, though the number of paths can grow exponentially.
> 6. Backwards, $\operatorname{req}(v)$ is likewise the least, over paths from $v$ to an end point, of that end point's required time minus the path's delay.
> 7. A path through $v$ has slack (its end point's required time minus the suffix delay) minus the prefix delay; minimising splits into the least first part, $\operatorname{req}(v)$, minus the largest second, $\operatorname{arr}(v)$.
^p-sta-dp

> [!example] Five gates between flops
> Flops A, B and C launch at 0.30 ns. G1 = f(A, B) takes 0.25 ns, G2 = f(B, C) 0.40 ns, G3 = f(G1, G2) 0.35 ns, G4 = f(G1) 0.10 ns and G5 = f(G3, G4, C) 0.45 ns. G5 and G2 each feed a flop D pin with setup 0.10 ns; the clock period is 2.0 ns and skew is zero. Find every arrival time, the worst slack and the critical path.
^ex-sta-five-gates

> [!solution]- Solution
> methods: dd-asic-flow/sta-dp
> 1. Arrivals: G1 0.55, G2 0.70, G3 $\max(0.55, 0.70) + 0.35 = 1.05$, G4 0.65, G5 $\max(1.05, 0.65, 0.30) + 0.45 = 1.50$.
> 2. Required at both end points: $2.0 - 0.1 = 1.9$. Slack at G5's end point $0.40$; at G2's, $1.20$.
> 3. Backwards: G3 must arrive by $1.9 - 0.45 = 1.45$ (slack 0.40), G2 by $\min(1.45 - 0.35, 1.9) = 1.10$ (slack 0.40), G1 by $\min(1.10, 1.45 - 0.10) = 1.10$ (slack 0.55), G4 slack 0.80.
> Answer: worst slack 0.40 ns, on B or C (tied) to G2, G3, G5 to the flop; computed by a script over the graph.

## Place and route

> [!def] Place and route
> The **floorplan** fixes the core area (from the total cell area and a target **utilization**, the fraction of the core the cells fill), places the input and output pins and any large blocks, and lays a **power grid** of rings and straps on the upper metals. **Placement** spreads the cells to minimise estimated wire length without overfilling any region (global placement), snaps them onto rows and sites without overlap (legalisation), then improves locally (detailed placement). Filler, tap and decoupling cells fill the gaps. **Clock tree synthesis** (CTS) builds a tree of buffers from the clock pin to every flip-flop, aiming for small skew and small insertion delay. **Routing** assigns each net to coarse tiles and layers (global routing), then draws the exact tracks and vias (detailed routing); each metal layer has a preferred direction, alternating horizontal and vertical. After routing, the wires' resistance and capacitance are **extracted** and STA is run again on them (signoff timing).
^pnr

Placement needs a wire length estimate it can compute millions of times. The standard one is the **half-perimeter wire length** (HPWL) of a net: the width plus the height of the smallest axis-aligned box holding its pins. A routed net is a tree of horizontal and vertical segments; the shortest such tree is the rectilinear Steiner minimal tree (RSMT).
^hpwl-def

> [!thm] Theorem 3 (half-perimeter is a lower bound)
> Every connected set of horizontal and vertical segments that touches all pins of a net has total length at least the net's HPWL.
^hpwl

> [!proof]- Proof (d 2.5)
> 1. Project the set onto the $x$ axis. The projection of a connected set is connected, so it is an interval, and it contains every pin's $x$; so it contains $[x_{\min}, x_{\max}]$.
> 2. A horizontal segment projects to an interval of its own length; a vertical one projects to a point.
> 3. The projection is the union of the segments' projections, so the horizontal lengths add up to at least the projection's length, $x_{\max} - x_{\min}$.
> 4. The same argument on the $y$ axis bounds the vertical lengths by $y_{\max} - y_{\min}$; add the two.
^p-hpwl

> [!example] Four corners of a square
> A net has pins at the four corners of a square of side $a$. Compare its HPWL with its RSMT.
^ex-hpwl-square

> [!solution]- Solution
> methods: dd-asic-flow/hpwl
> 1. HPWL: $a + a = 2a$.
> 2. A tree of length $3a$: a horizontal segment across the middle and the two vertical sides.
> 3. No tree is shorter. Hanan's theorem (classical, not proved here) says some shortest tree uses only the horizontal and vertical lines through the pins; inside the bounding box those lines are the square's four sides, and a tree on the four sides must leave one out.
> Answer: HPWL $2a$, RSMT $3a$: HPWL underestimates nets of four or more pins, which placers correct with net-size factors.

## Physical verification

> [!def] DRC and LVS
> **Design-rule checking** (DRC) compares the layout's geometry with the foundry's rules: minimum width and spacing per layer, how far one layer must enclose another, minimum area, density windows, and **antenna** ratios (during plasma etch a long wire attached only to a transistor gate collects charge that can damage the gate oxide; the rule caps wire area per gate area, and the fix is a diode or a hop to a higher layer). **Layout versus schematic** (LVS) extracts a netlist from the layout (transistors from overlapping layers, connections from touching shapes) and compares it with the intended netlist as graphs: the same devices, connected the same way, with the same pins. An LVS error is a short, an open, or a device missing or extra. A layout ships only when DRC and LVS are both clean.
^drc-lvs

## Area budget

> [!def] Area budget
> Before synthesis, area is estimated from counts: core area $\approx \sum(\text{cell areas}) / u$, with $u$ the target utilization, and the cell area $\approx n_{\text{ff}} A_{\text{ff}} + n_{\text{comb}} \bar A_{\text{comb}}$ from the number of flip-flops and other cells and their typical areas. Open flows commonly run at 40% to 60% utilization (check your flow's default), leaving room for buffers, the clock tree, filler and routing. A design dominated by wires (wide buses, many crossings) needs lower utilization than one dominated by logic. A register file built from flip-flops is the usual surprise: 32 words of 32 bits is 1024 flops before any logic.
^area-budget

## Open PDKs and shuttles

> [!def] Open PDKs and shuttles
> A **process design kit** (PDK) is what a foundry gives designers for one process: the design rules, transistor models for circuit simulation, standard-cell and IO libraries, and the rule decks for DRC, LVS and extraction. An **open PDK** publishes all of it. The open ones in use with the open flows are named sky130 (130 nm), gf180mcu (180 nm) and sg13g2 (130 nm, with SiGe bipolar devices); check the current versions and which one a given run uses. A **shuttle** (multi-project wafer) shares one mask set among many designs so each pays a fraction. Some programmes go further and share one die: each project gets a small fixed **tile** behind a shared multiplexer for pins and clock, with the tile area, pin count and clock rate set by the programme. These specifics change from run to run, as do the programmes themselves; check the programme's current documents for tile size, pins, PDK and dates before budgeting area or a schedule.
^open-pdk

## Derive

> [!derive] Prove that for a net of three pins the RSMT length equals the HPWL.
^d-three-pins

> [!derive] An H-tree drives $4^k$ sinks at the centres of a uniform $2^k$ by $2^k$ grid of squares of side $s$ from the centre of the grid. Prove that every sink is the same wire length from the source, and find that length and the total wire length.
^d-htree

> [!derive] Give a network of base gates with one gate read twice, and a library, for which cutting the network into trees at that gate and applying Theorem 1 to each tree gives more area than the best cover of the whole network (which may copy the shared gate into two matches). Prove both areas.
^d-cover-dag

> [!derive] Prove that a timing graph with $n$ nodes can have a number of start-to-end paths exponential in $n$, while Theorem 2's pass stays linear.
^d-paths-count

## Problems

> [!problem] Eight gates, four flops (d 3)
> Flops R1 to R4 launch at 0.12 ns. Gates, with inputs and delays: U1 (R1, R2) 0.18; U2 (R2, R3) 0.22; U3 (R3, R4) 0.30; U4 (U1, U2) 0.27; U5 (U2, U3) 0.15; U6 (U4, U5) 0.33; U7 (U5, R4) 0.21; U8 (U6, U7) 0.19, all in ns. U7 and U8 each feed a flop with setup 0.08 ns; the period is 1.25 ns and skew is zero. Find the worst slack, the critical path, the shortest period that works, and how many start-to-end paths end at U8.
^inv-dd-sta-eight-gates

> [!solution]- Solution
> methods: dd-asic-flow/sta-dp
> 1. Arrivals: U1 0.30, U2 0.34, U3 0.42, U4 $\max(0.30, 0.34) + 0.27 = 0.61$, U5 $\max(0.34, 0.42) + 0.15 = 0.57$, U6 $0.61 + 0.33 = 0.94$, U7 $\max(0.57, 0.12) + 0.21 = 0.78$, U8 $\max(0.94, 0.78) + 0.19 = 1.13$.
> 2. Required at the end points: $1.25 - 0.08 = 1.17$. Slack at U8's flop $0.04$, at U7's $0.39$.
> 3. Walking back along the maximum: U8 from U6, U6 from U4, U4 from U2, U2 from R2 or R3 (tied).
> 4. The shortest period is $1.13 + 0.08 = 1.21$ ns, about 826 MHz.
> 5. Paths into U8: count paths per node in topological order (1 per flop, each gate the sum over its inputs): U1 2, U2 2, U3 2, U4 4, U5 4, U6 8, U7 5, U8 13.
> Answer: slack 0.04 ns on R2 (or R3), U2, U4, U6, U8; period 1.21 ns; 13 paths (all checked by a script).

> [!problem] An AND of four, mapped (d 3)
> The function $a \wedge b \wedge c \wedge d$ is given as the base-gate tree INV(NAND(INV(NAND($a$, $b$)), INV(NAND($c$, $d$)))). The library has INV (area 2), NAND2 (3), NOR2 (3), AND2 (5) and OR2 (5). Find the least-area cover.
^inv-dd-and4-mapping

> [!solution]- Solution
> methods: dd-asic-flow/tree-cover, dd-boolean-cmos/de-morgan
> 1. As base gates: NOR2($x$, $y$) is INV(NAND(INV $x$, INV $y$)), AND2 is INV(NAND), OR2 is NAND(INV, INV).
> 2. The two inner NAND($a$, $b$) and NAND($c$, $d$) cost 3 each as NAND2 cells.
> 3. At the root, NOR2 matches with inputs the two inner NANDs: $3 + 3 + 3 = 9$.
> 4. Alternatives cost more: three AND2 cells cost 15; INV over OR2 over the inner NANDs costs $2 + 5 + 6 = 13$.
> Answer: area 9: NOR2(NAND2($a$, $b$), NAND2($c$, $d$)), confirmed by running the dynamic program.

> [!problem] Fixing a hold violation (d 3.5)
> A path's launch flop has clock-to-Q 0.08 ns at best and 0.12 ns at worst; its logic takes 0.02 ns at best and 0.60 ns at worst. The capture flop has hold 0.05 ns and setup 0.06 ns, and its clock arrives 0.15 ns after the launch flop's. The period is 1.0 ns. A delay buffer adds 0.035 ns at best and 0.05 ns at worst. Is hold met? If not, how many buffers fix it, and is setup still met after the fix?
^inv-dd-hold-buffers

> [!solution]- Solution
> methods: dd-sequential/hold-check, dd-sequential/setup-hold
> 1. Hold needs the earliest data to arrive no sooner than hold plus skew after the edge: $0.08 + 0.02 = 0.10 \ge 0.05 + 0.15 = 0.20$ fails by $0.10$ ns.
> 2. Each buffer adds at least 0.035 ns, so $\lceil 0.10/0.035 \rceil = 3$ buffers (0.105 ns).
> 3. Setup with the worst delays and three buffers: $0.12 + 0.60 + 3(0.05) + 0.06 = 0.93 \le 1.0 + 0.15 = 1.15$: met with 0.22 ns slack.
> Answer: hold fails by 0.10 ns; three buffers fix it and setup keeps 0.22 ns of slack. Positive skew helps setup and hurts hold.

> [!problem] Will it fit in one tile (d 2.5)
> A design synthesises to 220 flip-flops of 20 µm² and 1400 other cells averaging 6 µm². The flow targets 55% utilization. A programme offers tiles of 160 µm by 100 µm (an assumed size for this problem). How many tiles does it need, and at what utilization does it then run?
^inv-dd-tile-budget

> [!solution]- Solution
> methods: dd-asic-flow/area-budget, estimation
> 1. Cell area: $220 \cdot 20 + 1400 \cdot 6 = 4400 + 8400 = 12800$ µm².
> 2. Core area at 55%: $12800 / 0.55 \approx 23300$ µm², against $16000$ µm² for one tile.
> 3. Two tiles give $32000$ µm², so utilization $12800/32000 = 40\%$.
> Answer: two tiles, at 40% utilization. One tile would need the cell area cut to $0.55 \cdot 16000 = 8800$ µm², 4000 µm² less.

> [!problem] How deep to pipeline (d 3)
> A block of combinational logic takes 12 ns and can be cut into any number $k$ of equal stages. Each stage adds 0.5 ns of flip-flop overhead (clock-to-Q plus setup). What is the least $k$ that runs at 300 MHz, and what are the clock and the latency through the block then?
^inv-dd-pipeline-depth

> [!solution]- Solution
> methods: dd-sequential/max-freq
> 1. The period with $k$ stages is $12/k + 0.5$ ns ([maximum frequency](dd-sequential.md#^max-freq)).
> 2. 300 MHz needs a period of at most $3.33$ ns: $12/k \le 2.83$, so $k \ge 4.24$, and $k = 5$.
> 3. With $k = 5$: period $2.9$ ns (345 MHz), latency $5 \times 2.9 = 14.5$ ns, against $12.5$ ns unpipelined.
> Answer: five stages, 345 MHz, 14.5 ns latency. The overhead is paid once per stage, so latency grows while throughput rises; equal stages are the assumption that real logic rarely grants.
