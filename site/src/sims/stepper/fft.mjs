// Radix-2 complex FFT, in place, on split real and imaginary arrays.
// fft2 transforms a row-major nx x ny grid (both powers of two). The inverse
// includes the 1/(nx ny) scale, so fft2(.., false) then fft2(.., true) is the identity.

const plans = new Map();

function plan(n) {
  let p = plans.get(n);
  if (p) return p;
  const bits = Math.log2(n);
  if (!Number.isInteger(bits)) throw new Error(`FFT length ${n} is not a power of two`);
  const rev = new Uint32Array(n);
  for (let i = 0; i < n; i++) {
    let r = 0;
    for (let b = 0, v = i; b < bits; b++, v >>= 1) r = (r << 1) | (v & 1);
    rev[i] = r;
  }
  const cos = new Float64Array(n / 2);
  const sin = new Float64Array(n / 2);
  for (let k = 0; k < n / 2; k++) {
    cos[k] = Math.cos((2 * Math.PI * k) / n);
    sin[k] = Math.sin((2 * Math.PI * k) / n);
  }
  p = { n, rev, cos, sin };
  plans.set(n, p);
  return p;
}

/** In-place FFT of length n on re[off + i*stride], im[off + i*stride]. Unscaled in both directions. */
export function fft1(re, im, n, inverse = false, off = 0, stride = 1) {
  const { rev, cos, sin } = plan(n);
  for (let i = 0; i < n; i++) {
    const j = rev[i];
    if (j > i) {
      const a = off + i * stride;
      const b = off + j * stride;
      let t = re[a]; re[a] = re[b]; re[b] = t;
      t = im[a]; im[a] = im[b]; im[b] = t;
    }
  }
  const sgn = inverse ? 1 : -1;
  for (let size = 2; size <= n; size <<= 1) {
    const half = size >> 1;
    const step = n / size;
    for (let i = 0; i < n; i += size) {
      for (let j = 0, k = 0; j < half; j++, k += step) {
        const a = off + (i + j) * stride;
        const b = a + half * stride;
        const wr = cos[k];
        const wi = sgn * sin[k];
        const tr = re[b] * wr - im[b] * wi;
        const ti = re[b] * wi + im[b] * wr;
        re[b] = re[a] - tr;
        im[b] = im[a] - ti;
        re[a] += tr;
        im[a] += ti;
      }
    }
  }
}

let scratch = null;

function transpose(a, nx, ny, t) {
  for (let y = 0; y < ny; y++) {
    const row = y * nx;
    for (let x = 0; x < nx; x++) t[x * ny + y] = a[row + x];
  }
  a.set(t);
}

/** In-place 2D FFT of a row-major grid nx wide and ny tall. Columns run as rows of the transpose (cache friendly). */
export function fft2(re, im, nx, ny, inverse = false) {
  for (let y = 0; y < ny; y++) fft1(re, im, nx, inverse, y * nx, 1);
  if (!scratch || scratch.length < re.length) scratch = new Float64Array(re.length);
  const t = scratch.length === re.length ? scratch : scratch.subarray(0, re.length);
  transpose(re, nx, ny, t);
  transpose(im, nx, ny, t);
  for (let x = 0; x < nx; x++) fft1(re, im, ny, inverse, x * ny, 1);
  transpose(re, ny, nx, t);
  transpose(im, ny, nx, t);
  if (inverse) {
    const s = 1 / (nx * ny);
    for (let i = 0; i < re.length; i++) {
      re[i] *= s;
      im[i] *= s;
    }
  }
}
