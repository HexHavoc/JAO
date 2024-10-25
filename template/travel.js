// DOM Elements
const newBlogBtn = document.getElementById('newBlogBtn');
const blogForm = document.getElementById('blogForm');
const cancelBtn = document.getElementById('cancelBtn');
const blogGrid = document.getElementById('blogGrid');
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('imagePreview');
const CONTENT_PREVIEW_LENGTH = 150;

// State management with localStorage
const STORAGE_KEY = 'travelBlogPosts';
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

    const blogData = createBlogPost({
        id: Date.now(),
        title: document.getElementById('title').value,
        content: document.getElementById('content').value,
        imageUrl: imagePreview.src,
        uploadedBy: username, // Add logged-in username to blog data
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
                showNotificationSuccess('Comment liked!');
            } else {
                // User has already liked this comment
                comment.likes--;
                localStorage.removeItem(likeKey);
                saveToLocalStorage();
                renderBlogs();
                showNotificationSuccess('Like removed!');
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
    }, 3000);
}

function showNotificationError(message, type = 'error') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
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
                    <span class="blog-author">Posted by: ${blog.uploadedBy}</span>
                    <span class="blog-date">${new Date(blog.date).toLocaleDateString()}</span>
                </div>
                
                <div class="blog-text-container" id="blogContent_${blog.id}">
                    <p class="blog-text">${truncateText(blog.content, CONTENT_PREVIEW_LENGTH)}</p>
                    ${blog.content.length > CONTENT_PREVIEW_LENGTH ? `
                        <div class="load-more-container">
                            <button 
                                onclick="toggleContent(${blog.id})" 
                                class="load-more-btn" 
                                id="loadMoreBtn_${blog.id}"
                            >
                                Read More
                            </button>
                        </div>
                        <div class="full-content" id="fullContent_${blog.id}" style="display: none;">
                            <p class="blog-text">${blog.content}</p>
                            <div class="load-more-container">
                                <button 
                                    onclick="toggleContent(${blog.id})" 
                                    class="load-more-btn"
                                >
                                    Show Less
                                </button>
                            </div>
                        </div>
                    ` : ''}
                </div>

                ${blog.uploadedBy === loggedInUser ? `
                    <div class="blog-actions">
                        <button onclick="deleteBlog(${blog.id})" class="delete-btn">
                            Delete
                        </button>
                    </div>
                ` : ''}
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

// Add the toggle content function
function toggleContent(blogId) {
    const contentContainer = document.getElementById(`blogContent_${blogId}`);
    const fullContent = document.getElementById(`fullContent_${blogId}`);
    const loadMoreBtn = document.getElementById(`loadMoreBtn_${blogId}`);
    
    if (fullContent.style.display === 'none') {
        // Show full content
        loadMoreBtn.style.display = 'none';
        fullContent.style.display = 'block';
        
        // Smooth scroll to the full content
        fullContent.scrollIntoView({ behavior: 'smooth' });
    } else {
        // Show preview
        loadMoreBtn.style.display = 'block';
        fullContent.style.display = 'none';
        
        // Smooth scroll to the top of the blog post
        contentContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize blogs on page load
if (checkLoginStatus()) {
    renderBlogs();
}