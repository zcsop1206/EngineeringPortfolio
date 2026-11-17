---
study: card
id: card-cact
title: "CACT condenser: numbers card"
area: [th, pd]
needs: [th-conduction, th-two-phase, th-thermo, th-convection, th-electronics-cooling, pd-measurement, pd-error-budget]
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [th-conduction](../basics/th-conduction.md), [th-two-phase](../basics/th-two-phase.md), [th-thermo](../basics/th-thermo.md), [th-convection](../basics/th-convection.md), [th-electronics-cooling](../basics/th-electronics-cooling.md), [pd-measurement](../basics/pd-measurement.md), [pd-error-budget](../basics/pd-error-budget.md). ^needs

Source: the public page /projects/cact/. Every answer below quotes that page and names its section. In an interview, say nothing about this project that this card does not hold. ^source

## Numbers

> [!recall] CACT: the substrate-to-condenser thermal resistance, charged and dry, at the powers tested, with units.
^n1

> [!solution]- Answer
> Section 6.3 (Thermal resistance): 0.074 K/W charged at 410 W. Dry: 0.260 K/W at 73 W, 0.271 at 186 W, 0.282 at 261 W. Charged is 3.5 to 3.8 times lower. The dry values are lower bounds: the dry run has no energy balance, so some electrical power left to the room. Per unit heater area: 0.67 cm²·K/W charged against 2.3 to 2.5 dry.

> [!recall] CACT: the steady-state power in the charged run (voltage, current, heat flux) and the test that it was steady.
^n2

> [!solution]- Answer
> Section 6 (Results) and 5.2 (Test rig): 410 W, 118 V at 3.47 A, into a 30 × 30 mm heater face, so 46 W/cm². Water at a 70% fill, 2.7 mL in a 3.9 mL channel; chiller at 380 mL/min, inlet raised in steps to 30 °C. Section 6.1: steady because no channel moved more than 0.2 °C between the start and the end of the last five minutes.

> [!recall] CACT: the energy balance at 410 W: the water temperature rise, the flow, the heat carried, and how far to trust it.
^n3

> [!solution]- Answer
> Section 6.1: the water rose 16.6 °C across the condenser at 380 mL/min, which is 437 W against 410 W electrical: the balance closes at 107%. The coolant cannot carry more than the heater supplies, so the 7% is the combined error of the flow reading and the two water thermocouples. Earlier in the run the coolant pickup went from about 300 W to about 370 W while the copper drops (so the heater power) did not change, so the coolant measurement is good to about 20%, not 7%.

> [!recall] CACT: the temperature budget from heater block to chiller inlet at 410 W, its three steps, and the single largest contributor inside them.
^n4

> [!solution]- Answer
> Section 6.3: heater block to chiller inlet is 0.26 K/W, 107 °C at 410 W, in three roughly equal parts: 32 °C heater block to substrate centre, 39 °C substrate centre to condenser, 35 °C condenser to chiller inlet. Section 7: of the 32 °C step, about 5 °C is the 4.5 mm of copper at 46 W/cm²; the other 27 °C is the thermal paste joint, about 0.6 cm²·K/W, as large as anything the chamber does. The paste, its thickness and the clamp pressure were not recorded.

> [!recall] CACT: what the 2-D plate fit to the eight substrate beads recovers, how closely, and which fitted parameter changes between charged and dry.
^n5

> [!solution]- Answer
> Section 6.5 (Temperature field): power is not an input; the fit returns 441 W against 410 W electrical charged, and 74, 198 and 262 W against 73, 186 and 261 W dry: within 8%. RMS error at the beads 1.1 to 4.5 °C. The conductance per area to the condenser, $g$, is 4300 W/m²K charged against 1000 to 1100 dry: the chamber changes $g$ by a factor of four. The charged fit lands on the same value as the coolant balance.

## Decisions

> [!recall] CACT: which port size the built condenser uses, over which alternative, and why.
^d1

> [!solution]- Answer
> Section 3.1 (Design basis and alternatives): 1/4 NPT push-to-connect over 3/8 NPT, because the copper stock available set the block thickness and the 3/8 NPT port did not fit within it. Both versions were drawn with GD&T, each with two thermocouple bores. Section 3.2: the push-to-connect fittings seal on the taper without a gasket.

> [!recall] CACT: why copper replaced the previous build's top plate.
^d2

> [!solution]- Answer
> Section 1 (Background) and the Summary: the previous build's polycarbonate top plate, conductivity around 0.2 W/m·K, gave almost no condensing surface. The device never reached steady state: internal pressure climbed to the 25 psi relief valve and the flow became valve-driven. The top plate was identified as the root cause, so a C110 copper condenser over polycarbonate, because the vapor needs a surface it can condense on.

> [!recall] CACT: how the drawing set its tolerances, over what default, and why.
^d3

> [!solution]- Answer
> Section 3.3 (Tolerancing): only the tolerances that matter for the assembly, over blanket tight limits. Datum A is the vapor-side face; the bolt pattern and channel ports carry Ø0.5 mm positional tolerances to A, B, C so the block lines up with the existing substrate, gasket and clamp plate; general tolerances 0.1 mm linear and 0.5° angular. Flatness of the sealing face is controlled on the drawing but was not measured after machining. Section 9: the tolerances came from the mating parts, not from habit.

## Failure

> [!recall] CACT: the hypothesis the test did not meet, by how much, and what the plate fit says the miss means.
^f1

> [!solution]- Answer
> Section 5.3: the hypothesis was that with the condenser fitted the centre-to-edge gradient falls below 1 °C. Section 6.4: the centre ran 17.6 °C above the edge at 410 W (26.9 °C spread over the 8 substrate channels). Per watt it is 43 mK/W charged against 44 to 47 dry, the same, so the substrate did not show the spreading the sawtooth structure is meant to produce. Section 6.5: that gradient is what 5 mm of copper gives carrying that power outward, charged or dry. Section 7: the beads sit in the copper, so they cannot resolve where vapor forms or condenses. Section 8: next is a chamber pressure log and a window insert, condenser-face thermocouples, or a charged run on a substrate with no sawtooth.

## Story

> [!recall] CACT: the two-minute story, in five lines.
^s1

> [!solution]- Answer
> 1. Object: a C110 copper condenser, 90 × 90 × 17.7 mm, designed to a GD&T drawing and machined on a manual mill, for a wickless flat-plate heat pipe pumped by a sprayed asymmetric sawtooth; it replaced a polycarbonate top plate with which the device never reached steady state.
> 2. Hard part: the Ø1.2 mm thermocouple bores, 25 mm deep in gummy copper; one bit broke and lodged in the part, and the rest went through with short pecks, clearing chips between each.
> 3. Measured: 14 thermocouples, two-point calibrated in ice and boiling water, on a DAQ; a charged run at 70% fill and a dry control.
> 4. Number: steady at 410 W (46 W/cm²); substrate to condenser 0.074 K/W charged against 0.26 to 0.28 dry; the heat balance closes at 107%.
> 5. What it changed: the device reaches steady state and the heat arrives in the chiller water; uniformity was not met, the paste joint costs as much as the chamber, and the next experiments start with the flow inside the chamber.

## Follow-ups

What a technical follow-up probes, and where it is taught. ^follow-ups

- The resistance network from heater to water, and where a contact joint sits in it: [resistance](../basics/th-conduction.md#^resistance), [contact](../basics/th-conduction.md#^contact). ^fu-network
- Why the centre runs hotter than the edge: [spreading](../basics/th-conduction.md#^spreading). ^fu-spreading
- How a vapor chamber moves heat and what limits it: [vapor chamber](../basics/th-two-phase.md#^vapor-chamber), [capillary](../basics/th-two-phase.md#^capillary), [heat pipe limits](../basics/th-two-phase.md#^heat-pipe-limits). ^fu-chamber
- Why the unlogged chamber pressure matters: [saturation](../basics/th-two-phase.md#^saturation), [Clausius-Clapeyron](../basics/th-thermo.md#^clausius-clapeyron). ^fu-pressure
- The coolant energy balance: [first law](../basics/th-thermo.md#^first-law). ^fu-balance
- The water-side third of the budget and the laminar channels: [internal flow](../basics/th-convection.md#^internal). ^fu-water
- Paste joints and how a package datasheet states resistance: [TIM](../basics/th-electronics-cooling.md#^tim), [junction metrics](../basics/th-electronics-cooling.md#^junction-metrics), [cold plate](../basics/th-electronics-cooling.md#^cold-plate). ^fu-tim
- Bead calibration, bead position, and the error on a heat balance: [thermocouple](../basics/pd-measurement.md#^thermocouple), [calibration](../basics/pd-measurement.md#^calibration), [propagation](../basics/pd-measurement.md#^propagation). ^fu-measure
- Datums and positional tolerance: [GD&T](../basics/pd-error-budget.md#^gdt). ^fu-gdt
