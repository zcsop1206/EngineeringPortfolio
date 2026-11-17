---
study: basic
id: mc-solids
title: Stress, strain, beams and buckling
area: mc
needs: []
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: nothing beyond calculus and free-body diagrams.
^needs

## Stress and strain

> [!def] Stress
> Cut a loaded body with a plane of unit normal $n$. The force per unit area that the material on the far side exerts across the cut is the **traction** $t(n)$, in Pa. At a point, $t$ depends linearly on $n$: $t = \sigma n$, where $\sigma$ is the $3 \times 3$ **stress tensor**. Its entry $\sigma_{ij}$ is the $i$-component of the traction on the face whose normal is $e_j$. Diagonal entries are **normal stresses** ($\sigma_x, \sigma_y, \sigma_z$, positive in tension); off-diagonal entries are **shear stresses** ($\tau_{xy}$ and so on).
^stress

> [!thm] Theorem 1 (stress is symmetric)
> In a body with no distributed moments, $\sigma_{ij} = \sigma_{ji}$: the shear stresses on two perpendicular faces are equal.
^stress-sym

> [!proof]- Proof (d 2)
> 1. Take a cube of side $h$ around the point and balance moments about the $z$-axis through its centre.
> 2. The shear $\sigma_{yx}$ on the two $x$-faces gives two forces $\sigma_{yx}h^2$ in opposite $y$-directions, $h$ apart: a moment $\sigma_{yx}h^3$.
> 3. The shear $\sigma_{xy}$ on the two $y$-faces gives a moment $-\sigma_{xy}h^3$ by the same count.
> 4. The change of stress across the cube and any body force give moments of order $h^4$; the angular-acceleration term is of order $h^5$, since the moment of inertia scales as $h^5$.
> 5. Divide the balance by $h^3$ and let $h \to 0$: $\sigma_{yx} - \sigma_{xy} = 0$.
^p-stress-sym

> [!thm] Theorem 2 (plane stress on a rotated plane)
> In plane stress only $\sigma_x, \sigma_y, \tau_{xy}$ are nonzero. On a plane whose normal makes angle $\theta$ with $x$, with $c = (\sigma_x + \sigma_y)/2$,
> $$\sigma_n = c + \tfrac{\sigma_x - \sigma_y}{2}\cos 2\theta + \tau_{xy}\sin 2\theta, \qquad \tau_{nt} = -\tfrac{\sigma_x - \sigma_y}{2}\sin 2\theta + \tau_{xy}\cos 2\theta.$$
> As $\theta$ turns, the point $(\sigma_n, \tau_{nt})$ runs round **Mohr's circle**, centre $(c, 0)$, radius $R = \sqrt{((\sigma_x - \sigma_y)/2)^2 + \tau_{xy}^2}$, at twice the rate. The **principal stresses** are $\sigma_{1,2} = c \pm R$, on planes free of shear and $90^\circ$ apart; the largest in-plane shear is $R$, on planes $45^\circ$ from the principal ones.
^mohr

> [!proof]- Proof (d 2)
> 1. Take $n = (\cos\theta, \sin\theta)$ and the tangent $m = (-\sin\theta, \cos\theta)$; the traction is $t = \sigma n$.
> 2. $\sigma_n = n \cdot \sigma n = \sigma_x\cos^2\theta + \sigma_y\sin^2\theta + 2\tau_{xy}\sin\theta\cos\theta$.
> 3. Replace $\cos^2\theta = (1 + \cos 2\theta)/2$, $\sin^2\theta = (1 - \cos 2\theta)/2$, $2\sin\theta\cos\theta = \sin 2\theta$: the first formula.
> 4. $\tau_{nt} = m \cdot \sigma n = (\sigma_y - \sigma_x)\sin\theta\cos\theta + \tau_{xy}(\cos^2\theta - \sin^2\theta)$: the second formula.
> 5. Square and add: $(\sigma_n - c)^2 + \tau_{nt}^2 = ((\sigma_x - \sigma_y)/2)^2 + \tau_{xy}^2 = R^2$, since the cross terms cancel.
> 6. On that circle $\sigma_n$ is extreme at $c \pm R$, where $\tau_{nt} = 0$, and $|\tau_{nt}|$ is largest, $R$, a quarter-turn round the circle away, which is $45^\circ$ of $\theta$.
^p-mohr

> [!def] Strain and Hooke's law
> Let $u(x)$ be the small displacement field. The normal strain is $\varepsilon_x = \partial u_x/\partial x$; the engineering shear strain $\gamma_{xy} = \partial u_x/\partial y + \partial u_y/\partial x$ is the decrease of a right angle. The tensor strain $\varepsilon_{xy} = \gamma_{xy}/2$ transforms by Theorem 2 with $\sigma \to \varepsilon$ and $\tau \to \gamma/2$. An isotropic linear elastic material obeys
> $$\varepsilon_x = \frac{\sigma_x - \nu(\sigma_y + \sigma_z)}{E} + \alpha\,\Delta T \ \ \text{(and cyclically)}, \qquad \gamma_{xy} = \frac{\tau_{xy}}{G},$$
> with Young's modulus $E$, Poisson's ratio $\nu$, shear modulus $G$, and thermal expansion coefficient $\alpha$ for a temperature change $\Delta T$ (temperature adds no shear). Only two of $E, \nu, G$ are independent. Typical values: steel $E \approx 200$ GPa, $\nu \approx 0.3$; aluminium alloys $E \approx 69$ GPa, $\nu \approx 0.33$.
^hooke

> [!def] Yield criteria
> A ductile metal yields when one number built from the stress state reaches the uniaxial yield strength $\sigma_y$. With principal stresses $\sigma_1 \ge \sigma_2 \ge \sigma_3$:
> - **Tresca**: the largest shear stress reaches $\sigma_y/2$, that is $\sigma_1 - \sigma_3 = \sigma_y$.
> - **von Mises**: $\sigma_{vm} = \sqrt{\tfrac12\left[(\sigma_1 - \sigma_2)^2 + (\sigma_2 - \sigma_3)^2 + (\sigma_3 - \sigma_1)^2\right]} = \sigma_y$.
>
> Both agree in uniaxial tension. In pure shear Tresca predicts yield at $\tau = 0.5\,\sigma_y$ and von Mises at $\sigma_y/\sqrt3 \approx 0.577\,\sigma_y$; Tresca is never the less conservative of the two. Von Mises fits test data for ductile metals better. The **safety factor** is $\sigma_y$ divided by the equivalent stress.
^yield-criteria

> [!thm] Theorem 3 (a normal stress with a shear)
> In plane stress with $\sigma_x = \sigma$, $\sigma_y = 0$, $\tau_{xy} = \tau$ (the surface of a shaft in bending and torsion), the von Mises equivalent is $\sqrt{\sigma^2 + 3\tau^2}$ and the Tresca equivalent is $\sqrt{\sigma^2 + 4\tau^2}$.
^vm-sigma-tau

> [!proof]- Proof
> 1. By Theorem 2, $c = \sigma/2$ and $R = \sqrt{\sigma^2/4 + \tau^2}$; the in-plane principal stresses are $c \pm R$ and the third is $0$ (the free surface carries none).
> 2. $R \ge |c|$, so $c + R \ge 0 \ge c - R$: Tresca's difference is $2R = \sqrt{\sigma^2 + 4\tau^2}$.
> 3. For von Mises, $(\sigma_1 - \sigma_2)^2 = 4R^2$ and $\sigma_1^2 + \sigma_2^2 = 2c^2 + 2R^2$.
> 4. Half the sum is $3R^2 + c^2 = \tfrac34\sigma^2 + 3\tau^2 + \tfrac14\sigma^2 = \sigma^2 + 3\tau^2$.
^p-vm-sigma-tau

## Beams

> [!thm] Theorem 4 (bending stress)
> A straight beam with a cross-section symmetric about the plane of loading carries a bending moment $M$. Assume plane sections stay plane and normal to the bent axis, strains are small, the material is linear elastic, and stresses across the depth are negligible. Then the **neutral axis** (zero stress) passes through the centroid of the section, the curvature is $\kappa = M/(EI)$ with the **second moment of area** $I = \int y^2\,dA$ about that axis, and the axial stress is $\sigma = -My/I$, with $y$ measured from the neutral axis toward the side that $M > 0$ compresses. The largest stress is $Mc/I$ at the extreme fibre, a distance $c$ from the neutral axis.
^bending

> [!proof]- Proof (d 2.5)
> 1. A fibre a height $y$ above the neutral surface, bent to radius $\rho$, has length $(\rho - y)\,d\varphi$ against $\rho\,d\varphi$ on the neutral surface: $\varepsilon = -y/\rho = -\kappa y$.
> 2. Uniaxial Hooke's law: $\sigma = E\varepsilon = -E\kappa y$.
> 3. Pure bending carries no axial force: $\int \sigma\,dA = -E\kappa \int y\,dA = 0$, so $\int y\,dA = 0$ and the neutral axis is through the centroid.
> 4. The stresses' moment is $M = -\int y\sigma\,dA = E\kappa\int y^2\,dA = EI\kappa$.
> 5. Eliminate $\kappa$: $\sigma = -My/I$.
^p-bending

Second moments of area about the centroid: rectangle of width $b$ and depth $h$, $bh^3/12$; solid circle of diameter $d$, $\pi d^4/64$; tube, $\pi(d_o^4 - d_i^4)/64$. About an axis a distance $s$ from the centroid, add $As^2$ (parallel axis).
^section-props

> [!thm] Theorem 5 (beam deflection)
> Measure the deflection $w(x)$ upward and take $M$ positive when it bends the beam concave up. For small slopes $\kappa \approx w''$, so $EI\,w'' = M(x)$; with a distributed upward load $q$ per length, $EI\,w'''' = q$. A cantilever of length $L$ with a tip load $P$ deflects $PL^3/(3EI)$ at the tip, with tip slope $PL^2/(2EI)$. The equation is linear, so deflections from several loads add.
^deflection

> [!proof]- Proof (d 2)
> 1. Clamp at $x = 0$ and load the tip $x = L$ downward with $P$. The moment at $x$ is $M = -P(L - x)$.
> 2. $EI\,w'' = -P(L - x)$.
> 3. Integrate with $w'(0) = 0$: $EI\,w' = -P(Lx - x^2/2)$.
> 4. Integrate with $w(0) = 0$: $EI\,w = -P(Lx^2/2 - x^3/6)$.
> 5. At $x = L$: $w = -PL^3/(3EI)$ and $w' = -PL^2/(2EI)$.
^p-deflection

| case | largest deflection | largest slope |
|---|---|---|
| cantilever, tip load $P$ | $PL^3/3EI$ | $PL^2/2EI$ |
| cantilever, uniform load $q$ | $qL^4/8EI$ | $qL^3/6EI$ |
| simply supported, central load $P$ | $PL^3/48EI$ | $PL^2/16EI$ |
| simply supported, uniform load $q$ | $5qL^4/384EI$ | $qL^3/24EI$ |
^deflection-table

## Shafts and columns

> [!thm] Theorem 6 (torsion of a circular shaft)
> A circular shaft, solid or hollow, under torque $T$ twists with each cross-section rotating rigidly. The shear stress at radius $r$ is $\tau = Tr/J$ and the twist over a length $L$ is $\varphi = TL/(GJ)$, where the polar moment is $J = \pi d^4/32$ (solid) or $\pi(d_o^4 - d_i^4)/32$ (tube). Non-circular sections warp out of plane and do not obey these formulas.
^torsion

> [!proof]- Proof (d 2)
> 1. By symmetry a circular section rotates as a rigid disc; let $\theta' = d\varphi/dx$ be the twist per length.
> 2. A line drawn along the shaft at radius $r$ tilts by the shear strain $\gamma = r\theta'$.
> 3. Hooke's law: $\tau = G\gamma = Gr\theta'$.
> 4. The stresses' torque: $T = \int r\tau\,dA = G\theta'\int r^2\,dA = GJ\theta'$.
> 5. Eliminate $\theta'$: $\tau = Tr/J$, and $\varphi = \theta' L = TL/(GJ)$.
^p-torsion

> [!thm] Theorem 7 (Euler buckling)
> A straight, slender, linear elastic column of length $L$, pinned at both ends, under axial compression $P$, has a bent equilibrium shape only when $P = n^2\pi^2 EI/L^2$, $n = 1, 2, \dots$. The least, $P_{cr} = \pi^2 EI/L^2$, is the **buckling load**. Other ends: $P_{cr} = \pi^2 EI/(KL)^2$ with effective length factor $K = 2$ (clamped and free), $1$ (pinned and pinned), about $0.7$ (clamped and pinned), $0.5$ (clamped and clamped). Use the smallest $I$ of the section.
^buckling

> [!proof]- Proof (d 3)
> 1. In a bent shape $w(x)$ the load acts along the original axis, so the moment at $x$ is $M = -Pw$; pinned ends carry no moment.
> 2. Theorem 5: $EI\,w'' = -Pw$, so $w'' + k^2 w = 0$ with $k^2 = P/(EI)$.
> 3. The general solution is $w = A\sin kx + B\cos kx$.
> 4. $w(0) = 0$ gives $B = 0$.
> 5. $w(L) = 0$ with $A \neq 0$ needs $\sin kL = 0$, so $kL = n\pi$.
> 6. Then $P = EIk^2 = n^2\pi^2 EI/L^2$, least at $n = 1$.
^p-buckling

## Examples

> [!example] An aluminium cantilever
> A 6061 aluminium bar ($E = 69$ GPa), 20 mm wide and 5 mm deep, sticks out 100 mm from a clamp with 20 N hung on its end. Find the tip deflection and the largest bending stress.
^ex-al-cantilever

> [!solution]- Solution
> methods: mc-solids/deflection, mc-solids/bending
> 1. $I = bh^3/12 = 20 \cdot 5^3/12 = 208.3\ \text{mm}^4$.
> 2. Tip deflection $PL^3/(3EI) = 20 \cdot 100^3/(3 \cdot 69\,000 \cdot 208.3) = 0.464$ mm (N, mm, MPa units).
> 3. The moment is largest at the clamp, $M = PL = 2000$ N mm, and $c = 2.5$ mm: $\sigma = Mc/I = 24$ MPa.
> Answer: 0.46 mm and 24 MPa, far below a yield strength near 275 MPa; stiffness, not strength, limits this part.

> [!example] A shaft in bending and torsion
> A 20 mm solid steel shaft ($\sigma_y = 350$ MPa) carries a bending moment of 50 N m and a torque of 80 N m at the same section. Find its safety factor by von Mises and by Tresca.
^ex-shaft-combined

> [!solution]- Solution
> methods: mc-solids/bending, mc-solids/torsion, mc-solids/vm-sigma-tau
> 1. Bending: $\sigma = Mc/I = 32M/(\pi d^3) = 63.7$ MPa at the surface.
> 2. Torsion: $\tau = Tr/J = 16T/(\pi d^3) = 50.9$ MPa at the surface.
> 3. Von Mises: $\sqrt{63.7^2 + 3 \cdot 50.9^2} = 108.8$ MPa, safety factor $350/108.8 = 3.22$.
> 4. Tresca: $\sqrt{63.7^2 + 4 \cdot 50.9^2} = 120.1$ MPa, safety factor $2.91$.
> Answer: 3.2 by von Mises, 2.9 by Tresca.

> [!example] A thin steel rod in compression
> A steel rod ($E = 200$ GPa, $\sigma_y = 350$ MPa), 4 mm in diameter and 200 mm long, is pinned at both ends. Which comes first under compression, buckling or yield? Below what length would the other come first?
^ex-rod-buckle

> [!solution]- Solution
> methods: mc-solids/buckling
> 1. $I = \pi d^4/64 = 12.57\ \text{mm}^4$, $A = 12.57\ \text{mm}^2$.
> 2. $P_{cr} = \pi^2 EI/L^2 = \pi^2 \cdot 200\,000 \cdot 12.57/200^2 = 620$ N.
> 3. Yield load $\sigma_y A = 4400$ N, seven times more: it buckles first.
> 4. The two are equal when $L = \pi\sqrt{EI/(\sigma_y A)} = \pi r_g\sqrt{E/\sigma_y}$, with radius of gyration $r_g = \sqrt{I/A} = d/4 = 1$ mm: $L = 75$ mm.
> Answer: buckling, at 620 N; below about 75 mm yield would come first (in practice the two interact near the crossover, and real columns buckle below the ideal load).

## Derive

> [!derive] Prove that for an isotropic linear elastic material $G = E/(2(1 + \nu))$.
^d-shear-modulus

> [!derive] Derive the central deflection $PL^3/(48EI)$ and end slope $PL^2/(16EI)$ of a simply supported beam with a central load $P$.
^d-ss-central

> [!derive] Show that a column clamped at one end and free at the other buckles at $\pi^2 EI/(4L^2)$.
^d-fixed-free

> [!derive] Show that a thin-walled circular tube of mean radius $r$ and wall $t$ under torque $T$ carries a shear stress $T/(2\pi r^2 t)$, and that Theorem 6 gives the same to first order in $t/r$.
^d-thin-tube

> [!derive] Show that the elastic energy stored in a bent beam is $\int M^2/(2EI)\,dx$.
^d-beam-energy

## Problems

> [!problem] Two stacked planks (d 3)
> Two identical planks of width $b$ and depth $h$ lie one on the other as a simply supported bridge. Compare the midspan deflection and the largest bending stress when they merely rest on each other and when they are glued along the whole interface.
^inv-mc-stacked-planks

> [!solution]- Solution
> methods: mc-solids/bending, mc-solids/section-props
> 1. Loose, the planks bend about their own centroids and share the moment equally: $I = 2 \cdot bh^3/12$.
> 2. Glued, they act as one section of depth $2h$: $I = b(2h)^3/12 = 8bh^3/12$, four times more.
> 3. Deflection scales as $1/I$: the glued bridge deflects a quarter as much.
> 4. Loose, each plank carries $M/2$ with $c = h/2$: $\sigma = (M/2)(h/2)/(bh^3/12) = 3M/(bh^2)$.
> 5. Glued, $\sigma = M h/(8bh^3/12) = 1.5M/(bh^2)$.
> Answer: gluing makes it 4 times stiffer and halves the peak stress. The glue line carries the shear that stops the planks sliding.

> [!problem] A tube and a rod of equal mass (d 3)
> A solid round rod of radius $R$ and a tube of the same material and mass whose inner radius is half its outer radius are used as torsion shafts. Find the ratio of their torsional stiffnesses and of their peak shear stresses under the same torque.
^inv-mc-tube-rod

> [!solution]- Solution
> methods: mc-solids/torsion
> 1. Equal mass means equal area: $R_o^2 - R_o^2/4 = R^2$, so $R_o = 2R/\sqrt3$.
> 2. $J_{tube}/J_{rod} = (R_o^4 - R_i^4)/R^4 = \tfrac{15}{16}R_o^4/R^4 = \tfrac{15}{16}\cdot\tfrac{16}{9} = \tfrac53$.
> 3. Peak stress $TR_o/J_{tube}$ against $TR/J_{rod}$: ratio $(R_o/R)/(5/3) = (2/\sqrt3)(3/5) = 0.693$.
> Answer: the tube is $5/3$ as stiff and its peak stress is 0.69 of the rod's.

> [!problem] A rod between two walls, heated (d 4)
> A steel rod ($E = 200$ GPa, $\alpha = 12 \times 10^{-6}$/K), 6 mm in diameter and 500 mm long, is clamped at both ends between rigid walls, stress-free at room temperature. By how much can it warm before it buckles? Is it still elastic then ($\sigma_y = 250$ MPa)? State what you assumed.
^inv-mc-heated-rod

> [!solution]- Solution
> methods: mc-solids/hooke, mc-solids/buckling
> 1. Rigid walls hold the total strain at zero, so the mechanical strain is $-\alpha\Delta T$ and the force is $P = EA\alpha\Delta T$.
> 2. Clamped at both ends, $P_{cr} = \pi^2 EI/(0.5L)^2 = 4\pi^2 EI/L^2$.
> 3. Equate: $\Delta T = 4\pi^2 I/(\alpha A L^2)$; for a circle $I/A = r^2/4$, so $\Delta T = \pi^2 r^2/(\alpha L^2)$.
> 4. Numbers: $\pi^2 \cdot 9/(12 \times 10^{-6} \cdot 250\,000) = 29.6$ K.
> 5. Stress then: $E\alpha\Delta T = 71$ MPa, well below yield, so the elastic analysis holds.
> Answer: about 30 K, assuming perfectly rigid walls, ideal clamps and a straight rod; any wall compliance or initial bow lowers it, so the real margin is smaller.

> [!problem] A thin-walled pressure cylinder (d 3.5)
> A closed steel cylinder of radius 50 mm and wall 2 mm ($\sigma_y = 250$ MPa) holds gas at gauge pressure $p$. Find $p$ at first yield by Tresca and by von Mises, ignoring the ends' local bending.
^inv-mc-pressure-cylinder

> [!solution]- Solution
> methods: mc-solids/stress, mc-solids/yield-criteria
> 1. Cut lengthwise through a length $\ell$: pressure force $p \cdot 2r\ell$ is held by two walls, $2\sigma_h t\ell$: hoop stress $\sigma_h = pr/t = 25p$.
> 2. Cut across: $p\pi r^2 = \sigma_a 2\pi r t$, so axial stress $\sigma_a = pr/(2t) = 12.5p$.
> 3. The radial stress runs from $-p$ inside to $0$ outside, small against these; take principal stresses $(25p, 12.5p, 0)$.
> 4. Tresca: $\sigma_1 - \sigma_3 = 25p = 250$ MPa gives $p = 10$ MPa.
> 5. Von Mises: $\sqrt{\tfrac12[(12.5)^2 + (12.5)^2 + 25^2]}\,p = 21.65p = 250$ MPa gives $p = 11.5$ MPa.
> Answer: 10 MPa by Tresca, 11.5 MPa by von Mises.

> [!problem] A gauge bar on two supports (d 5)
> A uniform bar of length $L$ rests on two supports placed symmetrically, and sags under its own weight. Where must the supports go for the two end faces to stay exactly parallel?
^inv-mc-gauge-bar

> [!solution]- Solution
> methods: mc-solids/deflection
> 1. Put the origin at the centre and the supports at $\pm c$; weight $w$ per length, each reaction $wL/2$. By symmetry the slope at the centre is zero.
> 2. The end faces stay normal to the axis, so they are parallel exactly when the slope at each end is zero.
> 3. On $c < \xi < L/2$, $M = -w(L/2 - \xi)^2/2$; on $0 < \xi < c$ add the reaction's $(wL/2)(c - \xi)$.
> 4. The end slope is $\tfrac{1}{EI}\int_0^{L/2} M\,d\xi = \tfrac{1}{EI}\left(-\tfrac{wL^3}{48} + \tfrac{wLc^2}{4}\right)$.
> 5. Set it to zero: $c^2 = L^2/12$, $c = L/(2\sqrt3)$.
> Answer: supports $L/\sqrt3 \approx 0.577L$ apart, each $0.211L$ from its end (checked symbolically). These are the Airy points, used to support length standards.
