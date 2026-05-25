document.addEventListener("DOMContentLoaded", () => {
    const auditList = document.getElementById('auditList');
    
    // FETCH PENDING AUDITS
    async function loadAuditStream() {
        // Replace with your real API call: fetch("https://scc-r1co.onrender.com/api/audit/pending")
        const pending = JSON.parse(localStorage.getItem('pendingAudits') || "[]");
        
        if (pending.length === 0) {
            auditList.innerHTML = `<p class="text-slate-600 uppercase text-[10px] tracking-widest text-center py-20">Audit Stream Empty: All Nodes Validated</p>`;
            return;
        }

        auditList.innerHTML = pending.map((task, index) => `
            <div class="glass p-8 rounded-[2.5rem] border-white/5 flex items-center justify-between group">
                <div class="flex items-center gap-8">
                    <div class="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400 border border-white/10">
                        <i class="fas fa-code-branch"></i>
                    </div>
                    <div>
                        <h4 class="text-lg font-black uppercase tracking-tight">${task.studentName || 'Darshan Rathod'}</h4>
                        <p class="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mt-1">Task: ${task.name}</p>
                    </div>
                </div>
                <button onclick="approveTask('${task.studentName}', '${task.name}', 'Lead')" 
                        class="px-10 py-3 bg-cyan-500 text-slate-950 font-black rounded-xl text-[9px] uppercase hover:bg-white transition-all">
                    Approve & Issue
                </button>
            </div>
        `).join('');
    }

    loadAuditStream();
});