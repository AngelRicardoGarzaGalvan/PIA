// cliente/js/script_citas.js

// --- CONFIGURACIÓN DE ENDPOINTS ---
const API_GET_CITAS  = 'php/get_citas.php';
const API_SAVE_CITA  = 'php/save_citas.php';

// --- ELEMENTOS DEL DOM ---
const calendario     = document.getElementById('calendario');
const botonesHoras   = document.getElementById('botones-horas');
const fechaInput     = document.getElementById('fecha-required');
const horaInput      = document.getElementById('hora-seleccionada');
const formCita       = document.getElementById('form-cita');
const listaMisCitas  = document.getElementById('mis-citas');

// --- VARIABLES DE ESTADO ---
let citasGuardadas   = {};
let diaSeleccionado  = null;
let horaSeleccionada = null;

// Configuración por defecto
const horariosGlobales = [
  "8:00 - 10:00","10:00 - 12:00",
  "12:00 - 14:00","14:00 - 16:00",
  "16:00 - 18:00"
];
const diasDisponibles  = [];  // [] = habilita L-V por defecto
const horariosPorDia   = {};  // {} = sin reglas extra

// Fecha actual
const hoy        = new Date();
let   mesActual  = hoy.getMonth();
let   anioActual = hoy.getFullYear();

// Mapa hora → doctor
const horasConDoctores = {
  "8:00 - 10:00":  "Dr. Alejandro Benedicto",
  "10:00 - 12:00": "Dra. Yolanda Ramírez",
  "12:00 - 14:00": "Dr. Alejandro Benedicto",
  "14:00 - 16:00": "Dr. Ángel Ricardo",
  "16:00 - 18:00": "Dra. Yolanda Ramírez"
};

// --- FUNCIONES PRINCIPALES ---

/** Carga todas las citas del servidor y refresca la UI */
async function loadCitas() {
  try {
    const res = await fetch(API_GET_CITAS, { credentials: 'include' });
    citasGuardadas = await res.json();
  } catch (e) {
    console.error('Error cargando citas:', e);
    citasGuardadas = {};
  }
  generarCalendario();
  mostrarMisCitas();
}

/** Genera la tabla del calendario con clases .activo/.bloqueado/.ocupado */
function generarCalendario() {
  const primerDia = new Date(anioActual, mesActual, 1).getDay();
  const totalDias = new Date(anioActual, mesActual + 1, 0).getDate();
  const nombreMes = new Date(anioActual, mesActual)
                        .toLocaleString('default',{ month:'long' });

  let html = `<table>
    <caption>
      <button onclick="cambiarMes(-1)">◀</button>
      <strong>${nombreMes} ${anioActual}</strong>
      <button onclick="cambiarMes(1)">▶</button>
    </caption>
    <tr>${['D','L','M','X','J','V','S']
      .map(d => `<th>${d}</th>`).join('')}</tr>
    <tr>`;

  // celdas vacías antes del primer día
  for (let i=0; i<primerDia; i++) html += '<td></td>';

  // días del mes
  for (let d=1; d<=totalDias; d++) {
    const fechaStr    = `${anioActual}-${String(mesActual+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const diaSem      = new Date(anioActual, mesActual, d).getDay();
    const citasDia    = citasGuardadas[fechaStr] || [];
    const horariosDia = horariosPorDia[fechaStr] || horariosGlobales;
    const todasOcup   = citasDia.length >= horariosDia.length;

    // habilitado = lunes-viernes y (si hay días concretos) esté listado
    const habilitado = diasDisponibles.length
      ? diasDisponibles.includes(d) && diaSem!==0 && diaSem!==6
      : diaSem!==0 && diaSem!==6;

    let cls = 'dia';
    if (fechaStr === diaSeleccionado) cls += ' activo';
    if (!habilitado)                cls += ' bloqueado';
    if (todasOcup)                   cls += ' ocupado';

    html += `<td class="${cls}"
                 data-fecha="${fechaStr}"
                 data-dia="${diaSem}"
                 data-num="${d}">
               ${d}
             </td>`;
    if ((d + primerDia) % 7 === 0) html += '</tr><tr>';
  }
  html += '</tr></table>';
  calendario.innerHTML = html;

  // Vincular eventos de clic SOLO en días habilitados
  calendario.querySelectorAll('.dia').forEach(td => {
    const diaSem = +td.dataset.dia;
    const num    = +td.dataset.num;
    const fecha  = td.dataset.fecha;

    const habil = diasDisponibles.length
      ? diasDisponibles.includes(num) && diaSem!==0 && diaSem!==6
      : diaSem!==0 && diaSem!==6;

    if (habil) {
      td.addEventListener('click', () => {
        diaSeleccionado  = fecha;
        fechaInput.value = fecha;
        horaSeleccionada = null;
        horaInput.value  = '';
        generarCalendario();
        mostrarHoras();
      });
    }
  });
}

/** Cambia mes y refresca calendario */
function cambiarMes(dir) {
  mesActual += dir;
  if (mesActual < 0)      { mesActual = 11; anioActual--; }
  else if (mesActual > 11){ mesActual = 0;  anioActual++; }
  diaSeleccionado = null;
  fechaInput.value = '';
  horaInput.value  = '';
  botonesHoras.innerHTML = '';
  generarCalendario();
}

/** Muestra los botones de horas disponibles para el día seleccionado */
function mostrarHoras() {
  botonesHoras.innerHTML = '';
  if (!diaSeleccionado) return;

  const citasDia = citasGuardadas[diaSeleccionado] || [];
  const horarios = horariosPorDia[diaSeleccionado] || horariosGlobales;

  horarios.forEach(hora => {
    const ocupado = citasDia.some(c => c.hora === hora);
    const btn     = document.createElement('button');
    btn.textContent = `${hora} ${horasConDoctores[hora] || ''}`;
    btn.className   = 'hora-btn';

    if (ocupado) {
      btn.classList.add('ocupado');
      btn.disabled = true;
    } else {
      btn.addEventListener('click', () => {
        horaSeleccionada = hora;
        horaInput.value  = hora;
        botonesHoras.querySelectorAll('.hora-btn')
          .forEach(b => b.classList.remove('seleccionado'));
        btn.classList.add('seleccionado');
      });
    }
    botonesHoras.appendChild(btn);
  });
}

/** Muestra una lista de todas las citas del usuario */
function mostrarMisCitas() {
  if (!listaMisCitas) return;
  let html = '<h4>📅 Mis Citas Agendadas</h4>';
  const todas = [];

  for (const fecha in citasGuardadas) {
    citasGuardadas[fecha].forEach(c => {
      todas.push({ ...c, fecha });
    });
  }

  if (todas.length === 0) {
    html += '<p>No tienes citas agendadas aún.</p>';
  } else {
    html += '<ul>';
    todas.forEach(c => {
      html += `<li><strong>${c.fecha}</strong> – ${c.hora} – ${c.servicio}</li>`;
    });
    html += '</ul>';
  }
  listaMisCitas.innerHTML = html;
}

// --- EVENTO SUBMIT: guarda en la BD vía AJAX ---
formCita.addEventListener('submit', async e => {
  e.preventDefault();
  if (!diaSeleccionado || !horaSeleccionada) {
    return alert('Selecciona un día y una hora.');
  }

  const formData = new FormData(formCita);
  formData.append('fecha', diaSeleccionado);
  formData.append('hora', horaSeleccionada);

  try {
    const res  = await fetch(API_SAVE_CITA, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    const json = await res.json();
    if (!json.success) {
      return alert('No se pudo guardar la cita.');
    }
    alert('Cita agendada correctamente ✅');

    // Limpiar y recargar datos
    formCita.reset();
    diaSeleccionado = horaSeleccionada = null;
    fechaInput.value = horaInput.value = '';
    botonesHoras.innerHTML = '';
    await loadCitas();
  } catch (err) {
    console.error(err);
    alert('Error de conexión al guardar la cita.');
  }
});

// Carga inicial de citas y calendario
loadCitas();
