---
study: basic
id: sp-vacuum-plasma
title: Vacuum and plasma
area: sp
needs: []
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: nothing earlier. The ideal gas, the Boltzmann factor and Poisson's equation of electrostatics are used as stated where they first appear.
^needs

Units: 1 Torr = 133.3 Pa, 1 mbar = 100 Pa, 1 atm = 760 Torr. Temperatures of electrons are given in electron-volts: $k_BT_e = 1$ eV means $T_e = 11\,604$ K.
^units

## Kinetic theory

> [!def] The gas model
> A dilute gas of molecules of mass $m$ at temperature $T$ and number density $n$ (molecules per m³). Directions of motion are isotropic, and speeds follow the **Maxwell–Boltzmann distribution**
> $$f(v) = 4\pi\Big(\frac{m}{2\pi k_BT}\Big)^{3/2} v^2 e^{-mv^2/2k_BT},$$
> with $k_B = 1.381 \times 10^{-23}$ J/K. **Equipartition**: the mean kinetic energy is $\langle \tfrac12 mv^2\rangle = \tfrac32 k_BT$.
^def-gas

> [!thm] Theorem 1 (speed, wall flux, pressure)
> (a) The mean speed is $\bar v = \sqrt{8k_BT/\pi m}$.
> (b) The number of molecules striking unit area of wall per unit time is $\Gamma = n\bar v/4$.
> (c) The pressure is $p = nk_BT$, so $\Gamma = p/\sqrt{2\pi m k_BT}$.
^kinetic

> [!proof]- Proof (d 3.5)
> 1. (a) With $a = m/2k_BT$, $\int_0^\infty v^3 e^{-av^2}dv = 1/2a^2$, so $\bar v = 4\pi(a/\pi)^{3/2}/2a^2 = 2/\sqrt{\pi a} = \sqrt{8k_BT/\pi m}$.
> 2. (b) Molecules moving in solid angle $d\Omega$ at angle $\theta$ to the wall normal are a fraction $d\Omega/4\pi$ of all; those with speed $v$ cross unit wall area at rate $n f(v)\,dv\; v\cos\theta\; d\Omega/4\pi$.
> 3. Over the hemisphere $\int\cos\theta\,d\Omega = \int_0^{\pi/2}\cos\theta\, 2\pi\sin\theta\, d\theta = \pi$, so $\Gamma = n\bar v\,\pi/4\pi = n\bar v/4$.
> 4. (c) Each molecule arriving at angle $\theta$ with speed $v$ delivers momentum $2mv\cos\theta$, so $p = n m\langle v^2\rangle \frac{2}{4\pi}\int\cos^2\theta\, d\Omega$ over the hemisphere.
> 5. That integral is $2\pi/3$, so $p = \tfrac13 nm\langle v^2\rangle = \tfrac23 n\langle\tfrac12 mv^2\rangle = nk_BT$.
> 6. Substitute $n = p/k_BT$ and (a) into (b): $\Gamma = p/\sqrt{2\pi mk_BT}$.
^p-kinetic

Nitrogen at 300 K has $\bar v = 476$ m/s. A surface holds about $10^{19}$ adsorption sites per m² (an order of magnitude), so at $10^{-6}$ Torr, where $\Gamma = 3.8 \times 10^{18}$ m⁻²s⁻¹, a surface that keeps every molecule that lands is covered in a few seconds. That is why clean surfaces need ultra-high vacuum.
^monolayer

## Mean free path and flow regimes

> [!thm] Theorem 2 (mean free path)
> For molecules of collision diameter $d$, the mean distance between collisions is
> $$\lambda = \frac{1}{\sqrt2\, n\pi d^2} = \frac{k_BT}{\sqrt2\,\pi d^2 p}.$$
^mean-free-path

> [!proof]- Proof (d 3)
> 1. Two molecules collide when their centres pass within $d$, so a moving molecule sweeps out a cylinder of cross-section $\sigma = \pi d^2$.
> 2. If the others stood still, it would hit $n\sigma\ell$ of them in a length $\ell$: mean path $1/n\sigma$.
> 3. The others move. The difference of two independent Maxwellian velocities is Maxwellian with mass $m/2$ (each component is a sum of two independent Gaussians, so its variance doubles), so the mean relative speed is $\sqrt2\,\bar v$.
> 4. Collisions per unit time are $n\sigma\sqrt2\,\bar v$ while the molecule covers $\bar v$, so $\lambda = 1/\sqrt2 n\sigma$.
> 5. Substitute $n = p/k_BT$.
^p-mean-free-path

For air at 300 K ($d \approx 0.37$ nm), $\lambda p \approx 6.8 \times 10^{-3}$ Pa·m: about 67 nm at 1 atm and 5 cm at 1 mTorr.
^mfp-air

> [!def] Knudsen number and flow regimes
> $\mathrm{Kn} = \lambda/L$, with $L$ the size of the duct or gap. Below about 0.01 the gas flows as a viscous continuum; above about 0.5 molecules hit walls far more often than each other (**molecular flow**); between is transitional. The boundaries are conventions.
^knudsen

## Conductance and pumping speed

> [!def] Throughput, conductance, pumping speed
> **Throughput** $Q$ is the flow of gas as $pV$ per unit time (Pa·m³/s or Torr·L/s); at fixed temperature it counts molecules. A duct's **conductance** is $C = Q/(p_1 - p_2)$. A pump's **speed** is $S = Q/p$ at its inlet, a volume per time.
^def-conductance

> [!thm] Theorem 3 (conductances)
> (a) Conductances in series add as reciprocals, $1/C = \sum 1/C_i$; in parallel they add.
> (b) A pump of speed $S$ behind a conductance $C$ pumps the chamber with effective speed $S_{\rm eff} = SC/(S + C)$.
> (c) In molecular flow a thin aperture of area $A$ has $C = A\bar v/4$.
^conductance

> [!proof]- Proof
> 1. (a) In series the same $Q$ passes each element and the pressure drops add: $\Delta p = Q\sum 1/C_i$. In parallel the drop is shared and the flows add.
> 2. (b) The pump takes $Q = Sp_{\rm pump}$; the duct needs $p - p_{\rm pump} = Q/C$; so $p = Q(1/S + 1/C)$.
> 3. (c) In molecular flow the streams through the hole from each side do not interact. Each side sends $\Gamma A = n\bar vA/4$ molecules per unit time (Theorem 1), so the net flow is $A\bar v(n_1 - n_2)/4$; times $k_BT$, $Q = (A\bar v/4)(p_1 - p_2)$.
^p-conductance

An aperture passes about 11.7 L/s per cm² of air at 300 K. A long round tube in molecular flow has $C = \frac{\pi}{12}\bar v\, d^3/L$ for $L \gg d$ (stated, not proved here): the cube of the diameter is why a large pump behind a narrow port is wasted. In viscous flow conductance grows with the mean pressure instead.
^conductance-notes

## Pumpdown

> [!thm] Theorem 4 (pumpdown)
> A chamber of volume $V$, pumped at constant speed $S$, with a constant gas load $Q_L$ (leaks, outgassing), follows
> $$p(t) = p_u + (p_0 - p_u)e^{-St/V}, \qquad p_u = Q_L/S.$$
> While $p \gg p_u$, going from $p_0$ to $p$ takes $t = (V/S)\ln(p_0/p)$.
^pumpdown

> [!proof]- Proof
> 1. Gas balance at fixed temperature: $V\,dp/dt = Q_L - Sp$.
> 2. This is linear with constant coefficients: $p - p_u$ decays as $e^{-St/V}$ with $p_u = Q_L/S$.
> 3. With $p_u$ negligible, $p = p_0 e^{-St/V}$; take logarithms.
^p-pumpdown

Real pumpdowns follow this only down to about $10^{-2}$ to $10^{-3}$ Torr. Below that the load is water and other gas leaving the walls, which falls roughly as $1/t$ for unbaked metal (empirical), so the pressure follows the outgassing, not the time constant $V/S$. Baking the chamber speeds the outgassing up so it ends sooner.
^outgassing

## Pumps and gauges

Pumps by range (rough, check against datasheets):
- Rotary-vane and scroll pumps trap and compress a volume of gas: atmosphere down to about $10^{-2}$ to $10^{-3}$ Torr.
- A turbomolecular pump's blades move at speeds comparable to $\bar v$ and knock molecules toward the exhaust. It works only in molecular flow at its inlet and needs a backing pump at its outlet. Its compression ratio falls for light, fast gases such as hydrogen.
- Cryopumps freeze gas onto cold surfaces; ion pumps bury ionised gas in a cathode. Both reach ultra-high vacuum and have no exhaust.

Gauges:
- A capacitance manometer reads the deflection of a diaphragm: a true pressure, independent of the gas, over about four decades per head.
- A Pirani gauge reads heat loss from a hot wire (Theorem 5 below): gas-dependent, roughly $10^{-3}$ to 10 Torr for a plain one.
- An ionisation gauge ionises the gas and reads the ion current, proportional to $n$: gas-dependent, from about $10^{-3}$ Torr down to ultra-high vacuum.
^pumps-gauges

> [!thm] Theorem 5 (heat conduction through a gas)
> When the mean free path is much shorter than the gap, the heat a gas conducts does not depend on its pressure. When the mean free path is much longer than the gap, the heat it carries between two surfaces is proportional to pressure.
^pirani

> [!proof]- Proof (d 3)
> 1. In the continuum regime, molecules crossing a plane carry the energy of the layer about $\lambda$ away; the heat flux is about $\tfrac13 n\bar v c\lambda\, dT/dx$, with $c$ the heat capacity per molecule, so the conductivity is $\propto n\lambda\bar v c$.
> 2. By Theorem 2, $n\lambda = 1/\sqrt2\pi d^2$ does not depend on $n$, so neither does the conductivity.
> 3. When $\lambda$ exceeds the gap, molecules cross it without colliding, each carrying energy of order $c\,\Delta T$; the rate at which they hit a wall is $\Gamma \propto p$, so the heat carried is $\propto p$.
^p-pirani

A Pirani gauge therefore reads only where $\lambda$ is near the wire's distance from its housing; above that range it saturates.
^pirani-range

## Plasma: screening

> [!def] Process plasma
> A partly ionised gas with electron and ion densities nearly equal ($n_e \approx n_i = n$, **quasi-neutral**). In low-pressure process plasmas, about $n = 10^{15}$ to $10^{18}$ m⁻³ and $k_BT_e = 1$ to 5 eV, while the ions and neutrals stay near room temperature (about). The electrons are hot because the applied field heats them and they lose little energy in elastic collisions with heavy atoms.
^def-plasma

> [!thm] Theorem 6 (Debye length)
> In a plasma a charge is screened within a few **Debye lengths**
> $$\lambda_D = \sqrt{\varepsilon_0 k_BT_e/ne^2},$$
> which is $\lambda_D \approx 7430\sqrt{T_e[\text{eV}]/n[\text{m}^{-3}]}$ m. An ionised gas behaves as a plasma when $\lambda_D$ is much smaller than the vessel and there are many electrons in a Debye sphere.
^debye

> [!proof]- Proof (d 4)
> 1. Place a test charge, creating potential $\phi$. Electrons, light and fast, settle into a Boltzmann distribution $n_e = ne^{e\phi/k_BT_e}$; ions, heavy, stay at $n$ on that timescale.
> 2. Poisson's equation: $\nabla^2\phi = -e(n_i - n_e)/\varepsilon_0 = (en/\varepsilon_0)(e^{e\phi/k_BT_e} - 1)$.
> 3. Away from the charge $e\phi \ll k_BT_e$, so linearise: $\nabla^2\phi = \phi/\lambda_D^2$ with $\lambda_D^2 = \varepsilon_0k_BT_e/ne^2$.
> 4. The spherically symmetric solution that vanishes far away is $\phi = (q/4\pi\varepsilon_0 r)\,e^{-r/\lambda_D}$: the bare Coulomb potential cut off over $\lambda_D$.
^p-debye

## Plasma: sheaths

A wall in contact with a plasma charges negative, because electrons reach it far faster than ions. A thin positive layer, the **sheath**, forms between the wall and the quasi-neutral plasma, and the ions are accelerated across it. That acceleration is what makes plasma etching directional.
^sheath-intro

> [!thm] Theorem 7 (Bohm criterion)
> A collisionless sheath with Boltzmann electrons can form only if ions enter it with speed at least the **ion sound speed**
> $$u_0 \ge c_s = \sqrt{k_BT_e/M},$$
> with $M$ the ion mass.
^sheath

> [!proof]- Proof (d 5)
> 1. Measure $\phi \le 0$ from the sheath edge, where ions and electrons both have density $n_0$. Ions conserve energy, $\tfrac12Mu^2 = \tfrac12Mu_0^2 - e\phi$, and flux, $n_iu = n_0u_0$, so $n_i = n_0(1 - 2e\phi/Mu_0^2)^{-1/2}$.
> 2. Electrons: $n_e = n_0e^{e\phi/k_BT_e}$.
> 3. The sheath's net charge must be positive all through it, $n_i \ge n_e$; otherwise the potential oscillates instead of falling steadily to the wall.
> 4. Just inside the edge, $\phi$ is small: $n_i \approx n_0(1 + e\phi/Mu_0^2)$, $n_e \approx n_0(1 + e\phi/k_BT_e)$.
> 5. $n_i - n_e \approx n_0e\phi(1/Mu_0^2 - 1/k_BT_e)$; with $\phi < 0$ this is $\ge 0$ only if $Mu_0^2 \ge k_BT_e$.
^p-sheath

> [!thm] Theorem 8 (Child law)
> When the sheath voltage $V$ is much larger than $k_BT_e/e$, ions carrying current density $J$ cross a sheath of thickness $s$ with
> $$J = \frac49\varepsilon_0\sqrt{\frac{2e}{M}}\,\frac{V^{3/2}}{s^2}.$$
^child-law

> [!proof]- Proof (d 5)
> 1. Neglect electrons in the sheath and the ions' entry speed. Write $\psi = -\phi \ge 0$, with $\psi = 0$ and $\psi' = 0$ at the edge $x = 0$; an ion there has speed $u = \sqrt{2e\psi/M}$.
> 2. Flux continuity: $n_i = J/eu$.
> 3. Poisson: $\psi'' = en_i/\varepsilon_0 = (J/\varepsilon_0)\sqrt{M/2e\psi}$.
> 4. Multiply by $\psi'$ and integrate from the edge: $\tfrac12\psi'^2 = 2(J/\varepsilon_0)\sqrt{M/2e}\;\psi^{1/2}$.
> 5. So $\psi' = 2(J/\varepsilon_0)^{1/2}(M/2e)^{1/4}\psi^{1/4}$; separate the variables.
> 6. Integrate to the wall, $\psi = V$ at $x = s$: $\tfrac43V^{3/4} = 2(J/\varepsilon_0)^{1/2}(M/2e)^{1/4}s$.
> 7. Square and solve for $J$.
^p-child-law

Ions reach $c_s$ by falling through a weak **presheath** in the plasma, a drop of $k_BT_e/2e$; with Boltzmann electrons the density at the sheath edge is then $e^{-1/2}n_0 \approx 0.61n_0$, and the ion current density into any wall is about $0.61\,en_0c_s$ (a derive prompt below).
^bohm-flux

## Breakdown

> [!def] Townsend coefficients (empirical)
> An electron in a field $E$ in gas at pressure $p$ makes $\alpha$ ionisations per unit length, with $\alpha/p = A\exp(-Bp/E)$ and constants $A$, $B$ fitted per gas (for air, about $A = 15$ cm⁻¹Torr⁻¹ and $B = 365$ V cm⁻¹Torr⁻¹; check). Each ion that hits the cathode frees $\gamma$ electrons, typically 0.01 to 0.1, depending on the gas and the cathode.
^townsend

> [!thm] Theorem 9 (Paschen's law)
> A uniform-field gap $d$ in gas at pressure $p$ breaks down at
> $$V_b = \frac{Bpd}{\ln(Apd) - \ln\ln(1 + 1/\gamma)},$$
> a function of $pd$ alone, with its minimum at $(pd)_{\min} = e\ln(1 + 1/\gamma)/A$, where $V_{\min} = B(pd)_{\min}$ (here $e = 2.718\dots$).
^paschen

> [!proof]- Proof (d 4.5)
> 1. One electron leaving the cathode multiplies to $e^{\alpha d}$ by the anode, so $e^{\alpha d} - 1$ ions return to the cathode.
> 2. They free $\gamma(e^{\alpha d} - 1)$ electrons. The discharge sustains itself when that is 1: $\alpha d = \ln(1 + 1/\gamma)$.
> 3. With $E = V/d$, $\alpha d = Apd\,\exp(-Bpd/V)$.
> 4. Set the two equal, take logarithms and solve for $V$.
> 5. Write $x = pd$, $c = \ln\ln(1 + 1/\gamma)$: $V = Bx/(\ln Ax - c)$ has $dV/dx = 0$ when $\ln Ax - c = 1$, so $x = e\cdot e^c/A = e\ln(1 + 1/\gamma)/A$ and $V = Bx$.
^p-paschen

With the air constants and $\gamma = 0.01$ this gives $(pd)_{\min} = 0.84$ Torr·cm and $V_{\min} = 305$ V; measured minima for air are near 330 V (check). Below the minimum's $pd$ the electrons cross without enough collisions; above it they collide too often to gain ionising energy. A supply below $V_{\min}$ cannot start a Townsend discharge across a uniform gap at any pressure.
^paschen-air

## Examples

> [!example] Mean free path in a sputter chamber
> Argon at 5 mTorr and 300 K, collision diameter about 0.36 nm. Find the mean free path, and roughly how many collisions an atom makes crossing 10 cm.
^ex-sputter-mfp

> [!solution]- Solution
> methods: sp-vacuum-plasma/mean-free-path
> 1. $p = 0.667$ Pa; $\lambda = k_BT/\sqrt2\pi d^2p = 4.14\times10^{-21}/(\sqrt2\pi(0.36\times10^{-9})^2 \times 0.667) = 1.08$ cm.
> 2. About $10/1.08 \approx 9$ collisions: sputtered atoms arrive from many directions, not in a beam (the cross-section of a fast sputtered atom differs, so this is an order of magnitude).

> [!example] Is it a plasma
> A discharge has $n = 10^{16}$ m⁻³ and $k_BT_e = 3$ eV in a chamber 10 cm across. Find $\lambda_D$ and the number of electrons in a Debye sphere.
^ex-is-plasma

> [!solution]- Solution
> methods: sp-vacuum-plasma/debye
> 1. $\lambda_D = 7430\sqrt{3/10^{16}} = 0.13$ mm, 780 times smaller than the chamber.
> 2. $\tfrac43\pi\lambda_D^3 n = 8.9\times10^4 \gg 1$. Both tests pass.

> [!example] Roughing a chamber
> A 100 L chamber is pumped from 760 Torr by a 10 m³/h pump. Ignoring the gas load and conductance, how long to 0.1 Torr?
^ex-roughing

> [!solution]- Solution
> methods: sp-vacuum-plasma/pumpdown
> 1. $S = 10\,000\text{ L}/3600\text{ s} = 2.78$ L/s; $V/S = 36$ s.
> 2. $t = 36\ln(7600) = 322$ s, about 5.4 min.

## Derive

> [!derive] A slab of electrons in a uniform plasma is shifted sideways by a small distance and released, with the ions fixed. Show that it oscillates at the plasma frequency $\omega_p = \sqrt{ne^2/\varepsilon_0m_e}$, and evaluate $f_p = \omega_p/2\pi$ at $n = 10^{16}$ m⁻³.
^d-plasma-frequency

> [!solution]- Solution
> methods: sp-vacuum-plasma/def-plasma
> 1. Shifting the electrons by $\xi$ leaves surface charges $\pm ne\xi$ per area, so a field $E = ne\xi/\varepsilon_0$ inside.
> 2. Each electron feels $m_e\ddot\xi = -eE = -(ne^2/\varepsilon_0)\xi$: simple harmonic at $\omega_p$.
> 3. $f_p = 0.90$ GHz.

> [!derive] Ions start at rest in the plasma and reach the sheath edge at $c_s$. With Boltzmann electrons, show that the potential at the edge is $-k_BT_e/2e$ relative to the plasma, that the density there is $e^{-1/2}n_0$, and so that the ion current density into the wall is about $0.61\,en_0c_s$.
^d-bohm-flux

> [!solution]- Solution
> methods: sp-vacuum-plasma/sheath, sp-vacuum-plasma/debye
> 1. Energy: $\tfrac12Mc_s^2 = \tfrac12k_BT_e = e\,\Delta\phi$, so the drop is $k_BT_e/2e$.
> 2. Electrons: $n = n_0e^{-1/2} = 0.61n_0$; quasi-neutral up to the edge, so the ions have this density too.
> 3. Ion flux $0.61n_0c_s$, times $e$.

> [!derive] Prove that two gaps with the same $pd$ break down at the same voltage, using only the form of $\alpha/p$ and the breakdown condition. Explain the result in terms of the mean free path.
^d-similarity

> [!solution]- Solution
> methods: sp-vacuum-plasma/paschen, dimensional-analysis
> 1. $\alpha d = (\alpha/p)(pd)$ and $\alpha/p$ depends only on $E/p = V/pd$.
> 2. So the breakdown condition $\alpha d = \ln(1 + 1/\gamma)$ involves $V$ and $pd$ only.
> 3. $pd \propto d/\lambda$ counts mean free paths across the gap, and $V/pd$ is the energy gained per mean free path: both are unchanged.

> [!derive] The gas load of a chamber falls as $Q_L(t) = Q_0t_0/t$. Show that once $t \gg V/S$, the pressure follows $p(t) \approx Q_L(t)/S$, and find the first correction.
^d-outgassing-pumpdown

> [!solution]- Solution
> methods: sp-vacuum-plasma/pumpdown
> 1. $V\dot p = Q_L - Sp$. Try $p = Q_L/S + \delta$.
> 2. Then $V\dot p \approx V\dot Q_L/S = -VQ_L/St$, so $\delta = -V\dot p/S \approx (V/S)(1/t)\,Q_L/S$, a relative correction of $(V/S)/t$.
> 3. It is small once $t \gg V/S$: the pressure tracks the load.

## Problems

> [!problem] A pump behind a port (d 2.5)
> A 300 L/s turbo pump connects to a chamber through a port of conductance 200 L/s. The chamber's inner surface is 5000 cm² and outgasses $10^{-8}$ Torr·L/(s·cm²). What base pressure results, and what port conductance would reach $2\times10^{-7}$ Torr with the same pump?
^inv-sp-pump-port

> [!solution]- Solution
> methods: sp-vacuum-plasma/conductance, sp-vacuum-plasma/pumpdown
> 1. $S_{\rm eff} = 300 \times 200/500 = 120$ L/s; $Q_L = 5 \times 10^{-5}$ Torr·L/s; $p = Q_L/S_{\rm eff} = 4.2\times10^{-7}$ Torr.
> 2. $2\times10^{-7}$ Torr needs $S_{\rm eff} = 250$ L/s, so $1/C = 1/250 - 1/300$, $C = 1500$ L/s.
> Answer: $4.2 \times 10^{-7}$ Torr; a 1500 L/s port (or less outgassing: a bake).

> [!problem] Sizing a roughing pump (d 2.5)
> The 100 L chamber in the roughing example must reach 0.1 Torr from atmosphere in 2 minutes. What pump speed is needed, in L/s and m³/h, ignoring conductance and gas load?
^inv-sp-rough-size

> [!solution]- Solution
> methods: sp-vacuum-plasma/pumpdown
> 1. $S = (V/t)\ln(p_0/p) = (100/120)\ln 7600 = 7.45$ L/s.
> 2. $\times 3.6 = 26.8$ m³/h.

> [!problem] The sheath over an etch electrode (d 4.5)
> An argon plasma has $n_0 = 10^{16}$ m⁻³ and $k_BT_e = 3$ eV. An electrode sits 300 V below the plasma. Find the ion current density reaching it and the sheath thickness, and compare the thickness with $\lambda_D$.
^inv-sp-etch-sheath

> [!solution]- Solution
> methods: sp-vacuum-plasma/sheath, sp-vacuum-plasma/child-law
> 1. $M = 39.95 \times 1.661\times10^{-27}$ kg; $c_s = \sqrt{3 \times 1.602\times10^{-19}/M} = 2.69$ km/s.
> 2. $J = 0.61\,en_0c_s = 2.6$ A/m² $= 0.26$ mA/cm².
> 3. Child law: $s = \sqrt{\tfrac49\varepsilon_0\sqrt{2e/M}\,V^{3/2}/J} = 4.1$ mm.
> 4. $\lambda_D = 0.13$ mm, so $s \approx 32\lambda_D$: a high-voltage sheath is many Debye lengths thick.
> Answer: about 0.26 mA/cm² and 4 mm.

> [!problem] An electrically floating substrate (d 4)
> A substrate in an argon plasma is electrically isolated, so it charges until the electron and ion currents to it are equal. Taking the ion flux $n_sc_s$ at the sheath edge (density $n_s$) and the electron flux $n_s(\bar v_e/4)e^{e\phi_w/k_BT_e}$ for a wall at $\phi_w$ below the edge, find $\phi_w$ in units of $k_BT_e/e$, add the presheath, and give the energy of ions striking the substrate at $k_BT_e = 3$ eV.
^inv-sp-floating

> [!solution]- Solution
> methods: sp-vacuum-plasma/sheath, sp-vacuum-plasma/kinetic
> 1. Equal fluxes: $e^{e\phi_w/k_BT_e} = 4c_s/\bar v_e = 4\sqrt{k_BT_e/M}\big/\sqrt{8k_BT_e/\pi m_e} = \sqrt{2\pi m_e/M}$.
> 2. $\phi_w = -\frac{k_BT_e}{2e}\ln(M/2\pi m_e)$. For argon $M/m_e = 72\,820$, so $\phi_w = -4.68\,k_BT_e/e$.
> 3. With the presheath's $-0.5\,k_BT_e/e$ the substrate sits $5.18\,k_BT_e/e$ below the plasma.
> 4. Ions start near rest in the plasma and fall through the whole drop: $5.18 \times 3 = 15.5$ eV.
> Answer: about $-5.2\,k_BT_e/e$; about 16 eV ions.

> [!problem] A gap that may arc (d 4.5)
> A gas has $A = 12$ cm⁻¹Torr⁻¹, $B = 180$ V cm⁻¹Torr⁻¹ and, on these electrodes, $\gamma = 0.07$. Two parallel electrodes 2 mm apart carry 300 V. Over what range of pressure does the gap break down? What is the lowest voltage that can break down any gap in this gas, and at what $pd$?
^inv-sp-arc-gap

> [!solution]- Solution
> methods: sp-vacuum-plasma/paschen
> 1. $c = \ln\ln(1 + 1/0.07) = 1.003$. $(pd)_{\min} = e\ln(15.29)/12 = 0.618$ Torr·cm and $V_{\min} = 180 \times 0.618 = 111$ V.
> 2. Solve $180x/(\ln 12x - 1.003) = 300$ on each side of the minimum: $x = 0.267$ and $5.23$ Torr·cm.
> 3. Divide by $d = 0.2$ cm.
> Answer: from about 1.3 to 26 Torr; 111 V at 0.62 Torr·cm.
