<?php
// Add this at the top of your page where you want the profile to appear
if(isset($_SESSION['username'])) {
    $username = $_SESSION['username'];
    $firstLetter = strtoupper(substr($username, 0, 1));
?>
    <div class="profile-corner">
        <div class="profile-content">
            <div class="profile-avatar">
                <?php echo $firstLetter; ?>
            </div>
            <span class="profile-name"><?php echo htmlspecialchars($username); ?></span>
            <div class="dropdown-content">
                <a href="profile.php">Profile</a>
                <a href="logout.php">Logout</a>
            </div>
        </div>
    </div>

    <style>
        .profile-corner {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }

        .profile-content {
            display: flex;
            align-items: center;
            background: white;
            padding: 10px 15px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            cursor: pointer;
            position: relative;
        }

        .profile-avatar {
            width: 35px;
            height: 35px;
            background: #4A90E2;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            margin-right: 10px;
        }

        .profile-name {
            font-size: 14px;
            font-weight: 500;
        }

        .dropdown-content {
            display: none;
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            min-width: 120px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            border-radius: 4px;
            margin-top: 5px;
        }

        .profile-content:hover .dropdown-content {
            display: block;
        }

        .dropdown-content a {
            color: #333;
            padding: 10px 15px;
            text-decoration: none;
            display: block;
        }

        .dropdown-content a:hover {
            background: #f5f5f5;
        }
    </style>

    <script>
        document.addEventListener('click', function(event) {
            const profile = document.querySelector('.profile-corner');
            const dropdown = document.querySelector('.dropdown-content');
            
            if (!profile.contains(event.target)) {
                dropdown.style.display = 'none';
            }
        });
    </script>
<?php
}
?>