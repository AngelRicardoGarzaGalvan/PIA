// script_registro.js
document.querySelector(".submit-btn").addEventListener("click", function () {
  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const password = document.getElementById("password").value;
  const confirmar = document.getElementById("confirmar").value;
  const rol = "cliente"; // siempre será cliente

  if (!nombre || !telefono || !correo || !password || !confirmar) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  if (password !== confirmar) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (usuarios.some(u => u.correo === correo)) {
    alert("Este correo ya está registrado.");
    return;
  }

  const nuevoUsuario = { nombre, telefono, correo, password, rol };
  usuarios.push(nuevoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  alert("Registro exitoso. Ahora puedes iniciar sesión.");
  location.href = "index.html";
});
