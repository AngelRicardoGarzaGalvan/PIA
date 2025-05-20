// script_cliente.js

// Verifica si hay un usuario con sesión activa
const usuarioActual = JSON.parse(localStorage.getItem("usuario_actual"));

if (!usuarioActual || usuarioActual.rol !== "cliente") {
    alert("Debes iniciar sesión como cliente para acceder.");
    window.location.href = "../index.html";
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem("usuario_actual");
    window.location.href = "../index.html";
}
