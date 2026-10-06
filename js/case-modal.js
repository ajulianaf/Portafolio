import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { gsap } from 'gsap';
import { CASES } from './cases.js';

/* ---------- utilidades ---------- */
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = (v, d = 0) => (Number.isFinite(+v) ? +v : d);
const hexOk = (h) => (/^#[0-9a-f]{3,8}$/i.test(h) ? h : '#888888');
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const has = (a) => Array.isArray(a) && a.length > 0;
const list = (arr = [], cls = '') => `<ul class="${cls}">${arr.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;

const fig = (src, cap) => `
  <figure class="cs-fig" data-src="${esc(src)}">
    <img src="${esc(encodeURI(src))}" alt="${esc(cap)}" loading="lazy" onerror="this.parentNode.classList.add('missing');this.remove()" />
    <figcaption>${esc(cap)}</figcaption>
  </figure>`;

const metrics = (arr = []) => (has(arr) ? `<div class="cs-metrics">${arr.map((m) => `<div class="cs-metric"><b>${esc(m.n)}</b><span>${esc(m.l)}</span></div>`).join('')}</div>` : '');

const SECTIONS = [
  ['hero', 'Resumen'], ['context', 'Contexto'], ['research', 'Investigación'], ['definition', 'Definición'],
  ['ideation', 'Ideación'], ['ui', 'Diseño UI'], ['results', 'Resultados'],
];

/* =========================================================
   PESTAÑA 1 · PROCESO UX/UI
   (las secciones o bloques sin datos se omiten automáticamente)
   ========================================================= */
function journey(stages = []) {
  const n = stages.length;
  if (!n) return '';
  const pt = (s, i) => ({ x: ((i + 0.5) / n) * 100, y: 88 - ((clamp(num(s.emotion, 3), 1, 5) - 1) / 4) * 76 });
  const pts = stages.map(pt);
  return `
  <div class="cs-journey"><div class="cs-j-inner" style="--n:${n}">
    <div class="cs-j-row">${stages.map((s) => `<div><h5>${esc(s.stage)}</h5><p>${esc(s.action)}</p></div>`).join('')}</div>
    <div class="cs-j-chart" role="img" aria-label="Curva emocional del usuario">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="${pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')}" /></svg>
      ${pts.map((p, i) => `<i class="cs-dot" style="left:${p.x}%;top:${p.y}%" title="${esc(stages[i].note)}"></i>`).join('')}
      <span class="cs-j-hi">😊</span><span class="cs-j-lo">😞</span>
    </div>
    <div class="cs-j-row cs-j-notes">${stages.map((s) => `<div><small>${esc(s.note)}</small></div>`).join('')}</div>
  </div></div>`;
}

function iaTree(ia = []) {
  return `<ul class="cs-ia">${ia.map((n) => `<li><b>${esc(n.label)}</b>${n.children?.length ? list(n.children) : ''}</li>`).join('')}</ul>`;
}

function renderProcess(c) {
  const sec = (key, n, title, inner) => `<section class="cs-sec" id="cs-${key}" data-sec="${key}"><p class="cs-num">0${n}</p><h3>${esc(title)}</h3>${inner}</section>`;
  const h = c.hero, cx = c.context, rs = c.research, df = c.definition, id = c.ideation, ui = c.ui, rt = c.results || {};

  const showResults = has(rt.metrics) || has(rt.learnings);
  const visible = SECTIONS.filter(([k]) => k !== 'results' || showResults);

  const nav = `<nav class="cs-nav" aria-label="Secciones del caso">${visible.map(([k, t], i) => `<button data-go="${k}"${i === 0 ? ' class="on"' : ''}>${t}</button>`).join('')}</nav>`;

  const hero = `
  <section class="cs-sec cs-hero" id="cs-hero" data-sec="hero">
    <p class="cs-num">01 · Resumen</p>
    <p class="cs-lead">${esc(h.summary)}</p>
    ${has(h.meta) ? `<dl class="cs-meta">${h.meta.map((m) => `<div><dt>${esc(m.k)}</dt><dd>${esc(m.v)}</dd></div>`).join('')}</dl>` : ''}
    ${metrics(h.metrics)}
  </section>`;

  const context = sec('context', 2, 'Contexto y problema', `
    <div class="cs-two">
      <div><h4>¿Qué se quería resolver?</h4><p>${esc(cx.problem)}</p></div>
      <div><h4>¿Para quién?</h4><p>${esc(cx.audience)}</p></div>
    </div>
    ${has(cx.goals) ? `<h4>Objetivos</h4>${list(cx.goals, 'cs-check')}` : ''}`);

  const research = sec('research', 3, 'Investigación UX', `
    ${has(rs.methods) ? `<h4>Métodos</h4><div class="cs-chips">${rs.methods.map((m) => `<span>${esc(m)}</span>`).join('')}</div>` : ''}
    ${has(rs.findings) ? `<h4>Hallazgos clave</h4><ol class="cs-findings">${rs.findings.map((f) => `<li>${esc(f)}</li>`).join('')}</ol>` : ''}
    ${has(rs.survey) ? `<h4>Resultados de la encuesta</h4>
    <div class="cs-bars">${rs.survey.map((s) => `<div class="cs-bar"><span>${esc(s.label)}</span><div><i style="width:${clamp(num(s.pct), 0, 100)}%"></i></div><b>${clamp(num(s.pct), 0, 100)}%</b></div>`).join('')}</div>` : ''}
    ${rs.benchmark && has(rs.benchmark.rows) ? `<h4>Benchmarking</h4>
    <div class="cs-table"><table>
      <thead><tr>${rs.benchmark.headers.map((x) => `<th>${esc(x)}</th>`).join('')}</tr></thead>
      <tbody>${rs.benchmark.rows.map((r) => `<tr>${r.map((x) => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>` : ''}`);

  const definition = sec('definition', 4, 'Definición', `
    ${has(df.personas) ? `<h4>User personas</h4>
    <div class="cs-personas">${df.personas.map((p) => `
      <article class="cs-persona">
        <div class="cs-pavatar">${esc((p.name || '?').trim().charAt(0))}</div>
        <h5>${esc(p.name)}</h5><small>${esc(p.meta)}</small>
        <blockquote>“${esc(p.quote)}”</blockquote>
        <h6>Metas</h6>${list(p.goals)}<h6>Frustraciones</h6>${list(p.pains)}
      </article>`).join('')}</div>` : ''}
    ${has(df.journey) ? `<h4>User journey map</h4>${journey(df.journey)}` : ''}
    ${has(df.ia) ? `<h4>Arquitectura de la información</h4>${iaTree(df.ia)}` : ''}`);

  const ideation = sec('ideation', 5, 'Ideación y exploración', `
    <div class="cs-gallery cs-single">${fig((id.wireframe && id.wireframe.src) || 'assets/STC-LoFI.jpg', (id.wireframe && id.wireframe.caption) || 'Wireframe de baja fidelidad')}</div>    ${has(id.decisions) ? `<h4>Decisiones de diseño</h4>
    <div class="cs-cards">${id.decisions.map((d) => `<article><h5>${esc(d.title)}</h5><p>${esc(d.text)}</p></article>`).join('')}</div>` : ''}`);

  const uiSec = sec('ui', 6, 'Diseño final (UI)', `
    ${has(ui.palette) ? `<h4>Paleta de colores</h4>
    <div class="cs-palette">${ui.palette.map((p) => `<div><i style="background:${hexOk(p.hex)}"></i><b>${esc(p.name)}</b><small>${esc(p.hex)}</small></div>`).join('')}</div>` : ''}
    ${ui.type ? `<h4>Tipografía</h4>
    <div class="cs-type">
      <div><span style="font-family:'${esc(ui.type.display)}',system-ui,sans-serif">Aa</span><small>${esc(ui.type.display)} · Títulos</small></div>
      <div><span style="font-family:'${esc(ui.type.body)}',system-ui,sans-serif">Aa</span><small>${esc(ui.type.body)} · Texto</small></div>
    </div>
    <p class="cs-muted">${esc(ui.type.note)}</p>` : ''}
    ${has(ui.components) ? `<h4>Componentes</h4><div class="cs-chips">${ui.components.map((m) => `<span>${esc(m)}</span>`).join('')}</div>` : ''}
    ${has(ui.gallery) ? `<div class="cs-gallery">${ui.gallery.map((g) => fig(g.src, g.caption)).join('')}</div>` : ''}`);

  const results = showResults ? sec('results', 8, 'Resultados y aprendizajes', `
    ${metrics(rt.metrics)}
    ${has(rt.learnings) ? `<h4>Lecciones aprendidas</h4><ol class="cs-findings">${rt.learnings.map((l) => `<li>${esc(l)}</li>`).join('')}</ol>` : ''}`) : '';

  return nav + hero + context + research + definition + ideation + uiSec + results;
}

/* =========================================================
   PESTAÑA 2 · DEMO 3D (laptop / tablet / móvil)
   ========================================================= */
const K = 0.004;   // unidades 3D por píxel
const DEVICES = {
  desktop: { w: 1280, h: 800, radius: 6 },
  tablet:  { w: 768,  h: 1024, radius: 24 },
  mobile:  { w: 390,  h: 844, radius: 40 },
};
const sizeOf = (k) => ({ sw: DEVICES[k].w * K, sh: DEVICES[k].h * K });
const visible = (k) => {                       // área visible del dispositivo (para encuadrar la cámara)
  const { sw, sh } = sizeOf(k);
  return k === 'desktop' ? { w: sw + 1.0, h: sh + 0.7 } : k === 'tablet' ? { w: sw + 0.6, h: sh + 0.6 } : { w: sw + 0.5, h: sh + 0.5 };
};

function createDemo({ stageEl, glEl, loadEl, noteEls }) {
  let inited = false, running = false, raf = 0, ro = null, tl = null;
  let renderer, css3d, scene, camera, clock, light, glow, cssObj, wrap, frame;
  const groups = {}, anchors = {};
  const cam = { dist: 10 };
  let current = 'desktop', data = null;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const accent = () => {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    try { return new THREE.Color(v || '#ff7ac6'); } catch { return new THREE.Color('#ff7ac6'); }
  };

  function glowTexture() {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }

  function buildDevice(kind) {
    const { sw, sh } = sizeOf(kind);
    const g = new THREE.Group();
    const anchor = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x15122b, metalness: 0.75, roughness: 0.32 });

    if (kind === 'desktop') {
      const baseW = sw + 0.9, baseD = 2.7, lidH = sh + 0.28;
      const base = new THREE.Mesh(new RoundedBoxGeometry(baseW, 0.12, baseD, 3, 0.05), bodyMat);
      base.position.y = 0.06;
      const pad = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.9).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x241d44, roughness: 0.5, metalness: 0.4 }));
      pad.position.set(0, 0.125, 0.6);
      const lid = new THREE.Group();
      lid.position.set(0, 0.12, -baseD / 2 + 0.1);
      lid.rotation.x = -0.18;
      const frame = new THREE.Mesh(new RoundedBoxGeometry(sw + 0.28, lidH, 0.1, 3, 0.05), bodyMat);
      frame.position.y = lidH / 2 + 0.02;
      anchor.position.set(0, lidH / 2 + 0.02, 0.056);
      lid.add(frame, anchor);
      g.add(base, pad, lid);
      g.position.y = -(sh + 0.32) / 2;
    } else if (kind === 'tablet') {
      const frame = new THREE.Mesh(new RoundedBoxGeometry(sw + 0.34, sh + 0.34, 0.12, 4, 0.14), bodyMat);
      anchor.position.z = 0.062;
      g.add(frame, anchor);
    } else {
      const frame = new THREE.Mesh(new RoundedBoxGeometry(sw + 0.2, sh + 0.2, 0.1, 4, 0.22), bodyMat);
      const btn = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.4, 0.05), bodyMat);
      btn.position.set((sw + 0.2) / 2 + 0.01, 0.5, 0);
      anchor.position.z = 0.056;
      g.add(frame, btn, anchor);
    }
    anchors[kind] = anchor;
    g.visible = kind === 'desktop';
    return g;
  }

  function init() {
    inited = true;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    glEl.appendChild(renderer.domElement);

    css3d = new CSS3DRenderer();
    css3d.domElement.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none';
    glEl.appendChild(css3d.domElement);

    clock = new THREE.Clock();
    scene.add(new THREE.HemisphereLight(0xb9c4ff, 0x1a1033, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(3, 5, 6); scene.add(key);
    light = new THREE.PointLight(0xff7ac6, 14, 18, 2); light.position.set(-3, 1, 4); scene.add(light);
    glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.45 }));
    glow.scale.setScalar(12); glow.position.z = -2; scene.add(glow);

    Object.keys(DEVICES).forEach((k) => { groups[k] = buildDevice(k); scene.add(groups[k]); });

    wrap = document.createElement('div');
    wrap.style.cssText = 'background:#fff;overflow:hidden;pointer-events:auto;box-shadow:0 0 40px rgba(255,255,255,.12)';
    frame = document.createElement('iframe');
    frame.title = 'Demo interactiva';
    frame.setAttribute('allow', 'fullscreen');
    frame.style.cssText = 'display:block;width:100%;height:100%;border:0;background:#fff';
    frame.addEventListener('load', () => loadEl.classList.remove('on'));
    wrap.appendChild(frame);
    cssObj = new CSS3DObject(wrap);
    cssObj.scale.setScalar(K);

    ro = new ResizeObserver(resize);
    ro.observe(stageEl);
  }

  function sizeWrap(kind) {
    const d = DEVICES[kind];
    wrap.style.width = d.w + 'px';
    wrap.style.height = d.h + 'px';
    wrap.style.borderRadius = d.radius + 'px';
    anchors[kind].add(cssObj);
  }

  function fitDist(kind) {
    const v = visible(kind), t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    return Math.max(v.h / 2 / t, v.w / 2 / (t * camera.aspect)) * 1.12;
  }

  function resize() {
    if (!inited) return;
    const w = stageEl.clientWidth, h = stageEl.clientHeight;
    if (w < 2 || h < 2) return;
    renderer.setSize(w, h, false);
    css3d.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    cam.dist = fitDist(current);
  }

  const urlFor = (kind) => data.demo.urls?.[kind] || data.demo.url;

  function setFrame(url) {
    if (frame.dataset.url === url) return;
    loadEl.classList.add('on');
    frame.dataset.url = url;
    frame.src = url || 'about:blank';
    if (!url) loadEl.classList.remove('on');
  }

  function updateNote(kind) {
    const n = data.demo.notes?.[kind] || {};
    noteEls.title.textContent = n.title || '';
    noteEls.text.textContent = n.text || '';
    noteEls.size.textContent = `${DEVICES[kind].w} × ${DEVICES[kind].h} px`;
  }

  function switchTo(kind, instant = false) {
    if (!inited || !data) return;
    if (data.demo.desktopOnly && kind !== 'desktop') return;        // caso solo escritorio
    if (tl) { tl.progress(1); tl.kill(); tl = null; }
    if (kind === current && !instant) return;
    const out = groups[current], inn = groups[kind], same = kind === current;
    current = kind;
    updateNote(kind);

    const apply = () => {
      Object.values(groups).forEach((g) => { g.visible = false; });
      inn.visible = true;
      sizeWrap(kind);
      const u = urlFor(kind);
      if (frame.dataset.url !== u) setFrame(u);
      else if (data.demo.reloadOnSwitch && !instant) { frame.src = 'about:blank'; setTimeout(() => { frame.src = u; }, 30); }
    };

    if (instant || same) { apply(); inn.scale.setScalar(1); cam.dist = fitDist(kind); return; }

    tl = gsap.timeline({ onComplete: () => { tl = null; } });
    tl.to(wrap, { opacity: 0, duration: 0.15 })
      .to(out.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.28, ease: 'power2.in' }, 0)
      .add(() => { apply(); inn.scale.setScalar(0.001); })
      .to(inn.scale, { x: 1, y: 1, z: 1, duration: 0.55, ease: 'back.out(1.4)' })
      .to(wrap, { opacity: 1, duration: 0.3 }, '<0.2');
    gsap.to(cam, { dist: fitDist(kind), duration: 0.85, ease: 'power3.inOut', overwrite: true });
  }

  function loop() {
    raf = requestAnimationFrame(loop);
    const t = clock.getElapsedTime();
    if (!reduce) groups[current].rotation.y = Math.sin(t * 0.5) * 0.1;
    camera.position.set(0, 0, cam.dist);
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    css3d.render(scene, camera);
  }

  return {
    show(caseData) {
      const first = !inited;
      if (first) init();
      data = caseData;
      const c = accent();
      light.color.copy(c);
      glow.material.color.copy(c);
      // Reinicia siempre en escritorio con el iframe del caso actual
      Object.values(groups).forEach((g) => { g.scale.setScalar(1); });
      current = 'desktop';
      wrap.style.opacity = 1;
      frame.dataset.url = '';
      switchTo('desktop', true);
      resize();
      cam.dist = fitDist('desktop');
      if (!running) { running = true; clock.start(); loop(); }
    },
    switchTo,
    pause() { running = false; cancelAnimationFrame(raf); },
    stop() {
      running = false; cancelAnimationFrame(raf);
      if (tl) { tl.kill(); tl = null; }
      if (inited) { frame.src = 'about:blank'; frame.dataset.url = ''; loadEl.classList.remove('on'); }
    },
    get current() { return current; },
  };
}

/* =========================================================
   MODAL
   ========================================================= */
export function createCaseModal({ onOpen, onClose } = {}) {
  const $ = (id) => document.getElementById(id);
  const modal = $('case-modal'), body = $('case-body'), closeBtn = $('case-close');
  const procPane = $('case-proc'), demoPane = $('case-demo');
  const tabs = [...modal.querySelectorAll('[role="tab"]')];

  const demo = createDemo({
    stageEl: $('demo-stage'), glEl: $('demo-gl'), loadEl: $('demo-loading'),
    noteEls: { title: $('demo-note-title'), text: $('demo-note-text'), size: $('demo-note-size') },
  });
  const openLink = $('demo-open');
  const devBtns = [...modal.querySelectorAll('[data-device]')];
  const devicesEl = modal.querySelector('.demo-devices');

  let isOpen = false, currentId = null, tab = 'proc', opener = null, spy = null;

  function selectTab(name) {
    tab = name;
    tabs.forEach((t) => {
      const on = t.dataset.tab === name;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
    });
    procPane.hidden = name !== 'proc';
    demoPane.hidden = name !== 'demo';
    body.classList.toggle('is-demo', name === 'demo');
    if (name === 'demo') {
      const c = CASES[currentId];
      devBtns.forEach((b) => b.classList.toggle('on', b.dataset.device === 'desktop'));
      devicesEl.hidden = !!c.demo.desktopOnly;                       // solo escritorio: se ocultan Tablet y Móvil
      openLink.href = c.demo.external || c.demo.url || '#';
      openLink.hidden = !(c.demo.external || c.demo.url);
      requestAnimationFrame(() => demo.show(c));
    } else {
      demo.pause();
      body.scrollTop = 0;
    }
  }

  function setupSpy() {
    spy?.disconnect();
    const btns = [...procPane.querySelectorAll('.cs-nav [data-go]')];
    spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        btns.forEach((b) => b.classList.toggle('on', b.dataset.go === e.target.dataset.sec));
      });
    }, { root: body, rootMargin: '-25% 0px -65% 0px' });
    procPane.querySelectorAll('.cs-sec').forEach((s) => spy.observe(s));
  }

  function open(id, openerEl) {
    const c = CASES[id];
    if (!c) { console.warn(`No hay caso "${id}" en cases.js`); return false; }
    currentId = id;
    opener = openerEl || document.activeElement;
    $('case-eyebrow').textContent = c.eyebrow;
    $('case-title').textContent = c.title;
    procPane.innerHTML = renderProcess(c);
    setupSpy();
    selectTab('proc');
    body.scrollTop = 0;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    isOpen = true;
    onOpen?.(id);
    setTimeout(() => closeBtn.focus({ preventScroll: true }), 50);
    return true;
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    demo.stop();
    spy?.disconnect();
    onClose?.();
    opener?.focus?.({ preventScroll: true });
  }

  /* eventos */
  closeBtn.addEventListener('click', close);
  modal.querySelector('.case-backdrop').addEventListener('click', close);
  tabs.forEach((t) => t.addEventListener('click', () => selectTab(t.dataset.tab)));
  $('case-tabs').addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const i = tabs.findIndex((t) => t.dataset.tab === tab);
    const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    selectTab(n.dataset.tab); n.focus();
  });
  procPane.addEventListener('click', (e) => {
    const b = e.target.closest('[data-go]');
    if (!b) return;
    document.getElementById('cs-' + b.dataset.go)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  devBtns.forEach((b) => b.addEventListener('click', () => {
    devBtns.forEach((x) => x.classList.toggle('on', x === b));
    demo.switchTo(b.dataset.device);
  }));

  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;                       // foco atrapado dentro del modal
    const f = [...modal.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')].filter((el) => el.offsetParent !== null && !el.disabled);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  return { open, close, get isOpen() { return isOpen; } };
}