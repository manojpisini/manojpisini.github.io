(function () {
  "use strict";

  /* ── INTERACTIVE BOUNDARY (CURSOR) ────────────────── */

  const cursor_dot = document.querySelector(".cursor-dot");
  const cursor_ring = document.querySelector(".cursor-ring");

  if (cursor_dot && cursor_ring) {
    let raw_x = 0, raw_y = 0;
    let ring_x = 0, ring_y = 0;

    document.addEventListener("mousemove", (e) => {
      raw_x = e.clientX;
      raw_y = e.clientY;
      cursor_dot.style.left = `${raw_x}px`;
      cursor_dot.style.top = `${raw_y}px`;
    });

    // Interpolate movement to simulate mechanical inertia.
    const sync_ring = () => {
      ring_x += (raw_x - ring_x) * 0.15;
      ring_y += (raw_y - ring_y) * 0.15;
      cursor_ring.style.left = `${ring_x}px`;
      cursor_ring.style.top = `${ring_y}px`;
      requestAnimationFrame(sync_ring);
    };
    sync_ring();

    // Scale interaction boundary for tactile feedback on interactive nodes.
    const target_elements = "a, button, .brutal-card, .repo-card, .text-glitch, [data-hover]";
    document.querySelectorAll(target_elements).forEach((el) => {
      el.addEventListener("mouseenter", () => cursor_ring.classList.add("expanded"));
      el.addEventListener("mouseleave", () => cursor_ring.classList.remove("expanded"));
    });
  }

  /* ── NAVIGATION INTERFACE ──────────────────────────── */

  const nav_toggle = document.querySelector(".nav-toggle");
  const nav_menu = document.querySelector(".nav-links");

  if (nav_toggle && nav_menu) {
    nav_toggle.addEventListener("click", () => {
      const is_open = nav_menu.classList.toggle("open");
      const icon_segments = nav_toggle.querySelectorAll("span");
      nav_toggle.setAttribute("aria-expanded", is_open);

      // Procedural icon transform
      if (!is_open) {
        icon_segments.forEach(s => s.style.transform = "none");
        icon_segments[1].style.opacity = "1";
        return;
      }

      icon_segments[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      icon_segments[1].style.opacity = "0";
      icon_segments[2].style.transform = "rotate(-45deg) translate(6px, -6px)";
    });
  }

  // Active state synchronization
  const path_resolver = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const route = link.getAttribute("href");
    if (route === path_resolver || (path_resolver === "" && route === "index.html")) {
      link.classList.add("active");
    }
  });

  /* ── KINETIC TYPOGRAPHY (GLITCH) ───────────────────── */

  const GLITCH_GLYPHS = "!<>-_\\/[]{}—=+*^?#_____";

  document.querySelectorAll(".text-glitch").forEach((target) => {
    const original_buffer = target.textContent;
    let stream_interval = null;

    target.addEventListener("mouseenter", () => {
      let stage = 0;
      clearInterval(stream_interval);

      stream_interval = setInterval(() => {
        target.textContent = original_buffer
          .split("")
          .map((char, i) => {
            if (i < stage) return original_buffer[i];
            return GLITCH_GLYPHS[Math.floor(Math.random() * GLITCH_GLYPHS.length)];
          })
          .join("");

        stage += 1 / 2;
        if (stage >= original_buffer.length) {
          clearInterval(stream_interval);
          target.textContent = original_buffer;
        }
      }, 30);
    });

    target.addEventListener("mouseleave", () => {
      clearInterval(stream_interval);
      target.textContent = original_buffer;
    });
  });

  /* ── SEQUENCE RUNNER (HERO TYPING) ─────────────────── */

  const hero_output = document.getElementById("typing-text");
  if (hero_output) {
    const sequence_vault = [
      ">_ Compiling systems...",
      ">_ Architecting UI...",
      ">_ Deploying to edge...",
      ">_ Profiling markets...",
      ">_ Optimizing pipelines...",
      ">_ Analyzing data flows...",
    ];

    let sequence_ptr = 0;
    let buffer_ptr = 0;
    let is_deleting = false;

    const run_sequence = () => {
      const active_sequence = sequence_vault[sequence_ptr];

      if (!is_deleting) {
        hero_output.textContent = active_sequence.substring(0, buffer_ptr + 1);
        buffer_ptr++;

        if (buffer_ptr === active_sequence.length) {
          is_deleting = true;
          return setTimeout(run_sequence, 2000);
        }
        return setTimeout(run_sequence, 60);
      }

      hero_output.textContent = active_sequence.substring(0, buffer_ptr - 1);
      buffer_ptr--;

      if (buffer_ptr === 0) {
        is_deleting = false;
        sequence_ptr = (sequence_ptr + 1) % sequence_vault.length;
        return setTimeout(run_sequence, 400);
      }
      setTimeout(run_sequence, 30);
    };

    setTimeout(run_sequence, 800);
  }

  /* ── DATA HYDRATION (REPOSITORY LAYER) ─────────────── */

  const repository_vessel = document.getElementById("repo-grid");
  const filter_vessel = document.getElementById("filter-bar");
  let shared_cache = [];

  if (repository_vessel) {
    (async function initialize_repositories() {
      generate_skeletons(repository_vessel, 6);

      try {
        const stream = await fetch("https://api.github.com/users/manojpisini/repos?sort=updated&per_page=30");
        if (!stream.ok) throw new Error(`TERMINAL_ERR: ${stream.status}`);

        shared_cache = await stream.json();
        render_manifest(shared_cache);
        initialize_filters(shared_cache);
      } catch (err) {
        repository_vessel.innerHTML = emit_logic_error("ERR_STREAM", err.message);
      }
    })();
  }

  function render_manifest(nodes) {
    repository_vessel.innerHTML = "";
    if (nodes.length === 0) {
      repository_vessel.innerHTML = emit_logic_error("EMPTY_SET", "No matching nodes identified.");
      return;
    }
    nodes.forEach(node => repository_vessel.insertAdjacentHTML("beforeend", build_node_card(node)));
  }

  function initialize_filters(nodes) {
    if (!filter_vessel) return;

    const stack_trace = [...new Set(nodes.map(n => n.language).filter(Boolean))];
    filter_vessel.innerHTML = `<button class="filter-btn active" data-lang="all">All</button>`;

    stack_trace.forEach(tech => {
      filter_vessel.insertAdjacentHTML("beforeend", `<button class="filter-btn" data-lang="${tech}">${tech}</button>`);
    });

    filter_vessel.querySelectorAll(".filter-btn").forEach(trigger => {
      trigger.addEventListener("click", () => {
        const scope = trigger.getAttribute("data-lang");
        
        filter_vessel.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        trigger.classList.add("active");

        const scoped_set = scope === "all" ? shared_cache : shared_cache.filter(n => n.language === scope);
        render_manifest(scoped_set);
      });
    });
  }

  function generate_skeletons(vessel, count) {
    vessel.innerHTML = Array(count).fill('<div class="skeleton-card"></div>').join("");
  }

  function build_node_card(node) {
    const glyph_tint = resolve_hex_tint(node.language);
    const intent = node.description || "Undefined objective.";

    return `
      <a href="repo.html?name=${node.name}" class="repo-card block group">
        <div class="repo-card__name group-hover:underline decoration-accent underline-offset-4">
          ${node.name}
        </div>
        <p class="repo-card__desc">${sanitize_buffer(intent)}</p>
        <div class="repo-card__meta">
          ${node.language ? `<span><span class="repo-card__lang-dot" style="background:${glyph_tint}"></span>${node.language}</span>` : ""}
          <span>★ ${node.stargazers_count}</span>
          <span>⑂ ${node.forks_count}</span>
        </div>
      </a>
    `;
  }

  function emit_logic_error(code, signal) {
    return `
      <div class="terminal-error" style="grid-column: 1 / -1;">
        <div class="terminal-error__code">${code}</div>
        <div class="terminal-error__msg">${sanitize_buffer(signal)}</div>
      </div>
    `;
  }

  function sanitize_buffer(str) {
    const sanctuary = document.createElement("div");
    sanctuary.textContent = str;
    return sanctuary.innerHTML;
  }

  function resolve_hex_tint(key) {
    const tints = {
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
    return tints[key] || "#0066ff";
  }


  /* ── COMMAND DECK (PALETTE) ───────────────────────── */

  const palette = document.getElementById("command-palette");
  const cmd_input = document.getElementById("command-input");
  const cmd_entries = document.getElementById("command-results");

  const nav_nodes = [
    { name: "Navigate: Home", url: "index.html", type: "route" },
    { name: "Navigate: About", url: "about.html", type: "route" },
    { name: "Navigate: Projects", url: "projects.html", type: "route" },
    { name: "Navigate: Blog", url: "blog.html", type: "route" },
    { name: "Navigate: Contact", url: "contact.html", type: "route" },
    { name: "Terminal: Execute Repo Viewer", url: "repo.html", type: "system" },
    { name: "Download: Resume (PDF)", url: "files/Manoj_Pisini_FullStack_Engineer_2025.pdf", type: "download" },
  ];

  let active_results = [];
  let selection_ptr = 0;

  const toggle_palette = (open) => {
    if (!palette) return;
    palette.classList.toggle("open", open);
    if (open) {
      setTimeout(() => cmd_input.focus(), 50);
      render_palette_frame("");
    }
  };

  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      toggle_palette(!palette.classList.contains("open"));
    }
    if (e.key === "Escape") toggle_palette(false);

    if (palette?.classList.contains("open")) {
      handle_palette_navigation(e);
    }
  });

  function handle_palette_navigation(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selection_ptr = (selection_ptr + 1) % active_results.length;
      sync_palette_selection();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      selection_ptr = (selection_ptr - 1 + active_results.length) % active_results.length;
      sync_palette_selection();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const target = active_results[selection_ptr];
      if (target.type === "download") {
        const trigger = document.createElement("a");
        trigger.href = target.url;
        trigger.download = "Manoj_Pisini_Resume_2025.pdf";
        trigger.click();
      } else {
        window.location.href = target.url;
      }
      toggle_palette(false);
    }
  }

  cmd_input?.addEventListener("input", (e) => {
    render_palette_frame(e.target.value);
  });

  function render_palette_frame(query) {
    const filter = query.toLowerCase();
    active_results = nav_nodes.filter(node => node.name.toLowerCase().includes(filter));
    
    cmd_entries.innerHTML = active_results.map((entry, i) => `
      <div class="cmd-item ${i === 0 ? "selected" : ""}" data-idx="${i}">
        <span>${entry.name} <span class="text-[10px] opacity-40">[${entry.type}]</span></span>
        <span class="cmd-shortcut">ENTER</span>
      </div>
    `).join("");
    
    selection_ptr = 0;
    sync_palette_selection();
  }

  function sync_palette_selection() {
    const items = cmd_entries.querySelectorAll(".cmd-item");
    items.forEach((item, i) => {
      item.classList.toggle("selected", i === selection_ptr);
      if (i === selection_ptr) item.scrollIntoView({ block: "nearest" });
    });
  }

  /* ── CONTENT BROADCAST (DEV.TO) ───────────────────── */

  const blog_vessel = document.getElementById("dedicated-blog-grid");

  if (blog_vessel) {
    (async function hydrate_broadcasts() {
      try {
        const stream = await fetch(`https://dev.to/api/articles?username=manojpisini&per_page=10`);
        if (!stream.ok) throw new Error("UPSTREAM_TIMEOUT");
        
        const insights = await stream.json();
        if (insights.length === 0) {
          blog_vessel.innerHTML = `<p style="color:var(--muted)">Operational silence. No recent broadcasts detected.</p>`;
          return;
        }

        blog_vessel.innerHTML = insights.map(post => `
          <a href="${post.url}" target="_blank" class="brutal-card block hover:scale-[1.02] transition-transform">
            <div class="text-[10px] font-bold text-accent mb-2 uppercase tracking-widest">${new Date(post.published_at).toLocaleDateString()}</div>
            <h3 class="font-bold text-lg mb-2">${post.title}</h3>
            <p class="text-sm text-muted line-clamp-2">${post.description}</p>
          </a>
        `).join("");
      } catch (err) {
        console.warn("SYSTEM: Broadcast hydration failed.", err);
      }
    })();
  }

  /* ── REPOSITORY DEEP-VIEWER ────────────────────────── */

  const viewer_title = document.getElementById("repo-title");
  const viewer_desc = document.getElementById("repo-desc");
  const viewer_stats = document.getElementById("repo-stats");
  const external_link = document.getElementById("github-link");
  const tree_canvas = document.getElementById("file-tree-root");
  const breadcrumb_track = document.getElementById("repo-breadcrumbs");
  const viewer_viewport = document.getElementById("file-content");
  const viewport_label = document.getElementById("content-label");

  let session_state = { name: "", path: "", manifest: null };

  if (viewer_title) {
    const params = new URLSearchParams(window.location.search);
    session_state.name = params.get("name");

    if (!session_state.name) {
      window.location.href = "projects.html";
    } else {
      (async function launch_viewer() {
        await fetch_repo_blueprint();
        await fetch_directory_nodes("");
        fetch_initial_readme();
      })();
    }
  }

  async function fetch_repo_blueprint() {
    try {
      const res = await fetch(`https://api.github.com/repos/manojpisini/${session_state.name}`);
      if (!res.ok) throw new Error("BLUEPRINT_UNAVAILABLE");
      
      session_state.manifest = await res.json();
      viewer_title.textContent = session_state.manifest.name;
      viewer_desc.textContent = session_state.manifest.description || "No technical overview provided.";
      external_link.href = session_state.manifest.html_url;
      
      viewer_stats.innerHTML = `
        <span>FORKS: ${session_state.manifest.forks_count}</span>
        <span>STARS: ${session_state.manifest.stargazers_count}</span>
        <span>LICENSE: ${session_state.manifest.license ? session_state.manifest.license.spdx_id : "NONE"}</span>
      `;
    } catch (err) {
      viewer_title.textContent = "OFFLINE_STATE";
    }
  }

  async function fetch_directory_nodes(target_path = "") {
    session_state.path = target_path;
    const stream_url = `https://api.github.com/repos/manojpisini/${session_state.name}/contents/${target_path}`;
    
    render_breadcrumb_trace();
    tree_canvas.innerHTML = '<div class="skeleton-line w-full h-4"></div>';

    try {
      const res = await fetch(stream_url);
      if (!res.ok) throw new Error("NODES_INACCESSIBLE");
      
      const nodes = await res.json();
      nodes.sort((a, b) => (a.type === b.type ? 0 : a.type === "dir" ? -1 : 1));
      
      tree_canvas.innerHTML = "";
      nodes.forEach(node => {
        const item = document.createElement("div");
        item.className = `tree-item tree-item--${node.type}`;
        item.innerHTML = `<span>${node.type === "dir" ? "📁" : "📄"}</span><span>${node.name}</span>`;
        item.onclick = () => node.type === "dir" ? fetch_directory_nodes(node.path) : stream_file_buffer(node);
        tree_canvas.appendChild(item);
      });
    } catch (err) {
      tree_canvas.innerHTML = `<div class="text-xs text-red-500">FAILED_TO_HYDRATE_NODES</div>`;
    }
  }

  function fetch_initial_readme() {
    fetch(`https://api.github.com/repos/manojpisini/${session_state.name}/readme`, {
      headers: { Accept: "application/vnd.github.v3.raw" }
    })
    .then(res => res.ok ? res.text() : null)
    .then(raw => {
      if (!raw) return viewer_viewport.innerHTML = "<p class='text-muted'>README_NOT_LOCATED.</p>";
      viewer_viewport.innerHTML = marked.parse(raw);
      viewport_label.textContent = "README.md";
    });
  }

  async function stream_file_buffer(node) {
    viewport_label.textContent = node.name;
    viewer_viewport.innerHTML = '<div class="skeleton-line w-full h-8 mb-4"></div><div class="skeleton-line w-full h-4 mb-2"></div>';

    try {
      const is_md = node.name.toLowerCase().endsWith(".md");
      const headers = { Accept: is_md ? "application/vnd.github.v3.html" : "application/vnd.github.v3.raw" };

      const stream = await fetch(node.url, { headers });
      if (!stream.ok) throw new Error("BUFFER_ACCESS_DENIED");

      if (is_md) {
        const text = await stream.text();
        viewer_viewport.innerHTML = marked.parse(text);
        return;
      }

      const raw_source = await stream.text();
      const sanitized = raw_source.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const engine = resolve_prism_engine(node.name);
      viewer_viewport.innerHTML = `<pre class="line-numbers language-${engine}"><code class="language-${engine}">${sanitized}</code></pre>`;
      
      if (window.Prism) {
        Prism.highlightElement(viewer_viewport.querySelector("code"));
      }
    } catch (err) {
      viewer_viewport.innerHTML = `<p class="text-red-500">SIGNAL_FAILURE: ${err.message}</p>`;
    }
  }

  function resolve_breadcrumb_trace() {
    const segments = session_state.path.split("/").filter(Boolean);
    breadcrumb_track.innerHTML = "";

    const root_anchor = document.createElement("span");
    root_anchor.className = "breadcrumb-item";
    root_anchor.textContent = session_state.name;
    root_anchor.onclick = () => fetch_directory_nodes("");
    breadcrumb_track.appendChild(root_anchor);

    let active_path = "";
    segments.forEach((seg, i) => {
      const divider = document.createElement("span");
      divider.className = "breadcrumb-separator";
      divider.textContent = " / ";
      breadcrumb_track.appendChild(divider);

      active_path += (i === 0 ? "" : "/") + seg;
      const target = active_path;
      const anchor = document.createElement("span");
      anchor.className = "breadcrumb-item";
      anchor.textContent = seg;
      anchor.onclick = () => fetch_directory_nodes(target);
      breadcrumb_track.appendChild(anchor);
    });
  }

  function resolve_prism_engine(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    const manifest = {
      js: "javascript", ts: "typescript", py: "python", rs: "rust", go: "go",
      html: "markup", css: "css", json: "json", md: "markdown", sh: "bash",
      yml: "yaml", yaml: "yaml",
    };
    return manifest[ext] || "plain";
  }

  /* ── OPERATIONAL TRACE (SIMULATION) ────────────────── */

  const trace_vessel = document.getElementById("code-showcase");
  const trace_label = document.getElementById("terminal-lang");

  if (trace_vessel) {
    const scenarios = [
      {
        lang: "Systems_C_Rust",
        trace: [
          { type: "cmd", text: "gcc -O3 matrix_core.c -o core" },
          { type: "log", text: "[OK] Binary optimized for AVX-512." },
          { type: "cmd", text: "cargo build --release" },
          { type: "log", text: "   Compiling safety_hook v0.4.2\n   Finished release [optimized] target(s)" }
        ]
      },
      {
        lang: "Fullstack_TS_React",
        trace: [
          { type: "cmd", text: "npm run dev:react" },
          { type: "log", text: "VITE v5.1.0  ready in 142ms\n  ➜  Local:   http://localhost:5173/" },
          { type: "cmd", text: "nest start --watch" },
          { type: "log", text: "[Nest] 10/10 modules initialized.\n[Nest] Server listening on port 3000." }
        ]
      }
    ];

    let trace_ptr = 0;

    (async function run_trace_loop() {
      const active = scenarios[trace_ptr];
      trace_label.textContent = active.lang.toUpperCase();
      trace_vessel.innerHTML = "";
      
      for (const step of active.trace) {
        if (step.type === "cmd") await stream_terminal_command(step.text);
        else await emit_terminal_log(step.text);
        await new Promise(r => setTimeout(r, 600));
      }

      trace_ptr = (trace_ptr + 1) % scenarios.length;
      setTimeout(run_trace_loop, 3000);
    })();

    async function stream_terminal_command(input) {
      const line = document.createElement("div");
      line.className = "code-line";
      line.innerHTML = `<span class="code-accent">$</span> `;
      trace_vessel.appendChild(line);
      
      const buffer = document.createElement("span");
      line.appendChild(buffer);

      for (const char of input) {
        buffer.textContent += char;
        await new Promise(r => setTimeout(r, Math.random() * 50 + 20));
      }
    }

    async function emit_terminal_log(signal) {
      for (const bit of signal.split("\n")) {
        const line = document.createElement("div");
        line.className = "code-line code-muted";
        line.textContent = bit;
        trace_vessel.appendChild(line);
        trace_vessel.scrollTop = trace_vessel.scrollHeight;
        await new Promise(r => setTimeout(r, 100));
      }
    }
  }

  /* ── TELEMETRY ENGINE ──────────────────────────────── */

  function update_telemetry_stream() {
    const lat_node = document.getElementById("telemetry-latency");
    const up_node = document.getElementById("telemetry-uptime");

    if (lat_node) {
      const ms = Math.floor(Math.random() * 45) + 22;
      lat_node.textContent = `${ms}ms`;
    }
    if (up_node) {
      const uptime = (99.98 + Math.random() * 0.01).toFixed(2);
      up_node.textContent = `${uptime}%`;
    }
  }

  update_telemetry_stream();
  setInterval(update_telemetry_stream, 30000);
})();
