import {Router} from "express";
import {joinSession,createSession} from "../controllers/session.controller";

const router = Router();

router.post("/create", createSession);
router.post("/join", joinSession);

export default router;