---
study: topic
id: putnam-number-theory
title: "Number theory: first moves"
area: nt
needs: [nt-divisibility, nt-congruence, nt-padic, alg-groups]
build: 1
tracks: [putnam]
---

> Written by a model for Adit. Not Adit's words.

The largest tag in the approachable slots of past papers. The tools are few; most of the work is choosing what to divide by. Every result below is proved in a basic and only named here.
^intro

## Recognise

- An equation to be solved in integers, or a claim false over the reals and true over the integers: only remainders matter, and [arithmetic respects congruence](../basics/nt-divisibility.md#^cong-arith). ^cue-integer-equation
- A variable in the exponent ($a^n$ for all $n$, or $n \mid a^n - b$): the [order of the base](../basics/alg-groups.md#^order-divides), which divides $p - 1$ by [Fermat](../basics/alg-groups.md#^fermat) and $\varphi(n)$ by [Euler](../basics/alg-groups.md#^euler). ^cue-exponent
- A factorial or a binomial coefficient asked about divisibility: [Legendre's formula](../basics/nt-padic.md#^legendre) and [Kummer's carries](../basics/nt-padic.md#^kummer). ^cue-factorial
- The exact power of a prime in a difference of powers $a^n - b^n$: [lifting the exponent](../basics/nt-padic.md#^lte-odd), with [its own form at $p = 2$](../basics/nt-padic.md#^lte-two). ^cue-difference-powers
- Exponents of primes compared across a product or a quotient: [valuations](../basics/nt-padic.md#^vp-rules). ^cue-valuation
- A composite modulus, or a count of residues modulo $mn$: [the Chinese remainder theorem](../basics/nt-congruence.md#^crt), and [units split the same way](../basics/nt-congruence.md#^crt-units). ^cue-composite-modulus
- $\varphi(n)$, or a count of integers coprime to $n$: [the product formula](../basics/nt-congruence.md#^phi-formula). ^cue-phi
- $(p-1)!$, or a product of all nonzero residues modulo a prime: [Wilson](../basics/nt-congruence.md#^wilson). ^cue-wilson
- A sum or product over all units modulo $n$, or residues of $k$-th powers: [the units modulo a prime are cyclic](../basics/alg-groups.md#^cyclic-units). ^cue-unit-sums
- The gcd of two terms of a sequence, or "consecutive terms are coprime": [the Euclidean algorithm](../basics/nt-divisibility.md#^euclid) run on the terms. ^cue-gcd
- A linear condition $ax \equiv b$, or "which multiples of $a$ reach $b$": [Bezout](../basics/nt-divisibility.md#^bezout) and [linear congruences](../basics/nt-congruence.md#^lin-cong). ^cue-linear
- A root modulo $p$ to be pushed to modulo $p^k$: [Hensel](../basics/nt-padic.md#^hensel). ^cue-lift
- Digits in base $b$: $b \equiv 1 \pmod{b-1}$ under [congruence arithmetic](../basics/nt-divisibility.md#^cong-arith), and digit sums inside [Legendre](../basics/nt-padic.md#^legendre). ^cue-digits

## First moves

1. Small cases by hand, more than feels necessary, $n = 1$ to $6$ at least. A solution at $n = 2$ that does not persist is often the whole answer. ^m-small
2. Reduce modulo 2, 3, 4, then 8, 9, 5, 7. Choose the modulus that makes the varying term vanish and leaves the constant in a forbidden class; keep the first one that kills the remaining cases, then check every case below its threshold by hand. ^m-reduce
3. Factor what factors: differences of powers, $x^2 + x + 1$ and its relatives, and after clearing denominators the form $(x - a)(y - b) = ab$. ^m-factor
4. For an exponent, compute the order of the base modulo each small prime in sight. ^m-order
5. For "find all $n$", separate $n$ prime from $n$ composite; for composite $n$ take its least prime factor (the lemma below). ^m-least-prime
6. Split a composite modulus into prime powers and work one prime at a time. ^m-split
7. For an exact power of a prime, write $v_p$ of everything and use the rules; for factorials, Legendre. ^m-valuation
8. Once divisibility gives one inequality, size usually gives the other: a positive multiple of $m$ is at least $m$. ^m-bound

> [!thm] Lemma (least prime factor)
> Let $n > 1$ and let $p$ be the least prime factor of $n$. Then $\gcd(n, p - 1) = 1$. Consequently, if $p \nmid a$ and $a^n \equiv 1 \pmod p$, then $a \equiv 1 \pmod p$. A drill in [alg-groups](../basics/alg-groups.md), which proves it.
^least-prime-lemma

## Traps

> [!trap] Cancelling a factor that is not a unit
> $2 \cdot 3 \equiv 2 \cdot 0 \pmod 6$, yet $3 \not\equiv 0$. Cancel only [units](../basics/nt-divisibility.md#^cong-cancel).
^trap-cancel

> [!trap] Euler's theorem without coprimality
> $2^{\varphi(4)} = 2^2 = 4 \equiv 0 \pmod 4$, not $1$. [Euler](../basics/alg-groups.md#^euler) needs $\gcd(a, n) = 1$.
^trap-euler-gcd

> [!trap] The odd-prime form of lifting the exponent used at 2
> $v_2(3^2 - 1^2) = v_2(8) = 3$, while $v_2(3 - 1) + v_2(2) = 2$. At $p = 2$ use [the other form](../basics/nt-padic.md#^lte-two). The same slip: an argument "for every odd prime" with $p = 2$ never checked.
^trap-lte-two

> [!trap] Taking an exponent that gives 1 for the order
> $2^6 \equiv 1 \pmod 7$, but $\operatorname{ord}_7(2) = 3$. An exponent with $a^m \equiv 1$ is a multiple of the order, not the order.
^trap-order

> [!trap] A modulus where solutions exist proves nothing
> $x^2 \equiv 2 \pmod 7$ has the solution $x = 3$, yet $x^2 = 2$ has no integer solution. A modulus can only rule cases out.
^trap-modulus-silent

> [!trap] Lifting a root where the derivative vanishes
> $x^2 + 1 \equiv 0 \pmod 2$ has the root $x = 1$, with derivative $2 \equiv 0$; modulo 4 there is no root at all, since squares are $0$ or $1$. [Hensel](../basics/nt-padic.md#^hensel) needs $f'(a) \not\equiv 0$.
^trap-hensel

> [!trap] The converse of Fermat
> $2^{340} \equiv 1 \pmod{341}$, and $341 = 11 \cdot 31$. $a^{n-1} \equiv 1 \pmod n$ does not make $n$ prime.
^trap-fermat-converse

## Where it hides

- putnam-2020-b1 ([bank](../bank/putnam.md))
- putnam-2023-a6
- putnam-2016-a1 and putnam-2022-b1
- putnam-2021-b4 and putnam-2025-a6
- putnam-2021-a1
- putnam-2021-b5, putnam-2023-a4 and putnam-2023-b6
- putnam-2021-a3 and putnam-2018-a6
^hides

## Try

> [!problem] Sums of powers of two and three (d 2.5)
> Find the number of integers $n$ with $1 \le n \le 2026$ such that $35$ divides $2^n + 3^n$.
^inv-nt-powers-two-three

> [!solution]- Solution
> methods: crt, order
> 1. Split $35 = 5 \cdot 7$ and require each prime separately.
> 2. Modulo 5, $3^{-1} \equiv 2$, so the condition is $(2 \cdot 2)^n = 4^n \equiv -1 \equiv 4$; since $\operatorname{ord}_5(4) = 2$, this holds exactly for odd $n$.
> 3. Modulo 7, $3^{-1} \equiv 5$, so the condition is $(2 \cdot 5)^n \equiv 3^n \equiv -1$; $\operatorname{ord}_7(3) = 6$ and $3^3 \equiv -1$, so it holds exactly for $n \equiv 3 \pmod 6$.
> 4. $n \equiv 3 \pmod 6$ is already odd, so the condition is $n \equiv 3 \pmod 6$.
> 5. Those $n$ are $3, 9, \dots, 2025$: $(2025 - 3)/6 + 1 = 338$.
> Answer: 338 (checked by direct computation).

> [!problem] putnam-2018-a1
^putnam-2018-a1

> [!problem] putnam-2020-a1
^putnam-2020-a1

> [!problem] putnam-2024-a1
^putnam-2024-a1

> [!problem] putnam-2017-b2
^putnam-2017-b2

> [!problem] zhao-ps9-14
^zhao-ps9-14
