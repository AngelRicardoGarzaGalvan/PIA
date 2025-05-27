<?php
require_once 'conexion.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $texto = $_POST['texto'] ?? '';
    $id_cliente = intval($_POST['id_cliente'] ?? 0);

    if (!$texto || !$id_cliente) {
        echo json_encode(['error' => 'Datos incompletos']);
        exit;
    }

    $sql = "INSERT INTO Comentarios (id_cliente, comentario, fecha) VALUES (?, ?, NOW())";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("is", $id_cliente, $texto);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Error al guardar comentario']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'Método no permitido']);
}
?>
