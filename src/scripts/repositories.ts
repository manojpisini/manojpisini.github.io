type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  stargazers_count: number;
  updated_at: string;
};

type GitHubFile = {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url: string | null;
};

const command = document.querySelector<HTMLElement>('[data-repo-command]');
const grid = document.getElementById('repo-grid');
const search = document.getElementById('repo-search') as HTMLInputElement | null;
const refresh = document.querySelector<HTMLButtonElement>('[data-refresh-repos]');
const dialog = document.getElementById('repo-dialog') as HTMLDialogElement | null;
const dialogTitle = document.getElementById('repo-dialog-title');
const dialogFiles = document.getElementById('repo-files');
const dialogPreview = document.getElementById('repo-preview');
const closeDialog = document.querySelector<HTMLButtonElement>('[data-close-dialog]');

const cacheKey = 'mp_astro_repos_v1';
const cacheTtl = 6 * 60 * 60 * 1000;
let repos: Repo[] = [];

const fallbackRepos = Array.from(document.querySelectorAll<HTMLElement>('[data-repo-card]')).map((card) => ({
  name: card.querySelector('h3')?.textContent?.toLowerCase() ?? 'repository',
  description: card.querySelector('p')?.textContent ?? '',
  language: card.querySelector('.project-meta')?.textContent?.split('//')[0].trim() ?? 'Tech',
  html_url: card.querySelector('a')?.getAttribute('href') ?? '#',
  stargazers_count: 0,
  updated_at: new Date().toISOString()
}));

function render(nextRepos: Repo[], status = 'LIVE_SYNC') {
  if (!grid) return;
  const query = search?.value.trim().toLowerCase() ?? '';
  const filtered = nextRepos.filter((repo) => {
    const target = `${repo.name} ${repo.description ?? ''} ${repo.language ?? ''}`.toLowerCase();
    return target.includes(query);
  });

  grid.innerHTML = filtered
    .map((repo) => {
      const updated = new Date(repo.updated_at).toISOString().slice(0, 10);
      return `
        <article class="project-card" data-open-repo="${repo.name}">
          <div class="project-meta">${repo.language ?? 'TECH'} // ${status} // ${updated}</div>
          <h3>${repo.name.toUpperCase()}</h3>
          <p>${repo.description ?? 'No description available.'}</p>
          <div class="link-stack">
            <a class="bold-link" href="${repo.html_url}" target="_blank" rel="noreferrer">GITHUB</a>
            <button class="icon-button" type="button" data-inspect-repo="${repo.name}">INSPECT</button>
          </div>
        </article>
      `;
    })
    .join('');
}

async function loadRepos(force = false) {
  if (!command) return;
  if (!force) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached) as { timestamp: number; repos: Repo[] };
      if (Date.now() - parsed.timestamp < cacheTtl) {
        repos = parsed.repos;
        render(repos, 'LOCAL_CACHE');
        return;
      }
    }
  }

  try {
    const response = await fetch('https://api.github.com/users/manojpisini/repos?sort=updated&per_page=9');
    if (!response.ok) throw new Error(`GITHUB_${response.status}`);
    repos = await response.json();
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), repos }));
    render(repos);
  } catch {
    repos = fallbackRepos as Repo[];
    render(repos, 'VERIFIED_CACHE');
  }
}

async function inspectRepo(repoName: string) {
  if (!dialog || !dialogTitle || !dialogFiles || !dialogPreview) return;
  dialogTitle.textContent = `GITHUB/${repoName.toUpperCase()}`;
  dialogFiles.innerHTML = '<p class="section-eyebrow" style="padding: 14px;">FETCHING_TREE</p>';
  dialogPreview.textContent = 'SELECT_FILE_TO_VIEW';
  dialog.showModal();

  try {
    const response = await fetch(`https://api.github.com/repos/manojpisini/${repoName}/contents/`);
    if (!response.ok) throw new Error('TREE_UNAVAILABLE');
    const files = (await response.json()) as GitHubFile[];
    dialogFiles.innerHTML = files
      .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1))
      .map(
        (file) => `
          <button class="repo-file-button" type="button" data-file-url="${file.download_url ?? ''}" ${file.type === 'dir' ? 'disabled' : ''}>
            ${file.type.toUpperCase()} // ${file.name.toUpperCase()}
          </button>
        `
      )
      .join('');
  } catch (error) {
    dialogFiles.innerHTML = '<p class="section-eyebrow" style="padding: 14px;">TREE_UNAVAILABLE</p>';
  }
}

grid?.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const button = target.closest<HTMLButtonElement>('[data-inspect-repo]');
  if (button?.dataset.inspectRepo) inspectRepo(button.dataset.inspectRepo);
});

dialogFiles?.addEventListener('click', async (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-file-url]');
  const url = button?.dataset.fileUrl;
  if (!url || !dialogPreview) return;
  dialogPreview.textContent = 'FETCHING_BLOB';
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('BLOB_UNAVAILABLE');
    dialogPreview.textContent = await response.text();
  } catch {
    dialogPreview.textContent = 'BLOB_UNAVAILABLE';
  }
});

search?.addEventListener('input', () => render(repos));
refresh?.addEventListener('click', () => loadRepos(true));
closeDialog?.addEventListener('click', () => dialog?.close());

loadRepos();

export {};
