---
study: registry
---

> Written by a model for Adit. Not Adit's words.

# Registry

Every study doc, planned or written: its id, area, the basics it stands on, the anchors other docs may link to, and its wave. Writers link only to anchors listed here (or to a doc's top). A doc's own other anchors are its own business. Format: `obsidian-notebook/docs/study/FORMAT.md`.

Wave 1 is written for the next deadlines (Putnam 2026-12-05, the ASIC entry 2026-12-21, the January application round); the four circuits basics and their topic were added 2026-11-18 for MIE342 test 2 and serve the course's final too. Wave 2 is scheduled in the timeline; wave 3 waits for a reason.

## Basics, wave 1

| id | title | area | needs | key anchors |
|---|---|---|---|---|
| nt-divisibility | Divisibility, gcd and unique factorisation | nt | | div-alg euclid bezout euclid-lemma fta cong-def cong-arith cong-cancel |
| nt-congruence | Units mod n and the Chinese remainder theorem | nt | nt-divisibility | unit-gcd lin-cong crt crt-units phi-formula wilson |
| nt-padic | Valuations, Legendre's formula and lifting the exponent | nt | nt-divisibility nt-congruence | vp-def vp-rules legendre kummer lte-odd lte-two hensel |
| alg-groups | Groups, Lagrange and primitive roots | nt | nt-congruence | group-def subgroup lagrange order-divides fermat euler cyclic-units actions burnside |
| alg-polynomials | Polynomials: division, roots and roots of unity | nt | nt-divisibility | poly-div factor-thm vieta rational-root gauss-lemma field-roots interpolation finite-differences roots-unity rou-filter |
| comb-binomial | Counting two ways: binomial identities and inclusion-exclusion | comb | | binom-def pascal double-count vandermonde hockey-stick stars-bars incl-excl lucas |
| comb-recurrences-gf | Linear recurrences and generating functions | comb | comb-binomial alg-polynomials | fps gf-ops partial-fractions char-poly repeated-roots matrix-power gf-from-recurrence convolution |
| pr-expectation | Expectation, indicators and the probabilistic method | comb | comb-binomial | prob-space lin-exp indicators cond-exp total-exp symmetry prob-method markov |
| found-induction | Induction, descent, the extremal principle and pigeonhole | gen | | induction strong-induction well-ordering descent extremal pigeonhole pigeonhole-gen |
| comb-invariants | Invariants, monovariants and colourings | comb | found-induction | invariant parity monovariant colouring potential termination |
| an-limits-series | Limits, series and summation by parts | an | | eps-n monotone cauchy-seq comparison ratio-root telescoping abel stolz |
| an-mvt-taylor | Continuity, the mean value theorem and Taylor | an | an-limits-series | ivt extreme-value rolle mvt cauchy-mvt lhopital taylor |
| an-integration | Integrals, Riemann sums and symmetry | an | an-limits-series an-mvt-taylor | ftc riemann sum-integral reflection ibp improper diff-under |
| ineq-convexity | Convexity and the classical inequalities | an | an-mvt-taylor | convex-def jensen am-gm cauchy-schwarz rearrangement power-means holder tangent-line |
| la-core | Linear algebra: rank, determinants and eigenvalues | la | | rank-nullity det-props det-multiplicative eigen cayley-hamilton trace f2 similar |
| gen-estimation | Estimation and orders of magnitude | gen | | fermi bounding logs sanity unit-chains |
| gen-dimensions | Dimensions, scaling and limiting cases | gen | la-core | homogeneity pi-theorem scaling limiting-cases symmetry-check |
| dd-boolean-cmos | Boolean logic and CMOS gates | dd | | boolean-algebra de-morgan canonical-forms cmos-inverter cmos-gates rc-delay dynamic-power fanout |
| dd-sequential | Flip-flops, clocks and timing | dd | dd-boolean-cmos | latch-ff setup-hold max-freq hold-check clock-skew metastability synchronizer reset |
| dd-verilog | Synthesisable Verilog | dd | dd-sequential | module-ports comb-always seq-always blocking widths inferred-latch case sim-synth |
| dd-fsm | Finite state machines and handshakes | dd | dd-sequential dd-verilog | moore-mealy encoding fsm-template counters valid-ready fsm-check |
| dd-serial | Serial links: UART, SPI and I2C | dd | dd-fsm | uart-frame baud oversample spi-modes i2c-bus i2c-conditions i2c-ack clock-domain |
| dd-lfsr-crc | LFSRs and CRCs over GF(2) | dd | alg-polynomials dd-sequential | gf2 lfsr-forms max-length crc-division crc-shift-register crc-detects |
| dd-verification | Testbenches and reference models | dd | dd-verilog | tb-structure ref-model self-checking stimulus coverage first-mismatch assertions |
| dd-asic-flow | From RTL to GDS: synthesis, timing and an open tapeout | dd | dd-sequential dd-verilog | synthesis std-cells sta pnr drc-lvs area-budget open-pdk |
| th-thermo | Thermodynamics: the two laws and the cycles that use them | th | | first-law enthalpy second-law entropy-gen carnot vapor-compression cop clausius-clapeyron |
| th-conduction | Conduction and thermal resistance | th | | fourier heat-eq resistance contact spreading fins fin-efficiency biot |
| th-transient | Transient conduction and thermal time constants | th | th-conduction | lumped time-constant semi-infinite contact-temperature penetration rc-networks |
| th-convection | Convection: boundary layers, correlations and heat exchangers | th | th-conduction | newton groups bl-scaling external internal natural lmtd ntu |
| th-two-phase | Boiling, condensation, heat pipes and vapor chambers | th | th-thermo th-convection | saturation boiling-curve chf film-condensation capillary heat-pipe-limits vapor-chamber |
| th-electronics-cooling | Electronics cooling and thermal test | th | th-conduction th-convection th-transient | junction-metrics tim heat-sink cold-plate test-vehicle transient-test structure-function |
| pd-measurement | Measurement, sensors and uncertainty | pd | | uncertainty propagation calibration thermocouple rtd response sampling noise |
| mc-solids | Stress, strain, beams and buckling | mc | | stress hooke mohr bending deflection torsion buckling yield-criteria |
| mc-vibration | Vibration: one and many degrees of freedom | mc | la-core | sdof damping frf isolation modes rayleigh |
| mc-control | Feedback control | mc | mc-vibration | transfer-fn pid stability bode margins state-space observer mpc discrete |
| pd-exact-constraint | Exact constraint, kinematic couplings and flexures | pd | mc-solids | dof exact-constraint kinematic-coupling hertz flexure parallelogram overconstraint |
| pd-error-budget | Error budgets, Abbe and thermal drift | pd | pd-exact-constraint th-conduction pd-measurement | abbe cosine budget thermal-drift stack gdt accuracy-terms |
| op-wave | Wave optics: interference, diffraction and imaging | op | | superposition thin-film michelson diffraction airy fourier-optics coherence gaussian-beam |
| sp-oxidation-diffusion | Oxidation, diffusion and implant | sp | th-transient op-wave | deal-grove oxide-colour fick profiles arrhenius implant anneal |
| sp-vacuum-plasma | Vacuum and plasma | sp | | kinetic mean-free-path conductance pumpdown pumps-gauges debye sheath paschen |
| sp-litho | Lithography: resolution, focus and overlay | sp | op-wave | resolution dof resist projection overlay euv alignment |
| sp-deposition-etch | Deposition and etch | sp | sp-vacuum-plasma | cvd ald pvd step-coverage wet-etch rie selectivity |
| sp-yield-spc | Yield and statistical process control | sp | pr-expectation | poisson-yield clustered-yield control-charts capability doe |
| mat-structure-props | Materials: structure, defects and properties | mat | | crystal defects dislocations strengthening phase-diagram creep fatigue |
| am-polymer | Photopolymer and powder-bed polymer printing | mat | th-transient mat-structure-props | photopolymer working-curve oxygen-inhibition sls-window sintering shrinkage |
| am-metal | Laser powder bed fusion | mat | th-transient mat-structure-props | energy-density rosenthal melt-pool-modes porosity residual-stress supports |
| el-power-batteries | Circuits, power conversion and battery cells | el | | rlc phasors buck switching-loss cell-model soc-ocv cell-thermal bms |
| el-dc-analysis | Node voltages and mesh currents | el | | kcl kvl psc power-balance series-parallel node-method supernode mesh-method supermesh dependent-sources choose-method |
| el-equivalents | Thevenin, Norton and superposition | el | el-dc-analysis | linearity superposition source-transform thevenin norton rth-zeroed rth-oc-sc rth-test-source dependent-only max-power |
| el-cap-ind | Capacitors and inductors | el | el-dc-analysis | cap-law ind-law cap-integral ind-integral energy continuity dc-steady combine-c combine-l combine-ic trapped-energy |
| el-first-order | RC and RL circuits | el | el-cap-ind el-equivalents | first-order-form tau natural step general-solution recipe zero-plus sequential dependent-tau energy-decay time-to-value |

## Topics, wave 1

| id | title | area | needs |
|---|---|---|---|
| putnam-number-theory | Number theory: first moves | nt | nt-divisibility nt-congruence nt-padic alg-groups |
| putnam-polynomials | Polynomials: first moves | nt | alg-polynomials nt-divisibility an-mvt-taylor |
| putnam-sums-limits | Sums, integrals and limits: first moves | an | an-limits-series an-integration ineq-convexity |
| putnam-counting | Counting and probability: first moves | comb | comb-binomial comb-recurrences-gf pr-expectation comb-invariants |
| mie342-test2 | MIE342 test 2: circuits | el | el-dc-analysis el-equivalents el-cap-ind el-first-order |

## Katas, wave 1 (digital design, incremental)

| id | title | needs | level | d |
|---|---|---|---|---|
| k-shift-out | Parallel-in, serial-out with a load strobe | dd-sequential dd-verilog | simple | 1.5 |
| k-sync-fifo | Synchronous FIFO with full and empty | dd-fsm | simple | 2.5 |
| k-uart-tx | UART transmitter, 8N1 | dd-serial dd-fsm | simple | 2.5 |
| k-uart-rx | UART receiver with oversampling | dd-serial dd-fsm | hard | 3.5 |
| k-spi-mode0 | SPI mode 0 controller, one byte | dd-serial | simple | 3 |
| k-i2c-bits | I2C start, stop and one bit on an open-drain bus | dd-serial | hard | 4 |

## Numbers cards, wave 1

| id | public page |
|---|---|
| card-cact | /projects/cact/ |
| card-tubefurnace | /projects/tubefurnace/ |
| card-stepper | /projects/stepper/ |
| card-openvinyl | /projects/openvinyl/ |
| card-asic-puzzle | /projects/asicpuzzle2026/ and /projects/asicpuzzle2026-starbattle/ |
| card-topoprint | /projects/topoprint/ |
| card-sls | /notes/sls/ |

## Wave 2 (scheduled in the timeline)

| id | title | area | why |
|---|---|---|---|
| fl-kinematics, fl-rtt, fl-conservation, fl-differential, fl-stress, fl-statics, fl-bernoulli, fl-vorticity | fluids, from drafts/study-mode-design.md A | th | MIE312 final |
| m-vector-calculus, m-odes | vector calculus, ODEs | an | fluids and vibration |
| geo-complex | the complex plane, rotations, area as a determinant | la | Putnam geometry |
| comb-graphs | graphs: degree sums, trees, Euler, Hall | comb | Putnam and verification |
| ca-accelerators | dataflow, systolic arrays, roofline, numerics | ca | chip interviews |
| ca-memory | memory hierarchy, SRAM, bandwidth | ca | chip interviews |
| dd-fpga | LUTs, block RAM, timing closure on an FPGA | dd | ASIC entry FPGA run |
| sp-devices | the pn junction and the MOSFET | sp | fab and chip interviews |
| sp-packaging | flip chip, 2.5D and 3D, warpage and thermal | sp | packaging interviews |
| sp-test | wafer test, ATE, design for test | sp | test-equipment interviews |
| op-geometric | imaging, aberrations, ray matrices | op | metrology and optics interviews |
| op-photonics | waveguides, modes, coupling, modulators | op | photonics interviews |
| mc-fea | the finite element method from a spring to a plate | mc | every mechanical interview |
| mc-fatigue | fatigue and fracture | mc | reliability interviews |
| mfg-processes | machining, moulding, sheet metal, design for manufacture | mat | product design interviews |
| el-analog | op-amps, filters, sampling and ADCs | el | test and instrumentation |

## Wave 3 (when a reason appears)

qc-basics (qubits and gates), qc-cryo (dilution refrigerators, heat loads at millikelvin), bio-neural-interfaces (electrodes, impedance, stimulation limits), rb-kinematics (serial manipulators, Jacobians), fu-basics (confinement, the Lawson criterion), el-magnetics (inductors, transformers, superconducting magnets).
