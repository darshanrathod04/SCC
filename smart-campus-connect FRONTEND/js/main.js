document.addEventListener('DOMContentLoaded', async () => {
    // 1. DATA RECOVERY & SESSION HANDSHAKE
    const user = JSON.parse(localStorage.getItem('scc_user'));
    
    if (!user) { 
        if (!window.location.href.includes('../auth/login.html')) {
            window.location.href = '../auth/login.html'; 
        }
        return; 
    }

    // 2. CORE UI IDENTITY (Personalization)
    const nameDisplay = document.getElementById('userNameDisplay');
    const profileName = document.getElementById('profileNameDisplay');
    const roleIndicator = document.getElementById('roleIndicator');
    
    // --- Naye Stats Elements ---
    const xpDisplay = document.getElementById('userXP');
    const rankDisplay = document.getElementById('userRank');
    const tokenDisplay = document.getElementById('userTokens');

    const activeName = user.fullName || user.name || "Authorized User";
    if (nameDisplay) nameDisplay.textContent = activeName;
    if (profileName) profileName.textContent = activeName;
    
    if (roleIndicator) {
        roleIndicator.textContent = user.role === 'ADMIN' ? 'Access: Founder' : 'Verified Node';
        if (user.role === 'ADMIN') roleIndicator.classList.add('text-amber-400');
    }

    // --- START: REAL-TIME DATA FETCH (XP, Rank, Image) ---
    try {
        // Database se fresh stats fetch karo
        const resp = await fetch(`https://scc-r1co.onrender.com/api/students/${user.id}`);
        if (resp.ok) {
            const dbUser = await resp.json();
            
            // 1. Profile Image Sync
            const profileImg = document.getElementById('profileImage');
            if (profileImg) {
                const imgFile = dbUser.profileImage || 'user.png';
                profileImg.src = `https://scc-r1co.onrender.com/images/${imgFile}`;
                profileImg.style.cursor = 'pointer';
                profileImg.onclick = () => document.getElementById('imageInput').click();
            }

            // 2. XP & Rank Mapping
            if (xpDisplay) xpDisplay.textContent = `${dbUser.xp || 0} XP`;
            if (rankDisplay) rankDisplay.textContent = `#${dbUser.rank || 'N/A'}`;
            if (tokenDisplay) tokenDisplay.textContent = `${dbUser.tokens || 0} SCC`;

            updateXPVisuals(dbUser.xp || 0);

            console.log("MAINFRAME: Core Systems Synchronized.");
            
            // Terminal mein bhi real data dikhao
            messages.push(`> xp synchronized: ${dbUser.xp}`);
            messages.push(`> status: ${dbUser.rank <= 10 ? 'ELITE NODE' : 'ACTIVE NODE'}`);
        }
    } catch (e) {
        console.error("Critical Data Sync Offline. Using Local Fallback.");
        // Fallback to local session data if API fails
        if (xpDisplay) xpDisplay.textContent = `${user.xp || 0} XP`;
    }
    

    // 3. GLOBAL NAVIGATION & HIGHLIGHTING
    const homeLink = document.getElementById('homeLink');
    if (homeLink) {
        homeLink.href = (user.role === 'ADMIN' || user.role === 'ORGANIZER') ? 'organizer-dash.html' : '../student/main.html';
        homeLink.textContent = (user.role === 'ADMIN' || user.role === 'ORGANIZER') ? 'Admin Portal' : 'Mainframe';
    }

    const currentPage = window.location.pathname.split("/").pop();
    const navMap = { 'internships.html': 'internshipLink', 'events.html': 'eventsLink', 'profile.html': 'profilelink' };
    if (navMap[currentPage]) {
        const activeLink = document.getElementById(navMap[currentPage]);
        if (activeLink) activeLink.classList.add('text-cyan-400', 'border-b', 'border-cyan-400');
    }

    // 4. CHRONOS SYSTEM (Live Clock & Date)
    const updateChronos = () => {
        const clock = document.getElementById('liveClock');
        const dateNode = document.getElementById('liveDateDisplay');
        const now = new Date();
        if (clock) clock.textContent = now.toLocaleTimeString('en-US', { hour12: false });
        if (dateNode) {
            dateNode.textContent = now.toLocaleDateString('en-GB').replace(/\//g, ' . ');
        }
    };
    setInterval(updateChronos, 1000);
    updateChronos();

    // 5. TERMINAL LOG BOOT SEQUENCE
    const terminal = document.getElementById('terminalLog');
    if (terminal) {
        const messages = [`> handshake successful`, `> node ID: ${user.id || 'NAG_6'}`, `> security: ${user.role}`, `> ready` ];
        let line = 0;
        const addLine = () => {
            if (line < messages.length) {
                const p = document.createElement('p');
                p.textContent = messages[line];
                terminal.appendChild(p);
                terminal.parentElement.scrollTop = terminal.parentElement.scrollHeight;
                line++;
                setTimeout(addLine, 600);
            }
        };
        addLine();
    }

    // 6. INITIALIZE DATA MODULES (Aapke baki functions)
    if (typeof syncInfrastructure === "function") syncInfrastructure(user);
    if (typeof loadLeaderboard === "function") loadLeaderboard();
    if (typeof loadTalentDiscovery === "function") loadTalentDiscovery();
    if (typeof updateAchievementGallery === "function") updateAchievementGallery(user);

    // 7. REVEAL SYSTEM
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

// PHOTO UPLOAD FUNCTION (Triggered by onchange on #imageInput)
async function uploadProfilePhoto(event) {
    localStorage.getItem('scc_user')
    const currentXP = data.experiencePoints || data.xp || 0;
    const xpEl = document.getElementById('displayXP');
    if (xpEl) xpEl.innerText = currentXP;
    const file = event.target.files[0];
    if (!file) return;

    const user = JSON.parse(localStorage.getItem('scc_user'));
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`https://scc-r1co.onrender.com/api/students/${user.id}/upload-photo`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const newImageName = await response.text();
            // Nayi image turant UI par dikhao
            document.getElementById('profileImage').src = `https://scc-r1co.onrender.com/images/${newImageName}`;
            alert("MAINFRAME: Identity synchronized.");
        }
    } catch (err) {
        alert("Upload interrupted.");
    }
}
/** --- GLOBAL CORE FUNCTIONS --- **/

async function syncInfrastructure(user) {
    try {
        const res = await fetch(`https://scc-r1co.onrender.com/api/wallet/${user.id}/sync`);
        if (res.ok) {
            const freshData = await res.json();
            const scoreText = document.querySelector('.text-cyan-400[id="scoreVal"]') || document.querySelector('.lg:grid-cols-4 .text-cyan-400');
            if(scoreText) scoreText.textContent = `${freshData.experiencePoints || 0} / 1000`;
            
            const progressBar = document.querySelector('.bg-gradient-to-r.from-cyan-400');
            if (progressBar) {
                const percentage = Math.min(((freshData.experiencePoints || 0) / 1000) * 100, 100);
                progressBar.style.width = `${percentage}%`;
            }
        }
    } catch (e) { console.warn("Mainframe Sync Offline."); }
}

async function loadLeaderboard() {
    const container = document.getElementById('leaderboardContainer');
    if (!container) return;
    try {
        const res = await fetch('https://scc-r1co.onrender.com/api/students/leaderboard');
        const data = await res.json();
        const students = data.filter(s => s.role !== 'ADMIN' && s.role !== 'ORGANIZER');
        container.innerHTML = students.slice(0, 5).map((s, i) => `
            <div class="flex items-center justify-between p-4 glass rounded-2xl mb-2 hover:bg-white/5 transition-all">
                <span class="text-xs font-black uppercase tracking-widest">0${i+1} ${s.fullName}</span>
                <span class="text-cyan-400 font-bold">${s.experiencePoints} XP</span>
            </div>`).join('');
    } catch (e) { console.error("Ranking Sync Failed."); }
}

async function loadTalentDiscovery() {
    const grid = document.getElementById('talentGrid');
    if (!grid) return;
    try {
        const res = await fetch('https://scc-r1co.onrender.com/api/students/leaderboard');
        const data = await res.json();
        const students = data.filter(s => s.role === 'STUDENT').slice(0, 3);
        grid.innerHTML = students.map(s => `
            <div class="glass p-8 rounded-[2.5rem] border-white/5 group hover:border-cyan-500/30 transition-all">
                <div class="flex items-center gap-4 mb-6">
                    <img src="https://ui-avatars.com/api/?name=${s.fullName}&background=020617&color=06b6d4" class="w-12 h-12 rounded-2xl border border-white/10">
                    <div><h4 class="text-sm font-black text-white">${s.fullName}</h4><span class="text-[8px] font-black text-cyan-400 uppercase tracking-widest">Verified Expert</span></div>
                </div>
                <p class="text-xl font-black text-white">${s.experiencePoints || 0} XP</p>
            </div>`).join('');
    } catch (e) { console.error("Talent Grid Offline."); }
}


/** --- INTERFACE UTILITIES --- **/

function logoutUser() {
    localStorage.removeItem('scc_user');
    window.location.href = '../shared/index.html';
}

function openMap(type) {
    const modal = document.getElementById('mapModal');
    const title = document.getElementById('locationTitle');
    const status = document.getElementById('locationStatus');
    if (!modal) return;
    modal.classList.remove('hidden');
    if (type === 'shuttle') { title.textContent = "Mobility Hub"; status.textContent = "Operational: Sector A"; }
    else if (type === 'wallet') { title.textContent = "Smart Wallet"; status.textContent = "Secure: Active"; }
}

function closeMap() {
    const modal = document.getElementById('mapModal');
    if (modal) modal.classList.add('hidden');
}

function closeFeedback() {
    const modal = document.getElementById('feedbackModal');
    if (modal) modal.classList.add('hidden');
}

// Function to fetch and display original XP
// main.js ke andar update karein
async function syncOriginalXP() {
    // Exact key name 'scc_user' use karein
    const user = JSON.parse(localStorage.getItem('scc_user')); 
    
    if (!user || !user.id) {
        // Redirect logic agar identity missing hai
        window.location.href = '../auth/login.html';
        return;
    }

    try {
        const response = await fetch(`https://scc-r1co.onrender.com/api/students/${user.id}`);
        if (response.ok) {
            const dbData = await response.json();
            // Dashboard par XP aur Rank update karein
            if(document.getElementById('userXP')) {
                document.getElementById('userXP').textContent = `${dbData.xp || 0} XP`;
            }
            if(document.getElementById('userRank')) {
                document.getElementById('userRank').textContent = `#${dbData.rank || 'N/A'}`;
            }
        }
    } catch (error) {
        console.warn("Mainframe Sync Offline: Using Cached Data.");
        // Fallback: Agar offline hai toh purana data dikhao
        if(document.getElementById('userXP')) {
            document.getElementById('userXP').textContent = `${user.xp || 0} XP`;
        }
    }
}
// Function to update the Cyber Progress Bar
function updateXPVisuals(currentXP) {
    const xpBar = document.getElementById('xpProgressBar');
    const percentText = document.getElementById('xpPercentText');
    const nextXPLabel = document.getElementById('nextLevelXP');
    
    // Level Logic (Example: 1000 XP per level)
    const levelThreshold = 1000;
    const progressPercent = (currentXP % levelThreshold) / levelThreshold * 100;
    const currentLevel = Math.floor(currentXP / levelThreshold) + 1;

    if (xpBar) {
        // Smooth animation delay for cool effect
        setTimeout(() => {
            xpBar.style.width = `${progressPercent}%`;
            if (percentText) percentText.textContent = `${Math.round(progressPercent)}%`;
            if (nextXPLabel) nextXPLabel.textContent = `Next: ${levelThreshold} XP`;
            if (document.getElementById('currentLevelText')) {
                document.getElementById('currentLevelText').textContent = `Lvl. ${currentLevel}`;
            }
        }, 500);
    }
}

// Apne fetch logic ke andar ise call karein:
// const dbUser = await resp.json();
// updateXPVisuals(dbUser.xp || 0);