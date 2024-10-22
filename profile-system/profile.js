 // DOM Elements
 const profileForm = document.getElementById('profileForm');
 const editBtn = document.getElementById('editBtn');
 const message = document.getElementById('message');
 const profileName = document.getElementById('profileName');
 const profileEmail = document.getElementById('profileEmail');
 const profilePic = document.getElementById('profilePic');

 // Fetch user profile data
 async function fetchProfile() {
     try {
         const response = await fetch('/api/profile', {
             method: 'GET',
             headers: {
                 'Authorization': `Bearer ${localStorage.getItem('token')}`
             }
         });

         if (!response.ok) {
             throw new Error('Failed to fetch profile');
         }

         const data = await response.json();
         updateProfileUI(data);
     } catch (error) {
         showMessage('Failed to load profile data', 'error');
     }
 }

 // Update profile UI with data
 function updateProfileUI(data) {
     profileName.textContent = `${data.firstName} ${data.lastName}`;
     profileEmail.textContent = data.email;
     document.getElementById('firstName').value = data.firstName;
     document.getElementById('lastName').value = data.lastName;
     document.getElementById('email').value = data.email;
     document.getElementById('bio').value = data.bio || '';
     if (data.profilePicture) {
         profilePic.src = data.profilePicture;
     }
 }

 // Toggle edit form
 editBtn.addEventListener('click', () => {
     const isHidden = profileForm.style.display === 'none';
     profileForm.style.display = isHidden ? 'block' : 'none';
     editBtn.textContent = isHidden ? 'Cancel Edit' : 'Edit Profile';
 });

 // Handle form submission
 profileForm.addEventListener('submit', async (e) => {
     e.preventDefault();

     const formData = new FormData(profileForm);

     try {
         const response = await fetch('/api/profile/update', {
             method: 'POST',
             headers: {
                 'Authorization': `Bearer ${localStorage.getItem('token')}`
             },
             body: formData
         });

         if (!response.ok) {
             throw new Error('Failed to update profile');
         }

         const data = await response.json();
         updateProfileUI(data);
         showMessage('Profile updated successfully!', 'success');
         profileForm.style.display = 'none';
         editBtn.textContent = 'Edit Profile';
     } catch (error) {
         showMessage('Failed to update profile', 'error');
     }
 });

 // Show message function
 function showMessage(text, type) { 
     message.textContent = text;
     message.className = `message ${type}`;
     message.style.display = 'block';
     setTimeout(() => {
         message.style.display = 'none';
     }, 3000);
 }

 // Check authentication and fetch profile on page load
 document.addEventListener('DOMContentLoaded', () => {
     const token = localStorage.getItem('token');
     if (!token) {
         window.location.href = 'index.html'; // Redirect to login page
     } else {
         fetchProfile();
     }
 });