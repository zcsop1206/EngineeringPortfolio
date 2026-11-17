---
study: basic
id: pr-expectation
title: Expectation, indicators and the probabilistic method
area: comb
needs: [comb-binomial]
build: 1
tracks: [putnam]
---

> Written by a model for Adit. Not Adit's words.

Needs: [counting two ways](comb-binomial.md); the existence argument at the end leans on [averaging](found-induction.md#^pigeonhole-gen). ^needs

Almost all contest probability lives on a finite sample space and uses three facts: expectation is linear whether or not things are independent, a count is a sum of indicators, and a symmetry of the sample space moves probability around without changing it. Conditioning and the existence argument are the other two tools. ^overview

## Probability spaces

> [!def] Probability space, random variable, expectation
> A **sample space** is a finite or countable set $\Omega$ with weights $p(\omega) \ge 0$ summing to $1$. An **event** is a subset $A \subseteq \Omega$, with $P(A) = \sum_{\omega \in A} p(\omega)$. A **random variable** is a function $X : \Omega \to \mathbb R$, and its **expectation** is $E X = \sum_\omega X(\omega)p(\omega)$ when this sum converges absolutely. **Uniform** means $p(\omega) = 1/|\Omega|$ on a finite $\Omega$. For a point chosen uniformly in a region $R \subset \mathbb R^d$ of finite positive volume, $P(S) = \operatorname{vol}(S)/\operatorname{vol}(R)$ and expectations are integrals; every statement below holds there with sums replaced by integrals.
^prob-space

> [!def] Independence
> Events $A_1, \dots, A_n$ are **independent** if $P(A_{i_1} \cap \dots \cap A_{i_r}) = P(A_{i_1}) \cdots P(A_{i_r})$ for every choice of distinct indices; **pairwise independent** asks this only for $r = 2$. Random variables $X_1, \dots, X_n$ are independent if the events $\{X_1 \in B_1\}, \dots, \{X_n \in B_n\}$ are independent for every choice of sets $B_i$.
^independence

## Linearity and indicators

> [!thm] Theorem 1 (linearity of expectation)
> If $E X$ and $E Y$ exist, then $E(aX + bY) = aE X + bE Y$ for all real $a, b$. No independence is needed.
^lin-exp

> [!proof]- Proof
> 1. $E(aX + bY) = \sum_\omega \big(aX(\omega) + bY(\omega)\big)p(\omega)$.
> 2. Both pieces converge absolutely, so the sum splits as $a\sum_\omega X(\omega)p(\omega) + b\sum_\omega Y(\omega)p(\omega)$.
^p-lin-exp

> [!thm] Theorem 2 (indicators)
> The **indicator** $\mathbf 1_A$ of an event is $1$ on $A$ and $0$ off it, and $E\,\mathbf 1_A = P(A)$. If $N = \sum_{i=1}^{n} \mathbf 1_{A_i}$ counts how many of the events $A_i$ happen, then
> $$E N = \sum_i P(A_i), \qquad E N^2 = \sum_i P(A_i) + 2\sum_{i<j} P(A_i \cap A_j),$$
> and $P\left(\bigcup_i A_i\right) \le \sum_i P(A_i)$ (the **union bound**).
^indicators

> [!proof]- Proof
> 1. $E\,\mathbf 1_A = \sum_{\omega \in A} p(\omega) = P(A)$; linearity then gives $E N$.
> 2. $N^2 = \sum_i \mathbf 1_{A_i}^2 + 2\sum_{i<j} \mathbf 1_{A_i}\mathbf 1_{A_j}$, with $\mathbf 1_A^2 = \mathbf 1_A$ and $\mathbf 1_A \mathbf 1_B = \mathbf 1_{A \cap B}$.
> 3. $\mathbf 1_{\bigcup A_i} \le N$ at every $\omega$, and $X \le Y$ everywhere gives $E X \le E Y$ because the weights are non-negative.
^p-indicators

> [!thm] Theorem 3 (variance)
> The **variance** is $\operatorname{Var} X = E(X - EX)^2 = EX^2 - (EX)^2$. If $X$ and $Y$ are independent, $E(XY) = EX \cdot EY$. For $S = X_1 + \dots + X_n$,
> $$\operatorname{Var} S = \sum_i \operatorname{Var} X_i + 2\sum_{i<j}\big(E X_iX_j - EX_i\,EX_j\big),$$
> so $\operatorname{Var} S = \sum_i \operatorname{Var} X_i$ when the $X_i$ are pairwise independent.
^variance

> [!proof]- Proof
> 1. With $\mu = EX$, $E(X - \mu)^2 = EX^2 - 2\mu EX + \mu^2 = EX^2 - \mu^2$ by linearity.
> 2. For independent $X, Y$ with countably many values, $E(XY) = \sum_{x,y} xy\,P(X=x)P(Y=y) = EX \cdot EY$.
> 3. Expand $ES^2 - (ES)^2$ term by term; the cross terms are the bracketed differences, which vanish under pairwise independence by step 2.
^p-variance

> [!thm] Theorem 4 (tail sums)
> If $N$ takes values in $\{0, 1, 2, \dots\}$, then $E N = \sum_{k \ge 1} P(N \ge k)$. If $X \ge 0$ has a density, $E X = \int_0^\infty P(X > t)\,dt$.
^tail-sum

> [!proof]- Proof (d 1.5)
> 1. $N = \sum_{k \ge 1} \mathbf 1[N \ge k]$ at every outcome.
> 2. All terms are non-negative, so expectation and the sum over $k$ can be exchanged (a double series of non-negative terms can be summed in either order).
> 3. For $X$, $X = \int_0^\infty \mathbf 1[X > t]\,dt$ at every outcome; exchange the integrals the same way.
^p-tail-sum

## Conditioning

> [!def] Conditional probability and expectation
> For an event $B$ with $P(B) > 0$: $P(A \mid B) = P(A \cap B)/P(B)$, and $E(X \mid B) = \sum_{\omega \in B} X(\omega)p(\omega)/P(B)$, the expectation under the weights renormalised to $B$. For a random variable $Y$ with countably many values, $E(X \mid Y)$ is the random variable equal to $E(X \mid Y = y)$ on the event $\{Y = y\}$.
^cond-exp

> [!thm] Theorem 5 (total probability and total expectation)
> If events $B_1, B_2, \dots$ of positive probability partition $\Omega$, then $P(A) = \sum_i P(A \mid B_i)P(B_i)$ and $E X = \sum_i E(X \mid B_i)P(B_i)$. In particular $E X = E\big(E(X \mid Y)\big)$.
^total-exp

> [!proof]- Proof
> 1. $A$ is the disjoint union of the $A \cap B_i$, and $P(A \cap B_i) = P(A \mid B_i)P(B_i)$.
> 2. Split the sum defining $E X$ over the $B_i$: $\sum_i \sum_{\omega \in B_i} X(\omega)p(\omega) = \sum_i P(B_i)\,E(X \mid B_i)$.
^p-total-exp

> [!thm] Theorem 6 (first-step equations)
> A process moves on a finite set of states; from state $s$ it goes to $s'$ with probability $P(s, s')$, whatever happened before. Let $T$ be a nonempty set of target states that can be reached from every state, and let $h(s)$ be the expected number of steps to reach $T$ from $s$. Then $h$ is finite, and it is the only function with $h = 0$ on $T$ and
> $$h(s) = 1 + \sum_{s'} P(s, s')\,h(s') \quad (s \notin T).$$
> Hitting probabilities satisfy the same equations without the $1$, with value $1$ on the target and $0$ on any competing absorbing set.
^first-step

> [!proof]- Proof (d 3.5)
> 1. Let $K$ be the number of states. From each state some path of at most $K$ steps reaches $T$; let $q > 0$ be the least probability of these paths.
> 2. Conditioning on the state at times $K, 2K, \dots$, the chance of missing $T$ for $jK$ steps is at most $(1-q)^j$.
> 3. By Theorem 4, $h(s) = \sum_{m \ge 1} P(\text{steps} \ge m) \le K\sum_{j \ge 0} (1-q)^j = K/q$.
> 4. Condition on the first step (Theorem 5): after it the process is a fresh run from $s'$, so $h(s) = 1 + \sum_{s'} P(s, s')h(s')$ off $T$.
> 5. If $g$ is another solution, $d = h - g$ is $0$ on $T$ and $d(s) = \sum_{s'} P(s, s')d(s')$ off $T$.
> 6. Let $D = \max d$ and $Z$ the set where it is attained ([extremal](found-induction.md#^extremal)). If $D > 0$, $Z$ misses $T$, and at $s \in Z$ the value $D$ is an average of values at most $D$, so every $s'$ with $P(s, s') > 0$ lies in $Z$.
> 7. Then no path leaves $Z$, so $T$ is unreachable from $Z$: a contradiction. So $\max d \le 0$, and by the same argument for $-d$, $d = 0$.
^p-first-step

## Symmetry

> [!thm] Theorem 7 (symmetry)
> (a) If $X$ is uniform on a finite set $S$ and $\varphi : S \to S$ is a bijection, then $\varphi(X)$ is uniform on $S$, and $E\,g(X) = E\,g(\varphi(X))$ for every function $g$.
> (b) If $X_1, \dots, X_n$ are independent with a common continuous distribution, all $n!$ orderings of their values are equally likely. So each $X_i$ is the largest with probability $1/n$.
> (c) Let a finite group $G$ [act](alg-groups.md#^actions) on a finite set $X$, let $A$ be a finite abelian group, and let $f : X \to A$ and a surjective homomorphism $\chi : G \to A$ satisfy $f(g \cdot x) = f(x) + \chi(g)$. Then every value of $f$ is taken equally often, $|X|/|A|$ times.
^symmetry

> [!proof]- Proof (d 2.5)
> 1. (a) $P(\varphi(X) = s) = P(X = \varphi^{-1}(s)) = 1/|S|$, so $X$ and $\varphi(X)$ have the same distribution, and so do $g(X)$ and $g(\varphi(X))$.
> 2. (b) For a continuous distribution two values coincide with probability $0$, so almost surely the values have a strict order, described by a permutation $\sigma$.
> 3. Permuting the coordinates by a fixed $\pi$ leaves the joint distribution unchanged (independent, identically distributed) and carries the event "the order is $\sigma$" onto the event "the order is $\sigma\pi^{-1}$", bijectively over all $\sigma$.
> 4. So the $n!$ orders have equal probability, and these sum to $1$.
> 5. (c) For $a, b \in A$ pick $g$ with $\chi(g) = b - a$. Then $x \mapsto g \cdot x$ maps $f^{-1}(a)$ into $f^{-1}(b)$, and $x \mapsto g^{-1} \cdot x$ maps back, so the two fibres are in bijection.
^p-symmetry

Part (c) is why the sum of several fair dice is uniform mod $6$ (shift one die by $1$ and the sum shifts by $1$), and why so many symmetric counts split evenly over residues. A symmetry argument is complete only when the bijection is written down. ^symmetry-use

## Existence from averages

> [!thm] Theorem 8 (probabilistic method)
> If $E X = \mu$, then $P(X \ge \mu) > 0$ and $P(X \le \mu) > 0$. So if a randomly chosen object has expected score $\mu$, some object scores at least $\mu$ and some at most $\mu$. If $X$ takes non-negative integer values and $E X < 1$, then $P(X = 0) > 0$.
^prob-method

> [!proof]- Proof (d 1.5)
> 1. If $X(\omega) < \mu$ at every $\omega$ with $p(\omega) > 0$, then $EX - \mu = \sum_\omega (X(\omega) - \mu)p(\omega)$ is a sum of non-positive terms with at least one negative, so $E X < \mu$. This is [averaging](found-induction.md#^pigeonhole-gen) with weights $p(\omega)$. The other half is the same.
> 2. For integer $X \ge 0$ with $EX < 1$: some outcome of positive weight has $X \le EX < 1$, so $X = 0$ there.
^p-prob-method

**Alteration.** A random choice often gives an object with a few defects. If a random object has expected size $a$ and an expected $b$ defects, each removable at the cost of one unit of size, some object of size at least $a - b$ has no defects. ^alteration

> [!thm] Theorem 9 (Markov and Chebyshev)
> If $X \ge 0$ and $a > 0$, then $P(X \ge a) \le E X/a$. For any $X$ with finite variance and $a > 0$, $P(|X - EX| \ge a) \le \operatorname{Var} X/a^2$.
^markov

> [!proof]- Proof
> 1. $a\,\mathbf 1[X \ge a] \le X$ at every outcome: where $X < a$ the left side is $0$, and where $X \ge a$ it is $a$.
> 2. Take expectations: $a\,P(X \ge a) \le E X$.
> 3. Apply this to $(X - EX)^2$ and $a^2$.
^p-markov

## Examples

> [!example] Neighbours in a shuffled deck
> A deck of $n$ red and $n$ black cards is shuffled uniformly. Find the expected number of adjacent pairs of cards of the same colour.
^ex-deck-neighbours

> [!solution]- Solution
> methods: indicators, linearity-of-expectation
> 1. For $i = 1, \dots, 2n-1$ let $A_i$ be the event that positions $i$ and $i+1$ match in colour.
> 2. By symmetry the two cards in positions $i, i+1$ are a uniformly random pair of distinct cards, so $P(A_i) = \dfrac{2\binom n2}{\binom{2n}{2}} = \dfrac{n-1}{2n-1}$.
> 3. By linearity the expected number is $(2n-1)\cdot\dfrac{n-1}{2n-1}$.
> Answer: $n - 1$. Check at $n = 2$: the six orders of RRBB have $2, 0, 1, 1, 0, 2$ matching pairs, mean $1$.

> [!example] Two sixes in a row
> A fair die is rolled until two consecutive rolls are both $6$. Find the expected number of rolls.
^ex-two-sixes

> [!solution]- Solution
> methods: pr-expectation/first-step
> 1. States: $0$ (the last roll was not a $6$, or no roll yet) and $1$ (the last roll was a $6$). The target is reached from either state within two rolls with probability at least $1/36$, so Theorem 6 applies.
> 2. $h_0 = 1 + \frac56 h_0 + \frac16 h_1$ and $h_1 = 1 + \frac56 h_0$ (a $6$ from state $1$ ends the run).
> 3. Substitute: $h_0 = \frac76 + \frac{35}{36}h_0$, so $h_0/36 = 7/6$.
> Answer: $42$ (a simulation of $200000$ runs gives $42.04$).

> [!example] Few one-coloured quadruples
> Show that the edges of the complete graph on $n$ vertices can be coloured red and blue so that at most $\binom n4/32$ of the $4$-vertex subsets have all six of their edges the same colour.
^ex-few-mono-quads

> [!solution]- Solution
> methods: probabilistic-method, indicators
> 1. Colour each edge red or blue independently with probability $1/2$.
> 2. A $4$-set spans $6$ edges, all one colour with probability $2 \cdot 2^{-6} = 1/32$.
> 3. By linearity the expected number of one-coloured $4$-sets is $\binom n4/32$.
> 4. By Theorem 8 some colouring has at most that many.

> [!example] First three against last two
> Five numbers $X_1, \dots, X_5$ are chosen independently and uniformly from $[0, 1]$. Find the probability that $\max(X_1, X_2, X_3) > \max(X_4, X_5)$.
^ex-three-vs-two

> [!solution]- Solution
> methods: pr-expectation/symmetry
> 1. The event says that the largest of all five is one of $X_1, X_2, X_3$.
> 2. By Theorem 7(b), each $X_i$ is the largest with probability $1/5$, and these events are disjoint.
> Answer: $3/5$ (counting the $120$ orders agrees).

## Derive

> [!derive] Prove that the number of fixed points of a uniformly random permutation of $[n]$ has mean $1$, and variance $1$ when $n \ge 2$.
^d-fixed-points

> [!derive] Prove that the expected number of cycles of a uniformly random permutation of $[n]$ is $1 + \frac12 + \dots + \frac1n$.
^d-cycles

> [!derive] Prove that $P(X = 0) \le \operatorname{Var} X/(E X)^2$ for every random variable $X$ with finite variance and $E X > 0$.
^d-second-moment

> [!derive] Prove that if independent trials each succeed with probability $q > 0$, the expected number of trials up to and including the first success is $1/q$.
^d-geometric

> [!derive] Prove that $n \ge 2$ points chosen independently and uniformly on a circle all lie in some closed semicircle with probability $n/2^{n-1}$.
^d-semicircle

## Problems

> [!problem] Runs in a random subset (d 2.5)
> Each integer from $1$ to $20$ is put into a set $S$ independently with probability $\frac12$. Find the expected number of maximal blocks of consecutive integers in $S$.
^inv-comb-subset-runs

> [!solution]- Solution
> methods: indicators, linearity-of-expectation
> 1. Each block has exactly one first element $i$: one with $i \in S$ and either $i = 1$ or $i - 1 \notin S$.
> 2. That has probability $\frac12$ for $i = 1$ and $\frac14$ for $2 \le i \le 20$.
> Answer: $\frac12 + \frac{19}{4} = \frac{21}{4}$ (exact enumeration agrees for small lengths).

> [!problem] A walk on a pentagon (d 3)
> A token sits on a vertex $V_0$ of a regular pentagon $V_0V_1V_2V_3V_4$. Each second it moves to one of the two neighbouring vertices, each with probability $\frac12$. Find the expected time until it first reaches $V_2$.
^inv-comb-pentagon-walk

> [!solution]- Solution
> methods: pr-expectation/first-step
> 1. By the reflection fixing $V_2$, only the distance to $V_2$ matters: $h_1$ from $V_1$ or $V_3$, $h_2$ from $V_0$ or $V_4$.
> 2. From distance $1$ the neighbours are $V_2$ and a vertex at distance $2$: $h_1 = 1 + \frac12 h_2$.
> 3. From distance $2$ the neighbours are at distances $1$ and $2$ ($V_0$ and $V_4$ are adjacent): $h_2 = 1 + \frac12 h_1 + \frac12 h_2$.
> 4. So $h_2 = 2 + h_1 = 3 + \frac12 h_2$.
> Answer: $6$ (a simulation gives $6.00$).

> [!problem] Runs of a coin (d 4)
> A fair coin is tossed $n$ times. Let $R$ be the number of maximal runs of equal outcomes (so HHTHH has $3$). Find $E R$ and $\operatorname{Var} R$.
^inv-comb-coin-runs

> [!solution]- Solution
> methods: indicators, pr-expectation/symmetry
> 1. $R = 1 + \sum_{i=1}^{n-1} I_i$, where $I_i = 1$ when tosses $i$ and $i+1$ differ.
> 2. Each $P(I_i = 1) = \frac12$, so $E R = 1 + \frac{n-1}{2} = \frac{n+1}{2}$.
> 3. The map (toss$_1$, ..., toss$_n$) $\mapsto$ (toss$_1$, $I_1$, ..., $I_{n-1}$) is a bijection of $\{0,1\}^n$, so by Theorem 7(a) the output is uniform: the $I_i$ are independent fair bits.
> 4. So $\operatorname{Var} R = \sum \operatorname{Var} I_i = \frac{n-1}{4}$.
> Answer: $E R = \frac{n+1}{2}$, $\operatorname{Var} R = \frac{n-1}{4}$ (exact enumeration agrees for $n \le 9$).

> [!problem] The piece holding the middle (d 4)
> A stick of length $1$ is cut at three points chosen independently and uniformly. Find the expected length of the piece that contains the midpoint of the stick.
^inv-comb-stick-midpoint

> [!solution]- Solution
> methods: pr-expectation/tail-sum, linearity-of-expectation
> 1. The piece's length is $G_\ell + G_r$: the distance from $\frac12$ to the nearest cut on its left (or to $0$), plus the same on the right.
> 2. For $0 \le t < \frac12$, $G_\ell > t$ exactly when no cut lands in $(\frac12 - t, \frac12]$: probability $(1-t)^3$. And $G_\ell \le \frac12$ always.
> 3. By Theorem 4, $E G_\ell = \int_0^{1/2} (1-t)^3\,dt = \frac14\left(1 - \frac{1}{16}\right) = \frac{15}{64}$.
> 4. The reflection $x \mapsto 1 - x$ gives $E G_r = \frac{15}{64}$.
> Answer: $\frac{15}{32}$ (a simulation of $400000$ sticks gives $0.4687$). For comparison, the piece containing the end $0$ has expected length $\frac14$.

> [!problem] Two elements, one cycle (d 4.5)
> A permutation of $[n]$, $n \ge 2$, is chosen uniformly. Find the probability that $1$ and $2$ lie in the same cycle.
^inv-comb-same-cycle

> [!solution]- Solution
> methods: pr-expectation/symmetry, pr-expectation/total-exp
> 1. The cycle of $1$ has length $\ell$ in $(n-1)!$ permutations for each $\ell$: choose its other $\ell - 1$ members in order, $\frac{(n-1)!}{(n-\ell)!}$ ways, and permute the rest, $(n-\ell)!$ ways. So the length is uniform on $\{1, \dots, n\}$.
> 2. Given the length $\ell$, relabelling $2, \dots, n$ shows the other members form a uniform $(\ell-1)$-subset of $\{2, \dots, n\}$, so $2$ is among them with probability $\frac{\ell - 1}{n - 1}$.
> 3. By total probability, $\sum_{\ell=1}^{n} \frac1n \cdot \frac{\ell - 1}{n-1} = \frac{1}{n(n-1)} \cdot \frac{n(n-1)}{2}$.
> Answer: $\frac12$ for every $n \ge 2$ (exact enumeration agrees for $n \le 7$).

> [!problem] Signed sums of unit vectors (d 4.5)
> Let $v_1, \dots, v_n$ be vectors of length $1$ in the plane. Show that there are signs $\varepsilon_i \in \{1, -1\}$ with $\left|\sum \varepsilon_i v_i\right| \ge \sqrt n$, and also signs with $\left|\sum \varepsilon_i v_i\right| \le \sqrt n$.
^inv-comb-signed-vectors

> [!solution]- Solution
> methods: probabilistic-method, linearity-of-expectation
> 1. Choose the signs independently and uniformly. Then $\left|\sum \varepsilon_i v_i\right|^2 = \sum_i \varepsilon_i^2|v_i|^2 + \sum_{i \ne j} \varepsilon_i\varepsilon_j\, v_i \cdot v_j$.
> 2. $\varepsilon_i^2 = 1$, and for $i \ne j$, $E\,\varepsilon_i\varepsilon_j = E\varepsilon_i\,E\varepsilon_j = 0$.
> 3. So $E\left|\sum \varepsilon_i v_i\right|^2 = n$, and by Theorem 8 some choice of signs gives at least $n$ and some gives at most $n$. Take square roots.
> (Over all $2^7$ sign choices for seven random unit vectors the mean square is $7$ to machine precision.)
