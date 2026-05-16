// SCC SESSION PROTOCOL: Secure Logout
function logoutUser() {
    // 1. Clear all identity markers from the browser
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userXP');

    // 2. Redirect to landing or login page
    alert("Session Terminated. Profile Securely Logged Out.");
    window.location.href = '../auth/login.html';
}

// Attach to any logout button in your Navbar
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    }
});