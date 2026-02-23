import { Router } from "express";
import { submitAnswer } from "../controllers/game.controller";

const router = Router();


router.post("/submit-answer", submitAnswer);

export default router;