import { Router } from "express";
import { submitAnswer } from "../controllers/game.controller";
import { getPlayerResult as getGameResult } from "../controllers/gameResult.controller";
import {
    requireUserBySessionIdFromBody,
    requireUserBySessionIdFromQuery,
} from "../middleware/auth";


const router = Router();


router.post("/submit-answer", requireUserBySessionIdFromBody,submitAnswer);
router.get("/result", requireUserBySessionIdFromQuery,getGameResult);

export default router;