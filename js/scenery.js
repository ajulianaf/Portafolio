import * as THREE from 'three';

/* ★ [SCENERY] Ajustes rápidos */
const CFG = {
  seaY: -16,          // altura del mar de nubes (bájalo si tapa la isla)
  ridgeFar: 105,      // radio de la cordillera lejana
  ridgeNear: 78,      // radio de la cordillera cercana
  isletCount: 14,     // cantidad de islotes flotantes
  isletMin: 30,       // distancia mínima al centro
  isletMax: 75,       // distancia máxima al centro
  orbPos: new THREE.Vector3(-70, 14, -165),   // luna/sol relativo a la cámara
};

const rng = (s) => () => {
  s |= 0; s = (s + 0x6D2B79F5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const C = (h) => new THREE.Color(h);
const TAIL = '#include <tonemapping_fragment>\n#include <colorspace_fragment>';

/* Colores de cada modo (oscuro / claro) */
const P = {
  dark: {
    domeTop: C(0x140f2e), domeHor: C(0x4a2f86), domeBot: C(0x1b1240),
    ridgeFar: C(0x3a2a78), ridgeNear: C(0x241a52),
    sea: C(0x3a2a7a), seaGlow: C(0xff6fd8),
    orb: C(0xf1ecff), orbGlow: C(0xb9a8ff),
    rock: C(0x3a2f66), grass: C(0x2f9fb0),
  },
  light: {
    domeTop: C(0x7fa8ff), domeHor: C(0xfff0e6), domeBot: C(0xcfe0ff),
    ridgeFar: C(0x9db7ee), ridgeNear: C(0x7f9fe0),
    sea: C(0xffffff), seaGlow: C(0xffd9f2),
    orb: C(0xfff2b0), orbGlow: C(0xffe08a),
    rock: C(0x8f86b8), grass: C(0x6fdc9a),
  },
};

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.35, 'rgba(255,255,255,0.35)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export function createScenery({ scene, colors = [0xff4fd8, 0x9d6bff, 0x00e5ff, 0xffd479] }) {
  const root = new THREE.Group();
  scene.add(root);
  const follow = new THREE.Group();      // lo que sigue a la cámara (cielo, luna)
  scene.add(follow);
  const glowTex = glowTexture();

  /* ---------- CIELO (degradado) ---------- */
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(200, 32, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      uniforms: { uTop: { value: new THREE.Color() }, uHor: { value: new THREE.Color() }, uBot: { value: new THREE.Color() } },
      vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: `uniform vec3 uTop; uniform vec3 uHor; uniform vec3 uBot; varying vec3 vD;
        void main(){ float h = vD.y;
          vec3 c = h > 0.0 ? mix(uHor, uTop, smoothstep(0.0, 0.55, h)) : mix(uHor, uBot, smoothstep(0.0, -0.45, h));
          gl_FragColor = vec4(c, 1.0);
          ${TAIL}
        }`,
    })
  );
  dome.renderOrder = -10;
  dome.frustumCulled = false;
  follow.add(dome);

  /* ---------- LUNA / SOL ---------- */
  const orb = new THREE.Mesh(new THREE.SphereGeometry(13, 32, 16), new THREE.MeshBasicMaterial({ fog: false, toneMapped: false }));
  orb.position.copy(CFG.orbPos);
  const orbGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, opacity: 0.8,
  }));
  orbGlow.scale.setScalar(100);
  orbGlow.position.copy(CFG.orbPos);
  follow.add(orb, orbGlow);

  /* ---------- CORDILLERAS ---------- */
  function makeRidge(radius, base, amp, seed) {
    const rnd = rng(seed), p = [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28];
    const SEG = 220, pos = [], hh = [], idx = [];
    for (let i = 0; i <= SEG; i++) {
      const a = (i / SEG) * Math.PI * 2, x = Math.cos(a) * radius, z = Math.sin(a) * radius;
      const n = 0.5 + 0.5 * (0.5 * Math.sin(a * 3 + p[0]) + 0.3 * Math.sin(a * 7 + p[1]) + 0.2 * Math.sin(a * 13 + p[2]));
      const peak = 0.55 + 0.45 * Math.abs(Math.sin(a * 9 + p[1]));
      pos.push(x, -30, z, x, base + amp * n * peak, z);
      hh.push(0, 1);
      if (i < SEG) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('aH', new THREE.Float32BufferAttribute(hh, 1));
    geo.setIndex(idx);
    const mat = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: { uTop: { value: new THREE.Color() }, uBot: { value: new THREE.Color() } },
      vertexShader: 'attribute float aH; varying float vH; void main(){ vH = aH; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: `uniform vec3 uTop; uniform vec3 uBot; varying float vH;
        void main(){ gl_FragColor = vec4(mix(uBot, uTop, smoothstep(0.0, 1.0, vH)), 1.0); ${TAIL} }`,
    });
    const m = new THREE.Mesh(geo, mat);
    m.renderOrder = -6;
    m.frustumCulled = false;
    return m;
  }
  const ridgeFar = makeRidge(CFG.ridgeFar, 8, 26, 11);
  const ridgeNear = makeRidge(CFG.ridgeNear, 2, 16, 29);
  root.add(ridgeFar, ridgeNear);

  /* ---------- MAR DE NUBES ---------- */
  function makeSea(y, scale, speed) {
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      uniforms: { uTime: { value: 0 }, uCol: { value: new THREE.Color() }, uGlow: { value: new THREE.Color() }, uScale: { value: scale }, uSpeed: { value: speed } },
      vertexShader: 'varying vec2 vP; void main(){ vP = (modelMatrix * vec4(position, 1.0)).xz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: `uniform float uTime; uniform vec3 uCol; uniform vec3 uGlow; uniform float uScale; uniform float uSpeed; varying vec2 vP;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }
        float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a * noise(p); p *= 2.0; a *= 0.5; } return v; }
        void main(){
          vec2 p = vP * uScale + vec2(uTime * uSpeed, uTime * uSpeed * 0.6);
          float n = fbm(p + fbm(p * 1.7 + uTime * 0.02));
          float edge = 1.0 - smoothstep(95.0, 148.0, length(vP));
          float a = smoothstep(0.32, 0.78, n) * 0.85 * edge;
          vec3 c = mix(uCol, uGlow, smoothstep(0.5, 0.9, n) * 0.6);
          gl_FragColor = vec4(c, a);
          ${TAIL}
        }`,
    });
    const m = new THREE.Mesh(new THREE.CircleGeometry(150, 64).rotateX(-Math.PI / 2), mat);
    m.position.y = y;
    m.renderOrder = -4;
    m.frustumCulled = false;
    return m;
  }
  const seaA = makeSea(CFG.seaY, 0.045, 0.010);
  const seaB = makeSea(CFG.seaY - 12, 0.03, 0.006);
  root.add(seaB, seaA);

  /* ---------- ISLOTES FLOTANTES ---------- */
  const decor = new THREE.Group();
  root.add(decor);
  const rnd = rng(77);
  const rockMat = new THREE.MeshStandardMaterial({ flatShading: true, roughness: 1 });
  const grassMat = new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.9 });
  const islets = [];

  for (let i = 0; i < CFG.isletCount; i++) {
    const g = new THREE.Group(), s = 1.8 + rnd() * 3.2, accent = new THREE.Color(colors[i % colors.length]);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(s, s * 0.92, 0.5, 8), grassMat);
    const rock = new THREE.Mesh(new THREE.ConeGeometry(s * 0.92, s * 1.9, 6), rockMat);
    rock.rotation.x = Math.PI;
    rock.position.y = -0.25 - s * 0.95;
    g.add(top, rock);

    const glowMat = new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.9, flatShading: true, roughness: 0.4 });
    const kind = i % 3;
    if (kind === 0) {                                   // cristal
      const c = new THREE.Mesh(new THREE.OctahedronGeometry(s * 0.35), glowMat);
      c.scale.y = 2.4; c.position.y = 0.25 + s * 0.8;
      g.add(c);
    } else if (kind === 1) {                            // árbol luminoso
      for (let k = 0; k < 3; k++) {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(s * (0.55 - k * 0.14), s * 0.9, 7), glowMat);
        cone.position.y = 0.25 + s * (0.45 + k * 0.5);
        g.add(cone);
      }
    } else {                                            // hongo
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.1, s * 0.14, s * 0.7, 6), rockMat);
      stem.position.y = 0.25 + s * 0.35;
      const cap = new THREE.Mesh(new THREE.SphereGeometry(s * 0.5, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), glowMat);
      cap.position.y = 0.25 + s * 0.7;
      g.add(stem, cap);
    }
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: accent, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.55,
    }));
    glow.scale.setScalar(s * 3.4);
    glow.position.y = 0.25 + s * 0.9;
    g.add(glow);

    const ang = rnd() * Math.PI * 2, r = CFG.isletMin + rnd() * (CFG.isletMax - CFG.isletMin);
    const y = -22 + rnd() * 28;
    g.position.set(Math.cos(ang) * r, y, Math.sin(ang) * r);
    g.rotation.y = rnd() * 6.28;
    decor.add(g);
    islets.push({ g, y, ph: rnd() * 6.28, sp: 0.3 + rnd() * 0.4, glow });
  }

  /* ---------- ACTUALIZACIÓN ---------- */
  const _c = new THREE.Color();
  const mix = (a, b, m) => _c.copy(a).lerp(b, m);

  return {
    update(dt, t, mode, fx, camera) {
      const D = P.dark, Lt = P.light;
      follow.position.copy(camera.position);

      dome.material.uniforms.uTop.value.copy(mix(D.domeTop, Lt.domeTop, mode));
      dome.material.uniforms.uHor.value.copy(mix(D.domeHor, Lt.domeHor, mode));
      dome.material.uniforms.uBot.value.copy(mix(D.domeBot, Lt.domeBot, mode));

      orb.material.color.copy(mix(D.orb, Lt.orb, mode));
      orbGlow.material.color.copy(mix(D.orbGlow, Lt.orbGlow, mode));

      const haze = mix(D.domeHor, Lt.domeHor, mode).clone();
      ridgeFar.material.uniforms.uTop.value.copy(mix(D.ridgeFar, Lt.ridgeFar, mode));
      ridgeFar.material.uniforms.uBot.value.copy(haze);
      ridgeNear.material.uniforms.uTop.value.copy(mix(D.ridgeNear, Lt.ridgeNear, mode));
      ridgeNear.material.uniforms.uBot.value.copy(haze);

      [seaA, seaB].forEach((s) => {
        s.material.uniforms.uTime.value = t;
        s.material.uniforms.uCol.value.copy(mix(D.sea, Lt.sea, mode));
        s.material.uniforms.uGlow.value.copy(mix(D.seaGlow, Lt.seaGlow, mode));
      });

      rockMat.color.copy(mix(D.rock, Lt.rock, mode));
      grassMat.color.copy(mix(D.grass, Lt.grass, mode));

      decor.visible = fx > 0.02;                         // "Mínimo" oculta islotes (más ligero)
      islets.forEach((o) => {
        o.g.position.y = o.y + Math.sin(t * o.sp + o.ph) * 0.8;
        o.g.rotation.y += dt * 0.03;
        o.glow.material.opacity = 0.55 * (1 - 0.6 * mode);
      });
    },
  };
}