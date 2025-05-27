<?php
header('Content-Type: application/json; charset=UTF-8');
session_start();
require __DIR__ . '/conexion.php';

// Si no hay sesión, devolvemos vacío
if (!isset($_SESSION['correo'])) {
  echo json_encode([]);
  exit;
}

$correo = $_SESSION['correo'];
$stmt = $conn->prepare("
  SELECT nombre, edad, servicio, fecha, hora, motivo
    FROM citas
   WHERE correo = ?
   ORDER BY fecha, hora
");
$stmt->bind_param("s", $correo);
$stmt->execute();
$res = $stmt->get_result();

$grouped = [];
while ($r = $res->fetch_assoc()) {
  $grouped[$r['fecha']][] = $r;
}

echo json_encode($grouped);
