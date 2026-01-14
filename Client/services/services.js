document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            
            /* --- Button Logic Fix --- */
            /* Check if the click target is the link button to prevent conflicts with the flip animation */
            const linkBtn = e.target.closest('.details-link');
            
            if (linkBtn) {
                e.preventDefault(); 
                e.stopPropagation(); // Stops the click from triggering the card flip
                
                const targetUrl = linkBtn.getAttribute('href');
                if (targetUrl) {
                    window.location.href = targetUrl; // Manually trigger navigation
                }
                return; 
            }

            /* --- Flip Logic (Mobile/Tablet) --- */
            /* Toggles the 'flipped' class to reveal the back side on touch devices */
            const isFlipped = this.classList.contains('flipped');

            // Close all other cards before opening the selected one
            cards.forEach(c => c.classList.remove('flipped'));

            if (!isFlipped) {
                this.classList.add('flipped');
            }
        });
    });

    /* --- Outside Click Detection --- */
    /* Closes any open cards when the user clicks elsewhere on the page */
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.service-card')) {
            cards.forEach(c => c.classList.remove('flipped'));
        }
    });
});