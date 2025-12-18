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

        const firstItem = slider.querySelector(':scope > *'); 
        if (!firstItem) return;

        // --- חישוב מעבר מדויק ---
        // לוקחים את הרווח שמוגדר ב-CSS (gap)
        const gap = parseFloat(window.getComputedStyle(slider).gap) || 0;
        // כמות הגלילה לפריט אחד היא הרווח של הכרטיסייה + הרווח שביניהן
        const singleItemScrollWidth = firstItem.offsetWidth + gap; 
    
        // הכפלה במספר הפריטים שרוצים להזיז בכל לחיצה (אחד-אחד = 1)
        const scrollAmount = singleItemScrollWidth * itemsPerScroll; 

        const checkButtonStatus = () => {
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            const currentScroll = slider.scrollLeft; 
            const threshold = 5;

            // בדיקת קצוות ב-RTL
            if (Math.abs(currentScroll) <= threshold) {
                prevBtn.disabled = true;
            } else {
                prevBtn.disabled = false;
            }

            if (Math.abs(currentScroll) >= (maxScroll - threshold)) {
                nextBtn.disabled = true;
            } else {
                nextBtn.disabled = false;
            }
        };
    
        checkButtonStatus(); 
        slider.addEventListener('scroll', checkButtonStatus);

        nextBtn.addEventListener('click', () => {
            // ב-RTL גלילה שמאלה היא בערך שלילי
            slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            // ב-RTL גלילה ימינה היא בערך חיובי
            slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    };

    // ------------------------------------------------------------------
    // --- הפעלת הסליידרים בדף הבית ---
    // ------------------------------------------------------------------

    // 1. הפעלת סליידר ההמלצות (מציג 2 כרטיסיות בכל פעם)
    initializeSlider('.testimonials-slider', '.prev-btn', '.next-btn', 1); 

    // 2. הפעלת סליידר הפורטפוליו (מציג כרטיסייה אחת של לפני/אחרי בכל פעם)
    initializeSlider('.portfolio-slider', '.portfolio-prev-btn', '.portfolio-next-btn', 1); 
});