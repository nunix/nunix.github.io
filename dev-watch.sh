#!/bin/bash
# dev-watch.sh: watch docs/ sidebars.ts docusaurus.config.ts src/data/ src/pages/
# and auto-restart docusaurus dev server on file change

set -e

# Directories/files to watch
WATCH_PATHS=(
  "docs"
  "sidebars.ts"
  "docusaurus.config.ts"
  "src/data"
  "src/pages"
)

echo "[dev-watch] Starting Docusaurus dev server with file watcher..."

# Function to start the dev server
start_dev_server() {
  echo "[dev-watch] Starting dev server..."
  bun run start &
  DEV_PID=$!
  echo "[dev-watch] Dev server started (PID: $DEV_PID)"
}

# Function to restart the dev server
restart_dev_server() {
  echo "[dev-watch] Detected changes, restarting dev server..."
  kill $DEV_PID 2>/dev/null || true
  sleep 2
  start_dev_server
}

# Initial start
start_dev_server

# Watch loop: monitor file modifications
while true; do
  # Use inotifywait to detect changes in watched paths
  if command -v inotifywait &>/dev/null; then
    inotifywait -r -e modify,create,delete \
      "${WATCH_PATHS[@]}" 2>/dev/null && restart_dev_server
  else
    # Fallback: poll for changes using find's mtime
    sleep 5
    CURRENT_MTIME=$(find "${WATCH_PATHS[@]}" -type f -printf '%T@\n' 2>/dev/null | sort -rn | head -1)
    if [[ "$CURRENT_MTIME" != "$LAST_MTIME" ]]; then
      LAST_MTIME="$CURRENT_MTIME"
      restart_dev_server
    fi
  fi
done
