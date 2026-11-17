---
study: basic
id: th-transient
title: Transient conduction and thermal time constants
area: th
needs: [th-conduction]
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: the [heat equation](th-conduction.md#^heat-eq), [thermal resistance](th-conduction.md#^resistance) and the [Biot number](th-conduction.md#^biot). The [error function](#^erf) is defined below.
^needs

## One temperature: the lumped body

> [!thm] Theorem 1 (lumped capacitance)
> A body of volume $V$, surface area $A_s$, density $\rho$ and specific heat $c$, at one uniform temperature $T(t)$, exchanging heat with fluid at constant $T_\infty$ through a coefficient $h$, and starting at $T_i$, follows
> $$\frac{T - T_\infty}{T_i - T_\infty} = e^{-t/\tau}, \qquad \tau = \frac{\rho c V}{h A_s} = R\,C,$$
> with $R = 1/(hA_s)$ and **heat capacity** $C = \rho c V$ (J/K). With internal power $P$ as well, $C\,dT/dt = P - (T - T_\infty)/R$.
^lumped

> [!proof]- Proof (d 1.5)
> 1. Control volume: the body. Law 1 with no work: $C\,dT/dt = P - hA_s(T - T_\infty)$.
> 2. With $P = 0$ and $\theta = T - T_\infty$: $d\theta/dt = -\theta/\tau$.
> 3. Separate and integrate from $\theta_i$ at $t = 0$.
^p-lumped

The model is valid when the body's own temperature differences are small next to its difference from the fluid, which is a statement about the Biot number with the length $L_c = V/A_s$: the usual criterion is $\mathrm{Bi} = hL_c/k < 0.1$. For a slab of half-thickness $L$ cooling slowly, the temperature inside is close to a parabola, and at $\mathrm{Bi} = 0.1$ its centre sits only 5 % of the surface-to-fluid difference above its surface (derive prompt below), so the lumped answer is good to a few percent.
^lumped-validity

> [!thm] Theorem 2 (first-order response)
> A system obeying $\tau\,dy/dt + y = u(t)$ with $y(0) = 0$:
> - after a step $u = U$, $y = U(1 - e^{-t/\tau})$: 63.2 % at $t = \tau$, 95.0 % at $3\tau$, 99.3 % at $5\tau$;
> - following a ramp $u = r t$, $y = r(t - \tau) + r\tau e^{-t/\tau}$: after a few $\tau$ it tracks the ramp with a constant lag $r\tau$, one time constant behind.
^time-constant

> [!proof]- Proof
> 1. Multiply by the integrating factor $e^{t/\tau}/\tau$: $(y e^{t/\tau})' = u\,e^{t/\tau}/\tau$.
> 2. Step: integrate, $y e^{t/\tau} = U(e^{t/\tau} - 1)$.
> 3. Ramp: integrate by parts, $\int_0^t (r s/\tau) e^{s/\tau}\,ds = r t e^{t/\tau} - r\tau(e^{t/\tau} - 1)$. Divide by $e^{t/\tau}$.
^p-time-constant

The **time constant** $\tau$ is the one number for a first-order thermal system: the time to cover 63 % of a step, and the lag behind a ramp. A thermometer's reading of a ramping furnace is low by $r\tau$, however long the ramp lasts.
^time-constant-reading

## Distributed temperature: the slab

> [!def] Fourier number
> For a body of length scale $L$ and diffusivity $\alpha = k/(\rho c)$, the **Fourier number** $\mathrm{Fo} = \alpha t/L^2$ is time measured in units of the diffusion time $L^2/\alpha$.
^fourier-number

> [!thm] Theorem 3 (slab with a step in surface temperature)
> A slab $-L < x < L$, uniform at $T_i$, has both faces held at $T_s$ from $t = 0$. With $\theta = (T - T_s)/(T_i - T_s)$ and $\lambda_n = (2n+1)\pi/2$,
> $$\theta(x, t) = \sum_{n=0}^{\infty} \frac{4(-1)^n}{(2n+1)\pi}\cos\!\left(\frac{\lambda_n x}{L}\right) e^{-\lambda_n^2\,\mathrm{Fo}}, \qquad \mathrm{Fo} = \frac{\alpha t}{L^2}.$$
> For $\mathrm{Fo} > 0.2$ the first term alone is within 0.01 of the sum: the slab then decays as one mode with time constant $\tau_1 = 4L^2/(\pi^2\alpha)$.
^slab-series

> [!proof]- Proof (d 4)
> 1. $\theta$ solves $\theta_t = \alpha\theta_{xx}$ with $\theta(\pm L) = 0$ and $\theta(x, 0) = 1$.
> 2. Try $\theta = X(x)\,\Theta(t)$: $\Theta'/(\alpha\Theta) = X''/X$, and the two sides depend on different variables, so both equal a constant $-\mu^2$.
> 3. $X = \cos(\mu x)$ (the solution is even in $x$) with $\cos(\mu L) = 0$, so $\mu L = \lambda_n$; and $\Theta = e^{-\alpha\mu^2 t} = e^{-\lambda_n^2\mathrm{Fo}}$.
> 4. The equation is linear, so any sum $\sum a_n\cos(\lambda_n x/L)e^{-\lambda_n^2\mathrm{Fo}}$ solves it with the boundary values.
> 5. The cosines are orthogonal on $(-L, L)$: $\int_{-L}^{L}\cos(\lambda_n x/L)\cos(\lambda_m x/L)\,dx = L\,\delta_{nm}$.
> 6. Match $t = 0$: $a_n = L^{-1}\int_{-L}^{L}\cos(\lambda_n x/L)\,dx = 2\sin\lambda_n/\lambda_n = 4(-1)^n/((2n+1)\pi)$.
> 7. The second term's exponent exceeds the first's by $8\cdot\pi^2\mathrm{Fo}/4$, so at $\mathrm{Fo} = 0.2$ its size relative to the first is $e^{-3.95}/3 < 0.01$; later terms are smaller still, and all shrink as Fo grows.
^p-slab-series

With convection at the faces instead of a fixed temperature, the same separation gives modes $\cos(\lambda_n x/L)$ with $\lambda_n\tan\lambda_n = \mathrm{Bi} = hL/k$ and coefficients $4\sin\lambda_n/(2\lambda_n + \sin 2\lambda_n)$. The one-term charts in textbooks are this first term plotted.
^slab-convective

## The semi-infinite solid

> [!def] Error function
> $\operatorname{erf}(z) = \frac{2}{\sqrt\pi}\int_0^z e^{-s^2}\,ds$ rises from 0 to 1; $\operatorname{erfc} = 1 - \operatorname{erf}$. Values: $\operatorname{erf}(0.5) = 0.520$, $\operatorname{erf}(1) = 0.843$, $\operatorname{erf}(1.82) = 0.990$, $\operatorname{erf}(2) = 0.995$.
^erf

> [!thm] Theorem 4 (semi-infinite solid, step in surface temperature)
> A solid filling $x > 0$, uniform at $T_i$, has its surface held at $T_s$ from $t = 0$. Then
> $$\frac{T - T_s}{T_i - T_s} = \operatorname{erf}\frac{x}{2\sqrt{\alpha t}}, \qquad q''_s(t) = \frac{k\,(T_s - T_i)}{\sqrt{\pi\alpha t}},$$
> $q''_s$ being the heat flux into the solid at its surface.
^semi-infinite

> [!proof]- Proof (d 3.5)
> 1. The problem has no length scale: only $x$, $t$ and $\alpha$ enter, and the one dimensionless combination is $\eta = x/(2\sqrt{\alpha t})$. So seek $\theta = (T - T_s)/(T_i - T_s) = f(\eta)$.
> 2. Chain rule: $\theta_t = -f'\,\eta/(2t)$ and $\theta_{xx} = f''/(4\alpha t)$.
> 3. The heat equation becomes $f'' + 2\eta f' = 0$.
> 4. So $(f' e^{\eta^2})' = 0$: $f' = c\,e^{-\eta^2}$, and $f = c\int_0^\eta e^{-s^2}ds$ using $f(0) = 0$ (the surface).
> 5. Both $t = 0$ and $x \to \infty$ map to $\eta \to \infty$, where $f = 1$: $c = 2/\sqrt\pi$, so $f = \operatorname{erf}\eta$.
> 6. Surface flux: $q''_s = -k\,T_x(0) = -k(T_i - T_s)\,f'(0)/(2\sqrt{\alpha t}) = k(T_s - T_i)/\sqrt{\pi\alpha t}$.
^p-semi-infinite

> [!thm] Theorem 5 (semi-infinite solid, constant surface flux)
> If instead a constant flux $q''_0$ enters the surface from $t = 0$, the surface temperature rises as
> $$T_s(t) - T_i = \frac{2q''_0}{k}\sqrt{\frac{\alpha t}{\pi}}.$$
^semi-infinite-flux

> [!proof]- Proof (d 4)
> 1. Differentiate the heat equation $T_t = \alpha T_{xx}$ in $x$ and multiply by $-k$: the flux $q'' = -kT_x$ obeys the same equation, $q''_t = \alpha q''_{xx}$.
> 2. In terms of $q''$ the problem is a step: $q''(0, t) = q''_0$, $q''(x, 0) = 0$. By Theorem 4 with $q''$ in place of $T$, $q'' = q''_0\operatorname{erfc}(x/(2\sqrt{\alpha t}))$.
> 3. $T_s - T_i = \int_0^\infty (-T_x)\,dx = (q''_0/k)\int_0^\infty\operatorname{erfc}(x/(2\sqrt{\alpha t}))\,dx$.
> 4. $\int_0^\infty\operatorname{erfc}(u)\,du = 1/\sqrt\pi$, and $dx = 2\sqrt{\alpha t}\,du$, giving $2q''_0\sqrt{\alpha t/\pi}/k$.
^p-semi-infinite-flux

> [!thm] Theorem 6 (contact temperature)
> Two semi-infinite bodies at uniform $T_A$ and $T_B$, placed in perfect contact at $t = 0$, hold their interface at the constant
> $$T_c = \frac{e_A T_A + e_B T_B}{e_A + e_B}, \qquad e = \sqrt{k\rho c},$$
> for all $t > 0$. The **effusivity** $e$ (W s$^{1/2}$/(m² K)) measures a body's grip on its surface temperature.
^contact-temperature

> [!proof]- Proof (d 3)
> 1. Guess that the interface holds a constant $T_c$. Then each body is a semi-infinite solid with a step in surface temperature, solved by Theorem 4.
> 2. Flux into $B$ from the interface: $k_B(T_c - T_B)/\sqrt{\pi\alpha_B t}$; flux into $A$: $k_A(T_c - T_A)/\sqrt{\pi\alpha_A t}$.
> 3. Energy is not stored in the interface, so the two sum to zero.
> 4. $k/\sqrt\alpha = \sqrt{k\rho c} = e$, and the $\sqrt{\pi t}$ cancels: $e_A(T_c - T_A) + e_B(T_c - T_B) = 0$, which no longer depends on $t$, so the guess is consistent.
> 5. The heat equation with these conditions has one solution, so this is it.
^p-contact-temperature

The interface sits nearer the temperature of the body with the larger effusivity. That is why metal at 60 °C hurts and wood at 60 °C does not, and why a cold layer spread on a warm bed pulls the bed's surface halfway down if both are the same powder.
^contact-reading

## How far heat has got

> [!def] Penetration depth
> After a surface change at $t = 0$, the **penetration depth** $\delta(t)$ is the depth beyond which the solid has not yet noticed. By the 1 % criterion of Theorem 4 ($\operatorname{erf} = 0.99$), $\delta_{99} = 3.64\sqrt{\alpha t}$. Turned around, heat crosses a thickness $L$ in a time of order $L^2/\alpha$.
^penetration

Two consequences. A slab of thickness $L$ heated on one face behaves as semi-infinite (its far face has felt less than 1 % of the change) while $\alpha t/L^2 < 0.075$, and as one decaying mode once $\mathrm{Fo} > 0.2$ (Theorem 3). And diffusion time grows with the square of size: a layer ten times thicker takes a hundred times longer, which is how a fast event in a thin layer can be slowed down for a bench measurement.
^penetration-reading

> [!thm] Theorem 7 (periodic surface temperature)
> If the surface of a semi-infinite solid swings as $T_s = \bar T + \Delta T\cos\omega t$ forever, then at depth $x$
> $$T - \bar T = \Delta T\,e^{-x/\delta}\cos\!\left(\omega t - \frac{x}{\delta}\right), \qquad \delta = \sqrt{\frac{2\alpha}{\omega}}:$$
> the swing decays by $e$ every $\delta$ and lags by one radian every $\delta$.
^periodic

> [!proof]- Proof
> 1. Write $T - \bar T = \operatorname{Re}[\Delta T\,F(x)e^{i\omega t}]$; the heat equation becomes $i\omega F = \alpha F''$.
> 2. $F = e^{-\kappa x}$ with $\kappa^2 = i\omega/\alpha$, so $\kappa = (1 + i)\sqrt{\omega/(2\alpha)} = (1 + i)/\delta$, choosing the root that decays with depth.
> 3. $F(0) = 1$ matches the surface. Take the real part of $\Delta T e^{-x/\delta}e^{i(\omega t - x/\delta)}$.
^p-periodic

## Networks of resistances and capacitances

> [!def] Thermal RC network
> Split a structure into nodes, each with a heat capacity $C_j$ and one temperature $T_j$, joined by thermal resistances. The analogy with circuits is exact for the equations: temperature is voltage, heat flow is current, $R$ is resistance, $C$ is capacitance to ground, a heat source is a current source. The node equations are $\mathbf C\,\dot{\mathbf T} = -\mathbf G\,\mathbf T + \mathbf p$, with $\mathbf C$ diagonal, $\mathbf G$ the conductance matrix (temperatures measured from ambient) and $\mathbf p$ the node powers.
^rc-networks

> [!thm] Theorem 8 (time constants of a network)
> If every node connects, through some path, to ambient, every solution of $\mathbf C\dot{\mathbf T} = -\mathbf G\mathbf T + \mathbf p$ with constant $\mathbf p$ is a steady state plus a sum of decaying exponentials $e^{-t/\tau_i}$, one per node, with real $\tau_i > 0$. The step response of any node is $\sum_i a_i(1 - e^{-t/\tau_i})$.
^rc-modes

> [!proof]- Proof (d 4)
> 1. $\mathbf G$ is symmetric (a resistor between $j$ and $k$ enters both rows alike) and $\mathbf T^\top\mathbf G\mathbf T = \sum (T_j - T_k)^2/R_{jk} + \sum T_j^2/R_{j0} > 0$ for $\mathbf T \ne 0$ when every node reaches ambient.
> 2. Subtract the steady state $\mathbf T_\infty = \mathbf G^{-1}\mathbf p$; the rest obeys $\mathbf C\dot{\mathbf u} = -\mathbf G\mathbf u$.
> 3. Substitute $\mathbf u = \mathbf C^{-1/2}\mathbf y$: $\dot{\mathbf y} = -\mathbf A\mathbf y$ with $\mathbf A = \mathbf C^{-1/2}\mathbf G\mathbf C^{-1/2}$, symmetric and positive definite.
> 4. A symmetric matrix has an orthonormal basis of eigenvectors with real eigenvalues ([eigenvalues](la-core.md#^eigen)); positive definiteness makes them positive, $\lambda_i > 0$.
> 5. In that basis each component decays as $e^{-\lambda_i t}$; set $\tau_i = 1/\lambda_i$ and transform back.
^p-rc-modes

A **Cauer** network is a ladder whose nodes stand for real slices of the structure. A **Foster** network is a sum of parallel $RC$ pairs in series, fitted to a measured step response as $\sum R_i(1 - e^{-t/\tau_i})$; its intermediate nodes mean nothing physical, so it cannot be cut and joined to another part's network. Recovering a Cauer ladder from a measured response is what a [structure function](th-electronics-cooling.md#^structure-function) does.
^cauer-foster

## Examples

> [!example] A thermocouple in a ramping furnace
> A thermocouple bead, a sphere of 0.5 mm diameter ($\rho = 8700$ kg/m³, $c = 450$ J/(kg K), $k = 20$ W/(m K)), sits in a furnace bore with a combined coefficient of 100 W/(m² K). The furnace ramps at 20 °C/min. Find the bead's time constant and how far its reading lags the gas.
^ex-tc-lag

> [!solution]- Solution
> methods: lumped-capacitance, th-transient/time-constant
> 1. $L_c = V/A_s = D/6 = 83$ µm; $\mathrm{Bi} = 100 \times 8.3\times10^{-5}/20 = 4\times10^{-4}$, so lumped is exact for practical purposes.
> 2. $\tau = \rho c D/(6h) = 8700 \times 450 \times 0.0005/600 = 3.3$ s.
> 3. Lag $= r\tau = (20/60) \times 3.26 = 1.1$ K. Small next to a ±5 °C band, but it scales with bead size and falls with $h$, so a thick sheathed probe in still gas can lag by tens of kelvin.
^sol-ex-tc-lag

> [!example] A cold powder layer on a warm bed
> In the setting of the [SLS fresh-layer note](../../notes/sls/index.md), a layer of polymer powder ($k = 0.10$ W/(m K), $\rho = 456$ kg/m³, $c = 2470$ J/(kg K), the note's values) arrives 30 K below the bed. Using the note's figure that a printed part's effusivity is 2.4 times the powder's, find the interface temperature at first contact over loose powder and over a part, the diffusion time across a 110 µm layer, and how long the contact result holds.
^ex-fresh-layer

> [!solution]- Solution
> methods: th-transient/contact-temperature, th-transient/penetration
> 1. Over powder, equal effusivities: the interface sits at the average, 15 K below the bed.
> 2. Over a part, $e_{part} = 2.4\,e_{powder}$: the interface is $30 \times 1/(1 + 2.4) = 8.8$ K below the bed, the part's surface dropping by that much.
> 3. $\alpha = 0.10/(456 \times 2470) = 8.9\times10^{-8}$ m²/s; $L^2/\alpha = (110\times10^{-6})^2/8.9\times10^{-8} = 0.14$ s.
> 4. The contact result treats the layer as semi-infinite. Its top face first feels the contact when $3.64\sqrt{\alpha t} = 110$ µm, after about 10 ms; the interface feels the top face only once that change has come back down, a path of 220 µm, so the contact value holds for about the first 40 ms, close to the note's figure of about 30 ms. After that the thin layer runs out of cold and the interface climbs back; the note's slab solution follows that recovery.
^sol-ex-fresh-layer

## Derive

> [!derive] For a slab of half-thickness $L$ cooled at both faces with coefficient $h$ and cooling slowly enough that its temperature profile is the steady one for a uniform internal heat sink, show that $(T_{centre} - T_{surface})/(T_{surface} - T_\infty) = \mathrm{Bi}/2$ with $\mathrm{Bi} = hL/k$.
^d-lumped-criterion

> [!solution]- Solution
> methods: th-conduction/generation, energy-balance
> 1. A slab cooling uniformly at rate $\dot T$ behaves like uniform generation $\dot q''' = \rho c\dot T$ (negative); by the generation result, $T_{centre} - T_{surface} = |\dot q'''|L^2/(2k)$.
> 2. Surface balance: all of it leaves through the faces, $|\dot q'''|L = h(T_{surface} - T_\infty)$.
> 3. Divide: $hL^2/(2kL) = \mathrm{Bi}/2$.
^sol-d-lumped-criterion

> [!derive] Show that the total heat absorbed per unit area by a semi-infinite solid after a step in surface temperature is $2e(T_s - T_i)\sqrt{t/\pi}$, and that its temperature profile has the same shape at all times when depth is scaled by $\sqrt{\alpha t}$.
^d-semi-infinite-heat

> [!solution]- Solution
> methods: th-transient/semi-infinite
> 1. $Q'' = \int_0^t k(T_s - T_i)/\sqrt{\pi\alpha s}\,ds = 2k(T_s - T_i)\sqrt{t/(\pi\alpha)}$, and $k/\sqrt\alpha = e$.
> 2. The profile is a function of $x/(2\sqrt{\alpha t})$ alone.
^sol-d-semi-infinite-heat

> [!derive] For the slab with convective faces, show that as $\mathrm{Bi} \to 0$ the slowest mode decays with exactly the lumped time constant $\rho c L/h$.
^d-slab-to-lumped

> [!solution]- Solution
> methods: limiting-case, th-transient/slab-series
> 1. The first root of $\lambda\tan\lambda = \mathrm{Bi}$ is small when Bi is: $\lambda\tan\lambda \approx \lambda^2$, so $\lambda_1^2 \approx \mathrm{Bi}$.
> 2. The mode decays as $e^{-\lambda_1^2\mathrm{Fo}} = e^{-(hL/k)(\alpha t/L^2)} = e^{-ht/(\rho c L)}$.
> 3. $V/A_s = L$ for a slab of half-thickness $L$, so this is $e^{-t/\tau}$ with $\tau = \rho c V/(hA_s)$.
^sol-d-slab-to-lumped

> [!derive] A die of heat capacity $C_1$ sits on a heat sink of capacity $C_2$ through $R_1$; the sink reaches ambient through $R_2$. Find both time constants, and show that when $C_1 \ll C_2$ and $R_1C_1 \ll R_2C_2$ they approach $R_1C_1$ and $R_2(C_1 + C_2)$.
^d-two-node

> [!solution]- Solution
> methods: th-transient/rc-modes, limiting-case
> 1. $C_1\dot T_1 = -(T_1 - T_2)/R_1$, $C_2\dot T_2 = (T_1 - T_2)/R_1 - T_2/R_2$.
> 2. The decay rates are the roots of $\lambda^2 - \lambda\,[1/(R_1C_1) + (1/R_1 + 1/R_2)/C_2] + 1/(R_1R_2C_1C_2) = 0$.
> 3. With $R_1C_1 \ll R_2C_2$ the slow root is negligible in the sum, so $\lambda_f \approx (1/R_1)(1/C_1 + 1/C_2) \approx 1/(R_1C_1)$ once $C_1 \ll C_2$ too.
> 4. The product of the roots is $1/(R_1R_2C_1C_2)$, so $\lambda_s = 1/(R_1R_2C_1C_2\lambda_f) \approx 1/(R_2(C_1 + C_2))$, keeping both terms of $\lambda_f$: the die rides along with the sink.
> 5. Check: $R_1 = 0.5$, $C_1 = 2$, $R_2 = 0.3$, $C_2 = 200$ gives 0.990 s and 60.6 s against 1.0 s and 60.6 s.
^sol-d-two-node

## Problems

> [!problem] A steel ball in air (d 2)
> A steel ball of 10 mm diameter ($\rho = 7800$ kg/m³, $c = 470$ J/(kg K), $k = 40$ W/(m K)) leaves an oven at 200 °C into air at 25 °C with $h = 20$ W/(m² K). How long until it reaches 50 °C?
^inv-th-steel-ball

> [!solution]- Solution
> methods: lumped-capacitance
> 1. $\mathrm{Bi} = h(D/6)/k = 8\times10^{-4}$: lumped.
> 2. $\tau = \rho c D/(6h) = 306$ s.
> 3. $t = \tau\ln(175/25) = 594$ s.
> Answer: about 10 minutes.
^sol-inv-th-steel-ball

> [!problem] Two handles at 60 °C (d 2.5)
> A hand at 34 °C ($k = 0.37$ W/(m K), $\rho = 1000$ kg/m³, $c = 3500$ J/(kg K)) grabs a handle at 60 °C. Find the skin surface temperature at first contact for aluminium ($k = 237$, $\rho = 2700$, $c = 900$) and for pine ($k = 0.12$, $\rho = 500$, $c = 2300$), SI units throughout.
^inv-th-handles

> [!solution]- Solution
> methods: th-transient/contact-temperature
> 1. Effusivities: skin 1138, aluminium 24000, pine 371.
> 2. Aluminium: $(24000 \times 60 + 1138 \times 34)/25138 = 58.8$ °C.
> 3. Pine: $(371 \times 60 + 1138 \times 34)/1509 = 40.4$ °C.
> Answer: 58.8 °C, which burns, and 40.4 °C, which does not.
^sol-inv-th-handles

> [!problem] A relay stuck on (d 3)
> A furnace holds 1000 °C in a 20 °C room, losing 80 W, with losses proportional to the temperature excess. Its fast inner parts have a heat capacity of 600 J/K; treat them as one lumped node. The 800 W heater's relay fails closed. How long until the centre passes 1165 °C? Compare with the estimate that ignores the rise in losses.
^inv-th-relay-runaway

> [!solution]- Solution
> methods: lumped-capacitance, energy-balance
> 1. $G = 80/980 = 0.0816$ W/K; $\tau = C/G = 7350$ s; the full-power steady excess would be $800/G = 9800$ K (the heater would fail long before).
> 2. $t = \tau\ln[(9800 - 980)/(9800 - 1145)] = 139$ s.
> 3. Ignoring the loss rise: $165 \times 600/(800 - 80) = 138$ s. The run is a tiny fraction of $\tau$, so the start of the exponential is a straight line.
> Answer: about 139 s; a limiter must act well within two minutes.
^sol-inv-th-relay-runaway

> [!problem] A plate's slowest mode (d 4)
> An aluminium plate 20 mm thick ($\alpha = 9.71\times10^{-5}$ m²/s) has one face suddenly changed in temperature, the other insulated. Find the time constant of its slowest decay, and compare with a one-node RC model with $C$ the plate's heat capacity and $R$ (a) the full thickness's conduction resistance, (b) half of it. What fraction of the full-thickness resistance would match?
^inv-th-plate-mode

> [!solution]- Solution
> methods: th-transient/slab-series, th-transient/rc-networks
> 1. An insulated face is a symmetry plane, so this is half of a slab of half-thickness $L = 20$ mm: $\tau_1 = 4L^2/(\pi^2\alpha) = 1.67$ s.
> 2. (a) $RC = (L/kA)(\rho cAL) = L^2/\alpha = 4.12$ s, 2.47 times too slow. (b) $L^2/(2\alpha) = 2.06$ s, 23 % too slow.
> 3. Match: $R = (4/\pi^2)\,L/(kA) = 0.405\,L/(kA)$.
> Answer: 1.67 s; 4.12 s and 2.06 s; 0.405.
^sol-inv-th-plate-mode

> [!problem] Daily and yearly swings underground (d 4.5)
> Soil with $\alpha = 5\times10^{-7}$ m²/s sees a surface temperature swing that is sinusoidal with a period of a day and, separately, of a year. At what depth does the daily swing fall to 1 % of its surface amplitude? What fraction of the yearly swing reaches 2 m, and how many days late does it peak there? At what depth is the yearly swing exactly out of phase with the surface, and how big is it there?
^inv-th-soil-swing

> [!solution]- Solution
> methods: th-transient/periodic
> 1. Daily: $\omega = 2\pi/86400$ s⁻¹, $\delta = \sqrt{2\alpha/\omega} = 0.117$ m; 1 % at $\delta\ln 100 = 0.54$ m.
> 2. Yearly: $\delta = 2.24$ m. At 2 m the amplitude is $e^{-2/2.24} = 0.41$ of the surface's, lagging $2/2.24 = 0.89$ rad, which is $0.89/(2\pi) \times 365 = 52$ days.
> 3. Out of phase where $x/\delta = \pi$: $x = 7.0$ m, amplitude $e^{-\pi} = 4.3$ %.
> Answer: 0.54 m; 41 %, 52 days late; 7.0 m, 4.3 %.
^sol-inv-th-soil-swing

> [!problem] A heater over cold powder (d 3.5)
> A deep bed of polymer powder ($k = 0.10$ W/(m K), $\alpha = 8.9\times10^{-8}$ m²/s) starts uniform. A radiant heater drives 2000 W/m² into its surface. How long until the surface has risen by 28 K? Compare with the 0.14 s that conduction from a warm bed below needs to warm a 110 µm layer.
^inv-th-heater-powder

> [!solution]- Solution
> methods: th-transient/semi-infinite-flux
> 1. $\Delta T_s = (2q''_0/k)\sqrt{\alpha t/\pi}$, so $t = \pi\,(k\Delta T_s/(2q''_0))^2/\alpha$.
> 2. $t = \pi \times (0.10 \times 28/4000)^2/8.9\times10^{-8} = 17$ s.
> 3. Over a hundred times slower. Powder's low effusivity actually helps the heater, since a fixed flux raises a low-effusivity surface fast; the heater is slow because 2000 W/m² is small next to what a warm bed delivers by contact, $e\,\Delta T/\sqrt{\pi t}$, about 9 kW/m² at 0.1 s for a 15 K interface drop and more before that, and the bed has only one 110 µm layer to warm.
> Answer: about 17 s.
^sol-inv-th-heater-powder
