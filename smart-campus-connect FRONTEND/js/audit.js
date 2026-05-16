/**
 * SCC AUDIT PROTOCOL
 * Verifies submissions and triggers certificate issuance.
 */
function approveTask(studentName, taskName) {
    console.log(`%c > SCC AUDIT: Committing approval for ${studentName}`, "color: #22c55e; font-weight: bold;");
    
    // 1. Notify the student
    if (typeof triggerMainframeAlert === 'function') {
        triggerMainframeAlert(`Certificate Issued: ${taskName}`, "success");
    }

    // 2. Trigger the Certificate Engine (for the student node)
    alert(`Audit Success. Certificate generated for ${studentName}.`);
    
    // 3. Update the UI
    location.reload();
}