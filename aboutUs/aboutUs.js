/**
 * aboutUs.js
 * Handles page-specific logic for the About Us page:
 * 1. FAQ Tab navigation for switching target audiences.
 * 2. Accordion functionality for expanding/collapsing questions.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- FAQ Tabs Logic --- */
    /* Manages category switching between Private, Committees, and Management FAQ sections */

    const tabButtons = document.querySelectorAll('.faq-tabs .tab-button');
    const accordionContainers = document.querySelectorAll('.accordion-container');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target'); // private, committees, management

            // Phase 1: Reset - Remove 'active' state from all buttons and hide all containers
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            accordionContainers.forEach(container => {
                container.classList.remove('active');
                container.classList.add('hidden'); // CSS handles the smooth disappearance
            });

            // Phase 2: Activation - Highlight the selected tab and show the relevant container
            button.classList.add('active');

            const targetContainer = document.getElementById(targetId);
            if (targetContainer) {
                targetContainer.classList.remove('hidden'); 
                targetContainer.classList.add('active');
            }
        });
    });


    /* --- FAQ Accordion Logic --- */
    /* Handles smooth expanding and collapsing of individual FAQ answers */

    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling; // div.accordion-content
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            
            // Auto-close: Finds the current container to collapse sibling items for better UX
            const currentContainer = header.closest('.accordion-container');
            const siblingHeaders = currentContainer.querySelectorAll('.accordion-header');

            siblingHeaders.forEach(otherHeader => {
                const otherContent = otherHeader.nextElementSibling;
                if (otherHeader !== header && otherHeader.getAttribute('aria-expanded') === 'true') {
                    otherHeader.setAttribute('aria-expanded', 'false');
                    otherContent.style.maxHeight = null; // Collapses the sibling
                }
            });

            // Toggle Logic: Opens or closes the clicked item based on its current state
            if (isExpanded) {
                header.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null; // Collapse current
            } else {
                header.setAttribute('aria-expanded', 'true');
                /* scrollHeight provides the exact content height, enabling a smooth CSS transition */
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
});