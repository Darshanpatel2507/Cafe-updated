document.addEventListener('DOMContentLoaded', () => {
    // Concept: DOM Event Listeners. 
    // Wait for the HTML document to be fully loaded before running scripts.
    console.log("Bollywood Bytes Café Loaded!");

    // --- Scroll Animations ---
    // Element: IntersectionObserver API
    // Concept: Asynchronous Observers. Used to detect when elements (like sections or images) enter the browser's viewport to trigger fade-in animations.
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Check if the element is currently visible in the viewport
            if (entry.isIntersecting) {
                // Add the 'visible' class which triggers the CSS transition (opacity/transform)
                entry.target.classList.add('visible');
                // Stop observing this element so the animation only happens the first time you scroll down
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Apply fade-in class to major sections
    const sectionsToAnimate = document.querySelectorAll('.hero-content, .hero-image-container, .about-content, .about-image, .menu-card, .gallery-content, .gallery-images, .feature-item');
    sectionsToAnimate.forEach((el, index) => {
        // Prepare element by giving it the initial hidden state class
        el.classList.add('fade-in-up');
        
        // For groups of items like menu cards, we want them to appear one after another (staggered effect)
        // By multiplying the index by 0.15s, each subsequent card waits a bit longer before animating
        if (el.classList.contains('menu-card') || el.classList.contains('feature-item')) {
            el.style.transitionDelay = `${(index % 3) * 0.15}s`;
        }
        // Tell the IntersectionObserver to start watching this specific element
        observer.observe(el);
    });

    // --- Navbar Scroll Effect ---
    // Element: window object and scroll event.
    // Concept: Event handling to toggle CSS classes dynamically (adding 'scrolled' class for sticky header styling).
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Counter Logic ---
    // Element: NodeList (querySelectorAll) and setInterval.
    // Concept: DOM traversal and JavaScript Timing events. Animates numbers incrementally to create a dynamic counting effect.
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-target')); // The final number to reach
                const isDecimal = counter.getAttribute('data-decimal') === 'true'; // Check if we should keep decimal points
                
                const duration = 2000; // Total animation time in milliseconds (2 seconds)
                const stepTime = 20; // How often to update the number (every 20ms)
                const steps = duration / stepTime; // Total number of updates
                const increment = target / steps; // How much to add per update
                
                let current = 0;
                // setInterval runs the enclosed function repeatedly every `stepTime` milliseconds
                const timer = setInterval(() => {
                    current += increment;
                    // If we reached or exceeded the target, stop the timer and cap it at the target
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    // Update the HTML text. Use toFixed(1) for decimals (like 4.9), otherwise round down to a whole number.
                    counter.innerText = isDecimal ? current.toFixed(1) : Math.floor(current);
                }, stepTime);
                
                counterObserver.unobserve(counter); // Only run the counter animation once
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));


});

// --- Modal Logic ---
// Element: HTML DOM Elements and classList API.
// Concept: State management via CSS classes (active/inactive) to create popup overlays (modals) without navigating to a new page.
function openReservationModal(e) {
    if (e) e.preventDefault();
    const modal = document.getElementById('reservationModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeReservationModal() {
    const modal = document.getElementById('reservationModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('reservationModal');
    if (e.target === modal) {
        closeReservationModal();
    }
});

// --- Submit Reservation Logic ---
// Element: HTMLFormElement and Event Object.
// Concept: Form submission interception (e.preventDefault()) to handle data processing locally and trigger UI feedback (Toast notification) instead of a page reload.
function submitReservation(e) {
    e.preventDefault();
    
    const form = document.getElementById('reservationForm');
    const name = document.getElementById('resName').value;
    const date = document.getElementById('resDate').value;
    const time = document.getElementById('resTime').value;
    
    // Convert the raw date string (YYYY-MM-DD) into a more readable format (e.g., 25 Apr 2026)
    const dateObj = new Date(date);
    const dateString = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    
    closeReservationModal(); // Hide the form popup
    
    // Display the success notification (Toast message)
    const toast = document.getElementById('toast');
    if (toast) {
        toast.innerHTML = `🎬 Booking Confirmed!<br><small>Table reserved for <strong>${name}</strong> — ${dateString} at ${time}. Your filmi experience awaits!</small>`;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }
    
    // Reset form
    if (form) form.reset();
}

// --- Lightbox Logic ---
// Element: DOM elements (querySelector, innerHTML, style object).
// Concept: Dynamic DOM manipulation. Clones the clicked gallery block's background and applies it to a fullscreen overlay container.
function openLightbox(el) {
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightbox-content');
    
    if (lightbox && lightboxContent) {
        // Find the inner div that contains the actual background image and content
        const inner = el.querySelector('.g-inner');
        if (inner) {
            // Copy the HTML (like emojis if any exist) into the lightbox
            lightboxContent.innerHTML = inner.innerHTML;
            // Copy all inline CSS styles (specifically the background-image and background-color)
            lightboxContent.style.cssText = inner.style.cssText;
            // Ensure the image scales nicely to fit the screen without cropping
            lightboxContent.style.backgroundSize = 'contain';
            lightboxContent.style.backgroundRepeat = 'no-repeat';
        }
        // Add 'active' class to make the dark overlay visible
        lightbox.classList.add('active');
    }
}

function closeLightbox(e) {
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightbox-content');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    if (e.target === lightbox || e.target === lightboxClose || e.target === lightboxContent) {
        lightbox.classList.remove('active');
        setTimeout(() => {
            if (lightboxContent) {
                lightboxContent.innerHTML = '';
                lightboxContent.style.cssText = '';
            }
        }, 300); // wait for fade out
    }
}

// Close lightbox on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
        }
    }
});
