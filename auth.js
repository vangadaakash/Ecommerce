document.addEventListener("DOMContentLoaded", function () {
    setupEventListeners();
    updateUI();
});

function setupEventListeners() {
    document.getElementById("loginBtn")?.addEventListener("click", loginUser);
    document.getElementById("registerBtn")?.addEventListener("click", registerUser);
    document.getElementById("resetPasswordBtn")?.addEventListener("click", resetPassword);
    document.getElementById("logoutBtn")?.addEventListener("click", logoutUser);
}

function getCurrentUser() {
    return localStorage.getItem("currentUser");
}

function updateUI() {
    const userDisplay = document.getElementById("userDisplay");
    const logoutBtn = document.getElementById("logoutBtn");
    const currentUser = getCurrentUser();

    if (currentUser) {
        if (userDisplay) userDisplay.innerText = `Welcome, ${currentUser}`;
        if (logoutBtn) logoutBtn.style.display = "block";
    } else {
        if (userDisplay) userDisplay.innerText = "";
        if (logoutBtn) logoutBtn.style.display = "none";
    }
}

function registerUser() {
    const username = document.getElementById("registerUsername").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (!username || !password || !confirmPassword) {
        alert("Please fill out all fields.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    if (localStorage.getItem(username)) {
        alert("Username already exists. Please log in.");
        return;
    }

    localStorage.setItem(username, JSON.stringify({ password })); // Password should be hashed in real use
    localStorage.setItem(`cart_${username}`, JSON.stringify([])); // Initialize cart for user
    alert("Registration successful! Please log in.");
    toggleForms(); // Switch to login form
}

function loginUser() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    const storedUser = localStorage.getItem(username);
    if (!storedUser) {
        alert("User not found. Please register first.");
        return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.password === password) {
        localStorage.setItem("currentUser", username);
        alert("Login successful!");
        window.location.href = "index.html";
    } else {
        alert("Incorrect password. Try again.");
    }
}

function resetPassword() {
    const username = document.getElementById("forgotUsername").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();

    if (!username || !newPassword) {
        alert("Please fill out all fields.");
        return;
    }

    if (newPassword.length < 6) {
        alert("New password must be at least 6 characters long.");
        return;
    }

    if (!localStorage.getItem(username)) {
        alert("User not found. Please register first.");
        return;
    }

    localStorage.setItem(username, JSON.stringify({ password: newPassword }));
    alert("Password reset successful! Please log in.");
    toggleForms();
}

function logoutUser() {
    localStorage.removeItem("currentUser");
    alert("You have been logged out.");
    window.location.href = "login.html";
}

function toggleForms() {
    document.getElementById("loginForm")?.classList.toggle("d-none");
    document.getElementById("registerForm")?.classList.toggle("d-none");
    document.getElementById("forgotPasswordForm")?.classList.add("d-none");
}

function toggleForgotPassword() {
    document.getElementById("loginForm")?.classList.add("d-none");
    document.getElementById("registerForm")?.classList.add("d-none");
    document.getElementById("forgotPasswordForm")?.classList.remove("d-none");
}
