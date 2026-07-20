#!/usr/bin/env bash
# Strict supervisor for Project-News Dashboard backend
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER="${SCRIPT_DIR}/server.py"
PORT="${PORT:-18925}"
CHECK_URL="${CHECK_URL:-http://127.0.0.1:${PORT}/healthz}"
PID_FILE="${SCRIPT_DIR}/dashboard.pid"
LOG="${SCRIPT_DIR}/run-dashboard.log"
BACKOFF_BASE=3
BACKOFF_MAX=60
mkdir -p "$(dirname "$LOG" "$PID_FILE")"
log() { echo "[$(date '+%F %T')] $*" | tee -a "$LOG"; }
start_server() {
  log "Starting dashboard server..."
  cd "$SCRIPT_DIR"
  nohup python3 -u "$SERVER" >> "$LOG" 2>&1 &
  server_pid=$!
  echo "$server_pid" > "$PID_FILE"
  log "Started PID=$server_pid"
}
wait_ready() {
  local tries="${1:-20}"
  for i in $(seq 1 "$tries"); do
    if curl -fsS "$CHECK_URL" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done
  return 1
}
# If an existing recorded PID is still running, do not double-launch
if [[ -f "$PID_FILE" ]]; then
  oldpid="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "${oldpid:-}" ]] && kill -0 "$oldpid" 2>/dev/null; then
    log "Existing server PID ${oldpid} still running."
    if ! wait_ready 10; then
      log "Existing PID not responding; restarting"
      kill "$oldpid" 2>/dev/null || true
      sleep 1
    else
      log "Existing PID healthy."
      exec tail -f "$LOG"
    fi
  else
    log "Existing PID ${oldpid:-<none>} missing."
  fi
fi
# Ensure dist exists for SPA shell before supervisor loop
if [ ! -f "${SCRIPT_DIR}/dist/index.html" ]; then
  log "dist/index.html missing; building frontend"
  (cd "$SCRIPT_DIR" && npm run build >> "$LOG" 2>&1 || true)
fi
start_server
if ! wait_ready 20; then
  log "Server did not become ready in time on port ${PORT}"
fi
log "Supervisor loop started"
backoff="$BACKOFF_BASE"
while true; do
  sleep "$backoff"
  if ! curl -fsS "$CHECK_URL" >/dev/null 2>&1; then
    log "Backend not responding; restarting PID=$(cat "$PID_FILE" 2>/dev/null || echo '-')"
    if [[ -f "$PID_FILE" ]]; then
      pid="$(cat "$PID_FILE" 2>/dev/null || true)"
      if [[ -n "${pid:-}" ]] && kill -0 "$pid" 2>/dev/null; then
        kill "$pid" 2>/dev/null || true
        sleep 1
      fi
    fi
    start_server
    if wait_ready 30; then
      log "Restart succeeded"
      backoff="$BACKOFF_BASE"
    else
      log "Restart failed; backing off ${backoff}s"
      sleep "$backoff"
      backoff=$(( backoff < BACKOFF_MAX ? backoff * 2 : BACKOFF_MAX ))
    fi
  else
    # Correct stale pid file if needed
    if [[ -f "$PID_FILE" ]]; then
      pid="$(cat "$PID_FILE" 2>/dev/null || true)"
      if [[ -n "${pid:-}" ]] && ! kill -0 "$pid" 2>/dev/null; then
        pid_now="$(pgrep -f "python3 .*${SERVER}" | head -n1 || true)"
        if [[ -n "${pid_now:-}" ]]; then
          echo "$pid_now" > "$PID_FILE"
          log "Pid corrected: $pid -> $pid_now"
        fi
      fi
    fi
  fi
done
