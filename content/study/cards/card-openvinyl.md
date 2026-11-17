---
study: card
id: card-openvinyl
title: "OpenVinyl printed records: numbers card"
area: [mat, mc, pd]
needs: [pd-exact-constraint, mc-solids, mc-vibration, pd-measurement, gen-dimensions]
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [pd-exact-constraint](../basics/pd-exact-constraint.md), [mc-solids](../basics/mc-solids.md), [mc-vibration](../basics/mc-vibration.md), [pd-measurement](../basics/pd-measurement.md), [gen-dimensions](../basics/gen-dimensions.md). ^needs

Source: the public page /projects/openvinyl/. v1 was printed and played; v2 is verified in software and not yet printed. Keep the two apart when speaking. Every answer below quotes the page and names its section. ^source

## Numbers

> [!recall] OpenVinyl: the round-trip test of the v2 encoder: the signal, what came back, and what the tests hold the decoder to.
^n1

> [!solution]- Answer
> The encoder (results table): a 440 Hz tone, round trip through the G-code, recovered 100.5 µm against 100 µm commanded. The encoder decodes the file that goes to the printer back into a WAV, and tests check the decoded signal matches the internal one to under 2 µm.

> [!recall] OpenVinyl: the bead width, how precisely written G-code places the bead, and the dynamic range that placement sets.
^n2

> [!solution]- Answer
> The pivot: an FDM bead is 0.48 mm wide, yet the encoder writing G-code itself places it to about 0.01 mm. Slicer table: dynamic range is set by XY repeatability, assumed 0.01 mm, so about 20 dB at $A = 0.1$ mm.

> [!recall] OpenVinyl: the stylus contact pressure on PLA for the LP tip and for the 3 mil tip, against yield, and the scaling between them.
^n3

> [!solution]- Answer
> What v1 got right, and Stylus contact: an 18 µm LP stylus at 4 g on PLA has a contact radius of about 5.2 µm and peaks near 700 MPa, about 14 times PLA's yield of about 50 MPa, so the first play plastically sets the groove. A 3 mil (76 µm) tip cuts peak pressure about 2.6 times, to about 270 MPa, because pressure scales as $R^{-2/3}$; still over 5 times yield.

> [!recall] OpenVinyl: the slope constraint, its value at the inner radius at 78 RPM, and the frequency to which full amplitude is legal.
^n4

> [!solution]- Answer
> What v1 got right: $A \cdot f \le \tan(\theta_{\max})\, v / 2\pi$. At 78 RPM, $r = 40$ mm and 45°, $A \cdot f \le 52$ mm·Hz. The v2 groove table: full amplitude (0.10 mm) is legal to 520 Hz; 26 mm·Hz on the 7 inch disc at 45 RPM.

> [!recall] OpenVinyl: the v2 groove pitch and what it is made of, the play time on a 10 inch disc at 78 RPM, and the v1 figure it replaces.
^n5

> [!solution]- Answer
> The v2 groove: pitch = bead spacing + bead width + $2A$ + land = 0.528 + 0.48 + 0.20 + 0.48 = 1.688 mm; 47 turns and 36 s on the 10 inch disc at 78 RPM, against v1's 64 s on the same disc, because every pitch pays $2A$ plus land. Nozzle-smear bandwidth 681 Hz inner and 2042 Hz outer.

## Decisions

> [!recall] OpenVinyl: how v2 encodes the audio, over what v1 did, and why.
^d1

> [!solution]- Answer
> The pivot and the slicer table: a lateral cut, emitted directly as G-code on the printer's fast and precise XY axes, over Z (depth) modulation through a slicer. Writing the G-code places the bead to about 0.01 mm; layer-height quantization, slicer segment merging and staircase noise disappear; the ceramic cartridge works in its designed direction; the groove pass prints in about 25 minutes instead of hours. Z on this printer is the heavy bed on leadscrews, and modulating it mid-print would force about 3 mm/s feedrates.

> [!recall] OpenVinyl: constant angular or constant linear velocity for the first records, and why.
^d2

> [!solution]- Answer
> CAV or CLV: CAV first, so speed control is not a variable during the tracking experiments; the motor controller is designed so it can ramp. CLV is worth about 1.6 times the audio at the same worst-case quality, because under CAV the groove speed varies 3 times from outer to inner turn and the whole disc is designed for the worst inner turn.

> [!recall] OpenVinyl: what gets printed before any tone or music disc, and why.
^d3

> [!solution]- Answer
> The test ladder: tracking coupons first (straight bead-pair strips at 1.0 to 1.3 bead widths of spacing, then a blank-groove disc), because the dominant risk in v2 is tracking, not bandwidth: neither v1's analysis nor the first v2 plan addressed whether a stylus stays in a crease between two round FDM beads for 40 turns. Tone discs wait for the rebuilt turntable, which gives trustworthy RPM.

## Failure

> [!recall] OpenVinyl: v1's central design decision, the assumption under it, and why it was wrong.
^f1

> [!solution]- Answer
> The pivot: v1 encoded audio as groove depth because a 0.48 mm bead looked impossible to wiggle laterally at 10 to 20 times the width of a real vinyl groove. That assumed the geometry would go through a slicer, which reproduces only what a mesh describes at bead resolution. Written as G-code directly, the bead places to about 0.01 mm. The constraint was in the slicer, not the printer.

## Story

> [!recall] OpenVinyl: the two-minute story, in five lines.
^s1

> [!solution]- Answer
> 1. Object: records printed on a hobby FDM printer and played on a turntable designed with two collaborators. v1, a hill-and-dale groove, played, barely. The disc that played came from another maker's record generator, modified; the designed pipeline's one print did not track (v1: what was built and played).
> 2. Hard part: the slicer. It reproduces only what a mesh describes at bead resolution, which is why v1 cut depth; the pivot is to write the G-code directly as a lateral cut.
> 3. Measured: the encoder decodes the G-code file it writes back into audio, and tests hold that to under 2 µm. v2 is verified in software, not yet printed.
> 4. Number: a 440 Hz tone round-trips at 100.5 µm against 100 commanded; 36 s on a 10 inch disc at 78 RPM, at a 1.688 mm pitch.
> 5. What it changed: v2 is a lateral cut on the XY axes; tracking coupons come first because tracking is the dominant risk; first records are CAV; the turntable rebuild is in progress.

## Follow-ups

What a technical follow-up probes, and where it is taught. ^follow-ups

- Contact pressure of a spherical tip on plastic, and why it scales as $R^{-2/3}$: [Hertz contact](../basics/pd-exact-constraint.md#^hertz), [yield](../basics/mc-solids.md#^yield-criteria). ^fu-hertz
- The cartridge and stylus as a spring-mass system, and cantilever resonance: [one degree of freedom](../basics/mc-vibration.md#^sdof), [frequency response](../basics/mc-vibration.md#^frf). ^fu-cartridge
- Sampling the spiral and the smear limit as a lowpass: [sampling](../basics/pd-measurement.md#^sampling), [noise](../basics/pd-measurement.md#^noise). ^fu-sampling
- Scaling arguments behind the slope and bandwidth limits: [scaling](../basics/gen-dimensions.md#^scaling), [limiting cases](../basics/gen-dimensions.md#^limiting-cases). ^fu-scaling
