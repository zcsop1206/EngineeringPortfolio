---
study: basic
id: alg-polynomials
title: "Polynomials: division, roots and roots of unity"
area: nt
needs: [nt-divisibility]
build: 1
tracks: [putnam]
---

> Written by a model for Adit. Not Adit's words.

Needs: [division with remainder](nt-divisibility.md#^div-alg), [Euclid's lemma](nt-divisibility.md#^euclid-lemma), [units mod p](nt-congruence.md#^unit-gcd) (for the field $\mathbb{Z}/p$), and [binomial coefficients](comb-binomial.md#^binom-def) with [Pascal's rule](comb-binomial.md#^pascal) for the finite-difference section. ^needs

## Polynomials over a field

> [!def] Field
> A **field** is a set $F$ with addition and multiplication obeying the usual laws (both associative and commutative, multiplication distributing over addition, a $0$ and a $1 \ne 0$, negatives) in which every nonzero element has a multiplicative inverse. $\mathbb{Q}$, $\mathbb{R}$, $\mathbb{C}$ are fields, and so is $\mathbb{Z}/p$, the residues mod a prime $p$, because every nonzero residue is a unit. $\mathbb{Z}$ and $\mathbb{Z}/6$ are not. In a field $ab = 0$ forces $a = 0$ or $b = 0$: multiply by $a^{-1}$.
^field-def

> [!def] Polynomial, degree, root
> A **polynomial** over $F$ is $p(x) = a_n x^n + \dots + a_1 x + a_0$ with coefficients in $F$; two are equal when all their coefficients agree. $F[x]$ is the set of them, and $\mathbb{Z}[x]$ those with integer coefficients. If $a_n \ne 0$, $p$ has **degree** $n$ and **leading coefficient** $a_n$; it is **monic** if $a_n = 1$. The zero polynomial has no degree. A **root** of $p$ is $r \in F$ with $p(r) = 0$. Over a field $\deg(pq) = \deg p + \deg q$, since the leading coefficients multiply to a nonzero product. Over $\mathbb{Z}/6$ this fails: $(2x + 1)(3x + 1) = 5x + 1$.
^poly-def

> [!thm] Theorem 1 (division with remainder)
> Let $F$ be a field and $g \ne 0$ in $F[x]$. For every $f$ there are unique $q, r$ with $f = qg + r$ and $r = 0$ or $\deg r < \deg g$. If $f, g \in \mathbb{Z}[x]$ and $g$ is monic, then $q, r \in \mathbb{Z}[x]$.
^poly-div

> [!proof]- Proof (d 1.5)
> 1. Existence by induction on $\deg f$. If $f = 0$ or $\deg f < \deg g$, take $q = 0$, $r = f$.
> 2. Otherwise, with leading terms $ax^n$ of $f$ and $bx^m$ of $g$, $f_1 = f - \frac{a}{b}x^{n-m}g$ is $0$ or of lower degree. By induction $f_1 = q_1 g + r$, and $q = q_1 + \frac{a}{b}x^{n-m}$.
> 3. Uniqueness: $qg + r = q'g + r'$ gives $(q - q')g = r' - r$. If $q \ne q'$ the left side has degree $\ge \deg g$, the right side less. So $q = q'$ and $r = r'$.
> 4. When $b = 1$ every $a/b$ is an integer, so each step stays in $\mathbb{Z}[x]$.
^p-poly-div

> [!thm] Theorem 2 (factor theorem)
> For $r \in F$, $p(r) = 0$ exactly when $x - r$ divides $p$. For $P \in \mathbb{Z}[x]$ and integers $a \ne b$, $a - b$ divides $P(a) - P(b)$.
^factor-thm

> [!proof]- Proof
> 1. Divide by the monic $x - r$: $p = (x - r)q + c$ with $c$ a constant. Put $x = r$: $c = p(r)$.
> 2. $P(a) - P(b) = \sum_k c_k (a^k - b^k)$ and $a^k - b^k = (a - b)(a^{k-1} + a^{k-2}b + \dots + b^{k-1})$.
^p-factor-thm

> [!thm] Theorem 3 (roots over a field)
> A nonzero polynomial of degree $n$ over a field has at most $n$ roots. Hence two polynomials of degree at most $n$ that agree at $n + 1$ points are equal, and a polynomial that vanishes at infinitely many points is $0$.
^field-roots

> [!proof]- Proof (d 2)
> 1. Induction on $n$. Degree $0$: a nonzero constant has no root.
> 2. If $r$ is a root, $p = (x - r)q$ with $\deg q = n - 1$ (Theorem 2 and the degree rule).
> 3. Another root $s \ne r$ gives $(s - r)q(s) = 0$ with $s - r \ne 0$, so $q(s) = 0$. By induction $q$ has at most $n - 1$ roots, so $p$ has at most $n$.
> 4. The difference of two polynomials of degree at most $n$ agreeing at $n + 1$ points is $0$ or has degree at most $n$ with $n + 1$ roots; so it is $0$.
^p-field-roots

> [!trap] Roots mod a composite
> Over $\mathbb{Z}/8$, which is not a field, $x^2 - 1$ has the four roots $1, 3, 5, 7$. Theorem 3 needs a field, as in $\mathbb{Z}/p$.
^trap-composite-roots

Over $\mathbb{C}$, every polynomial of degree $n \ge 1$ has a root (the fundamental theorem of algebra, used here without proof), so by Theorem 2 it factors as $a_n \prod_{i=1}^n (x - r_i)$. A root $r$ has **multiplicity** $k$ if $(x - r)^k$ divides $p$ and $(x - r)^{k+1}$ does not. ^fta-complex

The **derivative** of $p = \sum a_k x^k$ over any field is $p' = \sum k a_k x^{k-1}$, defined by this formula. It obeys $(p + q)' = p' + q'$ and the product rule $(pq)' = p'q + pq'$: check it on $x^i \cdot x^j$, where both sides are $(i + j)x^{i+j-1}$, and extend by distributivity. ^formal-derivative

> [!thm] Theorem 4 (repeated roots)
> $r$ is a root of multiplicity at least $2$ exactly when $p(r) = p'(r) = 0$.
^mult-root

> [!proof]- Proof
> 1. If $p(r) \ne 0$ both sides fail. Otherwise $p = (x - r)q$.
> 2. Product rule: $p' = q + (x - r)q'$, so $p'(r) = q(r)$.
> 3. Multiplicity at least $2$ means $(x - r) \mid q$, which is $q(r) = 0$, which is $p'(r) = 0$.
^p-mult-root

> [!thm] Theorem 5 (Vieta)
> If $p = a_n \prod_{i=1}^n (x - r_i)$, then for $1 \le k \le n$ the **elementary symmetric sum** $e_k = \sum_{i_1 < \dots < i_k} r_{i_1} \cdots r_{i_k}$ equals $(-1)^k a_{n-k}/a_n$. In particular $\sum r_i = -a_{n-1}/a_n$ and $\prod r_i = (-1)^n a_0/a_n$.
^vieta

> [!proof]- Proof
> 1. Expanding $\prod (x - r_i)$, each term picks $x$ or $-r_i$ from every factor; picking $-r_i$ from exactly $k$ factors gives $x^{n-k}$, so its coefficient is $(-1)^k e_k$.
> 2. Multiply by $a_n$ and compare coefficients.
^p-vieta

> [!example] A fifth power sum
> Let $r, s, t$ be the roots of $x^3 - x - 1$. Compute $r^5 + s^5 + t^5$.
^ex-power-sum

> [!solution]- Solution
> methods: vieta
> 1. Vieta: $r + s + t = 0$, $rs + st + tr = -1$, $rst = 1$. So $r^2 + s^2 + t^2 = 0^2 - 2(-1) = 2$.
> 2. Each root satisfies $r^3 = r + 1$, so $r^5 = r^2 \cdot r^3 = r^3 + r^2 = r^2 + r + 1$.
> 3. Sum over the roots: $2 + 0 + 3 = 5$.

## Integer and rational coefficients

> [!thm] Theorem 6 (rational roots)
> Let $p \in \mathbb{Z}[x]$ have degree $n$, $a_n a_0 \ne 0$. If $u/v$ is a root in lowest terms ($v > 0$, $\gcd(u, v) = 1$), then $u \mid a_0$ and $v \mid a_n$. So the rational roots of a monic integer polynomial are integers.
^rational-root

> [!proof]- Proof (d 2)
> 1. Multiply $p(u/v) = 0$ by $v^n$: $a_n u^n + a_{n-1}u^{n-1}v + \dots + a_0 v^n = 0$.
> 2. Every term but the last is a multiple of $u$, so $u \mid a_0 v^n$. A prime dividing $u$ and $v^n$ would divide $v$ (Euclid's lemma), so $\gcd(u, v^n) = 1$ and $u \mid a_0$.
> 3. Likewise every term but the first is a multiple of $v$, so $v \mid a_n u^n$ and $v \mid a_n$.
^p-rational-root

> [!def] Content, primitive, irreducible
> The **content** $c(f)$ of a nonzero $f \in \mathbb{Z}[x]$ is the gcd of its coefficients; $f$ is **primitive** if $c(f) = 1$. Clearly $c(kf) = |k|c(f)$ for an integer $k$. A polynomial of degree at least $1$ over a field $F$ is **irreducible** over $F$ if it is not a product of two polynomials over $F$ of degree at least $1$.
^content

> [!example] A cubic with no rational factor
> Show that $x^3 - 3x + 1$ is irreducible over $\mathbb{Q}$.
^ex-cubic

> [!solution]- Solution
> methods: alg-polynomials/rational-root, factor-theorem
> 1. A factorisation of a cubic into two factors of degree at least $1$ has a linear factor over $\mathbb{Q}$, hence a rational root.
> 2. By Theorem 6 a rational root is $\pm 1$. But $1 - 3 + 1 = -1$ and $-1 + 3 + 1 = 3$.

> [!thm] Theorem 7 (Gauss's lemma)
> (a) A product of primitive polynomials is primitive. (b) If $f \in \mathbb{Z}[x]$ is a product $gh$ over $\mathbb{Q}$, then $f = GH$ with $G, H \in \mathbb{Z}[x]$ rational multiples of $g, h$, so of the same degrees.
^gauss-lemma

> [!proof]- Proof (d 3.5)
> 1. (a) Suppose a prime $p$ divides every coefficient of $gh$. Reduce the coefficients mod $p$: $\bar g \bar h = 0$ in $(\mathbb{Z}/p)[x]$.
> 2. $\mathbb{Z}/p$ is a field, so the degree rule forces $\bar g = 0$ or $\bar h = 0$: $p$ divides every coefficient of $g$ or of $h$, which is not primitive.
> 3. (b) Clearing denominators and taking out contents, $g = \alpha g_0$ and $h = \beta h_0$ with rational $\alpha, \beta$ and primitive $g_0, h_0 \in \mathbb{Z}[x]$.
> 4. Write $\alpha\beta = u/v$ in lowest terms with $v > 0$: $vf = u\,g_0 h_0$.
> 5. Take contents, using (a): $v\,c(f) = |u|$. Since $\gcd(u, v) = 1$, $v = 1$ and $\alpha\beta = u$ is an integer. Put $G = u\,g_0$, $H = h_0$.
^p-gauss-lemma

> [!thm] Corollary 8 (reduction mod p)
> Let $f \in \mathbb{Z}[x]$ be monic and $p$ prime. If $f$ reduced mod $p$ is irreducible over $\mathbb{Z}/p$, then $f$ is irreducible over $\mathbb{Q}$.
^red-mod-p

> [!proof]- Proof
> 1. If $f = gh$ over $\mathbb{Q}$ with positive degrees, Gauss gives $f = GH$ in $\mathbb{Z}[x]$ with the same degrees; the leading coefficients multiply to $1$, so after changing both signs if needed $G$ and $H$ are monic.
> 2. Reducing mod $p$ keeps monic degrees, so $\bar f = \bar G \bar H$ is a factorisation over $\mathbb{Z}/p$.
^p-red-mod-p

## Polynomials from values

> [!thm] Theorem 9 (Lagrange interpolation)
> For distinct $x_0, \dots, x_n \in F$ and any $y_0, \dots, y_n \in F$ there is exactly one polynomial $p$ of degree at most $n$ (or $p = 0$) with $p(x_i) = y_i$ for all $i$:
> $$p(x) = \sum_{i=0}^{n} y_i \prod_{j \ne i} \frac{x - x_j}{x_i - x_j}.$$
^interpolation

> [!proof]- Proof
> 1. The $i$-th product has degree $n$, equals $1$ at $x_i$ and $0$ at every other $x_j$. So the sum takes the values $y_i$.
> 2. Uniqueness is Theorem 3.
^p-interpolation

> [!thm] Theorem 10 (finite differences)
> Let $\Delta p(x) = p(x + 1) - p(x)$. If $p$ has degree $n \ge 1$ and leading coefficient $a$, then $\Delta p$ has degree $n - 1$ and leading coefficient $na$; so $\Delta^n p = n!\,a$ and $\Delta^{n+1} p = 0$. Also $\Delta^m p(x) = \sum_{k=0}^{m} (-1)^{m-k}\binom{m}{k} p(x + k)$, so for $\deg p \le n$,
> $$\sum_{k=0}^{n+1} (-1)^{n+1-k}\binom{n+1}{k} p(k) = 0.$$
^finite-differences

> [!proof]- Proof (d 2.5)
> 1. $(x + 1)^n - x^n = nx^{n-1} + (\text{lower terms})$ by the binomial theorem, and the lower terms of $p$ contribute degree at most $n - 2$.
> 2. Apply this $n$ times to reach the constant $n!\,a$; once more gives $0$.
> 3. Write $\Delta = E - I$ with $Ep(x) = p(x + 1)$ and $I$ the identity. $E$ and $I$ commute, so the binomial theorem expands $(E - I)^m = \sum_k \binom{m}{k}(-1)^{m-k}E^k$, and $E^k p(x) = p(x + k)$.
^p-finite-differences

> [!example] The next value
> A polynomial $p$ of degree at most $3$ has $p(k) = 2^k$ for $k = 0, 1, 2, 3$. Find $p(4)$.
^ex-next-value

> [!solution]- Solution
> methods: alg-polynomials/finite-differences
> 1. $\Delta^4 p(0) = 0$: $p(4) - 4p(3) + 6p(2) - 4p(1) + p(0) = 0$.
> 2. $p(4) = 32 - 24 + 8 - 1 = 15$, one less than $2^4$.

> [!thm] Theorem 11 (integer-valued polynomials)
> Let $\binom{x}{k} = \frac{x(x-1)\cdots(x-k+1)}{k!}$, a polynomial of degree $k$ over $\mathbb{Q}$. For $p \in \mathbb{Q}[x]$ of degree at most $n$ these are equivalent: $p(m) \in \mathbb{Z}$ for every integer $m$; $p(0), \dots, p(n) \in \mathbb{Z}$; $p = \sum_{k=0}^{n} c_k \binom{x}{k}$ with integers $c_k$.
^int-valued

> [!proof]- Proof (d 3.5)
> 1. Subtracting multiples of $\binom{x}{n}, \binom{x}{n-1}, \dots$ to kill the leading term each time writes $p = \sum_{k \le n} c_k \binom{x}{k}$ with rational $c_k$.
> 2. $\Delta\binom{x}{k} = \binom{x}{k-1}$ for $k \ge 1$: Pascal's rule gives it at every integer $x \ge 0$, so it holds as polynomials (Theorem 3).
> 3. Hence $\Delta^j p = \sum_{k \ge j} c_k \binom{x}{k - j}$, and at $x = 0$ only $k = j$ survives: $c_j = \Delta^j p(0)$.
> 4. If $p(0), \dots, p(n)$ are integers, so is each $\Delta^j p(0)$ (Theorem 10's formula), so the $c_j$ are integers.
> 5. If the $c_k$ are integers, $p(m)$ is an integer: $\binom{m}{k}$ is a count for $m \ge 0$, and $\binom{m}{k} = (-1)^k\binom{k - m - 1}{k}$ for $m < 0$.
> 6. The first condition implies the second trivially.
^p-int-valued

## Roots of unity

For real $\theta$, $e^{i\theta} = \cos\theta + i\sin\theta$. The angle-addition formulas say $e^{i\alpha}e^{i\beta} = e^{i(\alpha + \beta)}$, and $e^{i\theta} = 1$ exactly when $\theta$ is a multiple of $2\pi$. An **$m$-th root of unity** is a complex $z$ with $z^m = 1$. ^cis

> [!thm] Theorem 12 (roots of unity)
> Let $m \ge 1$ and $\omega = e^{2\pi i/m}$.
> (a) The $m$-th roots of unity are $\omega^0, \omega^1, \dots, \omega^{m-1}$, all different, and $x^m - 1 = \prod_{k=0}^{m-1}(x - \omega^k)$.
> (b) Under multiplication they form a cyclic group generated by $\omega$; $\omega^k$ has order $m/\gcd(m, k)$, and is a **primitive** $m$-th root (order exactly $m$) exactly when $\gcd(m, k) = 1$.
> (c) For an integer $j$, $\sum_{k=0}^{m-1}\omega^{jk} = m$ if $m \mid j$, and $0$ otherwise.
^roots-unity

> [!proof]- Proof (d 2)
> 1. $(\omega^k)^m = e^{2\pi i k} = 1$, and the angles $2\pi k/m$ for $0 \le k < m$ differ by less than $2\pi$, so the $\omega^k$ are different.
> 2. These are $m$ roots of the monic $x^m - 1$. Divide out $x - \omega^k$ one at a time (Theorem 2); each remaining $\omega^j$ is a root of the quotient, as in step 3 of Theorem 3's proof. What is left after $m$ divisions is a constant, which is $1$. By Theorem 3 there are no other roots.
> 3. (b) $\omega$ has order $m$ by step 1, so the group is $\langle\omega\rangle$, and [Theorem 2 of alg-groups](alg-groups.md#^elt-order) gives the order of $\omega^k$.
> 4. (c) If $m \mid j$ every term is $1$. Otherwise $z = \omega^j \ne 1$ with $z^m = 1$, and $(z - 1)\sum_{k<m} z^k = z^m - 1 = 0$ forces the sum to be $0$.
^p-roots-unity

> [!thm] Theorem 13 (roots-of-unity filter)
> For $p(x) = \sum_k a_k x^k$, $m \ge 1$ and any residue $r$,
> $$\sum_{k \equiv r \ (\mathrm{mod}\ m)} a_k = \frac{1}{m}\sum_{j=0}^{m-1} \omega^{-jr}\,p(\omega^j).$$
> The same holds for a power series that converges at the $\omega^j$.
^rou-filter

> [!proof]- Proof
> 1. The right side is $\frac1m \sum_k a_k \sum_{j=0}^{m-1} \omega^{j(k - r)}$.
> 2. By Theorem 12(c) the inner sum is $m$ when $m \mid k - r$ and $0$ otherwise.
^p-rou-filter

> [!example] Every third binomial coefficient
> Compute $\sum_{k} \binom{2026}{3k}$.
^ex-filter

> [!solution]- Solution
> methods: roots-of-unity-filter
> 1. Filter $(1 + x)^{2026}$ with $m = 3$, $r = 0$: the sum is $\frac13\left[2^{2026} + (1 + \omega)^{2026} + (1 + \omega^2)^{2026}\right]$.
> 2. $1 + \omega + \omega^2 = 0$ gives $1 + \omega = -\omega^2 = e^{i\pi/3}$ and $1 + \omega^2 = e^{-i\pi/3}$.
> 3. $2026 = 6 \cdot 337 + 4$, so $(e^{i\pi/3})^{2026} = e^{4\pi i/3} = \omega^2$ and the conjugate is $\omega$; together $\omega + \omega^2 = -1$.
> Answer: $(2^{2026} - 1)/3$.

## Problems

> [!problem] A cubic with roots in arithmetic progression (d 2.5)
> Find all real $k$ for which $x^3 - 6x^2 + kx - 6$ has three real roots in arithmetic progression.
^inv-nt-ap-cubic

> [!solution]- Solution
> methods: vieta
> 1. Roots $a - d, a, a + d$. Their sum $3a = 6$, so $a = 2$.
> 2. Their product $2(4 - d^2) = 6$, so $d^2 = 1$: roots $1, 2, 3$.
> 3. $k = 1 \cdot 2 + 2 \cdot 3 + 1 \cdot 3 = 11$.
> Answer: $k = 11$.

> [!problem] Integer roots of a polynomial with P(0) = 2026 (d 3.5)
> $P$ has integer coefficients and $P(0) = 2026$. What is the largest number of distinct integer roots $P$ can have?
^inv-nt-roots-2026

> [!solution]- Solution
> methods: factor-theorem, alg-polynomials/poly-div
> 1. Let $r_1, \dots, r_k$ be distinct integer roots, all nonzero since $P(0) \ne 0$. Dividing by the monic $x - r_1$ keeps integer coefficients, and $r_2$ is a root of the quotient (the factor $r_2 - r_1$ is nonzero). Repeating, $P = (x - r_1)\cdots(x - r_k)Q$ with $Q \in \mathbb{Z}[x]$.
> 2. At $0$: $2026 = \pm r_1 \cdots r_k\,Q(0)$, so $|r_1 \cdots r_k|$ divides $2026 = 2 \cdot 1013$.
> 3. At most two of the $r_i$ are $\pm 1$; each other $|r_i| \ge 2$ contributes at least one prime factor, and $2026$ has two. So $k \le 4$.
> 4. $P = (x - 1)(x + 1)(x - 2)(x + 1013)$ has $P(0) = (-1)(1)(-2)(1013) = 2026$.
> Answer: $4$.

> [!problem] Subsets with sum divisible by 3 (d 4)
> How many subsets of $\{1, 2, \dots, 2026\}$ (the empty set included) have a sum divisible by $3$?
^inv-nt-subsets-mod-3

> [!solution]- Solution
> methods: generating-function, roots-of-unity-filter
> 1. $F(x) = \prod_{k=1}^{2026}(1 + x^k)$ has, as coefficient of $x^s$, the number of subsets with sum $s$. The answer is $\frac13[F(1) + F(\omega) + F(\omega^2)]$ with $\omega = e^{2\pi i/3}$.
> 2. Three consecutive $k$ contribute $(1 + 1)(1 + \omega)(1 + \omega^2) = 2(1 + \omega + \omega^2 + \omega^3) = 2$ to $F(\omega)$.
> 3. $k = 1, \dots, 2025$ form $675$ such blocks, and $k = 2026 \equiv 1 \pmod 3$ contributes $1 + \omega$: $F(\omega) = 2^{675}(1 + \omega)$, and likewise $F(\omega^2) = 2^{675}(1 + \omega^2)$.
> 4. $F(\omega) + F(\omega^2) = 2^{675}(2 + \omega + \omega^2) = 2^{675}$.
> Answer: $(2^{2026} + 2^{675})/3$.

> [!problem] A quintic over the rationals (d 4.5)
> Prove that $x^5 + 3x^3 - x + 2$ is irreducible over $\mathbb{Q}$.
^inv-nt-quintic

> [!solution]- Solution
> methods: alg-polynomials/red-mod-p, fermat-euler
> 1. Mod $3$ it is $\bar f = x^5 + 2x + 2$. A factorisation of a quintic has a factor of degree $1$ or $2$, so it suffices that $\bar f$ has none (Corollary 8).
> 2. Degree 1: by Fermat $x^3 \equiv x$, so $x^5 \equiv x$ and $\bar f(x) \equiv 2$ for every $x$: no root.
> 3. Degree 2: a monic quadratic factor would be irreducible (no root), and the monic irreducible quadratics mod $3$ are $x^2 + 1$, $x^2 + x + 2$, $x^2 + 2x + 2$.
> 4. Mod $x^2 + 1$: $x^4 \equiv 1$, $\bar f \equiv x + 2x + 2 \equiv 2$. Mod $x^2 + x + 2$: $x^2 \equiv 2x + 1$, $x^4 \equiv 2$, $\bar f \equiv 4x + 2 \equiv x + 2$. Mod $x^2 + 2x + 2$: $x^2 \equiv x + 1$, $x^4 \equiv 2$, $\bar f \equiv x + 2$. No remainder is $0$.

> [!problem] Alternating values (d 4)
> $P$ has degree at most $2026$ and $P(k) = (-1)^k$ for $k = 0, 1, \dots, 2026$. Find $P(2027)$.
^inv-nt-alternating-values

> [!solution]- Solution
> methods: alg-polynomials/finite-differences
> 1. $\Delta^{2027}P(0) = 0$: $\sum_{k=0}^{2027}(-1)^{2027-k}\binom{2027}{k}P(k) = 0$.
> 2. For $k \le 2026$ the term is $(-1)^{2027}\binom{2027}{k}$; these add to $-(2^{2027} - 1)$.
> 3. The $k = 2027$ term is $P(2027)$.
> Answer: $2^{2027} - 1$.

> [!problem] A product over thirteenth roots of unity (d 5)
> Let $\omega = e^{2\pi i/13}$. Compute $\prod_{k=1}^{12}\left(1 + \omega^k + \omega^{2k}\right)$.
^inv-nt-thirteenth-product

> [!solution]- Solution
> methods: alg-polynomials/roots-unity, vieta
> 1. $1 + z + z^2 = (z - \alpha)(z - \beta)$ with $\alpha = e^{2\pi i/3}$, $\beta = \alpha^2$.
> 2. $\prod_{k=0}^{12}(\omega^k - \alpha) = -\prod_{k=0}^{12}(\alpha - \omega^k) = -(\alpha^{13} - 1) = 1 - \alpha$, since $\alpha^{13} = \alpha$. Likewise for $\beta$.
> 3. So $\prod_{k=0}^{12}(1 + \omega^k + \omega^{2k}) = (1 - \alpha)(1 - \beta) = 1 - (\alpha + \beta) + \alpha\beta = 1 + 1 + 1 = 3$.
> 4. The $k = 0$ factor is $3$.
> Answer: $1$.

## Derive

> [!derive] Prove that a polynomial with integer coefficients for which $P(0)$ and $P(1)$ are both odd has no integer root.
^d-parity-roots

> [!solution]- Solution
> methods: factor-theorem
> 1. For an integer $n$, $n - (n \bmod 2)$ is even and divides $P(n) - P(n \bmod 2)$, so $P(n)$ is odd, hence not $0$.

> [!derive] Prove that $x^d - 1$ divides $x^n - 1$ in $\mathbb{Q}[x]$ exactly when $d \mid n$ (for $d, n \ge 1$). (d 2.5)
^d-xd-divides

> [!solution]- Solution
> methods: alg-polynomials/poly-div
> 1. Write $n = qd + r$, $0 \le r < d$. $x^n - 1 = x^r(x^{qd} - 1) + (x^r - 1)$, and $x^d - 1 \mid x^{qd} - 1$ (put $y = x^d$ in $y^q - 1 = (y - 1)(y^{q-1} + \dots + 1)$).
> 2. So $x^d - 1 \mid x^n - 1$ exactly when $x^d - 1 \mid x^r - 1$, a polynomial of degree less than $d$, which happens only when it is $0$: $r = 0$.

> [!derive] Let $f = a_n x^n + \dots + a_0 \in \mathbb{Z}[x]$ and $p$ a prime with $p \mid a_i$ for $i < n$, $p \nmid a_n$ and $p^2 \nmid a_0$. Prove that $f$ is irreducible over $\mathbb{Q}$. (d 4)
^d-eisenstein

> [!solution]- Solution
> methods: alg-polynomials/gauss-lemma
> 1. If not, Gauss gives $f = GH$ in $\mathbb{Z}[x]$ with $G = \sum b_i x^i$, $H = \sum c_i x^i$ of degrees $s, t \ge 1$.
> 2. $a_0 = b_0c_0$ with $p \mid a_0$, $p^2 \nmid a_0$: say $p \mid b_0$, $p \nmid c_0$. And $p \nmid a_n = b_s c_t$, so $p \nmid b_s$.
> 3. Let $i$ be least with $p \nmid b_i$; $i \le s < n$. Then $a_i = b_ic_0 + b_{i-1}c_1 + \dots \equiv b_ic_0 \not\equiv 0 \pmod p$, against $p \mid a_i$.

> [!derive] Let $p = x^n - e_1x^{n-1} + e_2x^{n-2} - \dots + (-1)^n e_n$ have roots $r_1, \dots, r_n$ and put $s_k = \sum_i r_i^k$. Prove that $s_k - e_1 s_{k-1} + e_2 s_{k-2} - \dots + (-1)^n e_n s_{k-n} = 0$ for every $k \ge n$ (with $s_0 = n$).
^d-newton-tail

> [!solution]- Solution
> methods: vieta
> 1. Each root satisfies $r_i^{k-n}p(r_i) = 0$, that is $r_i^k - e_1r_i^{k-1} + \dots + (-1)^n e_n r_i^{k-n} = 0$.
> 2. Sum over $i$.
