document.addEventListener("DOMContentLoaded", () => {
    const citas = document.querySelectorAll(".cita-hoy");
  
    citas.forEach((cita) => {
      const checkbox = cita.querySelector("input[type='checkbox']");
      const estado = cita.querySelector(".estado");
  
      checkbox.addEventListener("change", () => {
        estado.textContent = checkbox.checked ? "Aceptada" : "No Aceptada";
      });
    });
  });
  