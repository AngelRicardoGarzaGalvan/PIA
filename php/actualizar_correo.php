<?php
require_once 'conexion.php';

$id = intval($_POST['id_usuario'] ?? 0);
$correo = trim($_POST['correo'] ?? '');

if (!$id || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['error' => 'Datos inválidos']);
    exit;
}

$sql = "UPDATE usuarios SET correo = ? WHERE id_usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $correo, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Error al actualizar']);
}

$stmt->close();
$conn->close();
