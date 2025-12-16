/* =========================================================
   [4] INTERACCIÓN "ME GUSTA" + REORDENACIÓN (JS)
   ========================================================= */

const likeButtons = document.querySelectorAll(".pin-like"); 
// selecciona botones like       [4.1 Icono Me gusta]

const menuItems = document.querySelectorAll("#menu .menu-link");
// selecciona enlaces menú       [2.3 Tres layouts]

const pins = document.querySelectorAll(".pin");
// selecciona todas cards        [3.1 Cards Pinterest]

const tituloGaleria = document.querySelector(".galeria .header h2");
// selecciona título galería     [2.3 Feedback filtro]

const columns = document.querySelectorAll(".column");
// selecciona columnas galería   [1.2 Grid columnas]

let likeCounter = 0;
// contador orden likes          [4.2 Reordenar cards]

let currentFilter = "inicio";
// guarda filtro actual          [2.3 Tres layouts]


// Guardar posición original dentro de su columna
columns.forEach(columna => { 
  // recorre cada columna        [4.2 Reordenar cards]
  const pinsColumna = Array.from(columna.querySelectorAll(".pin"));
  // crea array tarjetas         [4.2 Reordenar cards]

  pinsColumna.forEach((pin, index) => {
    // recorre cada tarjeta       [4.2 Reordenar cards]
    pin.dataset.originalIndex = index;
    // guarda índice original     [4.2 Mantener orden]
  });
});

// Reordena SIEMPRE la columna según me gusta
function reordenarColumna(columna) {
  // define función reordenar     [4.2 Reordenar cards]
  const pinsColumna = Array.from(columna.querySelectorAll(".pin"));
  // obtiene tarjetas columna     [4.2 Reordenar cards]

  const favoritos = pinsColumna.filter(pin =>
    pin.classList.contains("pin-selected")
    // filtra tarjetas favoritas  [4.2 Reordenar favoritos]
  );
  const noFavoritos = pinsColumna.filter(
    pin => !pin.classList.contains("pin-selected")
    // filtra no favoritas        [4.2 Reordenar resto]
  );

  favoritos.sort((a, b) => {
    // ordena favoritos array      [4.2 Reordenar favoritos]
    const aLike = parseInt(a.dataset.likeOrder || "0", 10);
    // lee orden favorito A        [4.2 Orden likes]
    const bLike = parseInt(b.dataset.likeOrder || "0", 10);
    // lee orden favorito B        [4.2 Orden likes]
    return bLike - aLike; // El último "me gusta" se coloca más arriba
    // coloca últimos arriba       [4.2 Más recientes primero]
  });

  noFavoritos.sort((a, b) => {
    // ordena no favoritos         [4.2 Mantener orden]
    const aOrig = parseInt(a.dataset.originalIndex || "0", 10);
    // lee índice original A       [4.2 Índice original]
    const bOrig = parseInt(b.dataset.originalIndex || "0", 10);
    // lee índice original B       [4.2 Índice original]
    return aOrig - bOrig;
    // conserva orden inicial      [4.2 Orden estable]
  });

  const nuevoOrden = favoritos.concat(noFavoritos);
  // junta favoritos y resto       [4.2 Nuevo orden]

  nuevoOrden.forEach(pin => columna.appendChild(pin));
  // reinyecta tarjetas ordenadas  [4.2 Actualiza DOM columna]
}

// Aplica orden a TODAS las columnas
function reordenarTodasLasColumnas() {
  // define reordenar global       [4.2 Reordenar cards]
  columns.forEach(columna => reordenarColumna(columna));
  // reordena cada columna         [4.2 Reordenación global]
}

// Aplicar filtro visual
function aplicarFiltroActual() {
  // gestiona filtros vista        [2.3 Filtros vista]
  if (currentFilter === "favoritos") {
    // caso filtro favoritos        [4.2 Vista favoritos]
    pins.forEach(pin => {
      // recorre todas tarjetas     [2.3 Filtros vista]
      const favorito = pin.classList.contains("pin-selected");
      // comprueba si favorita      [4.1 Estado favorito]
      pin.classList.toggle("fav-hidden", !favorito);
      // oculta no favoritas        [4.2 Solo favoritas]
      pin.classList.remove("hidden");
      // asegura visible normal     [2.3 Limpia oculto]
    });
  } else {
    pins.forEach(pin => {
      // recorre tarjetas normales   [2.3 Filtros vista]
      pin.classList.remove("fav-hidden");
      // limpia oculto favoritos     [4.2 Limpia estado]
      const tipo = pin.dataset.tipo;
      // obtiene tipo tarjeta        [2.3 Costa/Interior]

      const mostrar =
        currentFilter === "inicio" ||
        (currentFilter === "costa" && tipo === "costa") ||
        (currentFilter === "interior" && tipo === "interior");
      // decide mostrar tarjeta      [2.3 Lógica filtros]

      pin.classList.toggle("hidden", !mostrar);
      // aplica ocultar/mostrar      [2.3 Cambia visibilidad]
    });
  }
}

// Evento de Me gusta
likeButtons.forEach(button => {
  // recorre cada botón like        [4.1 Icono Me gusta]
  button.addEventListener("click", () => {
    // añade evento click           [4.1 Click Me gusta]
    const estaMarcado = button.classList.toggle("liked");
    // alterna clase liked          [4.1 Estado corazón]

    button.textContent = estaMarcado ? "♥" : "♡";
    // cambia símbolo corazón       [4.1 Cambio visual icono]

    let pin = button.parentElement;
    // empieza desde contenedor      [4.1 Busca tarjeta]
    while (!pin.classList.contains("pin")) {
      pin = pin.parentElement;
      // sube hasta .pin             [4.1 Encuentra card]
    }

    if (estaMarcado) {
      // si se marca favorito        [4.1 Marca favorita]
      pin.classList.add("pin-selected");
      // añade clase favorita        [4.1 Estilo favorito]
      likeCounter++;
      // incrementa contador likes   [4.2 Orden favorito]
      pin.dataset.likeOrder = likeCounter;
      // guarda orden pulso like     [4.2 Ordenado posterior]
    } else {
      // si se desmarca favorito     [4.1 Quita favorita]
      pin.classList.remove("pin-selected");
      // elimina clase favorita      [4.1 Vuelve normal]
      delete pin.dataset.likeOrder;
      // borra orden guardado        [4.2 Sin prioridad]
    }

    // Ordenar inmediatamente
    const columna = pin.parentElement;
    // obtiene columna actual        [4.2 Columna tarjeta]
    reordenarColumna(columna);
    // reordena solo esa columna     [4.2 Reordenación inmediata]

    // Aplicar filtro si estamos en favoritos o no
    aplicarFiltroActual();
    // reaplica filtro activo        [2.3 Mantiene vista]
  });
});

// Evento de menú lateral
menuItems.forEach(item => {
  // recorre enlaces menú           [2.3 Menú filtros]
  item.addEventListener("click", e => {
    // añade evento click menú      [2.3 Interacción menú]
    e.preventDefault();
    // evita navegación enlace      [2.3 Sin recarga]

    menuItems.forEach(i => i.classList.remove("active"));
    // quita activo anteriores      [6.1 Reset estado menú]
    item.classList.add("active");
    // marca elemento pulsado       [6.1 Activa visualmente]

    currentFilter = item.dataset.filter;
    // actualiza filtro global       [2.3 Filtro seleccionado]

    let nuevoTitulo = "Galería de pueblos y ciudades";
    // título base galería           [2.3 Texto principal]
    if (currentFilter === "costa") nuevoTitulo = "Galería de pueblos y ciudades de costa";
    // título para filtro costa      [2.3 Feedback costa]
    if (currentFilter === "interior") nuevoTitulo = "Galería de pueblos y ciudades de interior";
    // título para filtro interior   [2.3 Feedback interior]
    if (currentFilter === "favoritos") nuevoTitulo = "Galería de pueblos y ciudades favoritas";
    // título para favoritos         [4.2 Feedback favoritos]

    tituloGaleria.textContent = nuevoTitulo;
    // actualiza título visible      [2.3 Feedback visual filtro]

    // Reordenar siempre antes de filtrar
    reordenarTodasLasColumnas();
    // reordena todas columnas       [4.2 Reordenación completa]
    aplicarFiltroActual();
    // aplica filtro elegido         [2.3 Filtra resultados]
  });
});
