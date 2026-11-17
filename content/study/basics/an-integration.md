---
study: basic
id: an-integration
title: Integrals, Riemann sums and symmetry
area: an
needs: [an-limits-series, an-mvt-taylor]
build: 1
tracks: [putnam, interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: the [Cauchy criterion](an-limits-series.md#^cauchy-seq), [monotone convergence](an-limits-series.md#^monotone), [uniform continuity](an-mvt-taylor.md#^uniform-continuity), the [extreme](an-mvt-taylor.md#^extreme-value) and [intermediate](an-mvt-taylor.md#^ivt) value theorems, and the [mean value theorem](an-mvt-taylor.md#^mvt).
^needs

## The integral of a continuous function

> [!def] Riemann sums and the integral
> A **partition** $P$ of $[a, b]$ is $a = x_0 < x_1 < \cdots < x_n = b$; its **mesh** $\|P\|$ is the longest $x_k - x_{k-1}$. Choosing **tags** $t_k \in [x_{k-1}, x_k]$ gives the **Riemann sum** $S(f, P, t) = \sum_{k=1}^{n} f(t_k)(x_k - x_{k-1})$. $f$ is **integrable** on $[a, b]$ with integral $I = \int_a^b f$ if for every $\varepsilon > 0$ there is a $\delta > 0$ such that $|S(f, P, t) - I| < \varepsilon$ for every partition with $\|P\| < \delta$ and every choice of tags. Set $\int_b^a f = -\int_a^b f$.
^riemann-def

> [!thm] Theorem 1 (continuous functions are integrable)
> A function continuous on $[a, b]$ is integrable there. In particular
> $$\lim_{n \to \infty} \frac{b - a}{n} \sum_{k=1}^{n} f\Bigl(a + k\,\frac{b - a}{n}\Bigr) = \int_a^b f,$$
> and the same for left endpoints, midpoints, or any tags.
^riemann

> [!proof]- Proof (d 4)
> 1. Given $\varepsilon$, uniform continuity gives $\delta$ with $|f(x) - f(y)| < \varepsilon$ whenever $|x - y| < \delta$.
> 2. If $\|P\| < \delta$ and $Q$ refines $P$ (adds points), then $|S(f, P, t) - S(f, Q, s)| \le \varepsilon (b - a)$: on each interval of $P$, every tag of $Q$ inside it is within $\delta$ of $P$'s tag.
> 3. Two partitions of mesh below $\delta$ have a common refinement, so their sums differ by at most $2\varepsilon(b - a)$.
> 4. The sums over the uniform partitions $P_n$ therefore form a Cauchy sequence, with some limit $I$.
> 5. For any $P$ of mesh below $\delta$ and $n$ large, $|S(f, P, t) - I| \le 2\varepsilon(b - a) + |S(f, P_n) - I|$, and the last term tends to $0$.
> 6. So $|S(f, P, t) - I| \le 2\varepsilon (b - a)$ for every such $P$; $\varepsilon$ was arbitrary.
^p-riemann

A sum is a Riemann sum in disguise when it has $n$ terms, a factor $1/n$ (possibly hidden as $n/n^2$ or $1/\sqrt{n^2}$), and each term depends on $k$ and $n$ only through $k/n$. A product $\prod_{k=1}^{n} g(k/n)^{1/n}$ with $g$ continuous and positive is $\exp$ of the Riemann sum of $\ln g$, so it tends to $\exp \int_0^1 \ln g$.
^riemann-recognise

> [!thm] Theorem 2 (properties of the integral)
> For $f, g$ continuous on $[a, b]$ and constants $\alpha, \beta$: $\int (\alpha f + \beta g) = \alpha \int f + \beta \int g$; $f \le g$ implies $\int f \le \int g$; $\int_a^b f = \int_a^c f + \int_c^b f$ for $a \le c \le b$; $\bigl|\int_a^b f\bigr| \le \int_a^b |f| \le (b - a) \max |f|$.
^int-props

> [!proof]- Proof
> 1. Each statement holds for Riemann sums with the same partition and tags, and limits preserve sums and non-strict inequalities.
> 2. For additivity, use partitions that contain $c$; their sums split into a sum over $[a, c]$ and one over $[c, b]$.
^p-int-props

> [!thm] Theorem 3 (positivity)
> If $f$ is continuous and $f \ge 0$ on $[a, b]$ and $\int_a^b f = 0$, then $f = 0$ on $[a, b]$.
^pos-integral

> [!proof]- Proof
> 1. If $f(c) > 0$, continuity gives an interval $J \subseteq [a, b]$ of length $\ell > 0$ around $c$ on which $f > f(c)/2$.
> 2. Then $\int_a^b f \ge \int_J f \ge \ell f(c)/2 > 0$ by Theorem 2.
^p-pos-integral

> [!thm] Theorem 4 (mean value for integrals)
> If $f$ is continuous on $[a, b]$ and $g \ge 0$ is continuous, then $\int_a^b f g = f(c) \int_a^b g$ for some $c \in [a, b]$. With $g = 1$: $\int_a^b f = f(c)(b - a)$.
^int-mvt

> [!proof]- Proof
> 1. $f$ has a minimum $m$ and maximum $M$ on $[a, b]$, so $m \int g \le \int fg \le M \int g$.
> 2. If $\int g = 0$, then $g = 0$ by Theorem 3 and any $c$ works.
> 3. Otherwise $\int fg / \int g$ lies between $m$ and $M$, and the intermediate value theorem gives $c$.
^p-int-mvt

> [!thm] Theorem 5 (fundamental theorem of calculus)
> (1) If $f$ is continuous on $[a, b]$ and $F(x) = \int_a^x f$, then $F' = f$ on $[a, b]$ (one-sided at the ends). (2) If $G$ has a continuous derivative $G' = f$ on $[a, b]$, then $\int_a^b f = G(b) - G(a)$.
^ftc

> [!proof]- Proof (d 2.5)
> 1. For $h \ne 0$, $\frac{F(x + h) - F(x)}{h} = \frac1h \int_x^{x+h} f = f(c_h)$ with $c_h$ between $x$ and $x + h$ (Theorems 2 and 4).
> 2. As $h \to 0$, $c_h \to x$ and continuity gives $f(c_h) \to f(x)$.
> 3. For (2): $(G - F)' = 0$, so $G - F$ is constant ([mean value](an-mvt-taylor.md#^mvt)); hence $G(b) - G(a) = F(b) - F(a) = \int_a^b f$.
^p-ftc

> [!thm] Theorem 6 (substitution)
> If $\varphi$ has a continuous derivative on $[\alpha, \beta]$ and $f$ is continuous on an interval containing $\varphi([\alpha, \beta])$, then $\int_\alpha^\beta f(\varphi(t)) \varphi'(t)\, dt = \int_{\varphi(\alpha)}^{\varphi(\beta)} f(x)\, dx$.
^substitution

> [!proof]- Proof
> 1. Let $F$ be an antiderivative of $f$ (Theorem 5(1)). By the chain rule $(F \circ \varphi)' = f(\varphi)\varphi'$.
> 2. Apply Theorem 5(2) to both sides.
^p-substitution

> [!thm] Theorem 7 (integration by parts)
> If $u, v$ have continuous derivatives on $[a, b]$, then $\int_a^b u v' = \bigl[u v\bigr]_a^b - \int_a^b u' v$.
^ibp

> [!proof]- Proof
> 1. $(uv)' = u'v + uv'$ is continuous.
> 2. Integrate with Theorem 5(2) and rearrange.
^p-ibp

Integration by parts trades a factor that is easy to integrate for one that becomes simpler when differentiated. Its main uses here: recursions in $n$ for $\int x^n(\cdots)$, and asymptotic expansions in $1/n$, where each application gains one power of $n$.
^ibp-use

## Symmetry

> [!thm] Theorem 8 (reflection)
> For $f$ continuous on $[a, b]$:
> $$\int_a^b f(x)\, dx = \int_a^b f(a + b - x)\, dx = \frac12 \int_a^b \bigl(f(x) + f(a + b - x)\bigr)\, dx.$$
> In particular an odd function integrates to $0$ over $[-c, c]$.
^reflection

> [!proof]- Proof
> 1. Substitute $x = a + b - t$; the limits swap and $dx = -dt$.
> 2. Average the two equal integrals.
> 3. For odd $f$ on $[-c, c]$, $f(x) + f(-x) = 0$.
^p-reflection

The move pays when $f(x) + f(a + b - x)$ is simpler than $f$: a constant, a function with a known integral, or the same integral with a factor removed. On $(0, \infty)$ the analogous move is $x \mapsto 1/x$, which fixes $1$ and swaps $(0, 1)$ with $(1, \infty)$.
^reflection-use

## Sums against integrals

> [!thm] Theorem 9 (sum versus integral)
> Let $f$ be continuous, nonnegative and nonincreasing on $[m, \infty)$, with $m$ an integer. For $n \ge m$:
> $$\int_m^{n+1} f \le \sum_{k=m}^{n} f(k) \le f(m) + \int_m^{n} f.$$
> So $\sum_{k \ge m} f(k)$ converges exactly when $\lim_{R \to \infty} \int_m^R f$ exists. Moreover $d_n = \sum_{k=m}^{n} f(k) - \int_m^n f$ is nonincreasing and converges to a limit in $[0, f(m)]$.
^sum-integral

> [!proof]- Proof (d 2)
> 1. On $[k, k+1]$, $f(k+1) \le f(x) \le f(k)$, so $f(k+1) \le \int_k^{k+1} f \le f(k)$.
> 2. Sum the right inequality over $k = m, \dots, n$: the lower bound.
> 3. Sum the left inequality over $k = m, \dots, n - 1$ and add $f(m)$: the upper bound.
> 4. $d_{n+1} - d_n = f(n+1) - \int_n^{n+1} f \le 0$, and by step 2 (with $n - 1$) $d_n \ge f(n) \ge 0$.
> 5. A nonincreasing sequence bounded below converges, and $d_m = f(m)$.
^p-sum-integral

With $f(x) = 1/x$: $\ln(n+1) \le H_n \le 1 + \ln n$, and $H_n - \ln n$ decreases to a constant in $[0, 1]$ (Euler's constant, about $0.5772$).
^harmonic

## Improper integrals and limits under the integral

> [!def] Improper integral
> $\int_a^\infty f = \lim_{R \to \infty} \int_a^R f$ when the limit exists, for $f$ continuous on $[a, \infty)$. If $f$ is continuous on $(a, b]$ but not at $a$, $\int_a^b f = \lim_{\delta \to 0^+} \int_{a + \delta}^b f$. The integral **converges absolutely** if the same limit exists for $|f|$.
^improper

> [!thm] Theorem 10 (convergence of improper integrals)
> $\int_a^\infty f$ converges if and only if for every $\varepsilon > 0$ there is an $R_0$ with $\bigl|\int_R^{R'} f\bigr| < \varepsilon$ for all $R' > R \ge R_0$. Absolute convergence implies convergence. If $0 \le f \le g$ and $\int_a^\infty g$ converges, so does $\int_a^\infty f$. $\int_1^\infty x^{-p}\,dx$ converges exactly when $p > 1$, and $\int_0^1 x^{-p}\,dx$ exactly when $p < 1$. The same statements hold at a finite endpoint.
^improper-tests

> [!proof]- Proof
> 1. Write $F(R) = \int_a^R f$. If the condition holds, $F(R_n)$ is Cauchy for every $R_n \to \infty$, and two such sequences can be interleaved, so all have one limit. The converse is the triangle inequality.
> 2. $\bigl|\int_R^{R'} f\bigr| \le \int_R^{R'} |f|$, so the condition for $|f|$ gives it for $f$.
> 3. For $f \ge 0$, $F$ is nondecreasing and converges exactly when bounded, and $\int_a^R f \le \int_a^R g$.
> 4. $\int_1^R x^{-p} dx = \frac{R^{1-p} - 1}{1 - p}$ for $p \ne 1$ and $\ln R$ for $p = 1$; the integral over $[\delta, 1]$ is the same computation.
^p-improper-tests

> [!thm] Theorem 11 (uniform limits)
> If $f_n$ and $f$ are continuous on $[a, b]$ and $\sup_{[a,b]} |f_n - f| \to 0$, then $\int_a^b f_n \to \int_a^b f$. In particular a series of continuous functions whose partial sums converge uniformly may be integrated term by term.
^uniform-limit

> [!proof]- Proof
> 1. $\bigl|\int f_n - \int f\bigr| \le \int |f_n - f| \le (b - a) \sup |f_n - f| \to 0$.
^p-uniform-limit

Stated without proof (it needs the Lebesgue integral): if $f_n \to f$ pointwise, all continuous on an interval, and $|f_n| \le g$ for one $g$ with $\int g < \infty$, then $\int f_n \to \int f$. This is **dominated convergence**; it is the usual licence for a limit under an improper integral, and naming the dominating $g$ is the whole justification.
^dominated

> [!trap] A limit pulled inside an integral
> $f_n(x) = n x (1 - x^2)^n$ tends to $0$ at every $x \in [0, 1]$, but $\int_0^1 f_n = \frac{n}{2(n+1)} \to \frac12$. The bump near $x = 0$ gets taller and narrower; no single integrable $g$ dominates all $f_n$, and the convergence is not uniform.
^trap-limit-inside

## Parameters and double integrals

> [!thm] Theorem 12 (continuity in a parameter)
> If $f$ is continuous on the rectangle $[a, b] \times [c, d]$, then $F(t) = \int_a^b f(x, t)\, dx$ is continuous on $[c, d]$.
^param-continuity

> [!proof]- Proof
> 1. $f$ is uniformly continuous on the rectangle ([uniform continuity](an-mvt-taylor.md#^uniform-continuity), rectangle case).
> 2. Given $\varepsilon$, take $\delta$ from it; for $|t - s| < \delta$, $|F(t) - F(s)| \le (b - a)\varepsilon$.
^p-param-continuity

> [!thm] Theorem 13 (differentiation under the integral sign)
> If $f$ and $\partial f / \partial t$ are continuous on $[a, b] \times [c, d]$, then $F(t) = \int_a^b f(x, t)\, dx$ is differentiable on $[c, d]$ and $F'(t) = \int_a^b \frac{\partial f}{\partial t}(x, t)\, dx$.
^diff-under

> [!proof]- Proof (d 3.5)
> 1. $\frac{F(t + h) - F(t)}{h} = \int_a^b \frac{f(x, t + h) - f(x, t)}{h}\, dx$.
> 2. For each $x$, the mean value theorem in $t$ writes the integrand as $\frac{\partial f}{\partial t}(x, t + \theta h)$ for some $\theta \in (0, 1)$ depending on $x$ and $h$.
> 3. $\partial f / \partial t$ is uniformly continuous on the rectangle: given $\varepsilon$, there is $\delta$ with $\bigl|\frac{\partial f}{\partial t}(x, s) - \frac{\partial f}{\partial t}(x, t)\bigr| < \varepsilon$ for all $x$ whenever $|s - t| < \delta$.
> 4. So for $|h| < \delta$ the integrand is within $\varepsilon$ of $\frac{\partial f}{\partial t}(x, t)$ at every $x$, and the two integrals differ by at most $(b - a)\varepsilon$.
^p-diff-under

> [!thm] Theorem 14 (order of integration on a rectangle)
> If $f$ is continuous on $[a, b] \times [c, d]$, then $\int_a^b \int_c^d f(x, y)\, dy\, dx = \int_c^d \int_a^b f(x, y)\, dx\, dy$.
^fubini

> [!proof]- Proof (d 3.5)
> 1. For $s \in [c, d]$ let $L(s) = \int_a^b \bigl(\int_c^s f(x, y)\, dy\bigr) dx$ and $R(s) = \int_c^s \bigl(\int_a^b f(x, y)\, dx\bigr) dy$.
> 2. The inner integral of $R$ is continuous in $y$ (Theorem 12), so $R'(s) = \int_a^b f(x, s)\, dx$ (Theorem 5).
> 3. $g(x, s) = \int_c^s f(x, y)\, dy$ is continuous with $\partial g / \partial s = f(x, s)$ continuous, so Theorem 13 gives $L'(s) = \int_a^b f(x, s)\, dx$.
> 4. $L(c) = R(c) = 0$ and $L' = R'$, so $L = R$; take $s = d$.
^p-fubini

> [!trap] Swapping the order across a singularity
> $f(x, y) = \frac{x - y}{(x + y)^3}$ on $(0, 1]^2$ is not continuous at the corner. Integrating in $y$ first gives $\frac12$; integrating in $x$ first gives $-\frac12$. The double integral of $|f|$ is infinite, and Theorem 14 does not apply.
^trap-fubini

## Examples

> [!example] A sum of inverse square roots
> Find $\displaystyle\lim_{n \to \infty} \sum_{k=1}^{n} \frac{1}{\sqrt{4n^2 - k^2}}$.
^ex-inverse-root-sum

> [!solution]- Solution
> methods: riemann-sum
> 1. Factor $n$ out of the root: the sum is $\frac1n \sum_{k=1}^n \frac{1}{\sqrt{4 - (k/n)^2}}$.
> 2. That is a right-endpoint Riemann sum of the continuous function $1/\sqrt{4 - x^2}$ on $[0, 1]$.
> 3. $\int_0^1 \frac{dx}{\sqrt{4 - x^2}} = \arcsin\frac12 = \frac\pi6$. (At $n = 10^5$ the sum is $0.5235992$.)
> Answer: $\dfrac{\pi}{6}$.
^s-ex-inverse-root-sum

> [!example] A ratio of factorials under an n-th root
> Find $\displaystyle\lim_{n \to \infty} \frac1n \Bigl(\frac{(3n)!}{(2n)!}\Bigr)^{1/n}$.
^ex-factorial-root

> [!solution]- Solution
> methods: riemann-sum
> 1. $\frac{(3n)!}{(2n)!\, n^n} = \prod_{k=1}^{n} \frac{2n + k}{n} = \prod_{k=1}^n \bigl(2 + \tfrac kn\bigr)$.
> 2. Its $n$-th root is $\exp\bigl(\frac1n \sum_{k=1}^n \ln(2 + k/n)\bigr) \to \exp \int_0^1 \ln(2 + x)\, dx$.
> 3. $\int_0^1 \ln(2 + x)\,dx = \bigl[(2 + x)\ln(2 + x) - (2 + x)\bigr]_0^1 = 3\ln 3 - 2\ln 2 - 1$.
> 4. $\exp$ of that is $\frac{27}{4e} \approx 2.48319$. (At $n = 10^6$ the expression is $2.483187$.)
> Answer: $\dfrac{27}{4e}$.
^s-ex-factorial-root

> [!example] A rational function damped by a logistic factor
> Evaluate $\displaystyle\int_{-1}^{1} \frac{dx}{(1 + e^x)(1 + x^2)}$.
^ex-logistic-damped

> [!solution]- Solution
> methods: reflection
> 1. With $f$ the integrand, $f(x) + f(-x) = \frac{1}{1 + x^2}\Bigl(\frac{1}{1 + e^x} + \frac{1}{1 + e^{-x}}\Bigr) = \frac{1}{1 + x^2}$.
> 2. Reflection gives $\int_{-1}^1 f = \frac12 \int_{-1}^1 \frac{dx}{1 + x^2} = \frac12 \cdot \frac\pi2$.
> 3. Numerical quadrature agrees to 25 digits.
> Answer: $\dfrac{\pi}{4}$.
^s-ex-logistic-damped

> [!example] Powers of x over the logarithm
> For $t > 0$, evaluate $I(t) = \displaystyle\int_0^1 \frac{x^t - x}{\ln x}\, dx$.
^ex-power-over-log

> [!solution]- Solution
> methods: an-integration/diff-under, an-integration/ftc
> 1. The integrand extends continuously to $[0, 1] \times [\delta, T]$ for $0 < \delta < T$: it tends to $0$ as $x \to 0^+$ and to $t - 1$ as $x \to 1^-$.
> 2. Its $t$-derivative is $\frac{x^t \ln x}{\ln x} = x^t$, also continuous there.
> 3. Differentiation under the integral: $I'(t) = \int_0^1 x^t\, dx = \frac{1}{t + 1}$.
> 4. $I(1) = 0$, so $I(t) = \ln(t + 1) - \ln 2$. (Quadrature at $t = 0.5, 2, 5$ agrees.)
> Answer: $\ln\dfrac{1 + t}{2}$.
^s-ex-power-over-log

## Derive

> [!derive] Prove that if $f$ is continuous on $[a, b]$ and $\int_a^b f g = 0$ for every continuous $g$, then $f = 0$.
^d-orthogonal-zero

> [!derive] Let $I_n = \int_0^{\pi/2} \sin^n x\, dx$. Prove that $n I_n = (n - 1) I_{n-2}$ for $n \ge 2$, that $I_n$ is nonincreasing, and that $I_{n+1}/I_n \to 1$.
^d-sine-powers

> [!derive] Prove that $\int_1^\infty \frac{\sin x}{x}\, dx$ converges and $\int_1^\infty \frac{|\sin x|}{x}\, dx$ diverges.
^d-sine-over-x

> [!derive] Prove that $\ln n! = n \ln n - n + O(\ln n)$.
^d-log-factorial

> [!derive] Prove that if $f$ has a continuous derivative on $[a, b]$, then $\int_a^b f(x) \sin(\lambda x)\, dx \to 0$ as $\lambda \to \infty$.
^d-oscillation-decay

## Problems

> [!problem] A weighted logarithmic sum (d 3)
> Find $\displaystyle\lim_{n \to \infty} \frac{1}{n^2} \sum_{k=1}^{n} k \ln\Bigl(1 + \frac kn\Bigr)$.
^inv-an-weighted-log-sum

> [!solution]- Solution
> methods: riemann-sum, an-integration/ibp
> 1. The expression is $\frac1n \sum_{k=1}^n \frac kn \ln\bigl(1 + \frac kn\bigr)$, a Riemann sum of $x \ln(1 + x)$ on $[0, 1]$.
> 2. By parts: $\int_0^1 x \ln(1 + x)\,dx = \frac{\ln 2}{2} - \frac12 \int_0^1 \frac{x^2}{1 + x}\,dx$.
> 3. $\frac{x^2}{1+x} = x - 1 + \frac{1}{1+x}$, whose integral over $[0, 1]$ is $\ln 2 - \frac12$.
> 4. Total: $\frac{\ln 2}{2} - \frac{\ln 2}{2} + \frac14$. (Symbolic integration agrees; the sum at $n = 10^5$ is $0.2500035$.)
> Answer: $\dfrac14$.
^s-inv-an-weighted-log-sum

> [!problem] x over one plus sine (d 3.5)
> Evaluate $\displaystyle\int_0^{\pi} \frac{x}{1 + \sin x}\, dx$.
^inv-an-x-over-one-plus-sine

> [!solution]- Solution
> methods: reflection
> 1. Reflect $x \mapsto \pi - x$; $\sin(\pi - x) = \sin x$. Adding the two forms, $2I = \pi \int_0^\pi \frac{dx}{1 + \sin x}$.
> 2. $1 + \sin x = 2\cos^2\bigl(\frac\pi4 - \frac x2\bigr)$, and $\frac\pi4 - \frac x2 \in [-\frac\pi4, \frac\pi4]$ on $[0, \pi]$, so the integrand is continuous.
> 3. $\int_0^\pi \frac{dx}{2\cos^2(\pi/4 - x/2)} = \bigl[-\tan(\tfrac\pi4 - \tfrac x2)\bigr]_0^\pi = 1 + 1 = 2$.
> 4. So $I = \pi$. (Quadrature agrees.)
> Answer: $\pi$.
^s-inv-an-x-over-one-plus-sine

> [!problem] A product of one plus squared fractions (d 4)
> Find $\displaystyle\lim_{n \to \infty} \Bigl(\prod_{k=1}^{n} \Bigl(1 + \frac{k^2}{n^2}\Bigr)\Bigr)^{1/n}$.
^inv-an-squares-product

> [!solution]- Solution
> methods: riemann-sum, an-integration/ibp
> 1. The logarithm is $\frac1n \sum_{k=1}^n \ln\bigl(1 + (k/n)^2\bigr) \to \int_0^1 \ln(1 + x^2)\,dx$.
> 2. By parts: $\int_0^1 \ln(1 + x^2)\,dx = \ln 2 - \int_0^1 \frac{2x^2}{1 + x^2}\,dx = \ln 2 - 2 + 2\cdot\frac\pi4$.
> 3. Exponentiate: $2 e^{\pi/2 - 2} \approx 1.302055$. (At $n = 10^5$ the product root is $1.302059$.)
> Answer: $2 e^{\pi/2 - 2}$.
^s-inv-an-squares-product

> [!problem] A power concentrated at the right end (d 5)
> Let $I_n = \displaystyle\int_0^1 \frac{x^n}{1 + x}\, dx$. Find constants $\alpha, \beta$ with $I_n = \frac{\alpha}{n} + \frac{\beta}{n^2} + o\bigl(\frac{1}{n^2}\bigr)$.
^inv-an-power-right-end

> [!solution]- Solution
> methods: an-integration/ibp, bounding
> 1. By parts with $u = \frac{1}{1+x}$, $v' = x^n$: $I_n = \frac{1}{2(n+1)} + \frac{1}{n+1} \int_0^1 \frac{x^{n+1}}{(1+x)^2}\,dx$.
> 2. Again with $u = \frac{1}{(1+x)^2}$: $\int_0^1 \frac{x^{n+1}}{(1+x)^2}dx = \frac{1}{4(n+2)} + \frac{2}{n+2} \int_0^1 \frac{x^{n+2}}{(1+x)^3}dx$.
> 3. The last integral is between $0$ and $\int_0^1 x^{n+2} = \frac{1}{n+3}$, so it contributes $O(n^{-3})$ to $I_n$.
> 4. $I_n = \frac{1}{2(n+1)} + \frac{1}{4(n+1)(n+2)} + O(n^{-3}) = \frac{1}{2n} - \frac{1}{2n^2} + \frac{1}{4n^2} + O(n^{-3})$.
> 5. Numerically $n(n I_n - \frac12) = -0.2499999988$ at $n = 10^4$.
> Answer: $\alpha = \frac12$, $\beta = -\frac14$.
^s-inv-an-power-right-end

> [!problem] Squared factorials over an odd factorial (d 5.5)
> Evaluate $\displaystyle\sum_{n=1}^{\infty} \frac{(n!)^2}{(2n+1)!}$.
^inv-an-factorial-square-series

> [!solution]- Solution
> methods: an-integration/ibp, an-integration/uniform-limit
> 1. Let $B(m, k) = \int_0^1 x^m (1 - x)^k dx$. By parts, $B(m, k) = \frac{k}{m+1} B(m+1, k-1)$, and $B(2n, 0) = \frac{1}{2n+1}$.
> 2. Iterating from $B(n, n)$: $B(n, n) = \frac{n!}{(n+1)(n+2)\cdots(2n)} \cdot \frac{1}{2n+1} = \frac{(n!)^2}{(2n+1)!}$.
> 3. On $[0, 1]$, $0 \le x(1 - x) \le \frac14$, so $\sum_{n \ge 1} (x(1-x))^n$ converges uniformly to $\frac{x(1-x)}{1 - x + x^2}$; integrate term by term.
> 4. $\frac{x(1-x)}{1 - x + x^2} = \frac{1}{1 - x + x^2} - 1$.
> 5. $\int_0^1 \frac{dx}{(x - \frac12)^2 + \frac34} = \frac{2}{\sqrt3}\bigl[\arctan\frac{2x - 1}{\sqrt3}\bigr]_0^1 = \frac{2}{\sqrt3} \cdot \frac\pi3$.
> 6. Total $\frac{2\pi}{3\sqrt3} - 1 \approx 0.2091996$, matching the summed series to 25 digits.
> Answer: $\dfrac{2\pi}{3\sqrt3} - 1$.
^s-inv-an-factorial-square-series
