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
