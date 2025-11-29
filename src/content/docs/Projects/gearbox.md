---
title: "MIE243 Dissection: speed reducing gearbox"
description: 3:1 speed reduction, 90 degree angular + linear offset
tags:
date:
featured: true
github:
award:
tech stack:
---
# Computational Design & Optimization of FDM Gear Train

>Formulated and solved a Mixed-Integer Nonlinear Programming (MINLP) problem to optimize a two-stage compound gear train for Fused Deposition Modeling (FDM). Utilizing a Differential Evolution algorithm with a "Maximin" objective function, the solution navigated a search space of ~$10^6$ combinations to maximize the minimum safety factor across the assembly. The resulting design achieved a 3:1 reduction ratio with a minimum safety factor of 951 (Hertzian contact), fitting within a 125mm build volume and a 2.8-hour print budget.

# Story
**Problem:** Designing load-bearing gear trains for 3D printing (FDM) presents unique challenges. Unlike standard steel gears, PLA parts have anisotropic strength, lower thermal limits, and specific manufacturing constraints (print time, bed adhesion, nozzle resolution). Manual design often leads to over-engineered parts that waste material or under-engineered parts that fail at the layer lines.

**Objective:** Instead of guessing parameters, I aimed to automate the mechanical design process. The goal was to mathematically derive the optimal gear geometry that maximizes structural integrity (Safety Factor) while strictly adhering to the geometric and temporal constraints of a hobbyist-grade 3D printer.

# Method

## Problem Formulation (MINLP)
I defined the design task as a **Mixed-Integer Nonlinear Programming** problem. This classification was necessary because the decision variables included a mix of data types:
* **Discrete:** Module sizes (Standard metric series: 0.5, 0.6... mm).
* **Integer:** Tooth counts ($z$).
* **Continuous:** Face widths ($b$) and Ratio split factor ($r_{split}$).

## The "Maximin" Objective
To ensure reliability, I rejected average performance in favor of a "weakest link" approach. The objective function was set to maximize the minimum safety factor found anywhere in the system.

$$
\text{Maximize: } s
$$
$$
\text{Subject to: } \min(S_{b,i}, S_{H,i}) \geq s \quad \forall i
$$

I utilized standard AGMA stress equations adapted for plastic:
1.  **Bending Stress (Lewis Form):** To predict tooth breakage.
2.  **Contact Stress (Hertzian):** To predict surface pitting/wear.

## Algorithm: Differential Evolution
Due to the non-convex nature of the search space and the discrete constraints, standard gradient-descent methods were unsuitable. I implemented a **Differential Evolution (DE)** evolutionary algorithm using Python (SciPy).

* **Strategy:** `best1bin` (Exploitation-focused).
* **Population:** 105 individuals (15× problem dimension).
* **Generations:** 300 iterations.
* **Constraint Handling:** Implemented a Penalty Method to heavily degrade the fitness score of any solution violating geometric boundaries (e.g., bed size) or performance limits (e.g., build time).


[Image of differential evolution algorithm flowchart]


# Solution

## Optimization Results
The algorithm converged on a solution that defied the "bigger is stronger" intuition often applied to 3D printing. Instead, it favored a **small module (0.5 mm) strategy** with high tooth counts. This minimized the pitch diameter, allowing for a compact, rigid gearbox.



[Image of compound gear train diagram]


### Performance Metrics
* **Reduction Ratio:** 3.000:1 (Exact match to target).
* **Limiting Factor:** The design is limited by Contact Stress (Stage 2), with a safety factor ($S_H$) of **951.93**.
* **Bending Safety:** $S_b > 11,000,000$ (indicating tooth breakage is statistically impossible under defined loads).
* **Manufacturability:**
    * **Max Diameter:** 30.0 mm (76% under the 125mm limit).
    * **Print Time:** 2.82 hours (53% under the 6-hour budget).

## Key Design Features
1.  **Balanced Load Distribution:** The algorithm selected a ratio split of 1.5:1 (Stage 1) and 2.0:1 (Stage 2). This prevents one stage from becoming a massive point of failure while the other is underutilized.
2.  **Extreme Safety Margins:** The safety factor of ~950 is excessively high for steel, but for FDM PLA, this margin accounts for material voids, moisture absorption, and layer adhesion variability (typically ±20%).

# Extension
To move this from a computational study to a deployed product, future work includes:
* **Topology Optimization:** Using FEM to remove material from the gear webs, further reducing print time without affecting the critical tooth geometry.
* **Material Sensitivity Analysis:** Re-running the optimization loop with parameters for Engineering Nylons (PA6-CF) to evaluate size reduction potential.
* **Physical Validation:** Destructive torque testing of printed samples to correlate the calculated AGMA safety factors with real-world failure modes.

# Appendix: Variable & Constraint Table

| Variable Type | Parameter | Range/Set |
| :--- | :--- | :--- |
| **Discrete** | Module ($m$) | $\{0.5, 0.6, ..., 5.0\}$ mm |
| **Integer** | Tooth Counts ($z$) | $[12, 80]$ |
| **Continuous** | Face Width ($b$) | $[5, 50]$ mm |
| **Constraint** | Bed Diameter | $\leq 125$ mm |
| **Constraint** | Build Time | $\leq 6.0$ hours |
| **Constraint** | Aspect Ratio ($b/d$) | $\leq 0.5$ |
