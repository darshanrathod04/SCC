/**
 * SCC DATA BRIDGE
 * Synchronizes Student Commits to Admin Audit Stream
 */

async function syncSkillToAudit(skillData) {
    try {
        // 1. SEND TO BACKEND (Spring Boot API)
        const response = await fetch("https://scc-r1co.onrender.com/api/audit/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                studentId: localStorage.getItem('userId'),
                studentName: localStorage.getItem('userName'),
                taskName: skillData.name,
                role: skillData.role || "Developer",
                status: "PENDING",
                timestamp: new Date().toISOString()
            })
        });

        if (response.ok) {
            console.log("> Bridge Sync: Task moved to Audit Stream.");
            triggerMainframeAlert("Task Synced with Admin for Audit", "success");
        }
    } catch (error) {
        console.warn("> Bridge Offline: Using LocalStorage for Mock Audit.");
        // Fallback: Store in a 'pendingAudits' array for the Admin page to read
        let audits = JSON.parse(localStorage.getItem('pendingAudits') || "[]");
        audits.push(skillData);
        localStorage.setItem('pendingAudits', JSON.stringify(audits));
    }
}