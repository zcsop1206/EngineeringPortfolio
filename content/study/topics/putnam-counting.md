---
study: topic
id: putnam-counting
title: "Counting and probability: first moves"
area: comb
needs: [comb-binomial, comb-recurrences-gf, pr-expectation, comb-invariants]
build: 1
tracks: [putnam]
---

> Written by a model for Adit. Not Adit's words.

How many, whether a configuration exists, the largest one possible, or the chance of one. People, teams and committees are graphs and incidence structures in plain clothes. A maximum always needs two arguments: a bound and a construction that meets it. Every result below is proved in a basic and only named here.
^intro

## Recognise

- A set that can be grouped two natural ways (by rows and by columns, by objects and by properties): [double counting](../basics/comb-binomial.md#^double-count). ^cue-two-ways
- "At least one", "none of", or a forbidden list of conditions: [inclusion–exclusion](../basics/comb-binomial.md#^incl-excl). ^cue-none-of
- Identical objects into distinct boxes, or solutions of $x_1 + \dots + x_k = n$: [stars and bars](../basics/comb-binomial.md#^stars-bars). ^cue-boxes
- A binomial sum with a pattern: [Pascal](../basics/comb-binomial.md#^pascal), [Vandermonde](../basics/comb-binomial.md#^vandermonde), [the hockey stick](../basics/comb-binomial.md#^hockey-stick); every $k$-th term, [the roots-of-unity filter](../basics/alg-polynomials.md#^rou-filter). ^cue-binomial-sum
- A binomial coefficient modulo a prime: [Lucas](../basics/comb-binomial.md#^lucas). ^cue-lucas
- A count for $n$ that splits by the first or last element: a linear recurrence, solved by [its characteristic polynomial](../basics/comb-recurrences-gf.md#^char-poly) or [turned into a generating function](../basics/comb-recurrences-gf.md#^gf-from-recurrence). ^cue-recurrence
- A count that is a sum of products of two smaller counts: [convolution](../basics/comb-recurrences-gf.md#^convolution) of generating functions. ^cue-convolution
- A pair of coupled recurrences, or a walk on a few states: [a power of a matrix](../basics/comb-recurrences-gf.md#^matrix-power). ^cue-states
- An expected number of anything: [a sum of indicators](../basics/pr-expectation.md#^indicators), with [linearity](../basics/pr-expectation.md#^lin-exp) and no independence needed. ^cue-expected-count
- A probability or expectation after a random first step: [the law of total expectation](../basics/pr-expectation.md#^total-exp) and [conditioning](../basics/pr-expectation.md#^cond-exp). ^cue-first-step
- "Show one exists" with no construction in sight: [the probabilistic method](../basics/pr-expectation.md#^prob-method). ^cue-existence
- A random arrangement where positions or labels are interchangeable: [symmetry](../basics/pr-expectation.md#^symmetry). ^cue-symmetric-random
- Moves, steps or operations, and a question about where they can lead or whether they stop: [invariants](../basics/comb-invariants.md#^invariant), [monovariants](../basics/comb-invariants.md#^monovariant), [termination](../basics/comb-invariants.md#^termination). ^cue-moves
- A board to tile: [colourings](../basics/comb-invariants.md#^colouring). ^cue-tiling
- A count asked only to be odd or even: [parity](../basics/comb-invariants.md#^parity) and the pairing lemma below. ^cue-parity
- The largest or smallest size of a configuration: [the extremal principle](../basics/found-induction.md#^extremal) and [pigeonhole](../basics/found-induction.md#^pigeonhole). ^cue-extremal

## First moves

1. List every object for $n = 2$ and $n = 3$ and count by hand. ^m-list
2. Colour the board. ^m-colour
3. Count one set two ways and compare. ^m-two-ways
4. Translate people and relations into a graph and ask about degrees. ^m-graph
5. Build a bijection to something already counted (binary strings, lattice paths, subsets) and write its inverse. ^m-bijection
6. For a maximum, guess the extremal configuration from the small cases, prove the bound, and present the construction separately. ^m-max
7. For a parity claim, look for a pairing of the objects that leaves few unpaired. ^m-pairing
8. For an expected count, write the count as a sum of indicators. ^m-indicators
9. For a count depending on $n$, condition on the first element and write the recurrence. ^m-recurrence

If $\sigma : X \to X$ on a finite set satisfies $\sigma(\sigma(x)) = x$ for every $x$, then $|X|$ and the number of fixed points of $\sigma$ have the same parity; proved in [comb-binomial](../basics/comb-binomial.md) (involutions).
^pairing-lemma

## Traps

> [!trap] Ordered pairs counted for unordered ones
> Three people each shake hands once with each other: 3 handshakes, not $3 \times 2 = 6$.
^trap-ordered

> [!trap] Inclusion–exclusion with a term missing
> $A = B = \{1\}$: $|A| + |B| = 2$, but $|A \cup B| = 1$. Write the two-set case to fix the signs before the general one.
^trap-incl-excl

> [!trap] A colouring that balances proves nothing about tiling
> The two end cells of a row of four are one black and one white, and no domino covers them. A colouring proves impossibility only; a possible case needs an explicit tiling.
^trap-colouring

> [!trap] Positive parts counted as non-negative ones
> $x_1 + x_2 = 2$ has 3 solutions in non-negative integers and 1 in positive integers.
^trap-stars-bars

> [!trap] Expectation of a product taken as a product
> $X = Y$ a fair $0/1$ coin: $E[XY] = \tfrac12$, while $E[X]E[Y] = \tfrac14$. Linearity needs no independence; products do.
^trap-product

> [!trap] A pattern read from small cases
> Chords joining $n$ points on a circle in general position cut the disc into $1, 2, 4, 8, 16$ regions for $n = 1$ to $5$, and into $31$ for $n = 6$.
^trap-pattern

## Where it hides

- putnam-2020-a1 and putnam-2022-a3 ([bank](../bank/putnam.md))
- putnam-2021-b1 and putnam-2024-a3
- putnam-2018-a2 and putnam-2022-b2
- putnam-2025-b1
- putnam-2020-a5 and putnam-2024-b5
^hides

## Try

> [!problem] zhao-ps10-1
^zhao-ps10-1

> [!problem] putnam-2018-b1
^putnam-2018-b1

> [!problem] putnam-2019-b1
^putnam-2019-b1

> [!problem] putnam-2023-b1
^putnam-2023-b1

> [!problem] Peaks in a shuffled row (d 3)
> The numbers $1, 2, \dots, n$ with $n \ge 3$ are placed in a row in a uniformly random order. Position $i$ with $2 \le i \le n - 1$ is a peak if its number is larger than both of its neighbours. Find the expected number of peaks.
^inv-comb-shuffled-peaks

> [!solution]- Solution
> methods: indicators, linearity-of-expectation, pr-expectation/symmetry
> 1. Let $I_i$ be $1$ if position $i$ is a peak and $0$ otherwise; the number of peaks is $\sum_{i=2}^{n-1} I_i$.
> 2. The three numbers at positions $i - 1$, $i$, $i + 1$ are equally likely to be in any relative order, so the middle one is the largest with probability $\tfrac13$.
> 3. By linearity, the expectation is $(n - 2)/3$.
> Answer: $(n-2)/3$ (checked by listing all orders for $n = 3$ to $7$).

> [!problem] Subsets of a dozen by their sums (d 3.5)
> Find the number of subsets of $\{1, 2, \dots, 12\}$, the empty set included, whose elements sum to a multiple of $3$.
^inv-comb-subset-sums

> [!solution]- Solution
> methods: generating-function, roots-of-unity-filter
> 1. The sums are recorded by $P(x) = \prod_{k=1}^{12} (1 + x^k)$: the coefficient of $x^s$ counts subsets with sum $s$.
> 2. With $\omega = e^{2\pi i/3}$, the count is $\tfrac13 \bigl(P(1) + P(\omega) + P(\omega^2)\bigr)$.
> 3. $P(1) = 2^{12} = 4096$.
> 4. The exponents $1$ to $12$ run through the residues $1, 2, 0$ four times; each block gives $(1 + \omega)(1 + \omega^2)(1 + 1) = (1 + \omega + \omega^2 + \omega^3) \cdot 2 = 2$, so $P(\omega) = 2^4 = 16$, and likewise $P(\omega^2) = 16$.
> 5. Count $= (4096 + 32)/3 = 1376$.
> Answer: 1376 (checked by listing all $2^{12}$ subsets).
