async function fetchLeaderboard() {
    try {
        const response = await fetch('https://scc-r1co.onrender.com/api/students/leaderboard');
        const allUsers = await response.json();
        
        // 1. Filter to show ONLY students (removes Admin/Organizer)
        const studentsOnly = allUsers.filter(user => user.role === 'STUDENT');
        
        const container = document.getElementById('leaderboardList');
        if (!container) return; // Safety check
        
        container.innerHTML = studentsOnly.map((student, index) => {
            const rank = index + 1;
            const isCertified = (student.experiencePoints || student.xp) >= 1000; 

            return `
                <div class="flex items-center justify-between p-5 bg-white/5 rounded-[2rem] border border-white/5 hover:border-cyan-500/30 transition-all mb-3 group">
                    <div class="flex items-center gap-5">
                        <div class="text-lg font-black italic ${rank <= 3 ? 'text-cyan-400' : 'text-slate-600'}">
                            #${rank.toString().padStart(2, '0')}
                        </div>
                        <div class="relative">
                            <div class="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/50 transition-all">
                                <span class="text-sm font-black uppercase text-white">${student.fullName.charAt(0)}</span>
                            </div>
                            ${isCertified ? `
                                <div class="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full border-2 border-[#020617] flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                    <i class="fas fa-check text-[8px] text-slate-950"></i>
                                </div>
                            ` : ''}
                        </div>
                        <div>
                            <h4 class="text-xs font-black uppercase tracking-tight text-white">${student.fullName}</h4>
                            <div class="flex gap-2 items-center mt-1">
                                <p class="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Student Node</p>
                                ${isCertified ? '<span class="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 text-[6px] font-black rounded uppercase">Certified</span>' : ''}
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm font-black text-cyan-400 italic">${(student.experiencePoints || student.xp || 0).toLocaleString()} XP</div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error("> Leaderboard Sync Interrupted:", err);
    }
}

document.addEventListener('DOMContentLoaded', fetchLeaderboard);