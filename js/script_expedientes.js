// doctor/js/script_expedientes.js

const STORAGE_KEY   = "expedientes";
const EXP_CONTAINER = document.getElementById("expedientes-container");
const BUSQUEDA      = document.getElementById("busqueda-input");
const NEW_NOM       = document.getElementById("new-nombre");
const NEW_ID        = document.getElementById("new-id");
const BTN_ADD       = document.getElementById("btn-add-exp");

// Campos editables
const CAMPOS = [
  { value: "edad",    label: "Edad" },
  { value: "peso",    label: "Peso" },
  { value: "alergias",label: "Alergias" },
  { value: "ritmo",   label: "Ritmo Cardíaco" },
  { value: "presion", label: "Presión Arterial" },
  { value: "sangre",  label: "Tipo de Sangre" },
];

// Inicializa array en localStorage si no existe
function init() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
  renderExpedientes();
}

// Renderiza las tarjetas, filtrando por búsqueda
function renderExpedientes() {
  const filtro = BUSQUEDA.value.toLowerCase();
  const all    = JSON.parse(localStorage.getItem(STORAGE_KEY));
  EXP_CONTAINER.innerHTML = "";

  all
    .filter(e => 
      e.nombre.toLowerCase().includes(filtro) ||
      e.id.toLowerCase().includes(filtro)
    )
    .forEach(exp => EXP_CONTAINER.appendChild(crearCard(exp)));
}

// Crea la tarjeta de un expediente
function crearCard(exp) {
  const card = document.createElement("div");
  card.className = "expediente-card";
  card.dataset.id = exp.id;

  // Columna de datos
  const info1 = document.createElement("div");
  info1.className = "info";
  info1.innerHTML = `
    <strong>${exp.nombre}</strong><br>
    ID: ${exp.id}<br>
    Edad: ${exp.edad || ""}<br>
    Peso: ${exp.peso || ""}<br>
    Alergias: ${exp.alergias || ""}<br>
    Ritmo: ${exp.ritmo || ""}<br>
    Presión: ${exp.presion || ""}<br>
    Sangre: ${exp.sangre || ""}
  `;

  // Columna de diagnóstico
  const info2 = document.createElement("div");
  info2.className = "info";
  info2.innerHTML = `
    <em>Diagnóstico:</em><br>
    ${exp.diagnostico || "<span style='color:#888'>- sin diagnóstico -</span>"}
  `;

  // Columna de acciones
  const acciones = document.createElement("div");
  acciones.className = "acciones";

  // 1) Expediente completo
  const btnCompleto = document.createElement("button");
  btnCompleto.className = "btn-completo";
  btnCompleto.addEventListener("click", () => {
    // Guarda el expediente actual y redirige
    localStorage.setItem("expediente_actual", JSON.stringify(exp));
  });

  // 2) Modificar diagnóstico
  const btnMod = document.createElement("button");
  btnMod.className = "btn-modificar";
  btnMod.textContent = "Modificar";
  btnMod.addEventListener("click", () => {
    const nuevo = prompt("Nuevo diagnóstico:", exp.diagnostico);
    if (nuevo !== null) {
      exp.diagnostico = nuevo;
      actualizarStorage(exp);
    }
  });

  // 3) Eliminar expediente
  const btnDel = document.createElement("button");
  btnDel.className = "btn-eliminar";
  btnDel.textContent = "Eliminar";
  btnDel.addEventListener("click", () => {
    if (!confirm("¿Eliminar este expediente?")) return;
    let all = JSON.parse(localStorage.getItem(STORAGE_KEY));
    all = all.filter(e => e.id !== exp.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    renderExpedientes();
  });

  acciones.append(btnCompleto, btnMod, btnDel);

  // Form para añadir nuevos campos
  const form = document.createElement("div");
  form.className = "add-form";
  form.innerHTML = `
    <select name="campo">
      ${CAMPOS.map(c => `<option value="${c.value}">${c.label}</option>`).join("")}
    </select>
    <input type="text" name="valor" placeholder="Nuevo dato..." />
    <button>Añadir</button>
  `;
  form.querySelector("button").addEventListener("click", e => {
    e.preventDefault();
    const campo = form.querySelector("select").value;
    const valor = form.querySelector("input").value.trim();
    if (valor) {
      exp[campo] = valor;
      actualizarStorage(exp);
      form.querySelector("input").value = "";
    }
  });

  // Monta la tarjeta
  card.append(info1, info2, acciones, form);
  return card;
}

// Actualiza un expediente en storage y vuelve a renderizar
function actualizarStorage(updated) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const idx = all.findIndex(e => e.id === updated.id);
  if (idx > -1) {
    all[idx] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    renderExpedientes();
  }
}

// Crear nuevo expediente desde 0
BTN_ADD.addEventListener("click", () => {
  const nombre = NEW_NOM.value.trim();
  const id     = NEW_ID.value.trim();
  if (!nombre || !id) {
    alert("Debes indicar nombre e ID.");
    return;
  }
  let all = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (all.some(e => e.id === id)) {
    alert("Ya existe un expediente con ese ID.");
    return;
  }
  const nuevo = {
    id, nombre,
    edad: "", peso: "", alergias: "",
    ritmo: "", presion: "", sangre: "",
    diagnostico: ""
  };
  all.push(nuevo);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  NEW_NOM.value = "";
  NEW_ID.value = "";
  renderExpedientes();
});

// Filtrar en tiempo real
BUSQUEDA.addEventListener("input", renderExpedientes);

// Arranque
init();
