<?php
require_once 'conexion.php';

// Obtener todos los comentarios junto con el nombre del cliente
$sql = "SELECT c.id_comentario, u.nombre AS cliente, c.comentario, c.fecha
        FROM comentarios c
        JOIN usuarios u ON c.id_cliente = u.id_usuario
        ORDER BY c.fecha DESC";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin | Comentarios</title>
  <!-- Estilos personalizados -->
  <link rel="stylesheet" href="../style.css">
  <link rel="stylesheet" href="../css/style_admin.css">
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="top-bar">
    <h1>Consultorio Dental</h1>
    <p>Modo Administrador de Comentarios</p>
  </div>
  <div class="nav-bar">
    <button class="active" onclick="location.href='comentarios.php'">Administrador de Comentarios</button>
    <button onclick="location.href='../admin/admin_horarios.html'">Horarios y Días</button>
    <button onclick="location.href='admin_roles.html'">Asignamiento de Rol</button>
    <button onclick="location.href='admin_estadisticas.html'">Estadísticas</button>
    <button onclick="location.href='admin_servicios.html'">Servicios</button>
    <button onclick="cerrarSesion()">Cerrar sesión</button>
  </div>
  <div class="container admin-container mt-4">
    <table class="table table-striped">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Comentario</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
      <?php if ($result->num_rows > 0): ?>
        <?php while($row = $result->fetch_assoc()): ?>
        <tr>
          <td><?= $row['id_comentario'] ?></td>
          <td><?= htmlspecialchars($row['cliente']) ?></td>
          <td><?= nl2br(htmlspecialchars($row['comentario'])) ?></td>
          <td><?= $row['fecha'] ?></td>
          <td>
            <a href="editarcomentario.php?id=<?= $row['id_comentario'] ?>" class="btn btn-sm btn-primary">Editar</a>
            <a href="borrarcomentario.php?id=<?= $row['id_comentario'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('¿Eliminar este comentario?')">Borrar</a>
          </td>
        </tr>
        <?php endwhile; ?>
      <?php else: ?>
        <tr><td colspan="5" class="text-center">No hay comentarios.</td></tr>
      <?php endif; ?>
      </tbody>
    </table>
  </div>
  <script src="../js/script_admin.js"></script>
  <!-- Bootstrap JS -->

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
