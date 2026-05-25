const BASE_URL = "https://scc-r1co.onrender.com/api/students";

document.addEventListener("DOMContentLoaded", () => {
    // --- UI SESSION SYNC ---
    const userName = localStorage.getItem('userName');
    const authContainer = document.getElementById('auth-status'); 
    if (userName && authContainer) {
        authContainer.innerHTML = `
            <span class="text-cyan-400 font-black mr-4 text-[10px] tracking-widest">RECOGNIZED: ${userName}</span>
            <button id="logoutBtn" class="px-4 py-2 glass border-white/5 text-slate-400 uppercase text-[10px] tracking-widest hover:text-red-400 transition-colors">Terminate Session</button>
        `;
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.clear();
            window.location.href = '../auth/login.html';
        });
    }

    // 2. AUTO-FILL PROTOCOL (Invite Code Logic)
    const params = new URLSearchParams(window.location.search);
    if (params.has('invite')) {
        const inviteBadge = document.getElementById('inviteBadge');
        if (inviteBadge) inviteBadge.innerText = `Invite Code: ${params.get('invite')}`;
        
        const fieldMapping = { 'name': 'fullName', 'email': 'emailAddress', 'college': 'college', 'phone': 'mobile' };
        Object.keys(fieldMapping).forEach(param => {
            if (params.has(param)) {
                const el = document.getElementById(fieldMapping[param]);
                if (el) {
                    el.value = params.get(param);
                    el.classList.add('border-cyan-500/50', 'bg-cyan-500/5');
                }
            }
        });
    }

    

    
});

async function pollForBroadcasts() {
    try {
        const response = await fetch('https://scc-r1co.onrender.com/api/students/notifications');
        const notifications = await response.json();
        
        const dock = document.getElementById('notification-dock');
        dock.innerHTML = notifications.map(note => `
            <div class="glass p-6 rounded-2xl border-red-500/30 bg-red-500/5 mb-4 pointer-events-auto animate-bounce-subtle">
                <div class="flex items-center gap-3 mb-2">
                    <i class="fas fa-broadcast-tower text-red-500 text-xs"></i>
                    <span class="text-[9px] font-black uppercase tracking-widest text-red-500">Founder Directive</span>
                </div>
                <h4 class="text-xs font-black uppercase text-white">${note.subject}</h4>
                <p class="text-[10px] text-slate-400 mt-2 leading-relaxed">${note.message}</p>
            </div>
        `).join('');
    } catch (err) {
        console.warn("Notification sync offline.");
    }
}

// Check for new broadcasts every 30 seconds
setInterval(pollForBroadcasts, 30000);



// --- OTP PROTOCOLS ---
async function sendVerificationOTP() {
    const email = document.getElementById('emailAddress').value;
    const sendBtn = document.getElementById('sendOtpBtn');
    if (!email) { alert("Email node required."); return; }

    sendBtn.innerText = "SENDING...";
    sendBtn.disabled = true;

    try {
        const res = await fetch(`${BASE_URL}/request-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });
        if (res.ok) {
            document.getElementById('otpSection').classList.remove('hidden');
            alert("MAINFRAME: Code transmitted.");
        }
    } catch (err) { alert("Mainframe Offline."); }
    finally { sendBtn.disabled = false; }
}

async function verifyStudentOTP() {
    const email = document.getElementById('emailAddress').value;
    const otp = document.getElementById('otpInput').value;
    try {
        const res = await fetch(`${BASE_URL}/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, otp: otp })
        });
        if (res.ok) {
            document.getElementById('otpSection').classList.add('hidden');
            document.getElementById('finalSubmitSection').classList.remove('hidden');
            document.getElementById('emailAddress').readOnly = true;
            alert("✓ Identity Verified.");
        } else { alert("Access Denied: Invalid Key."); }
    } catch (err) { alert("Verification Offline."); }
}

// --- FINAL REGISTRATION HANDSHAKE ---
async function handleRegistration(event) {
    if (event) event.preventDefault();
    const submitBtn = document.getElementById('registerBtn');
    submitBtn.innerText = "INITIALIZING PROTOCOL...";
    submitBtn.disabled = true;

    const studentData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('emailAddress').value,
        password: document.getElementById('password').value,
        college: document.getElementById('college')?.value || "",
        mobile: document.getElementById('mobile')?.value || "",
        skills: document.getElementById('skills')?.value || "",
        role: document.getElementById('role').value
    };

    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });

        if (response.ok) {
            submitBtn.innerText = "IDENTITY VERIFIED";
            alert("SUCCESS: Welcome Protocol Initialized! Check your email.");
            setTimeout(() => { window.location.href = '../auth/login.html'; }, 2000);
        } else {
            const msg = await response.text();
            alert("REJECTED: " + msg);
            submitBtn.disabled = false;
        }
    } catch (error) {
        alert("CRITICAL ERROR: Mainframe Offline.");
        submitBtn.disabled = false;
    }
}

function setRole(role) {
    document.getElementById('role').value = role;
    const isStudent = role === 'STUDENT';
    
    // UI Feedback
    document.getElementById('studentOnly').classList.toggle('hidden', !isStudent);
    document.getElementById('organizerOnly').classList.toggle('hidden', isStudent);
    
    // Button Styling
    document.getElementById('btnStudent').className = isStudent ? 'py-4 rounded-2xl border-2 border-cyan-500 bg-cyan-500/10 text-cyan-400 font-bold' : 'py-4 rounded-2xl border-2 border-white/5 bg-white/5 text-slate-400 font-bold';
    document.getElementById('btnOrganizer').className = !isStudent ? 'py-4 rounded-2xl border-2 border-cyan-500 bg-cyan-500/10 text-cyan-400 font-bold' : 'py-4 rounded-2xl border-2 border-white/5 bg-white/5 text-slate-400 font-bold';
}