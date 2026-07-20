#!/usr/bin/env node

/**
 * Pulse — ADHD-Savvy News Dashboard
 * CLI entry point for `npx pulse-news-dashboard`
 *
 * Starts the Python backend server on port 18925
 * and opens the dashboard in your browser.
 */

import { spawn, execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import http from 'node:http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SERVER_SCRIPT = path.join(ROOT, 'server.py');
const PORT = process.env.PORT || '18925';

// ── Detect Python ─────────────────────────────────────────────
function findPython() {
  for (const cmd of ['python3', 'python']) {
    try {
      const out = execSync(`${cmd} -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')"`, {
        encoding: 'utf-8',
        timeout: 5000,
      });
      const ver = out.trim();
      const [major, minor] = ver.split('.').map(Number);
      if (major >= 3 && minor >= 10) {
        console.log(`✓ Python ${ver} found: ${cmd}`);
        return cmd;
      }
      console.log(`✗ Python ${ver} too old (need 3.10+)`);
    } catch {
      // try next
    }
  }
  return null;
}

// ── Check / install feedparser ────────────────────────────────
function ensureFeedparser(python) {
  try {
    execSync(`${python} -c "import feedparser"`, { stdio: 'ignore', timeout: 5000 });
    console.log('✓ feedparser available');
    return true;
  } catch {
    console.log('→ Installing feedparser...');
    try {
      execSync(`${python} -m pip install -q feedparser`, { stdio: 'inherit', timeout: 30000 });
      console.log('✓ feedparser installed');
      return true;
    } catch (e) {
      console.error('✗ Failed to install feedparser. Try: pip install feedparser');
      return false;
    }
  }
}

// ── Check / build frontend ────────────────────────────────────
function ensureFrontend() {
  const distIndex = path.join(ROOT, 'dist', 'index.html');
  if (existsSync(distIndex)) {
    console.log('✓ Frontend already built');
    return;
  }

  console.log('→ Building frontend...');
  try {
    execSync('npm run build', { cwd: ROOT, stdio: 'inherit', timeout: 120000 });
    console.log('✓ Frontend built');
  } catch {
    console.log('⚠ Frontend build failed — API-only mode. Install Node.js 18+ and run: npm install && npm run build');
  }
}

// ── Ensure cache directory ────────────────────────────────────
function ensureCache() {
  const cacheDir = path.join(ROOT, 'cache');
  if (!existsSync(cacheDir)) {
    mkdirSync(cacheDir, { recursive: true });
  }
  const logsDir = path.join(ROOT, 'logs');
  if (!existsSync(logsDir)) {
    mkdirSync(logsDir, { recursive: true });
  }
}

// ── Start server ──────────────────────────────────────────────
function startServer(python) {
  console.log(`\n╔══════════════════════════════════════════════╗`);
  console.log(`║  Pulse — ADHD-Savvy News Dashboard        ║`);
  console.log(`║  Running on http://localhost:${PORT}          ║`);
  console.log(`║  Press Ctrl+C to stop                      ║`);
  console.log(`╚══════════════════════════════════════════════╝\n`);

  const proc = spawn(python, [SERVER_SCRIPT], {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, PORT },
  });

  // ── Wait for server to start, then open browser ────────────
  const maxRetries = 15;
  let retries = 0;
  const check = setInterval(() => {
    const req = http.get(`http://localhost:${PORT}/healthz`, (res) => {
      clearInterval(check);
      console.log('✓ Server ready!');
    });
    req.on('error', () => {
      retries++;
      if (retries >= maxRetries) {
        clearInterval(check);
      }
    });
    req.end();
  }, 500);

  proc.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

// ── Main ──────────────────────────────────────────────────────
function main() {
  console.log('Pulse — ADHD-Savvy News Dashboard');
  console.log('──────────────────────────────────\n');

  const python = findPython();
  if (!python) {
    console.error('✗ Python 3.10+ is required. Install from https://python.org');
    process.exit(1);
  }

  if (!ensureFeedparser(python)) {
    process.exit(1);
  }

  ensureFrontend();
  ensureCache();
  startServer(python);
}

main();
