document.addEventListener("DOMContentLoaded", () => {
    const citas = document.querySelectorAll(".cita-hoy");
  
    citas.forEach((cita) => {
      const checkbox = cita.querySelector("input[type='checkbox']");
      const metodo = cita.querySelector(".metodo");
  
      // Estado inicial
      metodo.textContent = checkbox.checked ? "Efectivo" : "Terminal";
  
      checkbox.addEventListener("change", () => {
        metodo.textContent = checkbox.checked ? "Efectivo" : "Terminal";
      });
    });
  });
  