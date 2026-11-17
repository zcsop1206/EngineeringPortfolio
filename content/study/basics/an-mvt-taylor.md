---
study: basic
id: an-mvt-taylor
title: Continuity, the mean value theorem and Taylor
area: an
needs: [an-limits-series]
build: 1
tracks: [putnam, interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [limits of sequences](an-limits-series.md#^eps-n), the [least upper bound property](an-limits-series.md#^lub), [Bolzano–Weierstrass](an-limits-series.md#^bolzano) and [monotone convergence](an-limits-series.md#^monotone).
^needs

## Limits of functions and continuity

> [!def] Limit of a function
> Let $f$ be defined near $a$ (not necessarily at $a$). $\lim_{x \to a} f(x) = L$ means: for every $\varepsilon > 0$ there is a $\delta > 0$ with $|f(x) - L| < \varepsilon$ whenever $0 < |x - a| < \delta$ and $x$ is in the domain. One-sided limits restrict to $x > a$ or $x < a$; $x \to \infty$ replaces "$0 < |x - a| < \delta$" by "$x > R$".
^fn-limit

> [!thm] Theorem 1 (sequential criterion)
> $\lim_{x \to a} f(x) = L$ if and only if $f(x_n) \to L$ for every sequence $x_n \to a$ with $x_n \ne a$. Hence the [limit laws for sequences](an-limits-series.md#^limit-laws) hold for limits of functions.
^sequential

> [!proof]- Proof
> 1. Forward: given $\varepsilon$, take $\delta$ from the definition; $x_n \to a$ gives $N$ with $0 < |x_n - a| < \delta$ for $n \ge N$, so $|f(x_n) - L| < \varepsilon$.
> 2. Backward: if the definition fails for some $\varepsilon$, then for each $n$ there is $x_n$ with $0 < |x_n - a| < 1/n$ and $|f(x_n) - L| \ge \varepsilon$.
> 3. That sequence tends to $a$ while $f(x_n) \not\to L$.
^p-sequential

> [!def] Continuity and order notation
> $f$ is **continuous at** $a$ if $\lim_{x \to a} f(x) = f(a)$, and continuous on a set if continuous at each of its points. By Theorem 1, sums, products, quotients (where the denominator is nonzero) and compositions of continuous functions are continuous. As $x \to a$, $f = o(g)$ means $f/g \to 0$, and $f = O(g)$ means $|f| \le C|g|$ for some constant $C$ and all $x$ near $a$.
^continuity

> [!thm] Theorem 2 (intermediate value)
> If $f$ is continuous on $[a, b]$ and $y$ lies between $f(a)$ and $f(b)$, then $f(c) = y$ for some $c \in [a, b]$.
^ivt

> [!proof]- Proof (d 2.5)
> 1. The cases $y = f(a)$ or $y = f(b)$ are immediate; replacing $f$ by $-f$ if needed, assume $f(a) < y < f(b)$.
> 2. Let $S = \{x \in [a, b] : f(x) < y\}$, which contains $a$ and is bounded by $b$; let $c = \sup S$.
> 3. If $f(c) < y$, then $c < b$ and continuity gives $\delta$ with $f < y$ on $[c, c + \delta)$, so points of $S$ exceed $c$.
> 4. If $f(c) > y$, then $c > a$ and continuity gives $\delta$ with $f > y$ on $(c - \delta, c]$, so $c - \delta$ is an upper bound of $S$ smaller than $c$.
> 5. Both cases contradict $c = \sup S$, so $f(c) = y$.
^p-ivt

> [!thm] Theorem 3 (extreme values)
> A function continuous on a closed bounded interval $[a, b]$ is bounded there and attains its maximum and its minimum.
^extreme-value

> [!proof]- Proof (d 3)
> 1. If $f$ were unbounded above, there would be $x_n \in [a, b]$ with $f(x_n) > n$.
> 2. A subsequence $x_{n_k} \to c \in [a, b]$ (Bolzano–Weierstrass), and continuity gives $f(x_{n_k}) \to f(c)$, contradicting $f(x_{n_k}) > n_k$.
> 3. So $M = \sup f$ is finite. Pick $x_n$ with $f(x_n) > M - 1/n$.
> 4. A subsequence tends to some $c$, and $f(c) = \lim f(x_{n_k}) \ge M$, so $f(c) = M$. For the minimum apply this to $-f$.
^p-extreme-value

> [!thm] Theorem 4 (uniform continuity)
> If $f$ is continuous on $[a, b]$, then for every $\varepsilon > 0$ there is a $\delta > 0$ such that $|f(x) - f(y)| < \varepsilon$ for all $x, y \in [a, b]$ with $|x - y| < \delta$. The same holds, with the same proof, on a closed bounded rectangle in the plane.
^uniform-continuity

> [!proof]- Proof (d 3)
> 1. Suppose not: some $\varepsilon > 0$ and points $x_n, y_n$ with $|x_n - y_n| < 1/n$ and $|f(x_n) - f(y_n)| \ge \varepsilon$.
> 2. A subsequence $x_{n_k} \to c \in [a, b]$, and then $y_{n_k} \to c$ as well.
> 3. Continuity at $c$ gives $f(x_{n_k}) - f(y_{n_k}) \to 0$, a contradiction. (On a rectangle, apply Bolzano–Weierstrass to each coordinate in turn.)
^p-uniform-continuity

The difference from plain continuity: one $\delta$ serves every point. $1/x$ on $(0, 1]$ is continuous but not uniformly so; the closed bounded interval is what the proof used.
^uniform-why

## The mean value theorem

> [!def] Derivative
> $f'(a) = \lim_{h \to 0} \dfrac{f(a + h) - f(a)}{h}$ when the limit exists. A function differentiable at $a$ is continuous there, since $f(a+h) - f(a) = h \cdot \frac{f(a+h) - f(a)}{h} \to 0 \cdot f'(a)$. The sum, product, quotient and chain rules follow from Theorem 1 and are taken as known, as are the derivatives of $e^x$, $\ln x$, $\sin x$, $\cos x$, $\arctan x$ and $x^\alpha$.
^derivative

> [!thm] Theorem 5 (interior extremum)
> If $f$ has a local maximum or minimum at an interior point $a$ of its domain and is differentiable at $a$, then $f'(a) = 0$.
^fermat

> [!proof]- Proof
> 1. At a local maximum, $f(a + h) - f(a) \le 0$ for all small $|h|$.
> 2. So the difference quotient is $\le 0$ for small $h > 0$ and $\ge 0$ for small $h < 0$.
> 3. Both one-sided limits equal $f'(a)$, which is therefore $\le 0$ and $\ge 0$. A minimum is the maximum of $-f$.
^p-fermat

> [!thm] Theorem 6 (Rolle)
> If $f$ is continuous on $[a, b]$, differentiable on $(a, b)$, and $f(a) = f(b)$, then $f'(c) = 0$ for some $c \in (a, b)$.
^rolle

> [!proof]- Proof (d 2)
> 1. $f$ attains a maximum and a minimum on $[a, b]$ ([Theorem 3](#^extreme-value)).
> 2. If both are attained only at endpoints, they are equal, $f$ is constant, and any $c$ works.
> 3. Otherwise one is attained at an interior $c$, and [Theorem 5](#^fermat) gives $f'(c) = 0$.
^p-rolle

> [!thm] Theorem 7 (mean value)
> If $f$ is continuous on $[a, b]$ and differentiable on $(a, b)$, then $f(b) - f(a) = f'(c)(b - a)$ for some $c \in (a, b)$. Consequences, on any interval: $f' = 0$ implies $f$ constant; $f' \ge 0$ implies $f$ nondecreasing; $f' > 0$ implies $f$ strictly increasing; $|f'| \le K$ implies $|f(x) - f(y)| \le K|x - y|$.
^mvt

> [!proof]- Proof (d 2)
> 1. Let $g(x) = f(x) - f(a) - \dfrac{f(b) - f(a)}{b - a}(x - a)$, so $g(a) = g(b) = 0$.
> 2. Rolle gives $c$ with $0 = g'(c) = f'(c) - \dfrac{f(b) - f(a)}{b - a}$.
> 3. For the consequences, apply the theorem on $[x, y]$: $f(y) - f(x) = f'(c)(y - x)$, and read off the sign or the size.
^p-mvt

> [!thm] Theorem 8 (comparison of derivatives)
> If $f(a) = g(a)$ and $f'(x) \ge g'(x)$ for $a < x < b$ (both continuous on $[a, b]$), then $f \ge g$ on $[a, b]$; if $f' > g'$ there, then $f > g$ on $(a, b]$. When $f'(a) = g'(a)$ as well, compare $f'$ and $g'$ the same way, one derivative higher.
^comparison-derivatives

> [!proof]- Proof
> 1. $h = f - g$ has $h(a) = 0$ and $h' \ge 0$ (resp. $> 0$).
> 2. By the consequences of [Theorem 7](#^mvt), $h$ is nondecreasing (resp. strictly increasing), so $h(x) \ge h(a) = 0$ (resp. $>$).
^p-comparison-derivatives

> [!thm] Theorem 9 (Cauchy mean value)
> If $f, g$ are continuous on $[a, b]$ and differentiable on $(a, b)$, then $\bigl(f(b) - f(a)\bigr) g'(c) = \bigl(g(b) - g(a)\bigr) f'(c)$ for some $c \in (a, b)$.
^cauchy-mvt

> [!proof]- Proof
> 1. Let $h(x) = \bigl(f(b) - f(a)\bigr) g(x) - \bigl(g(b) - g(a)\bigr) f(x)$.
> 2. Expanding, $h(a) = f(b) g(a) - g(b) f(a) = h(b)$.
> 3. Rolle gives $h'(c) = 0$, which is the claim.
^p-cauchy-mvt

> [!thm] Theorem 10 (l'Hôpital)
> Let $f, g$ be differentiable on $(a, a + r)$ with $g' \ne 0$ there, $f(x) \to 0$ and $g(x) \to 0$ as $x \to a^+$, and $f'(x)/g'(x) \to L$. Then $f(x)/g(x) \to L$. The same holds for $x \to a^-$, for two-sided limits, for $x \to \infty$, and when $f, g \to \pm\infty$ instead of $0$; those versions are stated without proof.
^lhopital

> [!proof]- Proof (d 3)
> 1. Set $f(a) = g(a) = 0$, making both continuous on $[a, x]$ for $a < x < a + r$.
> 2. $g(x) \ne 0$: otherwise Rolle would give a zero of $g'$ in $(a, x)$.
> 3. Cauchy's mean value theorem on $[a, x]$: $\dfrac{f(x)}{g(x)} = \dfrac{f'(c_x)}{g'(c_x)}$ for some $c_x \in (a, x)$.
> 4. As $x \to a^+$, $c_x \to a^+$, so the right side tends to $L$.
^p-lhopital

## Taylor's theorem

> [!thm] Theorem 11 (Taylor, Lagrange remainder)
> If $f$ is $n + 1$ times differentiable on an open interval containing $a$ and $x$, then
> $$f(x) = \sum_{k=0}^{n} \frac{f^{(k)}(a)}{k!} (x - a)^k + \frac{f^{(n+1)}(\xi)}{(n+1)!} (x - a)^{n+1}$$
> for some $\xi$ strictly between $a$ and $x$ (when $x \ne a$). If $f^{(n+1)}$ is bounded near $a$, the remainder is $O((x - a)^{n+1})$.
^taylor

> [!proof]- Proof (d 4)
> 1. Fix $x \ne a$ and let $F(t) = \sum_{k=0}^{n} \frac{f^{(k)}(t)}{k!} (x - t)^k$, so $F(x) = f(x)$ and $F(a)$ is the Taylor polynomial $T_n(x)$.
> 2. Differentiating term by term, the sum telescopes: $F'(t) = \frac{f^{(n+1)}(t)}{n!} (x - t)^n$.
> 3. Let $G(t) = (x - t)^{n+1}$: $G(x) = 0$, $G(a) = (x - a)^{n+1}$, $G'(t) = -(n+1)(x - t)^n$.
> 4. Cauchy's mean value theorem between $a$ and $x$: $\bigl(F(x) - F(a)\bigr) G'(\xi) = \bigl(G(x) - G(a)\bigr) F'(\xi)$.
> 5. Substitute: $\bigl(f(x) - T_n(x)\bigr)(n+1)(x - \xi)^n = (x - a)^{n+1} \frac{f^{(n+1)}(\xi)}{n!} (x - \xi)^n$.
> 6. Cancel $(x - \xi)^n \ne 0$ and divide by $n + 1$.
^p-taylor

> [!thm] Theorem 12 (standard expansions)
> As $x \to 0$, for every $n$:
> $e^x = \sum_{k=0}^{n} \frac{x^k}{k!} + O(x^{n+1})$;
> $\sin x = x - \frac{x^3}{3!} + \cdots + (-1)^m \frac{x^{2m+1}}{(2m+1)!} + O(x^{2m+3})$;
> $\cos x = 1 - \frac{x^2}{2!} + \cdots + (-1)^m \frac{x^{2m}}{(2m)!} + O(x^{2m+2})$;
> $\ln(1 + x) = x - \frac{x^2}{2} + \cdots + (-1)^{n+1} \frac{x^n}{n} + O(x^{n+1})$;
> $\arctan x = x - \frac{x^3}{3} + \cdots + (-1)^m \frac{x^{2m+1}}{2m+1} + O(x^{2m+3})$;
> $(1 + x)^\alpha = \sum_{k=0}^{n} \binom{\alpha}{k} x^k + O(x^{n+1})$, with $\binom{\alpha}{k} = \frac{\alpha(\alpha - 1) \cdots (\alpha - k + 1)}{k!}$.
> For $e^x$, $\sin x$ and $\cos x$ the remainder tends to $0$ as $n \to \infty$ for every fixed $x$, so each equals its full power series on all of $\mathbb{R}$.
^expansions

> [!proof]- Proof
> 1. $e^x$, $\sin$, $\cos$, $(1+x)^\alpha$: compute $f^{(k)}(0)$ and apply [Theorem 11](#^taylor); the $(n+1)$-th derivative is bounded near $0$.
> 2. For $|x| \le R$ the derivatives of $e^x$, $\sin$, $\cos$ are bounded by $e^R$, so the remainder is at most $e^R R^{n+1}/(n+1)!$, which tends to $0$ ([ratio test](an-limits-series.md#^ratio-root) on $R^n/n!$).
> 3. $\ln(1+x)$: let $g$ be $\ln(1+x)$ minus the polynomial. The finite geometric sum gives $g'(t) = \frac{1}{1+t} - \sum_{k=0}^{n-1} (-t)^k = \frac{(-t)^n}{1+t}$, and $g(0) = 0$.
> 4. For $|t| \le \tfrac12$, $|g'(t)| \le 2|t|^n$, so the mean value theorem gives $|g(x)| \le 2|x|^{n+1}$.
> 5. $\arctan$: the same with $g'(t) = \frac{1}{1+t^2} - \sum_{k=0}^{m} (-t^2)^k = \frac{(-1)^{m+1} t^{2m+2}}{1+t^2}$, so $|g(x)| \le |x|^{2m+3}$ for all $x$.
^p-expansions

> [!thm] Theorem 13 (first surviving term)
> If $u(x) \to 0$ and $u(x) w(x) \to L$ (as $x \to a$ or $n \to \infty$), then $(1 + u)^w \to e^L$. In particular $(1 + t/n)^n \to e^t$.
^first-surviving

> [!proof]- Proof
> 1. $\ln(1 + u) = u + O(u^2)$ by Theorem 12.
> 2. So $w \ln(1 + u) = wu + O(wu \cdot u) \to L + 0$.
> 3. $\exp$ is continuous.
^p-first-surviving

The working rule for limits of the form $0/0$ or $1^\infty$: take logarithms, expand every piece one order further than seems needed, cancel, and the first term that survives decides. How many orders are needed is visible only after the cancellation.
^first-surviving-rule

## Examples

> [!example] Real roots of a quintic
> Show that $x^5 - 3x + 1 = 0$ has exactly three real roots.
^ex-quintic-roots

> [!solution]- Solution
> methods: intermediate-value, an-mvt-taylor/rolle
> 1. $f(-2) = -25$, $f(0) = 1$, $f(1) = -1$, $f(2) = 27$: three sign changes, so at least three roots, one in each of $(-2, 0)$, $(0, 1)$, $(1, 2)$.
> 2. If $f$ had four real roots, Rolle between consecutive ones would give three real zeros of $f'(x) = 5x^4 - 3$.
> 3. $f'$ has exactly two real zeros, $\pm (3/5)^{1/4}$. So there are exactly three. (Numerically: $-1.389$, $0.335$, $1.215$.)
> Answer: three.
^s-ex-quintic-roots

> [!example] Exponential against logarithm at third order
> Find $\displaystyle\lim_{x \to 0} \frac{e^x - 1 - \ln(1 + x) - x^2}{x^3}$.
^ex-exp-log-third

> [!solution]- Solution
> methods: taylor
> 1. $e^x - 1 = x + \frac{x^2}{2} + \frac{x^3}{6} + O(x^4)$ and $\ln(1+x) = x - \frac{x^2}{2} + \frac{x^3}{3} + O(x^4)$.
> 2. Their difference is $x^2 - \frac{x^3}{6} + O(x^4)$; subtracting $x^2$ leaves $-\frac{x^3}{6} + O(x^4)$.
> 3. Divide by $x^3$. (A symbolic check gives the same value.)
> Answer: $-\dfrac16$.
^s-ex-exp-log-third

> [!example] The logarithm between two polynomials
> Show that $x - \frac{x^2}{2} < \ln(1 + x) < x$ for all $x > 0$.
^ex-log-sandwich

> [!solution]- Solution
> methods: an-mvt-taylor/comparison-derivatives
> 1. All three functions vanish at $0$.
> 2. Derivatives: $1 - x$, $\frac{1}{1+x}$, $1$. For $x > 0$, $\frac{1}{1+x} < 1$, and $\frac{1}{1+x} > 1 - x$ because $(1 - x)(1 + x) = 1 - x^2 < 1$.
> 3. Comparison of derivatives gives both strict inequalities on $(0, \infty)$.
^s-ex-log-sandwich

## Derive

> [!derive] Prove that a derivative has the intermediate value property: if $f$ is differentiable on $[a, b]$ and $y$ lies strictly between $f'(a)$ and $f'(b)$, then $f'(c) = y$ for some $c \in (a, b)$, even when $f'$ is not continuous.
^d-darboux

> [!derive] Prove, without factoring, that a real polynomial of degree $n \ge 1$ has at most $n$ distinct real roots.
^d-rolle-roots

> [!derive] Prove that $e$ is irrational.
^d-e-irrational

> [!derive] Prove that a function with bounded derivative on an open interval is uniformly continuous there, and give a function uniformly continuous on $[0, 1]$ whose derivative is unbounded on $(0, 1)$.
^d-lipschitz-uniform

> [!derive] Prove that if $f$ is twice differentiable near $a$ with $f''$ continuous at $a$, then $\dfrac{f(a + h) - 2f(a) + f(a - h)}{h^2} \to f''(a)$ as $h \to 0$.
^d-second-difference

## Problems

> [!problem] An exponential and the lines through (0, 1) (d 3)
> For which real $a$ does $e^x = 1 + a x$ have exactly one real solution?
^inv-an-exp-line-count

> [!solution]- Solution
> methods: mean-value, an-mvt-taylor/extreme-value
> 1. $x = 0$ is always a solution. Let $g(x) = e^x - 1 - a x$, so $g'(x) = e^x - a$.
> 2. If $a \le 0$, $g' > 0$, $g$ is strictly increasing, and $0$ is the only root.
> 3. If $a > 0$, $g$ decreases on $(-\infty, \ln a)$ and increases after, with minimum $g(\ln a) = a - 1 - a \ln a$; it has at most two roots.
> 4. $h(a) = a - 1 - a\ln a$ has $h(1) = 0$ and $h'(a) = -\ln a$, so $h < 0$ for $a \ne 1$. Then $g$ goes from $+\infty$ down to a negative minimum and back to $+\infty$: two roots.
> 5. At $a = 1$ the minimum is $0$, attained only at $x = 0$: one root. A numerical root count over $[-30, 30]$ agrees for $a \in \{-2, -0.5, 0, 0.5, 0.99, 1, 1.01, 2, 5\}$.
> Answer: $a \le 0$ or $a = 1$.
^s-inv-an-exp-line-count

> [!problem] Two slopes of a unit rise (d 4)
> Let $f$ be continuous on $[0, 1]$, differentiable on $(0, 1)$, with $f(0) = 0$ and $f(1) = 1$. Prove that there are distinct $a, b \in (0, 1)$ with $f'(a) \ne 0$, $f'(b) \ne 0$ and $\dfrac{1}{f'(a)} + \dfrac{2}{f'(b)} = 3$.
^inv-an-two-slopes

> [!solution]- Solution
> methods: intermediate-value, mean-value
> 1. By the intermediate value theorem pick $c \in (0, 1)$ with $f(c) = \tfrac13$.
> 2. Mean value on $[0, c]$: $f'(a) = \frac{1/3}{c}$ for some $a \in (0, c)$.
> 3. Mean value on $[c, 1]$: $f'(b) = \frac{2/3}{1 - c}$ for some $b \in (c, 1)$.
> 4. Both are nonzero, $a < c < b$, and $\frac{1}{f'(a)} + \frac{2}{f'(b)} = 3c + 3(1 - c) = 3$.
^s-inv-an-two-slopes

> [!problem] Correcting the approach to e (d 4.5)
> Find the real $c$ for which $\displaystyle\lim_{x \to 0^+} \frac{(1 + x)^{1/x} - e + c x}{x^2}$ exists and is finite, and find the limit.
^inv-an-power-correction

> [!solution]- Solution
> methods: taylor, an-mvt-taylor/first-surviving
> 1. $\frac{\ln(1 + x)}{x} = 1 - \frac{x}{2} + \frac{x^2}{3} + O(x^3)$.
> 2. $(1 + x)^{1/x} = e \cdot \exp\bigl(-\frac{x}{2} + \frac{x^2}{3} + O(x^3)\bigr)$.
> 3. $\exp(u) = 1 + u + \frac{u^2}{2} + O(u^3)$ with $u = -\frac x2 + \frac{x^2}{3}$: $1 - \frac x2 + \frac{x^2}{3} + \frac{x^2}{8} + O(x^3) = 1 - \frac{x}{2} + \frac{11 x^2}{24} + O(x^3)$.
> 4. So the numerator is $\bigl(c - \frac e2\bigr) x + \frac{11e}{24} x^2 + O(x^3)$; a finite limit needs $c = e/2$. (A symbolic series check agrees.)
> Answer: $c = e/2$, limit $\dfrac{11e}{24}$.
^s-inv-an-power-correction

> [!problem] Iterated inverse tangent (d 5)
> Let $x_0 = 1$ and $x_{n+1} = \arctan x_n$. Find $\displaystyle\lim_{n \to \infty} \sqrt{n}\, x_n$.
^inv-an-arctan-iterates

> [!solution]- Solution
> methods: mean-value, an-limits-series/monotone, an-limits-series/stolz, taylor
> 1. For $t > 0$, $0 < \arctan t < t$ (mean value theorem, derivative $\frac{1}{1+s^2} < 1$), so $x_n$ decreases and stays positive.
> 2. Its limit $L$ satisfies $L = \arctan L$, so $L = 0$.
> 3. From $\arctan t = t - \frac{t^3}{3} + O(t^5)$: $\frac{1}{\arctan^2 t} = \frac{1}{t^2}\bigl(1 - \frac{t^2}{3} + O(t^4)\bigr)^{-2} = \frac{1}{t^2} + \frac23 + O(t^2)$.
> 4. So $\frac{1}{x_{n+1}^2} - \frac{1}{x_n^2} \to \frac23$, and Stolz–Cesàro with $b_n = n$ gives $\frac{1}{n x_n^2} \to \frac23$.
> 5. Hence $n x_n^2 \to \frac32$. Numerically $\sqrt{n} x_n = 1.224745$ at $n = 10^6$.
> Answer: $\sqrt{3/2} = \frac{\sqrt6}{2}$.
^s-inv-an-arctan-iterates

> [!problem] A derivative that outruns its square (d 4)
> Prove that no differentiable $f : \mathbb{R} \to \mathbb{R}$ satisfies $f'(x) \ge 1 + f(x)^2$ for all real $x$.
^inv-an-fast-derivative

> [!solution]- Solution
> methods: mean-value
> 1. Let $g = \arctan \circ f$. Then $g' = \frac{f'}{1 + f^2} \ge 1$.
> 2. Mean value on $[0, \pi]$: $g(\pi) - g(0) \ge \pi$.
> 3. But $g$ takes values in $(-\pi/2, \pi/2)$, so $g(\pi) - g(0) < \pi$. Contradiction.
^s-inv-an-fast-derivative
