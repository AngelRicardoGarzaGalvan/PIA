<?php
require_once 'conexion.php';
$id = intval($_GET['id'] ?? 0);
if ($id > 0) {
    $conn->query("DELETE FROM comentarios WHERE id_comentario = $id");
}
header('Location: comentarios.php'); exit;
?>
