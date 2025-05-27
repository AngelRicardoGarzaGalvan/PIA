document.addEventListener("DOMContentLoaded", async () => {
  const rolesRes = await fetch("../php/obtener_roles.php");
  const roles = await rolesRes.json();
  console.log(roles);

  const usuariosRes = await fetch("../php/obtener_usuarios.php");
  const usuarios = await usuariosRes.json();

  
  const contenedor = document.getElementById("contenedor-roles");

  const tabla = document.createElement("table");
  tabla.classList.add("tabla-usuarios");

  const thead = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Correo</th>
        <th>Rol</th>
        <th>Acción</th>
      </tr>
    </thead>`;
  tabla.innerHTML = thead;

  const tbody = document.createElement("tbody");

  usuarios.forEach(usuario => {
    const fila = document.createElement("tr");

    // Crear el select de roles
    const selectRol = document.createElement("select");
    selectRol.id = `rol-${usuario.id_usuario}`;
    roles.forEach(rol => {
      const option = document.createElement("option");
      option.value = rol.id_rol;
      option.textContent = rol.nombre_rol;
      if (rol.id_rol == usuario.id_rol) option.selected = true;
      selectRol.appendChild(option);
    });

    fila.innerHTML = `
      <td>${usuario.id_usuario}</td>
      <td>${usuario.nombre}</td>
      <td><input type="email" id="correo-${usuario.id_usuario}" value="${usuario.correo}" /></td>
      <td></td>
      <td>
        <button onclick="actualizarUsuario(${usuario.id_usuario})">Guardar</button>
      </td>
    `;

    fila.children[3].appendChild(selectRol); // Insertar el select en la celda de rol
    tbody.appendChild(fila);
  });

  tabla.appendChild(tbody);
  contenedor.appendChild(tabla);
});

function actualizarUsuario(id) {
  const correo = document.getElementById(`correo-${id}`).value;
  const idRol = document.getElementById(`rol-${id}`).value;

  const data = new URLSearchParams();
  data.append("id_usuario", id);
  data.append("correo", correo);
  data.append("id_rol", idRol);

  console.log("Enviando datos:", {
    id_usuario: id,
    correo: correo,
    id_rol: idRol
  });

  fetch("../php/actualizar_correo.php", {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        alert("Usuario actualizado correctamente");
      } else {
        alert("Error: " + res.error);
      }
    });
}
