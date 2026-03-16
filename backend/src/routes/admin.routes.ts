
import { Router } from "express";
import { getSessionResults, endSession } from "../controllers/admin.controller";
import { requireAdminBySessionId, requireAdminByJoinCode } from "../middleware/auth";

const router = Router();


router.get("/sessions/:sessionId/results", requireAdminBySessionId, getSessionResults);
router.post("/sessions/:sessionId/end",     requireAdminBySessionId, endSession);


router.get("/sessions/by-code/:code/results", requireAdminByJoinCode, getSessionResults);

export default router;