
/// <reference path="../types/express-augment.d.ts" />
import { Request, Response } from "express";
import { db} from "../db";
import { quizzes } from "../quizzes";


const MAX_QUESTION_AMOUNT = 50;

interface AnswerRow {
    ans: number | null;
}

interface SessionRow {
    quiz_id: string;
}

export function submitAnswer(req: Request, res: Response) {

    const { session, game } = req.user!;

    const {questionIndex, answer } = req.body as {
        sessionId: string;
        questionIndex: number;
        answer: number;
    };

    if (!Number.isInteger(questionIndex) || !Number.isInteger(answer) || answer < 0) {
        return res.status(400).json({ error: "Invalid format!" });
    }

    if (questionIndex < 1 || questionIndex > MAX_QUESTION_AMOUNT) {
        return res.status(400).json({ error: "Question index out of supported range!" });
    }

    try {
        db.transaction(() => {
            const quiz = quizzes.find(q => q.id === session.quiz_id);
        if (!quiz) {
            throw Object.assign(new Error("No quiz found!"), { status: 410 });
        }

        const questionCount = quiz.questions.length;
        if (questionIndex > questionCount) {
            throw Object.assign(new Error("Question index exceeds quiz length"), { status: 400 });
        }

        const question = quiz.questions[questionIndex - 1];

        const valid = question.answers[answer] !== undefined;
        if (!valid) {
            throw Object.assign(new Error("Invalid answer index"), { status: 400 });
        }

        const answerCol = `answer_${questionIndex}`;
        const questionCol = `question_${questionIndex}`;

        const prevAns = db.prepare(`
                SELECT ${answerCol} AS ans
                FROM game
                WHERE user_cookie = ? AND session_id = ?
            `).get(game.user_cookie, session.id) as AnswerRow | undefined;

        if (!prevAns) {
            throw Object.assign(new Error("User not in this session"), { status: 404 });
        }

        const prev = prevAns.ans;

        db.prepare(`
                UPDATE game
                SET ${answerCol} = ?
                WHERE user_cookie = ? AND session_id = ?
            `).run(answer, game.user_cookie, session.id);

        if (prev == null ) {
            db.prepare(`
                    UPDATE sessions
                    SET ${questionCol} = ${questionCol} + 1
                    WHERE id = ?
                `).run(session.id);
        }
    })();

        return res.json({ success: true });

    } catch (error: any) {
        const eStatus = error?.status || 500;
        console.error(error);
        console.log(eStatus);
        return res.status(eStatus).json({ error: error.message || "Internal Server Error" });
    }
}