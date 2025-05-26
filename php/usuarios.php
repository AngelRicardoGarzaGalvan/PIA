<?php
require_once 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST['nombre'];
    $telefono = $_POST['telefono'];
    $correo = $_POST['correo'];
    $contrasena = $_POST['contrasena'];
    

    $contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);
    $rol_cliente = 1; // Cliente

    $sql = "INSERT INTO Usuarios (nombre, correo, contraseña, telefono, id_rol)
            VALUES (?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssi", $nombre, $correo, $contrasena_hash, $telefono, $rol_cliente);

    if ($stmt->execute()) {
        echo "<script>alert('Registro exitoso.'); window.location.href='../index.html';</script>";
    } else {
        echo "<script>alert('Error al registrar: " . $stmt->error . "'); window.history.back();</script>";
    }

    $stmt->close();
    $conn->close();
}
?>

