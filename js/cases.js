/* =========================================================
   CONTENIDO DE LOS CASOS DE ESTUDIO
   Edita textos, métricas e imágenes. Si una imagen no existe,
   el modal muestra un recuadro con la ruta donde debes ponerla.
   ========================================================= */
const FIGMA_PROTO = 'https://www.figma.com/proto/Ar4RSP2pW3M7tx8UeFVgPG/Three-Star?node-id=15-721&p=f&t=PeWDfCJFZydnP32f-0&scaling=scale-down&content-scaling=fixed&page-id=15%3A719';
const figmaEmbed = (u) => 'https://www.figma.com/embed?embed_host=share&url=' + encodeURIComponent(u) + '&hide-ui=1&scaling=scale-down-width';

/* Notas de diseño responsivo (se muestran en la tarjeta inferior de la demo) */
const NOTES = {
  desktop: { title: 'Escritorio · 1280 px', text: 'Navegación completa visible, rejilla de 12 columnas y catálogo en tarjetas de 3–4 por fila.' },
  tablet:  { title: 'Tablet · 768 px',      text: 'El menú se compacta, la rejilla pasa a 2 columnas y los objetivos táctiles crecen a 44 px como mínimo.' },
  mobile:  { title: 'Móvil · 390 px',       text: 'Menú hamburguesa, una sola columna, botones a ancho completo y acciones principales al alcance del pulgar.' },
};

/* Plantilla base: cada caso reemplaza lo que necesite */
const tpl = () => ({
  eyebrow: 'Caso de estudio · UX/UI',
  title: 'Proyecto',
  hero: {
    summary: 'Resume el proyecto en una o dos frases: qué hiciste y cuál fue el resultado.',
    meta: [
      { k: 'Mi rol', v: 'UX/UI Designer' },
      { k: 'Duración', v: 'X semanas' },
      { k: 'Equipo', v: 'Describe tu equipo' },
      { k: 'Herramientas', v: 'Figma, ...' },
    ],
    metrics: [
      { n: 'XX%', l: 'Métrica de impacto 1' },
      { n: 'XX%', l: 'Métrica de impacto 2' },
      { n: 'X.X', l: 'Métrica de impacto 3' },
    ],
    cover: 'assets/caso/portada.jpg',
  },
  context: {
    problem: 'Describe qué problema se quería resolver y por qué era importante.',
    audience: 'Describe para quién: perfiles de usuario, contexto de uso y necesidades principales.',
    goals: ['Objetivo de negocio', 'Objetivo de usuario', 'Objetivo de producto'],
  },
  research: {
    methods: ['Encuestas', 'Entrevistas', 'Benchmarking', 'Análisis de analítica'],
    findings: [
      'Hallazgo clave 1: lo que descubriste y por qué importa.',
      'Hallazgo clave 2.',
      'Hallazgo clave 3.',
    ],
    survey: [
      { label: 'Resultado de encuesta 1', pct: 70 },
      { label: 'Resultado de encuesta 2', pct: 45 },
      { label: 'Resultado de encuesta 3', pct: 28 },
    ],
    benchmark: {
      headers: ['Referente', 'Fortaleza', 'Debilidad', 'Oportunidad'],
      rows: [
        ['Competidor A', '...', '...', '...'],
        ['Competidor B', '...', '...', '...'],
      ],
    },
  },
  definition: {
    personas: [
      { name: 'Persona 1', meta: 'Edad · Rol', quote: 'Frase que resume su necesidad.', goals: ['Meta 1', 'Meta 2'], pains: ['Dolor 1', 'Dolor 2'] },
      { name: 'Persona 2', meta: 'Edad · Rol', quote: 'Frase que resume su necesidad.', goals: ['Meta 1', 'Meta 2'], pains: ['Dolor 1', 'Dolor 2'] },
    ],
    journey: [
      { stage: 'Descubrir', action: 'Qué hace el usuario', emotion: 3, note: 'Oportunidad' },
      { stage: 'Explorar',  action: 'Qué hace el usuario', emotion: 2, note: 'Punto de fricción' },
      { stage: 'Decidir',   action: 'Qué hace el usuario', emotion: 4, note: 'Oportunidad' },
      { stage: 'Contactar', action: 'Qué hace el usuario', emotion: 5, note: 'Momento clave' },
    ],
    ia: [
      { label: 'Inicio', children: ['Propuesta de valor', 'Destacados'] },
      { label: 'Catálogo', children: ['Categorías', 'Ficha de producto'] },
      { label: 'Nosotros', children: [] },
      { label: 'Contacto', children: [] },
    ],
  },
  ideation: {
    gallery: [
      { src: 'assets/caso/boceto-1.jpg', caption: 'Bocetos iniciales a mano' },
      { src: 'assets/caso/wireframes.png', caption: 'Wireframes de baja fidelidad' },
    ],
    decisions: [
      { title: 'Decisión 1', text: 'Qué decidiste, qué alternativas descartaste y por qué.' },
      { title: 'Decisión 2', text: 'Explica el razonamiento detrás del cambio.' },
    ],
  },
  ui: {
    palette: [
      { name: 'Aubergine', hex: '#662d72' },
      { name: 'Magenta neón', hex: '#ff7ac6' },
      { name: 'Cian', hex: '#00e5ff' },
      { name: 'Morado profundo', hex: '#3c1446' },
      { name: 'Texto', hex: '#fdf0ff' },
    ],
    type: { display: 'Poppins', body: 'Inter', note: 'Escala tipográfica: 12 / 14 / 16 / 20 / 28 / 40 px' },
    components: ['Botones', 'Tarjetas de producto', 'Menú', 'Formularios', 'Chips de filtro', 'Alertas'],
    gallery: [{ src: 'assets/caso/ui-final.jpg', caption: 'Pantallas finales de alta fidelidad' }],
  },
  usability: {
    setup: 'Describe cuántas personas participaron, qué tareas se probaron y cómo (moderado o no moderado).',
    findings: [
      { issue: 'Qué falló en la prueba', fix: 'Qué cambiaste para resolverlo' },
      { issue: 'Segundo problema encontrado', fix: 'Iteración aplicada' },
    ],
  },
  results: {
    metrics: [
      { n: 'XX%', l: 'Resultado final 1' },
      { n: 'XX%', l: 'Resultado final 2' },
      { n: 'XX', l: 'Resultado final 3' },
    ],
    learnings: ['Aprendizaje 1', 'Aprendizaje 2', 'Qué haría diferente'],
  },
  demo: { url: '', external: '', notes: NOTES },
});

const stc = tpl();
const ts = tpl();
const artis = tpl();

export const CASES = {
  /* ---------- ISLA 1 · STComunicaciones ---------- */
  STC: {
    ...stc,
    eyebrow: 'Caso de estudio 01 · UX/UI',
    title: 'STComunicaciones',
    hero: {
      ...stc.hero,
      summary: 'Creación e implementación de la plataforma web corporativa desde cero, con un catálogo claro y accesible.',
      cover: 'assets/stc/portada.jpg',
    },
    ideation: {
      ...stc.ideation,
      gallery: [
        { src: 'assets/stc/boceto-1.jpg', caption: 'Bocetos iniciales' },
        { src: 'assets/stc/wireframes.png', caption: 'Wireframes de baja fidelidad' },
      ],
    },
    ui: { ...stc.ui, gallery: [{ src: 'assets/stc/ui-final.jpg', caption: 'Diseño final' }] },
    demo: {
      url: 'https://www.stcomunicaciones.com.co',
      external: 'https://www.stcomunicaciones.com.co',
      reloadOnSwitch: false,       // true = recarga el sitio al cambiar de dispositivo
      notes: NOTES,
    },
  },

  /* ---------- ISLA 2 · Three Star ---------- */
  ThreeStar: {
    ...ts,
    eyebrow: 'Caso de estudio 02 · UX/UI',
    title: 'Three Star',
    hero: {
      ...ts.hero,
      summary: 'Proceso completo de diseño UI/UX en Figma, desde wireframes de baja fidelidad hasta un prototipo interactivo de alta fidelidad.',
      cover: 'assets/threestar/portada.jpg',
    },
    ideation: {
      ...ts.ideation,
      gallery: [{ src: 'assets/Wireframe Lo-Fi.png', caption: 'Wireframes de baja fidelidad' }],
    },
    ui: { ...ts.ui, gallery: [{ src: 'assets/threestar/ui-final.jpg', caption: 'Pantallas de alta fidelidad' }] },
    demo: {
      url: figmaEmbed(FIGMA_PROTO),
      external: FIGMA_PROTO,
      // Un prototipo de Figma es un marco fijo: se escala, no se reorganiza.
      // Si tienes un prototipo por dispositivo, pon aquí su enlace:
      // urls: { desktop: figmaEmbed('...'), tablet: figmaEmbed('...'), mobile: figmaEmbed('...') },
      notes: {
        ...NOTES,
        desktop: { title: 'Prototipo · escritorio', text: 'Flujo completo navegable. Haz clic dentro de la pantalla para recorrer el prototipo.' },
        tablet:  { title: 'Prototipo · tablet', text: 'El marco del prototipo se escala al ancho de la pantalla. Para ver un diseño distinto, enlaza un prototipo propio de tablet.' },
        mobile:  { title: 'Prototipo · móvil', text: 'El marco se escala al ancho del móvil. Para un diseño vertical real, enlaza un prototipo móvil en cases.js.' },
      },
    },
  },

  /* ---------- ISLA 3 (NUEVA) · Artis ---------- */
  Artis: {
    ...artis,
    eyebrow: 'Caso de estudio 03 · UX/UI',
    title: 'Artis',
    hero: {
      ...artis.hero,
      summary: 'Describe aquí qué es Artis, para quién es y qué resultado lograste. (Texto de ejemplo: reemplázalo.)',
      cover: 'assets/artis/portada.jpg',
    },
    ideation: {
      ...artis.ideation,
      gallery: [
        { src: 'assets/artis/boceto-1.jpg', caption: 'Bocetos iniciales' },
        { src: 'assets/artis/wireframes.png', caption: 'Wireframes de baja fidelidad' },
      ],
    },
    ui: { ...artis.ui, gallery: [{ src: 'assets/artis/ui-final.jpg', caption: 'Diseño final de Artis' }] },
    demo: {
      url: '',                      // ← pega aquí la URL del sitio o el enlace de prototipo (figmaEmbed('...'))
      external: '',                 // ← enlace para "Abrir en pestaña nueva"
      reloadOnSwitch: false,
      notes: {
        ...NOTES,
        desktop: { title: 'Artis · escritorio', text: 'Añade la URL en cases.js (demo.url) para ver aquí el proyecto en vivo.' },
      },
    },
  },
};