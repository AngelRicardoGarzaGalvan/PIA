<?php
require_once 'conexion.php';

$sql = "SELECT id_servicio,nombre, costo FROM servicios ORDER BY nombre ASC";
$result = $conn->query($sql);

$servicios = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $servicios[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($servicios);
