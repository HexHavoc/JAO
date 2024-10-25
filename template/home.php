
<?php
 include "../profile/profileDisplay.php";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HOME | JAO </title>
    <link rel="stylesheet" href="home.css">
</head>
<body>
    <div class="nav-bar">
        <header>
            <div class="container">
            <h1 class="logo"></h1>

            <nav>
                <ul>
                <li><a href="#">Home</a></li>
                <li><a href="travel.php">Travel</a></li>
                <li><a href="food.php">Food</a></li>
                </ul>
            </nav>
            </div>
        </header>
    </div>
    <div id="blogGrid" class="blog-grid"></div>
    <script src="home.js"></script>
</body>
</html>