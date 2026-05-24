<div align="center">

### `MANOJ PISINI` &nbsp;·&nbsp; Software Engineer Portfolio

<br/>

[![Status](https://img.shields.io/badge/STATUS-OPERATIONAL-success?style=flat-square&logo=ghostery&logoColor=white)](https://manojpisini.github.io/)
[![Engine](https://img.shields.io/badge/ENGINE-ASTRO-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Runtime](https://img.shields.io/badge/RUNTIME-BUN-000000?style=flat-square&logo=bun&logoColor=white)](https://bun.sh)
[![UI/UX](https://img.shields.io/badge/DESIGN-AMOLED_DARK-000000?style=flat-square&logo=datadog&logoColor=white)](https://manojpisini.com)
[![Deploy](https://img.shields.io/badge/HOSTED-GITHUB_PAGES-181717?style=flat-square&logo=github&logoColor=white)](https://manojpisini.github.io)

<br/>

> **A modern Astro portfolio focused on architectural efficiency.**
> Static-first · Content collections · Selective hydration · GitHub Actions deploy

<br/>

</div>

---

<br/>

## ◈ &nbsp; Infrastructure Overview

This project is a **static-first Astro site** with content collections, route-scoped TypeScript enhancement scripts, resilient data fetching, and a monochrome AMOLED-optimized systems UI.

<br/>

---

<br/>

## ◈ &nbsp; Architecture & Data Fetching

Astro pre-renders the core site into static HTML, while small browser-side modules hydrate live discovery surfaces only where needed. UI components are composed from structured profile data, markdown content, and validated local caches.

### 🌑 &nbsp; Caching & Request Throttling

To stay within GitHub API limits, repository metadata uses a **6-hour browser persistence layer**.

| Parameter | Value | Notes |
| :-------- | :---- | :---- |
| **Sync Cycle** | 4x per 24h | Throttled to avoid rate limits |
| **Persistence** | `localStorage` with TTL | Validated on each boot |
| **Synchronization** | Overwrite on fresh fetch | Prevents data bloat |

<br/>

### 🖥 &nbsp; Integrated Repository Browser

The Projects section includes a GitHub-powered command deck.

- **Runtime** — GitHub API repository discovery with an inspectable file preview dialog
- **Resilience** — committed fallback metadata and browser cache for offline-friendly availability
- **Status Flags** — `LIVE_SYNC`, `LOCAL_CACHE`, and `VERIFIED_CACHE`

<br/>

### 🖋 &nbsp; Markdown-Native Blog

The blog uses Astro content collections for local markdown and a generated Dev.to cache for mirrored external articles.

- **Local Source** — `src/content/blog/*.md`
- **Remote Cache** — `public/blog/devto-cache.json`
- **Rendering** — Astro markdown with Shiki, Mermaid diagram support, and static routes

<br/>

---

<br/>

## ◈ &nbsp; Technical Stack

<div align="center">

| Layer | Technology | Rationale |
| :---: | :--------: | :-------- |
| ⚙️ &nbsp; **Framework** | Astro | Static-first rendering with content collections |
| 🧠 &nbsp; **Logic** | TypeScript | Small, route-scoped enhancement scripts |
| 🎨 &nbsp; **Styling** | Native CSS | Performance-tuned monochrome theme |
| 📡 &nbsp; **Discovery** | GitHub API | Live repository metadata and file previews |
| 📊 &nbsp; **Diagrams** | Mermaid.js | Architectural visualization |
| 🚀 &nbsp; **Deployment** | GitHub Pages + Actions | Artifact-based static deploy |

</div>

<br/>

---

<br/>

## ◈ &nbsp; Environment & Deployment

<details>
<summary><b>&nbsp;▶ &nbsp; View environment specifications</b></summary>

<br/>

### Local Preview

```bash
# 1. Clone the repository
git clone https://github.com/manojpisini/manojpisini.github.io.git

# 2. Install dependencies
bun install

# 3. Start development server
bun run dev

# 4. Build production output
bun run build
```

<br/>

### Hosting

Optimized for **GitHub Pages** using GitHub Actions.

```text
CI/CD Pipeline:  git push -> GitHub Actions -> Astro build -> Pages deploy
Build Output:    dist/
Cache Sync:      Dev.to articles -> public/blog/devto-cache.json
Rollback:        Native via GitHub commit history
```

</details>

<br/>

---

<br/>

## ◈ &nbsp; Operational Safeguards

<div align="center">

| Module | Safeguard | Implementation |
| :----- | :-------- | :------------- |
| 🖱️ &nbsp; **Performance** | Selective hydration | Only dynamic surfaces ship browser scripts |
| 🔒 &nbsp; **Privacy** | Zero telemetry | No trackers, no analytics beacons |
| 📡 &nbsp; **Availability** | Graceful degradation | Auto-fallback to static cache on failure |

</div>

<br/>

---

<br/>

<div align="center">

```text
┌─────────────────────────────────────────────┐
│  SYSTEM STATUS: NOMINAL  ·  ALL MODULES: OK  │
└─────────────────────────────────────────────┘
```

**© 2026 Manoj Pisini** &nbsp;·&nbsp; [`manojpisini.com`](https://manojpisini.github.io/) &nbsp;·&nbsp; [`@manojpisini`](https://github.com/manojpisini)

<br/>

</div>
