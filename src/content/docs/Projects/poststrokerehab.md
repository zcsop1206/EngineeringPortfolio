---
title: "NeuroTech Fall 2025: post stroke rehab hardware"
description: Exoskeleton and sEMG signal processing to facilitate post stroke rehabilitation
date: 2025-11-21
featured: true
github:
award:
tech stack:
---
![joint photo](compliantjointbent.jpg)

# Parametric Compliant Tendon-Driven PIP Joint Array for Post-Stroke Rehabilitation Glove

> Designed and validated a geometrically nonlinear compliant joint array to replace discrete torsional springs in a tendon-driven post-stroke rehabilitation glove. Developed a parametric CAD framework and nonlinear FEA workflow using displacement-controlled loading to ensure 90° elastic survivability, distributed strain behavior, and restoring torque sufficient to overcome lumped Bowden and anatomical friction while preserving backdrivability.

**Project Context:** NeuroTechUofT – Post-Stroke Rehabilitation Exoskeleton  
**Role:** Hardware associate  
**Tools:** Onshape (parametric CAD), SimScale (nonlinear FEA), Python (design sweeps)

---

## Problem

Stroke survivors frequently exhibit impaired voluntary finger extension. Tendon-driven rehabilitation gloves typically employ:

- Discrete torsional springs at joints  
- Elastic bands for passive return bias  

These solutions introduce:

- Poor anatomical adaptability  
- Non-physiological torque profiles  
- Elevated Bowden cable tension requirements  
- Reduced backdrivability and comfort  

The objective was to design a **distributed compliant alternative** for the PIP joint that:

1. Survives up to 90° rotation within elastic limits  
2. Produces restoring torque exceeding lumped friction torque of the Bowden assembly and anatomical resistance  
3. Maintains low resistance during voluntary flexion  
4. Is fully parametrizable for patient-specific geometry  

This required treating the joint as a **geometrically nonlinear compliant mechanism** rather than a discrete torsional element.

---

## System Architecture

Each finger module includes:

- A series array of Flex-16–inspired compliant segments  
- Interlinking rings to promote distributed strain  
- Dorsally routed Bowden cable actuation

The geometry draws from distributed-compliance concepts and constant-stress beam principles to reduce localized strain peaks and approximate uniform stress distribution across the bending region.

Segmented arrays distribute angular displacement across multiple compliant units, reducing strain concentration compared to single-element flexures.

---

## Governing Physics

Dominant effects:

- Large-deflection elasticity  
- Geometric nonlinearity  
- Distributed bending and axial strain  
- Displacement-controlled kinematics  

Excluded from primary modeling:

- Plastic hinge formation  
- Contact-driven locking  
- Small-angle torsional approximations  

The mechanism stores elastic energy during flexion and releases it upon Bowden disengagement to return the finger toward neutral.

---

## First-Order Design Constraints

### Material: PLA (Prototyping Phase)

- Elastic strain limit ≈ 0.02  
- Tensile strength ≈ 40–60 MPa  
- High sensitivity to cyclic fatigue and creep under sustained stress  

PLA was selected for rapid prototyping only. Its brittle behavior and creep susceptibility make it unsuitable for long-term cyclic deployment; alternative materials (e.g., Nylon or TPU) are planned for fatigue-resilient iterations.

---

### Manufacturing Constraints

- Minimum printable feature size (FDM limits) ≈ 0.84 mm  
- Thickness bounds: 1–10 mm (ergonomics)
- Mechanism span: 25–40 mm depending on finger segment  

---

### System-Level Requirement

Restoring torque must exceed the **lumped friction torque** of:

- Internal Bowden sheath friction  
- Routing curvature losses  
- Glove fabric resistance  
- Passive anatomical joint resistance  

Target force range: 1.2–1.5 N  
Effective moment arm: ≈ 10 mm  

Calculated torque floor:
$$0.012\text{–}0.015 \text{ N·m}$$
This defines the minimum restoring bias required to ensure passive return to neutral.

---

## Parametric Design Framework

Free geometric variables:

- Inner radius  
- Outer radius  
- Flange angle  
- Thickness  
- Width  

Constraints applied during exploration:

1. Maximum principal strain < elastic limit  
2. No severe strain localization  
3. Manufacturable geometry  
4. Monotonic restoring moment near neutral  
5. Full angular survivability  

The CAD model was fully parameterized in Onshape, enabling constrained multivariable exploration across geometry-space while maintaining elastic safety limits.

---

## Nonlinear Simulation Methodology

### Objectives

- Validate elastic survivability to target rotation  
- Characterize strain distribution  
- Extract restoring moment vs. rotation behavior  

### Setup

- Geometric nonlinearity enabled  
- Displacement-Controlled Loading (Dirichlet BCs)  
- Proximal rigid region fixed  
- Distal rigid region prescribed rotational displacement  
- Rotation ramped incrementally to ensure convergence  
- No force boundary conditions applied  

Displacement-controlled analysis was necessary to replicate anatomical kinematics and ensure numerical stability in large-rotation FEA.

---

### Load Cases

1. **Maximum Rotation Survivability (up to 90°)**  
   - Inspect principal strain fields  
   - Identify concentration zones  

2. **Restoring Moment Characterization**  
   - Extract reaction moment vs. rotation angle  
   - Confirm restoring torque exceeds friction threshold  

The reaction moment vs. angle curve serves as the primary validation metric for torque behavior.

---

## Results

### Strain Distribution

- Single-segment designs exhibited localized strain at flange roots  
- Multi-segment arrays distributed deformation more uniformly  
- Ring-linked structures reduced hinge-like deformation modes  

Strain remained below elastic limit within targeted geometries.

---

### Restoring Behavior

- Reaction moment increased nonlinearly with rotation  
- Near-neutral restoring torque exceeded the 0.012–0.015 N·m threshold  
- Large-angle torque governed by elastic survivability constraints  

The moment-angle curve demonstrated sufficient restoring bias without excessive resistance.

---

### Scaling Observations

At reduced feature sizes:

- Stress concentration sensitivity increased  
- Minimum printable thickness constrained geometry smoothness  

Distributed arrays mitigated these scaling effects compared to single compliant segments.

---

## Limitations

- PLA exhibits brittle failure and creep under sustained load  
- Cyclic durability not experimentally validated  
- Torque extraction sensitive to boundary condition placement  
- Material optimization not yet performed  

---

## Future Work

- Cyclic fatigue testing (>10k cycles)  
- Material substitution (Nylon, TPU) for fatigue resistance  
- Multi-objective optimization (strain, torque, mass, comfort)  
- Closed-loop integration with motor control  
- Human-subject range-of-motion evaluation  

---

## Teamwork and Role
- Defined compliant joint architecture and governing physics  
- Built fully parametric CAD model for distributed joint array  
- Developed nonlinear displacement-controlled FEA workflow  
- Performed friction torque bounding and restoring bias validation  
- Conducted constrained multivariable geometry exploration  

Collaborated with electrical and controls subteams to ensure mechanical restoring torque aligned with motor backdrivability and Bowden transmission limits.

---

## Key Technical Takeaways

- Distributed compliant arrays reduce strain localization compared to discrete torsional elements.  
- Displacement-controlled nonlinear FEA is required for anatomically realistic validation of large-rotation mechanisms.  
- Reaction moment vs. rotation characterization is central to validating restoring bias in tendon-driven systems.  
- Parametric modeling enables patient-specific adaptability in rehabilitation hardware.  

This work contributes to the development of adaptable, backdrivable rehabilitation exoskeletons that leverage geometric compliance to reduce mechanical complexity and improve user comfort.