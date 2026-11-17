---
study: basic
id: gen-dimensions
title: Dimensions, scaling and limiting cases
area: gen
needs: [la-core]
build: 1
tracks: [putnam, interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [rank-nullity](la-core.md#^rank-nullity) for the pi theorem. Everything else is arithmetic with exponents.
^needs

A physical law cannot depend on the units it is written in. That one requirement forces the form of an answer before any physics is done: it fixes exponents, counts how many independent numbers a problem really has, and says how a result scales. This basic proves the requirement's two consequences (homogeneity and the pi theorem) and then gives the three checks that use them.

## Dimensions and units

> [!def] Dimension, dimension vector, change of units
> Fix **base dimensions**: mass M, length L, time T, temperature Θ (add electric current or amount of substance when a problem needs them; call the number of base dimensions $k$). Every quantity $q$ has a **dimension** $[q] = \mathrm{M}^{a_1}\mathrm{L}^{a_2}\mathrm{T}^{a_3}\Theta^{a_4}$ with rational exponents; $(a_1, \dots, a_k)$ is its **dimension vector**. $q$ is **dimensionless** when the vector is zero. Replacing the unit of base dimension $i$ by one $\mu_i > 0$ times as large multiplies the numerical value of $q$ by $\prod_i \mu_i^{-a_i}$; the value of a dimensionless quantity never changes.
^def-dimension

For example, force has $[F] = \mathrm{M}\,\mathrm{L}\,\mathrm{T}^{-2}$, vector $(1, 1, -2, 0)$; dynamic viscosity has $\mathrm{M}\,\mathrm{L}^{-1}\mathrm{T}^{-1}$; thermal conductivity has $\mathrm{M}\,\mathrm{L}\,\mathrm{T}^{-3}\Theta^{-1}$. The dimension of a product of powers is the same combination of vectors: $[q_1^{x_1} q_2^{x_2}]$ has vector $x_1 a^{(1)} + x_2 a^{(2)}$.
^dim-examples

> [!thm] Lemma 1 (distinct powers)
> Let $p_1 > p_2 > \dots > p_m$ be real numbers and $S_1, \dots, S_m$ real. If $\sum_i S_i \lambda^{p_i} = 0$ for every $\lambda > 0$, then every $S_i = 0$.
^distinct-powers

> [!proof]- Proof
> 1. Divide by $\lambda^{p_1}$: $S_1 + \sum_{i \ge 2} S_i \lambda^{p_i - p_1} = 0$ for every $\lambda > 0$.
> 2. Each $p_i - p_1 < 0$, so every later term tends to $0$ as $\lambda \to \infty$; hence $S_1 = 0$.
> 3. The remaining $m - 1$ terms satisfy the same hypothesis; repeat (induction on $m$).
^p-distinct-powers

> [!thm] Theorem 2 (dimensional homogeneity)
> Let $\sum_j c_j t_j = 0$, where the $c_j$ are pure numbers and each $t_j$ is a product of powers of quantities, hold between numerical values in every system of units. Then for each dimension vector $a$, the terms with $[t_j]$ of vector $a$ sum to zero by themselves. In particular, two nonzero quantities that are equal in every system of units have the same dimension.
^homogeneity

> [!proof]- Proof (d 3)
> 1. Change only the unit of base dimension 1, by a factor $\mu > 0$: term $t_j$ is multiplied by $\mu^{-e_j}$, where $e_j$ is the first entry of its dimension vector.
> 2. Group the terms by $e_j$ and let $S_e$ be the sum of $c_j t_j$ over the group with $e_j = e$, in the original units; the equation becomes $\sum_e S_e \mu^{-e} = 0$ for every $\mu > 0$.
> 3. By [Lemma 1](#^distinct-powers), every $S_e = 0$.
> 4. Each group's equation $S_e = 0$ again holds in every system of units, because steps 1 to 3 apply starting from any system; so repeat with base dimension 2 inside each group, then 3, up to $k$.
> 5. After $k$ rounds each group holds only terms with one common dimension vector, and each group sums to zero.
^p-homogeneity

## The pi theorem

> [!def] Dimension matrix
> For quantities $q_1, \dots, q_n$, the **dimension matrix** $D$ is the $k \times n$ matrix whose column $j$ is the dimension vector of $q_j$.
^def-matrix

> [!thm] Lemma 3 (dimensionless products)
> The product $q_1^{x_1} \cdots q_n^{x_n}$ is dimensionless exactly when $Dx = 0$. The exponent vectors of dimensionless products therefore form the null space of $D$, of dimension $n - r$ where $r = \operatorname{rank} D$.
^pi-lemma

> [!proof]- Proof
> 1. The dimension vector of the product is $\sum_j x_j \cdot (\text{column } j) = Dx$.
> 2. So the product is dimensionless exactly when $x$ is in the null space of $D$.
> 3. By [rank-nullity](la-core.md#^rank-nullity) that null space has dimension $n - \operatorname{rank} D$. Since $D$ has rational entries, the null space has a basis of rational vectors, and clearing denominators gives integer exponents.
^p-pi-lemma

> [!thm] Theorem 4 (Buckingham pi)
> Let a law relate positive quantities $q_1, \dots, q_n$ by $f(q_1, \dots, q_n) = 0$, and suppose it is unit-free: for any values and any change of units, $f = 0$ holds before the change exactly when it holds after. Let $r = \operatorname{rank} D$, and let $\pi_1, \dots, \pi_{n-r}$ be products of powers of the $q_j$ whose exponent vectors are a basis of the null space of $D$. Then there is a function $F$ such that, for all positive values, $f(q_1, \dots, q_n) = 0$ exactly when $F(\pi_1, \dots, \pi_{n-r}) = 0$.
^pi-theorem

> [!proof]- Proof (d 5)
> 1. Reorder so that columns $d_1, \dots, d_r$ of $D$ are linearly independent; $q_1, \dots, q_r$ are the **repeating** quantities.
> 2. For $j > r$, $d_j$ lies in the column space, which $d_1, \dots, d_r$ span, so $d_j = \sum_{i \le r} b_{ji} d_i$; then $\pi'_j = q_j \prod_{i \le r} q_i^{-b_{ji}}$ is dimensionless by [Lemma 3](#^pi-lemma).
> 3. The $n - r$ exponent vectors of the $\pi'_j$ are independent (vector $j$ has a $1$ in coordinate $j$ and $0$ in every other coordinate beyond $r$), so they are a basis of the null space.
> 4. A change of units with $\lambda_i = \ln \mu_i$ multiplies the value of $q_j$ by $e^{-\lambda \cdot d_j}$ and leaves every $\pi'_j$ unchanged.
> 5. The map $\lambda \mapsto (\lambda \cdot d_1, \dots, \lambda \cdot d_r)$ from $\mathbb{R}^k$ to $\mathbb{R}^r$ has a matrix of rank $r$ (its rows are $d_1, \dots, d_r$), so its image is all of $\mathbb{R}^r$.
> 6. Choose $\lambda$ with $\lambda \cdot d_i = \ln q_i$ for $i \le r$; in those units $q_1 = \dots = q_r = 1$ and, for $j > r$, $q_j = \pi'_j$.
> 7. By unit-freeness, $f(q) = 0$ exactly when $f(1, \dots, 1, \pi'_{r+1}, \dots, \pi'_n) = 0$; call the right side $F'(\pi') = 0$.
> 8. The $\pi_i$ and the $\pi'_j$ are two bases of the same null space, so each $\pi'_j$ is a product of powers of the $\pi_i$; substituting turns $F'$ into a function $F$ of the $\pi_i$.
^p-pi-theorem

> [!thm] Corollary 5 (one group)
> If $n - r = 1$ and the law determines $q_n$ uniquely from $q_1, \dots, q_{n-1}$, and the single group $\pi$ contains $q_n$ to a nonzero power, then $\pi$ is a constant: $q_n = C \prod_{j < n} q_j^{y_j}$ for a pure number $C$ and exponents fixed by $D$.
^one-group

> [!proof]- Proof
> 1. By Theorem 4 the law is $F(\pi) = 0$, so $\pi$ takes values in the fixed set $Z = \{z : F(z) = 0\}$.
> 2. With $q_1, \dots, q_{n-1}$ fixed, $\pi$ is a nonzero power of $q_n$ times a constant, a bijection of $(0, \infty)$; a unique $q_n$ means $Z$ has exactly one point $C$.
^p-one-group

The theorem cannot find $F$ or $C$. It reduces a function of $n$ variables to one of $n - r$, which turns a grid of experiments into a curve, and when $n - r = 1$ it gives the whole answer up to a number.
^pi-use

## Scaling

> [!def] Power law, similarity
> A **power law** is $y = C x^{a}$; then $y_2 / y_1 = (x_2 / x_1)^{a}$ whatever $C$ is, and on log-log axes the graph is a line of slope $a$. Two systems are **similar** when they share the values of all but one of the groups in a law $\pi_1 = \Phi(\pi_2, \dots, \pi_m)$; then they share $\pi_1$ too, because $\Phi$ is one function.
^scaling

Scaling is how a measurement on one object answers a question about another: a small model, a thicker plate, a shorter blade. The ratio rule needs only the exponent, which [Corollary 5](#^one-group) often supplies, and never the constant.

## Limiting cases and symmetry

> [!def] Limiting-case check
> A **limiting-case check** sends a parameter to $0$, to $\infty$, or to equality with another, where the answer is known by a simpler argument, and requires the candidate formula to agree. One failed limit rejects a formula. Passing every limit tried does not confirm it.
^limiting-cases

> [!def] Symmetry check
> A **symmetry check** asks which exchanges of inputs leave the physical situation unchanged (two identical springs in series swapped, two masses in mutual attraction exchanged, a direction reversed) and requires the formula to be unchanged, or to change sign as the situation does.
^symmetry-check

## Examples

> [!example] Drag on a sphere
> The drag force $F$ on a smooth sphere depends on fluid density $\rho$, speed $V$, diameter $D$ and dynamic viscosity $\mu$. Reduce the law to as few variables as possible.
^ex-drag

> [!solution]- Solution
> methods: dimensional-analysis
> 1. Columns for $(F, \rho, V, D, \mu)$ over (M, L, T): $(1,1,-2)$, $(1,-3,0)$, $(0,1,-1)$, $(0,1,0)$, $(1,-1,-1)$. The rank is 3, so there are $5 - 3 = 2$ groups.
> 2. A basis: $\pi_1 = F/(\rho V^2 D^2)$ and $\pi_2 = \rho V D / \mu$, each checked dimensionless by summing columns.
> 3. So $F / (\rho V^2 D^2) = \Phi(\rho V D/\mu)$: one curve, measured once, covers every sphere in every fluid.

> [!example] How long heat takes to soak in
> The time $t$ for a temperature change at one face of a slab to be felt at depth $L$ depends on $L$, the conductivity $k$, the density $\rho$ and the specific heat $c$. Find the form of $t$ and the effect of tripling $L$.
^ex-diffusion

> [!solution]- Solution
> methods: dimensional-analysis, scaling
> 1. Over (M, L, T, Θ): $[k] = (1,1,-3,-1)$, $[\rho] = (1,-3,0,0)$, $[c] = (0,2,-2,-1)$, $[L] = (0,1,0,0)$, $[t] = (0,0,1,0)$. The rank is 4: one group.
> 2. The group is $k t / (\rho c L^2)$; by [Corollary 5](#^one-group), $t = C L^2 \rho c / k = C L^2/\alpha$ with $\alpha = k/(\rho c)$, the thermal diffusivity.
> 3. $k$, $\rho$ and $c$ enter only through $\alpha$, which the analysis found without being told. Tripling $L$ multiplies $t$ by 9.

> [!example] Two springs end to end
> Four formulas are proposed for the stiffness of springs $k_1$ and $k_2$ joined in series: $\tfrac12(k_1 + k_2)$, $\sqrt{k_1 k_2}$, $k_1^2/(k_1 + k_2)$, $k_1 k_2/(k_1 + k_2)$. Which survive the checks?
^ex-springs

> [!solution]- Solution
> methods: limiting-case, gen-dimensions/symmetry-check
> 1. All four have the dimension of a stiffness, so homogeneity rejects none.
> 2. Swapping the springs changes nothing physical, so the formula must be symmetric: $k_1^2/(k_1 + k_2)$ fails.
> 3. As $k_2 \to \infty$ the second spring is rigid and the answer must tend to $k_1$: $\tfrac12(k_1 + k_2)$ and $\sqrt{k_1 k_2}$ grow without bound and fail.
> 4. $k_1 k_2/(k_1 + k_2) \to k_1$ and is symmetric; it survives (and is correct, though the checks alone do not prove that).

## Derive

> [!derive] Let $a$, $b$, $c$ be quantities whose dimension vectors are linearly independent. Prove that for any quantity $q$ there is at most one triple $(\alpha, \beta, \gamma)$ with $[a^\alpha b^\beta c^\gamma] = [q]$.
^d-exponents-unique

> [!derive] Suppose $y = e^x$ holds between the numerical values of two quantities $x$ and $y$ in every system of units. Prove that $x$ and $y$ are both dimensionless.
^d-exp-argument

> [!derive] A body orbits a much larger mass on a circle of radius $a$, and the period $T$ depends only on $a$ and on the product $GM$ (of dimension $\mathrm{L}^3\mathrm{T}^{-2}$). Prove that $T$ is proportional to $a^{3/2}$.
^d-orbit-period

> [!derive] The load $P$ at which a slender column buckles depends only on its bending stiffness $EI$ (of dimension $\mathrm{M}\,\mathrm{L}^3\mathrm{T}^{-2}$) and its length $L$. Prove that $P$ is proportional to $EI/L^2$.
^d-buckling-load

> [!derive] Let $D'$ be obtained from a dimension matrix $D$ by adding one new base dimension (a row) and one new quantity (a column), where the new column has a nonzero entry in the new row and every old column has a zero there. Prove that $\operatorname{rank} D' = \operatorname{rank} D + 1$, so the number of groups is unchanged.
^d-new-dimension

## Problems

> [!problem] Quenching a thicker plate (d 2)
> A steel plate 3 mm thick, plunged into a quench bath, cools at its midplane to a set temperature in 20 s. Assume this time depends only on the thickness and the thermal diffusivity, and the bath keeps the faces at bath temperature. Find the time for a 12 mm plate of the same steel.
^inv-gen-quench-plate

> [!solution]- Solution
> methods: dimensional-analysis, scaling
> 1. Quantities $t$, $L$, $\alpha$ with $[\alpha] = \mathrm{L}^2\mathrm{T}^{-1}$: rank 2, one group $t\alpha/L^2$, so $t \propto L^2$.
> 2. $20\ \mathrm{s} \times (12/3)^2 = 320$ s.
> Answer: 320 s.

> [!problem] Heat carried off by a moving fluid (d 3)
> The convection coefficient $h$ on a heated surface of length $L$ in a stream depends on $L$, the stream speed $V$, and the fluid's density $\rho$, viscosity $\mu$, specific heat $c_p$ and conductivity $k$. Find the number of independent dimensionless groups and give one valid set.
^inv-gen-convection-groups

> [!solution]- Solution
> methods: dimensional-analysis
> 1. Seven quantities over (M, L, T, Θ): $[h] = (1,0,-3,-1)$, $[k] = (1,1,-3,-1)$, $[L] = (0,1,0,0)$, $[V] = (0,1,-1,0)$, $[\rho] = (1,-3,0,0)$, $[\mu] = (1,-1,-1,0)$, $[c_p] = (0,2,-2,-1)$.
> 2. The rank of the $4 \times 7$ matrix is 4, so there are $7 - 4 = 3$ groups.
> 3. One set: $hL/k$, $\rho V L/\mu$, $\mu c_p / k$; each sums to the zero vector, and they are independent because each contains a quantity the others do not ($h$, $V$, $c_p$).
> Answer: three groups, for example $hL/k$, $\rho VL/\mu$ and $\mu c_p/k$.

> [!problem] Testing a model in water (d 3.5)
> A part meets air at 10 m/s. A model at one fifth of the size is to be tested in water so that the flow is similar. Using kinematic viscosities $1.5 \times 10^{-5}$ m$^2$/s for air and $1.0 \times 10^{-6}$ m$^2$/s for water, and densities 1.2 and 1000 kg/m$^3$: (a) find the water speed; (b) find the ratio of the model's drag force to the full-size part's.
^inv-gen-water-model

> [!solution]- Solution
> methods: dimensional-analysis, scaling
> 1. Similarity needs equal $VL/\nu$: $V_m = 10 \times (1.0 \times 10^{-6}/1.5 \times 10^{-5}) \times 5 \approx 3.33$ m/s.
> 2. With that group equal, $F/(\rho V^2 L^2)$ is equal too ([drag example](#^ex-drag)), so $F_m/F_p = (\rho_m/\rho_p)(V_m/V_p)^2(L_m/L_p)^2$.
> 3. $= (1000/1.2)(1/3)^2(1/5)^2 \approx 3.7$.
> Answer: about 3.3 m/s; the model's force is about 3.7 times the part's.

> [!problem] A shorter flexure blade (d 4)
> Assume the first natural frequency $f$ of a cantilevered blade depends only on its bending stiffness $EI$, its mass per unit length $\mu$ and its length $L$. (a) Find how $f$ depends on them. (b) Find the frequency ratio when only $L$ is halved. (c) Find it when the whole blade (length, width and thickness) is made ten times smaller in the same material, using $I \propto w t^3$ and $\mu \propto w t$.
^inv-gen-flexure-frequency

> [!solution]- Solution
> methods: dimensional-analysis, scaling
> 1. Over (M, L, T): $[f] = (0,0,-1)$, $[EI] = (1,3,-2)$, $[\mu] = (1,-1,0)$, $[L] = (0,1,0)$. Rank 3, one group: $f^2 \mu L^4/(EI)$.
> 2. So $f = C \sqrt{EI/\mu}\,/L^2$.
> 3. Halving $L$: factor $2^2 = 4$.
> 4. Scaling by $1/10$: $EI$ by $10^{-4}$, $\mu$ by $10^{-2}$, $L^2$ by $10^{-2}$; $f$ by $\sqrt{10^{-2}}/10^{-2} = 10$.
> Answer: $f \propto \sqrt{EI/\mu}/L^2$; 4 times higher; 10 times higher.

> [!problem] Depth of a laser melt track (d 4)
> The depth $d$ of a melt track depends on absorbed power $P$, scan speed $v$, thermal diffusivity $\alpha$, and the volumetric enthalpy $H$ needed to melt the material (J/m$^3$). (a) Find the number of groups and give a set. (b) In a regime where $d$ does not depend on $\alpha$, find how $d$ depends on $P$, $v$ and $H$. (c) In that regime, power is doubled and speed halved: find the depth ratio.
^inv-gen-melt-depth

> [!solution]- Solution
> methods: dimensional-analysis, scaling
> 1. Over (M, L, T): $[d] = (0,1,0)$, $[P] = (1,2,-3)$, $[v] = (0,1,-1)$, $[\alpha] = (0,2,-1)$, $[H] = (1,-1,-2)$. Rank 3: two groups, for example $vd/\alpha$ and $Pv/(H\alpha^2)$.
> 2. Without $\alpha$: four quantities, rank 3, one group $d^2 H v / P$, so $d = C\sqrt{P/(Hv)}$.
> 3. $P/v$ grows by 4, so $d$ grows by 2.
> Answer: two groups; $d \propto \sqrt{P/(Hv)}$; twice as deep.

> [!problem] Thermal resistance of a tube wall (d 4.5)
> Three formulas are proposed for the conduction resistance of a tube wall of inner radius $r_1$, outer radius $r_2$, length $L$ and conductivity $k$: (a) $\ln(r_2/r_1)/(2\pi k L)$; (b) $(r_2 - r_1)/(2\pi k L r_1)$; (c) $(r_2 - r_1)/(2\pi k L \sqrt{r_1 r_2})$. Test each against: (i) a thin wall, $r_2 - r_1 = t \ll r_1$, which must behave as a flat wall of area $2\pi r_1 L$; (ii) two concentric tubes in perfect contact, whose resistances must add to that of the combined wall for every $r_1 < r_2 < r_3$. Which formulas survive both?
^inv-gen-tube-wall

> [!solution]- Solution
> methods: limiting-case
> 1. Flat wall: $t/(k \cdot 2\pi r_1 L)$. For (a), $\ln(1 + t/r_1) = t/r_1 + O(t^2)$; for (b) it is exact; for (c), $\sqrt{r_1 r_2} = r_1 + O(t)$. All three pass (i).
> 2. For (ii), (a) passes: $\ln(r_2/r_1) + \ln(r_3/r_2) = \ln(r_3/r_1)$.
> 3. (b) fails: with $r = 1, 2, 5$, $\tfrac{1}{1} + \tfrac{3}{2} = 2.5 \ne \tfrac{4}{1}$.
> 4. (c) fails: $\tfrac{1}{\sqrt2} + \tfrac{3}{\sqrt{10}} \approx 1.656 \ne \tfrac{4}{\sqrt5} \approx 1.789$.
> Answer: only (a) survives both; the thin-wall limit alone could not tell them apart.
