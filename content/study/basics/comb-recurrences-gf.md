---
study: basic
id: comb-recurrences-gf
title: Linear recurrences and generating functions
area: comb
needs: [comb-binomial, alg-polynomials]
build: 1
tracks: [putnam]
---

> Written by a model for Adit. Not Adit's words.

Needs: [counting two ways](comb-binomial.md) for stars and bars and the binomial theorem; [polynomials](alg-polynomials.md) for factoring over $\mathbb C$. ^needs

A sequence can be held three ways: as a recurrence, as a power series, or as powers of a matrix. Each view makes a different question easy. The series view solves recurrences and counts objects built from parts; the matrix view computes far terms and residues; the recurrence view is where problems start. ^overview

## Formal power series

> [!def] Formal power series
> A formal power series over a field $K$ (here $\mathbb Q$, $\mathbb R$ or $\mathbb C$) is an expression $A(x) = \sum_{n \ge 0} a_n x^n$ with $a_n \in K$. Two series are equal when all their coefficients are. They are added coefficientwise and multiplied by $[x^n]\,AB = \sum_{k=0}^{n} a_k b_{n-k}$, where $[x^n]A$ means $a_n$. Nothing converges or diverges: each coefficient of a sum or product is a finite computation. The **ordinary generating function** of $(a_n)$ is $\sum a_n x^n$; its **exponential generating function** is $\sum a_n x^n/n!$.
^fps

> [!thm] Theorem 1 (reciprocals)
> A series $A$ has a multiplicative inverse exactly when $a_0 \ne 0$. For example $(1 - x)\sum_{n \ge 0} x^n = 1$.
^reciprocal

> [!proof]- Proof
> 1. If $AB = 1$, the constant terms give $a_0 b_0 = 1$, so $a_0 \ne 0$.
> 2. Conversely, $AB = 1$ means $a_0 b_n + \sum_{k=1}^{n} a_k b_{n-k} = [n = 0]$ for every $n$.
> 3. Solve recursively: $b_0 = 1/a_0$, and $b_n = -\frac{1}{a_0}\sum_{k=1}^{n} a_k b_{n-k}$ uses only earlier $b$'s.
^p-reciprocal

Operations, each checked by comparing the coefficient of $x^n$ on both sides:

| sequence at $n$ | series |
|---|---|
| $a_{n-1}$ (with $a_{-1} = 0$) | $xA(x)$ |
| $a_{n+1}$ | $(A(x) - a_0)/x$ |
| $c^n a_n$ | $A(cx)$ |
| $n a_n$ | $xA'(x)$, with $A' = \sum n a_n x^{n-1}$ |
| $a_0 + a_1 + \dots + a_n$ | $A(x)/(1-x)$ |
| $\sum_{k=0}^{n} a_k b_{n-k}$ | $A(x)B(x)$ |
^gf-ops

> [!thm] Theorem 2 (products count pairs; reciprocals count sequences)
> (a) Suppose every object of size $n$ splits in exactly one way into a first part of some size $k$ and a second part of size $n - k$, with $a_k$ choices for the first part and $b_{n-k}$ for the second, independently. Then the objects are counted by $A(x)B(x)$.
> (b) If parts are counted by $C(x)$ with $c_0 = 0$, then ordered sequences of any number of parts (including none) are counted by $1/(1 - C(x))$.
> (c) For labelled objects, where the $n$ labels are shared out between the two parts, the count is $\sum_k \binom nk a_k b_{n-k}$, which is $n!\,[x^n]\,\hat A(x)\hat B(x)$ for the exponential generating functions $\hat A$, $\hat B$.
^convolution

> [!proof]- Proof (d 2)
> 1. (a) The objects of size $n$ number $\sum_k a_k b_{n-k}$ by the unique splitting, and that is $[x^n]AB$.
> 2. (b) By (a) and induction on $j$, sequences of exactly $j$ parts are counted by $C^j$.
> 3. Since $c_0 = 0$, $C^j$ has no term below $x^j$, so $S = \sum_{j \ge 0} C^j$ has only finitely many contributions to each coefficient and is a well-defined series.
> 4. $(1 - C)S = \sum_{j \ge 0} C^j - \sum_{j \ge 1} C^j = 1$, so $S = 1/(1-C)$.
> 5. (c) $\frac{x^k}{k!}\cdot\frac{x^{n-k}}{(n-k)!} = \binom nk \frac{x^n}{n!}$, and $\binom nk$ is the number of ways to choose which labels go to the first part.
^p-convolution

> [!thm] Theorem 3 (standard series)
> For $j \ge 1$ and any constant $r$,
> $$\frac{1}{(1 - rx)^j} = \sum_{n \ge 0} \binom{n+j-1}{j-1} r^n x^n,$$
> and $\binom{n+j-1}{j-1}$ is a polynomial in $n$ of degree exactly $j - 1$. Also $(1+x)^m = \sum_k \binom mk x^k$, and $e^x = \sum x^n/n!$ is the exponential generating function of the all-ones sequence.
^standard-series

> [!proof]- Proof
> 1. $1/(1-x)^j = \left(\sum_a x^a\right)^j$ by Theorem 1, so $[x^n]$ counts $j$-tuples of non-negative integers with sum $n$: $\binom{n+j-1}{j-1}$ by [stars and bars](comb-binomial.md#^stars-bars).
> 2. Replace $x$ by $rx$ (the row $c^n a_n$ of the table).
> 3. $\binom{n+j-1}{j-1} = \frac{(n+1)(n+2)\cdots(n+j-1)}{(j-1)!}$, a product of $j - 1$ linear factors in $n$.
> 4. The other two are the binomial theorem (in [counting two ways](comb-binomial.md)) and the definition.
^p-standard-series

## Recurrences as rational series

> [!def] Linear recurrence and characteristic polynomial
> A linear recurrence of order $k$ with constant coefficients is $a_{n+k} = c_{k-1}a_{n+k-1} + \dots + c_1 a_{n+1} + c_0 a_n$ for all $n \ge 0$, with $c_0 \ne 0$. Its **characteristic polynomial** is $p(x) = x^k - c_{k-1}x^{k-1} - \dots - c_0$, and its **reversed polynomial** is $Q(x) = x^k p(1/x) = 1 - c_{k-1}x - \dots - c_0 x^k$. If $p(x) = \prod_{i=1}^{s} (x - r_i)^{m_i}$ with distinct roots $r_i$ (nonzero, since $c_0 \ne 0$), then $Q(x) = \prod_i (1 - r_i x)^{m_i}$.
^char-poly-def

> [!thm] Theorem 4 (recurrence to series)
> A sequence satisfies the recurrence exactly when $Q(x)A(x)$ is a polynomial of degree less than $k$. Then $A = P/Q$, where $P$ is $QA$ cut off after $x^{k-1}$, so $P$ is fixed by $a_0, \dots, a_{k-1}$.
^gf-from-recurrence

> [!proof]- Proof
> 1. For $n \ge 0$, $[x^{n+k}]\,QA = a_{n+k} - c_{k-1}a_{n+k-1} - \dots - c_0 a_n$.
> 2. These all vanish exactly when the recurrence holds, which is exactly when $QA$ has no term of degree $k$ or more.
^p-gf-from-recurrence

> [!thm] Theorem 5 (partial fractions)
> Let $Q(x) = \prod_{i=1}^{s} (1 - r_i x)^{m_i}$ with distinct nonzero complex $r_i$ and $\sum m_i = k$. Every polynomial $P$ of degree less than $k$ has exactly one expression
> $$\frac{P(x)}{Q(x)} = \sum_{i=1}^{s} \sum_{j=1}^{m_i} \frac{\alpha_{ij}}{(1 - r_i x)^j}.$$
^partial-fractions

> [!proof]- Proof (d 4)
> 1. Let $T$ send the $k$ numbers $(\alpha_{ij})$ to $\sum_{i,j} \alpha_{ij}\, Q(x)/(1 - r_i x)^j$. Each $Q/(1 - r_i x)^j$ is a polynomial of degree $k - j < k$, so $T$ is a linear map from $\mathbb C^k$ to the polynomials of degree less than $k$.
> 2. Both spaces have dimension $k$, so $T$ is a bijection as soon as it is injective ([rank-nullity](la-core.md#^rank-nullity)).
> 3. Suppose $T(\alpha) = 0$ with some $\alpha_{ij} \ne 0$. Fix such an $i$ and let $J$ be the largest $j$ with $\alpha_{iJ} \ne 0$.
> 4. Divide $T(\alpha) = 0$ by $Q$ and multiply by $(1 - r_i x)^J$: $\alpha_{iJ}$ plus a sum of rational functions, each with a factor $(1 - r_i x)$ in its numerator and denominator a product of factors $(1 - r_{i'} x)$ with $i' \ne i$, equals $0$.
> 5. Clear those denominators and set $x = 1/r_i$, where they do not vanish because the $r_{i'}$ are distinct: $\alpha_{iJ} = 0$. Contradiction.
^p-partial-fractions

> [!thm] Theorem 6 (solving a linear recurrence)
> The sequences satisfying a linear recurrence of order $k$ form a vector space $V$ of dimension $k$. If $p(x) = \prod_i (x - r_i)^{m_i}$, the $k$ sequences $n^j r_i^{\,n}$ with $0 \le j < m_i$ form a basis of $V$. So every solution is
> $$a_n = \sum_i P_i(n)\, r_i^{\,n}, \qquad \deg P_i < m_i,$$
> with the $k$ coefficients of the $P_i$ fixed by $a_0, \dots, a_{k-1}$.
^char-poly

> [!proof]- Proof (d 4.5)
> 1. A solution is determined by $(a_0, \dots, a_{k-1})$, and every choice extends to one; so this map $V \to \mathbb C^k$ is a linear bijection and $\dim V = k$.
> 2. By Theorems 4 and 5, $a \in V$ exactly when $A = \sum_{i,j} \alpha_{ij}(1 - r_i x)^{-j}$ for some numbers $\alpha_{ij}$, $1 \le j \le m_i$.
> 3. By Theorem 3, then $a_n = \sum_i \big(\sum_j \alpha_{ij}\binom{n+j-1}{j-1}\big) r_i^{\,n}$, and the inner sum is a polynomial in $n$ of degree less than $m_i$. So the $k$ sequences $n^j r_i^{\,n}$ span $V$.
> 4. They also lie in $V$: for fixed $i$ the polynomials $\binom{n+j-1}{j-1}$, $j = 1, \dots, m_i$, have degrees $0, \dots, m_i - 1$, so their combinations include every $n^j$ with $j < m_i$.
> 5. $k$ vectors spanning a $k$-dimensional space are a basis.
^p-char-poly

**Repeated roots.** A simple root $r$ contributes $\alpha r^n$; a double root contributes $(\alpha + \beta n) r^n$; a root of multiplicity $m$ contributes a polynomial of degree $m - 1$ times $r^n$. Leaving out the factor $n$ is the usual error. It shows up when the closed form is checked on one more term than it has constants: the extra term will not fit. ^repeated-roots

## Matrices and residues

> [!thm] Theorem 7 (matrix powers)
> (a) For the recurrence above, put $s_n = (a_{n+k-1}, \dots, a_{n+1}, a_n)^{T}$ and let $M$ be the **companion matrix**: first row $(c_{k-1}, \dots, c_1, c_0)$, and $1$s just below the diagonal, $0$ elsewhere. Then $s_{n+1} = M s_n$ and $s_n = M^n s_0$.
> (b) For any $k \times k$ matrix $M$ with $\det(xI - M) = x^k - d_{k-1}x^{k-1} - \dots - d_0$, every entry of $M^n$, as a sequence in $n$, satisfies $u_{n+k} = d_{k-1}u_{n+k-1} + \dots + d_0 u_n$.
> (c) $M^n$, and so $a_n$, can be computed with at most $2\log_2 n$ matrix products.
^matrix-power

> [!proof]- Proof (d 2.5)
> 1. (a) The first entry of $Ms_n$ is $c_{k-1}a_{n+k-1} + \dots + c_0 a_n = a_{n+k}$, and the $1$s below the diagonal shift the other entries down one place. Induction gives $s_n = M^n s_0$.
> 2. (b) By [Cayley-Hamilton](la-core.md#^cayley-hamilton), $M^k = d_{k-1}M^{k-1} + \dots + d_0 I$. Multiply by $M^n$ and read any one entry.
> 3. (c) $M^{2m} = (M^m)^2$ and $M^{2m+1} = M \cdot M^{2m}$; each halving of the exponent costs at most two products.
^p-matrix-power

> [!thm] Theorem 8 (periodicity mod m)
> Let $m \ge 2$ and $a_{n+k} \equiv f(a_n, \dots, a_{n+k-1}) \pmod m$ for a function $f$ of residues. Then $(a_n \bmod m)$ is eventually periodic with period at most $m^k$. If $f$ is a bijection in its first argument when the others are fixed, it is periodic from the start. For a linear recurrence this holds when $\gcd(c_0, m) = 1$.
^periodic-mod

> [!proof]- Proof (d 2.5)
> 1. The state $t_n = (a_n, \dots, a_{n+k-1}) \bmod m$ determines $t_{n+1}$, and there are $m^k$ possible states.
> 2. Among $t_0, \dots, t_{m^k}$ two coincide ([pigeonhole](found-induction.md#^pigeonhole)): $t_i = t_j$ with $i < j$.
> 3. Then $t_{n + (j-i)} = t_n$ for all $n \ge i$, by induction on $n$.
> 4. If $f$ is a bijection in its first argument, $t_{n+1}$ also determines $t_n$; so $t_i = t_j$ with $i \ge 1$ gives $t_{i-1} = t_{j-1}$, and stepping down gives $t_0 = t_{j-i}$.
> 5. For a linear recurrence, $c_0 a_n \equiv a_{n+k} - c_{k-1}a_{n+k-1} - \dots$, and $c_0$ is invertible mod $m$ when $\gcd(c_0, m) = 1$ ([units](nt-congruence.md#^unit-gcd)).
^p-periodic-mod

> [!thm] Theorem 9 (fractional linear maps)
> Let $x_{n+1} = \dfrac{\alpha x_n + \beta}{\gamma x_n + \delta}$ with $M = \begin{pmatrix} \alpha & \beta \\ \gamma & \delta \end{pmatrix}$ invertible, and let $(p_n, q_n)^{T} = M^n (x_0, 1)^{T}$. Then $x_n = p_n/q_n$ for as long as the $x_n$ are defined. If $M^N = \lambda I$, then $x_{n+N} = x_n$. Both $p_n$ and $q_n$ satisfy $u_{n+2} = (\operatorname{tr} M)u_{n+1} - (\det M)u_n$.
^mobius

> [!proof]- Proof
> 1. $\dfrac{p_{n+1}}{q_{n+1}} = \dfrac{\alpha p_n + \beta q_n}{\gamma p_n + \delta q_n}$; divide top and bottom by $q_n$.
> 2. Induction from $x_0 = x_0/1$ gives $x_n = p_n/q_n$.
> 3. If $M^N = \lambda I$ then $\lambda \ne 0$ ($M$ is invertible) and $(p_{n+N}, q_{n+N}) = \lambda(p_n, q_n)$, so the ratio repeats.
> 4. The last sentence is Theorem 7(b) for a $2 \times 2$ matrix.
^p-mobius

## Examples

> [!example] Strips of squares and coloured dominoes
> A $1 \times n$ strip is tiled with $1 \times 1$ squares (one kind) and $1 \times 2$ dominoes (each red or blue). Count the tilings.
^ex-coloured-dominoes

> [!solution]- Solution
> methods: generating-function, comb-recurrences-gf/partial-fractions
> 1. A tiling is an ordered sequence of tiles, and the tiles are counted by $C(x) = x + 2x^2$. By Theorem 2(b), $A(x) = 1/(1 - x - 2x^2)$.
> 2. $1 - x - 2x^2 = (1 - 2x)(1 + x)$.
> 3. Partial fractions: $\dfrac{1}{(1-2x)(1+x)} = \dfrac{2/3}{1 - 2x} + \dfrac{1/3}{1 + x}$; check $\frac23(1 + x) + \frac13(1 - 2x) = 1$.
> 4. So $a_n = \dfrac{2^{n+1} + (-1)^n}{3}$.
> 5. Check: $a_0, a_1, a_2, a_3 = 1, 1, 3, 5$; for $n = 2$, two squares or one domino in two colours. Reading $Q$ backwards gives the recurrence $a_n = a_{n-1} + 2a_{n-2}$.

> [!example] A double root
> Solve $a_{n+3} = 5a_{n+2} - 8a_{n+1} + 4a_n$ with $a_0 = 1$, $a_1 = 1$, $a_2 = 3$.
^ex-double-root

> [!solution]- Solution
> methods: characteristic-polynomial
> 1. $p(x) = x^3 - 5x^2 + 8x - 4 = (x - 1)(x - 2)^2$.
> 2. By Theorem 6, $a_n = \alpha + (\beta + \gamma n)2^n$.
> 3. $n = 0, 1, 2$: $\alpha + \beta = 1$, $\alpha + 2\beta + 2\gamma = 1$, $\alpha + 4\beta + 8\gamma = 3$.
> 4. Differences: $\beta + 2\gamma = 0$ and $2\beta + 6\gamma = 2$, so $\gamma = 1$, $\beta = -2$, $\alpha = 3$.
> 5. $a_n = 3 + (n - 2)2^n$. Check: $a_3 = 11 = 5 \cdot 3 - 8 \cdot 1 + 4 \cdot 1$ (and the formula holds for $n < 15$ by computation).

> [!example] A three-cycle
> Let $x_0 = 2$ and $x_{n+1} = \dfrac{x_n - 3}{x_n + 1}$. Find $x_{2027}$.
^ex-three-cycle

> [!solution]- Solution
> methods: comb-recurrences-gf/mobius
> 1. $M = \begin{pmatrix} 1 & -3 \\ 1 & 1 \end{pmatrix}$ has trace $2$ and determinant $4$.
> 2. Cayley-Hamilton: $M^2 = 2M - 4I$, so $M^3 = 2M^2 - 4M = -8I$. Hence $x_{n+3} = x_n$ while defined.
> 3. $x_1 = -\frac13$, $x_2 = \dfrac{-10/3}{2/3} = -5$, $x_3 = \dfrac{-8}{-4} = 2$. No denominator vanished.
> 4. $2027 = 3 \cdot 675 + 2$.
> Answer: $x_{2027} = x_2 = -5$.

## Derive

> [!derive] Prove that the companion matrix of a monic polynomial $p$ has characteristic polynomial $p$.
^d-companion

> [!derive] Let $C_0 = 1$ and $C_{n+1} = \sum_{k=0}^{n} C_k C_{n-k}$. Prove that $C_n = \dfrac{1}{n+1}\dbinom{2n}{n}$.
^d-catalan

> [!derive] With $F_0 = 0$, $F_1 = 1$, $F_{n+2} = F_{n+1} + F_n$, prove that $F_{m+n} = F_m F_{n+1} + F_{m-1} F_n$ for $m \ge 1$, and that $\gcd(F_m, F_n) = F_{\gcd(m,n)}$.
^d-fibonacci-gcd

> [!derive] Prove that the number of ways to write $n$ as a sum of odd positive integers (order ignored) equals the number of ways to write $n$ as a sum of distinct positive integers (order ignored).
^d-odd-distinct

> [!derive] Prove that if $(a_n)$ and $(b_n)$ satisfy linear recurrences with constant coefficients of orders $k$ and $l$, then $(a_n + b_n)$ satisfies one of order at most $k + l$ and $(a_n b_n)$ one of order at most $kl$.
^d-sum-product-recurrence

## Problems

> [!problem] A far term mod five (d 3)
> Let $a_0 = a_1 = 1$ and $a_{n+2} = a_{n+1} + 3a_n$. Find the remainder of $a_{2026}$ on division by $5$.
^inv-comb-far-term-mod5

> [!solution]- Solution
> methods: comb-recurrences-gf/periodic-mod
> 1. Mod 5 the terms run $1, 1, 4, 2, 4, 0, 2, 2, \dots$, so the state $(a_6, a_7) \equiv (2, 2) = 2(a_0, a_1)$.
> 2. The recurrence is linear, so $(a_{n+6}, a_{n+7}) \equiv 2(a_n, a_{n+1})$ for every $n$, and $a_{n+6j} \equiv 2^j a_n$.
> 3. $2^4 \equiv 1$, so the period divides $24$; $2026 = 6 \cdot 337 + 4$ and $2^{337} \equiv 2^{1} = 2$.
> 4. $a_{2026} \equiv 2a_4 \equiv 2 \cdot 4 = 8 \equiv 3$.
> Answer: $3$ (direct computation agrees; the period is exactly $24$).

> [!problem] Subsets with no gap of two (d 3)
> How many subsets of $\{1, 2, \dots, 12\}$ contain no two elements that differ by exactly $2$?
^inv-comb-gap-two-subsets

> [!solution]- Solution
> methods: comb-recurrences-gf/char-poly
> 1. A difference of $2$ links only numbers of the same parity, so the odd numbers $1, 3, \dots, 11$ and the even numbers $2, \dots, 12$ can be chosen independently. Each is a chain of $6$ in which only neighbours conflict.
> 2. For a chain of length $L$, let $f_L$ count the subsets with no two neighbours. Splitting on whether the last element is in gives $f_L = f_{L-1} + f_{L-2}$, with $f_0 = 1$, $f_1 = 2$.
> 3. $f_0, \dots, f_6 = 1, 2, 3, 5, 8, 13, 21$.
> Answer: $21^2 = 441$ (brute force agrees).

> [!problem] Weighted sums with a doubled part (d 3.5)
> Let $s_n$ be the number of triples $(a, b, c)$ of non-negative integers with $a + b + 2c = n$. Find a closed form for $s_n$.
^inv-comb-a-b-2c

> [!solution]- Solution
> methods: generating-function, comb-recurrences-gf/partial-fractions
> 1. By Theorem 2(a), $S(x) = \dfrac{1}{(1-x)^2(1-x^2)} = \dfrac{1}{(1-x)^3(1+x)}$.
> 2. Partial fractions: $S = \dfrac{1/2}{(1-x)^3} + \dfrac{1/4}{(1-x)^2} + \dfrac{1/8}{1-x} + \dfrac{1/8}{1+x}$.
> 3. By Theorem 3, $s_n = \frac12\binom{n+2}{2} + \frac14(n+1) + \frac18 + \frac18(-1)^n = \dfrac{2(n+2)^2 - 1 + (-1)^n}{8}$.
> 4. For even $n$ this is $(n+2)^2/4$; for odd $n$ it is $((n+2)^2 - 1)/4$.
> Answer: $s_n = \left\lfloor (n+2)^2/4 \right\rfloor$ (checked for $n < 60$).

> [!problem] An alternating diagonal sum (d 4.5)
> Evaluate $u_n = \displaystyle\sum_{k=0}^{\lfloor n/2 \rfloor} (-1)^k \binom{n-k}{k}$ for every $n \ge 0$.
^inv-comb-alt-diagonal

> [!solution]- Solution
> methods: generating-function
> 1. $\binom{n-k}{k}$ counts tilings of a $1 \times n$ strip by $k$ dominoes and $n - 2k$ squares: there are $n - k$ tiles, and we choose which $k$ are dominoes.
> 2. So $u_n$ is a signed count of tilings with sign $(-1)^{\#\text{dominoes}}$, and by Theorem 2(b), $\sum u_n x^n = \dfrac{1}{1 - (x - x^2)} = \dfrac{1}{1 - x + x^2}$.
> 3. $(1 + x)(1 - x + x^2) = 1 + x^3$, so the series is $\dfrac{1+x}{1+x^3} = (1 + x)(1 - x^3 + x^6 - \cdots)$.
> Answer: $u_n = 1, 1, 0, -1, -1, 0$ according as $n \equiv 0, 1, 2, 3, 4, 5 \pmod 6$ (checked for $n < 14$).

> [!problem] Last digits of a floor (d 4.5)
> Find the last two decimal digits of $\left\lfloor (2 + \sqrt3)^{2026} \right\rfloor$.
^inv-comb-floor-power

> [!solution]- Solution
> methods: characteristic-polynomial, comb-recurrences-gf/periodic-mod, crt
> 1. $r = 2 + \sqrt3$ and $r' = 2 - \sqrt3$ are the roots of $x^2 - 4x + 1$, so $s_n = r^n + r'^n$ satisfies $s_{n+2} = 4s_{n+1} - s_n$ with $s_0 = 2$, $s_1 = 4$: all integers.
> 2. $0 < r' < 1$, so for $n \ge 1$, $\lfloor r^n \rfloor = s_n - 1$.
> 3. Mod 4: $s_n \equiv 2, 0, 2, 0, \dots$, so $s_{2026} \equiv 2$.
> 4. Mod 25: $s_0, \dots, s_{16} \equiv 2, 4, 14, 2, 19, 24, 2, 9, 9, 2, 24, 19, 2, 14, 4, 2, 4$. The state $(2, 4)$ returns at $n = 15$ and $c_0 = -1$ is a unit, so the period is $15$.
> 5. $2026 \equiv 1 \pmod{15}$, so $s_{2026} \equiv s_1 = 4 \pmod{25}$.
> 6. The residue mod $100$ that is $4$ mod $25$ and $2$ mod $4$ is $54$.
> Answer: $53$ (high-precision and modular computation agree).

> [!problem] A squaring sequence and its products (d 5.5)
> Let $a_0 = 6$ and $a_{n+1} = a_n^2 - 2$. Find $\displaystyle\lim_{n \to \infty} \frac{a_n}{a_0 a_1 \cdots a_{n-1}}$.
^inv-comb-squaring-product

> [!solution]- Solution
> methods: induction, telescoping
> 1. Let $t = 3 + 2\sqrt2$, a root of $t^2 - 6t + 1 = 0$, so $t + 1/t = 6$ and $t > 1$.
> 2. Since $(u + 1/u)^2 - 2 = u^2 + 1/u^2$, induction gives $a_n = t^{2^n} + t^{-2^n}$.
> 3. $(t^{2^k} - t^{-2^k})\,a_k = t^{2^{k+1}} - t^{-2^{k+1}}$, so the product telescopes: $a_0 \cdots a_{n-1} = \dfrac{t^{2^n} - t^{-2^n}}{t - t^{-1}}$.
> 4. The ratio is $(t - t^{-1})\dfrac{t^{2^n} + t^{-2^n}}{t^{2^n} - t^{-2^n}}$, and the fraction tends to $1$ because $t > 1$.
> 5. $t - 1/t = \sqrt{(t + 1/t)^2 - 4} = \sqrt{32} = 4\sqrt2$.
> Answer: $4\sqrt2$ (the ratio is $5.6568542495$ to ten places by $n = 3$).
