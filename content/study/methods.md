---
study: methods
---

> Written by a model for Adit. Not Adit's words.

# Methods

The names a settle asks you to tick: which method you called, and which one the solution used. Each method links the basic that teaches it. A solution's `methods:` line uses these ids, or a `basic/anchor` pair when no id fits.

| method | basic |
|---|---|
| small-cases | [found-induction](basics/found-induction.md#^induction) |
| induction | [found-induction](basics/found-induction.md#^induction) |
| strong-induction | [found-induction](basics/found-induction.md#^strong-induction) |
| descent | [found-induction](basics/found-induction.md#^descent) |
| extremal | [found-induction](basics/found-induction.md#^extremal) |
| pigeonhole | [found-induction](basics/found-induction.md#^pigeonhole) |
| invariant | [comb-invariants](basics/comb-invariants.md#^invariant) |
| parity | [comb-invariants](basics/comb-invariants.md#^parity) |
| monovariant | [comb-invariants](basics/comb-invariants.md#^monovariant) |
| colouring | [comb-invariants](basics/comb-invariants.md#^colouring) |
| double-counting | [comb-binomial](basics/comb-binomial.md#^double-count) |
| inclusion-exclusion | [comb-binomial](basics/comb-binomial.md#^incl-excl) |
| generating-function | [comb-recurrences-gf](basics/comb-recurrences-gf.md#^gf-ops) |
| characteristic-polynomial | [comb-recurrences-gf](basics/comb-recurrences-gf.md#^char-poly) |
| linearity-of-expectation | [pr-expectation](basics/pr-expectation.md#^lin-exp) |
| indicators | [pr-expectation](basics/pr-expectation.md#^indicators) |
| probabilistic-method | [pr-expectation](basics/pr-expectation.md#^prob-method) |
| euclid | [nt-divisibility](basics/nt-divisibility.md#^euclid) |
| bezout | [nt-divisibility](basics/nt-divisibility.md#^bezout) |
| factorisation | [nt-divisibility](basics/nt-divisibility.md#^fta) |
| reduce-mod-small | [nt-divisibility](basics/nt-divisibility.md#^cong-arith) |
| crt | [nt-congruence](basics/nt-congruence.md#^crt) |
| order | [alg-groups](basics/alg-groups.md#^order-divides) |
| fermat-euler | [alg-groups](basics/alg-groups.md#^euler) |
| primitive-root | [alg-groups](basics/alg-groups.md#^cyclic-units) |
| burnside | [alg-groups](basics/alg-groups.md#^burnside) |
| valuation | [nt-padic](basics/nt-padic.md#^vp-rules) |
| lifting-the-exponent | [nt-padic](basics/nt-padic.md#^lte-odd) |
| vieta | [alg-polynomials](basics/alg-polynomials.md#^vieta) |
| factor-theorem | [alg-polynomials](basics/alg-polynomials.md#^factor-thm) |
| roots-of-unity-filter | [alg-polynomials](basics/alg-polynomials.md#^rou-filter) |
| interpolation | [alg-polynomials](basics/alg-polynomials.md#^interpolation) |
| telescoping | [an-limits-series](basics/an-limits-series.md#^telescoping) |
| summation-by-parts | [an-limits-series](basics/an-limits-series.md#^abel) |
| comparison | [an-limits-series](basics/an-limits-series.md#^comparison) |
| intermediate-value | [an-mvt-taylor](basics/an-mvt-taylor.md#^ivt) |
| mean-value | [an-mvt-taylor](basics/an-mvt-taylor.md#^mvt) |
| taylor | [an-mvt-taylor](basics/an-mvt-taylor.md#^taylor) |
| riemann-sum | [an-integration](basics/an-integration.md#^riemann) |
| reflection | [an-integration](basics/an-integration.md#^reflection) |
| sum-vs-integral | [an-integration](basics/an-integration.md#^sum-integral) |
| jensen | [ineq-convexity](basics/ineq-convexity.md#^jensen) |
| am-gm | [ineq-convexity](basics/ineq-convexity.md#^am-gm) |
| cauchy-schwarz | [ineq-convexity](basics/ineq-convexity.md#^cauchy-schwarz) |
| rearrangement | [ineq-convexity](basics/ineq-convexity.md#^rearrangement) |
| rank | [la-core](basics/la-core.md#^rank-nullity) |
| determinant | [la-core](basics/la-core.md#^det-props) |
| eigenvalues | [la-core](basics/la-core.md#^eigen) |
| cayley-hamilton | [la-core](basics/la-core.md#^cayley-hamilton) |
| linear-algebra-mod-2 | [la-core](basics/la-core.md#^f2) |
| estimation | [gen-estimation](basics/gen-estimation.md#^fermi) |
| bounding | [gen-estimation](basics/gen-estimation.md#^bounding) |
| dimensional-analysis | [gen-dimensions](basics/gen-dimensions.md#^pi-theorem) |
| scaling | [gen-dimensions](basics/gen-dimensions.md#^scaling) |
| limiting-case | [gen-dimensions](basics/gen-dimensions.md#^limiting-cases) |
| energy-balance | [th-thermo](basics/th-thermo.md#^first-law) |
| resistance-network | [th-conduction](basics/th-conduction.md#^resistance) |
| lumped-capacitance | [th-transient](basics/th-transient.md#^lumped) |
| semi-infinite-solid | [th-transient](basics/th-transient.md#^semi-infinite) |
| exact-constraint | [pd-exact-constraint](basics/pd-exact-constraint.md#^exact-constraint) |
| error-budget | [pd-error-budget](basics/pd-error-budget.md#^budget) |
| uncertainty-propagation | [pd-measurement](basics/pd-measurement.md#^propagation) |
| feedback | [mc-control](basics/mc-control.md#^pid) |
| modal-analysis | [mc-vibration](basics/mc-vibration.md#^modes) |
| state-machine | [dd-fsm](basics/dd-fsm.md#^fsm-template) |
| oversampling | [dd-serial](basics/dd-serial.md#^oversample) |
| gf2-polynomials | [dd-lfsr-crc](basics/dd-lfsr-crc.md#^gf2) |
| reference-model | [dd-verification](basics/dd-verification.md#^ref-model) |
| node-voltage | [el-dc-analysis](basics/el-dc-analysis.md#^node-method) |
| supernode | [el-dc-analysis](basics/el-dc-analysis.md#^supernode) |
| mesh-current | [el-dc-analysis](basics/el-dc-analysis.md#^mesh-method) |
| supermesh | [el-dc-analysis](basics/el-dc-analysis.md#^supermesh) |
| dependent-source | [el-dc-analysis](basics/el-dc-analysis.md#^dependent-sources) |
| method-choice | [el-dc-analysis](basics/el-dc-analysis.md#^choose-method) |
| passive-sign-convention | [el-dc-analysis](basics/el-dc-analysis.md#^psc) |
| power-balance | [el-dc-analysis](basics/el-dc-analysis.md#^power-balance) |
| series-parallel | [el-dc-analysis](basics/el-dc-analysis.md#^series-parallel) |
| superposition | [el-equivalents](basics/el-equivalents.md#^superposition) |
| source-transformation | [el-equivalents](basics/el-equivalents.md#^source-transform) |
| thevenin | [el-equivalents](basics/el-equivalents.md#^thevenin) |
| zeroed-sources | [el-equivalents](basics/el-equivalents.md#^rth-zeroed) |
| open-short-circuit | [el-equivalents](basics/el-equivalents.md#^rth-oc-sc) |
| test-source | [el-equivalents](basics/el-equivalents.md#^rth-test-source) |
| dependent-only | [el-equivalents](basics/el-equivalents.md#^dependent-only) |
| zero-condition | [el-equivalents](basics/el-equivalents.md#^linearity) |
| max-power-transfer | [el-equivalents](basics/el-equivalents.md#^max-power) |
| capacitor-law | [el-cap-ind](basics/el-cap-ind.md#^cap-law) |
| inductor-law | [el-cap-ind](basics/el-cap-ind.md#^ind-law) |
| capacitor-integral | [el-cap-ind](basics/el-cap-ind.md#^cap-integral) |
| inductor-integral | [el-cap-ind](basics/el-cap-ind.md#^ind-integral) |
| stored-energy | [el-cap-ind](basics/el-cap-ind.md#^energy) |
| continuity | [el-cap-ind](basics/el-cap-ind.md#^continuity) |
| dc-steady-state | [el-cap-ind](basics/el-cap-ind.md#^dc-steady) |
| combine-capacitors | [el-cap-ind](basics/el-cap-ind.md#^combine-c) |
| combine-inductors | [el-cap-ind](basics/el-cap-ind.md#^combine-l) |
| combine-initial-values | [el-cap-ind](basics/el-cap-ind.md#^combine-ic) |
| trapped-energy | [el-cap-ind](basics/el-cap-ind.md#^trapped-energy) |
| first-order-reduction | [el-first-order](basics/el-first-order.md#^first-order-form) |
| switching-recipe | [el-first-order](basics/el-first-order.md#^recipe) |
| general-solution | [el-first-order](basics/el-first-order.md#^general-solution) |
| zero-plus-circuit | [el-first-order](basics/el-first-order.md#^zero-plus) |
| sequential-switching | [el-first-order](basics/el-first-order.md#^sequential) |
| controlled-source-tau | [el-first-order](basics/el-first-order.md#^dependent-tau) |
| energy-decay | [el-first-order](basics/el-first-order.md#^energy-decay) |
| time-to-value | [el-first-order](basics/el-first-order.md#^time-to-value) |
