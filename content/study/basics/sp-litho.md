---
study: basic
id: sp-litho
title: "Lithography: resolution, focus and overlay"
area: sp
needs: [op-wave]
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: [diffraction orders](op-wave.md#^grating), [the pupil as a filter](op-wave.md#^fourier-optics), [the Airy spot](op-wave.md#^airy) and [two-beam interference](op-wave.md#^superposition).
^needs

## Projection printing

> [!def] Projection lithography
> A **mask** (reticle) carries the pattern. Illumination optics light it, and a **projection lens** images it, usually reduced (4× in production tools; 1× in contact and proximity printing), onto **photoresist** on the wafer. A **stepper** exposes one field and then steps the wafer to the next; a **scanner** lights a slit and moves mask and wafer together through it. A maskless tool replaces the mask with a programmable micromirror array, as in the [stepper project](../../projects/stepper/index.md). All sizes below are at the wafer.
>
> The lens's numerical aperture is NA. The illumination reaches the mask over a range of angles; the **partial coherence** $\sigma$ is the sine of the illumination's largest angle divided by the NA (both measured on the same side). $\sigma = 0$ is a single on-axis plane wave.
^projection

A pattern of lines and spaces with pitch $p$ is a grating, so the mask sends light into [orders](op-wave.md#^grating) at $\sin\theta_m = \sin\theta_{\rm ill} + m\lambda/p$. In the pupil, where position is $\sin\theta$, the orders form a row of points spaced $\lambda/p$. The lens passes those inside the disc of radius NA, and the image is their interference.
^orders

## Resolution

> [!thm] Theorem 1 (smallest printable pitch)
> Lines and spaces of pitch $p$ lit by one plane wave make a patterned image only if at least two diffraction orders pass the pupil. On-axis illumination needs $p \ge \lambda/\mathrm{NA}$. The best tilt of the illumination, which puts the zero order and a first order at opposite edges of the pupil, needs only $p \ge \lambda/2\mathrm{NA}$. With illumination filling partial coherence $\sigma$, the limit is $p \ge \lambda/\mathrm{NA}(1 + \sigma)$. Written for the half-pitch,
> $$\mathrm{HP} = k_1\frac{\lambda}{\mathrm{NA}}, \qquad k_1 \ge 0.5 \text{ (on-axis coherent)}, \quad k_1 \ge 0.25 \text{ (any single exposure)}.$$
^resolution

> [!proof]- Proof (d 4)
> 1. The orders sit in the pupil at $\sin\theta_{\rm ill} + m\lambda/p$, a row spaced $\lambda/p$.
> 2. One order alone is a plane wave: uniform intensity, no lines. A patterned image needs at least two orders to interfere.
> 3. On axis the row is centred: the nearest orders to the zero order are $\pm\lambda/p$, inside the pupil only if $\lambda/p \le \mathrm{NA}$.
> 4. Tilting the illumination slides the row but keeps its spacing. The pupil is $2\mathrm{NA}$ wide, so two orders fit only if $\lambda/p \le 2\mathrm{NA}$, with equality when they sit at $-\mathrm{NA}$ and $+\mathrm{NA}$.
> 5. A source point at $\sigma'\mathrm{NA}$ puts the zero order there; the outermost points, $\sigma' = \sigma$, let a first order fit when $\lambda/p \le \mathrm{NA}(1 + \sigma)$.
> 6. Halve the pitch: $\mathrm{HP} = \lambda/2\mathrm{NA}$ on axis ($k_1 = 0.5$) and $\lambda/4\mathrm{NA}$ at best ($k_1 = 0.25$).
^p-resolution

$k_1$ in practice is a process number, not optics alone: it depends on the resist, the mask tricks and the tolerance for error. Production single exposures run at roughly $k_1 = 0.27$ to 0.35 (check); below that, patterns are split over several exposures. The Rayleigh separation $0.61\lambda/\mathrm{NA}$ is for isolated points ([Airy](op-wave.md#^airy)), a different question from dense lines.
^k1

## Depth of focus

> [!thm] Theorem 2 (depth of focus)
> Moving the wafer a distance $z$ along the axis shifts the phase of an order travelling at angle $\theta$ (in the medium of index $n$ above the wafer), relative to an axial wave, by $2\pi nz(1 - \cos\theta)/\lambda_0$. Allowing a path difference of $\lambda_0/4$ (Rayleigh's quarter-wave criterion, a convention), an image whose orders fill the pupil stays in focus over $\pm z$ with
> $$z = \frac{\lambda_0}{4n(1 - \cos\theta_{\max})} \approx \frac{n\lambda_0}{2\,\mathrm{NA}^2}, \qquad \sin\theta_{\max} = \mathrm{NA}/n.$$
> Written as $\mathrm{DOF} = \pm k_2\lambda/\mathrm{NA}^2$ (dry, $k_2 = 0.5$ for this criterion) and combined with Theorem 1 at fixed $k_1$,
> $$\mathrm{DOF} = \pm\frac{k_2}{k_1^2}\,\frac{\mathrm{HP}^2}{\lambda}.$$
> Halving the feature size costs four times the depth of focus; a shorter wavelength at the same feature size buys it back.
^dof

> [!proof]- Proof (d 4)
> 1. A plane wave at angle $\theta$ in index $n$ has phase $k_0n(x\sin\theta + z\cos\theta)$, with $k_0 = 2\pi/\lambda_0$; at fixed $x$, moving the wafer by $z$ changes it by $k_0nz\cos\theta$.
> 2. Relative to the axial wave the change is $k_0nz(1 - \cos\theta)$: a path difference $nz(1 - \cos\theta)$.
> 3. Set the path difference for the outermost order, $\sin\theta_{\max} = \mathrm{NA}/n$, equal to $\lambda_0/4$ and solve for $z$.
> 4. For small angles $1 - \cos\theta \approx \theta^2/2 \approx \mathrm{NA}^2/2n^2$, so $z \approx n\lambda_0/2\mathrm{NA}^2$.
> 5. With $n = 1$, substitute $\mathrm{NA} = k_1\lambda/\mathrm{HP}$: $z = k_2\lambda\,\mathrm{HP}^2/k_1^2\lambda^2$.
^p-dof

The depth of focus is a budget: chip flatness, resist thickness, focus control, stage tilt and drift all spend it. The [stepper](../../projects/stepper/index.md) at 410 nm and NA 0.25 has $\pm3.28$ µm paraxial ($\pm3.23$ µm from the exact form) and gives the stage $\pm0.5$ µm of it.
^dof-budget

## Resist

> [!def] Photoresist
> A light-sensitive film. In a **positive** resist the exposed areas dissolve in the developer; in a **negative** resist they stay. The **dose** is energy per area, irradiance times time (mJ/cm²). The **contrast** $\gamma$ of a positive resist is read from a measured curve of remaining thickness against $\log_{10}$ dose: thickness falls from full at dose $D_0$ to zero at $D_{100}$, and $\gamma = 1/\log_{10}(D_{100}/D_0)$; it is an empirical characterisation. Light is absorbed on its way down (Beer–Lambert, $I = I_0e^{-\alpha z}$), and light reflected by the substrate interferes with the incoming light, making **standing waves** along the depth that ripple the sidewalls; a bake after exposure or an anti-reflective layer under the resist smooths them. In a **chemically amplified** resist one photon makes an acid that, during the bake, catalyses many reactions; the acid's diffusion blurs the image by a few nanometres to tens of nanometres.
^resist

> [!thm] Theorem 3 (edge placement under a dose error)
> Model the resist as clearing wherever the delivered dose $D\,I(x)$ exceeds a threshold, with $I(x)$ the normalised aerial image. A small fractional dose error $\delta$ moves an edge by
> $$\delta x \approx \frac{\delta}{\mathrm{ILS}}, \qquad \mathrm{ILS} = \Big|\frac{d\ln I}{dx}\Big| \text{ at the edge},$$
> the **image log slope**. A line's width changes by twice that.
^edge-placement

> [!proof]- Proof (d 2.5)
> 1. The edge sits where $D\,I(x_e) = D_{\rm th}$, so $\ln I(x_e) = \ln D_{\rm th} - \ln D$.
> 2. A dose $D(1 + \delta)$ changes the right side by $-\ln(1 + \delta) \approx -\delta$.
> 3. To first order the edge moves until $\ln I$ changes by $-\delta$: $\delta x = -\delta\big/(d\ln I/dx)$, of size $\delta/\mathrm{ILS}$.
^p-edge-placement

## Overlay

> [!def] Overlay and its grid model
> **Overlay** is the placement error of one layer's pattern relative to the layer below, measured at marks printed by both. Across the wafer it is modelled as a smooth grid error; the four-term form is
> $$d_x = T_x + Mx - Ry, \qquad d_y = T_y + My + Rx,$$
> translation $T$, magnification $M$ and rotation $R$ (more terms add separate $x$ and $y$ magnification, non-orthogonality, and terms within each field). The tool corrects the fitted terms on the next exposure; what is left, the residual, is what limits the process. Independent contributions add in quadrature, as in any [error budget](pd-error-budget.md#^budget). A common rule of thumb asks overlay to be a third to a quarter of the smallest feature (a convention).
^overlay

> [!thm] Theorem 4 (fitting the grid from centred marks)
> If the marks are centred ($\sum x = \sum y = 0$), the least-squares fit of the four-term model separates:
> $$T_x = \overline{d_x}, \quad T_y = \overline{d_y}, \quad M = \frac{\sum(x\,d_x + y\,d_y)}{\sum(x^2 + y^2)}, \quad R = \frac{\sum(x\,d_y - y\,d_x)}{\sum(x^2 + y^2)}.$$
^overlay-fit

> [!proof]- Proof (d 3.5)
> 1. Minimise $\sum[(d_x - T_x - Mx + Ry)^2 + (d_y - T_y - My - Rx)^2]$: each partial derivative is zero at the minimum.
> 2. $\partial/\partial T_x$: $\sum(d_x - T_x - Mx + Ry) = 0$. With $\sum x = \sum y = 0$ this is $T_x = \overline{d_x}$; $T_y$ alike.
> 3. $\partial/\partial M$: $\sum[x(d_x - T_x - Mx + Ry) + y(d_y - T_y - My - Rx)] = 0$. The $T$ terms vanish by centring, the $R$ terms cancel ($xRy - yRx = 0$), leaving $M\sum(x^2 + y^2) = \sum(x\,d_x + y\,d_y)$.
> 4. $\partial/\partial R$: $\sum[y(d_x - T_x - Mx + Ry) - x(d_y - T_y - My - Rx)] = 0$. The $T$ terms vanish, the $M$ terms cancel, leaving $R\sum(x^2 + y^2) = \sum(x\,d_y - y\,d_x)$.
^p-overlay-fit

## Alignment

> [!def] Alignment
> Before exposing, the tool finds marks left by the previous layer and fits the grid model to where they are: a few marks per wafer (global alignment) or marks in every field (field by field). An off-axis alignment microscope sits beside the projection lens; the distance between its axis and the exposure axis (the **baseline**) is calibrated, and any drift in it shows up directly as overlay. Alignment light is chosen so it does not expose the resist (red light for a resist sensitive to violet, as on the stepper project), which brings a focus offset between the two wavelengths that must be calibrated too. A mark read at a height different from where the stage measures picks up an [Abbe error](pd-error-budget.md#^abbe) from any tilt.
^alignment

> [!thm] Theorem 5 (how well a mark can be located)
> If a mark's image has an intensity profile of standard deviation $s$ and the centre is estimated as the centroid of $N$ detected photons, with shot noise only, the estimate has standard deviation $s/\sqrt N$.
^mark-centroid

> [!proof]- Proof
> 1. Each detected photon's position is an independent draw from the profile, variance $s^2$.
> 2. Variances of independent draws add, so their sum has variance $Ns^2$.
> 3. The centroid is the sum divided by $N$: variance $s^2/N$.
^p-mark-centroid

With $s = 1$ µm, 10 nm needs only $10^4$ photons. Real alignment is limited by mark asymmetry from processing, focus and the stage, not by light.
^alignment-limits

## Extreme ultraviolet

At about 13.5 nm everything absorbs, air included, so EUV lithography runs in vacuum with reflective optics: mirrors coated with Mo/Si multilayers reflect about 70 % each near normal incidence, and the mask is a multilayer mirror with a patterned absorber, lit a few degrees off normal (check these numbers). The light comes from a tin plasma made by a laser hitting tin droplets. Production NA is about 0.33; high-NA tools are about 0.55 and use different reductions in the two directions (about 4× and 8×; check).
- At $k_1 = 0.3$: half-pitch 12.3 nm at NA 0.33 and 7.4 nm at NA 0.55. 193 nm immersion (water, $n \approx 1.44$, NA about 1.35) gives 43 nm.
- At $k_2 = 0.5$: depth of focus $\pm62$ nm at NA 0.33 and $\pm22$ nm at NA 0.55.
- Ten mirrors at 70 % pass $0.7^{10} = 2.8$ % of the light.
- An EUV photon carries 91.8 eV against 6.4 eV at 193 nm, so the same dose is 14 times fewer photons, and photon shot noise becomes a source of random edge and size errors (**stochastics**).
^euv

## Examples

> [!example] What the stepper can print
> At 410 nm through NA 0.25, find the smallest line half-pitch with on-axis coherent light and with the best tilted illumination, and the depth of focus.
^ex-stepper-resolution

> [!solution]- Solution
> methods: sp-litho/resolution, sp-litho/dof
> 1. On axis: $\mathrm{HP} = 0.5 \times 410/0.25 = 820$ nm. Best tilt: 410 nm.
> 2. $\mathrm{DOF} = \pm 410\text{ nm}/(2 \times 0.0625) = \pm3.28$ µm.
> A micromirror projector lights the pattern with a fixed illumination, so the on-axis figure is the one to plan with.

> [!example] Photons in a pixel
> At 13.5 nm and a dose of 30 mJ/cm², how many photons land in a 10 nm × 10 nm square, and what is their relative shot noise?
^ex-euv-photons

> [!solution]- Solution
> methods: sp-litho/euv
> 1. Photon energy $hc/\lambda = 1239.8/13.5 = 91.8$ eV $= 1.47\times10^{-17}$ J.
> 2. Energy in the square: $30\text{ mJ/cm}^2 \times 10^{-12}\text{ cm}^2 = 3\times10^{-14}$ J, so 2040 photons.
> 3. Shot noise $1/\sqrt{2040} = 2.2$ %, before counting that only a fraction is absorbed.

## Derive

> [!derive] Illumination tilted so that the zero and $-1$ orders of a pitch-$p$ grating make equal angles with the axis: show that defocus adds no phase difference between them, and find $\sin\theta_{\rm ill}$.
^d-symmetric-two-beam

> [!solution]- Solution
> methods: sp-litho/dof
> 1. The orders sit at $\sin\theta_{\rm ill}$ and $\sin\theta_{\rm ill} - \lambda/p$; equal angles about the axis means these are $\pm\lambda/2p$, so $\sin\theta_{\rm ill} = \lambda/2p$.
> 2. Equal angles give equal $\cos\theta$, so the defocus phase $k_0nz\cos\theta$ is the same for both; their interference pattern does not change with $z$. (Other orders and other source points still limit the depth of focus in practice.)

> [!derive] Show that filling the space between lens and wafer with a liquid of index $n$, keeping the ray angles fixed, divides the smallest half-pitch by $n$, and that at fixed NA it multiplies the depth of focus by $n$.
^d-immersion

> [!solution]- Solution
> methods: sp-litho/resolution, sp-litho/dof
> 1. At fixed angles, $\mathrm{NA} = n\sin\theta$ rises by $n$, and $\mathrm{HP} = k_1\lambda_0/\mathrm{NA}$ falls by $n$ (equivalently the wavelength in the liquid is $\lambda_0/n$).
> 2. At fixed NA, Theorem 2 gives $z \approx n\lambda_0/2\mathrm{NA}^2$: larger by $n$, because the rays are less steep in the liquid.

> [!derive] Show that a multilayer of bilayer period $\Lambda$ reflects most strongly at normal incidence near $\lambda = 2\Lambda$ (take the average index as 1), and give $\Lambda$ for 13.5 nm.
^d-multilayer-period

> [!solution]- Solution
> methods: op-wave/superposition
> 1. Reflections from successive interfaces of the same kind differ in path by $2\Lambda$.
> 2. They add in phase when $2\Lambda = m\lambda$; the first order gives $\Lambda = \lambda/2 = 6.75$ nm (real designs are slightly larger because the index is not exactly 1 and the angle not exactly normal).

> [!derive] A resist of index $n_r$ sits on a reflecting substrate. Show that the intensity in the resist varies with depth with period $\lambda_0/2n_r$, and evaluate it at 410 nm for $n_r = 1.7$.
^d-standing-waves

> [!solution]- Solution
> methods: op-wave/superposition
> 1. Incoming and reflected waves: $U = e^{ikz} + re^{-ikz}$ with $k = 2\pi n_r/\lambda_0$.
> 2. $|U|^2 = 1 + |r|^2 + 2|r|\cos(2kz + \arg r)$, period $\pi/k = \lambda_0/2n_r$.
> 3. 121 nm.

## Problems

> [!problem] An i-line exposure for 1 µm lines (d 2.5)
> Lines and spaces with a 1 µm half-pitch are to be printed at 365 nm with on-axis coherent illumination. What is the smallest NA that will do, and what depth of focus does that NA give?
^inv-sp-iline-na

> [!solution]- Solution
> methods: sp-litho/resolution, sp-litho/dof
> 1. $\mathrm{HP} = 0.5\lambda/\mathrm{NA}$, so $\mathrm{NA} \ge 0.5 \times 0.365/1 = 0.18$.
> 2. $\mathrm{DOF} = \pm0.365/(2 \times 0.1825^2) = \pm5.5$ µm.
> Answer: NA 0.18, $\pm5.5$ µm. More NA than needed only spends depth of focus.

> [!problem] A stage's tilt allowance (d 3)
> A projection system works at 365 nm with NA 0.15 and exposes a 2 mm square field. Half of the depth of focus is given to stage tilt. Taking the field centre as in focus, what tilt is allowed?
^inv-sp-tilt-allowance

> [!solution]- Solution
> methods: sp-litho/dof
> 1. $\mathrm{DOF} = \pm0.365/(2 \times 0.0225) = \pm8.11$ µm; half of it is $\pm4.06$ µm.
> 2. The worst direction is the diagonal: a corner is 1.41 mm from the centre.
> 3. Tilt $= 4.06\text{ µm}/1.41\text{ mm} = 2.9$ mrad.

> [!problem] Line width under a dose error (d 3.5)
> Dense lines of pitch 200 nm have aerial image $I(x) = 1 + 0.6\cos(2\pi x/p)$, and the dose is set so that the edges sit where $I = 1$. The dose drifts up by 2 %. How far does each edge move, and how much does the width of the bright region change?
^inv-sp-dose-error

> [!solution]- Solution
> methods: sp-litho/edge-placement
> 1. The edge is at $x = p/4$, where $|dI/dx| = 0.6 \times 2\pi/p$ and $I = 1$: $\mathrm{ILS} = 1.2\pi/p = 0.0188$ nm⁻¹.
> 2. $\delta x = 0.02/0.0188 = 1.06$ nm (solving the threshold exactly gives 1.04 nm).
> 3. Both edges move outward: the bright region widens by about 2.1 nm.

> [!problem] Overlay from five marks (d 4)
> Marks at $(x, y) = (-10, -10)$, $(10, -10)$, $(10, 10)$, $(-10, 10)$ and $(0, 0)$ mm read overlay $d_x = 8, 47, 15, -22, 12$ nm and $d_y = -45, -12, 28, -3, -8$ nm. Fit translation, magnification (ppm) and rotation (µrad), and give the largest residual.
^inv-sp-overlay-marks

> [!solution]- Solution
> methods: sp-litho/overlay-fit
> 1. The marks are centred. $T_x = 60/5 = 12$ nm, $T_y = -40/5 = -8$ nm.
> 2. $\sum(x\,d_x + y\,d_y) = 760 + 820 = 1580$ nm·mm and $\sum(x^2 + y^2) = 800$ mm², so $M = 1.975$ nm/mm $= 1.975$ ppm.
> 3. $\sum(x\,d_y - y\,d_x) = 640 + 620 = 1260$, so $R = 1.575$ µrad.
> 4. Residuals are at most 1.5 nm.
> Answer: $T = (12, -8)$ nm, $M \approx 2.0$ ppm, $R \approx 1.6$ µrad, residuals ≤ 1.5 nm.

> [!problem] Tuning a dipole to one pitch (d 4)
> A dry 193 nm tool with NA 0.93 must print a 130 nm pitch with the zero and first orders symmetric about the axis. At what $\sigma$ should the two illumination poles sit? With the poles at the pupil edge instead, what is the smallest pitch this tool can print in one exposure?
^inv-sp-dipole

> [!solution]- Solution
> methods: sp-litho/resolution
> 1. Symmetric orders: $\sin\theta_{\rm ill} = \lambda/2p = 193/260 = 0.742$.
> 2. $\sigma = 0.742/0.93 = 0.80$.
> 3. Poles at $\sigma = 1$: $p = \lambda/2\mathrm{NA} = 104$ nm.

> [!problem] A dose for quiet edges (d 4)
> At 13.5 nm, a resist absorbs 20 % of the photons that reach it. What dose keeps the relative shot noise of absorbed photons in a 10 nm × 10 nm square at 3 %?
^inv-sp-euv-dose

> [!solution]- Solution
> methods: sp-litho/euv
> 1. 3 % noise needs $N_{\rm abs} = (1/0.03)^2 = 1111$ absorbed photons, so $5556$ incident.
> 2. Energy: $5556 \times 1.47\times10^{-17}$ J $= 8.2\times10^{-14}$ J over $10^{-12}$ cm².
> Answer: about 82 mJ/cm². Halving the noise needs four times the dose, which is why EUV throughput and stochastics trade against each other.
