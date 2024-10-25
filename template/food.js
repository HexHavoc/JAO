// DOM Elements
const newBlogBtn = document.getElementById('newBlogBtn');
const blogForm = document.getElementById('blogForm');
const cancelBtn = document.getElementById('cancelBtn');
const blogGrid = document.getElementById('blogGrid');
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('imagePreview');
const CONTENT_PREVIEW_LENGTH = 150;

// State management with localStorage
const STORAGE_KEY = 'foodBlogPosts';
const USER_KEY = 'loggedInUser';  // Key for storing logged-in user

// Initialize blogs from localStorage or empty array
let blogs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

// Check if user is logged in
function checkLoginStatus() {
    const loggedInUser = localStorage.getItem(USER_KEY);
    if (!loggedInUser) {
        // Redirect to login page if user is not logged in
        window.location.href = '../index.html';
        return false;
    }
    return true;
}


const searchInput = document.getElementById('blogSearch');

function getAllBlogs(searchQuery = '') {
    // Retrieve blogs from both travel and food localStorage
    const foodBlogs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    // Combine and filter blogs based on search query
    const combinedBlogs = [...foodBlogs]
        .filter(blog => {
            if (!searchQuery) return true;
            return blog.title.toLowerCase().includes(searchQuery.toLowerCase());
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        // Limit to the first 6 blogs only if no search query
        .slice(0, searchQuery ? undefined : 6);
    
    return combinedBlogs;
}

function searchRenderFood(searchQuery = '') {
    const blogs = getAllBlogs(searchQuery);
    const loggedInUser = getLoggedInUser();


    if (blogs.length === 0) {
        blogGrid.innerHTML = `
            <div class="empty-state">
                <h2>${searchQuery ? 'No matching blog posts found' : 'No Blog Posts Yet'}</h2>
                <p>${searchQuery ? 'Try a different search term' : 'Create your first blog post in Travel section!'}</p>
            </div>
        `;
        return;
    }

    blogGrid.innerHTML = blogs.map(blog => `
        <article class="blog-card">
            <img src="${blog.imageUrl}" alt="${blog.title}" class="blog-image">
            <div class="blog-content">
                <h2 class="blog-title">${blog.title}</h2>
                <div class="blog-metadata">
                    <span class="blog-foodSource">🍽️ ${blog.foodSource}</span>
                    <span class="blog-author">Posted by: ${blog.uploadedBy}</span>
                    <span class="blog-date">${new Date(blog.date).toLocaleDateString()}</span>
                </div>
                
                <div class="blog-text-container" id="blogContent_${blog.id}">
                    <p class="blog-text">${truncateText(blog.content, CONTENT_PREVIEW_LENGTH)}</p>
                </div>

                <div class="blog-actions-container">
                    <button 
                        onclick="toggleContent(${blog.id})" 
                        class="view-details-btn"
                    >
                        View Details
                    </button>
                    ${blog.uploadedBy === loggedInUser ? `
                        <button onclick="deleteBlog(${blog.id})" class="delete-btn">
                            Delete
                        </button>
                    ` : ''}
                </div>

                <div class="tags">
                    ${blog.tags.map(tag => `
                        <span class="tag">${tag}</span>
                    `).join('')}
                </div>
                
                <!-- Comments Section -->
                <div class="comments-section">
                    <h3>Comments (${blog.comments.length})</h3>
                    ${loggedInUser ? `
                        <div class="comment-form">
                            <textarea 
                                id="commentText_${blog.id}" 
                                placeholder="Write a comment..." 
                                class="comment-input"
                            ></textarea>
                            <button 
                                onclick="addComment(${blog.id}, document.getElementById('commentText_${blog.id}').value); document.getElementById('commentText_${blog.id}').value = '';"
                                class="comment-btn"
                            >
                                Add Comment
                            </button>
                        </div>
                    ` : `
                        <p class="login-prompt">Please <a href="login.html">log in</a> to comment</p>
                    `}
                    <div class="comments-list">
                        ${blog.comments.map(comment => `
                            <div class="comment">
                                <div class="comment-header">
                                    <span class="comment-author">${comment.author}</span>
                                </div>
                                <p class="comment-text">${comment.text}</p>
                                <div class="comment-metadata">
                                    <span class="comment-date">
                                        ${new Date(comment.date).toLocaleDateString()}
                                    </span>
                                    <div class="comment-actions">
                                        <button 
                                            onclick="likeComment(${blog.id}, ${comment.id})"
                                            class="like-btn ${hasUserLikedComment(blog.id, comment.id) ? 'liked' : ''}"
                                        >
                                            ${hasUserLikedComment(blog.id, comment.id) ? '❤️' : '🤍'} ${comment.likes}
                                        </button>
                                        ${comment.author === loggedInUser ? `
                                            <button 
                                                onclick="deleteComment(${blog.id}, ${comment.id})"
                                                class="delete-comment-btn"
                                            >
                                                Delete
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </article>
    `).join('');
}

function handleSearch(event) {
    const searchQuery = event.target.value.trim();
    searchRenderFood(searchQuery);
}

function navigateToBlogSection(event) {
    event.preventDefault();
    const category = event.target.getAttribute('data-category');
    
    // Navigate to the appropriate blog section
    if (category === 'travel') {
        window.location.href = 'travel.php';
    } else {
        window.location.href = 'food.php';
    }
}

// Initialize blogs and search functionality on page load
document.addEventListener('DOMContentLoaded', () => {
    searchRenderFood();
    
    // Add search input event listener
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
});




// Get current logged in username
function getLoggedInUser() {
    return localStorage.getItem(USER_KEY);
}

// Event Listeners
newBlogBtn.addEventListener('click', () => {
    if (checkLoginStatus()) {
        blogForm.classList.add('active');
    }
});

cancelBtn.addEventListener('click', () => {
    resetForm();
});

blogForm.addEventListener('submit', handleSubmit);
imageInput.addEventListener('change', handleImageSelect);

// Functions
function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
}

function resetForm() {
    blogForm.classList.remove('active');
    blogForm.reset();
    imagePreview.src = '';
    imagePreview.style.display = 'none';
}

function handleImageSelect(e) {
    const file = e.target.files[0];
    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            imageInput.value = '';
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            imageInput.value = '';
            return;
        }

        // Create preview and convert to base64
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function createBlogPost(blogData) {
    return {
        ...blogData,
        comments: [] // Initialize empty comments array for each blog
    };
}

async function handleSubmit(e) {
    e.preventDefault();
    
    if (!checkLoginStatus()) {
        return;
    }

    if (!imageInput.files[0]) {
        alert('Please select an image');
        return;
    }

    const username = getLoggedInUser();
    if (!username) {
        alert('Please log in to create a post');
        window.location.href = 'login.html';
        return;
    }

    // In handleSubmit function, modify the blogData object
    const blogData = createBlogPost({
        id: Date.now(),
        title: document.getElementById('title').value,
        content: document.getElementById('content').value,
        imageUrl: imagePreview.src,
        uploadedBy: username,
        foodSource: document.getElementById('foodSource').value, // Add this line
        tags: document.getElementById('tags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag),
        date: new Date().toISOString()
    });

    try {
        blogs.unshift(blogData);
        saveToLocalStorage();
        renderBlogs();
        resetForm();
        showNotificationSuccess('Blog post created successfully!');
        console.log(`Rendering blogs from storage key: ${STORAGE_KEY}`);
        console.log('Current blogs:', blogs);
    } catch (error) {
        console.error('Error creating blog post:', error);
        showNotificationError('Failed to create blog post. Please try again.');
    }
}

function deleteBlog(id) {
    const loggedInUser = getLoggedInUser();
    const blog = blogs.find(blog => blog.id === id);
    
    if (blog.uploadedBy !== loggedInUser) {
        showNotificationError('You can only delete your own posts!');
        return;
    }

    if (confirm('Are you sure you want to delete this blog post?')) {
        blogs = blogs.filter(blog => blog.id !== id);
        saveToLocalStorage();
        renderBlogs();
        showNotificationError('Blog post deleted successfully!');
    }
}

// ... (keep all notification functions the same)

function addComment(blogId, commentText) {

    if(commentText == ''){
        return;
    }

    if (!checkLoginStatus()) {
        return;
    }

    const blog = blogs.find(blog => blog.id === blogId);
    if (blog) {
        const newComment = {
            id: Date.now(),
            text: commentText,
            author: getLoggedInUser(), // Add author to comment
            date: new Date().toISOString(),
            likes: 0
        };
        blog.comments.push(newComment);
        saveToLocalStorage();
        renderBlogs();
    }
}

function deleteComment(blogId, commentId) {
    const loggedInUser = getLoggedInUser();
    const blog = blogs.find(blog => blog.id === blogId);
    const comment = blog?.comments.find(comment => comment.id === commentId);
    
    if (comment && comment.author !== loggedInUser) {
        showNotificationError('You can only delete your own comments!');
        return;
    }

    if (blog) {
        blog.comments = blog.comments.filter(comment => comment.id !== commentId);
        saveToLocalStorage();
        renderBlogs();
    }
}

// Add this new function to manage likes
function getLikeKey(blogId, commentId) {
    const username = getLoggedInUser();
    return `like_${blogId}_${commentId}_${username}`;
}

function hasUserLikedComment(blogId, commentId) {
    const likeKey = getLikeKey(blogId, commentId);
    return localStorage.getItem(likeKey) === 'true';
}

function likeComment(blogId, commentId) {
    if (!checkLoginStatus()) {
        showNotificationError('Please log in to like comments');
        return;
    }

    const blog = blogs.find(blog => blog.id === blogId);
    if (blog) {
        const comment = blog.comments.find(comment => comment.id === commentId);
        if (comment) {
            const likeKey = getLikeKey(blogId, commentId);
            
            if (!hasUserLikedComment(blogId, commentId)) {
                // User hasn't liked this comment yet
                comment.likes++;
                localStorage.setItem(likeKey, 'true');
                saveToLocalStorage();
                renderBlogs();
            } else {
                // User has already liked this comment
                comment.likes--;
                localStorage.removeItem(likeKey);
                saveToLocalStorage();
                renderBlogs();
            }
        }
    }
}


function showNotificationSuccess(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 1500);
}

function showNotificationError(message, type = 'error') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 1500);
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}


// Update the renderBlogs function to include the load more functionality
function renderBlogs() {
    if (blogs.length === 0) {
        blogGrid.innerHTML = `
            <div class="empty-state">
                <h2>No Blog Posts Yet</h2>
                <p>Click the "New Blog Post" button to create your first post!</p>
            </div>
        `;
        return;
    }

    const loggedInUser = getLoggedInUser();

    blogGrid.innerHTML = blogs.map(blog => `
        <article class="blog-card">
            <img src="${blog.imageUrl}" alt="${blog.title}" class="blog-image">
            <div class="blog-content">
                <h2 class="blog-title">${blog.title}</h2>
                <div class="blog-metadata">
                    <span class="blog-foodSource">🍽️ ${blog.foodSource}</span>
                    <span class="blog-author">Posted by: ${blog.uploadedBy}</span>
                    <span class="blog-date">${new Date(blog.date).toLocaleDateString()}</span>
                </div>
                
                <div class="blog-text-container" id="blogContent_${blog.id}">
                    <p class="blog-text">${truncateText(blog.content, CONTENT_PREVIEW_LENGTH)}</p>
                </div>

                <div class="blog-actions-container">
                    <button 
                        onclick="toggleContent(${blog.id})" 
                        class="view-details-btn"
                    >
                        View Details
                    </button>
                    ${blog.uploadedBy === loggedInUser ? `
                        <button onclick="deleteBlog(${blog.id})" class="delete-btn">
                            Delete
                        </button>
                    ` : ''}
                </div>

                <div class="tags">
                    ${blog.tags.map(tag => `
                        <span class="tag">${tag}</span>
                    `).join('')}
                </div>
                
                <!-- Comments Section -->
                <div class="comments-section">
                    <h3>Comments (${blog.comments.length})</h3>
                    ${loggedInUser ? `
                        <div class="comment-form">
                            <textarea 
                                id="commentText_${blog.id}" 
                                placeholder="Write a comment..." 
                                class="comment-input"
                            ></textarea>
                            <button 
                                onclick="addComment(${blog.id}, document.getElementById('commentText_${blog.id}').value); document.getElementById('commentText_${blog.id}').value = '';"
                                class="comment-btn"
                            >
                                Add Comment
                            </button>
                        </div>
                    ` : `
                        <p class="login-prompt">Please <a href="login.html">log in</a> to comment</p>
                    `}
                    <div class="comments-list">
                        ${blog.comments.map(comment => `
                            <div class="comment">
                                <div class="comment-header">
                                    <span class="comment-author">${comment.author}</span>
                                </div>
                                <p class="comment-text">${comment.text}</p>
                                <div class="comment-metadata">
                                    <span class="comment-date">
                                        ${new Date(comment.date).toLocaleDateString()}
                                    </span>
                                    <div class="comment-actions">
                                        <button 
                                            onclick="likeComment(${blog.id}, ${comment.id})"
                                            class="like-btn ${hasUserLikedComment(blog.id, comment.id) ? 'liked' : ''}"
                                        >
                                            ${hasUserLikedComment(blog.id, comment.id) ? '❤️' : '🤍'} ${comment.likes}
                                        </button>
                                        ${comment.author === loggedInUser ? `
                                            <button 
                                                onclick="deleteComment(${blog.id}, ${comment.id})"
                                                class="delete-comment-btn"
                                            >
                                                Delete
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </article>
    `).join('');
}

function toggleContent(blogId) {
    const blog = blogs.find(blog => blog.id === blogId);
    if (blog) {
        // Get modal elements
        const modal = document.getElementById('blogModal');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalfoodSource = document.getElementById('modalfoodSource');
        const modalAuthor = document.getElementById('modalAuthor');
        const modalDate = document.getElementById('modalDate');
        const modalContent = document.getElementById('modalContent');
        const modalTags = document.getElementById('modalTags');
        const modalCommentsList = document.getElementById('modalCommentsList');

        // Populate modal content
        modalImage.src = blog.imageUrl;
        modalImage.alt = blog.title;
        modalTitle.textContent = blog.title;
        modalfoodSource.innerHTML = `<span>🍽️ ${blog.foodSource}</span>`;
        modalAuthor.textContent = `Posted by: ${blog.uploadedBy}`;
        modalDate.textContent = new Date(blog.date).toLocaleDateString();
        modalContent.textContent = blog.content;
        
        // Render tags
        modalTags.innerHTML = blog.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');
        
        // Render comments
        modalCommentsList.innerHTML = blog.comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date">${new Date(comment.date).toLocaleDateString()}</span>
                </div>
                <p>${comment.text}</p>
                <div class="comment-actions">
                    <button 
                        onclick="likeComment(${blog.id}, ${comment.id})"
                        class="like-btn ${hasUserLikedComment(blog.id, comment.id) ? 'liked' : ''}"
                    >
                        ${hasUserLikedComment(blog.id, comment.id) ? '❤️' : '🤍'} ${comment.likes}
                    </button>
                    ${comment.author === getLoggedInUser() ? `
                        <button 
                            onclick="deleteComment(${blog.id}, ${comment.id})"
                            class="delete-comment-btn"
                        >
                            Delete
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');

        // Show modal
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }
}

// Add event listeners for modal close
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('blogModal');
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');

    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
});


// Initialize blogs on page load
if (checkLoginStatus()) {
    renderBlogs();
}