
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
    <div class="group">
        <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg>
        <input id="blogSearch" placeholder="Search for blogs.." type="search" class="input">
    </div>
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