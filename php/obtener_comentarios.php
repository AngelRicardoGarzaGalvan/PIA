<?php
require_once 'conexion.php';

$sql = "SELECT c.id_comentario, c.comentario AS texto, u.nombre, u.correo
        FROM Comentarios c
        JOIN Usuarios u ON c.id_cliente = u.id_usuario
        ORDER BY c.fecha DESC";

$result = $conn->query($sql);

$comentarios = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $comentarios[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($comentarios);

$conn->close();
?>
