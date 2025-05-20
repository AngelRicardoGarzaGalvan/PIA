// Verifica que el usuario tenga rol administrador
//const usuario = JSON.parse(localStorage.getItem("usuario_actual"));
//if (!usuario || usuario.rol !== "admin") {
//  alert("Acceso restringido. Solo administradores.");
//  window.location.href = "../index.html";
//}

// Función global para cerrar sesión
function cerrarSesion() {
  localStorage.removeItem("usuario_actual");
  window.location.href = "../index.html";
}
