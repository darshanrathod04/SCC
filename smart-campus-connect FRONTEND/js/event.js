
const EVENT_API = "https://scc-r1co.onrender.com/api/events";

const scc_user = JSON.parse(localStorage.getItem('scc_user'));


if (!scc_user) {
    window.location.href = "../auth/login.html";
}


document.addEventListener("DOMContentLoaded", async () => {
    
    const userRole = scc_user.role; 
    const userName = scc_user.fullName;
    const userEmail = scc_user.email;
    
   
    initializeUI(userName, userRole, userEmail);

   
    await loadEvents(userRole);

   
    setupBroadcastHandler();
});

function setupBroadcastHandler() {
    const form = document.getElementById('eventForm'); 
    if (!form) {
        console.error("FATAL: eventForm not found in DOM");
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
       
        const eventData = {
            title: document.getElementById('title').value,
            organizer: document.getElementById('organizer').value,
            date: document.getElementById('date').value,
            mode: document.getElementById('mode').value,
            eligibility: document.getElementById('eligibility').value,
            registrationLink: document.getElementById('regLink').value
        };

        try {
            const res = await fetch(EVENT_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData)
            });

            if (res.ok) {
                
                alert("CONCLAVE BROADCAST SUCCESSFUL.");
                location.reload(); 
            } else {
                const error = await res.text();
                alert("BROADCAST REJECTED: " + error);
            }
        } catch (err) {
            console.error("Broadcast failed:", err);
            alert("MAINFRAME OFFLINE");
        }
    });
}



function initializeUI(userName, userRole, userEmail) {
    const authContainer = document.getElementById('auth-status'); 
    const postFormSection = document.getElementById('postFormSection');
    const founderEmail = "darshanmrathod.2005@gmail.com";

   
    if (userName && authContainer) {
        authContainer.innerHTML = `
            <span class="text-purple-400 font-black mr-4 text-[10px] tracking-[0.3em] uppercase">Recognized: ${userName}</span>
            <button onclick="logoutUser()" class="px-5 py-2 glass border-white/5 text-slate-400 uppercase text-[9px] tracking-widest hover:text-red-400 transition-all rounded-xl">Terminate Session</button>
        `;
    }


    if (postFormSection) {
       
        if (userRole === 'ORGANIZER' || userRole === 'ADMIN' || userEmail === founderEmail) {
            postFormSection.style.display = 'block';
            console.log("> Access Granted: Post Form Initialized.");
        } else {
            postFormSection.style.display = 'none';
            console.log("> Access Restricted: Post Form Locked for Student.");
        }
    }
}



async function loadEvents(role) {
    const list = document.getElementById("eventList");
    if (!list) return;

    try {
        const res = await fetch(EVENT_API);
        const data = await res.json();

        if (!data || data.length === 0) {
            list.innerHTML = `<p class="col-span-full py-20 text-center text-slate-500 uppercase tracking-widest text-xs font-black">Zero Active Conclaves in Database</p>`;
            return;
        }

        
        list.innerHTML = data.map(e => renderEventCard(e, role)).join('');
    } catch (err) {
        console.error("Mainframe Fetch Error:", err);
        list.innerHTML = `<p class="text-red-500 font-black tracking-widest text-center col-span-full">CRITICAL: Mainframe Connection Refused</p>`;
    }
}



function renderEventCard(e, role) {
    const registrantCount = e.registeredStudents ? e.registeredStudents.length : 0;
    const statusColor = registrantCount > 5 ? 'text-cyan-400' : 'text-purple-400';

    // FIX: Use camelCase 'registrationLink' to match Java Entity
    let studentAction;
    if (e.registrationLink && e.registrationLink.trim() !== "") {
        // CASE: External Link Provided
        studentAction = `
            <a href="${e.registrationLink}" target="_blank" 
               class="w-full py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all text-[10px] uppercase tracking-[0.2em] shadow-cyan-500/20 text-center block">
               External Registration
            </a>`;
    } else {
        // CASE: Internal SCC Registration
        studentAction = `
            <button onclick="registerForEvent(event, ${e.id})" 
                    class="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all text-[10px] uppercase tracking-[0.2em] shadow-purple-500/20">
                Initialize Entry
            </button>`;
    }

    return `
    <div class="glass p-10 rounded-[3.5rem] border border-white/5 hover:border-purple-500/30 transition-all group relative overflow-hidden">
        <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/5 blur-3xl transition-all"></div>
        
        <div class="flex justify-between items-start mb-6">
             <span class="px-3 py-1 bg-purple-500/10 text-purple-400 text-[9px] font-black rounded-full border border-purple-500/20 uppercase tracking-widest">${e.mode || 'Online'}</span>
             
             <div class="text-right">
                <p class="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Node Connections</p>
                <p class="text-lg font-black ${statusColor} leading-none tracking-tighter">${registrantCount.toString().padStart(2, '0')}</p>
             </div>
        </div>

        <h3 class="text-3xl font-black mb-4 tracking-tighter leading-none group-hover:text-purple-400 transition-colors">${e.title}</h3>
        <p class="text-slate-500 mb-8 font-bold text-[10px] uppercase tracking-widest">— ${e.organizer}</p>
        
        <div class="bg-white/5 p-6 rounded-3xl mb-10 border border-white/5 relative overflow-hidden">
            <div class="absolute top-0 right-0 p-2 opacity-10"><i class="fas fa-microchip text-2xl"></i></div>
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Tech Specification</p>
            <p class="text-xs text-slate-300 font-medium">${e.eligibility || 'Open Architecture'}</p>
        </div>

        ${role === 'STUDENT' ? studentAction : 
            `<button onclick="viewApplicants(${e.id})" class="w-full py-5 glass border-cyan-500/30 text-cyan-400 font-black rounded-2xl hover:bg-cyan-500/10 transition-all text-[10px] uppercase tracking-[0.2em]">Audit Registry</button>`
        }
    </div>`;
}



function logoutUser() {
    localStorage.clear();
    window.location.href = '../auth/login.html';
}

async function registerForEvent(e, eventId) { // Added 'e'
    const user = JSON.parse(localStorage.getItem('scc_user'));
    
    if (!user || !user.id) {
        alert("SESSION ERROR: Please log in again.");
        return;
    }

    
    const btn = e.currentTarget || e.target; 
    const originalText = btn.innerText;
    btn.innerText = "LINKING...";
    btn.disabled = true;

    try {
        
        const response = await fetch(`${EVENT_API}/${eventId}/register/${user.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            pushNotification("PROTOCOL SUCCESS: Identity Registered & XP Awarded.", "success");
            btn.innerText = "ACCESS GRANTED";
            btn.style.background = "rgba(34, 197, 94, 0.2)"; 
            btn.style.color = "#4ade80";
            
            setTimeout(() => location.reload(), 2000);
        } else {
           
            const errorMsg = await response.text();
            pushNotification(errorMsg, "warning");
            btn.innerText = originalText;
            btn.disabled = false;
        }
    } catch (error) {
        console.error("Transmission Error:", error);
        pushNotification("MAINFRAME OFFLINE: Connection Refused.", "error");
        btn.innerText = originalText;
        btn.disabled = false;
    }
}
function closeModal() {
    const modal = document.getElementById('applicantModal');
    if (modal) modal.classList.add('hidden');
}


function downloadCSV(applicants, eventTitle) {
    if (!applicants || applicants.length === 0) return;

   
    const headers = ["Student Name", "Email Address", "Node ID"];
    
   
    const rows = applicants.map(s => [
        s.fullName,
        s.email,
        s.id || 'N/A'
    ]);

  
    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(r => r.join(",")).join("\n");

 
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SCC_Registry_${eventTitle.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


let currentActiveApplicants = [];

async function viewApplicants(eventId) {
    const modal = document.getElementById('applicantModal');
    const listContainer = document.getElementById('applicantList');
    const exportBtn = document.getElementById('exportCsvBtn');
    
    if (!modal || !listContainer) return;

    modal.classList.remove('hidden');
    listContainer.innerHTML = `<tr><td colspan="3" class="py-10 text-center text-cyan-400 animate-pulse uppercase text-[10px] font-black">Syncing...</td></tr>`;

    try {
        const res = await fetch(`${EVENT_API}/${eventId}/students`);
        const applicants = await res.json();
        currentActiveApplicants = applicants;

        if (!applicants || applicants.length === 0) {
            listContainer.innerHTML = `<tr><td colspan="3" class="py-10 text-center text-slate-500 uppercase text-[10px] font-black">Empty Registry</td></tr>`;
            exportBtn.classList.add('hidden');
            return;
        }

       
        exportBtn.classList.remove('hidden');
        exportBtn.onclick = () => downloadCSV(applicants, "Event_" + eventId);

       

listContainer.innerHTML = applicants.map(student => {
    if (!student) return ''; 

    const displayName = student.fullName || "Name Not Set";
    const displayEmail = student.email || "No Email";
    const studentId = student.id || "N/A";

    return `
        <tr class="group hover:bg-white/5 transition-all">
            <td class="py-6 font-bold text-white">${displayName}</td>
            <td class="py-6 font-mono text-slate-400 text-xs">${displayEmail}</td>
            <td class="py-6 text-right">
                <span class="text-[8px] font-black px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg uppercase">
                    ID: ${studentId}
                </span>
            </td>
        </tr>
    `;
}).join('');

    } catch (err) {
        listContainer.innerHTML = `<tr><td colspan="3" class="py-10 text-center text-red-500 font-black uppercase text-[10px]">Registry Sync Failure</td></tr>`;
    }
}



function downloadEventCSV() {

    const rows = document.querySelectorAll("#applicantList tr");
    
    if (rows.length === 0 || rows[0].innerText.includes("Empty") || rows[0].innerText.includes("Syncing")) {
        alert("Registry is empty or still loading.");
        return;
    }

    let csvContent = "Attendee Name,Email,Student ID\n";

    rows.forEach(row => {
        const cols = row.querySelectorAll("td");
        if (cols.length >= 2) {
            const name = cols[0].innerText.trim();
            const email = cols[1].innerText.trim();
            
            const id = cols[2] ? cols[2].innerText.replace("ID: ", "").trim() : "N/A";
            csvContent += `"${name}","${email}","${id}"\n`;
        }
    });

   
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Event_Attendee_List_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


async function syncNodeData() {
    const user = JSON.parse(localStorage.getItem('scc_user'));
    if (!user || !user.id) return;

    try {
        const res = await fetch(`/api/wallet/${user.id}/sync`);
        if (res.ok) {
            const freshData = await res.json();
            
            localStorage.setItem('scc_user', JSON.stringify(freshData));
            
            initializeUI(freshData.fullName, freshData.role, freshData.email);
        }
    } catch (err) {
        console.error("Node Sync Failed:", err);
    }
}