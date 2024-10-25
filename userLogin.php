<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    require "connection.php";

    // Validate that email and password are set
    if (!isset($_POST['email']) || !isset($_POST['password'])) {
        throw new Exception('Email and password are required');
    }

    // Sanitize email input
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);

    // Prepare statement to prevent SQL injection
    $stmt = $mysqli->prepare("SELECT Email, Password FROM signups WHERE Email = ?");
    if (!$stmt) {
        throw new Exception('Database prepare failed: ' . $mysqli->error);
    }

    // Bind parameters and execute
    $stmt->bind_param("s", $email);
    if (!$stmt->execute()) {
        throw new Exception('Database query failed: ' . $stmt->error);
    }

    // Get result
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        // Verify password using password_verify() - assumes password is hashed in database
        if ($_POST['password']===$user['Password']){
            session_start();
            $_SESSION['email'] = $user['Email'];
            $_SESSION['logged_in'] = true;
            
            // Return success response
            header('Location: template/template.html');
        } else {
            throw new Exception('Invalid credentials');
        }
    } else {
        throw new Exception('There were no result from the db');
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
    if (isset($mysqli)) {
        $mysqli->close();
    }
}
?>