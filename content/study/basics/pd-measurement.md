---
study: basic
id: pd-measurement
title: Measurement, sensors and uncertainty
area: pd
needs: []
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: nothing before it. It uses [first-order Taylor expansion](an-mvt-taylor.md#^taylor), the [fin solution](th-conduction.md#^fins), [Fourier's law](th-conduction.md#^fourier), the [lumped-capacitance model](th-transient.md#^lumped) and its [step and ramp responses](th-transient.md#^time-constant), each in one place, linked there. ^needs

A measurement is a number, a unit and an uncertainty; without the third it cannot be compared with anything. This doc has two halves. The first is the uncertainty arithmetic, following the GUM (the *Guide to the Expression of Uncertainty in Measurement*, JCGM 100:2008), with its vocabulary from the VIM (JCGM 200:2012). The second is the temperature chain an engineer actually builds: thermocouples, RTDs, the sensor's response time, and the sampling and noise of the acquisition system. ^intro

## Uncertainty

> [!def] Measurand, model, error and uncertainty
> The **measurand** is the quantity intended to be measured. The **measurement model** $Y = f(X_1, \dots, X_N)$ gives it from input quantities, each with an estimate $x_i$. The **error** of a result is its difference from the true value, which is never known. The **uncertainty** is a parameter characterising the spread of values that could reasonably be attributed to the measurand. A **standard uncertainty** $u(x_i)$ is that spread expressed as a standard deviation.
^uncertainty

> [!def] Type A and Type B evaluation
> A **Type A** evaluation obtains a standard uncertainty by statistical analysis of a series of observations. A **Type B** evaluation obtains it by any other means: a calibration certificate, a manufacturer's specification, the resolution of a display, a handbook value, experience, each converted to a standard deviation through an assumed distribution. Once both are standard uncertainties the GUM combines them in the same way; "A" and "B" name how they were evaluated, not whether the effect is random or systematic.
^type-ab

Known systematic effects are corrected, not added to the uncertainty: a thermocouple that reads 0.4 K high at the ice point is corrected by 0.4 K, and only the uncertainty of that correction remains. An effect that is neither corrected nor included is a mistake, not an uncertainty. ^correct-first

> [!thm] Theorem 1 (standard uncertainty of a mean)
> If $n$ readings are independent with standard deviation $\sigma$, their mean has standard deviation $\sigma/\sqrt n$. The Type A standard uncertainty of the mean is $s/\sqrt n$, with $s$ the sample standard deviation and $\nu = n - 1$ degrees of freedom.
^type-a

> [!proof]- Proof (d 1.5)
> 1. The variance of a sum of independent variables is the sum of their variances, so $\operatorname{Var}\left(\sum X_i\right) = n\sigma^2$.
> 2. Scaling by $1/n$ scales the variance by $1/n^2$: $\operatorname{Var}(\bar X) = \sigma^2/n$.
^p-type-a

> [!thm] Theorem 2 (rectangular and triangular bounds)
> If all that is known is that a quantity lies in $[\mu - a, \mu + a]$ with no value preferred, its standard uncertainty is $a/\sqrt 3$. If values near $\mu$ are more likely, falling linearly to zero at the bounds, it is $a/\sqrt 6$.
^type-b-rect

> [!proof]- Proof
> 1. Rectangular: $\int_{-a}^{a} x^2\,\frac{dx}{2a} = a^2/3$.
> 2. Triangular: $2\int_0^a x^2\,\frac{a - x}{a^2}\,dx = a^2/6$.
^p-type-b-rect

A digital reading with resolution $\Delta$ is a rectangular bound of half-width $\Delta/2$, so it contributes $\Delta/\sqrt{12}$; an ADC's quantization is the same with $\Delta$ the least significant bit. A specification "±1.5 °C" with no distribution stated is usually treated as rectangular. ^resolution

## Propagation

> [!thm] Theorem 3 (law of propagation of uncertainty)
> For $Y = f(X_1,\dots,X_N)$ with sensitivity coefficients $c_i = \partial f/\partial x_i$ at the estimates, the combined standard uncertainty is, to first order,
> $$u_c^2(y) = \sum_i c_i^2 u^2(x_i) + 2\sum_{i<j} c_i c_j\, u(x_i, x_j),$$
> where $u(x_i,x_j) = r_{ij}\,u(x_i)\,u(x_j)$ is the covariance and $r_{ij}$ the correlation coefficient.
^propagation

> [!proof]- Proof (d 3)
> 1. Write $X_i = x_i + \delta_i$ with $E[\delta_i] = 0$, $\operatorname{Var}\delta_i = u^2(x_i)$ and $\operatorname{Cov}(\delta_i,\delta_j) = u(x_i,x_j)$.
> 2. Expand to first order ([Taylor](an-mvt-taylor.md#^taylor)): $Y \approx f(x_1,\dots,x_N) + \sum_i c_i\delta_i$.
> 3. Covariance is bilinear, so $\operatorname{Var}\left(\sum_i c_i\delta_i\right) = \sum_i\sum_j c_ic_j\operatorname{Cov}(\delta_i,\delta_j)$.
> 4. Separate the terms with $i = j$ from the pairs $i \ne j$, each pair appearing twice.
^p-propagation

> [!thm] Corollary 4 (products of powers)
> If $Y = c\,X_1^{p_1}\cdots X_N^{p_N}$ with independent inputs, then $\left(u_c(y)/y\right)^2 = \sum_i p_i^2\left(u(x_i)/x_i\right)^2$: relative uncertainties add in quadrature, weighted by the exponents.
^relative-form

> [!proof]- Proof
> 1. $c_i = \partial y/\partial x_i = p_i\,y/x_i$.
> 2. Substitute in Theorem 3 with no covariances and divide by $y^2$.
^p-relative-form

The first-order law fails when $f$ curves appreciably over $\pm u$ of an input, or when a denominator can come near zero. The GUM's Supplement 1 (JCGM 101:2008) then propagates whole distributions by Monte Carlo: sample every input, evaluate $f$, read the spread of the outputs. ^monte-carlo

> [!def] Expanded uncertainty
> The **expanded uncertainty** $U = k\,u_c$ defines an interval $y \pm U$ expected to hold a stated fraction of the values (the coverage probability). For a normal distribution with many degrees of freedom, $k = 2$ gives about 95 %. With few degrees of freedom the GUM (Annex G) estimates effective degrees of freedom by the **Welch–Satterthwaite** formula
> $$\nu_\text{eff} = \frac{u_c^4}{\sum_i (c_i u_i)^4/\nu_i},$$
> truncated down to an integer, and takes $k$ from Student's $t$ at that $\nu_\text{eff}$. A Type B term with well-known bounds has $\nu_i = \infty$. The GUM tabulates $t$ for both 95 % and 95.45 % coverage; say which one a report uses.
^expanded

> [!example] A thermal resistance and its uncertainty
> A resistance is measured as $R = \Delta T/(VI)$ with $\Delta T = 30.0$ K from two thermocouples each with independent $u = 0.3$ K, $V = 48.0$ V with $u = 0.2$ V, and $I = 5.20$ A with $u = 0.03$ A. Find $R$, $u_c(R)$ and $U$ at $k = 2$, and the term that dominates.
^ex-resistance

> [!solution]- Solution
> methods: uncertainty-propagation
> 1. $P = 249.6$ W; $R = 0.1202$ K/W.
> 2. $u(\Delta T) = \sqrt 2\times0.3 = 0.42$ K, relative 1.41 %; $V$: 0.42 %; $I$: 0.58 %.
> 3. Corollary 4 with exponents $1, -1, -1$: relative $u_c = \sqrt{1.41^2 + 0.42^2 + 0.58^2} = 1.58\ \%$, so $u_c = 0.0019$ K/W and $U = 0.0038$ K/W.
> 4. The temperature difference dominates. Electrical power is the cheap term; to do better, make $\Delta T$ bigger or its two readings correlated (shared calibration), not the meters better.

## Calibration

> [!def] Calibration and traceability
> **Calibration** establishes, under stated conditions, the relation between an instrument's indications and values given by a reference, with the reference's uncertainties, and uses it to correct readings. **Traceability** is an unbroken chain of such calibrations back to the SI units. For temperature the chain runs through the International Temperature Scale of 1990 (ITS-90), which assigns fixed points (for example 273.16 K to the triple point of water) and interpolating instruments between them.
^calibration

Two points that any lab can make are the **ice point** and the **boiling point** of water. A well-made ice point (shaved ice of pure water, packed, topped up with water, the probe deep in it) realises 0 °C to millikelvins; a loose slush with water pooling at the bottom can sit well above it. The boiling point depends on pressure: on ITS-90 it is 99.974 °C at 101.325 kPa, and it moves by about 0.28 K per kPa near there ([saturation](th-two-phase.md#^saturation) and the slope that follows it there). A boiling-point calibration without a barometer reading carries several tenths of a kelvin of Type B uncertainty from the weather alone. ^fixed-points

A **two-point linear calibration** maps a reading $r$ to $T = T_1 + (r - r_1)(T_2 - T_1)/(r_2 - r_1)$. Between the points it is only as good as the sensor's linearity; outside them it is an extrapolation. A comparison calibration, against a reference thermometer in a stirred bath at many temperatures, adds a fit and its residuals. Calibrate the chain as used (sensor, extension wire, connector, cold-junction compensation and acquisition channel together) when the chain's errors are larger than the sensor's. ^two-point

## Thermocouples

> [!def] Seebeck coefficient
> In a conductor with a temperature gradient, the charge carriers diffuse unequally and an electromotive force develops along it: $dE = S(T)\,dT$. The material property $S$ is its **absolute Seebeck coefficient**. A conductor is **homogeneous** if $S$ depends on temperature alone, not on position along it.
^seebeck

A **thermocouple** is two dissimilar wires $A$ and $B$ joined at the **measuring junction** at $T_m$, with their free ends at the **reference junction** at $T_r$, where the voltmeter connects. ^tc-def

> [!thm] Theorem 5 (thermocouple emf)
> If both wires are homogeneous and both voltmeter terminals are at $T_r$, the open-circuit emf is
> $$E = \int_{T_r}^{T_m}\left(S_A - S_B\right)dT = E_{AB}(T_m) - E_{AB}(T_r),$$
> where $E_{AB}(T) = \int_{0\,\text{°C}}^{T} (S_A - S_B)\,dT'$ is the **reference function** tabulated for the thermocouple type.
^thermocouple

> [!proof]- Proof (d 2.5)
> 1. Walk the circuit from one voltmeter terminal along wire $A$ to the junction and back along wire $B$ to the other terminal, adding $S\,dT$ along the way.
> 2. Along $A$, $S_A$ depends only on $T$, so the contribution is $\int_{T_r}^{T_m} S_A\,dT$ whatever the temperature profile along the wire.
> 3. Along $B$ the walk runs from $T_m$ back to $T_r$: $\int_{T_m}^{T_r} S_B\,dT = -\int_{T_r}^{T_m} S_B\,dT$.
> 4. The meter's own leads run between two terminals at the same $T_r$, so they add $\int_{T_r}^{T_r} = 0$.
> 5. Add, and split the integral at 0 °C to get the reference-function form.
^p-thermocouple

Two corollaries follow at once. **Intermediate metals:** a third conductor inserted anywhere (a connector pin, solder, a copper terminal) adds nothing if its two ends are at the same temperature. **Intermediate temperatures:** $E(T_1\to T_3) = E(T_1\to T_2) + E(T_2\to T_3)$. And the proof shows where the emf comes from: the wire segments that lie in a temperature gradient, not the junction. A section of wire made inhomogeneous by cold work, oxidation or long exposure at high temperature therefore causes an error only while it sits in a gradient, and the error changes when the immersion depth changes; moving the probe during a check exposes it. ^tc-laws

> [!def] Cold-junction compensation
> A data acquisition system measures the emf at terminals at an unknown $T_r$. **Cold-junction compensation** (CJC) measures $T_r$ with a separate sensor (a thermistor, RTD or semiconductor sensor at the terminal block), computes $E_{AB}(T_r)$ from the reference function, adds it to the measured emf, and inverts the reference function: $T_m = E_{AB}^{-1}\left(E + E_{AB}(T_r)\right)$. An error in the CJC sensor enters the result almost one for one, and so does any temperature difference between the CJC sensor and the terminals.
^cjc

> [!trap] Adding the reference temperature instead of its emf
> A model thermocouple has $E(T) = 39.5\,T + 0.025\,T^2$ µV ($T$ in °C). With the junction at 200 °C and the terminals at 25 °C the meter reads $E(200) - E(25) = 7896.9$ µV. Correct: $E^{-1}(7896.9 + 1003.1) = 200.0$ °C. Inverting first and adding 25 °C gives $179.5 + 25 = 204.5$ °C, 4.5 K high. The reference function is not linear; compensate in volts.
^trap-cjc

Near room temperature the common base-metal types (K, T, J, E) give tens of µV/K; type K is about 40 µV/K, so a 1 µV error is 0.025 K. Tolerance classes come from IEC 60584-1 and, in North America, ASTM E230; for type K they are about ±1.5 °C (class 1) and ±2.5 °C (class 2) at moderate temperatures, growing in proportion to temperature above a few hundred degrees (check the table for the exact bands). A wire-only tolerance is a Type B bound. A calibrated thermocouple replaces it with the calibration uncertainty plus drift and the non-linearity between calibration points. ^tc-tolerance

Installation errors usually exceed the wire's. ^tc-installation

- **Stem conduction.** A probe inserted from a wall at $T_w$ into a fluid at $T_f$ is a [fin](th-conduction.md#^fins) rooted at the wall: with an insulated tip, the tip reads $T_f + (T_w - T_f)/\cosh(mL)$, $m = \sqrt{hP/(kA_c)}$, $L$ the immersion depth. The cure is depth, a thin sheath of low conductivity, and good flow over the tip. ^stem
- **Embedded in a conducting solid.** A bead at depth $d$ below a surface crossed by heat flux $q''$ reads $q''d/k$ off the surface temperature (one-dimensional [Fourier conduction](th-conduction.md#^fourier)); in copper at 30 W/cm², 2 mm of depth is 1.5 K. The bead also needs good contact in its bore (conductive paste or cement), and the leads should run along an isotherm for some distance before leaving, so they do not conduct heat away from the bead. ^embedded
- **Radiation.** A probe in a gas exchanges radiation with the walls; at steady state $h(T_g - T_s) = \varepsilon\sigma_{SB}(T_s^4 - T_w^4)$, and in a hot gas with cool walls the probe reads low. Shields and a small, low-emissivity probe reduce it. ^radiation
- **Electrical.** A grounded junction touching a powered part (a heater block, say) carries that part's potential onto the input; an input's common-mode range is finite, and ground loops add pickup. Ungrounded or insulated junctions, differential inputs and twisted leads prevent it. ^tc-electrical

## Resistance thermometers

> [!def] Platinum RTD
> A platinum resistance thermometer follows the Callendar–Van Dusen equation of IEC 60751: for $0 \le t \le 850$ °C, $R(t) = R_0(1 + At + Bt^2)$, and below 0 °C an extra term $R_0C(t - 100)t^3$, with $A = 3.9083\times10^{-3}$ °C⁻¹, $B = -5.775\times10^{-7}$ °C⁻², $C = -4.183\times10^{-12}$ °C⁻⁴. A Pt100 has $R_0 = 100\ \Omega$. Its mean coefficient $\alpha = (R_{100} - R_0)/(100R_0) = 0.00385$ °C⁻¹ names the curve.
^rtd

IEC 60751 tolerance classes are of the form $\pm(a + b|t|)$: class A $\pm(0.15 + 0.002|t|)$ °C and class B $\pm(0.3 + 0.005|t|)$ °C (check the current edition for the AA and C classes and validity ranges). A **thermistor** (an NTC ceramic, $R = R_0\exp[\beta(1/T - 1/T_0)]$ with $T$ absolute) changes by several percent per kelvin, far more than platinum, over a narrow range; it is the common CJC sensor. ^rtd-classes

The leads are in series with the element. A **2-wire** connection reads $R + 2R_L$. A **3-wire** bridge cancels the lead resistance if the leads match. A **4-wire** (Kelvin) connection carries the excitation on one pair and senses the voltage on the other, through which almost no current flows, so the leads drop out. The excitation current also heats the element: **self-heating** $\Delta T = I^2R/\delta$, with $\delta$ the dissipation constant in mW/K, which depends on the medium the sensor sits in. ^rtd-wiring

RTD against thermocouple: an RTD is more stable and calibrates to millikelvins, but it is larger and slower, needs excitation, and stops at a few hundred degrees in most packages; a thermocouple is small, fast, cheap, covers a wide range and needs no excitation, and gives microvolts. ^rtd-vs-tc

> [!example] A Pt100 read three ways
> A Pt100 reads 119.40 Ω. Find the temperature from the Callendar–Van Dusen equation and from the mean coefficient alone. Then find the error if it is read 2-wire through 10 m of 0.2 mm² copper per lead ($\rho = 1.72\times10^{-8}$ Ω·m), and its self-heating at 1 mA for dissipation constants of 2 mW/K (still air) and 20 mW/K (stirred water).
^ex-rtd

> [!solution]- Solution
> methods: pd-measurement/rtd
> 1. Solve $1 + At + Bt^2 = 1.1940$: $t = 50.01$ °C. With $\alpha$ alone: $0.1940/0.00385 = 50.39$ °C, 0.38 K off.
> 2. Each lead: $1.72\times10^{-8}\times10/(0.2\times10^{-6}) = 0.86\ \Omega$; two leads, $1.72\ \Omega$, read as $1.72/(100\times0.00385) = 4.5$ K too hot.
> 3. Self-heating: $I^2R = 10^{-6}\times119.4 \approx 0.12$ mW, so 0.06 K in still air and 0.006 K in stirred water.

## Response time

> [!def] First-order sensor
> A sensor whose temperature $T_s$ follows the medium's temperature $T_f$ as $\tau\,dT_s/dt + T_s = T_f$ is **first order** with **time constant** $\tau$. For a sensor small enough to be [lumped](th-transient.md#^lumped), $\tau = \rho c V/(hA)$; for a sphere of diameter $d$, $V/A = d/6$. Since $\tau$ contains $h$, it belongs to the sensor in a given medium and flow, never to the sensor alone.
^response

> [!thm] Theorem 6 (first-order responses)
> A first-order sensor reaches 63.2 % of a step at $t = \tau$ and, after the transient, follows a ramp $T_f = \beta t$ with a steady lag $\beta\tau$ (the [first-order response](th-transient.md#^time-constant) of th-transient). To $T_f = \cos\omega t$, after the transient, it responds with amplitude $1/\sqrt{1 + \omega^2\tau^2}$ and phase lag $\arctan\omega\tau$.
^first-order

> [!proof]- Proof of the sinusoidal case (d 2)
> 1. Every solution is a particular one plus a multiple of $e^{-t/\tau}$, which decays, so after the transient only a particular solution remains.
> 2. Try $T_s = \operatorname{Re}(Ge^{i\omega t})$; then $G(1 + i\omega\tau) = 1$, so $|G| = 1/\sqrt{1+\omega^2\tau^2}$ and $\arg G = -\arctan\omega\tau$.
^p-first-order

> [!example] A bead in air and in water
> A thermocouple bead is a 0.5 mm sphere with $\rho = 8500$ kg/m³, $c = 450$ J/kg·K and $k \approx 20$ W/m·K. Find its time constant in air with $h = 100$ W/m²·K and in stirred water with $h = 3000$ W/m²·K, check that lumping is fair, and find the lag error in air when an oven ramps at 2 K/min, and the amplitude and phase seen in air for a 60 s period oscillation.
^ex-bead

> [!solution]- Solution
> methods: pd-measurement/first-order, lumped-capacitance
> 1. $\tau = \rho c d/(6h)$: $8500\times450\times0.0005/600 = 3.19$ s in air; 0.106 s in water.
> 2. Biot number $h(d/6)/k$: in water $3000\times8.3\times10^{-5}/20 = 0.0125$, well below 0.1, so lumping holds (and better in air).
> 3. Ramp lag: $\beta\tau = (2/60)\times3.19 = 0.106$ K.
> 4. $\omega\tau = (2\pi/60)\times3.19 = 0.334$: amplitude 0.949 (5 % low), phase lag 18.5°, about 3.1 s.

## Sampling

The **sampling theorem** says a signal with no content at or above $f_s/2$ (the **Nyquist frequency**) is determined by samples at rate $f_s$. Content above it does not vanish when sampled; it folds down. ^sampling

> [!thm] Theorem 7 (aliasing)
> Sampled at rate $f_s$, a sinusoid at frequency $f$ produces the same samples as one at $|f - kf_s|$ for every integer $k$.
^alias

> [!proof]- Proof (d 1.5)
> 1. The samples are $\cos(2\pi f n/f_s + \varphi)$ for integers $n$.
> 2. Subtracting $2\pi kn$, a whole number of turns, changes nothing: $\cos(2\pi(f - kf_s)n/f_s + \varphi)$.
> 3. Cosine is even, so a negative $f - kf_s$ is the same as its absolute value with the phase negated.
^p-alias

So the cure must come before the sampler: an analog anti-alias filter, or an ADC that averages over its aperture. ^anti-alias

> [!thm] Theorem 8 (integrating converter)
> An ADC that returns the average of its input over an aperture $T_i$ passes a sinusoid at frequency $f$ with gain $\left|\sin(\pi fT_i)/(\pi fT_i)\right|$, which is zero at $f = n/T_i$ for every positive integer $n$.
^integrating-adc

> [!proof]- Proof (d 2)
> 1. Average $\cos(2\pi ft + \varphi)$ over $[0, T_i]$: $\dfrac{\sin(2\pi fT_i + \varphi) - \sin\varphi}{2\pi fT_i}$.
> 2. Difference of sines: the numerator is $2\cos(\pi fT_i + \varphi)\sin(\pi fT_i)$.
> 3. So the average is $\cos(\pi fT_i + \varphi)\cdot\sin(\pi fT_i)/(\pi fT_i)$: the same sinusoid, delayed by half the aperture, scaled by the stated gain.
^p-integrating-adc

An aperture of one mains period rejects that mains frequency and its harmonics; 100 ms is a whole number of periods of both 50 Hz and 60 Hz. Slow thermocouple scanners use such apertures, which is part of why they are slow. A multiplexed scanner also reads its channels one after another, so during a fast transient two channels are not read at the same instant; the skew is up to one scan period. ^aperture

## Noise

The **Johnson–Nyquist** noise of a resistance $R$ at absolute temperature $T$ over bandwidth $B$ is $v_\text{rms} = \sqrt{4k_BTRB}$. For 100 Ω at 300 K in 10 Hz it is 4.1 nV, 0.1 mK of a 40 µV/K thermocouple: the sensor's own noise is almost never the floor. The floor is the amplifier, quantization (a 16-bit converter spanning ±78.125 mV has a 2.38 µV step, 0.058 K of type K, contributing $0.058/\sqrt{12} = 0.017$ K), and pickup. ^noise

Averaging $N$ independent readings divides white noise by $\sqrt N$ (Theorem 1). It does nothing to drift, to low-frequency (1/f) noise, to a bias, or to pickup that aliases into a slow wave, because none of those are independent from reading to reading. Look at a record of the quiet signal before trusting $s/\sqrt N$. ^averaging

## Derive

> [!derive] Prove that the mean of $n$ independent readings with standard deviation $\sigma$ has standard deviation $\sigma/\sqrt n$.
^d-type-a

> [!derive] Derive the law of propagation of uncertainty for $Y = f(X_1,\dots,X_N)$, including the covariance terms, and its relative form for a product of powers.
^d-propagation

> [!derive] Prove that a circuit of two homogeneous wires gives an emf depending only on the two junction temperatures, and deduce the law of intermediate metals.
^d-tc-emf

> [!derive] Derive the amplitude ratio and phase lag of a first-order sensor following a sinusoidal medium temperature, after the transient.
^d-first-order

> [!derive] Derive the gain of an averaging ADC with aperture $T_i$ for a sinusoid of frequency $f$, and the frequencies it rejects.
^d-integrating

> [!derive] A sensor is calibrated at two points $T_1 < T_2$ with independent standard uncertainties $u_1, u_2$ of the reference values. Derive the standard uncertainty that this contributes to a temperature $T$ read from the line between them, and where it is smallest.
^d-two-point

> [!solution]- Solution
> methods: uncertainty-propagation
> 1. Write the interpolated value as $T = w_1T_1 + w_2T_2 + (\text{terms in the readings})$ with $w_1 = (T_2 - T)/(T_2 - T_1)$ and $w_2 = (T - T_1)/(T_2 - T_1)$, so $\partial T/\partial T_1 = w_1$ and $\partial T/\partial T_2 = w_2$.
> 2. Independent inputs: $u^2 = w_1^2u_1^2 + w_2^2u_2^2$.
> 3. With $w_1 + w_2 = 1$, minimise over $w_2$: smallest at $w_2 = u_1^2/(u_1^2 + u_2^2)$. For $u_1 = u_2 = u$ it is the midpoint, where $u/\sqrt 2$; at 0.1 K per point that is 0.071 K at the middle and 0.1 K at the ends.

## Problems

> [!problem] Water-side heat balance (d 3)
> Cooling water flows at 0.50 L/min, from a flowmeter specified to ±2 % of reading, and warms by 8.0 K, measured by two thermocouples each with independent standard uncertainty 0.25 K. Take $\rho c_p = 4.18$ MJ/m³·K as exact. The electrical input is 260 W with negligible uncertainty. Find the heat picked up, its expanded uncertainty at $k = 2$, and whether a balance of 107 % shows a problem. Which input would you improve first?
^inv-pd-water-balance

> [!solution]- Solution
> methods: uncertainty-propagation, energy-balance
> 1. $Q = (0.50/60000)\times4.18\times10^6\times8.0 = 278.7$ W.
> 2. Flow: ±2 % read as rectangular, $2/\sqrt3 = 1.15\ \%$. $\Delta T$: $\sqrt2\times0.25/8.0 = 4.42\ \%$.
> 3. Combined 4.57 %: $u_c = 12.7$ W, $U = 25$ W.
> 4. $Q - P = 18.7$ W, inside $U$: 107 % is consistent with a perfect balance. It is not evidence of a problem, and not evidence of a good balance either.
> 5. $\Delta T$ dominates. Calibrate the two thermocouples together against each other in one bath (so their errors correlate and cancel), or cut the flow so $\Delta T$ grows.

> [!problem] Boiling water on a low-pressure day (d 3.5)
> A thermocouple is calibrated in an ice bath, where it reads 0.4 °C, and in boiling water, where it reads 100.6 °C. The barometer reads 99.2 kPa. The operator takes the boiling point as 100 °C. Find the true boiling point, and the error in the corrected temperature of a later reading of 60.5 °C. Take the boiling point as 99.974 °C at 101.325 kPa and the saturation slope there as 0.276 K/kPa.
^inv-pd-boiling-point

> [!solution]- Solution
> methods: pd-measurement/calibration, th-two-phase/sat-slope
> 1. $T_b = 99.974 - 0.276\times2.125 = 99.39$ °C; the IAPWS saturation equation gives 99.38 °C at 99.2 kPa.
> 2. Operator's line: $(60.5 - 0.4)\times100/100.2 = 59.98$ °C.
> 3. True line: $(60.5 - 0.4)\times99.38/100.2 = 59.61$ °C.
> 4. The operator is 0.37 K high at 60 °C, a systematic error from the weather that no averaging would reveal.

> [!problem] Probe in a pipe (d 3.5)
> A 3 mm stainless steel probe ($k = 16$ W/m·K; treat it as a solid rod) enters a pipe through a wall at 40 °C; the water is at 60 °C with $h = 500$ W/m²·K over the probe. With 20 mm of immersion, how wrong is the tip? What immersion keeps the error below 0.05 K? Use an insulated tip and say whether that over- or under-states the error.
^inv-pd-immersion

> [!solution]- Solution
> methods: pd-measurement/stem, th-conduction/fins
> 1. $m = \sqrt{hP/(kA_c)} = \sqrt{4h/(kD)} = \sqrt{2000/0.048} = 204$ m⁻¹; $mL = 4.08$.
> 2. Error $= 20/\cosh(4.08) = 0.67$ K, reading low.
> 3. For 0.05 K: $\cosh(mL) \ge 400$, $mL \ge 6.68$, $L \ge 32.7$ mm.
> 4. Convection from the tip face lowers the error (0.58 K at 20 mm), so the insulated tip slightly overstates it: a safe estimate.

> [!problem] Slow scanner near mains wiring (d 3.5)
> A scanner samples a thermocouple at 0.7 Hz with a 0.1 ms aperture; the leads pick up 60 Hz. What does the pickup look like in the record? What gain does a 1/60 s aperture give at 60 Hz and at 50 Hz, and what aperture rejects both?
^inv-pd-mains-alias

> [!solution]- Solution
> methods: pd-measurement/alias, pd-measurement/integrating-adc
> 1. $60/0.7 = 85.7$; the nearest multiple is $86\times0.7 = 60.2$ Hz, so the pickup appears at 0.2 Hz: a 5 s wave, slow enough to pass for a thermal signal. A 0.1 ms aperture barely attenuates 60 Hz.
> 2. With $T_i = 1/60$ s: zero gain at 60 Hz; at 50 Hz, $|\sin(5\pi/6)/(5\pi/6)| = 0.19$.
> 3. Any whole multiple of both periods, 1/50 and 1/60 s: the shortest is 0.1 s.

> [!problem] Two thermocouples from one spool (d 4)
> Two thermocouples from one spool, calibrated together, each have standard uncertainty 0.5 K, of which most is a calibration offset they share; the correlation between their errors is 0.81. Find the standard uncertainty of their difference, compare it with the value assuming independence, and find the shared and independent parts of each one's uncertainty.
^inv-pd-differential-pair

> [!solution]- Solution
> methods: uncertainty-propagation
> 1. $\Delta T = T_1 - T_2$: $c_1 = 1$, $c_2 = -1$.
> 2. $u^2(\Delta T) = u^2 + u^2 - 2r u^2 = 2u^2(1 - r) = 2\times0.25\times0.19 = 0.095$ K², so $u = 0.31$ K.
> 3. Independent: $\sqrt2\times0.5 = 0.71$ K. The correlation more than halves it.
> 4. Shared part $\sqrt{r}\,u = 0.45$ K; independent part $\sqrt{0.25 - 0.2025} = 0.22$ K. The difference keeps only the independent parts: $\sqrt2\times0.22 = 0.31$ K, the same answer.

> [!problem] Four readings and a specification (d 4)
> Four readings of a bath temperature have sample standard deviation 0.30 K. The reference's certificate gives ±0.1 K with no distribution stated. Find the combined standard uncertainty, the effective degrees of freedom and the expanded uncertainty for 95 % coverage. How far off is $k = 2$?
^inv-pd-few-readings

> [!solution]- Solution
> methods: pd-measurement/type-a, pd-measurement/expanded
> 1. Type A: $0.30/\sqrt4 = 0.150$ K with $\nu = 3$. Type B rectangular: $0.1/\sqrt3 = 0.058$ K, $\nu = \infty$.
> 2. $u_c = \sqrt{0.150^2 + 0.058^2} = 0.161$ K.
> 3. $\nu_\text{eff} = 0.161^4/(0.150^4/3) = 3.95$, truncated to 3.
> 4. Student's $t$ for 95 % at 3 degrees of freedom is 3.18: $U = 0.51$ K.
> 5. $k = 2$ would give 0.32 K, an interval about 40 % too narrow. Take more readings: at large $n$ the type A term shrinks and $k$ falls towards 2.
