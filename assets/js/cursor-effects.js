// ===== CUSTOM CURSOR EFFECTS ===== //

class CustomCursor {
    constructor() {
        this.cursor = null;
        this.follower = null;
        this.isSupported = this.checkSupport();
        this.isActive = false;
        
        if (this.isSupported) {
            this.init();
        }
    }

    checkSupport() {
        // Check if device supports custom cursor (desktop only)
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const hasTouch = 'ontouchstart' in window;
        const hasPointer = window.PointerEvent;
        
        return !isMobile && !hasTouch && window.innerWidth > 768;
    }

    init() {
        this.createCursorElements();
        this.setupEventListeners();
        this.setupInteractionEffects();
        this.startAnimation();
    }

    createCursorElements() {
        // Create cursor dot
        this.cursor = document.querySelector('.cursor');
        this.follower = document.querySelector('.cursor-follower');
        
        if (!this.cursor || !this.follower) {
            console.warn('Cursor elements not found in DOM');
            return;
        }

        // Hide default cursor
        document.body.style.cursor = 'none';
        
        // Set initial positions
        this.cursor.style.left = '50%';
        this.cursor.style.top = '50%';
        this.follower.style.left = '50%';
        this.follower.style.top = '50%';
    }

    setupEventListeners() {
        let mouseX = 0;
        let mouseY = 0;
        let followerX = 0;
        let followerY = 0;

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Update cursor position immediately
            if (this.cursor) {
                this.cursor.style.left = mouseX + 'px';
                this.cursor.style.top = mouseY + 'px';
            }
        });

        // Smooth follower animation
        const animateFollower = () => {
            const speed = 0.15;
            
            followerX += (mouseX - followerX) * speed;
            followerY += (mouseY - followerY) * speed;
            
            if (this.follower) {
                this.follower.style.left = followerX + 'px';
                this.follower.style.top = followerY + 'px';
            }
            
            requestAnimationFrame(animateFollower);
        };
        
        animateFollower();

        // Handle mouse enter/leave
        document.addEventListener('mouseenter', () => {
            this.showCursor();
        });

        document.addEventListener('mouseleave', () => {
            this.hideCursor();
        });

        // Handle window focus/blur
        window.addEventListener('focus', () => {
            this.showCursor();
        });

        window.addEventListener('blur', () => {
            this.hideCursor();
        });
    }

    setupInteractionEffects() {
        // Hover effects for interactive elements
        const interactiveElements = document.querySelectorAll(
            'a, button, .project-card, .cta-button, .filter-btn, .nav-link, [role="button"], .theme-toggle'
        );

        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.addHoverEffect();
                element.style.cursor = 'none';
            });

            element.addEventListener('mouseleave', () => {
                this.removeHoverEffect();
            });

            element.addEventListener('mousedown', () => {
                this.addClickEffect();
            });

            element.addEventListener('mouseup', () => {
                this.removeClickEffect();
            });
        });

        // Special effects for project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.addProjectHoverEffect();
            });

            card.addEventListener('mouseleave', () => {
                this.removeProjectHoverEffect();
            });
        });

        // Text selection effects
        document.addEventListener('selectstart', () => {
            this.addTextSelectEffect();
        });

        document.addEventListener('selectionchange', () => {
            if (window.getSelection().toString().length === 0) {
                this.removeTextSelectEffect();
            }
        });
    }

    showCursor() {
        if (this.cursor && this.follower) {
            this.cursor.style.opacity = '1';
            this.follower.style.opacity = '1';
            this.isActive = true;
        }
    }

    hideCursor() {
        if (this.cursor && this.follower) {
            this.cursor.style.opacity = '0';
            this.follower.style.opacity = '0';
            this.isActive = false;
        }
    }

    addHoverEffect() {
        if (!this.isActive) return;
        
        if (this.cursor) {
            this.cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            this.cursor.style.backgroundColor = 'var(--accent-secondary)';
        }
        
        if (this.follower) {
            this.follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            this.follower.style.borderColor = 'var(--accent-secondary)';
            this.follower.style.borderWidth = '3px';
        }
    }

    removeHoverEffect() {
        if (!this.isActive) return;
        
        if (this.cursor) {
            this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            this.cursor.style.backgroundColor = 'var(--accent-primary)';
        }
        
        if (this.follower) {
            this.follower.style.transform = 'translate(-50%, -50%) scale(1)';
            this.follower.style.borderColor = 'var(--accent-primary)';
            this.follower.style.borderWidth = '2px';
        }
    }

    addClickEffect() {
        if (!this.isActive) return;
        
        if (this.cursor) {
            this.cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        }
        
        if (this.follower) {
            this.follower.style.transform = 'translate(-50%, -50%) scale(0.8)';
        }
    }

    removeClickEffect() {
        if (!this.isActive) return;
        
        setTimeout(() => {
            if (this.cursor) {
                this.cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            }
            
            if (this.follower) {
                this.follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            }
        }, 100);
    }

    addProjectHoverEffect() {
        if (!this.isActive) return;
        
        if (this.cursor) {
            this.cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            this.cursor.style.backgroundColor = 'transparent';
            this.cursor.innerHTML = '<span style="font-size: 8px;">🔄</span>';
        }
        
        if (this.follower) {
            this.follower.style.transform = 'translate(-50%, -50%) scale(2)';
            this.follower.style.borderColor = 'var(--mint)';
            this.follower.style.borderStyle = 'dashed';
        }
    }

    removeProjectHoverEffect() {
        if (!this.isActive) return;
        
        if (this.cursor) {
            this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            this.cursor.style.backgroundColor = 'var(--accent-primary)';
            this.cursor.innerHTML = '';
        }
        
        if (this.follower) {
            this.follower.style.transform = 'translate(-50%, -50%) scale(1)';
            this.follower.style.borderColor = 'var(--accent-primary)';
            this.follower.style.borderStyle = 'solid';
        }
    }

    addTextSelectEffect() {
        if (!this.isActive) return;
        
        if (this.cursor) {
            this.cursor.style.backgroundColor = 'var(--coral)';
        }
        
        if (this.follower) {
            this.follower.style.borderColor = 'var(--coral)';
        }
    }

    removeTextSelectEffect() {
        if (!this.isActive) return;
        
        if (this.cursor) {
            this.cursor.style.backgroundColor = 'var(--accent-primary)';
        }
        
        if (this.follower) {
            this.follower.style.borderColor = 'var(--accent-primary)';
        }
    }

    startAnimation() {
        // Add subtle pulsing animation
        if (this.cursor) {
            this.cursor.style.animation = 'cursorPulse 2s ease-in-out infinite';
        }
    }

    // Method to update cursor based on theme
    updateForTheme(theme) {
        if (!this.isActive) return;
        
        const colors = {
            light: {
                primary: '#ed6a5a',
                secondary: '#9bc1bc'
            },
            dark: {
                primary: '#9bc1bc',
                secondary: '#ed6a5a'
            }
        };
        
        if (this.cursor) {
            this.cursor.style.backgroundColor = colors[theme].primary;
        }
        
        if (this.follower) {
            this.follower.style.borderColor = colors[theme].primary;
        }
    }

    // Method to destroy cursor (for cleanup)
    destroy() {
        if (this.cursor) {
            this.cursor.remove();
        }
        
        if (this.follower) {
            this.follower.remove();
        }
        
        document.body.style.cursor = 'auto';
    }
}

// ===== CURSOR TRAIL EFFECT ===== //

class CursorTrail {
    constructor() {
        this.trail = [];
        this.maxTrailLength = 10;
        this.isSupported = this.checkSupport();
        
        if (this.isSupported) {
            this.init();
        }
    }

    checkSupport() {
        return window.innerWidth > 768 && !('ontouchstart' in window);
    }

    init() {
        this.createTrailElements();
        this.setupTrailAnimation();
    }

    createTrailElements() {
        for (let i = 0; i < this.maxTrailLength; i++) {
            const trailDot = document.createElement('div');
            trailDot.className = 'cursor-trail-dot';
            trailDot.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--accent-primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                opacity: ${(this.maxTrailLength - i) / this.maxTrailLength * 0.5};
                transform: translate(-50%, -50%);
                transition: opacity 0.1s ease;
            `;
            
            document.body.appendChild(trailDot);
            this.trail.push({
                element: trailDot,
                x: 0,
                y: 0
            });
        }
    }

    setupTrailAnimation() {
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const updateTrail = () => {
            for (let i = this.trail.length - 1; i > 0; i--) {
                this.trail[i].x = this.trail[i - 1].x;
                this.trail[i].y = this.trail[i - 1].y;
            }
            
            this.trail[0].x = mouseX;
            this.trail[0].y = mouseY;
            
            this.trail.forEach((dot, index) => {
                dot.element.style.left = dot.x + 'px';
                dot.element.style.top = dot.y + 'px';
            });
            
            requestAnimationFrame(updateTrail);
        };
        
        updateTrail();
    }

    updateForTheme(theme) {
        const color = theme === 'dark' ? '#9bc1bc' : '#ed6a5a';
        
        this.trail.forEach(dot => {
            dot.element.style.backgroundColor = color;
        });
    }

    destroy() {
        this.trail.forEach(dot => {
            dot.element.remove();
        });
        this.trail = [];
    }
}

// ===== MAGNETIC CURSOR EFFECT ===== //

class MagneticCursor {
    constructor() {
        this.magneticElements = [];
        this.isSupported = this.checkSupport();
        
        if (this.isSupported) {
            this.init();
        }
    }

    checkSupport() {
        return window.innerWidth > 768 && !('ontouchstart' in window);
    }

    init() {
        this.setupMagneticElements();
        this.setupMagneticEffect();
    }

    setupMagneticElements() {
        // Add magnetic effect to specific elements
        const magneticSelectors = [
            '.cta-button',
            '.theme-toggle',
            '.logo',
            '.project-card .project-link'
        ];
        
        magneticSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                this.magneticElements.push(element);
                element.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
            });
        });
    }

    setupMagneticEffect() {
        document.addEventListener('mousemove', (e) => {
            this.magneticElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const distance = Math.sqrt(
                    Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
                );
                
                const maxDistance = 100; // Maximum distance for magnetic effect
                
                if (distance < maxDistance) {
                    const strength = (maxDistance - distance) / maxDistance;
                    const moveX = (e.clientX - centerX) * strength * 0.3;
                    const moveY = (e.clientY - centerY) * strength * 0.3;
                    
                    element.style.transform = `translate(${moveX}px, ${moveY}px)`;
                } else {
                    element.style.transform = 'translate(0px, 0px)';
                }
            });
        });
        
        // Reset position when mouse leaves window
        document.addEventListener('mouseleave', () => {
            this.magneticElements.forEach(element => {
                element.style.transform = 'translate(0px, 0px)';
            });
        });
    }
}

// ===== INITIALIZATION ===== //

// Initialize cursor effects when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add cursor pulse animation to stylesheet
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cursorPulse {
            0%, 100% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
            50% {
                transform: translate(-50%, -50%) scale(1.1);
                opacity: 0.8;
            }
        }
        
        .cursor-trail-dot {
            will-change: transform;
        }
        
        body.menu-open .cursor,
        body.menu-open .cursor-follower,
        body.menu-open .cursor-trail-dot {
            display: none;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize cursor effects
    const customCursor = new CustomCursor();
    const cursorTrail = new CursorTrail();
    const magneticCursor = new MagneticCursor();
    
    // Listen for theme changes
    document.addEventListener('themeChanged', (e) => {
        customCursor.updateForTheme(e.detail.theme);
        cursorTrail.updateForTheme(e.detail.theme);
    });
    
    // Make cursor effects globally available
    window.cursorEffects = {
        customCursor,
        cursorTrail,
        magneticCursor
    };
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        customCursor.destroy();
        cursorTrail.destroy();
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CustomCursor,
        CursorTrail,
        MagneticCursor
    };
}