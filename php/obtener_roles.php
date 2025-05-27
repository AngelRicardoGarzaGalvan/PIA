<?php
require_once 'conexion.php';

$sql = "SELECT id_rol, nombre_rol FROM roles";
$result = $conn->query($sql);

$roles = [];

while ($row = $result->fetch_assoc()) {
    $roles[] = $row;
}

echo json_encode($roles);
$conn->close();
