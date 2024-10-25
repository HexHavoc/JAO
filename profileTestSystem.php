<?php
// config.php - Database configuration
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', 'anirudh');
define('DB_NAME', 'jao_blog');

// Create database connection
$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// check_session.php - Session handling
session_start();

function isLoggedIn() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

// user_profile.php - Profile functionality
function getUserProfile($conn, $userId) {
    $sql = "SELECT id, username, email, profile_image FROM users WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc();
}

// Add this to your header or navigation section
?>
<!-- profile_component.php -->
<div id="userProfileCorner" class="user-profile-corner" style="<?php echo !isLoggedIn() ? 'display: none;' : ''; ?>">
    <?php if (isLoggedIn()): 
        $userProfile = getUserProfile($conn, $_SESSION['user_id']);
    ?>
    <div class="profile-container">
        <div class="profile-trigger" onclick="toggleProfileDropdown()">
            <div class="profile-avatar">
                <?php if ($userProfile['profile_image']): ?>
                    <img src="<?php echo htmlspecialchars($userProfile['profile_image']); ?>" 
                         alt="Profile" class="avatar-image">
                <?php else: ?>
                    <span class="avatar-initial">
                        <?php echo strtoupper(substr($userProfile['username'], 0, 1)); ?>
                    </span>
                <?php endif; ?>
            </div>
            <span class="username-display">
                <?php echo htmlspecialchars($userProfile['username']); ?>
            </span>
            <span class="dropdown-arrow">▼</span>
        </div>
        <div id="profileDropdown" class="profile-dropdown hidden">
            <a href="profile.php" class="dropdown-item">
                <i class="fas fa-user"></i> Profile
            </a>
            <a href="settings.php" class="dropdown-item">
                <i class="fas fa-cog"></i> Settings
            </a>
            <a href="logout.php" class="dropdown-item">
                <i class="fas fa-sign-out-alt"></i> Logout
            </a>
        </div>
    </div>
    <?php endif; ?>
</div>

<style>
.user-profile-corner {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
}

.profile-container {
    position: relative;
}

.profile-trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    cursor: pointer;
}

.profile-avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: #4A90E2;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-initial {
    color: white;
    font-weight: bold;
}

.username-display {
    font-weight: 500;
}

.dropdown-arrow {
    font-size: 0.8rem;
    transition: transform 0.2s;
}

.profile-dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    width: 200px;
}

.dropdown-item {
    display: block;
    padding: 0.75rem 1rem;
    text-decoration: none;
    color: #333;
    transition: background 0.2s;
}

.dropdown-item:hover {
    background: #f5f5f5;
}

.hidden {
    display: none;
}
</style>

<script>
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    const arrow = document.querySelector('.dropdown-arrow');
    dropdown.classList.toggle('hidden');
    arrow.style.transform = dropdown.classList.contains('hidden') ? '' : 'rotate(180deg)';
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const profile = document.getElementById('userProfileCorner');
    const dropdown = document.getElementById('profileDropdown');
    if (!profile.contains(e.target)) {
        dropdown.classList.add('hidden');
        document.querySelector('.dropdown-arrow').style.transform = '';
    }
});
</script>

<?php
// logout.php - Logout functionality
session_start();
session_destroy();
header("Location: userLogin.php");
exit();

// Database setup - Run this once to create the necessary table
$createTableSQL = "
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

// Profile update functionality
function updateProfile($conn, $userId, $data) {
    $sql = "UPDATE users SET ";
    $updates = [];
    $types = "";
    $values = [];

    if (isset($data['username'])) {
        $updates[] = "username = ?";
        $types .= "s";
        $values[] = $data['username'];
    }

    if (isset($data['email'])) {
        $updates[] = "email = ?";
        $types .= "s";
        $values[] = $data['email'];
    }

    if (isset($data['profile_image'])) {
        $updates[] = "profile_image = ?";
        $types .= "s";
        $values[] = $data['profile_image'];
    }

    $sql .= implode(", ", $updates);
    $sql .= " WHERE id = ?";
    $types .= "i";
    $values[] = $userId;

    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$values);
    return $stmt->execute();
}
?>