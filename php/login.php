<?php
require_once 'conexion.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $correo = $_POST['correo'];
    $password = $_POST['password'];
    $tipo = $_POST['tipo']; // cliente, doctor, admin, secretario

    // Buscar usuario por correo
    $sql = "SELECT * FROM Usuarios WHERE correo = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows == 1) {
        $usuario = $resultado->fetch_assoc();

        if (password_verify($password, $usuario['contraseña'])) {
            // Mapa de roles actual (según tu base de datos)
            $mapa_roles = [
                "cliente" => 1,
                "admin" => 2,
                "doctor" => 3,
                "secretario" => 4
            ];

            if ($mapa_roles[$tipo] == $usuario['id_rol']) {
                $_SESSION['usuario'] = $usuario;

                // Redirigir según tipo de usuario (a un PHP que valida antes del HTML)
                switch ($tipo) {
                    case 'cliente':
                        header("Location: ../cliente/cliente_redirector.php");
                        break;
                    case 'doctor':
                        header("Location: ../doctor/doctor_redirector.php");
                        break;
                    case 'admin':
                        header("Location: ../admin/admin_redirector.php");
                        break;
                    case 'secretario':
                        header("Location: ../Secretario/secretario_redirector.php");
                        break;
                }
                exit;
            } else {
                echo "<script>alert('El rol seleccionado no coincide con tu cuenta.'); window.history.back();</script>";
            }
        } else {
            echo "<script>alert('Contraseña incorrecta.'); window.history.back();</script>";
        }
    } else {
        echo "<script>alert('Usuario no encontrado.'); window.history.back();</script>";
    }

    $stmt->close();
    $conn->close();
}
?>
