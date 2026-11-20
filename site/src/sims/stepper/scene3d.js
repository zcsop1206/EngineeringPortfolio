// The stage in 3D: the chapter CAD's meshes (stepper.glb, one node per rigid
// group), moved by the kinematic model. Loaded only once the sim is near the
// screen; renders on demand, never in a loop of its own.
//
// Frames: the meshes are in the chapter frame (mm, z up, optical axis at
// x = y = 0); the model's base frame is that frame shifted by rig.base_origin.
// The CAD shows the neutral pose, so each group moves from there:
//   horn i     turns about its rotor axis by -(theta_i - theta0_i)
//   effector   X -> O + P + Q (X - O - P_ref), P_ref the firmware's neutral EE position
//   rod        from its two ball centres, each carried by its horn or the effector
import {
  CircleGeometry,
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
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MOVING = (name) => name !== 'frame';

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
  const pivot = (group) => nodes[PropertyBinding.sanitizeNodeName(group)];
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
      o.material = material(cls === 'printed' && MOVING(node.name) ? 'moving' : cls);
    });
  }

  // the exposure: a violet spot where the field lands, under the objective
  const O = new Vector3(...rig.base_origin);
  const spot = new Mesh(new CircleGeometry(2.2, 32), new MeshBasicMaterial({ transparent: true, opacity: 0.95 }));
  spot.position.set(0, 0, rig.chip_top + 0.05);
  spot.visible = false;
  scene.add(spot);

  // camera on a sphere about the stage; drag to turn
  const home = new Vector3(-26, -26, 104);
  const target = home.clone();
  const radius = 92;
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
  scene.traverse((o) => {
    if (!o.isMesh || o === spot) return;
    const p = o.geometry.attributes.position;
    for (let i = 0; i < p.count; i += 24) samples.push(new Vector3().fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld));
  });

  /** Aim so the stage sits in the middle of the pane; if it is taller than the pane, keep its top in view. */
  function frameStage() {
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

  function setTheme(c) {
    scene.background = new Color(c.panel);
    for (const [key, value] of Object.entries(c.parts)) material(key).color.set(value);
    spot.material.color.set(c.uv);
    material('optics').emissive.set(0x000000);
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

  /** Move every group to the pose { theta, P, Q } of a stage whose home angles are theta0. */
  function setPose({ theta, P, Q }, theta0) {
    const horn = rig.horns.map((h, i) => {
      const p = new Vector3(...h.point);
      const R = new Matrix4().makeRotationAxis(new Vector3(...h.axis), -(theta[i] - theta0[i]));
      return new Matrix4().makeTranslation(p.x, p.y, p.z).multiply(R).multiply(new Matrix4().makeTranslation(-p.x, -p.y, -p.z));
    });
    rig.horns.forEach((h, i) => pivot(h.group).matrix.copy(horn[i]));
    const ref = new Vector3(...rig.neutral_ee).add(O);
    const ee = m4(Q, [O.x + P[0], O.y + P[1], O.z + P[2]]).multiply(new Matrix4().makeTranslation(-ref.x, -ref.y, -ref.z));
    pivot('effector').matrix.copy(ee);
    for (const rod of rig.rods) {
      const b0 = new Vector3(...rod.rotor_ball);
      const e0 = new Vector3(...rod.ee_ball);
      const b1 = b0.clone().applyMatrix4(horn[rod.joint]);
      const e1 = e0.clone().applyMatrix4(ee);
      const q = new Quaternion().setFromUnitVectors(e0.clone().sub(b0).normalize(), e1.clone().sub(b1).normalize());
      pivot(rod.group).matrix
        .makeTranslation(b1.x, b1.y, b1.z)
        .multiply(new Matrix4().makeRotationFromQuaternion(q))
        .multiply(new Matrix4().makeTranslation(-b0.x, -b0.y, -b0.z));
    }
    for (const p of Object.values(nodes)) p.matrixWorldNeedsUpdate = true;
    render();
  }

  /** Light the exposure: the column glows and a spot shows on the chip. */
  function setExposing(on, uv) {
    spot.visible = on;
    material('optics').emissive.set(on ? uv : 0x000000);
    material('optics').emissiveIntensity = on ? 0.55 : 0;
    render();
  }

  setTheme(colors);
  return { setPose, setExposing, setTheme, resize, render };
}
