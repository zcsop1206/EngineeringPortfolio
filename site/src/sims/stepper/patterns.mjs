// Preset dies for the stepper sim, drawn on the die mask: a canvas the shape of
// the micromirror array (16:9), opaque where the mirrors expose.
export const MASK_W = 384;
export const MASK_H = 216;

function cross(ctx, x, y, s, w) {
  ctx.fillRect(x - s, y - w / 2, 2 * s, w);
  ctx.fillRect(x - w / 2, y - s, w, 2 * s);
}

function corners(ctx, s, w, inset) {
  for (const [x, y] of [[inset, inset], [MASK_W - inset, inset], [inset, MASK_H - inset], [MASK_W - inset, MASK_H - inset]]) {
    cross(ctx, x, y, s, w);
  }
}

export const PRESETS = {
  /** The chapter's name, with alignment crosses in the corners, where tilt moves the surface most. */
  text(ctx) {
    ctx.font = `700 ${Math.round(MASK_H * 0.3)}px system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HACKER', MASK_W / 2, MASK_H * 0.36, MASK_W * 0.8);
    ctx.fillText('FAB', MASK_W / 2, MASK_H * 0.68, MASK_W * 0.8);
    corners(ctx, 14, 4, 22);
  },
  /** Line-and-space groups, coarse to fine, repeated left, centre and right, vertical over horizontal. */
  lines(ctx) {
    // 8, 4 and 2 mask pixels: about 22, 11 and 5 um lines on the chip
    const groups = [8, 4, 2];
    for (const cx of [MASK_W * 0.17, MASK_W * 0.5, MASK_W * 0.83]) {
      let x = cx - 51;
      for (const w of groups) {
        for (let k = 0; k < 3; k++) {
          ctx.fillRect(x, 18, w, 80);
          x += 2 * w;
        }
        x += w * 1.5;
      }
      let y = 116;
      for (const w of groups) {
        for (let k = 0; k < 3; k++) {
          ctx.fillRect(cx - 40, y, 80, w);
          y += 2 * w;
        }
        y += 6;
      }
    }
  },
  /** Registration marks: a frame, a centre cross and corner crosses. */
  marks(ctx) {
    const w = 4;
    ctx.fillRect(6, 6, MASK_W - 12, w);
    ctx.fillRect(6, MASK_H - 6 - w, MASK_W - 12, w);
    ctx.fillRect(6, 6, w, MASK_H - 12);
    ctx.fillRect(MASK_W - 6 - w, 6, w, MASK_H - 12);
    cross(ctx, MASK_W / 2, MASK_H / 2, 40, 6);
    corners(ctx, 20, 6, 36);
    for (const [x, y] of [[MASK_W / 2, 36], [MASK_W / 2, MASK_H - 36], [36, MASK_H / 2], [MASK_W - 36, MASK_H / 2]]) {
      ctx.fillRect(x - 6, y - 6, 12, 12);
    }
  },
  clear() {},
};
