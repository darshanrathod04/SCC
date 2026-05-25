/**
 * SCC ADMIN MAINFRAME MASTER ENGINE - v6.5
 * Optimized for Founder Authority & Ecosystem Intelligence
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("SCC Mainframe: Initializing Founder Level Protocols...");
    
    // 1. DATA RECOVERY
    const user = JSON.parse(localStorage.getItem('scc_user'));
    if (!user) { window.location.href = '../auth/login.html'; return; }

    // 2. INITIALIZE ALL DATA NODES
    fetchGlobalMetrics();    // XP Counter & Student Count
    fetchAdminStudents();    // Talent Inventory
    fetchPendingPartners();  // Partner Approval List
    fetchPendingAudits();
    fetchSystemPulse();      // Activity Feed
    updateMarketDemand();    // Trending Skills
    initVelocityChart();     // 7-Day Chart

    // 3. SET REFRESH PROTOCOLS
    setInterval(fetchSystemPulse, 10000);   // Pulse every 10s
    setInterval(fetchGlobalMetrics, 60000); // Stats every 1m
});

// --- 1. METRICS & COUNTERS ---
async function fetchGlobalMetrics() {
    try {
        const response = await fetch('https://scc-r1co.onrender.com/api/students/admin/total-xp');
        const data = await response.json();
        animateCounter('totalXpCounter', data.totalXp || 2400);
        animateCounter('studentCountCounter', data.studentCount || 4);
    } catch (err) { console.warn("Metrics Offline - Using Cache"); }
}

function animateCounter(id, target) {
    const obj = document.getElementById(id);
    if (!obj) return;
    let current = 0;
    const timer = setInterval(() => {
        current += target / 50;
        if (current >= target) {
            obj.textContent = new Intl.NumberFormat('en-IN').format(Math.floor(target));
            clearInterval(timer);
        } else {
            obj.textContent = new Intl.NumberFormat('en-IN').format(Math.floor(current));
        }
    }, 20);
}

// --- 2. TALENT & PARTNER NODES ---
async function fetchAdminStudents() {
    const container = document.getElementById('adminStudentList');
    if (!container) return;
    try {
        const response = await fetch('https://scc-r1co.onrender.com/api/students/admin/students-summary');
        const students = await response.json();
        const today = new Date().toISOString().split('T')[0];

        container.innerHTML = students.map(s => `
            <div class="flex justify-between items-center p-4 bg-white/5 rounded-2xl mb-2 border border-white/5 hover:border-cyan-500/30 transition-all">
                <div class="flex items-center gap-3">
                    <div class="w-2 h-2 rounded-full ${s.lastActive === today ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}"></div>
                    <div>
                        <p class="text-xs font-black uppercase text-white">${s.fullName}</p>
                        <p class="text-[8px] text-slate-500 uppercase font-bold">Last Pulse: ${s.lastActive || 'Static'}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-[10px] font-black text-cyan-400 italic">${s.xp || 0} XP</p>
                </div>
            </div>`).join('');
    } catch (err) { console.error("Talent Inventory Offline"); }
}

async function fetchPendingPartners() {
    const list = document.getElementById('partnerApprovalList');
    if (!list) return;
    try {
        const response = await fetch('https://scc-r1co.onrender.com/api/partners/pending');
        const partners = await response.json();
        
        if (partners.length === 0) {
            list.innerHTML = `<div class="glass p-8 rounded-[2.5rem] border-white/5 text-center text-slate-600 text-[10px] font-black uppercase tracking-widest">No Pending Partner Nodes Detected.</div>`;
            return;
        }

        list.innerHTML = partners.map(p => `
            <div class="glass p-8 rounded-[2.5rem] border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 mb-4 group hover:bg-white/[0.02] transition-all">
                <div class="flex items-center gap-8">
                    <div class="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                        <i class="fas fa-building text-xl"></i>
                    </div>
                    <div>
                        <h4 class="text-lg font-black uppercase tracking-tight">${p.companyName}</h4>
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">${p.industry} | ${p.email}</p>
                    </div>
                </div>
                <button onclick="approvePartner(${p.id}, '${p.companyName}')" class="px-10 py-3 bg-purple-500 text-slate-950 font-black rounded-xl text-[9px] uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-purple-500/20">Authorize Access</button>
            </div>`).join('');
    } catch (err) { console.error("Partner Sync Offline"); }
}

// --- 3. SYSTEM PULSE & BROADCAST ---
async function fetchSystemPulse() {
    const feed = document.getElementById('pulseFeed');
    if (!feed) return;
    try {
        const response = await fetch('https://scc-r1co.onrender.com/api/admin/activity');
        const logs = await response.json();
        
        feed.innerHTML = logs.map(log => {
            const isLead = log.type === 'LEAD_GEN';
            const time = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `
                <div class="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border ${isLead ? 'border-purple-500/30 bg-purple-500/[0.02]' : 'border-white/5'}">
                    <div class="flex items-center gap-4">
                        <div class="text-[10px] font-black text-slate-500">${time}</div>
                        <div class="w-1.5 h-1.5 rounded-full ${isLead ? 'bg-purple-500' : 'bg-cyan-500'}"></div>
                        <p class="text-[11px] font-bold uppercase text-white">
                            ${log.userName ? log.userName.split('@')[0] : 'System'} <span class="text-slate-500 font-medium lowercase">${log.description}</span>
                        </p>
                    </div>
                </div>`;
        }).join('');
    } catch (err) { console.warn("Pulse Stream Interrupted"); }
}

async function executeBroadcast() {
    const subject = document.getElementById('broadcastSubject').value;
    const message = document.getElementById('broadcastMessage').value;
    if (!subject || !message) { alert("ERROR: Payload Incomplete"); return; }

    if (confirm(`INITIALIZE GLOBAL BROADCAST?\nSubject: ${subject}`)) {
        try {
            await fetch('https://scc-r1co.onrender.com/api/admin/broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, message })
            });
            alert("BROADCAST SUCCESSFUL");
            document.getElementById('broadcastSubject').value = '';
            document.getElementById('broadcastMessage').value = '';
        } catch (err) { alert("Transmission Failed"); }
    }
}

// --- 4. CHARTS & DEMAND ---
async function initVelocityChart() {
    const canvas = document.getElementById('velocityChart');
    if (!canvas) return;
    try {
        const response = await fetch('https://scc-r1co.onrender.com/api/admin/velocity-data');
        const data = await response.json();
        new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    data: Object.values(data),
                    borderColor: '#a855f7',
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    } catch (e) { console.error("Chart Logic Failure"); }
}

async function updateMarketDemand() {
    const container = document.getElementById('trendingSkills');
    if (!container) return;
    try {
        const response = await fetch('https://scc-r1co.onrender.com/api/admin/activity');
        const logs = await response.json();
        const searchCounts = {};
        
        logs.filter(log => log.type === 'SEARCH_INTENT').forEach(log => {
            const skill = log.description.replace("Searched for talent node: ", "").toLowerCase();
            searchCounts[skill] = (searchCounts[skill] || 0) + 1;
        });

        const topSkills = Object.entries(searchCounts).sort((a,b) => b[1]-a[1]).slice(0,3);
        container.innerHTML = topSkills.map(([skill, count]) => `
            <div class="flex justify-between items-center mb-2">
                <span class="text-[10px] font-black uppercase text-white">${skill}</span>
                <span class="text-[10px] font-black text-cyan-400">${count} Requests</span>
            </div>
            <div class="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                <div class="h-full bg-cyan-500" style="width: ${Math.min(count * 20, 100)}%"></div>
            </div>`).join('');
    } catch (err) { console.warn("Demand Sync Offline"); }
}

// --- 5. APPROVALS ---
async function approveTask(studentName, taskName, xp) {
    if (!confirm(`Authorize Executive Approval for ${studentName}?`)) return;
    try {
        const response = await fetch(`https://scc-r1co.onrender.com/api/admin/approve-task`, { 
            method: 'POST',
            body: JSON.stringify({ studentName, taskName, xp })
        });
        if (response.ok) {
            localStorage.setItem('pending_cert_data', JSON.stringify({ studentName, taskName, xp }));
            window.open('certificate.html', '_blank');
        }
    } catch (err) { console.error("Task Approval Failure"); }
}

async function approvePartner(id, name) {
    if (!confirm(`Authorize ${name}?`)) return;
    try {
        const res = await fetch(`https://scc-r1co.onrender.com/api/partners/${id}/approve`, { method: 'PATCH' });
        if (res.ok) { alert("AUTHORIZED"); fetchPendingPartners(); }
    } catch (e) { alert("Authorization Failed"); }
}

function logout() {
    localStorage.removeItem('scc_user');
    window.location.href = '../shared/index.html';
}

// Map to Window for HTML onclick attributes
window.executeBroadcast = executeBroadcast;
window.approveTask = approveTask;
window.approvePartner = approvePartner;
window.logout = logout;

// --- PERMANENT FIX: SIGNATURE AUTHORITY ---
async function syncSignature() {
    const fileInput = document.getElementById('sigUpload');
    const preview = document.getElementById('currentSignature');
    const syncBtn = event.target; // Targets the button clicked
    
    if (!fileInput.files || !fileInput.files[0]) {
        alert("ERROR: No signature file detected in the buffer.");
        return;
    }

    // --- START SYNCING STATE ---
    const originalText = syncBtn.innerHTML;
    syncBtn.disabled = true;
    syncBtn.innerHTML = `<i class="fas fa-circle-notch animate-spin mr-2"></i> SYNCING...`;
    syncBtn.classList.add('opacity-50', 'cursor-not-allowed');

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    try {
        const response = await fetch('https://scc-r1co.onrender.com/api/admin/signature/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            const timestamp = new Date().getTime();
            preview.src = `https://scc-r1co.onrender.com/images/signature.png?t=${timestamp}`;
            alert("MAINFRAME SYNC COMPLETE: Signature Authority updated.");
        } else {
            const errorMsg = result.error || result.message || "Unknown Protocol Failure";
            alert("CRITICAL ERROR: " + errorMsg); 
        }
    } catch (err) {
        console.error("Transmission Error:", err);
        alert("SYSTEM KERNEL PANIC: Check backend connection.");
    } finally {
        // --- RESTORE BUTTON STATE ---
        syncBtn.disabled = false;
        syncBtn.innerHTML = originalText;
        syncBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

// --- PERMANENT FIX: AUDIT STREAM ---
async function fetchPendingAudits() {
    const auditList = document.getElementById('auditList');
    if (!auditList) return;

    try {
        const response = await fetch('https://scc-r1co.onrender.com/api/admin/tasks/pending');
        const audits = await response.json();

        if (audits.length === 0) {
            auditList.innerHTML = `
                <div class="glass p-10 rounded-[2.5rem] border-white/5 text-center">
                    <p class="text-[10px] font-black uppercase text-slate-600 tracking-widest italic">
                        Mainframe Clear: No Pending Audits.
                    </p>
                </div>`;
            return;
        }

        auditList.innerHTML = audits.map(audit => `
            <div class="glass p-8 rounded-[2.5rem] border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-white/[0.02] transition-all mb-4">
                <div class="flex items-center gap-8">
                    <img src="https://ui-avatars.com/api/?name=${audit.studentName}&background=020617&color=06b6d4" 
                         class="w-14 h-14 rounded-2xl border border-white/10">
                    <div>
                        <h4 class="text-lg font-black uppercase tracking-tight text-white">${audit.studentName}</h4>
                        <p class="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Task: ${audit.taskName}</p>
                    </div>
                </div>
                <div class="flex gap-4">
                    <button onclick="approveTask('${audit.id}', '${audit.studentName}', '${audit.taskName}', ${audit.xpValue})" 
                            class="px-10 py-3 bg-cyan-500 text-slate-950 font-black rounded-xl text-[9px] uppercase tracking-widest hover:bg-white transition-all">
                        Approve & Issue
                    </button>
                </div>
            </div>`).join('');
    } catch (err) {
        console.error("Audit Stream Offline.");
    }
}
// Ensure global access for buttons in HTML
window.syncSignature = syncSignature;
window.fetchPendingAudits = fetchPendingAudits;
// Add fetchPendingAudits to your DOMContentLoaded listener in admin.js
// window.syncSignature = syncSignature;

async function loadPartnerRegistry() {
    const registryList = document.getElementById('partnerRegistryList');
    if (!registryList) return;

    try {
        const response = await fetch('https://scc-r1co.onrender.com/api/admin/partners/all');
        const partners = await response.json();

        if (partners.length === 0) {
            registryList.innerHTML = `<p class="text-slate-500 font-bold uppercase text-[10px] tracking-widest text-center py-10">No active nodes in registry.</p>`;
            return;
        }

        registryList.innerHTML = partners.map(p => `
            <div class="glass p-6 rounded-3xl border border-white/5 flex justify-between items-center group hover:border-red-500/30 transition-all">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400">
                        <i class="fas fa-building text-xl"></i>
                    </div>
                    <div>
                        <h4 class="text-white font-black uppercase text-[11px] tracking-widest">${p.companyName}</h4>
                        <p class="text-[9px] text-slate-500 font-bold">${p.email}</p>
                        <span class="px-2 py-0.5 mt-2 inline-block rounded-lg text-[7px] font-black uppercase ${p.status === 'VERIFIED' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-amber-500/10 text-amber-400'}">
                            ${p.status}
                        </span>
                    </div>
                </div>
                <button onclick="terminatePartnerNode(${p.id})" class="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/20">
                    <i class="fas fa-trash-alt text-xs"></i>
                </button>
            </div>
        `).join('');
    } catch (err) {
        console.error("Registry Sync Failure:", err);
    }
}

// Call this function when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadPartnerRegistry();
});

async function terminatePartnerNode(id) {
    if (!confirm("CRITICAL: Permanently purge this partner from the mainframe?")) return;

    try {
        const response = await fetch(`https://scc-r1co.onrender.com/api/admin/partners/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("SUCCESS: Node terminated.");
            loadPartnerRegistry(); // Refresh the list
        }
    } catch (err) {
        alert("TERMINATION FAILED: Connection error.");
    }
}

