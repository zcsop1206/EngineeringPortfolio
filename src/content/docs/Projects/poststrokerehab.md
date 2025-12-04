---
title: "NeuroTech Fall 2025: post stroke rehab hardware"
description: Exoskeleton and sEMG signal processing to facilitate post stroke rehabilitation
date: 2025-11-21
featured: true
github:
award:
tech stack:
---
>Designed a compliant, tendon-driven robotic exoskeleton for dual-mode (assistive and resistive) stroke rehabilitation using 3D-modeled bio-inspired flexure joints and closed-loop motor control. The mechanical design features TPU Shore 95A compliant joints to eliminate rigid-joint safety hazards while maintaining <150g distal mass. Electrical architecture integrates custom schematics with STM32F303-based signal acquisition, DRV8871 motor drivers, and isolated power management. Optimized BOM to $340 through inventory-based component selection, staying under the $400 prototype budget.
> **Link to career interests:** This project gave me experience designing medical devices under constraints like budget limitations, safety requirements, and clinical usability. The compliant mechanism approach I developed here directly applies to my rehabilitation robotics career goals, where passive safety and affordability determine whether devices actually reach patients. The inventory-constrained design methodology is now informing my approach on other medical device projects where procurement timelines and funding limitations dominate the design space.

## Problem

Stroke survivors often lose hand function due to hemiparesis (one-sided weakness or paralysis). Recovery depends on high-repetition physical therapy (300 to 500 repetitions per session) to induce neuroplasticity. Manual therapy produces results but requires a dedicated therapist for each patient, creating significant labor costs and physical demands.

Existing robotic exoskeletons rely on rigid pin joints. Human finger joints do not rotate around fixed centers; the instantaneous center of rotation migrates during flexion. This mismatch creates two failure modes:

- The device forces fingers into non-physiological trajectories, risking injury
- Complex bearing assemblies accommodate misalignment but add mass (typical systems exceed 500g) and cost

**Design objective:** Build a compliant, tendon-driven system capable of both assistive (amplifying weak muscle signals) and resistive (opposing motion to build strength) therapy modes while maintaining target specifications of <150g distal mass and <$400 prototype cost.

## Method

### Mechanical Design: Compliant Joint Architecture

I designed all finger joint geometry in SolidWorks using monolithic flexure joints rather than traditional hinges. The joints use 3D-printable TPU at Shore 95A hardness—the material deformation provides the rotational degree of freedom.

**Safety rationale:** In fault conditions where the control system attempts hyperextension, a rigid joint transmits full actuator force to bone. A compliant joint deforms elastically and absorbs the error. This passive safety mechanism eliminates the need for expensive force sensors at every joint.

The joint profile draws from origami-inspired compliant mechanism research published by Brigham Young University's Compliant Mechanisms Lab. Each joint contains:

- Living hinge section (1.2mm thick TPU) that concentrates flexural strain
- Reinforced sidewalls (3mm thickness) to resist lateral buckling
- Integrated Bowden cable channels to prevent tendon derailment

The 1.2mm hinge thickness came from finite element analysis. Thinner sections (0.8mm tested) provided insufficient restoring force under 5N tendon tension. Thicker sections (1.5mm tested) required excessive actuation torque and reduced total range of motion from 90° to 65°.

**Actuation architecture:** Motors mount on the forearm rather than fingers (distal actuation principle). Tendons route from motors through PTFE-lined Bowden cables to fingertips, reducing distal mass. This mimics biological hand architecture and keeps moving mass below 150g.

|Design Parameter|Specification|Design Rationale|
|---|---|---|
|Joint Material|TPU Shore 95A|Tested Shore 85A (too soft, 15° position error) and Shore 98A (too stiff, 8Nm motor requirement vs 3Nm target)|
|Distal Mass|<150g (achieved 142g in CAD)|Literature shows >200g causes measurable user fatigue in 15min sessions|
|Tendon Housing|Bowden cables, 2mm ID PTFE|Friction coefficient 0.04-0.08 vs 0.15-0.25 for nylon, tested with 1kg sliding load|
|Range of Motion|0-90° MCP, 0-100° PIP|Clinical rehab protocols require 85° minimum per APTA guidelines|
### Electrical Design: Control System

I sketched a simple circuit block diagram to guide the creation of a BOM. System requirements:

1. Acquire user intent signals (force-sensitive resistors initially, with planned sEMG expansion)
2. Drive motors with closed-loop position control (DC gear motors with quadrature encoders)
3. Support software-switchable assistive/resistive modes

**Power distribution:** Motors draw 2A peak current, which couples switching noise onto the 3.3V logic rail without proper isolation. I separated the motor drivers (DRV8871 dual H-bridge) onto a 12V rail with 470µF bulk capacitance, used an LM2596 buck converter (3A rated) to step down to 5V, then an AMS1117-3.3 LDO for the microcontroller supply. Measured switching ripple on the 3.3V rail stayed below 50mV pk-pk.

**Signal acquisition chain:**

- Stage 1: INA128 instrumentation amplifier with gain set to 100 via external resistor (force-sensitive resistor conditioning)
- Stage 2: 2-pole Sallen-Key low-pass filter at 30Hz cutoff (attenuates 20kHz PWM motor noise by >40dB)
- ADC: STM32F303 onboard 12-bit converter at 72MHz clock

We used the STM32F303 because five units were already in lab inventory. A Cortex-M0 variant would normally suffice for this application (no intensive DSP requirements), but designing around stocked parts saved $80 versus ordering new microcontrollers with 2-week lead times.

![Control System Architecture](https://claude.ai/chat/schematic_block_diagram.png) _Figure 1: Signal flow from FSR sensors through amplification, filtering, and motor control stages_
## Current Status and Next Steps

We finished CAD and electrical schematics in Fall 2024. Winter semester priorities:

- Print first complete finger assembly (individual test joints validated, full integration pending)
- Fabricate PCBs (Gerbers submitted to JLCPCB, 2-week turnaround)
- Bench-test closed-loop motor control before human trials

Main risk: tendon routing. CAD simulations show no binding, but cable friction under flexion loads is difficult to model accurately. We may need to iterate the channel geometry or switch to lower-friction cable materials (spectra fiber instead of nylon).

## Teamwork and Division of Labor

**My responsibilities:**

- Finger joint CAD
- Electrical schematic (power, sEMG acquision, actuation)
- BOM sourcing and inventory coordination
## Extension: Clinical Viability Requirements

Three developments needed before clinical testing:

**1. sEMG Integration**  
Surface electromyography detects nerve impulses before muscle contraction begins. This could reduce system response latency from 200ms (current FSR-based detection) to 50ms. That difference matters—users report that assistive devices feel "laggy" above 100ms latency. I need to learn biosignal processing (filtering 60Hz line noise, motion artifact rejection, feature extraction from EMG envelopes). This is outside my current skill set but directly relevant to the neurotechnology career path I'm pursuing.

**2. Gamification Software**  
Repetitive therapy has poor patient compliance. We're planning a Unity-based Bluetooth game where patients manipulate virtual objects. Gamification improves exercise adherence rates (literature shows 30-40% improvement in completed sessions). Sarah is handling the Unity development; I'll manage the Bluetooth communication protocol implementation.

**3. Clinical Validation Study**  
Partner with a local rehab clinic for pilot testing (target n=5-10 patients). Collect quantitative ROM data, qualitative comfort ratings, and therapist feedback. This requires IRB approval and informed consent protocols—something I haven't navigated before but will need to understand for any medical device career.

> These extensions represent the gap between engineering prototype and deployable medical device. Understanding this gap—the validation requirements, the regulatory landscape, the human factors testing—is something I need to develop. I'm interested in rehabilitation robotics specifically because it requires this interdisciplinary perspective: you can't just build a good mechanism, you need to understand clinical workflows, patient psychology, reimbursement models, and FDA clearance pathways.

---

**Visual Documentation:**

- Figure 1: Control system block diagram showing signal flow
- Figure 2: Printed TPU joint under flexion load testing
- Figure 3: CAD assembly showing tendon routing through Bowden cables (to be added)
- Figure 4: KiCad schematic excerpt showing power isolation topology (to be added)