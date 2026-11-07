# Retro calls

A retro call is a call made when the answer already exists, in a file written weeks ago. It is weaker evidence than a live call. The answer is one open file away, and the only honesty in it is not opening that file first. The project pages leak too, so call before rereading them. It is still worth doing: the first calls will miss, and the misses are the portable part. Two projects were modelled by an AI tool. The questions below are the decision points of those models, written so as not to say what was chosen. Use the domains retro-furnace and retro-asic, so the readout keeps these apart from live calls. For each question, type a call line in calls.md (model, assumptions, fidelity, confidence) before opening the pointer. Then open the pointer and type the settle line. Fifteen seconds per call. Pointers name the repo (both under Documents/) and are relative to its root. Line numbers are as of 2026-11-07.

## Tube furnace

1. How many spatial dimensions would you give the furnace model, and what does that choice throw away?
   settle against: furnacev2, furnace/modules/m1_thermal/model.py, module docstring (lines 1 to 80) and build_model (line 505).

2. Heat leaves the winding by more than one path. List the paths you can think of, then say which you would carry explicitly, which you would drop, and what that costs.
   settle against: furnacev2, furnace/modules/m1_thermal/model.py, build_model blocks "conductances" (line 631), "radial loss tables" (line 655), "axial conduction of the insulation sleeve" (line 666) and "point sinks" (line 718); furnace/modules/m1_thermal/properties.py K_rad_coeff (line 63), square_shape_factor (line 90), radial_stack (line 106).

3. What would you set at each boundary, the two tube ends, the box surface and the box end faces? What does each exchange with, and how?
   settle against: furnacev2, furnace/modules/m1_thermal/model.py, docstring "Point sinks" (lines 16 to 21) and "end_condition = free" (lines 39 to 41), build_model w_end (lines 513 to 521); furnace/designs.py v1() (line 68, end_condition at line 105).

4. Of the inputs nobody has measured (dimensions, resistance, supply, where the thermocouple sits and what it reads), which would you sweep, over what ranges, and which would you hold at one value? How many would that leave in the sweep?
   settle against: furnacev2, studies/v1/common.py INPUTS and GROUP1_NOT_INPUTS (lines 70 to 110); params/v1_build.yaml, the status field on every v1.* key (lines 5 to 47); furnace/modules/m2_dynamics/transient.py sensor_reading_K (line 79).

5. Which numbers on the page need the clock running and which come from a steady solve? For the ones that need time, what integrator, what step, and what initial state?
   settle against: furnacev2, furnace/modules/m1_thermal/steady.py solve_steady (line 105); furnace/modules/m2_dynamics/transient.py module docstring (lines 1 to 27), simulate (line 167) and runaway_time_s (line 391), beside furnace/modules/m2_dynamics/lumped.py runaway_time_s (line 70).

6. How would you let the conductivity of the blanket, the quartz and the cement depend on temperature, and how would you average it across a layer with hundreds of kelvin across it?
   settle against: furnacev2, furnace/modules/m1_thermal/properties.py Poly2, fit_k and material_k (lines 19 to 55); params/m1_thermal.yaml, the k_table_T_C and k_table_W_mK entries of every material (lines 9 to 50).

7. What would the tests have to test for you to trust the model: analytic limits, conservation, grid order, regression against stored numbers, agreement with measurement? Guess the split across those kinds, and the count.
   settle against: furnacev2, tests/verification/ (count the files and collect the tests yourself; the page gives its own count), starting with test_M1_verification.py (line 25 onward) and test_M1_radial_transient.py (line 31 onward).

8. How would you rank the cold measurements: one input at a time, a full factorial, a screening design, a fitted surrogate? What quantity would the rank be in, and how many model runs would it cost?
   settle against: furnacev2, studies/v1/rank_measurements.py, module docstring (from line 1), morris_study (line 37) and group1_table (line 90).

9. Which oxidants would you give room air, how would more than one combine in a single rate law, and how does a thin oxide start?
   settle against: furnacev2, furnace/modules/m4_oxidation/oxidation.py, module docstring (from line 1), rate_constants (line 60), _AB (line 78) and grow (line 93); params/m4_oxidation.yaml, the m4.thin.* and m4.valid.mixed_B_fraction entries (lines 18 to 31).

## ASIC reverse engineering

1. At what level would you simulate the chip? What would a simulator at that level need to know about each unit it simulates, and where would that knowledge come from?
   settle against: asic-puzzle-2026, toolchain/netlist_model.py Model.__init__ (lines 10 to 45); toolchain/sky130_funcs.py build_cell_fn (line 23) and the spot checks (lines 78 to 91).

2. Which GDS layers would you read for connectivity and which would you ignore? What is lost by ignoring them, and what goes wrong if you do not?
   settle against: asic-puzzle-2026, toolchain/extract/extract_netlist.py, docstring "Key design decisions" (lines 1 to 16), the LayoutToNetlist call (line 104) and flatten_circuit (line 185).

3. How would you treat time? What property of the chip would let you treat it more simply than the general case, and how would you check that the chip has it?
   settle against: asic-puzzle-2026, toolchain/netlist_model.py Sim docstring and step() (lines 64 to 89), clock_nets (line 30); blog_notes.md (line 21) and blog_post.md (line 94), the clock-tree trace.

4. Before solving, what would you assume about the key: its length, where it sits relative to reset and enable, what the flops hold at reset, how many idle cycles after it? Where does each assumption come from?
   settle against: asic-puzzle-2026, toolchain/solve_unlock.py main (lines 17 to 43, reset state at line 26); toolchain/run_unlock.py docstring (lines 1 to 4); decision_log.md, the "[T+0:20]" entry (line 76).

5. What would make a search over every possible input tractable, and what would make it hopeless? What in the netlist tells you which before you start?
   settle against: asic-puzzle-2026, toolchain/solve_unlock.py (lines 31 to 43); decision_log.md, the "[T+0:20]" entry, first paragraph (lines 76 to 79).

6. What evidence would you accept that the simulator is the chip? For each piece of evidence you would collect, what would it miss?
   settle against: asic-puzzle-2026, toolchain/validate_warmup.py build and main (lines 36 to 63); toolchain/replay_vcd.py main (lines 29 to 53); toolchain/run_unlock.py run (line 10); SOLUTION.md (lines 40 to 43).

7. What would count as proof that the key is the only one, and what would it cost?
   settle against: asic-puzzle-2026, toolchain/unlock_solutions_N121.txt; decision_log.md (lines 82 to 83). The run that produced that file is described there; its code is not in toolchain/solve_unlock.py and was not found elsewhere in the repo.

8. One net has no driver and feeds two cells. What would you do with it, and what result would let you stop?
   settle against: asic-puzzle-2026, toolchain/netlist_model.py float_nets (lines 11 to 15 and 27 to 28); validation.md (lines 41 to 44).

9. Reading the flop roles off the netlist: what would you hold fixed (how the flops group, the bit order within a group, the placement) and what would you let the chip's own behaviour tell you? And for the region map, how would you recover it, and how many runs or reads would that take?
   settle against: asic-puzzle-2026, toolchain/analyze_structure.py cone (line 15); toolchain/star_battle/roles.py (lines 1 to 32); toolchain/star_battle/recover_regions.py main (lines 14 to 30).

## Live domains

Putnam practice uses the domain math; the exam itself, 2026-12-05, uses putnam. A problem archive with solutions to settle against: https://kskedlaya.org/putnam-archive/ (answered HTTP 200 on 2026-11-07).
The Jane Street ASIC, due 2027-01-18, uses the domain asic. It has no retro questions here because no answer exists yet.
Its first call must predate the first tool prompt on the project.
