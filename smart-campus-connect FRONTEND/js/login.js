/**
 * SCC AUTHENTICATION & MULTI-TIER REDIRECTION PROTOCOL
 * Version: 2.1.0 - Stable
 * Author: Darshan Rathod
 */

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    const authContainer = document.getElementById('auth-status');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. Capture Node Credentials
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                // 2. Handshake with the Backend API
                const response = await fetch('https://scc-r1co.onrender.com/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // 3. PERSISTENCE: Create the Unified Session Node
                    const userNode = {
                        fullName: data.fullName || data.name,
                        email: data.email,
                        role: data.role,
                        id: data.id || data.userId,
                        xp: data.experiencePoints || 0,
                        profileImage: data.profileImage || null
                        
                    };
                    
                    localStorage.setItem('scc_user', JSON.stringify(userNode));

                    // 4. TRI-TIER REDIRECTION ENGINE
                    // Priority 1: The Singular Admin (The Founder)
                    const founderEmail = "darshanmrathod.2005@gmail.com";

if (
    userNode.email?.trim().toLowerCase() === founderEmail.toLowerCase()
) {

    alert("Founder Authority Recognized. Accessing Admin Mainframe...");

    window.location.href = '../admin/admin.html';

} 
                    // Priority 2: Multi-User Organizers
                    else if (userNode.role === 'ORGANIZER') {
                        alert(`Welcome, ${userNode.fullName}. Opening Organizer Dashboard...`);
                        window.location.href = '../org/organizer-dash.html';
                    } 
                    // Priority 3: General Students
                    else {
                        alert(`Student Sync Successful. Welcome to the Nexus.`);
                        window.location.href = '../student/main.html';
                    }

                } else {
                    alert("Authorization Failed: " + (data.message || "Invalid Node Credentials."));
                }
            } catch (error) {
                console.error("Critical System Error:", error);
                alert("Mainframe Offline: Ensure your Spring Boot server is running on port 8080.");
            }
        });
    }

    // --- GLOBAL SESSION & UI SYNC ---
    const sessionData = JSON.parse(localStorage.getItem('scc_user'));

    if (sessionData && authContainer) {
        const displayName = sessionData.fullName;
        
        authContainer.innerHTML = `
            <div class="flex items-center gap-4">
                <span class="text-cyan-400 font-black text-[10px] tracking-widest uppercase">
                    RECOGNIZED: ${displayName}
                </span>
                <button id="logoutBtn" class="px-5 py-2 glass border-white/5 text-red-400 uppercase text-[9px] tracking-widest hover:bg-red-500 hover:text-white transition-all rounded-xl">
                    Terminate Session
                </button>
            </div>
        `;
        
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.clear(); 
            alert("Session Terminated. Identity Secured.");
            window.location.href = '../auth/login.html';
        });
    }
});

/**
 * UTILITY: Local Session Verification
 */
function verifySession() {
    const user = JSON.parse(localStorage.getItem('scc_user'));
    if (!user) {
        window.location.href = '../auth/login.html';
    }
    return user;
}