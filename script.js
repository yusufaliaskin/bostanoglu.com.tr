/* script.js - Premium Animations */

document.addEventListener('DOMContentLoaded', () => {
    initScrollEffects();
    initMobileMenu();
    initHeroSlider();
    initStaggeredAnimations();
});

// 1. Cinematic Scroll Reveal (Intersection Observer)
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px 0px -50px 0px" // Offset slightly
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once revealed for performance
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Target generic reveals
    const reveals = document.querySelectorAll('.scroll-reveal');
    reveals.forEach(el => observer.observe(el));
}

// 2. Automated Staggered Entrances
function initStaggeredAnimations() {
    // Select grids where we want sequential fade-ins
    const grids = document.querySelectorAll('.new-arrivals-grid, .grid-collection-expanded, .trust-grid, .grid-products, .reviews-grid');

    grids.forEach(grid => {
        const children = Array.from(grid.children);
        children.forEach((child, index) => {
            // Add base reveal class if not present
            child.classList.add('scroll-reveal');

            // Calculate delay: 1st=100ms, 2nd=200ms...
            // Use style directly for dynamic precision
            child.style.transitionDelay = `${(index % 4) * 0.15}s`; // Reset every row (approx 4 items)
        });

        // Re-observe these new items
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 }); // More sensitive for grids

        children.forEach(child => observer.observe(child));
    });
}

// 3. Hero Slider (Zoom & Fade)
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slider .slide');
    if (slides.length === 0) return;

    let currentSlide = 0;
    const intervalTime = 6000; // Slower, 6s

    setInterval(() => {
        // Prepare next slide
        const nextSlide = (currentSlide + 1) % slides.length;

        // Active handling
        slides[currentSlide].classList.remove('active');
        slides[nextSlide].classList.add('active');

        currentSlide = nextSlide;
    }, intervalTime);
}

// 4. Mobile Menu & Navbar
function initMobileMenu() {
    const header = document.getElementById('header');

    // Scroll Effect (Glass)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Toggle Menu
    const openBtn = document.getElementById('openMenuBtn');
    const closeBtn = document.getElementById('closeMenuBtn');
    const menu = document.getElementById('mobileMenu');
    const links = document.querySelectorAll('.mobile-links a');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            menu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock Body Scroll
        });
    }

    function closeMenu() {
        menu.classList.remove('active');
        document.body.style.overflow = ''; // Unlock Body Scroll
    }

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    links.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}
