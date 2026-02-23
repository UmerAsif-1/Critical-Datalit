import { Router } from "express";
import { submitAnswer } from "../controllers/game.controller";
import {getPlayerResult} from "../controllers/gameResult.controller";

const router = Router();


router.post("/submit-answer", submitAnswer);
router.get("/result", getPlayerResult);

export default router;