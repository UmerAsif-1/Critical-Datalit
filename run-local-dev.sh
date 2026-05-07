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

CERT_DIR="$ROOT/backend/certs"
CERT_FILE="$CERT_DIR/cert.pem"
KEY_FILE="$CERT_DIR/key.pem"

if [[ -z "${LAN_IP:-}" ]]; then
  LAN_IP=$(node -e "for (const ifs of Object.values(require('os').networkInterfaces())) { for (const i of ifs) { if (i.family === 'IPv4' && !i.internal) { console.log(i.address); process.exit(0); } } }" 2>/dev/null || true)
fi

if [[ ! -f "$CERT_FILE" ]] || [[ ! -f "$KEY_FILE" ]]; then
  if ! command -v openssl >/dev/null 2>&1; then
    echo "Error: openssl is required to generate the local HTTPS cert but was not found." >&2
    echo "Install OpenSSL (Git Bash on Windows ships it) and re-run." >&2
    exit 1
  fi
  echo "Generating self-signed cert in $CERT_DIR…"
  mkdir -p "$CERT_DIR"
  SAN="DNS:localhost,IP:127.0.0.1"
  if [[ -n "${LAN_IP:-}" ]]; then
    SAN="$SAN,IP:$LAN_IP"
  fi
  # Git Bash on Windows mangles args starting with `/` into Windows paths.
  # Double-slash bypasses the conversion; native openssl receives `/CN=localhost`.
  SUBJ="/CN=localhost"
  if [[ -n "${MSYSTEM:-}" ]]; then
    SUBJ="//CN=localhost"
  fi
  openssl req -x509 -newkey rsa:2048 -nodes \
    -keyout "$KEY_FILE" \
    -out    "$CERT_FILE" \
    -days 365 -subj "$SUBJ" \
    -addext "subjectAltName=$SAN" >/dev/null 2>&1
  echo "Cert SANs: $SAN"
fi

CORS_ORIGIN_LIST="https://localhost:3000,https://localhost:3001"
if [[ -n "${LAN_IP:-}" ]]; then
  CORS_ORIGIN_LIST="$CORS_ORIGIN_LIST,https://$LAN_IP:3000,https://$LAN_IP:3001"
fi

echo "Starting backend on https://localhost:3001"
(cd "$ROOT/backend" && PORT=3001 CORS_ORIGIN="$CORS_ORIGIN_LIST" npm run dev) &

echo "Starting frontend on https://localhost:3000"
# CRA reads SSL_*_FILE relative to the frontend CWD. Relative paths sidestep
# Git Bash's MSYS path-rewriting, which only handles command args (not env values).
(cd "$ROOT/frontend" && HTTPS=true SSL_CRT_FILE="../backend/certs/cert.pem" SSL_KEY_FILE="../backend/certs/key.pem" BROWSER=none PORT=3000 npm start) &

wait || true
