/**
 * SCC BETA-TESTER PROTOCOL
 * Generates exclusive access nodes for the initial audit wave.
 */
function generateBetaInvite() {
    const inviteToken = `BETA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const inviteUrl = `${window.location.origin}/register.html?invite=${inviteToken}`;
    
    // Copy to clipboard with Executive Feedback
    navigator.clipboard.writeText(inviteUrl).then(() => {
        if (typeof triggerMainframeAlert === 'function') {
            triggerMainframeAlert("Beta Invite Node Copied: 10 Slots Active", "success");
        } else {
            alert("Beta Invite Link Copied to Clipboard!");
        }
        console.log(`%c SCC ADMIN: New Beta Node Generated [${inviteToken}]`, "color: #22d3ee; font-weight: bold;");
    });
}