<?php
require_once 'conexion.php';

$id = $_POST['id_servicio'] ?? null;
$costo = $_POST['costo'] ?? null;

if (!$id || !is_numeric($costo) || $costo < 0) {
    echo json_encode(['success' => false, 'error' => 'Datos inválidos']);
    exit;
}

$stmt = $conn->prepare("UPDATE servicios SET costo = ? WHERE id_servicio = ?");
$stmt->bind_param("di", $costo, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}

$stmt->close();
?>
