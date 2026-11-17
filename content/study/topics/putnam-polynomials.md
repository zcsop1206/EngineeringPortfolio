---
study: topic
id: putnam-polynomials
title: "Polynomials: first moves"
area: nt
needs: [alg-polynomials, nt-divisibility, an-mvt-taylor]
build: 1
tracks: [putnam]
---

> Written by a model for Adit. Not Adit's words.

A polynomial has three descriptions: its coefficients, its roots, and its values at enough points. Most problems give one and hide another. Every result below is proved in a basic and only named here, except one bridge lemma no basic holds.
^intro

## Recognise

- A polynomial given by a property of its roots, or a symmetric expression in several numbers: name them as roots and translate with [Vieta](../basics/alg-polynomials.md#^vieta). ^cue-symmetric
- Values prescribed at several points, or "find $p(n+1)$": [interpolation](../basics/alg-polynomials.md#^interpolation), and for equally spaced points [finite differences](../basics/alg-polynomials.md#^finite-differences). ^cue-values
- "$p(k)$ is an integer for every integer $k$": [finite differences](../basics/alg-polynomials.md#^finite-differences) in the binomial basis. ^cue-integer-valued
- Integer coefficients and integer inputs: $a - b \mid p(a) - p(b)$ (below), [rational roots](../basics/alg-polynomials.md#^rational-root), and [Gauss's lemma](../basics/alg-polynomials.md#^gauss-lemma) for factoring over the integers. ^cue-integer-coefficients
- "$p(r) = 0$" or "$q$ divides $p$": [the factor theorem](../basics/alg-polynomials.md#^factor-thm) and [division with remainder](../basics/alg-polynomials.md#^poly-div). ^cue-divides
- An identity claimed for all $x$, or at infinitely many points: [a nonzero polynomial over a field has at most its degree in roots](../basics/alg-polynomials.md#^field-roots). ^cue-identity
- How many real roots, or a statement that mentions $p'$: [Rolle](../basics/an-mvt-taylor.md#^rolle) and the root count below. ^cue-real-roots
- Every $k$-th coefficient summed, or $p$ evaluated around a circle: [roots of unity](../basics/alg-polynomials.md#^roots-unity) and [the filter](../basics/alg-polynomials.md#^rou-filter). ^cue-every-kth
- Coefficients read modulo a prime: still a polynomial over a field, so [root counting](../basics/alg-polynomials.md#^field-roots) applies, with [congruence arithmetic](../basics/nt-divisibility.md#^cong-arith) on the coefficients. ^cue-mod-p
- A product $\prod (x - r_i)$ evaluated at a special point, such as $\pm 1$ or $i$: the polynomial written by its roots, through [the factor theorem](../basics/alg-polynomials.md#^factor-thm). ^cue-product-over-roots

## First moves

1. Write $p$ by its roots with the leading coefficient in front: $p(x) = a_n \prod (x - r_i)$. ^m-by-roots
2. Evaluate at $0$, $1$, $-1$; if anything is cyclic, at roots of unity. ^m-evaluate
3. Compare degrees and leading coefficients on both sides of any identity before believing it. ^m-degrees
4. Subtract the obvious candidate and count the roots of the difference. ^m-difference
5. For $p(x) = p(c - x)$, shift to the symmetric point $x = c/2 + y$. ^m-shift
6. Reduce the coefficients modulo 2 or modulo a small prime. ^m-reduce
7. Differentiate, then make a sign table at the roots of $p'$. ^m-derivative
8. For values at consecutive integers, write the difference table for the smallest case. ^m-table
9. For a power sum of roots, reduce $r^k$ using $p(r) = 0$. ^m-power-sum

If $p$ has integer coefficients and $a \ne b$ are integers, then $a - b$ divides $p(a) - p(b)$: the second half of [the factor theorem](../basics/alg-polynomials.md#^factor-thm).
^integer-differences

> [!thm] Bridge lemma (real-root count)
> If a real polynomial $p$ has $m$ real roots counted with multiplicity, then $p'$ has at least $m - 1$. Equivalently, $p$ has at most one more real root than $p'$.
^real-root-count

> [!proof]- Proof (d 2.5)
> 1. Let the distinct real roots be $x_1 < \dots < x_s$ with multiplicities $m_1, \dots, m_s$, summing to $m$.
> 2. Writing $p = (x - x_i)^{m_i} q$ with $q(x_i) \ne 0$ and differentiating shows $x_i$ is a root of $p'$ of multiplicity exactly $m_i - 1$.
> 3. By [Rolle](../basics/an-mvt-taylor.md#^rolle), each open gap $(x_i, x_{i+1})$ holds a root of $p'$; these $s - 1$ roots differ from every $x_i$.
> 4. Total: at least $\sum_i (m_i - 1) + (s - 1) = m - 1$.
^p-real-root-count

## Traps

> [!trap] Vieta does not make roots real
> $x^2 + 1$ has root sum $0$ and root product $1$, and no real roots at all. Vieta works over the complex numbers; "the roots are real" is a hypothesis to use, never a default.
^trap-vieta-real

> [!trap] Agreement at too few points
> $x(x-1)(x-2)$ is zero at $0$, $1$, $2$ and is not the zero polynomial. Degree $n$ needs $n + 1$ points.
^trap-few-points

> [!trap] The leading coefficient dropped
> $2x^2 - 2$ has roots $\pm 1$ but is not $(x-1)(x+1)$.
^trap-leading

> [!trap] Rolle as a lower bound
> $p = x^2 + 1$ has $p' = 2x$ with a real root, and $p$ has none. Rolle bounds real roots from above; a lower bound needs sign changes.
^trap-rolle-lower

> [!trap] Integer values without integer coefficients
> $x(x-1)/2$ is an integer at every integer and has coefficients $\pm\tfrac12$.
^trap-integer-valued

> [!trap] Root counting modulo a composite
> $x^2 - 1$ has four roots modulo 8: $1, 3, 5, 7$. The degree bound needs a field, so a prime modulus.
^trap-composite-modulus

## Where it hides

- putnam-2017-a2 and putnam-2019-b5 ([bank](../bank/putnam.md))
- putnam-2018-b2, putnam-2019-a3 and putnam-2016-a6
- putnam-2022-a6
- putnam-2024-a2
^hides

## Try

> [!problem] A product over the roots of a cubic (d 2.5)
> Let $r$, $s$, $t$ be the three roots of $x^3 - 3x + 1$. Compute $(r^2 + 1)(s^2 + 1)(t^2 + 1)$.
^inv-nt-cubic-product

> [!solution]- Solution
> methods: factor-theorem, vieta
> 1. $p(x) = x^3 - 3x + 1 = (x - r)(x - s)(x - t)$ is monic.
> 2. $r^2 + 1 = (r - i)(r + i)$, so the product is $\prod (r - i) \cdot \prod (r + i)$.
> 3. $\prod (r - i) = (-1)^3 \prod (i - r) = -p(i)$, and likewise $\prod (r + i) = -p(-i)$.
> 4. $p(i) = -i - 3i + 1 = 1 - 4i$ and $p(-i) = 1 + 4i$.
> 5. Product $= p(i)\,p(-i) = 1 + 16 = 17$.
> Answer: 17 (checked numerically from the three real roots).

> [!problem] putnam-2019-a1
^putnam-2019-a1

> [!problem] putnam-2016-a1
^putnam-2016-a1

> [!problem] putnam-2022-b1
^putnam-2022-b1

> [!problem] putnam-2023-a2
^putnam-2023-a2

> [!problem] zhao-roots-6
^zhao-roots-6
