import {NextFunction, Request, Response} from "express";
import { getCookie } from '../utils/cookies';
import {db} from '../db';

interface SessionAdminRow {
    admin_cookie: string;
}
export function requireAdmin(req:Request, res:Response, next:NextFunction) {
    const token = getCookie(req, '__Host-admin_token');
    const { sessionId } = req.body ?? req.params ?? {};
    if (!token || !sessionId) return res.status(401).json({ error: 'Unauthorized' });

    const row = db.prepare('SELECT admin_cookie FROM sessions WHERE id = ?').get(sessionId) as SessionAdminRow || undefined;
    if (!row || !row.admin_cookie) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    if (row.admin_cookie !== token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
}
