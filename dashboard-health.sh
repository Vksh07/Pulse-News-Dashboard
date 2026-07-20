#!/bin/bash
# Dashboard Health Check — strict single-source-of-truth for backend liveness on :18925
# Provides autonomous self-correction: kill stale pid, rerun supervisor, verify build freshness.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER="server.py"
HEALTH_URL="http://127.0.0.1:18925/healthz"
PID_FILE="${SCRIPT_DIR}/dashboard.pid"
SUPERVISOR="${SCRIPT_DIR}/run-dashboard.sh"
LOG="${SCRIPT_DIR}/dashboard-health.log"
mkdir -p "$(dirname "$LOG")"
log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG"; }

http_code="$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$HEALTH_URL" 2>/dev/null || echo "000")"
pid="$(cat "$PID_FILE" 2>/dev/null || true)"

if [ "$http_code" != "200" ]; then
  log "HEALTHZ FAIL (HTTP $http_code). Stabilizing..."
  if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
    log "Killing stale PID $pid on port 18925"
    kill "$pid" 2>/dev/null || true
    sleep 1
  fi
  # Ensure dist SPA exists to prevent blank shell if build missing
  if [ ! -f "${SCRIPT_DIR}/dist/index.html" ]; then
    log "dist/index.html missing; running build"
    (cd "$SCRIPT_DIR" && npm run build >>"$LOG" 2>&1 || true)
  fi
  if [ -x "$SUPERVISOR" ]; then
    log "Starting supervisor"
    bash "$SUPERVISOR" >>"$LOG" 2>&1 &
  else
    log "Supervisor script missing or not executable"
    exit 1
  fi
  # Wait briefly for health
  for i in $(seq 1 20); do
    if curl -fsS "$HEALTH_URL" >/dev/null 2>&1; then
      log "Backend recovered after stabilization"
      exit 0
    fi
    sleep 1
  done
  log "Backend did not recover in time after stabilization"
else
  # Liveness OK, but correct stale pid if needed
  if [[ -n "$pid" ]] && ! kill -0 "$pid" 2>/dev/null; then
    pid_now="$(pgrep -f "python3 .*${SERVER}" | head -n1 || true)"
    if [[ -n "$pid_now" ]]; then
      echo "$pid_now" > "$PID_FILE"
      log "Pid corrected from $pid to $pid_now"
    fi
  fi
  log "HEALTHZ OK (HTTP 200)"
fi

