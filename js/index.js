let catalogo;

function checkLogin() {
  const user = localStorage.getItem("user");

  if (!user) {
    window.location.href = "login.html";
  }
}

// Llama a la función al cargar la página
checkLogin();

const generos = {
  1: "Drama",
  2: "Ciencia Ficción",
  3: "Acción",
  4: "Suspenso",
  5: "Terror",
  6: "Comedia",
  7: "Aventura",
};

const previsualizarPelicula = (idPelicula) => {
  const pelicula = catalogo.find((p) => p.id == idPelicula);
  const movieModal = document.querySelector(".movie-modal");
  movieModal.querySelector(".movie-modal-content").id = `${pelicula.id}`;
  movieModal.querySelector(".movie-cover").src = pelicula.imagen;
  movieModal.querySelector("#movie-year").innerHTML = pelicula.anio;
  movieModal.querySelector("#movie-rating").innerHTML = pelicula.clasificacion;
  movieModal.querySelector("#movie-genre").innerHTML = generos[pelicula.genero];
  movieModal.querySelector("#movie-description").innerHTML =
    pelicula.descripcion;
  const isInList = list.some((p) => p.id == idPelicula);
  if (isInList) {
    movieModal.querySelector(".movie-add-list").classList.add("hidden");
    movieModal.querySelector(".movie-delete-list").classList.remove("hidden");
  } else {
    movieModal.querySelector(".movie-add-list").classList.remove("hidden");
    movieModal.querySelector(".movie-delete-list").classList.add("hidden");
  }

  // Actualizar el botón de reproducir con la URL del tráiler
  const playButton = movieModal.querySelector("#playButton");
  playButton.setAttribute("data-trailer-url", pelicula.trailerUrl);

  movieModal.classList.add("show");
};

const inyectarPeliculas = (peliculas, grilla) => {
  peliculas.forEach((pelicula) => {
    const item = document.createElement("div");
    item.className = "grilla-item";
    item.onclick = () => previsualizarPelicula(pelicula.id);
    item.innerHTML = `<img src="${pelicula.imagen}" alt="${pelicula.nombre}" title="${pelicula.nombre}">`;
    grilla.appendChild(item);
  });
}

const renderizarGrilla = (peliculas = catalogo) => {
  if (!peliculas) return;
  const mainContainer = document.querySelector("#main-container");
  mainContainer.innerHTML = "";

  if (searchInput.value) {
    const grillaContainer = document.createElement("div");
    grillaContainer.className = "grilla-contenido";
    inyectarPeliculas(peliculas, grillaContainer);
    mainContainer.appendChild(grillaContainer);
  } else {
    for (let generoId in generos) {

      const title = document.createElement("h3");
      title.className = "category-title";
      title.innerText = generos[generoId];

      const grillaContainer = document.createElement("div");
      grillaContainer.className = "grilla-contenido";
      inyectarPeliculas(peliculas.filter(p => p.genero == generoId), grillaContainer);

      const categoryContainer = document.createElement("div");
      categoryContainer.className = "category-container";

      categoryContainer.appendChild(title);
      categoryContainer.appendChild(grillaContainer);
      mainContainer.appendChild(categoryContainer);
    }
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("catalogo.json");
    if (!response.ok) {
      throw new Error("Error al cargar el archivo JSON");
    }
    catalogo = await response.json();
    renderizarGrilla();
  } catch (error) {
    console.log(error.message);
  }
});

// Función para cerrar sesión
function cerrarSesion() {
  // Elimina la información del usuario del localStorage
  localStorage.removeItem("user");
  console.log("Usuario ha cerrado sesión.");

  // Redirige al usuario a la página de login
  window.location.href = "login.html";
}

// Asocia la función al botón de Cerrar Sesión
document.getElementById("btnCerrarSesion").addEventListener("click", (e) => {
  e.preventDefault();
  cerrarSesion();
});
////////////////////////////////////////////////////////

// Variables de referencia
const perfilButton = document.getElementById("perfilButton");
const profileModal = document.getElementById("profileModal");
const addProfileModal = document.getElementById("addProfileModal");
const closeButtons = document.querySelectorAll(".close");
const perfilContainer = document.getElementById("perfilContainer");
const addProfileButton = document.getElementById("addProfileButton");
const submitProfileButton = document.getElementById("submitProfileButton");
const newProfileNameInput = document.getElementById("newProfileName");
const newProfileColorInput = document.getElementById("newProfileColor");
const movieModal = document.getElementById("movie-modal");

// Inicializar perfiles
let perfiles = JSON.parse(localStorage.getItem("perfiles")) || [];

// Cargar perfiles al iniciar
function cargarPerfiles() {
  perfilContainer.innerHTML = ""; // Limpiar el contenedor
  perfiles.forEach((perfil, index) => {
    const perfilDiv = document.createElement("div");
    perfilDiv.style.display = "flex"; // Usar flex para alinear el nombre y el botón de eliminar
    perfilDiv.style.alignItems = "center"; // Centrar verticalmente
    perfilDiv.style.justifyContent = "space-between"; // Separar el nombre y el botón

    const button = document.createElement("button");
    button.className = "perfil-boton";
    button.innerText = perfil.name;
    button.style.backgroundColor = perfil.color; // Asigna el color del perfil
    button.onclick = () => seleccionarPerfil(index);

    // Botón de eliminar
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Eliminar";
    deleteButton.style.marginLeft = "10px"; // Espacio entre el botón de perfil y el de eliminar
    deleteButton.onclick = (event) => {
      event.stopPropagation(); // Evitar que el clic en eliminar también seleccione el perfil
      eliminarPerfil(index); // Llamar a la función para eliminar
    };

    perfilDiv.appendChild(button);
    perfilDiv.appendChild(deleteButton);
    perfilContainer.appendChild(perfilDiv);
  });
}

// Abrir modal de selección de perfil
perfilButton.onclick = () => {
  cargarPerfiles(); // Cargar perfiles antes de abrir
  profileModal.style.display = "block";
};

// Seleccionar perfil
function seleccionarPerfil(index) {
  const perfilSeleccionado = perfiles[index];
  localStorage.setItem("perfilIndex", index);
  perfilButton.innerText = perfilSeleccionado.name; // Cambiar texto del botón a perfil seleccionado
  perfilButton.style.backgroundColor = perfilSeleccionado.color; // Cambiar color del botón principal
  profileModal.style.display = "none"; // Cerrar modal
}

// Agregar perfil
addProfileButton.onclick = () => {
  addProfileModal.style.display = "block"; // Abrir modal de agregar perfil
};

// Cerrar modales
closeButtons.forEach((button) => {
  button.onclick = () => {
    profileModal.style.display = "none";
    addProfileModal.style.display = "none";
    movieModal.classList.remove("show");
  };
});

// Cerrar modal al hacer clic fuera
window.onclick = (event) => {
  if (
    event.target === profileModal ||
    event.target === addProfileModal ||
    event.target === movieModal
  ) {
    profileModal.style.display = "none";
    addProfileModal.style.display = "none";
    movieModal.classList.remove("show");
  }
  if (event.target !== resultContainer) {
    resultContainer.style.display = "none";
  }
};

// Agregar nuevo perfil
submitProfileButton.onclick = () => {
  const nuevoPerfilNombre = newProfileNameInput.value.trim();
  const nuevoPerfilColor = newProfileColorInput.value; // Obtener color seleccionado
  if (
    nuevoPerfilNombre &&
    !perfiles.some((p) => p.name === nuevoPerfilNombre)
  ) {
    // Comprobar que no esté vacío y que no exista
    perfiles.push({ name: nuevoPerfilNombre, color: nuevoPerfilColor }); // Agregar nuevo perfil
    localStorage.setItem("perfiles", JSON.stringify(perfiles)); // Guardar en localStorage
    newProfileNameInput.value = ""; // Limpiar el campo de entrada
    addProfileModal.style.display = "none"; // Cerrar modal
    cargarPerfiles(); // Recargar perfiles
  } else {
    alert("Por favor, introduce un nombre válido y único para el perfil."); // Mensaje de error
  }
};

// Función para eliminar un perfil
function eliminarPerfil(index) {
  if (confirm("¿Estás seguro de que deseas eliminar este perfil?")) {
    perfiles.splice(index, 1); // Eliminar el perfil del array
    localStorage.setItem("perfiles", JSON.stringify(perfiles)); // Actualizar en localStorage
    cargarPerfiles(); // Recargar perfiles
  }
}

// Cargar perfiles al iniciar
cargarPerfiles();

// Funcionalidad para reproducir el tráiler en el mismo modal
document.addEventListener("DOMContentLoaded", function () {
  const playButton = document.getElementById("playButton");
  const trailerContainer = document.getElementById("trailer-container");
  const trailerIframe = document.getElementById("trailerIframe");
  const movieModalContent = document.querySelector(".movie-modal-content");

  playButton.addEventListener("click", function () {
    const trailerUrl = playButton.getAttribute("data-trailer-url");
    if (trailerUrl) {
      trailerIframe.src = trailerUrl + "?autoplay=1&rel=0";
      trailerContainer.style.display = "block";

      //Solicitar pantalla completa
      if (trailerIframe.requestFullscreen) {
        trailerIframe.requestFullscreen();
      } else if (trailerIframe.webkitRequestFullscreen) {
        /* Safari */
        trailerIframe.webkitRequestFullscreen();
      } else if (trailerIframe.msRequestFullscreen) {
        /* IE11 */
        trailerIframe.msRequestFullscreen();
      }
    }
  });

  document.addEventListener("fullscreenchange", function () {
    const trailerIframe = document.getElementById("trailerIframe");
    const trailerContainer = document.getElementById("trailer-container");

    if (!document.fullscreenElement) {
      // Si no hay un elemento en pantalla completa, ocultar el tráiler
      trailerIframe.src = ""; // Detiene el video
      trailerContainer.style.display = "none"; // Oculta el contenedor del tráiler
    }
  });
});

// Ocultar el contenedor de resultados al cargar la página
resultContainer.style.display = "none";

// Función para cargar el catálogo desde catalogo.json
async function loadCatalog() {
  try {
    // Escuchar el evento input en la barra de búsqueda
    searchInput.addEventListener("input", (event) => {
      const query = event.target.value.toLowerCase().trim(); // Eliminar espacios en blanco
      let filteredResults;

      if (!query) {
        resultContainer.innerHTML = ""; // Limpiar resultados si no hay texto
        resultContainer.style.display = "none"; // Ocultar contenedor
      } else {
        // Filtrar y limitar los resultados a 5
        filteredResults = catalogo
          .filter((item) => item.nombre.toLowerCase().includes(query))
          .slice(0, 5);
        renderResults(filteredResults);
      }
      renderizarGrilla(filteredResults);
    });
  } catch (error) {
    console.error("Error al cargar el catálogo:", error);
  }
}

// Función para renderizar los resultados en el DOM
function renderResults(items) {
  resultContainer.innerHTML = ""; // Limpiar resultados anteriores
  resultContainer.style.display = "block"; // Asegurar que se muestre el contenedor

  if (items.length === 0) {
    resultContainer.innerHTML =
      "<div class='resultados'>No se encontraron resultados.</div>";
    return;
  }

  items.forEach((item) => {
    const searchInput = document.querySelector("#searchInput");
    console.log(searchInput);
    const div = document.createElement("div");
    div.className = "resultados";
    div.textContent = item.nombre;
    div.onclick = () => {
      searchInput.value = item.nombre;
      const event = new Event("input", { bubbles: true });
      searchInput.dispatchEvent(event);
    };
    resultContainer.appendChild(div);
  });
}

// Ejecutar la carga del catálogo cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", loadCatalog);
document.addEventListener("DOMContentLoaded", () => {
  const perfilIndex = localStorage.getItem("perfilIndex");
  seleccionarPerfil(perfilIndex);
});
