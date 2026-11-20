---
study: tracks
---

# Tracks

What the study view schedules toward. Edit the dates and weights here; nothing else needs changing. A track with no date is scheduled at weight only. Dates are `YYYY-MM-DD`; a range is `a to b`. Weight 0 pauses a track.

Near a deadline, review intervals for the track's basics are capped at a third of the days left, and Today ranks the track's drills first.

The `ready` column says what ready means, for the daily plan in `plan/` (the study view ignores it). Clauses are separated by `;`, in priority order: `learn <docs> by <date>` (80% of each doc's proofs fogged), `try <docs> by <date>` (every problem in the doc's Try list settled), `kata <ids>` (passed), `recall <cards>` (each drilled clean once), `stage <n>` (every basic in a learn clause at stage n or more by the deadline), `taper <n>` (the last n days get drills only), and `then <clause>` for work done only if everything before it fits. Interviews and exams are paused (weight 0) until the finals are dated.

| track | deadline | weight | areas | docs | ready |
|---|---|---|---|---|---|
| mie342 | 2026-11-18 | 3 | el | basics el-dc-analysis, el-equivalents, el-cap-ind, el-first-order; topics mie342-test2; bank mie342 | |
| putnam | 2026-12-05 | 3 | nt comb an la gen | basics nt-*, alg-*, comb-*, pr-*, an-*, ineq-*, la-core, found-induction, gen-*; topics putnam-*; bank putnam | learn alg-polynomials nt-congruence by 2026-11-22; try putnam-polynomials by 2026-11-22; learn an-limits-series an-integration ineq-convexity by 2026-11-27; try putnam-sums-limits by 2026-11-27; stage 2; taper 2; then try putnam-number-theory putnam-counting; then learn nt-divisibility |
| asic | 2026-12-21 | 2 | dd | basics dd-*; katas k-* | learn dd-verilog dd-sequential dd-fsm by 2026-12-12; learn dd-serial by 2026-12-17; kata k-shift-out k-uart-tx by 2026-12-17; learn dd-verification dd-asic-flow by 2026-12-19 |
| interviews | 2027-01-11 | 0 | th mc pd sp op el mat gen | basics th-*, mc-*, pd-*, sp-*, op-*, el-*, mat-*, am-*; cards card-* | |
| exams | 2026-12-10 to 2026-12-22 | 0 | th | fluids basics (wave 2), once the MIE312 final date is known | |
