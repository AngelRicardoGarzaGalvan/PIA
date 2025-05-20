const usuario = JSON.parse(localStorage.getItem("usuario_actual"));
document.getElementById("nombre-usuario").value = usuario?.nombre || "Cliente";

function mostrarComentarios(){
    let comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
    
    //Reparar comentarios antiguos que no tenían correo (una vez)
    comentarios = comentarios.map(c => {
        if (!c.correo && c.nombre === usuario.nombre) {
            return { ...c, correo: usuario.correo };
        }
        return c;
    })
    localStorage.setItem("comentarios", JSON.stringify(comentarios));

    const contenedor = document.getElementById("lista-comentarios");
    contenedor.innerHTML = "";

    if (comentarios.legth === 0){
        contenedor.innerHTML = "<p>Aún no hay comentarios. ¡Sé el primero en dejar uno! </p>";
        return;
    }

    comentarios.forEach((c, index) => {
        const div = document.createElement("div");
        div.style.marginBottom = "12px";
        div.style.borderBottom = "1px solid #ccc";
        div.style.paddingBottom = "10px";
    
        const texto = `<p style="font-style: italic;">"${c.texto}"</p>`;
        const autor = `<p style="font-weight: bold;">— ${c.nombre}</p>`;

        let botones = "";
        if (c.correo === usuario.correo) {
            botones = `
            <button onclick="eliminarComentario(${index})"
            style="background-color:#ff6b6b; color:white; border:none;
            padding:5px 10px; border-radius:5px; cursor:pointer;">
            Eliminar
            </button>
            `;
        }   

    div.innerHTML = texto + autor + botones;
    contenedor.appendChild(div);
  });
}

function guardarComentario() {
    const texto = document.getElementById("comentario").value.trim();
    if (!texto) {
        alert("Por favor escribe un comentario.");
        return;
    }

    const nuevoComentario = {
        texto,
        nombre: usuario.nombre,
        correo: usuario.correo
    };

    const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
    comentarios.push(nuevoComentario);
    localStorage.setItem("comentarios", JSON.stringify(comentarios));

    document.getElementById("comentario").value = "";
    mostrarComentarios();
}

function eliminarComentario(index) {
    const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
    if (confirm("¿Estás seguro de eliminar tu comentario?")) {
        comentarios.splice(index, 1);
        localStorage.setItem("comentarios", JSON.stringify(comentarios));
        mostrarComentarios();
    }
}

mostrarComentarios();
