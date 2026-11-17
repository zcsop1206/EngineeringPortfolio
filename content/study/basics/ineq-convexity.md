---
study: basic
id: ineq-convexity
title: Convexity and the classical inequalities
area: an
needs: [an-mvt-taylor]
build: 1
tracks: [putnam]
---

> Written by a model for Adit. Not Adit's words.

Needs: the [mean value theorem](an-mvt-taylor.md#^mvt) and [comparison of derivatives](an-mvt-taylor.md#^comparison-derivatives). The integral forms below also use the [properties of the integral](an-integration.md#^int-props) and [positivity](an-integration.md#^pos-integral).
^needs

## Convex functions

> [!def] Convex function
> $f$ on an interval $I$ is **convex** if $f(tx + (1-t)y) \le t f(x) + (1-t) f(y)$ for all $x, y \in I$ and $t \in [0, 1]$: every chord lies on or above the graph. It is **strictly convex** if the inequality is strict whenever $x \ne y$ and $0 < t < 1$. $f$ is **concave** if $-f$ is convex.
^convex-def

> [!thm] Theorem 1 (increasing slopes)
> $f$ is convex on $I$ if and only if for all $x < y < z$ in $I$:
> $$\frac{f(y) - f(x)}{y - x} \le \frac{f(z) - f(x)}{z - x} \le \frac{f(z) - f(y)}{z - y}.$$
^slopes

> [!proof]- Proof
> 1. Write $y = tx + (1 - t)z$ with $t = \frac{z - y}{z - x} \in (0, 1)$, so $1 - t = \frac{y - x}{z - x}$.
> 2. Convexity at this $y$ reads $f(y) \le t f(x) + (1 - t) f(z)$.
> 3. Subtracting $f(x)$: $f(y) - f(x) \le (1 - t)(f(z) - f(x))$, which is the left inequality after dividing by $y - x$.
> 4. Subtracting $f(z)$ instead: $f(y) - f(z) \le t(f(x) - f(z))$, which is the right inequality after dividing by $-(z - y)$. Every step reverses.
^p-slopes

> [!thm] Theorem 2 (derivative tests)
> A differentiable $f$ is convex on $I$ if and only if $f'$ is nondecreasing on $I$. A twice differentiable $f$ is convex if and only if $f'' \ge 0$ on $I$, and $f'' > 0$ implies strictly convex.
^second-derivative

> [!proof]- Proof (d 2.5)
> 1. Convex implies $f'$ nondecreasing: in Theorem 1 let $y \to x^+$ in the left inequality and $y \to z^-$ in the right; $f'(x) \le \frac{f(z) - f(x)}{z - x} \le f'(z)$.
> 2. Conversely, for $x < y < z$ the mean value theorem gives the slope over $[x, y]$ as $f'(\xi)$ and over $[y, z]$ as $f'(\eta)$ with $\xi < y < \eta$, so the first is at most the second.
> 3. The slope over $[x, z]$ is the weighted average $\frac{(y - x) s_{xy} + (z - y) s_{yz}}{z - x}$ of those two, so it lies between them: Theorem 1 holds.
> 4. $f'$ is nondecreasing exactly when $f'' \ge 0$ (mean value theorem); $f'' > 0$ makes $f'$ strictly increasing and the inequality in step 2 strict.
^p-second-derivative

> [!thm] Theorem 3 (tangent and supporting lines)
> If $f$ is convex on $I$ and differentiable at an interior point $a$, then $f(x) \ge f(a) + f'(a)(x - a)$ for all $x \in I$, with equality only at $x = a$ when $f$ is strictly convex. Without differentiability, a convex $f$ still has at each interior $a$ a **supporting line**: a slope $c$ with $f(x) \ge f(a) + c(x - a)$ for all $x \in I$.
^tangent-line

> [!proof]- Proof (d 2)
> 1. For $x > a$ and $a < y < x$, Theorem 1 gives $\frac{f(x) - f(a)}{x - a} \ge \frac{f(y) - f(a)}{y - a}$, and the right side tends to $f'(a)$ as $y \to a^+$.
> 2. Multiply by $x - a > 0$.
> 3. For $x < a$ and $x < y < a$, Theorem 1 gives $\frac{f(a) - f(x)}{a - x} \le \frac{f(a) - f(y)}{a - y} \to f'(a)$; multiply by $a - x > 0$ and rearrange.
> 4. Strict case: if equality held at some $x \ne a$, the midpoint $m$ of $a$ and $x$ would satisfy $f(m) <$ the chord value at $m$, which is the tangent line's value there, contradicting step 2 or 3 at $m$.
> 5. Without differentiability, Theorem 1 makes the slopes from $a$ monotone, so the one-sided derivatives $f'_-(a) \le f'_+(a)$ exist; steps 1 to 3 work with any $c$ between them.
^p-tangent-line

The tangent line is the tool when a sum $\sum f(x_i)$ under a constraint $\sum x_i = $ const must be bounded and $f$ is not convex on the whole range: guess the equality point, write the tangent line there, and check $f(x) \ge$ (or $\le$) the line by factoring. A correct tangent at $x = 1$ shows up as a factor $(x - 1)^2$.
^tangent-use

> [!thm] Theorem 4 (Jensen)
> Let $f$ be convex on $I$, $x_1, \dots, x_n \in I$, and $w_i \ge 0$ with $\sum w_i = 1$. Then
> $$f\Bigl(\sum_i w_i x_i\Bigr) \le \sum_i w_i f(x_i).$$
> If $f$ is strictly convex and all $w_i > 0$, equality holds only when all $x_i$ are equal. For concave $f$ the inequality reverses.
^jensen

> [!proof]- Proof (d 2.5)
> 1. $m = \sum w_i x_i$ lies between the smallest and largest $x_i$, so in $I$. If $m$ is an endpoint of $I$, every $x_i$ with $w_i > 0$ equals $m$ and there is nothing to prove.
> 2. Otherwise take a supporting line at $m$: $f(x) \ge f(m) + c(x - m)$ on $I$.
> 3. Put $x = x_i$, multiply by $w_i$, and add: $\sum w_i f(x_i) \ge f(m) + c \sum w_i (x_i - m) = f(m)$.
> 4. Strict case: equality forces $f(x_i) = f(m) + c(x_i - m)$ for each $i$, and a strictly convex $f$ meets a supporting line only at $m$ (as in Theorem 3, step 4).
^p-jensen

## Means

> [!thm] Theorem 5 (arithmetic and geometric means)
> For positive $a_1, \dots, a_n$ and weights $w_i > 0$ with $\sum w_i = 1$: $\sum w_i a_i \ge \prod a_i^{w_i}$, with equality only when all $a_i$ are equal. With $w_i = \frac1n$: $\frac{a_1 + \cdots + a_n}{n} \ge (a_1 \cdots a_n)^{1/n}$. Applied to $1/a_i$: $(a_1 \cdots a_n)^{1/n} \ge \frac{n}{1/a_1 + \cdots + 1/a_n}$.
^am-gm

> [!proof]- Proof
> 1. $\ln$ is strictly concave on $(0, \infty)$: $(\ln x)'' = -1/x^2 < 0$.
> 2. Jensen: $\ln \sum w_i a_i \ge \sum w_i \ln a_i = \ln \prod a_i^{w_i}$, with the stated equality case.
> 3. $\exp$ is increasing. For the last claim, apply the unweighted form to $1/a_i$ and take reciprocals.
^p-am-gm

AM-GM bounds a sum below by a product, or a product above by a sum. To maximise a product under a linear constraint, split the variables into equal parts so that the parts are equal at the optimum, then apply AM-GM to the parts.
^am-gm-use

> [!thm] Theorem 6 (Young)
> For $a, b \ge 0$ and $p, q > 1$ with $\frac1p + \frac1q = 1$: $ab \le \frac{a^p}{p} + \frac{b^q}{q}$, with equality only when $a^p = b^q$.
^young

> [!proof]- Proof
> 1. If $a = 0$ or $b = 0$ the claim is clear (equality needs both zero).
> 2. Otherwise weighted AM-GM with weights $\frac1p, \frac1q$ on $a^p, b^q$: $\frac{a^p}{p} + \frac{b^q}{q} \ge (a^p)^{1/p} (b^q)^{1/q} = ab$.
^p-young

> [!thm] Theorem 7 (Hölder)
> For reals $a_i, b_i$ and $p, q > 1$ with $\frac1p + \frac1q = 1$:
> $$\sum_i |a_i b_i| \le \Bigl(\sum_i |a_i|^p\Bigr)^{1/p} \Bigl(\sum_i |b_i|^q\Bigr)^{1/q},$$
> with equality only when $(|a_i|^p)$ and $(|b_i|^q)$ are proportional. The same holds for integrals of continuous functions on $[a, b]$.
^holder

> [!proof]- Proof (d 3)
> 1. Let $A$ and $B$ be the two factors on the right. If $A = 0$ every $a_i = 0$ (likewise $B$), and both sides vanish.
> 2. Young with $a = |a_i|/A$ and $b = |b_i|/B$: $\frac{|a_i b_i|}{AB} \le \frac{|a_i|^p}{p A^p} + \frac{|b_i|^q}{q B^q}$.
> 3. Sum over $i$: $\frac{\sum |a_i b_i|}{AB} \le \frac1p + \frac1q = 1$.
> 4. Equality requires equality in every use of Young: $|a_i|^p / A^p = |b_i|^q / B^q$ for all $i$.
> 5. For integrals, run the same steps with $\int$ for $\sum$; the equality case uses positivity of the integral of a continuous nonnegative function.
^p-holder

> [!thm] Theorem 8 (Cauchy–Schwarz)
> For reals $a_i, b_i$: $\bigl(\sum a_i b_i\bigr)^2 \le \sum a_i^2 \sum b_i^2$, with equality only when one sequence is a multiple of the other. For continuous $f, g$ on $[a, b]$: $\bigl(\int fg\bigr)^2 \le \int f^2 \int g^2$, with equality only when $f, g$ are proportional. For $y_i > 0$: $\sum \frac{x_i^2}{y_i} \ge \frac{(\sum x_i)^2}{\sum y_i}$, with equality only when $x_i / y_i$ is constant.
^cauchy-schwarz

> [!proof]- Proof (d 2)
> 1. $\bigl|\sum a_i b_i\bigr| \le \sum |a_i b_i|$, then Hölder with $p = q = 2$; the integral case is the same.
> 2. Equality needs both steps tight: $a_i^2 \propto b_i^2$ from Hölder, and all $a_i b_i$ of one sign from the first step. Together, $a = \lambda b$ for one real $\lambda$ (or $b = 0$).
> 3. The last form is the first applied to $a_i = x_i/\sqrt{y_i}$ and $b_i = \sqrt{y_i}$.
^p-cauchy-schwarz

Two special cases are used constantly: $(\sum_{i=1}^n a_i)^2 \le n \sum a_i^2$ (take $b_i = 1$), and the last form above, which bounds a sum of fractions below in one line. In the integral form, the equality case says which function to pair $f$ with: the one $f$ should be proportional to at the optimum.
^cs-use

> [!thm] Theorem 9 (power means)
> For positive $a_i$ and weights $w_i > 0$ with $\sum w_i = 1$, let $M_r = \bigl(\sum w_i a_i^r\bigr)^{1/r}$ for $r \ne 0$ and $M_0 = \prod a_i^{w_i}$. If $r < s$ then $M_r \le M_s$, with equality only when all $a_i$ are equal. In particular harmonic $\le$ geometric $\le$ arithmetic $\le$ quadratic: $M_{-1} \le M_0 \le M_1 \le M_2$.
^power-means

> [!proof]- Proof (d 3)
> 1. $0 < r < s$: $\varphi(u) = u^{s/r}$ is convex on $(0, \infty)$, so Jensen on the values $a_i^r$ gives $\bigl(\sum w_i a_i^r\bigr)^{s/r} \le \sum w_i a_i^s$; take $s$-th roots.
> 2. $r < s < 0$: now $0 < s/r < 1$ and $\varphi$ is concave, so $\bigl(\sum w_i a_i^r\bigr)^{s/r} \ge \sum w_i a_i^s$; raising to the power $1/s < 0$ reverses it to $M_r \le M_s$.
> 3. $r < 0 < s$, or one of them $0$: AM-GM on the values $a_i^s$ gives $M_0^s \le \sum w_i a_i^s$, so $M_0 \le M_s$; on the values $a_i^r$ it gives $M_0^r \le \sum w_i a_i^r$, and the power $1/r < 0$ gives $M_r \le M_0$.
> 4. Equality: each step uses strict convexity or AM-GM, which are strict unless all $a_i$ agree.
^p-power-means

> [!thm] Theorem 10 (Bernoulli)
> For $x \ge -1$: $(1 + x)^r \ge 1 + rx$ when $r \ge 1$ or $r \le 0$ (for $r < 0$ take $x > -1$), and $(1 + x)^r \le 1 + rx$ when $0 \le r \le 1$.
^bernoulli

> [!proof]- Proof
> 1. $g(x) = (1 + x)^r$ has $g''(x) = r(r - 1)(1 + x)^{r - 2}$, which is $\ge 0$ on $(-1, \infty)$ exactly when $r \ge 1$ or $r \le 0$.
> 2. Its tangent line at $0$ is $1 + rx$; apply Theorem 3 (or its concave mirror). At $x = -1$, check directly.
^p-bernoulli

## Order

> [!thm] Theorem 11 (rearrangement)
> Let $a_1 \le \cdots \le a_n$ and $b_1 \le \cdots \le b_n$, and let $\sigma$ be any permutation of $\{1, \dots, n\}$. Then
> $$\sum_i a_i b_{n+1-i} \le \sum_i a_i b_{\sigma(i)} \le \sum_i a_i b_i.$$
^rearrangement

> [!proof]- Proof (d 2.5)
> 1. If $\sigma$ is not the identity, let $i$ be the least index with $\sigma(i) \ne i$; then $\sigma(i) > i$, and $j = \sigma^{-1}(i)$ satisfies $j > i$.
> 2. Swap the values of $\sigma$ at $i$ and $j$. The sum changes by $a_i b_i + a_j b_{\sigma(i)} - a_i b_{\sigma(i)} - a_j b_i = (a_j - a_i)(b_{\sigma(i)} - b_i) \ge 0$.
> 3. The new permutation fixes $1, \dots, i$; after at most $n$ such swaps it is the identity, and the sum never decreased.
> 4. The lower bound is the upper bound applied to $a_i$ and the nondecreasing sequence $b'_i = -b_{n+1-i}$.
^p-rearrangement

## Examples

> [!example] A sum of rational terms under a fixed total
> Let $a, b, c > 0$ with $a + b + c = 3$. Show that $\displaystyle\frac{a + 3}{a^2 + 3} + \frac{b + 3}{b^2 + 3} + \frac{c + 3}{c^2 + 3} \le 3$, with equality only at $a = b = c = 1$.
^ex-rational-fixed-total

> [!solution]- Solution
> methods: ineq-convexity/tangent-line
> 1. $f(x) = \frac{x + 3}{x^2 + 3}$ is not concave on $(0, 3)$: $f''$ changes sign near $x = 1.45$. Jensen does not apply.
> 2. Equality guess $a = b = c = 1$: $f(1) = 1$, $f'(1) = -\frac14$, tangent $\frac{5 - x}{4}$.
> 3. $f(x) - \frac{5 - x}{4} = \frac{(x - 3)(x - 1)^2}{4(x^2 + 3)} \le 0$ for $0 < x < 3$, with equality only at $x = 1$.
> 4. Sum: $\sum f \le \frac{15 - (a + b + c)}{4} = 3$. (A random search over the constraint finds no value above $3$.)
^s-ex-rational-fixed-total

> [!example] A product of powers under a linear constraint
> Find the maximum of $x^2 y^3$ over $x, y > 0$ with $x + y = 5$.
^ex-power-product

> [!solution]- Solution
> methods: am-gm
> 1. Split $x$ into two halves and $y$ into three thirds: $5 = \frac x2 + \frac x2 + \frac y3 + \frac y3 + \frac y3$.
> 2. AM-GM on the five parts: $1 = \frac{5}{5} \ge \bigl(\frac{x^2}{4} \cdot \frac{y^3}{27}\bigr)^{1/5}$, so $x^2 y^3 \le 108$.
> 3. Equality when $\frac x2 = \frac y3$, i.e. $x = 2$, $y = 3$: $4 \cdot 27 = 108$.
> Answer: $108$.
^s-ex-power-product

> [!example] Squares over shifted sums
> Let $x, y, z > 0$ with $x + y + z = 1$. Show that $\displaystyle\frac{x^2}{x + 2y} + \frac{y^2}{y + 2z} + \frac{z^2}{z + 2x} \ge \frac13$.
^ex-squares-shifted

> [!solution]- Solution
> methods: cauchy-schwarz
> 1. The fraction form of Cauchy–Schwarz: the sum is at least $\frac{(x + y + z)^2}{(x + 2y) + (y + 2z) + (z + 2x)}$.
> 2. The denominator is $3(x + y + z) = 3$, the numerator $1$.
> 3. Equality needs $\frac{x}{x + 2y} = \frac{y}{y + 2z} = \frac{z}{z + 2x}$, which holds at $x = y = z = \frac13$.
^s-ex-squares-shifted

> [!example] Cubes against mixed products
> For positive $a, b, c$, show that $a^3 + b^3 + c^3 \ge a^2 b + b^2 c + c^2 a$.
^ex-cubes-mixed

> [!solution]- Solution
> methods: rearrangement
> 1. The sequences $(a^2, b^2, c^2)$ and $(a, b, c)$ are ordered the same way.
> 2. $a^3 + b^3 + c^3 = a^2 \cdot a + b^2 \cdot b + c^2 \cdot c$ pairs them in matching order.
> 3. $a^2 b + b^2 c + c^2 a$ pairs $(a^2, b^2, c^2)$ with the permutation $(b, c, a)$ of the second sequence, so it is no larger.
^s-ex-cubes-mixed

> [!trap] The symmetric point is not always the extreme
> With $a + b + c = 3$, $a, b, c > 0$, the value of $\sum \frac{1}{a^2 + 2}$ at $a = b = c = 1$ is $1$, but at $(1.4, 1.4, 0.2)$ it is $0.9952$. The tangent line at $1$ gives $\frac{1}{x^2 + 2} - \frac{5 - 2x}{9} = \frac{(x - 1)^2 (2x - 1)}{9(x^2 + 2)}$, which is negative for $x < \frac12$: the factor after $(x - 1)^2$ must keep one sign on the whole range, or the tangent line proves nothing.
^trap-symmetric-point

> [!trap] Direction of the bound
> AM-GM gives a lower bound on a sum and an upper bound on a product, never the reverse. A chain of inequalities proves something only if every link points the same way; a single step that bounds the wrong side breaks the chain silently.
^trap-direction

## Derive

> [!derive] Prove that a convex function on an open interval is continuous.
^d-convex-continuous

> [!derive] Prove that for $f$ continuous and convex on $[a, b]$: $f\bigl(\frac{a+b}{2}\bigr) \le \frac{1}{b - a} \int_a^b f \le \frac{f(a) + f(b)}{2}$.
^d-hermite-hadamard

> [!derive] Prove that for $p \ge 1$: $\bigl(\sum |a_i + b_i|^p\bigr)^{1/p} \le \bigl(\sum |a_i|^p\bigr)^{1/p} + \bigl(\sum |b_i|^p\bigr)^{1/p}$.
^d-minkowski

> [!derive] Prove that if $a_1 \le \cdots \le a_n$ and $b_1 \le \cdots \le b_n$ then $\frac1n \sum a_i b_i \ge \bigl(\frac1n \sum a_i\bigr)\bigl(\frac1n \sum b_i\bigr)$.
^d-similarly-ordered

> [!derive] Prove that the power mean $M_r$ of fixed positive numbers tends to $M_0$ as $r \to 0$.
^d-power-mean-limit

## Problems

> [!problem] A linear form under a product constraint (d 2.5)
> Find the minimum of $a + 2b + 4c$ over positive reals with $abc = 1$.
^inv-an-linear-product-one

> [!solution]- Solution
> methods: am-gm
> 1. AM-GM on $a, 2b, 4c$: $a + 2b + 4c \ge 3(8abc)^{1/3} = 6$.
> 2. Equality when $a = 2b = 4c$; with $abc = 1$ that is $a = 2$, $b = 1$, $c = \frac12$.
> 3. A random search over the constraint gives $6.00001$ as its smallest value.
> Answer: $6$.
^s-inv-an-linear-product-one

> [!problem] Four fractions with a fixed total (d 4)
> Let $a, b, c, d > 0$ with $a + b + c + d = 4$. Prove that $\displaystyle\sum_{\text{cyc}} \frac{a}{a^2 - a + 4} \le 1$.
^inv-an-four-fractions

> [!solution]- Solution
> methods: ineq-convexity/tangent-line
> 1. $f(x) = \frac{x}{x^2 - x + 4}$ changes concavity twice in $(0, 4)$ (near $0.34$ and $3.28$), so Jensen is unavailable.
> 2. At $x = 1$: $f(1) = \frac14$, $f'(1) = \frac{3}{16}$, tangent $\frac{3x + 1}{16}$.
> 3. $f(x) - \frac{3x + 1}{16} = -\frac{(x - 1)^2 (3x + 4)}{16(x^2 - x + 4)} \le 0$ for all $x > 0$ (the denominator is positive).
> 4. Sum: $\sum f \le \frac{3 \cdot 4 + 4}{16} = 1$, with equality only at $a = b = c = d = 1$. (Random search: maximum $0.99988$.)
^s-inv-an-four-fractions

> [!problem] A weighted energy of a rising function (d 4)
> Over functions $f$ with continuous derivative on $[0, 1]$, $f(0) = 0$ and $f(1) = 1$, find the minimum of $\displaystyle\int_0^1 (1 + x)\, f'(x)^2\, dx$ and the minimiser.
^inv-an-weighted-energy

> [!solution]- Solution
> methods: cauchy-schwarz
> 1. $1 = \int_0^1 f' = \int_0^1 \sqrt{1 + x}\, f'(x) \cdot \frac{1}{\sqrt{1 + x}}\,dx$.
> 2. Cauchy–Schwarz: $1 \le \int_0^1 (1 + x) f'^2 \cdot \int_0^1 \frac{dx}{1 + x} = \ln 2 \int_0^1 (1 + x) f'^2$.
> 3. Equality when $\sqrt{1 + x} f' \propto \frac{1}{\sqrt{1 + x}}$, i.e. $f' \propto \frac{1}{1 + x}$; with the boundary values, $f(x) = \frac{\ln(1 + x)}{\ln 2}$.
> 4. Check: for this $f$ the integral is $\int_0^1 \frac{dx}{(1 + x)\ln^2 2} = \frac{1}{\ln 2} \approx 1.4427$.
> Answer: $\dfrac{1}{\ln 2}$, attained by $\dfrac{\ln(1 + x)}{\ln 2}$.
^s-inv-an-weighted-energy

> [!problem] Weighted inverse squares on a simplex (d 4.5)
> Find the minimum of $\dfrac{1}{x^2} + \dfrac{8}{y^2} + \dfrac{27}{z^2}$ over positive $x, y, z$ with $x + y + z = 1$.
^inv-an-weighted-inverse-squares

> [!solution]- Solution
> methods: am-gm
> 1. Guess the optimum is at $x : y : z = 1 : 2 : 3$, i.e. $(\frac16, \frac13, \frac12)$, where the value is $36 + 72 + 108 = 216$.
> 2. For $k \in \{1, 2, 3\}$ and $t > 0$, AM-GM on three terms: $\frac{k^3}{t^2} + 216 t + 216 t \ge 3 (216^2 k^3)^{1/3} = 108 k$, with equality at $t = \frac{k}{6}$.
> 3. Add the three inequalities with $t = x, y, z$: $\frac{1}{x^2} + \frac{8}{y^2} + \frac{27}{z^2} + 432 \ge 108 \cdot 6 = 648$.
> 4. So the sum is at least $216$, attained at $(\frac16, \frac13, \frac12)$. (Random search: $216.0016$.)
> Answer: $216$.
^s-inv-an-weighted-inverse-squares

> [!problem] Coordinates over root complements (d 4)
> For $n \ge 2$, find the minimum of $\displaystyle\sum_{i=1}^{n} \frac{x_i}{\sqrt{1 - x_i}}$ over positive $x_1, \dots, x_n$ with $\sum x_i = 1$.
^inv-an-root-complements

> [!solution]- Solution
> methods: jensen
> 1. $f(x) = x (1 - x)^{-1/2}$ on $(0, 1)$ has $f''(x) = (1 - x)^{-3/2} + \frac{3x}{4}(1 - x)^{-5/2} > 0$, so it is strictly convex.
> 2. Jensen with equal weights: $\frac1n \sum f(x_i) \ge f\bigl(\frac1n\bigr) = \frac{1/n}{\sqrt{1 - 1/n}}$.
> 3. Multiply by $n$: the sum is at least $\frac{1}{\sqrt{1 - 1/n}} = \sqrt{\frac{n}{n - 1}}$, with equality at $x_i = \frac1n$. (Random search for $n = 2, 3, 5$ agrees.)
> Answer: $\sqrt{\dfrac{n}{n - 1}}$.
^s-inv-an-root-complements

> [!problem] A bounded function against its reciprocal (d 5.5)
> Over continuous $f : [0, 1] \to [1, 4]$, find the supremum of $\displaystyle\int_0^1 f \cdot \int_0^1 \frac{1}{f}$, and decide whether it is attained.
^inv-an-function-reciprocal

> [!solution]- Solution
> methods: am-gm, an-integration/pos-integral, intermediate-value
> 1. $1 \le f \le 4$ gives $(f - 1)(4 - f) \ge 0$, i.e. $f + \frac4f \le 5$ pointwise.
> 2. Integrate: $\int f + 4 \int \frac1f \le 5$.
> 3. AM-GM: $2\sqrt{4 \int f \int \frac1f} \le \int f + 4\int \frac1f \le 5$, so $\int f \int \frac1f \le \frac{25}{16}$.
> 4. Equality in step 2 needs $\int \frac{(f - 1)(4 - f)}{f} = 0$, so $(f - 1)(4 - f) = 0$ everywhere by positivity: $f$ takes only the values $1$ and $4$.
> 5. A continuous function on $[0, 1]$ with values in $\{1, 4\}$ is constant (intermediate value), giving product $1$. So $\frac{25}{16}$ is not attained.
> 6. It is approached: $f = 1$ on $[0, \frac12 - \varepsilon]$, $4$ on $[\frac12 + \varepsilon, 1]$, linear between, gives $1.5617$ at $\varepsilon = 0.001$, tending to $\frac{25}{16} = 1.5625$.
> Answer: $\dfrac{25}{16}$, not attained.
^s-inv-an-function-reciprocal
