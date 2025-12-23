/*
 * Handles dynamic loading of Header/Footer and navigation logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    const HEADER_PATH = '/header.html'; 
    const FOOTER_PATH = '/footer.html';
    const currentPath = window.location.pathname.toLowerCase();

    // Dynamically loads HTML components
    async function loadComponent(placeholderId, filePath) {
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            try {
                const response = await fetch(filePath);
                if (!response.ok) throw new Error(`Status: ${response.status}`);
                
                const htmlContent = await response.text();
                placeholder.innerHTML = htmlContent;

                // Initialize header-specific logic once loaded
                if (placeholderId === 'header-placeholder') {
                    highlightActiveLink(placeholder, currentPath);
                    initDropdownToggle(placeholder); 
                }

            } catch (error) {
                console.error(`Error loading ${filePath}:`, error);
            }
        }
    }

    /**
     * Handles Dropdown interactions (Click & Close on outside click)
     */
    function initDropdownToggle(headerElement) {
        const dropdownLink = headerElement.querySelector('.dropdown > a');
        const dropdownLi = headerElement.querySelector('.dropdown');

        if (dropdownLink && dropdownLi) {
            
            // Toggle menu on click
            dropdownLink.addEventListener('click', (e) => {
                e.preventDefault(); // Prevents page reload/jump
                e.stopPropagation(); // Prevents immediate closing
                dropdownLi.classList.toggle('menu-open');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (dropdownLi.classList.contains('menu-open')) {
                    if (!dropdownLi.contains(e.target)) {
                        dropdownLi.classList.remove('menu-open');
                    }
                }
            });
        }
    }

    // Highlights the current page link in the navigation
    function highlightActiveLink(headerElement, currentPath) {
        const navLinks = headerElement.querySelectorAll('.main-nav a');
        const cleanedCurrentPath = currentPath.replace(/^\//, '').toLowerCase();

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href').replace(/^\//, '').toLowerCase();
            
            // Skip non-page links (like JS triggers)
            if (linkPath === '#' || linkPath === '' || linkPath.includes('javascript')) return;

            let isLinkActive = false;
            
            // Check for exact match or Homepage
            if (cleanedCurrentPath === linkPath) isLinkActive = true;
            else if ((cleanedCurrentPath === '' || cleanedCurrentPath === 'index.html') && linkPath.includes('homepage.html')) isLinkActive = true;
            
            if (isLinkActive) {
                link.classList.add('active');
                
                // Highlight parent 'Catalog' if a sub-item is active
                const parentDropdown = link.closest('.dropdown');
                if (parentDropdown) {
                    const dropdownMainLink = parentDropdown.querySelector('a');
                    if (dropdownMainLink) dropdownMainLink.classList.add('active');
                }
            }
        });
    }

    loadComponent('header-placeholder', HEADER_PATH);
    loadComponent('footer-placeholder', FOOTER_PATH);
});