---
study: basic
id: dd-fsm
title: Finite state machines and handshakes
area: dd
needs: [dd-sequential, dd-verilog]
build: 1
tracks: [asic]
---

> Written by a model for Adit. Not Adit's words.

Needs: [flip-flops and the setup constraint](dd-sequential.md#^max-freq), [clocked](dd-verilog.md#^seq-always) and [combinational](dd-verilog.md#^comb-always) always blocks, and [inferred latches](dd-verilog.md#^inferred-latch). A finite state machine is how control is written in hardware: a register holding which step you are on, and logic deciding the next step. This basic covers the two kinds, how states become bits, a template, counters, the valid-ready handshake, and how to check a machine. ^needs

## Machines

> [!def] Finite state machine
> A **finite state machine** (FSM) has a finite set of states $S$, a set of inputs $I$, a set of outputs $O$, a **reset state** $s_0$ and a **next-state function** $\delta : S \times I \to S$. At clock cycle $t$ it is in state $s_t$ and receives input $i_t$; at the edge ending the cycle it moves to $s_{t+1} = \delta(s_t, i_t)$. In hardware the state is a register and $\delta$ is combinational logic.
^fsm-def

> [!def] Moore and Mealy machines
> In a **Moore** machine the output depends on the state alone: $o_t = \lambda(s_t)$. In a **Mealy** machine it depends on the state and the present input: $o_t = \lambda(s_t, i_t)$. A Mealy output responds in the same cycle as its input, through a combinational path from input to output; a Moore output responds only after the state changes, and has no such path.
^moore-mealy

> [!thm] Theorem (Mealy to Moore)
> For every Mealy machine $M$ there is a Moore machine $M'$ with at most $|S| \cdot |O|$ states whose output at cycle $t + 1$ equals $M$'s output at cycle $t$, for every input sequence.
^mealy-to-moore

> [!proof]- Proof (d 2.5)
> 1. Let $M'$ have states $(s, o)$ with $s \in S$, $o \in O$, output $\lambda'(s, o) = o$, next state $\delta'((s, o), i) = (\delta(s, i), \lambda(s, i))$, and reset state $(s_0, o^*)$ for a fixed $o^* \in O$.
> 2. Claim: at cycle $t$, $M'$ is in $(s_t, o_{t-1})$, where $s_t$ and $o_{t-1}$ are $M$'s state at $t$ and output at $t - 1$ (with $o_{-1} = o^*$). It holds at $t = 0$ by the choice of reset state.
> 3. If it holds at $t$, then $\delta'((s_t, o_{t-1}), i_t) = (\delta(s_t, i_t), \lambda(s_t, i_t)) = (s_{t+1}, o_t)$, so it holds at $t + 1$.
> 4. So $M'$ outputs $o_{t-1}$ at cycle $t$: $M$'s output one cycle late. It has at most $|S| \cdot |O|$ states, and only the reachable ones need encoding.
^p-mealy-to-moore

A Moore machine is a Mealy machine whose $\lambda$ ignores its input, so the two kinds describe the same behaviours up to that one-cycle delay. Choose Mealy when the cycle matters and the combinational path is acceptable; choose Moore when outputs must come straight from flops. ^moore-or-mealy

> [!example] Two ones in a row
> A machine watches a serial bit $i_t$ and outputs 1 when the present bit and the one before it are both 1. Build it as a Mealy and as a Moore machine, and run both on the inputs 0, 1, 1, 1, 0, 1, 1, 0 (cycles 0 to 7).
^ex-two-ones

> [!solution]- Solution
> methods: state-machine, dd-fsm/mealy-to-moore
> 1. Mealy: states A (last bit 0, or reset) and B (last bit 1); go to B on 1, to A on 0; output 1 exactly in B with input 1.
> 2. Moore: S0 (last bit 0), S1 (one 1), S2 (at least two 1s), output 1 only in S2; on 0 go to S0, on 1 go S0 to S1 and S1 or S2 to S2.
> 3. Mealy outputs 1 at cycles 2, 3 and 6; Moore at cycles 3, 4 and 7, one cycle later, with one more state.

## Encoding

> [!def] State encodings
> A machine with $n$ states needs a code per state. **Binary** encoding numbers the states and uses $\lceil \log_2 n \rceil$ flops, leaving $2^{\lceil \log_2 n \rceil} - n$ codes unused. **One-hot** encoding uses $n$ flops, exactly one of which is 1 in each legal state. **Gray** encoding orders codes so that common transitions flip one bit. Binary uses the fewest flops; one-hot uses more flops but gives each next-state bit a short sum of products, which tends to be fast.
^encoding

> [!thm] Theorem (one-hot next-state logic)
> In a one-hot machine, let $c_{ij}$ be the input condition for the transition from state $i$ to state $j$, with the conditions out of each state mutually exclusive and covering every input. Then the next value of bit $j$ is
> $$s_j^{+} = \sum_{i} s_i \, c_{ij},$$
> the OR over the transitions into $j$, and from a legal code the next code is legal.
^onehot-eqs

> [!proof]- Proof
> 1. In a legal code only one $s_i$ is 1, so the sum for bit $j$ reduces to $c_{ij}$ for that $i$: bit $j$ turns on exactly when the transition $i \to j$ is taken.
> 2. The conditions out of state $i$ are exclusive and cover every input, so exactly one $c_{ij}$ is 1, and exactly one next bit is 1.
^p-onehot-eqs

> [!example] Five states, two ways
> A controller waits in A until `go`, then passes B, stays in C until `last`, then passes D and E and returns to A. Count the flops for binary and one-hot encoding and write the one-hot next-state equations.
^ex-five-states

> [!solution]- Solution
> methods: dd-fsm/onehot-eqs, dd-fsm/encoding
> 1. Binary: $\lceil \log_2 5 \rceil = 3$ flops, three unused codes. One-hot: 5 flops.
> 2. $A^+ = A\,\overline{go} + E$, $B^+ = A \cdot go$, $C^+ = B + C\,\overline{last}$, $D^+ = C \cdot last$, $E^+ = D$.

## A template

> [!def] FSM template in Verilog-2005
> Three parts: a state register (the only flops), combinational next-state logic with a default, and output logic. Unused codes return to reset.
>
> ```verilog
> module fsm_tmpl (
>   input  wire clk,
>   input  wire rst,     // synchronous, active high
>   input  wire go,
>   input  wire last,
>   output reg  busy,
>   output reg  done
> );
>   localparam [1:0] IDLE = 2'd0, RUN = 2'd1, FIN = 2'd2;
>   reg [1:0] state, state_nx;
>
>   always @(posedge clk) begin          // 1. state register
>     if (rst) state <= IDLE;
>     else     state <= state_nx;
>   end
>
>   always @(*) begin                    // 2. next-state logic
>     state_nx = state;                  //    default: stay
>     case (state)
>       IDLE:    if (go)   state_nx = RUN;
>       RUN:     if (last) state_nx = FIN;
>       FIN:               state_nx = IDLE;
>       default:           state_nx = IDLE;  // unused code 2'd3
>     endcase
>   end
>
>   always @(*) begin                    // 3. Moore outputs
>     busy = (state == RUN);
>     done = (state == FIN);
>   end
> endmodule
> ```
>
> The default assignment at the top of each combinational block rules out [latches](dd-verilog.md#^inferred-latch). Named `localparam` codes keep the encoding in one place. A Mealy output would read the inputs in block 3. The machine's clock period is bounded by the [setup constraint](dd-sequential.md#^max-freq) on the path from the state register through next-state logic back to itself.
^fsm-template

## Counters

> [!def] Counters and timers
> An $n$-bit **binary counter** is a machine whose $2^n$ states form one cycle, stepped by an incrementer. A **modulo-$N$ counter** returns to 0 after $N - 1$, and raises a **terminal count** while it holds $N - 1$. A **timer** is loaded with a value and counts down to 0. A controller that must wait or repeat $k$ times does not need $k$ states: pair a small FSM (the **control**) with a counter (the **datapath**), and let the FSM read the counter's terminal count as an input. With $c$ control states and a $b$-bit counter the pair has up to $c \cdot 2^b$ states, but its logic stays the size of the parts. A count that crosses clock domains is kept in [Gray code](dd-sequential.md#^gray).
^counters

## Handshakes

> [!def] Valid-ready handshake
> A **sender** drives `valid` and `data`; a **receiver** drives `ready`. A **transfer** happens in a cycle exactly when `valid` and `ready` are both 1 at the clock edge ending it. Two rules:
> 1. Once the sender raises `valid`, it keeps `valid` at 1 and `data` unchanged until a transfer, and it moves to its next item only at the edge ending a transfer. ^vr-hold
> 2. `valid` does not depend combinationally on `ready` in the same cycle; `ready` may depend on `valid`. ^vr-no-loop
^vr-def

> [!thm] Theorem (no loss, no repeats)
> Under rule 1, the data values carried by the transfers are the sender's items in order, each exactly once.
^valid-ready

> [!proof]- Proof (d 2)
> 1. Number the sender's items $x_1, x_2, \dots$. Show by induction on $k$ that the $k$-th transfer carries $x_k$.
> 2. Before the first transfer the sender has not advanced, so it presents only $x_1$, and the first transfer carries $x_1$.
> 3. After the $k$-th transfer, carrying $x_k$, the sender has advanced exactly once more: it presents $x_{k+1}$ or nothing until the next transfer.
> 4. It cannot present $x_k$ again (it has advanced) and cannot skip $x_{k+1}$ (it advances only on transfers), so the next transfer carries $x_{k+1}$.
^p-valid-ready

The receiver needs no rule for correctness: it may lower `ready` whenever it likes, and only throughput suffers. Rule 2 exists because the receiver may compute `ready` from `valid`; if the sender also computed `valid` from `ready`, the two would form a combinational loop. ^vr-notes

> [!example] A short exchange
> A sender has item $D_0$ from cycle 0, $D_1$ from cycle 1 and $D_2$ from cycle 4. The receiver's `ready` in cycles 0 to 8 is 0, 1, 0, 0, 1, 1, 1, 0, 1. In which cycles do the transfers happen?
^ex-exchange

> [!solution]- Solution
> methods: dd-fsm/valid-ready
> 1. Cycle 0: valid with $D_0$, not ready. Cycle 1: ready, so $D_0$ transfers.
> 2. Cycles 2 and 3: valid with $D_1$, not ready. Cycle 4: $D_1$ transfers.
> 3. Cycle 5: $D_2$ is available and ready is 1, so $D_2$ transfers. Transfers in cycles 1, 4 and 5.

## Checking a machine

> [!def] Equivalence, reachability and the product machine
> Two states are **equivalent** if, started from either, the machine gives the same outputs on every input sequence. A state is **reachable** if some input sequence leads to it from reset. The **product** of two Moore machines with the same inputs has state pairs $(s, u)$, next state $(\delta_1(s, i), \delta_2(u, i))$, and the pair of their outputs; it runs a design and a [reference model](dd-verification.md#^ref-model) side by side.
^equiv-def

> [!thm] Theorem (minimising by refinement)
> For a Moore machine with $n$ states, let $P_0$ group states by output, and let $P_{k+1}$ put two states together when they are together in $P_k$ and, for every input, their next states are together in $P_k$. The sequence stops changing after at most $n - 1$ strict refinements, and the blocks of the final partition are exactly the classes of equivalent states. Merging each block into one state gives a machine with the same outputs on every input sequence.
^minimise

> [!proof]- Proof (d 3)
> 1. By induction on $k$: two states are together in $P_k$ exactly when they give equal outputs on every input sequence of length at most $k$. For $k = 0$ this is equal present output.
> 2. Step: equal outputs on all sequences of length at most $k + 1$ means equal present output and, for each first input, successors with equal outputs on all sequences of length at most $k$; that is the rule for $P_{k+1}$.
> 3. $P_{k+1}$ is computed from $P_k$ alone, so once $P_{k+1} = P_k$ every later partition is the same.
> 4. Each strict refinement adds a block and there are at most $n$ blocks, so the sequence stops within $n - 1$ strict refinements.
> 5. At that point the blocks agree on sequences of every length, which is equivalence; and since successors of a block lie in one block, the merged machine is well defined and behaves the same.
^p-minimise

> [!def] A checklist for any FSM
> - Every reachable state has a next state for every input, and every unused code leads back to reset. ^check-complete
> - Every state is reachable from reset; an unreachable state is dead logic or a design error. ^check-reach
> - No two reachable states are equivalent, unless kept on purpose. ^check-minimal
> - Every combinational block assigns every output on every path. ^check-latch
> - Run the machine and a reference model in step on directed and random inputs and compare outputs every cycle: a check of the product machine. ^check-model
^fsm-check

## Derive

> [!derive] Count the illegal codes of a one-hot encoding of $n$ states, and prove that flipping any single bit of a legal code gives an illegal one.
^d-onehot-flip

> [!derive] Prove that a machine with $N$ reachable states, no two of them equivalent, needs at least $\lceil \log_2 N \rceil$ flip-flops in any encoding.
^d-min-flops

> [!derive] Prove that the $n$-bit codes $g = b \oplus (b \gg 1)$, for $b = 0, 1, \dots, 2^n - 1$, form a Gray code.
^d-gray-counter

> [!derive] Suppose `valid` is a combinational function of `ready` and `ready` a combinational function of `valid`. Show that the pair forms a combinational loop, and give a pair of such functions for which the loop has two consistent values.
^d-handshake-loop

> [!derive] Prove that two Moore machines with the same inputs give the same output sequence from their reset states for every input sequence exactly when no reachable state of their product machine has unequal outputs.
^d-product-machine

## Problems

> [!problem] A three-state table (d 2)
> A Mealy machine with reset state A has this table (entries are next state / output):
>
> | state | input 0 | input 1 |
> |---|---|---|
> | A | A / 0 | B / 0 |
> | B | C / 0 | B / 0 |
> | C | A / 0 | B / 1 |
>
> Give its outputs on the inputs 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1 and its final state. In words, what does it detect?
^inv-dd-three-state

> [!solution]- Solution
> methods: state-machine
> 1. States at cycles 0 to 10: A, B, C, B, C, B, B, C, B, C, A; final state B.
> 2. Outputs: 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0.
> 3. It outputs 1 on a 1 that completes the pattern 1, 0, 1, with overlaps allowed.
> Answer: 0 0 1 0 1 0 0 1 0 0 0, ending in B; it detects 101.

> [!problem] The same table without a combinational output (d 2.5)
> Turn the machine of the previous problem into a Moore machine whose output is the Mealy output one cycle late. How many states does it need, and what does it output on the same inputs (cycles 0 to 11)?
^inv-dd-three-state-moore

> [!solution]- Solution
> methods: dd-fsm/mealy-to-moore, state-machine
> 1. Pair each state with the output of the transition that entered it. From (A, 0) the reachable pairs are (A, 0), (B, 0), (C, 0) and (B, 1): only C → B on input 1 outputs 1.
> 2. (B, 1) alone outputs 1. Of the other three, only (C, 0) reaches (B, 1) on input 1, and (A, 0) and (B, 0) part on the input pair 0, 1 (one ends in (B, 0), the other in (B, 1)). So no two merge: 4 states.
> 3. Outputs, cycles 0 to 11: 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, which is the Mealy sequence shifted by one.
> Answer: 4 states; 0 0 0 1 0 1 0 0 1 0 0 0.

> [!problem] Six states, fewer needed (d 3)
> A Moore machine with reset state S0 has this table:
>
> | state | output | next on 0 | next on 1 |
> |---|---|---|---|
> | S0 | 0 | S1 | S2 |
> | S1 | 0 | S3 | S4 |
> | S2 | 0 | S3 | S5 |
> | S3 | 0 | S0 | S3 |
> | S4 | 1 | S0 | S2 |
> | S5 | 1 | S0 | S1 |
>
> Find the smallest machine with the same behaviour.
^inv-dd-six-states

> [!solution]- Solution
> methods: dd-fsm/minimise
> 1. $P_0$: {S0, S1, S2, S3} with output 0, {S4, S5} with output 1.
> 2. Next-state blocks on (0, 1): S0 → (0-block, 0-block), S3 → (0-block, 0-block), S1 and S2 → (0-block, 1-block); S4 and S5 → (0-block, 0-block). $P_1$: {S0, S3}, {S1, S2}, {S4, S5}.
> 3. Refine again: S0 → ({S1,S2}, {S1,S2}) but S3 → ({S0,S3}, {S0,S3}), so they split. S1 → ({S0,S3}, {S4,S5}) and S2 the same; S4 → ({S0,S3}, {S1,S2}) and S5 the same. $P_2$: {S0}, {S3}, {S1, S2}, {S4, S5}.
> 4. One more pass changes nothing. Merge S1 with S2 and S4 with S5.
> Answer: 4 states.

> [!problem] A one-entry pipeline stage (d 3.5)
> ```verilog
> module stage1 (
>   input  wire       clk,
>   input  wire       rst,
>   input  wire       in_valid,
>   output wire       in_ready,
>   input  wire [7:0] in_data,
>   output wire       out_valid,
>   input  wire       out_ready,
>   output reg  [7:0] out_data
> );
>   reg full;
>   assign out_valid = full;
>   assign in_ready  = !full;                  // version A
>   // assign in_ready = !full || out_ready;   // version B
>   always @(posedge clk) begin
>     if (rst) full <= 1'b0;
>     else if (in_valid && in_ready) begin full <= 1'b1; out_data <= in_data; end
>     else if (out_valid && out_ready) full <= 1'b0;
>   end
> endmodule
> ```
> The stage starts empty at cycle 0, upstream always has data (`in_valid` = 1), and `out_ready` in cycles 0 to 11 is 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1. How many items leave in cycles 0 to 11 under each version? What is each version's long-run throughput when `out_ready` is always 1? What does version B cost?
^inv-dd-one-entry

> [!solution]- Solution
> methods: dd-fsm/valid-ready, state-machine
> 1. Version A accepts only when empty, so a full cycle and an empty cycle alternate even when downstream is always ready: items leave in cycles 1, 3, 5, 8 and 10, which is 5 items, and the long-run throughput is 1/2 per cycle.
> 2. Version B also accepts when the held item is leaving in the same cycle, so the stage stays full: items leave in cycles 1, 3, 4, 5, 8, 9, 10 and 11, which is 8 items, and the long-run throughput is 1 per cycle.
> 3. Cost: in B, `in_ready` depends combinationally on `out_ready`. In a chain of such stages the ready signal ripples through every stage within one cycle, a combinational path that grows with the chain and can set the clock period.
> Answer: 5 against 8; 1/2 against 1; a ready path through every stage.

> [!problem] A glitch filter (d 2.5)
> ```verilog
> always @(posedge clk) begin
>   if (rst) begin out <= 1'b0; cnt <= 2'd0; end
>   else if (in == out)  cnt <= 2'd0;
>   else if (cnt == 2'd2) begin out <= in; cnt <= 2'd0; end
>   else                 cnt <= cnt + 2'd1;
> end
> ```
> After reset, `in` is sampled at 15 edges as 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0. Give `out` after each edge. What is the shortest run of a new input value that changes `out`, and how many reachable states does this machine have?
^inv-dd-glitch-filter

> [!solution]- Solution
> methods: state-machine, dd-fsm/counters
> 1. `cnt` counts consecutive samples that differ from `out`; on the third such sample `out` takes the new value.
> 2. Edges 2 and 3 differ but edge 4 resets the count. Edges 5, 6, 7 differ: `out` = 1 after edge 7. Edges 9 and 10 differ, edge 11 resets. Edges 12, 13, 14: `out` = 0 after edge 14.
> 3. `out`: 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0.
> 4. A new value must last 3 samples. The state is (`out`, `cnt`) with `cnt` in {0, 1, 2}: 6 reachable states (code `cnt` = 3 is unused).
> Answer: as in step 3; 3 samples; 6 states.

> [!problem] A ring after an upset (d 3)
> Four flops $(s_0, s_1, s_2, s_3)$ hold a one-hot state that steps $s_0 \to s_1 \to s_2 \to s_3 \to s_0$ with the equations $s_1^+ = s_0$, $s_2^+ = s_1$, $s_3^+ = s_2$, $s_0^+ = s_3$. (a) An upset leaves the code 0110. What happens next? (b) Replace the last equation by $s_0^+ = \overline{s_0 + s_1 + s_2}$. Show that from every one of the 16 codes the machine reaches a legal code and stays legal, and find the worst-case number of edges.
^inv-dd-ring-upset

> [!solution]- Solution
> methods: dd-fsm/fsm-check, dd-fsm/onehot-eqs
> 1. (a) The two set bits circulate forever: 0011, 1001, 1100, 0110, and so on. The machine never recovers.
> 2. (b) The legal cycle is unchanged: from 1000, 0100 or 0010 the new $s_0^+$ is 0, and from 0001 it is 1.
> 3. Write $u_t$ for $s_0$ after $t$ edges. After three edges the state is $(u_3, u_2, u_1, u_0)$, four consecutive values of $s_0$.
> 4. A 1 in $s_0$ sits in $s_0$, then $s_1$, then $s_2$ over the next three edges, and each time forces $s_0^+ = 0$; so every 1 among the $u_t$, the initial one included, is followed by three 0s. Hence the window holds at most one 1.
> 5. If $u_0 = u_1 = u_2 = 0$, then after two edges $s_0, s_1, s_2 = u_2, u_1, u_0$ are all 0, so $u_3 = 1$. Hence the window holds at least one 1, and after three edges the code is legal; by step 2 it stays legal.
> 6. Enumerating all 16 codes confirms it: 1100, 1101, 1110 and 1111 take exactly 3 edges, the rest fewer.
> Answer: (a) two hot bits circulate forever; (b) at most 3 edges.
