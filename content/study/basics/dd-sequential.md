---
study: basic
id: dd-sequential
title: Flip-flops, clocks and timing
area: dd
needs: [dd-boolean-cmos]
build: 1
tracks: [asic]
---

> Written by a model for Adit. Not Adit's words.

Needs: [static CMOS gates](dd-boolean-cmos.md#^cmos-gates) and [gate delay](dd-boolean-cmos.md#^rc-delay). This basic adds memory: how a circuit holds a bit, when it is allowed to change, how fast a clock can run, and what happens when a signal arrives with no regard for the clock. ^needs

## Storage

> [!def] Combinational and sequential logic
> A **combinational** circuit's outputs are a function of its present inputs alone. A **sequential** circuit also depends on stored values, its **state**. In a **synchronous** design all state sits in flip-flops that update together on the rising edge of one periodic **clock**, so between edges the circuit is combinational logic computing the next state.
^comb-seq-def

> [!def] Latches
> Two inverting gates in a loop form a **bistable**: the loop holds either value forever. An **SR latch** is two cross-coupled NOR gates: $S = 1$ sets the stored bit $Q$ to 1, $R = 1$ resets it to 0, and $S = R = 0$ holds it ($S = R = 1$ is not used: both outputs go to 0, and releasing both at once leaves the result to a race). A **D latch** has a data input $D$ and an enable: while the enable is 1 it is **transparent** ($Q$ follows $D$); while the enable is 0 it is **opaque** and holds the last value.
^latch-def

> [!thm] Theorem (master-slave flip-flop)
> A D latch transparent while $clk = 0$ (the master) feeding a D latch transparent while $clk = 1$ (the slave) is a **rising-edge D flip-flop**: $Q$ changes only at rising edges of $clk$, and then takes the value $D$ had just before the edge.
^latch-ff

> [!proof]- Proof (d 1.5)
> 1. While $clk = 0$ the master follows $D$ and the slave is opaque, so $Q$ does not change.
> 2. At the rising edge the master turns opaque, holding the value $D^*$ that $D$ had just before the edge.
> 3. While $clk = 1$ the slave is transparent and passes the master's held $D^*$ to $Q$; changes on $D$ are blocked by the opaque master.
> 4. At the falling edge the slave turns opaque, still holding $D^*$, and the master starts following $D$ again; $Q$ stays at $D^*$ until the next rising edge.
^p-latch-ff

"Just before the edge" is an idealisation. A real flop needs $D$ steady in a window around the edge, and its output moves some time after the edge. ^ideal-note

> [!def] Timing parameters
> For a flip-flop: the **setup time** $t_{su}$ is how long before the clock edge $D$ must be stable; the **hold time** $t_h$ is how long after the edge it must stay stable; the **clock-to-Q delay** $t_{cq}$ is the latest time after the edge that $Q$ settles, and the **contamination clock-to-Q** $t_{ccq}$ is the earliest time after the edge that $Q$ can start to change. For combinational logic: the **propagation delay** $t_{pd}$ is the longest input-to-output delay and the **contamination delay** $t_{cd}$ the shortest. A **timing path** runs from one flop's clock pin through logic to another flop's $D$ pin.
^setup-hold

## Timing constraints

> [!thm] Theorem (setup constraint)
> For a timing path from flop $A$ to flop $B$ clocked by the same edge with period $T$ and no skew,
> $$T \ge t_{cq} + t_{pd} + t_{su}.$$
> The largest such sum over all paths sets the minimum period; that path is the **critical path**, and $f_{\max} = 1/T_{\min}$.
^max-freq

> [!proof]- Proof
> 1. An edge at time 0 launches new data: $A$'s output settles by $t_{cq}$.
> 2. The logic settles $B$'s input by $t_{cq} + t_{pd}$.
> 3. $B$ captures at the next edge, time $T$, and needs its input stable from $T - t_{su}$; so $t_{cq} + t_{pd} \le T - t_{su}$.
^p-max-freq

> [!thm] Theorem (hold constraint)
> For the same path,
> $$t_{ccq} + t_{cd} \ge t_h,$$
> and the clock period does not appear.
^hold-check

> [!proof]- Proof
> 1. At the edge at time 0, $B$ captures the value already on its input, which must stay put until $t_h$.
> 2. The same edge makes $A$'s output start changing at $t_{ccq}$ at the earliest, and that change reaches $B$'s input at $t_{ccq} + t_{cd}$ at the earliest.
> 3. So the inequality is required, and since every time here is measured from one edge, $T$ never enters: a hold violation cannot be fixed by slowing the clock.
^p-hold-check

> [!thm] Theorem (skew)
> Let the clock reach $B$ later than $A$ by the **skew** $\delta$ (negative if earlier). Then
> $$T \ge t_{cq} + t_{pd} + t_{su} - \delta, \qquad t_{ccq} + t_{cd} \ge t_h + \delta.$$
> Positive skew relaxes setup by $\delta$ and tightens hold by $\delta$.
^clock-skew

> [!proof]- Proof
> 1. Launch at time 0 as before; the capture edge at $B$ is now at $T + \delta$, so the setup argument gives $t_{cq} + t_{pd} \le T + \delta - t_{su}$.
> 2. The edge at which $B$ must hold its old value arrives at $\delta$, so the hold argument gives $t_{ccq} + t_{cd} \ge \delta + t_h$.
^p-clock-skew

The clock reaches flops through a buffered **clock tree** whose branches differ in delay, so skew is never exactly zero. **Jitter**, the variation of one period from the next, shortens the worst period and is subtracted from the setup budget like negative skew. ^jitter

> [!example] A path budget
> A path has $t_{cq} = 0.40$ ns, $t_{pd} = 6.1$ ns, $t_{su} = 0.30$ ns, and on its short side $t_{ccq} = 0.25$ ns, $t_{cd} = 0.20$ ns, $t_h = 0.10$ ns. Find its fastest clock and check hold.
^ex-path-budget

> [!solution]- Solution
> methods: dd-sequential/max-freq, dd-sequential/hold-check
> 1. $T_{\min} = 0.40 + 6.1 + 0.30 = 6.8$ ns, so $f_{\max} \approx 147$ MHz.
> 2. Hold: $0.25 + 0.20 = 0.45 \ge 0.10$, a slack of 0.35 ns.

> [!example] The same path with skew
> The clock now reaches the capturing flop 0.5 ns late. Redo both checks.
^ex-path-skew

> [!solution]- Solution
> methods: dd-sequential/clock-skew
> 1. Setup: $T \ge 6.8 - 0.5 = 6.3$ ns, about 159 MHz.
> 2. Hold: need $0.45 \ge 0.10 + 0.5 = 0.60$. It fails by 0.15 ns, at every clock frequency.

## Metastability

> [!def] Metastability
> A bistable has an unstable **balance point** between its two stable states, like a ball on a hilltop. If a flop's input changes inside its setup-hold window, the flop can land near the balance point and stay there, with an output between the rails, for an unbounded time before falling to 0 or 1. Inputs from another clock domain, or from outside the chip, change at times unrelated to the clock, so some of their changes land in the window.
^metastability-def

> [!thm] Theorem (metastability failure rate)
> Model the flop near its balance point as $\dot v = v/\tau$, where $v$ is the internal voltage difference and $\tau$ a time constant of the cross-coupled pair. Let the clock run at $f_c$, the asynchronous input change $f_d$ times per second at times uniform relative to the clock, and let $T_w$ be the flop's effective window. If the output must be resolved within $t_r$ of the edge, the mean time between failures is
> $$\text{MTBF} = \frac{e^{t_r/\tau}}{T_w f_c f_d}.$$
^metastability

> [!proof]- Proof (d 3)
> 1. A data change at offset $\Delta$ from a clock edge starts the pair at $v_0 = k\Delta$ for small $\Delta$, where $k$ is a constant of the circuit.
> 2. The model gives $v(t) = v_0 e^{t/\tau}$, so reaching a resolved level $V_r$ takes $\tau \ln(V_r/|v_0|)$.
> 3. Still unresolved after $t_r$ exactly when $|v_0| < V_r e^{-t_r/\tau}$, that is when $|\Delta| < (V_r/k) e^{-t_r/\tau}$: a window of width $T_w e^{-t_r/\tau}$ with $T_w = 2V_r/k$.
> 4. Clock edges come every $1/f_c$ and the change time is uniform, so a given change lands in that window with probability $T_w e^{-t_r/\tau} f_c$.
> 5. Changes come at rate $f_d$, so failures come at rate $f_d f_c T_w e^{-t_r/\tau}$, and the MTBF is its reciprocal.
^p-metastability

The resolution time enters through an exponential, so every extra picosecond of $t_r$ multiplies the MTBF by $e^{1\text{ ps}/\tau}$. That is why the cure is time, not a better flop. ^exp-note

> [!def] Two-flop synchroniser
> An asynchronous single-bit signal enters a clock domain through two flops in series clocked by that domain, with no logic between them. The first may go metastable; the second samples it one full period later, so the resolution time is $t_r = T - t_{cq} - t_{su}$. The rest of the domain uses only the second flop's output. Rules: one synchroniser per signal, never several bits of one word synchronised separately unless only one bit changes at a time, and the signal must stay steady long enough for at least one destination edge to sample it cleanly.
^synchronizer

> [!def] Gray code
> A **Gray code** is a cyclic sequence of $n$-bit codes in which consecutive codes, including the last and the first, differ in exactly one bit. A count that crosses clock domains is sent in Gray code so that a sample taken mid-change is either the old count or the new one.
^gray

> [!example] One flop against two
> A synchroniser has $\tau = 60$ ps and $T_w = 100$ ps; the clock is 50 MHz and the input changes $10^6$ times a second. Compare the MTBF when the first flop's output feeds logic leaving only 1 ns of slack, against a second flop with $t_{cq} = 0.4$ ns and $t_{su} = 0.3$ ns.
^ex-mtbf

> [!solution]- Solution
> methods: dd-sequential/metastability, dd-sequential/synchronizer
> 1. $T_w f_c f_d = 10^{-10} \times 5 \times 10^7 \times 10^6 = 5000\ \text{s}^{-1}$.
> 2. One flop, $t_r = 1$ ns: $e^{1000/60}/5000 \approx 3.5 \times 10^3$ s, about one failure an hour.
> 3. Two flops: $t_r = 20 - 0.4 - 0.3 = 19.3$ ns, so the MTBF is about $10^{136}$ s.

## Reset

> [!def] Reset
> Flip-flops power up holding arbitrary values, so every flop whose value matters is reset to a known one. A **synchronous reset** is one more input to the next-state logic: it acts at a clock edge and needs the clock running. An **asynchronous reset** forces the flop at once, with or without a clock. Releasing an asynchronous reset is a timing event of its own: the release must come at least the **recovery time** before a clock edge and no sooner than the **removal time** after one (the setup and hold of reset). If it does not, some flops leave reset a cycle later than others, or go metastable. The usual rule is **assert asynchronously, release synchronously**: the raw reset clears a two-flop synchroniser whose input is tied to the inactive value, and the domain uses the synchroniser's output as its reset.
^reset

## Derive

> [!derive] A path is launched on the rising edge and captured on the falling edge of the same clock, with 50% duty cycle and no skew. Derive its setup and hold constraints.
^d-negedge

> [!derive] A multi-bit word changes in exactly one bit between consecutive values and is sampled by a bank of flops, each of which settles to either its old or its new bit. Prove that the sampled word is always either the old or the new value, and show by example that this fails for a word in which two bits change at once.
^d-gray-sync

> [!derive] Under the model of the metastability theorem, derive the MTBF of a synchroniser made of $n$ flops in series with no logic between them, in terms of $T$, $t_{cq}$, $t_{su}$, $\tau$, $T_w$, $f_c$ and $f_d$.
^d-n-stage

> [!derive] A level pulse from an unrelated clock domain is fed to a synchroniser clocked with period $T$. Find the shortest pulse width that is always captured, in terms of $T$, $t_{su}$ and $t_h$.
^d-pulse-width

## Problems

> [!problem] A two-stage pipeline (d 2)
> Registers $R_1 \to$ logic $A \to R_2 \to$ logic $B \to R_3$ share one clock with no skew. Flops: $t_{cq} = 0.35$ ns, $t_{ccq} = 0.25$ ns, $t_{su} = 0.25$ ns, $t_h = 0.15$ ns. Logic $A$: longest 4.2 ns, shortest 0.6 ns. Logic $B$: longest 5.1 ns, shortest 0.3 ns. Find the fastest clock, the critical path, and the hold slack of each stage.
^inv-dd-two-stage

> [!solution]- Solution
> methods: dd-sequential/max-freq, dd-sequential/hold-check
> 1. Stage $A$: $0.35 + 4.2 + 0.25 = 4.8$ ns. Stage $B$: $0.35 + 5.1 + 0.25 = 5.7$ ns. $B$ is critical: $T_{\min} = 5.7$ ns, $f_{\max} \approx 175$ MHz.
> 2. Hold slack: $A$: $0.25 + 0.6 - 0.15 = 0.70$ ns. $B$: $0.25 + 0.3 - 0.15 = 0.40$ ns.
> Answer: about 175 MHz, path through $B$; hold slacks 0.70 ns and 0.40 ns.

> [!problem] A late clock on the last register (d 3)
> In the same pipeline the clock reaches $R_3$ 0.6 ns after it reaches $R_1$ and $R_2$. The 0.3 ns shortest path through $B$ is a branch whose longest delay is 0.9 ns; every other path through $B$ takes at least 1 ns. Delay buffers take between 0.08 ns and 0.10 ns each. Find the new fastest clock, check hold, and find the fewest buffers that fix any violation without changing the clock you found.
^inv-dd-late-clock

> [!solution]- Solution
> methods: dd-sequential/clock-skew, dd-sequential/hold-check
> 1. Stage $B$ setup: $T \ge 5.7 - 0.6 = 5.1$ ns. Stage $A$ is unchanged at 4.8 ns. New $f_{\max} \approx 196$ MHz.
> 2. Stage $B$ hold: $0.25 + 0.3 \ge 0.15 + 0.6$ fails, slack $-0.20$ ns.
> 3. Buffers on the short branch add at least 0.08 ns each: $\lceil 0.20/0.08 \rceil = 3$ buffers, new slack $-0.20 + 0.24 = +0.04$ ns.
> 4. The branch's longest delay becomes at most $0.9 + 0.30 = 1.2$ ns, far below the 5.1 ns path, so the clock is unchanged.
> Answer: about 196 MHz; hold fails by 0.20 ns; 3 buffers.

> [!problem] Where to cut a chain (d 2.5)
> Five blocks of logic in a chain have delays 2, 3, 1, 4 and 2 ns, with registers at both ends; each register stage adds $t_{cq} + t_{su} = 0.5$ ns, and hold is not a concern. (a) What is the fastest clock as it stands? (b) With one extra register bank between two blocks? (c) With two? For (c), compare the latency from input to output with (a).
^inv-dd-cut-chain

> [!solution]- Solution
> methods: dd-sequential/max-freq, small-cases
> 1. (a) $12 + 0.5 = 12.5$ ns, 80 MHz.
> 2. (b) Cuts after blocks 1 to 4 give halves (2, 10), (5, 7), (6, 6), (10, 2). Cut after block 3: $6 + 0.5 = 6.5$ ns, about 154 MHz.
> 3. (c) Trying all six pairs of cuts, cutting after blocks 2 and 4 gives stages of 5, 5 and 2 ns: $5.5$ ns, about 182 MHz.
> 4. Latency in (c) is $3 \times 5.5 = 16.5$ ns against 12.5 ns in (a): throughput rose by more than double while each item takes 4 ns longer.
> Answer: 80 MHz; about 154 MHz; about 182 MHz with 16.5 ns latency.

> [!problem] A synchroniser budget (d 3)
> A flop has $\tau = 50$ ps and $T_w = 80$ ps, $t_{cq} = 0.3$ ns and $t_{su} = 0.2$ ns. The clock is 100 MHz and an asynchronous input changes $10^7$ times a second. The target is an MTBF of at least 10 years. (a) What resolution time is needed? (b) The first flop's output feeds 8.0 ns of logic before the next flop. Does it meet the target? (c) What does a second flop with no logic between them give?
^inv-dd-sync-budget

> [!solution]- Solution
> methods: dd-sequential/metastability, dd-sequential/synchronizer
> 1. (a) $t_r \ge \tau \ln(\text{MTBF} \cdot T_w f_c f_d) = 50\ \text{ps} \times \ln(3.156 \times 10^8 \times 8 \times 10^{-11} \times 10^8 \times 10^7) \approx 1.54$ ns.
> 2. (b) $t_r = 10 - 0.3 - 8.0 - 0.2 = 1.5$ ns, giving an MTBF of about $1.3 \times 10^8$ s, about 4.2 years. It misses.
> 3. (c) $t_r = 10 - 0.3 - 0.2 = 9.5$ ns, giving about $10^{77.6}$ s.
> Answer: about 1.54 ns; no, about 4.2 years; about $10^{78}$ s.

> [!problem] A one-cycle pulse into a slow domain (d 2.5)
> A 100 MHz domain raises a signal for exactly one of its cycles to report an event. A 30 MHz domain with an unrelated phase synchronises it. Ignoring the setup-hold window, what fraction of events does the slow domain miss? Design a crossing that misses none, and state what it requires of how often events occur.
^inv-dd-pulse-cross

> [!solution]- Solution
> methods: dd-sequential/synchronizer, dd-sequential/d-pulse-width
> 1. The pulse lasts 10 ns and the slow period is 33.3 ns. A slow edge falls inside the pulse with probability $10/33.3 = 0.3$, so 70% of events are missed.
> 2. Send a level instead of a pulse: the source flips a toggle flop on each event. The slow domain synchronises the toggle and compares the synchronised value with its value one slow cycle earlier (an XOR); a difference is one event, as a one-cycle pulse in the slow domain.
> 3. Each toggle level must last long enough to be sampled cleanly, more than one slow period plus the window. Events must therefore be spaced by more than that; two slow periods (about 67 ns) is a safe floor. Faster event streams need a counter crossed in Gray code or a handshake.
> Answer: 70% missed; a toggle crossing, with events spaced by about two slow periods.

> [!problem] Two registers in a loop (d 4)
> Flop $A$ feeds flop $B$ through logic with longest delay 5 ns and shortest 1 ns; $B$ feeds $A$ through logic with longest 3 ns and shortest 0.5 ns. Both flops have $t_{cq} = 0.6$ ns, $t_{ccq} = 0.2$ ns, $t_{su} = 0.4$ ns, $t_h = 0.1$ ns. You may delay the clock at $B$ relative to $A$ by any $\delta$, positive or negative. Find the smallest period and a $\delta$ that achieves it. Could any choice of skews beat it if there were more flops around the loop?
^inv-dd-loop-skew

> [!solution]- Solution
> methods: dd-sequential/clock-skew, dd-sequential/hold-check, bounding
> 1. Setup $A \to B$: $T \ge 0.6 + 5 + 0.4 - \delta = 6 - \delta$. Setup $B \to A$, where $A$'s clock is $\delta$ earlier than $B$'s: $T \ge 4 + \delta$.
> 2. Adding them, $2T \ge 10$, so $T \ge 5$ ns, reached at $\delta = 1$ ns. With zero skew $T = 6$ ns.
> 3. Hold $A \to B$: $0.2 + 1 \ge 0.1 + \delta$, so $\delta \le 1.1$. Hold $B \to A$: $0.2 + 0.5 \ge 0.1 - \delta$, so $\delta \ge -0.6$. $\delta = 1$ satisfies both.
> 4. Around any loop the skews of successive paths sum to zero, so adding the loop's setup constraints cancels them: the period is at least the sum of the loop's stage delays (each $t_{cq} + t_{pd} + t_{su}$) divided by the number of flops in it. Skew can balance a loop, never beat its average.
> Answer: 5 ns with $\delta = 1$ ns; no.
