

document.addEventListener("DOMContentLoaded", async () => {
    // 1. RECOVER LOGGED-IN USER SESSION
    const user = JSON.parse(localStorage.getItem('scc_user'));
    if (!user) { window.location.href = '../auth/login.html'; return; }

    // 2. IMMEDIATE UI RENDER (Using cached data for speed)
    updateProfileUI(user);

    // 3. MAINFRAME HANDSHAKE (Fetch fresh data from Merged Controller)
    try {
        const response = await fetch(`https://scc-r1co.onrender.com/api/students/${user.id}`);
        if (response.ok) {
            const freshData = await response.json();
            
            // Sync LocalStorage with Database (Matches Sahil's 2400 XP)
            localStorage.setItem('scc_user', JSON.stringify(freshData));
            updateProfileUI(freshData);
        }
    } catch (err) {
        console.warn("Mainframe Offline: Using Local Identity Cache.");
    }
});

/**
 * RE-RENDER PROFILE DATA
 * Handles Name, XP, Bio, and Certificate Logic
 */
function updateProfileUI(data) {
    const currentXP = data.experiencePoints || data.xp || 0;

    // Set Text Identity
    const nameEl = document.getElementById('displayFullName');
    if (nameEl) nameEl.innerText = data.fullName || "User Node";
    
    const xpEl = document.getElementById('displayXP');
    if (xpEl) xpEl.innerText = currentXP;

    // Set Bio Fields
    if(document.getElementById('studentEmail')) document.getElementById('studentEmail').value = data.email || "";
    if(document.getElementById('studentEdu')) document.getElementById('studentEdu').value = data.education || "";
    if(document.getElementById('studentBio')) document.getElementById('studentBio').value = data.bio || "";

    // CERTIFICATE LOGIC (Unlocked for Sahil at 2400 XP)
    const certContainer = document.getElementById('certContainer');
    const certLocked = document.getElementById('certLocked');
    if (currentXP >= 500) {
        if(certContainer) certContainer.classList.remove('hidden');
        if(certLocked) certLocked.classList.add('hidden');
    }

    // IMAGE LOGIC (Uses ID-based profile image)
    const profileImg = document.getElementById('profileImage');
    if (profileImg && data.profileImage) {
        const cacheBuster = new Date().getTime();
        profileImg.src = `https://scc-r1co.onrender.com/images/${data.profileImage}?v=${cacheBuster}`;
    }
}

async function completeProfessionalTask(taskName, xpReward) {
    const user = JSON.parse(localStorage.getItem('scc_user'));
    const btn = event.target; // Get the button clicked

    try {
        const response = await fetch(`https://scc-r1co.onrender.com/api/students/${user.id}/add-xp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ xp: xpReward, task: taskName })
        });

        if (response.ok) {
            btn.innerText = "VERIFIED";
            btn.disabled = true; // Button disable taaki spam na ho
            btn.classList.add('opacity-50', 'cursor-not-allowed');
            alert(`SUCCESS: ${taskName} verified. +${xpReward} XP added.`);
            location.reload(); 
        } else {
            const error = await response.text();
            alert(error); // "Task already completed" dikhayega
        }
    } catch (err) {
        alert("Mainframe Connection Error.");
    }
}

async function executeTask(button, taskName, xpReward, minXpRequired = 0) {
    const user = JSON.parse(localStorage.getItem('scc_user'));
    const currentXP = user.experiencePoints || 0;

    // 1. Talent Check
    if (currentXP < minXpRequired) {
        alert(`ACCESS DENIED: Is task ke liye ${minXpRequired} XP chahiye. Aapka current XP: ${currentXP}`);
        return;
    }

    try {
        const response = await fetch(`https://scc-r1co.onrender.com/api/students/${user.id}/add-xp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ xp: xpReward, task: taskName })
        });

        if (response.ok) {
            button.innerText = "SYNCHRONIZED";
            button.disabled = true;
            button.classList.add('bg-slate-800', 'text-slate-500', 'cursor-not-allowed');
            alert(`EXCELLENT: +${xpReward} XP earned. Database updated.`);
            location.reload(); 
        } else {
            const msg = await response.text();
            alert("MAINFRAME ERROR: " + msg);
        }
    } catch (err) {
        alert("Connection Lost.");
    }
}

/**
 * SYNC BIO DATA
 * Fixes the 404 error by calling the correct id-based path
 */
async function saveStudentBio() {
    const user = JSON.parse(localStorage.getItem('scc_user'));
    const payload = {
        email: document.getElementById('studentEmail').value,
        education: document.getElementById('studentEdu').value,
        bio: document.getElementById('studentBio').value
    };

    try {
        const response = await fetch(`https://scc-r1co.onrender.com/api/students/${user.id}/sync-bio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("MAINFRAME BIO UPDATED.");
        }
    } catch (err) {
        alert("Bio Sync Failed.");
    }
}
async function executeTask(button, taskName, xpReward) {
    const user = JSON.parse(localStorage.getItem('scc_user'));

    try {
        const response = await fetch(`https://scc-r1co.onrender.com/api/students/${user.id}/add-xp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ xp: xpReward, task: taskName })
        });

        if (response.ok) {
            // Button UI change: Spam rokne ke liye
            button.innerText = "VERIFIED";
            button.disabled = true;
            button.classList.remove('bg-cyan-500');
            button.classList.add('bg-slate-800', 'text-slate-500', 'cursor-not-allowed', 'border', 'border-white/10');
            
            alert(`EXCELLENT: +${xpReward} XP earned and logged.`);
            location.reload(); // Refresh to update total XP to 2400+
        } else {
            const errorMsg = await response.text();
            alert("MAINFRAME ERROR: " + errorMsg);
        }
    } catch (err) {
        alert("CRITICAL: Connection to Mainframe lost.");
    }
}