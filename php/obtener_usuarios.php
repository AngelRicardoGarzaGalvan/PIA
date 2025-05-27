<?php
require_once 'conexion.php';

$sql = "SELECT u.id_usuario, u.nombre, u.correo, u.id_rol, r.nombre_rol as rol
FROM usuarios u
left join roles r on r.id_rol = u.id_rol 
ORDER BY nombre ASC";
$result = $conn->query($sql);

$usuarios = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $usuarios[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($usuarios);
