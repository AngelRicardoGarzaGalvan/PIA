document.addEventListener("DOMContentLoaded", () => {
    const modificarBtn = document.querySelector(".acciones button");
    const eliminarBtn = document.querySelector(".acciones .eliminar");
  
    modificarBtn.addEventListener("click", () => {
      alert("Modificación de cita activada (falta lógica real)");
    });
  
    eliminarBtn.addEventListener("click", () => {
      if (confirm("¿Estás seguro de eliminar esta cita?")) {
        alert("Cita eliminada (falta lógica real)");
      }
    });
  });
  