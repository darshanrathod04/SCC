/**
 * SMART CAMPUS CONNECT (SCC) IDENTITY TERMINAL MANAGER
 * Architecture Engine Architecture V2.1 - Clean Async DTO Implementation
 */

const BACKEND_BASE = "https://scc-r1co.onrender.com/api/students";

document.addEventListener("DOMContentLoaded", async () => {
    // 1. EXTRACT CRITICAL USER SESSION CACHE
    const sessionUser = JSON.parse(localStorage.getItem('scc_user'));
    if (!sessionUser || !sessionUser.id) {
        window.location.href = '../auth/login.html';
        return;
    }

    // 2. BOOTSTRAP INTERFACE VISUALS FROM CACHE INSTANTLY
    renderProfileUI(sessionUser);

    // 3. SECURE PROFILE SYNC OVER NETWORK VIA CLEAN PROFILE DTO PATH
    try {
        const response = await fetch(`${BACKEND_BASE}/${sessionUser.id}/profile`);
        if (response.ok) {
            const secureProfileData = await response.json();

            // Sync session structure and update the DOM layout components
            localStorage.setItem('scc_user', JSON.stringify(secureProfileData));
            renderProfileUI(secureProfileData);
        } else {
            console.warn("> Node handshaking structural mismatch. Check endpoint configuration.");
        }
    } catch (err) {
        console.warn("> Mainframe Infrastructure Node down. Operating via Identity Cache Layer.");
    }
});

/**
 * RE-RENDER PROFILE INTERFACE DOM COMPONENT BUILDER
 */
function renderProfileUI(data) {
    const currentXP = data.experiencePoints || data.xp || 0;

    // Synchronize basic text descriptors
    if (document.getElementById('displayFullName')) {
        document.getElementById('displayFullName').innerText = data.fullName || "User Node";
    }
    if (document.getElementById('displayXP')) {
        document.getElementById('displayXP').innerText = currentXP;
    }

    // Bind values safely to input buffers
    if (document.getElementById('studentEmail')) document.getElementById('studentEmail').value = data.email || "";
    if (document.getElementById('studentEdu')) document.getElementById('studentEdu').value = data.education || "";
    if (document.getElementById('studentBio')) document.getElementById('studentBio').value = data.bio || "";

    // SYSTEM LICENSING GATEWAY (UNLOCKED THRESHOLD AT 500 XP)
    const certContainer = document.getElementById('certContainer');
    const certLocked = document.getElementById('certLocked');
    if (currentXP >= 500) {
        if (certContainer) certContainer.classList.remove('hidden');
        if (certLocked) certLocked.classList.add('hidden');
    } else {
        if (certContainer) certContainer.classList.add('hidden');
        if (certLocked) certLocked.classList.remove('hidden');
    }

    // PARSE SECURE PROFILE AVATAR PATHS
    const profileImg = document.getElementById('profileImage');
    if (profileImg && data.profileImage) {
        const timestampBuster = new Date().getTime();
        profileImg.src = `https://scc-r1co.onrender.com/images/${data.profileImage}?v=${timestampBuster}`;
    }

    // RENDER SYSTEM SKILLS LIST
    renderSkillsGrid(data.skillAudits || []);
}

/**
 * PARSE AND POPULATE USER VAULT SKILL NODES
 */
function renderSkillsGrid(skillAudits) {
    const grid = document.getElementById('skillGrid');
    if (!grid) return;

    if (!skillAudits || skillAudits.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-8 text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest border border-dashed border-white/5 rounded-2xl">
                No active skills logged inside node workspace.
            </div>`;
        return;
    }

    grid.innerHTML = skillAudits.map(node => {
        const isVerified = node.status === 'VERIFIED';
        return `
            <div class="p-5 rounded-2xl border transition-all ${isVerified ? 'border-cyan-500/20 bg-cyan-500/5' : 'border-white/5 bg-white/5'}">
                <div class="flex justify-between items-center">
                    <span class="text-xs font-black uppercase tracking-tight text-white">${node.skillName}</span>
                    <span class="text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isVerified ? 'bg-cyan-500/20 text-cyan-400' : 'bg-amber-500/20 text-amber-400'}">
                        ${node.status}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * UPDATE USER DATA ARCHIVE (BIO & EDUCATION CHANGES)
 */
async function saveStudentBio() {
    const user = JSON.parse(localStorage.getItem('scc_user'));
    const btn = document.getElementById('updateBioBtn');

    const payload = {
        email: document.getElementById('studentEmail').value,
        education: document.getElementById('studentEdu').value,
        bio: document.getElementById('studentBio').value
    };

    if (btn) btn.innerText = "SYNCHRONIZING BIO ENGINE...";

    try {
        const response = await fetch(`${BACKEND_BASE}/${user.id}/sync-bio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // Update local state and announce confirmation
            const freshCache = { ...user, education: payload.education, bio: payload.bio };
            localStorage.setItem('scc_user', JSON.stringify(freshCache));
            alert("MAINFRAME TRANSACTION COMPLETE: Bio Sync Successful.");
        } else {
            alert("SYNC WARNING: Update handshake rejected by server configuration pipeline.");
        }
    } catch (err) {
        alert("CRITICAL NET ERROR: Unable to communicate data back to mainframe nodes.");
    } finally {
        if (btn) btn.innerText = "Update Mainframe Bio";
    }
}

/**
 * COMMIT SKILLS AUDIT ROUTINE
 */
async function submitSkillNode() {
    const skillNameInput = document.getElementById('newSkillName');
    const user = JSON.parse(localStorage.getItem('scc_user'));

    if (!skillNameInput || !skillNameInput.value.trim()) {
        alert("Task string required.");
        return;
    }

    const payload = {
        userId: user.id,
        skillName: skillNameInput.value.trim(),
        status: 'PENDING'
    };

    try {
        const response = await fetch(`${BACKEND_BASE}/${user.id}/commit-skill`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert(`Task Node "${payload.skillName}" successfully queued for Administrative Review.`);
            closeSkillModal();
            skillNameInput.value = "";
            location.reload();
        } else {
            alert("COMMIT DENIED: Vault architecture rejected transmission bundle.");
        }
    } catch (err) {
        alert("CONNECTION TIMEOUT: Core cluster unreachable.");
    }
}

/**
 * EXECUTE DAILY WORKFLOWS FOR INCREMENTAL REWARD BLOCKS
 */
async function executeTask(button, taskName, xpReward, minXpRequired = 0) {
    const user = JSON.parse(localStorage.getItem('scc_user'));
    const currentXP = user.experiencePoints || user.xp || 0;

    if (currentXP < minXpRequired) {
        alert(`ACCESS REFUSED: Security architecture demands a minimum threshold of ${minXpRequired} XP. Active Level: ${currentXP} XP.`);
        return;
    }

    try {
        const response = await fetch(`${BACKEND_BASE}/${user.id}/add-xp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ xp: xpReward, task: taskName })
        });

        if (response.ok) {
            button.innerText = "SYNCHRONIZED";
            button.disabled = true;
            button.className = "px-4 py-2 bg-slate-800 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest cursor-not-allowed border border-white/5";

            alert(`METRIC COMMITTED: +${xpReward} XP calculated and permanently added.`);

            // Re-fetch profile data to align client session storage metrics
            const refreshRes = await fetch(`${BACKEND_BASE}/${user.id}/profile`);
            if (refreshRes.ok) {
                localStorage.setItem('scc_user', JSON.stringify(await refreshRes.json()));
            }
            location.reload();
        } else {
            const errorTrace = await response.text();
            alert("MAINFRAME TRANSACTION REJECTED: " + errorTrace);
        }
    } catch (err) {
        alert("CRITICAL DECOUPLING: Mainframe data-link completely dropped.");
    }
}

/**
 * FILE TRANSFER DISPATCH PROTOCOLS (RESUME HANDLING)
 */
async function uploadResume() {
    const fileInput = document.getElementById('resumeFile');
    const status = document.getElementById('uploadStatus');
    const session = JSON.parse(localStorage.getItem('scc_user'));

    if (!fileInput || !fileInput.files[0]) {
        alert("Please load a credential PDF mapping into the cache framework first.");
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('email', session.email);

    if (status) status.innerText = "SYNCHRONIZING FILE CLUSTERS WITH MAINFRAME...";

    try {
        const response = await fetch(`${BACKEND_BASE}/upload-resume`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            if (status) {
                status.innerText = "SUCCESS: RESUME REPOSITORY UPDATED AND LOCKED.";
                status.className = "mt-4 text-[8px] font-black uppercase tracking-widest text-green-400";
            }
        } else {
            if (status) {
                status.innerText = "TRANSMISSION FAILED: VALIDATE DATA COMPRESSION SIZE LIMITS.";
                status.className = "mt-4 text-[8px] font-black uppercase tracking-widest text-red-400";
            }
        }
    } catch (err) {
        if (status) {
            status.innerText = "NETWORK CRITICAL: MAIN TARGET CORE ARCHITECTURE OFFLINE.";
            status.className = "mt-4 text-[8px] font-black uppercase tracking-widest text-red-500";
        }
    }
}

/**
 * SYSTEM VISIBILITY UTILITIES
 */
function openSkillModal() { document.getElementById('skillModal').classList.remove('hidden'); }
function closeSkillModal() { document.getElementById('skillModal').classList.add('hidden'); }
function logout() { localStorage.clear(); window.location.href = '../shared/index.html'; }
function generateCertificate() { window.open('certificate.html', '_blank'); }