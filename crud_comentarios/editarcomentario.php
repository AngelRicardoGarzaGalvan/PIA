
<?php
require_once 'conexion.php';
$id = intval($_GET['id'] ?? 0);
if ($id <= 0) header('Location: comentarios.php');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $comentario = $conn->real_escape_string($_POST['comentario']);
    $sql = "UPDATE comentarios SET comentario = '$comentario' WHERE id_comentario = $id";
    if ($conn->query($sql)) { header('Location: comentarios.php'); exit; } else { $error = $conn->error; }
}
$res = $conn->query("SELECT comentario FROM comentarios WHERE id_comentario = $id");
$coment = $res->fetch_assoc();
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Editar Comentario</title>
  <link rel="stylesheet" href="../style.css">
  <link rel="stylesheet" href="../css/style_admin.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container login-box mt-5">
    <h2 class="text-center mb-4">Editar Comentario #<?= $id ?></h2>
    <?php if (isset($error)): ?><div class="alert alert-danger"><?= $error ?></div><?php endif; ?>
    <form method="POST" action="editarcomentario.php?id=<?= $id ?>">
      <label for="comentario">Comentario:</label>
      <textarea id="comentario" name="comentario" class="form-control mb-3" rows="4"><?= htmlspecialchars($coment['comentario']) ?></textarea>
      <button type="submit" class="btn btn-primary submit-btn">Actualizar</button>
      <a href="comentarios.php" class="btn btn-secondary">Cancelar</a>
    </form>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>