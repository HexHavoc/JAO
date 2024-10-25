document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Add validation on submit for both forms
    loginForm.addEventListener('submit', validateLoginForm);
    registerForm.addEventListener('submit', validateRegisterForm);

    function validateLoginForm(event) {
        event.preventDefault();  // Prevent form submission
        let valid = true;

        // Clear previous errors
        clearErrors(['loginUsernameError', 'passwordError']);

        // Username validation
        const username = document.getElementById('loginUsername').value;
        if (username === '') {
            showError('loginUsernameError', 'Username cannot be empty.');
            valid = false;
        }


        // Password validation
        const password = document.getElementById('password').value;

        if (!validatePassword(password)) {
            showError('passwordError', 'Password must be at least 8 characters long, include a capital letter, a number, a lowercase letter, and a special symbol.');
            valid = false;
        }

        if (valid){
            loginForm.submit();// On your login page after successful login:
            localStorage.setItem('loggedInUser', username);

        } 
            
    }

    function validateRegisterForm(event) {
        event.preventDefault();  // Prevent form submission
        let valid = true;

        // Clear previous errors
        clearErrors(['regUsernameError', 'emailError', 'passwordRegError']);

        // Username validation
        const regUsername = document.getElementById('regUsername').value;
        if (regUsername === '') {
            showError('regUsernameError', 'Username cannot be empty.');
            valid = false;
        }

        // Email validation
        const email = document.getElementById('email-reg').value;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showError('emailError', 'Please enter a valid email address like example@gmail.com');
            valid = false;
        }

        // Password validation
        const regPassword = document.getElementById('password-reg').value;
        if (!validatePassword(regPassword)) {
            showError('passwordRegError', 'Password must be at least 8 characters long, include a capital letter, a number, a lowercase letter, and a special symbol.');
            valid = false;
        }

        // If valid, submit the form
        if (valid) {
            registerForm.submit();
        }
    }

    // Helper function to validate password
    function validatePassword(password) {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordPattern.test(password);
    }

    // Helper function to show error message
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {  // Check if the element exists
            errorElement.textContent = message;
        }
    }

    // Helper function to clear errors
    function clearErrors(errorIds) {
        errorIds.forEach(id => {
            const errorElement = document.getElementById(id);
            console.log(errorElement);
            if (errorElement) {  // Check if the element exists
                errorElement.textContent = '';
                errorElement.style.color = 'red';
                errorElement.style.fontWeight = 'bold';
            }
        });
    }
});