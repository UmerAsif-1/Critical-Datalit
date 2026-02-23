import { Request, Response } from "express";
import {db} from "../db";
import { getQuizById } from "../quizzes";
import { computeTraitTotals, computeResult } from "../quizzes/engine";


interface SessionRow {
    id: string;
    quiz_id: string;
}


interface GameRow {
    session_id: string;
    user_cookie: string;
    [key: `answer_${number}`]: number | null | string | undefined;
}


export function getPlayerResult(req: Request, res: Response) {
    const sessionId = req.query.sessionId;
    if (typeof sessionId !== "string") {
        return res.status(400).json({error: "Missing sessionId"});
    }

    const userCookie = req.cookies["__Host-user_token"];
    if (!userCookie) {
        return res.status(401).json({error: "No user cookie."});
    }
    const session = db.prepare(`
    SELECT id, quiz_id FROM sessions WHERE id = ?
    `).get(sessionId) as SessionRow | undefined;

    if(!session){
        return res.status(400).json({error: "No session found"});
    }

    const quiz = getQuizById(session.quiz_id);
    if (!quiz) {
        return res.status(410).json({ error: "Quiz unavailable" });
    }

    const row = db.prepare(
            `SELECT * FROM game WHERE session_id = ? AND user_cookie = ?`
                             ).get(sessionId, userCookie) as GameRow | undefined;

    if (!row) {
        return res.status(404).json({ error: "Player not found in session" });
    }

    const totalQuestions = quiz.questions.length;
    const answers: (number | null)[] = [];
    for (let i = 1; i <= totalQuestions; i++) {
        const key = `answer_${i}` as const;
        const raw = row[key];

        if (raw === null || raw === undefined) {
            answers.push(null);
        } else {
            // SqLite might be weird with types. So enforce them
            const numeric = typeof raw === "number" ? raw : Number(raw);
            answers.push(Number.isNaN(numeric) ? null : numeric);
        }
    }

    const answeredCount = answers.filter((a) => a !== null).length;
    if (answeredCount < totalQuestions) {
        // All questions not answered so send pending
        return res.json({
            pending: true,
            answered: answeredCount,
            total: totalQuestions,
        });
    }


    for (let i = 0; i < totalQuestions; i++) {
        const answerIndex = answers[i];
        if (answerIndex == null){
            continue;
        }
        const question = quiz.questions[i];
        if (answerIndex < 0 || answerIndex >= question.answers.length) {
            return res
                .status(410)
                .json({ error: "Stored answer index invalid for this quiz version" });
        }
    }

    const totals = computeTraitTotals(quiz, answers);
    const finalResult = computeResult(quiz, totals);

    const traits = quiz.resultLogic.traits.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        score: totals[t.id],
    }));

    return res.json({
        pending: false,
        result: finalResult,
        traits,
    });







}
