---
study: basic
id: dd-serial
title: "Serial links: UART, SPI and I2C"
area: dd
needs: [dd-fsm]
build: 1
tracks: [asic, interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [finite state machines and handshakes](dd-fsm.md#^fsm-template), and through it [flip-flops and timing](dd-sequential.md#^setup-hold).
^needs

A serial link moves a word one bit at a time over a few wires. Three questions decide how a link works: who provides the clock, how the receiver finds the first bit of a word, and who is allowed to drive each wire. UART has no clock wire at all. SPI has a clock driven by one side and one push-pull wire per direction. I2C has two wires shared by every device on the bus, and nobody ever drives them high.
^intro

## UART

> [!def] UART frame
> A UART line idles at 1. A **frame** is a start bit (0), then the data bits least significant first, then an optional parity bit, then one or more stop bits (1). Every bit lasts the same **bit time** $T$. The common shape **8N1** is 8 data bits, no parity, 1 stop bit: 10 bit times per byte. The 1-to-0 edge of the start bit is the only timing reference the receiver gets; the stop bit guarantees that the next start bit begins with a 1-to-0 edge again.
^uart-frame

> [!def] Baud rate and clocks per bit
> The **baud rate** is the number of bit times per second, $1/T$ (on a two-level line it equals the bit rate). An 8N1 link at baud $b$ carries $b/10$ bytes per second. A design clocked at $f$ makes the bit time from an integer number of clock cycles $N = \operatorname{round}(f/b)$, so its actual baud is $f/N$, and the relative baud error is $(f/N - b)/b$. The same holds for a receiver that runs a sample clock at $M$ times the baud from a divider: its sample period is an integer number of $f$ cycles.
^baud

The receiver has its own clock, so it cannot know exactly when each bit starts. It **oversamples**: it looks at the line $M$ times per bit time (commonly $M$ = 16 or 8), finds the start bit's falling edge to within one sample, and from there reads each bit near its middle.
^oversample-intro

> [!thm] Theorem 1 (sampling inside every bit)
> A transmitter sends an 8N1 frame with bit time $T$; its start bit falls at $t_0$. A receiver samples the line every $\tau$, with $N$ samples per receiver bit time, $N$ even, so its bit time is $T_r = N\tau$; let $d = T_r - T$. The receiver detects the start at its first sample at or after $t_0$, at $t_0 + e$ with $0 \le e < \tau$, and reads bit $j$ ($j = 0$ start, $1$ to $8$ data, $9$ stop) at $t_0 + e + (j + \tfrac12) T_r$. If
> $$9.5\,|d| < \tfrac{T}{2} - \tau,$$
> every one of the ten readings falls strictly inside its own bit, $t_0 + jT$ to $t_0 + (j+1)T$.
^oversample

> [!proof]- Proof (d 2.5)
> 1. The reading of bit $j$ sits after the start of bit $j$ by $o_j = e + (j+\tfrac12)T_r - jT = e + \tfrac{T}{2} + (j + \tfrac12)d$.
> 2. The reading is inside bit $j$ exactly when $0 < o_j < T$.
> 3. For $j \le 9$, $|(j+\tfrac12)d| \le 9.5|d|$.
> 4. Lower side: $o_j \ge 0 + \tfrac{T}{2} - 9.5|d| > \tfrac{T}{2} - (\tfrac{T}{2} - \tau) = \tau > 0$.
> 5. Upper side: $o_j < \tau + \tfrac{T}{2} + 9.5|d| < \tau + \tfrac{T}{2} + \tfrac{T}{2} - \tau = T$.
^p-oversample

Divide by $T$ and use $\tau \approx T/N$: the relative mismatch must stay below $(\tfrac12 - \tfrac1N)/9.5$, which is 4.6% for $N$ = 16 and 3.9% for $N$ = 8. That budget covers both ends together: the transmitter's divider error, the receiver's divider error and both oscillators' tolerances. The stop bit, read 9.5 bit times after the reference edge, is where the drift is largest, so a longer frame (parity, 9 data bits) has a smaller budget.
^oversample-budget

Two refinements are standard. A receiver that sees a 0 while idle checks the line again at the middle of the start bit and goes back to idle if it reads 1, so a glitch shorter than half a bit never starts a frame. And a receiver may take three samples around each middle and keep the majority, which turns an independent flip probability $p$ per sample into $3p^2 - 2p^3$.
^oversample-refine

> [!example] A divider for 115200 baud from 50 MHz
> A design clocked at 50 MHz needs an 8N1 link at 115200 baud. Find the baud error (a) with a transmitter that counts whole clock cycles per bit, and (b) with a receiver whose 16× sample clock comes from an integer divider.
^ex-baud-divisor

> [!solution]- Solution
> methods: dd-serial/baud
> 1. (a) $f/b = 50 \times 10^6 / 115200 = 434.03$, so $N = 434$ and the actual baud is $115207$: an error of $+0.0064\%$.
> 2. (b) $f/(16b) = 27.13$, so the divider is 27, the sample clock is $50\,\text{MHz}/27$ and the receiver's baud is $50 \times 10^6/(16 \cdot 27) = 115741$: an error of $+0.47\%$.
> 3. Both are far inside the 4.6% budget of Theorem 1. The lesson is the contrast: the coarser the divider (here 27 instead of 434), the larger the rounding error.

## SPI

> [!def] SPI and its four modes
> SPI has one **controller** and one or more **peripherals**. The controller drives the clock SCLK, the data line MOSI (controller out) and one active-low chip select CS_n per peripheral; the selected peripheral drives MISO. Each SCLK cycle moves one bit each way, most significant first by convention, so a byte transfer exchanges the contents of two 8-bit shift registers. **CPOL** is the level SCLK idles at. **CPHA** = 0 means data is sampled on the first (leading) SCLK edge after CS_n falls and changed on the trailing edge, so the first bit must be on the wire before the first edge; CPHA = 1 means data is changed on the leading edge and sampled on the trailing one.
>
> | mode | CPOL | CPHA | SCLK idles | sample on | change on |
> |---|---|---|---|---|---|
> | 0 | 0 | 0 | low | rising | falling |
> | 1 | 0 | 1 | low | falling | rising |
> | 2 | 1 | 0 | high | falling | rising |
> | 3 | 1 | 1 | high | rising | falling |
^spi-modes

The clock travels one way and the data comes back the other way, so the slowest round trip limits SCLK, not the clock frequency alone.
^spi-roundtrip

> [!thm] Theorem 2 (the round trip sets the SPI clock)
> In mode 0, let $t_c$ be the delay from the controller's internal clock to SCLK at its pin, $t_w$ the one-way board delay, $t_{co}$ the peripheral's delay from an SCLK falling edge to valid MISO, and $t_{su}$ the controller's setup time for MISO, all worst case. If the controller samples MISO at the internal clock edge that raises SCLK, the transfer works when half an SCLK period is at least $t_c + t_w + t_{co} + t_w + t_{su}$, so
> $$f_{\text{SCLK}} \le \frac{1}{2\,(t_c + 2t_w + t_{co} + t_{su})}.$$
^spi-timing

> [!proof]- Proof (d 2)
> 1. In mode 0 the peripheral changes MISO after a falling SCLK edge, and the controller reads it at the next rising edge, half a period $P/2$ later on its internal clock.
> 2. The falling edge leaves the controller's clock at time 0, reaches the controller's pin at $t_c$ and the peripheral at $t_c + t_w$.
> 3. MISO is valid at the peripheral at $t_c + t_w + t_{co}$ and at the controller's input at $t_c + 2t_w + t_{co}$.
> 4. The controller's sampling flop needs it $t_{su}$ before its edge at $P/2$: $t_c + 2t_w + t_{co} + t_{su} \le P/2$. Solve for $f = 1/P$.
^p-spi-timing

The MOSI direction has no such round trip: the controller launches MOSI and SCLK together, so only their skew matters. That asymmetry is why some controllers offer a "late sample" option that reads MISO later than the rising edge.
^spi-asym

> [!example] A fast peripheral on a short board
> $t_c$ = 3 ns, $t_w$ = 1.5 ns, $t_{co}$ = 12 ns, $t_{su}$ = 2 ns. What is the fastest mode 0 SCLK?
^ex-spi-fmax

> [!solution]- Solution
> methods: dd-serial/spi-timing
> 1. Half a period must cover $3 + 1.5 + 12 + 1.5 + 2 = 20$ ns.
> 2. So the period is at least 40 ns: $f_{\text{SCLK}} \le 25$ MHz. The peripheral's own 12 ns dominates; a faster board would buy little.

## I2C

> [!def] The I2C bus
> I2C has two wires, SCL (clock) and SDA (data), each pulled up to $V_{DD}$ by a resistor $R$. Every device has **open-drain** outputs: it can pull a wire low or release it, never drive it high. So each wire reads 1 only when every device releases it: the wire is the logical AND of what the devices want (**wired-AND**). A released wire rises through $R$ into the bus capacitance $C$ (pins plus traces), which limits the speed. The specification defines rise time from 30% to 70% of $V_{DD}$ and caps it at 1000 ns in standard mode (100 kHz) and 300 ns in fast mode (400 kHz), with $C$ at most 400 pF; a device must sink 3 mA while holding the line at or below 0.4 V. (These are the commonly quoted limits; check the current specification before signing off a design.)
^i2c-bus

> [!thm] Theorem 3 (rise time of a released line)
> A wire released at $t = 0$ from 0 V rises as $V_{DD}(1 - e^{-t/RC})$, and its 30% to 70% rise time is $RC \ln(7/3) \approx 0.847\,RC$.
^i2c-rise

> [!proof]- Proof
> 1. With the pull-down off, the capacitor charges through $R$: $RC\,\dot v = V_{DD} - v$, $v(0) = 0$, whose solution is $v = V_{DD}(1 - e^{-t/RC})$.
> 2. $v = 0.3V_{DD}$ at $t_1 = RC \ln(1/0.7)$ and $v = 0.7V_{DD}$ at $t_2 = RC\ln(1/0.3)$.
> 3. $t_2 - t_1 = RC \ln(0.7/0.3)$.
^p-i2c-rise

So the pull-up has a window: small enough that $0.847RC$ meets the rise-time limit, large enough that a device can sink the current, $R \ge (V_{DD} - 0.4\ \text{V})/3\ \text{mA}$.
^i2c-pullup

> [!example] Pull-ups for a fast-mode bus
> A 3.3 V fast-mode bus has 200 pF of capacitance. Find the range of pull-up resistance.
^ex-i2c-pullup

> [!solution]- Solution
> methods: dd-serial/i2c-rise
> 1. Rise time: $0.847 \cdot R \cdot 200\ \text{pF} \le 300$ ns gives $R \le 1.77$ kΩ.
> 2. Sink current: $R \ge (3.3 - 0.4)\ \text{V} / 3\ \text{mA} = 967$ Ω.
> 3. Any value from about 1.0 kΩ to 1.7 kΩ works; 1.2 kΩ or 1.5 kΩ leaves margin both ways.

> [!def] Bus conditions
> While SCL is high, SDA must hold still: it is a data bit, read by every receiver. Data changes only while SCL is low. The two exceptions are the **conditions**: **START** is SDA falling while SCL is high, and **STOP** is SDA rising while SCL is high. A START sent without a STOP before it is a **repeated START**: the controller keeps the bus and begins a new transfer. Because ordinary data never changes while SCL is high, a receiver can never mistake a data bit for a condition.
^i2c-conditions

> [!def] Bytes, acknowledge and stretching
> After a START, bits move in bytes, most significant first, one bit per SCL pulse. The ninth SCL pulse of each byte is the **acknowledge**: the transmitter releases SDA and the receiver pulls it low to acknowledge (ACK) or leaves it high (NACK). The first byte after a START is a 7-bit address followed by a direction bit, 1 for read and 0 for write; the addressed peripheral acknowledges it. In a read, the controller acknowledges every byte except the last, which it NACKs before the STOP, so the peripheral knows to release SDA. A peripheral that needs time may hold SCL low after the controller releases it (**clock stretching**); the controller waits until SCL reads high before it counts the high phase.
^i2c-ack

Because every device only ever pulls low, several controllers can start at once without damage. Each one watches SDA while it sends; the first time it releases SDA (sending 1) and reads 0, it has lost and stops driving.
^i2c-arb-intro

> [!thm] Theorem 4 (arbitration loses nothing)
> Several controllers start sending at the same time, bit-aligned on the shared SCL. Each sends its own bit string, compares the bus with each bit it sent, and stops for good at the first bit where it released SDA and read 0. Then the bus carries exactly the least of their strings in dictionary order (0 before 1), and its sender never sees a mismatch.
^i2c-arb

> [!proof]- Proof (d 3)
> 1. At each bit the bus reads the AND of the bits of the controllers still sending, since a released line contributes 1.
> 2. Let $w$ be the least string. Claim, by induction on $i$: after $i$ bits, the controllers still sending are exactly those whose first $i$ bits equal the bus's first $i$ bits, and $w$'s sender is among them.
> 3. At bit $i+1$, if $w$ has a 0 there, the bus reads 0, which equals $w$'s bit.
> 4. If $w$ has a 1 there, no remaining controller has a 0 there: its string would share $w$'s first $i$ bits and then be smaller. So the bus reads 1.
> 5. Either way the bus equals $w$'s bit, so $w$'s sender stays; a controller whose bit differs sent 1 and read 0, so it stops; the claim holds for $i+1$.
> 6. Hence the bus carries $w$ bit for bit, and $w$'s sender never sees a mismatch.
^p-i2c-arb

## Crossing into the receiver's clock

> [!note] Where the clock domains are
> A UART receiver's `rx` changes at moments unrelated to its clock, so it enters through a [two-flop synchronizer](dd-sequential.md#^synchronizer) before any logic looks at it; without one, a [metastable](dd-sequential.md#^metastability) flop can feed different values to different gates. The synchronizer delays the line by two or three cycles, which only shifts every sample by the same amount and does not change Theorem 1. An SPI peripheral built in a fast system clock treats SCLK, MOSI and CS_n the same way: it synchronizes them and detects SCLK edges in its own clock. It learns of a falling SCLK edge two to three system cycles late and must have the next MISO bit out before the next rising edge, half an SCLK period later, so in practice its system clock runs at six or more times SCLK (more with slow output pins). A peripheral that instead clocks its shift register directly from SCLK avoids that ratio but owns a second clock domain, and every signal between the two domains needs the same care.
^clock-domain

Katas on this page: [UART transmitter](../katas/k-uart-tx.md), [UART receiver](../katas/k-uart-rx.md), [SPI controller](../katas/k-spi-mode0.md), [I2C bit layer](../katas/k-i2c-bits.md).
^katas

## Derive

> [!derive] Prove the analogue of Theorem 1 for an 8E1 frame (8 data bits, one parity bit, one stop bit), and find the largest relative mismatch it allows with 16 samples per bit.
^d-uart-parity

> [!derive] Show that a receiver which checks the line again at the middle of the start bit rejects every low pulse shorter than $N/2$ sample periods, and accepts every low pulse longer than $N/2 + 1$ sample periods, whatever its phase.
^d-start-check

> [!derive] Derive the largest SCLK frequency for SPI mode 1 in terms of the delays of Theorem 2, and say which edge the controller should sample on.
^d-spi-mode1

> [!derive] Prove Theorem 4 again when the controllers may also send different numbers of bits, and state what happens when one string is a prefix of another.
^d-arb-prefix

> [!derive] Show that the majority of three independent samples, each wrong with probability $p$, is wrong with probability $3p^2 - 2p^3$, and find the $p$ below which the majority is better than one sample.
^d-majority

## Problems

> [!problem] Two boards at 230400 baud (d 3)
> Board A runs at 12 MHz and its UART receiver uses a 16× sample clock from an integer divider. Board B runs at 16 MHz and its transmitter counts a whole number of clock cycles per bit. Both are set to 230400 baud, 8N1, with exact crystals. Does B to A work? If not, find a baud rate both boards can make exactly, close to 230400.
^inv-dd-two-boards-baud

> [!solution]- Solution
> methods: dd-serial/baud, dd-serial/oversample
> 1. A: $12 \times 10^6/(16 \cdot 230400) = 3.26$, so the divider is 3, the sample period is $\tau = 0.25\ \mu$s and A's bit time is $T_r = 4.000\ \mu$s.
> 2. B: $16 \times 10^6 / 230400 = 69.4$, so $N = 69$ and B's bit time is $T = 4.3125\ \mu$s.
> 3. $|d| = 0.3125\ \mu$s, a 7.2% mismatch. Theorem 1 needs $9.5|d| < T/2 - \tau$: $2.97\ \mu\text{s} < 1.91\ \mu\text{s}$ is false, and the readings drift out of their bits before the stop bit.
> 4. 250000 baud: A's divider is $12 \times 10^6/(16 \cdot 250000) = 3$ exactly and B's count is $16 \times 10^6/250000 = 64$ exactly.
> Answer: no; use 250000 baud, which both make with zero error.

> [!problem] A glitch on an idle line (d 3)
> A UART receiver samples every $\tau$ with $N$ = 16 samples per bit. While idle, it starts a frame at the first 0 it sees, then checks the line again 8 samples later and returns to idle if it reads 1. A low pulse of duration $g$ arrives at a phase uniformly random relative to the sample clock. Find the probability that it starts a frame, as a function of $g/\tau$, and evaluate it at $g = 8.3\tau$.
^inv-dd-idle-line-glitch

> [!solution]- Solution
> methods: dd-serial/oversample-refine, small-cases
> 1. The pulse starts a frame exactly when the sample after the first low one by 8 periods is still low, that is when at least 9 consecutive samples fall inside the pulse.
> 2. An interval of length $g$ holds $\lfloor g/\tau \rfloor$ or $\lfloor g/\tau \rfloor + 1$ sample instants; with a uniform phase the larger count occurs with probability equal to the fractional part of $g/\tau$.
> 3. So the probability is 0 for $g < 8\tau$, $g/\tau - 8$ for $8\tau \le g < 9\tau$, and 1 for $g \ge 9\tau$.
> Answer: $\min(1, \max(0, g/\tau - 8))$; at $g = 8.3\tau$ it is 0.3 (a simulation over random phases gives 0.300).

> [!problem] Two controllers on one I2C bus (d 2.5)
> Controller P starts a write to address `0x52` and controller Q starts a read from address `0x4D` at the same moment. Which one wins, and at which bit? What changes if both address `0x52`, P writing and Q reading?
^inv-dd-i2c-two-controllers

> [!solution]- Solution
> methods: dd-serial/i2c-arb
> 1. The first byte is the 7-bit address then the direction bit. P sends `1010010` then 0: `10100100`. Q sends `1001101` then 1: `10011011`.
> 2. They agree on the first two bits; at the third bit P sends 1 and Q sends 0. The bus reads 0, P sees the mismatch and stops; Q never notices.
> 3. With the same address the first seven bits tie, and the direction bit decides: P's 0 (write) beats Q's 1 (read) at the eighth bit.
> Answer: Q wins at the third bit; with equal addresses the write wins at the eighth.

> [!problem] Three peripherals in a chain (d 2.5)
> Three SPI peripherals with 8-bit shift registers are chained: MOSI feeds P1, P1's output feeds P2, P2's feeds P3, and P3's output is MISO. One shared CS_n selects all three; when it falls they hold the bytes `11`, `22`, `33` (P1, P2, P3). The controller clocks out `a1`, `b2`, `c3` in that order, 24 SCLK cycles, most significant bit first. What does each peripheral hold when CS_n rises, and what bytes did the controller receive, in order?
^inv-dd-spi-three-chained

> [!solution]- Solution
> methods: small-cases
> 1. The chain is one 24-bit shift register: P1's input end at MOSI, P3's output end at MISO.
> 2. After 24 shifts the first byte sent has travelled the whole chain: P3 holds `a1`, P2 holds `b2`, P1 holds `c3`.
> 3. MISO shows P3's end first: first P3's own `33`, then P2's `22` (which moved into P3), then P1's `11`.
> Answer: P1 `c3`, P2 `b2`, P3 `a1`; received `33`, `22`, `11` (checked by simulating the chain).

> [!problem] A receiver on an RC oscillator (d 3.5)
> A receiver clocked from an exact 7.3728 MHz crystal samples at 8 times 115200 baud (its divider is exactly 8). The transmitter runs from an RC oscillator of nominal 8 MHz and counts 69 cycles per bit. Using Theorem 1 with $N$ = 8, find the range of transmitter oscillator frequencies for which the link is guaranteed, and the largest symmetric tolerance $\pm q$ around 8 MHz.
^inv-dd-uart-rc-oscillator

> [!solution]- Solution
> methods: dd-serial/oversample, bounding
> 1. Receiver: $T_r = 64 / 7.3728\ \text{MHz} = 8.6806\ \mu$s and $\tau = T_r/8 = 1.0851\ \mu$s. Transmitter: $T = 69/f$.
> 2. Slow transmitter ($T > T_r$): $9.5(T - T_r) < T/2 - \tau$ gives $T < (9.5T_r - \tau)/9 = 9.0421\ \mu$s, so $f > 7.6308$ MHz.
> 3. Fast transmitter ($T < T_r$): $9.5(T_r - T) < T/2 - \tau$ gives $T > (9.5T_r + \tau)/10 = 8.3550\ \mu$s, so $f < 8.2585$ MHz.
> 4. Relative to 8 MHz: $-4.61\%$ to $+3.23\%$. The nominal point is already $+0.64\%$ fast (69 is a rounded count), which eats into the upper side.
> Answer: 7.631 MHz to 8.258 MHz; $q \approx 3.2\%$.
