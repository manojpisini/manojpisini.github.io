<div align="center">

```text
 ███╗   ███╗██████╗ 
 ████╗ ████║██╔══██╗
 ██╔████╔██║██████╔╝
 ██║╚██╔╝██║██╔═══╝ 
 ██║ ╚═╝ ██║██║     
 ╚═╝     ╚═╝╚═╝     
```

# MP:// TECHNICAL_SPECIFICATION
### Software Engineer Portfolio // Manoj Pisini

[![Status](https://img.shields.io/badge/STATUS-OPERATIONAL-success?style=flat-square&logo=ghostery)](https://manojpisini.com)
[![Engine](https://img.shields.io/badge/ENGINE-VANILLA_JS-yellow?style=flat-square&logo=javascript)](https://manojpisini.com)
[![UI/UX](https://img.shields.io/badge/DESIGN-AMOLED_DARK-black?style=flat-square)](https://manojpisini.com)
[![Protocol](https://img.shields.io/badge/PROTOCOL-BLUEPRINT_v1.0-white?style=flat-square)](https://manojpisini.com)

**A modular staticportfolio focused on architectural efficiency.**

</div>

---

## 🛠 Infrastructure Overview

This project is a **Single Page Application (SPA)** framework implemented with **Vanilla Javascript** and **CSS Variables**. It utilizes modular architectural patterns, resilient data fetching, and an AMOLED-optimized monochrome UI.

---

## 🛰 Architecture & Data Fetching

The system utilizes a **Modular Sync System**. UI components are dynamically rendered based on external API responses and validated local caches.

### 🌑 Caching & Request Throttling

To stay within GitHub API rate limits, the system implements a **6-hour persistence layer**.

- **Cycle**: Throttled to 4 repository syncs per 24-hour period.
- **Persistence**: Data is cached in `localStorage` with a TTL validation check.
- **Synchronization**: Fresh fetches overwrite the existing cache to prevent data bloat.

### 🖥 Integrated Code Browser (Monaco)

The Projects section includes a functional code viewer:

- **Library**: Integrated **Monaco Editor** for source code visualization.
- **Resilience**: Implements `REPO_STRUCTURE_FALLBACKS` for offline availability of core metadata.
- **Status Mapping**: Assets are flagged as `LATEST` (API-live), `LOCAL_CACHE_SYNC` (cached), or `VERIFIED_CACHE` (factory fallback).

### 🖋 Markdown-Native Blog

A blog rendering system that integrates local manifest data with remote articles.
- **Source**: Aggregates technical documentation from **Dev.to API**.
- **Rendering**: Implements a Markdown parser with support for **Mermaid.js** visualizations, syntax highlighting, and GFM alerts.

---

## ⚡ Technical Stack

<div align="center">

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Logic** | Vanilla ES6+ | Zero-dependency, low-overhead execution. |
| **Styling** | Native CSS | Performance-tuned monochrome theme. |
| **Editor** | Monaco Editor | Native code browsing capabilities. |
| **Diagrams** | Mermaid.js | Architectural visualization. |
| **Persistence** | LocalStorage | Browser-native state management. |

</div>

---

## 🚀 Environment & Deployment

<details>
<summary><b>View environment specifications</b></summary>

### Local Preview
The architecture is zero-dependency. No build step or package manager is required.
1. Clone the repository: `git clone https://github.com/manojpisini/manojpisini.github.io.git`
2. Launch via any static server (e.g., Python, Live Server, or `npx serve` if preferred).
3. The entry point is `index.html`.

### Hosting
The system is optimized for **GitHub Pages**. It utilizes a stateless, static-first architecture requiring zero server-side configuration. Managed CI/CD is handled via GitHub Actions for automated deployment.

</details>

---

## 🔒 Operational Safeguards

- **Performance**: Cursor animations run on a dedicated `requestAnimationFrame` loop.
- **Privacy**: No tracking scripts or analytical beacons; zero external telemetry.
- **Availability**: Automatic fallback to static cache indices on upstream connectivity failure.

---

<div align="center">
<b>© 2026 Manoj Pisini</b>
</div>
