// Static markup of the stepper sim, swapped in for the <!-- stepper-sim -->
// marker at build time (src/build/rehype-sims.mjs). Every box has its final
// size before the script loads, so the page does not move when it does;
// main.js fills the canvases, the program, the error table and the findings,
// and enables the controls. The controls are only what it takes to draw a
// pattern and run it; the stage, its errors and the exposure are fixed.
const button = (attrs, label, pressed) =>
  `<button type="button" ${attrs}${pressed === undefined ? '' : ` aria-pressed="${pressed}"`} disabled>${label}</button>`;
const group = (label, body) => `<div class="sim-row" role="group" aria-label="${label}"><span class="sim-label">${label}</span>${body}</div>`;
const bar = (row, label, kind) =>
  `<tr data-row="${row}"><th scope="row">${label}${kind ? ` <span class="sim-tag">${kind}</span>` : ''}</th><td><span class="sim-bar"><i></i></span></td><td class="sim-num">–</td></tr>`;

export const markup = `<div class="sim sim-stepper" data-sim="stepper" data-pagefind-ignore>
${group('Draw', `${button('data-tool="pen"', 'Pen', true)}${button('data-tool="text"', 'Text', false)}<input class="sim-text" data-role="text" type="text" value="HACKER FAB" maxlength="24" aria-label="Text to place" disabled>`)}
${group('Ink', `${[1, 2, 5, 10].map((w) => button(`data-width="${w}"`, `${w} µm`, w === 5)).join('')}${button('data-act="undo"', 'Undo')}${button('data-act="clear"', 'Clear')}`)}
<div class="sim-box sim-wafer"><canvas data-role="chip" aria-label="The chip's design area, 4.16 by 2.34 mm, 16 fields: draw here; during and after a run, the print. Tap the developed print to look at it under the microscope."></canvas></div>
<div class="sim-row">${button('data-act="run"', 'Run the job')}<span class="sim-status" data-role="clock">&nbsp;</span><span class="sim-spacer"></span>${button('data-show="design"', 'Design', true)}${button('data-show="print"', 'Print', false)}</div>
<p class="sim-legend" data-role="legend">16 fields of 1.04 × 0.585 mm. Dashed lines are the seams between them.</p>
<div class="sim-views">
<figure class="sim-view">
<div class="sim-box sim-stage"><canvas data-role="stage" role="img" aria-label="The assembly in 3D, from the chapter's CAD: three motor horns, six rods on ball joints and the end effector carrying the chip, under the objective"></canvas><p class="sim-status sim-loading" data-role="stage-status">The stage's CAD loads here (1 MB).</p></div>
<figcaption>(a) The assembly, from the chapter's CAD, at true scale, moved by the job. Its errors are microns, too small to see, so rods are tinted by how far their length is off (blue long, red short) and dots mark the ball seats, bluer the further they sit from the CAD. Drag to turn it.</figcaption>
</figure>
<figure class="sim-view">
<div class="sim-box sim-detail"><canvas data-role="detail" role="img" aria-label="The detail: looking down the objective at the chip as it prints, and after the run, the print under a microscope"></canvas></div>
<figcaption data-role="detail-caption">(b) Looking down the objective at the chip, 1.56 mm across. Run the job to watch it print.</figcaption>
</figure>
</div>
<div class="sim-views">
<figure class="sim-view">
<div class="sim-box sim-gcode"><ol data-role="gcode" aria-label="The job's G-code"><li>Run the job to see the program.</li></ol></div>
<figcaption>(c) The program: G-code for the stage's firmware, played at the machine's pace. M3 T0 marks the exposure; how the projector is triggered is not decided yet.</figcaption>
</figure>
<figure class="sim-view">
<div class="sim-budget" data-role="budget">
<p class="sim-budget-title" data-role="budget-title">Run the job to see where the error comes from.</p>
<table>
<caption>Where the field lands, µm off at its worst corner</caption>
<tbody>
${bar('place-stage', 'Stage geometry', 'modelled')}
${bar('place-servo', 'Servo noise', 'measured')}
${bar('place-projector', 'Projector', 'assumed')}
${bar('place-total', 'As printed')}
${bar('place-cal', 'Calibrated first')}
</tbody>
</table>
<table>
<caption>How far its worst corner sits from focus, µm</caption>
<tbody>
${bar('focus-stage', 'Stage tilt', 'modelled')}
${bar('focus-focus', 'Focus budget', 'assumed')}
${bar('focus-total', 'As printed')}
</tbody>
</table>
</div>
<figcaption>(d) Each error source's share, for the field being exposed and, after the run, the worst one. Shares partly cancel, so they add to more than the whole. The tick on the focus bars is the depth of focus.</figcaption>
</figure>
</div>
<ul class="sim-findings plain" data-role="findings" aria-live="polite"><li>Loading the model…</li></ul>
<noscript><p>This simulation needs JavaScript.</p></noscript>
<p class="sim-note">Modelled, not measured. The stage is a typical build in the middling print-quality band, run as built, with every error source on. Optics: incoherent imaging through an NA 0.25 objective at 410 nm, and a resist that clears at half the clear-field dose. Each error is labelled measured (CMU's build), modelled or assumed.</p>
</div>`;
