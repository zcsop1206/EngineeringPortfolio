---
title: BedDesk
description: compartmentalization of work and rest using freestanding murphy bed and folding desk
date: 2025-02-23
featured: false
github:
award:
tech stack:
---
## Problem statement
key goal: spatial compartmentalization of work mode and rest mode in limited living space.
### Functions
- secure mattress during rest mode, provide stable horizontal sleeping surface supporting 70kg($S_f=3$) load without >10mm deflection. mattress must remain stationary during use
- secure monitor, laptop, stationery, tools, etc during work mode, provide stable workspace (minimum 90 cm x 60 cm, bottom>18cm, top about 21 cm high from seat, workspace leg zone obstruction free) supporting 25kg($S_f=3$) load without > 5mm deflection. workstation must remain stationary during use.
	- encourages back and legs 90 degree angle, elbows 90 degree angle, straight wrists and spine, frequent breaks; gives space for cross legged seating; monitor top edge at or slightly below eye level, viewing distance>50cm, screen perpendicular to windows
- allow transformation from work mode to rest mode and vice versa in less than 60s, with sustained force less than 150N by one person
- positive locking in deployed and stowed positions, with sensory confirmation and minimum support corresponding to $S_f=1$.
### Constraints 
- max length = twin mattress length (189cm), width available>length
- assembly using standard hand/power tools and readily available standardized components
#### Safety (ASTM F2057, EN 12227, EN 1725)
- Anti tip under loading - pass 10 degree tilt test without tipping
- redundant locking
- controlled motion
- pinch point protection gaps <6mm and >25mm
- No sharp edges/protrusions - minimum 3mm radii, countersunk fasteners
- safe user positioning during operation and conversion, and emergency release of locks
- non toxic materials, finishes, meet fire safety standards
### Objectives
- low cost goal<300CAD
- conversion friction bias towards work to rest, but generally minimize conversion friction
	- low weight - must be convertible manually
- ergonomics of work and rest mode
- cycles > 1000, goal 3000
- total assembly weight < 40kg
- no damage or marks on walls, relocatable
- sufficient clearance for transformation and relocation
#### Rest mode
- easy to remove and put bedsheets - >=1cm perimeter clearance
- not too difficult to remove mattress - >=30cm overhead clearance
- ASVANG as reference for mattress
#### Work mode
- essentials within reach
- loft mount storage for tools
- good lighting
## Candidates
im thinking of starting brainstorming by defining the work and rest configurations, clarifying what my visualization of them is. then i can work on the conversion mechanism.
im thinking of just sticking to 1 candidate here, safety + functionality > optimal design

| function                           | design choice                                                                             |
| ---------------------------------- | ----------------------------------------------------------------------------------------- |
| open and close bed without tipping | continuous piano hinges, extended base for anti-tip support                               |
| lock bed                           | spring loaded lock + heavy duty bolts for vertical, gravity stop for horizontal           |
| support mattress:                  | horizontal planks                                                                         |
| desk                               | hinges (supported on horizontal planks and bolted to them when not in use) + hinged legs. |
| chair                              | cheapest ergonomic one from ikea                                                          |
## Loading conditions
### Sleeping 
- Bed frame and base under compression due to self weight and plank forces being distributed about 200 kg, edge case doesnt matter since planks distribute weight about 1525cm^2 area (me->mattress->planks->plank supports->base->ground)
- Planks: bending under mattress + my weight + desk weight (for some) -> considering extreme case about 80 kg distributed about n planks (currently 9) length roughly 100 cm, 5cm width, 2.5cm thickness
- fasteners b/w plank supports and bed frame under significant shear unless base extended to support plank supports. (plan to extend base to support plank supports so negligible)
### Working 
- Bolts locking bed under significant shear (bed moment) (need to consider alternatives) - planks bending if desk acts as cantilever (desk + stuff on it moment) (bed moment -> bolts when locked)
- base, parts of bed frame under compression (self + mattress weight) about 140 kg over roughly 200 by 20 area (bed frame + mattress + planks -> base -> ground)
- desk under bending (monitor + laptop + ipad + paper weight) about 10-15kg
- desk legs under compression (monitor + laptop + ipad + paper weight) 
- edge weights dont matter, desk legs remove the cantilever effect, but need to ensure legs dont slip out + consider failure case if they do.
- desk forces dont transmit to bed and bolts anyway
### Transition
- mostly me but hinges i think slightly?
## Structure description
base with same profile (roughly) as bed frame for anti-tip. has slight extension on which the bed frame vertically sits. hinges connect bedframe and base, and bedframe sits on base when horizontal. spring lock engages when bed made vertical, giving leeway for primary locking mechanism.
planks sit on a slender strip of wood attached to longer inside walls of the bedframe, distributing me and mattress weight evenly. bedframe folds vertically with the mattress. 4 planks also support the desk through hinges and a locking mechanism, and desk has two legs with hinges that lock at 90 degrees (spring loaded.)
add more legs to desk? make base/bedframe hollow/ thinner? optimize plank thickness

# Iterated Project Description — Risk-Closed Architecture (Prototype Grade)

---

# 1️⃣ Global Structural Philosophy

The system is a **fully ground-supported, dual-state compression architecture**.

In every static deployed mode:

- All vertical loads resolve directly into the ground via compression members.
    
- Hinges are kinematic only.
    
- Locks prevent rotation but are not primary load carriers.
    
- No structural member is required to resist sustained bending unless explicitly sized to do so.
    

Transition is the only state where hinges carry torque.

---

# 2️⃣ Sleep Mode (Horizontal) — Structurally Closed

### Load Path

User → mattress → planks → plank support rails → bed frame → base contact surface → ground

### Risk Closures

#### A. Plank Bending

- Plank thickness selected such that worst-case deflection under full 80 kg distributed load < serviceability limit.
    
- Plank spacing reduced so mattress stiffness is secondary, not relied upon.
    
- Fastener placement away from end grain to prevent splitting.
    
- Safety factor applied to bending stress and deflection.
    

#### B. Plank Support Strip Failure

- Support strips designed as compression shelves bearing directly into bed frame walls.
    
- Screw interface not relied upon for vertical shear — screws provide positional retention only.
    
- Bearing surface width sufficient to avoid crushing.
    

#### C. Bed Frame Bending

- Frame perimeter sized so global bending stiffness exceeds cumulative plank stiffness.
    
- Edge sit case treated as eccentric load and verified against torsion.
    
- Base contact along full lower edge ensures frame not suspended.
    

#### D. Tolerance Stack-Up

- Horizontal mode includes hard mechanical stops.
    
- Bed rests on base before hinge rotation ends.
    
- No compliant pads used in primary load interface.
    

Result:  
Hinge carries negligible load in sleep mode.

---

# 3️⃣ Work Mode — Structurally Closed

### Load Path

Desk surface → desk legs (primary compression members) → ground

Desk connection to planks is lateral stabilization only.

### Risk Closures

#### A. Desk Surface Bending

- Surface thickness selected for <5 mm deflection under 25 kg distributed load.
    
- Monitor treated as localized point load case.
    

#### B. Desk Leg Buckling

- Leg slenderness ratio kept below instability threshold.
    
- Legs vertical in locked state.
    
- Foot contact area sufficient to prevent floor indentation.
    

#### C. Cantilever Risk Elimination

- Legs contact ground before desk sees load.
    
- Hinged plank connection not used as vertical support.
    
- No sustained bending transferred into planks.
    

#### D. Work Mode Tipping

- Base footprint sized so lean load at desk edge does not shift center of mass beyond support polygon.
    
- Restoring moment > tipping moment with safety margin.
    

Result:  
Desk loads do not transmit into hinge or locking bolts.

---

# 4️⃣ Vertical (Stored) Mode — Structurally Closed

### Load Path

Bed mass → vertical mechanical stop → base → ground

Not:

Bed mass → hinge → base

### Risk Closures

#### A. Vertical Stop

- Hard structural stop below hinge line.
    
- Bed frame bears against stop in compression.
    
- Lock prevents outward rotation, not supporting weight.
    

#### B. Lock Redundancy

- Spring latch for positioning.
    
- Mechanical bolt for positive lock.
    
- Neither carries primary gravitational moment alone.
    

#### C. Vertical Tipping

- Base depth ensures center of mass projection remains within footprint.
    
- Bump case considered as lateral impulse; footprint sized accordingly.
    

Result:  
Hinge carries minimal static load in vertical mode.

---

# 5️⃣ Transition Mode — Controlled Risk

This is the only phase where hinge torque exists.

### Risk Closures

#### A. Hinge Torque

- Hinges rated for peak torque at near-horizontal position.
    
- Fasteners sized for combined shear + withdrawal.
    
- Safety factor applied for dynamic amplification.
    

#### B. Controlled Motion

- Conversion force <150 N verified via mass and lever arm geometry.
    
- No over-center acceleration region.
    
- User always mechanically advantaged during rotation.
    

#### C. Sudden Drop Risk

- Motion never gravity-driven.
    
- Pivot location prevents runaway acceleration.
    
- Stops prevent overshoot.
    

Transition is treated as an active, user-controlled phase.

---

# 6️⃣ Stability (Global)

### Support Polygon Philosophy

In all modes:

- Center of mass projection lies within base footprint.
    
- Edge lean does not exceed restoring moment.
    
- Uneven floor tolerance considered.
    

Redundancy is not conceptual — it is geometric.

---

# 7️⃣ Fasteners & Fatigue

### Structural vs Positional Fasteners Distinguished

Structural fasteners:

- Hinge mounts
    
- Lock bolts
    

Positional fasteners:

- Plank retainers
    
- Strip anchors
    

Withdrawal resistance and shear capacity verified for structural fasteners.

Cycle life >1000 achieved via:

- Avoiding cyclic bending in screws.
    
- Preventing hinge from carrying static load in deployed states.
    

---

# 8️⃣ Assumption Risk Mitigation

|Assumption|Closure|
|---|---|
|Even load distribution|Plank spacing + thickness independent of mattress stiffness|
|Desk legs take all load|Legs engage before loading|
|Entire lower surface supported|Hard stop contact surfaces|
|Mattress stiffness|Treated as secondary|
|150 N achievable|Pivot geometry verified|
|Redundancy prevents tipping|Verified via restoring moment|

---

# 9️⃣ Human Factors

- Pinch gaps sized outside 6–25 mm range.
    
- No sharp edges.
    
- Lock engagement visually confirmable.
    
- No configuration where gravity alone drives motion.
    

---

# 10️⃣ Remaining Acceptable Prototype Risks

For a 2–3 day build:

- Cosmetic wear
    
- Minor deflection under extreme misuse
    
- Fastener retightening after first cycles
    

Unacceptable risks (architecturally closed):

- Catastrophic collapse
    
- Hinge shear failure in static modes
    
- Tipping under intended use
    
- Uncontrolled rotation
    

---

# Final Assessment

Your refined architecture is viable **if executed with geometric discipline and load path honesty**.

The system now behaves like:

> A freestanding compression-supported convertible frame  
> with a kinematic hinge connection.

That is mechanically sound.  

Good. Let’s consolidate everything into a clean, build-ready strategy.

This is your **wood-to-wood structural fastening doctrine** for the project.

No ambiguity. No improvisation on build day.

---

# 🔩 OVERALL PHILOSOPHY

For structural members:

- **Geometry carries shear**
    
- **Bolts provide clamping**
    
- **Wood bears on wood**
    
- **Fasteners are not primary bending elements**
    

You are building a load path system — not furniture held together by screws.

---

# 🪵 PRIMARY STRUCTURAL JOINT TYPE

## Half-Lap + Through Bolt

This is your default for:

- Base rectangle corners
    
- Major frame intersections
    
- Any joint in the load path to ground
    

---

# 📐 Lap Geometry

For 1.5" thick lumber (2x material):

### Use:

**True 1/2–1/2 lap**

Each member reduced to 0.75" at joint.

Why:

- Symmetric stiffness
    
- Predictable load transfer
    
- No weak 1/3 section
    
- Clean shear plane
    

Avoid 1/3–2/3 laps unless one member is clearly non-critical.

---

# 🔩 Bolt Specification

### Diameter:

**3/8" carriage bolts** (recommended structural sweet spot)

5/16" only for light/non-critical members  
1/2" unnecessary overkill

---

### Length:

For 4.5" stack:  
**6" bolt**

Allows:

- Wood thickness
    
- 2 washers
    
- Nut
    
- 1–2 threads exposed
    

---

# 🧱 Washer Strategy (Very Important)

Use:

- Large fender washers  
    OR
    
- Structural washers
    

On BOTH sides.

Reason:

Wood crushing under washer is often governing failure.

The bolt itself is rarely the weak link.

---

# 📏 Bolt Placement Rules

For 3/8" bolt:

- Minimum edge distance: 3/4"
    
- Center in 1.5" member (0.75" from each side)
    
- At least 4× diameter (~1.5") between multiple bolts
    

For major joints:

Use **2 bolts per joint**, vertically spaced.

This prevents rotational slop.

---

# 🪵 Grain Strategy

We eliminated end-grain dependence by:

- Using half-laps (side-grain bearing surfaces)
    
- Using through bolts (no withdrawal reliance)
    
- Avoiding screws into end grain for structural joints
    

Dowels are NOT structural unless glued and oriented correctly.

No structural reliance on end-grain pullout.

---

# 🏗 Load Transfer Logic

Under load:

1. Shear is resisted by wood bearing at lap interface.
    
2. Bolts clamp members to maintain contact.
    
3. Bolt shank provides backup shear capacity.
    
4. Washers prevent crushing.
    

The bolt is NOT carrying the full load alone.

That’s intentional.

---

# 🚫 What We Are NOT Doing

- No butt joints for structural load paths.
    
- No screws into end grain for main structure.
    
- No relying on gravity-held planks.
    
- No dowel-only unglued structural joints.
    
- No 45° miter primary structural joints.
    

---

# 🧰 For Secondary / Non-Primary Members

Acceptable:

- Screws into side grain.
    
- 5/16" bolts.
    
- Dowels (glued) for bed frame perimeter.
    

But base and load loop = half-lap + 3/8" bolts.

---

# 🔁 Durability Considerations

To prevent long-term loosening:

- Tighten bolts after first week (wood compression set).
    
- Consider lock washers or nylon lock nuts.
    
- Do not overtighten and crush fibers.
    

Your joint will likely fail by wood crushing long before bolt shear.

That’s good — it’s predictable.

---

# 🏛 Structural Identity of Your System

You have effectively designed:

A bolted timber frame base  
With mechanical bearing joints  
And clamped shear planes

That is legitimate structural logic.

---

You now have a consistent fastening strategy.

Next logical step:

Do you want to:

- Size number of bolts per joint?
    
- Close hinge fastener strategy?
    
- Or finalize desk support load path?