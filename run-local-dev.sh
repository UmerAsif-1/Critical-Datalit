#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

cleanup() {
  local p
  for p in $(jobs -p 2>/dev/null); do
    kill "$p" 2>/dev/null || true
  done
}

trap cleanup EXIT INT TERM

if [[ ! -d "$ROOT/backend/node_modules" ]] || [[ ! -d "$ROOT/backend/node_modules/dotenv" ]]; then
  echo "Installing backend dependencies…"
  (cd "$ROOT/backend" && npm install)
fi
if [[ ! -d "$ROOT/frontend/node_modules" ]]; then
  echo "Installing frontend dependencies…"
  (cd "$ROOT/frontend" && npm install)
fi

echo "Starting backend on http://localhost:3001"
(cd "$ROOT/backend" && PORT=3001 npm run dev) &

echo "Starting frontend on http://localhost:3000"
(cd "$ROOT/frontend" && BROWSER=none PORT=3000 npm start) &

wait || true
