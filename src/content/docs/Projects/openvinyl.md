---
title: "OpenVinyl: FDM-printable audio from first-principles groove geometry"
description: Deriving the complete signal chain for encoding audio as 3D-printable groove geometry, from nozzle extrusion width through stylus contact mechanics.
tags:
date:
featured: true
github:
award:
tech stack:
---

> Derived the complete signal chain for encoding audio as FDM-printable groove geometry from first principles, bounding every parameter from the nozzle's extrusion width up through stylus contact mechanics. Standard DSP techniques (noise shaping, high-order anti-aliasing) turned out to be inapplicable at the system's true bandwidth: a 681 Hz inner-radius Nyquist with zero spectral headroom. The final pipeline uses TPDF dithering, aggressive dynamic range compression, and missing-fundamental psychoacoustics to extract recognizable audio from a 4-bit, ~340 Hz bandwidth physical medium.

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 12px; margin-bottom: 2rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
  <iframe 
    src="https://www.youtube.com/embed/aqkWe6JU3gI" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border:0;" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
  </iframe>
</div>

---

## Problem

FDM 3D printing cannot replicate lateral-cut vinyl grooves. The nozzle is the cutter, and XY feature size is bounded by the extrusion width ($w_e \approx 1.2 \times d_{\text{nozzle}}$). OpenVinyl instead encodes audio as vertical (Z-axis) modulation in discrete layer-height increments: each 0.08 mm step constitutes one quantization level, yielding 4-bit depth (16 levels, 24 dB dynamic range) before the Z-range exceeds tracking limits.

Every system parameter — bandwidth, dynamic range, groove geometry, playback fidelity — is coupled through the physical dimensions of the printed bead. Sample rate, aliasing boundary, slope tracking, and stylus contact mechanics all derive from the same extrusion width and layer height. The design space is defined entirely by what the FDM process actually produces at a given nozzle diameter and layer height, and the signal processing has to be built from those measured process parameters up.

**Design objective:** Derive the physical constraints from the print geometry, then design a signal conditioning pipeline that operates within them to produce recognizable audio from a 4-bit, bandwidth-limited physical medium.

## Method

The angular resolution of the printed groove is set by the minimum distinguishable arc length, which equals the extrusion width $w_e$:

$\text{steps\_per\_rev} \leq \frac{2\pi r}{w_e}$

Sample rate follows directly as $f_s = \text{steps\_per\_rev} \times \text{RPM} / 60$. For a 0.2 mm nozzle ($w_e$ = 0.24 mm) at 78 RPM:

| | Inner radius (40 mm) | Outer radius (120 mm) |
|---|---|---|
| Steps/rev | 1,047 | 3,142 |
| $f_s$ | 1,361 Hz | 4,085 Hz |
| Nyquist | 681 Hz | 2,042 Hz |

Bandwidth is radius-dependent: outer grooves encode 3× the frequency content of the inner grooves. This is a geometric consequence of the spiral, and it means the system's effective capability varies across the disc surface.

A sinusoidal signal at frequency $f$ and amplitude $A$ has maximum groove floor slope $2\pi f A / v$. Setting this equal to the maximum trackable slope $\tan(\theta_{\max})$ gives the amplitude-frequency tradeoff:

$A \cdot f \leq \frac{\tan(\theta_{\max}) \cdot r \cdot \text{RPM}}{60}$

At 500 Hz, $\theta_{\max}$ = 45°, and $r$ = 40 mm, this yields $A_{\max}$ = 1.3 quantization levels. I initially expected bit depth to be the binding constraint on dynamic range everywhere, but at the inner radius, the slope limit dominates. Effective resolution is not a fixed 4 bits; it varies with both frequency and radial position.

A spherical stylus tip of radius $R$ cannot resolve groove floor features with spatial wavelength shorter than $2\pi R$, giving a geometric bandwidth limit of $f_{\text{geometric}} = r \cdot \text{RPM} / (60 \cdot R)$. At $R$ = 0.5 mm (a typical ceramic-cartridge stylus), this limits bandwidth to 104–312 Hz, roughly 6.5× more restrictive than the Nyquist limit. This was the most consequential result of the constraint analysis: for a ceramic stylus, the entire sample rate derivation becomes non-binding. The stylus tip, not the print resolution, sets the actual bandwidth floor. For Nyquist to govern, the stylus tip radius must satisfy $R < 0.076$ mm. Standard vinyl styli ($R$ ≈ 18 µm) meet this, but may rattle in the wider FDM groove.

With the constraints established, I expected to apply standard quantization-noise reduction: Lipshitz-style noise shaping to redistribute quantization error out of the audio band. It doesn't work here. At the inner radius, the audio band (300–681 Hz) fills the entire Nyquist range. There is zero spectral headroom. Shaped noise has nowhere to go except back into the passband via aliasing. Noise shaping only becomes viable on outer grooves where the higher Nyquist frequency opens up headroom above the audio content. This forced a simpler pipeline:

| Stage | Parameter | Derivation |
|---|---|---|
| Highpass filter | 300 Hz, 4th-order Butterworth | Content below 300 Hz has no harmonics within [681, 2042] Hz; informationally inert |
| Lowpass filter | 681 Hz, 4th-order Butterworth | Inner-radius Nyquist limit (conservative global cutoff) |
| Dynamic range compression | ≥ 6:1 ratio | Compress 24 dB input to ≤ 18 dB to accommodate slope constraint |
| Dithering | TPDF only (no noise shaping) | Zero Nyquist headroom precludes spectral redistribution |

The 300–681 Hz passband means most musical fundamentals cannot be directly encoded. The auditory system, however, reconstructs pitch from harmonics 2–4 if the signal is monophonic and periodic. Harmonics 2–4 of a ~400–550 Hz fundamental (A4–C#5) fall within the bandwidth window, so this defines the optimal encoding range and was used to select input audio.

Hertzian contact analysis between a spherical stylus tip ($R$ = 0.5 mm) and PLA groove floor predicts maximum contact pressure of 66–78 MPa, exceeding PLA's compressive yield (~50 MPa). Plastic deformation of the groove floor is expected on first play. Archard wear modeling, though, shows cumulative abrasive wear is negligible (~32,000 plays per quantization step at the upper-bound wear coefficient). The groove deforms plastically on the first pass and then stabilizes; progressive wear is not the concern.

The conditioned waveform is mapped to physical geometry via an Archimedean spiral $r_c(\theta) = r_0 - \frac{p}{2\pi}\theta$. Five vertices per angular step define the groove cross-section (outer wall, inner wall, groove floor center, and two base vertices), producing ~10 triangles per step. The mesh requires explicit land surface triangulation between adjacent groove turns and manifold closure at the rim, inner disk, and spiral endpoints. Self-intersection is provably impossible given the Z-mapping constraints ($s \in [0, 2^n - 1]$ guarantees $Z_{\text{floor}} < Z_{\text{surface}}$ for all valid samples).

![STL Mesh](stl_mesh.png)

## Solution

![Rig model](rig_model.png)

The system produces recognizable monophonic audio from a 3D-printed disc played on a custom 78 RPM mechanical rig. Every parameter in the pipeline traces back to a measurable property of the fabrication process or the playback hardware: nozzle diameter, layer height, stylus tip radius, PLA yield strength. Validation confirmed that the physically derived constraints predicted actual system behavior — the inner-radius bandwidth limit, the slope-induced amplitude ceiling, and the first-play plastic deformation all appeared where the analysis said they would. The playback transfer function $H(f)$ remains unmeasured, and the current pipeline uses a conservative global cutoff rather than per-turn adaptive filtering, so there is usable bandwidth on the outer grooves that the system leaves on the table.

## Extension

### 1. Adaptive Per-Turn Lowpass Filter

The current pipeline uses the conservative inner-radius Nyquist (681 Hz) globally. Applying a per-turn adaptive cutoff $f_{\text{LP}}(r) = \pi r \cdot \text{RPM} / (60 \cdot w_e)$ would recover up to 3× bandwidth on outer grooves. This requires overlap-add windowing at turn boundaries to avoid phase discontinuity artifacts.

### 2. Measured Pre-Emphasis

The playback transfer function $H(f)$ is currently unknown. A sine sweep test record (300–2,042 Hz, 50 Hz steps) would allow designing an inverse pre-emphasis filter $H^{-1}(f)$ to directly counter the mechanical frequency response.

### 3. Closed-Loop Validation Protocol

Three-tier success criteria defined:

| Level | Criterion | Requirement |
|---|---|---|
| 1 | Pitch contour recognition | 3/5 naive listeners identify the melody |
| 2 | SNR measurement | SNR > 6 dB in the 400–2,042 Hz band vs. blank groove noise floor |
| 3 | Frequency accuracy | Measured fundamental frequency within ±50 cents (requires RPM stability < 5%) |
