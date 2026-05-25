

/**
 * SCC SYSTEM INFRASTRUCTURE v4.5
 * Unified Professional Scripting Protocol
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. SCROLL OBSERVER (Visual Reveals)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 2. CONSOLIDATED IDENTITY & NAVBAR SYNC
    // This fixes the ReferenceError at line 88 and the Line 96 null check
    const userName = localStorage.getItem('userName');
    const role = localStorage.getItem('userRole');
    const nav = document.getElementById('dashboardNav');
    const userDisplay = document.getElementById('user-name-display') || document.getElementById('userNameDisplay');

    // Handle Navbar Injection
    if (nav) {
        nav.innerHTML = `
            <div class="flex items-center gap-4 group cursor-pointer">
                <div class="relative w-11 h-11 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <i class="fas fa-microchip text-slate-950 text-xl"></i>
                </div>
                <div class="text-2xl font-black tracking-tighter uppercase">SCC<span class="text-cyan-400">.</span></div>
            </div>
            <div class="flex items-center space-x-8">
                <a href="../student/main.html" class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-cyan-400">Dashboard</a>
                <a <a href="../shared/internships.html class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-cyan-400">Internships</a>
                <a <a href="../shared/events.html" class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-cyan-400">Events</a>
                <div id="auth-node" class="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
                    ${userName ? 
                        `<span class="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Recognized: ${userName}</span>
                         <button onclick="logout()" class="px-5 py-2 glass border-white/5 text-red-400 uppercase text-[9px] tracking-widest hover:bg-red-500 hover:text-white transition-all rounded-xl">Terminate</button>` :
                        `<a href="../auth/login.html" class="text-[10px] font-black text-white uppercase tracking-widest">Sign In</a>`
                    }
                </div>
            </div>
        `;
    }

    // Handle User Greeting (Fix for index.js:88)
    if (userDisplay) {
        userDisplay.textContent = userName || "Authorized User";
    }

    // 3. AUTO-LOAD DATA
    if (document.getElementById("leaderboardList")) {
        loadLeaderboard();
    }
});

// 4. GLOBAL SYSTEM FUNCTIONS (Outside of DOMContentLoaded)

async function loadLeaderboard() {
    try {
        const res = await fetch("https://scc-r1co.onrender.com/api/students/leaderboard");
        if (!res.ok) throw new Error("Mainframe connection failed");
        const topStudents = await res.json();
        
        const list = document.getElementById("leaderboardList");
        if (list) {
            list.innerHTML = topStudents.map((s, index) => `
                <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all">
                    <span class="text-xs font-bold text-slate-400">0${index + 1}</span>
                    <span class="text-sm font-black">${s.fullName}</span>
                    <span class="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded font-bold">${s.experiencePoints} XP</span>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error("SCC Leaderboard Error:", err);
    }
}

function openMap(type) {
    const modal = document.getElementById('mapModal');
    const title = document.getElementById('locationTitle');
    const status = document.getElementById('locationStatus');
    const desc = document.getElementById('locationDesc');

    if (!modal) return;

    if (type === 'library') {
        title.innerHTML = `Central <br><span class="text-cyan-400">Library</span>`;
        status.innerHTML = `<span class="text-green-400 animate-pulse">● 85% Capacity</span>`;
        desc.innerText = "North-east wing. Current peak hours detected. Floor 4 remains a silent zone.";
    } else if (type === 'shuttle') {
        title.innerHTML = `Campus <br><span class="text-purple-400">Shuttle</span>`;
        status.innerHTML = `<span class="text-blue-400 animate-pulse">● Arriving in 4m</span>`;
        desc.innerText = "Route A active: Main Gate to Girls' Hostel. Live GPS tracking established.";
    }

    modal.classList.remove('hidden');
}

/**
 * UPDATED SPATIAL DATA PROTOCOL
 * Includes Smart Wallet QR Generation
 */
function openMap(type) {
    const modal = document.getElementById('mapModal');
    const title = document.getElementById('locationTitle');
    const status = document.getElementById('locationStatus');
    const desc = document.getElementById('locationDesc');
    const mapImage = document.getElementById('mapImage'); // Ensure this ID exists in your modal HTML

    if (!modal) return;

    if (type === 'wallet') {
        const userId = localStorage.getItem('userId') || "NODE_UNSYNCED";
        title.innerHTML = `Smart <span class="text-cyan-400">Wallet</span>`;
        status.innerHTML = `<span class="text-cyan-400 animate-pulse">● Generating Access Key...</span>`;
        desc.innerText = "Verified access key for Node ID: " + userId + ". Scan at any campus terminal.";
        
        // Expert API Call: Generates QR themed for SCC (Cyan color on Dark background)
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SCC_ACCESS_${userId}&color=06b6d4&bgcolor=020617`;
        if (mapImage) {
            mapImage.src = qrUrl;
            mapImage.style.padding = "2rem"; // Scanner-style padding
            mapImage.style.objectFit = "contain";
        }
    } else if (type === 'library') {
        title.innerHTML = `Central <br><span class="text-cyan-400">Library</span>`;
        status.innerHTML = `<span class="text-green-400">● 85% Capacity</span>`;
        desc.innerText = "North-east wing. Floor 4 remains a silent zone.";
        if (mapImage) mapImage.src = "https://images.unsplash.com/photo-1503387762-592dee58c460?q=80&w=2000";
    }

    modal.classList.remove('hidden');
}

function closeMap() {
    const modal = document.getElementById('mapModal');
    if (modal) modal.classList.add('hidden');
}

function logout() {
    localStorage.clear();
    alert("SCC Session Terminated Successfully.");
    window.location.href = '../shared/index.html';
}
/**
 * SCC MERIT ADJUSTMENT PROTOCOL
 * Allows the Founder to manually override student XP values.
 */
async function modifyXP(studentName, inputId) {
    const xpInput = document.getElementById(inputId);
    const xpValue = parseInt(xpInput.value);

    if (isNaN(xpValue)) {
        alert("CRITICAL ERROR: Invalid XP numerical value.");
        return;
    }

    // Handshake with Backend Service
    console.log(`> Admin Override: Modifying ${studentName} merit by ${xpValue} units...`);
    
    // In a live environment, you would send this to your Spring Boot Controller
    /*
    const response = await fetch(`/api/admin/modify-xp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, adjustment: xpValue })
    });
    */

    alert(`MERIT SYNC: ${studentName}'s profile has been updated by ${xpValue} XP.`);
    xpInput.value = ''; // Reset input
}

function filterNodes() {
    let input = document.getElementById('nodeSearch');
    let filter = input.value.toUpperCase();
    let table = document.getElementById('studentNodeBody');
    let tr = table.getElementsByTagName('tr');

    for (let i = 0; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName('td')[0];
        if (td) {
            let txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const sessionNode = JSON.parse(localStorage.getItem('scc_user'));
    const adminContainer = document.getElementById('admin-link-container');

    // Only if the user is a verified ADMIN, show the link
    if (sessionNode && sessionNode.role === 'ADMIN') {
        adminContainer.innerHTML = `
            <a href="../admin/admin.html" class="text-cyan-400 border-b border-cyan-400/30 pb-1">
                <i class="fas fa-unlock-alt mr-1"></i> Admin Portal
            </a>
        `;
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const sessionNode = JSON.parse(localStorage.getItem('scc_user'));
    const adminLink = document.getElementById('admin-link-container');
    const founderBadge = document.getElementById('founder-badge-container');

    // SECURITY CHECK: Only proceed if a session exists
    if (sessionNode && sessionNode.role === 'ADMIN') {
        
        // 1. Inject the Admin Portal Link (Hidden from students)
        if (adminLink) {
            adminLink.innerHTML = `
                <a href="../admin/admin.html" class="text-cyan-400 border-b border-cyan-400/30 pb-1 flex items-center gap-1">
                    <i class="fas fa-shield-alt text-[7px]"></i> Admin
                </a>
            `;
        }

        // 2. Inject the Founder Badge next to the Logo
        if (founderBadge) {
            founderBadge.innerHTML = `
                <span class="ml-2 px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded text-[7px] font-black text-cyan-400 tracking-[0.2em]">
                    FOUNDER
                </span>
            `;
        }
        
        console.log("MAINFRAME: Founder Identity Verified. Admin Nodes Active.");
    } else {
        // If not admin, ensure any manual attempts to see admin links are cleared
        if (adminLink) adminLink.innerHTML = '';
        console.log("MAINFRAME: Standard Access Level Verified.");
    }
});