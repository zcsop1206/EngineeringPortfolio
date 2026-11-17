---
study: basic
id: found-induction
title: Induction, descent, the extremal principle and pigeonhole
area: gen
needs: []
build: 1
tracks: [putnam, interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: nothing. This is the floor the other basics stand on. ^needs

All four tools in this doc come from one fact about the non-negative integers $\mathbb N = \{0, 1, 2, \dots\}$: you cannot keep going down forever. Induction climbs up from that fact, descent and the extremal principle stand on it directly, and pigeonhole is the finite counting version of it. ^overview

## Well-ordering and induction

> [!def] Well-ordering (axiom)
> Every nonempty set of non-negative integers has a least element. We take this as a defining property of $\mathbb N$.
^well-ordering

> [!thm] Theorem 1 (induction)
> Let $P(n)$ be a statement for each integer $n \ge n_0$. If $P(n_0)$ holds, and $P(n-1)$ implies $P(n)$ for every $n > n_0$, then $P(n)$ holds for every $n \ge n_0$.
^induction

> [!proof]- Proof
> 1. Suppose not, so the set of $n \ge n_0$ for which $P(n)$ fails is nonempty.
> 2. Subtracting $n_0$ moves this set into $\mathbb N$, so by well-ordering it has a least element $n$.
> 3. $n \ne n_0$ because $P(n_0)$ holds, so $n - 1 \ge n_0$, and $P(n-1)$ holds because $n$ is the least failure.
> 4. The step turns $P(n-1)$ into $P(n)$, a contradiction.
^p-induction

> [!thm] Theorem 2 (strong induction)
> Suppose that for every $n \ge n_0$ the statements $P(n_0), \dots, P(n-1)$ together imply $P(n)$. Then $P(n)$ holds for every $n \ge n_0$. (At $n = n_0$ the list of earlier statements is empty, so $P(n_0)$ has to be proved outright.)
^strong-induction

> [!proof]- Proof
> 1. Let $Q(n)$ be the statement "$P(k)$ holds for every $k$ with $n_0 \le k \le n$".
> 2. $Q(n_0)$ is $P(n_0)$, which the hypothesis gives from the empty list.
> 3. If $Q(n-1)$ holds, the hypothesis gives $P(n)$, so $Q(n)$ holds.
> 4. Theorem 1 gives $Q(n)$ for every $n \ge n_0$, and $Q(n)$ contains $P(n)$.
^p-strong-induction

**Strengthening.** The proof of Theorem 2 is ordinary induction on a stronger statement, and that is the general repair when a step will not go through: prove more. If $P'(n)$ implies $P(n)$ and $P'$ passes from $n-1$ to $n$, then $P$ holds for all $n$. The standard case is a bound $S_n < C$ on partial sums: the hypothesis $S_{n-1} < C$ leaves no room for the next term, while a claim $S_n \le C - f(n)$ with $f$ decreasing passes whenever $f(n-1) - f(n)$ is at least the $n$-th term. The base case must then be checked against the strengthened claim, not the original one. ^strengthen

Two further shapes. A statement about pairs $(m, n)$ can be proved by induction on $m$, on $n$, on $m + n$ or on $\max(m, n)$; pick the one whose step has something to use. A step that uses $P(n-2)$ needs two base cases, and a step that uses $P(\lfloor n/2 \rfloor)$ must be read at $n = 2$ and $n = 3$, since both fall to $n = 1$. ^induction-shapes

## Descent and the extremal principle

> [!thm] Theorem 3 (infinite descent)
> There is no infinite strictly decreasing sequence of non-negative integers. Equivalently: if every object with property $P$ and size $s \in \mathbb N$ yields an object with property $P$ and size less than $s$, then no object has property $P$.
^descent

> [!proof]- Proof
> 1. Suppose $a_1 > a_2 > \cdots$ are non-negative integers.
> 2. The set $\{a_1, a_2, \dots\}$ is nonempty, so by well-ordering it has a least element $a_k$.
> 3. But $a_{k+1}$ is in the set and $a_{k+1} < a_k$, a contradiction.
> 4. For the second form, one object with property $P$ would start an infinite strictly decreasing sequence of sizes.
^p-descent

The working form is the **minimal counterexample**: to prove a statement for every $n$, take the least $n$ for which it fails and produce a smaller failure. ^minimal-counterexample

> [!thm] Theorem 4 (extremal principle)
> Every nonempty finite set of real numbers has a largest and a smallest element. Every nonempty set of integers that is bounded below has a smallest element.
^extremal

> [!proof]- Proof
> 1. For a finite set, induct on its size: a one-element set is its own maximum, and the maximum of $S \cup \{x\}$ is the larger of $\max S$ and $x$. Minima are the same.
> 2. If a set $S$ of integers is bounded below by an integer $b$, the set $\{s - b : s \in S\}$ lies in $\mathbb N$; its least element plus $b$ is least in $S$.
^p-extremal

The principle is used by looking at the extreme object directly: the largest element, the shortest edge, the first time something happens, or a configuration that maximises a score among finitely many. Then write down what being extreme forbids; that prohibition is usually the whole argument. For an infinite family, say why the extreme exists before using it: $(0, 1)$ has neither a largest nor a smallest element. ^extremal-use

## Pigeonhole

> [!thm] Theorem 5 (pigeonhole)
> If more than $n$ objects are put into $n$ boxes, some box holds at least two of them.
^pigeonhole

> [!proof]- Proof
> 1. If every box held at most one object, there would be at most $n$ objects.
^p-pigeonhole

> [!thm] Theorem 6 (general pigeonhole and averaging)
> (a) If $m$ objects are put into $n$ boxes, some box holds at least $\lceil m/n \rceil$ objects and some box holds at most $\lfloor m/n \rfloor$.
> (b) If $w_1, \dots, w_n > 0$ have sum $1$ and $\sum_i w_i x_i = \mu$ for real $x_i$, then $x_i \ge \mu$ for some $i$ and $x_j \le \mu$ for some $j$. With equal weights: some term of a finite list is at least its mean, and some term is at most its mean.
^pigeonhole-gen

> [!proof]- Proof
> 1. For (b): if every $x_i < \mu$, then $\sum_i w_i x_i < \sum_i w_i \mu = \mu$ because every $w_i$ is positive. The other half is the same with the inequality reversed.
> 2. For (a): let box $i$ hold $c_i$ objects. The mean of $c_1, \dots, c_n$ is $m/n$, so by (b) with $w_i = 1/n$ some $c_i \ge m/n$ and some $c_j \le m/n$.
> 3. The $c_i$ are integers, so $c_i \ge \lceil m/n \rceil$ and $c_j \le \lfloor m/n \rfloor$.
^p-pigeonhole-gen

All the skill is in choosing the boxes. Boxes that come up again and again:
- Residues mod $n$: two integers in one box differ by a multiple of $n$.
- Partial sums $s_0 = 0, s_1, \dots, s_n$ taken mod $n$: $n + 1$ objects, and two equal ones bound a block of consecutive terms.
- Intervals $[k/n, (k+1)/n)$ for fractional parts: two in one box are closer than $1/n$.
- Pairs $\{x, c - x\}$ with a fixed sum, or pairs of opposite points: two chosen objects in one pair "match".
- Pieces of a region: two points in one piece are close.
^boxes

A pigeonhole argument proves that a threshold is enough. A "find the least $k$" answer also needs a construction one below the threshold, and that construction is usually one object taken from each box. ^sharpness

## Examples

> [!example] A sum of inverse cubes
> Show that $\sum_{k=1}^{n} \dfrac{1}{k^3} < \dfrac32$ for every $n \ge 1$.
^ex-inverse-cubes

> [!solution]- Solution
> methods: induction
> 1. Write $S_n$ for the sum. The direct step fails: $S_{n-1} < 3/2$ says nothing about $S_{n-1} + 1/n^3$.
> 2. Claim the stronger $S_n \le \dfrac32 - \dfrac{1}{2n^2}$. At $n = 1$ this reads $1 \le 1$.
> 3. Step, for $n \ge 2$: from the claim at $n-1$, $S_n \le \dfrac32 - \dfrac{1}{2(n-1)^2} + \dfrac{1}{n^3}$, which is at most $\dfrac32 - \dfrac{1}{2n^2}$ exactly when $\dfrac{1}{2(n-1)^2} - \dfrac{1}{2n^2} \ge \dfrac{1}{n^3}$.
> 4. Multiply by $2n^3(n-1)^2 > 0$: the condition becomes $n(2n-1) \ge 2(n-1)^2$, that is $3n \ge 2$. True.
> 5. So $S_n \le 3/2 - 1/(2n^2) < 3/2$.
> 6. Where the numbers came from: running the step with $c/n^2$ in place of $1/(2n^2)$ needs $cn(2n-1) \ge (n-1)^2$ for all $n \ge 2$, which $c = 1/2$ satisfies; the base case then fixed the bound at $1 + c = 3/2$. The limit of $S_n$ is about $1.202$.

> [!example] Signed powers of three
> Show that every integer $n$ (positive, negative or zero) can be written as $\sum_{i \ge 0} \varepsilon_i 3^i$ with every $\varepsilon_i \in \{-1, 0, 1\}$ and only finitely many $\varepsilon_i$ nonzero.
^ex-signed-ternary

> [!solution]- Solution
> methods: strong-induction
> 1. Induct strongly on $|n|$. For $n = 0$ take every $\varepsilon_i = 0$.
> 2. For $n \ne 0$, pick $r \in \{-1, 0, 1\}$ with $r \equiv n \pmod 3$ and put $m = (n - r)/3$, an integer.
> 3. $|m| \le (|n| + 1)/3 \le 2|n|/3 < |n|$, since $|n| \ge 1$.
> 4. By the hypothesis, $m = \sum_i \delta_i 3^i$ with $\delta_i \in \{-1, 0, 1\}$, so $n = r + \sum_i \delta_i 3^{i+1}$ has the required form.
> 5. The step used the case $m \approx n/3$, not $n - 1$; ordinary induction would have had nothing to stand on.

> [!example] Two racks
> A cluster has $n$ servers, and some pairs of servers are linked. Show that the servers can be split between two racks so that every server has at least half of its links going to the other rack.
^ex-two-racks

> [!solution]- Solution
> methods: extremal
> 1. There are $2^n$ splits, finitely many, so one of them maximises the number $X$ of links that cross between the racks.
> 2. Suppose that in this split some server $v$ has $a$ links inside its own rack and $b$ to the other rack, with $a > b$.
> 3. Moving $v$ to the other rack changes $X$ by $a - b > 0$, and no other link changes side.
> 4. That contradicts the maximality of $X$, so every server has $b \ge a$, i.e. at least half of its links cross.
> 5. Summing $b_v \ge (a_v + b_v)/2$ over all servers gives $2X \ge m$ for $m$ links: some split has at least half of all links crossing.

## Derive

> [!derive] Prove the well-ordering of $\mathbb N$ from Theorem 1, taking induction as the axiom instead.
^d-wo-from-induction

> [!derive] Prove that every sequence of $mn + 1$ distinct real numbers has an increasing subsequence of length $m + 1$ or a decreasing subsequence of length $n + 1$, and that $mn$ terms are not enough.
^d-monotone-subsequence

> [!derive] Prove that among any $n$ integers $a_1, \dots, a_n$ there is a block $a_i, a_{i+1}, \dots, a_j$ of consecutive terms, $i \le j$, whose sum is divisible by $n$.
^d-block-sum

> [!derive] Prove that for every real $x$ and every integer $N \ge 1$ there are integers $p, q$ with $1 \le q \le N$ and $|qx - p| < 1/N$.
^d-dirichlet

> [!derive] Prove that if a positive integer $m$ is not a perfect square, then $\sqrt m$ is irrational.
^d-sqrt-irrational

## Problems

> [!problem] Ratios that are powers of three (d 2.5)
> Find the least $k$ such that every $k$-element subset of $\{1, 2, \dots, 30\}$ contains two elements $a < b$ for which $b/a$ is a power of $3$.
^inv-gen-power-three-ratios

> [!solution]- Solution
> methods: pigeonhole
> 1. Write each $m \le 30$ as $m = 3^e t$ with $3 \nmid t$. The possible $t$ are the integers from $1$ to $30$ not divisible by $3$: there are $20$.
> 2. If $a < b$ share the same $t$, then $b/a = 3^{e_b - e_a}$ with $e_b > e_a$, a power of $3$. Conversely, $b = 3^j a$ forces $b$ and $a$ to have the same $t$.
> 3. So a subset avoids the pattern exactly when its elements have distinct $t$. With $21$ elements and $20$ values of $t$, two share a value.
> 4. The $20$ numbers not divisible by $3$ have distinct $t$ (each is its own $t$), so $20$ is not enough.
> Answer: $k = 21$.

> [!problem] A quartic equation in three unknowns (d 2.5)
> Find all integer solutions of $x^4 + 2y^4 = 4z^4$.
^inv-gen-quartic

> [!solution]- Solution
> methods: descent
> 1. Signs do not matter, so look at non-negative solutions. Suppose one has $x + y + z > 0$, and take such a solution with $x + y + z$ least.
> 2. $x^4 = 4z^4 - 2y^4$ is even, so $x = 2a$.
> 3. Then $16a^4 + 2y^4 = 4z^4$, i.e. $8a^4 + y^4 = 2z^4$, so $y$ is even: $y = 2b$.
> 4. Then $8a^4 + 16b^4 = 2z^4$, i.e. $4a^4 + 8b^4 = z^4$, so $z$ is even: $z = 2c$.
> 5. Then $4a^4 + 8b^4 = 16c^4$, i.e. $a^4 + 2b^4 = 4c^4$: a non-negative solution with $a + b + c = (x+y+z)/2$, positive and smaller. Contradiction.
> Answer: only $(0, 0, 0)$. (A search over $0 \le x, y, z < 60$ finds no other.)

> [!problem] A product of thirds (d 4)
> Show that for every integer $n \ge 1$,
> $$\prod_{k=1}^{n} \frac{3k-2}{3k} < \frac{1}{(3n)^{2/3}}.$$
^inv-gen-product-thirds

> [!solution]- Solution
> methods: induction
> 1. Let $P_n$ be the product. A step on the stated bound would need $\frac{3n-2}{3n} \le \left(\frac{n-1}{n}\right)^{2/3}$, i.e. $(3n-2)^3 \le 27n(n-1)^2$, i.e. $36n - 8 \le 27n$: false for every $n \ge 1$.
> 2. Claim instead $P_n \le (3n+1)^{-2/3}$, which is smaller than $(3n)^{-2/3}$. At $n = 1$: $1/3 \le 4^{-2/3}$ is $4^2 \le 3^3$, true.
> 3. Step, for $n \ge 2$: $3(n-1) + 1 = 3n - 2$, so the claim at $n-1$ gives $P_n \le (3n-2)^{-2/3} \cdot \frac{3n-2}{3n} = \frac{(3n-2)^{1/3}}{3n}$.
> 4. This is at most $(3n+1)^{-2/3}$ exactly when, after cubing, $(3n-2)(3n+1)^2 \le 27n^3$.
> 5. The left side expands to $27n^3 - 9n - 2$. True.
> 6. So $P_n \le (3n+1)^{-2/3} < (3n)^{-2/3}$.

> [!problem] Probe-card pin nets (d 4.5)
> A probe card carries pins in a grid of $5$ rows and $N$ columns. Each pin is tied either to the power net or to the ground net. Find the least $N$ such that every assignment puts four pins of one net at the corners of a rectangle whose sides run along grid rows and columns.
^inv-gen-probe-pins

> [!solution]- Solution
> methods: pigeonhole, double-counting
> 1. Call a *same-net pair* of a column a pair of rows together with a net, such that both pins of that column in those rows are on that net. A rectangle of one net is exactly two columns sharing a same-net pair.
> 2. There are $2\binom52 = 20$ possible same-net pairs.
> 3. A column with $c$ power pins has $\binom c2 + \binom{5-c}{2}$ same-net pairs: $10, 6, 4, 4, 6, 10$ for $c = 0, \dots, 5$. So every column has at least $4$.
> 4. With $N \ge 6$ there are at least $24 > 20$ same-net pairs, so two columns share one.
> 5. With $N = 5$ and no rectangle, the at least $20$ pairs are distinct, so each column has exactly $4$ (a $3$–$2$ split) and each of the $20$ possible pairs occurs exactly once.
> 6. Count the $10$ power pairs: a column with $3$ power pins gives $3$ of them, one with $2$ power pins gives $1$. If $a$ columns have $3$ power pins, $3a + (5 - a) = 10$, so $2a = 5$: impossible. So $N = 5$ forces a rectangle.
> 7. $N = 4$ does not. With P for power and G for ground, take the rows PPGG, PGPG, PGGP, GPPG, GPGP. Each column is a $3$–$2$ split, and its $4$ same-net pairs are all different from the other columns' (checked by listing them, and by a computer search).
> Answer: $N = 5$.

> [!problem] No element the sum of two others (d 4.5)
> For an integer $N \ge 1$, find the largest size of a subset $S \subseteq \{1, 2, \dots, N\}$ in which no element equals the sum of two other, distinct elements of $S$.
^inv-gen-no-sum-of-two

> [!solution]- Solution
> methods: extremal, pigeonhole
> 1. Construction: $S = \{\lceil N/2 \rceil, \dots, N\}$ has $\lfloor N/2 \rfloor + 1$ elements, and two distinct elements of it sum to at least $2\lceil N/2 \rceil + 1 > N$.
> 2. Bound: let $M = \max S$. Every other element of $S$ lies in $\{1, \dots, M-1\}$.
> 3. Split $\{1, \dots, M-1\}$ into the pairs $\{x, M - x\}$ with $x < M/2$, plus the single number $M/2$ when $M$ is even. There are $\lfloor (M-1)/2 \rfloor$ pairs.
> 4. Both members of a pair in $S$ would give $M = x + (M - x)$ with distinct summands, so $S$ meets each pair at most once.
> 5. Hence $|S| \le \lfloor (M-1)/2 \rfloor + [M \text{ even}] + 1 = \lfloor M/2 \rfloor + 1 \le \lfloor N/2 \rfloor + 1$.
> Answer: $\lfloor N/2 \rfloor + 1$. (Checked by exhaustive search for $N \le 18$.)
