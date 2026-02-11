import {Request,Response}  from "express";
import {db} from '../db';
import {quizzes} from "../quizzes";
import {generateSessionId, generateJoinCode} from "../utils/generateSessionCodes";

const MAX_QUESTIONS = 50; // This is the temp value in schema.sql

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
    if (!quizId || !quizzes[Number(quizId)]) {
        return res.status(400).json({message: "Invalid quiz id"});
    }
    const quiz = quizzes[Number(quizId)];
    const questionCount = quiz.questions.length;

    const sessionId = generateSessionId();
    const adminCookie = generateSessionId(); // TODO: Implement cookie-creator and call it
    const questionCols: string[] = [];
    for (let i = 0, len = questionCount; i < len; i++) {
        questionCols.push(`question_${i + 1}`);
    }
    let joinCode: string | null = null;
    while (true) {
        const code = generateJoinCode();
        try {

            const columnString = ["id", "join_code", "admin_cookie", "quiz_id", "created_at", ...questionCols].join(", ");
            const placeHolders = [
                "?",
                "?",
                "?",
                "?",
                "datetime('now')",
                ...questionCols.map(() => '0')
            ].join(', ');

            db.prepare(
                `INSERT INTO sessions (${columnString})
                 VALUES (${placeHolders})`
            ).run(sessionId, code, adminCookie, quiz);
            joinCode = code;

            break;

        } catch (err: any) {
            if (!String(err.message).includes("UNIQUE")) {
                console.error(err);
                return res.status(500).json({error: "Database error creating session."})

            }
        }

    }
    // TODO: Fix this when we have an actual domain
    res.cookie("session_admin_cookie", adminCookie, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            domain: "localhost",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000
        }
    );

}

    export function joinSession(req: Request, res: Response) {
        const {code} = req.body as { code?: string };

        const session = db.prepare(`
            SELECT id, quiz_id
            FROM sessions
            WHERE join_code = ?
        `).get(code) as SessionRow | undefined;

        if (!session) {
            return res.status(404).json({error: "No session found"});
        }

        const quiz = quizzes[Number(session.quiz_id)];
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

        const cookie = generateSessionId(); // TODO: Implement cookie-creator and call it
        const values = [cookie, session.id, ...Array(questionCount).fill(null)];

        db.prepare(`
            INSERT INTO game (${columnString})
            VALUES (${placeHolders})`
        ).run(...values);

        // TODO: Fix this when we have an actual domain
        res.cookie("User_Token", cookie, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                domain: "localhost",
                path: "/",
                maxAge: 24 * 60 * 60 * 1000
            }
        );


    }
