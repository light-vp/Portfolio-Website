// ==========================================================================
// Portfolio Website - Main JavaScript
// Author: [Your Name]
// Version: 1.0
// ==========================================================================

// ==========================================================================
// 1. Global Variables
// ==========================================================================
const Portfolio = {
    isLoading: true,
    scrollPosition: 0,
    isMobile: window.innerWidth < 768,
    isDarkMode: true,
    animations: {
        duration: 300,
        easing: 'ease'
    }
};

// ==========================================================================
// 2. Utility Functions
// ==========================================================================
const Utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight - offset) &&
            rect.bottom >= offset
        );
    },

    // Smooth scroll to element
    scrollToElement(elementId, offset = 80) {
        const element = document.getElementById(elementId);
        if (element) {
            const top = element.offsetTop - offset;
            window.scrollTo({
                top: top,
                behavior: 'smooth'
            });
        }
    },

    // Format date
    formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    },

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        }
    }
};

// ==========================================================================
// 3. Navigation Functions
// ==========================================================================
const Navigation = {
    init() {
        this.navbar = document.getElementById('navbar');
        this.menuToggle = document.getElementById('menuToggle');
        this.navLinks = document.querySelectorAll('.nav-links a');
        this.mobileMenu = document.getElementById('mobileMenu');
        
        this.setupEventListeners();
        this.updateActiveLink();
    },

    setupEventListeners() {
        // Scroll events
        window.addEventListener('scroll', Utils.throttle(() => {
            this.handleScroll();
        }, 100));

        // Menu toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                Utils.scrollToElement(targetId);
                
                // Close mobile menu if open
                if (this.mobileMenu && this.mobileMenu.classList.contains('show')) {
                    this.toggleMobileMenu();
                }
            });
        });

        // Update active link on scroll
        window.addEventListener('scroll', Utils.debounce(() => {
            this.updateActiveLink();
        }, 100));
    },

    handleScroll() {
        const scrollPosition = window.pageYOffset;
        
        // Add/remove scrolled class
        if (scrollPosition > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        Portfolio.scrollPosition = scrollPosition;
    },

    toggleMobileMenu() {
        this.menuToggle.classList.toggle('active');
        
        // Create mobile menu if it doesn't exist
        if (!this.mobileMenu) {
            this.createMobileMenu();
        }
        
        this.mobileMenu.classList.toggle('show');
        document.body.classList.toggle('menu-open');
    },

    createMobileMenu() {
        const mobileMenu = document.createElement('div');
        mobileMenu.id = 'mobileMenu';
        mobileMenu.className = 'mobile-menu';
        
        const navLinksClone = document.querySelector('.nav-links').cloneNode(true);
        mobileMenu.appendChild(navLinksClone);
        
        document.body.appendChild(mobileMenu);
        this.mobileMenu = mobileMenu;
        
        // Add click listeners to mobile menu links
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        });
    },

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
};

// ==========================================================================
// 4. Animation Functions
// ==========================================================================
const Animations = {
    init() {
        this.setupIntersectionObserver();
        this.setupParallax();
        this.animateOnLoad();
    },

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Special handling for different elements
                    if (entry.target.classList.contains('skill-category')) {
                        this.animateSkillBars(entry.target);
                    }
                    
                    if (entry.target.classList.contains('timeline-entry')) {
                        this.animateTimelineEntry(entry.target);
                    }
                }
            });
        }, options);

        // Observe elements
        const animatedElements = document.querySelectorAll(
            '.animate-fadeInUp, .animate-fadeInDown, .animate-slideInLeft, ' +
            '.animate-slideInRight, .project-card, .skill-category, .timeline-entry'
        );
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    },

    setupParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        if (parallaxElements.length > 0) {
            window.addEventListener('scroll', Utils.throttle(() => {
                const scrolled = window.pageYOffset;
                
                parallaxElements.forEach(el => {
                    const speed = el.dataset.speed || 0.5;
                    const yPos = -(scrolled * speed);
                    el.style.transform = `translateY(${yPos}px)`;
                });
            }, 10));
        }
    },

    animateOnLoad() {
        // Animate hero content
        const heroElements = document.querySelectorAll('.hero-content > *');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.8s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    },

    animateSkillBars(container) {
        const skillBars = container.querySelectorAll('.skill-progress');
        
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const progress = bar.style.getPropertyValue('--progress');
                bar.style.width = progress;
            }, index * 100);
        });
    },

    animateTimelineEntry(entry) {
        entry.style.opacity = '1';
        entry.style.transform = 'translateY(0)';
    },

    // Typewriter effect
    typewriter(element, text, speed = 50) {
        let index = 0;
        element.textContent = '';
        
        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };
        
        type();
    },

    // Counter animation
    animateCounter(element, start, end, duration) {
        const range = end - start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current;
            
            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }
};

// ==========================================================================
// 5. Form Handling
// ==========================================================================
const FormHandler = {
    init() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            this.setupContactForm(contactForm);
        }
        
        this.setupFormValidation();
    },

    setupContactForm(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!this.validateForm(form)) {
                return;
            }
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            await this.submitForm(data, form);
        });
    },

    setupFormValidation() {
        const inputs = document.querySelectorAll('.form-input, .form-textarea');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            // Clear error on input
            input.addEventListener('input', () => {
                const formGroup = input.closest('.form-group');
                formGroup.classList.remove('error');
            });
        });
    },

    validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('[required]');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    },

    validateField(field) {
        const formGroup = field.closest('.form-group');
        const value = field.value.trim();
        
        // Reset error state
        formGroup.classList.remove('error');
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            formGroup.classList.add('error');
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                formGroup.classList.add('error');
                return false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value)) {
                formGroup.classList.add('error');
                return false;
            }
        }
        
        return true;
    },

    async submitForm(data, form) {
        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.textContent;
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            // Replace with your actual form submission endpoint
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                this.showMessage('success', 'Message sent successfully! I\'ll get back to you soon.');
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('error', 'Something went wrong. Please try again later.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    },

    showMessage(type, text) {
        const messageEl = document.getElementById('formMessage');
        
        if (messageEl) {
            messageEl.className = `form-message ${type} show`;
            messageEl.textContent = text;
            
            setTimeout(() => {
                messageEl.classList.remove('show');
            }, 5000);
        }
    }
};

// ==========================================================================
// 6. Project Gallery
// ==========================================================================
const ProjectGallery = {
    init() {
        this.setupFilters();
        this.setupLightbox();
    },

    setupFilters() {
        const filterButtons = document.querySelectorAll('.project-filter');
        const projects = document.querySelectorAll('.project-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter projects
                projects.forEach(project => {
                    const category = project.dataset.category;
                    
                    if (filter === 'all' || category === filter) {
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        project.style.opacity = '0';
                        project.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            project.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    },

    setupLightbox() {
        const projectImages = document.querySelectorAll('.project-image');
        
        projectImages.forEach(img => {
            img.addEventListener('click', () => {
                this.openLightbox(img.src, img.alt);
            });
        });
    },

    openLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img src="${src}" alt="${alt}">
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        // Animate in
        setTimeout(() => {
            lightbox.classList.add('show');
        }, 10);
        
        // Close events
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', () => this.closeLightbox(lightbox));
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                this.closeLightbox(lightbox);
            }
        });
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeLightbox(lightbox);
            }
        });
    },

    closeLightbox(lightbox) {
        lightbox.classList.remove('show');
        setTimeout(() => {
            lightbox.remove();
        }, 300);
    }
};

// ==========================================================================
// 7. Theme Switcher
// ==========================================================================
const ThemeSwitcher = {
    init() {
        this.loadTheme();
        this.setupToggle();
    },

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        Portfolio.isDarkMode = savedTheme === 'dark';
    },

    setupToggle() {
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    },

    toggleTheme() {
        Portfolio.isDarkMode = !Portfolio.isDarkMode;
        const theme = Portfolio.isDarkMode ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Animate theme transition
        document.body.style.transition = 'background-color 0.3s ease';
    }
};

// ==========================================================================
// 8. Loader
// ==========================================================================
const Loader = {
    init() {
        window.addEventListener('load', () => {
            this.hideLoader();
        });
    },

    hideLoader() {
        const loader = document.getElementById('loader');
        
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
                Portfolio.isLoading = false;
                
                // Trigger animations after loader
                Animations.animateOnLoad();
            }, 500);
        }
    }
};

// ==========================================================================
// 9. Initialize Everything
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Core initializations
    Navigation.init();
    Animations.init();
    FormHandler.init();
    ProjectGallery.init();
    ThemeSwitcher.init();
    Loader.init();
    
    // Update mobile status on resize
    window.addEventListener('resize', Utils.debounce(() => {
        Portfolio.isMobile = window.innerWidth < 768;
    }, 250));
    
    // Log initialization
    console.log('Portfolio website initialized successfully!');
});

// ==========================================================================
// 10. Export for use in other modules
// ==========================================================================
window.Portfolio = Portfolio;
window.Utils = Utils;