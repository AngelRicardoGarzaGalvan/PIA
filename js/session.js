
// session.js
const USUARIOS_KEY = "usuarios";
const USUARIO_ACTUAL_KEY = "usuario_actual";

// Crear usuarios de prueba si no existen
function crearUsuariosPrueba() {
  const usuarios = JSON.parse(localStorage.getItem(USUARIOS_KEY)) || [];
  if (usuarios.length === 0) {
    const usuariosIniciales = [
      { nombre: "Ana Pérez", correo: "ana@cliente.com", password: "1234", rol: "cliente" },
      { nombre: "Dr. Mario López", correo: "mario@doctor.com", password: "1234", rol: "doctor" },
      { nombre: "Admin General", correo: "admin@consultorio.com", password: "1234", rol: "admin" },
      { nombre: "Laura Secretaria", correo: "laura@secretaria.com", password: "1234", rol: "secretario" }
    ];
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuariosIniciales));
  }
}

function guardarUsuarioActual(usuario) {
  localStorage.setItem(USUARIO_ACTUAL_KEY, JSON.stringify(usuario));
}

function obtenerUsuarioActual() {
  return JSON.parse(localStorage.getItem(USUARIO_ACTUAL_KEY));
}

function cerrarSesion() {
  localStorage.removeItem(USUARIO_ACTUAL_KEY);
}

// crearUsuariosPrueba();
async function cargarUsuariosDesdeBD() {
  try {
    const response = await fetch('php/usuarios.php');
    const data = await response.json();

    if (data.success) {
      localStorage.setItem(USUARIOS_KEY, JSON.stringify(data.usuarios));
      return data.usuarios;
    } else {
      console.error('No se pudieron obtener los usuarios');
      return [];
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    return [];
  }
}

cargarUsuariosDesdeBD();