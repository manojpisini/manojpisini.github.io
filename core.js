/**
 * Systems Core Engine
 * Handles global state, theme management, and dynamic UI injection.
 */

export const CoreSystem = {
    init() {
        this.initTheme();
        this.renderCommonUI();
    },

    initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const htmlElement = document.documentElement;
        if (!themeToggle) return;

        const savedTheme = localStorage.getItem('theme') || 'dark';
        htmlElement.setAttribute('data-theme', savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            if (window.monaco && monaco.editor) {
                monaco.editor.setTheme(newTheme === 'dark' ? 'monochrome' : 'monochrome-light');
            }
        });
    },

    renderCommonUI() {
        // Dynamic Navigation Injection
        const headerBlocks = document.querySelectorAll('.system-header .header-block');
        const navContainer = headerBlocks[1]; // Second block
        
        if (navContainer && !navContainer.querySelector('nav')) {
            navContainer.innerHTML = `
                <nav>
                    <ul class="nav-links">
                        <li><a href="index.html" class="${window.location.pathname.endsWith('index.html') || window.location.pathname === '/' ? 'active' : ''}">HOME</a></li>
                        <li><a href="background.html" class="${window.location.pathname.endsWith('background.html') ? 'active' : ''}">BACKGROUND</a></li>
                        <li><a href="projects.html" class="${window.location.pathname.endsWith('projects.html') ? 'active' : ''}">PROJECTS</a></li>
                        <li><a href="blog.html" class="${window.location.pathname.endsWith('blog.html') ? 'active' : ''}">BLOG</a></li>
                        <li><a href="contact.html" class="${window.location.pathname.endsWith('contact.html') ? 'active' : ''}">CONTACT</a></li>
                    </ul>
                </nav>
            `;
        }

        // Dynamic Footer Injection
        const footer = document.querySelector('.system-footer');
        if (footer && !footer.querySelector('span') && !footer.querySelector('div')) {
            footer.innerHTML = `
                <div class="footer-left">© 2026 MANOJ PISINI // SYSTEMS ARCHITECT</div>
                <div class="footer-right">STATUS: OPERATIONAL // V1.0</div>
            `;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => CoreSystem.init());
