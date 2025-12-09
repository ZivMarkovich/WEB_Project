/**
 * global.js
 * מטפל בטעינה של רכיבי ההאדר והפוטר הגלובליים (Client-Side Includes).
 */

document.addEventListener('DOMContentLoaded', () => {
    // נתיבים לקבצי ה-HTML של הקומפוננטות
    // הנחה: הקבצים נמצאים בתיקיית components/ בשורש האתר
    const HEADER_PATH = '/header.html'; 
    const FOOTER_PATH = '/footer.html';
    
    // מזהה את המיקום הנוכחי של הדף כדי להדליק את הקישור הפעיל בתפריט
    const currentPath = window.location.pathname.toLowerCase();

    // פונקציה לשליפת והזרקת קוד HTML
    async function loadComponent(placeholderId, filePath) {
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            try {
                // שליפת התוכן
                const response = await fetch(filePath);
                
                if (!response.ok) {
                    throw new Error(`Failed to load ${filePath}. Status: ${response.status}`);
                }
                
                const htmlContent = await response.text();
                
                // הזרקת התוכן ל-placeholder
                placeholder.innerHTML = htmlContent;

                // אם זה ההאדר, נפעיל את לוגיקת הקישור הפעיל
                if (placeholderId === 'header-placeholder') {
                    highlightActiveLink(placeholder, currentPath);
                }

            } catch (error) {
                console.error(`שגיאה בטעינת הקומפוננטה: ${filePath}`, error);
                // רשום הודעת שגיאה ברורה ל-Placeholder
                placeholder.innerHTML = `<div style="color: red; padding: 20px; text-align: center;">שגיאה: לא ניתן לטעון את ${filePath}. ודא שהקובץ קיים בנתיב הנכון.</div>`;
            }
        }
    }

    // פונקציה להדלקת הקישור הפעיל (active) בתפריט הראשי
    function highlightActiveLink(headerElement, currentPath) {
        const navLinks = headerElement.querySelectorAll('.main-nav a');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href').toLowerCase();
            
            // בדיקה אם נתיב הקישור זהה או נמצא בנתיב הנוכחי (למשל /about תואם ל /about.html)
            // נשתמש ב-includes כדי להתאים גם לקישורי קטלוג פנימיים (/plants, /tools)
            if (currentPath.includes(linkPath) && linkPath !== '/') {
                 link.classList.add('active');
            } else if (currentPath === '/' && linkPath.includes('home')) {
                // טיפול מיוחד בדף הבית (אם הנתיב הוא '/')
                link.classList.add('active');
            }
             
            // אם הקישור הפעיל הוא בתוך תפריט נגלל (כמו plants), נדליק גם את כפתור הקטלוג הראשי.
            if (link.closest('.dropdown-menu') && link.classList.contains('active')) {
                const dropdownToggle = link.closest('.dropdown').querySelector('.dropdown > a');
                if (dropdownToggle) {
                    dropdownToggle.classList.add('active');
                }
            }
        });
    }

    // טעינת ההאדר
    loadComponent('header-placeholder', HEADER_PATH);
    
    // טעינת הפוטר
    loadComponent('footer-placeholder', FOOTER_PATH);
});