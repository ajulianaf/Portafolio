/* =========================================================
   SOBRE MÍ · modal estilo Y2K (tarjeta Polaroid + chat interactivo)
   Se abre con cualquier botón que tenga el atributo data-about.
   Edita los textos en las constantes INFO y ANSWERS.
   ========================================================= */

const INFO = {
  name: 'Angy Juliana',
  initials: 'AJ',
  role: 'Ingeniera en Multimedia',
  photo: 'assets/foto .jpg',                 // si no existe, se muestran las iniciales
  place: 'Tunja, Boyacá',
  email: 'angy.farasica9a@gmail.com',
  phone: '+57 310 241 7847',                  // ← CAMBIA ESTE NÚMERO por el tuyo (se muestra tal cual)
  phoneHref: '+573102417847',                 // ← mismo número sin espacios, para el enlace de llamada
  cv: 'assets/CV-Angy-Farasica.pdf',          // ← ruta de tu hoja de vida (PDF) dentro del proyecto
  cvName: 'CV-Angy-Farasica.pdf',             // nombre con el que se descarga
};

const SVG = {
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.2L4.6 7 4 8l8 5.6L20 8l-.6-1z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.250.2 2.450.570 3.6a1 1 0 0 1-.250 1z"/></svg>',
  download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 3h2v9.2l3.3-3.3 1.4 1.4L12 16.1l-5.7-5.8 1.4-1.4L11 12.2zM5 18h14v3H5z"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M19 12H5m6-7-7 7 7 7"/></svg>',
  user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="4" fill="currentColor"/><path fill="currentColor" d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z"/></svg>',
};

/* Íconos de tecnologías (SVG simplificados) */
const TECH = [
  { name: 'Figma', svg: '<svg viewBox="0 0 24 24"><path fill="#F24E1E" d="M8 2h4v6H8a3 3 0 1 1 0-6z"/><path fill="#FF7262" d="M12 2h4a3 3 0 0 1 0 6h-4z"/><path fill="#A259FF" d="M8 8h4v6H8a3 3 0 1 1 0-6z"/><circle cx="15" cy="11" r="3" fill="#1ABCFE"/><path fill="#0ACF83" d="M12 14v3a3 3 0 1 1-3-3z"/></svg>' },
  { name: 'React', svg: '<svg viewBox="0 0 24 24"><g fill="none" stroke="#61DAFB" stroke-width="1.2"><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></g><circle cx="12" cy="12" r="1.8" fill="#61DAFB"/></svg>' },
  { name: 'HTML5', svg: '<svg viewBox="0 0 24 24"><path fill="#E44D26" d="M3 2l1.6 18L12 22l7.4-2L21 2z"/><path fill="#F16529" d="M12 20.2V3.8h7.2l-1.4 14.8z"/><text x="12" y="16" text-anchor="middle" font-size="10" font-weight="700" fill="#fff" font-family="system-ui">5</text></svg>' },
  { name: 'CSS3', svg: '<svg viewBox="0 0 24 24"><path fill="#1572B6" d="M3 2l1.6 18L12 22l7.4-2L21 2z"/><path fill="#33A9DC" d="M12 20.2V3.8h7.2l-1.4 14.8z"/><text x="12" y="16" text-anchor="middle" font-size="10" font-weight="700" fill="#fff" font-family="system-ui">3</text></svg>' },
  { name: 'JavaScript', svg: '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="3" fill="#F7DF1E"/><text x="13" y="18" text-anchor="middle" font-size="10" font-weight="800" fill="#222" font-family="system-ui">JS</text></svg>' },
];

/* Texto de presentación (las palabras dentro de <mark> salen en rosa) */
const INTRO = 'Hola, puedes llamarme <mark>Angy</mark>. Soy <mark>Ingeniera en Multimedia</mark> con enfoque en <mark>Diseño UX/UI</mark> e <mark>investigación de usuarios</mark>. Combino creatividad, pensamiento centrado en el usuario y desarrollo para transformar necesidades en soluciones <mark>funcionales, intuitivas y atractivas</mark>.';

/* Respuestas rápidas: pregunta del visitante + respuesta de Angy */
const ANSWERS = {
  edu: {
    q: '¿Dónde estudiaste?',
    html: `<p>Estudio <mark>Ingeniería en Multimedia</mark> en la <mark>Universidad de Boyacá</mark> 🎓</p>
           <div class="ab-item"><b>Ingeniería en Multimedia</b><span>Universidad de Boyacá</span></div>`,
  },
  exp: {
    q: '¿Qué experiencia tienes?',
    html: `<p>Estos son mis proyectos más recientes 💼</p>
           <div class="ab-item"><b>STComunicaciones</b><span>Diseño y desarrollo frontend de la plataforma web corporativa en Tunja, con una interfaz inspirada en la arquitectura visual de <mark>Claro Colombia</mark>.</span></div>
           <div class="ab-item"><b>Three Star · Soul Bond</b><span>Diseño UX/UI en Figma del prototipo interactivo y la tienda de merchandising del estudio.</span></div>`,
  },
  stack: {
    q: '¿Qué herramientas usas?',
    html: `<p>Mi <mark>stack tecnológico</mark> 🛠️</p>
           <ul class="ab-stack">${TECH.map((t) => `<li title="${t.name}">${t.svg}<span>${t.name}</span></li>`).join('')}</ul>`,
  },
};

const STARS = [
  [6, 8, 1.2, 0], [92, 6, 1.6, .6], [48, 3, .9, 1.2], [97, 46, 1.1, .3], [3, 52, 1.4, .9],
  [14, 93, 1.0, 1.5], [86, 90, 1.5, .2], [60, 96, .9, 1.1], [30, 5, .8, .7], [75, 12, 1.0, 1.8],
];

export function createAboutModal({ onOpen, onClose } = {}) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const avatarMe = `<span class="ab-av ab-av-me"><b>${INFO.initials}</b><img src="${INFO.photo}" alt="" onerror="this.remove()" /></span>`;
  const avatarUser = `<span class="ab-av ab-av-user">${SVG.user}</span>`;

  const root = document.createElement('div');
  root.id = 'about-modal';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Sobre mí');
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = `
    <div class="ab-backdrop"></div>
    <div class="ab-panel">
      ${STARS.map(([x, y, s, d]) => `<i class="ab-star" style="left:${x}%;top:${y}%;--s:${s}rem;--d:${d}s" aria-hidden="true">✦</i>`).join('')}
      <button class="ab-close" aria-label="Cerrar">✕</button>

      <div class="ab-grid">
        <!-- Columna izquierda: Polaroid -->
        <section class="ab-left">
          <article class="ab-polaroid">
            <span class="ab-tape" aria-hidden="true"></span>
            <div class="ab-photo">
              <b>${INFO.initials}</b>
              <img src="${INFO.photo}" alt="Foto de ${INFO.name}" onerror="this.remove()" />
            </div>
            <h2 class="ab-name">${INFO.name}</h2>
            <p class="ab-role">${INFO.role}</p>
            <ul class="ab-contact">
              <li>${SVG.pin}<span>${INFO.place}</span></li>
              <li>${SVG.mail}<a href="mailto:${INFO.email}">${INFO.email}</a></li>
              <li>${SVG.phone}<a href="tel:${INFO.phoneHref}">${INFO.phone}</a></li>
            </ul>
            <a class="ab-cv" href="${INFO.cv}" download="${INFO.cvName}">${SVG.download}<span>Descargar CV</span></a>
          </article>
        </section>

        <!-- Columna derecha: Chat -->
        <section class="ab-chat" aria-label="Chat">
          <header class="ab-chat-head">
            <button class="ab-back" aria-label="Volver al perfil" title="Volver">${SVG.back}</button>
            ${avatarMe}
            <div><b>Angy</b><small><i class="ab-dot"></i> en línea</small></div>
            <span class="ab-chat-deco" aria-hidden="true">✧ ✦ ✧</span>
          </header>
          <div class="ab-log" id="ab-log" role="log" aria-live="polite"></div>
          <footer class="ab-replies" id="ab-replies">
            <button data-q="edu" disabled>🎓 Educación</button>
            <button data-q="exp" disabled>💼 Experiencia</button>
            <button data-q="stack" disabled>🛠️ Stack Tecnológico</button>
          </footer>
        </section>
      </div>
    </div>`;
  document.body.appendChild(root);

  const log = root.querySelector('#ab-log');
  const replies = [...root.querySelectorAll('#ab-replies button')];
  const closeBtn = root.querySelector('.ab-close');
  const backBtn = root.querySelector('.ab-back');

  let isOpen = false, busy = false, opener = null, timers = [];
  const later = (fn, ms) => { const t = setTimeout(fn, reduce ? Math.min(ms, 60) : ms); timers.push(t); return t; };
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
  const toBottom = () => log.scrollTo({ top: log.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });

  function bubble(side, html) {
    const el = document.createElement('div');
    el.className = `ab-msg ${side}`;
    el.innerHTML = `${side === 'user' ? avatarUser : avatarMe}<div class="ab-bubble">${html}</div>`;
    log.appendChild(el);
    toBottom();
    return el;
  }

  /* Muestra "···" y luego el texto real de la burbuja de Angy */
  function reply(html, wait, done) {
    const el = bubble('me', '<span class="ab-typing" aria-label="Escribiendo"><i></i><i></i><i></i></span>');
    const box = el.querySelector('.ab-bubble');
    later(() => {
      box.innerHTML = html;
      box.classList.add('in');
      toBottom();
      done?.();
    }, wait);
  }

  function setBusy(v) {
    busy = v;
    replies.forEach((b) => { b.disabled = v || b.classList.contains('used'); });
  }

  function start() {
    clearTimers();
    log.innerHTML = '';
    replies.forEach((b) => b.classList.remove('used'));
    setBusy(true);
    later(() => {
      bubble('user', '¿Quién eres?');
      later(() => reply(INTRO, 1500, () => setBusy(false)), 450);
    }, 350);
  }

  replies.forEach((b) => b.addEventListener('click', () => {
    if (busy || b.classList.contains('used')) return;
    const a = ANSWERS[b.dataset.q];
    if (!a) return;
    b.classList.add('used');
    setBusy(true);
    bubble('user', a.q);
    later(() => reply(a.html, 1000, () => setBusy(false)), 350);
  }));

  function open(openerEl) {
    if (isOpen) return;
    isOpen = true;
    opener = openerEl || document.activeElement;
    root.classList.add('open');
    root.setAttribute('aria-hidden', 'false');
    onOpen?.();
    start();
    setTimeout(() => closeBtn.focus({ preventScroll: true }), 50);
  }

  function close(opts) {
    if (!isOpen) return;
    isOpen = false;
    clearTimers();
    root.classList.remove('open');
    root.setAttribute('aria-hidden', 'true');
    onClose?.(opts);
    opener?.focus?.({ preventScroll: true });
  }

  closeBtn.addEventListener('click', () => close());
  backBtn.addEventListener('click', () => close({ back: true }));   // flecha: vuelve a la tarjeta de perfil
  root.querySelector('.ab-backdrop').addEventListener('click', () => close());
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;                                  // foco atrapado dentro del modal
    const f = [...root.querySelectorAll('button:not(:disabled), a[href]')].filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  return { open, close, get isOpen() { return isOpen; } };
}