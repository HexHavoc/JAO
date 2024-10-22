<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require "connection.php";

$firstName = $_POST['first-name'];
$lastName = $_POST['last-name'];
$email = $_POST['regEmail'];
$password = $_POST['regPassword'];


$information = "INSERT INTO signups VALUES('$firstName','$lastName','$email','$password')";

if($mysqli->query($information) === TRUE){
    header('Location: index.html');
}

$mysqli->close();

?>
