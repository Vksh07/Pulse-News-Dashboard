# Dashboard Enhancement Manifest

Last updated: 2026-06-20 08:40 IST

## 1. Current State

- Project path: `./`
- Live server is on `18926`
- Live entry is currently stale: `dist/index.html`

## 2. Rebuild Goal

Create one stable, self-contained dashboard runtime that replaces the old patch-based build without losing the feature set adopted from the agent council notes.

## 3. Feature Set To Preserve

- Exam Pulse + News UI
- breaking news area
- topic pills / filters
- bookmarks panel
- social amplification panel
- feed manager panel (RSS + SearXNG topics)
- CSAT + PSYCH tutor panel
- Pomodoro timer
- ADHD widgets: energy, micro-goal, quote rotator, next task, three-second action
- UPSC lens behavior
- offline state via localStorage

## 4. Rebuild Policy

- One authoritative HTML main file
- One app script file
- One ADHD features script file
- No `while true; do sleep 999; do` placeholder scripts
- No fake ports or bogus wrappers

## 5. Next Step

Replacement main file should be written to: `./dist/index.html`
