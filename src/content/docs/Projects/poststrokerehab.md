---
title: "NeuroTech Fall 2025: post stroke rehab hardware"
description: Exoskeleton and sEMG signal processing to facilitate post stroke rehabilitation
date: 2025-11-21
featured: true
github:
award:
tech stack:
---
# Soft Robotic Exoskeleton for Post-Stroke Rehabilitation

>Developed a compliant, tendon-driven robotic exoskeleton designed for dual-mode (assistive and resistive) stroke rehabilitation. The mechanical design features 3D-modeled bio-inspired joints to ensure safety and biocompatibility. The electrical architecture includes a custom schematic integrating signal acquisition, closed-loop actuation, and power management. Project execution involved strict inventory-based BOM optimization to minimize costs while maintaining clinical functionality.

# Story
**Problem:** Stroke survivors often suffer from hand paralysis or weakness (hemiparesis). Recovery requires high-repetition physical therapy to induce neuroplasticity. However, manual therapy is labor-intensive, and traditional rigid exoskeletons are often heavy, expensive, and pose a safety risk due to mechanical joint misalignment with the biological finger center of rotation.

**Objective:** The goal was to engineer a "soft" robotic solution that facilitates two distinct rehabilitation modes:
1.  **Assistive:** Detecting faint muscle signals and helping the user complete the motion.
2.  **Resistive:** Providing force feedback to strengthen muscles during recovery.

# Method

## Mechanical: Compliant Design Strategy
To ensure safety without complex force sensors at every joint, I utilized **Compliant Mechanisms** rather than rigid pin joints.
* **Tendon-Driven Actuation:** Motors were relocated from the fingers to the forearm (distal actuation). This minimizes distal mass, reducing inertia and fatigue for the wearer.
* **Biocompatibility:** The joint geometry was 3D modeled to mimic the kinematic trajectory of the human finger, preventing hyperextension or non-ergonomic forcing functions.

## Electrical: System Architecture
I designed the electronic schematics to handle the complete control loop:
* **Signal Acquisition:** Front-end filtering for sensors (likely force sensitive resistors or EMG) to detect user intent.
* **Power Management:** Regulated power distribution to isolate noisy motor currents from sensitive signal lines.
* **Control Loop:**
*(Figure: High-level control architecture showing the feedback loop between bio-signals and tendon actuation)*

# Solution

## 3D Modeled Compliant Joint
The final mechanical design utilized flexible 3D-printable materials (TPU/Nylon) to create monolithic joints.
* **Safety:** The inherent compliance of the material acts as a mechanical fuse; if the system malfunctions, the soft joint bends rather than breaking the user's finger.
* **Actuation:** Bowden cable routing was integrated directly into the print to prevent tendon derailment during flexion and extension.

## Integrated Electronics Schematic
The electronics design served as the "nervous system" of the device.
* **Outcome:** Delivered a manufacturing-ready schematic that segmented high-power motor drivers from the low-power microcontroller logic.
* **Versatility:** The board was designed to switch between assistive (amplifying input) and resistive (opposing input) logic via software flags.

## BOM & Inventory Optimization
A critical constraint was budget.
* **Strategy:** I coordinated closely with the Hardware Lead to audit existing lab inventory.
* **Result:** By designing the circuit around stocked components (e.g., utilizing on-hand MOSFETs and specific microcontroller families) rather than sourcing new specialized parts, we significantly reduced the Bill of Materials (BOM) cost and lead time.

# Extension
To advance this prototype toward clinical viability, future steps include:
* **EMG Fusion:** Integrating surface Electromyography (sEMG) to detect nerve impulses before muscle contraction occurs, reducing system latency.
* **Gamification:** Connecting the device via Bluetooth to a Unity-based game interface to improve patient engagement during repetitive exercises.

# Teamwork and My Role
**Role: Mechatronics & Electronics Designer**

* **Cross-Functional Coordination:** While I handled the detailed component design (CAD and Schematics), I worked in tandem with the Hardware Lead. My role involved translating their inventory constraints into viable design parameters—ensuring that the parts we *had* were the parts we *used*.
* **Documentation:** Created the primary electrical documentation to ensure the control team could write firmware that mapped correctly to the physical hardware pins.