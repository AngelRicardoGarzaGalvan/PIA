let horariosBase = JSON.parse(localStorage.getItem("horarios_disponibles")) || [
  "8:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00"
];

let diasActivos = JSON.parse(localStorage.getItem("dias_disponibles")) || [];
let horariosPorDia = JSON.parse(localStorage.getItem("horarios_por_dia")) || {};

const listaHorarios = document.getElementById("lista-horarios");
const calendario = document.getElementById("calendario-dias");

const panel = document.getElementById("editor-dia");
const fechaEditando = document.getElementById("fecha-editando");
const checksContainer = document.getElementById("horarios-checks");

let fechaSeleccionada = null;

function renderizarHorarios() {
  listaHorarios.innerHTML = "";
  horariosBase.forEach((h, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${h}</span>
      <button class="btn-eliminar" onclick="eliminarHorario(${i})">Eliminar</button>
    `;
    listaHorarios.appendChild(li);
  });
}

function agregarHorario() {
  const nuevo = document.getElementById("input-nuevo-horario").value.trim();
  if (nuevo && !horariosBase.includes(nuevo)) {
    horariosBase.push(nuevo);
    document.getElementById("input-nuevo-horario").value = "";
    renderizarHorarios();
  }
}

function eliminarHorario(index) {
  horariosBase.splice(index, 1);
  renderizarHorarios();
}

function renderizarCalendario() {
  const dias = 31;
  calendario.innerHTML = "";

  for (let i = 1; i <= dias; i++) {
    const dia = document.createElement("div");
    dia.className = "dia";
    dia.textContent = i;
    if (diasActivos.includes(i)) dia.classList.add("activo");

    dia.addEventListener("click", () => {
      const fecha = generarFechaFormato(i);
      fechaSeleccionada = fecha;
      abrirPanelHorario(fecha);
    });

    calendario.appendChild(dia);
  }
}

function generarFechaFormato(dia) {
  const hoy = new Date();
  const mes = hoy.getMonth() + 1;
  const anio = hoy.getFullYear();
  return `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

function abrirPanelHorario(fecha) {
  fechaEditando.textContent = fecha;
  checksContainer.innerHTML = "";

  const horariosParaEseDia = horariosPorDia[fecha] || [];

  horariosBase.forEach(h => {
    const label = document.createElement("label");
    const check = document.createElement("input");
    check.type = "checkbox";
    check.value = h;
    if (horariosParaEseDia.includes(h)) check.checked = true;
    label.appendChild(check);
    label.append(h);
    checksContainer.appendChild(label);
  });

  panel.classList.remove("hidden");
}

function guardarHorariosDelDia() {
  const checks = document.querySelectorAll("#horarios-checks input[type='checkbox']");
  const seleccionados = Array.from(checks).filter(c => c.checked).map(c => c.value);

  if (seleccionados.length === 0) {
    delete horariosPorDia[fechaSeleccionada];
  } else {
    horariosPorDia[fechaSeleccionada] = seleccionados;
  }

  panel.classList.add("hidden");
  alert("Horarios actualizados para el " + fechaSeleccionada);
}

function guardarCambios() {
  localStorage.setItem("horarios_disponibles", JSON.stringify(horariosBase));
  localStorage.setItem("dias_disponibles", JSON.stringify(diasActivos));
  localStorage.setItem("horarios_por_dia", JSON.stringify(horariosPorDia));
  alert("Cambios guardados correctamente.");
}

renderizarHorarios();
renderizarCalendario();
