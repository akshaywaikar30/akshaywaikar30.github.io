/**
 * Portfolio Website - Modern JavaScript
 * Handles theme switching, navigation, and animations
 */

// ========================================
// Theme Management
// ========================================

class ThemeManager {
    constructor() {
        this.htmlElement = document.documentElement;
        this.themeToggleBtn = document.getElementById('themeToggle');
        this.storageKey = 'portfolio-theme';
        this.darkModeIcon = 'fa-moon';
        this.lightModeIcon = 'fa-sun';
        
        this.init();
    }

    init() {
        // Load saved theme preference or detect system preference
        const savedTheme = localStorage.getItem(this.storageKey);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        this.setTheme(theme);
        this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        this.htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.storageKey, theme);
        this.updateIcon(theme);
    }

    toggleTheme() {
        const currentTheme = this.htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    updateIcon(theme) {
        const icon = this.themeToggleBtn.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove(this.darkModeIcon);
            icon.classList.add(this.lightModeIcon);
        } else {
            icon.classList.remove(this.lightModeIcon);
            icon.classList.add(this.darkModeIcon);
        }
    }
}

// ========================================
// Navigation Management
// ========================================

class NavigationManager {
    constructor() {
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-menu a');
        
        this.init();
    }

    init() {
        // Toggle mobile menu
        this.navToggle.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
    }
}

// ========================================
// Typed Text Effect
// ========================================

class TypedTextEffect {
    constructor(element, strings, speed = 150) {
        this.element = element;
        this.strings = strings;
        this.speed = speed;
        this.stringIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.delayBeforeDelete = 2000;
        this.delayBeforeType = 500;
        
        this.type();
    }

    type() {
        const currentString = this.strings[this.stringIndex];
        
        if (this.isDeleting) {
            // Deleting characters
            this.element.textContent = currentString.substring(0, this.charIndex - 1);
            this.charIndex--;
            
            if (this.charIndex === 0) {
                this.isDeleting = false;
                this.stringIndex = (this.stringIndex + 1) % this.strings.length;
                setTimeout(() => this.type(), this.delayBeforeType);
                return;
            }
        } else {
            // Typing characters
            this.element.textContent = currentString.substring(0, this.charIndex + 1);
            this.charIndex++;
            
            if (this.charIndex === currentString.length) {
                this.isDeleting = true;
                setTimeout(() => this.type(), this.delayBeforeDelete);
                return;
            }
        }
        
        setTimeout(() => this.type(), this.speed);
    }
}

// ========================================
// Scroll Animations
// ========================================

class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, this.observerOptions);

        // Observe all elements with animation classes
        document.querySelectorAll('.education-card, .project-card, .skill-item, .contact-card').forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        element.style.animation = 'slideInUp 0.6s ease-out forwards';
    }
}

// ========================================
// Smooth Scroll Behavior
// ========================================

class SmoothScroller {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    this.smoothScrollTo(target);
                }
            });
        });
    }

    smoothScrollTo(element) {
        const offset = 80; // Account for fixed navbar
        const top = element.getBoundingClientRect().top + window.scrollY - offset;
        
        window.scrollTo({
            top: top,
            behavior: 'smooth'
        });
    }
}

// ========================================
// Progress Bar Animation
// ========================================

class ProgressBarAnimation {
    constructor() {
        this.observerOptions = {
            threshold: 0.5
        };
        
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBars = entry.target.querySelectorAll('.skill-progress');
                    progressBars.forEach(bar => {
                        const width = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            observer.observe(skillsSection);
        }
    }
}

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    new ThemeManager();
    new NavigationManager();
    new ScrollAnimations();
    new SmoothScroller();
    new ProgressBarAnimation();

    // Initialize typed text effect
    const typedElement = document.querySelector('.typed-text');
    if (typedElement) {
        new TypedTextEffect(typedElement, [
            'a Web Developer',
            'Goal-Oriented',
            'Software Engineer',
            'Cloud Specialist'
        ], 100);
    }

    // Log initialization
    console.log('✓ Portfolio initialized successfully');
});

// ========================================
// Utility Functions
// ========================================

/**
 * Debounce function to optimize performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Animate numbers counting up
 */
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ========================================
// Performance Optimization
// ========================================

/**
 * Lazy load images
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// Error Handling
// ========================================

window.addEventListener('error', (event) => {
    console.error('Error occurred:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rejection:', event.reason);
});
