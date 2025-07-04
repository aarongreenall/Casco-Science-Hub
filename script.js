// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu / Hamburger Logic ---
    const hamburgerButton = document.getElementById('hamburger-button');
    const closeMobileMenuButton = document.getElementById('close-mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

    if (hamburgerButton && mobileMenuOverlay) {
        hamburgerButton.addEventListener('click', () => {
            mobileMenuOverlay.classList.add('is-open');
        });
    }

    if (closeMobileMenuButton && mobileMenuOverlay) {
        closeMobileMenuButton.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('is-open');
            // Close any open accordions when closing the main mobile menu
            document.querySelectorAll('#mobile-menu-overlay .mobile-accordion-content.is-open').forEach(content => {
                content.classList.remove('is-open');
                content.style.maxHeight = '0';
                const btn = content.previousElementSibling;
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- Accordion Logic (for mobile menu) ---
    const mobileAccordionButtons = document.querySelectorAll('.mobile-accordion-btn');

    mobileAccordionButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent click from bubbling up
            const content = this.nextElementSibling; // The <ul> that is the accordion content

            if (content && content.classList.contains('mobile-accordion-content')) {
                
                // Close other open accordions at the same level
                const parentUl = this.closest('ul'); // Get the parent <ul> (either main or nested)
                if (parentUl) {
                    // Find all accordion contents within this parentUl
                    parentUl.querySelectorAll('.mobile-accordion-content.is-open').forEach(openContent => {
                        // Only close if it's currently open and not the one just clicked
                        if (openContent !== content) {
                            openContent.classList.remove('is-open');
                            openContent.style.maxHeight = '0';
                            const btn = openContent.previousElementSibling;
                            if (btn) btn.setAttribute('aria-expanded', 'false');
                        }
                    });
                }
                
                // Toggle this accordion
                content.classList.toggle('is-open');
                if (content.classList.contains('is-open')) {
                    content.style.maxHeight = content.scrollHeight + 'px'; // Set height dynamically
                    button.setAttribute('aria-expanded', 'true');
                } else {
                    content.style.maxHeight = '0';
                    button.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // --- Desktop Hover Logic (for desktop navigation) ---
    // This version of index.html uses simple links for desktop nav, no hover dropdowns here.
    // The following code is for the desktop dropdowns if they were present.
    // It's kept here as a placeholder for other pages that might use it,
    // but is effectively inactive for the main desktop nav on this page.
    const desktopNavGroups = document.querySelectorAll('#desktop-nav .group');

    desktopNavGroups.forEach(groupLi => {
        const desktopMenu = groupLi.querySelector('.desktop-dropdown-menu');
        const desktopButton = groupLi.querySelector('.desktop-dropdown-btn');

        if (desktopMenu && desktopButton) {
            // Open on mouseenter
            groupLi.addEventListener('mouseenter', () => {
                // Close any other open top-level desktop menus
                document.querySelectorAll('#desktop-nav > ul > li.group').forEach(openGroup => {
                    if (openGroup !== groupLi) {
                        const menu = openGroup.querySelector('.desktop-dropdown-menu');
                        const btn = openGroup.querySelector('.desktop-dropdown-btn');
                        if (menu && menu.style.display === 'block') {
                            menu.style.display = 'none';
                            if (btn) btn.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
                
                // Open current menu
                desktopMenu.style.display = 'block';
                desktopButton.setAttribute('aria-expanded', 'true');
                groupLi.classList.add('is-open'); // For arrow rotation
            });

            // Close on mouseleave (with a slight delay to allow moving to sub-menu)
            groupLi.addEventListener('mouseleave', (e) => {
                // Check if the mouse is truly outside the entire group (li and its children)
                // Use a setTimeout to allow mouse to enter the submenu before closing
                setTimeout(() => {
                    if (!groupLi.matches(':hover')) { // Check if mouse is truly outside
                        desktopMenu.style.display = 'none';
                        desktopButton.setAttribute('aria-expanded', 'false');
                        groupLi.classList.remove('is-open'); // For arrow rotation
                    }
                }, 150); // Increased delay
            });

            // For nested desktop menus (e.g., Biology/Chemistry/Physics), ensure they open/close on hover
            desktopMenu.querySelectorAll('li.group').forEach(nestedGroupLi => {
                const nestedMenu = nestedGroupLi.querySelector('.desktop-dropdown-menu');
                const nestedButton = nestedGroupLi.querySelector('.desktop-dropdown-btn');
                if (nestedMenu && nestedButton) {
                    nestedGroupLi.addEventListener('mouseenter', (e) => {
                        e.stopPropagation(); // Prevent parent menu from closing
                        nestedMenu.style.display = 'block';
                        nestedButton.setAttribute('aria-expanded', 'true');
                        nestedGroupLi.classList.add('is-open'); // For arrow rotation
                    });
                    nestedGroupLi.addEventListener('mouseleave', (e) => {
                        setTimeout(() => {
                            if (!nestedGroupLi.matches(':hover')) {
                                nestedMenu.style.display = 'none';
                                nestedButton.setAttribute('aria-expanded', 'false');
                                nestedGroupLi.classList.remove('is-open'); // For arrow rotation
                            }
                        }, 150); // Increased delay
                    });
                }
            });
        }
    });

    // Close all desktop dropdowns when clicking anywhere outside the nav (excluding mobile overlay)
    document.addEventListener('click', function(event) {
        // Only run this if on desktop view (or if mobile overlay is not open)
        if (window.innerWidth >= 768 && !event.target.closest('#desktop-nav') && !mobileMenuOverlay.classList.contains('is-open')) {
            document.querySelectorAll('#desktop-nav .desktop-dropdown-menu').forEach(menu => {
                menu.style.display = 'none';
                const btn = menu.previousElementSibling;
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });
            document.querySelectorAll('#desktop-nav .group.is-open').forEach(group => {
                group.classList.remove('is-open'); // For arrow rotation
            });
        }
    });


    // Interactive Content: Science Fact Generator
    const scienceFacts = [
        "The human brain weighs about 3 pounds but uses 20% of the body's oxygen and calories.",
        "A bolt of lightning is five times hotter than the surface of the Sun.",
        "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still edible.",
        "There are more stars in the universe than grains of sand on all the beaches on Earth.",
        "The Earth's core is as hot as the surface of the Sun.",
        "A group of owls is called a parliament.",
        "The fastest land animal is the cheetah, which can reach speeds of up to 70 mph (112 km/h).",
        "The total weight of all ants on Earth is roughly equal to the total weight of all humans.",
        "Sound travels about 4.3 times faster in water than in air.",
        "The shortest war in history was between Britain and Zanzibar on August 27, 1896. It lasted only 38 minutes."
    ];

    const generateFactBtn = document.getElementById('generateFactBtn');
    const scienceFactDisplay = document.getElementById('scienceFact');

    if (generateFactBtn && scienceFactDisplay) {
        generateFactBtn.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * scienceFacts.length);
            scienceFactDisplay.textContent = scienceFacts[randomIndex];
        });
    }
});
