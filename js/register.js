const registerForm = document.querySelector('#registerForm')

/**
 * Escucha el evento 'submit' del formulario.
 * Cuando el formulario se envía, ejecuta una función anónima para gestionar el evento de envío.
 * El parámetro `e` representa el evento.
 */
registerForm.addEventListener('submit',(e)=>{
   e.preventDefault()

    // Se obtienen los valores de los campos
   const name = document.querySelector('#name').value
   const email = document.querySelector('#email').value
   const password = document.querySelector('#password').value

   // Recupera el array de usuarios almacenado en el localStorage. Si no existe, se inicializa como un array vacío
   const users = JSON.parse(localStorage.getItem('users')) || []

   // Verifica si ya hay un usuario registrado con el mismo correo electrónico
   const isUserRegistered = users.find(user => user.email === email)

   // Si el usuario ya existe, muestra una alerta y termina la ejecución de la función
   if(isUserRegistered){
    return alert('El usuario ya esta registrado!!')
   }

    // Si no está registrado, se agrega un nuevo objeto con los datos del nuevo usuario al array de usuarios
   users.push({name: name, email: email, password: password})

   // Guarda el array actualizado de usuarios en el localStorage en formato JSON
   localStorage.setItem('users', JSON.stringify(users))
   alert('Registro exitoso!!')

   // Redirige al usuario a la página de inicio de sesión (login.html) tras registrarse
   window.location.href = 'login.html'
})