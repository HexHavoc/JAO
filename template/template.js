// DOM Elements
const newBlogBtn = document.getElementById('newBlogBtn');
const blogForm = document.getElementById('blogForm');
const cancelBtn = document.getElementById('cancelBtn');
const blogGrid = document.getElementById('blogGrid');
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('imagePreview');

// State management with localStorage
const STORAGE_KEY = 'blogPosts';

// Initialize blogs from localStorage or empty array
let blogs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

// Event Listeners
newBlogBtn.addEventListener('click', () => {
    blogForm.classList.add('active');
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

async function handleSubmit(e) {
    e.preventDefault();
    
    if (!imageInput.files[0]) {
        alert('Please select an image');
        return;
    }

    const blogData = {
        id: Date.now(),
        title: document.getElementById('title').value,
        content: document.getElementById('content').value,
        imageUrl: imagePreview.src, // Store base64 image data
        tags: document.getElementById('tags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag), // Remove empty tags
        date: new Date().toISOString()
    };

    try {
        // Add new blog to the beginning of the array
        blogs.unshift(blogData);
        
        // Save to localStorage
        saveToLocalStorage();
        
        // Update UI
        renderBlogs();
        resetForm();

        // Show success message
        showNotificationSuccess('Blog post created successfully!');
    } catch (error) {
        console.error('Error creating blog post:', error);
        showNotification('Failed to create blog post. Please try again.', 'error');
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

function deleteBlog(id) {
    if (confirm('Are you sure you want to delete this blog post?')) {
        blogs = blogs.filter(blog => blog.id !== id);
        saveToLocalStorage();
        renderBlogs();
        showNotificationError('Blog post deleted successfully!');
    }
}

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

    blogGrid.innerHTML = blogs.map(blog => `
        <article class="blog-card">
            <img src="${blog.imageUrl}" alt="${blog.title}" class="blog-image">
            <div class="blog-content">
                <h2 class="blog-title">${blog.title}</h2>
                <p class="blog-text">${blog.content}</p>
                <div class="blog-metadata">
                    <span class="blog-date">${new Date(blog.date).toLocaleDateString()}</span>
                    <button onclick="deleteBlog(${blog.id})" class="delete-btn">
                        Delete
                    </button>
                </div>
                <div class="tags">
                    ${blog.tags.map(tag => `
                        <span class="tag">${tag}</span>
                    `).join('')}
                </div>
            </div>
        </article>
    `).join('');
}

// Initialize blogs on page load
renderBlogs();

// Add this to your existing JavaScript (template.js)

// Update the blog data structure to include comments
function createBlogPost(blogData) {
    return {
        ...blogData,
        comments: [] // Initialize empty comments array for each blog
    };
}

// Modify the handleSubmit function to use createBlogPost
async function handleSubmit(e) {
    e.preventDefault();
    
    if (!imageInput.files[0]) {
        alert('Please select an image');
        return;
    }

    const blogData = createBlogPost({
        id: Date.now(),
        title: document.getElementById('title').value,
        content: document.getElementById('content').value,
        imageUrl: imagePreview.src,
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

// Add comment functionality
function addComment(blogId, commentText) {
    const blog = blogs.find(blog => blog.id === blogId);
    if (blog) {
        const newComment = {
            id: Date.now(),
            text: commentText,
            date: new Date().toISOString(),
            likes: 0
        };
        blog.comments.push(newComment);
        saveToLocalStorage();
        renderBlogs();
        showNotificationSuccess('Comment added successfully!');
    }
}

function deleteComment(blogId, commentId) {
    const blog = blogs.find(blog => blog.id === blogId);
    if (blog) {
        blog.comments = blog.comments.filter(comment => comment.id !== commentId);
        saveToLocalStorage();
        renderBlogs();
        showNotificationError('Comment deleted successfully!');
    }
}

localStorage.setItem("liked", "no");

function likeComment(blogId, commentId) {
    const blog = blogs.find(blog => blog.id === blogId);
    if (blog) {
        const comment = blog.comments.find(comment => comment.id === commentId);

        if(comment && localStorage.getItem("liked") == "no"){
            comment.likes++;
            saveToLocalStorage();
            renderBlogs();
        }
        localStorage.setItem("liked","yes");
    }
}

// Update the renderBlogs function to include comments
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

    blogGrid.innerHTML = blogs.map(blog => `
        <article class="blog-card">
            <img src="${blog.imageUrl}" alt="${blog.title}" class="blog-image">
            <div class="blog-content">
                <h2 class="blog-title">${blog.title}</h2>
                <p class="blog-text">${blog.content}</p>
                <div class="blog-metadata">
                    <span class="blog-date">${new Date(blog.date).toLocaleDateString()}</span>
                    <button onclick="deleteBlog(${blog.id})" class="delete-btn">
                        Delete
                    </button>
                </div>
                <div class="tags">
                    ${blog.tags.map(tag => `
                        <span class="tag">${tag}</span>
                    `).join('')}
                </div>
                
                <!-- Comments Section -->
                <div class="comments-section">
                    <h3>Comments (${blog.comments.length})</h3>
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
                    <div class="comments-list">
                        ${blog.comments.map(comment => `
                            <div class="comment">
                                <p class="comment-text">${comment.text}</p>
                                <div class="comment-metadata">
                                    <span class="comment-date">
                                        ${new Date(comment.date).toLocaleDateString()}
                                    </span>
                                    <div class="comment-actions">
                                        <button 
                                            onclick="likeComment(${blog.id}, ${comment.id})"
                                            class="like-btn"
                                        >
                                            ❤️ ${comment.likes}
                                        </button>
                                        <button 
                                            onclick="deleteComment(${blog.id}, ${comment.id})"
                                            class="delete-comment-btn"
                                        >
                                            Delete
                                        </button>
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