<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require "connection.php";

$username = $_POST['username'];
$email = $_POST['regEmail'];
$password = $_POST['regPassword'];


$information = "INSERT INTO signups VALUES('$username','$email','$password')";

if($mysqli->query($information) === TRUE){
    header('Location: index.html');
}

$mysqli->close();

?>
