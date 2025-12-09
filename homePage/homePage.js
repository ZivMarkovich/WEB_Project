document.addEventListener('DOMContentLoaded', () => {
    
    // --- פונקציה גנרית לאתחול כל סליידר ---
    /* * sliderSelector: מחלקת ה-div של משטח הגלילה (e.g., '.testimonials-slider')
     * prevBtnSelector: מחלקת כפתור הקודם (e.g., '.prev-btn')
     * nextBtnSelector: מחלקת כפתור הבא (e.g., '.next-btn')
     * itemsPerScroll: כמה פריטים לגלול בכל לחיצה (1 עבור Portfolio, 2 עבור Testimonials)
     */
    const initializeSlider = (sliderSelector, prevBtnSelector, nextBtnSelector, itemsPerScroll) => {
        const slider = document.querySelector(sliderSelector);
        const prevBtn = document.querySelector(prevBtnSelector);
        const nextBtn = document.querySelector(nextBtnSelector);

        if (!slider || !prevBtn || !nextBtn) return;

        // חישוב המעבר: רוחב האלמנט הנראה (clientWidth) חלקי מספר הפריטים הנראים
        // מכיוון שמשתמשים ב-flex: 0 0 X%, נשתמש ברוחב הכרטיסייה הראשונה
        const firstItem = slider.querySelector(':scope > *'); // לוקח את האלמנט הילד הראשון
        if (!firstItem) return;

        // חישוב רוחב של פריט אחד כולל המרווח
        const itemComputedStyle = window.getComputedStyle(firstItem);
        const itemWidth = firstItem.offsetWidth;
        const itemMarginLeft = parseFloat(itemComputedStyle.marginLeft || 0);
        const singleItemScrollWidth = itemWidth + itemMarginLeft; 
        
        // כמות הגלילה הכוללת: רוחב פריט בודד * מספר הפריטים לגלילה
        const scrollAmount = singleItemScrollWidth * itemsPerScroll; 

        // --- לוגיקה לבדיקת מצב כפתור (RTL) ---
        const checkButtonStatus = () => {
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            const currentScroll = slider.scrollLeft; 
            const threshold = 5; // סף בטחון לטעויות עיגול

            // 1. כפתור קודם (PREV / ימין): מושבת אם אנחנו במיקום ההתחלה (קרוב ל-0).
            if (currentScroll >= -threshold && currentScroll <= threshold) {
                 prevBtn.disabled = true;
            } else {
                 prevBtn.disabled = false;
            }

            // 2. כפתור הבא (NEXT / שמאל): מושבת אם הגענו לקצה השמאלי.
            // בודקים אם ההיסט השלילי קרוב ל-(maxScroll).
            if (currentScroll <= -(maxScroll - threshold)) {
                nextBtn.disabled = true;
            } else {
                nextBtn.disabled = false;
            }
        };
        
        // --- איתחול והוספת מאזינים ---
        
        // 1. קביעת מצב התחלתי
        checkButtonStatus(); 

        // 2. הוספת מאזין גלילה רציף (מעדכן את הכפתורים גם בגלילת מגע)
        slider.addEventListener('scroll', checkButtonStatus);

        // 3. פונקציות מעבר 
        nextBtn.addEventListener('click', () => {
            // מעבר שמאלה (ערך שלילי)
            slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            // מעבר ימינה (ערך חיובי)
            slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    };

    // ------------------------------------------------------------------
    // --- הפעלת הסליידרים בדף הבית ---
    // ------------------------------------------------------------------

    // 1. הפעלת סליידר ההמלצות (מציג 2 כרטיסיות בכל פעם)
    initializeSlider('.testimonials-slider', '.prev-btn', '.next-btn', 2); 

    // 2. הפעלת סליידר הפורטפוליו (מציג כרטיסייה אחת של לפני/אחרי בכל פעם)
    initializeSlider('.portfolio-slider', '.portfolio-prev-btn', '.portfolio-next-btn', 1); 
});