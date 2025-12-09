/**
 * aboutUs.js
 * מטפל בלוגיקה הספציפית לדף אודות:
 * 1. ניהול לשוניות (Tabs) למעבר בין קהלי יעד ב-FAQ.
 * 2. ניהול אקורדיון (Accordion) לפתיחה וסגירה של שאלות.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ###################################################################
    // 1. לוגיקה של לשוניות (Tabs) - מעבר בין קטגוריות FAQ
    // ###################################################################

    const tabButtons = document.querySelectorAll('.faq-tabs .tab-button');
    const accordionContainers = document.querySelectorAll('.accordion-container');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target'); // private, committees, management

            // 1. הסרת הקלאס 'active' מכל הכפתורים
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // 2. הסתרת כל תוכן האקורדיון באמצעות הקלאס 'hidden'
            accordionContainers.forEach(container => {
                container.classList.remove('active');
                container.classList.add('hidden'); // ה-CSS מטפל בהסתרה חלקה
            });

            // 3. הוספת הקלאס 'active' לכפתור שנלחץ
            button.classList.add('active');

            // 4. הצגת ה-accordion-container המתאים (והסרת ה-hidden)
            const targetContainer = document.getElementById(targetId);
            if (targetContainer) {
                targetContainer.classList.remove('hidden'); 
                targetContainer.classList.add('active');
            }
        });
    });


    // ###################################################################
    // 2. לוגיקה של אקורדיון (Accordion) - פתיחה וסגירה של תשובות
    // ###################################################################

    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling; // div.accordion-content
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            
            // מצא את ה-accordion-container הנוכחי כדי לסגור אחים
            const currentContainer = header.closest('.accordion-container');
            const siblingHeaders = currentContainer.querySelectorAll('.accordion-header');

            // סגירת כל האקורדיונים האחרים באותו קונטיינר
            siblingHeaders.forEach(otherHeader => {
                const otherContent = otherHeader.nextElementSibling;
                if (otherHeader !== header && otherHeader.getAttribute('aria-expanded') === 'true') {
                    otherHeader.setAttribute('aria-expanded', 'false');
                    otherContent.style.maxHeight = null; // סגירה
                }
            });

            // פתיחה או סגירה של האקורדיון הנוכחי
            if (isExpanded) {
                // סגירה
                header.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null;
            } else {
                // פתיחה
                header.setAttribute('aria-expanded', 'true');
                // הגדרת גובה ל-maxHeight שווה לגובה התוכן (כולל Padding)
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
});