/* =========================================================
   CONTENIDO DE LOS CASOS DE ESTUDIO
   Edita textos, métricas e imágenes. Si una imagen no existe,
   el modal muestra un recuadro con la ruta donde debes ponerla.
   Las secciones con listas vacías ([]) o sin datos se ocultan solas.
   ========================================================= */
const FIGMA_PROTO = 'https://www.figma.com/proto/Ar4RSP2pW3M7tx8UeFVgPG/Three-Star?node-id=15-721&p=f&t=PeWDfCJFZydnP32f-0&scaling=scale-down&content-scaling=fixed&page-id=15%3A719';
const figmaEmbed = (u) => 'https://www.figma.com/embed?embed_host=share&url=' + encodeURIComponent(u) + '&hide-ui=1&scaling=scale-down-width';

/* Notas de diseño responsivo (se muestran en la tarjeta inferior de la demo) */
const NOTES = {
  desktop: { title: 'Escritorio · 1280 px', text: 'Navegación completa visible, rejilla de 12 columnas y catálogo en tarjetas de 3–4 por fila.' },
  tablet:  { title: 'Tablet · 768 px',      text: 'El menú se compacta, la rejilla pasa a 2 columnas y los objetivos táctiles crecen a 44 px como mínimo.' },
  mobile:  { title: 'Móvil · 390 px',       text: 'Menú hamburguesa, una sola columna, botones a ancho completo y acciones principales al alcance del pulgar.' },
};

/* Plantilla base (se usa en los casos que aún no tienen contenido real) */
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
      { name: 'Primario', hex: '#ff4fd8' },
      { name: 'Secundario', hex: '#9d6bff' },
      { name: 'Acento', hex: '#00e5ff' },
      { name: 'Fondo', hex: '#140f2e' },
      { name: 'Texto', hex: '#f2f4ff' },
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

const ts = tpl();

export const CASES = {
  /* ---------------------------------------------------------
     STComunicaciones · contenido real
     --------------------------------------------------------- */
  STC: {
    eyebrow: 'Caso de estudio 01 · UX/UI',
    title: 'STComunicaciones',

    hero: {
      summary: 'Diseño y desarrollo frontend desde cero de la plataforma web corporativa de STComunicaciones, aliados estratégicos en Tunja, Boyacá. Ante la falta de presencia en redes sociales, la empresa lanzó su sitio oficial enfocado en el mercado B2C para dar visibilidad a su catálogo: telefonía celular, equipos móviles, paquetes de internet y servicios de televisión.',
      meta: [
        { k: 'Mi rol', v: 'Diseñadora & Desarrolladora Frontend (proyecto unipersonal)' },
        { k: 'Duración', v: '8 semanas' },
        { k: 'Cliente', v: 'STComunicaciones · Tunja, Boyacá' },
        { k: 'Herramientas', v: 'Figma, HTML5, CSS3, JavaScript' },
      ],
      metrics: [],
      cover: 'assets/stc/portada.jpg',
    },

    context: {
      problem: 'STComunicaciones opera en Tunja, Boyacá, pero no contaba con canales digitales ni presencia fuerte en redes sociales para mostrar sus productos. Los usuarios no tenían cómo consultar el catálogo actualizado de equipos celulares ni la oferta de servicios sin desplazarse a la tienda física.',
      audience: 'Clientes B2C (particulares y familias de Tunja y alrededores): personas que buscan adquirir un smartphone, renovar su equipo celular o contratar servicios de internet y televisión, y que necesitan consultar secciones específicas de la web de forma clara.',
      goals: [
        'Negocio: establecer el primer punto de presencia digital de la marca en Tunja para captar clientes B2C e impulsar la venta de equipos celulares y servicios.',
        'Usuario: navegar por las secciones de la web (Inicio, Ubicación, Equipos, Tecnología) para explorar la oferta disponible desde cualquier dispositivo.',
        'Producto: crear una plataforma web con navegación por menú estructurada, liviana y fácil de usar, construida con HTML, CSS y JS e inspirada en la arquitectura visual de la interfaz oficial de Claro Colombia.',
      ],
    },

    research: {
      methods: [
        'Observación directa y consulta con el cliente',
        'Análisis de la plataforma de Claro Colombia',
      ],
      findings: [
        'El celular es el producto estrella: la mayoría de los usuarios busca primero renovar o comprar un teléfono antes de consultar planes de hogar.',
        'Navegación estructurada: los usuarios prefieren un menú claro (Inicio, Ubicación, Equipos, Tecnología) para ir directo a la sección de su interés.',
        'Reconocimiento de marca: al estar alineados visualmente con la línea de Claro Colombia, el usuario siente mayor familiaridad y confianza al navegar.',
      ],
      survey: [],        // sin encuesta: la sección se oculta
      benchmark: null,   // sin tabla de benchmarking: la sección se oculta
    },

    definition: {
      personas: [
        {
          name: 'Andrea Páez',
          meta: '24 años · Estudiante universitaria en Tunja',
          quote: 'Quiero entrar a la sección de equipos, ver qué celulares tienen disponibles y sus características antes de ir a comprarlo.',
          goals: [
            'Ir directamente a la pestaña de equipos celulares y comparar modelos.',
            'Consultar la sección de ubicación para saber cómo llegar a la tienda física en Tunja.',
          ],
          pains: [
            'Sitios web lentos o sin catálogo visual claro.',
            'Dificultad para encontrar la dirección o el punto de atención de la tienda.',
          ],
        },
        {
          name: 'Roberto Camargo',
          meta: '45 años · Padre de familia',
          quote: 'Busco un paquete de internet y televisión para mi casa, pero quiero navegar por la web sin enredarme.',
          goals: [
            'Consultar la oferta de servicios de hogar y tecnología.',
            'Solicitar asesoría de cobertura en su barrio en Tunja.',
          ],
          pains: [
            'Menús confusos o enlaces que no llevan a la sección correcta.',
          ],
        },
      ],
      journey: [],       // sin user journey: la sección se oculta
      ia: [
        { label: 'Inicio', children: ['Banner principal de promociones y ofertas', 'Productos destacados (carrusel)'] },
        { label: 'Ubicación', children: ['Información del punto de atención en Tunja, Boyacá'] },
        { label: 'Equipos', children: ['Catálogo de telefonía celular y smartphones'] },
        { label: 'Tecnología', children: ['Oferta de servicios (internet, televisión y accesorios)'] },
      ],
    },

    ideation: {
      gallery: [
        { src: 'assets/stc/boceto-1.jpg', caption: 'Bocetos iniciales' },
        { src: 'assets/stc/wireframes.png', caption: 'Wireframes de baja fidelidad' },
      ],
      decisions: [
        {
          title: 'Decisión de maquetación',
          text: 'Se definieron bocetos en Figma organizando el sitio con una barra de navegación superior (header) que permite desplazarse entre páginas y secciones de forma intuitiva, manteniendo la telefonía celular como protagonista en los bloques destacados de la portada.',
        },
        {
          title: 'Línea gráfica inspirada en Claro Colombia',
          text: 'Se adaptaron patrones conocidos: encabezado rojo distintivo con el menú principal (Inicio, Ubicación, Equipos, Tecnología), contenedores blancos limpios, carrusel de promociones y tarjetas de producto con botones de acción contrastantes, para brindar un entorno familiar.',
        },
        {
          title: 'Barra de navegación global',
          text: 'Se implementó una barra superior fija y accesible, con menú desplegable en móviles, para que el usuario siempre pueda cambiar de sección sin perderse.',
        },
      ],
    },

    ui: {
      palette: [
        { name: 'Rojo marca', hex: '#DA291C' },
        { name: 'Fondo', hex: '#FFFFFF' },
        { name: 'Fondo alterno', hex: '#F4F4F4' },
        { name: 'Texto', hex: '#212529' },
        { name: 'Texto secundario', hex: '#6C757D' },
      ],
      type: {
        display: 'Roboto',
        body: 'Arial',
        note: 'Sans-serif limpia (Roboto / Arial / Helvetica): clara, legible y estándar para un rendimiento óptimo con HTML y CSS nativos.',
      },
      components: [
        'Header / menú de navegación',
        'Slider / carrusel de ofertas',
        'Tarjetas de producto',
        'Menú hamburguesa (móvil)',
      ],
      gallery: [{ src: 'assets/stc/ui-final.jpg', caption: 'Diseño final' }],
    },

    usability: {
      setup: 'Durante la maquetación en HTML5, CSS y JS se realizaron pruebas de funcionamiento directamente en el navegador.',
      findings: [
        {
          issue: 'En pantallas móviles de celulares de gama media/baja, el carrusel de ofertas desalineaba el menú superior.',
          fix: 'Se ajustó la grilla (CSS Grid / Flexbox) y las media queries para que el menú y las tarjetas de producto fueran 100% responsivos.',
        },
        {
          issue: 'El menú de navegación ocupaba mucho espacio vertical en teléfonos.',
          fix: 'Se implementó un menú desplegable tipo hamburguesa con JavaScript que colapsa las opciones (Inicio, Ubicación, Equipos, Tecnología) en pantallas pequeñas.',
        },
      ],
    },

    results: { metrics: [], learnings: [] },   // sin resultados: la sección se oculta

    demo: {
      url: 'https://www.stcomunicaciones.com.co',
      external: 'https://www.stcomunicaciones.com.co',
      reloadOnSwitch: false,       // true = recarga el sitio al cambiar de dispositivo
      notes: {
        desktop: { title: 'Escritorio · 1280 px', text: 'Header rojo con el menú completo visible: Inicio, Ubicación, Equipos y Tecnología.' },
        tablet:  { title: 'Tablet · 768 px',      text: 'Grilla con CSS Grid / Flexbox y media queries para que el menú y las tarjetas de producto se adapten al ancho.' },
        mobile:  { title: 'Móvil · 390 px',       text: 'El menú se colapsa en un desplegable tipo hamburguesa y las tarjetas de producto se reorganizan para pantallas pequeñas.' },
      },
    },
  },

  /* ---------------------------------------------------------
     Three Star · pendiente de contenido real (usa la plantilla)
     --------------------------------------------------------- */
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
      desktopOnly: true,           // solo escritorio: se ocultan los botones Tablet y Móvil
      notes: {
        ...NOTES,
        desktop: { title: 'Prototipo · escritorio', text: 'Flujo completo navegable. Haz clic dentro de la pantalla para recorrer el prototipo.' },
      },
    },
  },
};