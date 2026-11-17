---
study: basic
id: gen-estimation
title: Estimation and orders of magnitude
area: gen
needs: []
build: 1
tracks: [putnam, interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: arithmetic, the logarithm, the [mean value theorem](an-mvt-taylor.md#^mvt) for one proof and [linearity of expectation](pr-expectation.md#^lin-exp) for another. Dimensions and limiting cases, the other half of checking an answer, are in [gen-dimensions](gen-dimensions.md#^homogeneity).
^needs

An estimate is a number with a stated error, reached by a route someone else can check. This basic gives the four tools that make one: logarithms to measure error, decomposition into factors, brackets, and unit chains; then the checks that catch a wrong one.

## Logarithms and error as a factor

> [!def] Order of magnitude, agreement within a factor
> For $x > 0$ the **order of magnitude** of $x$ is the integer nearest to $\log_{10} x$. Two positive numbers $a$ and $b$ **agree within a factor** $f \ge 1$ when $1/f \le a/b \le f$, that is, when $|\log_{10} a - \log_{10} b| \le \log_{10} f$.
^def-order

Error in an estimate is a ratio, not a difference: being off by a factor of 2 is the same mistake at $10^{-6}$ and at $10^{6}$. On a log scale a ratio becomes a distance, which is why every rule below works with logarithms. The few values worth carrying: $\log_{10} 2 \approx 0.301$, $\log_{10} 3 \approx 0.477$, $\log_{10} e \approx 0.434$, $\ln 10 \approx 2.303$, $\ln 2 \approx 0.693$, and $2^{10} = 1024 \approx 10^3$.
^logs

> [!thm] Theorem 1 (logarithm bounds)
> For every real $x > -1$, $\dfrac{x}{1+x} \le \ln(1+x) \le x$, with equality only at $x = 0$.
^log-bounds

> [!proof]- Proof (d 2.5)
> 1. At $x = 0$ all three expressions are $0$. Fix $x \ne 0$.
> 2. By the [mean value theorem](an-mvt-taylor.md#^mvt) applied to $\ln(1+t)$ on the interval between $0$ and $x$, $\ln(1+x) = x/(1+\xi)$ for some $\xi$ strictly between $0$ and $x$.
> 3. If $x > 0$ then $0 < \xi < x$, so $1/(1+x) < 1/(1+\xi) < 1$; multiplying by $x > 0$ gives both strict inequalities.
> 4. If $-1 < x < 0$ then $x < \xi < 0$, so $1 < 1/(1+\xi) < 1/(1+x)$; multiplying by $x < 0$ reverses both, which is again the claim.
^p-log-bounds

> [!thm] Corollary 2 (doubling time)
> A quantity multiplied by $1 + r$ each period, with $r > 0$, doubles after $T = \ln 2 / \ln(1+r)$ periods, and $\dfrac{\ln 2}{r} \le T \le \dfrac{\ln 2\,(1+r)}{r}$.
^doubling

This is Theorem 1 with $x = r$, inverted. It is the reason "divide 70 (or 72) by the percentage rate" works: the lower bound is $69.3/(100r)$, and the true $T$ sits slightly above it.

## Decomposition

> [!def] Fermi estimate
> A **Fermi estimate** writes an unknown quantity as a product (or a short sum of products) of factors, each of which can be bracketed from experience or a reference number, takes a central value for each factor, and multiplies. The decomposition is the work; it should have factors that are each easier to bound than the whole.
^fermi

When a factor is known only to lie in a bracket, the bracket's centre on a log scale is the right single value.

> [!thm] Theorem 3 (centre of a bracket)
> Let $0 < L \le U$, and suppose all that is known about $x$ is $L \le x \le U$. Among estimates $e > 0$, the one that minimises the worst-case ratio error $\max_{L \le x \le U} \max(x/e,\ e/x)$ is $e = \sqrt{LU}$, and its worst-case error is the factor $\sqrt{U/L}$.
^centre

> [!proof]- Proof (d 2.5)
> 1. For fixed $e$, $x/e$ is largest at $x = U$ and $e/x$ is largest at $x = L$, so the worst case is $g(e) = \max(U/e,\ e/L)$.
> 2. $U/e$ is strictly decreasing in $e$ and $e/L$ is strictly increasing.
> 3. Left of the crossing point the decreasing one is the max and falls; right of it the increasing one is the max and rises; so $g$ is least where $U/e = e/L$.
> 4. That is $e^2 = LU$, so $e = \sqrt{LU}$, and the common value is $U/\sqrt{LU} = \sqrt{U/L}$.
^p-centre

> [!thm] Theorem 4 (error of a product)
> Let $x = x_1 x_2 \cdots x_n$ with all $x_i > 0$, estimated by $\hat x = \hat x_1 \cdots \hat x_n$. Write $\varepsilon_i = \log \hat x_i - \log x_i$ for the log error of factor $i$.
> (a) If each $\hat x_i$ agrees with $x_i$ within a factor $f_i$, then $\hat x$ agrees with $x$ within the factor $f_1 f_2 \cdots f_n$.
> (b) If the $\varepsilon_i$ are independent random variables with mean $0$ and standard deviations $s_i$, then $\log \hat x - \log x$ has mean $0$ and standard deviation $\sqrt{s_1^2 + \dots + s_n^2}$.
^fermi-error

> [!proof]- Proof (d 3)
> 1. The log of a product is the sum of the logs, so $\log \hat x - \log x = \varepsilon_1 + \dots + \varepsilon_n$.
> 2. For (a), $|\varepsilon_1 + \dots + \varepsilon_n| \le |\varepsilon_1| + \dots + |\varepsilon_n| \le \log f_1 + \dots + \log f_n = \log(f_1 \cdots f_n)$.
> 3. For (b), the mean of the sum is the sum of the means ([linearity](pr-expectation.md#^lin-exp)), which is $0$.
> 4. Variances of independent terms add (proved in [pr-expectation](pr-expectation.md), variance), so the variance of the sum is $\sum_i s_i^2$; take the square root.
^p-fermi-error

Part (b) is why Fermi estimates work at all. With $n$ factors each off by a typical factor $f$, the worst case is $f^n$ but the typical error is about $f^{\sqrt n}$, because independent errors partly cancel. It fails when the errors share a cause (every factor guessed high by the same optimist), which is a reason to bracket each factor from a different reference.
^fermi-why

## Bounding

> [!thm] Proposition 5 (monotone bracketing)
> Let $f(x_1, \dots, x_n)$ be non-decreasing in each argument, and $l_i \le x_i \le u_i$ for each $i$. Then $f(l_1, \dots, l_n) \le f(x_1, \dots, x_n) \le f(u_1, \dots, u_n)$. For an argument in which $f$ is non-increasing, exchange that argument's $l_i$ and $u_i$.
^bounding

> [!proof]- Proof
> 1. Change one argument at a time from $x_i$ to $u_i$; each change cannot decrease $f$, by monotonicity in that argument with the others fixed.
> 2. After $n$ changes the value is $f(u_1, \dots, u_n)$; the lower bound is the same walk down to the $l_i$.
^p-bounding

In use: compute the estimate twice, once with every factor at the end that makes the answer small and once at the end that makes it large. If the two are within a factor of about 3, report the [centre](#^centre) and stop. If not, the factor with the widest bracket is the one worth looking up. A bracket is also the honest answer to "is it possible?": an upper bound below the requirement settles a design question without the central estimate.
^bounding-use

## Unit chains

> [!def] Unit chain
> A **unit chain** converts a quantity by multiplying it by fractions each equal to $1$, such as $\dfrac{3600\ \mathrm{s}}{1\ \mathrm{h}}$, arranged so that every unwanted unit cancels between a numerator and a denominator. Every number in the chain carries its unit; a factor that is not equal to $1$ is an error.
^unit-chains

| exact conversion | value |
|---|---|
| 1 inch | 25.4 mm |
| 1 kWh | $3.6 \times 10^6$ J |
| 1 standard atmosphere | 101 325 Pa |
| 1 litre | $10^{-3}$ m$^3$ |
| 1 eV | $1.602\,176\,634 \times 10^{-19}$ J |
| temperature | K = °C + 273.15; a temperature difference of 1 K equals 1 °C |
^conversions

## Sanity checks

> [!def] Sanity check
> A **sanity check** is a test an answer must pass that does not repeat the calculation: its dimensions ([homogeneity](gen-dimensions.md#^homogeneity)); its behaviour when a parameter goes to $0$ or $\infty$ ([limiting cases](gen-dimensions.md#^limiting-cases)); its sign and the direction it moves when an input grows; conservation (no output energy above the input); and comparison with a reference number of the same kind.
^sanity

Reference numbers, at about 20 °C and 1 atm unless stated. Ranges are ranges because the material or condition varies, not because the value is unknown.

| quantity | value |
|---|---|
| gravitational acceleration $g$ | 9.81 m/s$^2$ |
| density: water, air | 1000 kg/m$^3$; 1.2 kg/m$^3$ |
| density: aluminium, steel | 2700 kg/m$^3$; 7850 kg/m$^3$ |
| specific heat: water, air | 4.18 kJ/(kg K); 1.005 kJ/(kg K) |
| latent heat of vaporisation of water, at 100 °C | 2.26 MJ/kg |
| thermal conductivity, W/(m K) | copper ≈ 400; aluminium alloys 120 to 240; silicon ≈ 150; steels 15 to 50; glass ≈ 1; water 0.6; air 0.026 |
| kinematic viscosity: air, water | $1.5 \times 10^{-5}$ m$^2$/s; $1.0 \times 10^{-6}$ m$^2$/s |
| convection coefficient, W/(m$^2$ K) | free convection in gas 2 to 25; forced gas 25 to 250; forced liquid 100 to 20 000 |
| Young's modulus: steel, aluminium | 200 GPa; 70 GPa |
| Stefan–Boltzmann constant $\sigma$ | $5.670 \times 10^{-8}$ W/(m$^2$ K$^4$) |
| Boltzmann constant $k_B$; Avogadro $N_A$ | $1.380\,649 \times 10^{-23}$ J/K; $6.022\,140\,76 \times 10^{23}$ mol$^{-1}$ |
| solar irradiance above the atmosphere | ≈ 1361 W/m$^2$ |
^reference-numbers

## Examples

> [!example] Square dies on a round wafer
> Estimate how many whole $10\ \mathrm{mm} \times 10\ \mathrm{mm}$ dies fit on a wafer of diameter 300 mm, with a bracket.
^ex-dies

> [!solution]- Solution
> methods: estimation, bounding
> 1. Area alone: $\pi (150\ \mathrm{mm})^2 / (100\ \mathrm{mm^2}) \approx 707$, an upper bound that ignores the dies cut by the edge.
> 2. A die is whole when its four corners are inside the circle. If its centre is within $R - s/\sqrt2$ of the wafer's centre (with $s = 10$ mm, $s/\sqrt2$ the half-diagonal) it is surely whole; if its centre is beyond $R - s/2$ it is surely cut.
> 3. Counting one die per $s^2$ of area available to centres: lower $\pi(150 - 7.07)^2/100 \approx 642$, upper $\pi (145)^2/100 \approx 661$.
> 4. Answer: about 650, within 2 % either way. A direct count on a grid placed at its best offset gives 657, inside the bracket.

> [!example] Boiling a litre
> Estimate the energy to take 1 L of water from 20 °C to fully boiled away at 1 atm, in kWh, and the time a 1.5 kW heater needs if all of its power goes into the water.
^ex-kettle

> [!solution]- Solution
> methods: energy-balance, gen-estimation/unit-chains
> 1. Sensible heat: $1\ \mathrm{kg} \times 4.18\ \mathrm{kJ/(kg\,K)} \times 80\ \mathrm{K} \approx 0.33$ MJ.
> 2. Latent heat: $1\ \mathrm{kg} \times 2.26\ \mathrm{MJ/kg} = 2.26$ MJ, seven times the sensible part.
> 3. Total $\approx 2.59$ MJ $\times \dfrac{1\ \mathrm{kWh}}{3.6\ \mathrm{MJ}} \approx 0.72$ kWh.
> 4. Time: $2.59 \times 10^6\ \mathrm{J} / 1500\ \mathrm{W} \approx 1730$ s, about 29 min. A sanity check: the boiling, not the warming, is most of it.

> [!example] Four guessed factors
> An estimate is a product of four factors. Each is believed good to within a factor of 3 at worst, and its log error is modelled as independent with standard deviation equal to half of $\log_{10} 3$. State the worst-case error factor of the product and the one-standard-deviation error factor.
^ex-four-factors

> [!solution]- Solution
> methods: gen-estimation/fermi-error
> 1. Worst case, by Theorem 4(a): $3^4 = 81$.
> 2. Per-factor standard deviation in $\log_{10}$: $0.477/2 \approx 0.239$. By Theorem 4(b) the product's is $0.239\sqrt4 \approx 0.477$.
> 3. One standard deviation is therefore a factor $10^{0.477} = 3$: the product of four factor-of-3 guesses is typically good to a factor of 3, not 81.

## Derive

> [!derive] Prove that $e^x \ge 1 + x$ for every real $x$, with equality only at $x = 0$.
^d-exp-tangent

> [!derive] Prove that for $r > 0$ and every integer $n \ge 1$, $1 \le \dfrac{e^{nr}}{(1+r)^n} \le e^{nr^2/(1+r)}$.
^d-compound-ratio

> [!derive] Prove that $\dfrac{\ln 2}{\ln(1+r)} - \dfrac{\ln 2}{r} \to \dfrac{\ln 2}{2}$ as $r \to 0^+$.
^d-doubling-limit

> [!derive] Suppose $n$ factors have independent log errors, each with standard deviation $s = \tfrac12 \log f$, while each factor's worst case is the factor $f > 1$. Prove that the product's one-standard-deviation error factor exceeds $f$ exactly when $n > 4$.
^d-many-factors

> [!derive] Let $f(x, y)$ be non-decreasing in $x$ and non-increasing in $y$, with $l_x \le x \le u_x$ and $l_y \le y \le u_y$. Prove that $f(l_x, u_y) \le f(x, y) \le f(u_x, l_y)$.
^d-mixed-bracket

## Problems

> [!problem] Coolant for a cold plate (d 2)
> A cold plate removes 700 W from a chip into water ($c_p = 4186$ J/(kg K), density 1000 kg/m$^3$). The water may warm by at most 10 K between inlet and outlet. Find the least volume flow in litres per minute.
^inv-gen-coolant-flow

> [!solution]- Solution
> methods: energy-balance, gen-estimation/unit-chains
> 1. Steady state: $P = \dot m\, c_p\, \Delta T$, so $\dot m = 700 / (4186 \times 10) \approx 0.0167$ kg/s.
> 2. $0.0167\ \mathrm{kg/s} \times \dfrac{1\ \mathrm{L}}{1\ \mathrm{kg}} \times \dfrac{60\ \mathrm{s}}{1\ \mathrm{min}} \approx 1.0$ L/min.
> Answer: about 1.0 L/min.

> [!problem] Grains in a powder bed (d 2.5)
> A build chamber $200\ \mathrm{mm} \times 200\ \mathrm{mm} \times 300\ \mathrm{mm}$ is filled with spherical grains of diameter 50 µm that occupy half of the volume. Find the number of grains to the nearest power of ten.
^inv-gen-powder-grains

> [!solution]- Solution
> methods: estimation, gen-estimation/unit-chains
> 1. Chamber volume $0.2 \times 0.2 \times 0.3 = 0.012$ m$^3$; solid volume $0.006$ m$^3$.
> 2. One grain: $\tfrac{\pi}{6} (50 \times 10^{-6})^3 \approx 6.5 \times 10^{-14}$ m$^3$.
> 3. Ratio $\approx 9.2 \times 10^{10}$.
> Answer: about $10^{11}$ grains.

> [!problem] Time to extrude a solid part (d 3)
> A solid part of 50 cm$^3$ is printed with layer height 0.2 mm, line width 0.45 mm and print speed 60 mm/s. (a) Find the time if the nozzle extrudes continuously. (b) Travel moves and acceleration are believed to add between 20 % and 60 % to that time. Give the single estimate with the least worst-case ratio error, and that error.
^inv-gen-print-time

> [!solution]- Solution
> methods: estimation, gen-estimation/centre
> 1. Volume rate $0.2 \times 0.45 \times 60 = 5.4$ mm$^3$/s.
> 2. $50\,000\ \mathrm{mm^3} / 5.4\ \mathrm{mm^3/s} \approx 9260$ s $\approx 2.57$ h.
> 3. Bracket: $1.2 \times 2.57 \approx 3.09$ h to $1.6 \times 2.57 \approx 4.12$ h.
> 4. Best single value is the geometric centre, $2.57\sqrt{1.2 \times 1.6} \approx 3.56$ h, with worst-case factor $\sqrt{1.6/1.2} \approx 1.15$.
> Answer: (a) about 2.6 h; (b) about 3.6 h, good to within 15 %.

> [!problem] A cost that grows 7 % a year (d 3)
> A cost grows by 7 % per year. Without evaluating $\ln 1.07$, give an interval of length under one year that must contain the doubling time, then compare with the exact value.
^inv-gen-doubling

> [!solution]- Solution
> methods: gen-estimation/doubling
> 1. Lower bound $\ln 2 / 0.07 \approx 9.90$ years.
> 2. Upper bound $9.90 \times 1.07 \approx 10.60$ years; the interval has length 0.69.
> 3. Exact: $\ln 2 / \ln 1.07 \approx 10.24$ years, inside.
> Answer: between 9.9 and 10.6 years; exactly about 10.24.

> [!problem] A five-factor estimate (d 3.5)
> An estimate multiplies five factors. Each factor is correct within a factor of 2 in the worst case, and its $\log_{10}$ error is modelled as independent with mean 0 and standard deviation $\tfrac12 \log_{10} 2$. Find the worst-case error factor of the product and its one-standard-deviation error factor.
^inv-gen-five-factors

> [!solution]- Solution
> methods: gen-estimation/fermi-error
> 1. Worst case $2^5 = 32$.
> 2. Per-factor standard deviation $0.301/2 \approx 0.151$; product $0.151 \sqrt5 \approx 0.337$.
> 3. $10^{0.337} \approx 2.17$.
> Answer: 32 at worst; about 2.2 at one standard deviation.

> [!problem] Heat loss from a warm furnace shell (d 4)
> A furnace's outer shell is at 80 °C in a room at 25 °C, with emissivity 0.9 and a free-convection coefficient of 8 W/(m$^2$ K); the surroundings are large and at room temperature. (a) Find the radiative and convective heat fluxes in W/m$^2$. (b) A common shortcut replaces the radiative flux by $h_r (T_1 - T_2)$ with $h_r = 4\varepsilon\sigma T_m^3$ and $T_m = (T_1 + T_2)/2$ in kelvin. Find the exact ratio of the true radiative flux to the shortcut as a function of $T_1$ and $T_2$, and evaluate it here.
^inv-gen-shell-loss

> [!solution]- Solution
> methods: gen-estimation/sanity, gen-estimation/bounding
> 1. Kelvin: $T_1 = 353.15$, $T_2 = 298.15$. Radiative: $0.9 \times 5.670 \times 10^{-8} \times (T_1^4 - T_2^4) \approx 390$ W/m$^2$. Convective: $8 \times 55 = 440$ W/m$^2$. The two are comparable; neither may be dropped.
> 2. $T_1^4 - T_2^4 = (T_1 - T_2)(T_1 + T_2)(T_1^2 + T_2^2)$, and $T_1 + T_2 = 2T_m$.
> 3. $T_1^2 + T_2^2 = 2T_m^2 + \tfrac12 (T_1 - T_2)^2$.
> 4. Ratio $= \dfrac{2T_m (2T_m^2 + \frac12 \Delta T^2)}{4 T_m^3} = 1 + \dfrac{\Delta T^2}{4 T_m^2}$, with $\Delta T = T_1 - T_2$.
> 5. Here $1 + 55^2/(4 \times 325.65^2) \approx 1.0071$: the shortcut is low by 0.7 %, and $h_r \approx 7.0$ W/(m$^2$ K).
> Answer: about 390 W/m$^2$ radiated and 440 W/m$^2$ convected; ratio $1 + \Delta T^2/(4T_m^2) \approx 1.007$.
