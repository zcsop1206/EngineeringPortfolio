---
study: basic
id: op-wave
title: "Wave optics: interference, diffraction and imaging"
area: op
needs: []
build: 1
tracks: [interviews]
---

> Written by a model for Adit. Not Adit's words.

Needs: nothing earlier. Complex numbers, $e^{i\theta}$ and the Fourier transform are used as defined where they first appear.
^needs

## Fields and intensity

> [!def] Complex amplitude, intensity, optical path
> Light of one frequency $\omega$ is treated as a scalar field $E(\mathbf r, t) = \operatorname{Re}[U(\mathbf r)\, e^{-i\omega t}]$; polarisation is ignored, which is safe until the cone of light gets wide. $U$ is the **complex amplitude**: its modulus is the field amplitude, its argument the phase. In a medium of refractive index $n$ the wavelength is $\lambda = \lambda_0 / n$, where $\lambda_0$ is the vacuum wavelength, and the wavenumber is $k = 2\pi/\lambda$. Detectors, eyes and photoresist respond to the time-averaged power per unit area, the **intensity**, taken here as $I = |U|^2$ (a constant dropped). A length $L$ of index $n$ has **optical path** $nL$ and adds phase $2\pi n L / \lambda_0$.
^def-field

> [!thm] Superposition and two-beam interference
> Fields with a fixed phase relation add: $U = U_1 + U_2$. Intensities do not. With $U_j = \sqrt{I_j}\, e^{i\phi_j}$,
> $$I = I_1 + I_2 + 2\sqrt{I_1 I_2}\cos(\phi_2 - \phi_1).$$
> The **visibility** of the fringes this makes as $\phi_2 - \phi_1$ varies is $V = (I_{\max} - I_{\min})/(I_{\max} + I_{\min})$.
^superposition

> [!proof]- Proof
> 1. $I = (U_1 + U_2)(U_1 + U_2)^* = |U_1|^2 + |U_2|^2 + U_1^* U_2 + U_1 U_2^*$.
> 2. The last two terms are a number plus its conjugate, $2\operatorname{Re}(U_1^* U_2) = 2\sqrt{I_1 I_2}\cos(\phi_2 - \phi_1)$.
^p-superposition

"Fixed phase relation" is what coherent means; the section on coherence below says when it fails.

## Thin films

> [!def] Fresnel coefficients at normal incidence
> Light going from index $n_a$ into index $n_b$ at normal incidence is reflected with amplitude ratio $r_{ab} = (n_a - n_b)/(n_a + n_b)$ and transmitted with $t_{ab} = 2n_a/(n_a + n_b)$. These follow from continuity of the tangential electric and magnetic fields at the boundary and are taken as given. $r_{ab} < 0$ when going into the higher index: the reflected wave is flipped by $\pi$.
^fresnel

> [!thm] Theorem 1 (single film)
> A film of index $n_1$ and thickness $d$ lies between index $n_0$ above and $n_2$ below. At normal incidence and vacuum wavelength $\lambda$, with $\beta = 2\pi n_1 d/\lambda$, the reflected amplitude is
> $$r = \frac{r_{01} + r_{12} e^{2i\beta}}{1 + r_{01} r_{12} e^{2i\beta}},$$
> and when the indices are real,
> $$R = |r|^2 = \frac{r_{01}^2 + r_{12}^2 + 2 r_{01} r_{12}\cos 2\beta}{1 + r_{01}^2 r_{12}^2 + 2 r_{01} r_{12} \cos 2\beta}.$$
> If $r_{01} r_{12} > 0$, $R$ is least when $2 n_1 d = (m + \tfrac12)\lambda$ and greatest when $2 n_1 d = m\lambda$, $m = 0, 1, 2, \dots$; if $r_{01} r_{12} < 0$ the two swap. At oblique incidence $n_1 d$ becomes $n_1 d \cos\theta_1$, with $\theta_1$ the angle inside the film.
^thin-film

> [!proof]- Proof (d 4)
> 1. Take the incident amplitude as 1. The wave reflected at the top surface has amplitude $r_{01}$.
> 2. The transmitted part $t_{01}$ crosses the film, reflects with $r_{12}$, crosses back and leaves with $t_{10}$. Each crossing adds phase $\beta$, so this wave is $t_{01} r_{12} t_{10} e^{2i\beta}$.
> 3. Each further round trip inside the film adds one reflection off the top from below ($r_{10} = -r_{01}$), one off the bottom ($r_{12}$) and phase $2\beta$: a factor $-r_{01} r_{12} e^{2i\beta}$.
> 4. Sum the geometric series: $r = r_{01} + t_{01} t_{10} r_{12} e^{2i\beta} / (1 + r_{01} r_{12} e^{2i\beta})$.
> 5. From the Fresnel coefficients, $t_{01} t_{10} = 4 n_0 n_1/(n_0 + n_1)^2 = 1 - r_{01}^2$.
> 6. Over the common denominator the numerator is $r_{01} + r_{01}^2 r_{12} e^{2i\beta} + (1 - r_{01}^2) r_{12} e^{2i\beta} = r_{01} + r_{12} e^{2i\beta}$.
> 7. Multiply $r$ by its conjugate and write $c = \cos 2\beta$: $R = (a + bc)/(e + bc)$ with $a = r_{01}^2 + r_{12}^2$, $b = 2 r_{01} r_{12}$, $e = 1 + r_{01}^2 r_{12}^2$.
> 8. $dR/dc = b(e - a)/(e + bc)^2$ and $e - a = (1 - r_{01}^2)(1 - r_{12}^2) > 0$, so for $b > 0$, $R$ rises with $c$: least at $c = -1$, greatest at $c = 1$; for $b < 0$ the reverse.
> 9. $c = -1$ is $2\beta = (2m+1)\pi$, that is $2 n_1 d = (m + \tfrac12)\lambda$; $c = 1$ is $2 n_1 d = m\lambda$.
^p-thin-film

Thermal oxide on silicon: $n_1 \approx 1.46$, and silicon $n_2 \approx 3.88$ at 633 nm (silicon also absorbs a little in the visible; that is ignored here). Then $r_{01} = -0.187$ and $r_{12} = -0.453$, both negative, so $R$ is least at $2 n_1 d = (m + \tfrac12)\lambda$. A film with $2 n_1 d = m\lambda$ reflects exactly like bare silicon, and the pattern repeats every $\lambda / 2n_1$ of thickness, 217 nm at 633 nm. In white light each thickness removes the wavelengths at its minima and the eye sees the rest: that is where oxide colours come from.
^thin-film-oxide

## The Michelson interferometer

> [!thm] Michelson output
> A beamsplitter divides a beam into two arms ending in mirrors and recombines the returns. If the arm lengths differ by $\delta$ in a medium of index $n$, the output is
> $$I = I_1 + I_2 + 2\sqrt{I_1 I_2}\cos(4\pi n \delta/\lambda_0).$$
> Moving one mirror by $\lambda_0 / 2n$ passes one full fringe. Counting fringes measures displacement in units of half a wavelength; two detectors a quarter fringe apart give the direction as well.
^michelson

> [!proof]- Proof
> 1. The light in the longer arm travels $\delta$ further out and $\delta$ further back: optical path difference $2n\delta$, phase difference $4\pi n\delta/\lambda_0$.
> 2. Put that phase difference into the two-beam formula.
^p-michelson

In air, $n - 1 \approx 2.7 \times 10^{-4}$ for visible light, and it changes by about $-0.9$ ppm per kelvin and $+0.27$ ppm per hPa (check before relying on these). A displacement interferometer that uses the vacuum wavelength reads long by the factor $n$, so precision interferometers log air temperature and pressure.
^michelson-air

## Coherence

Two waves of different frequency have no fixed phase relation over any detector's averaging time, and neither do waves from two different points of a thermal source or an LED. Their cross terms average to zero, so their **intensities** add. That is what **mutually incoherent** means.
^incoherent

> [!thm] Theorem 2 (coherence length and coherence width)
> (a) Temporal. A source with a flat spectrum over wavenumbers $k_0 \pm \Delta k/2$ feeds a two-beam interferometer with equal arm intensities and optical path difference $\Delta$. Then $I(\Delta) \propto 1 + \operatorname{sinc}(\Delta k\,\Delta/2)\cos(k_0 \Delta)$, with $\operatorname{sinc} u = \sin u / u$. The visibility $|\operatorname{sinc}(\Delta k\,\Delta/2)|$ first vanishes at $\Delta = 2\pi/\Delta k \approx \lambda^2/\Delta\lambda$, the **coherence length** $l_c$.
>
> (b) Spatial. A uniform incoherent strip source of width $s$ at distance $L$ lights two pinholes a distance $d$ apart, with $s, d \ll L$. The fringes have visibility $|\operatorname{sinc}(\pi s d/\lambda L)|$, first zero at $d = \lambda L/s$, the **coherence width**.
^coherence

> [!proof]- Proof (d 3.5)
> 1. One wavenumber alone gives $1 + \cos(k\Delta)$, by two-beam interference with equal intensities.
> 2. Different wavenumbers are incoherent, so their intensities add: $I \propto \frac{1}{\Delta k}\int_{k_0 - \Delta k/2}^{k_0 + \Delta k/2} (1 + \cos k\Delta)\, dk$.
> 3. The cosine integrates to $\frac{2}{\Delta}\cos(k_0\Delta)\sin(\Delta k\,\Delta/2)$; dividing by $\Delta k$ gives $\operatorname{sinc}(\Delta k\,\Delta/2)\cos(k_0\Delta)$.
> 4. The first zero is at $\Delta k\,\Delta/2 = \pi$. Since $k = 2\pi/\lambda$, $\Delta k \approx 2\pi\Delta\lambda/\lambda^2$, so $\Delta \approx \lambda^2/\Delta\lambda$.
> 5. For (b), a source point at transverse position $x$ is at distances $\approx L + (x \mp d/2)^2/2L$ from the two pinholes, which differ by $xd/L$: its fringes are shifted in phase by $2\pi x d/\lambda L$.
> 6. Source points are incoherent, so their fringe patterns add in intensity. Averaging $\cos(\phi + 2\pi x d/\lambda L)$ over $x \in [-s/2, s/2]$ gives $\operatorname{sinc}(\pi s d/\lambda L)\cos\phi$, as in step 3.
^p-coherence

## Diffraction

> [!def] Fresnel propagation
> A field $U_0(\xi, \eta)$ in the plane $z = 0$ produces, in the plane $z$,
> $$U(x, y) = \frac{e^{ikz}}{i\lambda z}\iint U_0(\xi, \eta)\, \exp\!\Big(\frac{ik}{2z}\big[(x - \xi)^2 + (y - \eta)^2\big]\Big)\, d\xi\, d\eta.$$
> This is Huygens' principle: every point of the plane re-radiates a spherical wave, with the sphere's phase expanded to second order in the transverse distance (paraxial: small angles). It is the starting point here.
^fresnel-integral

> [!thm] Theorem 3 (far field)
> Let $U_0$ vanish outside $|\xi|, |\eta| \le a$ and let $z \gg a^2/\lambda$. Then, apart from the factor $1/\lambda z$ and a phase that depends on $x, y$ only, $U(x, y)$ is the Fourier transform $\tilde U_0(f_x, f_y) = \iint U_0\, e^{-2\pi i (f_x \xi + f_y \eta)}\, d\xi\, d\eta$ at $f_x = x/\lambda z$, $f_y = y/\lambda z$. A direction at angle $\theta$ to the axis carries spatial frequency $\sin\theta/\lambda$.
^diffraction

> [!proof]- Proof (d 3)
> 1. Expand $(x - \xi)^2 = x^2 - 2x\xi + \xi^2$, and the same in $y$.
> 2. The $x^2 + y^2$ term does not depend on $\xi, \eta$; it leaves the integral as a phase factor.
> 3. For $|\xi|, |\eta| \le a$ the $\xi^2 + \eta^2$ term has phase at most of order $\pi a^2/\lambda z$, which is $\ll 1$ when $z \gg a^2/\lambda$; drop it.
> 4. What is left is $\exp(-2\pi i [x\xi + y\eta]/\lambda z)$, the Fourier kernel at $f_x = x/\lambda z$, $f_y = y/\lambda z$; and $x/z \approx \sin\theta$.
^p-diffraction

Two consequences used everywhere. A slit of width $a$ has far-field intensity $\propto \operatorname{sinc}^2(\pi a \sin\theta/\lambda)$, with zeros at $\sin\theta = m\lambda/a$. A grating of period $p$ lit at angle $\theta_{\rm in}$ sends light only into the **orders** $\sin\theta_m = \sin\theta_{\rm in} + m\lambda/p$. Both are derive prompts below.
^grating

## Lenses and imaging

> [!def] Thin lens
> A thin lens of focal length $f$ multiplies the field passing through it by $\exp(-ik(\xi^2 + \eta^2)/2f)$: it delays the centre more than the edge, turning a plane wave into one converging on a point a distance $f$ away. The **numerical aperture** of an imaging lens is $\mathrm{NA} = n\sin\theta_{\max}$, with $\theta_{\max}$ the half-angle of the cone of light reaching the image and $n$ the index there.
^def-lens

> [!thm] Theorem 4 (a lens takes a Fourier transform)
> If $U_\ell$ is the field just before a thin lens, the field in its back focal plane is, apart from $1/\lambda f$ and a phase depending on $x, y$ only, $\tilde U_\ell(x/\lambda f,\, y/\lambda f)$.
>
> Consequences. In a 4f system (object one focal length before lens 1, lens 2 one focal length after its back focal plane, image one focal length after lens 2), the back focal plane of lens 1 holds the object's spectrum. An aperture there, the **pupil**, of radius $a$ passes only spatial frequencies below $a/\lambda f$, and the image is the inverted object with those frequencies alone. With $\mathrm{NA} = a/f$: in coherent light the image amplitude contains frequencies up to $\mathrm{NA}/\lambda$. In incoherent light the image intensity contains frequencies up to $2\mathrm{NA}/\lambda$, because the intensity's spectrum is the autocorrelation of the pupil, which reaches twice as far.
^fourier-optics

> [!proof]- Proof (d 3.5)
> 1. Just after the lens the field is $U_\ell(\xi, \eta)\exp(-ik(\xi^2 + \eta^2)/2f)$.
> 2. Propagate it a distance $f$ with the Fresnel integral, whose kernel is $\exp(ik[(x - \xi)^2 + (y - \eta)^2]/2f)$.
> 3. Expanded, the kernel's $\xi^2 + \eta^2$ term is $\exp(+ik(\xi^2 + \eta^2)/2f)$, which cancels the lens phase exactly.
> 4. What remains is $\exp(ik(x^2 + y^2)/2f)\iint U_\ell\, \exp(-2\pi i[x\xi + y\eta]/\lambda f)\, d\xi\, d\eta$: the Fourier transform at $x/\lambda f$, $y/\lambda f$, times a phase.
^p-fourier-optics

When the object sits one focal length in front of the lens instead, the leftover phase vanishes as well and the transform is exact; that is why the 4f layout is the textbook model of an imaging system.
^fourier-optics-note

> [!thm] Theorem 5 (Airy pattern and the Rayleigh criterion)
> A uniformly lit circular aperture of diameter $D$ has far-field intensity $\propto [2J_1(v)/v]^2$ with $v = \pi D\sin\theta/\lambda$, where $J_1$ is the Bessel function of order 1. The first zero is at $v = 3.832$, so $\sin\theta = 1.22\,\lambda/D$. A lens of numerical aperture NA images a point to this pattern with first dark ring at radius
> $$r_A = 0.61\,\lambda_0/\mathrm{NA}.$$
> **Rayleigh's criterion**: two incoherent points are just resolved when one's peak falls on the other's first dark ring, a separation of $0.61\,\lambda_0/\mathrm{NA}$.
^airy

> [!proof]- Proof (d 3)
> 1. By Theorem 3 the far field is the Fourier transform of the disc. In polar coordinates, using $\int_0^{2\pi} e^{-iu\cos\psi}\, d\psi = 2\pi J_0(u)$ (a definition of $J_0$), it is $2\pi\int_0^{D/2} J_0(c\rho)\,\rho\, d\rho$ with $c = 2\pi\sin\theta/\lambda$.
> 2. Substitute $u = c\rho$ and use $\frac{d}{du}[u J_1(u)] = u J_0(u)$ (a Bessel identity, taken as given): the integral is $(D/2)^2\, J_1(v)/v$ with $v = cD/2 = \pi D \sin\theta/\lambda$, so the amplitude is $\propto 2J_1(v)/v$, normalised to 1 at $v = 0$.
> 3. The first positive zero of $J_1$ is 3.8317 (tabulated), giving $\sin\theta = 3.8317\,\lambda/\pi D = 1.22\,\lambda/D$.
> 4. By Theorem 4 the image of a point is the far field of the pupil seen from the image, at distance $z'$; the pupil radius $D/2$ subtends $\sin\theta_{\max} \approx D/2z'$ there.
> 5. The first zero in the image plane is at $r = z'\sin\theta = 1.22\,\lambda z'/D = 0.61\,\lambda/\sin\theta_{\max}$. In a medium of index $n$, $\lambda = \lambda_0/n$, so $r = 0.61\,\lambda_0/\mathrm{NA}$.
^p-airy

Step 4 uses the small-angle form; the same result holds at large NA for a lens that satisfies the Abbe sine condition, stated here without proof.
^airy-note

## Gaussian beams

> [!def] Paraxial wave equation
> Write a beam travelling along $z$ as $U = A(x, y, z)\, e^{ikz}$ with $A$ changing slowly in $z$ over a wavelength. Putting this into the wave equation $(\nabla^2 + k^2)U = 0$ and dropping $\partial^2 A/\partial z^2$ leaves
> $$\nabla_\perp^2 A + 2ik\,\frac{\partial A}{\partial z} = 0.$$
^paraxial

> [!thm] Theorem 6 (Gaussian beam)
> $A = \frac{1}{q(z)}\exp\!\big(ik(x^2 + y^2)/2q(z)\big)$ with $q(z) = z - i z_R$ solves the paraxial equation for every $z_R > 0$. Its intensity is $\propto \exp(-2r^2/w(z)^2)$ with
> $$w(z) = w_0\sqrt{1 + (z/z_R)^2}, \qquad z_R = \pi w_0^2/\lambda.$$
> $w_0$, the 1/e² intensity radius at $z = 0$, is the **waist**, and $z_R$ the **Rayleigh range**. For $z \gg z_R$ the radius grows linearly with half-angle $\theta = \lambda/\pi w_0$. A lens of focal length $f$ focuses a collimated beam of radius $w$ to a waist $w_0' \approx \lambda f/\pi w$.
^gaussian-beam

> [!proof]- Proof (d 4)
> 1. Let $s = x^2 + y^2$; since $dq/dz = 1$, $\partial A/\partial z = A\,(-1/q - iks/2q^2)$.
> 2. $\partial A/\partial x = A\, ikx/q$, so $\partial^2 A/\partial x^2 = A\,(ik/q - k^2x^2/q^2)$; adding the $y$ term, $\nabla_\perp^2 A = A\,(2ik/q - k^2 s/q^2)$.
> 3. $2ik\,\partial A/\partial z = A\,(-2ik/q + k^2 s/q^2)$, which cancels step 2 exactly.
> 4. $1/q = (z + iz_R)/(z^2 + z_R^2)$, so $|\exp(iks/2q)| = \exp(-ks z_R/2(z^2 + z_R^2))$.
> 5. The intensity is its square, $\exp(-ks z_R/(z^2 + z_R^2)) = \exp(-2s/w^2)$ with $w^2 = 2(z^2 + z_R^2)/k z_R$.
> 6. At $z = 0$, $w_0^2 = 2z_R/k = \lambda z_R/\pi$, so $z_R = \pi w_0^2/\lambda$ and $w^2 = w_0^2(1 + z^2/z_R^2)$.
> 7. For $z \gg z_R$, $w \approx w_0 z/z_R = \lambda z/\pi w_0$: half-angle $\lambda/\pi w_0$.
> 8. A lens turns a collimated beam of radius $w$ into one converging with half-angle $w/f$; by step 7 the waist with that angle is $w_0' = \lambda/\pi(w/f) = \lambda f/\pi w$.
^p-gaussian-beam

## Examples

> [!example] Which oxide thicknesses remove green
> For thermal oxide on silicon ($n_1 = 1.46$), find the three thinnest films whose reflectance at normal incidence is least at 550 nm.
^ex-oxide-green

> [!solution]- Solution
> methods: op-wave/thin-film
> 1. Both Fresnel coefficients are negative, so minima sit at $2 n_1 d = (m + \tfrac12)\lambda$.
> 2. $d = (m + \tfrac12)\cdot 550/(2 \cdot 1.46)$ nm $= 94.2$, $282.5$, $470.9$ nm for $m = 0, 1, 2$.
> 3. All three suppress green; they look different because each removes a different set of other wavelengths too (the thicker ones have more minima in the visible).

> [!example] Counting fringes on a stage
> A Michelson interferometer with 632.8 nm (vacuum) light watches a mirror on a stage. The counter reads 1580 fringes. What did the stage move, computed with the vacuum wavelength, and how much does air ($n = 1.00027$) change that?
^ex-fringe-count

> [!solution]- Solution
> methods: op-wave/michelson
> 1. One fringe per $\lambda_0/2$: $1580 \times 316.4$ nm $= 499.91$ µm.
> 2. In air one fringe is $\lambda_0/2n$, so the true move is $499.91/1.00027 = 499.78$ µm.
> 3. The correction is 0.135 µm, far more than the interferometer's resolution, which is why the air index is logged.

> [!example] The stepper objective's spot
> The [stepper](../../projects/stepper/index.md) exposes at 410 nm through an objective of NA 0.25. How large is the image of a point, and how close can two incoherent points be and still be resolved?
^ex-stepper-airy

> [!solution]- Solution
> methods: op-wave/airy
> 1. $r_A = 0.61 \times 410\text{ nm}/0.25 = 1.00$ µm: the first dark ring has a 1 µm radius.
> 2. Rayleigh: two points 1.0 µm apart are just resolved. That is the "1 µm limit" of the objective; periodic lines are a different question (lithography's resolution).

> [!example] Focusing a laser
> A 633 nm laser beam with a 0.5 mm 1/e² radius goes through a lens of focal length 100 mm. Find the focused waist and its Rayleigh range.
^ex-focus

> [!solution]- Solution
> methods: op-wave/gaussian-beam
> 1. $w_0' = \lambda f/\pi w = 633\text{ nm} \times 100\text{ mm}/(\pi \times 0.5\text{ mm}) = 40.3$ µm.
> 2. $z_R = \pi w_0'^2/\lambda = 8.06$ mm, so the spot stays within $\sqrt2$ of its waist over about 16 mm.

## Derive

> [!derive] Prove that two coherent beams of intensities $I_1, I_2$ make fringes of visibility $V = 2\sqrt{I_1 I_2}/(I_1 + I_2)$, and find $V$ when one beam is ten times brighter than the other.
^d-visibility

> [!solution]- Solution
> methods: op-wave/superposition
> 1. $I_{\max, \min} = I_1 + I_2 \pm 2\sqrt{I_1 I_2}$; subtract and add.
> 2. For $I_1 = 10 I_2$: $V = 2\sqrt{10}/11 = 0.57$. Fringes survive large intensity mismatch.

> [!derive] Prove the grating equation $\sin\theta_m = \sin\theta_{\rm in} + m\lambda/p$ for a grating of period $p$, and the zeros $\sin\theta = m\lambda/a$ ($m \ne 0$) of a single slit of width $a$.
^d-grating

> [!solution]- Solution
> methods: op-wave/diffraction
> 1. Grating: light leaving two neighbouring periods at angle $\theta$ has path difference $p(\sin\theta - \sin\theta_{\rm in})$. All periods add in phase only when that is $m\lambda$; elsewhere the many contributions cancel.
> 2. Slit: by Theorem 3 the amplitude is $\int_{-a/2}^{a/2} e^{-2\pi i f\xi}d\xi = a\operatorname{sinc}(\pi a f)$ with $f = \sin\theta/\lambda$. It vanishes at $\pi a f = m\pi$, $m \ne 0$.

> [!derive] Prove that a film whose optical thickness is a whole number of half-wavelengths ($2 n_1 d = m\lambda$) leaves the reflectance at that wavelength equal to that of the bare substrate, whatever the three indices.
^d-half-wave

> [!solution]- Solution
> methods: op-wave/thin-film
> 1. $2 n_1 d = m\lambda$ makes $e^{2i\beta} = 1$.
> 2. Then $r = (r_{01} + r_{12})/(1 + r_{01} r_{12})$; substituting the Fresnel formulas, this simplifies to $(n_0 - n_2)/(n_0 + n_2) = r_{02}$.

> [!derive] For a Gaussian beam, show that $w_0\theta = \lambda/\pi$, that the wavefront radius of curvature is $R(z) = z + z_R^2/z$, and that $R$ is smallest at $z = z_R$.
^d-gauss-curvature

> [!solution]- Solution
> methods: op-wave/gaussian-beam
> 1. $\theta = \lambda/\pi w_0$ from Theorem 6, so $w_0\theta = \lambda/\pi$.
> 2. The phase of $\exp(iks/2q)$ is $ks\operatorname{Re}(1/q)/2$, a sphere of radius $R$ when $1/R = \operatorname{Re}(1/q) = z/(z^2 + z_R^2)$.
> 3. $R = z + z_R^2/z$; $dR/dz = 1 - z_R^2/z^2 = 0$ at $z = z_R$, where $R = 2z_R$.

## Problems

> [!problem] An oxide taper (d 2.5)
> A thermal oxide was etched to a smooth taper running from bare silicon up to the full film. Under 589 nm light at normal incidence you count 5 dark bands across the taper, and the full-thickness region is as bright as the bare silicon. Oxide index 1.46. How thick is the film?
^inv-op-oxide-taper

> [!solution]- Solution
> methods: op-wave/thin-film
> 1. Oxide on silicon: dark at $2n_1 d = (m + \tfrac12)\lambda$, bright as bare silicon at $2n_1 d = m\lambda$; bare silicon itself is $m = 0$.
> 2. Five dark bands ($m = 0$ to 4) and a bright top means the top is $m = 5$.
> 3. $d = 5\lambda/2n_1 = 5 \times 589/2.92 = 1009$ nm.
> Answer: about 1.01 µm.

> [!problem] Equal arms with an LED (d 3)
> A Michelson interferometer is lit by a 410 nm LED whose spectrum you may treat as flat from 402.5 to 417.5 nm. Starting from equal arm lengths, how far can the moving mirror go before the fringes first vanish?
^inv-op-led-arms

> [!solution]- Solution
> methods: op-wave/coherence
> 1. Coherence length $l_c \approx \lambda^2/\Delta\lambda = 410^2/15$ nm $= 11.2$ µm of optical path difference.
> 2. The mirror moves half of that: 5.6 µm. (A flat spectrum in wavelength is nearly flat in wavenumber over 15 nm; a numerical check of the flat-in-$k$ case gives visibility 0.0003 at this point.)
> Answer: about 5.6 µm, which is why a broadband source finds zero path difference to a few microns.

> [!problem] One reflectance reading (d 4)
> A reflectometer at 633 nm reads $R = 0.20$ on thermal oxide over silicon at normal incidence. Take $n_{\rm ox} = 1.46$, $n_{\rm Si} = 3.88$, no absorption. List every oxide thickness below 300 nm consistent with the reading.
^inv-op-one-reading

> [!solution]- Solution
> methods: op-wave/thin-film
> 1. $r_{01} = -0.1870$, $r_{12} = -0.4532$; bare silicon gives $R = 0.348$ and the quarter-wave minimum ($d = 108.4$ nm) gives $R = 0.0846$, so 0.20 is reached twice per period.
> 2. Solve $R(c) = 0.20$ for $c = \cos 2\beta$: $c = (0.20\,e - a)/(b(1 - 0.20))$ with $a, b, e$ as in Theorem 1, then $2\beta = \pm\arccos c + 2\pi m$.
> 3. The roots below 300 nm are $d = 64.2$, $152.5$ and $281.0$ nm (the period is 216.8 nm).
> Answer: 64, 153 or 281 nm. A second wavelength or a spectrum is needed to pick one.

> [!problem] A spot on a far wall (d 3.5)
> A 650 nm laser beam reflects off a small mirror and lands on a wall 2 m away. Take the beam's waist at the mirror and choose its size to make the spot on the wall as small as possible. What is that spot radius, and what mirror tilt moves the spot by a tenth of it?
^inv-op-wall-spot

> [!solution]- Solution
> methods: op-wave/gaussian-beam
> 1. $w(L)^2 = w_0^2 + (\lambda L/\pi w_0)^2$, smallest when $w_0^2 = \lambda L/\pi$, giving $w(L) = \sqrt2\, w_0$.
> 2. $w_0 = \sqrt{650\text{ nm} \times 2\text{ m}/\pi} = 0.643$ mm and $w(L) = 0.910$ mm.
> 3. A mirror tilt $\theta$ turns the beam by $2\theta$; the spot moves $2\theta L$. Setting $2\theta L = 0.091$ mm gives $\theta = 22.7$ µrad.
> Answer: 0.91 mm radius; about 23 µrad of tilt.

> [!problem] Fringes from an LED die (d 3.5)
> A red LED (625 nm, narrow band) has a uniformly glowing square die 1 mm wide. It sits 50 mm in front of two narrow slits 20 µm apart, parallel to one edge of the die. What is the fringe visibility? How far back must the LED move for the visibility to reach 0.9?
^inv-op-led-die

> [!solution]- Solution
> methods: op-wave/coherence
> 1. Only the die's width across the slits matters: $u = \pi s d/\lambda L = \pi \times 1\text{ mm} \times 20\text{ µm}/(625\text{ nm} \times 50\text{ mm}) = 2.01$.
> 2. $V = |\sin u/u| = 0.45$.
> 3. For $V = 0.9$, solve $\sin u/u = 0.9$: $u = 0.787$. Then $L = \pi s d/\lambda u = 128$ mm.
> Answer: $V \approx 0.45$; move the LED to about 128 mm.
