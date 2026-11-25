// The stepper sim. The reader draws on the chip (text, lines of a chosen
// width); Run cuts the design into fields, writes the G-code the stage
// firmware would run, and plays it at the machine's pace: the assembly moves
// in 3D (a), the chip prints under the objective (b), the program steps (c),
// and each error source's share shows for the field being exposed (d). When
// every field is done the chip develops and the print is compared with the
// design.
//
// The stage is one typical build in the middling print-quality band, run as
// built, with every error source on; nothing about it is a control.
//
// Physics: kinematics.mjs (stage), errors.mjs (every error source), optics.mjs
// (the objective and resist, run in litho.worker.js), litho.mjs (dose on the
// chip). Mounted by the project page when the markup nears the screen; the 3D
// view (three.js and the 1 MB glb) loads after that.
import params from './params.json';
import rig from './rig.json';
import glbUrl from './stepper.glb?url';
import { fk, fkFull, ik, nominal } from './kinematics.mjs';
import { typicalSeed } from './model.mjs';
import { allFields, areaGeometry, exposureOrder, homeAngles, MACHINE, moveDistance, program } from './job.mjs';
import { budget, drawChip, exposeFields, printedAt, seams, SOURCES } from './errors.mjs';
import { OPTICS } from './optics.mjs';
import { Chip } from './litho.mjs';
import { bounds, classOf, FONT } from './raster.mjs';
import { PRESETS } from './presets.mjs';

const P = OPTICS.pitch; // um per mirror on the chip
const GEO = areaGeometry(P); // mm
const AW = GEO.w * 1000; // design area, um
const AH = GEO.h * 1000;
const FW = GEO.fw * 1000; // one field, um
const FH = GEO.fh * 1000;
const DOF = params.litho.dof_half_um;
const BAND = 1; // the middling print-quality band
const TEXT_SIZE = 300; // um, letter height of placed text
const VIEW_W = 1.5 * FW; // um across the look down the objective
const CORNER_W = 80; // um across its corner inset
const LENS_W = 120; // um across the microscope

const fmt = (x, d = 1) => (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d);
const hypot = (v) => Math.hypot(v[0], v[1]);

function palette() {
  const css = getComputedStyle(document.documentElement);
  const v = (name) => css.getPropertyValue(name).trim();
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return {
    ink: v('--text'),
    muted: v('--muted'),
    rule: v('--rule'),
    panel: v('--code-bg'),
    resist: v('--code-bg'),
    err: dark ? '#5a9ef0' : '#3987e5',
    missing: dark ? '#ff6b6b' : '#c8102e',
    uv: dark ? '#9a8cf5' : '#6250d6',
    parts: dark
      ? { printed: '#68655f', moving: '#b8b3a9', metal: '#a9adb3', motor: '#333333', optics: '#45454a', chip: '#5a73a0' }
      : { printed: '#dcd9d2', moving: '#7d7a73', metal: '#b5b9be', motor: '#3d3d3d', optics: '#232326', chip: '#3b4a63' },
  };
}

const rgb = (hex) => {
  const h = hex.replace('#', '');
  const f = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16));
};

export function mount(root) {
  const $ = (sel) => root.querySelector(sel);
  const cv = Object.fromEntries([...root.querySelectorAll('canvas[data-role]')].map((c) => [c.dataset.role, c]));
  const textInput = $('[data-role="text"]');
  const legend = $('[data-role="legend"]');
  const clock = $('[data-role="clock"]');
  const gcodeList = $('[data-role="gcode"]');
  const findings = $('[data-role="findings"]');
  const stageStatus = $('[data-role="stage-status"]');
  const detailCaption = $('[data-role="detail-caption"]');
  const budgetTitle = $('[data-role="budget-title"]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const g0 = nominal(params.stage);
  const fields = allFields(GEO);
  const measureCtx = document.createElement('canvas').getContext('2d');
  const measure = (it) => {
    measureCtx.font = `${it.weight || 700} ${it.size}px ${FONT}`;
    return measureCtx.measureText(it.text).width;
  };
  // the stage: one typical build, every error source on
  const chipErr = drawChip(params, BAND, typicalSeed(params, rig, BAND), { stage: true, servo: true, focus: true, projector: true });

  const st = {
    items: PRESETS.test(),
    history: [], // earlier designs, for undo
    tool: 'pen',
    width: 5,
    show: 'design',
    colors: palette(),
    run: null, // the current job, see run()
    lens: null, // microscope centre, um
  };

  // --- canvases ------------------------------------------------------------------

  function dims(c, maxW) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.min(maxW, Math.round(c.clientWidth * dpr));
    return { w, h: Math.round((w * c.clientHeight) / Math.max(1, c.clientWidth)), k: w / Math.max(1, c.clientWidth) };
  }
  function sized(c, maxW = 1600) {
    const { w, h, k } = dims(c, maxW);
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }
    return { ctx: c.getContext('2d'), w, h, k };
  }

  /** Draw design items; xf = [s, ox, oy]: design um (y up) to px (y down) as px = ox + s u, py = oy - s v. */
  function drawItems(ctx, items, [s, ox, oy], color) {
    ctx.save();
    ctx.setTransform(s, 0, 0, -s, ox, oy);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    const minW = 1 / s; // at least a pixel wide on screen
    for (const it of items) {
      if (it.type === 'text') {
        ctx.save();
        ctx.translate(it.x, it.y);
        ctx.scale(1, -1);
        ctx.font = `${it.weight || 700} ${it.size}px ${FONT}`;
        ctx.fillText(it.text, 0, 0);
        ctx.restore();
      } else {
        ctx.lineWidth = Math.max(it.w, minW);
        ctx.lineCap = it.cap || 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(...it.pts[0]);
        if (it.pts.length === 1) ctx.lineTo(it.pts[0][0] + 0.01, it.pts[0][1]);
        for (let i = 1; i < it.pts.length; i++) ctx.lineTo(...it.pts[i]);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  /** The design area's edge (solid) and the seams between its fields (dashed). */
  function drawSeams(ctx, [s, ox, oy], color, k, edge = false) {
    const X = (u) => ox + s * u;
    const Y = (v) => oy - s * v;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = k;
    if (edge) ctx.strokeRect(X(-AW / 2), Y(AH / 2), AW * s, AH * s);
    ctx.setLineDash([4 * k, 4 * k]);
    ctx.beginPath();
    for (let c = 1; c < GEO.cols; c++) {
      const x = X(-AW / 2 + c * FW);
      ctx.moveTo(x, Y(AH / 2));
      ctx.lineTo(x, Y(-AH / 2));
    }
    for (let r = 1; r < GEO.rows; r++) {
      const y = Y(AH / 2 - r * FH);
      ctx.moveTo(X(-AW / 2), y);
      ctx.lineTo(X(AW / 2), y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // the print (latent or developed) as an image of the whole area, at the chip view's resolution
  let printImage = null;
  let printMode = 'latent';
  const printCanvas = document.createElement('canvas');

  const printColors = () => {
    const c = st.colors;
    return { resist: rgb(c.resist), ink: rgb(c.ink), uv: rgb(c.uv), missing: rgb(c.missing), extra: rgb(c.err) };
  };

  /** The print image, rendered again when the chip view's size or the colours change. */
  function ensurePrint() {
    if (!st.run) return null;
    const { w, h } = dims(cv.chip, 1600);
    if (!printImage || printImage.width !== w || printImage.height !== h || printImage.stale) {
      printImage = new ImageData(w, h);
      st.run.chip.render(printImage.data, w, h, printMode, printColors());
      printCanvas.width = w;
      printCanvas.height = h;
      printCanvas.getContext('2d').putImageData(printImage, 0, 0);
    }
    return printImage;
  }

  /** Repaint only one field's cell (and the few microns its light spills into its neighbours). */
  function repaintField(f) {
    if (!printImage || printImage.stale || !st.run) return;
    const { width: w, height: h } = printImage;
    const s = w / AW;
    const m = 30; // um of spill and misplacement around the cell
    const x0 = Math.max(0, Math.floor((f.x * 1000 - FW / 2 - m + AW / 2) * s));
    const y0 = Math.max(0, Math.floor((AH / 2 - (f.y * 1000 + FH / 2 + m)) * s));
    const x1 = Math.min(w, Math.ceil((f.x * 1000 + FW / 2 + m + AW / 2) * s));
    const y1 = Math.min(h, Math.ceil((AH / 2 - (f.y * 1000 - FH / 2 - m)) * s));
    st.run.chip.render(printImage.data, w, h, printMode, printColors(), [x0, y0, x1, y1]);
    printCanvas.getContext('2d').putImageData(printImage, 0, 0, x0, y0, x1 - x0, y1 - y0);
  }

  function drawChipView() {
    const { ctx, w, h, k } = sized(cv.chip);
    const c = st.colors;
    const s = w / AW;
    const xf = [s, (AW / 2) * s, (AH / 2) * s];
    const run = st.run;
    ctx.fillStyle = c.resist;
    ctx.fillRect(0, 0, w, h);
    if (st.show === 'print' && run) {
      ctx.putImageData(ensurePrint(), 0, 0);
      if (!run.developed) {
        // what is being exposed, faintly, until the chip develops
        ctx.save();
        ctx.globalAlpha = 0.18;
        drawItems(ctx, run.items, xf, c.ink);
        ctx.restore();
      }
    } else {
      drawItems(ctx, st.items, xf, c.ink);
    }
    drawSeams(ctx, xf, c.rule, k);
    if (run && run.current && !run.developed) {
      const f = run.current.field;
      const x = (f.x * 1000 - FW / 2 + AW / 2) * s;
      const y = (AH / 2 - f.y * 1000 - FH / 2) * s;
      ctx.save();
      ctx.strokeStyle = c.uv;
      ctx.lineWidth = 2 * k;
      ctx.strokeRect(x, y, FW * s, FH * s);
      if (run.exposing) {
        ctx.fillStyle = c.uv;
        ctx.globalAlpha = 0.12;
        ctx.fillRect(x, y, FW * s, FH * s);
      }
      ctx.restore();
    }
    if (st.show === 'print' && run && run.developed && st.lens) {
      const lw = LENS_W * s;
      ctx.save();
      ctx.strokeStyle = c.ink;
      ctx.lineWidth = 1.5 * k;
      ctx.strokeRect((st.lens[0] + AW / 2) * s - lw / 2, (AH / 2 - st.lens[1]) * s - lw / 2, lw, lw);
      ctx.restore();
    }
  }

  // --- (b) the detail: down the objective while printing, the microscope after --------

  function label(ctx, text, x, y, k, color = st.colors.muted) {
    ctx.font = `${12 * k}px ${FONT}`;
    ctx.textBaseline = 'top';
    ctx.fillStyle = st.colors.panel;
    ctx.globalAlpha = 0.8;
    ctx.fillRect(x - 3 * k, y - 2 * k, ctx.measureText(text).width + 6 * k, 16 * k);
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }

  function scaleBar(ctx, um, s, x, y, k, text) {
    ctx.fillStyle = st.colors.ink;
    ctx.fillRect(x, y, um * s, 2 * k);
    label(ctx, text, x, y - 18 * k, k, st.colors.ink);
  }

  function drawDetail() {
    const run = st.run;
    if (run && run.developed && st.lens) {
      drawLens();
      return;
    }
    const { ctx, w, h, k } = sized(cv.detail, 1000);
    const c = st.colors;
    const s = w / VIEW_W; // px per um
    // the chip point under the objective sits in the middle
    const at = run ? run.at : [0, 0];
    const xf = [s, w / 2 - at[0] * s, h / 2 + at[1] * s];
    ctx.fillStyle = c.resist;
    ctx.fillRect(0, 0, w, h);
    if (run && ensurePrint()) {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(printCanvas, xf[1] - (AW / 2) * s, xf[2] - (AH / 2) * s, AW * s, AH * s);
    }
    ctx.save();
    ctx.globalAlpha = run ? 0.22 : 1;
    drawItems(ctx, run ? run.items : st.items, xf, c.ink);
    ctx.restore();
    drawSeams(ctx, xf, c.rule, k, true);
    // the field of light, fixed under the objective
    const fx = w / 2 - (FW / 2) * s;
    const fy = h / 2 - (FH / 2) * s;
    ctx.save();
    if (run && run.exposing) {
      ctx.fillStyle = c.uv;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(fx, fy, FW * s, FH * s);
      ctx.globalAlpha = 1;
    }
    ctx.strokeStyle = c.uv;
    ctx.lineWidth = 1.5 * k;
    ctx.strokeRect(fx, fy, FW * s, FH * s);
    ctx.restore();
    label(ctx, run ? run.phase : 'The field of light, off', 8 * k, 8 * k, k, run && run.exposing ? c.uv : c.muted);
    scaleBar(ctx, 200, s, 8 * k, h - 10 * k, k, '200 µm');
    if (run && run.current) drawCorner(ctx, w, h, k);
  }

  /** Inset: the current field's worst corner at true scale, where it should land and where it does. */
  function drawCorner(ctx, w, h, k) {
    const run = st.run;
    const c = st.colors;
    const e = run.current;
    const i = run.exposures.indexOf(e);
    const b = run.budgets[i];
    const [a, bb] = b.place.corner;
    const cx = e.field.x * 1000 + a; // the corner as designed, um
    const cy = e.field.y * 1000 + bb;
    const key = `${i}:${run.applied}`;
    if (run.cornerKey !== key) {
      run.cornerImg = renderCorner(run, cx, cy);
      run.cornerKey = key;
    }
    const size = Math.round(0.44 * w);
    const x0 = w - size - 8 * k;
    const y0 = h - size - 8 * k;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x0, y0, size, size);
    ctx.clip();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(run.cornerImg, x0, y0, size, size);
    const s = size / CORNER_W;
    const X = (u) => x0 + size / 2 + (u - cx) * s;
    const Y = (v) => y0 + size / 2 - (v - cy) * s;
    const inX = -Math.sign(a) * CORNER_W; // along the field's edges, into the field
    const inY = -Math.sign(bb) * CORNER_W;
    ctx.lineWidth = 1.5 * k;
    ctx.strokeStyle = c.ink;
    ctx.setLineDash([5 * k, 4 * k]);
    ctx.beginPath();
    ctx.moveTo(X(cx + inX), Y(cy));
    ctx.lineTo(X(cx), Y(cy));
    ctx.lineTo(X(cx), Y(cy + inY));
    ctx.stroke();
    const land = (u, v) => {
      const q = printedAt(e, u, v);
      return [X(q[0]), Y(q[1])];
    };
    ctx.setLineDash([]);
    ctx.strokeStyle = c.uv;
    ctx.lineWidth = 2 * k;
    ctx.beginPath();
    ctx.moveTo(...land(a + inX, bb));
    ctx.lineTo(...land(a, bb));
    ctx.lineTo(...land(a, bb + inY));
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = c.ink;
    ctx.lineWidth = k;
    ctx.strokeRect(x0, y0, size, size);
    ctx.restore();
    label(ctx, `Corner, ${CORNER_W} µm across`, x0 + 6 * k, y0 + 6 * k, k);
    label(ctx, `${fmt(b.place.total)} µm off`, x0 + 6 * k, y0 + 24 * k, k, c.uv);
    scaleBar(ctx, 10, s, x0 + 6 * k, y0 + size - 8 * k, k, '10 µm');
  }

  /** The latent dose around a chip point, one pixel per mirror's worth of chip. */
  function renderCorner(run, cx, cy) {
    const n = Math.round(CORNER_W / P);
    const img = new ImageData(n, n);
    const res = rgb(st.colors.resist);
    const uv = rgb(st.colors.uv);
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const smp = run.chip.sample(cx + (i + 0.5 - n / 2) * P, cy - (j + 0.5 - n / 2) * P);
        const t = smp ? Math.min(1, smp.dose) : 0;
        const o = 4 * (j * n + i);
        for (let ch = 0; ch < 3; ch++) img.data[o + ch] = res[ch] + (uv[ch] - res[ch]) * t;
        img.data[o + 3] = 255;
      }
    }
    const tmp = document.createElement('canvas');
    tmp.width = n;
    tmp.height = n;
    tmp.getContext('2d').putImageData(img, 0, 0);
    return tmp;
  }

  /** The developed print under the microscope, one square per mirror's worth of chip. */
  function drawLens() {
    const { ctx, w, h, k } = sized(cv.detail, 1000);
    const c = st.colors;
    const run = st.run;
    const nx = Math.round(LENS_W / P);
    const ny = Math.round((nx * h) / w);
    const img = new ImageData(nx, ny);
    const col = [rgb(c.resist), rgb(c.ink), rgb(c.missing), rgb(c.err)];
    const [cx, cy] = st.lens;
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const smp = run.chip.sample(cx + (i + 0.5 - nx / 2) * P, cy - (j + 0.5 - ny / 2) * P);
        const v = smp ? col[smp.state] : col[0];
        const o = 4 * (j * nx + i);
        img.data[o] = v[0];
        img.data[o + 1] = v[1];
        img.data[o + 2] = v[2];
        img.data[o + 3] = 255;
      }
    }
    const tmp = document.createElement('canvas');
    tmp.width = nx;
    tmp.height = ny;
    tmp.getContext('2d').putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tmp, 0, 0, w, (ny * w) / nx);
    // seams in view
    const s = w / (nx * P);
    const left = cx - (nx * P) / 2;
    const top = cy + (ny * P) / 2;
    ctx.save();
    ctx.strokeStyle = c.muted;
    ctx.lineWidth = k;
    ctx.setLineDash([5 * k, 4 * k]);
    ctx.beginPath();
    for (let cc = 1; cc < GEO.cols; cc++) {
      const x = -AW / 2 + cc * FW;
      if (x > left && x < left + nx * P) {
        ctx.moveTo((x - left) * s, 0);
        ctx.lineTo((x - left) * s, h);
      }
    }
    for (let r = 1; r < GEO.rows; r++) {
      const y = AH / 2 - r * FH;
      if (y < top && y > top - ny * P) {
        ctx.moveTo(0, (top - y) * s);
        ctx.lineTo(w, (top - y) * s);
      }
    }
    ctx.stroke();
    ctx.restore();
    label(ctx, `Microscope, ${LENS_W} µm across`, 8 * k, 8 * k, k);
    scaleBar(ctx, 10, s, 8 * k, h - 10 * k, k, '10 µm');
  }

  const CAPTION = {
    idle: "(b) Looking down the objective at the chip, 1.56 mm across; the violet frame is the field the projector lights. Run the job to watch it print.",
    run: "(b) Looking down the objective, 1.56 mm across: the chip slides under the fixed field of light as the stage steps, and the latent image builds field by field. Inset: the field's worst corner at true scale, dashed where it should land, violet where it does.",
    lens: '(b) The developed print under a microscope, 120 µm across: each square is one mirror, 0.54 µm on the chip. Grey printed as drawn, red missing, blue extra; dashed lines are seams. Tap the print above to look elsewhere.',
  };

  // --- (a) the assembly ------------------------------------------------------------

  let stage = null;
  let lastTheta = g0.theta0.slice(); // the stage starts at its neutral pose
  /** Show the stage as built at encoder angles theta. */
  function showJoints(theta, warm) {
    const { P: pos, Q } = fkFull(chipErr.g, theta, warm ? { P0: warm.P, Q0: warm.Q } : undefined);
    const real = { theta, P: pos, Q };
    lastTheta = theta;
    if (stage) stage.setPose(real, chipErr.g);
    return real;
  }
  /** Show the stage at a commanded position (mm): the firmware's inverse kinematics gives the encoder angles. */
  const showPose = (cmd, warm) => showJoints(ik(g0, cmd), warm);

  async function loadStage() {
    try {
      const { createStage } = await import('./scene3d.js');
      stage = await createStage(cv.stage, {
        url: glbUrl,
        rig,
        colors: st.colors,
        onProgress: (e) => {
          if (e.total) stageStatus.textContent = `Loading the stage's CAD: ${Math.round((100 * e.loaded) / e.total)} %`;
        },
      });
    } catch (err) {
      stageStatus.textContent = 'The 3D view could not start here (it needs WebGL).';
      console.warn('stepper sim, 3D view:', err);
      return;
    }
    stageStatus.hidden = true;
    const box = cv.stage.parentElement;
    stage.resize(box.clientWidth, box.clientHeight);
    const b = params.bands[BAND];
    stage.setErrors(chipErr.g, g0, { rod: b.rod_length_sd, ball: b.ball_centre_sd });
    showJoints(lastTheta);
  }

  // --- (d) where the error comes from --------------------------------------------------

  const rows = Object.fromEntries([...root.querySelectorAll('[data-role="budget"] tr[data-row]')].map((tr) => [tr.dataset.row, tr]));
  const FOCUS_SCALE = 1.25 * DOF;
  const focusTable = rows['focus-total'].closest('table');
  focusTable.dataset.tick = '';
  focusTable.style.setProperty('--tick', `${(100 * DOF) / FOCUS_SCALE}%`);

  function setRow(name, value, scale) {
    const tr = rows[name];
    const bar = tr.querySelector('.sim-bar i');
    bar.hidden = value == null;
    bar.style.width = value == null ? '0' : `${Math.min(100, (100 * value) / scale)}%`;
    tr.querySelector('.sim-num').textContent = value == null ? '–' : fmt(value, value >= 10 ? 0 : 1);
  }

  /** Fill the table for exposure i of the run (null: empty). */
  function showBudget(i, title) {
    budgetTitle.textContent = title;
    const r = st.run;
    const b = r && i != null ? r.budgets[i] : null;
    const cal = b ? r.calBudgets[i] : null;
    const ps = r ? r.placeScale : 1;
    setRow('place-stage', b && b.place.stage, ps);
    setRow('place-servo', b && b.place.servo, ps);
    setRow('place-projector', b && b.place.projector, ps);
    setRow('place-total', b && b.place.total, ps);
    setRow('place-cal', cal && cal.place.total, ps);
    setRow('focus-stage', b && b.focus.stage, FOCUS_SCALE);
    setRow('focus-focus', b && b.focus.focus, FOCUS_SCALE);
    setRow('focus-total', b && b.focus.total, FOCUS_SCALE);
  }
  const fieldTitle = (r, i, extra = '') => `Field ${i + 1} of ${r.exposures.length}${extra}`;

  // --- the job -------------------------------------------------------------------

  let pool = null;
  function workers() {
    if (pool) return pool;
    const n = Math.max(1, Math.min(2, (navigator.hardwareConcurrency || 2) - 1));
    const list = Array.from({ length: n }, () => new Worker(new URL('./litho.worker.js', import.meta.url), { type: 'module' }));
    const queue = [];
    const idle = [...list];
    const pending = new Map();
    let next = 0;
    const pump = () => {
      while (idle.length && queue.length) {
        const wk = idle.shift();
        const job = queue.shift();
        pending.set(job.msg.id, { ...job, wk });
        wk.postMessage(job.msg);
      }
    };
    for (const wk of list) {
      wk.onmessage = ({ data }) => {
        const job = pending.get(data.id);
        pending.delete(data.id);
        idle.push(wk);
        pump();
        if (job) (data.error ? job.reject(new Error(data.error)) : job.resolve(data));
      };
    }
    pool = {
      submit(msg) {
        msg.id = ++next;
        return new Promise((resolve, reject) => {
          queue.push({ msg, resolve, reject });
          pump();
        });
      },
      clear() {
        queue.length = 0;
      },
    };
    return pool;
  }

  /** Fields the design touches. */
  function litFields(items) {
    const lit = new Set();
    for (const it of items) {
      const [x0, y0, x1, y1] = bounds(it, it.type === 'text' ? measure : undefined);
      for (const f of fields) {
        const fx = f.x * 1000;
        const fy = f.y * 1000;
        if (x1 >= fx - FW / 2 && x0 <= fx + FW / 2 && y1 >= fy - FH / 2 && y0 <= fy + FH / 2) lit.add(f.index);
      }
    }
    return lit;
  }

  const classKey = (label) => [label.startsWith('text') ? 1 : 0, parseFloat(label.replace(/[^\d.]/g, ''))];
  /** The chip point under the objective (um) for the firmware's end-effector position p (mm). */
  const underObjective = (p) => [-p[0] * 1000, -p[1] * 1000];

  function stopRun() {
    if (!st.run) return;
    st.run.cancelled = true;
    cancelAnimationFrame(st.run.raf);
    if (pool) pool.clear();
    if (stage) stage.setExposing(false);
    st.run = null;
    printImage = null;
    st.lens = null;
    detailCaption.textContent = CAPTION.idle;
    showBudget(null, 'Run the job to see where the error comes from.');
  }

  function run() {
    stopRun();
    const items = st.items.slice();
    const lit = litFields(items);
    if (!lit.size) {
      findings.innerHTML = '<li>Draw something on the chip first.</li>';
      return;
    }
    const order = exposureOrder(fields, lit);
    const exposures = exposeFields(chipErr, g0, params, rig, GEO, order);
    const calibrated = exposeFields(chipErr, g0, params, rig, GEO, order, { calibrated: true });
    const budgets = exposures.map((e) => budget(e, FW / 2, FH / 2));
    const calBudgets = calibrated.map((e) => budget(e, FW / 2, FH / 2));
    // the program starts wherever the stage is; after G28 the firmware believes it is at the backed-off angles
    const back = MACHINE.home_back;
    const prog = program(exposures.map((e) => ({ field: e.field, cmd: e.cmd })), {
      geo: GEO,
      start: lastTheta,
      homed: fk(g0, [back, back, back]),
    });
    // each move carries where its ends land on the chip, so the look down the objective is true
    let err = [0, 0];
    for (const l of prog.lines) {
      if (l.kind !== 'move') continue;
      l.errFrom = err;
      err = l.field ? exposures.find((e) => e.field === l.field).error_um : [0, 0];
      l.errTo = err;
    }
    const classes = [...new Set(items.map(classOf))].sort((a, b) => {
      const [ta, sa] = classKey(a);
      const [tb, sb] = classKey(b);
      return ta - tb || sa - sb;
    });
    const r = {
      items,
      classes,
      exposures,
      budgets,
      calBudgets,
      placeScale: 1.05 * Math.max(...budgets.map((b) => Math.max(b.place.total, b.place.stage, b.place.projector))),
      prog,
      chip: new Chip(GEO, P),
      at: underObjective(fk(g0, lastTheta)),
      phase: 'Motors on',
      current: null,
      exposing: false,
      applied: 0,
      developed: false,
      cancelled: false,
      raf: 0,
    };
    st.run = r;
    st.show = 'print';
    printMode = 'latent';
    printImage = null;
    st.lens = null;
    syncButtons();
    gcodeList.innerHTML = prog.lines.map((l) => `<li>${l.text.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</li>`).join('');
    findings.innerHTML = `<li>Exposing ${exposures.length} fields. Each field's light is computed through the objective as the stage gets there.</li>`;
    detailCaption.textContent = CAPTION.run;
    showBudget(null, 'Homing first.');
    // the optics, in the background, in stage order
    const pl = workers();
    r.images = exposures.map((e) => {
      const fx = e.field.x * 1000;
      const fy = e.field.y * 1000;
      const near = items.filter((it) => {
        const [x0, y0, x1, y1] = bounds(it, it.type === 'text' ? measure : undefined);
        return x1 >= fx - FW / 2 - 20 && x0 <= fx + FW / 2 + 20 && y1 >= fy - FH / 2 - 20 && y0 <= fy + FH / 2 + 20;
      });
      return pl.submit({ items: near, classes, fx, fy, pre: e.pre, focus: e.focus, smear: e.smear });
    });
    play(r);
  }

  /** Put a finished exposure's light on the chip. */
  async function apply(r, i) {
    const res = await r.images[i];
    if (r.cancelled) return;
    const e = r.exposures[i];
    r.chip.setDesign(e.field.col, e.field.row, res.cls);
    r.chip.expose(e, { data: res.dose, w: res.w, h: res.h }, 1);
    r.applied++;
    repaintField(e.field);
    drawChipView();
    drawDetail();
  }

  /**
   * Run the program at the machine's own pace (no time-lapse). The reader
   * asked for the run and watching it is the point, so it plays even with
   * reduced motion on (Windows turns that on with its animation effects).
   */
  function play(r) {
    const lines = r.prog.lines;
    const n = r.exposures.length;
    let i = 0;
    let t0 = performance.now();
    let warm = null;
    let shownSecond = -1;
    const applying = [];
    const highlight = (k) => {
      const items = gcodeList.children;
      for (const li of items) li.removeAttribute('aria-current');
      const li = items[k];
      if (!li) return;
      li.setAttribute('aria-current', 'step');
      const box = gcodeList.parentElement;
      box.scrollTop = Math.max(0, li.offsetTop - box.clientHeight / 2);
    };
    const tickClock = (t) => {
      const sec = Math.floor(t);
      if (sec === shownSecond) return;
      shownSecond = sec;
      clock.textContent = `Machine time ${clockText(sec)} of ${clockText(r.prog.total)}`;
    };
    const enter = (k) => {
      const l = lines[k];
      highlight(k);
      if (l.field) {
        const e = r.exposures.find((x) => x.field === l.field);
        if (e !== r.current) {
          r.current = e;
          showBudget(r.exposures.indexOf(e), fieldTitle(r, r.exposures.indexOf(e)));
        }
      }
      const m = r.current ? r.exposures.indexOf(r.current) + 1 : 0;
      if (l.kind === 'home') r.phase = 'Homing (G28)';
      else if (l.kind === 'move') r.phase = l.field ? `Stepping to field ${m} of ${n}` : 'Back to the centre';
      else if (l.kind === 'settle') r.phase = `Field ${m}: settling`;
      else if (l.kind === 'focus') r.phase = `Field ${m}: autofocus`;
      else if (l.kind === 'on' || l.kind === 'expose') r.phase = `Field ${m}: exposing`;
      else if (l.kind === 'off') r.phase = `Field ${m}: exposed`;
      if (l.kind === 'on') {
        r.exposing = true;
        if (stage) stage.setExposing(true);
      }
      if (l.kind === 'off') {
        r.exposing = false;
        if (stage) stage.setExposing(false);
        applying.push(apply(r, r.exposures.indexOf(r.current)));
      }
      tickClock(l.t);
      drawChipView();
    };
    // where the stage is at time t (s) into line l, and the chip point under the objective
    const pose = (l, t) => {
      if (l.kind === 'home') {
        const th = homeAngles(l.start, t);
        warm = showJoints(th, warm);
        r.at = underObjective(fk(g0, th));
      } else if (l.kind === 'move') {
        const d = Math.hypot(l.to[0] - l.from[0], l.to[1] - l.from[1], l.to[2] - l.from[2]);
        const u = d > 0 ? moveDistance(d, t) / d : 1;
        const cmd = l.from.map((v, k) => v + (l.to[k] - v) * u);
        warm = showPose(cmd, warm);
        const at = underObjective(cmd);
        r.at = [0, 1].map((k) => at[k] + l.errFrom[k] + (l.errTo[k] - l.errFrom[k]) * u);
      }
    };
    enter(0);
    const tick = (now) => {
      if (r.cancelled) return;
      let l = lines[i];
      let t = (now - t0) / 1000;
      while (t >= l.dur) {
        pose(l, l.dur); // finish the line where it ends
        t -= l.dur;
        t0 = now - t * 1000;
        i++;
        if (i >= lines.length) {
          finish(r, applying);
          return;
        }
        l = lines[i];
        enter(i);
      }
      pose(l, t);
      tickClock(l.t + t);
      drawDetail();
      r.raf = requestAnimationFrame(tick);
    };
    r.raf = requestAnimationFrame(tick);
  }

  const clockText = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

  async function finish(r, applying) {
    r.exposing = false;
    r.phase = 'Developing';
    syncButtons();
    drawDetail();
    findings.innerHTML = `<li>Waiting for the optics on ${r.exposures.length - r.applied} more field${r.exposures.length - r.applied === 1 ? '' : 's'}…</li>`;
    await Promise.all(applying);
    if (r.cancelled) return;
    r.current = null;
    // develop: the latent image gives way to the print
    const before = printImage && st.show === 'print' ? printCanvas.getContext('2d').getImageData(0, 0, printCanvas.width, printCanvas.height) : null;
    printMode = 'developed';
    printImage = null;
    r.developed = true;
    if (st.show === 'print') {
      const after = ensurePrint();
      if (!reduced.matches && before) {
        const ctx = cv.chip.getContext('2d');
        const a = await createImageBitmap(before);
        const b = await createImageBitmap(after);
        const t0 = performance.now();
        await new Promise((done) => {
          const step = (now) => {
            if (r.cancelled) return done();
            const u = Math.min(1, (now - t0) / 1200);
            ctx.globalAlpha = 1;
            ctx.drawImage(a, 0, 0);
            ctx.globalAlpha = u;
            ctx.drawImage(b, 0, 0);
            ctx.globalAlpha = 1;
            if (u < 1) requestAnimationFrame(step);
            else done();
          };
          requestAnimationFrame(step);
        });
      }
    }
    if (r.cancelled) return;
    report(r);
    detailCaption.textContent = CAPTION.lens;
    drawChipView();
    drawDetail();
    syncButtons();
    clock.textContent = `Machine time ${clockText(r.prog.total)}; developed.`;
  }

  // --- findings --------------------------------------------------------------------

  /** A point on a seam where the design crosses it, for the microscope. */
  function seamPoint(r, s) {
    const along = s.dir === 'x' ? [0, 1] : [1, 0];
    const half = s.dir === 'x' ? FH / 2 : FW / 2;
    for (let t = 0; t <= half; t += 2) {
      for (const sg of [1, -1]) {
        const p = [s.at[0] + along[0] * t * sg, s.at[1] + along[1] * t * sg];
        for (const off of [-3, 3]) {
          const q = s.dir === 'x' ? [p[0] + off, p[1]] : [p[0], p[1] + off];
          const smp = r.chip.sample(q[0], q[1]);
          if (smp && smp.designed) return p;
        }
      }
    }
    return null;
  }

  function report(r) {
    const tag = (kind) => `<span class="sim-tag">${kind}</span>`;
    const out = [];
    const n = (e) => r.exposures.indexOf(e) + 1;
    // seams
    const sm = seams(r.exposures, GEO);
    const withDesign = sm.map((s) => ({ s, at: seamPoint(r, s) })).filter((x) => x.at);
    const worstSeam = withDesign.sort((a, b) => Math.abs(b.s.gap) + Math.abs(b.s.shear) - (Math.abs(a.s.gap) + Math.abs(a.s.shear)))[0];
    st.lens = worstSeam ? worstSeam.at : [r.exposures[0].field.x * 1000, r.exposures[0].field.y * 1000];
    if (worstSeam) {
      const { s } = worstSeam;
      const kind = s.gap > 0 ? `a ${fmt(s.gap)} µm strip that no field exposed` : `${fmt(-s.gap)} µm exposed twice`;
      out.push(`<li><button type="button" class="sim-find" data-at="${worstSeam.at.join(',')}">Seams</button> The worst seam the design crosses, between fields ${n(s.a)} and ${n(s.b)}: ${kind}, and the two sides shifted ${fmt(Math.abs(s.shear))} µm along it. It is under the microscope in (b).</li>`);
    } else if (sm.length) {
      out.push('<li>Seams: the design does not cross a seam between two exposed fields.</li>');
    }
    // placement: the worst field, what drives it, and what calibration would leave
    const wi = r.budgets.reduce((m, b, k) => (b.place.total > r.budgets[m].place.total ? k : m), 0);
    const wb = r.budgets[wi];
    const lead = [['the stage geometry', wb.place.stage], ['the projector', wb.place.projector], ['servo noise', wb.place.servo]].sort((a, b) => b[1] - a[1])[0][0];
    const g = chipErr.g;
    let rod = null;
    let ball = null;
    for (const rd of rig.rods) {
      const dL = (g.L[rd.joint][rd.k] - g0.L[rd.joint][rd.k]) * 1e3;
      if (!rod || Math.abs(dL) > Math.abs(rod.dL)) rod = { rd, dL };
      for (const [side, d] of [['crank', g.dA[rd.joint][rd.k]], ['platform', g.dE[rd.joint][rd.k]]]) {
        const m = Math.hypot(...d) * 1e3;
        if (!ball || m > ball.m) ball = { rd, side, m };
      }
    }
    out.push(`<li><b>Placement.</b> Field ${wi + 1}'s worst corner lands ${fmt(wb.place.total)} µm from where it should, most of it from ${lead}. In (a), rod ${rod.rd.group.replace('rod ', '')} is ${fmt(Math.abs(rod.dL))} µm ${rod.dL > 0 ? 'longer' : 'shorter'} than designed and the worst ball seat, at the ${ball.side} end of rod ${ball.rd.group.replace('rod ', '')}, sits ${fmt(ball.m)} µm from the CAD; the encoders cannot see either. Measuring a grid of marks on the camera first and correcting the moves and the projector would leave ${fmt(r.calBudgets[wi].place.total)} µm. ${tag('modelled')}</li>`);
    // focus
    const fz = r.budgets.reduce((m, b) => Math.max(m, b.focus.total), 0);
    const zs = fz <= DOF ? `inside the ±${fmt(DOF)} µm depth of focus` : `outside the ±${fmt(DOF)} µm depth of focus`;
    out.push(`<li><b>Focus.</b> The worst field corner sits ${fmt(fz, 2)} µm from focus, ${zs}, mostly from the focus budget rather than the stage's tilt. At these sizes it barely moves the edges unless the dose is off. ${tag('assumed')}</li>`);
    // printed by feature size
    const stats = r.chip.stats(r.classes.length, r.exposures, printedAt);
    const sizes = r.classes.map((lab, k) => {
      const d = stats.designed[k + 1];
      if (!d) return null;
      const pct = (100 * stats.printed[k + 1]) / d;
      return `${lab.replace('line ', '')}${lab.startsWith('line') ? ' lines' : ''} ${pct >= 99.95 ? '100' : fmt(pct, pct > 99 ? 1 : 0)} %`;
    }).filter(Boolean);
    out.push(`<li><b>Print.</b> How much of each feature printed, wherever its field put it: ${sizes.join(', ')}. ${tag('optics: modelled')}</li>`);
    findings.innerHTML = out.join('');
    showBudget(wi, fieldTitle(r, wi, ', the worst'));
  }

  // --- input -------------------------------------------------------------------------

  function syncButtons() {
    const set = (sel, fn) => root.querySelectorAll(sel).forEach((b) => b.setAttribute('aria-pressed', String(fn(b))));
    set('[data-tool]', (b) => b.dataset.tool === st.tool);
    set('[data-width]', (b) => Number(b.dataset.width) === st.width);
    set('[data-show]', (b) => b.dataset.show === st.show);
    const running = st.run && !st.run.developed;
    $('[data-act="run"]').textContent = running ? 'Stop' : st.run ? 'Run again' : 'Run the job';
    $('[data-act="undo"]').disabled = !st.history.length;
    $('[data-show="print"]').disabled = !st.run;
    const key = (color) => `<span class="sim-key" style="background:${color}"></span>`;
    const c = st.colors;
    legend.innerHTML =
      st.show === 'print' && st.run
        ? st.run.developed
          ? `Developed. ${key(c.ink)} printed as drawn ${key(c.missing)} missing ${key(c.err)} extra. Tap the print to look at it under the microscope.`
          : `Exposing. ${key(c.uv)} light dose on the resist; the field being exposed is outlined.`
        : `16 fields of 1.04 × 0.585 mm; dashed lines are the seams between them. ${st.tool === 'text' ? 'Tap to place the text.' : 'Draw with the pen.'}`;
  }

  /** The design changed: the old print no longer matches it. */
  function changed() {
    if (st.run) {
      stopRun();
      findings.innerHTML = '<li>The design changed. Run the job to print it.</li>';
    }
    st.show = 'design';
    syncButtons();
    drawChipView();
    drawDetail();
  }

  /** A drawing control was picked: show the design again unless a run is still printing. */
  function backToDesign() {
    if (st.show !== 'design' && !(st.run && !st.run.developed)) st.show = 'design';
    syncButtons();
    drawChipView();
  }

  root.addEventListener('click', (ev) => {
    const b = ev.target.closest('button');
    if (!b || b.disabled) return;
    const d = b.dataset;
    if (d.tool) {
      st.tool = d.tool;
      backToDesign();
    } else if (d.width) {
      st.width = Number(d.width);
      backToDesign();
    } else if (d.act === 'undo') {
      if (st.history.length) st.items = st.history.pop();
      changed();
    } else if (d.act === 'clear') {
      if (st.items.length) {
        st.history.push(st.items);
        st.items = [];
      }
      changed();
    } else if (d.act === 'run') {
      if (st.run && !st.run.developed) {
        stopRun();
        st.show = 'design';
        findings.innerHTML = '<li>Stopped.</li>';
        clock.innerHTML = '&nbsp;';
        syncButtons();
        drawChipView();
        drawDetail();
      } else run();
    } else if (d.show) {
      st.show = d.show;
      syncButtons();
      drawChipView();
    } else if (b.classList.contains('sim-find') && d.at) {
      lookAt(d.at.split(',').map(Number));
    }
  });

  /** Put the microscope on a point of the developed print (um) and show that field's errors. */
  function lookAt(p) {
    const r = st.run;
    st.lens = p;
    const i = r.exposures.findIndex((e) => Math.abs(p[0] - e.field.x * 1000) <= FW / 2 && Math.abs(p[1] - e.field.y * 1000) <= FH / 2);
    if (i >= 0) showBudget(i, fieldTitle(r, i));
    drawChipView();
    drawDetail();
  }

  // drawing on the chip
  const toDesign = (ev) => {
    const r = cv.chip.getBoundingClientRect();
    return [((ev.clientX - r.left) / r.width) * AW - AW / 2, AH / 2 - ((ev.clientY - r.top) / r.height) * AH];
  };
  let pen = null;
  cv.chip.addEventListener('pointerdown', (ev) => {
    const p = toDesign(ev);
    if (st.show === 'print') {
      if (st.run && st.run.developed) lookAt(p);
      return;
    }
    if (st.tool === 'text') {
      const text = textInput.value.trim();
      if (!text) return;
      st.history.push(st.items.slice());
      st.items.push({ type: 'text', text, x: p[0], y: p[1], size: TEXT_SIZE, weight: 700 });
      changed();
      return;
    }
    cv.chip.setPointerCapture(ev.pointerId);
    st.history.push(st.items.slice());
    pen = { id: ev.pointerId, item: { type: 'stroke', w: st.width, pts: [p] } };
    st.items.push(pen.item);
    drawChipView();
  });
  cv.chip.addEventListener('pointermove', (ev) => {
    if (!pen || ev.pointerId !== pen.id) return;
    const p = toDesign(ev);
    const pts = pen.item.pts;
    if (Math.hypot(p[0] - pts[pts.length - 1][0], p[1] - pts[pts.length - 1][1]) > 4) pts.push(p);
    drawChipView();
  });
  const penUp = () => {
    if (!pen) return;
    pen = null;
    changed();
  };
  cv.chip.addEventListener('pointerup', penUp);
  cv.chip.addEventListener('pointercancel', penUp);

  // --- size and theme ---------------------------------------------------------------

  const ro = new ResizeObserver(() => {
    if (printImage) printImage.stale = true;
    drawChipView();
    drawDetail();
    if (stage) {
      const box = cv.stage.parentElement;
      stage.resize(box.clientWidth, box.clientHeight);
    }
  });
  [cv.chip, cv.stage, cv.detail].forEach((c) => ro.observe(c.parentElement));
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    st.colors = palette();
    if (printImage) printImage.stale = true;
    if (st.run) st.run.cornerKey = null;
    if (stage) stage.setTheme(st.colors);
    syncButtons();
    drawChipView();
    drawDetail();
  });

  // --- start ---------------------------------------------------------------------------

  root.querySelectorAll('button[disabled], input[disabled]').forEach((b) => (b.disabled = false));
  findings.innerHTML = `<li>Draw on the chip, or keep the test chip, and run the job. The stage is a typical build in the middling print-quality band, run as built: ${Object.values(SOURCES).map((s) => `${s.label.toLowerCase()} (${s.kind})`).join(', ')}.</li>`;
  detailCaption.textContent = CAPTION.idle;
  showBudget(null, 'Run the job to see where the error comes from.');
  syncButtons();
  drawChipView();
  drawDetail();
  root.classList.add('sim-ready');
  loadStage();
}
