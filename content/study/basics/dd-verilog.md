---
study: basic
id: dd-verilog
title: Synthesisable Verilog
area: dd
needs: [dd-sequential]
build: 1
tracks: [asic]
---

> Written by a model for Adit. Not Adit's words.

Needs: [flip-flops](dd-sequential.md#^latch-ff), [latches](dd-sequential.md#^latch-def) and [timing](dd-sequential.md#^max-freq). Verilog here means the synthesisable part of Verilog-2005: text that a synthesis tool turns into gates and flip-flops. Read every snippet as a drawing of hardware, and ask what the drawing is before asking what the simulator prints. ^needs

## Modules and ports

> [!def] Module, ports, wire and reg
> A **module** is a block of hardware with named **ports**. A **wire** is a net driven continuously, by an `assign` or by an instance's output. A **reg** is a variable written inside an `always` block; despite the name it becomes a flip-flop only if the block that writes it is clocked. `assign` describes combinational logic. A **parameter** is a constant the instantiating module may override; a **localparam** cannot be overridden.
>
> ```verilog
> module mux2 #(parameter W = 8) (
>   input  wire [W-1:0] a,
>   input  wire [W-1:0] b,
>   input  wire         sel,
>   output wire [W-1:0] y
> );
>   assign y = sel ? b : a;
> endmodule
> ```
>
> An **instance** connects ports by name: `mux2 #(.W(4)) u_mux (.a(x), .b(z), .sel(s), .y(out));`
^module-ports

## Widths and signedness

> [!def] Two's complement
> An $n$-bit vector $b_{n-1} \dots b_0$ read as **unsigned** has value $\sum_i b_i 2^i$; read as **signed** (two's complement) its top bit weighs $-2^{n-1}$ instead of $+2^{n-1}$. The same adder serves both readings, because the two values differ by a multiple of $2^n$ and the adder works modulo $2^n$.
^twos-complement

> [!def] Width and sign rules
> - A vector is declared `[msb:lsb]`. A **sized literal** gives its width: `8'hA5`, `4'b10x0`. A plain number such as `5` is a 32-bit **signed** integer.
> - An assignment evaluates its right side at the larger of the left side's width and the right side's operand widths, then keeps the low bits that fit the left side.
> - Arithmetic and bitwise operators extend their operands to that same **context width** before operating, so a carry survives only if the context is wide enough to hold it.
> - A comparison gives one bit; its two operands are extended to each other's width, not the context's.
> - A shift takes its width from its left operand, which is context-sized; the shift amount is sized on its own. `>>` always fills with zeros; `>>>` fills with the sign bit only when the operand is signed.
> - Concatenation `{a, b}` and replication `{4{x}}` size each operand on its own.
> - An expression is signed only if every operand is signed. Sized literals are unsigned unless written `8'sd3`; part-selects are unsigned; `$signed()` and `$unsigned()` change the reading without changing bits.
^widths

> [!example] Keeping the carry
> `a` and `b` are 8-bit. What do `assign s = a + b;` with `s` 8-bit and `assign {cout, s} = a + b;` give for $a = 200$, $b = 100$?
^ex-carry

> [!solution]- Solution
> methods: dd-verilog/widths
> 1. In the first, the context is 8 bits: $300 \bmod 256 = 44$, and the carry is lost.
> 2. In the second, the left side is 9 bits, so the sum is computed in 9 bits: `cout` = 1 and `s` = 44, together 300.

## Combinational and clocked blocks

> [!def] Combinational always block
> `always @(*)` re-runs its body whenever any signal it reads changes. It describes combinational logic when every reg it writes is assigned on every path through the body. Inside it, use blocking assignments `=`.
^comb-always

> [!def] Clocked always block
> `always @(posedge clk)` runs its body at each rising edge; every reg it writes becomes a flip-flop whose $D$ input is the logic the body computes. Inside it, use nonblocking assignments `<=`. A path that does not assign a reg means "hold": the flop's $D$ is fed back from its $Q$, which is not a latch. A synchronous reset is an `if (rst)` inside the body; an asynchronous one adds the reset to the event list, `always @(posedge clk or posedge rst)`, with `if (rst)` as the first branch.
^seq-always

> [!example] A counter with enable
> What hardware does this describe?
>
> ```verilog
> module count4 (
>   input  wire       clk,
>   input  wire       rst,   // synchronous, active high
>   input  wire       en,
>   output reg  [3:0] q
> );
>   always @(posedge clk) begin
>     if (rst)     q <= 4'd0;
>     else if (en) q <= q + 4'd1;
>   end
> endmodule
> ```
^ex-counter

> [!solution]- Solution
> methods: dd-verilog/seq-always, dd-verilog/widths
> Four D flip-flops holding `q`; a 4-bit incrementer computing `q + 1` (it wraps from 15 to 0 because the context is 4 bits); a 2:1 multiplexer per bit choosing `q + 1` when `en` is 1 and `q` otherwise; and a reset gate per bit forcing 0 when `rst` is 1. The missing `else` is the hold path through the multiplexer, not a latch.

## Blocking and nonblocking

> [!def] What the two assignments do
> Within one time step the simulator runs every block that has been triggered, one at a time, in an order the language leaves open. A **blocking** assignment `a = e;` evaluates `e` and writes `a` at once, so the next statement sees the new `a`. A **nonblocking** assignment `a <= e;` evaluates `e` at once but only schedules the write; scheduled writes are applied after every triggered block has finished.
^nba-def

> [!thm] Theorem (nonblocking assignments model flops)
> Suppose every reg written in a block triggered by a clock edge is written with nonblocking assignments, and each reg is written by one block only. Then the values after the edge depend only on the values before it, never on the order in which the simulator runs the blocks; this is the behaviour of a bank of flip-flops that all sample at the same edge.
^blocking

> [!proof]- Proof (d 2)
> 1. At the edge, every right-hand side in every triggered block is evaluated while that block runs.
> 2. No scheduled write is applied until all triggered blocks have finished, so every one of those evaluations reads the values from before the edge, in any order of blocks.
> 3. The writes are then applied. Each reg has one writing block, and within a block statements run in program order, so the value a reg ends with is fixed by its own block and the pre-edge values.
> 4. Hence the post-edge state is a function of the pre-edge state and the inputs alone.
^p-blocking

With blocking assignments the same claim fails. Two clocked blocks `a = b;` and `b = a;` leave both regs equal to the old `b` or both equal to the old `a`, depending on which runs first, and never the swap that two flops would give: a **race**. Rules that avoid both races and surprises: `<=` in clocked blocks, `=` in combinational ones, never both kinds in one block, and never one reg written by two blocks. ^nba-rules

> [!example] A shift register, twice
> Starting from `q1 = q2 = q3 = 0`, apply `d = 1` at the first edge and `d = 0` after. Trace three edges for each body, inside `always @(posedge clk)`:
> (i) `q1 <= d; q2 <= q1; q3 <= q2;`
> (ii) `q1 = d; q2 = q1; q3 = q2;`
^ex-shift-twice

> [!solution]- Solution
> methods: dd-verilog/blocking
> 1. (i) $(q_1, q_2, q_3)$ = (1,0,0), (0,1,0), (0,0,1): the 1 walks down a three-flop shift register.
> 2. (ii) (1,1,1), (0,0,0), (0,0,0): each statement sees the value just written above it, so all three regs copy `d`. Synthesis builds three flops all fed from `d`, or merges them into one.

## Latches

> [!thm] Theorem (inferred latch)
> If some path through an `always @(*)` block leaves a reg unassigned, synthesis builds a level-sensitive latch for that reg, open exactly when a path that assigns it is taken.
^inferred-latch

> [!proof]- Proof
> 1. On a path that skips the reg, the simulator leaves it at its previous value, and synthesis must build hardware that matches.
> 2. The previous value is not a function of the present inputs, so the reg needs storage.
> 3. The block is not edge-triggered, so the storage is transparent while an assigning path is selected and holds otherwise: a [latch](dd-sequential.md#^latch-def) whose enable is the condition for taking an assigning path.
^p-inferred-latch

> [!trap] The missing else
> `always @(*) if (en) y = a;` holds `y` while `en` is 0, so it is a latch. A latch in a flop-based design breaks the timing model of [setup and hold](dd-sequential.md#^setup-hold) and is almost always a bug. Assign every output at the top of the block, before any branch, or give every `if` an `else` and every `case` a `default`.
^trap-missing-else

## Case and priority

> [!def] case, casez and priority
> `case (s)` compares `s` against each item in order, with exact four-valued equality, and runs the first match; `default` runs when none match. If the items are mutually exclusive and cover every value, synthesis can build one wide multiplexer. An `if`-`else if` chain, or a `case` whose items overlap, describes a **priority** chain in which an earlier condition masks the later ones. `casez` treats `?` (or `z`) in an item as don't-care, which suits a priority encoder:
>
> ```verilog
> always @(*) begin
>   casez (req)
>     4'b1???: grant = 2'd3;
>     4'b01??: grant = 2'd2;
>     4'b001?: grant = 2'd1;
>     default: grant = 2'd0;
>   endcase
> end
> ```
>
> Avoid `casex`: an `x` in the selector then matches any item in simulation, hiding unknown values.
^case

## Simulation against synthesis

> [!def] Where simulation and hardware part ways
> - `initial` blocks produce no hardware on an ASIC; flops power up at random, so reset what matters. ^ss-initial
> - `#` delays are ignored by synthesis. ^ss-delay
> - An incomplete event list such as `always @(a)` that also reads `b` makes the simulator miss changes of `b`; the hardware does not. Write `@(*)`. ^ss-sensitivity
> - `x` exists only in simulation; hardware is always 0 or 1. With `s = x`, `if (s)` takes the `else` branch, while `s ? a : b` gives a bitwise merge: bits where `a` and `b` agree keep their value, the others become `x`. Simulation can therefore look cleaner (or dirtier) than the silicon. ^ss-x
> - A `for` loop with constant bounds unrolls into copies of hardware; `$display` and other system tasks produce none. ^ss-loops
^sim-synth

> [!example] An unknown select
> `s = 1'bx`, `a = 4'b1010`, `b = 4'b1001`. What do `y1 = s ? a : b;` and `if (s) y2 = a; else y2 = b;` give in simulation, and what can the hardware give?
^ex-x-select

> [!solution]- Solution
> methods: dd-verilog/sim-synth
> 1. `y1` merges bitwise: the top two bits agree (1, 0), the bottom two differ, so `y1 = 4'b10xx`.
> 2. `y2` takes the `else` branch: `4'b1001`.
> 3. The hardware sees `s` as 0 or 1, so it gives `1001` or `1010`; the `if` form hides the second possibility.

## Derive

> [!derive] Prove that an `always @(*)` block in which every reg it writes is assigned once at the top, before any branch, infers no latch.
^d-default-no-latch

> [!derive] For 8-bit unsigned `a`, `b` and `c`, find the smallest width of a reg that holds `a * b + c` exactly for every input, and prove it suffices.
^d-width-mult

> [!derive] Prove that a `casez` whose items overlap computes the same function as the `if`-`else if` chain that tests the items in the same order, and state a condition under which reordering the items changes nothing.
^d-casez-priority

> [!derive] Prove that copying the top bit of an $n$-bit two's complement number into $k$ new top bits preserves its value.
^d-sign-extend

## Problems

> [!problem] A three-way select (d 2)
> ```verilog
> module p_sel (input [1:0] sel, input a, input b, input c,
>               output reg y, output reg z);
>   always @(*) begin
>     z = 1'b0;
>     case (sel)
>       2'b00: y = a;
>       2'b01: y = b;
>       2'b10: begin y = c; z = 1'b1; end
>     endcase
>   end
> endmodule
> ```
> Which outputs get storage, and when is it open? Give `y` and `z` after each of these input rows, applied in order as (sel, a, b, c): (00, 1, 0, 0), (11, 0, 0, 0), (01, 0, 0, 1), (11, 1, 1, 1), (10, 0, 1, 1).
^inv-dd-three-way

> [!solution]- Solution
> methods: dd-verilog/inferred-latch, dd-verilog/case
> 1. `z` is assigned at the top, so it is combinational: 1 exactly when `sel = 10`.
> 2. `y` is skipped when `sel = 11`, so it is a latch, open when `sel` is not 11.
> 3. Rows: `y` = 1, 1 (held), 0, 0 (held), 1; `z` = 0, 0, 0, 0, 1.
> Answer: a latch on `y` only, open unless `sel = 11`; y = 1, 1, 0, 0, 1 and z = 0, 0, 0, 0, 1.

> [!problem] An average of two bytes (d 2.5)
> `a` and `b` are 8-bit unsigned with $a = 200$ and $b = 100$. Give the value of each:
> `wire [7:0] m1 = (a + b) >> 1;`
> `wire [8:0] m2 = (a + b) >> 1;`
> `wire [7:0] m3 = (a + b + 9'd0) >> 1;`
^inv-dd-average

> [!solution]- Solution
> methods: dd-verilog/widths
> 1. `m1`: the context is 8 bits, so $a + b = 300 \bmod 256 = 44$ before the shift; $44 \gg 1 = 22$.
> 2. `m2`: the context is 9 bits, so the sum is 300 and the shift gives 150.
> 3. `m3`: the 9-bit literal widens the context to 9 bits; the shift gives 150, which fits in 8 bits.
> Answer: 22, 150, 150.

> [!problem] A signed byte against an unsigned one (d 3)
> ```verilog
> wire signed [7:0] x = -8'sd3;
> wire        [7:0] y = 8'd2;
> ```
> Evaluate `x < y`, `x < 8'sd2`, `x < 2`, `x >>> 1` and `x >> 1`, giving each shift result as 8 bits.
^inv-dd-signed-mix

> [!solution]- Solution
> methods: dd-verilog/widths, dd-verilog/twos-complement
> 1. `x` holds `1111_1101`. In `x < y` one operand is unsigned, so both are read unsigned: $253 < 2$ is false, 0.
> 2. `x < 8'sd2`: both signed, $-3 < 2$, 1.
> 3. `x < 2`: `2` is a signed 32-bit integer, so the comparison is signed and `x` is sign-extended: 1.
> 4. `x >>> 1` on a signed operand fills with the sign bit: `1111_1110`, which is $-2$.
> 5. `x >> 1` always fills with zero: `0111_1110`, which is 126.
> Answer: 0, 1, 1, `11111110`, `01111110`.

> [!problem] A three-register ring (d 3)
> `q1`, `q2`, `q3` start at (1, 1, 0). Each body below sits in `always @(posedge clk)`. Give the state after one and after two edges, and say what flip-flops and connections each body describes.
> (i) `q1 = q3; q2 = q1; q3 = q2;`
> (ii) `q3 = q2; q2 = q1; q1 = q3;`
> (iii) `q1 <= q3; q2 <= q1; q3 <= q2;`
^inv-dd-ring

> [!solution]- Solution
> methods: dd-verilog/blocking, small-cases
> 1. (i) Each statement reads the value just written: `q1` gets old `q3`, `q2` gets new `q1` = old `q3`, `q3` gets old `q3`. All three flops are fed from `q3`. States: (0,0,0), (0,0,0).
> 2. (ii) `q3` gets old `q2`, `q2` gets old `q1`, then `q1` gets new `q3` = old `q2`. So `q1` and `q3` are both fed from `q2`, and `q2` from `q1`. States: (1,1,1), (1,1,1).
> 3. (iii) A true rotation: `q1` from `q3`, `q2` from `q1`, `q3` from `q2`. States: (0,1,1), (1,0,1).
> 4. Reversing the order rescues a straight chain but not a ring: in (ii) the last statement still reads a value written in the same edge.
> Answer: (i) (0,0,0) twice; (ii) (1,1,1) twice; (iii) (0,1,1) then (1,0,1).

> [!problem] A short event list (d 2.5)
> ```verilog
> always @(a) y = a & b;
> ```
> Both inputs start at 0 and `y` at 0. Then `a` rises at $t = 10$, `b` rises at 20, `a` falls at 30, and `a` rises at 40. Give `y` after each change, in simulation and in the synthesised hardware.
^inv-dd-short-list

> [!solution]- Solution
> methods: dd-verilog/sim-synth
> 1. The block wakes only when `a` changes. At 10 it computes $1 \cdot 0 = 0$.
> 2. At 20 only `b` changes, so the simulated `y` stays 0; the hardware, an AND gate, outputs 1.
> 3. At 30 the block wakes: 0 in both. At 40: 1 in both.
> Answer: simulation 0, 0, 0, 1; hardware 0, 1, 0, 1. They disagree from 20 to 30.

> [!problem] A decimal counter that is not (d 2)
> ```verilog
> always @(posedge clk) begin
>   if (cnt == 4'd9) cnt <= 4'd0;
>   cnt <= cnt + 4'd1;
> end
> ```
> `cnt` is 4 bits and starts at 0. What is it after 12 edges, and after how many edges is it first 0 again? Fix the body so it counts 0 to 9.
^inv-dd-decimal

> [!solution]- Solution
> methods: dd-verilog/blocking, dd-verilog/seq-always
> 1. Both writes are scheduled when `cnt` is 9; the later one in program order wins, so `cnt` always becomes `cnt + 1`.
> 2. It counts 0, 1, ..., 15, 0 in 4 bits: 12 after 12 edges, 0 again after 16.
> 3. Fix: `if (cnt == 4'd9) cnt <= 4'd0; else cnt <= cnt + 4'd1;`
> Answer: 12; 16 edges.
