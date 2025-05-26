<?php
header('Content-Type: application/json');

$host = "localhost";
$usuario = "root"; // tu usuario de MySQL
$password = ""; // tu contraseña (vacía por defecto en XAMPP)
$bd = "db_consultoriodental"; // nombre de tu base de datos

$conn = new mysqli($host, $usuario, $password, $bd);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => $conn->connect_error]);
    exit();
}

$sql = "SELECT 
    u.nombre, 
    u.correo, 
    u.contraseña AS password, 
    r.nombre_rol AS rol
FROM 
    usuarios u
LEFT JOIN 
    roles r ON u.id_rol = r.id_rol";
$resultado = $conn->query($sql);

$usuarios = [];

if ($resultado && $resultado->num_rows > 0) {
    while ($fila = $resultado->fetch_assoc()) {
        $usuarios[] = $fila;
    }
}

echo json_encode(["success" => true, "usuarios" => $usuarios]);

$conn->close();
?>
