---
study: basic
id: pd-exact-constraint
title: Exact constraint, kinematic couplings and flexures
area: pd
needs: [mc-solids]
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [Hooke's law](mc-solids.md#^hooke), [bending](mc-solids.md#^bending) and [deflection](mc-solids.md#^deflection) from mc-solids; [rank–nullity](la-core.md#^rank-nullity) from la-core.
^needs

## Constraints are lines

> [!def] Degrees of freedom and constraints
> A rigid body in space has six **degrees of freedom** (DOF): three translations and three rotations. A small motion is a **twist** $(v, \omega)$: the point at $p$ moves by $v + \omega \times p$, to first order. A **constraint** forbids one point of the body from moving along one line, its **constraint line**: a preloaded point contact at $p$ with normal $n$ allows only motions with $n \cdot (v + \omega \times p) = 0$, and a rigid rod with a ball joint at each end forbids stretching along its own axis and nothing else. The body's remaining DOF are 6 minus the number of independent constraints.
^dof

> [!thm] Theorem 1 (counting constraints)
> Let $n$ constraints act along lines through points $p_i$ with unit directions $n_i$. Form the $n \times 6$ matrix $W$ whose row $i$ is $(n_i^T,\ (p_i \times n_i)^T)$. The allowed twists are the solutions of $W(v; \omega) = 0$, and there are $6 - \operatorname{rank}W$ independent ones. The constraints are **independent** when $\operatorname{rank}W = n$; then each removes exactly one DOF and the body is **exactly constrained** in the DOF they remove.
^exact-constraint

> [!proof]- Proof (d 2.5)
> 1. The point $p_i$ moves by $v + \omega \times p_i$; the constraint forbids the component along $n_i$: $n_i \cdot v + n_i \cdot (\omega \times p_i) = 0$.
> 2. Scalar triple product: $n_i \cdot (\omega \times p_i) = \omega \cdot (p_i \times n_i)$, so the condition is row $i$ of $W$ applied to $(v; \omega)$.
> 3. The allowed twists are the null space of $W$.
> 4. Rank–nullity: that null space has dimension $6 - \operatorname{rank}W$.
> 5. If $\operatorname{rank}W < n$, some row is a combination of the others, and that constraint forbids nothing the rest do not: it is redundant.
^p-exact-constraint

A row depends only on the line, not on where along it the contact sits: moving $p_i$ along $n_i$ leaves $p_i \times n_i$ unchanged. So a design is judged by where its constraint lines go. Lines that nearly meet or nearly line up give a matrix close to rank-deficient: the body is held, but weakly, against the motion they nearly allow.
^lines-not-points

> [!thm] Theorem 2 (three constraints in a plane)
> A body moving in a plane (DOF $x$, $y$ and rotation) and held by three constraint lines in that plane is fixed exactly when the three lines are neither all parallel nor all through one point. If they meet at one point $c$, the body can rotate about $c$; if all are parallel, it can slide perpendicular to them.
^planar-three

> [!proof]- Proof (d 3)
> 1. A planar twist $(v_x, v_y, \omega)$ moves $p$ by $v + \omega\hat z \times p$; by Theorem 1 restricted to the plane, the body is fixed exactly when only the zero twist meets all three constraints.
> 2. Take an allowed twist with $\omega \ne 0$. Solving $v + \omega\hat z \times c = 0$ gives a point $c$ about which the motion is a pure rotation: $p$ moves by $\omega\hat z \times (p - c)$, perpendicular to $p - c$.
> 3. Constraint $i$ allows that exactly when $n_i$ is perpendicular to the motion, that is, parallel to $p_i - c$: line $i$ passes through $c$. So all three lines meet at $c$.
> 4. Take an allowed twist with $\omega = 0$ and $v \ne 0$: then $n_i \cdot v = 0$ for all $i$, so all three $n_i$ are perpendicular to $v$, hence parallel.
> 5. Read backwards, steps 3 and 4 show that concurrent lines allow the rotation about their common point and parallel lines allow the slide.
^p-planar-three

## Kinematic couplings

> [!def] Kinematic coupling
> A coupling that locates one body on another through exactly six independent point contacts, held closed by a preload. The two classic forms are three balls in three V-grooves (two contacts per groove), and a ball in a three-flat socket (three contacts), a ball in a V-groove (two) and a ball on a flat (one). Because the contacts are independent, the body sits in one well-defined place whatever small errors the parts have, and reseats there each time. **Repeatability** is limited by friction at the contacts (a contact that must slide to seat sticks a little short of where it would settle), by surface finish and by wear; sub-micrometre repeatability is ordinary for hard, smooth contacts with a steady preload. Where the body sits relative to the drawing is a separate question, settled by part errors and calibration.
^kinematic-coupling

> [!thm] Theorem 3 (three balls in three grooves)
> Three balls whose centres are not in a line sit in three V-grooves with horizontal axes $g_i$, each groove's flanks symmetric about the vertical, so its two contact normals span the plane perpendicular to $g_i$. Through each ball draw the horizontal line $\ell_i$ perpendicular to its groove. The coupling is exactly constrained exactly when the three $\ell_i$ are neither concurrent nor all parallel. Grooves aimed at the centroid of an equilateral ball triangle satisfy this.
^three-grooves

> [!proof]- Proof (d 4)
> 1. A groove's two normals span the plane perpendicular to $g_i$, so ball $i$ may only move along $g_i$: $v + \omega \times p_i = s_ig_i$ for some $s_i$.
> 2. Put the ball centres in the plane $z = 0$. The vertical component of step 1 is $v_z + \omega_xy_i - \omega_yx_i = 0$ at three points not in a line, so $v_z = \omega_x = \omega_y = 0$: only planar motions remain.
> 3. A planar motion moves ball $i$ horizontally, and it must move along $g_i$, i.e. perpendicular to $\ell_i$. That is exactly the planar constraint along the line $\ell_i$.
> 4. By Theorem 2 the planar motion must vanish exactly when the $\ell_i$ are neither concurrent nor all parallel; then $W$ has a zero null space, rank 6, equal to the number of contacts.
> 5. For grooves aimed at the centroid of an equilateral triangle, each $\ell_i$ is the tangent to the circumcircle at ball $i$; tangents at three points $120^\circ$ apart bound a triangle, so they are neither concurrent nor parallel.
^p-three-grooves

The same picture sets the coupling's in-plane stiffness: the closer the $\ell_i$ come to meeting at a point, the less torque it takes to turn the coupling about that point. Aiming the grooves at the centroid keeps the $\ell_i$ as far from concurrent as three balls allow.
^groove-stiffness

## Hertz contact

> [!thm] Theorem 4 (Hertz contact of a sphere)
> A sphere of radius $R$ is pressed on a flat by a force $F$ (for two spheres use $R = (1/R_1 + 1/R_2)^{-1}$), both linear elastic and frictionless, contact small against $R$. With the contact modulus $1/E^* = (1 - \nu_1^2)/E_1 + (1 - \nu_2^2)/E_2$:
> - the contact is a circle of radius $a = (3FR/(4E^*))^{1/3}$;
> - the far fields of the two bodies approach by $\delta = a^2/R = (9F^2/(16RE^{*2}))^{1/3}$;
> - the pressure is $p_0\sqrt{1 - r^2/a^2}$ with peak $p_0 = 3F/(2\pi a^2)$, 1.5 times the mean;
> - the largest shear stress, about $0.31p_0$, lies below the surface at a depth of about $0.48a$ (for $\nu \approx 0.3$), which is where yield and contact fatigue begin.
>
> Stated without proof: the derivation needs the response of an elastic half-space to a point load. The scaling is proved in Theorem 5.
^hertz

> [!thm] Theorem 5 (how Hertz contact scales)
> $a \propto (FR/E^*)^{1/3}$ and $\delta \propto (F^2/(RE^{*2}))^{1/3}$: the approach grows as $F^{2/3}$, so a contact gets stiffer the harder it is pressed.
^hertz-scaling

> [!proof]- Proof (d 2.5)
> 1. Geometry: a sphere sunk a depth $\delta$ into a flat would cross it on a circle of radius $a$ with $a^2 \approx 2R\delta$, so $\delta \sim a^2/R$ up to a constant.
> 2. The deformation $\delta$ is spread over a region of size $a$, so strains are of order $\delta/a$.
> 3. [Hooke's law](mc-solids.md#^hooke): stresses are of order $E^*\delta/a$.
> 4. Force is stress times area: $F \sim E^*(\delta/a)a^2 = E^*\delta a$.
> 5. Substitute step 1: $F \sim E^*a^3/R$, so $a \sim (FR/E^*)^{1/3}$ and $\delta \sim a^2/R \sim (F^2/(RE^{*2}))^{1/3}$.
^p-hertz-scaling

## Flexures

> [!def] Flexure
> A **flexure** moves by bending instead of sliding or rolling. It has no friction, backlash or wear, so its motion repeats down to the level set by material creep and temperature, at the price of a small stroke, a restoring force, and small parasitic motions. A slender wire constrains one DOF, along its axis. A thin blade (length $L$, width $b$, thickness $t$) constrains the three motions in its own plane (along its length, along its width, and rotation about its normal) and leaves the other three nearly free. Along its length a blade's stiffness is $Ebt/L$; across its thickness, guided at the end, it is $Ebt^3/L^3$ (Theorem 6). The ratio, $(L/t)^2$, is what lets a blade act as a constraint in one direction and a hinge in another. A notch hinge, a local thinning in a solid block, is a short flexure for rotation about one axis.
^flexure

> [!thm] Theorem 6 (the fixed–guided blade)
> A blade clamped at one end, whose other end translates sideways by $x$ without rotating, needs a force $F = 12EIx/L^3$ ($I = bt^3/12$), reaches a peak bending stress $\sigma_{max} = 3Etx/L^2$ at both ends, and its guided end draws toward the clamp by $\Delta = 3x^2/(5L)$, second order in $x$.
^fixed-guided

> [!proof]- Proof (d 3)
> 1. With no load along its length, [EI w'''' = 0](mc-solids.md#^deflection), so $w$ is a cubic in the arc length $s$.
> 2. The conditions $w(0) = w'(0) = 0$, $w(L) = x$, $w'(L) = 0$ give $w = x(3\xi^2 - 2\xi^3)$ with $\xi = s/L$.
> 3. $w'' = (6x/L^2)(1 - 2\xi)$, so $|M| = EI|w''|$ is largest at both ends, $6EIx/L^2$.
> 4. The shear force is $|EI\,w'''| = 12EIx/L^3$, constant along the blade, and equals the end force $F$.
> 5. [Bending stress](mc-solids.md#^bending) at the surface, $t/2$ from the neutral axis: $\sigma = (6EIx/L^2)(t/2)/I = 3Etx/L^2$.
> 6. The blade does not stretch, so its ends draw together by its arc length minus its chord, $\tfrac12\int_0^L w'^2\,ds$ to second order.
> 7. With $w' = (6x/L)(\xi - \xi^2)$: $\tfrac12\int_0^1(36x^2/L^2)(\xi - \xi^2)^2L\,d\xi = (18x^2/L)\cdot\tfrac1{30} = 3x^2/(5L)$.
^p-fixed-guided

> [!thm] Theorem 7 (parallelogram flexure)
> Two equal, parallel blades join a base to a stiff platform. The platform translates by $x$ with stiffness $24EI/L^3$ and, to first order, does not rotate; it drops toward the base by $3x^2/(5L)$ at both blades alike, so it stays level.
^parallelogram

> [!proof]- Proof (d 2)
> 1. Rotating the platform in the plane of motion would stretch one blade and shorten the other; blades are $(L/t)^2$ times stiffer along their length than across, so to first order the platform does not rotate and each blade is fixed–guided.
> 2. By Theorem 6 each blade pushes back with $12EIx/L^3$; the two act in parallel, $24EIx/L^3$.
> 3. Each blade's end draws in by $3x^2/(5L)$; equal blades draw in equally, so the platform drops without tilting.
^p-parallelogram

Unequal blades draw in by unequal amounts, and the platform tilts by the difference over the blade spacing, growing as $x^2$. The same holds for rigid links on ball joints: two unequal rods in a parallelogram tilt the platform by their length difference over their spacing even at rest, and a drive that senses only the input crank cannot see it. The stepper stage page works through this case for a printed stage ([stepper](../../projects/stepper/index.md)).
^unequal-links

## Overconstraint

> [!def] Overconstraint
> A body is **overconstrained** when it has more constraints than the DOF they remove ($\operatorname{rank}W < n$). The redundant constraints fight: with any part error, the parts must deform to assemble, which locks internal forces into them, set by error times stiffness, and where the body ends up depends on which contacts win. It is not always wrong. **Elastic averaging**, many compliant contacts sharing a load (a long bolted joint, a guide with many rolling balls), trades the repeatability of each contact for stiffness and load capacity and averages part errors. It works when the parts are made or lapped to match, or are compliant enough that the forced stresses do no harm.
^overconstraint

> [!thm] Theorem 8 (assembly stress)
> With no external load, contact forces $f_i$ along the constraint lines are in equilibrium exactly when $W^Tf = 0$. If the constraints are independent, then whatever the small part errors, the body assembles with every contact closed and every $f_i = 0$. If they are not, nonzero self-balanced force sets exist, and part errors load them.
^self-stress

> [!proof]- Proof (d 2.5)
> 1. Contact $i$ pushes with force $f_in_i$ at $p_i$; its force and moment about the origin are $f_i(n_i;\ p_i \times n_i)$, which is $f_i$ times row $i$ of $W$.
> 2. Equilibrium of forces and moments is $\sum f_i(n_i;\ p_i \times n_i) = 0$, that is $W^Tf = 0$.
> 3. Independent constraints have independent rows, so $W^Tf = 0$ forces $f = 0$.
> 4. Part errors open gaps $e_i$ at the contacts; closing them needs a twist with $W(v; \omega) = e$, which exists for every $e$ because $W$ has full row rank. The body moves rigidly into contact and nothing deforms.
> 5. If $\operatorname{rank}W < n$, the rows are dependent and a nonzero $f$ with $W^Tf = 0$ exists; a gap vector outside the range of $W$ can then be closed only by deforming the parts, which loads such an $f$.
^p-self-stress

## Examples

> [!example] A plate against three pins, and a disc against three pins
> A rectangular plate lies on a table and is pushed against two pins on its long edge (20 mm and 80 mm from a corner) and one pin on its short edge. A round disc is pushed against three pins on its rim. Which is located in the plane?
^ex-three-pins

> [!solution]- Solution
> methods: exact-constraint
> 1. Each pin contact is a constraint line along the edge normal through the pin.
> 2. Plate: two parallel lines perpendicular to the long edge and one perpendicular to the short edge. Not all parallel, and the two parallel ones never meet, so they are not concurrent: fixed (Theorem 2).
> 3. Disc: each rim normal passes through the centre, so all three lines are concurrent there: the disc can still turn about its centre (rank 2, checked numerically).
> Answer: the plate is located; the disc is located except for rotation, which needs a flat or a key to fix it.

> [!example] A steel ball on a steel flat
> A 6 mm steel ball ($E = 200$ GPa, $\nu = 0.3$) is pressed on a steel flat with 10 N. Find the contact radius, the approach, the peak pressure and the contact stiffness $dF/d\delta$.
^ex-hertz-ball

> [!solution]- Solution
> methods: pd-exact-constraint/hertz
> 1. $E^* = E/(2(1 - \nu^2)) = 109.9$ GPa, $R = 3$ mm.
> 2. $a = (3 \cdot 10 \cdot 0.003/(4 \cdot 109.9 \times 10^9))^{1/3} = 58.9$ µm.
> 3. $\delta = a^2/R = 1.16$ µm.
> 4. $p_0 = 3F/(2\pi a^2) = 1.37$ GPa; the subsurface shear peak is about 0.43 GPa, 28 µm down.
> 5. From $F \propto \delta^{3/2}$, $k = 1.5F/\delta = 13.0$ N/µm.
> Answer: $a \approx 59$ µm, $\delta \approx 1.2$ µm, $p_0 \approx 1.4$ GPa, $k \approx 13$ N/µm. The pressure is high for a modest load, which is why coupling contacts are hardened.

> [!example] A parallelogram flexure
> Two spring-steel blades ($E = 200$ GPa), 20 mm long, 10 mm wide, 0.3 mm thick, form a parallelogram. For a stroke of 0.5 mm find the stiffness, the peak stress and the parasitic drop.
^ex-parallelogram

> [!solution]- Solution
> methods: pd-exact-constraint/fixed-guided, pd-exact-constraint/parallelogram
> 1. $I = bt^3/12 = 0.0225\ \text{mm}^4$.
> 2. Stiffness $24EI/L^3 = 24 \cdot 200\,000 \cdot 0.0225/8000 = 13.5$ N/mm.
> 3. Stress $3Etx/L^2 = 3 \cdot 200\,000 \cdot 0.3 \cdot 0.5/400 = 225$ MPa.
> 4. Drop $3x^2/(5L) = 0.6 \cdot 0.25/20$ mm $= 7.5$ µm.
> Answer: 13.5 N/mm, 225 MPa, 7.5 µm; the blades are 4400 times stiffer along their length than across.

## Derive

> [!derive] Show that a rigid rod with a ball joint at each end, one end on a fixed base, removes exactly one DOF from the body at its other end, and name the line it constrains.
^d-rod-one

> [!derive] From Theorem 4, show that a Hertz contact's stiffness is $dF/d\delta = 2E^*a = \tfrac32F/\delta$.
^d-hertz-stiffness

> [!derive] Show that a ball seated in a socket of three flats whose normals are not coplanar has its three translations removed and its three rotations free.
^d-trihedral

> [!derive] Show that a parallelogram flexure whose blades are $L$ and $L + \Delta L$ long and $d$ apart tilts by about $3x^2\Delta L/(5L^2d)$ when it translates by $x$.
^d-unequal-blades

## Problems

> [!problem] Three balls in three grooves under preload (d 3.5)
> A three-groove coupling uses 10 mm steel balls in steel grooves whose flanks are at 45° to the vertical, with 10 N of vertical preload per ball ($E = 200$ GPa, $\nu = 0.3$). Find the normal force at each contact, its contact radius and peak pressure, how far each ball sinks vertically, and the coupling's vertical stiffness.
^inv-pd-coupling-preload

> [!solution]- Solution
> methods: pd-exact-constraint/hertz, pd-exact-constraint/kinematic-coupling
> 1. Two flanks share the load; each normal is 45° from vertical: $2N\cos45^\circ = 10$ N, so $N = 7.07$ N.
> 2. $E^* = 109.9$ GPa, $R = 5$ mm: $a = (3NR/(4E^*))^{1/3} = 62.3$ µm, $p_0 = 3N/(2\pi a^2) = 0.87$ GPa.
> 3. Approach along each normal: $\delta_n = a^2/R = 0.775$ µm. A vertical sink $z$ closes each normal by $z\cos45^\circ$, so $z = \delta_n/\cos45^\circ = 1.10$ µm.
> 4. Normal stiffness per contact $k_n = 1.5N/\delta_n = 13.7$ N/µm. Vertically, two contacts give $2k_n\cos^245^\circ = k_n$ per ball.
> 5. Three balls in parallel: $41$ N/µm.
> Answer: $N = 7.1$ N, $a = 62$ µm, $p_0 = 0.87$ GPa, sink 1.1 µm, vertical stiffness about 41 N/µm (all at this preload; more preload stiffens it as $F^{1/3}$).

> [!problem] A four-legged table on a flat floor (d 4)
> A rigid square table stands on four identical legs at its corners, each a spring of stiffness $k$, on a perfectly flat floor; one leg is short by $e$. A weight $W$ sits at the centre. Find the force in each leg. What happens when $ke > W$?
^inv-pd-four-legs

> [!solution]- Solution
> methods: pd-exact-constraint/self-stress, mc-solids/hooke
> 1. Unknowns: the top's sink $z$ and tilts $\theta_x, \theta_y$. Leg $i$ at $(x_i, y_i) = (\pm s/2, \pm s/2)$ compresses by $c_i = z + \theta_xx_i + \theta_yy_i - e_i$, with $e_1 = e$ for the short leg at $(+, +)$ and $0$ otherwise.
> 2. Vertical balance: $k(4z - e) = W$, so $z = (W/k + e)/4$.
> 3. Moments: $\sum c_ix_i = \theta_xs^2 - es/2 = 0$, so $\theta_x = e/(2s)$, and likewise $\theta_y = e/(2s)$.
> 4. Short leg: $c_1 = z + e/2 - e = W/(4k) - e/4$. Opposite corner: $c_3 = z - e/2 = W/(4k) - e/4$. The other two: $c = z = W/(4k) + e/4$.
> 5. Forces: $W/4 - ke/4$ on the short leg and the leg diagonally opposite, $W/4 + ke/4$ on the other two (checked numerically).
> Answer: the error moves $ke/4$ from one diagonal pair to the other. When $ke > W$ the short leg and its opposite would need tension, so both lift off and the table rocks on the other diagonal: four legs on a flat floor are one constraint too many, and three legs never rock.

> [!problem] A coupling with grooves cut along the ball circle (d 3)
> In a three-groove coupling the balls sit at the corners of an equilateral triangle, but each groove is cut tangent to the circle through the balls instead of pointing at its centre. What motion does the coupling allow?
^inv-pd-tangent-grooves

> [!solution]- Solution
> methods: exact-constraint
> 1. Each line $\ell_i$ (horizontal, through the ball, perpendicular to its groove) now points along the radius.
> 2. All three radii meet at the centre: the lines are concurrent.
> 3. Theorem 3 with Theorem 2: the coupling can turn about the vertical axis through the centre (rank 5, checked numerically).
> Answer: free rotation about the vertical axis through the triangle's centre; each ball slides along its tangential groove.

> [!problem] A socket, a groove and a flat, with the groove turned (d 3)
> A coupling has ball A in a three-flat socket, ball B in a V-groove and ball C on a flat. The groove is meant to point at A, but it is machined turned by 90°, so its axis is horizontal and perpendicular to the line AB. What motion does the coupling allow?
^inv-pd-turned-groove

> [!solution]- Solution
> methods: exact-constraint
> 1. The socket fixes A's position, so any allowed motion is a rotation about an axis through A.
> 2. The groove lets B move only along its axis, which is horizontal and perpendicular to AB: the motion of B under a rotation about the vertical axis through A.
> 3. The flat at C resists only vertical motion; that rotation moves C horizontally.
> 4. So rotation about the vertical through A is allowed (rank 5, checked numerically); with the groove pointing at A, B would be held against it and the rank is 6.
> Answer: rotation about the vertical axis through the socket ball.

> [!problem] A blade-flexure stage for a ±1 mm stroke (d 3.5)
> A parallelogram flexure needs ±1 mm of stroke from spring-steel blades ($E = 200$ GPa) 40 mm long and 10 mm wide, with peak stress kept to 300 MPa for fatigue life. Find the thickest allowed blade, the stage stiffness and force at full stroke, and the parasitic drop there.
^inv-pd-flexure-stage

> [!solution]- Solution
> methods: pd-exact-constraint/fixed-guided, pd-exact-constraint/parallelogram
> 1. $3Etx/L^2 \le 300$ MPa gives $t \le 300 \cdot 1600/(3 \cdot 200\,000 \cdot 1) = 0.8$ mm.
> 2. $I = 10 \cdot 0.8^3/12 = 0.427\ \text{mm}^4$; stiffness $24EI/L^3 = 32$ N/mm.
> 3. Force at 1 mm: 32 N.
> 4. Drop: $3x^2/(5L) = 0.6/40$ mm $= 15$ µm.
> Answer: $t = 0.8$ mm ($L/t = 50$), 32 N/mm, 32 N, 15 µm. Stress grows as $t$ and stiffness as $t^3$, so stroke and stiffness trade against each other through the thickness.
