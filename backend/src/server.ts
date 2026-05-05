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
const keyPath = process.env.TLS_KEY || path.join(certDir, "key.pem");
const certPath = process.env.TLS_CERT || path.join(certDir, "cert.pem");
const useHttps = fs.existsSync(keyPath) && fs.existsSync(certPath);

// HTTPS binds to all interfaces (LAN reachable). Plain HTTP is localhost-only:
// without a real cert we won't serve unencrypted traffic on the network.
const host = useHttps ? "0.0.0.0" : "127.0.0.1";
const proto = useHttps ? "https" : "http";

const server = useHttps
    ? https.createServer(
        { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) },
        app,
    )
    : http.createServer(app);

server.listen(PORT, host, () => {
    console.log(`Server running on ${proto}://localhost:${PORT}`);
    if (useHttps) {
        console.log(`Accessible on network at ${proto}://<YOUR_IP>:${PORT}`);
    } else {
        console.log("HTTP fallback: localhost only. Generate certs in backend/certs/ to enable HTTPS on LAN.");
    }
});

export default server;
