document.addEventListener("DOMContentLoaded", () => {
    const mesSelector = document.getElementById("mes-selector");
    const tablaCalendario = document.getElementById("tabla-calendario");
    const filasHora = document.querySelectorAll(".fila-hora");
  
    const cupoMaximoPorHora = 3;
    const horas = [
      "8 am - 10 am",
      "10 am - 12 pm",
      "12 pm - 2 pm",
      "2 pm - 4 pm",
      "4 pm - 6 pm",
    ];
  
    let fechaSeleccionada = obtenerFechaActual();
    let asignaciones = JSON.parse(localStorage.getItem("asignaciones")) || {};
  
    mesSelector.addEventListener("change", () => {
      generarCalendario(parseInt(mesSelector.value));
    });
  
    function obtenerFechaActual() {
      const hoy = new Date();
      return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
    }
  
    function generarCalendario(mes) {
      const hoy = new Date();
      const año = hoy.getFullYear();
      const primerDia = new Date(año, mes, 1).getDay();
      const totalDias = new Date(año, mes + 1, 0).getDate();
  
      tablaCalendario.innerHTML = `
        <tr><th>D</th><th>L</th><th>M</th><th>X</th><th>J</th><th>V</th><th>S</th></tr>`;
  
      let fila = document.createElement("tr");
      for (let i = 0; i < primerDia; i++) fila.innerHTML += "<td></td>";
  
      for (let dia = 1; dia <= totalDias; dia++) {
        const fechaStr = `${año}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
        const td = document.createElement("td");
        td.textContent = dia;
  
        if (fechaStr === obtenerFechaActual()) td.classList.add("hoy");
  
        const asignacionesDia = asignaciones[fechaStr] || {};
        const horasLlenas = Object.values(asignacionesDia).filter(
          (arr) => arr.length >= cupoMaximoPorHora
        );
  
        if (horasLlenas.length === horas.length) {
          td.classList.add("ocupado");
          td.innerHTML = `${dia}<span class="marcador">❌</span>`;
        }
  
        td.addEventListener("click", () => {
          fechaSeleccionada = fechaStr;
          actualizarHorarios(fechaSeleccionada);
        });
  
        fila.appendChild(td);
        if ((primerDia + dia) % 7 === 0) {
          tablaCalendario.appendChild(fila);
          fila = document.createElement("tr");
        }
      }
  
      if (fila.children.length > 0) tablaCalendario.appendChild(fila);
    }
  
    function actualizarHorarios(fecha) {
      filasHora.forEach((fila, index) => {
        const horaTexto = horas[index];
        const span = fila.querySelector("span");
        const select = fila.querySelector("select");
        const boton = fila.querySelector("button");
  
        const citas = (asignaciones[fecha] && asignaciones[fecha][horaTexto]) || [];
  
        if (citas.length >= cupoMaximoPorHora) {
          span.classList.add("bloque-rojo");
          boton.disabled = true;
          select.disabled = true;
          boton.textContent = "Lleno";
        } else {
          span.classList.remove("bloque-rojo");
          boton.disabled = false;
          select.disabled = false;
          boton.textContent = "Añadir";
        }
  
        boton.onclick = () => {
          const doctor = select.value;
          if (!asignaciones[fecha]) asignaciones[fecha] = {};
          if (!asignaciones[fecha][horaTexto]) asignaciones[fecha][horaTexto] = [];
  
          if (asignaciones[fecha][horaTexto].includes(doctor)) {
            alert("Este doctor ya está asignado en ese horario.");
            return;
          }
  
          asignaciones[fecha][horaTexto].push(doctor);
          localStorage.setItem("asignaciones", JSON.stringify(asignaciones));
  
          // Refrescar visualmente todo
          actualizarHorarios(fecha);
          generarCalendario(parseInt(mesSelector.value));
        };
      });
    }
  
    generarCalendario(parseInt(mesSelector.value));
  });
  