---
study: basic
id: mc-control
title: Feedback control
area: mc
needs: [mc-vibration]
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [the damped oscillator's frequency response](mc-vibration.md#^frf); eigenvalues and rank from [la-core](la-core.md#^eigen).
^needs

## Transfer functions and the loop

> [!def] Transfer function
> The Laplace transform $X(s) = \int_0^\infty x(t)e^{-st}\,dt$ turns $d/dt$ into multiplication by $s$ when the initial state is zero. A linear time-invariant system's **transfer function** is $G(s) = Y(s)/U(s)$. For rational $G$, the roots of the numerator are **zeros** and those of the denominator **poles**. The force-to-position transfer function of the damped oscillator is $G(s) = 1/(ms^2 + cs + k)$, and $G(i\omega)$ is its [frequency response](mc-vibration.md#^frf). A pure delay $\tau$ is $e^{-s\tau}$.
^transfer-fn

> [!thm] Theorem 1 (the feedback loop)
> Plant $G$, controller $C$, reference $r$, disturbance $d$ added at the plant input, sensor noise $n$ added to the measurement: $y = G(u + d)$, $u = C(r - y - n)$. With loop gain $L = CG$, sensitivity $S = 1/(1 + L)$ and complementary sensitivity $T = L/(1 + L)$,
> $$y = Tr - Tn + SGd, \qquad r - y = Sr + Tn - SGd, \qquad S + T = 1.$$
> At any one frequency the loop cannot both follow the reference ($T \approx 1$) and ignore noise ($T \approx 0$): tracking happens at low frequency, noise rejection at high.
^loop

> [!proof]- Proof
> 1. Substitute $u$: $y = GC(r - y - n) + Gd$.
> 2. Collect $y$: $(1 + L)y = Lr - Ln + Gd$; divide by $1 + L$.
> 3. $S + T = (1 + L)/(1 + L) = 1$, and $r - y = (1 - T)r + Tn - SGd$.
^p-loop

The **final value theorem**, taken here without proof: if every pole of $sY(s)$ has negative real part, $\lim_{t\to\infty}y(t) = \lim_{s\to0}sY(s)$.
^fvt

## PID

> [!def] PID control
> $u = K_p e + K_i\int e\,dt + K_d\,\dot e$, so $C(s) = K_p + K_i/s + K_d s$. In practice the derivative is low-pass filtered, $K_d s/(1 + s\tau_f)$, since a pure derivative amplifies sensor noise without limit; it acts on the measurement rather than the error, so a step in the setpoint does not kick the actuator. When the actuator saturates the integrator is frozen or clamped (**anti-windup**); otherwise it keeps integrating an error the actuator cannot act on and overshoots once it recovers.
^pid

> [!thm] Theorem 2 (integral action)
> If the closed loop is stable and $L$ has a pole at $s = 0$, a step reference is followed with zero steady error. A constant disturbance at the plant input is rejected with zero steady error when that integrator is in the controller; if only the plant integrates, a steady offset $1/C(0)$ per unit disturbance remains.
^integral-action

> [!proof]- Proof (d 2.5)
> 1. Unit step $r = 1/s$: the error is $S(s)/s$, and the final value theorem gives $e(\infty) = S(0) = 1/(1 + L(0))$.
> 2. A pole of $L$ at $0$ makes $|L(0)|$ infinite, so $S(0) = 0$.
> 3. Unit step disturbance: $y(\infty) = \lim_{s\to0}G/(1 + CG) = \lim_{s\to0}1/(1/G + C)$.
> 4. If $C$ has the pole at $0$, the denominator is infinite and $y(\infty) = 0$. If only $G$ has it, $1/G \to 0$ and $y(\infty) = 1/C(0)$.
^p-integral-action

## Stability

> [!thm] Theorem 3 (stability means left-half-plane poles)
> A system with proper rational transfer function $G$ is stable in the bounded-input, bounded-output sense exactly when every pole has negative real part. The closed-loop poles are the roots of $1 + L(s) = 0$, cleared of fractions. An unstable plant pole cancelled by a controller zero is still there: it shows in another signal of the loop, such as $u$.
^stability

> [!proof]- Proof (d 2)
> 1. By partial fractions the impulse response $g(t)$ is a sum of terms $ct^je^{pt}$ over the poles $p$ (with $j$ below the pole's multiplicity), plus an impulse if $G$ is not strictly proper.
> 2. If every $\mathrm{Re}\,p < 0$, each term is absolutely integrable, and $|y(t)| \le \sup|u| \int_0^\infty|g|\,dt$.
> 3. If some pole has $\mathrm{Re}\,p > 0$, a unit step excites its term $ce^{pt}$, which grows without bound.
> 4. If some pole has $\mathrm{Re}\,p = 0$, the bounded input $e^{pt}$ (a step, or a sinusoid at that frequency) puts a double pole at $p$ in $Y(s)$, and the output contains $te^{pt}$, unbounded.
^p-stability

> [!thm] Theorem 4 (third-order test)
> $s^3 + a_2s^2 + a_1s + a_0$ has all roots in $\mathrm{Re}\,s < 0$ exactly when $a_2, a_1, a_0 > 0$ and $a_2a_1 > a_0$. (Any degree is handled by the Routh–Hurwitz table, named here only.)
^cubic-test

> [!proof]- Proof (d 4.5)
> 1. The roots of a monic polynomial move continuously with its coefficients.
> 2. With all roots in the left half-plane the polynomial is a product of factors $s + \rho$ and $s^2 + 2\sigma s + \sigma^2 + \beta^2$ with $\rho, \sigma > 0$, so every coefficient is positive: positivity is necessary.
> 3. Inside the positive region a root can cross the imaginary axis only at $s = 0$, which needs $a_0 = 0$ (excluded), or at $s = \pm i\omega$ with $\omega > 0$.
> 4. At $s = i\omega$ the real part is $a_0 - a_2\omega^2 = 0$ and the imaginary part is $\omega(a_1 - \omega^2) = 0$, so $\omega^2 = a_1$ and $a_0 = a_1a_2$.
> 5. So on each of the sets $\{a_2a_1 > a_0\}$ and $\{a_2a_1 < a_0\}$ within the positive region, the number of right-half-plane roots never changes; each set is connected (shrink or grow $a_0$, then move $a_1, a_2$ along a straight line).
> 6. $(s + 1)^3$ has $a = (3, 3, 1)$, $9 > 1$, and all roots at $-1$: the first set is stable.
> 7. $s^3 + s^2 + s + 2$ has $1 < 2$; its roots sum to $-1$ and its real root is below $-1$, so the complex pair has positive real part: the second set is unstable.
^p-cubic-test

## Frequency response

> [!thm] Theorem 5 (sinusoid in, sinusoid out)
> If $G$ is stable, the input $\sin\omega t$ produces, once transients have died, the output $|G(i\omega)|\sin(\omega t + \angle G(i\omega))$.
^bode

> [!proof]- Proof
> 1. From a zero state, $y(t) = \int_0^t g(\tau)u(t - \tau)\,d\tau$.
> 2. With $u = e^{i\omega t}$: $y(t) = e^{i\omega t}\int_0^t g(\tau)e^{-i\omega\tau}\,d\tau$.
> 3. $g$ is absolutely integrable (Theorem 3), so the integral tends to $G(i\omega)$ as $t \to \infty$.
> 4. Take imaginary parts.
^p-bode

A **Bode plot** draws $20\log_{10}|G(i\omega)|$ in dB and $\angle G(i\omega)$ against $\log\omega$. Factors multiply, so their dB and their phases add. A pole at $-p$ is flat below $p$ and falls 20 dB per decade above it, its phase going from $0$ to $-90^\circ$ through $-45^\circ$ at $p$; a zero does the opposite; an integrator $1/s$ falls 20 dB per decade everywhere at $-90^\circ$; a delay keeps 0 dB and adds phase $-\omega\tau$ without limit. For a system with no right-half-plane zeros or delay, a magnitude slope of $-20n$ dB per decade held over a decade or more comes with a phase near $-90n^\circ$ (Bode's gain–phase relation, stated).
^bode-rules

> [!def] Crossover and margins
> The **crossover** $\omega_c$ is where $|L(i\omega_c)| = 1$. The **phase margin** is $\mathrm{PM} = 180^\circ + \angle L(i\omega_c)$. Where $\angle L = -180^\circ$, at $\omega_{180}$, the **gain margin** is $\mathrm{GM} = 1/|L(i\omega_{180})|$. Common targets: PM of 45° to 60°, GM of 6 dB or more. For loops that behave like a second-order system, PM in degrees is near $100\zeta$ up to $\zeta \approx 0.6$, and the closed-loop bandwidth is near $\omega_c$.
^margins

> [!thm] Nyquist criterion (stated)
> The number of closed-loop poles in the right half-plane equals the number of clockwise encirclements of $-1$ by $L(i\omega)$ as $\omega$ runs from $-\infty$ to $\infty$, plus the number of right-half-plane poles of $L$. For a stable $L$ whose magnitude falls through 1 once and whose phase falls through $-180^\circ$ only beyond crossover, the closed loop is stable exactly when PM $> 0$. The proof uses the argument principle and is not given here.
^nyquist

> [!thm] Theorem 6 (delay margin)
> A delay $\tau$ added anywhere in the loop leaves $|L(i\omega)|$ unchanged and subtracts $\omega\tau$ radians from its phase. A loop with one crossover therefore stays stable for $\tau < \mathrm{PM}/\omega_c$, PM in radians.
^delay-margin

> [!proof]- Proof
> 1. $|e^{-i\omega\tau}| = 1$ and $\angle e^{-i\omega\tau} = -\omega\tau$.
> 2. So $\omega_c$ does not move and the phase margin becomes $\mathrm{PM} - \omega_c\tau$.
> 3. By the Nyquist criterion's simple case, stability holds while that stays positive.
^p-delay-margin

## State space

> [!def] State-space model
> $\dot x = Ax + Bu$, $y = Cx + Du$, with state $x \in \mathbb R^n$. The transfer function is $G(s) = C(sI - A)^{-1}B + D$; since $(sI - A)^{-1}$ is the adjugate over $\det(sI - A)$, its poles are among the eigenvalues of $A$. The oscillator with $x = (\text{position}, \text{velocity})$ has $A = \begin{pmatrix}0 & 1\\ -k/m & -c/m\end{pmatrix}$, $B = (0, 1/m)^T$, $C = (1, 0)$.
^state-space

> [!def] Controllability and observability
> $(A, B)$ is **controllable** when $[B, AB, \dots, A^{n-1}B]$ has rank $n$: the input can steer the state anywhere. $(A, C)$ is **observable** when the stack of $C, CA, \dots, CA^{n-1}$ has rank $n$: the output history determines the state. $(A, C)$ is observable exactly when $(A^T, C^T)$ is controllable, since one matrix is the other's transpose.
^ctrb-obsv

> [!thm] Theorem 7 (pole placement)
> If a single-input $(A, B)$ is controllable, then for every monic polynomial $p$ of degree $n$ there is a unique gain row $K$ with $\det(sI - A + BK) = p(s)$. Proved here when $A$ is in companion form, the last row being $(-a_0, \dots, -a_{n-1})$ with ones on the superdiagonal, and $B = e_n$. A controllable pair can always be brought to that form by a change of state coordinates, which leaves eigenvalues alone; that step is stated without proof.
^pole-placement

> [!proof]- Proof (d 3)
> 1. Expanding $\det(sI - A)$ along the last row shows the companion matrix's characteristic polynomial is $s^n + a_{n-1}s^{n-1} + \dots + a_0$.
> 2. $BK$ is zero except its last row, $K$; so $A - BK$ is again a companion matrix, with last row $-(a_0 + k_0, \dots, a_{n-1} + k_{n-1})$.
> 3. Its characteristic polynomial is $s^n + \sum_i(a_i + k_i)s^i$.
> 4. Choosing $k_i = p_i - a_i$ matches every coefficient of $p$, and no other choice does.
^p-pole-placement

> [!thm] Theorem 8 (observer and separation)
> The **observer** $\dot{\hat x} = A\hat x + Bu + L(y - C\hat x)$ has estimation error $e = x - \hat x$ obeying $\dot e = (A - LC)e$, whatever $u$ is. If a single-output $(A, C)$ is observable, the eigenvalues of $A - LC$ can be placed anywhere. Feeding back the estimate, $u = -K\hat x$, the closed loop's eigenvalues are those of $A - BK$ together with those of $A - LC$: controller and observer can be designed separately.
^observer

> [!proof]- Proof (d 3)
> 1. Subtract the observer from the plant (with $D = 0$): $\dot e = Ax - A\hat x - LC(x - \hat x) = (A - LC)e$; the $Bu$ terms cancel.
> 2. $A - LC$ has the eigenvalues of its transpose $A^T - C^TL^T$, a pole-placement problem (Theorem 7) for $(A^T, C^T)$, which is controllable exactly when $(A, C)$ is observable.
> 3. With $u = -K\hat x = -K(x - e)$: $\dot x = (A - BK)x + BKe$.
> 4. In the coordinates $(x, e)$ the system matrix is $\begin{pmatrix}A - BK & BK\\ 0 & A - LC\end{pmatrix}$.
> 5. A block upper-triangular matrix's characteristic polynomial is the product of its diagonal blocks' ([determinants](la-core.md#^det-props)), so its eigenvalues are the union.
^p-observer

Observer poles are usually put two to five times faster than the controller's; faster still makes the estimate follow sensor noise. The Kalman filter is an observer whose $L$ is chosen from the process and sensor noise statistics (named here only).
^observer-practice

## Model predictive control

> [!def] Model predictive control
> At every sample, measure or estimate the state $x_0$ and solve
> $$\min_{u_0, \dots, u_{N-1}}\ \sum_{k=0}^{N-1}\left(x_k^TQx_k + u_k^TRu_k\right) + x_N^TPx_N \quad\text{s.t.}\quad x_{k+1} = Ax_k + Bu_k,\ \ u_{min} \le u_k \le u_{max},\ \text{state limits}.$$
> Apply only $u_0$; at the next sample measure again and solve again (a **receding horizon**). With a linear model, quadratic cost and linear constraints, each solve is a quadratic program (QP).
^mpc

> [!thm] Theorem 9 (unconstrained MPC is a fixed gain)
> With no constraints, $Q, P \succeq 0$ and $R \succ 0$, the MPC law is $u = -K_Nx$ for a constant matrix $K_N$ that can be computed offline.
^mpc-linear

> [!proof]- Proof (d 3)
> 1. Stack the predictions: $X = \Phi x_0 + \Gamma U$, with $X = (x_1, \dots, x_N)$, $U = (u_0, \dots, u_{N-1})$, $\Phi$ the column of blocks $A^k$, and $\Gamma$ block lower-triangular with blocks $A^{k-1-j}B$.
> 2. The cost is $X^T\bar QX + U^T\bar RU + x_0^TQx_0$ with block-diagonal $\bar Q$ (last block $P$) and $\bar R$.
> 3. Substitute: $J = U^THU + 2x_0^TF^TU + \text{const}$, with $H = \Gamma^T\bar Q\Gamma + \bar R$ and $F = \Gamma^T\bar Q\Phi$.
> 4. $\bar R \succ 0$ and $\Gamma^T\bar Q\Gamma \succeq 0$ give $H \succ 0$, so $J$ is strictly convex in $U$ with its unique minimum where the gradient vanishes: $U^* = -H^{-1}Fx_0$.
> 5. $u_0$ is the first block of $U^*$: $u_0 = -K_Nx_0$ with $K_N = [I\ 0 \cdots 0]\,H^{-1}F$, independent of $x_0$.
^p-mpc-linear

What MPC is, honestly:
- What it adds over a fixed gain is constraints. With them the QP's solution is a piecewise-affine function of $x_0$ (stated): a gain that saturates intelligently and looks ahead, not a different kind of controller.
- Stability is not automatic. A short horizon can destabilise a plant that the infinite-horizon optimal gain (LQR, from a Riccati equation, named only) stabilises. The standard cure is a terminal cost $P$ equal to the LQR cost-to-go plus a terminal set in which the LQR gain respects the constraints; that combination guarantees stability and that the next QP stays feasible (stated). With $P$ the LQR cost-to-go and no active constraints, MPC equals LQR.
- Constraints on states can make the QP infeasible after a disturbance; practical controllers soften them with penalised slack variables.
- It needs a model, and a model error shows as a steady offset unless a disturbance estimate is added to the observer, which plays the role of integral action.
- It costs one QP per sample. Small problems solve in microseconds to milliseconds on embedded hardware, so MPC is common in slow, constrained, multivariable loops (thermal, chemical process, trajectories, battery charging), while fast motion loops at kilohertz rates usually still run PID or state feedback, sometimes with MPC above them setting the references.
^mpc-honest

## Sampling

> [!thm] Theorem 10 (the sampled system)
> Hold $u$ constant over each sampling period $T$ (a **zero-order hold**). The state at the sampling instants obeys $x[k + 1] = \Phi x[k] + \Gamma u[k]$ with $\Phi = e^{AT}$ and $\Gamma = \int_0^T e^{A\sigma}\,d\sigma\,B$. The eigenvalues of $\Phi$ are $z = e^{\lambda T}$ for the eigenvalues $\lambda$ of $A$, so the left half-plane maps into the unit disc and the sampled system is stable exactly when every $|z| < 1$.
^discrete

> [!proof]- Proof (d 2.5)
> 1. Variation of constants: $x(t) = e^{A(t - t_0)}x(t_0) + \int_{t_0}^te^{A(t - \tau)}Bu(\tau)\,d\tau$.
> 2. On $[kT, (k + 1)T]$, $u = u[k]$ is constant; substitute $\sigma = (k + 1)T - \tau$ to get $x[k + 1] = e^{AT}x[k] + \int_0^Te^{A\sigma}\,d\sigma\,Bu[k]$.
> 3. If $A = V\Lambda V^{-1}$, then $e^{AT} = Ve^{\Lambda T}V^{-1}$, with eigenvalues $e^{\lambda T}$ (the same holds without diagonalising, stated).
> 4. $|e^{\lambda T}| = e^{T\,\mathrm{Re}\,\lambda} < 1$ exactly when $\mathrm{Re}\,\lambda < 0$, and $x[k] = \Phi^kx[0] \to 0$ for every start exactly when every $|z| < 1$.
^p-discrete

Three facts set a sampling rate. **Aliasing**: content above $f_s/2$ folds down into the band ([sampling](pd-measurement.md#^sampling)), so it must be filtered out before the converter. The **hold** delays the signal by about $T/2$ on average, a phase loss of $\omega T/2$, and computing the output takes up to one more period. Together these eat phase margin by Theorem 6, which is why loops are sampled 10 to 30 times faster than their crossover.
^sampling-rules

## Examples

> [!example] A first-order plant under PI control
> A heater has $G(s) = 2/(0.5s + 1)$ (gain 2 K per unit input, time constant 0.5 s). Choose a PI controller that cancels the plant pole and gives a closed-loop time constant of 0.05 s.
^ex-pi-first-order

> [!solution]- Solution
> methods: feedback, mc-control/loop
> 1. Write $C = K_p(1 + 1/(T_is))$ and take $T_i = 0.5$ s, so the controller zero cancels the plant pole.
> 2. Then $L = 2K_p/(0.5s)$ and $T = 1/(1 + 0.25s/K_p)$, first order with time constant $0.25/K_p$.
> 3. $0.25/K_p = 0.05$ gives $K_p = 5$ and $K_i = K_p/T_i = 10\ \text{s}^{-1}$.
> Answer: $K_p = 5$, $K_i = 10\ \text{s}^{-1}$; closed-loop poles at $-20$ (and a cancelled pair at $-2$, which still appears in the response to a load disturbance).

> [!example] A mass under PD control
> A 2 kg mass with a force actuator and a position sensor. Choose PD gains for closed-loop $\omega_n = 2\pi \cdot 10$ rad/s and $\zeta = 0.7$, and find the loop's crossover and phase margin.
^ex-pd-mass

> [!solution]- Solution
> methods: feedback, mc-control/margins
> 1. $L = (K_ds + K_p)/(ms^2)$; the closed loop's characteristic polynomial is $ms^2 + K_ds + K_p$.
> 2. Match $s^2 + 2\zeta\omega_ns + \omega_n^2$: $K_p = m\omega_n^2 = 7.90$ kN/m and $K_d = 2\zeta\omega_nm = 176$ N s/m.
> 3. Crossover: $K_p^2 + K_d^2\omega^2 = m^2\omega^4$, so $\omega_c^2 = (K_d^2 + \sqrt{K_d^4 + 4m^2K_p^2})/(2m^2)$, $\omega_c = 96.9$ rad/s (15.4 Hz).
> 4. $\angle L = \arctan(K_d\omega_c/K_p) - 180^\circ$, so $\mathrm{PM} = \arctan(176 \cdot 96.9/7896) = 65.2^\circ$.
> Answer: $K_p \approx 7.9$ kN/m, $K_d \approx 176$ N s/m, crossover 15 Hz, PM 65°.

> [!example] Phase lost to sampling
> A motion loop is sampled at 1 kHz and computes its output one full period after each sample. How much phase does that cost at a 100 Hz crossover?
^ex-sampling-phase

> [!solution]- Solution
> methods: mc-control/delay-margin, mc-control/sampling-rules
> 1. Effective delay: $T/2$ from the hold plus $T$ from computation, 1.5 ms.
> 2. Phase: $\omega\tau = 2\pi \cdot 100 \cdot 1.5 \times 10^{-3} = 0.942$ rad $= 54^\circ$.
> Answer: about 54°, most of a typical phase margin; sample faster, or lower the crossover.

> [!example] A cart with only a position sensor
> A 1 kg cart, $\ddot x = u$, measures position only. Place the state-feedback poles at $-10 \pm 10i$ and the observer poles both at $-50$. Find $K$, $L$ and the closed-loop eigenvalues.
^ex-cart-observer

> [!solution]- Solution
> methods: mc-control/pole-placement, mc-control/observer
> 1. $A = \begin{pmatrix}0 & 1\\ 0 & 0\end{pmatrix}$, $B = (0, 1)^T$, $C = (1, 0)$.
> 2. $\det(sI - A + BK) = s^2 + k_2s + k_1$; target $(s + 10)^2 + 100 = s^2 + 20s + 200$, so $K = (200, 20)$.
> 3. $A - LC = \begin{pmatrix}-l_1 & 1\\ -l_2 & 0\end{pmatrix}$, characteristic polynomial $s^2 + l_1s + l_2$; target $(s + 50)^2$, so $L = (100, 2500)^T$.
> 4. By Theorem 8 the closed loop has eigenvalues $-10 \pm 10i$, $-50$, $-50$ (checked numerically on the full 4-state matrix).
> Answer: $K = (200, 20)$, $L = (100, 2500)^T$.

## Derive

> [!derive] Show that proportional control of a stable plant with finite $G(0) = g$ leaves a steady error $1/(1 + K_pg)$ after a unit step in the reference.
^d-p-offset

> [!derive] For $L(s) = \omega_n^2/(s(s + 2\zeta\omega_n))$, show that the phase margin is $\arctan\!\left(2\zeta\big/\sqrt{\sqrt{1 + 4\zeta^4} - 2\zeta^2}\right)$, and compare it with $100\zeta$ degrees at $\zeta = 0.3, 0.5, 0.7$.
^d-pm-zeta

> [!derive] Derive $\Phi$ and $\Gamma$ for the double integrator $\ddot x = u$ under a zero-order hold with period $T$.
^d-zoh-double

> [!derive] Show that $C(sI - A)^{-1}B$ is unchanged by a change of state coordinates $x = Pz$ with $P$ invertible.
^d-similarity

> [!derive] Show that a stable loop follows a ramp reference with zero steady error only if $L$ has at least two poles at $s = 0$, and find the steady error when it has exactly one.
^d-ramp

## Problems

> [!problem] A loop with an integrator and a delay (d 3.5)
> A loop has $L(s) = Ke^{-s\tau}/s$ with $\tau = 2$ ms. Find $K$ for a 60° phase margin, the crossover in Hz, and the gain margin.
^inv-mc-integrator-delay

> [!solution]- Solution
> methods: mc-control/margins
> 1. $|L(i\omega)| = K/\omega$, so $\omega_c = K$; $\angle L = -90^\circ - \omega\tau$.
> 2. $\mathrm{PM} = 90^\circ - \omega_c\tau = 60^\circ$ gives $\omega_c\tau = \pi/6$, $\omega_c = \pi/(6\tau) = 262$ rad/s $= 41.7$ Hz, and $K = 262\ \text{s}^{-1}$.
> 3. Phase reaches $-180^\circ$ at $\omega_{180}\tau = \pi/2$, so $\omega_{180} = 3\omega_c$ and $|L| = 1/3$ there.
> Answer: $K \approx 262\ \text{s}^{-1}$, crossover 41.7 Hz, gain margin 3 (9.5 dB).

> [!problem] A motor under PI control (d 3.5)
> A motor's input-to-position plant is $G(s) = 1/(s(0.1s + 1))$. With $C(s) = K_p + K_i/s$ and $K_p = 20$, find the range of $K_i$ for which the loop is stable.
^inv-mc-motor-pi

> [!solution]- Solution
> methods: mc-control/cubic-test
> 1. $1 + L = 0$ cleared of fractions: $0.1s^3 + s^2 + K_ps + K_i = 0$, or $s^3 + 10s^2 + 10K_ps + 10K_i = 0$.
> 2. Theorem 4: all coefficients positive and $10 \cdot 10K_p > 10K_i$, so $0 < K_i < 10K_p$.
> 3. With $K_p = 20$: $0 < K_i < 200$ (numerically, the largest root real part is $-0.017$ at $K_i = 199$ and $+0.017$ at $201$).
> Answer: $0 < K_i < 200$. In general $K_i < K_p/\tau$: the integral corner must stay below the motor's own pole.

> [!problem] An unstable plant with a bounded input (d 4.5)
> The plant is $x_{k+1} = 1.2x_k + u_k$ with $|u_k| \le 1$. At each step the controller picks $u_0$ to minimise $x_1^2 + u_0^2$ subject to $|u_0| \le 1$ and applies it. (a) Find the law when the bound is inactive. (b) From which $x_0$ does the closed loop converge to $0$? (c) Could any controller that respects $|u| \le 1$ do better?
^inv-mc-bounded-unstable

> [!solution]- Solution
> methods: mc-control/mpc-linear, mc-control/mpc-honest
> 1. $J = (1.2x + u)^2 + u^2$; $dJ/du = 2(1.2x + u) + 2u = 0$ gives $u = -0.6x$ and $x_1 = 0.6x$.
> 2. $J$ is convex in one variable, so the bounded minimiser is the clipped one: $u = \mathrm{sat}(-0.6x)$, linear for $|x| \le 5/3$.
> 3. For $|x| > 5/3$, $u = -\mathrm{sign}(x)$ and $|x_1| = 1.2|x| - 1$, smaller than $|x|$ exactly when $|x| < 5$.
> 4. So from $|x_0| < 5$ the magnitude shrinks until the linear region takes over and $x \to 0$; at $|x_0| = 5$ it stays at 5, beyond it grows (checked by simulation).
> 5. For $x \ge 5$ any $u \ge -1$ gives $x_1 \ge 1.2x - 1 \ge x$, and symmetrically for $x \le -5$.
> Answer: (a) $u = -0.6x$; (b) $|x_0| < 5$; (c) no: $|x| < 5 = u_{max}/(1.2 - 1)$ is the largest region any bounded controller can recover from. A longer horizon changes how it gets there, not where it can start.

> [!problem] A static plant under a sampled integral controller (d 2.5)
> A plant's output responds within one sample to its input, $y[k] = gu[k]$. The controller is $u[k + 1] = u[k] + K_i(r - y[k])$. For which $K_i$ does $y$ converge to $r$, and which $K_i$ gets there fastest?
^inv-mc-sampled-integral

> [!solution]- Solution
> methods: mc-control/discrete
> 1. Substitute: $u[k + 1] = (1 - K_ig)u[k] + K_ir$.
> 2. This converges exactly when $|1 - K_ig| < 1$, that is $0 < K_ig < 2$, and the fixed point is $u = r/g$, $y = r$.
> 3. $K_ig = 1$ makes the pole $0$: the error vanishes after one step.
> Answer: $0 < K_i < 2/g$; $K_i = 1/g$ is fastest. If $g$ may be up to twice its nominal value, the nominal deadbeat gain sits on the edge of instability, so a gain below $1/g_{nom}$ is the safe choice.
