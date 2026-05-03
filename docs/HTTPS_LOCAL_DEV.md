# Enabling HTTPS for local development

By default this repo runs the dev stack over plain HTTP:

| Service  | Default URL              |
|----------|--------------------------|
| API      | `http://localhost:3001`  |
| Frontend | `http://localhost:3000`  |

That is the recommended setup. Use this guide only if you have a specific
reason to run TLS locally (e.g. testing a feature that requires a "secure
context" such as the clipboard or service-worker APIs, or accessing the dev
server from a phone over the LAN where the browser refuses HTTP).

> **Both ends must use the same scheme.** If the React dev server runs HTTPS,
> the API must serve HTTPS too — the browser blocks HTTPS pages from fetching
> HTTP URLs (mixed content), and an HTTPS request to a plain-HTTP server
> produces `SSL_ERROR_RX_RECORD_TOO_LONG` in Firefox.

## 1. Generate a self-signed certificate

From the repo root:

```bash
mkdir -p backend/certs
LAN_IP="$(hostname -I 2>/dev/null | awk '{print $1}')"
SAN="DNS:localhost,IP:127.0.0.1${LAN_IP:+,IP:$LAN_IP}"
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout backend/certs/key.pem \
  -out    backend/certs/cert.pem \
  -days 365 -subj "/CN=localhost" \
  -addext "subjectAltName=$SAN"
echo "Cert SANs: $SAN"
```

Re-run this whenever your LAN IP changes, otherwise Firefox/Chrome will reject
the cert when you connect from another device.

> **Do not commit the generated files.** `backend/certs/` should be in
> `.gitignore`. The private key is local-only.

## 2. Wire HTTPS into the backend

Edit `backend/src/server.ts` so it serves HTTPS when the cert files exist and
falls back to HTTP otherwise:

```ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "config/.env") });

import fs from "fs";
import http from "http";
import https from "https";
import app from "./app";
import { startJanitor } from "./janitor";

const PORT = Number(process.env.PORT || 3000);

const certDir = path.join(__dirname, "..", "certs");
const keyPath = process.env.TLS_KEY  || path.join(certDir, "key.pem");
const certPath = process.env.TLS_CERT || path.join(certDir, "cert.pem");
const useHttps = fs.existsSync(keyPath) && fs.existsSync(certPath);

const server = useHttps
    ? https.createServer(
        { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) },
        app,
    )
    : http.createServer(app);

server.listen(PORT, "0.0.0.0", () => {
    const proto = useHttps ? "https" : "http";
    console.log(`Server running on ${proto}://localhost:${PORT}`);
    console.log(`Accessible on network at ${proto}://<YOUR_IP>:${PORT}`);
});

export default server;
```

The CORS allow-list in `backend/src/app.ts` already accepts both `http` and
`https` origins on `192.168.x.x` — no change needed there.

## 3. Switch the frontend to HTTPS

Edit `frontend/.env` (this file is gitignored — local-only):

```
REACT_APP_API_URL=https://localhost:3001     # or https://<your-LAN-IP>:3001
HTTPS=true
HOST=0.0.0.0
PORT=3000
DANGEROUSLY_DISABLE_HOST_CHECK=true
```

If the dev server is started via `npm start`, also append `HTTPS=true` to the
`scripts.start` line in `frontend/package.json`. (CRA reads `HTTPS` from either
the env or the script.)

CRA will generate its own throwaway cert for the dev server. To make CRA use
*your* cert instead (so the same SAN list covers both ends), add to
`frontend/.env`:

```
SSL_CRT_FILE=../backend/certs/cert.pem
SSL_KEY_FILE=../backend/certs/key.pem
```

## 4. Trust the cert in the browser

1. Visit `https://localhost:3001/api/health` (and the LAN-IP equivalent if
   you'll connect from another device). Firefox shows *"Warning: Potential
   Security Risk"* → click **Advanced** → **Accept the Risk and Continue**.
2. Repeat for `https://localhost:3000`.
3. Until you do step 1 for the API, the frontend's `fetch` calls will fail
   silently with a network error — the browser refuses self-signed certs for
   XHR/fetch until the host has been manually trusted via a top-level
   navigation.

## 5. Reverting to plain HTTP

- Delete `backend/certs/` (the backend will fall back to HTTP automatically
  with the change in step 2).
- Set `REACT_APP_API_URL` back to `http://...` and remove `HTTPS=true`.
- Restart the dev script.

## Production note

Production traffic terminates TLS at Caddy (see `Caddyfile` /
`docker-compose.yml`). Don't ship self-signed certs — Caddy fetches a real one
from Let's Encrypt for the configured domain. The HTTPS path described here is
only for local development.
