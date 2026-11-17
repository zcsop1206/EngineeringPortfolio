---
study: card
id: card-asic-puzzle
title: "ASIC puzzle chip: numbers card"
area: [dd, gen]
needs: [dd-asic-flow, dd-boolean-cmos, dd-sequential, dd-verification, dd-fsm, dd-verilog]
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [dd-asic-flow](../basics/dd-asic-flow.md), [dd-boolean-cmos](../basics/dd-boolean-cmos.md), [dd-sequential](../basics/dd-sequential.md), [dd-verification](../basics/dd-verification.md), [dd-fsm](../basics/dd-fsm.md), [dd-verilog](../basics/dd-verilog.md). ^needs

Source: the two public pages /projects/asicpuzzle2026/ (part 1, the solve) and /projects/asicpuzzle2026-starbattle/ (part 2, what the chip computes). Every answer below quotes them and names the part and section. ^source

## Numbers

> [!recall] ASIC puzzle: the key: its length, how it was shown to be unique, and what the chip prints for it.
^n1

> [!solution]- Answer
> Part 1, TL;DR and Letting Z3 find the key: 121 bits. With the key excluded, Z3 solving again for `success = 1` returns unsat, so no other 121-bit input works under this protocol. Fed through the simulator, `success` goes high on the edge after the 121st enable cycle and the chip prints `(* TWO STARS *)`. All zeros prints `EMPTY SKY`, all ones `BIG BANG`, everything else tried `TRY AGAIN`.

> [!recall] ASIC puzzle: the extracted netlist: the warmup check, and the size of the puzzle chip.
^n2

> [!solution]- Answer
> Part 1, Polygons back into wires: the warmup extracted from its GDS matches the given netlist as graphs, 79 logic cells (16 flip-flops, 16 muxes, 44 gates, 3 clock buffers), 163 nodes and 285 edges, isomorphic. The puzzle GDS: 728 logic cells across 69 types, 92 flip-flops and 636 gates, one clock tree, no combinational loops.

> [!recall] ASIC puzzle: how the simulator was validated, and the mismatch counts on each run until it passed.
^n3

> [!solution]- Answer
> Part 1, A software twin of the chip: replay the waveform file's inputs and compare `O` and `success` at all 312 rising edges. First run 20 mismatches: the right text one edge late, because the waveform records each value after the flip-flops update and the compare used the value from before. Second run 26: moving the update left the old call in place, so two cycles per edge. Third run: 312 edges, 0 mismatches.

> [!recall] ASIC puzzle: the size of the formula Z3 solved, how long it took to build and to solve, and the cycle count it covers.
^n4

> [!solution]- Answer
> Part 1, Letting Z3 find the key (figure): the simulator run with the 121 input bits as symbols through reset, 121 enable cycles and 8 idle cycles, 129 cycles; 92 × 129 = 11,868 flip-flop symbols; built in 11 s, solved in 0.4 s.

> [!recall] ASIC puzzle: how the chip checks the no-touching rule with little memory: the window length, the offsets, and the check against the plain rule.
^n5

> [!solution]- Answer
> Part 2, The touch check in 12 bits: a 12-flip-flop chain of the last twelve input bits plus one flag. When a star arrives, the flag sets if there is a star 1, 10, 11 or 12 cells back (left, up-right, up, up-left on an 11-wide grid); a touching pair is always seen from whichever star comes second, so four directions cover all eight, and the column counter excludes the row wrap. Two stars at every offset up to 13 against the plain rule: 1542 inputs, no disagreements.

## Decisions

> [!recall] ASIC puzzle: how the extracted netlist was compared with the given one, over the obvious alternative, and why.
^d1

> [!solution]- Answer
> Part 1, Polygons back into wires: as graphs, by isomorphism, over comparing text, because instance names do not survive into a GDS. A node per cell labelled by type, a node per net, an edge per pin labelled by pin name, power nets dropped; then ask whether a relabelling makes the two identical.

> [!recall] ASIC puzzle: how the key was found, over brute force, and how the chip was given to the solver.
^d2

> [!solution]- Answer
> Part 1, Picking an approach and Letting Z3 find the key: a constraint solver over brute force, because even the first sizing (about 780 unknown bits, six times too high) put brute force out, and the true key space is $2^{121}$. The chip was not described to Z3 separately: the validated simulator was run with the input bits as symbols, so every gate output becomes an expression and `success` becomes one formula over the 121 bits.

> [!recall] ASIC puzzle: how the region map was recovered, over reading the layout, and why that works.
^d3

> [!solution]- Answer
> Part 2, Recovering the regions: 121 simulator runs, one star each, over reading the 150-gate lookup in front of each region tally, because a single star moves exactly one region tally, which names that cell's region. Eleven regions, all edge-contiguous. Then, with no chip at all, Z3 over the rules and this map finds one solution, the key.

## Failure

> [!recall] ASIC puzzle: where the original plan stalled, the best score, and why even that score could not be trusted.
^f1

> [!solution]- Answer
> Part 1, Where I got stuck: step 2 was clustering the netlist back into modules, scored against the warmup's instance names. Five methods; the best, spectral clustering with k = 6, misassigned 16 of 79. Every parameter had been tuned against the warmup answer and the puzzle has none to tune against, so on the real chip it would give a confident, wrong clustering with no way to tell. Part 2: the guessed design, a stored answer compared against the input, was also wrong; 92 flip-flops cannot hold a 121-bit key.

## Story

> [!recall] ASIC puzzle: the two-minute story, in five lines.
^s1

> [!solution]- Answer
> 1. Object: a puzzle that gives only a chip's GDS layout (sky130 cells), a warmup adder at every stage, and one sample waveform; find the string the chip prints for the right input. A first ASIC, from a mechanical engineering student.
> 2. Hard part: a GDS has no names. Polygons go back to a netlist with KLayout, checked isomorphic against the warmup; clustering the netlist into modules failed, so the plan turned to the waveform.
> 3. Measured: the waveform holds two attempts printing `TRY AGAIN` and fixes the protocol, 121 enable cycles; the Python simulator replays all 312 edges with 0 mismatches.
> 4. Number: the 121-bit key, solved by Z3 in 0.4 s, unique by an unsat check, printing `(* TWO STARS *)`.
> 5. What it changed: part 2 shows the chip is an 11 by 11 two-star Star Battle checker, with 92 flip-flops of counters, tallies and a 12-bit touch window, and a region map recovered by running the netlist, not reading the layout.

## Follow-ups

What a technical follow-up probes, and where it is taught. ^follow-ups

- The stages from RTL to GDS and what each throws away: [synthesis](../basics/dd-asic-flow.md#^synthesis), [standard cells](../basics/dd-asic-flow.md#^std-cells), [place and route](../basics/dd-asic-flow.md#^pnr), [open PDK](../basics/dd-asic-flow.md#^open-pdk). ^fu-flow
- Extracting a netlist from layout and comparing it, which is what a sign-off check does: [DRC and LVS](../basics/dd-asic-flow.md#^drc-lvs). ^fu-lvs
- Reading a cell name as a boolean function: [CMOS gates](../basics/dd-boolean-cmos.md#^cmos-gates), [canonical forms](../basics/dd-boolean-cmos.md#^canonical-forms). ^fu-cells
- Why the compare was one edge late: [flip-flops](../basics/dd-sequential.md#^latch-ff), [reset](../basics/dd-sequential.md#^reset). ^fu-edge
- A simulator checked against a trusted trace: [reference model](../basics/dd-verification.md#^ref-model), [first mismatch](../basics/dd-verification.md#^first-mismatch), [self-checking](../basics/dd-verification.md#^self-checking). ^fu-verify
- Position counters and saturating tallies: [counters](../basics/dd-fsm.md#^counters). ^fu-counters
- Simulation against synthesis semantics: [simulation and synthesis](../basics/dd-verilog.md#^sim-synth). ^fu-sim
