// The projection optics: what one field of micromirrors puts on the chip.
//
// Incoherent imaging. Each mirror that is on is a small square source; the
// objective (NA 0.25 at 410 nm) blurs it into its point-spread function, wider
// when the chip surface is out of focus; stage jitter during the exposure
// smears it further. The field's image is the sum over mirrors that are on,
// in units of the clear-field intensity (a fully lit area gives 1).
//
//   mirrorKernel(z, smear)   the image of one mirror at defocus z (um),
//                            sampled at the mirror pitch, summing to 1
//   Imager.image(mask, ...)  the image of a whole field whose focus error
//                            varies across it (piston plus tilt)
//
// Scalar, aberration-free pupil with the exact defocus phase
// 2 pi / lambda * z * (1 - sqrt(1 - (lambda f)^2)); sampled on the mirror grid,
// which is exact at the mirror centres because the sum over mirrors is a
// discrete convolution. Assumptions are listed in OPTICS.
import { fft2 } from './fft.mjs';

export const OPTICS = {
  lambda: 0.41, // um, the 410 nm LED (the post)
  na: 0.25, // the objective (CMU's; ours is an open input)
  pitch: 1040 / 1920, // um, one micromirror on the chip: the 1.04 mm field over 1920 mirrors
  fill: 1, // mirror fill factor: assumed 1 (the DMD's gaps are a few percent of the pitch)
};

/** Kernel half-width in mirrors: 24 mirrors = 13 um, past which the blur at 5 um defocus carries under 0.3 % of the light. */
export const R = 24;
const SUB = 4; // fine samples per mirror for the point-spread function
const M = 512; // fine grid: 512 x 0.135 um = 69 um window

const sinc = (x) => (x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x));
const freq = (i, n, df) => (i < n / 2 ? i : i - n) * df;

/** Image of one mirror at defocus z (um) with rms jitter smear (um): Float64Array (2R+1)^2, centre at [R, R], summing to 1. */
export function mirrorKernel(z, smear = 0, o = OPTICS) {
  const dx = o.pitch / SUB;
  const df = 1 / (M * dx);
  const fc = o.na / o.lambda;
  const k = (2 * Math.PI) / o.lambda;
  const re = new Float64Array(M * M);
  const im = new Float64Array(M * M);
  for (let j = 0; j < M; j++) {
    const fy = freq(j, M, df);
    for (let i = 0; i < M; i++) {
      const fx = freq(i, M, df);
      const f2 = fx * fx + fy * fy;
      if (f2 > fc * fc) continue;
      const phase = k * z * (1 - Math.sqrt(1 - o.lambda * o.lambda * f2));
      re[j * M + i] = Math.cos(phase);
      im[j * M + i] = Math.sin(phase);
    }
  }
  fft2(re, im, M, M, true); // amplitude point-spread function
  for (let i = 0; i < M * M; i++) {
    re[i] = re[i] * re[i] + im[i] * im[i]; // intensity
    im[i] = 0;
  }
  fft2(re, im, M, M, false); // optical transfer function
  const a = o.fill * o.pitch;
  const g = 2 * Math.PI * Math.PI * smear * smear;
  for (let j = 0; j < M; j++) {
    const fy = freq(j, M, df);
    for (let i = 0; i < M; i++) {
      const fx = freq(i, M, df);
      const t = sinc(fx * a) * sinc(fy * a) * Math.exp(-g * (fx * fx + fy * fy));
      re[j * M + i] *= t;
      im[j * M + i] *= t;
    }
  }
  fft2(re, im, M, M, true); // image of one mirror on the fine grid
  const n = 2 * R + 1;
  const K = new Float64Array(n * n);
  let sum = 0;
  for (let v = -R; v <= R; v++) {
    const y = (((v * SUB) % M) + M) % M;
    for (let u = -R; u <= R; u++) {
      const x = (((u * SUB) % M) + M) % M;
      const val = Math.max(0, re[y * M + x]);
      K[(v + R) * n + (u + R)] = val;
      sum += val;
    }
  }
  for (let i = 0; i < K.length; i++) K[i] /= sum;
  return K;
}

/**
 * Images fields block by block with FFT convolution. Each block (about 250 um
 * square) takes the focus error at its centre: across a block a tilted field
 * changes focus by well under a micron, which moves a 2 um line's printed width
 * by under 0.01 um (test/stepper-optics.test.mjs). The kernel is real and even,
 * so its spectrum is real and two blocks share one complex FFT (one in the real
 * part, one in the imaginary part).
 */
export class Imager {
  constructor(o = OPTICS, N = 512) {
    this.o = o;
    this.N = N;
    this.B = N - 2 * R; // valid output per block
    this.spectra = new Map();
  }

  /** Real spectrum of the mirror kernel at |z| (quantised to 0.1 um) and jitter smear, cached. */
  spectrum(z, smear) {
    const zq = Math.round(Math.abs(z) * 10) / 10;
    const key = `${zq}|${smear}`;
    let s = this.spectra.get(key);
    if (s) return s;
    const K = mirrorKernel(zq, smear, this.o);
    const N = this.N;
    const n = 2 * R + 1;
    const re = new Float64Array(N * N);
    const im = new Float64Array(N * N);
    for (let v = -R; v <= R; v++) {
      for (let u = -R; u <= R; u++) re[((v + N) % N) * N + ((u + N) % N)] = K[(v + R) * n + (u + R)];
    }
    fft2(re, im, N, N, false);
    s = re; // imaginary part is rounding noise for an even kernel
    if (this.spectra.size > 120) this.spectra.clear();
    this.spectra.set(key, s);
    return s;
  }

  /**
   * Image of a field: mask is W x H (Uint8Array, row 0 at the top, 1 = mirror on).
   * focus = { piston, gx, gy }: focus error z = piston + gx x + gy y (um), x and y
   * in um from the field centre, x right and y up. smear = rms jitter, um.
   * Returns { data: Float32Array, w: W + 2R, h: H + 2R }: the image extends R
   * mirrors past the field, where its light spills onto the neighbours.
   */
  image(mask, W, H, focus, smear = 0) {
    const { N, B } = this;
    const pw = W + 2 * R;
    const ph = H + 2 * R;
    const out = new Float32Array(pw * ph);
    const p = this.o.pitch;
    const zAt = (px, py) => focus.piston + focus.gx * (px - R - W / 2 + 0.5) * p - focus.gy * (py - R - H / 2 + 0.5) * p;
    // blocks that hold at least one lit mirror, in padded coordinates
    const blocks = [];
    for (let by = 0; by < ph; by += B) {
      for (let bx = 0; bx < pw; bx += B) {
        if (anyLit(mask, W, H, bx - 2 * R, by - 2 * R, N)) {
          blocks.push({ bx, by, z: zAt(Math.min(bx + B, pw) / 2 + bx / 2, Math.min(by + B, ph) / 2 + by / 2) });
        }
      }
    }
    // pair blocks that share a focus level, so one spectrum serves both halves of the complex FFT
    blocks.sort((a, b) => Math.abs(a.z) - Math.abs(b.z));
    const re = new Float64Array(N * N);
    const im = new Float64Array(N * N);
    for (let i = 0; i < blocks.length; ) {
      const a = blocks[i];
      const b = blocks[i + 1] && Math.round(Math.abs(blocks[i + 1].z) * 10) === Math.round(Math.abs(a.z) * 10) ? blocks[i + 1] : null;
      i += b ? 2 : 1;
      re.fill(0);
      im.fill(0);
      fillWindow(re, mask, W, H, a.bx - 2 * R, a.by - 2 * R, N);
      if (b) fillWindow(im, mask, W, H, b.bx - 2 * R, b.by - 2 * R, N);
      fft2(re, im, N, N, false);
      const s = this.spectrum(a.z, smear);
      for (let k = 0; k < N * N; k++) {
        re[k] *= s[k];
        im[k] *= s[k];
      }
      fft2(re, im, N, N, true);
      copyBlock(out, pw, ph, re, a.bx, a.by, B, N);
      if (b) copyBlock(out, pw, ph, im, b.bx, b.by, B, N);
    }
    return { data: out, w: pw, h: ph };
  }
}

/** Whether the N x N mask window starting at mask coordinates (x0, y0) has a lit mirror. */
function anyLit(mask, W, H, x0, y0, N) {
  const ya = Math.max(0, y0), yb = Math.min(H, y0 + N);
  const xa = Math.max(0, x0), xb = Math.min(W, x0 + N);
  for (let y = ya; y < yb; y++) {
    const row = y * W;
    for (let x = xa; x < xb; x++) if (mask[row + x]) return true;
  }
  return false;
}

/** Copy the N x N mask window starting at mask coordinates (x0, y0) into buf, zero outside the mask. */
function fillWindow(buf, mask, W, H, x0, y0, N) {
  for (let wy = 0; wy < N; wy++) {
    const my = y0 + wy;
    if (my < 0 || my >= H) continue;
    for (let wx = 0; wx < N; wx++) {
      const mx = x0 + wx;
      if (mx >= 0 && mx < W && mask[my * W + mx]) buf[wy * N + wx] = 1;
    }
  }
}

/** Copy a block's valid B x B centre (window offset R) into the padded output at (bx, by). */
function copyBlock(out, pw, ph, src, bx, by, B, N) {
  const x1 = Math.min(bx + B, pw);
  const y1 = Math.min(by + B, ph);
  for (let py = by; py < y1; py++) {
    const srow = (py - by + R) * N + R - bx;
    const orow = py * pw;
    for (let px = bx; px < x1; px++) {
      const v = src[srow + px];
      out[orow + px] = v > 0 ? v : 0;
    }
  }
}

/** Resist: clears where the dose (in clear-field units) reaches the threshold. Positive-tone, a sharp threshold. */
export const RESIST = { threshold: 0.5 };
