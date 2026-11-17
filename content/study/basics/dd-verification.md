---
study: basic
id: dd-verification
title: Testbenches and reference models
area: dd
needs: [dd-verilog]
build: 1
tracks: [asic, interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [synthesisable Verilog](dd-verilog.md#^seq-always), and [what simulates differently from what synthesises](dd-verilog.md#^sim-synth).
^needs

A design is right when it does what its specification says for every input sequence it can meet. No simulation tries them all. Verification is two decisions: which sequences to try, and how a run decides by itself whether the design was right. Everything below serves one of those two.
^intro

## The testbench

> [!def] Testbench structure
> A **testbench** is a top-level module with no ports that instantiates the **design under test** (DUT) and surrounds it with:
> - a **clock and reset generator**;
> - a **driver** that applies the stimulus to the DUT's inputs;
> - a **reference model** that computes what the outputs should be ([below](dd-verification.md#^ref-model));
> - a **checker** (or scoreboard) that compares the DUT's outputs with the model's and reports the first difference.
>
> A testbench is never synthesised, so it may use everything the design may not: `initial` blocks, `#` delays, loops, `$random`, `$display`, `$finish`. One timing rule prevents races: drive inputs away from the active edge (at the falling edge, or a small delay after the rising edge) and sample outputs after the rising edge has settled. The katas' vectors follow exactly this rule: apply inputs, one rising edge, sample outputs.
^tb-structure

> [!example] A checker for a four-bit counter
> Module `cnt4` has inputs `clk`, `rst`, `en` and output `q[3:0]`: a synchronous active-high reset to 0, otherwise `q` counts up by one, wrapping, at each edge with `en` high. Write a self-checking testbench that runs 1000 random cycles and stops at the first wrong `q`.
^ex-counter-tb

> [!solution]- Solution
> methods: reference-model
> ```verilog
> `timescale 1ns/1ps
> module tb;
>   reg clk = 0, rst = 1, en = 0;
>   wire [3:0] q;
>   cnt4 dut (.clk(clk), .rst(rst), .en(en), .q(q));
>   always #5 clk = ~clk;
>   reg [3:0] exp_q;                                   // the model's state
>   integer t, seed = 1;
>   initial begin
>     exp_q = 4'd0;
>     for (t = 0; t < 1000; t = t + 1) begin
>       @(negedge clk);                                // drive away from the active edge
>       rst = (t < 2) || ($random(seed) % 50 == 0);
>       en  = $random(seed);                           // keeps bit 0
>       @(posedge clk); #1;                            // let the edge settle, then sample
>       exp_q = rst ? 4'd0 : (en ? exp_q + 4'd1 : exp_q);
>       if (q !== exp_q) begin
>         $display("cycle %0d: q = %h, expected %h (rst %b, en %b)", t, q, exp_q, rst, en);
>         $finish;
>       end
>     end
>     $display("pass: 1000 cycles");
>     $finish;
>   end
> endmodule
> ```
> 1. The model is one line: the specification of `q`, written without looking at the design.
> 2. Resets come at random as well as at the start, so a reset with `en` high and a reset after state has built up both get tried.
> 3. The comparison uses `!==`, which the next trap explains.

> [!trap] `!=` lets an unknown through
> In four-state simulation, `q != exp_q` is `x` (not true) when `q` is `x`, so `if (q != exp_q)` skips the error branch and a never-reset register passes. Smallest case: a flop with no reset powers up `x`; with `exp_q = 0` the check `if (q != 0)` never fires. Compare with `!==` (or check `^q === 1'bx` separately), which treats `x` as a value that must match.
^trap-x-compare

## The reference model

> [!def] Reference model
> A **reference model** is an executable statement of the specification: a program that, given the same inputs, produces the outputs the design should produce. A **cycle-level** model steps once per clock and predicts every output on every cycle; a **transaction-level** model predicts only the stream of results (bytes received, frames sent) and the checker compares the streams in order, so it does not care about latency. The model is written from the specification, never from the design: a model derived from the design repeats its mistakes. A model written by the design's own author from the same reading shares that reading's mistakes too, which is why the specification's own examples are run as directed tests and why a second person's model is worth more than a second run of the first.
^ref-model

> [!def] Self-checking
> A testbench is **self-checking** when it decides pass or fail by itself: every output that the specification defines is compared on every cycle (or every transaction) against the model, outputs the specification leaves free are marked as don't-care explicitly, and the run ends with a verdict. A waveform that a person inspects is a debugging aid, not a check: it is read once, by someone who already expects the answer.
^self-checking

## Stimulus

> [!def] Stimulus
> **Directed** stimulus is written by hand to hit what the specification names: its examples, its boundaries (full, empty, wrap-around, the last bit of a frame), events at the same edge (read and write together, reset with every other input high), and back-to-back operations. **Random** stimulus draws inputs from distributions, usually **constrained** to legal or interesting values, and finds what nobody thought to write. **Exhaustive** stimulus tries every input combination and is only possible for small widths. A random run must be reproducible from its seed, so that a failure can be replayed.
^stimulus

> [!thm] Theorem 1 (how long a random run must be)
> If each cycle of a random run hits a given corner independently with probability $p$, then $n$ cycles miss it with probability $(1-p)^n \le e^{-pn}$. So $n \ge \ln(1/\delta)/p$ cycles hit it with probability at least $1 - \delta$.
^random-hit

> [!proof]- Proof
> 1. The cycles are independent, so all $n$ miss with probability $(1-p)^n$.
> 2. $1 - p \le e^{-p}$ for every real $p$: the line $1 - p$ is the [tangent line](ineq-convexity.md#^tangent-line) of the convex $e^{-p}$ at 0. So $(1-p)^n \le e^{-pn}$.
> 3. $e^{-pn} \le \delta$ exactly when $n \ge \ln(1/\delta)/p$.
^p-random-hit

> [!example] A one-in-sixty-four corner
> A corner needs six independent fair input bits to take one particular value in the same cycle. How many random cycles give a 99.9% chance of hitting it at least once?
^ex-corner-cycles

> [!solution]- Solution
> methods: dd-verification/random-hit
> 1. $p = 2^{-6} = 1/64$ and $\delta = 10^{-3}$.
> 2. Exactly: $n \ge \ln(1000)/(-\ln(1 - 1/64)) = 438.6$, so 439 cycles.
> 3. The bound of Theorem 1 asks for $64 \ln 1000 = 442.1$, so 443: within 1% of the exact answer, and easier to do in your head.
> Answer: about 440 cycles. A corner that needs a particular state as well (the FIFO full, say) has a much smaller $p$; that is what directed tests are for.

## Coverage

> [!def] Coverage
> **Coverage** measures what a run exercised. **Code coverage** is collected from the design's source: lines executed, branches taken each way, bits toggled, state-machine states and transitions visited. **Functional coverage** is written from the specification: **bins** for the values and events that matter (each command, each count from 0 to full, each bit position of a frame) and **crosses** of bins (each command while full and while empty). Coverage says what was exercised, never that it was checked: a line executed while its result was never compared is covered and unverified.
^coverage

> [!thm] Theorem 2 (filling bins at random)
> Each cycle lands in one of $B$ bins uniformly and independently. After $n$ cycles the expected number of bins hit is $B\big(1 - (1 - 1/B)^n\big)$, and the expected number of cycles until every bin is hit is $B H_B$, where $H_B = 1 + \tfrac12 + \dots + \tfrac1B$.
^coverage-random

> [!proof]- Proof (d 2.5)
> 1. Let $I_b$ be 1 if bin $b$ is hit in $n$ cycles: it is 0 with probability $(1 - 1/B)^n$. The number of bins hit is $\sum_b I_b$.
> 2. By [linearity of expectation](pr-expectation.md#^lin-exp) over these [indicators](pr-expectation.md#^indicators), the expected number hit is $B(1 - (1 - 1/B)^n)$.
> 3. For the second claim, split the run into stages: stage $k$ starts when $k - 1$ bins are hit and ends at the first cycle that hits a new one, which has probability $q_k = (B - k + 1)/B$ per cycle.
> 4. A wait for an event of probability $q$ per cycle has mean $1/q$: by [total expectation](pr-expectation.md#^total-exp) over the first cycle, $W = 1 + (1 - q)W$.
> 5. Summing over stages: $\sum_{k=1}^{B} B/(B - k + 1) = B H_B$.
^p-coverage-random

The second half of Theorem 2 is why the last few bins of a random run take most of its length: with 256 bins, 1000 cycles are expected to hit about 251 of them, and filling all 256 takes about 1568 cycles on average. Past that point a directed test is cheaper than more random cycles.
^coverage-tail

## The first mismatch

> [!thm] Theorem 3 (the first mismatch comes no earlier than the bug)
> Design and model receive the same inputs. Let $\alpha$ read the model's state out of the design's state (for a FIFO: the queue contents from the memory and pointers). Call cycle $t$ an **activation** if, with the design's state agreeing with the model's under $\alpha$, the design's outputs at $t$ differ from the model's, or its next state disagrees under $\alpha$ with the model's next state. Let $t_b$ be the first activation and $t^\ast$ the first output mismatch. Then $t_b \le t^\ast$, with equality exactly when the first activation is an output error.
^first-mismatch

> [!proof]- Proof (d 2)
> 1. Both start from reset with states that agree under $\alpha$.
> 2. Before $t_b$ no cycle is an activation, so by induction on the cycle the states agree under $\alpha$ up to and including $t_b$, and every output before $t_b$ matches.
> 3. So no mismatch happens before $t_b$: $t^\ast \ge t_b$.
> 4. At $t_b$ the states agree; if its outputs differ, $t^\ast = t_b$; if only its next state disagrees, its outputs match and $t^\ast > t_b$.
^p-first-mismatch

So the first mismatch is where debugging starts, not where the bug is: walk back from $t^\ast$ through the internal state until it first disagrees with the model. The gap $t^\ast - t_b$ is the time a corrupted state stays invisible at the outputs, and it can be long. Checking internal state against the model, or asserting properties of it, moves detection back to $t_b$.
^first-mismatch-use

## Assertions

> [!def] Assertions
> An **assertion** is a property checked while the design runs, written next to the logic it constrains. An immediate assertion is a condition checked at a point in time (`if (count > 4) $error(...)`); a temporal assertion relates cycles, for example in SystemVerilog `assert property (@(posedge clk) disable iff (rst) (start && !busy) |=> busy);` (a start accepted while idle makes `busy` high on the next cycle). Assertions fire at the activation instead of at the outputs, document intent, and are what **formal** tools prove: a formal tool checks a property against every input sequence instead of the ones a testbench happened to apply. **Bounded model checking** explores every input sequence up to a depth $k$; an **inductive** proof shows that the property, once true, stays true, and so holds at every depth.
^assertions

> [!thm] Theorem 4 (how deep a complete search must go)
> A design with $k$ state bits reaches every state it can reach at all within $2^k - 1$ cycles of reset. So bounded model checking to depth $2^k - 1$ settles every property of the form "this never happens in any state and input".
^bmc-depth

> [!proof]- Proof
> 1. Take a reachable state and a shortest input sequence that reaches it.
> 2. If the run along it visited some state twice, cutting out the loop between the visits would give a shorter sequence; so all its states are distinct.
> 3. There are at most $2^k$ states, so the run has at most $2^k$ states and at most $2^k - 1$ steps.
> 4. A bad state-and-input pair is reached only from a reachable state, which bounded model checking to that depth has visited with every input.
^p-bmc-depth

For a design with even a few dozen flops $2^k$ is astronomically large, so Theorem 4 is a ceiling, not a plan: in practice the bound is far smaller (a counter's reachable depth is its range, a FIFO's its depth), and induction carries the proof the rest of the way.
^bmc-practice

## Derive

> [!derive] For every $L$, give a design, a model and a stimulus whose first activation and first output mismatch are $L$ cycles apart, and prove the gap.
^d-mismatch-gap

> [!derive] Derive the exact number of random cycles needed to hit a corner of per-cycle probability $p$ with probability at least $1 - \delta$, and prove that it never exceeds $\lceil \ln(1/\delta)/p \rceil$.
^d-random-exact

> [!derive] Prove that the expected number of uniform draws needed to hit all $B$ bins satisfies $B \ln B \le B H_B \le B(\ln B + 1)$.
^d-coupon-bounds

> [!derive] For every $k$, give a design with $k$ state bits and one reachable state that no input sequence shorter than $2^k - 1$ reaches, so that Theorem 4 cannot be improved.
^d-bmc-tight

## Problems

> [!problem] Four commands of unequal weight (d 4)
> A random driver issues one of four commands per cycle, independently, with probabilities $\tfrac12$, $\tfrac14$, $\tfrac18$ and $\tfrac18$. How many cycles does it take on average before every command has been issued at least once? Compare with four equally likely commands.
^inv-dd-four-commands

> [!solution]- Solution
> methods: inclusion-exclusion, indicators
> 1. The run lasts more than $n$ cycles exactly when some command is still missing after $n$ cycles. By [inclusion-exclusion](comb-binomial.md#^incl-excl) over the set $S$ of missing commands, with $p_S$ the total probability of $S$: $P(T > n) = \sum_{S \ne \emptyset} (-1)^{|S|+1} (1 - p_S)^n$.
> 2. $E[T] = \sum_{n \ge 0} P(T > n) = \sum_{S \ne \emptyset} (-1)^{|S|+1} / p_S$.
> 3. The fifteen sets give $\tfrac{1339}{105} \approx 12.75$.
> 4. Equally likely: $4 H_4 = \tfrac{25}{3} \approx 8.33$ (Theorem 2).
> Answer: $1339/105 \approx 12.75$ cycles against $8.33$; the two rare commands set the pace. A simulation of $2 \times 10^5$ runs gave 12.75.

> [!problem] Command pairs from a shift register (d 3.5)
> A testbench draws commands from an 8-bit Galois LFSR with feedback $x^8 + x^4 + x^3 + x^2 + 1$ (taps word `1d`), stepped once per cycle, the command being the state's two low bits. Over one full period of 255 steps, how many of the 16 ordered pairs (this cycle's command, next cycle's command) ever occur?
^inv-dd-lfsr-command-pairs

> [!solution]- Solution
> methods: dd-lfsr-crc/lfsr-forms
> 1. One step shifts every bit up and XORs the taps word in when the old bit 7 was 1.
> 2. The new bit 1 is the old bit 0 (the taps word has 0 in bit 1), and the new bit 0 is the old bit 7 (the taps word has 1 in bit 0).
> 3. So the next command's high bit always equals this command's low bit: at most 8 of the 16 pairs can occur.
> 4. All 8 do: the old bits 0, 1 and 7 together take every value in $\{0,1\}^3$ over a period, since every nonzero state occurs and these three bits are free in it (the all-zero triple occurs with other bits nonzero).
> Answer: 8 of 16 (confirmed by running the period). A single LFSR is a poor source for consecutive-cycle crosses.

> [!problem] Exhaustive adders (d 2)
> A simulator applies $10^6$ vectors per second. How long does an exhaustive test take for a 16-bit adder with carry-in, and for a 32-bit one?
^inv-dd-exhaustive-adders

> [!solution]- Solution
> methods: estimation
> 1. 16 bits: $2^{16} \cdot 2^{16} \cdot 2 = 2^{33} \approx 8.6 \times 10^9$ vectors, so $8.6 \times 10^3$ s, about 2.4 hours.
> 2. 32 bits: $2^{65} \approx 3.7 \times 10^{19}$ vectors, so $3.7 \times 10^{13}$ s, about 1.2 million years.
> Answer: 2.4 hours against about a million years; past about 30 input bits, exhaustive testing is replaced by proofs and structure (an adder is checked bit slice by bit slice).

> [!problem] A pointer one bit short (d 3)
> A design of the [four-byte FIFO](../katas/k-sync-fifo.md) keeps its write pointer in one bit instead of two; everything else is right. After reset it gets writes of `a`, `b`, `c`, `d` on cycles 1 to 4 (one per cycle, no reads), then reads on cycles 5 to 8. With $\alpha$ reading the queue from the memory starting at the read pointer, find the first activation, the first output mismatch, and which outputs mismatch.
^inv-dd-fifo-pointer-bug

> [!solution]- Solution
> methods: dd-verification/first-mismatch, small-cases
> 1. Cycles 1 and 2 write `a` and `b` into slots 0 and 1; the one-bit pointer wraps to 0.
> 2. Cycle 3 writes `c` into slot 0, over `a`: the queue read through $\alpha$ is now `c b ?`, the model's is `a b c`. The next state disagrees: cycle 3 is the first activation.
> 3. `count`, `full` and `empty` come from the count, which is right, so no output differs while only writes happen.
> 4. Cycle 5 reads slot 0: `rdata` = `c` where the model gives `a`. That is the first mismatch.
> Answer: activation at cycle 3, first mismatch at cycle 5, on `rdata` only (checked with a Python model of both).
