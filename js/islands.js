import * as THREE from 'three';

/* =========================================================
   ISLAS FLOTANTES DE PROYECTO
   Cada estación con `island: true` recibe su propia isla:
   disco de pasto, roca invertida, cristales luminosos,
   anillo giratorio, destello y chispas orbitando.
   ========================================================= */
const rng = (s) => () => {
  s |= 0; s = (s + 0x6D2B79F5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
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

export function createIslands({ scene, stations }) {
  const root = new THREE.Group();
  scene.add(root);

  const glowTex = glowTexture();
  const R = 3.4;                                              // radio de la isla
  const rockDark = new THREE.Color(0x3a1a46), rockLight = new THREE.Color(0xa57fb5);
  const rockMat = new THREE.MeshStandardMaterial({ color: rockDark, flatShading: true, roughness: 1 });
  const items = [];

  stations.filter((s) => s.island).forEach((s, idx) => {
    const rnd = rng(100 + idx * 17);
    const col = new THREE.Color(s.color);

    const g = new THREE.Group();
    g.position.set(s.pos.x, s.pos.y - 0.9, s.pos.z);          // la superficie queda justo bajo el punto de la estación
    root.add(g);

    const topMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x3d1a4a).lerp(col, 0.3), emissive: col, emissiveIntensity: 0.1, flatShading: true, roughness: 0.9,
    });
    const glowMat = new THREE.MeshStandardMaterial({
      color: col, emissive: col, emissiveIntensity: 1, flatShading: true, roughness: 0.35,
    });
    const neonMat = new THREE.MeshBasicMaterial({ color: col });

    // Disco de pasto + roca invertida
    const top = new THREE.Mesh(new THREE.CylinderGeometry(R, R * 0.95, 0.5, 10), topMat);
    const rock = new THREE.Mesh(new THREE.ConeGeometry(R * 0.95, 4.2, 8), rockMat);
    rock.rotation.x = Math.PI;
    rock.position.y = -0.25 - 2.1;
    g.add(top, rock);

    // Rocas colgantes
    for (let k = 0; k < 4; k++) {
      const a = rnd() * Math.PI * 2, r = 1 + rnd() * 1.6, h = 0.9 + rnd() * 1.1;
      const m = new THREE.Mesh(new THREE.ConeGeometry(0.35 + rnd() * 0.3, h, 5), rockMat);
      m.rotation.x = Math.PI;
      m.position.set(Math.cos(a) * r, -3 - rnd() * 1.4, Math.sin(a) * r);
      g.add(m);
    }

    // Borde de neón
    const rim = new THREE.Mesh(new THREE.TorusGeometry(R, 0.05, 8, 64).rotateX(Math.PI / 2), neonMat);
    rim.position.y = 0.27;
    g.add(rim);

    // Cristal central
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.7), glowMat);
    crystal.scale.y = 2.3;
    crystal.position.y = 1.45;
    g.add(crystal);

    // Cristales menores alrededor
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2 + rnd() * 0.6, r = 1.8 + rnd() * 1.1, h = 0.3 + rnd() * 0.45;
      const c = new THREE.Mesh(new THREE.OctahedronGeometry(h), glowMat);
      c.scale.y = 2;
      c.position.set(Math.cos(a) * r, 0.25 + h, Math.sin(a) * r);
      c.rotation.y = rnd() * 6.28;
      g.add(c);
    }

    // Anillo giratorio sobre el cristal
    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.03, 8, 48), neonMat);
    halo.position.y = 1.5;
    halo.rotation.x = 0.4;
    g.add(halo);

    // Destello
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: col, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.6,
    }));
    glow.scale.setScalar(10);
    glow.position.y = 1.5;
    g.add(glow);

    // Chispas orbitando
    const sparks = [];
    for (let k = 0; k < 4; k++) {
      const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16 + rnd() * 0.14, 0), glowMat);
      g.add(m);
      sparks.push({ m, a: rnd() * 6.28, r: 4.3 + rnd() * 0.8, y: 0.6 + rnd() * 2.2, sp: 0.25 + rnd() * 0.3 });
    }

    items.push({ g, baseY: g.position.y, ph: rnd() * 6.28, crystal, halo, glow, sparks });
  });

  return {
    group: root,
    update(dt, t, mode) {
      rockMat.color.copy(rockDark).lerp(rockLight, mode);
      items.forEach((o) => {
        o.g.position.y = o.baseY + Math.sin(t * 0.8 + o.ph) * 0.18;
        o.crystal.rotation.y += dt * 0.5;
        o.halo.rotation.y += dt * 0.9;
        o.glow.material.opacity = (0.55 + Math.sin(t * 1.6 + o.ph) * 0.08) * (1 - 0.5 * mode);
        o.sparks.forEach((p) => {
          p.a += dt * p.sp;
          p.m.position.set(Math.cos(p.a) * p.r, p.y + Math.sin(t * 1.3 + p.a) * 0.25, Math.sin(p.a) * p.r);
        });
      });
    },
  };
}