/**
 * Discovery Module
 * Handles GitHub and Dev.to API synchronization with atomic caching.
 */

export const DiscoveryModule = {
    CACHE_KEY: 'gh_projects_cache',
    CACHE_TTL: 6 * 60 * 60 * 1000,
    
    PROJECT_FALLBACKS: [
        { name: 'ipl-viz', language: 'JAVASCRIPT', description: 'Broadcast-grade cricket analytics dashboard. Replays every ball of every IPL match (2008–2025) with TV-style interface and tactical overlays.' },
        { name: 'manojpisini.github.io', language: 'JAVASCRIPT', description: 'Dynamic, minimalist portfolio built as a SPA using Tailwind CSS and Vanilla JS, featuring real-time GitHub API discovery.' },
        { name: 'manojpisini', language: 'MARKDOWN', description: 'Technical roadmap and profile configuration highlighting expertise in Systems, UI/UX, DevOps, and Database Arch.' }
    ],

    async fetchRepos(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const render = (repos, status = 'LATEST') => {
            container.innerHTML = repos.map(repo => `
                <div class="project-card" onclick="openExplorer('${repo.name}')" style="cursor: pointer;">
                    <div class="project-meta">${repo.language || 'TECH'} // ${status}</div>
                    <h3>${repo.name.toUpperCase()}</h3>
                    <p style="font-size: 0.9rem; margin-bottom: 20px;">${repo.description || 'No description available.'}</p>
                </div>
            `).join('');
        };

        const cached = localStorage.getItem(this.CACHE_KEY);
        if (cached) {
            const { timestamp, repos } = JSON.parse(cached);
            if (Date.now() - timestamp < this.CACHE_TTL) {
                return render(repos, 'LOCAL_CACHE_SYNC');
            }
        }

        try {
            const response = await fetch('https://api.github.com/users/manojpisini/repos?sort=updated&per_page=6');
            if (!response.ok) throw new Error(response.status === 403 ? 'RATE_LIMIT' : 'OFFLINE');
            
            const repos = await response.json();
            localStorage.setItem(this.CACHE_KEY, JSON.stringify({ timestamp: Date.now(), repos }));
            render(repos, 'LATEST');
        } catch (error) {
            render(this.PROJECT_FALLBACKS, 'VERIFIED_CACHE');
        }
    },

    async fetchBlog(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div id="discovery-status" class="mono-status mb-20">INITIALIZING_DISCOVERY...</div>
            <div id="blog-grid" class="standard-grid"></div>
        `;

        const statusEl = document.getElementById('discovery-status');
        const gridEl = document.getElementById('blog-grid');

        try {
            const manifestResponse = await fetch(`blog/manifest.json?v=${Date.now()}`);
            const manifestPosts = manifestResponse.ok ? await manifestResponse.json() : [];
            
            gridEl.innerHTML = manifestPosts.reverse().map(post => `
                 <div class="project-card" onclick="window.location.href='post.html?src=${post.file}'" style="cursor: pointer;">
                    <div class="project-meta">${post.date} // ARCHIVE</div>
                    <h3>${post.title}</h3>
                    <p style="font-size: 0.9rem;">${post.description}</p>
                </div>
            `).join('');
            
            statusEl.innerText = 'SYNCED_WITH_LOCAL_MANIFEST // MD_PROTOCOL_ACTIVE';

            // Parallel Discovery (Dev.to)
            this.fetchDevTo(gridEl);
        } catch (error) {
            gridEl.innerHTML = `<p class="error">BLOG_ENGINE_CRITICAL_FAILURE</p>`;
        }
    },

    async fetchDevTo(gridEl) {
        try {
            const response = await fetch('https://dev.to/api/articles?username=manojpisini&per_page=4');
            if (response.ok) {
                const articles = await response.json();
                gridEl.innerHTML += articles.map(post => `
                    <div class="project-card" onclick="window.location.href='${post.url}'" style="cursor: pointer;">
                        <div class="project-meta">${post.published_at.split('T')[0]} // SYNCED</div>
                        <h3>${post.title.toUpperCase()}</h3>
                        <p style="font-size: 0.9rem;">${post.description || ''}</p>
                    </div>
                `).join('');
            }
        } catch (e) { console.warn('DEVTO_SYNC_FAILED'); }
    }
};
