function cerrarSesion() {
  localStorage.removeItem("usuario_actual");
  location.href = "../index.html";
}

document.addEventListener("DOMContentLoaded", filtrarCitas);

function filtrarCitas() {
  const usuario = JSON.parse(localStorage.getItem("usuario_actual"));
  const citas = JSON.parse(localStorage.getItem("citas")) || [];

  const busqueda = document.getElementById("busqueda").value.toLowerCase();
  const filtroFechas = Array.from(document.querySelectorAll(".filtro-fecha:checked")).map(e => e.value);
  const filtroHoras = Array.from(document.querySelectorAll(".filtro-hora:checked")).map(e => parseInt(e.value));

  const contenedor = document.getElementById("contenedor-citas");
  contenedor.innerHTML = "";

  const hoy = new Date();
  const hoyStr = hoy.toISOString().split("T")[0];

  const semana = new Date(hoy);
  semana.setDate(hoy.getDate() - hoy.getDay());

  const mesActual = hoy.getMonth();

  const citasFiltradas = citas.filter(cita => {
    if (cita.doctor !== usuario.nombre) return false;

    const citaFecha = new Date(cita.fecha);
    const horaCita = parseInt(cita.hora.split(":")[0]);

    // Filtro bÃºsqueda
    const texto = `${cita.nombre} ${cita.servicio} ${cita.celular} ${cita.curp}`.toLowerCase();
    if (busqueda && !texto.includes(busqueda)) return false;

    // Filtro fecha
    if (filtroFechas.length > 0) {
      if (
        (filtroFechas.includes("hoy") && cita.fecha !== hoyStr) ||
        (filtroFechas.includes("semana") && (citaFecha < semana || citaFecha > hoy)) ||
        (filtroFechas.includes("mes") && citaFecha.getMonth() !== mesActual)
      ) return false;
    }

    // Filtro hora
    if (filtroHoras.length > 0 && !filtroHoras.some(h => horaCita >= h && horaCita < h + 2)) return false;

    return true;
  });

  if (citasFiltradas.length === 0) {
    contenedor.innerHTML = "<p style='text-align:center;'>No hay citas para mostrar.</p>";
    return;
  }

  citasFiltradas.forEach(cita => {
    const div = document.createElement("div");
    div.className = "card-cita";
    div.innerHTML = `
      <p><strong>Nombre y edad:</strong> ${cita.nombre} (${cita.edad})</p>
      <p><strong>Servicio:</strong> ${cita.servicio}</p>
      <p><strong>Fecha:</strong> ${cita.fecha}</p>
      <p><strong>Hora:</strong> ${cita.hora}</p>
      <p><strong>Celular:</strong> ${cita.celular}</p>
      <p><strong>CURP:</strong> ${cita.curp}</p>
      <p><strong>ID:</strong> ${cita.id}</p>
    `;
    contenedor.appendChild(div);
  });
}   