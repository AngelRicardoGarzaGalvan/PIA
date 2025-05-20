let citasGuardadas = JSON.parse(localStorage.getItem("citas")) || [];

const calendario = document.getElementById("calendario");
const botonesHoras = document.getElementById("botones-horas");
const fechaInput = document.getElementById("fecha-required");
const horaInput = document.getElementById("hora-seleccionada");
const usuario = JSON.parse(localStorage.getItem("usuario_actual"));
const listaMisCitas = document.getElementById("mis-citas");

let horariosGlobales = JSON.parse(localStorage.getItem("horarios_disponibles")) || [
    "8:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00"
];

let diasDisponibles = JSON.parse(localStorage.getItem("dias_disponibles")) || [];

let horariosPorDia = JSON.parse(localStorage.getItem("horarios_por_dia")) || {};

let diaSeleccionado = null;
let horaSeleccionada = null;

let hoy = new Date();
let mesActual = hoy.getMonth();
let anioActual = hoy.getFullYear();

const horasConDoctores = {
    "8:00 - 10:00": "Dr. Alejandro Benedicto",
    "10:00 - 12:00": "Dra. Yolanda Ramírez",
    "12:00 - 14:00": "Dr. Alejandro Benedicto",
    "14:00 - 16:00": "Dr. Ángel Ricardo",
    "16:00 - 18:00": "Dra. Yolanda Ramírez"
};

function generarCalendario() {
    const primerDia = new Date(anioActual, mesActual, 1).getDay();
    const totalDias = new Date(anioActual, mesActual + 1, 0).getDate();

    const nombreMes = new Date(anioActual, mesActual).toLocaleString("default", { month: "long" });
    let tabla = `
        <table>
        <caption>
            <button onclick="cambiarMes(-1)">◀</button>
            <strong>${nombreMes} ${anioActual}</strong>
            <button onclick="cambiarMes(1)">▶</button>
        </caption>
        <tr>
  `;

    const diasSemana = ["D", "L", "M", "X", "J", "V", "S"];
    diasSemana.forEach(d => tabla += `<th>${d}</th>`);
    tabla += "</tr><tr>";

    for (let i = 0; i < primerDia; i++) tabla += "<td></td>";

    for (let d = 1; d <= totalDias; d++) {
        const fechaStr = `${anioActual}-${String(mesActual + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const fechaObj = new Date(anioActual, mesActual, d);
        const diaSemana = fechaObj.getDay();
        const citasDelDia = citasGuardadas[fechaStr] || [];
        const horariosDia = horariosPorDia[fechaStr] || horariosGlobales;
        const todasOcupadas = citasDelDia.length >= horariosDia.length;
        const habilitado = diasDisponibles.includes(d);

    let clase = "dia";
    if (fechaStr === diaSeleccionado) clase += " activo";
    if (!habilitado) clase += " bloqueado";
    if (todasOcupadas) clase += " ocupado";

    tabla += `<td class="${clase}" data-fecha="${fechaStr}" data-dia="${diaSemana}" data-num="${d}">${d}</td>`;
    if ((d + primerDia) % 7 === 0) tabla += "</tr><tr>";
    }

    tabla += "</tr></table>";
    calendario.innerHTML = tabla;

    document.querySelectorAll(".dia").forEach(td => {
        const diaSemana = parseInt(td.dataset.dia);
        const numDia = parseInt(td.dataset.num);
        const fecha = td.dataset.fecha;

    if (diasDisponibles.includes(numDia) && diaSemana !== 0 && diaSemana !== 6) {
        td.addEventListener("click", () => {
            diaSeleccionado = fecha;
            fechaInput.value = diaSeleccionado;
            horaInput.value = "";
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
        mesActual = 11;
        anioActual--;
    } else if (mesActual > 11) {
        mesActual = 0;
        anioActual++;
    }
    generarCalendario();
    botonesHoras.innerHTML = "";
    fechaInput.value = "";
    horaInput.value = "";
    diaSeleccionado = null;
}

function mostrarHoras() {
    const citasDelDia = citasGuardadas[diaSeleccionado] || [];
    const horarios = horariosPorDia[diaSeleccionado] || horariosGlobales;

    botonesHoras.innerHTML = "";

    horarios.forEach(hora => {
        const ocupado = citasDelDia.some(c => c.hora === hora);
        const textoMostrar = `${hora} ${horasConDoctores[hora] || ""}`;
        const btn = document.createElement("button");
        btn.textContent = textoMostrar;
        btn.className = "hora-btn";
        if (ocupado) {
        btn.classList.add("ocupado");
        btn.disabled = true;
        } else {
            btn.addEventListener("click", () => {
                horaSeleccionada = hora;
                horaInput.value = hora;
                document.querySelectorAll(".hora-btn").forEach(b => b.classList.remove("seleccionado"));
                btn.classList.add("seleccionado");
            });
        }
    botonesHoras.appendChild(btn);
    });
}

document.getElementById("form-cita").addEventListener("submit", e => {
    e.preventDefault();

    if (!diaSeleccionado || !horaSeleccionada) {
        alert("Selecciona un día y una hora.");
        return;
    }

    const nuevaCita = {
        nombre: document.getElementById("nombre").value,
        edad: document.getElementById("edad").value,
        servicio: document.getElementById("servicio").value,
        fecha: diaSeleccionado,
        hora: horaSeleccionada,
        motivo: document.getElementById("motivo").value,
        correo: usuario.correo
  };

    if (!citasGuardadas[diaSeleccionado]) {
        citasGuardadas[diaSeleccionado] = [];
    }
    citasGuardadas[diaSeleccionado].push(nuevaCita);

    localStorage.setItem("citas", JSON.stringify(citasGuardadas));
    alert("Cita agendada correctamente ✅");

    e.target.reset();
    diaSeleccionado = null;
    horaSeleccionada = null;
    fechaInput.value = "";
    horaInput.value = "";
    generarCalendario();
    botonesHoras.innerHTML = "";
    mostrarMisCitas();
});

function mostrarMisCitas() {
    if (!listaMisCitas) return;
    let html = "<h4>📅 Mis Citas Agendadas</h4>";
    let citas = [];

    for (const fecha in citasGuardadas) {
        citasGuardadas[fecha].forEach(cita => {
        if (cita.correo === usuario.correo) {
            citas.push({ ...cita, fecha });
        }
        });
    }

    if (citas.length === 0) {
        html += "<p>No tienes citas agendadas aún.</p>";
    } else {
        html += "<ul style='padding-left: 20px;'>";
        citas.forEach(cita => {
        html += `<li><strong>${cita.fecha}</strong> – ${cita.hora} – ${cita.servicio}</li>`;
        });
        html += "</ul>";
    }

    listaMisCitas.innerHTML = html;
}

generarCalendario();
mostrarMisCitas();
