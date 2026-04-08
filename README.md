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

| Service   | URL                     | Notes                                      |
|----------|-------------------------|--------------------------------------------|
| API      | http://localhost:3001   | CORS allows the React dev server           |
| Frontend | http://localhost:3000   | Proxies `/api` to port **3001** (see `frontend/package.json`) |

Open **http://localhost:3000** and use routes such as `/MainView`.

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

## Backend tests

```bash
cd backend && npm test
```

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
