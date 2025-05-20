document.addEventListener("DOMContentLoaded", () => {
    const citas = document.querySelectorAll(".cita-hoy");
  
    citas.forEach((cita) => {
      const checkbox = cita.querySelector("input[type='checkbox']");
      const estado = cita.querySelector(".estado");
  
      // Estado inicial sincronizado
      estado.textContent = checkbox.checked ? "Asistió" : "No Asistió";
  
      // Evento para cambiar texto dinámicamente
      checkbox.addEventListener("change", () => {
        estado.textContent = checkbox.checked ? "Asistió" : "No Asistió";
      });
    });
  });
  