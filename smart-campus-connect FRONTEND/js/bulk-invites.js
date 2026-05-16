/**
 * SCC BULK INVITE PROTOCOL
 * Generates personalized access nodes for the Founding 10.
 */
const betaGroup = [
    { name: "Rahul Sharma", email: "rahul@vnit.edu", college: "VNIT Nagpur" },
    { name: "Priya Patil", email: "priya@ycce.edu", college: "YCCE Nagpur" },
    { name: "Amit Verma", email: "amit@rknec.edu", college: "RCOEM" },
    // ... add all 10 students here
];

function generateBulkInvites() {
    const baseUrl = window.location.origin + "/register.html";
    const inviteToken = "BETA-2025-NAGPUR"; // Consistent token for the first wave

    console.log("%c SCC MAINFRAME: GENERATING ENCRYPTED LINKS ", "background: #020617; color: #22d3ee; font-weight: bold; padding: 10px;");

    betaGroup.forEach(student => {
        const params = new URLSearchParams({
            invite: inviteToken,
            name: student.name,
            email: student.email,
            college: student.college
        });

        const personalizedLink = `${baseUrl}?${params.toString()}`;
        
        console.log(`%c NODE: ${student.name}`, "color: white; font-weight: bold;");
        console.log(`Link: ${personalizedLink}`);
        console.log("--------------------------------------------------");
    });
}