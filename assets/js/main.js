// ===== MAIN JAVASCRIPT ===== //

class CodeArtSite {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.initializeComponents();
            });
        } else {
            this.setupEventListeners();
            this.initializeComponents();
        }
    }

    setupEventListeners() {
        // Navigation
        this.setupNavigation();
        
        // Mobile menu
        this.setupMobileMenu();
        
        // Smooth scrolling
        this.setupSmoothScrolling();
        
        // Scroll effects
        this.setupScrollEffects();
        
        // Project interactions
        this.setupProjectInteractions();
        
        // Loading screen
        this.setupLoadingScreen();
    }

    initializeComponents() {
        // Typography animations
        this.initTypingEffect();
        
        // Counter animations
        this.initCounterAnimations();
        
        // Intersection observer for animations
        this.initIntersectionObserver();
        
        // Timeline animations (if on about page)
        this.initTimelineAnimations();
        
        // Skill bar animations
        this.initSkillBarAnimations();
    }

    // ===== NAVIGATION ===== //
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        let lastScroll = 0;
        let isScrolling = false;

        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    const currentScroll = window.pageYOffset;
                    
                    // Add scrolled class for styling
                    if (currentScroll > 50) {
                        navbar?.classList.add('scrolled');
                    } else {
                        navbar?.classList.remove('scrolled');
                    }
                    
                    // Update active nav link
                    this.updateActiveNavLink();
                    
                    lastScroll = currentScroll;
                    isScrolling = false;
                });
                
                isScrolling = true;
            }
        });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // ===== MOBILE MENU ===== //
    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobileToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        
        if (!mobileToggle || !mobileMenu) return;

        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking nav links
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && 
                !mobileToggle.contains(e.target) && 
                mobileMenu.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // ===== SMOOTH SCROLLING ===== //
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== SCROLL EFFECTS ===== //
    setupScrollEffects() {
        // Parallax effect for hero background
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.floating-shapes .shape');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.1 + (index * 0.05);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.05}deg)`;
            });
        });

        // Fade in animation for elements
        this.initFadeInOnScroll();
    }

    initFadeInOnScroll() {
        const elements = document.querySelectorAll('.project-card, .timeline-card, .skill-category');
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    }

    // ===== PROJECT INTERACTIONS ===== //
    setupProjectInteractions() {
        // Project filtering
        this.setupProjectFiltering();
        
        // Project search
        this.setupProjectSearch();
    }

    setupProjectFiltering() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        if (!filterBtns.length) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                // Update active filter button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter projects
                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-category');
                    
                    if (filter === 'all' || categories.includes(filter)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    setupProjectSearch() {
        const searchInput = document.getElementById('projectSearch');
        const projectCards = document.querySelectorAll('.project-card');
        
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            projectCards.forEach(card => {
                const title = card.querySelector('.project-title')?.textContent.toLowerCase() || '';
                const description = card.querySelector('.project-description')?.textContent.toLowerCase() || '';
                const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
                
                const isVisible = title.includes(searchTerm) || 
                                description.includes(searchTerm) || 
                                tags.includes(searchTerm);
                
                if (isVisible) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    }

    // ===== LOADING SCREEN ===== //
    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loading');
        
        if (!loadingScreen) return;

        // Simulate loading time
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 1500);

        // Remove loading screen after transition
        setTimeout(() => {
            loadingScreen?.remove();
        }, 2000);
    }

    // ===== TYPING EFFECT ===== //
    initTypingEffect() {
        const typingElement = document.getElementById('typingText');
        
        if (!typingElement) return;

        const texts = [
            'Creative Developer',
            'AI Enthusiast',
            'Problem Solver',
            'Tech Innovator'
        ];
        
        let currentIndex = 0;
        let currentText = '';
        let isDeleting = false;
        
        const typeWriter = () => {
            const fullText = texts[currentIndex];
            
            if (isDeleting) {
                currentText = fullText.substring(0, currentText.length - 1);
            } else {
                currentText = fullText.substring(0, currentText.length + 1);
            }
            
            typingElement.textContent = currentText;
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && currentText === fullText) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && currentText === '') {
                isDeleting = false;
                currentIndex = (currentIndex + 1) % texts.length;
                typeSpeed = 500;
            }
            
            setTimeout(typeWriter, typeSpeed);
        };
        
        typeWriter();
    }

    // ===== COUNTER ANIMATIONS ===== //
    initCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const start = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(easeOutQuart * target);
                
                counter.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        };
        
        // Start counter animations when elements are in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    animateCounter(entry.target);
                }
            });
        });
        
        counters.forEach(counter => observer.observe(counter));
    }

    // ===== INTERSECTION OBSERVER ===== //
    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe project cards and other elements
        const elementsToObserve = document.querySelectorAll(
            '.project-card, .skill-category, .certification-item, .philosophy-content'
        );
        
        elementsToObserve.forEach(element => {
            observer.observe(element);
        });
    }

    // ===== TIMELINE ANIMATIONS (About Page) ===== //
    initTimelineAnimations() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        if (!timelineItems.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.3
        });

        timelineItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.2}s`;
            observer.observe(item);
        });
    }

    // ===== SKILL BAR ANIMATIONS ===== //
    initSkillBarAnimations() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        if (!skillBars.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const targetWidth = progressBar.getAttribute('data-progress');
                    
                    setTimeout(() => {
                        progressBar.style.width = `${targetWidth}%`;
                    }, 500);
                }
            });
        }, {
            threshold: 0.5
        });

        skillBars.forEach(bar => observer.observe(bar));
    }

    // ===== UTILITY METHODS ===== //
    
    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Smooth scroll to element
    scrollToElement(element, offset = 80) {
        const elementPosition = element.offsetTop - offset;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Initialize the site when DOM is ready
new CodeArtSite();

// ===== GLOBAL EVENT LISTENERS ===== //

// Handle window resize
window.addEventListener('resize', () => {
    // Recalculate layouts if needed
    const event = new CustomEvent('resize-complete');
    setTimeout(() => {
        window.dispatchEvent(event);
    }, 250);
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const mobileToggle = document.getElementById('mobileToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileMenu?.classList.contains('active')) {
            mobileToggle?.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
});

// Handle focus management for accessibility
document.addEventListener('focusin', (e) => {
    // Add focus-visible class for keyboard navigation
    if (e.target.matches('button, a, input, select, textarea, [tabindex]')) {
        e.target.classList.add('focus-visible');
    }
});

document.addEventListener('focusout', (e) => {
    e.target.classList.remove('focus-visible');
});

// ===== PERFORMANCE MONITORING ===== //

// Log performance metrics
window.addEventListener('load', () => {
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log(`Page load time: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
        console.log(`DOM content loaded: ${perfData.domContentLoadedEventEnd - perfData.fetchStart}ms`);
    }
});

// ===== EXPORT FOR MODULE USAGE ===== //
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeArtSite;
}