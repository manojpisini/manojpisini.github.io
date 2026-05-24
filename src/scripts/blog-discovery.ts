type DevToArticle = {
  title: string;
  description: string;
  url: string;
  published_at: string;
};

const grid = document.getElementById('blog-grid');

async function appendDevToArticles() {
  if (!grid) return;
  try {
    const response = await fetch('/blog/devto-cache.json');
    if (!response.ok) return;
    const articles = (await response.json()) as DevToArticle[];
    if (!Array.isArray(articles) || articles.length === 0) return;

    grid.insertAdjacentHTML(
      'beforeend',
      articles
        .map(
          (post) => `
            <article class="project-card">
              <div class="project-meta">${post.published_at.slice(0, 10)} // DEVTO_CACHE</div>
              <h3>${post.title.toUpperCase()}</h3>
              <p>${post.description ?? ''}</p>
              <a class="bold-link" href="${post.url}" target="_blank" rel="noreferrer">READ_DEVTO</a>
            </article>
          `
        )
        .join('')
    );
  } catch {
    // The local markdown archive remains the authoritative fallback.
  }
}

appendDevToArticles();

export {};
