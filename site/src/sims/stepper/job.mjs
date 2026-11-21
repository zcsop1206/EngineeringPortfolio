// The job: the design area cut into fields, and the program the stage runs.
//
// The design area is a grid of fields, each the 1.04 x 0.585 mm the projector
// shows at once, centred on the chip. Only fields that hold part of the
// pattern are exposed, row by row and back and forth. The program is G-code
// for the stage firmware (Open Micro-Manipulator, MotionControllerRP):
//   G28 home, M17 / M18 motors on / off, M204 L acceleration (mm/s^2),
//   G0 X Y Z F move (mm, mm/s), G4 P dwell (ms), M3 T S tool output,
//   which the firmware switches in step with the motion; here T0 marks the
//   exposure. Autofocus runs on the camera between moves, so it appears as a
//   comment. Machine times follow the firmware's planner: trapezoidal speed,
//   F as top speed, M204 as acceleration. G28 drives every joint into its
//   stop at the homing speed and backs it off a little (robot.cpp home(),
//   homing_controller.cpp), so after homing the stage sits off to one side and
//   the first move brings it back to the centre.

export const AREA = { cols: 4, rows: 4 };

export const MACHINE = {
  feed: 10, // mm/s, the firmware's default feed rate (robot.cpp)
  accel: 500, // mm/s^2, the firmware's default acceleration (robot.cpp)
  settle_ms: 300, // assumed: wait after each move before focusing
  focus_ms: 1500, // assumed: autofocus on the camera
  expose_ms: 2000, // assumed: exposure at 100 % dose; nobody has measured the dose-to-clear yet
  home_speed: 1, // rad/s at the rotor, the firmware's HOMING_VELOCITY (hw_config.h)
  home_back: (0.25 * 2 * Math.PI) / 50, // rad: a quarter electrical turn of a 50-pole-pair motor (homing_controller.cpp)
  home_back_speed: 100 / 50, // rad/s at the rotor (homing_controller.cpp)
};

/** Machine time of G28 from joint angles start (rad): every joint into its stop at once, then back off. */
export function homeTime(start, machine = MACHINE) {
  return Math.max(...start) / machine.home_speed + machine.home_back / machine.home_back_speed;
}

/** Joint angles (rad) at time t into G28 from start: down at the homing speed, then back off. */
export function homeAngles(start, t, machine = MACHINE) {
  const down = Math.max(...start) / machine.home_speed;
  if (t <= down) return start.map((a) => Math.max(0, a - machine.home_speed * t));
  return start.map(() => Math.min(machine.home_back, (t - down) * machine.home_back_speed));
}

/** Distance along a move of length d (mm) at time t (s): the planner's trapezoid, or triangle on short moves. */
export function moveDistance(d, t, v = MACHINE.feed, a = MACHINE.accel) {
  const T = moveTime(d, v, a);
  if (t >= T) return d;
  if (t <= 0) return 0;
  const ta = d >= (v * v) / a ? v / a : T / 2; // time spent accelerating
  const vp = a * ta; // top speed reached
  if (t < ta) return 0.5 * a * t * t;
  if (t <= T - ta) return 0.5 * a * ta * ta + vp * (t - ta);
  const r = T - t;
  return d - 0.5 * a * r * r;
}

/**
 * Geometry of the design area in mm (chip coordinates, centre at 0, y up).
 * A field is the mirror array on the chip: 1920 x 1080 square mirrors of
 * pitch um, so 1.04 x 0.585 mm (CMU's 0.58 is that height rounded).
 */
export function areaGeometry(pitch, mirrors = { W: 1920, H: 1080 }, area = AREA) {
  const fw = (mirrors.W * pitch) / 1000;
  const fh = (mirrors.H * pitch) / 1000;
  return { fw, fh, cols: area.cols, rows: area.rows, w: area.cols * fw, h: area.rows * fh };
}

/** Centre of field (col, row), row 0 at the top, in chip mm. */
export function fieldCentre(geo, col, row) {
  return [(col - (geo.cols - 1) / 2) * geo.fw, ((geo.rows - 1) / 2 - row) * geo.fh];
}

/** Every field of the area, row-major from the top left: { index, col, row, x, y }. */
export function allFields(geo) {
  const out = [];
  for (let row = 0; row < geo.rows; row++) {
    for (let col = 0; col < geo.cols; col++) {
      const [x, y] = fieldCentre(geo, col, row);
      out.push({ index: row * geo.cols + col, col, row, x, y });
    }
  }
  return out;
}

/** The fields to expose, in stage order: rows top to bottom, alternate rows right to left. */
export function exposureOrder(fields, lit) {
  const rows = new Map();
  for (const f of fields) {
    if (!lit.has(f.index)) continue;
    if (!rows.has(f.row)) rows.set(f.row, []);
    rows.get(f.row).push(f);
  }
  const out = [];
  [...rows.keys()].sort((a, b) => a - b).forEach((row, k) => {
    const r = rows.get(row).sort((a, b) => a.col - b.col);
    out.push(...(k % 2 ? r.reverse() : r));
  });
  return out;
}

/** Machine time of a move of length d mm: trapezoid (or triangle) with top speed v and acceleration a. */
export function moveTime(d, v = MACHINE.feed, a = MACHINE.accel) {
  if (d <= 0) return 0;
  return d >= (v * v) / a ? d / v + v / a : 2 * Math.sqrt(d / a);
}

const f3 = (v) => (Math.abs(v) < 5e-4 ? 0 : v).toFixed(3);

/**
 * The program for a list of exposures, each { field, cmd: [x, y, z] mm } in
 * stage order. dose is a fraction of the nominal exposure. start: joint angles
 * (rad) before homing; homed: where the firmware believes the end effector is
 * after homing (mm). Returns lines { text, kind, field?, t, dur } with machine
 * start time t and duration dur (s); moves carry from and to (mm), homing
 * carries the joint angles it starts from.
 */
export function program(exposures, { dose = 1, machine = MACHINE, geo, start = [0, 0, 0], homed = [0, 0, 0] } = {}) {
  const lines = [];
  let t = 0;
  const add = (text, kind, dur = 0, extra = {}) => {
    lines.push({ text, kind, t, dur, ...extra });
    t += dur;
  };
  const exp = Math.round(machine.expose_ms * dose);
  const size = geo ? `${geo.w.toFixed(2)} x ${geo.h.toFixed(2)} mm, ` : '';
  // feed rate is modal in the firmware: set once on the first move
  const line = (cmd, note) => (note ? `${cmd.padEnd(19)} ; ${note}` : cmd);
  add(`; ${exposures.length} fields, ${size}${exp} ms exposures`, 'comment');
  add(line('M17', 'motors on'), 'machine');
  add(line('G28', 'home every joint'), 'home', homeTime(start, machine), { start });
  add(line(`M204 L${machine.accel}`, 'accel, mm/s^2'), 'machine');
  let at = homed;
  const move = (text, to, extra) => {
    add(text, 'move', moveTime(Math.hypot(to[0] - at[0], to[1] - at[1], to[2] - at[2]), machine.feed, machine.accel), { from: at, to, ...extra });
    at = to;
  };
  move(line(`G0 X0 Y0 Z0 F${machine.feed}`, 'centre, focus height'), [0, 0, 0]);
  exposures.forEach((e, i) => {
    const [x, y, z] = e.cmd;
    move(line(`G0 X${f3(x)} Y${f3(y)}`, `field ${i + 1} of ${exposures.length}`), [x, y, z], { field: e.field });
    add(line(`G4 P${machine.settle_ms}`, 'settle'), 'settle', machine.settle_ms / 1000, { field: e.field });
    add('; autofocus (camera)', 'focus', machine.focus_ms / 1000, { field: e.field });
    add(line('M3 T0 S1', 'light on'), 'on', 0, { field: e.field });
    add(line(`G4 P${exp}`, 'expose'), 'expose', exp / 1000, { field: e.field });
    add(line('M3 T0 S0', 'light off'), 'off', 0, { field: e.field });
  });
  add(line('M18', 'motors off'), 'machine');
  return { lines, total: t };
}
