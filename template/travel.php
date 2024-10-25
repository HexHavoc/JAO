
<?php
include "../profile/profileDisplay.php";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JAO | Travel Blog</title>
    <link rel="stylesheet" href="travel.css">
</head>
<body>
    <div class="nav-bar">
        <header>
            <div class="container">
            <h1 class="logo"></h1>

            <nav>
                <ul>
                <li><a href="home.php">Home</a></li>
                <li><a href="#">Travel</a></li>
                <li><a href="food.php">Food</a></li>
                </ul>
            </nav>
            </div>
        </header>
    </div>
    <div class="container">
        <header class="header">
            <h1>JAO TRAVEL BLOG</h1>
        </header>
        <button id="newBlogBtn">Create Blog Post</button>


        <form id="blogForm">
            <input type="text" id="title" placeholder="Blog Title" required>
            <textarea id="content" placeholder="Write your blog content here..." required></textarea>
            <div class="image-upload-container">
                <input type="file" id="image" accept="image/*" required>
                <img id="imagePreview" style="display: none;">
            </div>
            <input type="text" id="tags" placeholder="Tags (comma-separated)">
            <div class="form-buttons">
                <button type="submit">Create Post</button>
                <button type="button" id="cancelBtn">Cancel</button>
            </div>
        </form>

        <div id="blogGrid"></div>
    </div>

    <script src="travel.js"></script>
</body>
</html>