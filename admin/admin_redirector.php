<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();

if (!isset($_SESSION['usuario']) || $_SESSION['usuario']['id_rol'] != 2) {
    echo "<script>alert('Debes iniciar sesión como administrador para acceder.'); window.location.href = '../index.html';</script>";
    exit;
}

// Redirige a la página HTML real
header("Location: admin_comentarios.html");
exit;
?>
