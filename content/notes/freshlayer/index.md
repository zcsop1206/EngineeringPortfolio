---
title: Why SLS printers heat each new layer of powder
description: Every few seconds, an SLS printer dumps a cold layer of powder onto a bed it must hold within 2 °C. This note works out, from public data, where the heat comes from, why my first answer was wrong, what the cold layer really costs, and how I would test it on a bench and on a real printer.
date: 2026-11-13
cover: freshlayer_wait.png
cover_on_page: false
publish: true
---
## The puzzle

Selective laser sintering (SLS) builds parts from powder. A roller spreads nylon 110 µm thick. A laser melts the part's cross-section. The bed drops one layer, and the roller spreads the next.

The temperature must be controlled carefully within a temperature range; parts can crystallize, shrink, and warp below it, and loose powder can melt above it.

That looked hard to square with how the machine works. Every few seconds, fresh powder lands on the bed, and it cannot arrive at exactly bed temperature. Powder is mostly air, so heat crawls through it.

Where does the heat to warm each layer come from? What does taking it do to the part just printed underneath? And how does 2 °C survive?

I worked this through for Formlabs' benchtop SLS printer, the Fuse 1+ 30W, using only public data. Its real feed temperature, layer time and heater power are not public, so those are assumed.

![Section through an SLS powder bed while a new layer is spread: radiant heaters above, a roller moving right and leaving a 110 µm layer behind it, loose powder below with two printed parts whose tops touch the new layer, and arrows showing heat coming down from the heaters or up from the parts](freshlayer_section.png)

*Figure 1. A new layer being spread (not to scale). Its heat comes either from the heaters above or from the powder and parts below.*

## Inputs

| Quantity                                                        | Value                              | Source                                     |
| --------------------------------------------------------------- | ---------------------------------- | ------------------------------------------ |
| Build area, layer thickness $L$, laser power                    | 16.5 × 16.5 cm, 110 µm, 30 W       | Fuse 1+ specifications                     |
| Powder density $\rho$, specific heat $c_p$, conductivity $k$    | 456 kg/m³, 2470 J/kg K, 0.10 W/m K | Yuan, Bourell and Diller 2011              |
| Heat of melting                                                 | 115 J/g                            | EOS PA2200 data sheet (a similar nylon 12) |
| Bed temperature, melting and crystallization onsets             | 168, 181, 153 °C                   | NETZSCH 2020 (typical nylon 12)            |
| How far below bed temperature the new layer arrives, $\Delta T$ | 30 K                               | assumed                                    |
| Time between layers                                             | 10 s                               | assumed                                    |

## 1. First estimates

Start with energy. One layer is 1.37 g of powder and takes 3.4 J per kelvin. A layer 30 K cold is 101 J short.

Melting the part in that layer, say a fifth of it, takes about 31 J. So 9 K of cold powder costs as much as the laser spends melting the part.

Then speed. Powder's thermal diffusivity, its conductivity over the heat it stores per unit volume, is

$$\alpha = \frac{k}{\rho c_p} = 8.9 \times 10^{-8} \text{ m}^2/\text{s}$$

Heat crosses one layer in $L^2/\alpha = 0.14$ s. A cold layer equalizes with whatever lies beneath it in a tenth of a second, faster than any heater above could plausibly respond.

## 2. When the cold layer lands

To see how hard the layer below gets hit, take the simplest case. No heat from above, the top insulated, both layers the same powder.

An insulated top acts like a mirror. The problem becomes a cold slab $2L$ thick buried in powder, and that has an exact solution:

$$\theta(x,t) = \frac{\Delta T}{2}\left[\operatorname{erf}\frac{L-x}{2\sqrt{\alpha t}} + \operatorname{erf}\frac{L+x}{2\sqrt{\alpha t}}\right]$$

Here $\theta$ is how far below bed temperature the powder sits at depth $x$. The error function, erf, describes how a sharp temperature step smears out.

At first contact, the two layers meet at their average. The layer below drops by half of $\Delta T$: 15 K for a 30 K layer. Over a printed part it drops only about 9 K, because a part's effusivity $\sqrt{k \rho c_p}$, its grip on its own temperature, is 2.4 times the powder's.

A step-by-step numerical calculation matches the exact solution to within 0.012 K.

![Two plots. Left: temperature below bed temperature against depth, for a new layer 30 K cold with no heat from above, at the start and 0.01, 0.1, 1 and 10 s later. Right: temperature at the top of the previous layer against time on a log scale, for new layers 10, 20 and 30 K cold; each stays at half its starting difference for about 30 ms, then recovers](freshlayer_profiles.png)

*Figure 2. Left: the temperature profile after a 30 K cold layer lands, with no heat from above. Right: the top of the layer below, for three starting gaps.*

## 3. A wrong turn

A 15 K plunge blows straight through a 2 °C band. On a 168 °C bed, it lands next to the 153 °C crystallization onset. I thought this dip threatens the part, so warm the powder before it is spread, until it arrives within 4 K of the bed.

For the preheater, I pictured a narrow pocket beside the bed, 4 mm wide, with walls held at bed temperature. Powder poured in at room temperature takes about 70 s to come within 4 K at its centre. With a new layer every 10 s, the pocket would need to hold about seven layers of powder.

Then I checked that design against published measurements. Three findings refuted it.

- The dip is normal. On a 3D Systems Sinterstation 2500, the powder supply ran at 93 to 100 °C against a bed at 173 to 175 °C, about 75 K colder. The machine printed good parts anyway. An infrared camera watched the bed surface fall to 152 to 153 °C at every recoat (Yuan and Bourell 2012).
- Hotter powder fights back. On the same machine, raising the supply temperature eventually cracked the powder in its bin or rippled the bed. Hot nylon powder also degrades, one reason SLS printers blend fresh powder into used; Formlabs recommends 30% fresh for its Nylon 12.
- A brief dip cannot crystallize the part. Held at 168 °C, nylon 12 took about 10 minutes to start crystallizing in a DSC test (NETZSCH). A dip that recovers in seconds is far too short. The 153 °C onset comes from slow cooling at 10 K per minute, not from a one-second dip.

So the 2 °C figure governs the bed between layers, not the dip at each recoat. 
## 4. The real cost: waiting

The laser cannot fuse powder that is still cold, so every layer waits until it warms. How long until the new layer's surface is within 2 K of bed temperature, and what sets that time?

With no heater, a 30 K layer waits 9.7 s, and a 75 K layer waits 61 s.

Real printers heat from above. The Fuse watches the powder surface with an infrared sensor, so I modelled a heater driven by surface temperature, capped at a power limit, with assumed controller settings.

![Time until the new layer's surface is within 2 K of bed temperature, against how far below bed temperature it arrives, from 5 to 75 K, for heater limits of 1, 2, 4 and 8 kW per square metre; the time rises roughly in proportion to the shortfall, from 0.1 s at 5 K to between 1.4 and 4.3 s at 75 K, and doubling the heater limit helps less each time](freshlayer_wait.png)

*Figure 3. Time until a new layer is ready for the laser, against how cold it arrives. The dashed line marks the gap measured on the Sinterstation.*

- At 2 kW/m² (about 54 W across the bed), a 30 K layer is ready in 0.9 s, and a 75 K layer in 2.3 s.
- More power buys less and less. Doubling from 4 to 8 kW/m² saves only 0.3 s on a 75 K layer. Once the surface is warm, the controller has to wait for heat to soak into the cold powder beneath it.
- At 2 kW/m², every extra 10 K of cold adds about 0.3 s per layer. Over a full-height build of about 2,700 layers, that is roughly 15 minutes.
- The build only drifts colder if the heater falls short of the average need: about 0.37 kW/m², or 10 W, for 30 K layers every 10 s. Below that, the deficit piles up layer after layer.

![Two plots. Left: surface temperature of the newest layer over three layers, one every 10 s, for heater limits of 1, 2 and 4 kW per square metre; each new layer arrives 30 K cold and recovers to within 2 K in about one second. Right: average temperature of the top millimetre at the end of each layer, over 100 layers, for heater limits from 0.25 to 2 kW per square metre; at 0.25 it falls steadily to 7.5 K below bed temperature, and from 0.5 upwards it stays within 0.5 K](freshlayer_build.png)

*Figure 4. Left: the newest layer over three cycles. Right: the top millimetre of the build over 100 layers, for different heater limits.*

This fits a design Formlabs has patented. US 11,117,324 (filed 2018) mounts a heater on the same carriage as the powder spreader, just behind it. The stated reason: heating "closer together in time" with spreading gives "greater control over material temperature, thereby avoiding excess temperature exposure and subsequent undesirable changes to the material".

Read through this model, a heater that trails the roller hits both limits at once. It starts warming each layer the instant it lands, which cuts the wait. And it lets the powder supply run cooler, which dodges caking and degradation.

## 5. Limitations

- One layer is only about two powder grains thick (about 50 µm each), so anything under about 0.1 s is rough.
- The heater is idealized. All its power reaches the surface, and its controller settings are assumed. Different settings shift the ready times.
- The laser is left out. Over a part, it leaves the previous layer hotter than the bed, which softens the dip.
- Heat lost to the enclosure is left out, so real heaters need more power than shown.
- Conductivity and specific heat climb with temperature, shifting the time scales by tens of percent.
- The feed temperature, layer time and heater power of a real Fuse are assumed.

## 6. Testing it

### On a bench

The model's time scale grows with the square of the layer thickness, so a 1 mm layer stretches the 0.14 s event to about 11 s, which can be measured with thermocouples.

- Setup: an aluminium tray of nylon 12 powder about 40 mm deep on a hot plate near 100 °C, well clear of melting. Thermocouples with 0.25 mm beads, calibrated in ice and boiling water, at 1, 2 and 4 mm below the surface, logged at 10 Hz.
- Test: spread 1 mm of room-temperature powder with a blade riding on 1 mm rails, and record.
- Prediction: the thermocouple at the interface drops to about half the bed-to-powder gap within a second, then climbs back along the error-function curve. Fitting that curve gives the powder's diffusivity.
- What would break the model: a drop well short of half, meaning contact resistance between layers matters, or a recovery that strays from the curve.
- Next: an infrared lamp over the tray, driven by a surface thermocouple, to test the ready times and the diminishing returns in Figure 3.

### On a printer

- Log the infrared sensor through each recoat to read the ready time directly. Put a thermocouple in the powder supply to read how cold the powder arrives.
- Run a small grid of supply temperature against heater limit, and compare with Figure 3.
- Hold powder at a range of temperatures and times, then spread it, to find where caking starts. That caps how warm the supply can run.
- If the delay before scanning is fixed, test whether triggering the scan from the infrared reading saves build time.

### Open questions

1. How cold does powder arrive in a Fuse, and does caking set that limit?
2. Is the delay before the laser scans a new layer fixed, or triggered by the infrared reading?
3. What is a typical time between layers?

## Sources

- Formlabs, [Fuse 1+ 30W technical specifications](https://formlabs.com/3d-printers/fuse-1/tech-specs/): build area, layer thickness, laser.
- Formlabs, [What is selective laser sintering](https://formlabs.com/blog/what-is-selective-laser-sintering/): the 2 °C control statement.
- Formlabs, [Nylon 12 Powder technical data sheet](https://formlabs.com/materials/tds/nylon-12-powder/): recommended 30% fresh powder.
- 3D Printing Industry, [Formlabs Fuse 1 and Fuse Sift in-depth review](https://formlabs-media.formlabs.com/rs/060-UIG-504/images/WP-EN-3d-printing-industry-formlabs-fuse-1-and-sift-in-depth-review.pdf): the infrared sensor.
- Yuan, Bourell and Diller, [Thermal conductivity measurements of polyamide 12](https://utw10945.utweb.utexas.edu/Manuscripts/2011/2011-32-Yuan.pdf), Solid Freeform Fabrication Symposium 2011: powder properties, 50 µm powder.
- Yuan and Bourell, [Efforts to reduce part bed thermal gradients during laser sintering processing](https://utw10945.utweb.utexas.edu/Manuscripts/2012/2012-73-Yuan.pdf), Solid Freeform Fabrication Symposium 2012: supply and bed temperatures, the drop at each recoat, the supply temperature limit.
- EOS, [PA 2200 material data sheet](https://www.amf.uzh.ch/dam/jcr:59a8b14a-c212-4693-8443-d5e543aeabe2/Material-Data-PA2200-ENGLISH.pdf): heat of melting.
- NETZSCH, [How to determine the process window for SLS powders using DSC](https://analyzing-testing.netzsch.com/en/blog/2020/how-to-determine-the-process-window-for-sls-powders-using-dsc), 2020: melting and crystallization onsets, bed temperature.
- NETZSCH, [How to study the isothermal crystallization behavior of SLS powder using DSC](https://analyzing-testing.netzsch.com/en/blog/2020/how-to-study-the-isothermal-crystallization-behavior-of-sls-powder-using-dsc), 2020: crystallization starting after about 10 minutes at 168 °C.
- US Patent [11,117,324](https://patents.google.com/patent/US11117324B2/en), Techniques for integrated preheating and coating of powder material in additive fabrication, Formlabs.
