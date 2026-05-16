/**
 * SCC EXECUTIVE TALENT SUMMARY v1.0
 * Professional Acquisition Report
 */
function generateTalentReport(studentData) {
    const reportWindow = window.open('', '_blank');
    const date = new Date().toLocaleDateString('en-GB');

    const reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>SCC_EXECUTIVE_SUMMARY_${studentData.name}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
                body { font-family: 'Inter', sans-serif; color: #0f172a; }
                .chip { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 10px; font-size: 10px; font-weight: 900; text-transform: uppercase; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body class="p-12 bg-gray-50">
            <div class="max-w-4xl mx-auto bg-white p-12 shadow-sm border border-gray-100 rounded-sm">
                
                <header class="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-10">
                    <div>
                        <h1 class="text-4xl font-black uppercase tracking-tighter">${studentData.name}</h1>
                        <p class="text-cyan-600 font-bold uppercase tracking-widest text-xs mt-1">${studentData.college}</p>
                        <p class="text-slate-400 text-xs mt-1">${studentData.email}</p>
                    </div>
                    <div class="text-right">
                        <div class="bg-slate-900 text-white px-4 py-2 rounded-lg">
                            <p class="text-[8px] font-black uppercase tracking-widest opacity-60">Talent Score</p>
                            <p class="text-xl font-black italic">${studentData.xp} XP</p>
                        </div>
                    </div>
                </header>

                <div class="grid grid-cols-3 gap-12 mb-12">
                    <div class="col-span-2">
                        <h2 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 italic">Audited Competencies</h2>
                        <div class="flex flex-wrap gap-2">
                            ${studentData.skills.map(skill => `<span class="chip">${skill}</span>`).join('')}
                        </div>
                        
                        <h2 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-10 mb-4 italic">Executive Summary</h2>
                        <p class="text-sm leading-relaxed text-slate-600">${studentData.bio}</p>
                    </div>

                    <div class="col-span-1 space-y-8">
                        <div>
                            <h2 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 italic">Verification</h2>
                            <div class="p-4 bg-slate-50 border-l-4 border-cyan-500 rounded-r-xl">
                                <p class="text-[9px] font-black uppercase text-slate-400">Status</p>
                                <p class="text-xs font-black text-slate-900 uppercase">SCC Mainframe Verified</p>
                            </div>
                        </div>
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=VERIFY-${studentData.id}" class="w-20 h-20 opacity-80">
                    </div>
                </div>

                <div class="mb-12">
                    <h2 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 italic">Recent Verified Achievements</h2>
                    <div class="space-y-3">
                        ${studentData.certs.map(cert => `
                            <div class="flex justify-between items-center p-4 border border-gray-100 rounded-xl">
                                <div>
                                    <p class="text-xs font-black uppercase">${cert.task}</p>
                                    <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Role: ${cert.role}</p>
                                </div>
                                <p class="text-[10px] font-mono font-bold text-cyan-600">${cert.id}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <footer class="mt-20 pt-8 border-t border-gray-100 flex justify-between items-end">
                    <div class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                        Report Generated: ${date}<br>
                        Ref: SCC-EXEC-${studentData.id}
                    </div>
                    <div class="text-center">
                        <p class="italic text-2xl text-slate-800">Darshan Rathod</p>
                        <div class="w-32 h-px bg-slate-900 mx-auto my-1"></div>
                        <p class="text-[8px] font-black uppercase tracking-widest text-slate-900">Founder & CEO, SCC</p>
                    </div>
                </footer>
            </div>
            <div class="fixed bottom-10 left-1/2 -translate-x-1/2 no-print">
                <button onclick="window.print()" class="px-8 py-3 bg-slate-900 text-white font-black rounded-full uppercase text-[10px] tracking-widest shadow-2xl">Download Talent Summary</button>
            </div>
        </body>
        </html>
    `;
    reportWindow.document.write(reportHTML);
    reportWindow.document.close();
}