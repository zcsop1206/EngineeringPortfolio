---
study: basic
id: mc-vibration
title: "Vibration: one and many degrees of freedom"
area: mc
needs: [la-core]
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [eigenvalues and the spectral theorem](la-core.md#^eigen); beam energy and stiffness from [mc-solids](mc-solids.md#^deflection) for the continuous examples.
^needs

## One degree of freedom

> [!thm] Theorem 1 (undamped oscillator)
> A mass $m$ on a spring of stiffness $k$, displaced $x$ from equilibrium, obeys $m\ddot x + kx = 0$, with solutions $x = A\cos\omega_n t + B\sin\omega_n t$ and **natural frequency** $\omega_n = \sqrt{k/m}$ rad/s, $f_n = \omega_n/2\pi$ Hz. If gravity preloads the spring by a static deflection $\delta_{st}$, then $f_n = \frac{1}{2\pi}\sqrt{g/\delta_{st}}$, whatever $m$ and $k$ are.
^sdof

> [!proof]- Proof
> 1. Measure $x$ downward from the loaded equilibrium: the spring pushes $k(\delta_{st} + x)$ up, gravity pulls $mg$ down, and $k\delta_{st} = mg$, so the net force is $-kx$.
> 2. Newton: $m\ddot x = -kx$.
> 3. Try $x = e^{\lambda t}$: $\lambda^2 = -k/m$, $\lambda = \pm i\omega_n$; the real combinations are the cosine and sine.
> 4. From step 1, $\omega_n^2 = k/m = g/\delta_{st}$.
^p-sdof

> [!def] Viscous damping
> Add a damper whose force is $-c\dot x$: $m\ddot x + c\dot x + kx = 0$. The **damping ratio** is $\zeta = c/c_c$ with critical damping $c_c = 2\sqrt{km}$. For $\zeta < 1$ the system is underdamped and oscillates while it decays; $\zeta = 1$ is critical; $\zeta > 1$ is overdamped and creeps back without crossing. Bolted metal structures sit near $\zeta \approx 0.01$ to $0.05$; elastomer mounts near $0.05$ to $0.2$.
^damping

> [!thm] Theorem 2 (free decay)
> For $\zeta < 1$, $x = Xe^{-\zeta\omega_n t}\cos(\omega_d t - \phi)$ with damped frequency $\omega_d = \omega_n\sqrt{1 - \zeta^2}$. Successive peaks one period $T_d = 2\pi/\omega_d$ apart have the constant ratio whose logarithm, the **logarithmic decrement**, is $\delta = 2\pi\zeta/\sqrt{1 - \zeta^2} \approx 2\pi\zeta$.
^log-dec

> [!proof]- Proof (d 2)
> 1. Try $e^{\lambda t}$: $m\lambda^2 + c\lambda + k = 0$, so $\lambda = -\zeta\omega_n \pm i\omega_n\sqrt{1 - \zeta^2}$ when $\zeta < 1$.
> 2. The real solutions are $Xe^{-\zeta\omega_n t}\cos(\omega_d t - \phi)$.
> 3. Its derivative is $e^{-\zeta\omega_n t}$ times a function of period $T_d$, so peaks recur every $T_d$, and each is $e^{-\zeta\omega_n T_d}$ times the last.
> 4. $\delta = \zeta\omega_n T_d = 2\pi\zeta\omega_n/\omega_d = 2\pi\zeta/\sqrt{1 - \zeta^2}$.
^p-log-dec

> [!thm] Theorem 3 (forced response)
> Under a force $F_0\cos\omega t$ the damped oscillator settles to $X\cos(\omega t - \phi)$ with $r = \omega/\omega_n$ and
> $$\frac{X}{F_0/k} = \frac{1}{\sqrt{(1 - r^2)^2 + (2\zeta r)^2}}, \qquad \tan\phi = \frac{2\zeta r}{1 - r^2}.$$
> The complex **frequency response function** (FRF) is $H(\omega) = X/F = 1/(k - m\omega^2 + ic\omega)$. Well below resonance the response is set by stiffness ($X \approx F_0/k$, in phase); at $r = 1$ by damping ($X = F_0/(c\omega_n)$, lagging $90^\circ$); well above by mass ($X \approx F_0/(m\omega^2)$, lagging nearly $180^\circ$). For $\zeta < 1/\sqrt2$ the amplitude peaks at $r = \sqrt{1 - 2\zeta^2}$ with height $1/(2\zeta\sqrt{1 - \zeta^2})$ times the static deflection, close to the **quality factor** $Q = 1/(2\zeta)$.
^frf

> [!proof]- Proof (d 2.5)
> 1. Write the force as $\mathrm{Re}(F_0e^{i\omega t})$ and seek $x = \mathrm{Re}(\hat X e^{i\omega t})$; the equation is linear with real coefficients, so the real part of a complex solution solves the real equation. The free solution decays (Theorem 2), leaving this one.
> 2. Substitute: $(k - m\omega^2 + ic\omega)\hat X = F_0$.
> 3. Divide by $k$, using $m\omega^2/k = r^2$ and $c\omega/k = 2\zeta r$: $\hat X k/F_0 = 1/(1 - r^2 + 2i\zeta r)$.
> 4. Its modulus and argument are the stated $X$ and $\phi$.
> 5. The amplitude is largest where $g = (1 - r^2)^2 + 4\zeta^2r^2$ is least; as a function of $r^2$, $dg/d(r^2) = -2(1 - r^2) + 4\zeta^2 = 0$ at $r^2 = 1 - 2\zeta^2$, which exists only when $\zeta < 1/\sqrt2$.
> 6. There $g = 4\zeta^4 + 4\zeta^2(1 - 2\zeta^2) = 4\zeta^2(1 - \zeta^2)$, so the peak is $1/(2\zeta\sqrt{1 - \zeta^2})$.
^p-frf

> [!thm] Theorem 4 (transmissibility)
> A mass on a spring $k$ and damper $c$ whose base moves as $Y\cos\omega t$ moves with amplitude $X = \mathcal T\,Y$,
> $$\mathcal T = \sqrt{\frac{1 + (2\zeta r)^2}{(1 - r^2)^2 + (2\zeta r)^2}}.$$
> For every $\zeta$, $\mathcal T > 1$ when $r < \sqrt2$ and $\mathcal T < 1$ when $r > \sqrt2$: a mount isolates only above $\sqrt2\,\omega_n$. Above $\sqrt2$, more damping raises $\mathcal T$. Far above, $\mathcal T$ falls as $1/r^2$ while $2\zeta r \ll 1$, and only as $2\zeta/r$ beyond.
^isolation

> [!proof]- Proof (d 2.5)
> 1. The spring and damper act on the stretch $x - y$: $m\ddot x = -c(\dot x - \dot y) - k(x - y)$.
> 2. Complex amplitudes: $(k - m\omega^2 + ic\omega)\hat X = (k + ic\omega)\hat Y$.
> 3. Divide through by $k$: $\mathcal T = |1 + 2i\zeta r|/|1 - r^2 + 2i\zeta r|$, the stated formula.
> 4. $\mathcal T^2 - 1$ has the sign of $(1 + 4\zeta^2r^2) - ((1 - r^2)^2 + 4\zeta^2r^2) = r^2(2 - r^2)$: positive below $\sqrt2$, negative above.
> 5. $\mathcal T^2 = (1 + a)/(b + a)$ with $a = 4\zeta^2r^2$ and $b = (1 - r^2)^2$; it increases with $a$ exactly when $b > 1$, which is $r > \sqrt2$.
^p-isolation

Isolation design follows: put $f_n$ well below the lowest disturbing frequency, a factor of 3 or more, and accept the static sag that Theorem 1 ties to it ($f_n = 3$ Hz needs $\delta_{st} \approx 28$ mm of sag in a plain spring). Damping is wanted only to tame the resonance on the way through.
^isolation-rule

## Many degrees of freedom

> [!thm] Theorem 5 (normal modes)
> Let $M\ddot x + Kx = f$ with $N$ coordinates, $M$ symmetric positive definite (mass) and $K$ symmetric positive semidefinite (stiffness). There are $N$ real $\omega_i^2 \ge 0$ and **mode shapes** $\varphi_i$ with $K\varphi_i = \omega_i^2 M\varphi_i$, which can be chosen with $\varphi_i^T M\varphi_j = \delta_{ij}$; then $\varphi_i^T K\varphi_j = \omega_i^2\delta_{ij}$. Writing $x = \sum_i q_i\varphi_i$ decouples the equations into $\ddot q_i + \omega_i^2 q_i = \varphi_i^T f$. A zero $\omega_i$ is a rigid-body motion.
^modes

> [!proof]- Proof (d 3)
> 1. $M$ is symmetric positive definite, so by the [spectral theorem](la-core.md#^eigen) $M = Q\Lambda Q^T$ with $\Lambda > 0$, and $M^{1/2} = Q\Lambda^{1/2}Q^T$ is a symmetric positive definite square root.
> 2. Substitute $x = M^{-1/2}y$ and multiply by $M^{-1/2}$: $\ddot y + \tilde K y = M^{-1/2}f$, with $\tilde K = M^{-1/2}KM^{-1/2}$ symmetric positive semidefinite.
> 3. The spectral theorem gives orthonormal eigenvectors $u_i$ of $\tilde K$ with real eigenvalues $\lambda_i = u_i^T\tilde K u_i \ge 0$; write $\lambda_i = \omega_i^2$.
> 4. $\varphi_i = M^{-1/2}u_i$ satisfies $K\varphi_i = M^{1/2}\tilde K u_i = \omega_i^2 M^{1/2}u_i = \omega_i^2 M\varphi_i$.
> 5. $\varphi_i^T M\varphi_j = u_i^T u_j = \delta_{ij}$, and $\varphi_i^T K\varphi_j = \omega_j^2\varphi_i^T M\varphi_j = \omega_i^2\delta_{ij}$.
> 6. The $\varphi_i$ form a basis, so any $x$ is $\sum q_i\varphi_i$; multiply $M\ddot x + Kx = f$ on the left by $\varphi_j^T$ to get $\ddot q_j + \omega_j^2 q_j = \varphi_j^T f$.
^p-modes

Damping decouples the same way only if the damping matrix is a combination of $M$ and $K$; real structures are modelled by giving each mode its own $\zeta_i$, measured. A force excites mode $i$ in proportion to $\varphi_i^T f$: a force applied at a node of a mode (where $\varphi_i = 0$) cannot excite it, and a sensor at a node cannot see it.
^modal-damping

> [!thm] Theorem 6 (Rayleigh quotient)
> For any $v \neq 0$, $R(v) = v^T Kv/v^T Mv$ satisfies $\omega_1^2 \le R(v) \le \omega_N^2$, with equality at either end only for a mode of that frequency. If $v = \varphi_1 + \varepsilon e$ with $e$ a combination of the other modes, $R(v) = \omega_1^2 + O(\varepsilon^2)$: a fair guess at the first mode shape gives a much better frequency, always from above. For a beam of bending stiffness $EI(x)$ and mass per length $\mu(x)$, the same holds with $R(w) = \int EI\,w''^2\,dx \big/ \int\mu w^2\,dx$ over shapes $w$ that meet the supports' displacement and slope conditions.
^rayleigh

> [!proof]- Proof (d 3)
> 1. Expand $v = \sum a_i\varphi_i$ in the modes of Theorem 5.
> 2. Orthonormality gives $v^T Mv = \sum a_i^2$ and $v^T Kv = \sum\omega_i^2 a_i^2$.
> 3. So $R(v)$ is a weighted mean of the $\omega_i^2$ with weights $a_i^2$: it lies between $\omega_1^2$ and $\omega_N^2$, and equals an end only if all weight sits on modes of that frequency.
> 4. With $a_1 = 1$ and the other $a_i = O(\varepsilon)$: $R - \omega_1^2 = \sum_{i \ge 2}(\omega_i^2 - \omega_1^2)a_i^2 / (1 + \sum_{i \ge 2}a_i^2) = O(\varepsilon^2)$.
> 5. For the beam, $\tfrac12\int EI\,w''^2\,dx$ is the strain energy and $\tfrac12\int\mu\dot w^2\,dx$ the kinetic energy, the analogues of $\tfrac12x^TKx$ and $\tfrac12\dot x^TM\dot x$; steps 1 to 4 run over the beam's modes (the convergence details are not given here).
^p-rayleigh

## Examples

> [!example] A machine on rubber mounts
> A machine sinks 2.0 mm when lowered onto its rubber mounts ($\zeta = 0.05$). An unbalance in it runs at 50 Hz. What fraction of the shaking reaches the floor, taking the floor as rigid and the force transmissibility equal to the base-motion one (a derive below)?
^ex-machine-mounts

> [!solution]- Solution
> methods: mc-vibration/sdof, mc-vibration/isolation
> 1. $f_n = \frac{1}{2\pi}\sqrt{9.81/0.002} = 11.1$ Hz.
> 2. $r = 50/11.15 = 4.49$, $2\zeta r = 0.449$.
> 3. $\mathcal T = \sqrt{1 + 0.449^2}/\sqrt{(1 - 20.1)^2 + 0.449^2} = 0.057$.
> Answer: about 5.7 % (undamped mounts would give 5.2 %); the run-up passes through 11 Hz, where the mounts amplify about tenfold.

> [!example] Two masses in a chain
> A wall, a spring $k$, a mass $m$, a second spring $k$, a second mass $m$, free end. Find the natural frequencies and mode shapes.
^ex-two-mass-chain

> [!solution]- Solution
> methods: modal-analysis, eigenvalues
> 1. $M = mI$, $K = k\begin{pmatrix}2 & -1\\ -1 & 1\end{pmatrix}$.
> 2. $\det(K - \omega^2 M) = 0$ with $\lambda = m\omega^2/k$: $(2 - \lambda)(1 - \lambda) - 1 = \lambda^2 - 3\lambda + 1 = 0$, so $\lambda = (3 \mp \sqrt5)/2 = 0.382, 2.618$.
> 3. Shapes from the second row, $x_2/x_1 = 1/(1 - \lambda)$: $1.618$ for the first mode (both move together, the outer one more) and $-0.618$ for the second (they move against each other).
> Answer: $\omega = 0.618\sqrt{k/m}$ and $1.618\sqrt{k/m}$, shapes $(1, 1.618)$ and $(1, -0.618)$.

> [!example] A ring-down
> A struck fixture rings down from 10 to 4 units of amplitude over 5 cycles. Find $\zeta$.
^ex-ring-down

> [!solution]- Solution
> methods: mc-vibration/log-dec
> 1. Per cycle, $\delta = \ln(10/4)/5 = 0.1833$.
> 2. Invert Theorem 2: $\zeta = \delta/\sqrt{4\pi^2 + \delta^2} = 0.0292$; the small-damping form $\delta/2\pi$ gives $0.0292$ too.
> Answer: $\zeta \approx 0.029$. Counting over several cycles averages out the error in reading any one peak.

## Derive

> [!derive] Show that for small $\zeta$ the two frequencies where $|H|$ falls to $1/\sqrt2$ of its peak are about $\omega_n(1 \pm \zeta)$, so the half-power bandwidth is $2\zeta\omega_n$.
^d-half-power

> [!derive] A mass on a spring and damper fixed to a rigid floor is driven by a harmonic force. Show that the amplitude of the force reaching the floor, divided by the driving amplitude, is the $\mathcal T$ of Theorem 4.
^d-force-trans

> [!derive] Prove that making any mass larger cannot raise the lowest natural frequency of a system, and making any spring stiffer cannot lower it.
^d-add-mass

> [!derive] A uniform simply supported beam of length $L$, stiffness $EI$ and mass $m_b$ carries a mass $m_c$ at midspan. Show that its static central-load shape gives $f \approx \frac{1}{2\pi}\sqrt{48EI/(L^3(m_c + \tfrac{17}{35}m_b))}$.
^d-effective-mass

> [!derive] Show that at $\zeta = 1$ the free response is $(A + Bt)e^{-\omega_n t}$, and that released from rest at $x_0 \neq 0$ it never crosses zero.
^d-critical

## Problems

> [!problem] A microscope on a shaking floor (d 3)
> A floor moves vertically at 20 Hz with 2 µm amplitude. A microscope sits on mounts with $f_n = 3$ Hz and $\zeta = 0.1$. Find the microscope's vibration amplitude.
^inv-mc-microscope-floor

> [!solution]- Solution
> methods: mc-vibration/isolation
> 1. $r = 20/3 = 6.67$, $2\zeta r = 1.333$.
> 2. $\mathcal T = \sqrt{1 + 1.778}/\sqrt{(1 - 44.4)^2 + 1.778} = 1.667/43.46 = 0.0383$.
> Answer: about 77 nm. With $\zeta = 0.01$ it would be about 46 nm: damping costs isolation here.

> [!problem] A small mass on a spring bolted to a resonant machine (d 4.5)
> A machine of mass $m$ on a spring $k$ is driven by $F_0\cos\omega_0 t$ at exactly $\omega_0 = \sqrt{k/m}$. A mass $\mu m$ on a spring $\mu k$ is bolted to it. (a) Find the machine's steady amplitude. (b) Find the added mass's amplitude. (c) For $\mu = 0.05$, find the natural frequencies of the combined system as multiples of $\omega_0$.
^inv-mc-absorber

> [!solution]- Solution
> methods: modal-analysis
> 1. Equations at frequency $\omega$: $(k + \mu k - m\omega^2)X_1 - \mu k X_2 = F_0$ and $-\mu k X_1 + (\mu k - \mu m\omega^2)X_2 = 0$.
> 2. At $\omega = \omega_0$, $\mu k - \mu m\omega_0^2 = 0$, so the second equation forces $X_1 = 0$.
> 3. The first then reads $-\mu k X_2 = F_0$: $X_2 = -F_0/(\mu k)$.
> 4. Free vibration with $\lambda = \omega^2/\omega_0^2$: $(1 + \mu - \lambda)(1 - \lambda) - \mu = 0$, so $\lambda^2 - (2 + \mu)\lambda + 1 = 0$ and $\lambda = 1 + \mu/2 \pm \sqrt{\mu + \mu^2/4}$.
> 5. $\mu = 0.05$: $\lambda = 0.80, 1.25$, so $\omega/\omega_0 = 0.894, 1.118$.
> Answer: (a) zero; (b) $F_0/(\mu k)$, 20 times the machine's static deflection under $F_0$, in antiphase with the force; (c) $0.894$ and $1.118$. The machine is quiet only near $\omega_0$; a drifting speed meets one of the new resonances.

> [!problem] A uniform cantilever's first frequency (d 4.5)
> Estimate the first natural frequency of a uniform cantilever (length $L$, stiffness $EI$, mass per length $\mu$) to within 2 % without solving the beam equation, and say on which side of the true value your estimate lies. The exact result is $\omega_1 = 3.516\sqrt{EI/(\mu L^4)}$.
^inv-mc-cantilever-freq

> [!solution]- Solution
> methods: mc-vibration/rayleigh
> 1. Use the static tip-load shape $w = x^2(3L - x)$; it meets $w(0) = w'(0) = 0$.
> 2. $w'' = 6(L - x)$, so $\int_0^L EI\,w''^2\,dx = 12EIL^3$.
> 3. $\int_0^L \mu w^2\,dx = \mu\int_0^L(9L^2x^4 - 6Lx^5 + x^6)\,dx = \tfrac{33}{35}\mu L^7$.
> 4. $R = 12 \cdot \tfrac{35}{33}\,EI/(\mu L^4) = \tfrac{140}{11}\,EI/(\mu L^4)$, so $\omega_1 \approx 3.568\sqrt{EI/(\mu L^4)}$.
> Answer: $3.568$, 1.5 % above the exact $3.516$; a Rayleigh estimate never falls below the true first frequency.

> [!problem] A seismic accelerometer (d 4)
> An accelerometer is a mass on a spring and damper inside a case; it reads the stretch $z$ of the spring as the case's acceleration $a$ times $1/\omega_n^2$. With $\zeta = 0.7$, up to what fraction of $f_n$ does the reading stay within 1 % of the true amplitude?
^inv-mc-accelerometer

> [!solution]- Solution
> methods: mc-vibration/frf
> 1. With $z = x - y$: $m\ddot z + c\dot z + kz = -m\ddot y$, so the case's acceleration drives $z$ like a force $-ma$.
> 2. Theorem 3: $|Z|\omega_n^2/|A| = 1/\sqrt{(1 - r^2)^2 + (2\zeta r)^2} = 1/\sqrt{1 - 0.04r^2 + r^4}$ for $\zeta = 0.7$.
> 3. Its largest value is $1.0002$ (at $r^2 = 0.02$), inside the band; the limit is the lower edge, $1/\sqrt{\cdot} = 0.99$.
> 4. $r^4 - 0.04r^2 - (1/0.99^2 - 1) = 0$ gives $r^2 = 0.1639$, $r = 0.405$.
> Answer: up to about $0.40 f_n$ (checked numerically). With $\zeta = 0.7$ the flat region is far wider than with light damping, which is why the value is chosen.
