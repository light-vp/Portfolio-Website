// ===== THEME TOGGLE SYSTEM ===== //

class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        // Load saved theme or detect system preference
        this.loadTheme();
        
        // Set up theme toggle button
        this.setupThemeToggle();
        
        // Listen for system theme changes
        this.setupSystemThemeListener();
        
        // Apply initial theme
        this.applyTheme(this.currentTheme);
    }

    loadTheme() {
        // Check for saved theme in localStorage
        const savedTheme = localStorage.getItem('codeart-theme');
        
        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else {
            // Detect system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.currentTheme = 'dark';
            } else {
                this.currentTheme = 'light';
            }
        }
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Add keyboard support
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });

        // Add proper ARIA attributes
        this.updateToggleButton(themeToggle);
    }

    setupSystemThemeListener() {
        // Listen for changes in system color scheme preference
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!localStorage.getItem('codeart-theme')) {
                    this.currentTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme(this.currentTheme);
                    this.updateToggleButton();
                }
            });
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.saveTheme();
        this.updateToggleButton();
        
        // Trigger custom event for other components
        this.dispatchThemeChangeEvent();
    }

    applyTheme(theme) {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
        
        // Add transition class temporarily to smooth the change
        document.body.classList.add('theme-transitioning');
        
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    }

    updateMetaThemeColor(theme) {
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.setAttribute('name', 'theme-color');
            document.head.appendChild(themeColorMeta);
        }

        const themeColors = {
            light: '#e6ebe0', // sage color
            dark: '#1a1625'   // dark background
        };

        themeColorMeta.setAttribute('content', themeColors[theme]);
    }

    updateToggleButton(toggleButton = null) {
        const themeToggle = toggleButton || document.getElementById('themeToggle');
        
        if (!themeToggle) return;

        // Update ARIA label
        const label = this.currentTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
        themeToggle.setAttribute('aria-label', label);
        themeToggle.setAttribute('title', label);

        // Update button state
        themeToggle.classList.toggle('dark-mode', this.currentTheme === 'dark');
    }

    saveTheme() {
        localStorage.setItem('codeart-theme', this.currentTheme);
    }

    dispatchThemeChangeEvent() {
        const event = new CustomEvent('themeChange', {
            detail: {
                theme: this.currentTheme
            }
        });
        document.dispatchEvent(event);
    }

    themeManager = new ThemeManager();
    getCurrentTheme() {
        return this.currentTheme;
    }
}