document.addEventListener("DOMContentLoaded", function() {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const emailRegInput = document.getElementById("email-reg");
    const passwordRegInput = document.getElementById("password-reg");
    
    const signInForm = document.getElementById("login-form");
    const signUpForm = document.getElementById("register-form");

    signInForm.addEventListener("submit", function(event) {
    
        event.preventDefault();
        clearErrors();


        const email = emailInput.value;
        const password = passwordInput.value;

        let isValid = true;

        //email regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            showError(emailInput, "Invalid email format. Example: user@example.com");
            isValid = false;
            document.getElementById("email").value = "";
        }

        // Password validation regex (At least 8 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special character)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            showError(passwordInput, "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, and 1 special character.");
            isValid = false;
            document.getElementById("password").value = "";
        }


        if (isValid) {
            clearErrors();
        }
    });

    signUpForm.addEventListener("submit", function(event) {

        clearErrors();

        event.preventDefault();


        const email = emailRegInput.value;
        const password = passwordRegInput.value;

        let isValid = true;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            showError(emailRegInput, "Invalid email format. Example: user@example.com");
            isValid = false;
            document.getElementById("email-reg").value = "";
        }

        // Password validation regex (At least 8 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special character)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            showError(passwordRegInput, "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, and 1 special character.");
            isValid = false;
            document.getElementById("password-reg").value = "";
        }


        
        if (isValid) {
            clearErrors();
        }
    });


    // Function to display error message
    function showError(inputElement, message) {
        const errorSpan = document.createElement("span");
        errorSpan.classList.add("error");
        errorSpan.style.color = "white";
        errorSpan.textContent = message;
        errorSpan.style.fontWeight = "bold";
        inputElement.parentNode.appendChild(errorSpan);
    }

    // Function to clear previous error messages
    function clearErrors() {
        const errorMessages = document.querySelectorAll(".error");
        errorMessages.forEach(function(errorMessage) {
            errorMessage.remove();
        });
    }


});




