<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();
try {
    require "connection.php";

    // Validate that username and password are set
    if (!isset($_POST['username']) || !isset($_POST['password'])) {
        throw new Exception('Username and password are required');
    }

    $username = $_POST['username'];
    $password = $_POST['password'];

    // Prepare statement to prevent SQL injection
    $stmt = $mysqli->prepare("SELECT Username, Password FROM signups WHERE Username = ?");
    $stmt_admin = $admin_conn->prepare("SELECT adminName, adminPassword FROM adminUsers WHERE adminName = ?");

    if (!$stmt) {
        throw new Exception('Database prepare failed for users: ' . $mysqli->error);
    }

    if (!$stmt_admin) {
        throw new Exception('Database prepare failed for admin: ' . $admin_conn->error);
    }

    $stmt->bind_param("s", $username);
    $stmt_admin->bind_param("s", $username);
    
    if (!$stmt->execute()) {
        throw new Exception('Database query failed for users: ' . $stmt->error);
    }

    if (!$stmt_admin->execute()) {
        throw new Exception('Database query failed for admin: ' . $stmt_admin->error);
    }

    // Get result
    $result = $stmt->get_result();
    $result_admin = $stmt_admin->get_result();

    $user_admin = $result_admin->fetch_assoc();
    $user = $result->fetch_assoc();

    if ($user_admin) {
        if ($password === $user_admin['adminPassword']) {
            header('Location: admin/admin.php');
            exit();
        } else {
            throw new Exception('Invalid admin credentials');
        }
    } elseif ($user) {
        if ($password === $user['Password']) {
            $_SESSION['username'] = $user['Username'];
            $_SESSION['logged_in'] = true;
            header('Location: template/home.php');
            exit();
        } else {
            throw new Exception('Invalid user credentials');
        }
    } else {
        throw new Exception("No user found for username: $username");
    }

} catch (Exception $e) {
    // Return error response
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} finally {
    // Close resources
    if (isset($stmt)) {
        $stmt->close();
    }

    if (isset($stmt_admin)) {
        $stmt_admin->close();
    }

    if (isset($mysqli)) {
        $mysqli->close();
    }

    if (isset($admin_conn)) {
        $admin_conn->close();
    }
}
?>