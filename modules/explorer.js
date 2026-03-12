/**
 * Explorer Module
 * Manages the Monaco-powered Repo Explorer and resilient browsing system.
 */

export const ExplorerModule = {
    currentRepo: '',
    currentPath: '',
    openTabs: [],
    monacoEditor: null,

    FALLBACKS: {
        'ipl-viz': {
            '': [
                { name: 'src', type: 'dir', path: 'src' },
                { name: 'public', type: 'dir', path: 'public' },
                { name: 'package.json', type: 'file', path: 'package.json' },
                { name: 'README.md', type: 'file', path: 'README.md' }
            ],
            'src': [
                { name: 'components', type: 'dir', path: 'src/components' },
                { name: 'utils', type: 'dir', path: 'src/utils' },
                { name: 'App.js', type: 'file', path: 'src/App.js' },
                { name: 'index.js', type: 'file', path: 'src/index.js' }
            ]
        },
        'manojpisini': {
            '': [
                { name: 'README.md', type: 'file', path: 'README.md' },
                { name: 'profile-config.json', type: 'file', path: 'profile-config.json' }
            ]
        }
    },

    initMonaco(containerId) {
        if (typeof require === 'undefined') return;
        
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }});
        require(['vs/editor/editor.main'], () => {
            this.defineThemes();
            
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            this.monacoEditor = monaco.editor.create(document.getElementById(containerId), {
                theme: isLight ? 'monochrome-light' : 'monochrome',
                readOnly: true,
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: 'JetBrains Mono'
            });
            document.getElementById(containerId).style.display = 'none';
        });
    },

    defineThemes() {
        monaco.editor.defineTheme('monochrome', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '666666', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'bd93f9', fontStyle: 'bold' },
                { token: 'string', foreground: '50fa7b' },
                { token: 'function', foreground: '8be9fd' },
                { token: 'type', foreground: '8be9fd' },
                { token: 'number', foreground: 'ff79c6' },
                { token: 'operator', foreground: 'ffffff' }
            ],
            colors: {
                'editor.background': '#000000',
                'editor.foreground': '#ffffff',
                'editor.lineHighlightBackground': '#1a1a1a',
                'editorCursor.foreground': '#ffffff',
                'editorIndentGuide.background': '#333333'
            }
        });
        
        monaco.editor.defineTheme('monochrome-light', {
            base: 'vs',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '333333', fontStyle: 'italic' },
                { token: 'keyword', foreground: '9333ea', fontStyle: 'bold' },
                { token: 'string', foreground: '16a34a' },
                { token: 'function', foreground: '0284c7' },
                { token: 'type', foreground: '0284c7' },
                { token: 'number', foreground: 'be185d' },
                { token: 'operator', foreground: '000000' }
            ],
            colors: {
                'editor.background': '#ffffff',
                'editor.foreground': '#000000',
                'editor.lineHighlightBackground': '#f0f0f0',
                'editorCursor.foreground': '#000000',
                'editorIndentGuide.background': '#dddddd'
            }
        });
    },

    async open(repoName) {
        this.currentRepo = repoName;
        this.currentPath = '';
        this.openTabs = [];
        
        document.getElementById('explorer-repo-link').href = `https://github.com/manojpisini/${repoName}`;
        document.getElementById('explorer-repo-link').innerText = `[GITHUB/${repoName.toUpperCase()}]`;
        document.getElementById('repo-explorer').style.display = 'block';
        document.getElementById('explorer-title').innerText = `MANOJ@PORTFOLIO:~/${repoName.toUpperCase()}`;
        document.getElementById('status-repo-name').innerText = repoName.toUpperCase();
        document.getElementById('editor-tabs').innerHTML = '';
        document.body.style.overflow = 'hidden';
        
        this.loadDirectory('');
    },

    async loadDirectory(path) {
        this.currentPath = path;
        const sidebar = document.getElementById('explorer-sidebar');
        this.updateBreadcrumbs(path);
        
        sidebar.innerHTML = '<p class="mono-status p-20">FETCHING_CONTENTS...</p>';
        
        try {
            const response = await fetch(`https://api.github.com/repos/manojpisini/${this.currentRepo}/contents/${path}`);
            if (response.status === 403) throw new Error('RATE_LIMIT');
            if (!response.ok) throw new Error('FAILED');
            
            const contents = await response.json();
            const sorted = contents.sort((a,b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1));
            
            sidebar.innerHTML = sorted.map(item => `
                <div class="explorer-item ${item.type}" onclick="ExplorerModule.${item.type === 'dir' ? 'loadDirectory' : 'loadFile'}('${item.path}')">
                    ${item.name.toUpperCase()}
                </div>
            `).join('');
        } catch (e) {
            const fallback = this.FALLBACKS[this.currentRepo]?.[path];
            if (fallback) {
                sidebar.innerHTML = fallback.map(item => `
                    <div class="explorer-item ${item.type}" onclick="ExplorerModule.${item.type === 'dir' ? 'loadDirectory' : 'loadFile'}('${item.path}')">
                        ${item.name.toUpperCase()}
                    </div>
                `).join('');
            } else {
                sidebar.innerHTML = `<p class="p-20">${e.message === 'RATE_LIMIT' ? 'RATE_LIMIT_HIT' : 'FETCH_FAILED'}</p>`;
            }
        }
    },

    async loadFile(path) {
        const placeholder = document.getElementById('explorer-placeholder');
        const container = document.getElementById('monaco-container');
        
        this.updateTabs(path, path.split('/').pop().toUpperCase());
        placeholder.style.display = 'none';
        container.style.display = 'block';
        
        try {
            const response = await fetch(`https://api.github.com/repos/manojpisini/${this.currentRepo}/contents/${path}`);
            if (!response.ok) throw new Error();
            
            const data = await response.json();
            const content = atob(data.content);
            const extension = path.split('.').pop();
            const langMap = { 'js': 'javascript', 'ts': 'typescript', 'py': 'python', 'html': 'html', 'css': 'css', 'json': 'json', 'md': 'markdown' };
            
            const model = monaco.editor.createModel(content, langMap[extension] || 'plaintext');
            this.monacoEditor.setModel(model);
        } catch (e) {
            placeholder.style.display = 'flex';
            placeholder.innerText = 'ERROR_ACCESSING_BLOB';
            container.style.display = 'none';
        }
    },

    updateTabs(path, name) {
        const tabContainer = document.getElementById('editor-tabs');
        if (!this.openTabs.find(t => t.path === path)) this.openTabs.push({path, name});
        
        tabContainer.innerHTML = this.openTabs.map(t => `
            <div class="tab ${t.path === path ? 'active' : ''}" onclick="ExplorerModule.loadFile('${t.path}')">
                <span>${t.name}</span>
                <span class="tab-close" onclick="ExplorerModule.closeTab(event, '${t.path}')">X</span>
            </div>
        `).join('');
    },

    closeTab(event, path) {
        event.stopPropagation();
        this.openTabs = this.openTabs.filter(t => t.path !== path);
        if (this.openTabs.length === 0) {
            document.getElementById('editor-tabs').innerHTML = '';
            document.getElementById('monaco-container').style.display = 'none';
            document.getElementById('explorer-placeholder').style.display = 'flex';
        } else {
            const last = this.openTabs[this.openTabs.length - 1];
            this.loadFile(last.path);
        }
    },

    updateBreadcrumbs(path) {
        const bc = document.getElementById('explorer-breadcrumbs');
        const parts = path.split('/').filter(p => p);
        let html = `<span onclick="ExplorerModule.loadDirectory('')" style="cursor:pointer;">ROOT</span>`;
        let current = '';
        parts.forEach((p, i) => {
            current += (i === 0 ? '' : '/') + p;
            html += ` / <span onclick="ExplorerModule.loadDirectory('${current}')" style="cursor:pointer;">${p.toUpperCase()}</span>`;
        });
        bc.innerHTML = html;
    }
};

window.ExplorerModule = ExplorerModule; // Exposure for onclick handlers
