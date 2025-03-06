const loginForm = document.querySelector('#loginForm');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    
    // Recupero los usuarios del localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Verifico si existe un usuario con el correo y la contraseña ingresados, y lo devuelvo
    const userValid = users.find(user => user.email === email && user.password === password);
    
    if (!userValid) {
        return alert('Correo o contraseña incorrectos.');
    }

    localStorage.setItem('user', JSON.stringify(userValid));

    alert(`Bienvenido!`);
    window.location.href = 'index.html';  // Redirige a la página principal
});
