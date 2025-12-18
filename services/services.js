document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            
            // --- תיקון הבעיה של הכפתור ---
            // בדיקה: האם הלחיצה קרתה על הכפתור (או על הטקסט שבתוכו)?
            const linkBtn = e.target.closest('.details-link');
            
            if (linkBtn) {
                // מונע מהדפדפן להתבלבל
                e.preventDefault(); 
                e.stopPropagation();
                
                // לוקח את הכתובת מהכפתור ומעביר את המשתמש בכוח
                const targetUrl = linkBtn.getAttribute('href');
                if (targetUrl) {
                    window.location.href = targetUrl;
                }
                return; // יוצא מהפונקציה, סיימנו כאן
            }
            // -----------------------------

            // מכאן: לוגיקה של היפוך כרטיסיות (למובייל וטאבלט)
            
            // האם הכרטיסייה הזו כבר פתוחה?
            const isFlipped = this.classList.contains('flipped');

            // קודם כל - סגור את כולם
            cards.forEach(c => c.classList.remove('flipped'));

            // אם לחצנו על כרטיסייה סגורה - תפתח אותה
            // (אם לחצנו על פתוחה - היא כבר נסגרה בשורה למעלה, אז לא עושים כלום)
            if (!isFlipped) {
                this.classList.add('flipped');
            }
        });
    });

    // סגירת כרטיסייה כשלוחצים מחוץ לכרטיסיות (לניקיון)
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.service-card')) {
            cards.forEach(c => c.classList.remove('flipped'));
        }
    });
});