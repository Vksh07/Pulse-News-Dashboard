#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()  { printf "${CYAN}[pulse]${NC} %s\n" "$*"; }
ok()    { printf "${GREEN}[pulse]${NC} %s\n" "$*"; }
warn()  { printf "${YELLOW}[pulse]${NC} %s\n" "$*"; }
err()   { printf "${RED}[pulse]${NC} %s\n" "$*" >&2; }

info "Pulse — ADHD-Savvy News Dashboard"
info "──────────────────────────────────"
echo

# ── Detect Python ──────────────────────────────────────────────
if command -v python3 &>/dev/null; then
    PYTHON=python3
elif command -v python &>/dev/null; then
    PYTHON=python
else
    err "Python 3 not found. Install Python 3.10+ first."
    exit 1
fi

PYVER=$($PYTHON -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
info "Python $PYVER found: $(command -v $PYTHON)"

# ── Python venv + deps ────────────────────────────────────────
if [[ ! -d .venv ]]; then
    info "Creating Python virtual environment..."
    $PYTHON -m venv .venv
    ok "Virtual environment created."
fi

source .venv/bin/activate

if ! $PYTHON -c "import feedparser" 2>/dev/null; then
    info "Installing Python dependencies (feedparser)..."
    pip install -q feedparser
    ok "Python dependencies installed."
else
    ok "Python dependencies already satisfied."
fi

# ── Detect Node.js + npm ───────────────────────────────────────
NODE_INSTALLED=false
if command -v node &>/dev/null && command -v npm &>/dev/null; then
    NODE_INSTALLED=true
    NODE_VER=$(node -v)
    info "Node.js $NODE_VER found."
else
    warn "Node.js/npm not found. Frontend won't be built."
    warn "Install Node.js 18+ from https://nodejs.org/ for the full UI."
    warn "The backend will still serve the API without the frontend."
fi

# ── Install npm dependencies + build frontend ──────────────────
if $NODE_INSTALLED; then
    if [[ ! -d node_modules ]]; then
        info "Installing npm dependencies..."
        npm install
        ok "npm dependencies installed."
    else
        ok "npm dependencies already installed."
    fi

    if [[ ! -d dist ]] || [[ ! -f dist/index.html ]]; then
        info "Building frontend..."
        npm run build
        ok "Frontend built."
    else
        ok "Frontend already built."
    fi
fi

# ── Create cache directory ─────────────────────────────────────
mkdir -p cache logs

# ── Summary ────────────────────────────────────────────────────
echo
ok "╔══════════════════════════════════════════════╗"
ok "║  All set! Start the server with:            ║"
ok "║                                              ║"
ok "║  python3 server.py                          ║"
ok "║                                              ║"
ok "║  Or:  ./start.sh                            ║"
ok "║                                              ║"
ok "║  Then open http://localhost:18925            ║"
ok "╚══════════════════════════════════════════════╝"

# ── Start server (if --serve passed) ───────────────────────────
if [[ "${1:-}" == "--serve" ]]; then
    echo
    info "Starting server..."
    export PORT="${PORT:-18925}"
    exec $PYTHON server.py
fi
