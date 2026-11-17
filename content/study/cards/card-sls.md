---
study: card
id: card-sls
title: "SLS fresh layer: numbers card"
area: [th, mat]
needs: [th-transient, th-conduction, am-polymer, mc-control, pd-measurement, gen-dimensions, gen-estimation]
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [th-transient](../basics/th-transient.md), [th-conduction](../basics/th-conduction.md), [am-polymer](../basics/am-polymer.md), [mc-control](../basics/mc-control.md), [pd-measurement](../basics/pd-measurement.md), [gen-dimensions](../basics/gen-dimensions.md), [gen-estimation](../basics/gen-estimation.md). ^needs

Source: the public note /notes/sls/. It is an analysis from public data, not a measurement; the feed temperature (30 K cold), the layer time (10 s) and the heater power are assumed. Say so when quoting. Every answer below quotes the note and names its section. ^source

## Numbers

> [!recall] SLS: the powder's thermal diffusivity, the inputs it comes from, and the time for heat to cross one layer.
^n1

> [!solution]- Answer
> Inputs and Section 1 (First estimates): $\alpha = k/\rho c_p$ with $k$ = 0.10 W/m K, $\rho$ = 456 kg/m³, $c_p$ = 2470 J/kg K gives $8.9 \times 10^{-8}$ m²/s. Across one 110 µm layer, $L^2/\alpha$ = 0.14 s: a cold layer equalizes with what lies beneath it in a tenth of a second.

> [!recall] SLS: the energy a cold layer is short, against what the laser spends melting the part in that layer.
^n2

> [!solution]- Answer
> Section 1: one layer over the 16.5 × 16.5 cm build area is 1.37 g of powder and takes 3.4 J per kelvin, so a layer 30 K cold is 101 J short. Melting the part in the layer, say a fifth of it, takes about 31 J at 115 J/g. So 9 K of cold powder costs as much as the laser spends melting the part.

> [!recall] SLS: how far the layer below drops when a 30 K cold layer lands, over loose powder and over a printed part, and why they differ.
^n3

> [!solution]- Answer
> Section 2 (When the cold layer lands): at first contact the two layers meet at their average, so the layer below drops by half of $\Delta T$, 15 K for a 30 K layer. Over a printed part it drops only about 9 K, because the part's effusivity $\sqrt{k \rho c_p}$ is 2.4 times the powder's. Model: insulated top as a mirror, a cold slab $2L$ thick buried in powder, an exact error-function solution; a step-by-step numerical calculation matches it to within 0.012 K.

> [!recall] SLS: the time until a new layer is within 2 K of bed temperature, with no heater and at 2 kW/m², for 30 K and 75 K shortfalls.
^n4

> [!solution]- Answer
> Section 4 (The real cost: waiting): with no heater, 9.7 s for a 30 K layer and 61 s for a 75 K layer. With a heater driven by surface temperature and capped at 2 kW/m² (about 54 W across the bed), 0.9 s and 2.3 s. Doubling from 4 to 8 kW/m² saves only 0.3 s on a 75 K layer, because once the surface is warm the controller waits for heat to soak into the cold powder beneath.

> [!recall] SLS: the heater power below which the build drifts colder, and what each extra 10 K of cold costs over a full build.
^n5

> [!solution]- Answer
> Section 4: the build drifts colder only if the heater falls short of the average need, about 0.37 kW/m² (10 W) for 30 K layers every 10 s; Figure 4 shows 0.25 kW/m² falling steadily to 7.5 K below bed temperature over 100 layers, and 0.5 kW/m² upward staying within 0.5 K. At 2 kW/m² every extra 10 K of cold adds about 0.3 s per layer, roughly 15 minutes over a full-height build of about 2,700 layers.

## Decisions

> [!recall] SLS: the heater arrangement the analysis favours, over running the powder supply hotter, and why.
^d1

> [!solution]- Answer
> Section 4, read against the printer maker's patent (US 11,117,324): a heater on the spreader's carriage, just behind the roller. It hits both limits at once: it starts warming each layer the instant it lands, which cuts the wait, and it lets the powder supply run cooler, which avoids caking and degradation (Section 3: hot supply powder cracked in its bin or rippled the bed on a measured machine, and hot nylon degrades).

> [!recall] SLS: how the heater was modelled, over a fixed-power heater, and why.
^d2

> [!solution]- Answer
> Section 4: a heater driven by the surface temperature and capped at a power limit, with assumed controller settings, because the printer watches the powder surface with an infrared sensor. Section 5: the heater is idealized; all its power reaches the surface, and different controller settings shift the ready times.

> [!recall] SLS: the layer thickness for the bench test, over the printer's own, and why.
^d3

> [!solution]- Answer
> Section 6 (Testing it, on a bench): a 1 mm layer over 110 µm, because the time scale grows with the square of the layer thickness, which stretches the 0.14 s event to about 11 s, measurable with thermocouples (0.25 mm beads at 1, 2 and 4 mm, logged at 10 Hz, on a hot plate near 100 °C, well clear of melting). Fitting the recovery to the error-function curve gives the powder's diffusivity.

## Failure

> [!recall] SLS: the obvious fix for the recoat dip, its size, and the three reasons published measurements rule it out.
^f1

> [!solution]- Answer
> Section 3 (The obvious fix, and why it fails): a 15 K plunge blows through the 2 °C band and lands next to the 153 °C crystallization onset, so the obvious fix is to preheat powder to within 4 K of the bed: a 4 mm pocket with walls at bed temperature does it in about 70 s, about seven layers of powder at one per 10 s. Ruled out: (1) the dip is normal: a measured machine ran its supply at 93 to 100 °C against a 173 to 175 °C bed, about 75 K colder, made good parts, and its bed surface fell to 152 to 153 °C at every recoat (Yuan and Bourell 2012); (2) hotter powder cracked in its bin or rippled the bed, and hot nylon degrades; (3) held at 168 °C, nylon 12 took about 10 minutes to start crystallizing, and the 153 °C onset comes from cooling at 10 K per minute, not a one-second dip. So the 2 °C figure governs the bed between layers, not the dip at each recoat.

## Story

> [!recall] SLS: the two-minute story, in five lines.
^s1

> [!solution]- Answer
> 1. Object: a benchtop SLS printer must hold its bed within 2 °C, yet every few seconds a roller spreads a cold 110 µm layer of nylon powder on it.
> 2. Hard part: where the heat to warm each layer comes from, and what taking it does to the part beneath, when powder is mostly air and a layer equalizes in 0.14 s.
> 3. Measured: nothing on a printer; public data only. An exact error-function solution, checked numerically to 0.012 K, and a surface-driven heater model; published infrared measurements on another machine.
> 4. Number: the layer below dips 15 K (about 9 K over a part); at 2 kW/m² a 30 K layer is ready in 0.9 s.
> 5. What it changed: the 2 °C governs the bed between layers, not the dip; preheating the powder is the wrong fix; the real cost is waiting, which a heater trailing the roller cuts. Next is a bench test with a 1 mm layer.

## Follow-ups

What a technical follow-up probes, and where it is taught. ^follow-ups

- Two bodies brought into contact, and why they meet at the effusivity-weighted mean: [contact temperature](../basics/th-transient.md#^contact-temperature), [semi-infinite solid](../basics/th-transient.md#^semi-infinite). ^fu-contact
- The time to cross a layer and the bench scaling: [penetration depth](../basics/th-transient.md#^penetration), [scaling](../basics/gen-dimensions.md#^scaling). ^fu-penetration
- The mirror trick and the error-function solution: [heat equation](../basics/th-conduction.md#^heat-eq). ^fu-erf
- The SLS process window and crystallization: [SLS window](../basics/am-polymer.md#^sls-window), [sintering](../basics/am-polymer.md#^sintering), [shrinkage](../basics/am-polymer.md#^shrinkage). ^fu-window
- A capped, surface-driven heater: [PID](../basics/mc-control.md#^pid). ^fu-control
- The bench test's instruments: [thermocouple](../basics/pd-measurement.md#^thermocouple), [response time](../basics/pd-measurement.md#^response). ^fu-bench
- The first-pass energy numbers: [Fermi estimates](../basics/gen-estimation.md#^fermi). ^fu-fermi
