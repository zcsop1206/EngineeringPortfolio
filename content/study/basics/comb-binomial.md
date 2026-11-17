---
study: basic
id: comb-binomial
title: "Counting two ways: binomial identities and inclusion-exclusion"
area: comb
needs: []
build: 1
tracks: [putnam]
---

> Written by a model for Adit. Not Adit's words.

Needs: nothing earlier. Lucas's theorem at the end uses [Euclid's lemma](nt-divisibility.md#^euclid-lemma) once. ^needs

Every identity here is proved the same way: name a finite set, count it twice, and set the counts equal. The algebra comes after, if at all. ^overview

## Binomial coefficients

> [!def] Binomial coefficient
> For integers $n \ge 0$ and $k$, $\binom nk$ is the number of $k$-element subsets of an $n$-element set. It is $0$ when $k < 0$ or $k > n$. We write $[n] = \{1, \dots, n\}$.
^binom-def

> [!thm] Theorem 1 (formula and symmetry)
> For $0 \le k \le n$, $\binom nk = \dfrac{n!}{k!\,(n-k)!}$ and $\binom nk = \binom{n}{n-k}$.
^binom-formula

> [!proof]- Proof (d 1)
> 1. Count the sequences of $k$ distinct elements of $[n]$: $n$ choices for the first entry, $n - 1$ for the second, and so on, giving $n!/(n-k)!$.
> 2. Count them again by first choosing the set of entries, in $\binom nk$ ways, and then ordering it, in $k!$ ways.
> 3. Equate the two counts and divide by $k!$.
> 4. Taking complements, $S \mapsto [n] \setminus S$, is a bijection from $k$-subsets to $(n-k)$-subsets.
^p-binom-formula

> [!thm] Theorem 2 (binomial theorem)
> In any commutative ring, $(x + y)^n = \sum_{k=0}^{n} \binom nk x^k y^{n-k}$.
^binom-thm

> [!proof]- Proof
> 1. Expanding the product of the $n$ factors $(x + y)$ gives one term for each way of choosing $x$ or $y$ from every factor.
> 2. A choice that takes $x$ from exactly $k$ factors gives $x^k y^{n-k}$, and such choices correspond to the $k$-subsets of the $n$ factors: $\binom nk$ of them.
^p-binom-thm

> [!thm] Theorem 3 (Pascal's rule)
> For $n \ge 1$ and every integer $k$, $\binom nk = \binom{n-1}{k-1} + \binom{n-1}{k}$.
^pascal

> [!proof]- Proof
> 1. Split the $k$-subsets of $[n]$ by whether they contain $n$.
> 2. Those that do are $\{n\}$ plus a $(k-1)$-subset of $[n-1]$; those that do not are $k$-subsets of $[n-1]$.
^p-pascal

## Counting two ways

> [!thm] Theorem 4 (double counting)
> Let $A$ and $B$ be finite sets and $R \subseteq A \times B$. For $a \in A$ let $d(a)$ be the number of $b$ with $(a, b) \in R$, and for $b \in B$ let $d(b)$ be the number of $a$ with $(a, b) \in R$. Then
> $$\sum_{a \in A} d(a) = |R| = \sum_{b \in B} d(b).$$
^double-count

> [!proof]- Proof
> 1. Both sums count the pairs in $R$: the first grouped by first coordinate, the second by second coordinate.
^p-double-count

Two consequences used constantly. In a finite graph the degrees sum to twice the number of edges (count pairs (vertex, edge at it)), so the number of odd-degree vertices is even. In a family of $F$ sets, each of size $k$, drawn from an $n$-set in which every element lies in exactly $r$ of the sets, $kF = rn$ (count pairs (set, element of it)). ^double-count-uses

> [!thm] Theorem 5 (Vandermonde's identity)
> For integers $m, n, r \ge 0$, $\displaystyle\sum_{k} \binom mk \binom{n}{r-k} = \binom{m+n}{r}$.
^vandermonde

> [!proof]- Proof (d 2)
> 1. Count the $r$-subsets of the disjoint union of an $m$-set $X$ and an $n$-set $Y$; there are $\binom{m+n}{r}$.
> 2. Group them by $k$, the number of elements taken from $X$: $\binom mk$ choices there and $\binom{n}{r-k}$ in $Y$.
^p-vandermonde

> [!thm] Theorem 6 (hockey stick)
> For integers $0 \le k \le n$, $\displaystyle\sum_{i=k}^{n} \binom ik = \binom{n+1}{k+1}$.
^hockey-stick

> [!proof]- Proof (d 2)
> 1. Count the $(k+1)$-subsets of $[n+1]$ by their largest element, say $i + 1$, where $k \le i \le n$.
> 2. The other $k$ elements form a $k$-subset of $[i]$: $\binom ik$ choices.
^p-hockey-stick

> [!thm] Theorem 7 (stars and bars)
> For $j \ge 1$ and $n \ge 0$, the number of $j$-tuples $(x_1, \dots, x_j)$ of non-negative integers with $x_1 + \dots + x_j = n$ is $\binom{n+j-1}{j-1}$. With every $x_i \ge 1$ instead, it is $\binom{n-1}{j-1}$. Equivalently, there are $\binom{n+j-1}{j-1}$ multisets of size $n$ drawn from $j$ kinds.
^stars-bars

> [!proof]- Proof (d 1.5)
> 1. Send $(x_1, \dots, x_j)$ to the string of $x_1$ stars, a bar, $x_2$ stars, a bar, and so on, ending with $x_j$ stars.
> 2. This is a bijection onto strings of $n$ stars and $j - 1$ bars; the inverse reads the run lengths between bars.
> 3. Such a string is fixed by which of its $n + j - 1$ positions hold bars: $\binom{n+j-1}{j-1}$.
> 4. For positive parts, put $x_i = y_i + 1$: the $y_i \ge 0$ sum to $n - j$, giving $\binom{n-1}{j-1}$.
^p-stars-bars

## Inclusion-exclusion and involutions

> [!thm] Theorem 8 (inclusion-exclusion)
> Let $A_1, \dots, A_n$ be subsets of a finite set $U$. For $S \subseteq [n]$ write $A_S = \bigcap_{i \in S} A_i$, with $A_\emptyset = U$. Then the number of elements of $U$ in none of the $A_i$ is
> $$\sum_{S \subseteq [n]} (-1)^{|S|} |A_S|,$$
> and $\left|\bigcup_i A_i\right| = \sum_{S \ne \emptyset} (-1)^{|S|+1} |A_S|$.
^incl-excl

> [!proof]- Proof (d 2.5)
> 1. Fix $u \in U$ and write $\mathbf 1_A(u)$ for $1$ if $u \in A$ and $0$ otherwise.
> 2. The product $\prod_{i=1}^{n} (1 - \mathbf 1_{A_i}(u))$ is $1$ if $u$ lies in no $A_i$ and $0$ otherwise.
> 3. Expand the product: it equals $\sum_{S \subseteq [n]} (-1)^{|S|} \prod_{i \in S} \mathbf 1_{A_i}(u)$, the empty product being $1$.
> 4. $\prod_{i \in S} \mathbf 1_{A_i}(u) = \mathbf 1_{A_S}(u)$.
> 5. Sum over $u \in U$: the left side counts the elements in no $A_i$, and the right side becomes $\sum_S (-1)^{|S|} |A_S|$.
> 6. The union form is $|U|$ minus this, and the $S = \emptyset$ term is $|U|$.
^p-incl-excl

> [!thm] Lemma 9 (involutions)
> Let $X$ be a finite set and $\tau : X \to X$ an involution ($\tau(\tau(x)) = x$). Then $|X| \equiv |\{x : \tau(x) = x\}| \pmod 2$. If moreover $f : X \to \mathbb R$ satisfies $f(\tau(x)) = -f(x)$ whenever $\tau(x) \ne x$, then $\sum_{x \in X} f(x) = \sum_{x : \tau(x) = x} f(x)$.
^involution

> [!proof]- Proof
> 1. The points with $\tau(x) \ne x$ split into two-element sets $\{x, \tau(x)\}$.
> 2. So they are even in number, and each pair contributes $f(x) + f(\tau(x)) = 0$ to the sum.
^p-involution

A sign-reversing involution is how a signed sum collapses to its fixed points, and the fixed points are where such arguments go wrong: list them. ^involution-use

## Binomial coefficients mod a prime

> [!thm] Lemma 10 (prime rows)
> Let $p$ be prime. Then $p \mid \binom pj$ for $0 < j < p$, and $(1 + x)^p \equiv 1 + x^p$ coefficientwise mod $p$.
^prime-binom

> [!proof]- Proof (d 1.5)
> 1. Count pairs (a $j$-subset of $[p]$, a marked element of it) two ways: $j\binom pj = p\binom{p-1}{j-1}$.
> 2. $p$ divides the right side and $p \nmid j$ because $0 < j < p$, so $p \mid \binom pj$ by [Euclid's lemma](nt-divisibility.md#^euclid-lemma).
> 3. The second claim is Theorem 2 with every middle coefficient $\equiv 0$.
^p-prime-binom

> [!thm] Theorem 11 (Lucas)
> Let $p$ be prime, and write $n = \sum_i n_i p^i$ and $k = \sum_i k_i p^i$ in base $p$ (digits in $\{0, \dots, p-1\}$). Then
> $$\binom nk \equiv \prod_i \binom{n_i}{k_i} \pmod p,$$
> where $\binom{n_i}{k_i} = 0$ when $k_i > n_i$. In particular $p \nmid \binom nk$ exactly when every digit of $k$ is at most the matching digit of $n$.
^lucas

> [!proof]- Proof (d 4)
> 1. Compare polynomials with integer coefficients coefficientwise mod $p$; such congruences survive sums and products.
> 2. $(1+x)^{p^{i}} \equiv 1 + x^{p^{i}}$ for every $i \ge 0$, by induction on $i$: raise the case $i$ to the $p$-th power and apply Lemma 10 with $x^{p^i}$ in place of $x$.
> 3. So $(1+x)^n = \prod_i \big((1+x)^{p^i}\big)^{n_i} \equiv \prod_i (1 + x^{p^i})^{n_i}$.
> 4. Expand each factor by Theorem 2: the right side is $\prod_i \sum_{k_i = 0}^{n_i} \binom{n_i}{k_i} x^{k_i p^i}$.
> 5. Each chosen $k_i$ is at most $n_i \le p - 1$, so the exponent $\sum_i k_i p^i$ is a base-$p$ expansion, and different choices give different exponents.
> 6. Read off the coefficient of $x^k$: on the left it is $\binom nk$; on the right it is $\prod_i \binom{n_i}{k_i}$ when every $k_i \le n_i$, and $0$ otherwise.
> 7. For the last sentence: when $0 \le b \le a < p$, $\binom ab = a!/(b!(a-b)!)$ and $p \nmid a!$, so $p \nmid \binom ab$.
^p-lucas

The exact power of $p$ dividing $\binom nk$ is the number of carries when adding $k$ and $n - k$ in base $p$: that is [Kummer's theorem](nt-padic.md#^kummer), proved there. ^kummer-pointer

## Examples

> [!example] Squared sizes
> For $n \ge 1$, evaluate $\sum_{k=0}^{n} k^2 \binom nk$.
^ex-squared-sizes

> [!solution]- Solution
> methods: double-counting
> 1. $k^2 \binom nk$ counts triples $(S, a, b)$ with $S \subseteq [n]$, $|S| = k$, and $a, b \in S$ (possibly equal). Summing over $k$ counts all such triples.
> 2. Count by $(a, b)$ first. If $a = b$: $n$ choices, and $S$ is any superset of $\{a\}$: $2^{n-1}$. Total $n2^{n-1}$.
> 3. If $a \ne b$: $n(n-1)$ ordered pairs, each with $2^{n-2}$ supersets. Total $n(n-1)2^{n-2}$.
> 4. Sum: $n2^{n-1} + n(n-1)2^{n-2} = n(n+1)2^{n-2}$.
> Answer: $n(n+1)2^{n-2}$. Check at $n = 3$: $3 + 12 + 9 = 24 = 3 \cdot 4 \cdot 2$.

> [!example] Digit strings that use 1, 2 and 3
> How many strings of six decimal digits (leading zeros allowed) contain each of the digits $1$, $2$ and $3$ at least once?
^ex-digit-strings

> [!solution]- Solution
> methods: inclusion-exclusion
> 1. Let $U$ be all $10^6$ strings and $A_d$ the strings with no digit $d$, for $d = 1, 2, 3$.
> 2. $|A_d| = 9^6$, $|A_d \cap A_e| = 8^6$, $|A_1 \cap A_2 \cap A_3| = 7^6$.
> 3. Strings in no $A_d$: $10^6 - 3 \cdot 9^6 + 3 \cdot 8^6 - 7^6 = 1000000 - 1594323 + 786432 - 117649$.
> Answer: $74460$ (also confirmed by brute force).

> [!example] A row mod three
> For how many $k$ with $0 \le k \le 100$ is $\binom{100}{k}$ not divisible by $3$?
^ex-row-mod-three

> [!solution]- Solution
> methods: comb-binomial/lucas
> 1. $100 = 81 + 2 \cdot 9 + 1$, which is $10201$ in base $3$.
> 2. By Lucas, $3 \nmid \binom{100}{k}$ exactly when each base-3 digit of $k$ is at most the matching digit of $100$.
> 3. The digit choices number $2 \cdot 1 \cdot 3 \cdot 1 \cdot 2$, and every such $k$ is at most $100$.
> Answer: $12$ (confirmed by direct computation).

## Derive

> [!derive] Prove that for $n \ge 1$ an $n$-element set has as many subsets of even size as of odd size, and give an explicit bijection between the two families.
^d-even-odd-subsets

> [!derive] Prove that the number $D_n$ of permutations of $[n]$ with no fixed point is $n! \sum_{j=0}^{n} (-1)^j / j!$, and that for $n \ge 1$ it is the integer nearest to $n!/e$.
^d-derangements

> [!derive] Prove that the number of surjections from an $n$-element set onto a $k$-element set is $\sum_{j=0}^{k} (-1)^j \binom kj (k-j)^n$, and deduce that this sum is $0$ when $n < k$.
^d-surjections

> [!derive] Prove that $\sum_{k} \binom nk \binom km = \binom nm 2^{n-m}$ for $0 \le m \le n$.
^d-subset-chain

> [!derive] Prove that every prime $p$ with $n < p \le 2n$ divides $\binom{2n}{n}$, and that $\dfrac{4^n}{2n+1} \le \binom{2n}{n} \le 4^n$.
^d-central-binomial

## Problems

> [!problem] Spaced quadruples (d 2.5)
> How many $4$-element subsets of $\{1, 2, \dots, 20\}$ contain no two consecutive integers?
^inv-comb-spaced-quads

> [!solution]- Solution
> methods: comb-binomial/binom-def
> 1. List a qualifying subset as $a_1 < a_2 < a_3 < a_4$, so $a_{i+1} - a_i \ge 2$.
> 2. Put $b_i = a_i - (i - 1)$. Then $b_1 < b_2 < b_3 < b_4$ lie in $\{1, \dots, 17\}$.
> 3. The inverse $a_i = b_i + (i - 1)$ turns any $4$-subset of $[17]$ back into a spaced subset of $[20]$, so this is a bijection.
> Answer: $\binom{17}{4} = 2380$ (confirmed by brute force).

> [!problem] Capped bins (d 3)
> In how many ways can $12$ identical tokens be placed into $5$ labelled bins so that no bin holds more than $4$?
^inv-comb-capped-bins

> [!solution]- Solution
> methods: inclusion-exclusion, comb-binomial/stars-bars
> 1. Without the cap: $\binom{12+4}{4} = 1820$.
> 2. Let $A_i$ be the placements with bin $i$ holding at least $5$. Removing $5$ tokens from bin $i$ leaves $7$ free tokens: $|A_i| = \binom{11}{4} = 330$.
> 3. Two bins with at least $5$ each leave $2$ free tokens: $\binom{6}{4} = 15$. Three such bins would need $15 > 12$ tokens: $0$.
> 4. $1820 - 5 \cdot 330 + \binom52 \cdot 15 = 1820 - 1650 + 150$.
> Answer: $320$ (confirmed by brute force).

> [!problem] A weighted sum of squared binomials (d 3.5)
> Find a closed form for $\sum_{k=0}^{n} k \binom nk^2$, $n \ge 1$.
^inv-comb-weighted-squares

> [!solution]- Solution
> methods: double-counting, comb-binomial/vandermonde
> 1. $k\binom nk = n\binom{n-1}{k-1}$: both count ($k$-subset of $[n]$, marked element of it).
> 2. So the sum is $n \sum_k \binom{n-1}{k-1}\binom{n}{n-k}$, using symmetry on the second factor.
> 3. The lower indices add to $n - 1$, so Vandermonde gives $\binom{2n-1}{n-1}$.
> Answer: $n\binom{2n-1}{n-1}$. Check at $n = 2$: $1 \cdot 4 + 2 \cdot 1 = 6 = 2 \cdot 3$. (Confirmed for $n \le 24$.)

> [!problem] Permutations with no successor (d 4.5)
> Count the permutations of $[n]$, written as a sequence, in which no $k$ is immediately followed by $k + 1$. Give a formula for general $n$ and the value for $n = 7$.
^inv-comb-no-successor

> [!solution]- Solution
> methods: inclusion-exclusion
> 1. For $1 \le k \le n-1$ let $A_k$ be the permutations in which $k$ is immediately followed by $k+1$.
> 2. For a set $J$ of $j$ such indices, glue $k$ to $k+1$ for each $k \in J$. Glued pairs that share an element merge into one increasing block, and the blocks plus the unglued elements are $n - j$ units.
> 3. Every ordering of the units gives a permutation in $A_J$ and every permutation in $A_J$ arises once, so $|A_J| = (n-j)!$.
> 4. Inclusion-exclusion: the count is $\sum_{j=0}^{n-1} (-1)^j \binom{n-1}{j} (n-j)!$.
> 5. At $n = 7$: $5040 - 4320 + 1800 - 480 + 90 - 12 + 1$.
> Answer: $\sum_{j} (-1)^j \binom{n-1}{j}(n-j)!$; for $n = 7$ it is $2119$ (brute force agrees for $n \le 8$).

> [!problem] An alternating sum of binomials (d 5)
> Evaluate $\displaystyle\sum_{k=0}^{n} (-1)^k \binom nk \binom{2n - 2k}{n}$ for $n \ge 0$.
^inv-comb-alt-binomials

> [!solution]- Solution
> methods: comb-binomial/binom-thm
> 1. $\binom{2n-2k}{n}$ is the coefficient of $x^n$ in $(1+x)^{2(n-k)}$.
> 2. So the sum is the coefficient of $x^n$ in $\sum_k \binom nk (-1)^k \big((1+x)^2\big)^{n-k} = \big((1+x)^2 - 1\big)^n$, by the binomial theorem.
> 3. $(1+x)^2 - 1 = x(2 + x)$, so the polynomial is $x^n (2+x)^n$.
> 4. Its coefficient of $x^n$ is the constant term of $(2+x)^n$.
> Answer: $2^n$ (confirmed for $n \le 9$).

> [!problem] Central binomials mod three (d 5)
> For how many integers $n$ with $0 \le n \le 242$ is $\binom{2n}{n}$ not divisible by $3$?
^inv-comb-central-mod3

> [!solution]- Solution
> methods: comb-binomial/lucas
> 1. $242 = 22222$ in base 3, so $n$ runs over all five-digit base-3 strings.
> 2. If every digit of $n$ is $0$ or $1$, doubling has no carries, so the digits of $2n$ are $2n_i$, and Lucas gives $\prod_i \binom{2n_i}{n_i}$, a product of $1$s and $2$s: not divisible by $3$.
> 3. Otherwise let $i$ be the lowest position with $n_i = 2$. Below $i$ the digits are $0$ or $1$ and doubling them causes no carry into position $i$.
> 4. At position $i$, $2 \cdot 2 = 4 = 1 + 3$, so digit $i$ of $2n$ is $1$, and the Lucas factor $\binom{1}{2}$ is $0$.
> 5. So the good $n$ are those with all digits in $\{0, 1\}$.
> Answer: $2^5 = 32$ (confirmed by direct computation). [Kummer](nt-padic.md#^kummer) reads it off as "no carries in $n + n$".
