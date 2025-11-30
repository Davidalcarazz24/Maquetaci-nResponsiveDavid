const likeButtons = document.querySelectorAll(".pin-like"); 
// Aquí selecciono todos los botones de "me gusta"

const menuItems = document.querySelectorAll("#menu .menu-link");
// Aquí cojo todos los enlaces del menú superior

const pins = document.querySelectorAll(".pin");
// Aquí guardo todas las tarjetas de la galería

const tituloGaleria = document.querySelector(".galeria .header h2");
// Aquí selecciono el título principal de la galería para poder cambiarlo

const columns = document.querySelectorAll(".column");
// Aquí selecciono todas las columnas donde están las tarjetas

let likeCounter = 0;
// Uso este contador para saber en qué orden se han marcado los favoritos

let currentFilter = "inicio";
// Aquí guardo qué filtro del menú está activo en cada momento

// Guardar posición original dentro de su columna
columns.forEach(columna => {
  const pinsColumna = Array.from(columna.querySelectorAll(".pin"));
  pinsColumna.forEach((pin, index) => {
    pin.dataset.originalIndex = index;
    // Guardo en cada tarjeta su posición original para luego poder recolocarla
  });
});

// Reordena SIEMPRE la columna según me gusta
function reordenarColumna(columna) {
  // En esta función ordeno una columna según los favoritos
  const pinsColumna = Array.from(columna.querySelectorAll(".pin"));

  const favoritos = pinsColumna.filter(pin =>
    pin.classList.contains("pin-selected")
    // Aquí separo las tarjetas que están marcadas como favoritas
  );
  const noFavoritos = pinsColumna.filter(
    pin => !pin.classList.contains("pin-selected")
    // Aquí separo las tarjetas que no son favoritas
  );

  favoritos.sort((a, b) => {
    const aLike = parseInt(a.dataset.likeOrder || "0", 10);
    const bLike = parseInt(b.dataset.likeOrder || "0", 10);
    return bLike - aLike; // el último like arriba
    // Ordeno los favoritos para que los últimos marcados salgan primero
  });

  noFavoritos.sort((a, b) => {
    const aOrig = parseInt(a.dataset.originalIndex || "0", 10);
    const bOrig = parseInt(b.dataset.originalIndex || "0", 10);
    return aOrig - bOrig;
    // Mantengo los no favoritos en el orden original de la columna
  });

  const nuevoOrden = favoritos.concat(noFavoritos);
  // Junto primero los favoritos y luego el resto

  nuevoOrden.forEach(pin => columna.appendChild(pin));
  // Vuelvo a añadir las tarjetas a la columna siguiendo el nuevo orden
}

// Aplica orden a TODAS las columnas
function reordenarTodasLasColumnas() {
  // Esta función aplica el reordenado a cada columna
  columns.forEach(columna => reordenarColumna(columna));
}

// Aplicar filtro visual
function aplicarFiltroActual() {
  // Aquí controlo qué tarjetas se ven según el filtro elegido
  if (currentFilter === "favoritos") {
    pins.forEach(pin => {
      const favorito = pin.classList.contains("pin-selected");
      pin.classList.toggle("fav-hidden", !favorito);
      // Si no es favorito lo oculto con la clase fav-hidden
      pin.classList.remove("hidden");
      // Me aseguro de que no tenga la clase hidden normal
    });
  } else {
    pins.forEach(pin => {
      pin.classList.remove("fav-hidden");
      // Quito la clase de favoritos por si estaba puesta antes
      const tipo = pin.dataset.tipo;

      const mostrar =
        currentFilter === "inicio" ||
        (currentFilter === "costa" && tipo === "costa") ||
        (currentFilter === "interior" && tipo === "interior");
      // Aquí decido si se debe mostrar la tarjeta según el filtro y su tipo

      pin.classList.toggle("hidden", !mostrar);
      // Pongo o quito la clase hidden para enseñar u ocultar la tarjeta
    });
  }
}

// Evento de Me gusta
likeButtons.forEach(button => {
  button.addEventListener("click", () => {
    // Cuando hago clic en un botón de me gusta se ejecuta este código
    const estaMarcado = button.classList.toggle("liked");
    // Alterno la clase liked para saber si está marcado o no
    button.textContent = estaMarcado ? "♥" : "♡";
    // Cambio el símbolo del botón según esté marcado o no

    let pin = button.parentElement;
    while (!pin.classList.contains("pin")) {
      pin = pin.parentElement;
    }
    // Subo por el árbol del DOM hasta encontrar la tarjeta completa

    if (estaMarcado) {
      pin.classList.add("pin-selected");
      // Marco la tarjeta como favorita
      likeCounter++;
      pin.dataset.likeOrder = likeCounter;
      // Guardo el orden en el que se ha dado a me gusta
    } else {
      pin.classList.remove("pin-selected");
      // Quito la marca de favorito
      delete pin.dataset.likeOrder;
      // Borro el dato del orden de me gusta
    }

    // Ordenar inmediatamente
    const columna = pin.parentElement;
    // Cojo la columna donde está esta tarjeta
    reordenarColumna(columna);
    // Reordeno la columna para que los favoritos suban

    // Aplicar filtro si estamos en favoritos o no
    aplicarFiltroActual();
    // Vuelvo a aplicar el filtro actual para que todo quede coherente
  });
});

// Evento de menú lateral
menuItems.forEach(item => {
  item.addEventListener("click", e => {
    // Cada vez que hago clic en un elemento del menú se ejecuta esto
    e.preventDefault();
    // Evito que el enlace recargue la página

    menuItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    // Quito la clase activa de todos y la pongo solo en el que he pulsado

    currentFilter = item.dataset.filter;
    // Actualizo el filtro actual según el data-filter del enlace

    let nuevoTitulo = "Galería de pueblos y ciudades";
    if (currentFilter === "costa") nuevoTitulo = "Galería de pueblos y ciudades de costa";
    if (currentFilter === "interior") nuevoTitulo = "Galería de pueblos y ciudades de interior";
    if (currentFilter === "favoritos") nuevoTitulo = "Galería de pueblos y ciudades favoritas";
    // Cambio el texto del título según el filtro elegido

    tituloGaleria.textContent = nuevoTitulo;
    // Actualizo el título que se ve encima de la galería

    // Reordenar siempre antes de filtrar
    reordenarTodasLasColumnas();
    // Primero reordeno todas las columnas para colocar los favoritos
    aplicarFiltroActual();
    // Después aplico el filtro para mostrar solo lo que toca
  });
});
