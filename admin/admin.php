<?php
require "../connection.php";

// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Handle delete request
if(isset($_POST['delete'])) {
    $id = $_POST['user_id'];
    $sql = "DELETE FROM signups WHERE user_id = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->close();
    // Redirect to refresh the page
    header("Location: ".$_SERVER['PHP_SELF']);
    exit();
}

// Fetch users
$sql = "SELECT user_id, Username, Email FROM signups";
$result = $mysqli->query($sql);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Registered Users</title>
    <link rel="stylesheet" href="admin.css">
</head>
<body>
    <div class="header">
        <h1>Registered Users</h1>
    </div>

    <table class="user-list">
        <thead>
            <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <?php
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    echo "<tr>";
                    echo "<td>" . htmlspecialchars($row["Username"]) . "</td>";
                    echo "<td>" . htmlspecialchars($row["Email"]) . "</td>";
                    echo "<td>
                            <form method='POST' style='display: inline;' onsubmit='return confirm(\"Are you sure you want to delete this user?\");'>
                                <input type='hidden' name='user_id' value='" . $row["user_id"] . "'>
                                <button type='submit' onclick=deleteUserBlog() name='delete' class='delete-btn'>Delete</button>
                            </form>
                          </td>";
                    echo "</tr>";
                }
            } else {
                echo "<tr><td colspan='3' class='no-users'>No users found</td></tr>";
            }
            ?>
        </tbody>
    </table>

    <?php
    // Close connection
    $mysqli->close();
    ?>
    <script src='admin.js'></script>
</body>
</html>