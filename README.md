# Pulse — ADHD-Savvy News Dashboard

A single-page news dashboard designed for **ADHD-friendly, dopamine-rich** news consumption. Low cognitive load, quick wins, multi-modal consumption, and built-in UPSC prep integration.

## Quick Start

### Requirements
- Python 3.10+
- Node.js 18+ (for frontend dev)
- [SearXNG](https://docs.searxng.org/) instance (default: `http://localhost:8080`)

### Backend
```bash
python3 server.py
# → http://localhost:18925
```

The backend serves the built frontend from `dist/` and provides the API.

### Frontend Development
```bash
npm install
npm run dev
# → http://localhost:18926 (proxies /api to backend on 18925)
```

### Production Build
```bash
npm run build
npm run preview
```

## Features

### 🎯 Focus Mode
Toggle (toolbar or press `F`) to strip UI to essentials — hides snippets, reduces visual noise, narrows focus to headlines only.

### 🔋 Energy Mode
Low-spoon reading mode — larger text, single-column layout, higher contrast. Persists across sessions.

### 📚 UPSC Lens
Toggle (toolbar or press `U`) to surface syllabus-relevant articles first. Every article is enriched with:
- **UPSC tags** — which syllabus terms match
- **GS Paper mapping** — GS1/GS2/GS3/GS4/Optional
- **Relevance score** — how many syllabus terms hit

### ⭐ Gamification
- **Streak counter** 🔥 — consecutive daily reading
- **XP system** ⭐ — +5 XP per article read, +20 per pomodoro
- **Level-ups** 🎉 — confetti celebration on each level
- **Daily goal** — configurable articles-per-day target

### 🔊 TTS / Read Aloud
"Listen" button on every article — uses Web Speech API. Reads title + snippet aloud. Great for brain fog days, lying down, or multi-tasking.

### ⏱ Pomodoro Timer
Built-in 25/5 work-break cycles with confetti, XP rewards, and keyboard accessibility.

### 📌 Bookmarking
Click the 📌 on any article to save. Bookmarks panel slides in from right (toolbar button or press `S`).

### ⌨️ Keyboard Shortcuts
- `F` — Toggle Focus Mode
- `U` — Toggle UPSC Lens
- `S` — Toggle Bookmarks panel
- `Ctrl+K` / `Cmd+K` — Focus search

## API Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/` or `/index.html` | GET | Serves the dashboard frontend |
| `/status.json` | GET | Full news payload (articles + breaking + UPSC enrichment) |
| `/breaking.json` | GET | Breaking-only payload |
| `/upsc-feed.json` | GET | UPSC-syllabus-filtered articles (scored + tagged) |
| `/bookmarks.json` | GET | Retrieve all bookmarks |
| `/bookmarks.json` | POST | Add/remove/clear bookmarks |
| `/rescan` | GET/POST | Trigger background rescan of news sources |
| `/feeds.json` | GET/POST | Manage RSS feeds and topics |
| `/healthz` | GET | Health probe |

## Architecture

```
backend (server.py, Python)
  ├── SearXNG search — queries news via 7+ topic categories
  ├── RSS polling — pulls from 40+ news feeds
  ├── cache/ — article store, feed config, bookmarks
  └── dist/ — built frontend SPA

frontend (Vite + React + TypeScript)
  ├── src/ — React components, stores, utils
  └── dist/ — production build served by backend
```

### Data Flow
1. Server rescans every 420s (7 min) + RSS poll every 300s (5 min)
2. Articles deduped by URL + normalized title
3. 24-hour rolling window
4. Each article enriched with UPSC syllabus tags
5. Breaking news ranked by recency + intensity scoring

## News Sources
- **SearXNG** — configurable topic queries (default: India governance, Tamil Nadu, Andhra, World, Sports, Finance, etc.)
- **RSS Feeds** — 35+ feeds covering PIB, major Indian newspapers, BBC, Reuters, sports, government portals, and more

## Configuration
- Port: override via `PORT` env var (default: `18925`)
- SearXNG URL: override via `SEARXNG_URL` env var (default: `http://localhost:8080`)
- Feed config: edit via `/feeds.json` API or modify `DEFAULT_RSS_FEEDS` in `server.py`

## License
MIT
