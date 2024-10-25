document.addEventListener("DOMContentLoaded", function() {
    // Get the form elements
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const emailRegInput = document.getElementById("email-reg");
    const passwordRegInput = document.getElementById("password-reg");
    
    const signInButton = document.getElementById("login-form");
    const signUpButton = document.getElementById("register-form");

    // Add event listener to the submit button
    signInButton.addEventListener("click", function(event) {
    
        // Clear any previous error messages
        clearErrors();

        event.preventDefault();


        // Get input values
        const email = emailInput.value;
        const password = passwordInput.value;


        document.getElementById("email").value = "";
        document.getElementById("password").value = "";

        let isValid = true;

        // Email validation regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            showError(emailInput, "Invalid email format. Example: user@example.com");
            isValid = false;
        }

        // Password validation regex (At least 8 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special character)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            showError(passwordInput, "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, and 1 special character.");
            isValid = false;
        }

        // If the form is valid, show a success message (or you can proceed with form submission)
        if (isValid) {
            clearErrors();
        }
    });

    signUpButton.addEventListener("click", function(event) {
        // Prevent form submission

        clearErrors();

        event.preventDefault();

        // Get input values
        const email = emailRegInput.value;
        const password = passwordRegInput.value;

        document.getElementById("email-reg").value = "";
        document.getElementById("password-reg").value = "";

        let isValid = true;

        // Email validation regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            showError(emailRegInput, "Invalid email format. Example: user@example.com");
            isValid = false;
        }

        // Password validation regex (At least 8 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special character)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            showError(passwordRegInput, "Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, and 1 special character.");
            isValid = false;
        }


        // If the form is valid, show a success message (or you can proceed with form submission)
        if (isValid) {
            clearErrors();
            // You can proceed with form submission here if needed
            // document.getElementById("myForm").submit();
        }
    });


    // Function to display error message
    function showError(inputElement, message) {
        const errorSpan = document.createElement("span");
        errorSpan.classList.add("error");
        errorSpan.style.color = "#f5953b";
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




