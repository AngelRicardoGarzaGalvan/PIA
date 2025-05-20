
document.addEventListener("DOMContentLoaded", () => {
  // 💾 Generar citas de prueba si no existen
  if (!localStorage.getItem("citas")) {
    const servicios = [
      "Limpieza y prevención",
      "Odontología general",
      "Ortodoncia",
      "Estética dental",
      "Implantes y prótesis",
      "Endodoncia"
    ];

    const citasDummy = [];

    for (let i = 1; i <= 50; i++) {
      const randomServicio = servicios[Math.floor(Math.random() * servicios.length)];
      const randomDia = Math.floor(Math.random() * 28) + 1;
      const fecha = `2025-05-${String(randomDia).padStart(2, "0")}`;

      citasDummy.push({
        nombre: `Paciente ${i}`,
        correo: `paciente${i}@gmail.com`,
        fecha,
        hora: "10:00 - 12:00",
        servicio: randomServicio,
        motivo: "Consulta general"
      });
    }

    localStorage.setItem("citas", JSON.stringify(citasDummy));
  }

  llenarSelectorMeses();
  generarEstadisticas();
});

const servicios = [
  "Limpieza y prevención",
  "Odontología general",
  "Ortodoncia",
  "Estética dental",
  "Implantes y prótesis",
  "Endodoncia"
];

let citas = JSON.parse(localStorage.getItem("citas")) || [];
let graficoPastel, graficoBarras;

function llenarSelectorMeses() {
  const select = document.getElementById("mesSelect");
  const mesesUnicos = [...new Set(citas.map(cita => cita.fecha?.slice(0, 7)))].sort().reverse();

  if (mesesUnicos.length === 0) {
    select.innerHTML = `<option disabled selected>No hay citas registradas</option>`;
    return;
  }

  select.innerHTML = mesesUnicos.map(mes => {
    const nombreMes = new Date(mes + "-01").toLocaleString("default", { month: "long", year: "numeric" });
    return `<option value="${mes}">${nombreMes}</option>`;
  }).join("");
}

function generarEstadisticas() {
  const mes = document.getElementById("mesSelect").value;
  const citasFiltradas = citas.filter(cita => cita.fecha?.startsWith(mes));

  const conteoServicios = {};
  servicios.forEach(s => conteoServicios[s] = 0);

  citasFiltradas.forEach(cita => {
    if (conteoServicios[cita.servicio]) {
      conteoServicios[cita.servicio]++;
    }
  });

  const labels = servicios;
  const datos = labels.map(s => conteoServicios[s]);
  const total = datos.reduce((a, b) => a + b, 0);
  const promedio = total / servicios.length;

  renderizarGraficoPastel(labels, datos);
  renderizarGraficoBarras(labels, datos, promedio);
}

function renderizarGraficoPastel(labels, datos) {
  if (graficoPastel) graficoPastel.destroy();

  graficoPastel = new Chart(document.getElementById("graficoPastel"), {
    type: "pie",
    data: {
      labels,
      datasets: [{
        label: "Servicios más requeridos",
        data: datos,
        backgroundColor: [
          "#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff", "#ff9f40"
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}

function renderizarGraficoBarras(labels, datos, promedio) {
  if (graficoBarras) graficoBarras.destroy();

  graficoBarras = new Chart(document.getElementById("graficoBarras"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Pacientes por servicio",
          data: datos,
          backgroundColor: "#36a2eb"
        },
        {
          type: "line",
          label: "Promedio",
          data: Array(labels.length).fill(promedio),
          borderColor: "red",
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  });
}
