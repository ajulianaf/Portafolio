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
    wireframe: { src: 'assets/caso/wireframe.png', caption: 'Wireframe de baja fidelidad' },
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
      wireframe: { src: 'assets/STC-LoFI.jpg', caption: 'Wireframe de baja fidelidad' },
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
     Three Star · contenido real
     --------------------------------------------------------- */
  ThreeStar: {
    eyebrow: 'Caso de estudio 02 · UX/UI',
    title: 'Three Star',

    hero: {
      summary: 'Diseño del prototipo interactivo UX/UI y de la plataforma web de Three Star, un estudio independiente de videojuegos integrado por tres ingenieros multimedia y desarrolladores. El sitio funciona como hub oficial para dar a conocer el estudio y su universo jugable principal, Soul Bond, e integra una tienda e-commerce de merchandising exclusivo: coleccionables, prendas y accesorios del juego.',
      meta: [
        { k: 'Mi rol', v: 'Diseñadora UX/UI (proyecto unipersonal)' },
        { k: 'Duración', v: '4 semanas' },
        { k: 'Herramientas', v: 'Figma (prototipado interactivo, auto-layout, variantes y sistema de diseño)' },
        { k: 'Entregables', v: 'Prototipo navegable de alta fidelidad para escritorio y sistema de componentes UI' },
      ],
      metrics: [],
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
      wireframe: { src: 'assets/Wireframe Lo-Fi.png', caption: 'Wireframe de baja fidelidad' },
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

    results: { metrics: [], learnings: [] },

    demo: {
      url: figmaEmbed(FIGMA_PROTO),
      external: FIGMA_PROTO,
      desktopOnly: true,           // solo escritorio: se ocultan los botones Tablet y Móvil
      notes: {
        ...NOTES,
        desktop: { title: 'Prototipo · escritorio', text: 'Prototipo navegable de alta fidelidad. Haz clic dentro de la pantalla para recorrer el flujo.' },
      },
    },
  },
};