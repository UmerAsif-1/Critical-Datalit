import type { Request, Response, NextFunction } from "express";
import {db} from "../db";
import { getAdminUuid, getUserUuid } from "../utils/cookies";
import { GameRow, SessionRow } from "../types/http";
import {isValidJoinCode} from "../utils/generateSessionCodes";

function firstQueryString(val: unknown): string | undefined {
    if (Array.isArray(val)) return typeof val[0] === "string" ? val[0] : undefined;
    return typeof val === "string" ? val : undefined;
}

export function requireAdminByJoinCode(req: Request, res: Response, next: NextFunction) {
    const adminToken = getAdminUuid(req);
    if (!adminToken){
        return res.status(401).json({ error: "Missing admin authentication" });
    }

    const code = req.params.code;

    if (typeof code !== "string" || !isValidJoinCode(code)) {
        return res.status(400).json({ error: "Invalid join code format" });
    }

    const session = db
        .prepare(`SELECT * FROM sessions WHERE join_code = ? AND admin_cookie = ?`)
        .get(code, adminToken) as SessionRow | undefined;

    if (!session){
        return res.status(404).json({ error: "Session not found or unauthorized" });
    }

    req.admin = {session}
    return next();
}

export function requireAdminBySessionId(req: Request, res: Response, next: NextFunction) {
    const adminToken = getAdminUuid(req);
    if (!adminToken){
        return res.status(401).json({ error: "Missing admin authentication" });
    }

    const sessionId = req.params.sessionId;
    if (typeof sessionId !== "string" || !sessionId) {
        return res.status(400).json({ error: "Missing sessionId" });
    }

    const session = db
        .prepare(`SELECT * FROM sessions WHERE id = ? AND admin_cookie = ?`)
        .get(sessionId, adminToken) as SessionRow | undefined;

    if (!session) return res.status(404).json({ error: "Session not found or unauthorized" });

    req.admin = {session}
    return next();
}


export function requireUserBySessionIdFromBody(req: Request, res: Response, next: NextFunction) {
    const userToken = getUserUuid(req);
    if (!userToken){
        return res.status(401).json({ error: "Missing user authentication" });
    }

    const sessionId =
        req.body && typeof req.body === "object" && typeof (req.body as any).sessionId === "string"
            ? (req.body as any).sessionId
            : undefined;

    if (!sessionId){
        return res.status(400).json({ error: "Invalid or missing sessionId" });
    }

    const session = db.prepare(`SELECT * FROM sessions WHERE id = ?`).get(sessionId) as SessionRow | undefined;
    if (!session){
        return res.status(404).json({ error: "Session not found" });
    }

    const game = db
        .prepare(`SELECT * FROM game WHERE session_id = ? AND user_cookie = ?`)
        .get(session.id, userToken) as GameRow | undefined;

    if (!game){
        return res.status(404).json({ error: "Player not found for session" });
    }

    req.user = {session, game}
    return next();
}


export function requireUserBySessionIdFromQuery(req: Request, res: Response, next: NextFunction) {
    const userToken = getUserUuid(req);
    if (!userToken){
        return res.status(401).json({ error: "Missing user authentication" });
    }

    const sessionId = firstQueryString((req.query as any).sessionId);
    if (!sessionId){
        return res.status(400).json({ error: "Missing sessionId" });
    }

    const session = db.prepare(`SELECT * FROM sessions WHERE id = ?`).get(sessionId) as SessionRow | undefined;
    if (!session){
        return res.status(404).json({ error: "Session not found" });
    }

    const game = db
        .prepare(`SELECT * FROM game WHERE session_id = ? AND user_cookie = ?`)
        .get(session.id, userToken) as GameRow | undefined;

    if (!game) {
        return res.status(404).json({ error: "Player not found for session" });
    }

    req.user = {session, game}
    return next();
}