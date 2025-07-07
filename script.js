document.addEventListener('DOMContentLoaded', () => {
    const introOverlay = document.querySelector('.intro-overlay');
    const mainWrapper = document.querySelector('.main-wrapper');

    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');
    const navResumeBtn = document.querySelector('.nav-resume-btn'); // Desktop resume button element

    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorCircle = document.querySelector('.custom-cursor-circle');
    const interactiveElements = document.querySelectorAll('a, button, .btn, .skill-category-card, .project-card, .contact-method-card, .theme-toggle, .burger-menu');

    const taglineElement = document.querySelector('.hero-tagline');
    const taglineText = "Explore my Portfolio."; // The text content for the tagline

    const heroTextArea = document.querySelector('.hero-text-area');
    const heroImageArea = document.querySelector('.hero-image-area');

    const themeToggleBtn = document.getElementById('themeToggle');
    const progressBar = document.getElementById('progressBar');

    // --- Theme Switching Logic ---
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.classList.add(currentTheme);
    } else {
        document.body.classList.add('dark-mode'); // Default to dark mode
    }

    // Event listener for the desktop theme toggle
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        document.body.classList.toggle('dark-mode');
        let theme = 'dark-mode';
        if (document.body.classList.contains('light-mode')) {
            theme = 'light-mode';
        }
        localStorage.setItem('theme', theme);
        // Sync the mobile toggle's visual state if it exists
        const mobileThemeToggle = document.getElementById('mobileThemeToggle');
        if (mobileThemeToggle) {
            if (document.body.classList.contains('light-mode')) {
                mobileThemeToggle.classList.add('light-mode');
            } else {
                mobileThemeToggle.classList.remove('light-mode');
            }
        }
    });

    // --- Intro Animation Sequence ---
    setTimeout(() => {
        introOverlay.classList.add('hidden');
    }, 2000);

    introOverlay.addEventListener('transitionend', (event) => {
        if (event.propertyName === 'opacity' && introOverlay.classList.contains('hidden')) {
            introOverlay.classList.add('fully-hidden');
            // Slight delay before showing main wrapper to ensure overlay is gone
            setTimeout(() => {
                mainWrapper.classList.add('show');
                initAnimationsAfterLoad(); // Initialize animations after main content is visible
            }, 100); // Small delay
        }
    }, { once: true });


    function initAnimationsAfterLoad() {
        checkSectionVisibility();
        initializeLazyLoading();

        // Set tagline text as soon as main content is visible
        if (taglineElement) {
            taglineElement.textContent = taglineText;
        }

        // Delay hero animations slightly after main wrapper appears
        setTimeout(() => {
            if (heroTextArea) {
                heroTextArea.classList.add('hero-animated');
            }
            if (heroImageArea) {
                heroImageArea.classList.add('hero-animated');
            }

            // Call handleResize immediately to set correct initial state for all responsive elements
            handleResize();
        }, 100);
    }


    // --- Mobile Navigation Toggle ---
    const resumeListItem = document.createElement('li');
    const resumeLink = document.createElement('a');
    resumeLink.href = 'https://i.ibb.co/WdJ9ygr/resume-Picsart-Ai-Image-Enhancer.jpg'; // Make sure this path is correct
    resumeLink.target = '_blank';
    resumeLink.textContent = 'My Resume';
    resumeListItem.appendChild(resumeLink);

    const themeToggleListItem = document.createElement('li');
    themeToggleListItem.classList.add('mobile-theme-toggle-container');
    const mobileThemeToggle = document.createElement('button'); // Changed to button for consistency
    mobileThemeToggle.classList.add('btn', 'theme-toggle'); // Use existing button styles
    mobileThemeToggle.id = 'mobileThemeToggle';
    mobileThemeToggle.setAttribute('aria-label', 'Toggle light/dark theme');
    const mobileToggleIndicator = document.createElement('div');
    mobileToggleIndicator.classList.add('toggle-indicator');
    mobileThemeToggle.appendChild(mobileToggleIndicator);
    themeToggleListItem.appendChild(mobileThemeToggle);

    // Function to set up the mobile theme toggle click listener and state
    const setupMobileThemeToggle = () => {
        mobileThemeToggle.onclick = () => {
            document.body.classList.toggle('light-mode');
            document.body.classList.toggle('dark-mode');
            let theme = 'dark-mode';
            if (document.body.classList.contains('light-mode')) {
                theme = 'light-mode';
            }
            localStorage.setItem('theme', theme);
            if (document.body.classList.contains('light-mode')) {
                mobileThemeToggle.classList.add('light-mode');
            } else {
                mobileThemeToggle.classList.remove('light-mode');
            }
        };
        // Set initial state of mobile toggle based on current theme
        if (document.body.classList.contains('light-mode')) {
            mobileThemeToggle.classList.add('light-mode');
        } else {
            mobileThemeToggle.classList.remove('light-mode');
        }
    };


    burgerMenu.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        burgerMenu.classList.toggle('open');

        // Only add/remove mobile-specific elements if it's a mobile viewport (or when burger is clicked)
        if (window.innerWidth <= 768) {
            if (navLinks.classList.contains('open')) {
                if (!navLinks.contains(resumeListItem)) {
                    navLinks.appendChild(resumeListItem);
                }
                if (!navLinks.contains(themeToggleListItem)) {
                    navLinks.appendChild(themeToggleListItem);
                    setupMobileThemeToggle(); // Setup event listener when added
                }
            } else {
                if (navLinks.contains(resumeListItem)) {
                    navLinks.removeChild(resumeListItem);
                }
                if (navLinks.contains(themeToggleListItem)) {
                    navLinks.removeChild(themeToggleListItem);
                }
            }
        }
    });

    // Handle initial state and window resize
    const handleResize = () => {
        if (window.innerWidth > 768) { // Desktop view
            // Ensure desktop elements are visible and mobile elements are removed
            if (navLinks.contains(resumeListItem)) navLinks.removeChild(resumeListItem);
            if (navLinks.contains(themeToggleListItem)) navLinks.removeChild(themeToggleListItem);

            navLinks.classList.remove('open'); // Ensure mobile menu state is reset
            burgerMenu.classList.remove('open');
            burgerMenu.style.display = 'none'; // Hide burger menu
            navResumeBtn.style.display = 'block'; // Show desktop resume button
            themeToggleBtn.style.display = 'flex'; // Show desktop theme toggle

            // Restore custom cursor
            if (cursorDot && cursorCircle) {
                document.body.style.cursor = 'none';
                // Opacity is managed by mousemove/mouseleave events, no need to set here
            }

        } else { // Mobile view: 768px and below
            // Ensure desktop elements are hidden
            navResumeBtn.style.display = 'none';
            themeToggleBtn.style.display = 'none';
            burgerMenu.style.display = 'flex'; // Show burger menu

            // Remove mobile-specific list items if they were added (e.g., if resized from mobile while open)
            // and re-add them if the menu is currently open (after resize)
            if (navLinks.contains(resumeListItem)) navLinks.removeChild(resumeListItem);
            if (navLinks.contains(themeToggleListItem)) navLinks.removeChild(themeToggleListItem);

            if (navLinks.classList.contains('open')) {
                navLinks.appendChild(resumeListItem);
                navLinks.appendChild(themeToggleListItem);
                setupMobileThemeToggle(); // Setup event listener when added
            }

            // Disable custom cursor on mobile
            if (cursorDot && cursorCircle) {
                document.body.style.cursor = 'auto';
                cursorDot.style.opacity = '0';
                cursorCircle.style.opacity = '0';
            }
        }
    };

    // Run on window resize
    window.addEventListener('resize', handleResize);

    // Close mobile menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                burgerMenu.classList.remove('open');
                // Also remove the dynamically added items
                if (navLinks.contains(resumeListItem)) {
                    navLinks.removeChild(resumeListItem);
                }
                if (navLinks.contains(themeToggleListItem)) {
                    navLinks.removeChild(themeToggleListItem);
                }
            }
        });
    });

    // --- Custom Cursor Logic (Desktop Only) ---
    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768 && cursorDot && cursorCircle) { // Only active on larger screens
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
            // Use translate3d for hardware acceleration
            cursorCircle.style.transform = `translate(-50%, -50%) translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

            cursorDot.style.opacity = '1';
            cursorCircle.style.opacity = '1';
        }
    });

    document.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768 && cursorDot && cursorCircle) { // Only active on larger screens
            cursorDot.style.opacity = '0';
            cursorCircle.style.opacity = '0';
        }
    });

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) { // Only active on larger screens
                cursorDot.classList.add('hover-active');
                cursorCircle.classList.add('hover-active');
            }
        });
        element.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) { // Only active on larger screens
                cursorDot.classList.remove('hover-active');
                cursorCircle.classList.remove('hover-active');
            }
        });
    });


    // --- Scroll Progress Bar ---
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });


    // --- Scroll-triggered Animations for Sections ---
    const sectionsToReveal = document.querySelectorAll('.reveal-section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Adjust as needed
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    function checkSectionVisibility() {
        sectionsToReveal.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // --- Lazy Loading Images ---
    const lazyloadImages = document.querySelectorAll('.lazyload-img');

    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '0px 0px 100px 0px', // Load images when they are 100px from viewport bottom
        threshold: 0.01 // Trigger when even a small part of the image is visible
    });

    function initializeLazyLoading() {
        lazyloadImages.forEach(img => {
            lazyLoadObserver.observe(img);
        });
    }
});