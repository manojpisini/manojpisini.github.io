/* ──────────────────────────────────────────────────────────
   MANOJPISINI.GITHUB.IO — Shared Interaction Layer
   Cursor, nav, glitch, fade — the raw machinery.
   ────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  /* ── CUSTOM CURSOR ────────────────────────────────────── */

  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");

  if (dot && ring) {
    let mouseX = 0,
      mouseY = 0;
    let ringX = 0,
      ringY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
    });

    // ring follows with slight lag for mechanical feel
    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // expand ring on hoverable elements
    const hoverTargets = document.querySelectorAll(
      "a, button, .brutal-card, .repo-card, .text-glitch, [data-hover]",
    );
    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("expanded"));
      el.addEventListener("mouseleave", () =>
        ring.classList.remove("expanded"),
      );
    });
  }

  /* ── MOBILE NAV TOGGLE ────────────────────────────────── */

  const toggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-links");

  if (toggle && navMenu) {
    toggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const spans = toggle.querySelectorAll("span");
      toggle.setAttribute("aria-expanded", navMenu.classList.contains("open"));

      if (navMenu.classList.contains("open")) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(-45deg) translate(6px, -6px)";
      } else {
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      }
    });
  }

  /* ── ACTIVE NAV LINK ──────────────────────────────────── */

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  /* ── TEXT-GLITCH ON HOVER ─────────────────────────────── */

  const glitchChars = "!<>-_\\/[]{}—=+*^?#_____";

  document.querySelectorAll(".text-glitch").forEach((el) => {
    const original = el.textContent;
    let interval = null;

    el.addEventListener("mouseenter", () => {
      let iteration = 0;
      clearInterval(interval);

      interval = setInterval(() => {
        el.textContent = original
          .split("")
          .map((char, idx) => {
            if (idx < iteration) return original[idx];
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          })
          .join("");

        iteration += 1 / 2;
        if (iteration >= original.length) {
          clearInterval(interval);
          el.textContent = original;
        }
      }, 30);
    });

    el.addEventListener("mouseleave", () => {
      clearInterval(interval);
      el.textContent = original;
    });
  });

  /* ── TYPING EFFECT (Home page) ────────────────────────── */

  const typingEl = document.getElementById("typing-text");
  if (typingEl) {
    const phrases = [
      ">_ Compiling systems...",
      ">_ Architecting UI...",
      ">_ Deploying to edge...",
      ">_ Profiling markets...",
      ">_ Optimizing pipelines...",
      ">_ Analyzing data flows...",
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;

    function typeLoop() {
      const current = phrases[phraseIdx];

      if (!deleting) {
        typingEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;

        if (charIdx === current.length) {
          deleting = true;
          setTimeout(typeLoop, 2000); // pause at full phrase
          return;
        }
        setTimeout(typeLoop, 60);
      } else {
        typingEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;

        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(typeLoop, 400);
          return;
        }
        setTimeout(typeLoop, 30);
      }
    }

    setTimeout(typeLoop, 800);
  }

  /* ── GITHUB REPO FETCH (Projects page) ────────────────── */

  const repoGrid = document.getElementById("repo-grid");
  const filterBar = document.getElementById("filter-bar");
  let allRepos = [];

  if (repoGrid) {
    fetchRepos();
  }

  async function fetchRepos() {
    renderSkeletons(repoGrid, 6);

    try {
      const res = await fetch(
        "https://api.github.com/users/manojpisini/repos?sort=updated&per_page=30",
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      allRepos = await res.json();
      renderRepos(allRepos);
      renderFilters(allRepos);
    } catch (err) {
      repoGrid.innerHTML = renderTerminalError("[ERR]", err.message);
    }
  }

  function renderRepos(repos) {
    repoGrid.innerHTML = "";
    if (repos.length === 0) {
      repoGrid.innerHTML = renderTerminalError(
        "[EMPTY]",
        "No matching repositories found.",
      );
      return;
    }
    repos.forEach((repo) => {
      repoGrid.insertAdjacentHTML("beforeend", renderRepoCard(repo));
    });
  }

  function renderFilters(repos) {
    if (!filterBar) return;

    const languages = [...new Set(repos.map((r) => r.language).filter(Boolean))];
    filterBar.innerHTML = `<button class="filter-btn active" data-lang="all">All</button>`;

    languages.forEach((lang) => {
      filterBar.insertAdjacentHTML(
        "beforeend",
        `<button class="filter-btn" data-lang="${lang}">${lang}</button>`,
      );
    });

    filterBar.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");

        // UI toggle
        filterBar
          .querySelectorAll(".filter-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Filter logic
        const filtered =
          lang === "all" ? allRepos : allRepos.filter((r) => r.language === lang);
        renderRepos(filtered);
      });
    });
  }

  function renderSkeletons(container, count) {
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
      container.insertAdjacentHTML(
        "beforeend",
        '<div class="skeleton-card"></div>',
      );
    }
  }

  function renderRepoCard(repo) {
    const langColor = getLanguageColor(repo.language);
    const desc = repo.description || "No description provided.";

    return `
      <a href="repo.html?name=${repo.name}" class="repo-card block group">
        <div class="repo-card__name group-hover:underline decoration-accent underline-offset-4">
          ${repo.name}
        </div>
        <p class="repo-card__desc">${escapeHtml(desc)}</p>
        <div class="repo-card__meta">
          ${repo.language ? `<span><span class="repo-card__lang-dot" style="background:${langColor}"></span>${repo.language}</span>` : ""}
          <span>★ ${repo.stargazers_count}</span>
          <span>⑂ ${repo.forks_count}</span>
        </div>
      </a>
    `;
  }

  function renderTerminalError(code, msg) {
    return `
      <div class="terminal-error" style="grid-column: 1 / -1;">
        <div class="terminal-error__code">${code}</div>
        <div class="terminal-error__msg">${escapeHtml(msg)}</div>
      </div>
    `;
  }

  // sanitize user-generated content
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // rough mapping of GitHub language colors
  function getLanguageColor(lang) {
    const colors = {
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      Python: "#3572A5",
      Rust: "#dea584",
      Go: "#00ADD8",
      HTML: "#e34c26",
      CSS: "#563d7c",
      Shell: "#89e051",
      Dart: "#00B4AB",
      C: "#555555",
      "C++": "#f34b7d",
      Java: "#b07219",
      Ruby: "#701516",
    };
    return colors[lang] || "#0066ff";
  }

  /* ── COMMAND PALETTE (CTRL+K) ────────────────────────── */

  const paletteHtml = `
    <div class="cmd-palette" id="cmd-palette">
      <div class="cmd-modal">
        <input type="text" class="cmd-input" id="cmd-input" placeholder="Search pages or projects..." autocomplete="off">
        <div class="cmd-results" id="cmd-results"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", paletteHtml);

  const palette = document.getElementById("cmd-palette");
  const cmdInput = document.getElementById("cmd-input");
  const cmdResults = document.getElementById("cmd-results");

  const navItems = [
    { name: "Home", url: "index.html", type: "page" },
    { name: "About", url: "about.html", type: "page" },
    { name: "Projects", url: "projects.html", type: "page" },
    { name: "Blog", url: "blog.html", type: "page" },
    { name: "Contact", url: "contact.html", type: "page" },
    { name: "Download Resume", url: "files/Manoj_Pisini_FullStack_Engineer_2025.pdf", type: "download" },
    { name: "View API (Resume)", url: "api/resume.json", type: "api" },
  ];

  let selectedIdx = 0;
  let currentResults = [];

  function openPalette() {
    palette.classList.add("open");
    cmdInput.focus();
    renderPaletteResults("");
  }

  function closePalette() {
    palette.classList.remove("open");
    cmdInput.value = "";
  }

  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      palette.classList.contains("open") ? closePalette() : openPalette();
    }
    if (e.key === "Escape") closePalette();

    if (palette.classList.contains("open")) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIdx = (selectedIdx + 1) % currentResults.length;
        updateSelection();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIdx = (selectedIdx - 1 + currentResults.length) % currentResults.length;
        updateSelection();
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const item = currentResults[selectedIdx];
        if (item.type === "download") {
          const a = document.createElement("a");
          a.href = item.url;
          a.download = "Manoj_Pisini_Resume_2025.pdf";
          a.click();
        } else {
          window.location.href = item.url;
        }
        closePalette();
      }
    }
  });

  cmdInput.addEventListener("input", (e) => {
    renderPaletteResults(e.target.value);
  });

  function renderPaletteResults(query) {
    const q = query.toLowerCase();
    currentResults = navItems.filter(item => item.name.toLowerCase().includes(q));
    
    cmdResults.innerHTML = currentResults.map((item, idx) => `
      <div class="cmd-item ${idx === 0 ? "selected" : ""}" data-idx="${idx}">
        <span>${item.name} <span class="text-[10px] opacity-40">[${item.type}]</span></span>
        <span class="cmd-shortcut">ENTER</span>
      </div>
    `).join("");
    
    selectedIdx = 0;
    updateSelection();
  }

  function updateSelection() {
    const items = cmdResults.querySelectorAll(".cmd-item");
    items.forEach((el, idx) => {
      el.classList.toggle("selected", idx === selectedIdx);
      if (idx === selectedIdx) el.scrollIntoView({ block: "nearest" });
    });
  }

  /* ── DEV.TO BLOG FETCH ───────────────────────────────── */

  const dedicatedBlogGrid = document.getElementById("dedicated-blog-grid");

  if (dedicatedBlogGrid) fetchBlogs(dedicatedBlogGrid, 10);

  async function fetchBlogs(container, count) {
    try {
      const res = await fetch(`https://dev.to/api/articles?username=manojpisini&per_page=${count}`);
      if (!res.ok) throw new Error("Blog unreachable");
      const posts = await res.json();
      
      if (posts.length === 0) {
        container.innerHTML = `<p style="color:var(--muted)">No recent broadcasts found on Dev.to. Check back later.</p>`;
        return;
      }

      container.innerHTML = posts.map(post => `
        <a href="${post.url}" target="_blank" class="brutal-card block hover:scale-[1.02] transition-transform">
          <div class="text-[10px] font-bold text-accent mb-2 uppercase tracking-widest">${new Date(post.published_at).toLocaleDateString()}</div>
          <h3 class="font-bold text-lg mb-2">${post.title}</h3>
          <p class="text-sm text-muted line-clamp-2">${post.description}</p>
        </a>
      `).join("");
    } catch (err) {
      console.warn("Blog fetch failed", err);
    }
  }

  /* ── REPO VIEWER LOGIC (repo.html) ────────────────────── */

  const repoTitle = document.getElementById("repo-title");
  const repoDesc = document.getElementById("repo-desc");
  const repoStats = document.getElementById("repo-stats");
  const githubLink = document.getElementById("github-link");
  const treeRoot = document.getElementById("file-tree-root");
  const breadcrumbsList = document.getElementById("repo-breadcrumbs");
  const fileContent = document.getElementById("file-content");
  const contentLabel = document.getElementById("content-label");

  let repoState = {
    name: "",
    path: "",
    data: null
  };

  if (repoTitle) {
    const urlParams = new URLSearchParams(window.location.search);
    repoState.name = urlParams.get("name");

    if (!repoState.name) {
      window.location.href = "projects.html";
    } else {
      initRepoViewer();
    }
  }

  async function initRepoViewer() {
    await fetchRepoInfo();
    await fetchRepoContents("");
    fetchReadme();
  }

  async function fetchRepoInfo() {
    try {
      const res = await fetch(`https://api.github.com/repos/manojpisini/${repoState.name}`);
      if (!res.ok) throw new Error("Repo unreachable");
      
      repoState.data = await res.json();
      repoTitle.textContent = repoState.data.name;
      repoDesc.textContent = repoState.data.description || "No description available.";
      githubLink.href = repoState.data.html_url;
      
      repoStats.innerHTML = `
        <span>FORKS: ${repoState.data.forks_count}</span>
        <span>STARS: ${repoState.data.stargazers_count}</span>
        <span>LICENSE: ${repoState.data.license ? repoState.data.license.spdx_id : "NONE"}</span>
      `;
    } catch (err) {
      console.error(err);
      repoTitle.textContent = "Offline/Error";
    }
  }

  async function fetchRepoContents(path = "") {
    repoState.path = path;
    const baseUrl = `https://api.github.com/repos/manojpisini/${repoState.name}/contents/${path}`;
    
    renderBreadcrumbs();
    treeRoot.innerHTML = '<div class="skeleton-line w-full h-4"></div>';

    try {
      const res = await fetch(baseUrl);
      if (!res.ok) throw new Error("Contents unreachable");
      
      const items = await res.json();
      items.sort((a, b) => (a.type === b.type ? 0 : a.type === "dir" ? -1 : 1));
      
      treeRoot.innerHTML = "";
      items.forEach(item => {
        const el = document.createElement("div");
        el.className = `tree-item tree-item--${item.type}`;
        el.innerHTML = `<span>${item.type === "dir" ? "📁" : "📄"}</span><span>${item.name}</span>`;
        
        if (item.type === "dir") {
          el.onclick = () => fetchRepoContents(item.path);
        } else {
          el.onclick = () => fetchFileContent(item);
        }
        treeRoot.appendChild(el);
      });
    } catch (err) {
      treeRoot.innerHTML = `<div class="text-xs text-red-500">FAILED_TO_FETCH_CONTENTS</div>`;
    }
  }

  function fetchReadme() {
    // Initial load readme
    fetch(`https://api.github.com/repos/manojpisini/${repoState.name}/readme`, {
      headers: { Accept: "application/vnd.github.v3.raw" }
    })
    .then(res => res.ok ? res.text() : null)
    .then(text => {
      if (text) {
        fileContent.innerHTML = marked.parse(text);
        contentLabel.textContent = "README.md";
      } else {
        fileContent.innerHTML = "<p class='text-muted'>README not found.</p>";
      }
    });
  }

  function getPrismLanguage(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    const map = {
      js: "javascript",
      ts: "typescript",
      py: "python",
      rs: "rust",
      go: "go",
      html: "markup",
      css: "css",
      json: "json",
      md: "markdown",
      sh: "bash",
      yml: "yaml",
      yaml: "yaml",
    };
    return map[ext] || "plain";
  }

  async function fetchFileContent(item) {
    contentLabel.textContent = item.name;
    fileContent.innerHTML = '<div class="skeleton-line w-full h-8 mb-4"></div><div class="skeleton-line w-full h-4 mb-2"></div>';

    try {
      const isMarkdown = item.name.toLowerCase().endsWith(".md");
      const headers = {
        Accept: isMarkdown ? "application/vnd.github.v3.html" : "application/vnd.github.v3.raw"
      };

      const res = await fetch(item.url, { headers });
      if (!res.ok) throw new Error("File unavailable");

      if (isMarkdown) {
        const text = await res.text();
        // Client-side parse with HTML support enabled by default in marked
        fileContent.innerHTML = marked.parse(text);
      } else {
        const text = await res.text();
        const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const lang = getPrismLanguage(item.name);
        fileContent.innerHTML = `<pre class="line-numbers language-${lang}"><code class="language-${lang}">${escaped}</code></pre>`;
        
        // Trigger Prism
        if (window.Prism) {
          const codeEl = fileContent.querySelector("code");
          Prism.highlightElement(codeEl);
        }
      }
    } catch (err) {
      fileContent.innerHTML = `<p class="text-red-500">Error: ${err.message}</p>`;
    }
  }

  function renderBreadcrumbs() {
    const parts = repoState.path.split("/").filter(Boolean);
    breadcrumbsList.innerHTML = "";

    // Root / Repo Name
    const rootItem = document.createElement("span");
    rootItem.className = "breadcrumb-item";
    rootItem.textContent = repoState.name;
    rootItem.onclick = () => fetchRepoContents("");
    breadcrumbsList.appendChild(rootItem);

    let currentPath = "";
    parts.forEach((p, i) => {
      // Separator
      const sep = document.createElement("span");
      sep.className = "breadcrumb-separator";
      sep.textContent = " / ";
      breadcrumbsList.appendChild(sep);

      // Path Piece
      currentPath += (i === 0 ? "" : "/") + p;
      const targetPath = currentPath;
      const item = document.createElement("span");
      item.className = "breadcrumb-item";
      item.textContent = p;
      item.onclick = () => fetchRepoContents(targetPath);
      breadcrumbsList.appendChild(item);
    });
  }

  /* ── INTERACTIVE TERMINAL SIMULATION ─────────────────── */

  const codeShowcase = document.getElementById("code-showcase");
  const langLabel = document.getElementById("terminal-lang");

  if (codeShowcase) {
    const simulations = [
      {
        lang: "Systems_C_Rust",
        steps: [
          { type: "cmd", text: "gcc -O3 matrix_core.c -o core" },
          { type: "log", text: "[OK] Binary optimized for AVX-512." },
          { type: "cmd", text: "cargo build --release" },
          { type: "log", text: "   Compiling safety_hook v0.4.2\n   Finished release [optimized] target(s)" }
        ]
      },
      {
        lang: "Enterprise_Java_Net",
        steps: [
          { type: "cmd", text: "mvn clean compile" },
          { type: "log", text: "[INFO] BUILD SUCCESS (1.2s)" },
          { type: "cmd", text: "dotnet build TacticalAPI.csproj" },
          { type: "log", text: "TacticalAPI -> ./bin/Release/net8.0/TacticalAPI.dll" }
        ]
      },
      {
        lang: "Fullstack_TS_React",
        steps: [
          { type: "cmd", text: "npm run dev:react" },
          { type: "log", text: "VITE v5.1.0  ready in 142ms\n  ➜  Local:   http://localhost:5173/" },
          { type: "cmd", text: "nest start --watch" },
          { type: "log", text: "[Nest] 10/10 modules initialized.\n[Nest] Server listening on port 3000." }
        ]
      },
      {
        lang: "Data_Infra_Docker",
        steps: [
          { type: "cmd", text: "docker-compose up -d" },
          { type: "log", text: "Creating network \"tactical_net\"\nCreating container \"postgres_db\"... done\nCreating container \"mongo_node\"... done" },
          { type: "cmd", text: "npx prisma db push" },
          { type: "log", text: "🚀  Database is now in sync with your Prisma schema." }
        ]
      },
      {
        lang: "Intelligence_Go_Py",
        steps: [
          { type: "cmd", text: "python manage.py migrate" },
          { type: "log", text: "Operations: 12 applied (Django 5.0)" },
          { type: "cmd", text: "go build -o api_gateway" },
          { type: "log", text: "[GO] Binary compiled: ./api_gateway (8.4MB)" }
        ]
      }
    ];

    let simIdx = 0;

    async function runSimulation() {
      const sim = simulations[simIdx];
      langLabel.textContent = sim.lang.toUpperCase();
      codeShowcase.innerHTML = "";
      
      for (const step of sim.steps) {
        if (step.type === "cmd") await typeCommand(step.text);
        else await showLog(step.text);
        await new Promise(r => setTimeout(r, 600));
      }

      simIdx = (simIdx + 1) % simulations.length;
      setTimeout(runSimulation, 3000);
    }

    async function typeCommand(text) {
      const line = document.createElement("div");
      line.className = "code-line";
      line.innerHTML = `<span class="code-accent">$</span> `;
      codeShowcase.appendChild(line);
      
      const cmdSpan = document.createElement("span");
      line.appendChild(cmdSpan);

      for (const char of text) {
        cmdSpan.textContent += char;
        await new Promise(r => setTimeout(r, Math.random() * 50 + 20));
      }
    }

    async function showLog(text) {
      for (const l of text.split("\n")) {
        const line = document.createElement("div");
        line.className = "code-line code-muted";
        line.textContent = l;
        codeShowcase.appendChild(line);
        codeShowcase.scrollTop = codeShowcase.scrollHeight;
        await new Promise(r => setTimeout(r, 100));
      }
    }

    runSimulation();
  }

  function updateTelemetry() {
    const latEl = document.getElementById("telemetry-latency");
    const upEl = document.getElementById("telemetry-uptime");

    if (latEl) {
      const ms = Math.floor(Math.random() * 45) + 22;
      latEl.textContent = `${ms}ms`;
    }
    if (upEl) {
      // Very slight fluctuation to look "real"
      const up = (99.98 + Math.random() * 0.01).toFixed(2);
      upEl.textContent = `${up}%`;
    }
  }

  updateTelemetry();
  setInterval(updateTelemetry, 30000);
})();
