<?php
header('Content-Type: application/json; charset=UTF-8');
session_start();
require __DIR__ . '/conexion.php';

// Verificamos sesión
if (!isset($_SESSION['correo'])) {
  http_response_code(401);
  echo json_encode(['success'=>false]);
  exit;
}

// Campos mínimos
$req = ['nombre','edad','servicio','fecha','hora'];
foreach ($req as $f) {
  if (empty($_POST[$f])) {
    http_response_code(400);
    echo json_encode(['success'=>false]);
    exit;
  }
}

$stmt = $conn->prepare("
  INSERT INTO citas
    (nombre, edad, servicio, fecha, hora, motivo, correo)
  VALUES (?,?,?,?,?,?,?)
");
$stmt->bind_param(
  "sssssss",
  $_POST['nombre'],
  $_POST['edad'],
  $_POST['servicio'],
  $_POST['fecha'],
  $_POST['hora'],
  $_POST['motivo'] ?? '',
  $_SESSION['correo']
);

if ($stmt->execute()) {
  echo json_encode(['success'=>true]);
} else {
  http_response_code(500);
  echo json_encode(['success'=>false]);
}
