import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import sessionRoutes from "./routes/session.routes";
import gameRoutes from "./routes/game.routes";
import quizRoutes from "./routes/quiz.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true,
        credentials: true,
    }),
);
app.use(express.json());
app.use(cookieParser());


app.use("/api/sessions", sessionRoutes);
app.use("/api/game", gameRoutes);
app.use(quizRoutes);
app.use("/api/admin", adminRoutes);


app.use("/api/health",(req, res) => res.json({ok:true}));

export default app;