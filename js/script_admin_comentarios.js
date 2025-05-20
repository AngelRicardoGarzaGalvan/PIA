function mostrarComentarios() {
  const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
  const contenedor = document.getElementById("contenedor-comentarios");
  contenedor.innerHTML = "";

  if (comentarios.length === 0) {
    contenedor.innerHTML = "<p>No hay comentarios registrados.</p>";
    return;
  }

  comentarios.forEach((c, index) => {
    const div = document.createElement("div");
    div.className = "comentario-box";


    div.innerHTML = `
      <h4>${c.nombre}</h4>
      <p style="font-style: italic;">"${c.texto}"</p>
      <div class="acciones">
        <button class="btn-editar" onclick="editarComentario(${index})">Editar</button>
        <button class="btn-borrar" onclick="eliminarComentario(${index})">Borrar</button>
      </div>
    `;
    contenedor.appendChild(div);
  });
}

function eliminarComentario(index) {
  if (!confirm("¿Deseas eliminar este comentario?")) return;
  const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
  comentarios.splice(index, 1);
  localStorage.setItem("comentarios", JSON.stringify(comentarios));
  mostrarComentarios();
}

function editarComentario(index) {
  alert("Función editar en construcción 🛠️");
}

mostrarComentarios();
