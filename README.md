# Critical-Datalit

Full-stack app: **Express + SQLite** API in `backend/`, **React (CRA)** UI in `frontend/`.

## Prerequisites

- **Node.js** 18+ and npm  
- **macOS / Linux**: Bash (for the dev script). On Windows, use Git Bash or WSL, or run the two `npm` commands below in separate terminals.

## First-time setup

Install dependencies in both packages:

```bash
cd backend && npm install && cd ../frontend && npm install
```

## Run frontend + backend locally

From the **repository root**:

```bash
chmod +x run-local-dev.sh
./run-local-dev.sh
```

Same as `npm run dev` from the repo root.

This starts:

| Service   | URL                      | Notes                                      |
|----------|--------------------------|--------------------------------------------|
| API      | https://localhost:3001   | CORS allows the React dev server           |
| Frontend | https://localhost:3000   | Proxies `/api` to port **3001** (see `frontend/package.json`) |

Open **https://localhost:3000** and use routes such as `/MainView`. The first visit on each device will show a self-signed-cert warning — click through it once.

Stop both processes with **Ctrl+C**.

### Run separately (optional)

**Terminal 1 — API**

```bash
cd backend
PORT=3001 npm run dev
```

**Terminal 2 — UI**

```bash
cd frontend
BROWSER=none PORT=3000 npm start
```

## Environment (optional)

- **`frontend`**: `REACT_APP_API_URL` — only if you are not using the CRA proxy (defaults to same-origin `/api` → proxy target).
- **`backend`**: `PORT` (default `3000`; use **3001** with this repo’s frontend proxy), `CORS_ORIGIN` (comma-separated origins if needed).

### HTTPS for local dev

`run-local-dev.sh` generates a self-signed cert in `backend/certs/` on first run and starts both ends over HTTPS. Plain HTTP is only served when the certs are absent, and only on `127.0.0.1` (LAN access requires HTTPS). See [docs/HTTPS_LOCAL_DEV.md](docs/HTTPS_LOCAL_DEV.md) for the manual / advanced setup. Production TLS is handled by Caddy and unaffected.

## Backend tests

```bash
cd backend && npm test
```

## Troubleshooting

- **"Invalid Host header" when connecting via LAN IP** — CRA's webpack-dev-server rejects requests whose `Host` header isn't in its allow-list. Add `DANGEROUSLY_DISABLE_HOST_CHECK=true` to `frontend/.env` and restart.
- **Phones reject the cert** ("connection is not private" with no continue option) — the cert's SAN list doesn't include the IP the phone connected to. Usually means the LAN IP changed or the script picked a virtual adapter (VirtualBox / WSL / Hyper-V) instead of Wi-Fi. Delete `backend/certs/` and rerun the script to regenerate.
- **Windows Firewall blocks participants** — on first run Windows asks where Node is allowed; tick **Private networks** so LAN devices can reach the dev server.
- **`EADDRINUSE` on port 3000 or 3001** — another process is bound. Find it with `netstat -ano | findstr :3000` (Windows) or `lsof -i :3000` (macOS / Linux) and stop it.
- **`openssl: command not found`** — needed for cert generation. On Windows, run from Git Bash (which bundles it); on Linux / macOS install via your package manager.
- **`SSL_ERROR_RX_RECORD_TOO_LONG`** — one end is HTTPS while the other is plain HTTP. Confirm `backend/certs/` has both `cert.pem` and `key.pem`; if only one exists, delete the directory and rerun the script.

## Production build (frontend only)

```bash
cd frontend && npm run build
```

Serve the `frontend/build` folder behind your host; point the app at your API URL via `REACT_APP_API_URL` at build time if the API is on another origin.

---

## Short-term remote test sessions (Docker + Caddy)

> **This setup is intended exclusively for remote test sessions (a few hours tops) for us to test things out.**
> TLDR; We create an https tunnel with an password and username, Share the link to the proxy with credentials
> For all that you want to test this with. The server will be the machine you run the docker in.
> Also This guide is in Linux bash shell, If using powershell or alternatives, you need to use different shell commands. Which ones? IDK
> **WARNING! Do not use this as a long-running or public deployment.** It runs over plain HTTP locally, relies on a temporary Cloudflare tunnel, and has not been hardened for production. Treat the session URL as a one-time link and shut everything down when the session ends.

**Requirements:** Docker and Docker Compose.

### 1. Build the frontend

```bash
cd frontend && npm install && npm run build && cd ..
```

### 2. Create your `.env` file

```bash
cp .env.example .env
```

Generate a bcrypt hash for your chosen password:

```bash
docker run --rm caddy:2-alpine caddy hash-password --plaintext yourpassword
```

Fill in `.env` (open in a text editor and edit it):

```
DOMAIN=local          # not used in local mode
AUTH_USER=teacher
AUTH_HASH=<paste hash here>
```

### 3. Start the stack

> **Warning:** Port 80 must be free on your machine. if using linux, Check with `netstat -tlnp | grep :80` and stop any service using it before proceeding.

```bash
docker-compose -f docker-compose.yml -f docker-compose.local.yml up --build -d
```

### 4. Open a Cloudflare Quick Tunnel

```bash
docker run --rm --network host cloudflare/cloudflared:latest tunnel --url http://localhost:80
```

Share the printed `https://....trycloudflare.com` URL with participants. The browser will prompt for the username and password set in `.env`. Keep this terminal open for the duration of the session.

### 5. Shut down immediately after the session

```bash
docker-compose -f docker-compose.yml -f docker-compose.local.yml down
```

> **Do not leave the stack or tunnel running after the session ends.** The tunnel URL is public — anyone with the link can reach the service while it is up.
