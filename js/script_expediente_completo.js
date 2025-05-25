// doctor/js/script_expediente_completo.js

// 1) Referencia al contenedor donde volcamos los datos
const cont = document.getElementById("detalle-expediente");

// 2) Leemos el parámetro "id" de la URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  cont.innerHTML = `<p style="color: red;">No se proporcionó un ID de expediente.</p>`;
  throw new Error("Falta el parámetro id en la query string");
}

// 3) Recuperamos todos los expedientes de localStorage
const expedientes = JSON.parse(localStorage.getItem("expedientes") || "[]");
// 4) Buscamos el que coincide con el ID
const exp = expedientes.find(e => e.id === id);

if (!exp) {
  cont.innerHTML = `<p style="color: red;">No se encontró expediente con ID <strong>${id}</strong>.</p>`;
} else {
  // 5) Si existe, renderizamos todos sus campos
  cont.innerHTML = `
    <div class="card-cita">
      <p><strong>Nombre:</strong> ${exp.nombre}</p>
      <p><strong>ID:</strong> ${exp.id}</p>
      <p><strong>Edad:</strong> ${exp.edad || "-"}</p>
      <p><strong>Peso:</strong> ${exp.peso || "-"}</p>
      <p><strong>Alergias:</strong> ${exp.alergias || "-"}</p>
      <p><strong>Ritmo cardíaco:</strong> ${exp.ritmo || "-"}</p>
      <p><strong>Presión arterial:</strong> ${exp.presion || "-"}</p>
      <p><strong>Tipo de sangre:</strong> ${exp.sangre || "-"}</p>
      <h3>Diagnóstico</h3>
      <textarea readonly>${exp.diagnostico || ""}</textarea>
    </div>
  `;
}
