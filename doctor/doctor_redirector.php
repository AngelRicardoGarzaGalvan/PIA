<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();

if (!isset($_SESSION['usuario']) || $_SESSION['usuario']['id_rol'] != 3) {
    echo "<script>alert('Debes iniciar sesión como Doctor para acceder.'); window.location.href = '../index.html';</script>";
    exit;
}

// Redirige a la página HTML real
header("Location: panel.html");
exit;
?>
