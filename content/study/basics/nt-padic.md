---
study: basic
id: nt-padic
title: Valuations, Legendre's formula and lifting the exponent
area: nt
needs: [nt-divisibility, nt-congruence]
build: 1
tracks: [putnam]
---

> Written by a model for Adit. Not Adit's words.

Needs: [unique factorisation](nt-divisibility.md#^fta), [Euclid's lemma](nt-divisibility.md#^euclid-lemma), [the floor](nt-divisibility.md#^floor), [congruences](nt-divisibility.md#^cong-arith) and [units](nt-congruence.md#^unit-gcd); the binomial theorem and $\binom{a}{b} = \frac{a!}{b!(a-b)!}$ from [comb-binomial](comb-binomial.md#^binom-def). ^needs

## Valuations

> [!def] p-adic valuation
> For a prime $p$ and a nonzero integer $n$, $v_p(n)$ is the largest $e \ge 0$ with $p^e \mid n$; by unique factorisation it is the exponent of $p$ in $n$. Set $v_p(0) = +\infty$. For example $v_2(40) = 3$ and $v_5(40) = 1$.
^vp-def

> [!thm] Theorem 1 (valuation rules)
> For nonzero integers $a, b$ and a prime $p$:
> (a) $v_p(ab) = v_p(a) + v_p(b)$;
> (b) $v_p(a + b) \ge \min(v_p(a), v_p(b))$, with equality when $v_p(a) \ne v_p(b)$;
> (c) $a \mid b$ exactly when $v_p(a) \le v_p(b)$ for every prime $p$;
> (d) $\gcd(a, b) = \prod_p p^{\min(v_p(a), v_p(b))}$ and $\operatorname{lcm}(a, b) = \prod_p p^{\max(v_p(a), v_p(b))}$, so $\gcd(a, b)\operatorname{lcm}(a, b) = |ab|$.
^vp-rules

> [!proof]- Proof (d 2)
> 1. Write $a = p^\alpha a'$, $b = p^\beta b'$ with $p \nmid a', b'$. Then $ab = p^{\alpha + \beta} a'b'$ and $p \nmid a'b'$ (Euclid's lemma): (a).
> 2. Say $\alpha \le \beta$. Then $a + b = p^\alpha(a' + p^{\beta - \alpha}b')$, so $v_p(a + b) \ge \alpha$.
> 3. If $\alpha < \beta$, then $a' + p^{\beta - \alpha}b' \equiv a' \not\equiv 0 \pmod p$: equality.
> 4. (c) If $b = ak$, (a) gives $v_p(b) = v_p(a) + v_p(k) \ge v_p(a)$. Conversely $k = \pm\prod_p p^{v_p(b) - v_p(a)}$ is an integer with $ak = b$.
> 5. (d) By (c) the positive common divisors are the $\prod p^{e_p}$ with $e_p \le \min$, and the largest takes $e_p = \min$. Likewise the common multiples have $e_p \ge \max$. Finally $\min + \max = v_p(a) + v_p(b)$.
^p-vp-rules

For a nonzero rational $x = a/b$, put $v_p(x) = v_p(a) - v_p(b)$; rule (a) shows this does not depend on how $x$ is written, and rules (a) and (b) still hold. ^vp-rational

> [!trap] Equal valuations can cancel
> Rule (b) gives only an inequality when the valuations agree: $v_3(3) = v_3(6) = 1$, yet $v_3(3 + 6) = 2$.
^trap-equal-valuations

## Factorials and binomial coefficients

Write $s_p(n)$ for the sum of the digits of $n$ in base $p$. ^digit-sum

> [!thm] Theorem 2 (Legendre's formula)
> For a prime $p$ and $n \ge 1$,
> $$v_p(n!) = \sum_{k \ge 1} \left\lfloor \frac{n}{p^k} \right\rfloor = \frac{n - s_p(n)}{p - 1}.$$
^legendre

> [!proof]- Proof (d 3)
> 1. By rule (a), $v_p(n!) = \sum_{m=1}^{n} v_p(m)$.
> 2. $v_p(m)$ is the number of $k \ge 1$ with $p^k \mid m$, so the sum counts pairs $(m, k)$ with $m \le n$ and $p^k \mid m$.
> 3. For fixed $k$ the multiples of $p^k$ in $\{1, \dots, n\}$ are $p^k, 2p^k, \dots, \lfloor n/p^k \rfloor p^k$. This gives the first form.
> 4. Write $n = \sum_i d_i p^i$ in base $p$. Then $\lfloor n/p^k \rfloor = \sum_{i \ge k} d_i p^{i-k}$, since the dropped part $\sum_{i < k} d_i p^i$ lies in $[0, p^k)$.
> 5. Summing over $k \ge 1$, digit $d_i$ is multiplied by $p^{i-1} + \dots + p + 1 = \frac{p^i - 1}{p - 1}$, and $\sum_i d_i \frac{p^i - 1}{p - 1} = \frac{n - s_p(n)}{p - 1}$.
^p-legendre

> [!example] Zeros at the end of 2026!
> How many zeros end the decimal expansion of $2026!$?
^ex-zeros

> [!solution]- Solution
> methods: nt-padic/legendre
> 1. The number of trailing zeros is $\min(v_2, v_5)$ of $2026!$.
> 2. $v_5 = 405 + 81 + 16 + 3 = 505$.
> 3. $v_2 = 2026 - s_2(2026) = 2026 - 8 = 2018$ ($2026 = 11111101010_2$).
> Answer: $505$.

> [!thm] Theorem 3 (Kummer)
> For $m, n \ge 0$ and a prime $p$, $v_p\binom{m+n}{m}$ is the number of carries when $m$ and $n$ are added in base $p$.
^kummer

> [!proof]- Proof (d 3.5)
> 1. By Legendre, $v_p\binom{m+n}{m} = \frac{s_p(m) + s_p(n) - s_p(m+n)}{p - 1}$.
> 2. Add digit by digit with carry $c_{-1} = 0$: at position $i$, $m_i + n_i + c_{i-1} = r_i + p\,c_i$, where $r_i$ is the digit of $m + n$ and $c_i \in \{0, 1\}$ (the left side is at most $2p - 1$).
> 3. Sum over all positions: $s_p(m) + s_p(n) + \sum_i c_{i-1} = s_p(m+n) + p\sum_i c_i$.
> 4. The carries out of the top are $0$, so $\sum_i c_{i-1} = \sum_i c_i$, and $s_p(m) + s_p(n) - s_p(m+n) = (p - 1)\sum_i c_i$.
^p-kummer

In particular $p \mid \binom{p}{k}$ for $0 < k < p$: adding $k$ and $p - k$ carries once. ^kummer-prime

> [!example] A central binomial coefficient
> Find $v_2\binom{2026}{1013}$.
^ex-kummer

> [!solution]- Solution
> methods: nt-padic/kummer
> 1. Adding $1013$ to itself in base $2$, each $1$ digit gives $1 + 1$ plus any carry, which carries; each $0$ digit gives $0 + 0 + c \le 1$, which does not.
> 2. So the number of carries is $s_2(1013) = 8$ ($1013 = 1111110101_2$).
> Answer: $8$.

## Lifting the exponent

> [!thm] Lemma 4 (one prime factor of the exponent at a time)
> Let $p$ be prime with $p \mid a - b$ and $p \nmid ab$. (i) If $p \nmid n$, then $v_p(a^n - b^n) = v_p(a - b)$. (ii) If $p$ is odd, then $v_p(a^p - b^p) = v_p(a - b) + 1$.
^lte-lemma

> [!proof]- Proof (d 4)
> 1. $a^n - b^n = (a - b)S$ with $S = \sum_{i=0}^{n-1} a^{n-1-i} b^i$.
> 2. (i) $b \equiv a \pmod p$ makes each term $\equiv a^{n-1}$, so $S \equiv n a^{n-1} \not\equiv 0 \pmod p$ (Euclid's lemma).
> 3. (ii) $n = p$. Write $b = a + t$ with $p \mid t$. The binomial theorem gives $b^i \equiv a^i + i a^{i-1} t \pmod{p^2}$, since the dropped terms contain $t^2$.
> 4. So $S \equiv \sum_{i=0}^{p-1} (a^{p-1} + i a^{p-2} t) = p a^{p-1} + a^{p-2} t \cdot \frac{p(p-1)}{2} \pmod{p^2}$.
> 5. $p$ is odd, so $\frac{p-1}{2}$ is an integer and the second term is $p \cdot t$ times an integer, divisible by $p^2$.
> 6. Hence $S \equiv p a^{p-1} \pmod{p^2}$ with $p \nmid a^{p-1}$: $v_p(S) = 1$.
^p-lte-lemma

> [!thm] Theorem 5 (lifting the exponent, odd p)
> Let $p$ be an odd prime with $p \mid a - b$ and $p \nmid ab$. For every $n \ge 1$,
> $$v_p(a^n - b^n) = v_p(a - b) + v_p(n).$$
> If $p \mid a + b$, $p \nmid ab$ and $n$ is odd, then $v_p(a^n + b^n) = v_p(a + b) + v_p(n)$.
^lte-odd

> [!proof]- Proof (d 3)
> 1. Write $n = p^k m$ with $p \nmid m$.
> 2. For $j = 0, \dots, k - 1$ the pair $a^{p^j}, b^{p^j}$ still satisfies $p \mid a^{p^j} - b^{p^j}$ and $p \nmid a^{p^j}b^{p^j}$. Lemma 4(ii) adds $1$ each time: $v_p(a^{p^k} - b^{p^k}) = v_p(a - b) + k$.
> 3. Lemma 4(i) for the pair $a^{p^k}, b^{p^k}$ and exponent $m$ adds nothing.
> 4. For the second form replace $b$ by $-b$; $n$ odd gives $(-b)^n = -b^n$.
^p-lte-odd

> [!thm] Theorem 6 (lifting the exponent, p = 2)
> Let $a, b$ be odd. If $n$ is odd, $v_2(a^n - b^n) = v_2(a - b)$. If $n$ is even,
> $$v_2(a^n - b^n) = v_2(a - b) + v_2(a + b) + v_2(n) - 1.$$
^lte-two

> [!proof]- Proof (d 3.5)
> 1. $n$ odd: Lemma 4(i) with $p = 2$.
> 2. For odd $c, d$: $c^2 + d^2 \equiv 1 + 1 = 2 \pmod 8$ ([odd squares](nt-divisibility.md#^ex-odd-square)), so $v_2(c^2 + d^2) = 1$.
> 3. Write $n = 2^k m$ with $m$ odd, $k \ge 1$. Factoring differences of squares repeatedly,
>    $$a^{2^k} - b^{2^k} = (a - b)(a + b)(a^2 + b^2)(a^4 + b^4)\cdots(a^{2^{k-1}} + b^{2^{k-1}}).$$
> 4. The last $k - 1$ factors have $v_2 = 1$ by step 2, so $v_2(a^{2^k} - b^{2^k}) = v_2(a - b) + v_2(a + b) + k - 1$.
> 5. Step 1 for the odd pair $a^{2^k}, b^{2^k}$ and odd exponent $m$ adds nothing.
^p-lte-two

> [!trap] The hypotheses of lifting the exponent
> Drop $p \nmid ab$ and it fails: $v_5(10^2 - 5^2) = v_5(75) = 2$, not $v_5(5) + v_5(2) = 1$. Use the odd-$p$ form at $p = 2$ and it fails: $v_2(3^2 - 1) = 3$, not $v_2(2) + v_2(2) = 2$.
^trap-lte

> [!example] Two exponents
> Find $v_2(3^{2026} - 1)$ and $v_7(9^{49} - 2^{49})$.
^ex-lte

> [!solution]- Solution
> methods: lifting-the-exponent
> 1. $p = 2$, $n = 2026$ even: $v_2(2) + v_2(4) + v_2(2026) - 1 = 1 + 2 + 1 - 1 = 3$.
> 2. $7 \mid 9 - 2$, $7 \nmid 18$: $v_7(7) + v_7(49) = 1 + 2 = 3$.

## Lifting roots

> [!thm] Lemma 7 (expansion to first order)
> Let $f$ have integer coefficients and let $f'$ be its derivative, taken term by term: $(c x^k)' = kc x^{k-1}$. For integers $a, h$, $f(a + h) \equiv f(a) + h f'(a) \pmod{h^2}$.
^taylor-int

> [!proof]- Proof
> 1. For $x^k$: the binomial theorem gives $(a + h)^k = a^k + k a^{k-1} h + h^2 \cdot (\text{an integer})$.
> 2. Multiply by the coefficients and add over the terms of $f$.
^p-taylor-int

> [!thm] Theorem 8 (Hensel's lemma)
> Let $p$ be prime, $k \ge 1$, $f$ with integer coefficients, $f(a) \equiv 0 \pmod{p^k}$ and $p \nmid f'(a)$. Then exactly one $t$ mod $p$ gives $f(a + tp^k) \equiv 0 \pmod{p^{k+1}}$. Hence a root $a$ mod $p$ with $p \nmid f'(a)$ has, for each $j \ge 1$, exactly one root mod $p^j$ congruent to it mod $p$.
^hensel

> [!proof]- Proof (d 3.5)
> 1. Put $h = tp^k$. Since $2k \ge k + 1$, Lemma 7 gives $f(a + tp^k) \equiv f(a) + tp^k f'(a) \pmod{p^{k+1}}$.
> 2. Write $f(a) = p^k c$. The right side is $p^k(c + t f'(a))$, a multiple of $p^{k+1}$ exactly when $t f'(a) \equiv -c \pmod p$.
> 3. $f'(a)$ is a unit mod $p$, so $t \equiv -c\,f'(a)^{-1}$: exactly one class.
> 4. Induction on $j$: a root $r$ mod $p^{j+1}$ with $r \equiv a \pmod p$ reduces to a root mod $p^j$ congruent to $a$, unique by induction; call it $a_j$. Then $r = a_j + tp^j$, and $f'(a_j) \equiv f'(a) \not\equiv 0 \pmod p$, so step 3 leaves one $t$.
^p-hensel

> [!trap] A root where the derivative vanishes
> With $p \mid f'(a)$ a root can lift to several roots or to none. $x^2 - 1$ has one root mod $2$ and four mod $8$ ($1, 3, 5, 7$); $x^2 - 3$ has the root $0$ mod $3$ and none mod $9$.
^trap-hensel

> [!example] A square root of −1 mod 125
> Find the solutions of $x^2 \equiv -1 \pmod{125}$.
^ex-hensel

> [!solution]- Solution
> methods: nt-padic/hensel
> 1. $f(x) = x^2 + 1$, $f'(x) = 2x$. Mod $5$ the roots are $2$ and $3$, and $f'$ is nonzero at both, so each lifts uniquely.
> 2. From $2$: $f(2) = 5$, $c = 1$, $f'(2) = 4 \equiv -1$, so $-t \equiv -1$, $t = 1$: root $7$ mod $25$.
> 3. From $7$: $f(7) = 50 = 25 \cdot 2$, $c = 2$, $f'(7) = 14 \equiv -1$, so $t = 2$: root $57$ mod $125$.
> 4. The other root is $-57 \equiv 68$. Check: $57^2 + 1 = 3250 = 26 \cdot 125$.

## Problems

> [!problem] Zeros of 2026! in base twelve (d 2.5)
> Written in base $12$, how many zeros does $2026!$ end with?
^inv-nt-base-twelve-zeros

> [!solution]- Solution
> methods: nt-padic/legendre
> 1. $12 = 2^2 \cdot 3$; the count is the largest $k$ with $2^{2k} 3^k \mid 2026!$, which is $\min(\lfloor v_2/2 \rfloor, v_3)$.
> 2. $v_2(2026!) = 2018$. $2026 = 2210001_3$, digit sum $6$, so $v_3 = (2026 - 6)/2 = 1010$.
> Answer: $\min(1009, 1010) = 1009$.

> [!problem] Powers of two in 5ⁿ − 1 (d 3.5)
> Find all positive integers $n$ such that $2^n$ divides $5^n - 1$.
^inv-nt-two-power-five

> [!solution]- Solution
> methods: lifting-the-exponent
> 1. $n$ odd: $v_2(5^n - 1) = v_2(4) = 2 \ge n$ only for $n = 1$.
> 2. $n$ even: $v_2(5^n - 1) = v_2(4) + v_2(6) + v_2(n) - 1 = 2 + v_2(n)$.
> 3. Need $2 + v_2(n) \ge n$. Since $2^{v_2(n)} \le n$, this forces $2^{v} \le v + 2$ with $v = v_2(n) \ge 1$, so $v \le 2$ and $n \le 4$: $n = 2$ ($3 \ge 2$) and $n = 4$ ($4 \ge 4$) work.
> Answer: $n = 1, 2, 4$.

> [!problem] Odd entries in row 2026 (d 3)
> For how many $k$ with $0 \le k \le 2026$ is $\binom{2026}{k}$ odd?
^inv-nt-odd-row

> [!solution]- Solution
> methods: nt-padic/kummer
> 1. $\binom{2026}{k}$ is odd when adding $k$ and $2026 - k$ in base $2$ has no carry.
> 2. No carry means the binary digits of $k$ and $2026 - k$ never both equal $1$, so the $1$s of $k$ are a subset of the $1$s of $2026$; conversely any such $k$ gives $2026 - k$ the complementary digits and no carry.
> 3. $2026 = 11111101010_2$ has eight $1$s.
> Answer: $2^8 = 256$.

> [!problem] Roots of x² + x + 1 mod 343 (d 3.5)
> How many residues $x$ mod $343$ satisfy $x^2 + x + 1 \equiv 0 \pmod{343}$, and what is the least positive one?
^inv-nt-cyclotomic-343

> [!solution]- Solution
> methods: nt-padic/hensel
> 1. $343 = 7^3$. Mod $7$: $f(2) = 7$ and $f(4) = 21$ vanish, and no other residue does. $f'(x) = 2x + 1$ gives $f'(2) = 5$, $f'(4) = 9 \equiv 2$, both nonzero.
> 2. So there are exactly two roots mod $343$.
> 3. Lift $4$: $c = 3$, $2t \equiv -3 \equiv 4 \pmod 7$, $t = 2$: root $18$ mod $49$. And $f(18) = 343$ already, so $18$ is the root mod $343$.
> 4. The other root is $-1 - 18 \equiv 324$ (the two roots sum to $-1$).
> Answer: $2$ roots; the least positive is $18$.

> [!problem] Powers of three in 2ⁿ + 1 (d 4)
> For each $k \ge 1$, find the least positive integer $n$ with $3^k \mid 2^n + 1$.
^inv-nt-three-in-two-plus-one

> [!solution]- Solution
> methods: lifting-the-exponent, reduce-mod-small
> 1. $n$ even: $2^n = 4^{n/2} \equiv 1 \pmod 3$, so $2^n + 1 \equiv 2$, never divisible by $3$.
> 2. $n$ odd: $3 \mid 2 + 1$, $3 \nmid 2$, so $v_3(2^n + 1) = v_3(3) + v_3(n) = 1 + v_3(n)$.
> 3. Need $v_3(n) \ge k - 1$ with $n$ odd; the least is $3^{k-1}$, which is odd.
> Answer: $n = 3^{k-1}$.

## Derive

> [!derive] Prove that $v_2(n!) \le n - 1$ for $n \ge 1$, with equality exactly when $n$ is a power of $2$.
^d-factorial-two

> [!solution]- Solution
> methods: nt-padic/legendre
> 1. $v_2(n!) = n - s_2(n)$, and $s_2(n) \ge 1$, with equality exactly for powers of $2$.

> [!derive] Prove that $v_p\binom{p^e}{k} = e - v_p(k)$ for a prime $p$, $e \ge 1$ and $1 \le k \le p^e$. (d 3)
^d-prime-power-binomial

> [!solution]- Solution
> methods: nt-padic/kummer, nt-padic/vp-rules
> 1. $\binom{p^e}{k} = \frac{p^e}{k}\binom{p^e - 1}{k - 1}$.
> 2. $p^e - 1$ has every base-$p$ digit $p - 1$, so adding $k - 1$ and $p^e - k$ carries nowhere: $v_p\binom{p^e - 1}{k-1} = 0$.
> 3. Rule (a) on rationals: $v_p = e - v_p(k) + 0$.

> [!derive] Prove that $p^{v_p\binom{2n}{n}} \le 2n$ for every prime $p$ and $n \ge 1$. (d 4)
^d-central-binomial-bound

> [!solution]- Solution
> methods: nt-padic/kummer
> 1. A carry out of position $i$ when adding $n + n$ means that twice the number formed by the last $i + 1$ digits of $n$ is at least $p^{i+1}$, so $p^{i+1} \le 2n$.
> 2. Let $r$ be largest with $p^r \le 2n$. Carries can occur only at positions $0, \dots, r - 1$, so there are at most $r$, and $p^{v_p} \le p^r \le 2n$.

> [!derive] Let $f$ have integer coefficients, $f(a) \equiv 0 \pmod p$ and $f'(a) \equiv 0 \pmod p$. Prove that either every $t$ or no $t$ gives $f(a + tp) \equiv 0 \pmod{p^2}$, and say which.
^d-hensel-singular

> [!solution]- Solution
> methods: nt-padic/taylor-int
> 1. Lemma 7 with $h = tp$: $f(a + tp) \equiv f(a) + tp f'(a) \pmod{p^2}$, and $p^2 \mid tp f'(a)$.
> 2. So $f(a + tp) \equiv f(a)$: every $t$ works if $p^2 \mid f(a)$, none otherwise.
