// Background worker: one field at a time, the mirror pattern the projector
// shows (rasterised from the design, pre-warped when calibrated), its image on
// the chip through the objective, and the design on the nominal grid for the
// comparison afterwards.
import { Imager, OPTICS } from './optics.mjs';
import { classMap, drawField, MIRRORS, readMask } from './raster.mjs';

const imager = new Imager();
const { W, H } = MIRRORS;
const canvas = new OffscreenCanvas(W, H);
const ctx = canvas.getContext('2d', { willReadFrequently: true });

self.onmessage = ({ data: job }) => {
  const { id, items, classes, fx, fy, pre, focus, smear } = job;
  try {
    drawField(ctx, items, fx, fy, OPTICS.pitch, pre);
    const mask = readMask(ctx);
    const lit = mask.reduce((n, v) => n + v, 0);
    const img = imager.image(mask, W, H, focus, smear);
    const cls = classMap(ctx, items, classes, fx, fy, OPTICS.pitch);
    self.postMessage({ id, lit, dose: img.data, w: img.w, h: img.h, cls }, [img.data.buffer, cls.buffer]);
  } catch (err) {
    self.postMessage({ id, error: String(err) });
  }
};
