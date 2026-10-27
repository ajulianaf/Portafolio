import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createScenery } from './scenery.js';
import { createIslands } from './islands.js';          // [ISLANDS] islas flotantes de proyecto
import { createCaseModal } from './case-modal.js';      // modal de caso de estudio

/* =========================================================
   0 · CONFIGURACIÓN
   ========================================================= */
const CONFIG = {
  envPath: 'assets/entorno.glb',
  butterflyPath: 'assets/butterfly.glb',

  envScale: 1,
  envPosition: new THREE.Vector3(0, 0, 0),

  butterflySize: 1.2,
  flySpeed: 8,
  smoothing: 4,
  cameraOffset: new THREE.Vector3(0, 4, 10),
  cameraSmoothing: 3,

  proximityRadius: 2.5,
  collisions: true,
  bodyRadius: 0.5,
  colliderIgnore: [],
  proximityHeight: 9,
  autopilotStop: 0.6,
  maxTilt: 0.15,
  turnMax: Math.PI / 2, turnSpeed: 5, turnDir: -1,

  flyRadius: 22,                        // [ISLANDS] antes 12: ahora hay que llegar a las islas de proyecto
  bounds: { yMin: 0.5, yMax: 12 },

  DEBUG: true,

  fogDensity: 0.012,                    // FogExp2 (modo oscuro)
  sporeCount: 600,
  mistCount: 40,
  starCount: 900,
  cloudCount: 14,
  beamHeight: 14,
  islandRadius: 11,
  rimMistCount: 18,
  fireflyCount: 120,
  fireflyRadius: 22,
  labelHeight: 4.5,

  joyRadius: 46,          // recorrido máximo de la perilla (px)
  joyDeadzone: 0.12,      // zona muerta (0–1)
};

const HOME = new THREE.Vector3(0, 5, 0);

// Estaciones (cada id debe tener su tarjeta <section id="panel-ID"> en el HTML y su botón data-goto="ID" en el menú)
// island: true → esa estación flota en su propia isla (ver js/islands.js)
const STATIONS = [
  { id: 'perfil',    label: 'Mi perfil',        node: '', pos: new THREE.Vector3(-6.0, 0.5, 3.8),  offset: new THREE.Vector3(0, 1.5, 0), color: 0x00e5ff },
  { id: 'STC',       label: 'STComunicaciones', node: '', pos: new THREE.Vector3(-11, 3.5, -12),   offset: new THREE.Vector3(0, 1.5, 0), color: 0xff4fd8, island: true },
  { id: 'ThreeStar', label: 'Three Star',       node: '', pos: new THREE.Vector3(0, 5.5, -18),     offset: new THREE.Vector3(0, 1.5, 0), color: 0x9d6bff, island: true },
  { id: 'Artis',     label: 'Artis',            node: '', pos: new THREE.Vector3(11, 3.5, -12),    offset: new THREE.Vector3(0, 1.5, 0), color: 0x00e5ff, island: true },
  { id: 'servicios', label: 'Servicios',        node: '', pos: new THREE.Vector3(5.8, 0.4, -0.9),  offset: new THREE.Vector3(0, 1.5, 0), color: 0xffd479 },
];

/* =========================================================
   1 · ESCENA, CÁMARA, RENDERER, LUCES
   ========================================================= */
const container = document.getElementById('scene');
const loaderEl = document.getElementById('loader');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x662d72);                    // Aubergine
scene.fog = new THREE.FogExp2(0x662d72, CONFIG.fogDensity);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 300);
camera.position.copy(HOME).add(CONFIG.cameraOffset);
camera.lookAt(HOME);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
container.appendChild(renderer.domElement);

const hemi = new THREE.HemisphereLight(0xe0b0ff, 0x3a1546, 0.8);
const sun = new THREE.DirectionalLight(0xffffff, 0.9);
sun.position.set(5, 10, 7);
const ambient = new THREE.AmbientLight(0xffffff, 0);
scene.add(hemi, sun, ambient);

/* =========================================================
   2 · HACES DE LUZ + LUCES PUNTUALES + ESPORAS
   ========================================================= */
let envRoot = null;

function makeBeam(color) {
  const geo = new THREE.CylinderGeometry(1.2, 0.15, CONFIG.beamHeight, 28, 1, true);
  geo.translate(0, CONFIG.beamHeight / 2, 0);
  const mat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uPower: { value: 0.35 } },
    vertexShader: 'varying float vY; void main(){ vY = uv.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 uColor; uniform float uPower; varying float vY; void main(){ gl_FragColor = vec4(uColor, uPower * pow(1.0 - vY, 1.6)); }',
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  });
  return new THREE.Mesh(geo, mat);
}

const stationFx = STATIONS.map((s) => {
  const light = new THREE.PointLight(s.color, 0.5, 14, 2);
  const beam = makeBeam(s.color);
  scene.add(light, beam);
  return { light, beam };
});

function placeStation(i) {
  stationFx[i].light.position.copy(STATIONS[i].pos).y += 1;
  stationFx[i].beam.position.copy(STATIONS[i].pos);
}
STATIONS.forEach((_, i) => placeStation(i));

function updateFx(dt, t) {
  fireflies.material.uniforms.uTime.value = t;
  rimMist.forEach((m) => (m.material.rotation += m.userData.spin * dt));
  STATIONS.forEach((s, i) => {
    const near = s.id === nearestRaw;                 // la luz sigue encendida aunque cierres la tarjeta
    const { light, beam } = stationFx[i];
    const u = beam.material.uniforms.uPower;
    u.value = THREE.MathUtils.lerp(u.value, (near ? 0.8 : 0.35) + Math.sin(t * 2 + i) * 0.06, 1 - Math.exp(-4 * dt));
    light.intensity = THREE.MathUtils.lerp(light.intensity, near ? 8 : 0.5, 1 - Math.exp(-4 * dt));
  });
  // Esporas: se reciclan alrededor de la mariposa
  const a = spores.geometry.attributes.position, p = butterfly.position, R = 40;
  for (let k = 0; k < CONFIG.sporeCount; k++) {
    let x = a.getX(k), y = a.getY(k) + dt * 0.3, z = a.getZ(k);
    if (x - p.x > R) x -= 2 * R; else if (x - p.x < -R) x += 2 * R;
    if (z - p.z > R) z -= 2 * R; else if (z - p.z < -R) z += 2 * R;
    if (y > 25) y = 0;
    a.setXYZ(k, x, y, z);
  }
  a.needsUpdate = true;
  mist.forEach((m) => {
    m.position.x += m.userData.vx * dt;
    m.position.z += m.userData.vz * dt;
    if (m.position.x - p.x > 55) m.position.x -= 110; else if (m.position.x - p.x < -55) m.position.x += 110;
    if (m.position.z - p.z > 55) m.position.z -= 110; else if (m.position.z - p.z < -55) m.position.z += 110;
  });
}

const sporePos = new Float32Array(CONFIG.sporeCount * 3);
for (let k = 0; k < CONFIG.sporeCount; k++) {
  sporePos[k * 3] = (Math.random() - 0.5) * 80;
  sporePos[k * 3 + 1] = Math.random() * 25;
  sporePos[k * 3 + 2] = (Math.random() - 0.5) * 80;
}
const spores = new THREE.Points(
  new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(sporePos, 3)),
  new THREE.PointsMaterial({ color: 0x9ff0ff, size: 0.18, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending })
);
spores.frustumCulled = false;
scene.add(spores);

// Niebla baja
const mistCv = document.createElement('canvas');
mistCv.width = mistCv.height = 128;
const mg = mistCv.getContext('2d'), grad = mg.createRadialGradient(64, 64, 0, 64, 64, 64);
grad.addColorStop(0, 'rgba(255,255,255,0.6)');
grad.addColorStop(1, 'rgba(255,255,255,0)');
mg.fillStyle = grad;
mg.fillRect(0, 0, 128, 128);
const mistTex = new THREE.CanvasTexture(mistCv);
const mistColors = [0x00e5ff, 0xff7ac6, 0xff4fd8];                  // cian y magentas de la marca
const mist = Array.from({ length: CONFIG.mistCount }, (_, i) => {
  const m = new THREE.Sprite(new THREE.SpriteMaterial({
    map: mistTex, color: mistColors[i % 3], transparent: true, opacity: 0.1 + Math.random() * 0.08,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  m.scale.setScalar(14 + Math.random() * 18);
  m.position.set((Math.random() - 0.5) * 110, 0.5 + Math.random() * 4, (Math.random() - 0.5) * 110);
  m.userData = { vx: (Math.random() - 0.5) * 0.6, vz: (Math.random() - 0.5) * 0.6, base: m.material.opacity };
  scene.add(m);
  return m;
});

/* ---------- BRUMA DE BORDE ---------- */
const rimMist = Array.from({ length: CONFIG.rimMistCount }, (_, i) => {
  const ang = (i / CONFIG.rimMistCount) * Math.PI * 2 + Math.random() * 0.3;
  const r = CONFIG.islandRadius * (0.9 + Math.random() * 0.35);
  const m = new THREE.Sprite(new THREE.SpriteMaterial({
    map: mistTex, color: mistColors[i % 3], transparent: true, opacity: 0.16 + Math.random() * 0.1,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  m.scale.setScalar(11 + Math.random() * 7);
  m.position.set(Math.cos(ang) * r, 0.3 + Math.random() * 1.6, Math.sin(ang) * r).add(CONFIG.envPosition);
  m.userData.base = m.material.opacity;
  m.userData.spin = (Math.random() - 0.5) * 0.12;
  scene.add(m);
  return m;
});

/* ---------- LUCIÉRNAGAS BIOLUMINISCENTES ---------- */
const ffN = CONFIG.fireflyCount;
const ffPos = new Float32Array(ffN * 3), ffCol = new Float32Array(ffN * 3), ffPhase = new Float32Array(ffN);
const ffPalette = [0x00e5ff, 0xff7ac6, 0x9d6bff, 0xffd479, 0x8affc1].map((c) => new THREE.Color(c));
for (let k = 0; k < ffN; k++) {
  const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * CONFIG.fireflyRadius, c = ffPalette[k % ffPalette.length];
  ffPos.set([Math.cos(a) * r, 0.6 + Math.random() * 9, Math.sin(a) * r], k * 3);
  ffCol.set([c.r, c.g, c.b], k * 3);
  ffPhase[k] = Math.random();
}
const ffGeo = new THREE.BufferGeometry();
ffGeo.setAttribute('position', new THREE.BufferAttribute(ffPos, 3));
ffGeo.setAttribute('aColor', new THREE.BufferAttribute(ffCol, 3));
ffGeo.setAttribute('aPhase', new THREE.BufferAttribute(ffPhase, 1));
const fireflies = new THREE.Points(ffGeo, new THREE.ShaderMaterial({
  uniforms: { uTime: { value: 0 }, uSize: { value: 7 * Math.min(devicePixelRatio, 2) }, uOpacity: { value: 1 } },
  vertexShader: 'attribute float aPhase; attribute vec3 aColor; uniform float uTime; uniform float uSize; varying vec3 vColor; varying float vAlpha;'
    + 'void main(){ vec3 p = position;'
    + ' p.x += sin(uTime*0.35 + aPhase*6.28)*1.6; p.y += sin(uTime*0.5 + aPhase*12.0)*0.9; p.z += cos(uTime*0.3 + aPhase*9.0)*1.6;'
    + ' vec4 mv = modelViewMatrix * vec4(p,1.0); float tw = 0.5 + 0.5*sin(uTime*1.6 + aPhase*20.0);'
    + ' gl_PointSize = min(uSize * (0.6 + 0.4*tw) * (30.0 / -mv.z), 60.0); vAlpha = 0.35 + 0.65*tw; vColor = aColor;'
    + ' gl_Position = projectionMatrix * mv; }',
  fragmentShader: 'varying vec3 vColor; varying float vAlpha; uniform float uOpacity;'
    + 'void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; float g = pow(1.0 - d*2.0, 2.0);'
    + ' gl_FragColor = vec4(vColor, g * vAlpha * uOpacity); }',
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
}));
fireflies.frustumCulled = false;
fireflies.position.copy(CONFIG.envPosition);
scene.add(fireflies);

/* ---------- ESTRELLAS (modo oscuro) ---------- */
const starPos = new Float32Array(CONFIG.starCount * 3);
for (let k = 0; k < CONFIG.starCount; k++) {
  const u = -0.05 + Math.random() * 1.05, th = Math.random() * Math.PI * 2, r = 110, q = Math.sqrt(1 - u * u);
  starPos.set([r * q * Math.cos(th), r * u, r * q * Math.sin(th)], k * 3);
}
const stars = new THREE.Points(
  new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(starPos, 3)),
  new THREE.PointsMaterial({ color: 0xffffff, size: 1.8, sizeAttenuation: false, transparent: true, opacity: 0.9, depthWrite: false, fog: false })
);
stars.frustumCulled = false;
scene.add(stars);

/* ---------- NUBECITAS (modo claro) ---------- */
const cloudCv = document.createElement('canvas');
cloudCv.width = 256; cloudCv.height = 128;
const cg = cloudCv.getContext('2d');
[[70, 72, 36], [112, 54, 46], [156, 62, 44], [196, 76, 32], [130, 82, 38]].forEach(([x, y, r]) => {
  const g = cg.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, 'rgba(255,255,255,0.95)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  cg.fillStyle = g; cg.beginPath(); cg.arc(x, y, r, 0, 7); cg.fill();
});
const cloudTex = new THREE.CanvasTexture(cloudCv);
const clouds = Array.from({ length: CONFIG.cloudCount }, () => {
  const c = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex, transparent: true, opacity: 0, depthWrite: false, fog: false }));
  const w = 26 + Math.random() * 26;
  c.scale.set(w, w / 2, 1);
  let x, z;
  do { x = (Math.random() - 0.5) * 220; z = (Math.random() - 0.5) * 220; } while (Math.hypot(x, z) < 35);
  c.position.set(x, 8 + Math.random() * 16, z);
  c.userData.vx = 0.4 + Math.random() * 0.6;
  scene.add(c);
  return c;
});

/* [SCENERY] Panorama: cielo, cordilleras, mar de nubes e islotes decorativos */
const scenery = createScenery({ scene, colors: [0xff7ac6, 0x00e5ff, 0xff4fd8, 0x9d6bff] });

/* [ISLANDS] Una isla flotante independiente por cada proyecto */
const islands = createIslands({ scene, stations: STATIONS });

/* ---------- TRANSICIÓN OSCURO ↔ CLARO ---------- */
let mode = 0, targetMode = 0;                                 // 0 = oscuro (Aubergine), 1 = claro (lila)
const bgDark = new THREE.Color(0x662d72), bgLight = new THREE.Color(0xe8c8ef);
const L = THREE.MathUtils.lerp;

function updateTheme(dt) {
  mode = L(mode, targetMode, 1 - Math.exp(-2.5 * dt));
  fx = L(fx, targetFx, 1 - Math.exp(-4 * dt));
  scene.background.lerpColors(bgDark, bgLight, mode);
  scene.fog.color.copy(scene.background);
  scene.fog.density = L(CONFIG.fogDensity, CONFIG.fogDensity * 0.5, mode);   // FogExp2: se anima la densidad
  hemi.intensity = L(0.8, 1.7, mode);
  sun.intensity = L(0.9, 2.4, mode);
  ambient.intensity = L(0, 1.0, mode);
  renderer.toneMappingExposure = L(1, 1.35, mode);

  stars.position.copy(camera.position);
  stars.material.opacity = 0.9 * (1 - mode);
  stars.visible = mode < 0.99;
  spores.material.opacity = L(0.8, 0.25, mode) * fx;
  mist.forEach((m) => (m.material.opacity = m.userData.base * L(1, 0.3, mode) * fx));
  rimMist.forEach((m) => (m.material.opacity = m.userData.base * L(1, 0.4, mode)));    // sin fx: suaviza el borde de la isla
  fireflies.material.uniforms.uOpacity.value = L(1, 0.3, mode) * fx;

  const p = butterfly.position;
  clouds.forEach((c) => {
    c.material.opacity = 0.9 * mode;
    c.visible = mode > 0.01;
    c.position.x += c.userData.vx * dt;
    if (c.position.x - p.x > 110) c.position.x -= 220;
  });
}

/* =========================================================
   3 · CARGA DE MODELOS (entorno + mariposa)
   ========================================================= */
const gltfLoader = new GLTFLoader();

// Jerarquía: butterfly (posición) > steer (giro) > tilt (balanceo) > model (orientación base)
const butterfly = new THREE.Group();
const steer = new THREE.Group();
const tilt = new THREE.Group();
steer.add(tilt);
butterfly.add(steer);
butterfly.position.copy(HOME);
scene.add(butterfly);

let mixer = null, flapActions = [];
const clock = new THREE.Clock();

/* ---------- COLISIONES (raycast contra la malla del entorno) ---------- */
const _ray = new THREE.Raycaster();
_ray.firstHitOnly = true;
const _n = new THREE.Vector3(), _d = new THREE.Vector3(), _t = new THREE.Vector3(), _o = new THREE.Vector3();
const AXES = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].map((a) => new THREE.Vector3(...a));
let colliders = [], collisionReady = false, bvhOk = false, ghost = 0, stuckT = 0;

async function setupCollisions(env) {
  if (!CONFIG.collisions) return;
  env.traverse((o) => {
    if (!o.isMesh || !o.geometry) return;
    if (CONFIG.colliderIgnore.some((n) => o.name.includes(n))) return;
    const mats = [].concat(o.material);
    if (mats.every((m) => m.transparent && m.opacity < 0.4)) return;
    colliders.push(o);
  });
  try {
    const bvh = await import('https://cdn.jsdelivr.net/npm/three-mesh-bvh@0.9.0/build/index.module.js');
    THREE.BufferGeometry.prototype.computeBoundsTree = bvh.computeBoundsTree;
    THREE.Mesh.prototype.raycast = bvh.acceleratedRaycast;
    colliders.forEach((m) => m.geometry.computeBoundsTree());
    bvhOk = true;
  } catch (err) {
    console.warn('three-mesh-bvh no disponible: colisiones sin aceleración (puede ir más lento)', err);
  }
  collisionReady = colliders.length > 0;
  console.log(`Colisiones listas · ${colliders.length} mallas · BVH: ${bvhOk}`);
}

function castFrom(origin, dir, far) {
  _ray.set(origin, dir);
  _ray.near = 0;
  _ray.far = far;
  const h = _ray.intersectObjects(colliders, false)[0];
  return h && h.face ? h : null;
}

function resolveCollisions(step) {
  const R = CONFIG.bodyRadius, p = butterfly.position;
  for (let iter = 0; iter < 2; iter++) {
    const len = step.length();
    if (len < 1e-5) break;
    _d.copy(step).divideScalar(len);
    const hit = castFrom(p, _d, len + R / 0.25);
    if (!hit) break;
    _n.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
    if (_n.dot(_d) > 0) _n.negate();
    const c = Math.max(-_n.dot(_d), 0.25);
    const t = hit.distance - R / c;
    if (t >= len) break;
    const allow = Math.max(0, t);
    _t.copy(_d).multiplyScalar(len - allow);
    _t.addScaledVector(_n, -_t.dot(_n));
    step.copy(_d).multiplyScalar(allow).add(_t);
    if (velocity.dot(_n) < 0) velocity.addScaledVector(_n, -velocity.dot(_n));
  }
  if (bvhOk) {
    _o.copy(p).add(step);
    AXES.forEach((ax) => {
      const h = castFrom(_o, ax, R);
      if (h) step.addScaledVector(ax, -(R - h.distance));
    });
  }
}

async function loadEnvironment() {
  const gltf = await gltfLoader.loadAsync(CONFIG.envPath);
  const env = gltf.scene;
  env.scale.setScalar(CONFIG.envScale);
  env.position.copy(CONFIG.envPosition);
  scene.add(env);
  envRoot = env;
  env.updateMatrixWorld(true);
  setupCollisions(env);

  if (CONFIG.DEBUG) {
    const names = [];
    env.traverse((o) => o.name && names.push(o.name));
    console.log('Nodos del GLB:', names);
  }

  // Posición automática desde el nodo de cada flor (si indicaste `node`)
  STATIONS.forEach((s, i) => {
    if (!s.node) return;
    const o = env.getObjectByName(s.node);
    if (!o) return console.warn(`Nodo "${s.node}" no encontrado para ${s.id}`);
    o.getWorldPosition(s.pos);
    placeStation(i);
  });

  // Calibración: clic sobre el entorno → imprime su coordenada
  if (CONFIG.DEBUG) {
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    renderer.domElement.addEventListener('click', (e) => {
      ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObject(env, true)[0];
      if (hit) console.log(`new THREE.Vector3(${hit.point.x.toFixed(1)}, ${hit.point.y.toFixed(1)}, ${hit.point.z.toFixed(1)})  ← objeto: ${hit.object.name}`);
    });
  }
}

async function loadButterfly() {
  const model = new THREE.Group();
  try {
    const gltf = await gltfLoader.loadAsync(CONFIG.butterflyPath);
    const inner = gltf.scene;
    const box = new THREE.Box3().setFromObject(inner);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = CONFIG.butterflySize / Math.max(size.x, size.y, size.z);
    inner.scale.setScalar(s);
    inner.position.copy(center).multiplyScalar(-s);
    model.add(inner);

    if (gltf.animations.length) {
      mixer = new THREE.AnimationMixer(inner);
      flapActions = gltf.animations.map((clip) => {
        const a = mixer.clipAction(clip);
        a.play();
        return a;
      });
    }
  } catch (err) {
    console.error('No se pudo cargar la mariposa:', err);
    const fallback = new THREE.Mesh(
      new THREE.ConeGeometry(0.4, 1.1, 4),
      new THREE.MeshStandardMaterial({ color: 0xff7ac6 })
    );
    fallback.rotation.x = -Math.PI / 2;
    model.add(fallback);
  }
  model.rotation.y = Math.PI;               // rotación base 180°: cabeza al frente
  tilt.add(model);
}

Promise.allSettled([loadEnvironment(), loadButterfly()]).then((res) => {
  if (res[0].status === 'rejected') {
    console.error('No se pudo cargar el entorno:', res[0].reason);
    loaderEl.textContent = 'No se encontró assets/entorno.glb';
    setTimeout(() => loaderEl.classList.add('hide'), 2500);
  } else loaderEl.classList.add('hide');
});

/* =========================================================
   4 · HERO: se oculta con la primera tecla de movimiento
   ========================================================= */
let active = false;
const hero = document.getElementById('hero');

function activateExperience() {
  if (active) return;
  active = true;
  hero.classList.add('hidden');
  hero.setAttribute('aria-hidden', 'true');
}

/* =========================================================
   5 · CONTROLES WASD / FLECHAS + ESPACIO / SHIFT + JOYSTICK
   ========================================================= */
const MOVE_KEYS = ['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
const EXTRA_KEYS = ['Space','ShiftLeft','ShiftRight'];
const keys = {};
let autopilot = null;
let caseOpen = false;                         // true = el modal de caso de estudio está abierto
let nearestRaw = null;                        // estación más cercana (aunque su tarjeta esté cerrada)

addEventListener('keydown', (e) => {
  if (e.code === 'KeyP' && CONFIG.DEBUG) {
    const p = butterfly.position;
    console.log(`new THREE.Vector3(${p.x.toFixed(1)}, ${p.y.toFixed(1)}, ${p.z.toFixed(1)})`);
    return;
  }
  if (caseOpen) return;                        // con el modal abierto, WASD no mueve la mariposa
  const isMove = MOVE_KEYS.includes(e.code);
  if (!isMove && !EXTRA_KEYS.includes(e.code)) return;
  if (e.target.matches('input, textarea')) return;
  if (e.code.startsWith('Arrow') || (e.code === 'Space' && e.target === document.body)) e.preventDefault();
  if (isMove) activateExperience();
  if (!active) return;
  keys[e.code] = true;
  autopilot = null;
});
addEventListener('keyup', (e) => { keys[e.code] = false; });
addEventListener('blur', () => { Object.keys(keys).forEach((k) => (keys[k] = false)); resetJoystick(); });

/* ---------- Joystick táctil ---------- */
const joyEl = document.getElementById('joystick');
const joyKnob = joyEl.querySelector('.joy-knob');
const joyUp = document.getElementById('joy-up');
const joyDown = document.getElementById('joy-down');
const joy = { x: 0, y: 0, vert: 0, id: null };      // x: derecha +, y: atrás + (arriba del joystick = adelante), vert: subir +

function setKnob(dx, dy) {
  joyKnob.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
}
function resetJoystick() {
  joy.x = joy.y = joy.vert = 0;
  joy.id = null;
  joyEl.classList.remove('dragging');
  joyUp.classList.remove('pressed');
  joyDown.classList.remove('pressed');
  setKnob(0, 0);
}
function moveJoystick(e) {
  const r = joyEl.getBoundingClientRect();
  let dx = e.clientX - (r.left + r.width / 2);
  let dy = e.clientY - (r.top + r.height / 2);
  const len = Math.hypot(dx, dy), max = CONFIG.joyRadius;
  if (len > max) { dx = (dx / len) * max; dy = (dy / len) * max; }
  setKnob(dx, dy);
  let nx = dx / max, ny = dy / max;
  const mag = Math.hypot(nx, ny);
  if (mag < CONFIG.joyDeadzone) { nx = 0; ny = 0; }
  else {                                              // reescala para que la zona muerta no recorte la velocidad
    const s = (mag - CONFIG.joyDeadzone) / (1 - CONFIG.joyDeadzone) / mag;
    nx *= s; ny *= s;
  }
  joy.x = nx;
  joy.y = ny;
  if (mag >= CONFIG.joyDeadzone && !caseOpen) { activateExperience(); autopilot = null; }   // el primer toque oculta el hero
}

joyEl.addEventListener('pointerdown', (e) => {
  if (caseOpen) return;
  e.preventDefault();
  joy.id = e.pointerId;
  joyEl.setPointerCapture(e.pointerId);
  joyEl.classList.add('dragging');
  moveJoystick(e);
});
joyEl.addEventListener('pointermove', (e) => { if (e.pointerId === joy.id) moveJoystick(e); });
['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) =>
  joyEl.addEventListener(ev, (e) => {
    if (e.pointerId !== joy.id) return;
    joy.x = joy.y = 0;
    joy.id = null;
    joyEl.classList.remove('dragging');
    setKnob(0, 0);
  })
);

function bindVert(btn, dirVal) {
  const on = (e) => {
    if (caseOpen) return;
    e.preventDefault();
    btn.setPointerCapture(e.pointerId);
    joy.vert = dirVal;
    btn.classList.add('pressed');
    activateExperience();
    autopilot = null;
  };
  const off = () => { if (joy.vert === dirVal) joy.vert = 0; btn.classList.remove('pressed'); };
  btn.addEventListener('pointerdown', on);
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => btn.addEventListener(ev, off));
}
bindVert(joyUp, 1);
bindVert(joyDown, -1);

const velocity = new THREE.Vector3();
const lookTarget = HOME.clone();

function updateButterfly(dt) {
  const dir = new THREE.Vector3(
    (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0),
    (keys.Space ? 1 : 0) - (keys.ShiftLeft || keys.ShiftRight ? 1 : 0),
    (keys.KeyS || keys.ArrowDown ? 1 : 0) - (keys.KeyW || keys.ArrowUp ? 1 : 0)
  );
  dir.x += joy.x;                     // el joystick suma al teclado (analógico: más inclinado = más rápido)
  dir.y += joy.vert;
  dir.z += joy.y;
  dir.x = THREE.MathUtils.clamp(dir.x, -1, 1);
  dir.y = THREE.MathUtils.clamp(dir.y, -1, 1);
  dir.z = THREE.MathUtils.clamp(dir.z, -1, 1);

  if (autopilot) {
    const to = autopilot.clone().sub(butterfly.position);
    if (to.length() < CONFIG.autopilotStop) autopilot = null; else dir.copy(to);
  }
  if (dir.lengthSq() > 1 || autopilot) dir.normalize();          // solo se normaliza si excede 1 (conserva el control analógico)

  velocity.lerp(dir.multiplyScalar(CONFIG.flySpeed), 1 - Math.exp(-CONFIG.smoothing * dt));
  const step = velocity.clone().multiplyScalar(dt);
  ghost = Math.max(0, ghost - dt);
  if (collisionReady && ghost <= 0) resolveCollisions(step);
  butterfly.position.add(step);

  // Si el viaje automático se atasca, atraviesa 2 s para no quedarse trabado
  if (autopilot && step.length() < CONFIG.flySpeed * dt * 0.15) stuckT += dt; else stuckT = 0;
  if (stuckT > 1.2) { ghost = 2; stuckT = 0; }

  const b = CONFIG.bounds, p = butterfly.position;
  p.y = THREE.MathUtils.clamp(p.y, b.yMin, b.yMax);
  const dx = p.x - HOME.x, dz = p.z - HOME.z, dist = Math.hypot(dx, dz);
  if (dist > CONFIG.flyRadius) {
    const k = CONFIG.flyRadius / dist;
    p.x = HOME.x + dx * k;
    p.z = HOME.z + dz * k;
  }

  // Giro hacia el lado de vuelo
  const lateral = THREE.MathUtils.clamp(velocity.x / CONFIG.flySpeed, -1, 1);
  steer.rotation.y = THREE.MathUtils.lerp(
    steer.rotation.y, lateral * CONFIG.turnMax * CONFIG.turnDir, 1 - Math.exp(-CONFIG.turnSpeed * dt)
  );

  const k = 1 - Math.exp(-5 * dt), m = CONFIG.maxTilt;
  tilt.rotation.z = THREE.MathUtils.lerp(tilt.rotation.z, THREE.MathUtils.clamp(-velocity.x * 0.02, -m, m), k);
  tilt.rotation.x = THREE.MathUtils.lerp(tilt.rotation.x, THREE.MathUtils.clamp(-velocity.y * 0.015 + velocity.z * 0.01, -m, m), k);
  tilt.position.y = Math.sin(clock.elapsedTime * 2) * 0.1;

  const ratio = velocity.length() / CONFIG.flySpeed;
  flapActions.forEach((a) => (a.timeScale = 1 + ratio * 0.8));
}

function updateCamera(dt) {
  const desired = butterfly.position.clone().add(CONFIG.cameraOffset);
  camera.position.lerp(desired, 1 - Math.exp(-CONFIG.cameraSmoothing * dt));
  lookTarget.lerp(butterfly.position, 1 - Math.exp(-5 * dt));
  camera.lookAt(lookTarget);
}

/* =========================================================
   6 · PROXIMIDAD → TARJETAS + CIERRE (X / clic fuera)
   ========================================================= */
const panels = {};
STATIONS.forEach((s) => {
  const el = document.getElementById(`panel-${s.id}`);
  if (el) panels[s.id] = el;
  else console.warn(`No existe el panel "panel-${s.id}" en el HTML`);
});
let activeId = null;
let isCardDismissed = false;   // true = el usuario cerró la tarjeta y la mariposa sigue dentro de la zona de luz
let dismissedId = null;        // estación cuya tarjeta se cerró

function dismissCard(id = activeId) {            // cierra la tarjeta suavemente (la transición la hace el CSS)
  if (!id) return;
  isCardDismissed = true;
  dismissedId = id;
  activeId = null;
  Object.values(panels).forEach((el) => el.classList.remove('active'));
}

function updateProximity() {
  let nearest = null, best = Infinity;
  for (const s of STATIONS) {
    const p = butterfly.position;
    const d = Math.hypot(p.x - s.pos.x, p.z - s.pos.z), dy = p.y - s.pos.y;
    if (d < CONFIG.proximityRadius && dy > -1.5 && dy < CONFIG.proximityHeight && d < best) { nearest = s.id; best = d; }
  }
  nearestRaw = nearest;
  // Al salir de la zona (o entrar en otra) se libera el bloqueo: la tarjeta puede volver a abrirse
  if (nearest !== dismissedId) { isCardDismissed = false; dismissedId = null; }
  const shown = isCardDismissed ? null : nearest;
  if (shown !== activeId) {
    activeId = shown;
    for (const [id, el] of Object.entries(panels)) el.classList.toggle('active', id === activeId);
  }
}

// Botón X de cada tarjeta: la cierra y frena la propagación del clic (el ✕ de Configuración y el del modal se gestionan aparte)
document.querySelectorAll('.project-card .close-card-btn').forEach((btn) =>
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dismissCard(btn.closest('.project-card').id.replace('panel-', ''));
  })
);

// Clic o tap fuera (pointerdown: no se dispara al soltar un slider fuera de la tarjeta)
document.addEventListener('pointerdown', (e) => {
  if (caseOpen) return;                                          // el modal gestiona sus propios cierres
  if (!e.target.closest('#settings-panel, #settings-btn')) toggleSettings(false);
  if (e.target.closest('.project-card, #menu-btn, #menu, .tag3d, #settings-btn, #settings-panel, #joystick, #joy-vert')) return;
  if (!activeId) return;
  dismissCard();
});

addEventListener('keydown', (e) => {                            // Esc también cierra
  if (e.code !== 'Escape' || caseOpen) return;
  toggleSettings(false);
  dismissCard();
});

/* =========================================================
   6b · MODAL DE CASO DE ESTUDIO (Proceso UX/UI + Demo 3D)
   ========================================================= */
const caseModal = createCaseModal({
  onOpen: () => {
    caseOpen = true;
    document.body.classList.add('modal-open');
    resetJoystick();
    autopilot = null;
    Object.keys(keys).forEach((k) => (keys[k] = false));
    velocity.set(0, 0, 0);
  },
  onClose: () => {
    caseOpen = false;
    document.body.classList.remove('modal-open');
  },
});

document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-project]');
  if (!b) return;
  e.preventDefault();
  const id = b.dataset.project;
  dismissCard(id);                                              // oculta la tarjeta; no reaparece mientras sigas en la zona
  caseModal.open(id, b);
});

/* =========================================================
   7 · MENÚ → viaje suave a la isla
   ========================================================= */
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');

function toggleMenu(force) {
  const open = force ?? !menu.classList.contains('open');
  menu.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open);
  menu.setAttribute('aria-hidden', !open);
  if (open) toggleSettings(false);           // menú y configuración no se abren a la vez
}
menuBtn.addEventListener('click', () => toggleMenu());

function showHero() {
  caseModal.close();
  resetJoystick();
  nearestRaw = null;
  active = false;
  autopilot = null;
  Object.keys(keys).forEach((k) => (keys[k] = false));
  velocity.set(0, 0, 0);
  butterfly.position.copy(HOME);
  steer.rotation.set(0, 0, 0);
  tilt.rotation.set(0, 0, 0);
  camera.position.copy(HOME).add(CONFIG.cameraOffset);
  lookTarget.copy(HOME);
  camera.lookAt(lookTarget);
  activeId = null;
  isCardDismissed = false; dismissedId = null;
  Object.values(panels).forEach((el) => el.classList.remove('active'));

  // Reinicia el efecto de escritura del nombre
  const nameEl = document.getElementById('typing-name');
  if (nameEl) {
    nameEl.style.animation = 'none';
    void nameEl.offsetWidth;                 // fuerza el reflow para poder reiniciar
    nameEl.style.animation = '';
  }

  hero.classList.remove('hidden');
  hero.removeAttribute('aria-hidden');
}

menu.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-goto]');
  if (!btn) return;
  if (btn.dataset.goto === 'inicio') { showHero(); toggleMenu(false); btn.blur(); return; }

  const st = STATIONS.find((s) => s.id === btn.dataset.goto);
  if (st) flyTo(st);
  toggleMenu(false);
  btn.blur();
});
addEventListener('keydown', (e) => { if (e.code === 'Escape') toggleMenu(false); });

/* =========================================================
   8 · CONFIGURACIÓN (botón ⚙ → panel con los ajustes)
   ========================================================= */
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');

function toggleSettings(force) {
  const open = force ?? !settingsPanel.classList.contains('open');
  settingsPanel.classList.toggle('open', open);
  settingsBtn.setAttribute('aria-expanded', open);
  settingsPanel.setAttribute('aria-hidden', !open);
  if (open) toggleMenu(false);               // menú y configuración no se abren a la vez
}
settingsBtn.addEventListener('click', () => toggleSettings());
document.getElementById('settings-close').addEventListener('click', () => toggleSettings(false));

/* Modo claro / oscuro */
document.getElementById('theme-toggle').addEventListener('change', (e) => {
  targetMode = e.target.checked ? 1 : 0;
  document.documentElement.dataset.theme = e.target.checked ? 'light' : 'dark';
});

/* Velocidad de vuelo */
const speedRange = document.getElementById('speed-range');
speedRange.value = CONFIG.flySpeed;
speedRange.addEventListener('input', () => {
  CONFIG.flySpeed = Number(speedRange.value);
  document.getElementById('speed-value').textContent = CONFIG.flySpeed;
});

/* Distancia de cámara */
const BASE_OFFSET = CONFIG.cameraOffset.clone();
const camRange = document.getElementById('cam-range');
camRange.addEventListener('input', () => {
  const v = Number(camRange.value) / 100;
  CONFIG.cameraOffset.copy(BASE_OFFSET).multiplyScalar(v);
  document.getElementById('cam-value').textContent = camRange.value + '%';
});

/* Color de Interfaz (un solo color para toda la UI) */
document.getElementById('swatches').addEventListener('click', (e) => {
  const sw = e.target.closest('.swatch');
  if (!sw) return;
  const root = document.documentElement.style;
  if (sw.dataset.a) {
    root.setProperty('--accent', sw.dataset.a);
    root.setProperty('--accent-2', sw.dataset.a);   // mismo color: el degradado queda sólido
  } else {                                           // el primero restablece magenta + cian
    root.removeProperty('--accent');
    root.removeProperty('--accent-2');
  }
  document.querySelectorAll('.swatch').forEach((s) => s.classList.toggle('on', s === sw));
});

/* Ambiente: Completo / Suave / Mínimo */
let fx = 1, targetFx = 1;
document.getElementById('fx-seg').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  targetFx = Number(b.dataset.fx);
  document.querySelectorAll('#fx-seg button').forEach((x) => x.classList.toggle('on', x === b));
});

/* Etiquetas sobre las islas */
let showLabels = true;
document.getElementById('labels-toggle').addEventListener('change', (e) => {
  showLabels = e.target.checked;
});

/* =========================================================
   8b · ETIQUETAS FLOTANTES (HTML sobre las islas)
   ========================================================= */
function flyTo(st) {
  if (caseOpen) caseModal.close();
  if (dismissedId === st.id) { isCardDismissed = false; dismissedId = null; }   // elegir la estación a propósito reabre su tarjeta
  activateExperience();
  autopilot = st.pos.clone().add(st.offset);
}

let labelsEl = document.getElementById('labels');
if (!labelsEl) {
  labelsEl = document.createElement('div');
  labelsEl.id = 'labels';
  document.body.appendChild(labelsEl);
}
const labelCss = document.createElement('style');
labelCss.textContent = `
#labels { position: fixed; inset: 0; z-index: 8; pointer-events: none; overflow: hidden; }
.tag3d { position: absolute; left: 0; top: 0; display: grid; justify-items: center;
  padding: 4px 11px; border-radius: 99px; cursor: pointer; font: 500 .72rem/1 system-ui; letter-spacing: .04em;
  border: 1px solid color-mix(in srgb, var(--c) 70%, transparent);
  box-shadow: 0 0 16px -4px var(--c);
  background: color-mix(in srgb, var(--c) 14%, rgba(60,20,70,.65));
  backdrop-filter: blur(6px); color: var(--fg, #fff);
  opacity: 0; pointer-events: none; transition: opacity .35s, box-shadow .2s; will-change: transform; }
.tag3d.show { opacity: .85; pointer-events: auto; }
.tag3d.show:hover { opacity: 1; border-color: var(--c); box-shadow: 0 0 24px -2px var(--c); }
.tag3d b { font-weight: 500; }
.tag3d::after { content: ""; position: absolute; left: 50%; top: 100%; width: 1px; height: 14px;
  transform: translateX(-50%); background: linear-gradient(var(--c), transparent); }`;
document.head.appendChild(labelCss);
const labelEls = STATIONS.map((s) => {
  const el = document.createElement('button');
  el.className = 'tag3d';
  el.style.setProperty('--c', '#' + s.color.toString(16).padStart(6, '0'));
  el.innerHTML = `<b>${s.label}</b>`;
  el.addEventListener('click', () => flyTo(s));
  labelsEl.appendChild(el);
  return el;
});
const _lv = new THREE.Vector3();

function updateLabels() {
  labelEls.forEach((el, i) => {
    const s = STATIONS[i];
    _lv.copy(s.pos);
    _lv.y += CONFIG.labelHeight;
    const dist = camera.position.distanceTo(_lv);
    _lv.project(camera);
    const show = showLabels && active && !caseOpen && s.id !== activeId && _lv.z < 1 && Math.abs(_lv.x) < 1.1 && Math.abs(_lv.y) < 1.1;
    el.classList.toggle('show', show);
    if (!show) return;
    const x = (_lv.x * 0.5 + 0.5) * innerWidth, y = (-_lv.y * 0.5 + 0.5) * innerHeight;
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%)`;
    el.style.zIndex = Math.round(1000 - dist);
  });
}

/* =========================================================
   9 · BUCLE PRINCIPAL
   ========================================================= */
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  try {
    if (mixer) mixer.update(dt);
    if (active) {
      if (!caseOpen) updateButterfly(dt);    // con el modal abierto la mariposa se queda quieta
      updateCamera(dt);
      if (!caseOpen) updateProximity();
    } else {
      tilt.position.y = Math.sin(clock.elapsedTime * 2) * 0.1;
    }
    updateTheme(dt);
    scenery.update(dt, clock.elapsedTime, mode, fx, camera);
    islands.update(dt, clock.elapsedTime, mode);                // [ISLANDS]
    updateFx(dt, clock.elapsedTime);
    updateLabels();
  } catch (err) {
    if (!animate.failed) { animate.failed = true; console.error('Error en el bucle:', err); }
  }
  renderer.render(scene, camera);
}
animate();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});