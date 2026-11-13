/* ==========================================================
   Datos de los proyectos.
   Para agregar un proyecto, copia un objeto y cambia sus datos.
   - folder: "web" (Programación) o "3d" (3D & Animación)
   - img: ruta de la imagen, o null para mostrar un espacio vacío
   ========================================================== */
const PROJECTS = [
  /* ---------- Programación ---------- */
  {
    id: "aplicacion-tareas", folder: "web", tag: "JavaScript · DOM",
    title: "Aplicación de Tareas",
    short: "To-Do List con inicio de sesión y tareas guardadas por usuario.",
    desc: "Gestor de tareas con inicio de sesión: cada usuario tiene su propia lista guardada en el navegador. Permite agregar, completar, buscar, filtrar y eliminar tareas, con animaciones en cada acción.",
    tools: ["HTML", "CSS", "JavaScript", "Font Awesome", "Animate.css", "localStorage"],
    points: ["Inicio de sesión con 2 usuarios de prueba", "Agregar, completar y eliminar tareas", "Buscador en tiempo real y filtros por estado", "Contador de pendientes y botón para limpiar completadas", "Las tareas se conservan al recargar la página", "Diseño responsive para celular"],
    img: null
  },
  {
    id: "buscador-personajes", folder: "web", tag: "JavaScript · API",
    title: "Buscador de Personajes",
    short: "Consulta la API de Rick & Morty por nombre o por ID.",
    desc: "Buscador que consulta la API pública de Rick & Morty con fetch y async/await. Muestra tarjetas con imagen, estado, especie, origen, ubicación y número de episodios de cada personaje.",
    tools: ["HTML", "CSS", "JavaScript", "Fetch API", "Async / Await", "localStorage"],
    points: ["Búsqueda por nombre o por número de ID", "Indicador de carga mientras responde la API", "Mensajes claros si no hay resultados o falla la red", "Historial con las últimas 5 búsquedas", "Botón para limpiar y volver al inicio"],
    img: null
  },
  {
    id: "catalogo-interactivo", folder: "web", tag: "React · Vite",
    title: "Catálogo Interactivo",
    short: "Catálogo con búsqueda, filtros, favoritos y paginación.",
    desc: "Catálogo de personajes hecho en React con componentes y hooks propios. Busca en tiempo real, filtra por estado, guarda favoritos y abre el detalle de cada personaje en una ventana.",
    tools: ["React", "Vite", "Hooks", "Fetch API", "localStorage", "CSS responsive"],
    points: ["Búsqueda en tiempo real con debounce de 400 ms", "Filtros: todos, vivos, muertos y desconocido", "Favoritos guardados y opción \"ver solo favoritos\"", "Paginación anterior / siguiente", "Vista de detalle al hacer clic en una tarjeta", "Hooks propios: useFetch, useDebounce, useStorage"],
    img: null
  },
  {
    id: "juego-reaccion", folder: "web", tag: "React · Ejercicio de clase",
    title: "Juego de Reacción",
    short: "Mide qué tan rápido reaccionas cuando la zona se pone verde.",
    desc: "Juego en React que mide tu tiempo de reacción: esperas a que la zona se ponga verde y haces clic lo más rápido posible. Guarda un ranking con todos tus tiempos.",
    tools: ["React", "Vite", "useState", "setTimeout", "CSS"],
    points: ["Zona que cambia a verde para que hagas clic", "Aviso de \"¡Muy pronto!\" si haces clic antes de tiempo", "Botón Reiniciar disponible en cualquier momento", "Ranking de tiempos ordenado de menor a mayor, sin duplicados"],
    img: null
  },
  {
    id: "replica-red-social", folder: "web", tag: "HTML · CSS · Bootstrap",
    title: "Réplica de Red Social",
    short: "Maqueta de la página de inicio de una red social tipo X.",
    desc: "Réplica de la página de inicio de X hecha con HTML semántico, CSS propio y la cuadrícula de Bootstrap: menú lateral, publicaciones y columna de tendencias.",
    tools: ["HTML", "CSS", "Bootstrap 5", "Flexbox"],
    points: ["Diseño en 3 columnas con el grid de Bootstrap", "Menú lateral, caja para postear y lista de publicaciones", "Secciones \"A quién seguir\" y \"Tendencias\"", "Construida a partir de una imagen de referencia"],
    img: null
  },

  /* ---------- 3D & Animación ---------- */
  {
    id: "comercial-monster", folder: "3d", section: "Animación y publicidad", badge: "Animación", tag: "Publicidad · Producto",
    title: "Comercial Monster Energy",
    short: "Comercial 3D de 20 s con condensación, hielo y explosión de líquido.",
    desc: "Comercial 3D de unos 20 segundos para la lata Monster Energy Ultra. La lata aparece en un estudio oscuro con cubos de hielo, gira mostrando la etiqueta en primeros planos con cambios de color y cierra con una explosión de líquido y el logo.",
    tools: ["Blender", "Cycles", "Iluminación de estudio", "DaVinci Resolve"],
    points: ["Lata modelada y texturizada con gotas de condensación", "6 planos animados: presentación, giro, detalles y tapa", "Cambios de color de la lata entre tomas", "Explosión de líquido alrededor de la lata", "Montaje final con textos y logo en DaVinci Resolve"],
    img: "img/3d/monster.jpg"
  },
  {
    id: "carrera-karts", folder: "3d", section: "Animación y publicidad", badge: "Animación", tag: "Cortometraje · 3 escenas",
    title: "Carrera de karts",
    short: "Cortometraje de un kart con planos en primera persona, cenital y lateral.",
    desc: "Cortometraje animado de un kart conducido por un personaje en una pista con fondo ilustrado en blanco y negro. Está dividido en tres escenas con planos de cámara distintos y una cáscara de banana como obstáculo.",
    tools: ["Blender", "Eevee", "Rigging", "Animación de cámara"],
    points: ["Escena 1: plano en primera persona y vista trasera", "Escena 2: plano cenital siguiendo el kart en la curva", "Escena 3: plano lateral con palmeras y nubes", "Ruedas y volante controlados con huesos"],
    img: "img/3d/karts.jpg"
  },
  {
    id: "comercial-smirnoff", folder: "3d", section: "Animación y publicidad", badge: "Animación", tag: "Publicidad · Formato vertical",
    title: "Comercial Smirnoff",
    short: "Animación vertical para redes con gotas y pedestal.",
    desc: "Animación vertical (9:16) para redes sociales de la botella Smirnoff Spicy Tamarind. La cámara recorre la botella en primer plano mientras caen gotas sobre un pedestal.",
    tools: ["Blender", "Cycles", "Cámara animada", "Formato 9:16"],
    points: ["Botella con etiqueta detallada y gotas de condensación", "Pedestal y suelo con gotas animadas", "Iluminación cálida con varias luces", "Formato vertical 720 × 1280 para redes"],
    img: "img/3d/smirnoff.jpg"
  },
  {
    id: "botella-splash", folder: "3d", section: "Animación y publicidad", badge: "Render", tag: "Publicidad · Render",
    title: "Botella con splash",
    short: "Producto con salpicadura de líquido, frutas y cubos flotando.",
    desc: "Render de producto con una botella de vidrio rodeada por una salpicadura de líquido turquesa, frutas cortadas y cubos flotando sobre un fondo morado.",
    tools: ["Blender", "Cycles", "Composición"],
    points: ["Botella con material de vidrio translúcido", "Salpicadura de líquido alrededor del producto", "Frutas cortadas y cubos como elementos flotantes", "Render final en 1920 × 1080"],
    img: "img/3d/splash.jpg"
  },
  {
    id: "mago-golem", folder: "3d", section: "Animación y publicidad", badge: "Animación", tag: "Animación · Efectos",
    title: "El mago y el gólem",
    short: "Un mago lanza un ataque de partículas de agua contra un gólem de lava.",
    desc: "Animación corta en la que un mago lanza un ataque de partículas de agua contra un gólem de lava. Los personajes están construidos con formas básicas sobre un escenario de baldosas.",
    tools: ["Blender", "Eevee", "Partículas", "Animación"],
    points: ["Mago y gólem construidos con formas básicas", "Ataque de agua hecho con un sistema de partículas", "Gólem con grietas de lava brillantes", "Animación de 110 fotogramas"],
    img: "img/3d/mago.jpg"
  },
  {
    id: "visualizador-audio", folder: "3d", section: "Animación y publicidad", badge: "Animación", tag: "Audio reactivo",
    title: "Visualizador de audio",
    short: "Varios sistemas que reaccionan a una canción.",
    desc: "Animación en la que varios sistemas reaccionan a una canción: un anillo de barras que cambian de altura, una esfera de puntos en el centro, un terreno en malla neón y un cielo estrellado.",
    tools: ["Blender", "Eevee", "Animación por audio"],
    points: ["Anillo de barras que suben y bajan con la música", "Esfera de puntos en el centro de la escena", "Terreno en malla neón en movimiento", "Cámara con recorrido animado"],
    img: "img/3d/audio.jpg"
  },
  {
    id: "vaso-fluido", folder: "3d", section: "Simulaciones", badge: "Simulación", tag: "Simulación de fluidos",
    title: "Vaso llenándose",
    short: "Líquido que cae y llena un vaso de vidrio.",
    desc: "Simulación de líquido turquesa que cae desde arriba y llena un vaso de vidrio sobre una mesa blanca.",
    tools: ["Blender", "Mantaflow", "Cycles"],
    points: ["Simulación de fluido con caché", "Vaso con material de vidrio", "Salpicaduras al caer el líquido", "Iluminación suave de estudio"],
    img: "img/3d/fluido.jpg"
  },
  {
    id: "cortinas-lynch", folder: "3d", section: "Simulaciones", badge: "Simulación", tag: "Simulación de telas",
    title: "Cortinas estilo Lynch",
    short: "Cortinas rojas y objetos cubiertos con telas simuladas.",
    desc: "Escena artística inspirada en el cine de David Lynch: cortinas rojas, un piso de ajedrez y objetos cubiertos por telas que caen sobre ellos.",
    tools: ["Blender", "Cloth", "Eevee"],
    points: ["Cortinas rojas con pliegues simulados", "Telas que caen sobre una silla y un pedestal", "Piso en patrón de ajedrez", "Tela superior suspendida y lámpara colgante"],
    img: "img/3d/telas.jpg"
  },
  {
    id: "vestuario-personaje", folder: "3d", section: "Simulaciones", badge: "Simulación", tag: "Ropa · Modificador Cloth",
    title: "Vestuario para personaje",
    short: "Top y falda simulados con el modificador de ropa.",
    desc: "Personaje vestido con un top y una falda acampanada simulados con el modificador de ropa, más un cinturón dorado con hebilla.",
    tools: ["Blender", "Cloth", "Eevee"],
    points: ["Top tipo corset ajustado al cuerpo", "Falda con vuelo y abertura lateral", "Cinturón y hebilla con material metálico", "Simulación de 70 fotogramas sobre el personaje"],
    img: "img/3d/ropa.jpg"
  },
  {
    id: "escultura-rocas", folder: "3d", section: "Simulaciones", badge: "Render", tag: "Sistemas de partículas",
    title: "Escultura entre rocas",
    short: "Rocas y suelo empedrado distribuidos con partículas.",
    desc: "Escena con una escultura clásica sentada sobre rocas, en un suelo empedrado con musgo. Las rocas y piedras se distribuyen con sistemas de partículas.",
    tools: ["Blender", "Cycles", "Partículas"],
    points: ["Escultura como pieza central de la escena", "Rocas distribuidas con partículas", "Suelo empedrado con musgo", "Fondo de estudio con luz lateral"],
    img: "img/3d/particulas.jpg"
  },
  {
    id: "terreno-humo", folder: "3d", section: "Escenarios", badge: "Render", tag: "Escenario · Paisaje",
    title: "Terreno con humo",
    short: "Montañas, agua, vegetación y volúmenes de humo.",
    desc: "Paisaje natural con montañas de tierra, agua, pinos y arbustos, y columnas de humo hechas con volúmenes, iluminado con un HDRI de colinas en otoño.",
    tools: ["Blender", "Cycles", "Volúmenes", "HDRI"],
    points: ["Terreno con montañas y zonas de agua", "Pinos y arbustos dispersos", "Humo hecho con volúmenes", "Iluminación con HDRI de otoño"],
    img: "img/3d/terreno.jpg"
  },
  {
    id: "mundo-retro", folder: "3d", section: "Escenarios", badge: "Render", tag: "Escenario · Estilo retro",
    title: "Mundo retro pixel",
    short: "Fondo pixelado y un hongo modelado en 3D.",
    desc: "Escena inspirada en los videojuegos de 8 bits: un fondo pixelado con nubes y flores y un hongo modelado en 3D al frente.",
    tools: ["Blender", "Cycles", "Modelado"],
    points: ["Hongo modelado y texturizado en 3D", "Fondo pixelado con nubes y flores", "Contraste entre el estilo plano y el objeto 3D"],
    img: "img/3d/retro.jpg"
  }
];

const FOLDERS = {
  web: { name: "Programación", page: "programacion.html", theme: "theme-web" },
  "3d": { name: "3D & Animación", page: "animacion-3d.html", theme: "theme-3d" }
};
