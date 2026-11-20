// The stepper sim: draw a die, and a modelled stage steps the chip between 25
// sites while the projector exposes the die at each. Pane (a) moves the CAD in
// 3D; pane (b) shows where each field landed on the chip and where its tilt
// takes the surface out of the stage's share of the depth of focus.
//
// Mounted by the project page's loader when the markup from markup.mjs comes
// near the screen. The 3D view (three.js and the 1 MB glb) loads after that.
import params from './params.json';
import rig from './rig.json';
import glbUrl from './stepper.glb?url';
import { nominal } from './kinematics.mjs';
import { commandFor, exposeAll, poseAt, randomStage, sites, typicalSeed } from './model.mjs';
import { MASK_H, MASK_W, PRESETS } from './patterns.mjs';

const FIELD = params.litho.field_mm; // mm, [x, y]
const SHARE = params.litho.stage_share_um; // um: the stage's part of the depth of focus
const DOF = params.litho.dof_half_um;
const N_SITES = params.dies.n ** 2;
const PITCH = params.dies.pitch_mm;
const VIEW_HALF = 7; // mm, half the chip view: the +/-5 mm sites, their fields drawn 2x and their errors
const ZOOM_W = 1.4; // mm across the field view
const BLUR_PER_UM = 12; // mask px of blur per um past the share (exaggerated, for the eye)
const LEVELS = [0, 1.5, 3, 6, 12, 24]; // blur levels, mask px (Gaussian sigma)
const MOVE_MS = 380;
const EXPOSE_MS = 260;
const NICE = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
const BANDS = ['good', 'middling', 'poor'];

const fmt = (x, d) => x.toFixed(d);
const um = (mm) => Math.hypot(mm[0], mm[1]) * 1e3;

function palette() {
  const css = getComputedStyle(document.documentElement);
  const v = (name) => css.getPropertyValue(name).trim();
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return {
    panel: v('--code-bg'),
    ink: v('--text'),
    muted: v('--muted'),
    rule: v('--rule'),
    resist: v('--code-bg'),
    err: dark ? '#5a9ef0' : '#3987e5',
    uv: dark ? '#9a8cf5' : '#6250d6',
    parts: dark
      ? { printed: '#68655f', moving: '#b8b3a9', metal: '#a9adb3', motor: '#333333', optics: '#45454a', chip: '#5a73a0' }
      : { printed: '#dcd9d2', moving: '#7d7a73', metal: '#b5b9be', motor: '#3d3d3d', optics: '#232326', chip: '#3b4a63' },
  };
}

const rgb = (hex) => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
};

// --- blur ------------------------------------------------------------------

function boxes(sigma, n = 3) {
  const ideal = Math.sqrt((12 * sigma * sigma) / n + 1);
  let wl = Math.floor(ideal);
  if (wl % 2 === 0) wl--;
  const m = Math.round((12 * sigma * sigma - n * wl * wl - 4 * n * wl - 3 * n) / (-4 * wl - 4));
  return [...Array(n).keys()].map((i) => ((i < m ? wl : wl + 2) - 1) / 2);
}

function boxPass(src, dst, w, h, r, horizontal) {
  const len = horizontal ? w : h;
  const lines = horizontal ? h : w;
  const step = horizontal ? 1 : w;
  const norm = 1 / (2 * r + 1);
  for (let l = 0; l < lines; l++) {
    const base = horizontal ? l * w : l;
    let acc = 0;
    for (let k = 0; k <= Math.min(r, len - 1); k++) acc += src[base + k * step];
    for (let k = 0; k < len; k++) {
      dst[base + k * step] = acc * norm;
      const add = k + r + 1;
      const drop = k - r;
      if (add < len) acc += src[base + add * step];
      if (drop >= 0) acc -= src[base + drop * step];
    }
  }
}

/** Gaussian blur of an alpha map by three box passes each way; outside the field counts as dark. */
function blur(alpha, w, h, sigma) {
  if (sigma < 0.3) return alpha.slice();
  let a = alpha.slice();
  let b = new Float32Array(a.length);
  for (const r of boxes(sigma)) {
    boxPass(a, b, w, h, r, true);
    boxPass(b, a, w, h, r, false);
  }
  return a;
}

// --- the sim -----------------------------------------------------------------

export function mount(root) {
  const $ = (sel) => root.querySelector(sel);
  const canvases = Object.fromEntries([...root.querySelectorAll('canvas[data-role]')].map((c) => [c.dataset.role, c]));
  const readout = $('[data-role="readout"]');
  const legend = $('[data-role="legend"]');
  const status = $('[data-role="stage-status"]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const g0 = nominal(params.stage);
  const S = sites(params);
  const typical = {};

  const st = {
    band: 1,
    seed: 0,
    isTypical: true,
    mode: 'raw',
    preset: 'text',
    g: null,
    result: null,
    shown: new Set(S.map((_, i) => i)),
    selected: 0,
    current: -1,
    cmd: [0, 0, 0],
    warm: null,
    run: null,
    colors: palette(),
  };

  // die mask: opaque where the mirrors expose
  const mask = document.createElement('canvas');
  mask.width = MASK_W;
  mask.height = MASK_H;
  const mctx = mask.getContext('2d', { willReadFrequently: true });
  let levels = [];
  let fieldImages = [];
  let sharp = null;

  function setPreset(name) {
    st.preset = name;
    mctx.clearRect(0, 0, MASK_W, MASK_H);
    mctx.fillStyle = '#000';
    PRESETS[name](mctx);
    rebuildPattern();
  }

  function rebuildPattern() {
    const data = mctx.getImageData(0, 0, MASK_W, MASK_H).data;
    const alpha = new Float32Array(MASK_W * MASK_H);
    for (let i = 0; i < alpha.length; i++) alpha[i] = data[4 * i + 3] / 255;
    levels = LEVELS.map((s) => blur(alpha, MASK_W, MASK_H, s));
    rebuildFields();
  }

  /** The exposed field as an image in die space: ink blurred where the surface is past the share, a blue wash there. */
  function fieldImage(f) {
    const [Fw, Fh] = FIELD;
    const [ir, ig, ib] = rgb(st.colors.ink);
    const [er, eg, eb] = rgb(st.colors.err);
    const img = new ImageData(MASK_W, MASK_H);
    const px = img.data;
    const last = LEVELS.length - 1;
    for (let j = 0; j < MASK_H; j++) {
      const b = Fh / 2 - ((j + 0.5) * Fh) / MASK_H;
      for (let i = 0; i < MASK_W; i++) {
        const a = ((i + 0.5) * Fw) / MASK_W - Fw / 2;
        const h = (f.slope[0] * a + f.slope[1] * b) * 1e3;
        const over = Math.abs(h) - SHARE;
        const k = j * MASK_W + i;
        let ink = levels[0][k];
        let wash = 0;
        if (over > 0) {
          const sigma = Math.min(LEVELS[last], BLUR_PER_UM * over);
          let l = 0;
          while (l < last - 1 && LEVELS[l + 1] < sigma) l++;
          const t = Math.min(1, (sigma - LEVELS[l]) / (LEVELS[l + 1] - LEVELS[l]));
          ink = levels[l][k] * (1 - t) + levels[l + 1][k] * t;
          wash = Math.min(1, over / 0.5) * 0.3;
        }
        const alpha = ink + wash * (1 - ink);
        const q = 4 * k;
        if (alpha <= 0) continue;
        px[q] = (ir * ink + er * wash * (1 - ink)) / alpha;
        px[q + 1] = (ig * ink + eg * wash * (1 - ink)) / alpha;
        px[q + 2] = (ib * ink + eb * wash * (1 - ink)) / alpha;
        px[q + 3] = alpha * 255;
      }
    }
    const c = document.createElement('canvas');
    c.width = MASK_W;
    c.height = MASK_H;
    c.getContext('2d').putImageData(img, 0, 0);
    return c;
  }

  function rebuildFields() {
    if (!st.result) return;
    sharp = null;
    fieldImages = st.result.fields.map((f) => {
      if (f.wedge > SHARE) return fieldImage(f);
      return (sharp ??= fieldImage({ slope: [0, 0] }));
    });
    drawAll();
  }

  function setStage(band, seed, isTypical) {
    st.band = band;
    st.seed = seed;
    st.isTypical = isTypical;
    st.g = randomStage(params, band, seed);
    st.result = exposeAll(st.g, g0, params, rig);
    // show the most tilted field first
    st.selected = st.result.fields.reduce((m, f, i, all) => (f.wedge > all[m].wedge ? i : m), 0);
    stopRun();
    st.shown = new Set(S.map((_, i) => i));
    rebuildFields();
    moveStageTo(st.selected, true);
  }

  // --- canvases ----------------------------------------------------------

  function sized(c) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(c.clientWidth * dpr);
    const h = Math.round(c.clientHeight * dpr);
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }
    return { ctx: c.getContext('2d'), w, h, dpr };
  }

  function drawPad() {
    const { ctx, w, h } = sized(canvases.pad);
    ctx.fillStyle = st.colors.resist;
    ctx.fillRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(tint(mask, st.colors.ink), 0, 0, w, h);
  }

  let tinted = null;
  function tint(src, color) {
    tinted ??= document.createElement('canvas');
    tinted.width = src.width;
    tinted.height = src.height;
    const t = tinted.getContext('2d');
    t.clearRect(0, 0, src.width, src.height);
    t.drawImage(src, 0, 0);
    t.globalCompositeOperation = 'source-in';
    t.fillStyle = color;
    t.fillRect(0, 0, src.width, src.height);
    t.globalCompositeOperation = 'source-over';
    return tinted;
  }

  function errOf(f) {
    return f.err[st.mode];
  }

  /** Magnification of placement errors on the chip view: a round number that keeps the largest under a quarter of the pitch. */
  function magnification() {
    const worst = Math.max(...st.result.fields.map((f) => Math.hypot(...errOf(f))));
    let m = NICE[0];
    for (const n of NICE) if (n * worst <= 0.25 * PITCH) m = n;
    return m;
  }

  function dashedRect(ctx, x, y, w, h, color, lw) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.setLineDash([3 * lw, 2 * lw]);
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
  }

  function drawChip() {
    const { ctx, w, dpr } = sized(canvases.chip);
    const c = st.colors;
    const s = w / (2 * VIEW_HALF);
    ctx.fillStyle = c.resist;
    ctx.fillRect(0, 0, w, w);
    const M = magnification();
    const fw = FIELD[0] * 2 * s;
    const fh = FIELD[1] * 2 * s;
    st.result.fields.forEach((f, i) => {
      const cx = (f.x + VIEW_HALF) * s;
      const cy = (VIEW_HALF - f.y) * s;
      dashedRect(ctx, cx - fw / 2, cy - fh / 2, fw, fh, c.muted, dpr);
      if (!st.shown.has(i)) return;
      const e = errOf(f);
      const dx = e[0] * M * s;
      const dy = -e[1] * M * s;
      ctx.save();
      ctx.translate(cx + dx, cy + dy);
      ctx.rotate(-f.rot * M);
      ctx.drawImage(fieldImages[i], -fw / 2, -fh / 2, fw, fh);
      ctx.restore();
      if (Math.hypot(dx, dy) > 2 * dpr) {
        ctx.strokeStyle = c.err;
        ctx.lineWidth = 1.5 * dpr;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + dx, cy + dy);
        ctx.stroke();
      }
    });
    const mark = (i, color) => {
      const f = st.result.fields[i];
      const e = errOf(f);
      ctx.save();
      ctx.translate((f.x + VIEW_HALF) * s + e[0] * M * s, (VIEW_HALF - f.y) * s - e[1] * M * s);
      ctx.rotate(-f.rot * M);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2 * dpr;
      ctx.strokeRect(-fw / 2 - 3 * dpr, -fh / 2 - 3 * dpr, fw + 6 * dpr, fh + 6 * dpr);
      ctx.restore();
    };
    if (st.current >= 0) mark(st.current, c.uv);
    else mark(st.selected, c.ink);
    // legend: magnification and a scale bar, in CSS px
    const barUm = NICE.find((n) => n * 1e-3 * M * (s / dpr) >= 16) ?? 5000;
    const barPx = barUm * 1e-3 * M * (s / dpr);
    legend.innerHTML =
      `Placement errors ×${M}: <span class="sim-bar" style="width:${barPx.toFixed(1)}px"></span> ${barUm} µm, ` +
      (st.mode === 'cal' ? 'calibrated' : 'as stepped');
  }

  /** Clip the line g . p = c to the box |x| <= ax, |y| <= ay; returns two points or null. */
  function isoLine(g, cval, ax, ay) {
    const gg = g[0] * g[0] + g[1] * g[1];
    if (gg === 0) return null;
    const p0 = [(g[0] * cval) / gg, (g[1] * cval) / gg];
    const d = [-g[1], g[0]];
    let t0 = -Infinity;
    let t1 = Infinity;
    for (const [p, dd, lim] of [[p0[0], d[0], ax], [p0[1], d[1], ay]]) {
      if (Math.abs(dd) < 1e-15) {
        if (Math.abs(p) > lim) return null;
        continue;
      }
      const a = (-lim - p) / dd;
      const b = (lim - p) / dd;
      t0 = Math.max(t0, Math.min(a, b));
      t1 = Math.min(t1, Math.max(a, b));
    }
    if (t0 >= t1) return null;
    return [[p0[0] + t0 * d[0], p0[1] + t0 * d[1]], [p0[0] + t1 * d[0], p0[1] + t1 * d[1]]];
  }

  function drawField() {
    const { ctx, w, h, dpr } = sized(canvases.field);
    const c = st.colors;
    const s = w / ZOOM_W;
    const f = st.result.fields[st.selected];
    ctx.fillStyle = c.resist;
    ctx.fillRect(0, 0, w, h);
    const fw = FIELD[0] * s;
    const fh = FIELD[1] * s;
    dashedRect(ctx, w / 2 - fw / 2, h / 2 - fh / 2, fw, fh, c.muted, dpr);
    if (!st.shown.has(st.selected)) return;
    const e = errOf(f);
    ctx.save();
    ctx.translate(w / 2 + e[0] * s, h / 2 - e[1] * s);
    ctx.rotate(-f.rot);
    ctx.drawImage(fieldImages[st.selected], -fw / 2, -fh / 2, fw, fh);
    // the surface's height contours: 0 at the centre (autofocus), +/- the share
    ctx.lineWidth = 1.5 * dpr;
    ctx.font = `${12 * dpr}px ${getComputedStyle(root).fontFamily}`;
    for (const [level, color, label] of [[0, c.muted, ''], [SHARE, c.err, `+${SHARE} µm`], [-SHARE, c.err, `−${SHARE} µm`]]) {
      const seg = isoLine(f.slope, level * 1e-3, FIELD[0] / 2, FIELD[1] / 2);
      if (!seg) continue;
      ctx.strokeStyle = color;
      ctx.setLineDash(level ? [5 * dpr, 4 * dpr] : [2 * dpr, 3 * dpr]);
      ctx.beginPath();
      ctx.moveTo(seg[0][0] * s, -seg[0][1] * s);
      ctx.lineTo(seg[1][0] * s, -seg[1][1] * s);
      ctx.stroke();
      if (label) {
        // a quarter of the way along the line from its upper end, clear of the corners
        const [p, q] = seg[0][1] > seg[1][1] ? seg : [seg[1], seg[0]];
        const x = p[0] + (q[0] - p[0]) * 0.25;
        ctx.fillStyle = color;
        ctx.textAlign = x > 0 ? 'right' : 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x * s + (x > 0 ? -6 : 6) * dpr, -(p[1] + (q[1] - p[1]) * 0.25) * s);
      }
    }
    ctx.restore();
    // scale bar: 100 um
    const bar = 0.1 * s;
    ctx.fillStyle = c.ink;
    ctx.fillRect(8 * dpr, h - 10 * dpr, bar, 2 * dpr);
    ctx.font = `${12 * dpr}px ${getComputedStyle(root).fontFamily}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText('100 µm', 8 * dpr, h - 14 * dpr);
  }

  function writeReadout() {
    const r = st.result;
    const band = BANDS[st.band];
    const study = params.study?.[band]?.tiptilt;
    const f = r.fields[st.selected];
    const who = st.isTypical ? `A typical ${band} stage` : `A ${band} stage built at random`;
    const ref = study ? ` (the band's median stage: ${fmt(study[0] * 1e3, 2)}, its 95th percentile: ${fmt(study[1] * 1e3, 2)})` : '';
    const ratio = f.wedge / SHARE;
    const where =
      f.wedge <= SHARE
        ? `inside the stage's ±${SHARE} µm share`
        : `${fmt(ratio, 1)} times the stage's ±${SHARE} µm share`;
    readout.innerHTML =
      `<span>${who}: tip and tilt change by ${fmt(r.stage.tiptilt * 1e3, 2)} mrad across the 25 fields${ref}. ` +
      `Scale error ${fmt(r.stage.scale * 100, 2)} %; calibrated, every field lands within ${fmt(r.stage.cal * 1e3, 1)} µm.</span>` +
      `<span>Selected field, row ${f.row + 1}, column ${f.col + 1}: lands ${fmt(um(f.err.raw), 1)} µm off target ` +
      `(${fmt(um(f.err.cal), 1)} µm calibrated), tilted ${fmt(f.tiptilt * 1e3, 2)} mrad, so its corners sit up to ` +
      `${fmt(f.wedge, 2)} µm from focus: ${where} of the ±${fmt(DOF, 1)} µm depth of focus.</span>`;
  }

  function drawAll() {
    if (!st.result) return;
    drawPad();
    drawChip();
    drawField();
    writeReadout();
    syncButtons();
  }

  function syncButtons() {
    root.querySelectorAll('[data-band]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.band) === st.band)));
    root.querySelectorAll('[data-preset]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.preset === st.preset)));
    root.querySelectorAll('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === st.mode)));
    $('[data-act="expose"]').textContent = st.run ? 'Show all fields now' : 'Expose all 25 fields';
  }

  // --- 3D ------------------------------------------------------------------

  let stage = null;
  function showPose(pose) {
    if (stage) stage.setPose(pose, st.g.theta0);
  }

  let tween = 0;
  /** Send the stage to site i: a short move, or a jump when motion is reduced. */
  function moveStageTo(i, jump) {
    cancelAnimationFrame(tween);
    const f = st.result.fields[i];
    const to = commandFor(f.x, f.y);
    if (jump || reduced.matches || !stage) {
      st.cmd = to;
      st.warm = f.pose;
      showPose(f.pose);
      return;
    }
    const from = st.cmd;
    const t0 = performance.now();
    const step = (now) => {
      const u = Math.min(1, (now - t0) / MOVE_MS);
      const e = u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2;
      st.cmd = from.map((v, k) => v + (to[k] - v) * e);
      st.warm = u < 1 ? poseAt(st.g, g0, st.cmd, st.warm) : f.pose;
      showPose(st.warm);
      if (u < 1) tween = requestAnimationFrame(step);
    };
    tween = requestAnimationFrame(step);
  }

  async function loadStage() {
    try {
      const { createStage } = await import('./scene3d.js');
      stage = await createStage(canvases.stage, {
        url: glbUrl,
        rig,
        colors: st.colors,
        onProgress: (e) => {
          if (e.total) status.textContent = `Loading the stage's CAD: ${Math.round((100 * e.loaded) / e.total)} %`;
        },
      });
    } catch (err) {
      status.textContent = 'The 3D view could not start here (it needs WebGL).';
      console.warn('stepper sim, 3D view:', err);
      return;
    }
    status.hidden = true;
    const box = canvases.stage.parentElement;
    stage.resize(box.clientWidth, box.clientHeight);
    showPose(st.warm ?? st.result.fields[st.selected].pose);
  }

  // --- step and repeat -------------------------------------------------------

  function stopRun() {
    if (!st.run) return;
    cancelAnimationFrame(st.run.raf);
    st.run = null;
    st.current = -1;
    if (stage) stage.setExposing(false, st.colors.uv);
  }

  function finishRun() {
    stopRun();
    st.shown = new Set(S.map((_, i) => i));
    st.selected = N_SITES - 1;
    moveStageTo(st.selected, true);
    drawAll();
  }

  function startRun() {
    if (reduced.matches) {
      finishRun();
      return;
    }
    cancelAnimationFrame(tween);
    st.shown = new Set();
    st.run = { i: 0, phase: 'move', t0: performance.now(), from: st.cmd, raf: 0 };
    st.current = 0;
    drawAll();
    const tick = (now) => {
      const run = st.run;
      if (!run) return;
      const f = st.result.fields[run.i];
      if (run.phase === 'move') {
        const u = Math.min(1, (now - run.t0) / MOVE_MS);
        const e = u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2;
        const to = commandFor(f.x, f.y);
        st.cmd = run.from.map((v, k) => v + (to[k] - v) * e);
        st.warm = u < 1 ? poseAt(st.g, g0, st.cmd, st.warm) : f.pose;
        showPose(st.warm);
        if (u >= 1) {
          run.phase = 'expose';
          run.t0 = now;
          st.selected = run.i;
          if (stage) stage.setExposing(true, st.colors.uv);
          drawChip();
          drawField();
          writeReadout();
        }
      } else if (now - run.t0 >= EXPOSE_MS) {
        st.shown.add(run.i);
        if (stage) stage.setExposing(false, st.colors.uv);
        run.i += 1;
        if (run.i >= N_SITES) {
          st.run = null;
          st.current = -1;
          drawAll();
          return;
        }
        st.current = run.i;
        run.phase = 'move';
        run.t0 = now;
        run.from = st.cmd;
        drawChip();
        drawField();
      }
      run.raf = requestAnimationFrame(tick);
    };
    st.run.raf = requestAnimationFrame(tick);
  }

  // --- input ---------------------------------------------------------------

  root.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b || b.disabled) return;
    if (b.dataset.band !== undefined) {
      const band = Number(b.dataset.band);
      typical[band] ??= typicalSeed(params, rig, band);
      setStage(band, typical[band], true);
    } else if (b.dataset.act === 'roll') {
      setStage(st.band, 1000 + Math.floor(Math.random() * 1e6), false);
    } else if (b.dataset.preset) {
      setPreset(b.dataset.preset);
    } else if (b.dataset.mode) {
      st.mode = b.dataset.mode;
      drawAll();
    } else if (b.dataset.act === 'expose') {
      if (st.run) finishRun();
      else startRun();
      syncButtons();
    }
  });

  function select(i) {
    if (st.run) return;
    st.selected = i;
    drawChip();
    drawField();
    writeReadout();
    moveStageTo(i, false);
  }

  canvases.chip.addEventListener('click', (e) => {
    const r = canvases.chip.getBoundingClientRect();
    const s = r.width / (2 * VIEW_HALF);
    const x = (e.clientX - r.left) / s - VIEW_HALF;
    const y = VIEW_HALF - (e.clientY - r.top) / s;
    let best = 0;
    S.forEach((p, i) => {
      if (Math.hypot(p.x - x, p.y - y) < Math.hypot(S[best].x - x, S[best].y - y)) best = i;
    });
    select(best);
  });
  canvases.chip.addEventListener('keydown', (e) => {
    const f = S[st.selected];
    const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (!d) return;
    e.preventDefault();
    const row = Math.min(params.dies.n - 1, Math.max(0, f.row + d[1]));
    const col = Math.min(params.dies.n - 1, Math.max(0, f.col + d[0]));
    select(S.findIndex((p) => p.row === row && p.col === col));
  });

  // drawing on the die
  let pen = null;
  const toMask = (e) => {
    const r = canvases.pad.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * MASK_W, ((e.clientY - r.top) / r.height) * MASK_H];
  };
  canvases.pad.addEventListener('pointerdown', (e) => {
    pen = { id: e.pointerId, at: toMask(e) };
    canvases.pad.setPointerCapture(e.pointerId);
    stopRun();
    mctx.fillStyle = '#000';
    mctx.beginPath();
    mctx.arc(pen.at[0], pen.at[1], 5, 0, 2 * Math.PI);
    mctx.fill();
    st.preset = null;
    drawPad();
  });
  canvases.pad.addEventListener('pointermove', (e) => {
    if (!pen || e.pointerId !== pen.id) return;
    const at = toMask(e);
    mctx.strokeStyle = '#000';
    mctx.lineWidth = 10;
    mctx.lineCap = 'round';
    mctx.beginPath();
    mctx.moveTo(pen.at[0], pen.at[1]);
    mctx.lineTo(at[0], at[1]);
    mctx.stroke();
    pen.at = at;
    drawPad();
  });
  const penUp = () => {
    if (!pen) return;
    pen = null;
    rebuildPattern();
  };
  canvases.pad.addEventListener('pointerup', penUp);
  canvases.pad.addEventListener('pointercancel', penUp);

  // --- size and theme --------------------------------------------------------

  const ro = new ResizeObserver(() => {
    drawAll();
    if (stage) {
      const box = canvases.stage.parentElement;
      stage.resize(box.clientWidth, box.clientHeight);
    }
  });
  [canvases.pad, canvases.chip, canvases.field, canvases.stage].forEach((c) => ro.observe(c.parentElement));
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    st.colors = palette();
    rebuildFields();
    if (stage) stage.setTheme(st.colors);
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches && st.run) finishRun();
  });

  // --- start ---------------------------------------------------------------

  mctx.fillStyle = '#000';
  PRESETS.text(mctx);
  rebuildPattern();
  typical[1] = typicalSeed(params, rig, 1);
  setStage(1, typical[1], true);
  root.querySelectorAll('button[disabled]').forEach((b) => (b.disabled = false));
  root.classList.add('sim-ready');
  loadStage();
}
