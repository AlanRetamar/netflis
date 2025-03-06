//Trae todas las peliculas del localstorage
list = JSON.parse(localStorage.getItem("list")) || [];

const addButton = document.querySelector(".movie-add-list");
//const deleteButtonList = document.querySelector('.movie-delete-list');

//Se agrega la pelicula que le pase por parametro en la lista y se actualiza el localstorage
const addToList = (idPelicula) => {
  // Busca una película en el catálogo cuyo ID coincida con el ID pasado como argumento.
  const pelicula = catalogo.find((p) => p.id == idPelicula);

  // Agrega la película encontrada al array 'list'.
  list.push(pelicula);

  // Si la lista no está vacía (es decir, si tiene elementos), guarda la lista en el localStorage.
  // Se convierte a formato JSON antes de almacenarla.
  list.length && localStorage.setItem("list", JSON.stringify(list));

  // Muestra un cuadro de diálogo emergente utilizando SweetAlert2, indicando que la película ha sido agregada a la lista.
  Swal.fire({
    title: "Añadida",
    text: `${pelicula.nombre} fue agregada de la lista`,
    icon: "success",
  });
}

//Se elimina la pelicula que le pase por parametro en la lista y se actualiza el localstorage
const deleteOfList = (idPelicula) => {
  // Encuentra la película en la lista de acuerdo con el id pasado como argumento.
  const foundId = list.find((p) => p.id == idPelicula);

  // Filtra la lista, creando una nueva lista que excluye la película encontrada (foundId).
  list = list.filter((listId) => {
    return listId !== foundId;
  });

  // Actualiza la lista en el localStorage, convirtiéndola nuevamente a formato JSON.
  localStorage.setItem("list", JSON.stringify(list));

  // Muestra un cuadro de diálogo emergente utilizando SweetAlert2, indicando que la película ha sido eliminada de la lista.
  Swal.fire({
    title: "Eliminada",
    text: `${foundId.nombre} fue borrada de la lista`,
    icon: "error",
  });
};

const buttons = document.querySelectorAll(
  ".movie-add-list, .movie-delete-list"
);

// Iteramos sobre cada botón para agregarle el evento de click
buttons.forEach((button, index) => {
  // Evento click para agregar o eliminar una película de la lista
  button.addEventListener("click", () => {

    // Subimos en la jerarquía del DOM para encontrar el contenedor con la clase "movie-modal-content"
    const movieModalContent = addButton.closest(".movie-modal-content");

    // Obtenemos el ID del contenedor "movie-modal-content", que es el de la pelicula seleccionada
    const modalId = movieModalContent.getAttribute("id");

    const pelicula = list.find((p) => p.id == modalId);

    if (!pelicula) {
      // Si la película no está en la lista, la agregamos
      addToList(modalId);

      // Cambiamos al icono de que esta agregado a la lista
      movieModal.querySelector(".movie-add-list").classList.add("hidden");
      movieModal.querySelector(".movie-delete-list").classList.remove("hidden");
    } else {
      // Si la película ya está en la lista, la eliminamos
      deleteOfList(modalId);

      // Cambiamos al icono de que esta eliminado de la lista
      movieModal.querySelector(".movie-add-list").classList.remove("hidden");
      movieModal.querySelector(".movie-delete-list").classList.add("hidden");
      if (window.location.pathname.includes("my-list.html")) {
        movieModal.classList.remove("show");
      }
    }

    if (typeof getItems === "function") {
      getItems();
    }
  });
});
