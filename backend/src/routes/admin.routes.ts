
import { Router } from "express";
import { getSessionResults, endSession, exportSessionCsv } from "../controllers/admin.controller";
import { requireAdminBySessionId, requireAdminByJoinCode } from "../middleware/auth";

const router = Router();


router.get("/sessions/:sessionId/results",  requireAdminBySessionId, getSessionResults);
router.get("/sessions/:sessionId/export",   requireAdminBySessionId, exportSessionCsv);
router.post("/sessions/:sessionId/end",     requireAdminBySessionId, endSession);

router.get("/sessions/by-code/:code/results", requireAdminByJoinCode, getSessionResults);
router.get("/sessions/by-code/:code/export",  requireAdminByJoinCode, exportSessionCsv);

export default router;