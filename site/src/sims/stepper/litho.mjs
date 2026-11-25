// The chip: the resist over the design area, as one chunk per field on the
// nominal mirror grid (1920 x 1080 samples of 0.54 um).
//
// Each exposure adds its image to the dose, mapped through where that field
// actually landed (position, rotation, magnification), so light from
// neighbouring fields adds up at the seams. Developing clears the resist where
// the dose reaches the threshold (positive resist). The comparison is per
// sample against the design on the same grid: printed where designed,
// missing (designed but not printed) and extra (printed but not designed).
import { R, RESIST } from './optics.mjs';
import { MIRRORS } from './raster.mjs';

const { W, H } = MIRRORS;
const DOSE_UNIT = 100; // dose stored as Uint8, 1/100 of the clear-field dose

export class Chip {
  constructor(geo, pitch) {
    this.geo = geo;
    this.p = pitch;
    this.grid = new Array(geo.cols * geo.rows).fill(null); // chunk per field, or null until something lands there
    this.threshold = Math.round(RESIST.threshold * DOSE_UNIT);
  }

  key(col, row) {
    return row * this.geo.cols + col;
  }

  /** The chunk of field (col, row), made on first use; null outside the area. */
  chunk(col, row, make = true) {
    if (col < 0 || row < 0 || col >= this.geo.cols || row >= this.geo.rows) return null;
    const k = this.key(col, row);
    let c = this.grid[k];
    if (!c && make) {
      const { fw, fh, cols, rows } = this.geo;
      c = {
        col,
        row,
        x0: ((col - (cols - 1) / 2) * fw - fw / 2) * 1000, // um, left edge
        y0: (((rows - 1) / 2 - row) * fh + fh / 2) * 1000, // um, top edge
        dose: new Uint8ClampedArray(W * H),
        cls: null,
      };
      this.grid[k] = c;
    }
    return c || null;
  }

  setDesign(col, row, cls) {
    this.chunk(col, row).cls = cls;
  }

  /**
   * Add one exposure. e: the field's placement from errors.exposeFields (centre mm,
   * net rot and mag, pre-warp); img: { data, w, h } from the optics, padded by R;
   * dose: exposure as a fraction of nominal.
   */
  expose(e, img, dose = 1) {
    const p = this.p;
    const rot = e.rot + e.pre.rot;
    const k = (1 + e.mag) * (1 + e.pre.mag);
    const cx = e.centre[0] * 1000;
    const cy = e.centre[1] * 1000;
    const cs = Math.cos(-rot) / k;
    const sn = Math.sin(-rot) / k;
    const scale = dose * DOSE_UNIT;
    // footprint of the padded image, um
    const hw = ((img.w / 2) * p) * k + 2;
    const hh = ((img.h / 2) * p) * k + 2;
    const { col, row } = e.field;
    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        const ch = this.chunk(c, r, false) || this.touches(c, r, cx, cy, hw, hh);
        if (!ch) continue;
        // chunk pixel range within the footprint's bounding box
        const i0 = Math.max(0, Math.floor((cx - hw - hh - ch.x0) / p));
        const i1 = Math.min(W, Math.ceil((cx + hw + hh - ch.x0) / p));
        const j0 = Math.max(0, Math.floor((ch.y0 - (cy + hh + hw)) / p));
        const j1 = Math.min(H, Math.ceil((ch.y0 - (cy - hh - hw)) / p));
        if (i0 >= i1 || j0 >= j1) continue;
        for (let j = j0; j < j1; j++) {
          const dy = ch.y0 - (j + 0.5) * p - cy;
          for (let i = i0; i < i1; i++) {
            const dx = ch.x0 + (i + 0.5) * p - cx;
            const mx = cs * dx - sn * dy;
            const my = sn * dx + cs * dy;
            const u = mx / p + W / 2 - 0.5 + R;
            const v = H / 2 - my / p - 0.5 + R;
            const iu = Math.floor(u);
            const iv = Math.floor(v);
            if (iu < 0 || iv < 0 || iu >= img.w - 1 || iv >= img.h - 1) continue;
            const fu = u - iu;
            const fv = v - iv;
            const o = iv * img.w + iu;
            const d = img.data;
            const val = (d[o] * (1 - fu) + d[o + 1] * fu) * (1 - fv) + (d[o + img.w] * (1 - fu) + d[o + img.w + 1] * fu) * fv;
            if (val > 0.002) ch.dose[j * W + i] += val * scale;
          }
        }
      }
    }
  }

  /** A neighbour chunk is made only if the footprint reaches it. */
  touches(c, r, cx, cy, hw, hh) {
    if (c < 0 || r < 0 || c >= this.geo.cols || r >= this.geo.rows) return null;
    const { fw, fh, cols, rows } = this.geo;
    const x0 = ((c - (cols - 1) / 2) * fw - fw / 2) * 1000;
    const y0 = (((rows - 1) / 2 - r) * fh + fh / 2) * 1000;
    const x1 = x0 + fw * 1000;
    const y1 = y0 - fh * 1000;
    const reach = Math.max(hw, hh);
    if (cx + reach < x0 || cx - reach > x1 || cy - reach > y0 || cy + reach < y1) return null;
    return this.chunk(c, r);
  }

  /** Per-sample state: 0 empty, 1 printed as designed, 2 missing, 3 extra; latent dose otherwise. */
  state(ch, i) {
    const printed = ch.dose[i] >= this.threshold;
    const designed = ch.cls ? ch.cls[i] > 0 : false;
    return printed ? (designed ? 1 : 3) : designed ? 2 : 0;
  }

  /**
   * Per feature class: designed samples, and how many printed where their own
   * field put them (each design point mapped through its field's placement), so
   * this measures the optics, focus and dose, not the registration. Plus samples
   * printed where nothing was designed (anywhere on the chip).
   */
  stats(nClasses, exposures, printedAt) {
    const designed = new Float64Array(nClasses + 1);
    const printed = new Float64Array(nClasses + 1);
    let extra = 0;
    let missing = 0; // designed but not printed at that very spot: registration and printing together
    const byField = new Map(exposures.map((e) => [this.key(e.field.col, e.field.row), e]));
    const p = this.p;
    for (const ch of this.grid) {
      if (!ch) continue;
      const { dose, cls } = ch;
      const e = byField.get(this.key(ch.col, ch.row));
      const fx = e ? e.field.x * 1000 : 0;
      const fy = e ? e.field.y * 1000 : 0;
      for (let j = 0; j < H; j++) {
        const y = ch.y0 - (j + 0.5) * p;
        for (let i = 0; i < W; i++) {
          const k = j * W + i;
          const c = cls ? cls[k] : 0;
          if (!c) {
            if (dose[k] >= this.threshold) extra++;
            continue;
          }
          designed[c]++;
          if (dose[k] < this.threshold) missing++;
          if (!e) continue;
          const x = ch.x0 + (i + 0.5) * p;
          const q = printedAt(e, x - fx, y - fy);
          const s = this.sample(q[0], q[1]);
          if (s && s.dose * DOSE_UNIT >= this.threshold) printed[c]++;
        }
      }
    }
    return { designed, printed, extra, missing, sampleArea: p * p };
  }

  /**
   * Render the area into an RGBA buffer w x h (whole area, y down), each pixel the
   * mix of its samples. mode 'latent' shows dose; 'developed' shows the print with
   * errors coloured. colors: { resist, ink, uv, missing, extra } as [r, g, b].
   * rect = [x0, y0, x1, y1] in pixels limits the work to that part.
   */
  render(buf, w, h, mode, colors, rect = null) {
    const { geo, p } = this;
    const [px0, py0, px1, py1] = rect ? [Math.max(0, rect[0]), Math.max(0, rect[1]), Math.min(w, rect[2]), Math.min(h, rect[3])] : [0, 0, w, h];
    const sx = (geo.w * 1000) / w; // um per pixel
    const sy = (geo.h * 1000) / h;
    const n = 3; // sub-samples per axis
    const left = -geo.w * 500;
    const top = geo.h * 500;
    for (let py = py0; py < py1; py++) {
      for (let px = px0; px < px1; px++) {
        let r = 0, g = 0, b = 0;
        for (let sj = 0; sj < n; sj++) {
          const y = top - (py + (sj + 0.5) / n) * sy;
          for (let si = 0; si < n; si++) {
            const x = left + (px + (si + 0.5) / n) * sx;
            const col = Math.floor((x - left) / (geo.fw * 1000));
            const row = Math.floor((top - y) / (geo.fh * 1000));
            const ch = this.grid[row * geo.cols + col];
            let c = colors.resist;
            if (ch) {
              const i = Math.floor((x - ch.x0) / p);
              const j = Math.floor((ch.y0 - y) / p);
              const k = j * W + i;
              if (mode === 'latent') {
                const t = Math.min(1, ch.dose[k] / DOSE_UNIT);
                if (t > 0) {
                  r += colors.resist[0] + (colors.uv[0] - colors.resist[0]) * t;
                  g += colors.resist[1] + (colors.uv[1] - colors.resist[1]) * t;
                  b += colors.resist[2] + (colors.uv[2] - colors.resist[2]) * t;
                  continue;
                }
              } else {
                const s = this.state(ch, k);
                c = s === 1 ? colors.ink : s === 2 ? colors.missing : s === 3 ? colors.extra : colors.resist;
              }
            }
            r += c[0]; g += c[1]; b += c[2];
          }
        }
        const o = 4 * (py * w + px);
        buf[o] = r / (n * n);
        buf[o + 1] = g / (n * n);
        buf[o + 2] = b / (n * n);
        buf[o + 3] = 255;
      }
    }
  }

  /** Sample state at a chip point (um), for the lens: { state, dose, designed } or null outside the area. */
  sample(x, y) {
    const { geo, p } = this;
    const col = Math.floor((x + geo.w * 500) / (geo.fw * 1000));
    const row = Math.floor((geo.h * 500 - y) / (geo.fh * 1000));
    if (col < 0 || row < 0 || col >= geo.cols || row >= geo.rows) return null;
    const ch = this.grid[row * geo.cols + col];
    if (!ch || col < 0 || row < 0 || col >= geo.cols || row >= geo.rows) return null;
    const i = Math.floor((x - ch.x0) / p);
    const j = Math.floor((ch.y0 - y) / p);
    if (i < 0 || j < 0 || i >= W || j >= H) return null;
    const k = j * W + i;
    return { state: this.state(ch, k), dose: ch.dose[k] / DOSE_UNIT, designed: ch.cls ? ch.cls[k] : 0 };
  }
}
