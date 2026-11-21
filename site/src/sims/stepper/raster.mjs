// The design as vector items in um (design frame: centre of the area at 0, y up),
// and their rasterisation onto a field's 1920 x 1080 micromirrors.
//
// Items:
//   { type: 'stroke', w, pts: [[x, y], ...], cap?: 'round' | 'butt' }  a line w um wide
//   { type: 'text', text, x, y, size, weight }  text with its baseline's left end at (x, y),
//                                               size = font size in um
// Each item has a feature class (its line width, or its text size) so the
// readout can say how each size printed.

export const MIRRORS = { W: 1920, H: 1080 };
export const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

/** Feature-class label of an item. */
export function classOf(item) {
  return item.type === 'text' ? `text ${item.size} µm` : `line ${item.w} µm`;
}

/** Approximate bounding box (um) of an item, for deciding which fields it touches. */
export function bounds(item, measure) {
  if (item.type === 'text') {
    const w = measure ? measure(item) : item.size * 0.62 * item.text.length;
    return [item.x, item.y - item.size * 0.3, item.x + w, item.y + item.size * 0.85];
  }
  const xs = item.pts.map((p) => p[0]);
  const ys = item.pts.map((p) => p[1]);
  const h = item.w / 2;
  return [Math.min(...xs) - h, Math.min(...ys) - h, Math.max(...xs) + h, Math.max(...ys) + h];
}

/**
 * Draw items into ctx (a W x H mirror canvas) for the field centred at (fx, fy) um.
 * pre = { rot, mag }: the image is pre-rotated and pre-scaled to undo a measured
 * projector rotation and magnification (calibration); zero when uncalibrated.
 */
export function drawField(ctx, items, fx, fy, pitch, pre = { rot: 0, mag: 0 }, { W = MIRRORS.W, H = MIRRORS.H } = {}) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);
  // design um -> mirror px: m = R(-rot) (d - f) / (1 + mag); px = W/2 + m_x / pitch, py = H/2 - m_y / pitch
  const k = 1 / ((1 + pre.mag) * pitch);
  const c = Math.cos(-pre.rot) * k;
  const s = Math.sin(-pre.rot) * k;
  // [px; py] = [c -s; -s -c] [x - fx; y - fy] + [W/2; H/2]
  ctx.setTransform(c, -s, -s, -c, W / 2 - c * fx + s * fy, H / 2 + s * fx + c * fy);
  ctx.fillStyle = '#000';
  ctx.strokeStyle = '#000';
  for (const it of items) {
    if (it.type === 'text') {
      ctx.save();
      ctx.translate(it.x, it.y);
      ctx.scale(1, -1); // text is drawn y-down
      ctx.font = `${it.weight || 700} ${it.size}px ${FONT}`;
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(it.text, 0, 0);
      ctx.restore();
    } else if (it.pts.length === 1) {
      if (it.cap === 'butt') continue;
      ctx.beginPath();
      ctx.arc(it.pts[0][0], it.pts[0][1], it.w / 2, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      ctx.lineWidth = it.w;
      ctx.lineCap = it.cap || 'round';
      ctx.lineJoin = it.cap === 'butt' ? 'miter' : 'round';
      ctx.beginPath();
      ctx.moveTo(it.pts[0][0], it.pts[0][1]);
      for (let i = 1; i < it.pts.length; i++) ctx.lineTo(it.pts[i][0], it.pts[i][1]);
      ctx.stroke();
    }
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/** Binary mirror states from the canvas: a mirror is on where the drawing covers at least half of it. */
export function readMask(ctx, W = MIRRORS.W, H = MIRRORS.H, into) {
  const d = ctx.getImageData(0, 0, W, H).data;
  const m = into || new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) m[i] = d[4 * i + 3] >= 128 ? 1 : 0;
  return m;
}

/**
 * The design on the nominal mirror grid of a field: 0 = empty, k + 1 = feature
 * class k (classes drawn in order, so a later class wins where items overlap).
 */
export function classMap(ctx, items, classes, fx, fy, pitch, W = MIRRORS.W, H = MIRRORS.H) {
  const map = new Uint8Array(W * H);
  const tmp = new Uint8Array(W * H);
  classes.forEach((label, k) => {
    const its = items.filter((it) => classOf(it) === label);
    if (!its.length) return;
    drawField(ctx, its, fx, fy, pitch, undefined, { W, H });
    readMask(ctx, W, H, tmp);
    for (let i = 0; i < map.length; i++) if (tmp[i]) map[i] = k + 1;
  });
  return map;
}
