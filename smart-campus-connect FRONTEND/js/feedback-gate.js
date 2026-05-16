/**
 * FEEDBACK GATE PROTOCOL
 * Ensures only active beta users provide optimization data.
 */
function checkFeedbackEligibility() {
    const registrationDate = localStorage.getItem('scc_reg_date'); // Stored at registration
    if (!registrationDate) return;

    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    const now = new Date().getTime();

    if (now - new Date(registrationDate).getTime() > sevenDaysInMs) {
        const alreadySubmitted = localStorage.getItem('scc_feedback_submitted');
        if (!alreadySubmitted) {
            document.getElementById('feedbackModal').classList.remove('hidden');
        }
    }
}