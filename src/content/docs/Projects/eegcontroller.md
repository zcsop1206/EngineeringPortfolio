---
title: EEG-controlled robotic tail
description: "EEG classified for stop-start motion, ~5 DOF tail. integrates with multiple classes of actuators: robotic tail, web, drones, etc"
date: 2025-10-01
featured: true
tags:
github:
award:
tech stack:
---
# EEG Headset

>Designed and fabricated a custom high-fidelity bio-signal acquisition platform achieving -3.78 dB SNR and 110 dB CMRR using a multi-layer ADS1299-based PCB architecture. To address data scarcity in custom hardware, the system integrates a machine learning pipeline that utilizes OpenNeuro BIDS datasets selected via a soft voting classifier as a baseline. This enables few-shot prototypical adaptation, allowing for accurate real-time feature extraction and intent detection with minimal user-specific calibration.

# Story
**Problem:** The primary challenge was the need to extract key features from time-series EEG data for versatile applications while maximizing the Signal-to-Noise Ratio (SNR) and Common Mode Rejection Ratio (CMRR).

Commercial headsets are often closed systems that do not allow for the raw data access required for custom feature engineering. To bridge the gap between biological intent and device actuation, I needed to design an independent system capable of acquiring high-fidelity signals and processing them with limited user-specific training data.

# Method

## EEG Montage & Placement Strategy
To effectively capture relevant bio-signals, electrode placement could not be arbitrary. I implemented a **function-dependent placement strategy**:
* **Rationale:** Just as sleep health monitors target specific regions, actuation control and intent detection require targeting the motor cortex and relevant signal processing centers.
* **Reference Standards:** Guidelines from ACNS were utilized to map the 10-20 system to specific application needs.


[Image of 10-20 EEG system electrode placement map]


## Hardware Design: Objectives & Constraints
The PCB serves as the physical interface for the signal processing system.
* **Signal Integrity:** The system was designed to account for different noise sources to achieve industry-standard noise handling metrics: **SNR of -3.78 dB** and **CMRR of 110 dB**.
* **Safety & Form:** Strictly constrained thermal output to $<43^\circ C$ (safety) and optimized planar area for wearable integration.
* **Architecture:** Selected a **Modular Prototype** approach (ADS1299 + Raspberry Pi Zero 2W) to balance budget constraints ($<\$200$) with performance.

# Solution

## Circuit Design & PCB Layout
The hardware solution centers on the **ADS1299**, an industry-standard biopotential ADC.


[Image of ADS1299 block diagram]


* **Multistep Signal Processing:** I designed a multilayer stack-up with dedicated ground planes and symmetric analog routing. This hardware-level filtering was the first step in the signal processing system, effectively nullifying external electrical noise to reach the **110 dB CMRR** target.
* **Interface:** The board interfaces via SPI with a Raspberry Pi Zero 2W.

## Machine Learning & Feature Extraction
To address the challenge of accuracy with limited data from the custom headset, I implemented a robust software pipeline:

1.  **Baseline Generation:** I utilized Brain Imaging Data Structure (BIDS) compliant **OpenNeuro Datasets**. To ensure relevance, these datasets were selected using a **soft voting classifier** to serve as a high-quality baseline.
2.  **Feature Engineering:** I extracted key EEG elements from the time-series data to isolate intent from background activity.
3.  **Few-Shot Adaptation:** These features were used for **few-shot prototypical adaptation**. This allowed the system to improve accuracy and adapt to the specific user's brainwaves without requiring extensive calibration sessions.

# Extension
While the current solution meets the functional requirements for the prototype, the roadmap for "True Wearability" involves:
* **Miniaturization:** Transitioning from rigid FR4 to **Rigid-Flex PCB** technology with ELIC (Every Layer Interconnected) packaging.
* **Power Optimization:** Replacing the Linux-based RPi with a low-power microcontroller to improve battery life.

## Appendix: Bill of Materials (Prototype)
| Component                 | Function                    | Selection Rationale                                                                                                     |
| :------------------------ | :-------------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| **ADS1299**               | Analog-to-Digital Converter | Specialized for biopotential measurements; offers 24-bit resolution and ultra-low input-referred noise.                 |
| **Raspberry Pi Zero 2W**  | Compute & Processing        | Compact form factor; supports Linux for robust Python-based ML pipeline handling via SPI.                               |
| **Dry Flat Electrodes**   | Signal Interface            | Reusable and durable; eliminates the need for conductive gel, improving user experience for rapid prototyping.          |
| **Custom 4-Layer PCB**    | Circuit Interconnect        | 4-layer stack-up selected to provide dedicated internal ground planes for EMI shielding.                                |
| **LDO Voltage Regulator** | Power Management            | Low-dropout regulator chosen to minimize thermal waste ($<43^\circ C$) and provide clean power to the analog front-end. |
