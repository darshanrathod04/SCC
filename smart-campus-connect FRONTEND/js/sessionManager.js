/**
 * SCC GLOBAL SESSION PROTOCOL
 * Professional-grade safe identity synchronization
 */
const SessionManager = {
    init() {
        document.addEventListener("DOMContentLoaded", () => {
            this.syncIdentity();
            this.handleNavigation();
        });
    },

    syncIdentity() {
        const userName = localStorage.getItem('userName');
        const userRole = localStorage.getItem('userRole');

        // Safe check for main.html line 96 fix
        const userDisplay = document.getElementById('userNameDisplay') || 
                            document.getElementById('user-name-display');

        if (userDisplay && userName) {
            userDisplay.innerText = userName;
        }

        // Safe check for Navbar recognition
        const authContainer = document.getElementById('auth-status');
        if (authContainer && userName) {
            authContainer.innerHTML = `
                <span class="text-cyan-400 font-black mr-4 text-[10px] tracking-[0.3em] uppercase">
                    Recognized: ${userName}
                </span>
                <button id="logoutBtn" class="px-5 py-2 glass border-white/5 text-slate-400 uppercase text-[9px] tracking-widest hover:text-red-400 transition-all rounded-xl">
                    Terminate Session
                </button>
            `;
            
            document.getElementById('logoutBtn')?.addEventListener('click', () => {
                localStorage.clear();
                window.location.href = '../auth/login.html';
            });
        }
    },

    handleNavigation() {
        // Safe check for Organizer-only sections
        const postSection = document.getElementById('postFormSection') || 
                            document.getElementById('internshipPostSection');
        const role = localStorage.getItem('userRole');

        if (postSection) {
            postSection.style.display = (role === 'ORGANIZER') ? 'block' : 'none';
        }
    }
};

SessionManager.init();