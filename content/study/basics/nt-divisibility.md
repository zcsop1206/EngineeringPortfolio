---
study: basic
id: nt-divisibility
title: Divisibility, gcd and unique factorisation
area: nt
needs: []
build: 1
tracks: [putnam]
---

> Written by a model for Adit. Not Adit's words.

Needs: nothing beyond integer arithmetic; the least-element and strong-induction arguments are the ones in [found-induction](found-induction.md#^well-ordering). Every other number theory basic stands on this one. ^needs

## Divisibility

> [!def] Divides
> For integers $a$ and $b$, $a$ **divides** $b$, written $a \mid b$, when $b = ak$ for some integer $k$; $a \nmid b$ says it does not. Every integer divides $0$, $0$ divides only $0$, and $\pm 1$ divide everything. If $a \mid b$ and $b \ne 0$ then $|a| \le |b|$, because $|k| \ge 1$.
^div-def

If $d \mid a$ and $d \mid b$, then $d \mid ax + by$ for all integers $x, y$: with $a = da'$ and $b = db'$, $ax + by = d(a'x + b'y)$. An expression $ax + by$ with integer $x, y$ is an **integer combination** of $a$ and $b$. Most arguments on this page are this line, used once. ^div-comb

> [!thm] Theorem 1 (division with remainder)
> For integers $a$ and $b$ with $b > 0$ there are unique integers $q$ and $r$ with $a = qb + r$ and $0 \le r < b$. Here $q$ is the **quotient** and $r$ the **remainder**, written $a \bmod b$.
^div-alg

> [!proof]- Proof (d 1.5)
> 1. Among the integers $a - qb$ with $q \in \mathbb{Z}$, some are $\ge 0$: $q = -|a|$ gives $a + |a|b \ge a + |a| \ge 0$. Let $r = a - qb$ be the least nonnegative one.
> 2. If $r \ge b$, then $r - b = a - (q+1)b$ is nonnegative and smaller than $r$. So $0 \le r < b$.
> 3. If also $a = q'b + r'$ with $0 \le r' < b$, then $(q - q')b = r' - r$ is a multiple of $b$ strictly between $-b$ and $b$, hence $0$. So $r' = r$ and $q' = q$.
^p-div-alg

The quotient is $\lfloor a/b \rfloor$, where the **floor** $\lfloor x \rfloor$ is the largest integer not exceeding $x$. Negative $a$ is where slips happen: $-17 = (-4) \cdot 5 + 3$, so $-17 \bmod 5 = 3$ and $\lfloor -17/5 \rfloor = -4$. ^floor

## Greatest common divisor

> [!def] gcd, coprime, lcm
> For $a, b$ not both $0$, $\gcd(a, b)$ is the largest integer dividing both. Signs do not matter, and $\gcd(a, 0) = |a|$. Two integers are **coprime** when their gcd is $1$. For nonzero $a, b$, the **least common multiple** $\operatorname{lcm}(a, b)$ is the least positive integer that both divide.
^gcd-def

> [!thm] Theorem 2 (Euclid's algorithm)
> For every integer $q$, $\gcd(a, b) = \gcd(b, a - qb)$. Starting from $a \ge 0$, $b > 0$ and repeatedly replacing $(a, b)$ by $(b, a \bmod b)$ reaches a pair $(g, 0)$ after finitely many steps, and $g = \gcd(a, b)$.
^euclid

> [!proof]- Proof (d 1.5)
> 1. A common divisor of $a$ and $b$ divides $a - qb$; a common divisor of $b$ and $a - qb$ divides $(a - qb) + qb = a$. So the two pairs have the same common divisors, hence the same greatest one.
> 2. Each step replaces the second entry $b$ by $a \bmod b \in \{0, \dots, b - 1\}$. A strictly decreasing sequence of nonnegative integers is finite, so some second entry is $0$.
> 3. At $(g, 0)$, $g$ was the previous second entry, so $g > 0$ and $\gcd(g, 0) = g$. By step 1 the gcd never changed, so $g = \gcd(a, b)$.
^p-euclid

> [!example] Two four-digit numbers
> Find $\gcd(1147, 851)$ and write it as an integer combination of $1147$ and $851$.
^ex-euclid

> [!solution]- Solution
> methods: euclid
> 1. $1147 = 1 \cdot 851 + 296$, $\ 851 = 2 \cdot 296 + 259$, $\ 296 = 1 \cdot 259 + 37$, $\ 259 = 7 \cdot 37 + 0$. So the gcd is $37$.
> 2. Read the lines from the bottom up: $37 = 296 - 259 = 296 - (851 - 2 \cdot 296) = 3 \cdot 296 - 851$.
> 3. Substitute $296 = 1147 - 851$: $37 = 3 \cdot 1147 - 4 \cdot 851$. Check: $3441 - 3404 = 37$.

> [!example] A gcd that depends on n
> For which positive integers $n$ is $\gcd(n^2 + 3, n + 2) > 1$, and what is it then?
^ex-gcd-expr

> [!solution]- Solution
> methods: euclid
> 1. $n^2 + 3 = (n + 2)(n - 2) + 7$, so by Theorem 2 $\gcd(n^2 + 3, n + 2) = \gcd(n + 2, 7)$.
> 2. That is $7$ when $7 \mid n + 2$, that is $n \equiv 5 \pmod 7$, and $1$ otherwise. Check $n = 5$: $\gcd(28, 7) = 7$.

> [!thm] Theorem 3 (Bézout)
> If $a, b$ are not both $0$, then $\gcd(a, b)$ is the least positive integer combination of $a$ and $b$. Consequently every common divisor of $a$ and $b$ divides $\gcd(a, b)$, and $ax + by = c$ has an integer solution exactly when $\gcd(a, b) \mid c$.
^bezout

> [!proof]- Proof (d 2.5)
> 1. Positive combinations exist: $a \cdot a + b \cdot b > 0$. Let $g = ax_0 + by_0$ be the least one.
> 2. Divide: $a = sg + r$ with $0 \le r < g$. Then $r = a(1 - sx_0) + b(-sy_0)$ is a combination smaller than $g$, so it is not positive: $r = 0$ and $g \mid a$. Likewise $g \mid b$.
> 3. A common divisor $d$ of $a$ and $b$ divides $ax_0 + by_0 = g$, so $d \le g$. Hence $g = \gcd(a, b)$, and every common divisor divides it.
> 4. If $ax + by = c$, then $\gcd(a, b) \mid c$ by the combination rule. If $c = kg$, then $x = kx_0$, $y = ky_0$ is a solution.
^p-bezout

## Primes and factorisation

> [!def] Prime
> An integer $p > 1$ is **prime** if its only positive divisors are $1$ and $p$; an integer $n > 1$ that is not prime is **composite**. Every $n > 1$ has a prime divisor: its least divisor greater than $1$, since any divisor of that one would be a smaller divisor of $n$.
^prime-def

> [!thm] Theorem 4 (Euclid's lemma)
> If $n \mid ab$ and $\gcd(n, a) = 1$, then $n \mid b$. In particular, a prime that divides a product divides one of the factors.
^euclid-lemma

> [!proof]- Proof (d 2)
> 1. Bézout gives integers $x, y$ with $nx + ay = 1$.
> 2. Multiply by $b$: $b = n(bx) + (ab)y$. Both terms are multiples of $n$, so $n \mid b$.
> 3. For a prime $p$ with $p \mid ab$ and $p \nmid a$: the positive divisors of $p$ are $1$ and $p$, so $\gcd(p, a) = 1$, and step 2 gives $p \mid b$.
^p-euclid-lemma

> [!thm] Corollary 5 (all solutions of a linear equation)
> Let $a, b$ be nonzero, $g = \gcd(a, b)$, and let $(x_0, y_0)$ solve $ax + by = c$. The integer solutions are exactly $x = x_0 + (b/g)t$, $y = y_0 - (a/g)t$ for $t \in \mathbb{Z}$.
^lin-dioph

> [!proof]- Proof (d 2)
> 1. Substituting shows each such pair is a solution: the added terms $a(b/g)t - b(a/g)t$ cancel.
> 2. For any solution, subtract: $a(x - x_0) = -b(y - y_0)$; divide by $g$: $(a/g)(x - x_0) = -(b/g)(y - y_0)$.
> 3. $\gcd(a/g, b/g) = 1$: divide a Bézout identity $ax' + by' = g$ by $g$.
> 4. Euclid's lemma gives $(b/g) \mid x - x_0$. Write $x - x_0 = (b/g)t$; then step 2 gives $y - y_0 = -(a/g)t$.
^p-lin-dioph

> [!thm] Theorem 6 (unique factorisation)
> Every integer $n > 1$ is a product of primes, and two such products for the same $n$ contain the same primes with the same multiplicities. So $n = \prod_p p^{e_p}$ with exponents $e_p \ge 0$ determined by $n$; the exponent of $p$ is studied as the valuation $v_p(n)$ in [nt-padic](nt-padic.md#^vp-def).
^fta

> [!proof]- Proof (d 2.5)
> 1. Existence, by strong induction on $n$: a prime is a product of one prime; otherwise $n = uv$ with $1 < u, v < n$, and both are products of primes.
> 2. Uniqueness: suppose $p_1 p_2 \cdots p_k = q_1 q_2 \cdots q_m$ with all factors prime.
> 3. $p_1$ divides the right side, so by Euclid's lemma, applied to $q_1 \cdot (q_2 \cdots q_m)$ and repeated, $p_1 \mid q_j$ for some $j$. A prime dividing a prime equals it: $p_1 = q_j$.
> 4. Cancel $p_1$ against $q_j$ and repeat, by induction on $k$. If one side runs out it equals $1$, so the other has run out too, since a product of primes exceeds $1$.
^p-fta

## Congruences

> [!def] Congruence
> Fix $n \ge 1$, the **modulus**. $a \equiv b \pmod n$ means $n \mid a - b$. This relation is reflexive ($a \equiv a$), symmetric ($a \equiv b$ gives $b \equiv a$) and transitive ($a \equiv b$, $b \equiv c$ give $a \equiv c$, adding the differences), so it sorts the integers into **classes**. By Theorem 1 each integer is congruent to exactly one of $0, 1, \dots, n - 1$, its remainder; these are the **residues** mod $n$, one per class.
^cong-def

> [!thm] Theorem 7 (congruences add and multiply)
> If $a \equiv a'$ and $b \equiv b' \pmod n$, then $a \pm b \equiv a' \pm b'$ and $ab \equiv a'b' \pmod n$. So in any expression built from $+$, $-$, $\times$ and fixed powers, any integer may be replaced by one congruent to it without changing the class of the result.
^cong-arith

> [!proof]- Proof
> 1. Write $a' = a + sn$ and $b' = b + tn$.
> 2. $a' \pm b' = (a \pm b) + (s \pm t)n$.
> 3. $a'b' = ab + (at + bs + stn)n$.
> 4. Powers by induction: $a'^{k+1} = a'^k a' \equiv a^k a$. An expression is built one operation at a time, so replacements can be made one at a time.
^p-cong-arith

> [!trap] Reducing an exponent mod n
> The exponent is not a term of the expression: $3 \equiv 0 \pmod 3$, yet $2^3 = 8 \equiv 2$ while $2^0 = 1$. Exponents reduce modulo the order of the base ([alg-groups](alg-groups.md#^order-divides)), not modulo $n$.
^trap-exponent

> [!thm] Theorem 8 (cancelling)
> Let $g = \gcd(c, n)$. Then $ca \equiv cb \pmod n$ exactly when $a \equiv b \pmod{n/g}$. In particular a factor coprime to $n$ cancels, and a factor sharing a prime with $n$ does not: $2 \cdot 3 \equiv 2 \cdot 0 \pmod 6$, yet $3 \not\equiv 0$.
^cong-cancel

> [!proof]- Proof (d 2)
> 1. $ca \equiv cb \pmod n$ means $n \mid c(a - b)$.
> 2. With $n = gn'$ and $c = gc'$, this is $n' \mid c'(a - b)$ (divide by $g$).
> 3. $\gcd(n', c') = 1$: divide a Bézout identity $nx + cy = g$ by $g$.
> 4. By Euclid's lemma, $n' \mid c'(a - b)$ exactly when $n' \mid a - b$. (The converse direction is clear.)
^p-cong-cancel

> [!example] Two digit tests
> Is $918082$ divisible by $9$? By $11$?
^ex-digits

> [!solution]- Solution
> methods: reduce-mod-small
> 1. A number with decimal digits $d_k \dots d_1 d_0$ is $\sum d_i 10^i$. Since $10 \equiv 1 \pmod 9$, Theorem 7 gives $\sum d_i 10^i \equiv \sum d_i \pmod 9$.
> 2. Digit sum $9 + 1 + 8 + 0 + 8 + 2 = 28 \equiv 1 \pmod 9$: not divisible by $9$.
> 3. Since $10 \equiv -1 \pmod{11}$, the number is $\equiv d_0 - d_1 + d_2 - \cdots \pmod{11}$: here $2 - 8 + 0 - 8 + 1 - 9 = -22 \equiv 0$. Divisible by $11$; indeed $918082 = 11 \cdot 83462$.

> [!example] Odd squares
> Show that every odd square is $\equiv 1 \pmod 8$, and list the squares mod $9$.
^ex-odd-square

> [!solution]- Solution
> methods: reduce-mod-small
> 1. $(2k + 1)^2 = 4k(k + 1) + 1$, and one of $k, k + 1$ is even, so $8 \mid 4k(k+1)$.
> 2. Mod $9$, square the residues $0, \dots, 8$: $0, 1, 4, 0, 7, 7, 0, 4, 1$. The squares are $0, 1, 4, 7$. Mod $8$ they are $0, 1, 4$; mod $3$ and mod $4$, $0, 1$.

## Problems

> [!problem] Neighbouring values of n² + 1 (d 3)
> Find all positive integers $n$ for which $n^2 + 1$ and $(n + 1)^2 + 1$ have a common factor greater than $1$, and find that common factor.
^inv-nt-neighbour-squares

> [!solution]- Solution
> methods: euclid, nt-divisibility/euclid-lemma
> 1. $(n+1)^2 + 1 - (n^2 + 1) = 2n + 1$, so the gcd is $\gcd(n^2 + 1, 2n + 1)$.
> 2. A common divisor of $2n + 1$ and $4(n^2 + 1)$ is odd, hence coprime to $4$, hence divides $n^2 + 1$ (Euclid's lemma). So $\gcd(n^2 + 1, 2n + 1) = \gcd(4n^2 + 4, 2n + 1)$.
> 3. $4n^2 + 4 = (2n + 1)(2n - 1) + 5$, so this is $\gcd(2n + 1, 5)$.
> 4. It exceeds $1$ exactly when $5 \mid 2n + 1$, that is $n \equiv 2 \pmod 5$, and then the gcd is $5$.
> Answer: $n \equiv 2 \pmod 5$, common factor $5$ (for $n = 2$: $5$ and $10$).

> [!problem] Paying 2026 in sevens and elevens (d 2.5)
> In how many ways can $2026$ be written as $7x + 11y$ with nonnegative integers $x, y$?
^inv-nt-sevens-elevens

> [!solution]- Solution
> methods: bezout, nt-divisibility/lin-dioph
> 1. One solution: $x = 5$, $y = 181$ ($35 + 1991 = 2026$).
> 2. All integer solutions: $x = 5 + 11t$, $y = 181 - 7t$ (Corollary 5, $\gcd = 1$).
> 3. $x \ge 0$ needs $t \ge 0$; $y \ge 0$ needs $t \le 25$.
> Answer: $26$.

> [!problem] The largest unpayable amount (d 4)
> Coins come in values $9$ and $14$, as many of each as wanted. Find the largest amount that cannot be paid exactly, and prove that every larger amount can.
^inv-nt-unpayable

> [!solution]- Solution
> methods: nt-divisibility/lin-dioph
> 1. For each integer $m$, the solutions of $9x + 14y = m$ are $(x_0 + 14t, y_0 - 9t)$, so exactly one has $0 \le x \le 13$. Call its $y$-value $y(m)$.
> 2. Any other solution with $x \ge 0$ has larger $x$ and so smaller $y$. Hence $m$ is payable exactly when $y(m) \ge 0$.
> 3. If $y(m) \le -1$ then $m = 9x + 14y(m) \le 9 \cdot 13 - 14 = 103$.
> 4. $103 = 9 \cdot 13 + 14 \cdot (-1)$ with $0 \le 13 \le 13$, so $y(103) = -1$ and $103$ is not payable; every $m > 103$ has $y(m) \ge 0$.
> Answer: $103$ ($= 9 \cdot 14 - 9 - 14$).

> [!problem] A quadratic dividing a quartic (d 4)
> Find all positive integers $n$ such that $n^2 + n + 1$ divides $n^4 + 3n^2 + 2027$.
^inv-nt-quadratic-quartic

> [!solution]- Solution
> methods: reduce-mod-small, nt-divisibility/cong-cancel
> 1. Let $D = n^2 + n + 1$. Mod $D$, $n^2 \equiv -n - 1$, so $n^4 \equiv (n + 1)^2 \equiv n$, and the quartic is $\equiv n - 3n - 3 + 2027 = 2024 - 2n$.
> 2. $D = n(n+1) + 1$ is odd, so $2$ cancels: the condition is $D \mid 1012 - n$, that is $n \equiv 1012 \pmod D$.
> 3. Then $0 \equiv n^2 + n + 1 \equiv 1012^2 + 1012 + 1 = 1025157 \pmod D$ (Theorem 7), so $D \mid 1025157 = 3 \cdot 7 \cdot 48817$.
> 4. The divisors of the form $n^2 + n + 1$ are $3, 7, 21, 1025157$ ($n = 1, 2, 4, 1012$); the other divisors $48817$, $146451$, $341719$ fall strictly between consecutive values of $n^2 + n + 1$.
> 5. Test step 2: $3 \mid 1011$ yes; $7 \mid 1010$ no; $21 \mid 1008$ yes; $n = 1012$ yes.
> Answer: $n = 1, 4, 1012$.

> [!problem] Factoring among the even numbers (d 2.5)
> Work only with the positive even integers. Call one of them *even-irreducible* if it is not a product of two positive even integers. Show that every positive even integer is a product of even-irreducibles, and find the least one that has two different such factorisations (order of factors ignored).
^inv-nt-even-world

> [!solution]- Solution
> methods: factorisation
> 1. $m$ is even-irreducible exactly when $m = 2u$ with $u$ odd: a product of two evens is divisible by $4$, and if $4 \mid m$ then $m = 2 \cdot (m/2)$ with $m/2$ even.
> 2. Existence: $m = 2^k u$ with $u$ odd is $2 \cdot 2 \cdots 2 \cdot (2u)$, $k$ factors.
> 3. A product of $k$ even-irreducibles is $2^k$ times an odd number, so every factorisation of $2^k u$ is $(2u_1)\cdots(2u_k)$ with odd $u_1 \cdots u_k = u$. Two factorisations differ exactly when $u$ splits into $k$ odd factors in two ways.
> 4. $k = 1$ is unique. For $k = 2$, $u = 1, 3, 5, 7$ split only as $1 \cdot u$, and $u = 9 = 1 \cdot 9 = 3 \cdot 3$, giving $36$. For $k \ge 3$, $m \ge 8 \cdot 9 = 72$.
> Answer: $36 = 2 \cdot 18 = 6 \cdot 6$. Here $6 \mid 2 \cdot 18$ with $6$ dividing neither factor: Euclid's lemma is what fails.

> [!problem] Two numbers of the form 2^k + 1 (d 4.5)
> Find $\gcd(2^{60} + 1, 2^{84} + 1)$.
^inv-nt-two-power-plus-one

> [!solution]- Solution
> methods: euclid, nt-divisibility/d-gcd-mersenne, nt-divisibility/euclid-lemma
> 1. Let $g$ be the gcd. $2^{60} + 1 \mid 2^{120} - 1$ and $2^{84} + 1 \mid 2^{168} - 1$, so $g \mid \gcd(2^{120} - 1, 2^{168} - 1) = 2^{24} - 1$ by the [derive prompt](#^d-gcd-mersenne).
> 2. $2^{24} - 1 = (2^{12} - 1)(2^{12} + 1)$.
> 3. A prime $p$ dividing $g$ and $2^{12} - 1$ would give $2^{12} \equiv 1$, so $2^{60} \equiv 1$, while $2^{60} \equiv -1 \pmod p$; then $p \mid 2$, but $g$ is odd. So $\gcd(g, 2^{12} - 1) = 1$ and $g \mid 2^{12} + 1$ (Euclid's lemma).
> 4. With $y = 2^{12}$: $y + 1 \mid y^5 + 1$ and $y + 1 \mid y^7 + 1$, because $y \equiv -1$ gives $y^{\text{odd}} \equiv -1$. So $2^{12} + 1 \mid g$.
> Answer: $4097$.

## Derive

> [!derive] Prove that if $\gcd(a, b) = 1$, $a \mid c$ and $b \mid c$, then $ab \mid c$.
^d-coprime-product

> [!solution]- Solution
> methods: nt-divisibility/euclid-lemma
> 1. Write $c = ak$. Then $b \mid ak$ with $\gcd(b, a) = 1$, so $b \mid k$, and $ab \mid ak = c$.

> [!derive] Prove that there are infinitely many primes, and infinitely many primes $\equiv 3 \pmod 4$. (d 3.5)
^d-primes-3-mod-4

> [!solution]- Solution
> methods: nt-divisibility/prime-def, reduce-mod-small
> 1. Given primes $p_1, \dots, p_k$, the number $p_1 \cdots p_k + 1$ has a prime divisor, which is no $p_i$ (it would divide $1$).
> 2. Given primes $p_1, \dots, p_k \equiv 3 \pmod 4$, let $N = 4p_1 \cdots p_k - 1 \equiv 3 \pmod 4$. $N$ is odd, so its prime factors are odd.
> 3. A product of numbers $\equiv 1 \pmod 4$ is $\equiv 1$, so some prime factor $q$ of $N$ is $\equiv 3 \pmod 4$; $q = p_i$ would give $q \mid 1$.

> [!derive] Prove that if $a, b$ are coprime positive integers and $ab$ is a perfect square, then $a$ and $b$ are perfect squares. (d 2.5)
^d-coprime-square

> [!solution]- Solution
> methods: factorisation
> 1. A positive integer is a square exactly when every exponent in its factorisation is even (Theorem 6).
> 2. Each prime $p$ divides at most one of $a, b$, so its exponent in $a$ is either $0$ or its exponent in $ab$, which is even. The same for $b$.

> [!derive] Prove that $\gcd(2^m - 1, 2^n - 1) = 2^{\gcd(m, n)} - 1$ for positive integers $m, n$. (d 4)
^d-gcd-mersenne

> [!solution]- Solution
> methods: euclid
> 1. For $m > n$: $2^m - 1 = 2^{m-n}(2^n - 1) + (2^{m-n} - 1)$, so by Theorem 2 $\gcd(2^m - 1, 2^n - 1) = \gcd(2^n - 1, 2^{m-n} - 1)$.
> 2. Also $\gcd(m, n) = \gcd(n, m - n)$. Both pairs change by the same rule, so by induction on $m + n$ they stay matched until the exponents are equal at $\gcd(m, n)$, where both sides equal $2^{\gcd(m,n)} - 1$.
