const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

themeToggle?.addEventListener('click', () => {
  const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', nextTheme);
  localStorage.setItem('theme', nextTheme);
  document.dispatchEvent(new CustomEvent('themechange', { detail: nextTheme }));
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.project-card, .content-panel, .timeline-item').forEach((element) => {
  element.classList.add('reveal');
  observer.observe(element);
});
