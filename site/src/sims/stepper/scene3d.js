// The stage in 3D: the chapter CAD's meshes (stepper.glb, one node per rigid
// group), moved by the kinematic model. Loaded only once the sim is near the
// screen; renders on demand, never in a loop of its own.
//
// Always at true scale, where the stage's errors (microns) cannot be seen, so
// they are marked instead: each rod tinted by how far its length is off (blue
// long, red short), each ball seat by how far it sits from the CAD.
//
// Frames: the meshes are in the chapter frame (mm, z up, optical axis at
// x = y = 0); the model's base frame is that frame shifted by rig.base_origin.
// The CAD shows the neutral pose, so each group moves from there:
//   horn i     turns about its rotor axis by -(theta_i - theta0_i)
//   effector   X -> O + P + Q (X - O - P_ref), P_ref the firmware's neutral EE position
//   rod        spans its two ball centres, each carried by its horn or the effector
import {
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PerspectiveCamera,
  PropertyBinding,
  Quaternion,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export async function createStage(canvas, { url, rig, colors, onProgress }) {
  const renderer = new WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new Scene();
  const camera = new PerspectiveCamera(26, 1, 10, 3000);
  camera.up.set(0, 0, 1);
  const hemi = new HemisphereLight(0xffffff, 0x8a8a8a, 2.6);
  hemi.position.set(0, 0, 1);
  const sun = new DirectionalLight(0xffffff, 2.0);
  scene.add(hemi, sun, sun.target);

  const gltf = await new GLTFLoader().loadAsync(url, onProgress);
  const mats = {};
  const material = (key) => (mats[key] ??= new MeshLambertMaterial());
  // one pivot per group; the loader turns node names like "horn 1" into "horn_1"
  const nodes = {};
  const key = (group) => PropertyBinding.sanitizeNodeName(group);
  for (const node of [...gltf.scene.children]) {
    const p = new Group();
    p.matrixAutoUpdate = false;
    p.add(node);
    scene.add(p);
    nodes[node.name] = p;
    node.traverse((o) => {
      if (!o.isMesh) return;
      // the glb stores no normals: vertices are shared only inside a CAD face, so these are smooth
      // across a face and sharp at its edges
      o.geometry.computeVertexNormals();
      const cls = o.material.name;
      o.userData.cls = cls === 'printed' && node.name !== 'frame' ? 'moving' : cls;
      o.material = material(o.userData.cls);
    });
  }
  // each rod gets its own material so it can carry its length error
  const rodMats = {};
  for (const rod of rig.rods) {
    const m = new MeshLambertMaterial();
    rodMats[rod.group] = m;
    nodes[key(rod.group)].traverse((o) => {
      if (o.isMesh && o.userData.cls === 'metal') o.material = m;
    });
  }
  // a marker on each ball centre, coloured by how far that seat sits from the CAD
  const markerGeo = new SphereGeometry(1.5, 16, 12);
  const markers = rig.rods.flatMap((rod) =>
    ['rotor', 'ee'].map((side) => {
      const m = new Mesh(markerGeo, new MeshBasicMaterial());
      m.userData = { rod, side };
      scene.add(m);
      return m;
    }),
  );
  const O = new Vector3(...rig.base_origin);

  // camera on a sphere about a target; drag to turn
  const home = new Vector3(-26, -26, 104);
  const target = home.clone();
  let radius = 92;
  let az = Math.PI / 4;
  let el = 0.42;
  let width = 1;
  let height = 1;
  let dist = 1;
  function place() {
    camera.aspect = width / height;
    const vfov = (camera.fov * Math.PI) / 180;
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
    dist = radius / Math.sin(Math.min(vfov, hfov) / 2);
    camera.position.set(
      target.x + dist * Math.cos(el) * Math.cos(az),
      target.y + dist * Math.cos(el) * Math.sin(az),
      target.z + dist * Math.sin(el),
    );
    camera.lookAt(target);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    sun.position.copy(camera.position).add(new Vector3(0, 0, 120));
    sun.target.position.copy(target);
  }

  // A sample of the meshes' vertices, to centre the stage in a pane of any shape.
  scene.updateMatrixWorld(true);
  const samples = [];
  for (const p of Object.values(nodes)) {
    p.traverse((o) => {
      if (!o.isMesh) return;
      const pos = o.geometry.attributes.position;
      for (let i = 0; i < pos.count; i += 24) samples.push(new Vector3().fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld));
    });
  }

  /** Aim so the stage sits in the middle of the pane; if it is taller than the pane, keep its top in view. */
  function frameStage() {
    radius = 92;
    target.copy(home);
    for (let pass = 0; pass < 2; pass++) {
      place();
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const s of samples) {
        const q = s.clone().project(camera);
        x0 = Math.min(x0, q.x); x1 = Math.max(x1, q.x);
        y0 = Math.min(y0, q.y); y1 = Math.max(y1, q.y);
      }
      const dy = y1 - y0 <= 1.9 ? (y0 + y1) / 2 : y1 - 0.95;
      const dx = x1 - x0 <= 1.9 ? (x0 + x1) / 2 : 0;
      const half = dist * Math.tan((camera.fov * Math.PI) / 360);
      const up = new Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
      const right = new Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
      target.addScaledVector(up, dy * half).addScaledVector(right, dx * half * camera.aspect);
    }
    place();
  }

  let frame = 0;
  const render = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      renderer.render(scene, camera);
    });
  };

  let drag = null;
  canvas.addEventListener('pointerdown', (e) => {
    drag = { x: e.clientX, y: e.clientY, id: e.pointerId, touch: e.pointerType === 'touch' };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    az -= (e.clientX - drag.x) * 0.008;
    if (!drag.touch) el = Math.min(1.35, Math.max(-0.15, el + (e.clientY - drag.y) * 0.006));
    drag.x = e.clientX;
    drag.y = e.clientY;
    place();
    render();
  });
  const end = () => (drag = null);
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  let theme = colors;
  let last = null;
  let errors = null; // { g, g0, ref: { rod, ball } } once the stage's errors are known

  function setTheme(c) {
    theme = c;
    scene.background = new Color(c.panel);
    for (const [k, value] of Object.entries(c.parts)) material(k).color.set(value);
    material('optics').emissive.set(0x000000);
    tint();
    if (last) setPose(...last);
    render();
  }

  function resize(w, h) {
    width = Math.max(1, w);
    height = Math.max(1, h);
    renderer.setSize(width, height, false);
    frameStage();
    render();
  }

  const m4 = (rows, t) =>
    new Matrix4().set(
      rows[0][0], rows[0][1], rows[0][2], t[0],
      rows[1][0], rows[1][1], rows[1][2], t[1],
      rows[2][0], rows[2][1], rows[2][2], t[2],
      0, 0, 0, 1,
    );

  /** Horn matrices for horn turns a_i (rad, from the CAD pose) and the end-effector matrix for (P, Q). */
  function matrices(a, P, Q) {
    const horn = rig.horns.map((h, i) => {
      const p = new Vector3(...h.point);
      const R = new Matrix4().makeRotationAxis(new Vector3(...h.axis), -a[i]);
      return new Matrix4().makeTranslation(p.x, p.y, p.z).multiply(R).multiply(new Matrix4().makeTranslation(-p.x, -p.y, -p.z));
    });
    const ref = new Vector3(...rig.neutral_ee).add(O);
    const ee = m4(Q, [O.x + P[0], O.y + P[1], O.z + P[2]]).multiply(new Matrix4().makeTranslation(-ref.x, -ref.y, -ref.z));
    return { horn, ee };
  }

  /** Place every group; dA, dE (mm) move the ball centres. Returns the ball centres used. */
  function placeAll(mats, Q, dA, dE) {
    rig.horns.forEach((h, i) => nodes[key(h.group)].matrix.copy(mats.horn[i]));
    nodes[key('effector')].matrix.copy(mats.ee);
    const QM = new Matrix4().set(Q[0][0], Q[0][1], Q[0][2], 0, Q[1][0], Q[1][1], Q[1][2], 0, Q[2][0], Q[2][1], Q[2][2], 0, 0, 0, 0, 1);
    const ends = {};
    for (const rod of rig.rods) {
      const b0 = new Vector3(...rod.rotor_ball);
      const e0 = new Vector3(...rod.ee_ball);
      const b1 = b0.clone().applyMatrix4(mats.horn[rod.joint]).add(new Vector3(...dA[rod.joint][rod.k]));
      const e1 = e0.clone().applyMatrix4(mats.ee).add(new Vector3(...dE[rod.joint][rod.k]).applyMatrix4(QM));
      const d0 = e0.clone().sub(b0);
      const d1 = e1.clone().sub(b1);
      const s = d1.length() / d0.length();
      const u = d0.clone().normalize();
      const q = new Quaternion().setFromUnitVectors(u, d1.clone().normalize());
      // scale along the rod's own axis so it spans its two balls exactly
      const S = new Matrix4().set(
        1 + (s - 1) * u.x * u.x, (s - 1) * u.x * u.y, (s - 1) * u.x * u.z, 0,
        (s - 1) * u.y * u.x, 1 + (s - 1) * u.y * u.y, (s - 1) * u.y * u.z, 0,
        (s - 1) * u.z * u.x, (s - 1) * u.z * u.y, 1 + (s - 1) * u.z * u.z, 0,
        0, 0, 0, 1,
      );
      nodes[key(rod.group)].matrix
        .makeTranslation(b1.x, b1.y, b1.z)
        .multiply(new Matrix4().makeRotationFromQuaternion(q))
        .multiply(S)
        .multiply(new Matrix4().makeTranslation(-b0.x, -b0.y, -b0.z));
      ends[rod.group] = { rotor: b1, ee: e1 };
    }
    for (const p of Object.values(nodes)) p.matrixWorldNeedsUpdate = true;
    return ends;
  }

  const mixHex = (a, b, t) => new Color(a).lerp(new Color(b), Math.max(0, Math.min(1, t)));

  /** Colour the rods and ball seats by their errors (plain metal until they are known). */
  function tint() {
    for (const rod of rig.rods) {
      const m = rodMats[rod.group];
      if (!errors) {
        m.color.set(theme.parts.metal);
        continue;
      }
      const dL = errors.g.L[rod.joint][rod.k] - errors.g0.L[rod.joint][rod.k];
      m.color.copy(mixHex(theme.parts.metal, dL >= 0 ? theme.err : theme.missing, Math.abs(dL) / (3 * errors.ref.rod)));
    }
    for (const m of markers) {
      m.visible = !!errors;
      if (!errors) continue;
      const { rod, side } = m.userData;
      const d = side === 'rotor' ? errors.g.dA[rod.joint][rod.k] : errors.g.dE[rod.joint][rod.k];
      m.material.color.copy(mixHex(theme.parts.metal, theme.err, Math.hypot(...d) / (3 * errors.ref.ball)));
    }
  }

  /** The stage's part errors: g as built against the CAD g0; ref = { rod, ball } standard deviations (mm) that set the colour scale. */
  function setErrors(g, g0, ref) {
    errors = { g, g0, ref };
    tint();
    render();
  }

  /** Move to a pose: real = { theta, P, Q } of stage g (encoder angles, end-effector position and rotation). */
  function setPose(real, g) {
    last = [real, g];
    const a = real.theta.map((t, i) => t - g.theta0[i]);
    const ends = placeAll(matrices(a, real.P, real.Q), real.Q, g.dA, g.dE);
    for (const m of markers) m.position.copy(ends[m.userData.rod.group][m.userData.side]);
    render();
  }

  /** Light the exposure: the column glows. */
  function setExposing(on) {
    material('optics').emissive.set(on ? theme.uv : 0x000000);
    material('optics').emissiveIntensity = on ? 0.55 : 0;
    render();
  }

  setTheme(colors);
  return { setPose, setErrors, setExposing, setTheme, resize, render };
}
