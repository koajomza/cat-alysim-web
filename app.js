
if (typeof THREE === 'undefined') {
  document.body.insertAdjacentHTML('beforeend', `
    <div style="position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:9999;max-width:520px;padding:22px 26px;border-radius:24px;background:rgba(8,12,20,.96);color:#fff;border:1px solid rgba(255,255,255,.14);box-shadow:0 30px 80px rgba(0,0,0,.45);font-family:system-ui,sans-serif;text-align:center">
      <b style="display:block;font-size:22px;margin-bottom:8px;">three.js ยังไม่โหลด</b>
      <span style="color:#d1d5db;line-height:1.7">เช็กเน็ต หรือเปิดผ่าน local server จะชัวร์สุด<br><code style="display:inline-block;margin-top:8px;padding:8px 10px;border-radius:10px;background:#111827;color:#67e8f9">python -m http.server 8000</code></span>
    </div>
  `);
  throw new Error('THREE not loaded');
}

const canvas = document.getElementById('three-canvas');
const menuNodes = [...document.querySelectorAll('.menu-node')];
const gestureLabel = document.getElementById('gestureLabel');
const menuLayout = document.getElementById('menuLayout');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const isMobileSeparate = document.body.classList.contains('mobile-separate');
const isSingleLanding = document.body.classList.contains('single-landing');
const isLandingHome = false;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x030611, 0.018);

const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 2.15, 10.8);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const clock = new THREE.Clock();
const pointer = new THREE.Vector2(0, 0);
const smoothPointer = new THREE.Vector2(0, 0);

let activeNode = null;
let activeGesture = null;
let gestureBoost = 0;
let lastPointerMove = performance.now();
let autoDemoGesture = null;
let autoDemoFocus = new THREE.Vector2(0, 0);

// ---------- helpers ----------
function mesh(geo, mat, pos = [0,0,0], rot = [0,0,0], scale = [1,1,1]) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos);
  m.rotation.set(...rot);
  m.scale.set(...scale);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}
function group(pos = [0,0,0]) {
  const g = new THREE.Group();
  g.position.set(...pos);
  return g;
}
function makeCapsule(length, radius, mat) {
  const g = new THREE.Group();
  const cyl = mesh(new THREE.CylinderGeometry(radius, radius, length, 28), mat);
  const s1 = mesh(new THREE.SphereGeometry(radius, 22, 14), mat, [0, length/2, 0]);
  const s2 = mesh(new THREE.SphereGeometry(radius, 22, 14), mat, [0, -length/2, 0]);
  g.add(cyl, s1, s2);
  return g;
}
function damp(v, t, l, dt) { return THREE.MathUtils.damp(v, t, l, dt); }
function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

// ---------- materials ----------
const M = {
  cream: new THREE.MeshStandardMaterial({ color: 0xf6eee5, roughness: 0.34, metalness: 0.10 }),
  cream2: new THREE.MeshStandardMaterial({ color: 0xdfc2a1, roughness: 0.40, metalness: 0.08 }),
  wine: new THREE.MeshStandardMaterial({ color: 0x7a0f2f, roughness: 0.28, metalness: 0.22 }),
  wine2: new THREE.MeshStandardMaterial({ color: 0xa61f49, roughness: 0.24, metalness: 0.24 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x101722, roughness: 0.42, metalness: 0.42 }),
  black: new THREE.MeshStandardMaterial({ color: 0x080b10, roughness: 0.30, metalness: 0.54 }),
  gold: new THREE.MeshStandardMaterial({ color: 0xd9b27a, roughness: 0.22, metalness: 0.68 }),
  silver: new THREE.MeshStandardMaterial({ color: 0xdde2eb, roughness: 0.22, metalness: 0.85 }),
  face: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.14, metalness: 0.02 }),
  eye: new THREE.MeshStandardMaterial({ color: 0x5a0820, roughness: 0.16, metalness: 0.08 }),
  blush: new THREE.MeshStandardMaterial({ color: 0xff9db8, roughness: 0.60, transparent: true, opacity: 0.8 }),
  screen: new THREE.MeshStandardMaterial({ color: 0x08111d, roughness: 0.22, metalness: 0.16, emissive: 0x0b3350, emissiveIntensity: 0.50 }),
  cyan: new THREE.MeshStandardMaterial({ color: 0x67e8f9, roughness: 0.16, metalness: 0.05, emissive: 0x0e7490, emissiveIntensity: 0.62 }),
  blue: new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.16, metalness: 0.05, emissive: 0x1d4ed8, emissiveIntensity: 0.52 }),
};

// ---------- lights ----------
scene.add(new THREE.HemisphereLight(0xdbeafe, 0x10131c, 1.45));

const key = new THREE.DirectionalLight(0xffffff, 2.7);
key.position.set(5, 8, 6);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.camera.near = 1;
key.shadow.camera.far = 30;
key.shadow.camera.left = -8;
key.shadow.camera.right = 8;
key.shadow.camera.top = 8;
key.shadow.camera.bottom = -8;
scene.add(key);

const rim = new THREE.DirectionalLight(0x67e8f9, 1.4);
rim.position.set(-5, 3.5, -3);
scene.add(rim);

const fill = new THREE.PointLight(0xa61f49, 1.25, 10);
fill.position.set(3.2, 2.4, 3.4);
scene.add(fill);

const floorGlow = new THREE.PointLight(0x67e8f9, 1.15, 8);
floorGlow.position.set(0, -1.2, 2.1);
scene.add(floorGlow);

// ---------- floor ----------
const floor = mesh(
  new THREE.CircleGeometry(4.1, 80),
  new THREE.MeshStandardMaterial({
    color: 0x07111b,
    roughness: 0.62,
    metalness: 0.05,
    transparent: true,
    opacity: 0.72
  }),
  [0, -2.25, 0],
  [-Math.PI / 2, 0, 0]
);
scene.add(floor);

const floorRing = mesh(
  new THREE.TorusGeometry(2.15, 0.016, 8, 180),
  new THREE.MeshBasicMaterial({ color: 0xa9e5ff, transparent: true, opacity: 0.36 }),
  [0, -2.21, 0],
  [Math.PI / 2, 0, 0]
);
floorRing.castShadow = false;
floorRing.receiveShadow = false;
scene.add(floorRing);

// ---------- robot rig ----------
let robot, rootPivot, pelvisPivot, torsoPivot, neckPivot, headPivot, capPivot, antennaPivot;
let leftEyeBall, rightEyeBall, leftPupil, rightPupil, mouth;
let scanSweep, scanSweepMat;
let leftArm, rightArm, leftLeg, rightLeg;
let orbitGroup;
let glbLoaded = false;

function buildProceduralRobot() {
  robot = group([0, 0.58, 0]); // v11: centered no-arm robot + cleaner side menu layout
  scene.add(robot);

  rootPivot = group([0, 0, 0]); robot.add(rootPivot);
  pelvisPivot = group([0, -0.62, 0]); rootPivot.add(pelvisPivot);
  torsoPivot = group([0, 0.10, 0]); pelvisPivot.add(torsoPivot);
  neckPivot = group([0, 1.44, 0]); torsoPivot.add(neckPivot);
  headPivot = group([0, 0.16, 0]); neckPivot.add(headPivot);

  // torso
  torsoPivot.add(mesh(new THREE.BoxGeometry(1.72, 1.52, 0.92, 6, 6, 6), M.cream, [0, 0.02, 0]));
  torsoPivot.add(mesh(new THREE.SphereGeometry(0.86, 32, 22), M.cream, [0, -0.04, 0.02], [0,0,0], [1.0, 0.88, 0.60]));
  torsoPivot.add(mesh(new THREE.BoxGeometry(1.02, 0.36, 0.06), M.screen, [0, 0.33, 0.50]));
  torsoPivot.add(mesh(new THREE.BoxGeometry(0.48, 0.035, 0.012), M.cyan, [-0.02, 0.40, 0.535]));
  torsoPivot.add(mesh(new THREE.BoxGeometry(0.34, 0.035, 0.012), M.blue, [-0.09, 0.30, 0.535]));
  torsoPivot.add(mesh(new THREE.BoxGeometry(0.56, 0.035, 0.012), M.cyan, [0.05, 0.20, 0.535]));
  torsoPivot.add(mesh(new THREE.BoxGeometry(0.86, 0.24, 0.055), M.wine, [0, -0.05, 0.57]));

  // fake police text badge as separate light plate
  const badgeText = createTextSprite('POLICE');
  badgeText.position.set(0, -0.05, 0.60);
  torsoPivot.add(badgeText);

  torsoPivot.add(mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.05, 5), M.wine, [0, -0.46, 0.54], [Math.PI/2, 0, Math.PI/5]));
  const star = createStarSprite('#f3d8a2');
  star.scale.set(0.15,0.15,0.15);
  star.position.set(0, -0.46, 0.58);
  torsoPivot.add(star);

  // v11: ตัดสายแดง / ลูปประคำออกให้โล่งขึ้น

  // pelvis
  pelvisPivot.add(mesh(new THREE.SphereGeometry(0.68, 32, 18), M.wine, [0, -0.74, 0], [0,0,0], [1.0, 0.42, 0.56]));

  // neck
  neckPivot.add(mesh(new THREE.CylinderGeometry(0.23, 0.26, 0.32, 24), M.black, [0, 0, 0]));

  // head
  headPivot.add(mesh(new THREE.BoxGeometry(2.10, 1.58, 0.98, 8, 8, 8), M.cream, [0, 0.06, 0]));
  headPivot.add(mesh(new THREE.BoxGeometry(1.84, 1.12, 0.08), M.wine, [0, 0.00, 0.54]));
  headPivot.add(mesh(new THREE.BoxGeometry(1.60, 0.88, 0.08), M.face, [0, 0.00, 0.60]));

  // face scan sweep: ใช้แทน gesture แขน ให้หน้าจอดูเหมือนกำลัง track / scan
  scanSweepMat = new THREE.MeshBasicMaterial({
    color: 0x67e8f9,
    transparent: true,
    opacity: 0,
    depthWrite: false
  });
  scanSweep = mesh(new THREE.BoxGeometry(0.045, 0.82, 0.014), scanSweepMat, [-0.72, 0.00, 0.675]);
  scanSweep.castShadow = false;
  scanSweep.receiveShadow = false;
  headPivot.add(scanSweep);

  const eyeL = group([-0.38, 0.12, 0.67]);
  const eyeR = group([0.38, 0.12, 0.67]);
  headPivot.add(eyeL, eyeR);

  leftEyeBall = mesh(new THREE.SphereGeometry(0.16, 28, 18), M.eye, [0,0,0], [0,0,0], [1.05,1.18,0.20]);
  rightEyeBall = mesh(new THREE.SphereGeometry(0.16, 28, 18), M.eye, [0,0,0], [0,0,0], [1.05,1.18,0.20]);
  eyeL.add(leftEyeBall); eyeR.add(rightEyeBall);

  leftPupil = group([0,0,0.04]);
  rightPupil = group([0,0,0.04]);
  eyeL.add(leftPupil); eyeR.add(rightPupil);

  const hiMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  eyeL.add(mesh(new THREE.SphereGeometry(0.04, 16, 8), hiMat, [-0.05, 0.06, 0.035], [0,0,0], [1,1,0.2]));
  eyeL.add(mesh(new THREE.SphereGeometry(0.028, 16, 8), hiMat, [0.06, -0.06, 0.035], [0,0,0], [1,1,0.2]));
  eyeR.add(mesh(new THREE.SphereGeometry(0.04, 16, 8), hiMat, [-0.05, 0.06, 0.035], [0,0,0], [1,1,0.2]));
  eyeR.add(mesh(new THREE.SphereGeometry(0.028, 16, 8), hiMat, [0.06, -0.06, 0.035], [0,0,0], [1,1,0.2]));

  mouth = mesh(new THREE.TorusGeometry(0.16, 0.018, 12, 32, Math.PI), M.eye, [0, -0.28, 0.68], [0, 0, Math.PI]);
  mouth.scale.y = 0.52;
  headPivot.add(mouth);
  headPivot.add(mesh(new THREE.SphereGeometry(0.10, 20, 12), M.blush, [-0.64, -0.22, 0.67], [0,0,0], [1.45,0.75,0.2]));
  headPivot.add(mesh(new THREE.SphereGeometry(0.10, 20, 12), M.blush, [0.64, -0.22, 0.67], [0,0,0], [1.45,0.75,0.2]));

  // cap
  capPivot = group([0, 0.88, 0.05]); headPivot.add(capPivot);
  capPivot.add(mesh(new THREE.SphereGeometry(0.98, 36, 18), M.wine, [0, -0.02, 0], [0,0,0], [1.12, 0.42, 0.74]));
  capPivot.add(mesh(new THREE.SphereGeometry(0.98, 36, 18), M.gold, [0, 0.12, 0], [0,0,0], [1.16, 0.14, 0.78]));
  capPivot.add(mesh(new THREE.SphereGeometry(0.82, 32, 14), M.black, [0, -0.34, 0.48], [0,0,0], [1.22, 0.22, 0.48]));
  capPivot.add(mesh(new THREE.SphereGeometry(0.23, 24, 16), M.silver, [0, 0.10, 0.73], [0,0,0], [1.0, 1.15, 0.20]));
  const badgeStar = createStarSprite('#ffffff'); badgeStar.scale.set(0.17,0.17,0.17); badgeStar.position.set(0,0.10,0.80); capPivot.add(badgeStar);
  capPivot.add(mesh(new THREE.SphereGeometry(0.08, 16, 10), M.gold, [-0.74, -0.28, 0.44]));
  capPivot.add(mesh(new THREE.SphereGeometry(0.08, 16, 10), M.gold, [0.74, -0.28, 0.44]));

  // antenna
  antennaPivot = group([0, 1.20, 0]); headPivot.add(antennaPivot);
  const stick = makeCapsule(0.38, 0.025, M.silver); stick.position.y = 0.15; antennaPivot.add(stick);
  antennaPivot.add(mesh(new THREE.SphereGeometry(0.09, 20, 12), M.wine2, [0, 0.40, 0]));

  leftArm = createArm(-1);
  rightArm = createArm(1);
  leftLeg = createLeg(-1);
  rightLeg = createLeg(1);

  // base pose: แขนไขว้หลังแบบนิ่ง ๆ
  leftArm.shoulder.rotation.set(1.18, -0.16, 0.52);
  leftArm.upperArmPivot.rotation.z = 0.24;
  leftArm.foreArmPivot.rotation.set(0.16, 0.10, -1.02);
  leftArm.wrist.rotation.z = -0.16;

  rightArm.shoulder.rotation.set(1.18, 0.16, -0.52);
  rightArm.upperArmPivot.rotation.z = -0.24;
  rightArm.foreArmPivot.rotation.set(0.16, -0.10, 1.02);
  rightArm.wrist.rotation.z = 0.16;
}

function createArm(side = 1) {
  const shoulder = group([side * 0.98, 0.42, -0.12]); torsoPivot.add(shoulder);
  const upperArmPivot = group([0,0,0]); shoulder.add(upperArmPivot);
  const upperArm = makeCapsule(0.68, 0.13, M.cream); upperArm.position.y = -0.34; upperArmPivot.add(upperArm);
  const elbow = group([0, -0.72, 0]); upperArmPivot.add(elbow); elbow.add(mesh(new THREE.SphereGeometry(0.16, 20, 12), M.dark));
  const foreArmPivot = group([0, -0.04, 0]); elbow.add(foreArmPivot);
  const foreArm = makeCapsule(0.58, 0.14, M.cream); foreArm.position.y = -0.30; foreArmPivot.add(foreArm);
  foreArmPivot.add(mesh(new THREE.BoxGeometry(0.30, 0.14, 0.26), M.wine, [0, -0.28, 0.18]));
  foreArmPivot.add(mesh(new THREE.SphereGeometry(0.05, 16, 10), M.gold, [0.08 * side, -0.28, 0.32]));
  const wrist = group([0, -0.60, 0]); foreArmPivot.add(wrist);
  wrist.add(mesh(new THREE.SphereGeometry(0.18, 18, 12), M.dark, [0, -0.02, 0], [0,0,0], [1.1, 0.82, 0.94]));
  const fingers = [];
  for (let i = -1; i <= 1; i++) {
    const fingerPivot = group([i * 0.045, -0.10, 0.03]);
    const finger = makeCapsule(0.16, 0.024, M.cream);
    finger.position.y = -0.06;
    fingerPivot.add(finger);
    wrist.add(fingerPivot);
    fingers.push(fingerPivot);
  }
  return { shoulder, upperArmPivot, elbow, foreArmPivot, wrist, fingers };
}

function createLeg(side = 1) {
  const hip = group([side * 0.48, -0.86, 0]); pelvisPivot.add(hip);
  const thighPivot = group([0,0,0]); hip.add(thighPivot);
  const thigh = makeCapsule(0.68, 0.16, M.cream); thigh.position.y = -0.34; thighPivot.add(thigh);
  const knee = group([0, -0.72, 0]); thighPivot.add(knee); knee.add(mesh(new THREE.SphereGeometry(0.16, 20, 12), M.wine2));
  const shinPivot = group([0, -0.05, 0]); knee.add(shinPivot);
  const shin = makeCapsule(0.56, 0.15, M.cream); shin.position.y = -0.28; shinPivot.add(shin);
  const ankle = group([0, -0.60, 0]); shinPivot.add(ankle);
  ankle.add(mesh(new THREE.BoxGeometry(0.54, 0.20, 0.42), M.wine, [0, -0.06, 0.08]));
  ankle.add(mesh(new THREE.BoxGeometry(0.28, 0.10, 0.20), M.cream2, [0, 0.00, 0.26]));
  return { hip, thighPivot, knee, shinPivot, ankle };
}

function createStarSprite(color) {
  const cvs = document.createElement('canvas');
  cvs.width = cvs.height = 256;
  const ctx = cvs.getContext('2d');
  ctx.fillStyle = color;
  ctx.font = '900 180px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', 128, 138);
  const tex = new THREE.CanvasTexture(cvs);
  tex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
}

function createTextSprite(text) {
  const cvs = document.createElement('canvas');
  cvs.width = 512; cvs.height = 160;
  const ctx = cvs.getContext('2d');
  const x = 8, y = 8, w = 512 - 16, h = 160 - 16, r = 36;
  ctx.fillStyle = '#7a0f2f';
  ctx.strokeStyle = 'rgba(255,255,255,.22)';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = '900 74px Arial';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 84);
  const tex = new THREE.CanvasTexture(cvs);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
  sprite.scale.set(0.92, 0.28, 1);
  return sprite;
}

function buildOrbits() {
  // v25: remove all decorative orbit/ring lines around the robot
  orbitGroup = null;
}

// try GLB first (optional)
function tryLoadGLB() {
  return new Promise((resolve) => {
    if (!THREE.GLTFLoader) { resolve(false); return; }
    const loader = new THREE.GLTFLoader();
    loader.load('./robot.glb', (gltf) => {
      glbLoaded = true;
      robot = gltf.scene;
      robot.traverse(obj => {
        if (obj.isMesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });
      robot.position.set(0, -0.72, 0);
      robot.scale.setScalar(1.20);
      scene.add(robot);
      resolve(true);
    }, undefined, () => resolve(false));
  });
}

// sparkles
const sparkles = group();
scene.add(sparkles);
for (let i = 0; i < 18; i++) {
  const color = i % 3 === 0 ? 0xf2c5d5 : (i % 3 === 1 ? 0xb9ecff : 0x9d4edd);
  const geo = i % 2 === 0 ? new THREE.OctahedronGeometry(0.05, 0) : new THREE.BoxGeometry(0.08, 0.08, 0.08);
  const sp = mesh(geo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85 }));
  sp.castShadow = false; sp.receiveShadow = false;
  const angle = Math.random() * Math.PI * 2;
  const radius = 2.1 + Math.random() * 2.2;
  sp.position.set(Math.cos(angle) * radius, 0.2 + Math.random() * 3.2, Math.sin(angle) * radius - 0.2);
  sp.userData.phase = Math.random() * Math.PI * 2;
  sparkles.add(sp);
}

// visual helpers สำหรับ face-tracking beam ไปยังเมนู
const gestureGroup = group([0, 0, 0]);
scene.add(gestureGroup);

const pointerBeamMat = new THREE.MeshBasicMaterial({
  color: 0x67e8f9,
  transparent: true,
  opacity: 0,
  depthWrite: false
});
const pointerBeam = mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.0, 12), pointerBeamMat);
pointerBeam.castShadow = false;
pointerBeam.receiveShadow = false;
pointerBeam.rotation.z = Math.PI / 2;
gestureGroup.add(pointerBeam);

const pointerDotMat = new THREE.MeshBasicMaterial({
  color: 0x67e8f9,
  transparent: true,
  opacity: 0,
  depthWrite: false
});
const pointerDot = mesh(new THREE.SphereGeometry(0.07, 18, 10), pointerDotMat);
pointerDot.castShadow = false;
pointerDot.receiveShadow = false;
gestureGroup.add(pointerDot);

// v7: overlay arms removed — ใช้แขนเดิมของ rig เท่านั้น



// ---------- interaction ----------
function setPointer(clientX, clientY) {
  pointer.x = (clientX / innerWidth) * 2 - 1;
  pointer.y = -((clientY / innerHeight) * 2 - 1);
  lastPointerMove = performance.now();
  autoDemoGesture = null;
}
addEventListener('mousemove', e => setPointer(e.clientX, e.clientY));
addEventListener('touchmove', e => {
  const t = e.touches[0];
  if (t) setPointer(t.clientX, t.clientY);
}, { passive: true });

function activateNode(node) {
  if (!node) return;
  activeNode = node;
  activeGesture = node.dataset.gesture;
  menuNodes.forEach(n => n.classList.remove('active'));
  node.classList.add('active');
}

function clearActiveNode() {
  menuNodes.forEach(n => n.classList.remove('active'));
  activeNode = null;
  activeGesture = null;
}

function syncMobileMenuButton() {
  if (!mobileMenuBtn || !menuLayout) return;
  const collapsed = menuLayout.classList.contains('collapsed');
  mobileMenuBtn.setAttribute('aria-expanded', String(!collapsed));
}

if (mobileMenuBtn && menuLayout) {
  mobileMenuBtn.addEventListener('click', () => {
    menuLayout.classList.toggle('collapsed');
    syncMobileMenuButton();
  });
  syncMobileMenuButton();
}

window.addEventListener('click', (e) => {
  const target = e.target;
  if (!target.closest('.menu-node') && !target.closest('#mobileMenuBtn') && innerWidth <= 780) {
    clearActiveNode();
  }
});

menuNodes.forEach(node => {
  node.addEventListener('mouseenter', () => activateNode(node));
  node.addEventListener('mouseleave', () => {
    setTimeout(() => {
      if (!activeNode || activeNode === node) clearActiveNode();
    }, 120);
  });
  node.addEventListener('click', (e) => {
    e.preventDefault();
    activateNode(node);
  });
  node.addEventListener('touchstart', () => activateNode(node), { passive: true });
});

// v10: ไม่ต้อง hover เป๊ะ ๆ แค่เมาส์เข้าใกล้เมนู ก็ให้หน้าหันไปมองเมนู
window.addEventListener('mousemove', (e) => {
  let nearest = null;
  let best = Infinity;
  menuNodes.forEach(node => {
    const r = node.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const d = Math.hypot(e.clientX - cx, e.clientY - cy);
    if (d < best) {
      best = d;
      nearest = node;
    }
  });
  if (best < 170) activateNode(nearest);
  else if (best > 235) clearActiveNode();
});

function nodeFocusVector(node) {
  const r = node.getBoundingClientRect();
  return new THREE.Vector2(
    ((r.left + r.width / 2) / innerWidth) * 2 - 1,
    -(((r.top + r.height / 2) / innerHeight) * 2 - 1)
  );
}

function targetFromFocus(focus) {
  // แปลงตำแหน่งบนจอเป็น target plane ด้านหน้าหุ่น
  // x = ซ้าย/ขวา, y = สูง/ต่ำ, z = ด้านหน้า
  return new THREE.Vector3(
    clamp(focus.x * 2.65, -2.70, 2.70),
    clamp(0.88 + focus.y * 1.55, -0.12, 2.28),
    0.68
  );
}

function chooseArmSide(target) {
  // ถ้าเป้าอยู่กลาง ให้ใช้แขนขวาเป็น default
  return target.x < -0.12 ? -1 : 1;
}

function solvePointArm(arm, side, target, strength, dt) {
  if (!arm || strength <= 0.01) return;

  const sx = side * 1.12;
  const sy = 0.42;

  let dx = target.x - sx;
  let dy = target.y - sy;

  // จำกัดระยะให้แขนไม่หักเหมือนตุ๊กตาโดนเด็กบิด
  const dist = Math.max(0.45, Math.min(1.42, Math.hypot(dx, dy)));
  const angle = Math.atan2(dy, dx);

  // upper arm ตอน rotation.z = 0 คือชี้ลงแกน -Y
  // ดังนั้นถ้าจะให้ชี้ไป angle ต้อง + PI/2
  const shoulderZ = angle + Math.PI / 2;

  // Bend เล็กน้อยให้ดูไม่แข็งเกิน แต่ยังชี้ตรง
  const bend = (1 - Math.min(dist / 1.42, 1)) * 0.42;
  const foreZ = side * -bend * 0.55;

  arm.shoulder.rotation.z = damp(arm.shoulder.rotation.z, shoulderZ, 10.5, dt);
  arm.upperArmPivot.rotation.z = damp(arm.upperArmPivot.rotation.z, 0, 10.5, dt);
  arm.foreArmPivot.rotation.z = damp(arm.foreArmPivot.rotation.z, foreZ, 10.5, dt);
  arm.wrist.rotation.z = damp(arm.wrist.rotation.z, -foreZ * 0.4, 10.5, dt);

  // กางออกมาหน้ากล้องนิดนึง เพื่อให้ silhouette อ่านออก
  arm.shoulder.rotation.y = damp(arm.shoulder.rotation.y, -side * 0.30, 8.0, dt);
  arm.foreArmPivot.rotation.y = damp(arm.foreArmPivot.rotation.y, -side * 0.12, 8.0, dt);

  // นิ้วชี้: กลางยื่นกว่า นิ้วอื่นพับ
  arm.fingers.forEach((f, i) => {
    const targetZ = i === 1 ? 0.02 * side : 0.48 * side;
    f.rotation.z = damp(f.rotation.z, targetZ, 10.0, dt);
  });
}

function updateDynamicBeam(start, end, opacity, dt, labelText, labelSub) {
  if (typeof pointerBeam === 'undefined' || typeof pointerDot === 'undefined') return;

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.max(0.3, Math.hypot(dx, dy));
  const angle = Math.atan2(dy, dx);

  pointerBeamMat.opacity = damp(pointerBeamMat.opacity, opacity * 0.70, 8.0, dt);
  pointerDotMat.opacity = damp(pointerDotMat.opacity, opacity, 8.0, dt);

  pointerBeam.scale.set(1, len, 1);
  pointerBeam.position.set((start.x + end.x) / 2, (start.y + end.y) / 2, 0.72);
  pointerBeam.rotation.set(0, 0, angle - Math.PI / 2);

  pointerDot.position.set(end.x, end.y, 0.72);
  pointerDot.scale.setScalar(1 + Math.sin(clock.elapsedTime * 8) * 0.12);

  if (gestureLabel) {
    gestureLabel.classList.toggle('show', opacity > 0.1);
    gestureLabel.style.setProperty('--gx', `${end.x * 112}px`);
    gestureLabel.style.setProperty('--gy', `${-end.y * 18 + 24}px`);
    gestureLabel.querySelector('strong').textContent = labelText || 'POINT';
    gestureLabel.querySelector('span').textContent = labelSub || 'ชี้เมนู';
  }
}


function resize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);

  if (isSingleLanding) {
    if (innerWidth <= 480) {
      camera.position.set(0, 2.22, 12.2);
      if (robot) robot.scale.setScalar(glbLoaded ? 0.95 : 0.74);
      if (orbitGroup) orbitGroup.scale.setScalar(0.82);
    } else if (innerWidth <= 820) {
      camera.position.set(0, 2.15, 11.2);
      if (robot) robot.scale.setScalar(glbLoaded ? 1.05 : 0.84);
      if (orbitGroup) orbitGroup.scale.setScalar(0.90);
    } else {
      camera.position.set(0, 2.12, 10.9);
      if (robot) robot.scale.setScalar(glbLoaded ? 1.18 : 0.95);
      if (orbitGroup) orbitGroup.scale.setScalar(1.02);
    }
    if (menuLayout) menuLayout.classList.remove('collapsed');
    syncMobileMenuButton();
    return;
  }

  if (isMobileSeparate) {
    if (innerWidth <= 390) {
      camera.position.set(0, 2.22, 12.6);
      if (robot) robot.scale.setScalar(glbLoaded ? 1.08 : 0.78);
      if (orbitGroup) orbitGroup.scale.setScalar(0.74);
    } else if (innerWidth <= 480) {
      camera.position.set(0, 2.18, 11.9);
      if (robot) robot.scale.setScalar(glbLoaded ? 1.12 : 0.82);
      if (orbitGroup) orbitGroup.scale.setScalar(0.78);
    } else {
      camera.position.set(0, 2.12, 11.2);
      if (robot) robot.scale.setScalar(glbLoaded ? 1.18 : 0.86);
      if (orbitGroup) orbitGroup.scale.setScalar(0.82);
    }
    if (menuLayout) menuLayout.classList.remove('collapsed');
    syncMobileMenuButton();
    return;
  }

  if (innerWidth <= 400) {
    camera.position.set(0, 2.18, 11.9);
    if (robot) robot.scale.setScalar(glbLoaded ? 1.12 : 0.84);
    if (orbitGroup) orbitGroup.scale.setScalar(0.80);
    if (menuLayout) menuLayout.classList.remove('collapsed');
  } else if (innerWidth <= 540) {
    camera.position.set(0, 2.12, 11.1);
    if (robot) robot.scale.setScalar(glbLoaded ? 1.18 : 0.88);
    if (orbitGroup) orbitGroup.scale.setScalar(0.84);
    if (menuLayout) menuLayout.classList.remove('collapsed');
  } else if (innerWidth <= 780) {
    camera.position.set(0, 2.06, 10.2);
    if (robot) robot.scale.setScalar(glbLoaded ? 1.26 : 0.96);
    if (orbitGroup) orbitGroup.scale.setScalar(0.90);
    if (menuLayout) menuLayout.classList.remove('collapsed');
  } else if (innerWidth < 980) {
    camera.position.set(0, 2.0, 9.7);
    if (robot) robot.scale.setScalar(glbLoaded ? 1.40 : 1.05);
    if (orbitGroup) orbitGroup.scale.setScalar(0.96);
    if (menuLayout) menuLayout.classList.remove('collapsed');
  } else {
    camera.position.set(0, 2.15, 10.8);
    if (robot) robot.scale.setScalar(glbLoaded ? 1.5 : 1.12);
    if (orbitGroup) orbitGroup.scale.setScalar(1);
    if (menuLayout) menuLayout.classList.remove('collapsed');
  }

  syncMobileMenuButton();
}
addEventListener('resize', resize);

// ---------- init ----------
(async function init() {
  // ใช้ procedural robot เป็นตัวหลักก่อน: v17 single landing: robot center + bottom expandable buttons
  // ถ้าอยากทดสอบ static robot.glb ให้เติม ?glb=1 หลัง URL
  const useGlb = new URLSearchParams(location.search).get('glb') === '1';
  const loaded = useGlb ? await tryLoadGLB() : false;
  if (!loaded) buildProceduralRobot();
  buildOrbits();
  resize();
  animate();
})();

// ---------- animation ----------
let blinkClock = 0;
let nextBlink = 1.4 + Math.random() * 2.6;
let blinkProgress = 0;

const st = {
  rootY: 0,
  rootRotY: 0,
  headY: 0,
  headX: 0,
  torsoY: 0,
  torsoX: 0,
  pelvisY: 0,
  eyeX: 0,
  eyeY: 0
};

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.033);
  const t = clock.elapsedTime;

  smoothPointer.x = damp(smoothPointer.x, pointer.x, 4.5, dt);
  smoothPointer.y = damp(smoothPointer.y, pointer.y, 4.5, dt);

  // v10: ไม่มีแขนแล้ว — idle ให้หน้าสแกนซ้าย/ขวา, hover ให้หันไปมองเมนู
  const idleTooLong = performance.now() - lastPointerMove > 950 && !activeNode;
  if (idleTooLong) {
    autoDemoGesture = null;
    autoDemoFocus.set(Math.sin(t * 0.72) * 0.72, Math.sin(t * 0.47) * 0.24);
  }

  const liveGesture = activeNode ? 'look-node' : null;
  const focus = activeNode ? nodeFocusVector(activeNode) : (idleTooLong ? autoDemoFocus : smoothPointer);
  gestureBoost = damp(gestureBoost, activeNode ? 1 : (idleTooLong ? 0.38 : 0), 3.2, dt);

  const idle = Math.sin(t * 1.8);
  const idle2 = Math.sin(t * 1.2 + 1.1);
  const idle3 = Math.sin(t * 2.6 + 0.7);

  // animate orbits
  if (orbitGroup?.userData?.orbits) {
    orbitGroup.userData.orbits.forEach((o, idx) => {
      o.ring.rotation.z += o.s * dt;
      const a = t * o.s + idx * 1.25;
      const p = new THREE.Vector3(Math.cos(a) * o.r, 0, Math.sin(a) * o.r);
      p.applyEuler(new THREE.Euler(o.x, o.y, 0));
      o.dot.position.copy(p);
    });
  }
  floorRing.rotation.z += dt * 0.12;
  floorRing.scale.setScalar(1 + Math.sin(t * 1.5) * 0.02);

  sparkles.children.forEach((s, i) => {
    s.rotation.x += dt * (0.8 + i * 0.03);
    s.rotation.y += dt * (0.6 + i * 0.02);
    const pulse = 0.78 + Math.sin(t * 2.0 + s.userData.phase) * 0.26;
    s.scale.setScalar(pulse);
  });

  fill.intensity = 1.2 + Math.cos(t * 1.2) * 0.18;
  floorGlow.intensity = 1.05 + Math.sin(t * 1.4) * 0.16;

  // if glb loaded, simple whole-model animation only
  if (glbLoaded) {
    robot.position.y = damp(robot.position.y, -0.65 + idle * 0.05, 4.0, dt);
    robot.rotation.y = damp(robot.rotation.y, focus.x * 0.10, 3.5, dt);
    robot.rotation.x = damp(robot.rotation.x, -focus.y * 0.08, 3.5, dt);
    renderer.render(scene, camera);
    return;
  }

  // procedural animation
  st.rootY = damp(st.rootY, idle * 0.05, 4.0, dt);
  st.rootRotY = damp(st.rootRotY, focus.x * 0.035, 3.0, dt);
  st.headY = damp(st.headY, focus.x * 0.70, 5.3, dt);
  st.headX = damp(st.headX, -focus.y * 0.34 + idle2 * 0.03, 5.0, dt);
  st.torsoY = damp(st.torsoY, focus.x * 0.045, 3.8, dt);
  st.torsoX = damp(st.torsoX, -focus.y * 0.06 + idle * 0.02, 3.4, dt);
  st.pelvisY = damp(st.pelvisY, focus.x * 0.01, 3.0, dt);
  st.eyeX = damp(st.eyeX, clamp(focus.x * 0.08, -0.06, 0.06), 7.4, dt);
  st.eyeY = damp(st.eyeY, clamp(focus.y * 0.05, -0.04, 0.04), 7.4, dt);

  const baseRobotY = isMobileSeparate ? 0.82 : 0.58;
  robot.position.y = baseRobotY + st.rootY;
  robot.rotation.y = st.rootRotY;
  rootPivot.rotation.z = Math.sin(t * 1.1) * 0.015;
  pelvisPivot.rotation.y = st.pelvisY;
  torsoPivot.rotation.y = st.torsoY;
  torsoPivot.rotation.x = st.torsoX;
  headPivot.rotation.y = st.headY;
  headPivot.rotation.x = st.headX;

  leftPupil.position.x = st.eyeX;
  rightPupil.position.x = st.eyeX;
  leftPupil.position.y = st.eyeY;
  rightPupil.position.y = st.eyeY;

  // blink
  blinkClock += dt;
  if (blinkClock > nextBlink) {
    blinkProgress += dt * 12;
    if (blinkProgress >= 1) {
      blinkProgress = 0;
      blinkClock = 0;
      nextBlink = 1.6 + Math.random() * 2.8;
    }
  }
  const blink = blinkProgress > 0 ? Math.sin(blinkProgress * Math.PI) : 0;
  const eyeScaleY = Math.max(0.10, 1 - blink * 0.90);
  leftEyeBall.scale.y = eyeScaleY * 1.18;
  rightEyeBall.scale.y = eyeScaleY * 1.18;

  // antenna and cap secondary
  antennaPivot.rotation.z = idle * 0.05 + focus.x * -0.06;
  antennaPivot.rotation.x = idle2 * 0.04;
  capPivot.rotation.z = Math.sin(t * 1.2) * 0.01;

  // mouth
  mouth.scale.x = 1 + gestureBoost * 0.18 + idle3 * 0.04;
  mouth.scale.y = 0.52 + gestureBoost * 0.08;

  // no-arm effect: หน้าจอ sweep เบา ๆ และตา/ปาก react ตอนมองเมนู
  if (scanSweep && scanSweepMat) {
    const scanActive = activeNode || idleTooLong;
    const scanX = activeNode
      ? clamp(focus.x * 0.54, -0.66, 0.66)
      : Math.sin(t * 1.55) * 0.68;
    scanSweep.position.x = damp(scanSweep.position.x, scanX, 6.5, dt);
    scanSweep.scale.y = 0.86 + Math.sin(t * 5.0) * 0.06;
    scanSweepMat.opacity = damp(scanSweepMat.opacity, scanActive ? 0.42 : 0.0, 5.5, dt);
  }

  // v7: turn chest slightly toward pointing direction so the original arm silhouette reads better
  if (liveGesture === 'point-right') {
    torsoPivot.rotation.y += 0.22 * gestureBoost;
    headPivot.rotation.y += 0.14 * gestureBoost;
  } else if (liveGesture === 'point-left') {
    torsoPivot.rotation.y -= 0.22 * gestureBoost;
    headPivot.rotation.y -= 0.14 * gestureBoost;
  } else if (liveGesture === 'salute') {
    headPivot.rotation.x -= 0.08 * gestureBoost;
  }

  // arm placeholders: v12 จะ override เป็นท่าไขว้หลังด้านล่าง
  let lShoulderZ = 0;
  let lUpperZ = 0;
  let lForeZ = 0;
  let lWristZ = 0;

  let rShoulderZ = 0;
  let rUpperZ = 0;
  let rForeZ = 0;
  let rWristZ = 0;


  // v9 IK pointing: ชี้ไปหาเมนูจริงแบบเฉียงได้
  let ikPointing = false;
  let ikSide = 1;
  let ikTarget = null;

  if (false && activeNode) {
    ikTarget = targetFromFocus(focus);
    ikSide = chooseArmSide(ikTarget);
    ikPointing = true;
  } else if (false && liveGesture === 'point-right') {
    ikTarget = new THREE.Vector3(2.45, 1.08 + Math.sin(t * 1.2) * 0.06, 0.68);
    ikSide = 1;
    ikPointing = true;
  } else if (false && liveGesture === 'point-left') {
    ikTarget = new THREE.Vector3(-2.45, 1.08 + Math.sin(t * 1.2) * 0.06, 0.68);
    ikSide = -1;
    ikPointing = true;
  }


  // gestures — v4: ทำท่าชี้ให้เห็นชัดแบบไม่ต้องเดา
  const wave = Math.sin(t * 7.0);
  let beamSide = 0;
  // v7 ใช้แขนเดิมเท่านั้น ไม่มี overlay arm

  if (liveGesture === 'salute') {
    // มือขวาขึ้นแตะหมวก
    rShoulderZ = -1.15;
    rUpperZ = -0.30;
    rForeZ = 1.45 + wave * 0.05;
    rWristZ = 0.78;
    lShoulderZ -= 0.12;

  } else if (liveGesture === 'point-right') {
    // ชี้ไปขวา: แขนขวายืดออกด้านข้าง + นิ้วชี้เปิด
    beamSide = 1;
    rShoulderZ = 1.58;
    rUpperZ = 0.00;
    rForeZ = 0.00;
    rWristZ = 0.10 + wave * 0.035;

    rightArm.shoulder.rotation.y = -0.35;
    rightArm.foreArmPivot.rotation.y = -0.12;

    rightArm.fingers[0].rotation.z = 0.55;   // พับนิ้ว
    rightArm.fingers[1].rotation.z = -0.08;  // นิ้วชี้ยื่น
    rightArm.fingers[2].rotation.z = 0.55;   // พับนิ้ว

  } else if (liveGesture === 'point-left') {
    // ชี้ไปซ้าย: แขนซ้ายยืดออกด้านข้าง + นิ้วชี้เปิด
    beamSide = -1;
    lShoulderZ = -1.58;
    lUpperZ = 0.00;
    lForeZ = 0.00;
    lWristZ = -0.10 + wave * 0.035;

    leftArm.shoulder.rotation.y = 0.35;
    leftArm.foreArmPivot.rotation.y = 0.12;

    leftArm.fingers[0].rotation.z = -0.55;   // พับนิ้ว
    leftArm.fingers[1].rotation.z = 0.08;    // นิ้วชี้ยื่น
    leftArm.fingers[2].rotation.z = -0.55;   // พับนิ้ว

  } else if (liveGesture === 'wave') {
    // โบกมือขวา
    rShoulderZ = -1.02;
    rUpperZ = -0.18;
    rForeZ = 1.14 + wave * 0.28;
    rWristZ = wave * 0.24;
  }

  // v10: no-arm look beam / target dot จากหน้าจอไปหาเมนู ไม่ใช่แขนชี้
  if (activeNode && typeof pointerBeam !== 'undefined' && typeof pointerDot !== 'undefined') {
    const end = targetFromFocus(focus);
    const start = new THREE.Vector3(0, 0.08 + idle * 0.02, 0.72);
    updateDynamicBeam(
      start,
      new THREE.Vector3(end.x, end.y, 0.72),
      gestureBoost * 0.56,
      dt,
      'LOOK TARGET',
      activeNode.querySelector('b')?.textContent || 'มองเมนู'
    );
  } else
  // เส้นชี้เมนู ช่วยให้ gesture อ่านออกทันที
  if (typeof pointerBeam !== 'undefined' && typeof pointerDot !== 'undefined') {
    const showBeam = Math.abs(beamSide) > 0 ? gestureBoost : 0;
    pointerBeamMat.opacity = damp(pointerBeamMat.opacity, showBeam * 0.88, 6.0, dt);
    pointerDotMat.opacity = damp(pointerDotMat.opacity, showBeam * 1.0, 6.0, dt);

    const beamLength = 1.95;
    pointerBeam.scale.set(1, beamLength, 1);
    pointerBeam.position.set(beamSide * 2.04, 1.08 + idle * 0.03, 0.66);
    pointerBeam.rotation.set(0, 0, Math.PI / 2);

    pointerDot.position.set(beamSide * 3.04, 1.08 + idle * 0.03, 0.66);
    pointerDot.scale.setScalar(1 + Math.sin(t * 8) * 0.12);

    if (gestureLabel) {
      gestureLabel.classList.toggle('show', showBeam > 0.08);
      gestureLabel.style.setProperty('--gx', `${beamSide * 270}px`);
      gestureLabel.style.setProperty('--gy', `8px`);
      gestureLabel.querySelector('strong').textContent = beamSide > 0 ? 'POINT RIGHT' : 'POINT LEFT';
      gestureLabel.querySelector('span').textContent = beamSide > 0 ? 'ชี้เมนูฝั่งขวา' : 'ชี้เมนูฝั่งซ้าย';
    }
  } else if (gestureLabel) {
    const showOther = liveGesture === 'salute' || liveGesture === 'wave';
    gestureLabel.classList.toggle('show', showOther && gestureBoost > 0.2);
    gestureLabel.style.setProperty('--gx', '0px');
    gestureLabel.style.setProperty('--gy', liveGesture === 'salute' ? '-250px' : '230px');
    gestureLabel.querySelector('strong').textContent = liveGesture === 'salute' ? 'SALUTE' : 'WAVE';
    gestureLabel.querySelector('span').textContent = liveGesture === 'salute' ? 'ทำความเคารพ' : 'โบกมือ';
  }

  leftArm.shoulder.rotation.z = lShoulderZ;
  leftArm.shoulder.rotation.x = -focus.x * 0.08;
  leftArm.upperArmPivot.rotation.z = lUpperZ;
  leftArm.foreArmPivot.rotation.z = lForeZ;
  leftArm.wrist.rotation.z = lWristZ;

  rightArm.shoulder.rotation.z = rShoulderZ;
  rightArm.shoulder.rotation.x = focus.x * 0.08;
  rightArm.upperArmPivot.rotation.z = rUpperZ;
  rightArm.foreArmPivot.rotation.z = rForeZ;
  rightArm.wrist.rotation.z = rWristZ;

  // reset fingers normally
  if (liveGesture !== 'point-left') {
    leftArm.fingers.forEach((f, i) => { f.rotation.z = 0.08 + Math.sin(t * 3.8 + i) * 0.03; });
  }
  if (liveGesture !== 'point-right') {
    rightArm.fingers.forEach((f, i) => { f.rotation.z = 0.10 + Math.sin(t * 4.2 + i) * 0.04; });
  }

  // v9: override final pose with IK after all old gesture values
  if (ikPointing && ikTarget) {
    const arm = ikSide > 0 ? rightArm : leftArm;
    const otherArm = ikSide > 0 ? leftArm : rightArm;

    solvePointArm(arm, ikSide, ikTarget, gestureBoost, dt);

    // อีกแขน balance แบบนุ่ม ๆ ไม่แข็งเป็นท่อนไม้
    otherArm.shoulder.rotation.z = damp(otherArm.shoulder.rotation.z, -ikSide * 0.42 + Math.sin(t * 1.8) * 0.03, 5.0, dt);
    otherArm.upperArmPivot.rotation.z = damp(otherArm.upperArmPivot.rotation.z, -ikSide * 0.12, 5.0, dt);
    otherArm.foreArmPivot.rotation.z = damp(otherArm.foreArmPivot.rotation.z, ikSide * 0.10, 5.0, dt);
    otherArm.shoulder.rotation.y = damp(otherArm.shoulder.rotation.y, 0, 5.0, dt);
    otherArm.foreArmPivot.rotation.y = damp(otherArm.foreArmPivot.rotation.y, 0, 5.0, dt);

    // หันอก/หัวไปทางเป้าด้วย จะได้ไม่เหมือนแขนชี้แต่ตัวไม่รู้เรื่อง
    torsoPivot.rotation.y += ikSide * 0.14 * gestureBoost;
    headPivot.rotation.y += ikSide * 0.10 * gestureBoost;

    const start = new THREE.Vector3(ikSide * 1.92, 0.93, 0.72);
    const end = new THREE.Vector3(ikTarget.x, ikTarget.y, 0.72);
    updateDynamicBeam(
      start,
      end,
      gestureBoost,
      dt,
      activeNode ? 'POINT MENU' : (ikSide > 0 ? 'POINT RIGHT' : 'POINT LEFT'),
      activeNode ? activeNode.querySelector('b')?.textContent || 'ชี้เมนู' : (ikSide > 0 ? 'ชี้ฝั่งขวา' : 'ชี้ฝั่งซ้าย')
    );
  } else if (typeof pointerBeam !== 'undefined' && typeof pointerDot !== 'undefined') {
    // ถ้าไม่ได้ชี้ ให้ซ่อน beam แบบ smooth
    pointerBeamMat.opacity = damp(pointerBeamMat.opacity, 0, 7.0, dt);
    pointerDotMat.opacity = damp(pointerDotMat.opacity, 0, 7.0, dt);
  }

  // v12: แขนไขว้หลังตลอด ไม่ชี้ ไม่โบก — ขยับได้แค่นิดเดียวพอให้ไม่แข็งเป็นหิน
  const armIdle = Math.sin(t * 1.3) * 0.02;

  leftArm.shoulder.rotation.x = damp(leftArm.shoulder.rotation.x, 1.18 + armIdle, 5.5, dt);
  leftArm.shoulder.rotation.y = damp(leftArm.shoulder.rotation.y, -0.18 + focus.x * 0.02, 5.5, dt);
  leftArm.shoulder.rotation.z = damp(leftArm.shoulder.rotation.z, 0.54, 5.5, dt);
  leftArm.upperArmPivot.rotation.z = damp(leftArm.upperArmPivot.rotation.z, 0.24, 5.5, dt);
  leftArm.foreArmPivot.rotation.x = damp(leftArm.foreArmPivot.rotation.x, 0.18, 5.5, dt);
  leftArm.foreArmPivot.rotation.y = damp(leftArm.foreArmPivot.rotation.y, 0.10, 5.5, dt);
  leftArm.foreArmPivot.rotation.z = damp(leftArm.foreArmPivot.rotation.z, -1.02, 5.5, dt);
  leftArm.wrist.rotation.z = damp(leftArm.wrist.rotation.z, -0.14, 5.5, dt);

  rightArm.shoulder.rotation.x = damp(rightArm.shoulder.rotation.x, 1.18 - armIdle, 5.5, dt);
  rightArm.shoulder.rotation.y = damp(rightArm.shoulder.rotation.y, 0.18 + focus.x * 0.02, 5.5, dt);
  rightArm.shoulder.rotation.z = damp(rightArm.shoulder.rotation.z, -0.54, 5.5, dt);
  rightArm.upperArmPivot.rotation.z = damp(rightArm.upperArmPivot.rotation.z, -0.24, 5.5, dt);
  rightArm.foreArmPivot.rotation.x = damp(rightArm.foreArmPivot.rotation.x, 0.18, 5.5, dt);
  rightArm.foreArmPivot.rotation.y = damp(rightArm.foreArmPivot.rotation.y, -0.10, 5.5, dt);
  rightArm.foreArmPivot.rotation.z = damp(rightArm.foreArmPivot.rotation.z, 1.02, 5.5, dt);
  rightArm.wrist.rotation.z = damp(rightArm.wrist.rotation.z, 0.14, 5.5, dt);

  leftArm.fingers.forEach((f, i) => { f.rotation.z = damp(f.rotation.z, -0.38 - i * 0.06, 6.0, dt); });
  rightArm.fingers.forEach((f, i) => { f.rotation.z = damp(f.rotation.z, 0.38 + i * 0.06, 6.0, dt); });

  // legs / balance
  leftLeg.hip.rotation.z = focus.x * -0.04;
  rightLeg.hip.rotation.z = focus.x * 0.04;
  leftLeg.thighPivot.rotation.x = idle * 0.02;
  rightLeg.thighPivot.rotation.x = -idle * 0.02;
  leftLeg.shinPivot.rotation.x = focus.y * -0.03;
  rightLeg.shinPivot.rotation.x = focus.y * 0.03;
  leftLeg.ankle.rotation.x = idle2 * 0.03;
  rightLeg.ankle.rotation.x = -idle2 * 0.03;

  renderer.render(scene, camera);
}
