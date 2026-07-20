#!/usr/bin/env node

/**
 * Pulse — ADHD-Savvy News Dashboard
 * CLI: pulse serve  →  start the dashboard server on port 18925
 */

import { spawn, execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import http from 'node:http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const SERVER_SCRIPT = path.join(ROOT, 'server.py');
const PORT = process.env.PORT || '18925';
const NAME = 'pulse';

// ── Help ──────────────────────────────────────────────────────
function help() {
  console.log(`
  ${NAME} — ADHD-Savvy News Dashboard

  USAGE

    ${NAME} serve     Start the dashboard server (default)
    ${NAME} --help    Show this message
    ${NAME} --version Show version

  EXAMPLES

    ${NAME} serve
    # → http://localhost:18925

    PORT=8080 ${NAME} serve
    # → http://localhost:8080
`);
}

function version() {
  try {
    const pkg = JSON.parse(
      execSync('cat package.json', { cwd: ROOT, encoding: 'utf-8', timeout: 3000 })
    );
    console.log(pkg.version);
  } catch {
    console.log('unknown');
  }
}

// ── Python ────────────────────────────────────────────────────
function findPython() {
  for (const cmd of ['python3', 'python']) {
    try {
      const out = execSync(`${cmd} -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')"`, {
        encoding: 'utf-8', timeout: 5000,
      });
      const ver = out.trim();
      const [major, minor] = ver.split('.').map(Number);
      if (major >= 3 && minor >= 10) return cmd;
    } catch { /* try next */ }
  }
  return null;
}

function ensureFeedparser(python) {
  try {
    execSync(`${python} -c "import feedparser"`, { stdio: 'ignore', timeout: 5000 });
    return true;
  } catch {
    console.log('→ Installing feedparser...');
    try {
      execSync(`${python} -m pip install -q feedparser`, { stdio: 'inherit', timeout: 30000 });
      return true;
    } catch {
      console.error('✗ Failed to install feedparser. Try: pip install feedparser');
      return false;
    }
  }
}

function ensureFrontend() {
  if (existsSync(path.join(ROOT, 'dist', 'index.html'))) return true;
  const pkgPath = path.join(ROOT, 'package.json');
  if (!existsSync(pkgPath)) return false;
  try {
    const pkg = JSON.parse(String(execSync('cat package.json', { cwd: ROOT, encoding: 'utf-8', timeout: 3000 })));
    if (pkg.scripts?.build) {
      console.log('→ Building frontend...');
      execSync('npm run build', { cwd: ROOT, stdio: 'inherit', timeout: 120000 });
      return true;
    }
  } catch { /* skip */ }
  return false;
}

function ensureCache() {
  mkdirSync(path.join(ROOT, 'cache'), { recursive: true });
  mkdirSync(path.join(ROOT, 'logs'), { recursive: true });
}

// ── Serve ─────────────────────────────────────────────────────
function serve() {
  console.log(`\n  ╔══════════════════════════════════════════════╗`);
  console.log(`  ║  Pulse — ADHD-Savvy News Dashboard        ║`);
  console.log(`  ║  Running on http://localhost:${PORT}          ║`);
  console.log(`  ║  Press Ctrl+C to stop                      ║`);
  console.log(`  ╚══════════════════════════════════════════════╝\n`);

  const python = findPython();
  if (!python) {
    console.error('✗ Python 3.10+ is required. Install from https://python.org');
    process.exit(1);
  }
  if (!ensureFeedparser(python)) process.exit(1);
  ensureFrontend();
  ensureCache();

  const proc = spawn(python, [SERVER_SCRIPT], {
    cwd: ROOT, stdio: 'inherit', env: { ...process.env, PORT },
  });

  const maxRetries = 15;
  let retries = 0;
  const check = setInterval(() => {
    const req = http.get(`http://localhost:${PORT}/healthz`, () => {
      clearInterval(check);
      console.log('✓ Server ready!');
    });
    req.on('error', () => { if (++retries >= maxRetries) clearInterval(check); });
    req.end();
  }, 500);

  proc.on('exit', (code) => process.exit(code ?? 0));
}

// ── CLI Router ────────────────────────────────────────────────
function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd || cmd === 'serve')      { serve(); return; }
  if (cmd === '--help' || cmd === '-h') { help(); return; }
  if (cmd === '--version' || cmd === '-v') { version(); return; }

  console.error(`Unknown command: ${cmd}\n`);
  help();
  process.exit(1);
}

main();
