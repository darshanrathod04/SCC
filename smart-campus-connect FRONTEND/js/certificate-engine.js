/**
 * SCC ELITE CREDENTIAL ENGINE v4.0
 * Modern | Industrial | High-Contrast
 */
async function generateEliteCertificate(taskData = { 
    taskName: "Advanced Backend Logic", 
    role: "System Architect" 
}) {
    const user = JSON.parse(localStorage.getItem('scc_user'));
    const userName = user ? user.fullName : "AUTHORIZED NODE";
    const certId = `SCC-SYS-${Date.now().toString().slice(-8)}`;
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const certWindow = window.open('', '_blank');
    const certHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>MAINFRAME_CREDENTIAL_${certId}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;700&family=Syncopate:wght@400;700&display=swap');
                body { background: #020617; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: 'Space Grotesk', sans-serif; }
                
                .cert-outer {
                    width: 1100px;
                    height: 750px;
                    background: #020617;
                    position: relative;
                    border: 1px solid rgba(34, 211, 238, 0.2);
                    padding: 2px;
                    overflow: hidden;
                }
                
                /* High-tech background grid */
                .grid-bg {
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px);
                    background-size: 30px 30px;
                }

                .corner-accent {
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    border: 4px solid #06b6d4;
                }

                .signature-font { font-family: 'Syncopate', sans-serif; letter-spacing: 2px; }
            </style>
        </head>
        <body>
            <div class="cert-outer shadow-[0_0_100px_rgba(6,182,212,0.1)]">
                <div class="grid-bg"></div>
                
                <div class="corner-accent top-0 left-0 border-r-0 border-b-0"></div>
                <div class="corner-accent bottom-0 right-0 border-l-0 border-t-0 opacity-20"></div>

                <div class="relative h-full p-20 flex flex-col justify-between">
                    
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="flex items-center gap-3 mb-2">
                                <div class="w-8 h-8 bg-cyan-500"></div>
                                <h1 class="text-2xl font-black uppercase tracking-tighter text-white">SCC<span class="text-cyan-500">.</span>MAINFRAME</h1>
                            </div>
                            <p class="text-[9px] text-cyan-500/50 font-bold uppercase tracking-[0.5em]">Nagpur Operational Sector</p>
                        </div>
                        <div class="text-right">
                            <p class="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">Verification Hash</p>
                            <p class="text-xs font-mono text-cyan-500">${certId}</p>
                        </div>
                    </div>

                    <div class="text-center">
                        <p class="text-xs font-bold text-slate-500 uppercase tracking-[1em] mb-12">Professional Competency Validation</p>
                        <h2 class="text-7xl font-light text-white uppercase tracking-tighter mb-4">
                            ${userName}
                        </h2>
                        <div class="w-24 h-1 bg-cyan-500 mx-auto mb-10"></div>
                        
                        <p class="max-w-2xl mx-auto text-slate-400 leading-relaxed text-lg">
                            The Smart Campus Executive Council hereby validates this node for exceptional performance in 
                            <span class="text-white font-bold">${taskData.taskName}</span>. 
                            Candidate is recognized as a certified <span class="text-cyan-500 font-bold">${taskData.role}</span>.
                        </p>
                    </div>

                    <div class="flex justify-between items-end">
                        <div class="flex items-center gap-6">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VERIFY-${certId}&color=06b6d4&bgcolor=020617" class="w-20 h-20 opacity-80 border border-cyan-500/20 p-1">
                            <div>
                                <p class="text-[9px] text-slate-500 uppercase font-black mb-1">Timestamp</p>
                                <p class="text-sm font-bold text-white">${date}</p>
                            </div>
                        </div>

                        <div class="text-center">
                            <p class="signature-font text-xs text-white uppercase mb-2">Darshan Rathod</p>
                            <div class="w-48 h-[1px] bg-slate-800 mb-2"></div>
                            <p class="text-[9px] text-slate-500 uppercase font-black tracking-widest">Chief Architecture Officer</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="fixed bottom-8 flex gap-4">
                <button onclick="window.print()" class="px-8 py-3 bg-white text-slate-950 font-bold uppercase text-[10px] tracking-widest hover:bg-cyan-500 transition-all">Export PDF</button>
                <button onclick="window.close()" class="px-8 py-3 border border-white/10 text-white font-bold uppercase text-[10px] tracking-widest">Close</button>
            </div>
        </body>
        </html>
    `;
    certWindow.document.write(certHTML);
    certWindow.document.close();
}

function syncSignature() {
    const fileInput = document.getElementById('sigUpload');
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Save to localStorage so certificate-engine.js can access it
            localStorage.setItem('founderSignature', e.target.result);
            document.getElementById('currentSignature').src = e.target.result;
            
            // Visual Handshake
            if (typeof triggerMainframeAlert === 'function') {
                triggerMainframeAlert("Executive Signature Synchronized", "success");
            }
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}