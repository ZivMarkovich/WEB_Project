document.addEventListener('DOMContentLoaded', () => {
    
    // Generic slider initializer used by multiple sections on the page
    const initializeSlider = (sliderSelector, prevBtnSelector, nextBtnSelector, itemsPerScroll) => {
        const slider = document.querySelector(sliderSelector);
        const prevBtn = document.querySelector(prevBtnSelector);
        const nextBtn = document.querySelector(nextBtnSelector);

        // Exit early if slider structure is incomplete
        if (!slider || !prevBtn || !nextBtn) return;

        // First item is used to calculate consistent scroll distance
        const firstItem = slider.querySelector(':scope > *'); 
        if (!firstItem) return;

        // Include CSS gap in scroll calculation to keep items aligned
        const gap = parseFloat(window.getComputedStyle(slider).gap) || 0;
        const singleItemScrollWidth = firstItem.offsetWidth + gap; 
    
        // Multiply the number of items you want to move with each click (one after another -> 1)
        const scrollAmount = singleItemScrollWidth * itemsPerScroll; 

        // Enable / disable navigation buttons at scroll boundaries (RTL-safe)
        const checkButtonStatus = () => {
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            const currentScroll = slider.scrollLeft; 
            const threshold = 5; // Prevent precision issues near edges

            // RTL rhythm check
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

        // RTL scrolling: negative = forward, positive = backward
        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    };

    // Testimonials slider
    initializeSlider('.testimonials-slider', '.prev-btn', '.next-btn', 1); 

    // Portfolio before/after slider
    initializeSlider('.portfolio-slider', '.portfolio-prev-btn', '.portfolio-next-btn', 1); 
});