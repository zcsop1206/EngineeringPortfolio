// Static markup of the stepper sim, swapped in for the <!-- stepper-sim -->
// marker at build time (src/build/rehype-sims.mjs). Every box has its final
// size before the script loads, so the page does not move when it does;
// main.js only fills the canvases and the readout and enables the buttons.
const button = (attrs, label, pressed) =>
  `<button type="button" ${attrs}${pressed === undefined ? '' : ` aria-pressed="${pressed}"`} disabled>${label}</button>`;

export const markup = `<div class="sim sim-stepper" data-sim="stepper" data-pagefind-ignore>
<div class="sim-top">
<div class="sim-box sim-pad"><canvas data-role="pad" role="img" aria-label="The die: draw on it to change the pattern"></canvas></div>
<div class="sim-controls">
<div class="sim-row" role="group" aria-label="Print quality"><span class="sim-label">Print quality</span>${button('data-band="0"', 'Good', false)}${button('data-band="1"', 'Middling', true)}${button('data-band="2"', 'Poor', false)}</div>
<div class="sim-row">${button('data-act="roll"', 'Build another stage')}</div>
<div class="sim-row" role="group" aria-label="Die pattern"><span class="sim-label">Die</span>${button('data-preset="text"', 'Text', true)}${button('data-preset="lines"', 'Lines', false)}${button('data-preset="marks"', 'Marks', false)}${button('data-preset="clear"', 'Clear', false)}</div>
<div class="sim-row" role="group" aria-label="Placement"><span class="sim-label">Placement</span>${button('data-mode="raw"', 'As stepped', true)}${button('data-mode="cal"', 'Calibrated', false)}</div>
<div class="sim-row">${button('data-act="expose"', 'Expose all 25 fields')}</div>
</div>
</div>
<p class="sim-note">The die is the projector's mirror array, one 1.04 × 0.58 mm field on the chip. Draw on it or pick one.</p>
<div class="sim-views">
<figure class="sim-view sim-view-3d">
<div class="sim-box sim-stage"><canvas data-role="stage" role="img" aria-label="The stage in 3D, from the chapter's CAD: three motor horns, six rods on ball joints and the end effector carrying the chip, under the objective"></canvas><p class="sim-status" data-role="stage-status">The stage's CAD loads here (1 MB).</p></div>
<figcaption>(a) The stage, from the chapter's CAD, moving as the model says. Drag to turn it.</figcaption>
</figure>
<figure class="sim-view sim-view-chip">
<div class="sim-box sim-chip"><canvas data-role="chip" tabindex="0" aria-label="The exposed fields on the chip from above; arrow keys or a tap select a field"></canvas></div>
<p class="sim-legend" data-role="legend">&nbsp;</p>
<div class="sim-box sim-field"><canvas data-role="field" role="img" aria-label="The selected field at true size: where it was meant to land, dashed, and where it landed"></canvas></div>
<figcaption>(b) Top: the middle 14 mm of the 31.75 mm chip, fields drawn twice their size. Dashed: where each field was meant to land. Bottom: the selected field at true size. Blue: where the chip surface is more than 0.5 µm from focus, the stage's share of the ±3.3 µm depth of focus; the print blurs there (blur exaggerated).</figcaption>
</figure>
</div>
<p class="sim-readout" data-role="readout" aria-live="polite">Loading the stage model…</p>
<noscript><p>This simulation needs JavaScript.</p></noscript>
<p class="sim-note">Modelled, not measured. The print-quality bands are assumptions until the test prints measure them. The chip is levelled and aligned once on the centre field and focused at every field.</p>
</div>`;
