/**
 * Systems Entry Point
 * Orchestrates feature discovery and interaction layers.
 */

import { DiscoveryModule } from './modules/discovery.js';
import { ExplorerModule } from './modules/explorer.js';

// Initialize Discovery Systems
document.addEventListener('DOMContentLoaded', () => {
    const isProjects = window.location.pathname.includes('projects.html');
    const isBlog = window.location.pathname.includes('blog.html');

    if (isProjects) {
        DiscoveryModule.fetchRepos('repo-container');
        ExplorerModule.initMonaco('monaco-container');
    }

    if (isBlog) {
        DiscoveryModule.fetchBlog('blog-container');
    }
});

// Explorer Global Handlers (for onclick in generated HTML)
window.openExplorer = (repo) => ExplorerModule.open(repo);
window.closeExplorer = () => ExplorerModule.closeExplorer?.() || (document.getElementById('repo-explorer').style.display = 'none');
window.switchActivity = (activity) => {
    const icons = document.querySelectorAll('.activity-icon');
    const sidebar = document.querySelector('.explorer-sidebar');
    const label = document.querySelector('.sidebar-label');
    const tree = document.getElementById('explorer-sidebar');
    const breadcrumbs = document.getElementById('explorer-breadcrumbs');
    
    const clickedIcon = document.getElementById(`activity-${activity}`);
    if (clickedIcon.classList.contains('active')) {
        sidebar.style.display = sidebar.style.display === 'none' ? 'flex' : 'none';
        return;
    }

    sidebar.style.display = 'flex';
    icons.forEach(icon => icon.classList.remove('active'));
    clickedIcon.classList.add('active');

    if (activity === 'files') {
        label.innerText = 'EXPLORER';
        tree.style.display = 'block';
        breadcrumbs.style.display = 'block';
        ExplorerModule.loadDirectory(ExplorerModule.currentPath);
    } else {
        label.innerText = activity.toUpperCase();
        tree.style.display = 'block';
        breadcrumbs.style.display = 'none';
        tree.innerHTML = `<div class="p-20 mono-status">SYSTEM_SERVICE_ACTIVE // NO_CHANGES</div>`;
    }
};

// Inertia-based Cursor (Optional Refactor candidate later)
// ... existing cursor logic if any, currently omitted for brevity as it was not in previous summary or viewed extensively ...
// Actually, looking at script.js from previous view_file, there was no cursor logic there.
// I'll stick to the core functionality.
