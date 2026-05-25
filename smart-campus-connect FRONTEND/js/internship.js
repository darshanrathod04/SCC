/**
 * SCC INTERNSHIP PROTOCOL - Version 3.2 (Master Engine)
 * Handles Secure Session, UI Guarding, and Full Database Sync.
 */

// 1. DATA ACQUISITION & ROUTE GUARD
const scc_user = JSON.parse(localStorage.getItem('scc_user'));

if (!scc_user) {
    console.error("SESSION ERROR: No user node detected. Redirecting...");
    window.location.href = "../auth/login.html";
}

const INTERNSHIP_API = "https://scc-r1co.onrender.com/api/internships";

document.addEventListener("DOMContentLoaded", async () => {
    // 2. IDENTITY RESOLUTION
    const userRole = scc_user.role; 
    const userName = scc_user.fullName;
    const userEmail = scc_user.email;
    
    // 3. UI INITIALIZATION (Navbar & Organizer Form Guard)
    syncIdentityUI(userName, userRole, userEmail);

    // 4. DATA LOAD: Fetch real market opportunities from DB
    await loadInternships(userRole);

    // 5. BROADCAST HANDLER: Setup form for Organizers
    setupInternshipBroadcastHandler();
});

/**
 * Syncs the Navigation Bar and handles Role-Based Visibility
 */
function syncIdentityUI(name, role, email) {
    const authContainer = document.getElementById('auth-status'); 
    const postSection = document.getElementById('postFormSection');
    const founderEmail = "darshanmrathod.2005@gmail.com";

    // Update Navbar Recognition
    if (name && authContainer) {
        authContainer.innerHTML = `
            <span class="text-cyan-400 font-black mr-4 text-[10px] tracking-[0.3em] uppercase">Recognized: ${name}</span>
            <button id="logoutBtn" class="px-5 py-2 glass border-white/5 text-slate-400 uppercase text-[9px] tracking-widest hover:text-red-400 transition-all rounded-xl">Terminate Session</button>
        `;
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.clear();
            window.location.href = '../auth/login.html';
        });
    }

    // Role Guard: Hide form from students, show for authorized personnel
    if (postSection) {
        if (role === 'ORGANIZER' || role === 'ADMIN' || email === founderEmail) {
            postSection.style.display = 'block';
            console.log("> Access Granted: Placement Mainframe Active.");
        } else {
            postSection.style.display = 'none';
            console.log("> Access Restricted: Student Node Detected.");
        }
    }
}

/**
 * Fetches and Renders the Internship Manifest from Database
 */
async function loadInternships(role) {
    const list = document.getElementById("internshipList");
    if (!list) return;

    try {
        const res = await fetch(INTERNSHIP_API);
        const data = await res.json();

        if (!data || data.length === 0) {
            list.innerHTML = `<p class="col-span-full text-center text-slate-500 uppercase font-black text-xs py-20">Zero Opportunities in Market</p>`;
            return;
        }

        // Mapped to match your DB columns: title, company, skills, location, duration
        list.innerHTML = data.map(i => `
            <div class="glass p-10 rounded-[3.5rem] border border-white/5 hover:border-cyan-500/30 transition-all group relative overflow-hidden">
                <div class="flex justify-between mb-6">
                     <span class="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-[9px] font-black rounded-full border border-cyan-500/20 uppercase tracking-widest">${i.duration || '6 Months'}</span>
                     <span class="text-slate-500 text-[9px] font-black uppercase tracking-widest">${i.location || 'Nagpur'}</span>
                </div>
                
                <h3 class="text-3xl font-black mb-4 tracking-tighter leading-none group-hover:text-cyan-400 transition-colors">${i.title || "Untitled Role"}</h3>
                <p class="text-slate-500 mb-8 font-bold text-[10px] uppercase tracking-widest">— ${i.company || "Anonymous Entity"}</p>
                
                <div class="bg-white/5 p-6 rounded-3xl mb-10 border border-white/5">
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Technical Stack</p>
                    <p class="text-xs text-slate-300 leading-relaxed font-medium">${i.skills || 'General Dev'}</p>
                </div>

                ${role === 'STUDENT' ? 
                    `<button onclick="apply(${i.id})" class="w-full py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all text-[10px] uppercase tracking-[0.2em]">Acquire Position</button>` : 
                    `<button onclick="viewApplicants(${i.id})" class="w-full py-5 glass border-green-500/30 text-green-400 font-black rounded-2xl hover:bg-green-500/10 transition-all text-[10px] uppercase tracking-[0.2em]">Audit Applicants</button>`
                }
            </div>
        `).join('');
    } catch (err) {
        console.error("Mainframe Sync Error:", err);
        list.innerHTML = `<p class="text-red-500 font-black text-center col-span-full uppercase">MAINFRAME SYNC FAILURE</p>`;
    }
}

function setupInternshipBroadcastHandler() {
    const form = document.getElementById("internshipForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const data = {
            title: document.getElementById("title").value,      
            company: document.getElementById("company").value, 
            location: document.getElementById("location").value,
            duration: document.getElementById("duration").value,
            skills: document.getElementById("skills").value
        };

        try {
            const res = await fetch(INTERNSHIP_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                alert("Protocol Success: Opportunity Published.");
                location.reload(); 
            } else {
                alert("Protocol Denied: Check mandatory fields.");
            }
        } catch (err) {
            alert("Broadcast Failure: Transmission Aborted.");
        }
    });
}
/**
 * ADD THIS TO THE BOTTOM OF YOUR EXISTING internship.js
 * This connects the "Acquire Position" button to your Java backend.
 */
async function apply(internshipId) {
    // 1. Verify User exists in local storage
    const user = JSON.parse(localStorage.getItem('scc_user'));
    
    if (!user || !user.id) {
        alert("SESSION ERROR: Please re-login.");
        return;
    }

    // 2. Identify the button that was clicked
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "LINKING...";
    btn.disabled = true;

    try {
        // 3. Match the Java Path: /api/internships/{id}/apply/{studentId}
        const response = await fetch(`${INTERNSHIP_API}/${internshipId}/apply/${user.id}`, {
            method: 'POST'
        });

        if (response.ok) {
            alert("APPLICATION SUCCESSFUL: Position Secured.");
            btn.innerText = "ACQUIRED";
            btn.style.color = "#4ade80"; // Green success text
            setTimeout(() => location.reload(), 2000);
        } else {
            // Handle duplicate application (400 Error)
            const msg = await response.text();
            alert(msg || "Identity Conflict: Already applied.");
            btn.innerText = originalText;
            btn.disabled = false;
        }
    } catch (error) {
        console.error("Transmission Failure:", error);
        alert("MAINFRAME OFFLINE: Connection Refused.");
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

/**
 * AUDIT APPLICANTS PROTOCOL
 * Fetches and displays students registered for a specific internship.
 */
async function viewApplicants(internshipId) {
    const modal = document.getElementById('applicantModal');
    const listContainer = document.getElementById('applicantList');
    
    if (!modal || !listContainer) return;

    // Show the modal and a loading message
    modal.classList.remove('hidden');
    listContainer.innerHTML = `<tr><td colspan="3" class="py-10 text-center text-cyan-400 animate-pulse uppercase text-[10px] font-black">Syncing Registry...</td></tr>`;

    try {
        // Fetch the applicants from the backend
        const res = await fetch(`${INTERNSHIP_API}/${internshipId}/students`);
        const applicants = await res.json();

        if (!applicants || applicants.length === 0) {
            listContainer.innerHTML = `<tr><td colspan="3" class="py-10 text-center text-slate-500 uppercase text-[10px] font-black">Empty Registry</td></tr>`;
            return;
        }

        // Render the list of students
        listContainer.innerHTML = applicants.map(student => `
            <tr class="group hover:bg-white/5 transition-all">
                <td class="py-6 font-bold text-white">${student.fullName || student.name || "Unknown"}</td>
                <td class="py-6 font-mono text-slate-400 text-xs">${student.email}</td>
                <td class="py-6 text-right">
                    <span class="text-[8px] font-black px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg uppercase">
                        ID: ${student.id}
                    </span>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        listContainer.innerHTML = `<tr><td colspan="3" class="py-10 text-center text-red-500 font-black uppercase text-[10px]">Registry Sync Failure</td></tr>`;
    }
}

function closeModal() {
    const modal = document.getElementById('applicantModal');
    if (modal) modal.classList.add('hidden');
}
/**
 * SCC DATA EXPORT PROTOCOL
 * Converts the current applicant table into a downloadable CSV file.
 */
function downloadCSV() {
    const rows = document.querySelectorAll("#applicantList tr");
    if (rows.length === 0 || rows[0].innerText.includes("Empty Registry")) {
        alert("No data available for export.");
        return;
    }

    let csvContent = "Name,Email,Node ID\n"; // Header row

    rows.forEach(row => {
        const cols = row.querySelectorAll("td");
        const name = cols[0].innerText;
        const email = cols[1].innerText;
        const id = cols[2].innerText.replace("ID: ", "").trim();
        csvContent += `${name},${email},${id}\n`;
    });

    // Create the download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Applicants_Registry_${new Date().getTime()}.csv`);
    a.click();
}
async function applyForInternship(internshipId) {
    const user = JSON.parse(localStorage.getItem('scc_user')); //
    
    if (!user || !user.id) {
        alert("PROTOCOL ERROR: Identify Node Not Found.");
        return;
    }

    try {
        // This targets the internship_registrations table in your DB
        const response = await fetch(`/api/internships/${internshipId}/apply/${user.id}`, {
            method: 'POST'
        });

        if (response.ok) {
            alert("APPLICATION SECURED: Profile transmitted to corporate node.");
            location.reload(); // Refresh to show "Applied" status
        }
    } catch (error) {
        console.error("Link Failure:", error);
    }
}