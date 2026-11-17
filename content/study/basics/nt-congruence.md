---
study: basic
id: nt-congruence
title: Units mod n and the Chinese remainder theorem
area: nt
needs: [nt-divisibility]
build: 1
tracks: [putnam]
---

> Written by a model for Adit. Not Adit's words.

Needs: [division with remainder](nt-divisibility.md#^div-alg), [Bézout](nt-divisibility.md#^bezout), [Euclid's lemma](nt-divisibility.md#^euclid-lemma), [congruences](nt-divisibility.md#^cong-arith) and [cancelling](nt-divisibility.md#^cong-cancel). Powers of units (order, Fermat, Euler) are proved once, in [alg-groups](alg-groups.md#^euler). ^needs

## Units

> [!def] Unit, inverse, Euler's function
> Fix $n \ge 2$. An integer $a$ is a **unit** mod $n$ if $ax \equiv 1 \pmod n$ for some integer $x$, an **inverse** of $a$. Whether $a$ is a unit depends only on its class. $U(n)$ is the set of residues mod $n$ that are units, and **Euler's function** $\varphi(n)$ is the number of them; $\varphi(1) = 1$ by convention.
^unit-def

> [!thm] Theorem 1 (which residues are units)
> $a$ is a unit mod $n$ exactly when $\gcd(a, n) = 1$. The inverse is unique mod $n$ and is written $a^{-1}$; products and inverses of units are units. So $\varphi(n)$ counts the $k \in \{1, \dots, n\}$ coprime to $n$, and $\varphi(p) = p - 1$ for a prime $p$.
^unit-gcd

> [!proof]- Proof (d 2)
> 1. If $ax \equiv 1$, then $ax - ny = 1$ for some $y$, and a common divisor of $a$ and $n$ divides $1$.
> 2. If $\gcd(a, n) = 1$, Bézout gives $ax + ny = 1$, which read mod $n$ is $ax \equiv 1$.
> 3. If $ax \equiv 1$ and $ax' \equiv 1$, then $x \equiv x(ax') = (xa)x' \equiv x'$.
> 4. If $ax \equiv 1$ and $by \equiv 1$, then $(ab)(xy) \equiv 1$; and $xa \equiv 1$ says $x$ is a unit with inverse $a$.
> 5. For a prime $p$, every $k$ with $1 \le k \le p - 1$ has $\gcd(k, p) = 1$, since $p$'s only positive divisors are $1$ and $p$.
^p-unit-gcd

Under multiplication, $U(n)$ is the first example of a [group](alg-groups.md#^group-def). ^unit-group

> [!example] An inverse mod 100
> Find the inverse of $23$ mod $100$.
^ex-inverse

> [!solution]- Solution
> methods: euclid, bezout
> 1. $100 = 4 \cdot 23 + 8$, $\ 23 = 2 \cdot 8 + 7$, $\ 8 = 1 \cdot 7 + 1$.
> 2. Back up: $1 = 8 - 7 = 8 - (23 - 2 \cdot 8) = 3 \cdot 8 - 23 = 3(100 - 4 \cdot 23) - 23 = 3 \cdot 100 - 13 \cdot 23$.
> 3. So $23^{-1} \equiv -13 \equiv 87$. Check: $23 \cdot 87 = 2001$.

> [!thm] Theorem 2 (linear congruences)
> Let $g = \gcd(a, n)$. The congruence $ax \equiv b \pmod n$ has a solution exactly when $g \mid b$. Then its solutions form one class mod $n/g$, which is $g$ classes mod $n$.
^lin-cong

> [!proof]- Proof (d 2)
> 1. $ax \equiv b \pmod n$ says $ax + ny = b$ for some integer $y$; by Bézout this is solvable exactly when $g \mid b$.
> 2. If $x_0$ is a solution, then $ax \equiv b$ is $ax \equiv ax_0$, which by cancelling holds exactly when $x \equiv x_0 \pmod{n/g}$.
> 3. The class of $x_0$ mod $n/g$ is $g$ classes mod $n$: $x_0 + k(n/g)$ for $k = 0, \dots, g - 1$.
^p-lin-cong

> [!example] A congruence with a shared factor
> Solve $12x \equiv 18 \pmod{30}$.
^ex-lin-cong

> [!solution]- Solution
> methods: nt-congruence/lin-cong
> 1. $\gcd(12, 30) = 6$ divides $18$, so there are $6$ solutions mod $30$.
> 2. Cancel $6$: $2x \equiv 3 \pmod 5$. The inverse of $2$ mod $5$ is $3$, so $x \equiv 9 \equiv 4 \pmod 5$.
> 3. Mod $30$: $x \equiv 4, 9, 14, 19, 24, 29$.

## The Chinese remainder theorem

> [!thm] Theorem 3 (Chinese remainder theorem)
> Let $n_1, \dots, n_k$ be pairwise coprime and $N = n_1 n_2 \cdots n_k$. For any integers $a_1, \dots, a_k$ the system $x \equiv a_i \pmod{n_i}$ ($i = 1, \dots, k$) has a solution, and any two solutions are congruent mod $N$. Equivalently, $x \bmod N \mapsto (x \bmod n_1, \dots, x \bmod n_k)$ is a bijection from residues mod $N$ to $k$-tuples of residues, and it respects $+$ and $\times$.
^crt

> [!proof]- Proof (d 3)
> 1. Two coprime moduli $m, n$, uniqueness: if $x, y$ both solve, then $m \mid x - y$ and $n \mid x - y$. Write $x - y = mk$; $n \mid mk$ gives $n \mid k$ (Euclid's lemma), so $mn \mid x - y$.
> 2. Existence: Bézout gives $mu + nv = 1$. Put $x = a\,nv + b\,mu$. Mod $m$, $nv = 1 - mu \equiv 1$ and $mu \equiv 0$, so $x \equiv a$; mod $n$, symmetrically, $x \equiv b$.
> 3. If $\gcd(n_1, n_3) = \gcd(n_2, n_3) = 1$ then $\gcd(n_1 n_2, n_3) = 1$: a common prime factor of $n_1 n_2$ and $n_3$ would divide $n_1$ or $n_2$ (Euclid's lemma).
> 4. Steps 1 and 2 replace the first two congruences by one congruence mod $n_1 n_2$; by step 3 the moduli are still pairwise coprime. Repeating $k - 1$ times leaves one congruence mod $N$.
> 5. The map is well defined since each $n_i \mid N$. Step 4 says each tuple is hit exactly once, and it respects $+$ and $\times$ because reducing mod $n_i$ does.
^p-crt

> [!example] Three remainders
> Find all $x$ with $x \equiv 2 \pmod 5$, $x \equiv 3 \pmod 7$ and $x \equiv 4 \pmod 9$.
^ex-crt

> [!solution]- Solution
> methods: crt
> 1. $x = 2 + 5s$ and $5s \equiv 1 \pmod 7$; since $5 \cdot 3 = 15 \equiv 1$, $s \equiv 3$ and $x \equiv 17 \pmod{35}$.
> 2. $x = 17 + 35t$ and mod $9$: $8 + 8t \equiv 4$, so $-t \equiv 5$, $t \equiv 4$, $x = 157$.
> 3. Answer $x \equiv 157 \pmod{315}$.

> [!thm] Corollary 4 (counting roots by splitting)
> Let $f$ have integer coefficients and let $m, n$ be coprime. If $f(x) \equiv 0$ has $N_m$ solutions mod $m$ and $N_n$ solutions mod $n$, it has $N_m N_n$ solutions mod $mn$.
^crt-count

> [!proof]- Proof
> 1. $f(x) \bmod m$ depends only on $x \bmod m$ (congruences add and multiply).
> 2. $mn \mid f(x)$ exactly when $m \mid f(x)$ and $n \mid f(x)$, by step 1 of Theorem 3's proof applied to $f(x)$ and $0$.
> 3. So under the bijection of Theorem 3, solutions mod $mn$ match pairs (solution mod $m$, solution mod $n$).
^p-crt-count

> [!thm] Theorem 5 (units split)
> For coprime $m, n$, an integer is a unit mod $mn$ exactly when it is a unit mod $m$ and a unit mod $n$. The bijection of Theorem 3 carries $U(mn)$ onto $U(m) \times U(n)$, so $\varphi(mn) = \varphi(m)\varphi(n)$.
^crt-units

> [!proof]- Proof
> 1. $\gcd(x, mn) = 1$ exactly when $\gcd(x, m) = \gcd(x, n) = 1$: a common factor with $m$ or $n$ is one with $mn$, and a prime dividing $x$ and $mn$ divides $m$ or $n$ (Euclid's lemma).
> 2. By Theorem 1 that says: $x$ is a unit mod $mn$ exactly when its residues mod $m$ and mod $n$ are units. Count the pairs.
^p-crt-units

> [!thm] Theorem 6 (formula for φ)
> For a prime power, $\varphi(p^e) = p^e - p^{e-1}$. For $n = p_1^{e_1} \cdots p_k^{e_k}$ with distinct primes $p_i$, $\varphi(n) = n \prod_i (1 - 1/p_i)$.
^phi-formula

> [!proof]- Proof
> 1. Among $1, \dots, p^e$, the ones sharing a factor with $p^e$ are the multiples of $p$, which number $p^{e-1}$.
> 2. Powers of distinct primes are pairwise coprime, so by Theorem 5 and induction $\varphi(n) = \prod_i \varphi(p_i^{e_i}) = \prod_i p_i^{e_i}(1 - 1/p_i)$.
^p-phi-formula

> [!example] Two values of φ
> Compute $\varphi(1000)$ and $\varphi(2026)$.
^ex-phi

> [!solution]- Solution
> methods: nt-congruence/phi-formula
> 1. $1000 = 2^3 5^3$: $\varphi = 1000 \cdot \tfrac12 \cdot \tfrac45 = 400$.
> 2. $2026 = 2 \cdot 1013$ with $1013$ prime: $\varphi = 1 \cdot 1012 = 1012$.
> 3. Coprimality matters: $\varphi(4) = 2$, but $\varphi(2)\varphi(2) = 1$.

> [!thm] Theorem 7 (divisor sum of φ)
> For every $n \ge 1$, $\sum_{d \mid n} \varphi(d) = n$, the sum over the positive divisors $d$ of $n$.
^phi-sum

> [!proof]- Proof (d 3)
> 1. Sort $k \in \{1, \dots, n\}$ by $g = \gcd(k, n)$, a divisor of $n$.
> 2. For $k = gj$: the least positive combination of $gj$ and $gn'$ (with $n = gn'$) is $g$ times that of $j$ and $n'$, so $\gcd(gj, n) = g\gcd(j, n')$ (Bézout).
> 3. So $\gcd(k, n) = g$ exactly when $k = gj$ with $1 \le j \le n/g$ and $\gcd(j, n/g) = 1$: there are $\varphi(n/g)$ such $k$.
> 4. Summing over $g \mid n$: $n = \sum_{g \mid n} \varphi(n/g)$, and $d = n/g$ runs over the divisors of $n$.
^p-phi-sum

## Wilson's theorem

> [!thm] Theorem 8 (Wilson)
> For a prime $p$, $(p - 1)! \equiv -1 \pmod p$. For composite $n > 4$, $(n - 1)! \equiv 0 \pmod n$, and $3! \equiv 2 \pmod 4$. So $n > 1$ is prime exactly when $(n - 1)! \equiv -1 \pmod n$.
^wilson

> [!proof]- Proof (d 3)
> 1. $p = 2$: $1! = 1 \equiv -1$. Let $p$ be odd.
> 2. $x^2 \equiv 1 \pmod p$ means $p \mid (x - 1)(x + 1)$, so $x \equiv \pm 1$ (Euclid's lemma).
> 3. The inverse of $\pm 1$ is itself, and inverses are unique, so by step 2 each of $2, \dots, p - 2$ has its inverse in $\{2, \dots, p - 2\}$ and different from itself. These numbers split into pairs $\{x, x^{-1}\}$, each with product $\equiv 1$.
> 4. Hence $(p - 1)! \equiv 1 \cdot 1 \cdot (p - 1) \equiv -1$.
> 5. Composite $n = ab$ with $1 < a < b < n$: both $a$ and $b$ appear in $(n - 1)!$, so $n \mid (n-1)!$.
> 6. Otherwise take $a$ the least prime factor of $n$: $n/a \ge a$ and $n/a$ cannot exceed $a$ (step 5), so $n = a^2$. If $a > 2$, then $a < 2a < a^2$, so $a$ and $2a$ both appear and $a^2 \mid (n-1)!$. The case $a = 2$ is $n = 4$.
> 7. The last sentence: $(n-1)! \equiv -1$ fails for $n = 4$ ($2 \not\equiv 3$) and for composite $n > 4$ ($0 \not\equiv -1$).
^p-wilson

## Problems

> [!problem] Remainders 2, 3, 5 (d 2)
> Find the least positive integer that leaves remainders $2$, $3$ and $5$ on division by $7$, $11$ and $13$ respectively.
^inv-nt-three-remainders

> [!solution]- Solution
> methods: crt
> 1. $x = 2 + 7s$ with $7s \equiv 1 \pmod{11}$; $7 \cdot 8 = 56 \equiv 1$, so $s \equiv 8$, $x \equiv 58 \pmod{77}$.
> 2. $x = 58 + 77t$; mod $13$, $58 \equiv 6$ and $77 \equiv -1$, so $6 - t \equiv 5$, $t \equiv 1$.
> Answer: $135$.

> [!problem] Numbers whose square ends like themselves (d 3)
> Find the sum of all $n$ with $1 \le n \le 10^4$ such that $10^4$ divides $n^2 - n$.
^inv-nt-square-ends-same

> [!solution]- Solution
> methods: crt, nt-divisibility/euclid-lemma
> 1. $n^2 - n = n(n - 1)$ with $\gcd(n, n - 1) = 1$. A prime $p$ divides at most one of them, and then $p^4$ is coprime to the other, so by Euclid's lemma $p^4$ divides that one. So $2^4$ divides $n$ or $n - 1$, and so does $5^4$.
> 2. Four systems mod $16$ and mod $625$: $(0, 0)$, $(1, 1)$, $(1, 0)$, $(0, 1)$, each with one solution mod $10^4$ (Theorem 3).
> 3. They are $0$ ($= 10^4$ in range), $1$, $625$ ($625 = 39 \cdot 16 + 1$) and $9376$ ($= 586 \cdot 16$, and $9375 = 15 \cdot 625$).
> Answer: $1 + 625 + 9376 + 10000 = 20002$.

> [!problem] The remainder of 100! mod 103 (d 2.5)
> Find the remainder of $100!$ on division by $103$.
^inv-nt-factorial-103

> [!solution]- Solution
> methods: nt-congruence/wilson
> 1. $103$ is prime, so $102! \equiv -1$.
> 2. $102! = 100! \cdot 101 \cdot 102 \equiv 100! \cdot (-2)(-1) = 2 \cdot 100!$.
> 3. $100! \equiv -2^{-1} \equiv -52 \equiv 51 \pmod{103}$, using $2 \cdot 52 = 104 \equiv 1$.
> Answer: $51$.

> [!problem] Square roots of 1 mod 720 (d 3.5)
> How many residues $x$ mod $720$ satisfy $x^2 \equiv 1 \pmod{720}$?
^inv-nt-roots-of-one-720

> [!solution]- Solution
> methods: crt, nt-congruence/crt-count
> 1. $720 = 16 \cdot 9 \cdot 5$; count mod each factor and multiply (Corollary 4).
> 2. Mod $5$ and mod $9$: $p^e \mid (x-1)(x+1)$ for odd $p$, and $p$ cannot divide both factors (they differ by $2$), so $x \equiv \pm 1$: $2$ solutions each.
> 3. Mod $16$: $x$ is odd, both factors are even, and one of them is $\equiv 2 \pmod 4$, so $8$ divides the other: $x \equiv \pm 1 \pmod 8$, which is $1, 7, 9, 15$ mod $16$.
> Answer: $4 \cdot 2 \cdot 2 = 16$.

> [!problem] Moduli where every unit squares to 1 (d 4.5)
> Find all $n \ge 2$ such that $u^2 \equiv 1 \pmod n$ for every integer $u$ coprime to $n$.
^inv-nt-units-square-one

> [!solution]- Solution
> methods: crt, nt-congruence/crt-units
> 1. If $n = n_1 n_2$ with coprime factors and the property holds mod $n$, it holds mod $n_1$: a unit $u_1$ mod $n_1$ is the residue of some $u \equiv u_1 \pmod{n_1}$, $u \equiv 1 \pmod{n_2}$, a unit mod $n$ (Theorem 5).
> 2. So the property passes to each prime power dividing $n$. If a prime $p \ge 5$ divides $n$: $2^2 = 4 \not\equiv 1 \pmod p$. If $9 \mid n$: $2^2 \not\equiv 1 \pmod 9$. If $16 \mid n$: $3^2 = 9 \not\equiv 1 \pmod{16}$.
> 3. Hence $n \mid 2^3 \cdot 3 = 24$.
> 4. Conversely, let $n \mid 24$ and $\gcd(u, n) = 1$. If $n$ is even, $u$ is odd and $8 \mid u^2 - 1$ ([odd squares](nt-divisibility.md#^ex-odd-square)); if $3 \mid n$, $3 \nmid u$ and $3 \mid u^2 - 1$. So $n \mid u^2 - 1$.
> Answer: $n = 2, 3, 4, 6, 8, 12, 24$.

> [!problem] φ(n) equal to n/3 (d 3.5)
> Find all positive integers $n$ with $\varphi(n) = n/3$.
^inv-nt-phi-third

> [!solution]- Solution
> methods: nt-congruence/phi-formula, parity
> 1. By Theorem 6 the condition is $\prod_{p \mid n} p = 3 \prod_{p \mid n} (p - 1)$, the products over the distinct primes dividing $n$.
> 2. So $3 \mid n$. Cancel the factor $3/2$ of $p = 3$: for the set $S$ of the other primes dividing $n$, $\prod_{S} p = 2 \prod_{S} (p - 1)$.
> 3. The right side is even, so $2 \in S$; cancel $p = 2$: $\prod_{S \setminus \{2\}} p = \prod_{S \setminus \{2\}} (p - 1)$, and each factor $p/(p-1) > 1$, so $S = \{2\}$.
> Answer: $n = 2^a 3^b$ with $a, b \ge 1$.

## Derive

> [!derive] Prove that $x \equiv a \pmod m$, $x \equiv b \pmod n$ has a solution exactly when $\gcd(m, n) \mid a - b$, and that it is then unique mod $\operatorname{lcm}(m, n)$. (d 3)
^d-crt-general

> [!solution]- Solution
> methods: nt-congruence/lin-cong
> 1. Let $g = \gcd(m, n)$. A solution is $\equiv a$ and $\equiv b$ mod $g$, so $g \mid a - b$.
> 2. Conversely, $x = a + ms$ solves the second congruence exactly when $ms \equiv b - a \pmod n$. By Theorem 2 this holds for one class of $s$ mod $n/g$.
> 3. So $x$ is one class mod $m \cdot n/g$, which is $\operatorname{lcm}(m, n)$ ([valuation rules](nt-padic.md#^vp-rules)).

> [!derive] Prove that $\varphi(n) \ge \sqrt{n/2}$ for every $n \ge 1$. (d 3.5)
^d-phi-lower

> [!solution]- Solution
> methods: nt-congruence/phi-formula
> 1. By Theorem 6, $\varphi(n) = \prod p^{e-1}(p - 1)$ over the prime powers $p^e$ exactly dividing $n$.
> 2. Odd $p$: $(p - 1)^2 \ge p$, so $p^{e-1}(p-1) \ge p^{e-1}\sqrt p \ge p^{e/2}$.
> 3. $p = 2$: $2^{e-1} \ge 2^{e/2}/\sqrt 2$.
> 4. Multiply: $\varphi(n) \ge \sqrt n / \sqrt 2$, the factor $1/\sqrt 2$ appearing only when $n$ is even. Equality at $n = 2$.

> [!derive] Prove that for $n > 2$ the units in $\{1, \dots, n\}$ sum to $n\varphi(n)/2$, and that $\varphi(n)$ is even.
^d-unit-sum

> [!solution]- Solution
> methods: nt-congruence/unit-gcd
> 1. $u \mapsto n - u$ maps units to units, since $\gcd(n - u, n) = \gcd(u, n)$.
> 2. It has no fixed point: $u = n/2$ would share the factor $n/2 \ge 2$ with $n$. So the units split into pairs summing to $n$.
> 3. There are $\varphi(n)/2$ pairs, so $\varphi(n)$ is even and the sum is $n\varphi(n)/2$.

> [!derive] Prove that for a prime $p \equiv 1 \pmod 4$, $\left(\tfrac{p-1}{2}\right)!^2 \equiv -1 \pmod p$. (d 3.5)
^d-wilson-square

> [!solution]- Solution
> methods: nt-congruence/wilson
> 1. Pair $k$ with $p - k \equiv -k$ for $k = 1, \dots, (p-1)/2$: $(p-1)! \equiv (-1)^{(p-1)/2} \left(\tfrac{p-1}{2}\right)!^2$.
> 2. $(p-1)/2$ is even and $(p-1)! \equiv -1$.
