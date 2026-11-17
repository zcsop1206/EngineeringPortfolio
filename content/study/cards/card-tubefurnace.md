---
study: card
id: card-tubefurnace
title: "Tube furnace rework: numbers card"
area: [th, sp, mc]
needs: [th-conduction, th-transient, th-convection, mc-control, sp-oxidation-diffusion, pd-measurement, sp-yield-spc]
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [th-conduction](../basics/th-conduction.md), [th-transient](../basics/th-transient.md), [th-convection](../basics/th-convection.md), [mc-control](../basics/mc-control.md), [sp-oxidation-diffusion](../basics/sp-oxidation-diffusion.md), [pd-measurement](../basics/pd-measurement.md), [sp-yield-spc](../basics/sp-yield-spc.md). ^needs

Source: the public page /projects/tubefurnace/. Every number on it is a model prediction with a band; nothing has been measured yet. Say "predicted" every time. Every answer below quotes the page and names its section. ^source

## Numbers

> [!recall] Tube furnace: the predicted ±5 °C flat zone at 1000 °C, its band, the hand value, and the figure with end plugs.
^n1

> [!solution]- Answer
> Section 5 (Predictions for the first run): 26 mm about the centre with open ends, band 17 to 41 mm over the unmeasured inputs, moved most by the wound length; hand estimate about 30 mm; 25 mm with the radial blanket nodes. The band is the minimum and maximum over a screening sample, not a confidence interval. Section 3: 34 mm with 20 mm plugs. A commercial furnace with the same 150 mm heated length quotes 58 mm at ±5 °C with plugs fitted.

> [!recall] Tube furnace: the axial decay length, with and without the blanket, against the wound length, and what it does to the profile.
^n2

> [!solution]- Answer
> Section 4 (The model): the tube obeys a fin equation; an end deficit decays as $e^{-s/\ell}$ with $\ell = \sqrt{K/G}$. $\ell$ is 6.6 cm from the tube and bore alone and 8.8 cm with the blanket's own axial conduction, against a 150 mm wound length. The two end regions overlap completely: no plateau, a single arch, and the only flat zone is its top. Figure 2: the winding ends sit 190 K below the centre with the blanket lumped, 200 to 300 K with radial blanket nodes.

> [!recall] Tube furnace: the runaway time if the relay fails closed, the heating rate, and the power ratio behind it.
^n3

> [!solution]- Answer
> Section 5: 48 s from 1000 °C to the 1165 °C quartz limit (band 19 to 310 s, moved most by the element's cold resistance), about 3 K/s, because the heater is twelve times the losses: 748 W against 61 W. The hand estimate is slower, about 2 K/s (102 s to 1200 °C). The limiter has to act within tens of seconds.

> [!recall] Tube furnace: the element temperature and surface load at full power, and the limit the load is compared with.
^n4

> [!solution]- Answer
> Section 5: element 1153 °C (band 1040 to 1326 °C) and surface load 6.9 W/cm² (band 1.5 to 17), both moved most by the element's cold resistance; the hand calculation gives the same 1153 °C and 6.9 W/cm². Section 8: the limit used for the nichrome is 2 W/cm², and whether that is the right vendor number is an open item. Section 9: a rewind alone does not fix the 6.9 W/cm² full-power load.

> [!recall] Tube furnace: why room humidity matters as much as oxygen for the oxide: the partial pressures, the rate-constant ratio, the two regimes, and the predicted thickness.
^n5

> [!solution]- Answer
> Section 5: at 1000 °C the parabolic rate constant per atmosphere is about 30 times larger for water than for oxygen; room air at 20 °C and 50% RH holds 0.012 atm of water against 0.21 atm of oxygen. In the parabolic term water comes out 1.7 times oxygen; in the linear term, which governs a 40 nm oxide (well under the 150 nm crossover), oxygen comes out 1.6 times water. Neither dominates, so a dry oxidation here depends on the weather. Predicted 44 nm at the centre after 60 min (39 to 55 nm), 35 nm after 30 min. A hygrometer reading per run is the cheapest valuable instrument.

## Decisions

> [!recall] Tube furnace: the heater architecture chosen for the next furnace, over which two alternatives, and the physics that forced it.
^d1

> [!solution]- Answer
> Section 7 (Choosing the next furnace): three zones over a uniform or a graded winding. Over 36 worst cases in the v2 geometry (60 cm heated length, 25-wafer boat, 2.4 kW): junction depth spread 0.9% against 81% and 79% (goal 3%); oxide spread 0.5% against 50% and 48% (goal 2%); flat zone at ±1 K with 2 slm of gas 48.5 cm against 0.8 cm. Because: the insulation makes the decay length longer than the furnace; 2 slm of nitrogen carries about 42 W downstream and tilts the profile 2.6 K/cm; a controller can null only as many shapes as it has sensor-heater pairs. The result holds with the bore-radiation factor halved or doubled.

> [!recall] Tube furnace: the over-temperature protection specified, over relying on what, why, and where it is tested.
^d2

> [!solution]- Answer
> Section 2 (The hazard and the fix): an over-temperature limiter with its own sensor driving a contactor, independent of the controller, because the solid-state relay fails closed. Sections 3 and 5: tested by fault injection at a 300 °C setpoint, where a failure does no harm. The same fix list: sleeving on every conductor near the hot zone, a residual-current device at the plug, mains-to-case resistance under 1 MΩ is a fault, case to earth pin under 0.1 Ω.

> [!recall] Tube furnace: how the heater power will be logged in the first ramp, over what alternative, and why.
^d3

> [!solution]- Answer
> Section 6 (The measurements): a clamp meter on the element lead, to 0.5%, over reading 2% off the controller, because the logged ramp alone cannot separate the blanket conductivity from the shell film coefficient (correlation 0.98); the better power reading is what separates them.

## Failure

> [!recall] Tube furnace: the measurement in the original plan that the model showed cannot work, and what replaced it.
^f1

> [!solution]- Answer
> Section 5: the oxide colour chart. Its 10 nm resolution is 7% at 150 nm, but the predicted oxides at 1000 °C are 35 to 44 nm and the position-to-position differences that would make the pieces a thermometer are 1 to 9 nm. That check needs a reflectometer or holds of four hours. Section 6: the plan's original 30 and 60 min cells left the parabolic constant unidentified with the colour chart; the redesign is 1000 °C for 30 and 240 min, 900 °C for 240 min, plus a run at 5% RH behind a desiccant.

## Story

> [!recall] Tube furnace: the two-minute story, in five lines.
^s1

> [!solution]- Answer
> 1. Object: the hacker fab's first tube furnace, built by three members from a build video: 22 AWG nichrome on a 5/8 in quartz tube under cement, fibre blanket in an earthed steel box, one type K thermocouple, a ramp-and-soak PID switching a solid-state relay. It reaches 1000 °C and was never characterised.
> 2. Hard part: the audit found mains wiring unsheathed inside the case, and nobody knew the profile, ramp, losses or oxide rate. With no measurements, the work was a 1-D simulator of the build as it stands, with a band for every unmeasured input.
> 3. Measured: nothing yet. The model is checked by 230 tests against analytic limits and conservation and by a hand-calculation script; a Morris screening of 18 unmeasured inputs ranks the cold measurements, an hour's work unplugged.
> 4. Number: a 26 mm flat zone (17 to 41), 48 s to the quartz limit on a failed relay, an element near 1150 °C at full power, and humidity as important as oxygen for the oxide.
> 5. What it changed: the wiring fix and an independent limiter come before the next run; five experiments designed to estimate named parameters; three zones chosen for the next furnace. The runs will be a test, not a survey.

## Follow-ups

What a technical follow-up probes, and where it is taught. ^follow-ups

- The decay length as a fin problem: [fins](../basics/th-conduction.md#^fins), [heat equation](../basics/th-conduction.md#^heat-eq). ^fu-fin
- Ramp, hold and free cool-down: [lumped capacitance](../basics/th-transient.md#^lumped), [time constant](../basics/th-transient.md#^time-constant), [RC networks](../basics/th-transient.md#^rc-networks). ^fu-transient
- The shell film coefficient and the touch limit: [Newton's law of cooling](../basics/th-convection.md#^newton), [natural convection](../basics/th-convection.md#^natural). ^fu-shell
- PI against PI with feed-forward, the 2 s relay cycle, zoned control: [PID](../basics/mc-control.md#^pid), [discrete time](../basics/mc-control.md#^discrete), [MPC](../basics/mc-control.md#^mpc). ^fu-control
- Oxide growth and why temperature dominates: [Deal-Grove](../basics/sp-oxidation-diffusion.md#^deal-grove), [Arrhenius](../basics/sp-oxidation-diffusion.md#^arrhenius), [oxide colour](../basics/sp-oxidation-diffusion.md#^oxide-colour). ^fu-oxide
- Thermocouple position and the meaning of a band: [thermocouple](../basics/pd-measurement.md#^thermocouple), [uncertainty](../basics/pd-measurement.md#^uncertainty). ^fu-measure
- Screening and designed experiments: [design of experiments](../basics/sp-yield-spc.md#^doe). ^fu-doe
