/**
 * SCC NOTIFICATION PROTOCOL v1.0
 * Real-time event monitoring and visual alerts.
 */

function triggerMainframeAlert(message, type = 'info') {
    const alertId = 'alert-' + Date.now();
    const container = document.getElementById('notification-dock');
    
    if (!container) return;

    const colors = {
        info: 'border-cyan-500/30 text-cyan-400',
        success: 'border-green-500/30 text-green-400',
        warning: 'border-yellow-500/30 text-yellow-400'
    };

    const alertHTML = `
        <div id="${alertId}" class="glass p-4 rounded-xl border ${colors[type]} mb-3 flex items-center gap-4 animate-slide-in shadow-2xl">
            <div class="w-2 h-2 bg-current rounded-full animate-pulse"></div>
            <p class="text-[10px] font-black uppercase tracking-widest leading-none">${message}</p>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', alertHTML);

    // Auto-terminate alert after 5 seconds
    setTimeout(() => {
        const el = document.getElementById(alertId);
        if (el) {
            el.classList.add('opacity-0', 'translate-x-10');
            setTimeout(() => el.remove(), 500);
        }
    }, 5000);
}

// Simulated real-time triggers
document.addEventListener("DOMContentLoaded", () => {
    // Alert when startup views profile (Simulated)
    setTimeout(() => {
        triggerMainframeAlert("Partner Startup: Viewing Your Identity Node", "info");
    }, 8000);

    // Alert for new internship
    setTimeout(() => {
        triggerMainframeAlert("Mainframe Update: New Internship Broadcasted", "success");
    }, 15000);
});
async function executeBroadcast() {
    const subject = document.getElementById('broadcastSubject').value;
    const message = document.getElementById('broadcastMessage').value;

    if (!subject || !message) {
        alert("CRITICAL ERROR: Broadcast payload cannot be empty.");
        return;
    }

    try {
        const response = await fetch('https://scc-r1co.onrender.com/api/admin/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                subject: subject,
                message: message,
                timestamp: new Date().toISOString()
            })
        });

        if (response.ok) {
            alert("BROADCAST INITIALIZED: Executive Directive transmitted to all nodes.");
            document.getElementById('broadcastSubject').value = '';
            document.getElementById('broadcastMessage').value = '';
        }
    } catch (err) {
        console.error("Broadcast transmission failed:", err);
    }
}