// Home Page Blog Management
const TRAVEL_STORAGE_KEY = 'travelBlogPosts';
const FOOD_STORAGE_KEY = 'foodBlogPosts';
const USER_KEY = 'loggedInUser';
const CONTENT_PREVIEW_LENGTH = 150;

const blogGrid = document.getElementById('blogGrid');
const searchInput = document.getElementById('blogSearch');

function getAllBlogs(searchQuery = '') {
    // Retrieve blogs from both travel and food localStorage
    const travelBlogs = JSON.parse(localStorage.getItem(TRAVEL_STORAGE_KEY) || '[]');
    const foodBlogs = JSON.parse(localStorage.getItem(FOOD_STORAGE_KEY) || '[]');
    
    // Combine and filter blogs based on search query
    const combinedBlogs = [...travelBlogs, ...foodBlogs]
        .filter(blog => {
            if (!searchQuery) return true;
            return blog.title.toLowerCase().includes(searchQuery.toLowerCase());
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        // Limit to the first 6 blogs only if no search query
        .slice(0, searchQuery ? undefined : 6);
    
    return combinedBlogs;
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

function renderHomePageBlogs(searchQuery = '') {

    if(searchQuery.length >= 2 || searchQuery.length == 0){
        const blogs = getAllBlogs(searchQuery);


        if (blogs.length === 0) {
            blogGrid.innerHTML = `
                <div class="empty-state">
                    <h2>${searchQuery ? 'No matching blog posts found' : 'No Blog Posts Yet'}</h2>
                    <p>${searchQuery ? 'Try a different search term' : 'Create your first blog post in Travel or Food sections!'}</p>
                </div>
            `;
            return;
        }

        // Inside the renderHomePageBlogs function, update the blog-card template
        blogGrid.innerHTML = blogs.map(blog => `
            <article class="blog-card">
                <img src="${blog.imageUrl}" alt="${blog.title}" class="blog-image">
                <div class="blog-content">
                    <h2 class="blog-title">${blog.title}</h2>
                    <div class="blog-metadata">
                        <span class="blog-category">${blog.uploadedBy} | 
                            ${blog.location ? 'Travel' : 'Food'} Blog
                        </span>
                        <span class="blog-date">${new Date(blog.date).toLocaleDateString()}</span>
                    </div>
                    
                    <p class="blog-text">${truncateText(blog.content, CONTENT_PREVIEW_LENGTH)}</p>
                    
                    <div class="tags">
                        ${blog.tags.map(tag => `
                            <span class="tag">${tag}</span>
                        `).join('')}
                    </div>
                    
                    <div class="blog-actions">
                        <a href="#" class="read-more-btn" 
                        data-category="${blog.location ? 'travel' : 'food'}"
                        onclick="navigateToBlogSection(event)">
                            Read Full Post
                        </a>
                    </div>
                </div>
            </article>
        `).join('');
    }
    
}

function handleSearch(event) {
    const searchQuery = event.target.value.trim();
    renderHomePageBlogs(searchQuery);
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
    renderHomePageBlogs();
    
    // Add search input event listener
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
});