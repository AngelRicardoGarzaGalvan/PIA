<?php
require_once 'conexion.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_comentario = intval($_POST['id_comentario'] ?? 0);
    $id_cliente = intval($_POST['id_cliente'] ?? 0);
    
    if (!$id_comentario || !$id_cliente) {
        echo json_encode(['error' => 'Datos incompletos']);
        exit;
    }

    // Verificar que el comentario pertenece al cliente (para evitar que borren comentarios ajenos)
    $sql_check = "SELECT id_cliente FROM Comentarios WHERE id_comentario = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param("i", $id_comentario);
    $stmt_check->execute();
    $result = $stmt_check->get_result();
    $row = $result->fetch_assoc();

    if (!$row || $row['id_cliente'] != $id_cliente) {
        echo json_encode(['error' => 'No tienes permiso para eliminar este comentario']);
        exit;
    }

    $sql = "DELETE FROM Comentarios WHERE id_comentario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_comentario);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Error al eliminar comentario']);
    }

    $stmt->close();
    $stmt_check->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'Método no permitido']);
}
?>
