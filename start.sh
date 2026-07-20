#!/usr/bin/env bash
set -euo pipefail
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

DEFAULT_PORT=18925
export PORT="${PORT:-$DEFAULT_PORT}"

printf "[start] Project-News Dashboard\n"
printf "[start] project_dir=%s\n" "$PROJECT_DIR"
printf "[start] port=%s\n" "$PORT"

if [[ ! -f server.py ]]; then
  echo "[start][error] server.py not found in $PROJECT_DIR" >&2
  exit 1
fi

exec python3 server.py
