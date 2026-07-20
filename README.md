# Pulse — ADHD-Savvy News Dashboard

A single-page news dashboard designed for **ADHD-friendly, dopamine-rich** news consumption. Low cognitive load, quick wins, multi-modal consumption, and built-in UPSC prep integration.

## About

Pulse is not your typical news reader. It was built from the ground up for neurodivergent brains — the ones that bounce between hyperfocus and brain fog, crave small wins, and need frictionless information intake.

**The problem:** Most news dashboards are information firehoses — endless lists, same layout, no pacing, no dopamine. They punish the ADHD brain instead of working with it.

**The solution:** Pulse wraps news into a gamified, multi-modal experience. Focus mode for good days. Energy mode for bad days. Pomodoro cycles to pace reading. TTS to listen when reading hurts. XP and streaks to keep you coming back. And a UPSC lens for serious learners who need syllabus-relevant content surfaced automatically.

---

## Use Cases

### 🧠 For Neurodivergent Readers
- **Focus Mode** — strips UI to headlines only. Zero visual noise.
- **Energy Mode** — large text, single column, high contrast. For brain-fog days.
- **TTS Read Aloud** — listen to articles when you can't read.
- **Pomodoro Timer** — built-in 25/5 cycles to prevent doomscrolling.
- **Gamification** — XP, streaks, level-ups. Dopamine hooks that make reading rewarding.

### 📚 For UPSC / Competitive Exam Aspirants
- **UPSC Lens** — toggle to surface syllabus-relevant articles first.
- **GS Paper Mapping** — every article tagged with GS1/GS2/GS3/GS4/Optional.
- **Relevance Scoring** — syllabus term matching with color-coded indicators.
- **Syllabus Coverage** — tracks which topics you've been exposed to.
- **CSAT Practice** — built-in quantitative aptitude and reasoning practice.

### 📊 For Researchers & Policy Wonks
- **Multi-source aggregation** — SearXNG search (7+ topic queries) + 35+ RSS feeds.
- **Government feeds** — PIB, ISRO, MeitY, NITI Aayog, RBI, state government portals.
- **Breaking news detection** — intensity-scored, time-windowed alerts.
- **UPSC tagging** — ethics, governance, IR, security, environment categories.

### 🏢 For News Aggregation Products
- **Drop-in backend** — single Python file, JSON API, serves built SPA.
- **Extensible feed system** — add RSS feeds or SearXNG topics via API or config.
- **Scheduled rescans** — 7-min scan cycle + 5-min RSS polling, all async.
- **Dedup & windowing** — 24hr rolling window, URL + normalized title dedup.

---

## Quick Start

### Requirements
- Python 3.10+
- Node.js 18+ (for frontend development)
- [SearXNG](https://docs.searxng.org/) instance (default: `http://localhost:8080`)

### One-command (npx)
```bash
npx @Vksh07/pulse-news-dashboard --registry=https://npm.pkg.github.com
# → http://localhost:18925
```

No install required. npx downloads, checks for Python 3.10+, installs `feedparser` if needed, ensures the frontend is built, and starts the server — all in one command.

### Install globally
```bash
npm install -g @Vksh07/pulse-news-dashboard --registry=https://npm.pkg.github.com
pulse-news-dashboard
# → http://localhost:18925
```

Or add to `~/.npmrc` for shorter commands:
```
@Vksh07:registry=https://npm.pkg.github.com/
```
Then:
```bash
npx @Vksh07/pulse-news-dashboard
# or globally:
npm install -g @Vksh07/pulse-news-dashboard && pulse-news-dashboard
```

### From source (no npm registry needed)
```bash
git clone https://github.com/Vksh07/Pulse-News-Dashboard.git
cd Pulse-News-Dashboard
npm install && npm run build
npm start
# → http://localhost:18925
```

### From source
```bash
git clone https://github.com/Vksh07/Pulse-News-Dashboard.git
cd Pulse-News-Dashboard
npm start
# → http://localhost:18925
```

### Step-by-step (for development)

**Backend only (API without frontend UI):**
```bash
python3 server.py
# → http://localhost:18925
```

**Full stack (with frontend hot-reload):**
```bash
npm install
npm run build           # build the SPA once
npm run dev             # frontend dev server on :18926 (proxies /api to backend)
```

---

## Features

### 🎯 Focus Mode
Toggle (toolbar or press `F`) to strip UI to essentials — hides snippets, reduces visual noise, narrows to headlines only. Great for brain-fog days.

### 🔋 Energy Mode
Low-spoon reading mode — larger text, single-column layout, higher contrast. Persists across sessions in localStorage.

### 📚 UPSC Lens
Toggle (toolbar or press `U`) to surface syllabus-relevant articles first. Every article enriched with:
- **UPSC tags** — which syllabus terms match (e.g., "polity", "governance", "environment")
- **GS Paper mapping** — GS1/GS2/GS3/GS4/Optional Psychology
- **Relevance score** — how many syllabus terms hit

### ⭐ Gamification
Dopamine hooks built in:
- **Streak counter** 🔥 — consecutive daily reading
- **XP system** ⭐ — +5 XP per article read, +20 per pomodoro
- **Level-ups** 🎉 — confetti celebration on each level
- **Daily goal** — configurable articles-per-day target with progress bar
- All data persists in localStorage

### 🔊 TTS / Read Aloud
"Listen" button on every article — uses Web Speech API (Indian English voice preferred). Reads title + snippet aloud. Great for:
- Brain fog days — listen instead of read
- Lying down with eyes closed
- Multi-tasking
- Floating player bar with pause/stop controls

### ⏱ Pomodoro Timer
Built-in 25/5 work-break cycles:
- Focus 25:00 → Break 5:00 auto-cycle
- Confetti + notification on session complete
- +20 XP per completed focus session
- Ambient sound ready (pluggable)
- Keyboard accessible

### 📌 Bookmarking
Click the 📌 on any article to save. Bookmarks panel slides in from right (toolbar button or press `S`). Quick-capture without context switching.

### 🎨 Dopamine-Rich UI
- Card entrance animations (staggered fade-slide-up)
- Breaking news pop-in animations
- Streak glow pulse at 3+ days
- Confetti on milestones
- Smooth micro-interactions on hover
- Circadian-friendly dark theme

### ⌨️ Keyboard Shortcuts
- `F` — Toggle Focus Mode
- `U` — Toggle UPSC Lens
- `S` — Toggle Bookmarks panel
- `Ctrl+K` / `Cmd+K` — Focus search

---

## API Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/` or `/index.html` | GET | Serves the dashboard frontend |
| `/status.json` | GET | Full news payload (articles + breaking + UPSC enrichment) |
| `/breaking.json` | GET | Breaking-only payload |
| `/upsc-feed.json` | GET | UPSC-syllabus-filtered articles (scored + tagged) |
| `/bookmarks.json` | GET | Retrieve all bookmarks |
| `/bookmarks.json` | POST | Add/remove/clear bookmarks (action: add\|remove\|clear) |
| `/rescan` | GET/POST | Trigger background rescan of news sources |
| `/feeds.json` | GET/POST | Manage RSS feeds and topics |
| `/api/earnings.json` | GET | Curated earning opportunities |
| `/api/economy-brief.json` | GET | Economy brief for UPSC GS3 |
| `/healthz` | GET | Health probe |

---

## Architecture

```
backend (server.py, Python)
  ├── SearXNG search — queries news via configurable topic queries
  ├── RSS polling — pulls from 35+ news feeds (PIB, The Hindu, Indian Express, BBC, Reuters, govt portals)
  ├── cache/ — article store, feed config, bookmarks
  └── dist/ — built frontend SPA

frontend (Vite + React + TypeScript)
  ├── src/ — React components, stores, utils
  ├── src/pages/ — Dashboard, UPSCLens, FocusMode, CrisisMode, TTS, etc.
  └── dist/ — production build served by backend
```

### Data Flow
1. Server rescans every 420s (7 min) + RSS poll every 300s (5 min)
2. Articles deduped by URL + normalized title
3. 24-hour rolling window (configurable)
4. Each article enriched with UPSC syllabus tags on delivery
5. Breaking news ranked by recency + intensity scoring
6. Bookmarks stored server-side in `cache/bookmarks.json`

---

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `18925` | HTTP server port |
| `SEARXNG_URL` | `http://localhost:8080` | SearXNG instance URL |

RSS feeds and topic queries can be managed at runtime via `POST /feeds.json` or by editing `DEFAULT_RSS_FEEDS` and `DEFAULT_TOPICS` in `server.py`.

---

## License

MIT
