import express from "express";
import cookieParser from "cookie-parser";

import sessionRoutes from "./routes/session.routes";
import gameRoutes from "./routes/game.routes";

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use("/api/sessions", sessionRoutes);
app.use("/api/game", gameRoutes);

export default app;