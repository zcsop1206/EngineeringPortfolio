---
study: basic
id: sp-yield-spc
title: Yield and statistical process control
area: sp
needs: [pr-expectation]
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [linearity of expectation](pr-expectation.md#^lin-exp), [indicators](pr-expectation.md#^indicators) and [total expectation](pr-expectation.md#^total-exp).
^needs

## Random defects and yield

> [!def] Defect density, critical area, yield
> Particles and pattern faults land on a wafer at random. A defect kills a die only if it lands where a defect of its size causes a fault; that region is the die's **critical area** $A$. The **defect density** $D_0$ counts killing defects per unit critical area. **Yield** $Y$ is the fraction of dies that work.
^def-yield

> [!thm] Theorem 1 (Poisson yield)
> If defects land independently and uniformly with density $D_0$, the number $K$ on a die of critical area $A$ is Poisson with mean $\lambda = AD_0$, $P(K = k) = \lambda^ke^{-\lambda}/k!$, and the yield is
> $$Y = e^{-AD_0}.$$
^poisson-yield

> [!proof]- Proof (d 3)
> 1. Cut the die into $N$ cells of area $A/N$. For large $N$ each cell holds a defect with probability $p = AD_0/N$, at most one, independently of the others.
> 2. $K$ is then binomial: $P(K = k) = \binom Nk p^k(1 - p)^{N-k}$.
> 3. Let $N \to \infty$ with $Np = \lambda$: $\binom Nk p^k = \frac{N(N-1)\cdots(N-k+1)}{N^k}\frac{\lambda^k}{k!} \to \frac{\lambda^k}{k!}$, and $(1 - \lambda/N)^{N-k} \to e^{-\lambda}$.
> 4. A die works when $K = 0$: $Y = e^{-\lambda}$.
^p-poisson-yield

> [!def] Critical area for a short
> Two parallel lines of length $L$ with spacing $s$ between their edges are shorted by a round defect of diameter $x > s$ whose centre lands in a strip of width $x - s$ between them: $A_c(x) = L(x - s)$, and zero for $x \le s$. The expected number of killing defects is the defect density times $A_c$ averaged over the defect size distribution.
^critical-area

> [!thm] Theorem 2 (clustered yield)
> If the density $D$ seen by a die varies from die to die as a gamma distribution with mean $D_0$ and shape $\alpha$ (variance $D_0^2/\alpha$), the yield is
> $$Y = \Big(1 + \frac{AD_0}{\alpha}\Big)^{-\alpha}.$$
> As $\alpha \to \infty$ this tends to $e^{-AD_0}$; for finite $\alpha$ it is higher than the Poisson yield at the same mean density.
^clustered-yield

> [!proof]- Proof (d 4)
> 1. Given $D$, a die works with probability $e^{-AD}$ (Theorem 1). By [total expectation](pr-expectation.md#^total-exp), $Y = E[e^{-AD}]$.
> 2. The gamma density with shape $\alpha$ and scale $\theta = D_0/\alpha$ is $f(D) = D^{\alpha-1}e^{-D/\theta}/\Gamma(\alpha)\theta^\alpha$, with mean $\alpha\theta = D_0$.
> 3. Using $\int_0^\infty D^{\alpha-1}e^{-cD}dD = \Gamma(\alpha)/c^\alpha$ with $c = 1/\theta + A$: $E[e^{-AD}] = (1/\theta + A)^{-\alpha}/\theta^\alpha = (1 + A\theta)^{-\alpha}$.
> 4. Substitute $\theta = D_0/\alpha$.
> 5. $(1 + x/\alpha)^{-\alpha} \to e^{-x}$ as $\alpha \to \infty$.
> 6. $e^{-AD}$ is convex in $D$, so by [Jensen](ineq-convexity.md#^jensen) $E[e^{-AD}] \ge e^{-AE[D]} = e^{-AD_0}$.
^p-clustered-yield

Clustering helps because defects that crowd onto a few dies waste themselves: a die killed twice counts once. The shape $\alpha$ is fitted to data (the problem on two die sizes below); the gamma form is a modelling choice, not a law.
^clustering-note

## Control charts

> [!def] Statistical control and the Shewhart chart
> A process is **in control** when its measurements behave as independent draws from one fixed distribution, here normal with mean $\mu_0$ and standard deviation $\sigma$. $\Phi$ is the standard normal cumulative distribution. A **Shewhart $\bar x$ chart** plots the mean of each subgroup of $n$ measurements against limits $\mu_0 \pm 3\sigma/\sqrt n$ (a subgroup mean has standard deviation $\sigma/\sqrt n$); a point outside them is a signal. $\sigma$ is estimated from the spread *within* subgroups, so that drift between subgroups shows up as signals instead of inflating the limits. Extra run rules (several points in a row on one side of the centre, for instance) catch small shifts sooner at the price of more false alarms; they are conventions.
^control-charts

> [!thm] Theorem 3 (average run length)
> If each subgroup signals independently with probability $q$, the expected number of subgroups up to and including the first signal is $1/q$. In control, $q = 2\Phi(-3) = 0.0027$, a false alarm every 370 subgroups on average. After the mean shifts by $\delta\sigma$, $q = \Phi(-3 - \delta\sqrt n) + 1 - \Phi(3 - \delta\sqrt n)$.
^arl

> [!proof]- Proof (d 2.5)
> 1. Let $L$ be the run length. The first subgroup signals with probability $q$; otherwise the process starts afresh one subgroup later. By total expectation, $E[L] = q \cdot 1 + (1 - q)(1 + E[L])$.
> 2. Solve: $E[L] = 1/q$.
> 3. After the shift a subgroup mean is normal with mean $\mu_0 + \delta\sigma$ and standard deviation $\sigma/\sqrt n$; in its standard units the limits sit at $\pm3 - \delta\sqrt n$.
^p-arl

## Capability

> [!def] Capability indices
> For specification limits LSL and USL, a process in control with mean $\mu$ and standard deviation $\sigma$ has
> $$C_p = \frac{\mathrm{USL} - \mathrm{LSL}}{6\sigma}, \qquad C_{pk} = \frac{\min(\mathrm{USL} - \mu,\ \mu - \mathrm{LSL})}{3\sigma}.$$
> $C_p$ compares the spread with the window; $C_{pk}$ also charges for being off centre. They mean nothing for a process out of control, whose $\sigma$ is not a fixed number.
^capability

> [!thm] Theorem 4 (out-of-spec fraction from $C_{pk}$)
> For a normal process the fraction outside the limits $p$ satisfies $\Phi(-3C_{pk}) \le p \le 2\Phi(-3C_{pk})$.
^capability-bound

> [!proof]- Proof
> 1. The nearer limit is $3C_{pk}\sigma$ from the mean, so the tail beyond it alone is $\Phi(-3C_{pk})$.
> 2. The farther limit is at least as far, so its tail is no larger; the two tails add.
^p-capability-bound

$C_{pk} = 1.33$ puts the nearer limit $4\sigma$ away: 32 ppm on that side.
^cpk-133

## Designed experiments

> [!def] Two-level factorial design
> $k$ factors, each run at a low and a high level coded $-1$ and $+1$; a **full factorial** runs all $2^k$ combinations. The **main effect** of factor A is the mean response at A $= +1$ minus the mean at A $= -1$. The **interaction** AB is the same computed with the product column $x_Ax_B$. Run order is randomised, so slow drifts do not line up with any factor.
^doe

> [!thm] Theorem 5 (precision and aliasing)
> (a) With $N$ runs and independent errors of standard deviation $\sigma$, every effect estimate has variance $4\sigma^2/N$.
> (b) In the half fraction with **defining relation** I = ABC (the runs with $x_Ax_Bx_C = +1$), the column of A equals the column of BC, so the A contrast estimates A + BC; likewise B + AC and C + AB.
^doe-aliasing

> [!proof]- Proof (d 3)
> 1. An effect is $\frac{2}{N}\sum_i c_iy_i$ with $c_i = \pm1$, half of each sign: the mean of $N/2$ responses minus the mean of the other $N/2$.
> 2. With independent errors, $\operatorname{Var} = \frac{4}{N^2}\sum_i c_i^2\sigma^2 = 4\sigma^2/N$.
> 3. In the half fraction $x_Ax_Bx_C = 1$ on every run. Multiply by $x_A$ and use $x_A^2 = 1$: $x_Bx_C = x_A$.
> 4. So the A contrast and the BC contrast are the same numbers, and no analysis of these runs can separate them.
^p-doe-aliasing

## Examples

> [!example] Die size against yield
> With $D_0 = 0.1$ cm⁻², compare the Poisson yield and the clustered yield with $\alpha = 2$ for a 1 cm² die and a 6 cm² die.
^ex-die-size

> [!solution]- Solution
> methods: sp-yield-spc/poisson-yield, sp-yield-spc/clustered-yield
> 1. 1 cm²: $e^{-0.1} = 90.5$ %; $(1 + 0.05)^{-2} = 90.7$ %.
> 2. 6 cm²: $e^{-0.6} = 54.9$ %; $(1 + 0.3)^{-2} = 59.2$ %.
> Large dies lose most of their yield, and the model choice matters most for them.

> [!example] An oxide's capability
> An oxide is specified at 100 ± 5 nm. The process runs in control at $\mu = 101$ nm, $\sigma = 1.2$ nm. Find $C_p$, $C_{pk}$ and the fraction out of specification.
^ex-oxide-cpk

> [!solution]- Solution
> methods: sp-yield-spc/capability
> 1. $C_p = 10/7.2 = 1.39$; $C_{pk} = \min(4, 6)/3.6 = 1.11$.
> 2. Upper tail $\Phi(-4/1.2) = \Phi(-3.33) = 4.29\times10^{-4}$; lower tail $\Phi(-5) = 2.9\times10^{-7}$.
> 3. Total 429 ppm, all of it from being 1 nm off centre: centring alone would give $2\Phi(-4.17) = 31$ ppm.

> [!example] Three furnace factors
> Oxide thickness (nm) in a $2^3$ design over temperature A, time B and humidity C, in the order (A, B, C) = $(-,-,-), (-,-,+), (-,+,-), (-,+,+), (+,-,-), (+,-,+), (+,+,-), (+,+,+)$: 30, 34, 38, 43, 36, 41, 46, 52. Estimate all seven effects.
^ex-furnace-factorial

> [!solution]- Solution
> methods: sp-yield-spc/doe
> 1. A: $(36 + 41 + 46 + 52)/4 - (30 + 34 + 38 + 43)/4 = 43.75 - 36.25 = 7.5$.
> 2. B $= 9.5$, C $= 5.0$ in the same way.
> 3. AB $= 1.0$, AC $= 0.5$, BC $= 0.5$, ABC $= 0$, each from its product column.
> The main effects dominate; with no replicates there is no estimate of $\sigma$ to say whether the small interactions are real.

## Derive

> [!derive] Show that a Poisson count with mean $\lambda$ has variance $\lambda$, using the cell construction of Theorem 1 and indicators.
^d-poisson-variance

> [!solution]- Solution
> methods: indicators, sp-yield-spc/poisson-yield
> 1. $K = \sum_j I_j$ over the $N$ cells, with $I_j$ independent indicators of probability $p = \lambda/N$.
> 2. $\operatorname{Var}I_j = p(1 - p)$; independent variances add: $\operatorname{Var}K = Np(1 - p) = \lambda(1 - \lambda/N) \to \lambda$.

> [!derive] A system needs a fixed total of useful area, split into dies of useful area $A$, each carrying an extra area $a_0$ (scribe lanes, pads) where defects do no harm. With Poisson yield and known-good dies, show that the silicon used per working system is least when $A^2 + a_0A - a_0/D_0 = 0$, and evaluate $A$ for $a_0 = 0.2$ cm², $D_0 = 0.1$ cm⁻².
^d-die-size-optimum

> [!solution]- Solution
> methods: sp-yield-spc/poisson-yield
> 1. Per unit of useful area the silicon is $(A + a_0)/A$, and each die works with probability $e^{-AD_0}$: minimise $g(A) = \ln(A + a_0) - \ln A + AD_0$.
> 2. $g'(A) = 1/(A + a_0) - 1/A + D_0 = 0$ gives $D_0 = a_0/A(A + a_0)$, i.e. $A^2 + a_0A - a_0/D_0 = 0$.
> 3. $A^2 + 0.2A - 2 = 0$: $A = 1.32$ cm².

> [!derive] Show that a chart run in control for 100 subgroups gives at least one false alarm with probability about 24 %.
^d-false-alarms

> [!solution]- Solution
> methods: sp-yield-spc/arl
> 1. Each subgroup is clear with probability $1 - 0.0027$, independently.
> 2. $1 - 0.9973^{100} = 0.237$.

> [!derive] Prove that in a $2^3$ full factorial the eight-entry columns of A, B, C, AB, AC, BC and ABC are mutually orthogonal and each sums to zero.
^d-orthogonal-columns

> [!solution]- Solution
> methods: sp-yield-spc/doe
> 1. Each column is a product of distinct factor columns; the elementwise product of two different columns is again a product of a nonempty set of factors (squares cancel to 1).
> 2. Any product of a nonempty set of factors has four $+1$ and four $-1$ entries over the full design (fix the other factors; the last one in the set flips the sign), so it sums to zero.
> 3. The dot product of two columns is the sum of their product column: zero.

## Problems

> [!problem] Splitting a large die (d 2.5)
> A design needs 8 cm² of silicon. As one die, or as four dies of 2 cm² each with 10 % extra area for their links (2.2 cm² each), tested before assembly so only working dies are used. With Poisson yield and $D_0 = 0.1$ cm⁻², compare the silicon used per working system. Ignore assembly losses.
^inv-sp-split-die

> [!solution]- Solution
> methods: sp-yield-spc/poisson-yield
> 1. One die: $Y = e^{-0.8} = 44.9$ %, so $8/0.449 = 17.8$ cm² per working system.
> 2. Four dies: $Y = e^{-0.22} = 80.3$ % each; $4 \times 2.2/0.803 = 11.0$ cm².
> Answer: 17.8 against 11.0 cm²; the split uses 38 % less silicon despite the 10 % overhead.

> [!problem] Detecting a shift (d 3)
> A Shewhart $\bar x$ chart with 3σ limits watches a process whose mean shifts by $1\sigma$. What is the average number of subgroups until a signal with subgroups of $n = 4$, and with single measurements ($n = 1$)?
^inv-sp-detect-shift

> [!solution]- Solution
> methods: sp-yield-spc/arl
> 1. $n = 4$: $\delta\sqrt n = 2$; $q = \Phi(-5) + 1 - \Phi(1) = 0.159$, so 6.3 subgroups.
> 2. $n = 1$: $q = \Phi(-4) + 1 - \Phi(2) = 0.0228$, so 44 subgroups.
> Answer: 6.3 and 44. Averaging four measurements finds a $1\sigma$ shift seven times sooner in subgroups (and in measurements, 25 against 44).

> [!problem] Two die sizes on one process (d 4.5)
> On one process, 1 cm² dies yield 80 % and 4 cm² dies yield 50 %. Can a Poisson model fit both? Fit the clustered model's $D_0$ and $\alpha$, and predict the yield of a 2 cm² die.
^inv-sp-two-die-sizes

> [!solution]- Solution
> methods: sp-yield-spc/clustered-yield, sp-yield-spc/poisson-yield
> 1. Poisson: $e^{-D_0} = 0.8$ gives $D_0 = 0.223$, which predicts $0.8^4 = 41$ % at 4 cm², not 50 %. It does not fit.
> 2. Clustered: $(1 + D_0/\alpha)^{-\alpha} = 0.8$ and $(1 + 4D_0/\alpha)^{-\alpha} = 0.5$. Try $\alpha = 1$: $1/(1 + D_0) = 0.8$ gives $D_0 = 0.25$, and then $1/(1 + 1) = 0.5$. Both hold.
> 3. 2 cm²: $1/(1 + 0.5) = 66.7$ % (Poisson would say 64 %).
> Answer: $D_0 = 0.25$ cm⁻², $\alpha = 1$; about 67 %.

> [!problem] Spacing and shorts (d 5)
> Killing defects of diameter at least $x_0$ arrive with density $D_0$ per unit area, with diameters distributed as $f(x) = 2x_0^2/x^3$ for $x \ge x_0$. A die has a total length $L$ of neighbouring line pairs at edge spacing $s \ge x_0$. Find the expected number of shorts and the yield. Evaluate for $L = 100$ m, $x_0 = s = 0.1$ µm, $D_0 = 0.5$ cm⁻², and again with the spacing doubled.
^inv-sp-spacing-shorts

> [!solution]- Solution
> methods: sp-yield-spc/critical-area, sp-yield-spc/poisson-yield
> 1. Expected shorts $= D_0\int_s^\infty L(x - s)\frac{2x_0^2}{x^3}dx$.
> 2. $\int_s^\infty (x^{-2} - sx^{-3})\,dx = 1/s - 1/2s = 1/2s$, so the mean is $D_0Lx_0^2/s$.
> 3. Poisson: $Y = \exp(-D_0Lx_0^2/s)$.
> 4. $L = 10^4$ cm, $x_0 = s = 10^{-5}$ cm: average critical area $0.1$ cm², $Y = e^{-0.05} = 95.1$ %. Doubled spacing: 0.05 cm², 97.5 %.
> Answer: $Y = \exp(-D_0Lx_0^2/s)$; 95.1 % and 97.5 %. Critical area falls as $1/s$ under this size distribution.

> [!problem] Half the runs (d 4)
> Use only the four runs of the furnace example with $x_Ax_Bx_C = +1$. Compute the three main-effect contrasts and explain each one's difference from the full-design estimate.
^inv-sp-half-runs

> [!solution]- Solution
> methods: sp-yield-spc/doe-aliasing
> 1. The runs are $(-,-,+) = 34$, $(-,+,-) = 38$, $(+,-,-) = 36$, $(+,+,+) = 52$.
> 2. A: $(36 + 52)/2 - (34 + 38)/2 = 8.0$; B: $(38 + 52)/2 - (34 + 36)/2 = 10.0$; C: $(34 + 52)/2 - (38 + 36)/2 = 6.0$.
> 3. These are A + BC $= 7.5 + 0.5$, B + AC $= 9.5 + 0.5$, C + AB $= 5.0 + 1.0$.
> Answer: 8, 10, 6; each main effect is read together with the two-factor interaction it is aliased with.

> [!problem] Runs for a precise effect (d 3)
> One oxide measurement has a standard deviation of 1.5 nm. How many runs of a two-level factorial make the standard error of each main effect at most 0.5 nm, and how would you lay them out for three factors?
^inv-sp-runs-needed

> [!solution]- Solution
> methods: sp-yield-spc/doe-aliasing
> 1. $\sqrt{4\sigma^2/N} \le 0.5$ gives $N \ge 4 \times 2.25/0.25 = 36$.
> 2. A $2^3$ design has 8 runs; five replicates give 40, in random order.
> Answer: at least 36 runs; 40 as five replicates of the $2^3$.
