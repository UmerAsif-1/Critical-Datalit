import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "config/.env") });

import app from "./app";
import { startJanitor } from "./janitor";

const PORT = process.env.PORT || 3000;

const server = // Explicitly listen on '0.0.0.0' to allow local network access
    app.listen(Number(PORT), "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Accessible on network at http://<YOUR_IP>:${PORT}`);
    });


export default server;