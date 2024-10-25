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