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
    
    // ניקוי הנתיב הנוכחי: '/products/item1.html' הופך ל- 'products/item1.html'
    const cleanedCurrentPath = currentPath.replace(/^\//, '').toLowerCase();

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').replace(/^\//, '').toLowerCase();
        
        // 1. איפוס: ודא שאין active class שנשאר מהטענה קודמת (למרות שה-HTML מוזרק מחדש)
        link.classList.remove('active');
        
        let isLinkActive = false;

        // בדיקה 1: התאמה מלאה של הנתיב (למשל: 'about.html' == 'about.html')
        if (cleanedCurrentPath === linkPath) {
            isLinkActive = true;
        } 
        // בדיקה 2: טיפול בדף הבית (Home)
        else if (cleanedCurrentPath === '' && (linkPath === 'index.html' || linkPath === '')) {
            isLinkActive = true;
        }
        // בדיקה 3: התאמה סקציונלית (עבור קטלוג/דרופדאון)
        // אם הנתיב הנוכחי מתחיל בנתיב הקישור. לדוגמה: 'products/item1.html' מתחיל ב- 'products'.
        else if (linkPath.length > 1 && cleanedCurrentPath.startsWith(linkPath)) {
            isLinkActive = true;
        }

        if (isLinkActive) {
            link.classList.add('active');
        }

        // 4. לוגיקת הדרופדאון (הדלקת ההורה) - נשארת כפי שהייתה, כי היא תלויה בבדיקות 1-3.
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