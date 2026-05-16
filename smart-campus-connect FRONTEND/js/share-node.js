/**
 * SCC SOCIAL SYNC NODE v1.0
 * Generates verified public links for professional networking.
 */
function shareVerifiedProfile() {
    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    
    // In a real production environment, this would be your live domain
    const profileUrl = `https://scc-mainframe.edu/profile/${userId}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(profileUrl).then(() => {
        const btn = document.getElementById('shareBtn');
        const originalText = btn.innerHTML;
        
        // Visual Feedback: Professional Sync Glow
        btn.innerHTML = `<i class="fas fa-check-double mr-2"></i> Link Synchronized`;
        btn.classList.add('text-green-400', 'border-green-400/50');
        
        console.log(`%c SCC IDENTITY SYNC: ${userName}'s profile is now public.`, "color: #06b6d4; font-weight: bold;");

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('text-green-400', 'border-green-400/50');
        }, 3000);
    });
}