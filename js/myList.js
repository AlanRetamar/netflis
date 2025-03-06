function checkLogin() {
  const user = localStorage.getItem("user");

  if (!user) {
    window.location.href = "login.html";
  }
}

// Llama a la función al cargar la página
checkLogin();

//Trae todas las peliculas del localstorage
let list = JSON.parse(localStorage.getItem("list")) || [];
console.log(list); 

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
  const pelicula = list.find((p) => p.id == idPelicula);
  const movieModal = document.querySelector(".movie-modal");
  movieModal.querySelector(".movie-modal-content").id = `${pelicula.id}`;
  movieModal.querySelector(".movie-cover").src = pelicula.imagen;
  movieModal.querySelector("#movie-year").innerHTML = pelicula.anio;
  movieModal.querySelector("#movie-rating").innerHTML = pelicula.clasificacion;
  movieModal.querySelector("#movie-genre").innerHTML = generos[pelicula.genero];
  movieModal.querySelector("#movie-description").innerHTML = pelicula.descripcion;
  // const isInList = list.some(p => p.id == idPelicula);
  //   if (isInList) {
      movieModal.querySelector('.movie-add-list').classList.add('hidden');
      movieModal.querySelector('.movie-delete-list').classList.remove('hidden');
    // } else {
    //   movieModal.querySelector('.movie-add-list').classList.remove('hidden');
    //   movieModal.querySelector('.movie-delete-list').classList.add('hidden');
    // }
  movieModal.classList.add("show");

  // Actualizar el botón de reproducir con la URL del tráiler
  const playButton = movieModal.querySelector('#playButton');
  playButton.setAttribute('data-trailer-url', pelicula.trailerUrl);

   // Asociar el evento de clic al botón de reproducir
   playButton.addEventListener("click", function () {
    const trailerUrl = playButton.getAttribute("data-trailer-url");
    if (trailerUrl) {
      const trailerIframe = document.getElementById("trailerIframe");
      const trailerContainer = document.getElementById("trailer-container");
      trailerIframe.src = trailerUrl + "?autoplay=1&rel=0";
      trailerContainer.style.display = "block";

      // Solicitar pantalla completa
      if (trailerIframe.requestFullscreen) {
        trailerIframe.requestFullscreen();
      } else if (trailerIframe.webkitRequestFullscreen) {
        trailerIframe.webkitRequestFullscreen();
      } else if (trailerIframe.msRequestFullscreen) {
        trailerIframe.msRequestFullscreen();
      }
    }
  });
};

document.addEventListener('fullscreenchange', function () {
  const trailerIframe = document.getElementById("trailerIframe");
  const trailerContainer = document.getElementById("trailer-container");

  if (!document.fullscreenElement) {
    // Si no hay un elemento en pantalla completa, ocultar el tráiler
    trailerIframe.src = ""; // Detiene el video
    trailerContainer.style.display = "none"; // Oculta el contenedor del tráiler
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
  localStorage.setItem('perfilIndex', index);
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
};

// Funciones para mi lista
let getItems = () => {
  //Muestra la grilla de portadas de las peliculas al cargar el DOM
    const grillaContainer = document.querySelector(".grilla-contenido");
    grillaContainer.innerHTML = "";
    list.forEach((pelicula) => {
      const item = document.createElement("div");
      item.className = "grilla-item";
      item.onclick = () => previsualizarPelicula(pelicula.id);
      item.innerHTML = `<img src="${pelicula.imagen}" alt="${pelicula.nombre}" title="${pelicula.nombre}">`;
      grillaContainer.appendChild(item);
    });
    if (list.length === 0) {
      const noItems = document.createElement("span");
      noItems.className = "no-items";
      noItems.innerHTML = "No hay contenido en tu lista";
      grillaContainer.appendChild(noItems);
    }
};

// Cargar perfiles al iniciar
cargarPerfiles();

//Mostrar la grilla de portadas de las peliculas al iniciar
document.addEventListener("DOMContentLoaded", () => getItems());
document.addEventListener("DOMContentLoaded", () => {
  const perfilIndex = localStorage.getItem('perfilIndex');
  seleccionarPerfil(perfilIndex);
});