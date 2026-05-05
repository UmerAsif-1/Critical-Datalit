import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import sessionRoutes from "./routes/session.routes";
import gameRoutes from "./routes/game.routes";
import quizRoutes from "./routes/quiz.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://localhost:3000",
        "https://localhost:3001",
        /^https:\/\/192\.168\.\d+\.\d+:\d+$/ // LAN IPs must use HTTPS
    ];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());


app.use("/api/sessions", sessionRoutes);
app.use("/api/game", gameRoutes);
app.use(quizRoutes);
app.use("/api/admin", adminRoutes);


app.use("/api/health",(req, res) => res.json({ok:true}));

export default app;