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
# Story
# Method

**Constraints:** 125mm print bed | 6 hour build time | 40 N·m input torque  
**Method:** Mixed-Integer Nonlinear Programming with Differential Evolution

---

## Problem Formulation

### Design Requirements
Optimize a two-stage compound gear train for FDM 3D printing (PLA material) achieving 3:1 speed reduction. Spur→Compound→Bevel topology selected due to superior design for manufacturing characteristics at the high-torque input stage.

### Decision Variables (7 total)
- **Discrete:** Module size $m_1, m_2 \in \{0.5, 0.6, ..., 5.0\}$ mm (standard series)
- **Integer:** Tooth counts $z_1, z_{1,driven}, z_2, z_{2,driven} \in [12, 80]$
- **Continuous:** Face widths $b_1, b_2 \in [5, 50]$ mm
- **Continuous:** Ratio split factor $r_{split} \in [0.2, 0.8]$ (determines how 3:1 is divided between stages)

### Objective Function
$$
\text{Maximize: } s
$$

$$
\text{Subject to: } \begin{cases}
S_{b,i} \geq s & \forall \text{ gears } i \in \{1,2,3,4\} \\
S_{H,i} \geq s & \forall \text{ gears } i \in \{1,2,3,4\}
\end{cases}
$$

**Maximin formulation** maximizes the minimum safety factor across all gears, ensuring balanced design with no weak links.

Where safety factors are:

**Bending (Lewis):**
$$
S_b = \frac{\sigma_{allow,b} \times b \times m^2 \times z \times Y}{2T}
$$

**Contact (Hertzian):**
$$
S_H = \frac{\sigma_{allow,H} \times \sqrt{m \times z \times b \times I}}{Z_E \times \sqrt{2T \times K}}
$$

### Constraints

**Geometric:**
- $m \times z \leq 125$ mm for all gears (bed diameter limit)
- $b \leq 0.5 \times d$ for all gears (aspect ratio)
- $z \geq 12$ (prevent undercut for 20° pressure angle)

**Performance:**
- $\min(S_b, S_H) \geq 1.25$ (minimum safety factor)
- $|r_1 \times r_2 - 3.0| \leq 0.15$ (ratio accuracy ±5%)

**Manufacturing:**
- $\sum T_{print} \leq 6.0$ hours (total build time)
- $T_{print,avg} \leq 0.75$ hours (average per gear)

Where print time: $T = C \times m^2 \times (9z - 2.25) \times b + t_0$ with $C = 2.45 \times 10^{-5}$ h/mm⁴

---

## Optimization Method

### Algorithm: Differential Evolution
Selected for mixed-integer nonlinear problem (MINLP) with:
- **Strategy:** best1bin (exploitation-focused)
- **Population:** 105 individuals (15× problem dimension)
- **Generations:** 300
- **Convergence:** 1% improvement threshold
- **Constraint handling:** Penalty method (infeasible solutions heavily penalized)

### Search Space
Explored ~$10^6$ possible combinations across:
- 18 discrete module choices per stage
- 68 integer tooth count options
- Continuous face width range
- Ratio distribution optimization

Algorithm converged to compact design with small module (0.5mm) and high tooth counts for minimum diameter.

---

## Optimal Solution

### Stage 1 (Input)
- Module: 0.5 mm | Teeth: 30 → 45 | Ratio: 1.5:1
- Diameter: 15.0 → 22.5 mm | Face width: 15 mm
- Safety Factors: $S_b = 12{,}656{,}250$ | $S_H = 1{,}009.67$

### Stage 2 (Compound/Output)
- Module: 0.5 mm | Teeth: 30 → 60 | Ratio: 2.0:1
- Diameter: 15.0 → 30.0 mm | Face width: 20 mm
- Safety Factors: $S_b = 11{,}250{,}000$ | $S_H = 951.93$

### Performance
- **Objective achieved:** $\min(SF) = 951.93$ (760× above 1.25 target)
- **Ratio accuracy:** 3.000:1 (exact match)
- **Print time:** 2.82 hours (53% under budget)
- **Max diameter:** 30.0 mm (76% under constraint)

### Key Design Features
1. Small module (0.5mm) strategy minimizes diameter while maintaining strength through high tooth counts
2. Balanced ratio split (1.5:1 × 2.0:1) distributes loads evenly across stages
3. Contact stress on Stage 2 is limiting factor ($S_H = 951.93$)
4. Extreme safety margins accommodate FDM material property variations (±20% typical)

---

**Tools:** Python (SciPy), AGMA gear standards, FDM manufacturing constraints  
**Result:** Manufacturable design meeting all constraints with 760× safety margin
# Solution
# Extension
# Teamwork and my role