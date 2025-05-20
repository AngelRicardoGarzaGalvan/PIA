const roles = ["cliente", "doctor", "secretario", "admin"];
const contenedor = document.getElementById("contenedor-roles");
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

function renderizarUsuarios() {
  contenedor.innerHTML = "";

  if (usuarios.length === 0) {
    contenedor.innerHTML = "<p>No hay usuarios registrados.</p>";
    return;
  }

  usuarios.forEach((u, index) => {
    const div = document.createElement("div");
    div.className = "rol-row";
    div.innerHTML = `
      <input type="text" value="${u.nombre}" disabled />
      <input type="email" value="${u.correo}" disabled />
      <select class="rol-select" data-index="${index}">
        ${roles.map(r => `<option value="${r}" ${u.rol === r ? "selected" : ""}>${r}</option>`).join("")}
      </select>
      <button class="guardar-btn" onclick="guardarRol(${index})">Guardar</button>
    `;
    contenedor.appendChild(div);
  });
}

function guardarRol(index) {
  const nuevaSeleccion = document.querySelector(`select[data-index='${index}']`).value;
  usuarios[index].rol = nuevaSeleccion;
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert(`Rol actualizado a '${nuevaSeleccion}' para ${usuarios[index].nombre}`);
}

renderizarUsuarios();
