// doctor/js/script_citas.js

let citasGuardadas   = JSON.parse(localStorage.getItem("citas")) || [];
const calendario     = document.getElementById("calendario");
const botonesHoras   = document.getElementById("botones-horas");
const fechaInput     = document.getElementById("fecha-required");
const horaInput      = document.getElementById("hora-seleccionada");
const usuario        = JSON.parse(localStorage.getItem("usuario_actual"));
const listaMisCitas  = document.getElementById("mis-citas");

// Horarios globales por defecto
let horariosGlobales = JSON.parse(localStorage.getItem("horarios_disponibles")) || [
  "8:00 - 10:00", "10:00 - 12:00",
  "12:00 - 14:00", "14:00 - 16:00",
  "16:00 - 18:00"
];

// Si el admin no puso días concretos, la lista queda vacía
let diasDisponibles  = JSON.parse(localStorage.getItem("dias_disponibles")) || [];

// Horarios específicos por día (opcional)
let horariosPorDia   = JSON.parse(localStorage.getItem("horarios_por_dia")) || {};

let diaSeleccionado  = null;
let horaSeleccionada = null;

let hoy       = new Date();
let mesActual = hoy.getMonth();
let anioActual= hoy.getFullYear();

const horasConDoctores = {
  "8:00 - 10:00":  "Dr. Alejandro Benedicto",
  "10:00 - 12:00": "Dra. Yolanda Ramírez",
  "12:00 - 14:00": "Dr. Alejandro Benedicto",
  "14:00 - 16:00": "Dr. Ángel Ricardo",
  "16:00 - 18:00": "Dra. Yolanda Ramírez"
};

function generarCalendario() {
  const primerDia  = new Date(anioActual, mesActual, 1).getDay();
  const totalDias  = new Date(anioActual, mesActual + 1, 0).getDate();
  const nombreMes  = new Date(anioActual, mesActual)
                       .toLocaleString("default", { month: "long" });

  let tabla = `
    <table>
      <caption>
        <button onclick="cambiarMes(-1)">◀</button>
        <strong>${nombreMes} ${anioActual}</strong>
        <button onclick="cambiarMes(1)">▶</button>
      </caption>
      <tr>${["D","L","M","X","J","V","S"]
        .map(d => `<th>${d}</th>`).join("")}
      </tr>
      <tr>
  `;

  // celdas vacías antes del primer día
  for (let i = 0; i < primerDia; i++) tabla += "<td></td>";

  // celdas con días
  for (let d = 1; d <= totalDias; d++) {
    const fechaStr   = `${anioActual}-${String(mesActual+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const fechaObj   = new Date(anioActual, mesActual, d);
    const diaSemana  = fechaObj.getDay(); // 0 a 6
    const citasDelDia= citasGuardadas[fechaStr] || [];
    const horariosDia= horariosPorDia[fechaStr] || horariosGlobales;
    const todasOcupadas = citasDelDia.length >= horariosDia.length;

    // habilitado si:
    // - hay días concretos en diasDisponibles y d está allí (y no finde)
    // - o bien, si no hay lista, está habilitado de L a V
    let habilitado;
    if (diasDisponibles.length) {
      habilitado = diasDisponibles.includes(d) && diaSemana !== 0 && diaSemana !== 6;
    } else {
      habilitado = diaSemana !== 0 && diaSemana !== 6;
    }

    let clase = "dia";
    if (fechaStr === diaSeleccionado) clase += " activo";
    if (!habilitado)                clase += " bloqueado";
    if (todasOcupadas)               clase += " ocupado";

    tabla += `<td class="${clase}" 
                   data-fecha="${fechaStr}" 
                   data-dia="${diaSemana}" 
                   data-num="${d}">
                ${d}
              </td>`;
    if ((d + primerDia) % 7 === 0) tabla += "</tr><tr>";
  }

  tabla += "</tr></table>";
  calendario.innerHTML = tabla;

  // Asignamos el evento click solo a los habilitados
  document.querySelectorAll(".dia").forEach(td => {
    const diaSemana = +td.dataset.dia;
    const numDia    = +td.dataset.num;
    const fecha     = td.dataset.fecha;

    let habilitado;
    if (diasDisponibles.length) {
      habilitado = diasDisponibles.includes(numDia) && diaSemana !== 0 && diaSemana !== 6;
    } else {
      habilitado = diaSemana !== 0 && diaSemana !== 6;
    }

    if (habilitado) {
      td.addEventListener("click", () => {
        diaSeleccionado  = fecha;
        fechaInput.value = fecha;
        horaInput.value  = "";
        horaSeleccionada = null;
        generarCalendario();
        mostrarHoras();
      });
    }
  });
}

function cambiarMes(direccion) {
  mesActual += direccion;
  if (mesActual < 0) {
    mesActual = 11; anioActual--;
  } else if (mesActual > 11) {
    mesActual = 0;  anioActual++;
  }
  diaSeleccionado = null;
  fechaInput.value = "";
  horaInput.value  = "";
  generarCalendario();
  botonesHoras.innerHTML = "";
}

function mostrarHoras() {
  const citasDelDia = citasGuardadas[diaSeleccionado] || [];
  const horarios    = horariosPorDia[diaSeleccionado] || horariosGlobales;
  botonesHoras.innerHTML = "";

  horarios.forEach(hora => {
    const ocupado = citasDelDia.some(c => c.hora === hora);
    const texto   = `${hora} ${horasConDoctores[hora] || ""}`;
    const btn     = document.createElement("button");
    btn.textContent = texto;
    btn.className   = "hora-btn";

    if (ocupado) {
      btn.classList.add("ocupado");
      btn.disabled = true;
    } else {
      btn.addEventListener("click", () => {
        horaSeleccionada = hora;
        horaInput.value = hora;
        document.querySelectorAll(".hora-btn")
                .forEach(b => b.classList.remove("seleccionado"));
        btn.classList.add("seleccionado");
      });
    }
    botonesHoras.appendChild(btn);
  });
}

document.getElementById("form-cita")
        .addEventListener("submit", e => {
  e.preventDefault();
  if (!diaSeleccionado || !horaSeleccionada) {
    return alert("Selecciona un día y una hora.");
  }

  const nuevaCita = {
    nombre:   document.getElementById("nombre").value,
    edad:     document.getElementById("edad").value,
    servicio: document.getElementById("servicio").value,
    fecha:    diaSeleccionado,
    hora:     horaSeleccionada,
    motivo:   document.getElementById("motivo").value,
    correo:   usuario.correo
  };

  if (!citasGuardadas[diaSeleccionado]) {
    citasGuardadas[diaSeleccionado] = [];
  }
  citasGuardadas[diaSeleccionado].push(nuevaCita);
  localStorage.setItem("citas", JSON.stringify(citasGuardadas));
  alert("Cita agendada correctamente ✅");

  e.target.reset();
  diaSeleccionado  = null;
  horaSeleccionada = null;
  fechaInput.value = "";
  horaInput.value  = "";
  generarCalendario();
  botonesHoras.innerHTML = "";
  mostrarMisCitas();
});

function mostrarMisCitas() {
  if (!listaMisCitas) return;
  let html = "<h4>📅 Mis Citas Agendadas</h4>";
  const citas = [];

  for (const fecha in citasGuardadas) {
    citasGuardadas[fecha].forEach(c => {
      if (c.correo === usuario.correo) {
        citas.push({ ...c, fecha });
      }
    });
  }

  if (citas.length === 0) {
    html += "<p>No tienes citas agendadas aún.</p>";
  } else {
    html += "<ul style='padding-left:20px;'>";
    citas.forEach(c => {
      html += `<li><strong>${c.fecha}</strong> – ${c.hora} – ${c.servicio}</li>`;
    });
    html += "</ul>";
  }
  listaMisCitas.innerHTML = html;
}

// Arranque inicial
generarCalendario();
mostrarMisCitas();
