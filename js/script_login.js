document.querySelector(".submit-btn").addEventListener("click", function () {
  const correo = document.getElementById("correo").value.trim();
  const password = document.getElementById("password").value.trim();
  const tipo = document.getElementById("tipo").value;

  if (!correo || !password || !tipo) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuario = usuarios.find(u => u.correo === correo && u.password === password && u.rol === tipo);

  if (!usuario) {
    alert("Credenciales incorrectas o rol no coincide.");
    return;
  }

  localStorage.setItem("usuario_actual", JSON.stringify(usuario));

  // ✅ Redireccionar según rol
  switch (usuario.rol) {
    case "cliente":
      location.href = "cliente/principal.html";
      break;
    case "doctor":
      location.href = "doctor/panel.html"; // 🧠 cambia esto por la ruta real de tu panel doctor
      break;
    case "admin":
      location.href = "admin/admin_comentarios.html"; // ✅ esta es tu pantalla inicial de admin
      break;
    case "secretario":
      location.href = "secretario/panel.html"; // 🧠 cambia esto por la ruta real de secretario
      break;
    default:
      alert("Rol no reconocido.");
  }
});
