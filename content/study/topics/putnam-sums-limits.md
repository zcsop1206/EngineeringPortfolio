---
study: topic
id: putnam-sums-limits
title: "Sums, integrals and limits: first moves"
area: an
needs: [an-limits-series, an-integration, ineq-convexity]
build: 1
tracks: [putnam]
---

> Written by a model for Adit. Not Adit's words.

Evaluate a sum or an integral, bound it, or find a limit. The tools are a handful of standard theorems, each proved in a basic and only named here; the skill is seeing which one the expression is already shaped for.
^intro

## Recognise

- A sum whose terms are differences, or rational terms that split into partial fractions: [telescoping](../basics/an-limits-series.md#^telescoping). ^cue-differences
- $n$ terms, a factor $1/n$ (perhaps hidden as $n/n^2$), each term a function of $k/n$ alone: [a Riemann sum](../basics/an-integration.md#^riemann). ^cue-riemann
- A product of many factors, or something to the power of something: take a logarithm, and the sum that results is often [a Riemann sum](../basics/an-integration.md#^riemann). ^cue-product
- The growth rate of a monotone sum such as $\sum k^{-1/2}$: [compare with an integral](../basics/an-integration.md#^sum-integral). ^cue-growth
- A limit of a difference of nearly equal quantities, or of $(1 + u)^w$ with $u \to 0$ and $w \to \infty$: [Taylor](../basics/an-mvt-taylor.md#^taylor) to the first term that does not cancel, or [l'Hôpital](../basics/an-mvt-taylor.md#^lhopital). ^cue-cancellation
- A sequence given by a recurrence: [bounded monotone sequences converge](../basics/an-limits-series.md#^monotone). ^cue-recurrence
- A double sum or a double integral: the swap rule below. ^cue-double
- An integral over $[a, b]$ where $f(x)$ and $f(a + b - x)$ combine well: [reflection](../basics/an-integration.md#^reflection). ^cue-reflection
- $\sum a_k b_k$ with the partial sums of $a_k$ controlled and $b_k$ monotone, alternating sums included: [summation by parts](../basics/an-limits-series.md#^abel). ^cue-abel
- A limit of $x_n / y_n$ with $y_n$ increasing to infinity: [Stolz–Cesàro](../basics/an-limits-series.md#^stolz). ^cue-ratio
- Does a series converge: [comparison](../basics/an-limits-series.md#^comparison), then [ratio and root](../basics/an-limits-series.md#^ratio-root). ^cue-convergence
- A parameter inside an integral: [differentiate under the integral sign](../basics/an-integration.md#^diff-under). ^cue-parameter
- An integral of a product with a boundary term in view: [integration by parts](../basics/an-integration.md#^ibp); with an infinite range or an endpoint singularity, [improper integrals](../basics/an-integration.md#^improper). ^cue-parts
- A two-sided bound on a sum or an integral: [tangent lines of a convex function](../basics/ineq-convexity.md#^tangent-line), [Jensen](../basics/ineq-convexity.md#^jensen), [AM–GM](../basics/ineq-convexity.md#^am-gm) for products, [Cauchy–Schwarz](../basics/ineq-convexity.md#^cauchy-schwarz) for an integral of a product. ^cue-bound

## First moves

1. Write the first three terms out in full. ^m-write-out
2. Look for $f(k+1) - f(k)$; try partial fractions on a rational term. ^m-difference
3. Put $1/n$ in front and ask whether what remains is a function of $k/n$. ^m-one-over-n
4. Take the logarithm of a product or a power. ^m-log
5. For growth, compare with an integral; for a limit, squeeze between two such comparisons. ^m-compare
6. For a recurrence, find the fixed point, prove monotone and bounded, and only then pass to the limit in the recurrence. ^m-fixed-point
7. For a double sum, draw the region of summation, check signs or absolute convergence, and swap. ^m-swap
8. For an integral with a parameter, substitute to make the interval fixed, then look for one function bounding all the integrands. ^m-dominate
9. Expand one order further than the question seems to want; the number of terms needed shows only after the cancellation. ^m-expand

A double sum may be swapped when its terms are non-negative, or when the sum of absolute values is finite; the same holds for integrals and for a sum of integrals, with "integrable" in place of "summable". Proved for series in [an-limits-series](../basics/an-limits-series.md) (double series).
^swap-lemma

## Traps

> [!trap] Swapping a double sum that is only conditionally convergent
> $a_{jj} = 1$, $a_{j,j+1} = -1$, all other entries $0$. Every row sums to $0$, so rows first give $0$; the first column sums to $1$ and every other column to $0$, so columns first give $1$. $\sum |a_{jk}| = \infty$.
^trap-swap

> [!trap] Solving for a limit that does not exist
> $x_{n+1} = 2x_n$ with $x_0 = 1$ has the fixed point $0$, and $x_n = 2^n \to \infty$. Convergence comes first.
^trap-fixed-point

> [!trap] Too few Taylor terms
> $\lim_{x \to 0} (\sin x - x)/x^3$: keeping only $\sin x \approx x$ suggests $0$; the next term gives $-1/6$.
^trap-few-terms

> [!trap] Integral comparison without monotonicity
> $f(x) = \sin^2(\pi x)$: $\sum_{k=1}^{n} f(k) = 0$ while $\int_0^n f = n/2$.
^trap-not-monotone

> [!trap] A limit moved inside an integral with no reason
> $f_n = n$ on $(0, 1/n)$ and $0$ elsewhere on $[0, 1]$: each $\int_0^1 f_n = 1$, while $f_n \to 0$ at every point. Name the reason (monotone increase, or one integrable function bounding all $f_n$) before swapping.
^trap-limit-integral

> [!trap] An inconclusive ratio test read as a verdict
> $\sum 1/k$ diverges and $\sum 1/k^2$ converges; both have ratio tending to $1$.
^trap-ratio

## Where it hides

- putnam-2017-a3, putnam-2023-a3 and putnam-2025-b2 ([bank](../bank/putnam.md))
- putnam-2020-a4 and putnam-2022-a4
- putnam-2020-a3
- putnam-2016-a3
- putnam-2019-a4 and putnam-2021-a4
^hides

## Try

> [!problem] zhao-limits-15
^zhao-limits-15

> [!problem] putnam-2016-b1
^putnam-2016-b1

> [!problem] putnam-2022-a1
^putnam-2022-a1

> [!problem] A block of harmonic terms (d 3.5)
> Let $S_n = \dfrac{1}{n+1} + \dfrac{1}{n+2} + \dots + \dfrac{1}{2n}$. Find $\displaystyle\lim_{n \to \infty} n\,(S_n - \ln 2)$.
^inv-an-harmonic-block

> [!solution]- Solution
> methods: riemann-sum, taylor
> 1. $S_n = h \sum_{k=1}^{n} f(kh)$ with $h = 1/n$ and $f(x) = 1/(1+x)$, a right-endpoint sum for $\int_0^1 f = \ln 2$.
> 2. On $[x_k - h, x_k]$ with $x_k = kh$, Taylor about $x_k$ gives $\int_{x_k - h}^{x_k} f = h f(x_k) - \tfrac{h^2}{2} f'(x_k) + O(h^3)$.
> 3. Summing over $k$: $S_n - \ln 2 = \tfrac{h}{2} \cdot h \sum_k f'(x_k) + O(h^2)$.
> 4. $h \sum_k f'(x_k) \to \int_0^1 f' = f(1) - f(0) = -\tfrac12$.
> 5. So $n(S_n - \ln 2) \to \tfrac12 \cdot (-\tfrac12) = -\tfrac14$.
> Answer: $-1/4$ (checked numerically: $-0.2499375$ at $n = 1000$).

> [!problem] putnam-2019-b2
^putnam-2019-b2

> [!problem] putnam-2021-a2
^putnam-2021-a2
