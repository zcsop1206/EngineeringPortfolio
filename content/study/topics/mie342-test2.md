---
study: topic
id: mie342-test2
title: "MIE342 test 2: circuits drills"
area: el
needs: []
build: 1
tracks: [exams]
---

> Written by a model for Adit. Not Adit's words.

Test 2 on 2026-11-18, 11:20 to 12:30: node voltage and mesh current, Thevenin, capacitors and inductors, RC and RL circuits (problem sets 4 to 7, no op amps). The drills follow the problem sets' patterns: dependent sources everywhere, power-balance checks, equivalent capacitance with initial voltages, and switching circuits whose dependent source changes the resistance the capacitor or inductor sees.
^intro

## Moves

1. Node or mesh: count the equations each needs and take fewer. Current sources favour nodes; a voltage source between two nodes is a supernode, a current source shared by two meshes is a supermesh, and either adds the source's own equation. ^m-node-mesh
2. A dependent source: write its controlling variable in your unknowns at once. Never turn it off for $R_{th}$ or $\tau$: use $V_{oc}/I_{sc}$ or a test source. ^m-dependent
3. Switching: the 0⁻ circuit (C open, L short), carry $v_C$ or $i_L$ across, $R_{eq}$ seen by the C or L for $t > 0$, then $x(t) = x(\infty) + [x(0^+) - x(\infty)]e^{-t/\tau}$ with $\tau = R_{eq}C$ or $L/R_{eq}$. ^m-switching
4. Energy: $\tfrac12 Cv^2$, $\tfrac12 Li^2$; the fraction still stored at $t$ in a decay is $e^{-2t/\tau}$. ^m-energy
5. Check with a power balance whenever the question allows. ^m-power-check

## Drills

> [!problem] Mesh current with a dependent source (d 2)
> Mesh 1: a 20 V source, a 4 Ω resistor, and a 6 Ω resistor shared with mesh 2. Mesh 2: the shared 6 Ω, a 2 Ω resistor, and a dependent voltage source $3i_1$. Both mesh currents run clockwise, and going clockwise in mesh 2 you meet the dependent source's + terminal first. Find $i_1$, $i_2$ and the power the dependent source absorbs.
^d-mesh

> [!solution]- Solution
> methods: mie342-test2/m-node-mesh, mie342-test2/m-dependent
> 1. $10i_1 - 6i_2 = 20$ and $-3i_1 + 8i_2 = 0$.
> 2. $i_1 = 80/31 \approx 2.58$ A, $i_2 = 30/31 \approx 0.968$ A.
> Answer: the dependent source absorbs $3i_1 i_2 \approx 7.49$ W.

> [!problem] Thevenin with a dependent source (d 2)
> A 10 V source feeds a 2 Ω series resistor into terminal a. Between a and b: a 4 Ω resistor and a dependent current source $0.25\,v_{ab}$ flowing from a to b. Find $V_{th}$ and $R_{th}$ twice: from $V_{oc}$ and $I_{sc}$, and with a test source.
^d-thevenin

> [!solution]- Solution
> methods: mie342-test2/m-dependent
> 1. Open circuit: $(10 - v)/2 = v/4 + v/4$, so $V_{oc} = 5$ V. Short circuit: $I_{sc} = 5$ A.
> 2. $R_{th} = 1$ Ω. The dependent source acts as 4 Ω: $2 \parallel 4 \parallel 4 = 1$ Ω.
> Answer: 5 V and 1 Ω.

> [!problem] Series capacitors with initial voltages (d 2)
> A 6 µF capacitor at 10 V in series with a 3 µF capacitor at 4 V, polarised to add across a, b. Find $C_{eq}$, its initial voltage and its energy, then the energy in the two real capacitors. Why do they differ?
^d-caps

> [!solution]- Solution
> methods: mie342-test2/m-energy
> 1. $C_{eq} = 2$ µF at 14 V: 196 µJ.
> 2. The two capacitors hold $300 + 24 = 324$ µJ.
> Answer: 128 µJ stays trapped in the capacitors and never reaches the terminals.

> [!problem] RL decay with a dependent source (d 2.5)
> A 50 mH inductor carries 2 A at $t = 0^-$. For $t > 0$ it is in a loop with a 10 Ω resistor and a dependent voltage source $4i_L$ that drops voltage in the direction of $i_L$. Find $R_{eq}$, $\tau$, $i_L(t)$ and the initial energy. Then redo it with the dependent source flipped.
^d-rl

> [!solution]- Solution
> methods: mie342-test2/m-switching, mie342-test2/m-dependent
> 1. $R_{eq} = 14$ Ω, $\tau = 3.57$ ms, $i_L = 2e^{-280t}$ A; energy 0.1 J.
> 2. Flipped: $R_{eq} = 6$ Ω, $\tau = 8.33$ ms, $i_L = 2e^{-120t}$ A.
> Answer: as above.

> [!problem] RC switch (d 2)
> A 2 µF capacitor has charged for a long time from 15 V through 5 kΩ. At $t = 0$ it switches to a 3 kΩ resistor in parallel with a 6 kΩ resistor. Find $v_C(t)$, the 6 kΩ current, and when $v_C$ reaches 5 V.
^d-rc

> [!solution]- Solution
> methods: mie342-test2/m-switching
> 1. $R = 2$ kΩ, $\tau = 4$ ms, $v_C = 15e^{-250t}$ V.
> 2. The 6 kΩ current is $2.5e^{-250t}$ mA.
> Answer: $v_C = 5$ V at $t = 4\ln 3 \approx 4.39$ ms.

> [!problem] Energy fraction (d 2.5)
> An inductor discharges through a resistor with $\tau = 2$ ms. When has 75% of its initial energy been dissipated, and what fraction of the initial current is left then?
^d-energy

> [!solution]- Solution
> methods: mie342-test2/m-energy
> 1. Energy left $e^{-2t/\tau} = 0.25$, so $t = (\tau/2)\ln 4 = \tau \ln 2 = 1.39$ ms.
> Answer: 1.39 ms, with half the current left.
