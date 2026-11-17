---
study: basic
id: mat-structure-props
title: "Materials: structure, defects and properties"
area: mat
needs: []
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: none. Stress, strain and Hooke's law are defined in [mc-solids](mc-solids.md#^stress); thermally activated rates are in [the Arrhenius law](sp-oxidation-diffusion.md#^arrhenius).

Why a metal is weaker than its bonds, why it gets stronger when you bend it, and how it fails slowly (creep) or after many cycles (fatigue) all come from one picture: atoms on a lattice, and the mistakes in that lattice. This doc builds that picture and the numbers interviewers expect you to reach for.

## Crystals

> [!def] Crystal, unit cell, packing
> A **crystal** is a solid whose atoms sit on a lattice: a pattern that repeats by translation in three directions. The **unit cell** is the smallest box whose translated copies fill space and reproduce the pattern; for cubic cells its edge is the **lattice parameter** $a$. Three structures cover most engineering metals:
> - **FCC** (face-centred cubic): atoms at the 8 corners and the 6 face centres. Aluminium, copper, nickel, austenitic stainless steel.
> - **BCC** (body-centred cubic): atoms at the 8 corners and the cell centre. Ferritic steel, tungsten, chromium.
> - **HCP** (hexagonal close-packed): close-packed layers stacked ABAB. Titanium at room temperature, magnesium, zinc.
>
> The **atomic packing factor** (APF) is the fraction of the cell volume filled by atoms modelled as touching hard spheres of radius $r$. With $n$ atoms per cell of molar mass $M$, the density is $\rho = nM/(a^3 N_A)$, where $N_A$ is Avogadro's number.
^crystal

> [!thm] Theorem 1 (FCC packing)
> The atomic packing factor of FCC is $\pi/(3\sqrt 2) \approx 0.740$.
^apf-fcc

> [!proof]- Proof (d 2)
> 1. A corner atom is shared by 8 cells and a face atom by 2, so the cell holds $8 \cdot \tfrac18 + 6 \cdot \tfrac12 = 4$ atoms.
> 2. Atoms touch along a face diagonal, which spans one full atom and two half atoms: $\sqrt 2\, a = 4r$.
> 3. The atoms fill $4 \cdot \tfrac43 \pi r^3 = \tfrac{16}{3}\pi r^3$.
> 4. The cell volume is $a^3 = (4r/\sqrt 2)^3 = 16\sqrt 2\, r^3$.
> 5. Divide: $\dfrac{16\pi/3}{16\sqrt 2} = \dfrac{\pi}{3\sqrt 2}$.
^p-apf-fcc

FCC and HCP are both stackings of the densest possible plane, so both reach 0.740; BCC is looser. Close-packed planes matter because they are the planes that slide most easily, as the next sections show. FCC has 12 such slip systems (4 close-packed planes, 3 close-packed directions in each), which is why FCC metals stay ductile even at cryogenic temperature. ^slip-systems

> [!example] Copper's density from its cell
> Copper is FCC with $a = 0.3615$ nm and $M = 63.55$ g/mol. Find its density.
^ex-cu-density

> [!solution]- Solution
> methods: mat-structure-props/crystal
> 1. $n = 4$ (Theorem 1, step 1).
> 2. $a^3 = (3.615\times10^{-8}\text{ cm})^3 = 4.724\times10^{-23}\text{ cm}^3$.
> 3. $\rho = 4 \cdot 63.55 / (4.724\times10^{-23} \cdot 6.022\times10^{23}) = 8.94$ g/cm³, which matches handbook copper to within a percent.

## Defects

> [!def] Defects, by dimension
> A real crystal departs from its lattice in four ways.
> - **Point defects** (0-D): a **vacancy** (an empty site), an **interstitial** (an atom squeezed between sites), a **substitutional** solute (a foreign atom on a site).
> - **Line defects** (1-D): **dislocations**, the subject of the next section.
> - **Planar defects** (2-D): **grain boundaries** (where two crystals of different orientation meet; a metal part is a polycrystal of grains typically 1 to 100 µm across), twin boundaries, stacking faults, free surfaces.
> - **Volume defects** (3-D): pores, cracks, inclusions, second-phase particles.
^defects

Vacancies are the only defect a crystal wants: a few empty sites raise the disorder (entropy) more than they cost in bond energy, so a hot crystal at equilibrium always has some. Atoms diffuse mainly by hopping into neighbouring vacancies, so diffusion in a solid inherits the vacancies' exponential temperature dependence, which is why diffusion coefficients follow [Arrhenius](sp-oxidation-diffusion.md#^arrhenius) and why creep and sintering switch on sharply with temperature. ^vacancy-diffusion

> [!thm] Theorem 2 (equilibrium vacancies)
> If each vacancy costs energy $E_v$ and only the configurational entropy is counted, the equilibrium fraction of empty sites at absolute temperature $T$ is
> $$\frac{n}{N+n} = \exp\!\left(-\frac{E_v}{k_B T}\right),$$
> where $N$ is the number of atoms, $n$ the number of vacancies and $k_B$ Boltzmann's constant.
^vacancy-eq

> [!proof]- Proof (d 3)
> 1. At fixed temperature and pressure the crystal minimises its Gibbs energy $G = H - TS$. Adding $n$ vacancies raises $H$ by $nE_v$.
> 2. The $n$ vacancies and $N$ atoms can be arranged on the $N+n$ sites in $W = \dfrac{(N+n)!}{N!\,n!}$ ways, so the configurational entropy is $S = k_B \ln W$.
> 3. So $G(n) = nE_v - k_B T \ln W$, up to terms that do not depend on $n$.
> 4. For large counts use Stirling's approximation $\ln m! \approx m\ln m - m$.
> 5. Then $\ln W \approx (N+n)\ln(N+n) - N\ln N - n \ln n$, and $\dfrac{d \ln W}{dn} = \ln\dfrac{N+n}{n}$.
> 6. Set $dG/dn = E_v - k_BT \ln\dfrac{N+n}{n} = 0$.
> 7. Solve: $\dfrac{n}{N+n} = e^{-E_v/(k_BT)}$.
^p-vacancy-eq

## Dislocations

> [!def] Dislocation
> A **dislocation** is a line inside a crystal along which the lattice is misfit, bounding a region that has slipped by one lattice vector from a region that has not. That lattice vector is the **Burgers vector** $\mathbf b$; its length $b$ is one interatomic spacing, about 0.25 nm in common metals. In an **edge** dislocation $\mathbf b$ is perpendicular to the line (picture an extra half-plane of atoms ending at the line); in a **screw** dislocation it is parallel. Most real dislocations are mixed. **Plastic deformation** of a metal is the motion of dislocations: when one sweeps across a slip plane, the crystal above has shifted by $\mathbf b$, and only the bonds along the line were broken at any moment.
^dislocations

The **shear modulus** $G$ is the ratio of shear stress to shear strain in the elastic range ([Hooke](mc-solids.md#^hooke)). The next theorem estimates what a perfect crystal would need, and it is far more than real crystals need.

> [!thm] Theorem 3 (strength of a perfect crystal)
> If one close-packed plane is slid rigidly over its neighbour, with a shear stress that varies sinusoidally with the offset (period $b$, plane spacing $d \approx b$), the largest shear stress needed is $\tau_{th} \approx G/(2\pi)$.
^theoretical-strength

> [!proof]- Proof (d 3)
> 1. Write the stress at offset $x$ as $\tau = \tau_{th}\sin(2\pi x/b)$: zero when atoms sit in their own or the next valleys, largest in between.
> 2. For small $x$, $\tau \approx \tau_{th}\, 2\pi x/b$.
> 3. For small $x$ the response must be elastic: shear strain $x/d$, so $\tau = Gx/d$.
> 4. Match the two slopes: $\tau_{th} = Gb/(2\pi d)$.
> 5. With $d \approx b$: $\tau_{th} \approx G/(2\pi)$.
^p-theoretical-strength

For copper, $G \approx 45$ GPa gives about 7 GPa. An annealed pure copper crystal starts slipping at about 1 MPa, thousands of times lower. The gap is the evidence for dislocations: a dislocation moves by rearranging one row of bonds at a time, so it needs only a small fraction of $\tau_{th}$. ^strength-gap

> [!thm] Theorem 4 (Schmid's law)
> A bar of a single crystal carries axial stress $\sigma$. A slip system whose plane normal makes angle $\phi$ with the axis and whose slip direction makes angle $\lambda$ with it sees the resolved shear stress $\tau_R = \sigma\cos\phi\cos\lambda$. Slip starts on the system where $\tau_R$ first reaches a material constant, the **critical resolved shear stress** $\tau_c$.
^schmid

> [!proof]- Proof (d 1.5)
> 1. Let the bar's cross-section be $A_0$ and the force $F = \sigma A_0$. The slip plane cuts the bar in an ellipse of area $A_0/\cos\phi$.
> 2. The component of $F$ along the slip direction is $F\cos\lambda$.
> 3. Divide force by area: $\tau_R = \dfrac{F\cos\lambda}{A_0/\cos\phi} = \sigma\cos\phi\cos\lambda$. That slip starts at a fixed $\tau_c$ is the experimental content of the law.
^p-schmid

## Strengthening

> [!def] Strengthening mechanisms
> To strengthen a metal is to make dislocations harder to move. Four mechanisms, each named by the obstacle:
> - **Work hardening**: dislocations multiply during deformation and tangle. With dislocation density $\rho_d$ (line length per volume), the flow stress in shear is $\tau = \alpha G b\sqrt{\rho_d}$ with $\alpha \approx 0.3$ to $0.5$ (Taylor relation, stated).
> - **Grain refinement**: grain boundaries stop slip, because the slip plane does not continue across them. Yield stress follows $\sigma_y = \sigma_0 + k_y d^{-1/2}$ for grain size $d$ (Hall-Petch relation, stated; it comes from dislocations piling up against a boundary, and it fails below roughly 10 to 20 nm).
> - **Solid solution**: solute atoms distort the lattice around them and pin passing dislocations; the gain grows sublinearly with solute concentration.
> - **Precipitation**: fine particles of a second phase. Small, coherent particles are cut by dislocations and resist more as they grow; large particles are bypassed by bowing between them (Theorem 5) and resist less as they grow and their spacing widens. The crossover sets the peak of an ageing treatment.
>
> In a polycrystal, tensile yield stress is about $M\tau$, where the **Taylor factor** $M \approx 3.06$ for randomly oriented FCC grains. Every mechanism costs ductility; in steels, grain refinement is the one that also improves toughness.
^strengthening

> [!thm] Theorem 5 (Orowan bypass)
> A dislocation line pinned by impenetrable particles a clear distance $L$ apart passes between them when the resolved shear stress reaches $\tau_{Or} \approx Gb/L$, taking the line tension (energy per unit length of dislocation) as $T \approx Gb^2/2$.
^orowan

> [!proof]- Proof (d 2.5)
> 1. A resolved shear stress $\tau$ pushes on a dislocation with force $\tau b$ per unit length, normal to the line (stated: the work done when the line advances must equal $\tau b$ per unit area swept).
> 2. The line resists bending with tension $T$, the same way a string does.
> 3. A segment bowed to radius $R$ is in equilibrium when $\tau b = T/R$.
> 4. Between two pins a distance $L$ apart, $R$ cannot be smaller than $L/2$, the semicircle.
> 5. Past the semicircle, a larger bulge needs less stress, so the line runs away around the particles: the bypass stress is $\tau = 2T/(bL)$.
> 6. Substitute $T = Gb^2/2$: $\tau_{Or} = Gb/L$.
^p-orowan

> [!example] Grain size and yield stress
> A low-carbon steel yields at 150 MPa with 100 µm grains and at 250 MPa with 10 µm grains. Predict the yield stress at 1 µm, assuming Hall-Petch holds.
^ex-hall-petch

> [!solution]- Solution
> methods: mat-structure-props/strengthening
> 1. Work in mm: $d^{-1/2} = 3.162$ and $10.0$ mm$^{-1/2}$.
> 2. Slope: $k_y = (250-150)/(10.0-3.162) = 14.6$ MPa mm$^{1/2}$; intercept $\sigma_0 = 150 - 14.6 \cdot 3.162 = 104$ MPa.
> 3. At 1 µm, $d^{-1/2} = 31.6$ mm$^{-1/2}$: $\sigma_y = 104 + 14.6 \cdot 31.6 \approx 566$ MPa.

## Phase diagrams

> [!def] Phase, component, phase diagram
> A **component** is a chemically independent constituent (for a binary alloy, the two elements). A **phase** is a region of uniform structure and composition: a liquid, or one crystal structure with its dissolved solutes. An equilibrium **phase diagram** maps, for each temperature and overall composition, which phases are present. Where two phases coexist, a horizontal **tie line** at that temperature ends on the two phase boundaries, and its ends give the two phases' compositions. The **Gibbs phase rule** limits what can coexist: with $C$ components and $P$ phases, the number of intensive variables that can vary independently is $F = C - P + 2$, or $C - P + 1$ at fixed pressure. So in a binary at fixed pressure, three phases coexist only at a point (a **eutectic**: liquid to two solids on cooling; a **eutectoid**: one solid to two solids).
>
> Landmarks worth knowing: lead-free tin-silver-copper solder melts near 217 °C. In iron-carbon, the eutectoid sits at 727 °C and 0.76 wt% C, where austenite (FCC iron) becomes pearlite, layers of ferrite (BCC iron) and cementite (Fe$_3$C). Quenching austenite too fast for carbon to diffuse gives **martensite**, a hard, strained phase formed by shear without diffusion.
^phase-diagram

> [!thm] Theorem 6 (lever rule)
> An alloy of overall composition $C_0$ (mass fraction of B) sits in a two-phase field where the tie line gives phase compositions $C_\alpha$ and $C_\beta$. The mass fractions of the phases are
> $$f_\alpha = \frac{C_\beta - C_0}{C_\beta - C_\alpha}, \qquad f_\beta = \frac{C_0 - C_\alpha}{C_\beta - C_\alpha}.$$
^lever

> [!proof]- Proof (d 1.5)
> 1. Total mass: $f_\alpha + f_\beta = 1$.
> 2. Mass of B: $f_\alpha C_\alpha + f_\beta C_\beta = C_0$.
> 3. Substitute $f_\beta = 1 - f_\alpha$ and solve: $f_\alpha (C_\alpha - C_\beta) = C_0 - C_\beta$, which is the first formula; the second follows from step 1.
^p-lever

> [!example] Solid fraction during freezing
> An alloy with 40 wt% B is held at a temperature where the tie line runs from liquid at 30 wt% B to solid at 55 wt% B. What fraction of the mass is solid?
^ex-lever

> [!solution]- Solution
> methods: mat-structure-props/lever
> 1. Solid is the phase at 55, liquid at 30: $f_{solid} = (40-30)/(55-30) = 0.40$.
> 2. The solid fraction is the length of the tie-line arm on the far side, which is the reason for the name.

## Creep

> [!def] Creep
> **Creep** is slow, time-dependent plastic strain under constant stress. It matters when the **homologous temperature** $T/T_m$ (both in kelvin) exceeds about 0.4. A creep test at constant load shows a transient **primary** stage, a long **secondary** stage at nearly constant strain rate $\dot\varepsilon_{ss}$, and an accelerating **tertiary** stage ending in rupture. The secondary rate fits a power law with an Arrhenius factor,
> $$\dot\varepsilon_{ss} = A\,\sigma^{n} \exp\!\left(-\frac{Q}{RT}\right),$$
> where $Q$ is an activation energy (often close to that of self-diffusion) and $R$ the gas constant. The exponent $n$ names the mechanism: $n \approx 3$ to 8 for **dislocation creep** (dislocations climb past obstacles, which needs vacancies); $n = 1$ for **diffusional creep**, where atoms diffuse from grain boundaries under compression to those under tension, with rate $\propto d^{-2}$ through the grains (Nabarro-Herring) or $\propto d^{-3}$ along the boundaries (Coble). Fine grains therefore help strength at room temperature but hurt creep resistance at high temperature, which is why turbine blades are cast as single crystals.
^creep

Solder is the everyday case: at 25 °C a tin-based solder melting at 217 °C (490 K) already sits at $T/T_m \approx 0.61$, so a solder joint creeps at room temperature. ^solder-homologous

> [!thm] Theorem 7 (Larson-Miller parameter)
> Assume the rupture time obeys $\dot\varepsilon_{ss} t_r = $ constant (the Monkman-Grant observation), the creep rate at fixed stress is Arrhenius with an activation energy $Q(\sigma)$, and the pre-exponential factor is the same at all stresses. Then for some constant $C$,
> $$\mathrm{LMP} = T\,(C + \log_{10} t_r)$$
> is a function of stress alone. With $t_r$ in hours, $C \approx 20$ fits many steels.
^lmp

> [!proof]- Proof (d 2.5)
> 1. At fixed stress, $\dot\varepsilon_{ss} = A'\exp(-Q(\sigma)/(RT))$, with $A'$ the same for all stresses by assumption.
> 2. Monkman-Grant: $t_r = K/\dot\varepsilon_{ss}$ for a constant $K$.
> 3. So $t_r = (K/A')\exp(Q(\sigma)/(RT))$.
> 4. Take $\log_{10}$: $\log_{10} t_r = \log_{10}(K/A') + \dfrac{Q(\sigma)}{RT\ln 10}$.
> 5. Set $C = -\log_{10}(K/A')$ and multiply by $T$: $T(C + \log_{10} t_r) = \dfrac{Q(\sigma)}{R\ln 10}$, which depends on $\sigma$ only.
^p-lmp

> [!example] Trading time for temperature
> A steel part under a given stress ruptures after 1000 h at 600 °C. Estimate its life under the same stress at 650 °C, with $C = 20$.
^ex-lmp

> [!solution]- Solution
> methods: mat-structure-props/lmp
> 1. Same stress, so same LMP: $873.15\,(20 + 3) = 20{,}082$.
> 2. At 923.15 K: $\log_{10} t_r = 20{,}082/923.15 - 20 = 1.754$.
> 3. $t_r \approx 57$ h. Fifty kelvin cost a factor of about 18 in life.

## Fatigue

> [!def] Fatigue
> **Fatigue** is failure under a repeated stress whose peak is below the yield stress. A cycle between $\sigma_{min}$ and $\sigma_{max}$ has **amplitude** $\sigma_a = (\sigma_{max}-\sigma_{min})/2$, **mean** $\sigma_m = (\sigma_{max}+\sigma_{min})/2$ and **ratio** $R = \sigma_{min}/\sigma_{max}$. Life has two parts.
> - **Initiation**: cyclic slip roughens the surface or a defect until a small crack forms. The S-N curve (amplitude against cycles to failure $N_f$) is often fit by **Basquin's law**, $\sigma_a = \sigma_f'(2N_f)^{b}$ with $b \approx -0.05$ to $-0.12$. Steels show an **endurance limit** below which life is effectively infinite, roughly half the ultimate strength $S_u$ (up to $S_u \approx 1400$ MPa); aluminium alloys have none. Surface finish matters a lot: as-printed and as-cast surfaces, and pores near the surface, cut the fatigue strength well below that of polished bars.
> - **Mean stress**: tension shortens life. The **Goodman line** takes the safe combinations as $\sigma_a/S_e + \sigma_m/S_u \le 1$, with $S_e$ the endurance limit.
> - **Variable amplitude**: **Miner's rule** sums damage linearly, failure when $\sum n_i/N_i = 1$, where $n_i$ cycles are spent at a level whose constant-amplitude life is $N_i$. It ignores load order.
> - **Crack growth**: once a crack of length $a$ exists, the **stress intensity factor** $K = Y\sigma\sqrt{\pi a}$ ($Y$ a geometry factor of order one) sets the stress field at its tip. Per cycle the crack grows as $da/dN = C(\Delta K)^m$ (**Paris law**, $m \approx 3$ for steels), and the part breaks when $K_{max}$ reaches the **fracture toughness** $K_{c}$.
^fatigue

> [!thm] Theorem 8 (crack growth life)
> Under constant-amplitude loading with $\Delta K = Y\Delta\sigma\sqrt{\pi a}$, $Y$ constant and $m \neq 2$, a crack grows from $a_0$ to the critical length $a_f = \dfrac{1}{\pi}\left(\dfrac{K_c}{Y\sigma_{max}}\right)^2$ in
> $$N_f = \frac{a_f^{\,1-m/2} - a_0^{\,1-m/2}}{C\,(Y\Delta\sigma\sqrt\pi)^m\,(1 - m/2)}$$
> cycles. For $m > 2$ the life is dominated by the initial crack size.
^paris-life

> [!proof]- Proof (d 3)
> 1. Fracture happens when $Y\sigma_{max}\sqrt{\pi a} = K_c$; solve for $a$ to get $a_f$.
> 2. Substitute $\Delta K$ into the Paris law: $\dfrac{da}{dN} = C(Y\Delta\sigma\sqrt\pi)^m a^{m/2}$.
> 3. Separate: $dN = \dfrac{a^{-m/2}\,da}{C(Y\Delta\sigma\sqrt\pi)^m}$.
> 4. Integrate from $a_0$ to $a_f$: $\int a^{-m/2}da = \dfrac{a_f^{1-m/2} - a_0^{1-m/2}}{1-m/2}$ for $m \ne 2$.
> 5. For $m > 2$ the exponent $1 - m/2$ is negative, so $a_0^{1-m/2} \gg a_f^{1-m/2}$ when $a_0 \ll a_f$: the smaller length controls.
^p-paris-life

## Derive

> [!derive] Prove that the atomic packing factor of BCC is $\pi\sqrt3/8 \approx 0.680$.
^d-bcc-apf

> [!solution]- Solution
> methods: mat-structure-props/apf-fcc
> 1. Two atoms per cell ($8\cdot\tfrac18 + 1$). Atoms touch along the body diagonal: $\sqrt3\, a = 4r$.
> 2. $\text{APF} = \dfrac{2\cdot\frac43\pi r^3}{(4r/\sqrt3)^3} = \dfrac{8\pi/3}{64/(3\sqrt3)} = \dfrac{\pi\sqrt3}{8}$.

> [!derive] Prove that the Schmid factor $\cos\phi\cos\lambda$ of any slip system is at most $1/2$, and find when it equals $1/2$.
^d-max-schmid

> [!solution]- Solution
> methods: mat-structure-props/schmid
> 1. The slip direction lies in the slip plane, so it is perpendicular to the plane normal; the angle between two directions is at most the sum of their angles to the axis, so $\phi + \lambda \ge 90°$.
> 2. $\cos\phi\cos\lambda = \tfrac12[\cos(\phi-\lambda) + \cos(\phi+\lambda)] \le \tfrac12[1 + 0]$ since $\cos(\phi+\lambda) \le 0$.
> 3. Equality needs $\phi = \lambda$ and $\phi + \lambda = 90°$: both $45°$, with the axis in the plane of the normal and the slip direction.

> [!derive] Show that diffusional creep through the grains gives a strain rate that scales as $D\sigma\Omega/(k_BT d^2)$, where $D$ is the self-diffusion coefficient, $\Omega$ the atomic volume and $d$ the grain size.
^d-nabarro-herring

> [!solution]- Solution
> methods: mat-structure-props/vacancy-eq, scaling
> 1. A boundary under tension $\sigma$ makes vacancy formation easier by the work $\sigma\Omega$, so the vacancy fraction there rises by a relative amount $\sigma\Omega/(k_BT)$ (Theorem 2 with $E_v \to E_v - \sigma\Omega$, for $\sigma\Omega \ll k_BT$); under compression it falls by the same amount.
> 2. That difference sits across a distance of order $d$, so by [Fick's law](sp-oxidation-diffusion.md#^fick) the atom flux per area is of order $(D/\Omega)\,\sigma\Omega/(k_BTd)$, using $D$ as vacancy diffusivity times vacancy fraction.
> 3. Each atom carries volume $\Omega$, so a boundary moves at speed $\sim D\sigma\Omega/(k_BTd)$.
> 4. Strain rate is that speed over the grain size: $\dot\varepsilon \sim D\sigma\Omega/(k_BTd^2)$, linear in stress ($n=1$).

> [!derive] Find the crack growth life from $a_0$ to $a_f$ when the Paris exponent is exactly $m = 2$.
^d-paris-m2

> [!solution]- Solution
> methods: mat-structure-props/paris-life
> 1. With $m = 2$, $dN = da/(C\,Y^2\Delta\sigma^2\pi\,a)$.
> 2. Integrate: $N_f = \dfrac{\ln(a_f/a_0)}{\pi C Y^2 \Delta\sigma^2}$.

> [!derive] A part sees fractions $f_i$ of its cycles at amplitudes $\sigma_i$. Assuming Basquin's law and Miner's rule, prove that it lasts as long as a constant amplitude $\sigma_{eq} = \left(\sum_i f_i \sigma_i^{-1/b}\right)^{-b}$ would.
^d-miner-basquin

> [!solution]- Solution
> methods: mat-structure-props/fatigue
> 1. Basquin inverted: $N_i = \tfrac12(\sigma_i/\sigma_f')^{1/b}$.
> 2. After $n$ total cycles the damage is $\sum f_i n/N_i = 2n\sigma_f'^{1/b}\sum f_i\sigma_i^{-1/b}$.
> 3. At constant $\sigma_{eq}$ it is $2n\sigma_f'^{1/b}\sigma_{eq}^{-1/b}$. Equate and solve for $\sigma_{eq}$. Since $-1/b$ is around 10, the largest amplitudes dominate.

## Problems

> [!problem] Two-phase alloy below a eutectic (d 2.5)
> A binary A-B system has a eutectic at 60 wt% B. At the eutectic temperature, the A-rich solid $\alpha$ holds at most 15 wt% B and the B-rich solid $\beta$ holds at least 95 wt% B. An alloy with 40 wt% B is cooled slowly. (a) Just above the eutectic temperature, what fraction of the mass is solid $\alpha$? (b) Just below it, what fraction is the eutectic mixture, and what fraction of the whole mass is $\alpha$?
^inv-mat-eutectic-fractions

> [!solution]- Solution
> methods: mat-structure-props/lever
> 1. Just above, $\alpha$ (15) coexists with liquid (60): $f_\alpha = (60-40)/(60-15) = 0.444$. This is the primary $\alpha$.
> 2. At the eutectic the remaining liquid, $0.556$ of the mass, freezes into the eutectic mixture.
> 3. Just below, the tie line runs from $\alpha$ (15) to $\beta$ (95): total $f_\alpha = (95-40)/(95-15) = 0.6875$.
> Answer: (a) 0.444; (b) eutectic 0.556, total $\alpha$ 0.688 (0.444 primary plus 0.243 inside the eutectic).

> [!problem] Vacancies frozen in by a quench (d 3)
> A metal has vacancy formation energy 1.0 eV. (a) What fraction of sites is empty at equilibrium at 1300 K, and at 300 K? (b) A sample is quenched from 1300 K to 300 K so fast that the vacancies cannot escape. By what factor does it exceed equilibrium at 300 K, and why does that speed up the first stage of precipitation after a quench?
^inv-mat-quench-vacancy

> [!solution]- Solution
> methods: mat-structure-props/vacancy-eq
> 1. $k_B = 8.617\times10^{-5}$ eV/K. At 1300 K: $e^{-1.0/(0.1120)} = 1.33\times10^{-4}$.
> 2. At 300 K: $e^{-1.0/0.02585} = 1.6\times10^{-17}$.
> 3. Ratio $8.4\times10^{12}$.
> 4. Substitutional atoms move by swapping with vacancies, so the diffusion rate is proportional to the vacancy fraction. The excess makes solute clustering fast at temperatures where equilibrium diffusion would be negligible, until the vacancies drain to sinks (grain boundaries, dislocations).
> Answer: (a) $1.3\times10^{-4}$ and $1.6\times10^{-17}$; (b) about $8\times10^{12}$.

> [!problem] Mean stress on a shaft (d 3)
> A shaft section carries a mean stress of 200 MPa and an alternating stress of 150 MPa. The steel has $S_u = 800$ MPa and a corrected endurance limit of 350 MPa. (a) What is the factor of safety for infinite life if both stresses grow in proportion? (b) If the mean stress were 400 MPa, what alternating stress would give a factor of safety of 1.5?
^inv-mat-shaft-goodman

> [!solution]- Solution
> methods: mat-structure-props/fatigue
> 1. Scaling both stresses by $n$ puts the point on the Goodman line when $n(150/350 + 200/800) = 1$.
> 2. $150/350 + 200/800 = 0.4286 + 0.25 = 0.6786$, so $n = 1.47$.
> 3. For (b): $\sigma_a/350 + 400/800 = 1/1.5$, so $\sigma_a = 350(0.6667 - 0.5) = 58$ MPa.
> Answer: (a) 1.47; (b) 58 MPa. Doubling the mean stress cut the allowed amplitude by more than half.

> [!problem] Edge crack in a cyclically loaded plate (d 3.5)
> A wide steel plate has an edge crack 1.0 mm deep and is loaded remotely from 0 to 100 MPa every cycle. Take $Y = 1.12$ throughout, $K_c = 50$ MPa$\sqrt{\text{m}}$, and $da/dN = 10^{-11}(\Delta K)^3$ with $a$ in metres and $\Delta K$ in MPa$\sqrt{\text{m}}$. (a) At what crack depth does the plate break? (b) How many cycles does it last? (c) Inspection finds cracks 5 mm or deeper. To get two chances to catch a crack before it breaks the plate, how many cycles apart must inspections be?
^inv-mat-crack-plate

> [!solution]- Solution
> methods: mat-structure-props/paris-life
> 1. $a_f = \frac1\pi(50/112)^2 = 0.0634$ m = 63 mm. (A real plate must be much wider than this for constant $Y$ to hold.)
> 2. $C(Y\Delta\sigma\sqrt\pi)^3 = 10^{-11}\,(112\sqrt\pi)^3 = 7.82\times10^{-5}$; with $1 - m/2 = -1/2$, $N_f = \dfrac{a_0^{-1/2} - a_f^{-1/2}}{0.5 \cdot 7.82\times10^{-5}}$.
> 3. $a_0^{-1/2} = 31.62$, $a_f^{-1/2} = 3.97$ m$^{-1/2}$: $N_f = 7.07\times10^5$ cycles (a numerical integration agrees).
> 4. From 5 mm ($a^{-1/2} = 14.14$) to 63 mm: $2.60\times10^5$ cycles.
> 5. Two inspections inside that window need an interval of at most half: $1.30\times10^5$ cycles.
> Answer: (a) 63 mm; (b) $7.1\times10^5$ cycles; (c) every $1.3\times10^5$ cycles. Most of the life (63%) is spent growing from 1 to 5 mm, where the crack cannot be seen.

> [!problem] Solder joint at a hotter operating point (d 4)
> A solder (melting point 217 °C) creeps with $n = 5$ and $Q = 60$ kJ/mol. A joint designed at 25 °C is moved to a product that runs at 100 °C, and a redesign halves its stress. (a) What are the homologous temperatures? (b) By what factor does its secondary creep rate change?
^inv-mat-solder-creep

> [!solution]- Solution
> methods: mat-structure-props/creep
> 1. $T_m = 490$ K: $298/490 = 0.61$ and $373/490 = 0.76$.
> 2. Stress term: $0.5^5 = 1/32$.
> 3. Arrhenius term: $\exp\!\left[\dfrac{60{,}000}{8.314}\left(\dfrac{1}{298.15} - \dfrac{1}{373.15}\right)\right] = e^{4.86} = 130$.
> 4. Product: $130/32 = 4.05$.
> Answer: (a) 0.61 and 0.76; (b) about 4 times faster, even at half the stress.

> [!problem] Particle size for an aluminium alloy (d 4)
> An aluminium alloy ($G = 26$ GPa, $b = 0.286$ nm) is to gain 100 MPa of resolved shear strength from non-shearable spherical particles at volume fraction 0.05. Model the particles of radius $r$ as sitting on a simple cubic array, so the centre spacing is $\lambda = r\,(4\pi/(3f))^{1/3}$ and the clear gap is $\lambda - 2r$. (a) What gap and what radius are needed? (b) Roughly what tensile strength gain does that give in a polycrystal?
^inv-mat-precipitate-size

> [!solution]- Solution
> methods: mat-structure-props/orowan
> 1. Gap from Theorem 5: $L = Gb/\Delta\tau = 26\times10^9 \cdot 0.286\times10^{-9}/10^8 = 74$ nm.
> 2. $(4\pi/0.15)^{1/3} = 4.376$, so $L = r(4.376 - 2) = 2.376\,r$.
> 3. $r = 74/2.376 = 31$ nm.
> 4. Tensile gain $\approx M\Delta\tau = 3.06 \cdot 100 \approx 306$ MPa.
> Answer: (a) gap 74 nm, radius 31 nm; (b) about 300 MPa. Overageing coarsens the particles at fixed $f$, widening the gap and losing strength.
