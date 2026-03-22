<div align="center">

<br/>

```
███╗   ███╗██████╗        ██╗
████╗ ████║██╔══██╗      ██╔╝
██╔████╔██║██████╔╝     ██╔╝
██║╚██╔╝██║██╔═══╝     ██╔╝
██║ ╚═╝ ██║██║        ██╔╝
╚═╝     ╚═╝╚═╝       ╚═╝
```

### `MANOJ PISINI` &nbsp;·&nbsp; Software Engineer Portfolio

<br/>

[![Status](https://img.shields.io/badge/STATUS-OPERATIONAL-success?style=flat-square&logo=ghostery&logoColor=white)](https://manojpisini.com)
[![Engine](https://img.shields.io/badge/ENGINE-VANILLA_JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://manojpisini.com)
[![UI/UX](https://img.shields.io/badge/DESIGN-AMOLED_DARK-000000?style=flat-square&logo=datadog&logoColor=white)](https://manojpisini.com)
[![Protocol](https://img.shields.io/badge/PROTOCOL-BLUEPRINT_v1.0-ffffff?style=flat-square&logo=blueprint&logoColor=black)](https://manojpisini.com)
[![Deploy](https://img.shields.io/badge/HOSTED-GITHUB_PAGES-181717?style=flat-square&logo=github&logoColor=white)](https://manojpisini.github.io)

<br/>

> **A modular static portfolio focused on architectural efficiency.**  
> Zero dependencies · AMOLED-optimized · Offline-resilient · Privacy-first

<br/>

</div>

---

<br/>

## ◈ &nbsp; Infrastructure Overview

This project is a **Single Page Application (SPA)** built entirely with **Vanilla JavaScript** and **CSS Variables** — no frameworks, no bundlers, no overhead. It employs modular architectural patterns, resilient multi-tier data fetching, and a monochrome AMOLED-optimized UI.

<br/>

---

<br/>

## ◈ &nbsp; Architecture & Data Fetching

The system operates on a **Modular Sync System** — UI components are dynamically rendered from external API responses, validated against local caches, and served via static fallbacks when connectivity is unavailable.

<br/>

### 🌑 &nbsp; Caching & Request Throttling

To stay within GitHub API rate limits, the system implements a **6-hour persistence layer**.

| Parameter | Value | Notes |
| :-------- | :---- | :---- |
| **Sync Cycle** | 4× per 24h | Throttled to avoid rate limits |
| **Persistence** | `localStorage` with TTL | Validated on each boot |
| **Synchronization** | Overwrite on fresh fetch | Prevents data bloat |

<br/>

### 🖥 &nbsp; Integrated Code Browser &nbsp;`[Monaco]`

The Projects section includes a fully functional in-browser source viewer.

- **Library** — Monaco Editor for syntax-aware code visualization
- **Resilience** — `REPO_STRUCTURE_FALLBACKS` ensure offline availability of core metadata
- **Status Flags** — Assets annotated as one of:

  | Flag | Meaning |
  | :--- | :------ |
  | `LATEST` | Live from GitHub API |
  | `LOCAL_CACHE_SYNC` | Served from browser cache |
  | `VERIFIED_CACHE` | Factory fallback (static) |

<br/>

### 🖋 &nbsp; Markdown-Native Blog

A blog rendering system aggregating local manifest data with remote articles.

- **Source** — Dev.to API for technical articles
- **Rendering** — Custom Markdown parser with full support for:
  - **Mermaid.js** architectural diagrams
  - Syntax-highlighted code blocks
  - GitHub Flavored Markdown (GFM) alerts

<br/>

---

<br/>

## ◈ &nbsp; Technical Stack

<div align="center">

<br/>

| Layer | Technology | Rationale |
| :---: | :--------: | :-------- |
| ⚙️ &nbsp; **Logic** | Vanilla ES6+ | Zero-dependency, low-overhead execution |
| 🎨 &nbsp; **Styling** | Native CSS + Variables | Performance-tuned monochrome theming |
| 📝 &nbsp; **Editor** | Monaco Editor | Native in-browser code browsing |
| 📊 &nbsp; **Diagrams** | Mermaid.js | Architectural visualization |
| 💾 &nbsp; **Persistence** | LocalStorage | Browser-native state management |
| 🚀 &nbsp; **Deployment** | GitHub Pages + Actions | Static-first, zero-config CI/CD |

<br/>

</div>

---

<br/>

## ◈ &nbsp; Environment & Deployment

<details>
<summary><b>&nbsp;▶ &nbsp; View environment specifications</b></summary>

<br/>

### Local Preview

The architecture is **zero-dependency** — no build step or package manager required.

```bash
# 1. Clone the repository
git clone https://github.com/manojpisini/manojpisini.github.io.git

# 2. Launch via any static server
python -m http.server 8080
# OR: npx serve .
# OR: VS Code Live Server extension

# 3. Entry point
open index.html
```

<br/>

### Hosting

Optimized for **GitHub Pages** — stateless, static-first, zero server configuration.

```
CI/CD Pipeline:  git push → GitHub Actions → Pages Deploy
Latency:         ~30s from push to live
Rollback:        Native via GitHub commit history
```

</details>

<br/>

---

<br/>

## ◈ &nbsp; Operational Safeguards

<div align="center">

<br/>

| Module | Safeguard | Implementation |
| :----- | :-------- | :------------- |
| 🖱️ &nbsp; **Performance** | Dedicated animation loop | `requestAnimationFrame` for cursor effects |
| 🔒 &nbsp; **Privacy** | Zero telemetry | No trackers, no analytics beacons |
| 📡 &nbsp; **Availability** | Graceful degradation | Auto-fallback to static cache on failure |

<br/>

</div>

---

<br/>

<div align="center">

```
┌─────────────────────────────────────────────┐
│  SYSTEM STATUS: NOMINAL  ·  ALL MODULES: OK  │
└─────────────────────────────────────────────┘
```

**© 2026 Manoj Pisini** &nbsp;·&nbsp; [`manojpisini.com`](https://manojpisini.com) &nbsp;·&nbsp; [`@manojpisini`](https://github.com/manojpisini)

<br/>

</div>
