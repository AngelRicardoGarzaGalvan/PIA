<?php
// Datos de conexión a MySQL
$servidor = "localhost";
$usuario = "root";
$clave = "";
$base_datos = "DB_ConsultorioDental";

// Crear conexión
$conn = new mysqli($servidor, $usuario, $clave, $base_datos);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>
