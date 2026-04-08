import {Request,Response}  from "express";
import {db} from '../db';
import {getQuizById, quizzes} from "../quizzes";
import {generateSessionId, generateJoinCode, isValidJoinCode} from "../utils/generateSessionCodes";
import {getUserUuid, setAdminCookie, setUserCookie} from "../utils/cookies";

interface SessionRow{
    id:string,
    quiz_id: string
}
interface SessionInsertRow{
    id : string,
    admin_cookie: string,
    join_code: string,
    quiz_id: string,
    created_at: string
}

export function createSession(req: Request,res: Response) {
    const {quizId} = req.body as { quizId?: string };
    if (!quizId ) {
        return res.status(400).json({message: "Invalid quiz id"});
    }
    const quiz = getQuizById(quizId);
    if (!quiz ) {
        return res.status(400).json({message: "Invalid quiz id"});
    }
    let adminCookie = "";
    const sessionId = generateSessionId();
    let joinCode: string | null = null;
    let attempts = 0;
    while (attempts < 10) {
        attempts++;
        const code = generateJoinCode();
        adminCookie = generateSessionId();
        try {
            const questionCols = quiz.questions.map((_, i) => `question_${i + 1}`);
            const questionPlaceholders = questionCols.map(() => "?");
            const questionValues = questionCols.map(() => 0);

            db.prepare(`
            INSERT INTO sessions (
            id, join_code, admin_cookie, quiz_id, created_at,
            ${questionCols.join(", ")}
            ) VALUES (
            ?, ?, ?, ?, datetime('now'),
            ${questionPlaceholders.join(", ")}
            )
            `).run(
                sessionId,
                code,
                adminCookie,
                quiz.id,
                ...questionValues
            );
            joinCode = code;

            break;

        } catch (err: any) {
            if (!String(err.message).includes("UNIQUE")) {
                console.error(err);
                return res.status(500).json({error: "Database error creating session."})

            }
        }

    }
    if (!joinCode) {
        return res.status(503).json({ error: "Could not generate a unique join code. Try again." });
    }
    setAdminCookie(res, adminCookie);
    return res.status(200).json({
        sessionId,
        joinCode,
        adminUrl: `/session/${joinCode}/admin`
    });

}

export function joinSession(req: Request, res: Response) {
    const {code} = req.body as { code?: string };

    if (!code || !isValidJoinCode(code)) {
        return res.status(400).json({ error: "Invalid join code format" });
    }

    const session = db.prepare(`
        SELECT id, quiz_id
        FROM sessions
        WHERE join_code = ?
    `).get(code) as SessionRow | undefined;

    if (!session) {
        return res.status(404).json({error: "No session found"});
    }
    const existingCookie = getUserUuid(req);
    if (existingCookie) {
        const existing = db.prepare(
            `SELECT 1 FROM game WHERE user_cookie = ? AND session_id = ?`
        ).get(existingCookie, session.id);
        if (existing) {
            return res.status(200).json({
                sessionId: session.id,
                quizId: session.quiz_id,
                playUrl: `/session/${session.id}/play`,
            });
        }
    }


    const quiz = getQuizById(session.quiz_id);
    if (!quiz) {
        return res.status(410).json({error: "No quiz found"});
    }
    const questionCount = quiz.questions.length;

    const answerCols: string[] = [];
    for (let i = 0, len = questionCount; i < len; i++) {
        answerCols.push(`answer_${i + 1}`);
    }
    const columnString = ["user_cookie", "session_id", ...answerCols].join(", ");
    const placeHolders = new Array(answerCols.length + 2).fill("?").join(', ');

    const cookie = generateSessionId();
    const values = [cookie, session.id, ...Array(questionCount).fill(null)];

    db.prepare(`
        INSERT INTO game (${columnString})
        VALUES (${placeHolders})`
    ).run(...values);

    setUserCookie(res, cookie);

    return res.status(200).json({
        sessionId: session.id,
        quizId: session.quiz_id,
        playUrl: `/session/${session.id}/play`,
    });
}