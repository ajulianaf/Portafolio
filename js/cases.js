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
  /* ---------- ISLA 1 · STComunicaciones (contenido real) ---------- */
  STC: {
    ...stc,
    eyebrow: 'Caso de estudio 01 · UX/UI',
    title: 'STComunicaciones',

    hero: {
      ...stc.hero,
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
      survey: [],        // sin encuesta: la sección debe ocultarse
      benchmark: null,   // sin benchmarking: la sección debe ocultarse
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
      journey: [],       // sin user journey
      ia: [
        { label: 'Inicio', children: ['Banner principal de promociones y ofertas', 'Productos destacados (carrusel)'] },
        { label: 'Ubicación', children: ['Información del punto de atención en Tunja, Boyacá'] },
        { label: 'Equipos', children: ['Catálogo de telefonía celular y smartphones'] },
        { label: 'Tecnología', children: ['Oferta de servicios (internet, televisión y accesorios)'] },
      ],
    },

    ideation: {
      ...stc.ideation,
      gallery: [
        { src: 'assets/STC-LoFI.jpg', caption: 'Wireframe de baja fidelidad' },
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
      gallery: [],
    },

    usability: null,                            // sin pruebas de usabilidad: la sección debe ocultarse
    results: { metrics: [], learnings: [] },    // sin resultados

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

  /* ---------- ISLA 2 · Three Star (contenido real) ---------- */
  ThreeStar: {
    ...ts,
    eyebrow: 'Caso de estudio 02 · UX/UI',
    title: 'Three Star',

    hero: {
      ...ts.hero,
      summary: 'Diseño del prototipo interactivo UX/UI y de la plataforma web de Three Star, un estudio independiente de videojuegos integrado por tres ingenieros multimedia y desarrolladores. El sitio funciona como hub oficial para dar a conocer el estudio y su universo jugable principal, Soul Bond, e integra una tienda e-commerce de merchandising exclusivo: coleccionables, prendas y accesorios del juego.',
      meta: [
        { k: 'Mi rol', v: 'Diseñadora UX/UI (proyecto unipersonal)' },
        { k: 'Duración', v: '4 semanas' },
        { k: 'Herramientas', v: 'Figma (prototipado interactivo, auto-layout, variantes y sistema de diseño)' },
        { k: 'Entregables', v: 'Prototipo navegable de alta fidelidad para escritorio y sistema de componentes UI' },
      ],
      metrics: [],
      cover: 'assets/threestar/portada.jpg',
    },

    context: {
      problem: 'Three Star necesitaba una plataforma propia con un doble propósito: presentar la identidad del estudio indie ante la comunidad y los inversionistas, y ofrecer un punto de encuentro para los jugadores de Soul Bond. Había que centralizar en un solo lugar la narrativa del juego, el lore, el equipo creador y la venta de merchandising, sin perder la atmósfera fantástica del videojuego.',
      audience: 'Jugadores y comunidad de Soul Bond: gamers y fans del universo interactivo que buscan novedades, el trasfondo de la historia o adquirir coleccionables oficiales. Nuevos jugadores y exploradores: personas que descubren el proyecto por primera vez y quieren entender de qué trata el videojuego y quiénes están detrás de su desarrollo.',
      goals: [
        'Negocio: posicionar la marca del estudio Three Star y validar la estructura de monetización directa mediante la tienda de merchandising de Soul Bond.',
        'Usuario: permitir a los fans explorar la historia del juego (Soul Bond), conocer al equipo (Nosotros) y navegar por el catálogo de productos de forma fluida.',
        'Producto: diseñar una interfaz temática e inmersiva con tonos místicos y violetas que represente el concepto de los tres sapos de colores del estudio.',
      ],
    },

    research: {
      methods: [
        'Análisis de webs de estudios indie y videojuegos',
        'Evaluación de arquitectura para hubs de videojuegos',
      ],
      findings: [
        'Identidad del estudio como gancho: la historia detrás del nombre (tres amigos e ingenieros representados por tres sapos de colores) genera empatía y conexión directa con la comunidad de gamers.',
        'Conexión lore y merchandising: quienes compran productos de un juego indie buscan llevarse una pieza del universo, como la Bitácora, el Cofre o los peluches de personajes.',
        'Flujo de compra directo: el e-commerce integrado debe permitir seleccionar productos y ver el checkout de forma simple dentro de la misma experiencia de marca.',
      ],
      survey: [],
      benchmark: null,
    },

    definition: {
      personas: [
        {
          name: 'Mateo Silva',
          meta: '22 años · Gamer e hincha de los videojuegos indie',
          quote: 'Quiero ver de qué trata Soul Bond, ver sus trailers y consultar el precio del peluche o la camiseta del personaje que me gustó.',
          goals: [
            'Descubrir la propuesta de juego de Soul Bond en la sección interactiva.',
            'Explorar la tienda y ver la oferta de merchandising oficial.',
          ],
          pains: [
            'Páginas de juegos con enlaces rotos a las tiendas o sin información sobre los creadores.',
          ],
        },
        {
          name: 'Valentina Cruz',
          meta: '25 años · Diseñadora de juegos / comunidad de desarrollo',
          quote: 'Me interesa conocer qué estudio está detrás del proyecto y cuál es su trayectoria.',
          goals: [
            'Conocer la historia de Three Star y a sus tres fundadores en la pestaña Nosotros.',
          ],
          pains: [
            'Webs de estudios frías que no muestran a las personas reales detrás del desarrollo.',
          ],
        },
      ],
      journey: [],
      ia: [
        { label: 'Inicio', children: ['Banner principal con branding de los 3 sapos', 'Productos destacados'] },
        { label: 'Soul Bond', children: ['Sección principal del videojuego: lore, trailers e historia'] },
        { label: 'Tienda', children: ['Selección de productos: tote bags, bitácoras, cofres, camisetas, peluches, etc.', 'Flujo de pago / checkout (modales de compra y confirmación)'] },
        { label: 'Nosotros', children: ['Historia del estudio, los 3 ingenieros fundadores y los sapos de colores'] },
      ],
    },

    ideation: {
      ...ts.ideation,
      gallery: [{ src: 'assets/Wireframe Lo-Fi.png', caption: 'Wireframe de baja fidelidad' }],
      decisions: [
        {
          title: 'Decisión de maquetación',
          text: 'Se definió un menú de navegación global (Inicio, Soul Bond, Tienda, Nosotros). Para la Tienda se ideó un catálogo dinámico tipo matriz: al hacer clic en un producto (peluche, bitácora, cofre) se despliega la ficha y la vista previa sin sacar al usuario de la vista general.',
        },
        {
          title: 'Representación de la marca (tres sapos)',
          text: 'Se integraron los sapos de colores del logo en secciones clave como Inicio y Nosotros, para reforzar el branding del equipo creador.',
        },
        {
          title: 'Modales de compra integrados',
          text: 'Para no romper la inmersión del sitio, la compra y el pago (Comprar / Pagar) se manejan con ventanas flotantes sobre el mismo universo visual.',
        },
      ],
    },

    ui: {
      palette: [
        { name: 'Violeta místico', hex: '#7B61FF' },
        { name: 'Morado noche', hex: '#6C5DD3' },
        { name: 'Amarillo dorado', hex: '#FFD028' },
      ],
      type: {
        display: 'Display creativa',
        body: 'Sans-serif limpia',
        note: 'Display creativa para el logotipo y los títulos de Three Star y Soul Bond; sans-serif limpia para las descripciones de productos, historias y textos de interfaz.',
      },
      components: [
        'Tarjetas de catálogo interactivo (variantes activa / inactiva)',
        'Modales de checkout con formulario de pago',
        'Tarjetas de presentación del equipo fundador',
      ],
      gallery: [],
    },

    usability: null,
    results: { metrics: [], learnings: [] },

    demo: {
      url: figmaEmbed(FIGMA_PROTO),
      external: FIGMA_PROTO,
      // Un prototipo de Figma es un marco fijo: se escala, no se reorganiza.
      // Si tienes un prototipo por dispositivo, pon aquí su enlace:
      // urls: { desktop: figmaEmbed('...'), tablet: figmaEmbed('...'), mobile: figmaEmbed('...') },
      notes: {
        ...NOTES,
        desktop: { title: 'Prototipo · escritorio', text: 'Prototipo navegable de alta fidelidad. Haz clic dentro de la pantalla para recorrer el flujo.' },
        tablet:  { title: 'Prototipo · tablet', text: 'El marco del prototipo se escala al ancho de la pantalla. Para ver un diseño distinto, enlaza un prototipo propio de tablet.' },
        mobile:  { title: 'Prototipo · móvil', text: 'El marco se escala al ancho del móvil. Para un diseño vertical real, enlaza un prototipo móvil en cases.js.' },
      },
    },
  },

  /* ---------- ISLA 3 · Artis (contenido a partir de tu mapa de empatía, mapa de sitio, flujo y bocetos) ---------- */
  Artis: {
    ...artis,
    eyebrow: 'Caso de estudio 03 · UX/UI',
    title: 'Artis',

    hero: {
      ...artis.hero,
      summary: 'Diseño UX/UI de Artis, una plataforma pensada para artistas que quieren enseñar, aprender y colaborar en tiempo real en un mismo lugar, con un lienzo compartido, chat, perfiles y un entorno seguro con moderación y opciones de privacidad. Fue un trabajo en grupo en el que participé en la documentación del proceso y en el desarrollo del prototipo.',
      meta: [
        { k: 'Mi rol', v: 'Diseñadora UX/UI · apoyo en la documentación del proceso y el desarrollo del prototipo' },
        { k: 'Equipo', v: 'Proyecto grupal' },
        { k: 'Duración', v: 'X semanas' },                 // ← completa
        { k: 'Herramientas', v: 'Figma' },                  // ← ajusta si usaste otras
      ],
      metrics: [],
      cover: 'assets/artis/portada.jpg',
    },

    context: {
      problem: 'Los artistas no encuentran una plataforma donde puedan enseñar y aprender al mismo tiempo. Deben combinar varias apps para lo que les gustaría hacer en una sola, las redes como Instagram o Facebook no están pensadas específicamente para ellos, y muchos sitios solo muestran el resultado final, no el paso a paso del proceso creativo.',
      audience: 'Artistas (en especial de arte digital) que quieren mejorar sus habilidades, aprender nuevas técnicas, crecer junto a otros artistas y colaborar sin sentirse juzgados, en un ambiente seguro donde su contenido esté protegido.',
      goals: [
        'Negocio: posicionar Artis como una red pensada para artistas, que reúna enseñanza, colaboración y visibilidad en un solo lugar.',
        'Usuario: compartir su obra, colaborar en tiempo real y recibir crítica honesta sin necesidad de usar apps externas.',
        'Producto: ofrecer una interfaz clara y accesible, con moderación y opciones de privacidad que protejan el contenido de los artistas.',
      ],
    },

    research: {
      methods: ['Mapa de empatía'],
      findings: [
        'Buscan algo más que publicar una imagen: quieren ser parte de una comunidad donde mejorar, aprender técnicas nuevas y crecer como artistas.',
        'Las plataformas actuales se quedan cortas: muchas se enfocan en un solo servicio, son principalmente promocionales o solo muestran el resultado final, no el proceso.',
        'La colaboración en línea es valorada: los artistas conocen historias de otros que crecieron gracias a colaborar y piden recomendaciones de apps donde hacerlo en tiempo real.',
        'La confianza es clave: sienten inseguridad de que su contenido sea plagiado o no esté protegido, y buscan ambientes con moderación y privacidad.',
      ],
      survey: [],
      benchmark: null,
    },

    definition: {
      personas: [
        {
          name: 'Artista en crecimiento',
          meta: 'Usuaria tipo · Mapa de empatía',
          quote: '¿Conoces una app donde pueda colaborar en tiempo real?',
          goals: [
            'Sentirse parte de una red con propósito artístico y colaboración real.',
            'Participar en proyectos colaborativos sin necesidad de usar apps externas.',
            'Aprender de otros artistas sin sentirse juzgada.',
          ],
          pains: [
            'No encuentra una plataforma donde enseñar y aprender al mismo tiempo.',
            'Debe usar diferentes apps para lo que le gustaría hacer en una sola.',
            'Inseguridad de que su contenido sea plagiado o no esté protegido.',
            'Interfaces complicadas o poco accesibles, y no obtener beneficios económicos por su arte.',
          ],
        },
      ],
      journey: [],
      ia: [
        { label: 'Registro de usuario / Iniciar sesión', children: [] },
        { label: 'Inicio', children: [] },
        { label: 'Explorar', children: [] },
        { label: 'Perfil', children: [] },
        { label: 'Lienzo', children: [] },
        { label: 'Chat', children: [] },
        { label: 'Notificaciones', children: [] },
        { label: 'Configuración', children: [] },
        { label: 'Soporte', children: [] },
      ],
    },

    ideation: {
      ...artis.ideation,
      gallery: [
        { src: 'assets/artis/mapa-de-empatia.png',   caption: 'Mapa de empatía de la usuaria tipo' },
        { src: 'assets/artis/mapa-de-sitio.png',     caption: 'Mapa de sitio: arquitectura de información de Artis' },
        { src: 'assets/artis/flujo-de-usuario.png',  caption: 'Flujo de usuario' },
        { src: 'assets/artis/bocetos.png',           caption: 'Bocetos a mano de las pantallas principales' },
      ],
      decisions: [
        {
          title: 'Una sola plataforma para enseñar, aprender y colaborar',
          text: 'Para resolver el problema de usar varias apps, la arquitectura reúne en un mismo producto nueve áreas: Registro, Inicio, Explorar, Perfil, Lienzo, Chat, Notificaciones, Configuración y Soporte.',
        },
        {
          title: 'Lienzo y Chat como núcleo de la colaboración',
          text: 'Los artistas piden colaborar en tiempo real, por eso el Lienzo y el Chat tienen sus propias secciones dentro de la navegación principal.',
        },
        {
          title: 'Privacidad y soporte a la vista',
          text: 'Ante la preocupación por el plagio y la falta de moderación, Configuración y Soporte forman parte de la estructura desde el inicio.',
        },
        {
          title: 'Bocetos en papel antes de Figma',
          text: 'Se exploraron a mano pantallas de inicio, listado de chats, perfil y un "radar" tipo mapa con captura de imagen, antes de pasar a wireframes digitales.',
        },
      ],
    },

    ui: null,                                  // pendiente: aún no hay información de UI final
    usability: null,
    results: { metrics: [], learnings: [] },

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