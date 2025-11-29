---
title: "MIE243 Project: camera manipulator"
description: Automated camera manipulator for advanced hobbyist and beginner professional cinematographers
date: 2025-11-21
featured: true
tags:
github:
award:
tech stack:
---
# 4-DOF Cinematography Arm

>Designed and modeled a 4-degree-of-freedom (4-DOF) robotic camera arm capable of executing repeatable Pan, Tilt, and Dolly movements. The system features one redundant degree of freedom to optimize trajectory planning and avoid kinematic singularities. The project was governed by a rigorous Systems Engineering approach, utilizing a custom Traceability Matrix to ensure all engineering specifications were quantitative, prescriptive, and testable against the initial user needs of advanced hobbyist cinematographers.

# Story
**Problem:** Professional motion control rigs are often prohibitively expensive and complex, leaving a gap in the market for advanced hobbyists and beginner professionals who need repeatable, cinematic camera movements (Pan, Tilt, Dolly) without the industrial price tag.

**Context:** With a relatively open design space, we scoped our project to target this specific underserved demographic. We began with a thorough examination of state-of-the-art technologies and confirmed a lack of designs that offered a shallow learning curve and low cost while maintaining safety and precision.

To manage the complexity of a multi-degree-of-freedom robot, I established a standard guided project management framework. This involved creating a rigorous **System Requirement Specifications (SRS)** document. This framework ensured that every design decision—from motor torque to structural fillets—was quantified and prescriptive, ensuring full traceability across the design process.

# Method

## Systems Engineering & Requirements Tracking
Instead of jumping straight to CAD, I implemented a formal requirements engineering process:
* **Traceability:** I created a dynamic Traceability Matrix (Google Sheets) to link high-level "User Needs" (e.g., "Must be safe for solo operators") to low-level "Engineering Specifications" (e.g., "All external radii > 3mm").
* **Validation Criteria:** Each specification was assigned a specific verification method (Analysis, Inspection, or Test) to ensure the final design was objectively verifiable.

## Kinematic Design Strategy
To achieve the required Pan, Tilt, and Dolly motions, we selected a **4-DOF architecture**:
* **Task Space:** 3 DOFs required (Translation along rail + Pan + Tilt).
* **Joint Space:** 4 Active Joints.
* **Redundancy:** The inclusion of one redundant degree of freedom allowed for **Kinematic Optimization**. This extra joint enables the arm to avoid singularities (locking up) during complex moves and allows for multiple arm configurations to achieve the same camera pose, increasing flexibility in tight shooting environments.

## Safety by Design
Given the target user is a "single-person crew," safety was a primary constraint.
* **Pinch Point Elimination:** The mechanical structure was designed to shroud moving gears and belts.
* **Edge Rounding:** A global design rule was applied to eliminate sharp edges or protrusions that could snag cables or injure the operator.

# Solution

## Mechanical Implementation
The final solution was a fully 3D-modeled robotic assembly featuring:
* **Linear Rail Base:** Provides the "Dolly" motion, extending the workspace beyond a stationary robotic arm.
* **Rotary Joints:** High-torque actuators arranged to facilitate Pan and Tilt.
* **Structural Rigidity:** Optimized beam cross-sections to minimize vibration during high-speed movements, ensuring footage remains stable.

## Outcome
The design successfully met the traceability requirements. By strictly following the SRS, the final 3D model achieved:
* **Repeatability:** Capable of executing pre-programmed instructions for identical multi-take shots (essential for VFX work).
* **Compliance:** Verified against the quantitative safety and performance specs defined at the start of the project.

# Extension
To evolve this from a mechanical model to a fully autonomous product, future work would include:
* **Inverse Kinematics (IK) Solver:** Implementing a Jacobian-based IK solver in Python/C++ to allow users to control the camera in Cartesian space (XYZ) rather than joint space.
* **Computer Vision Integration:** Adding a camera module for object tracking, allowing the arm to automatically keep a subject in frame (Auto-Pan/Tilt).

# Teamwork and My Role
**Role: Project Manager & Systems Engineer**
* **Framework Creation:** I was responsible for setting up the project infrastructure, specifically the System Requirement Specifications (SRS) framework. This kept the team aligned and prevented "scope creep."
* **Design Oversight:** I ensured that the mechanical contributions from the team adhered to the safety and traceability standards I established, facilitating regular design reviews against our initial quantitative metrics.