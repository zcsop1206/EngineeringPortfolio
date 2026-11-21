// The starting design, in um on the design frame (centre of the 4 x 4 field area
// at 0, y up). Fields are 1040 x 585 um, so seams run at x = -1040, 0, 1040
// and y = -585, 0, 585. It puts something across the seams, where
// the stage's errors show.

const WIDTHS = [1, 2, 3, 5, 10, 20];

/** Lines of each width, side by side, crossing a seam. */
function ladder(x0, y0, len, gap, vertical) {
  return WIDTHS.map((w, k) => {
    const c = k * gap;
    return {
      type: 'stroke',
      w,
      cap: 'butt',
      pts: vertical ? [[x0 + c, y0], [x0 + c, y0 + len]] : [[x0, y0 - c], [x0 + len, y0 - c]],
    };
  });
}

/** A square grid of lines w um wide and pitch um apart, centred on (cx, cy). */
function grid(cx, cy, n, pitch, w) {
  const h = ((n - 1) * pitch) / 2;
  const out = [];
  for (let k = 0; k < n; k++) {
    const o = -h + k * pitch;
    out.push({ type: 'stroke', w, cap: 'butt', pts: [[cx + o, cy - h - w], [cx + o, cy + h + w]] });
    out.push({ type: 'stroke', w, cap: 'butt', pts: [[cx - h - w, cy + o], [cx + h + w, cy + o]] });
  }
  return out;
}

export const PRESETS = {
  /** The chapter's name across four fields, line widths 1 to 20 um across two seams, and a grid on a four-field corner. */
  test: () => [
    { type: 'text', text: 'HACKER FAB', x: -1520, y: 170, size: 330, weight: 700 },
    ...ladder(-720, -760, 360, 70, true),
    ...ladder(-180, -150, 360, 60, false),
    ...grid(1040, -585, 7, 24, 2),
  ],
};

