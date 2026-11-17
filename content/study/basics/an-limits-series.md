---
study: basic
id: an-limits-series
title: Limits, series and summation by parts
area: an
needs: []
build: 1
tracks: [putnam]
---

> Written by a model for Adit. Not Adit's words.

Needs: nothing beyond the arithmetic and order of the real numbers, plus the least upper bound property stated below.
^needs

## Limits of sequences

> [!def] Least upper bound property
> A set $S$ of reals is **bounded above** if some $M$ has $s \le M$ for all $s \in S$. Every nonempty set of reals that is bounded above has a least upper bound, its **supremum** $\sup S$: an upper bound such that, for every $\varepsilon > 0$, some $s \in S$ has $s > \sup S - \varepsilon$. The **infimum** $\inf S$ of a set bounded below is defined the same way from the other side. This property is what separates $\mathbb{R}$ from $\mathbb{Q}$; every existence statement in this doc comes from it.
^lub

> [!def] Limit of a sequence
> A sequence $(a_n)$ **converges** to $L$, written $a_n \to L$, if for every $\varepsilon > 0$ there is an $N$ with $|a_n - L| < \varepsilon$ for all $n \ge N$. It **tends to** $+\infty$ if for every $M$ there is an $N$ with $a_n > M$ for all $n \ge N$. A sequence that converges to no real number **diverges**. A **subsequence** is $(a_{n_k})$ with $n_1 < n_2 < \cdots$.
^eps-n

> [!thm] Theorem 1 (limit laws and squeeze)
> Let $a_n \to a$ and $b_n \to b$. Then the limit is unique; a convergent sequence is bounded; $a_n + b_n \to a + b$; $a_n b_n \to ab$; $a_n / b_n \to a/b$ when $b \ne 0$; $a_n \le b_n$ for all large $n$ implies $a \le b$; and if $a_n \le c_n \le b_n$ for all large $n$ and $a = b$, then $c_n \to a$.
^limit-laws

> [!proof]- Proof
> 1. Uniqueness: if $a_n \to a$ and $a_n \to a'$ with $a \ne a'$, take $\varepsilon = |a - a'|/2$; for large $n$ the term $a_n$ is within $\varepsilon$ of both, which is impossible.
> 2. Boundedness: with $\varepsilon = 1$, $|a_n| \le |a| + 1$ for $n \ge N$, and the finitely many earlier terms are bounded by their largest absolute value.
> 3. Sum: $|a_n + b_n - a - b| \le |a_n - a| + |b_n - b|$; make each term less than $\varepsilon/2$.
> 4. Product: $a_n b_n - ab = a_n(b_n - b) + b(a_n - a)$, and $|a_n| \le K$ by step 2.
> 5. Quotient: it is enough that $1/b_n \to 1/b$. For large $n$, $|b_n| \ge |b|/2$, so $|1/b_n - 1/b| = |b - b_n|/(|b_n||b|) \le 2|b_n - b|/|b|^2$.
> 6. Order: if $a > b$, take $\varepsilon = (a - b)/2$; for large $n$ this gives $a_n > b_n$.
> 7. Squeeze: for large $n$, $a - \varepsilon < a_n \le c_n \le b_n < a + \varepsilon$.
^p-limit-laws

> [!thm] Theorem 2 (monotone convergence)
> A nondecreasing sequence that is bounded above converges to the supremum of its terms. A nondecreasing sequence that is not bounded above tends to $+\infty$. The same holds for nonincreasing sequences with the infimum.
^monotone

> [!proof]- Proof (d 1.5)
> 1. Let $s = \sup_n a_n$. For $\varepsilon > 0$ some $a_N > s - \varepsilon$.
> 2. For $n \ge N$, monotonicity gives $s - \varepsilon < a_N \le a_n \le s$.
> 3. If the terms are unbounded, some $a_N > M$, and then $a_n \ge a_N > M$ for all $n \ge N$.
^p-monotone

> [!thm] Theorem 3 (Bolzano–Weierstrass)
> Every bounded sequence of reals has a convergent subsequence.
^bolzano

> [!proof]- Proof (d 3)
> 1. Call an index $m$ a **peak** if $a_m \ge a_n$ for every $n > m$.
> 2. If there are infinitely many peaks $m_1 < m_2 < \cdots$, then $a_{m_1} \ge a_{m_2} \ge \cdots$ is a nonincreasing subsequence.
> 3. If there are finitely many, let $n_1$ be past the last one. Since $n_1$ is not a peak, some $n_2 > n_1$ has $a_{n_2} > a_{n_1}$; $n_2$ is not a peak either, and so on: an increasing subsequence.
> 4. Either way the subsequence is monotone and bounded, so it converges by [Theorem 2](#^monotone).
^p-bolzano

> [!thm] Theorem 4 (Cauchy criterion)
> A sequence is **Cauchy** if for every $\varepsilon > 0$ there is an $N$ with $|a_m - a_n| < \varepsilon$ for all $m, n \ge N$. A sequence of reals converges if and only if it is Cauchy.
^cauchy-seq

> [!proof]- Proof (d 3)
> 1. Convergent implies Cauchy: $|a_m - a_n| \le |a_m - L| + |L - a_n|$, each less than $\varepsilon/2$ for large $m, n$.
> 2. A Cauchy sequence is bounded: with $\varepsilon = 1$, $|a_n| \le |a_N| + 1$ for $n \ge N$.
> 3. By [Theorem 3](#^bolzano) some subsequence $a_{n_k} \to L$.
> 4. Given $\varepsilon$, take $N$ from the Cauchy condition for $\varepsilon/2$, and $k$ with $n_k \ge N$ and $|a_{n_k} - L| < \varepsilon/2$.
> 5. For $n \ge N$: $|a_n - L| \le |a_n - a_{n_k}| + |a_{n_k} - L| < \varepsilon$.
^p-cauchy-seq

The criterion proves convergence without naming the limit, which is how most existence statements about series below are made.
^cauchy-use

> [!def] Upper and lower limits
> For a bounded sequence, $\sup_{k \ge n} a_k$ is nonincreasing in $n$, so it converges ([Theorem 2](#^monotone)); its limit is $\limsup a_n$. Likewise $\liminf a_n = \lim_n \inf_{k \ge n} a_k$. Directly from the definitions: if $\limsup a_n < q$ then $a_n < q$ for all large $n$; if $\limsup a_n > q$ then $a_n > q$ for infinitely many $n$; and $a_n \to L$ exactly when $\liminf a_n = \limsup a_n = L$.
^limsup

## Series

> [!def] Series
> The series $\sum_{n \ge 1} a_n$ **converges** to $S$ if its partial sums $s_n = a_1 + \cdots + a_n$ converge to $S$. It **converges absolutely** if $\sum |a_n|$ converges.
^series-def

> [!thm] Theorem 5 (first facts about series)
> (a) $\sum a_n$ converges if and only if for every $\varepsilon > 0$ there is an $N$ with $|a_{m+1} + \cdots + a_n| < \varepsilon$ whenever $n > m \ge N$.
> (b) If $\sum a_n$ converges then $a_n \to 0$.
> (c) $\sum_{n \ge 0} r^n = 1/(1 - r)$ for $|r| < 1$, and the series diverges for $|r| \ge 1$.
> (d) An absolutely convergent series converges.
^series-basics

> [!proof]- Proof
> 1. (a) is [Theorem 4](#^cauchy-seq) for $(s_n)$, since $s_n - s_m = a_{m+1} + \cdots + a_n$.
> 2. (b) is (a) with $n = m + 1$.
> 3. (c): $s_n = (1 - r^{n+1})/(1 - r)$ for $r \ne 1$. For $|r| < 1$, $|r|^n$ is nonincreasing and bounded below, so it has a limit $\ell$ with $\ell = |r|\ell$, hence $\ell = 0$. For $|r| \ge 1$ the terms do not tend to $0$.
> 4. (d): $|a_{m+1} + \cdots + a_n| \le |a_{m+1}| + \cdots + |a_n|$; apply (a) to both series.
^p-series-basics

> [!thm] Theorem 6 (comparison)
> If $0 \le a_n \le b_n$ for all large $n$ and $\sum b_n$ converges, then $\sum a_n$ converges; equivalently, if $\sum a_n$ diverges so does $\sum b_n$. If $a_n, b_n > 0$ and $a_n / b_n \to c$ with $0 < c < \infty$, the two series converge or diverge together.
^comparison

> [!proof]- Proof
> 1. The partial sums of a series with nonnegative terms are nondecreasing, so the series converges exactly when they are bounded ([Theorem 2](#^monotone)).
> 2. Past the point where $a_n \le b_n$, each partial sum of $\sum a_n$ is at most a fixed constant plus the matching partial sum of $\sum b_n$.
> 3. In the limit case, $(c/2) b_n \le a_n \le 2c\, b_n$ for all large $n$; apply step 2 both ways.
^p-comparison

> [!thm] Theorem 7 (condensation)
> Let $a_n \ge 0$ be nonincreasing. Then $\sum_{n \ge 1} a_n$ converges if and only if $\sum_{k \ge 0} 2^k a_{2^k}$ converges. In particular $\sum 1/n^p$ converges exactly when $p > 1$.
^condensation

> [!proof]- Proof (d 3)
> 1. Group the terms into blocks $2^k \le n < 2^{k+1}$, each of $2^k$ terms.
> 2. Every term in block $k$ lies between $a_{2^{k+1}}$ and $a_{2^k}$, so the block sum is at most $2^k a_{2^k}$ and at least $\tfrac12 \cdot 2^{k+1} a_{2^{k+1}}$.
> 3. Summing over $k \le K$: $s_{2^{K+1} - 1} \le \sum_{k=0}^{K} 2^k a_{2^k}$ and $s_{2^{K+1}-1} \ge \tfrac12 \sum_{k=1}^{K+1} 2^k a_{2^k}$, so one set of partial sums is bounded exactly when the other is.
> 4. For $a_n = n^{-p}$ with $p > 0$, $2^k a_{2^k} = (2^{1-p})^k$, a geometric series with ratio below $1$ exactly when $p > 1$. For $p \le 0$ the terms do not tend to $0$.
^p-condensation

> [!thm] Theorem 8 (ratio and root tests)
> Let $\rho = \limsup |a_n|^{1/n}$. If $\rho < 1$ the series $\sum a_n$ converges absolutely; if $\rho > 1$ it diverges. If $a_n \ne 0$ and $\limsup |a_{n+1}/a_n| < 1$ it converges absolutely; if $|a_{n+1}/a_n| \ge 1$ for all large $n$ it diverges. When the ratio or the root tends to $1$, neither test decides.
^ratio-root

> [!proof]- Proof (d 2.5)
> 1. Root, $\rho < 1$: pick $\rho < q < 1$. For large $n$, $|a_n|^{1/n} < q$ ([upper limits](#^limsup)), so $|a_n| < q^n$; compare with the geometric series.
> 2. Root, $\rho > 1$: $|a_n| > 1$ for infinitely many $n$, so $a_n \not\to 0$.
> 3. Ratio below $q < 1$ from $N$ on: $|a_n| \le |a_N| q^{n - N}$; compare.
> 4. Ratio at least $1$ from some point: $|a_n|$ is nondecreasing and nonzero there, so $a_n \not\to 0$.
> 5. $n^{1/n} \to 1$: writing $n^{1/n} = 1 + h$ with $h \ge 0$, $n = (1+h)^n \ge \binom n2 h^2$, so $h \le \sqrt{2/(n-1)}$.
> 6. So $\sum 1/n$ (divergent) and $\sum 1/n^2$ (convergent) both have ratio and root tending to $1$.
^p-ratio-root

> [!trap] A ratio tending to 1 hides a divergent series
> $a_n = 4^n / \binom{2n}{n}$ has $a_{n+1}/a_n = (2n+2)/(2n+1) \to 1$, so the ratio test is silent. But $\binom{2n}{n} \le 4^n$ (one term of $(1+1)^{2n}$), so $a_n \ge 1$ and the series diverges by [Theorem 5](#^series-basics)(b). Check that the terms tend to $0$ before reaching for a test.
^trap-ratio-one

## Exact sums

> [!thm] Theorem 9 (telescoping)
> For any sequence $f$, $\sum_{k=m}^{n} \bigl(f(k+1) - f(k)\bigr) = f(n+1) - f(m)$. The series $\sum_{k \ge m} (f(k+1) - f(k))$ converges exactly when $\lim f(n)$ exists, and then equals $\lim f(n) - f(m)$.
^telescoping

> [!proof]- Proof
> 1. Each $f(k)$ with $m < k \le n$ appears once with each sign, leaving $f(n+1) - f(m)$.
> 2. Let $n \to \infty$ in the partial sums.
^p-telescoping

All the work is in finding $f$. Rational terms: partial fractions. Terms with a product of consecutive factors in the denominator: the difference of two products with one factor fewer. Terms with powers or factorials: guess $f(k) = (\text{power or factorial}) \times (\text{rational function})$ and solve for the rational function. Terms of the form $\arctan(\cdot)$: the subtraction formula $\arctan u - \arctan v = \arctan\frac{u - v}{1 + uv}$ for $uv > -1$.
^telescoping-finding

> [!thm] Theorem 10 (summation by parts)
> Let $A_n = a_1 + \cdots + a_n$ and $A_0 = 0$. Then
> $$\sum_{k=1}^{n} a_k b_k = A_n b_n - \sum_{k=1}^{n-1} A_k (b_{k+1} - b_k).$$
^abel

> [!proof]- Proof
> 1. Substitute $a_k = A_k - A_{k-1}$.
> 2. $\sum_{k=1}^n (A_k - A_{k-1}) b_k = \sum_{k=1}^n A_k b_k - \sum_{k=1}^{n-1} A_k b_{k+1}$, shifting the index in the second sum and using $A_0 = 0$.
> 3. Collect the terms with the same $A_k$.
^p-abel

It is the discrete form of integration by parts: $A$ plays the antiderivative of $a$, and $b_{k+1} - b_k$ the derivative of $b$.
^abel-analogy

> [!thm] Theorem 11 (Dirichlet's test and alternating series)
> If the partial sums $A_n$ of $\sum a_n$ satisfy $|A_n| \le M$ for all $n$, and $b_n$ is nonincreasing with $b_n \to 0$, then $\sum a_n b_n$ converges, and $\bigl|\sum_{k=m+1}^{n} a_k b_k\bigr| \le 2M b_{m+1}$. In particular, for $b_n$ nonincreasing to $0$, $\sum (-1)^{k+1} b_k$ converges, and its sum $S$ satisfies $|S - s_m| \le b_{m+1}$.
^dirichlet

> [!proof]- Proof (d 3)
> 1. Apply [Theorem 10](#^abel) to the block $k = m+1, \dots, n$, with partial sums $A_k - A_m$ in place of $A_k$:
>    $\sum_{k=m+1}^n a_k b_k = (A_n - A_m) b_n - \sum_{k=m+1}^{n-1} (A_k - A_m)(b_{k+1} - b_k)$.
> 2. Each $|A_k - A_m| \le 2M$ and each $b_k - b_{k+1} \ge 0$, so the right side is at most $2M b_n + 2M (b_{m+1} - b_n) = 2M b_{m+1}$ in absolute value.
> 3. $b_{m+1} \to 0$, so the Cauchy condition of [Theorem 5](#^series-basics)(a) holds.
> 4. Alternating case: for $a_k = (-1)^{k+1}$, $A_k - A_m$ only takes the values $0$ and $(-1)^m$, so step 2 holds with $2M$ replaced by $1$: $|s_n - s_m| \le b_{m+1}$. Let $n \to \infty$.
^p-dirichlet

> [!thm] Theorem 12 (Stolz–Cesàro)
> Let $b_n$ be strictly increasing with $b_n \to +\infty$. If $\dfrac{a_{n+1} - a_n}{b_{n+1} - b_n} \to L$, then $\dfrac{a_n}{b_n} \to L$. (The same holds for $L = \pm\infty$, with a one-sided version of the same proof.) In particular, if $x_n \to L$ then $(x_1 + \cdots + x_n)/n \to L$.
^stolz

> [!proof]- Proof (d 3.5)
> 1. Given $\varepsilon$, choose $N$ so that for $k \ge N$: $(L - \varepsilon)(b_{k+1} - b_k) < a_{k+1} - a_k < (L + \varepsilon)(b_{k+1} - b_k)$, using $b_{k+1} - b_k > 0$.
> 2. Sum over $k = N, \dots, n-1$: $(L - \varepsilon)(b_n - b_N) < a_n - a_N < (L + \varepsilon)(b_n - b_N)$.
> 3. Divide by $b_n > 0$: $a_n / b_n$ lies between $(L \mp \varepsilon)(1 - b_N/b_n) + a_N / b_n$.
> 4. Since $b_n \to \infty$, $b_N / b_n \to 0$ and $a_N / b_n \to 0$, so $|a_n / b_n - L| < 2\varepsilon$ for all large $n$.
> 5. The last claim is the case $a_n = x_1 + \cdots + x_n$, $b_n = n$.
^p-stolz

The Cesàro case says averaging never destroys a limit. The converse fails: $x_n = (-1)^n$ has averages tending to $0$ and no limit.
^cesaro

Stolz–Cesàro is the discrete l'Hôpital rule: to find the growth of a sequence given by a recurrence, find a power or function of it whose increments converge.
^stolz-use

## Double series

> [!thm] Theorem 13 (swapping the order of a double series)
> If $a_{jk} \ge 0$ for all $j, k \ge 1$, then $\sum_j \sum_k a_{jk} = \sum_k \sum_j a_{jk}$, both sides possibly $+\infty$. If $\sum_j \sum_k |a_{jk}| < \infty$, both iterated sums of $a_{jk}$ converge and are equal.
^tonelli-sums

> [!proof]- Proof (d 3)
> 1. Let $S$ be the supremum of the rectangle sums $\sum_{j \le J,\, k \le K} a_{jk}$ over all $J, K$.
> 2. Each rectangle sum is at most $\sum_{j \le J} \sum_{k} a_{jk}$, since a partial sum of nonnegative terms is at most the full sum; so $S \le \sum_j \sum_k a_{jk}$.
> 3. Each partial sum $\sum_{j \le J} \sum_k a_{jk}$ is a finite sum of limits, so it equals $\lim_K \sum_{j \le J, k \le K} a_{jk} \le S$; hence $\sum_j \sum_k a_{jk} \le S$.
> 4. The same argument with the roles of $j$ and $k$ exchanged gives $\sum_k \sum_j a_{jk} = S$.
> 5. Signed case: $a_{jk} = a^+_{jk} - a^-_{jk}$ with $a^{\pm}_{jk} = \max(\pm a_{jk}, 0) \le |a_{jk}|$. Both parts have finite iterated sums equal in either order, and subtracting finite numbers is allowed.
^p-tonelli-sums

> [!trap] Swapping without absolute convergence
> Put $a_{jj} = 1$, $a_{j, j+1} = -1$, and all other entries $0$. Every row sums to $0$, so $\sum_j \sum_k a_{jk} = 0$. The first column sums to $1$ and every other column to $0$, so $\sum_k \sum_j a_{jk} = 1$. Here $\sum |a_{jk}| = \infty$.
^trap-swap

> [!trap] Reordering a conditionally convergent series
> $1 - \tfrac12 + \tfrac13 - \tfrac14 + \cdots$ converges ([alternating series](#^dirichlet)) to some $S$. Reorder it as two positive terms then one negative: $1 + \tfrac13 - \tfrac12 + \tfrac15 + \tfrac17 - \tfrac14 + \cdots$. After $n$ blocks the new partial sum is $T_n = \sum_{j=1}^{2n} \frac{1}{2j-1} - \sum_{k=1}^{n} \frac{1}{2k}$, while the original $s_{2n} = \sum_{j=1}^{n} \frac{1}{2j-1} - \sum_{k=1}^{n} \frac{1}{2k}$. So $T_n - s_{2n} = \sum_{j=n+1}^{2n} \frac{1}{2j-1} \ge \frac{n}{4n-1} > \frac14$, and the reordered series, if it converges at all, has sum at least $S + \tfrac14$. Only absolutely convergent series may be reordered freely.
^trap-reorder

## Examples

> [!example] Odd numbers over squares of consecutive products
> Evaluate $\displaystyle\sum_{k=1}^{\infty} \frac{2k+1}{k^2 (k+1)^2}$.
^ex-odd-over-squares

> [!solution]- Solution
> methods: telescoping
> 1. $(k+1)^2 - k^2 = 2k + 1$, so the term is $\dfrac{1}{k^2} - \dfrac{1}{(k+1)^2}$.
> 2. With $f(k) = -1/k^2$ the term is $f(k+1) - f(k)$, and $f(n) \to 0$.
> 3. The sum is $0 - f(1) = 1$.
> Answer: $1$.
^s-ex-odd-over-squares

> [!example] Integers weighted by powers of two
> Find a closed form for $\displaystyle\sum_{k=1}^{n} k\, 2^k$.
^ex-k-two-k

> [!solution]- Solution
> methods: summation-by-parts
> 1. Take $a_k = 2^k$, $b_k = k$. Then $A_k = 2^{k+1} - 2$ and $b_{k+1} - b_k = 1$.
> 2. Summation by parts: $\sum_{k=1}^n k 2^k = (2^{n+1} - 2) n - \sum_{k=1}^{n-1} (2^{k+1} - 2)$.
> 3. $\sum_{k=1}^{n-1} (2^{k+1} - 2) = (2^{n+1} - 4) - 2(n-1)$.
> 4. Subtract: $n 2^{n+1} - 2n - 2^{n+1} + 4 + 2n - 2 = (n-1) 2^{n+1} + 2$.
> 5. Check at $n = 1$: $2$; at $n = 2$: $2 + 8 = 10 = 1 \cdot 8 + 2$.
> Answer: $(n-1) 2^{n+1} + 2$.
^s-ex-k-two-k

> [!example] Sums of $p$-th powers against $n^{p+1}$
> For a positive integer $p$, find $\displaystyle\lim_{n \to \infty} \frac{1^p + 2^p + \cdots + n^p}{n^{p+1}}$.
^ex-power-sums

> [!solution]- Solution
> methods: an-limits-series/stolz
> 1. Let $a_n = 1^p + \cdots + n^p$ and $b_n = n^{p+1}$, strictly increasing to $\infty$.
> 2. $a_{n+1} - a_n = (n+1)^p$, and by the binomial theorem $b_{n+1} - b_n = (p+1) n^p + (\text{terms of degree} \le p - 1 \text{ in } n)$.
> 3. Dividing numerator and denominator by $n^p$, the ratio of increments tends to $1/(p+1)$.
> 4. Stolz–Cesàro gives the same limit for $a_n / b_n$. (Check, $p = 3$, $n = 10^5$: the ratio is $0.250005$.)
> Answer: $\dfrac{1}{p+1}$.
^s-ex-power-sums

## Derive

> [!derive] Prove that every reordering of an absolutely convergent series converges, to the same sum.
^d-rearrange

> [!derive] Prove that for a sequence of positive numbers, $\liminf \frac{a_{n+1}}{a_n} \le \liminf a_n^{1/n} \le \limsup a_n^{1/n} \le \limsup \frac{a_{n+1}}{a_n}$ (bounded cases).
^d-root-vs-ratio

> [!derive] Prove that $\sum_{n \ge 2} \dfrac{1}{n (\ln n)^p}$ converges exactly when $p > 1$.
^d-log-series

> [!derive] Prove that if $a_n \ge 0$ is nonincreasing and $\sum a_n$ converges, then $n a_n \to 0$; and show by an example that monotonicity cannot be dropped.
^d-tail-term

> [!derive] Prove that if $x_n \to L$ and $y_n \to M$, then $\frac1n \sum_{k=1}^{n} x_k\, y_{n+1-k} \to LM$.
^d-cesaro-product

## Problems

> [!problem] Powers of two over two consecutive integers (d 3)
> Find a closed form for $\displaystyle\sum_{k=1}^{N} \frac{k\, 2^k}{(k+1)(k+2)}$.
^inv-an-twopower-consecutive

> [!solution]- Solution
> methods: telescoping
> 1. Try $f(k) = 2^k / (k+1)$: $f(k+1) - f(k) = \dfrac{2^{k+1}}{k+2} - \dfrac{2^k}{k+1} = 2^k \dfrac{2(k+1) - (k+2)}{(k+1)(k+2)} = \dfrac{k\, 2^k}{(k+1)(k+2)}$.
> 2. The sum telescopes to $f(N+1) - f(1) = \dfrac{2^{N+1}}{N+2} - 1$.
> 3. Check, $N = 1$: $\tfrac{2}{6} = \tfrac13 = \tfrac43 - 1$. Verified for $N \le 14$ exactly.
> Answer: $\dfrac{2^{N+1}}{N+2} - 1$.
^s-inv-an-twopower-consecutive

> [!problem] An alternating double series of reciprocal powers (d 3.5)
> Evaluate $\displaystyle\sum_{n=2}^{\infty} \sum_{k=2}^{\infty} \frac{(-1)^n}{k^n}$.
^inv-an-alt-double-powers

> [!solution]- Solution
> methods: an-limits-series/tonelli-sums, telescoping
> 1. Absolute values: $\sum_{k \ge 2} \sum_{n \ge 2} k^{-n} = \sum_{k \ge 2} \dfrac{1}{k(k-1)} = 1 < \infty$, so the order may be swapped.
> 2. For fixed $k$, $\sum_{n \ge 2} (-1/k)^n = \dfrac{1/k^2}{1 + 1/k} = \dfrac{1}{k(k+1)}$.
> 3. $\sum_{k \ge 2} \Bigl(\dfrac1k - \dfrac{1}{k+1}\Bigr) = \dfrac12$.
> Answer: $\dfrac12$.
^s-inv-an-alt-double-powers

> [!problem] A sequence pushed by its inverse square (d 4)
> Let $x_1 = 1$ and $x_{n+1} = x_n + 1/x_n^2$. Find $\displaystyle\lim_{n \to \infty} \frac{x_n}{n^{1/3}}$.
^inv-an-inverse-square-push

> [!solution]- Solution
> methods: an-limits-series/monotone, an-limits-series/stolz
> 1. $x_n$ is increasing. If it were bounded it would converge to some $L \ge 1$ with $L = L + 1/L^2$, impossible; so $x_n \to \infty$.
> 2. $x_{n+1}^3 - x_n^3 = 3 + 3/x_n^3 + 1/x_n^6 \to 3$.
> 3. Stolz–Cesàro with $a_n = x_n^3$, $b_n = n$: $x_n^3 / n \to 3$.
> 4. Take cube roots (continuity of $t \mapsto t^{1/3}$). Numerically $x_n / n^{1/3} = 1.44225$ at $n = 10^6$.
> Answer: $3^{1/3}$.
^s-inv-an-inverse-square-push

> [!problem] Sine of n against cosine of n squared (d 5)
> Does $\displaystyle\sum_{n=1}^{\infty} \frac{\sin n \cos(n^2)}{n^{1/3}}$ converge?
^inv-an-sine-cosine-square

> [!solution]- Solution
> methods: telescoping, summation-by-parts
> 1. Product to sum: $\sin n \cos(n^2) = \tfrac12\bigl(\sin(n^2 + n) - \sin(n^2 - n)\bigr) = \tfrac12\bigl(\sin(n(n+1)) - \sin((n-1)n)\bigr)$.
> 2. So the partial sums of $\sin n \cos(n^2)$ telescope to $\tfrac12 \sin(N(N+1))$, bounded by $\tfrac12$.
> 3. $n^{-1/3}$ decreases to $0$, so Dirichlet's test applies.
> 4. Numerically the partial sums sit between $0.05$ and $0.07$ for $N$ up to $2 \cdot 10^6$.
> Answer: yes, it converges.
^s-inv-an-sine-cosine-square

> [!problem] Signs that flip at perfect squares (d 5.5)
> For which real $p$ does $\displaystyle\sum_{n=1}^{\infty} \frac{(-1)^{\lfloor \sqrt n \rfloor}}{n^p}$ converge?
^inv-an-square-sign-flips

> [!solution]- Solution
> methods: an-limits-series/dirichlet, comparison, mean-value
> 1. The sign is constant on the block $k^2 \le n \le (k+1)^2 - 1$ ($2k+1$ terms) and alternates with $k$. Let $B_k$ be the block sum of $n^{-p}$.
> 2. Each term lies between $(k+1)^{-2p}$ and $k^{-2p}$ when $p \ge 0$, so $(2k+1)(k+1)^{-2p} \le B_k \le (2k+1) k^{-2p}$.
> 3. If $p \le \tfrac12$: $B_k \ge (2k+1)/(k+1) \ge 1$ (and for $p < 0$ the terms grow), so consecutive partial sums at block ends differ by at least $1$: divergence.
> 4. If $p > \tfrac12$: write $B_k = c_k - e_k$ with $c_k = (2k+1)k^{-2p}$ and $0 \le e_k \le (2k+1)\bigl(k^{-2p} - (k+1)^{-2p}\bigr)$.
> 5. $c_k$ decreases to $0$: the derivative of $(2x+1)x^{-2p}$ is $x^{-2p-1}\bigl(2x(1 - 2p) - 2p\bigr) < 0$. So $\sum (-1)^k c_k$ converges (alternating series).
> 6. By the mean value theorem $k^{-2p} - (k+1)^{-2p} \le 2p\, k^{-2p-1}$, so $e_k \le 6p\, k^{-2p}$ and $\sum e_k$ converges because $2p > 1$.
> 7. So $\sum (-1)^k B_k$ converges. Inside a block all terms have one sign, so a partial sum ending mid-block differs from the previous block-end sum by at most $B_k \to 0$; the full series converges.
> Answer: exactly for $p > \tfrac12$.
^s-inv-an-square-sign-flips
