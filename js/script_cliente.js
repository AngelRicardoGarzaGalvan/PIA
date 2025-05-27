function cerrarSesion() {
    localStorage.removeItem("usuario_actual");
    window.location.href = "../index.html";
}
