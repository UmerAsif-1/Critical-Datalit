import type { Request, Response } from "express";
import { db } from "../db";
import { quizzes } from "../quizzes";
import { computeTraitTotals, computeResult } from "../quizzes/engine";

export function getSessionResults(req: Request, res: Response) {
    // Middleware changes makes all id checks so Session EXISTS
    const session = req.admin!.session;

    const quiz = quizzes.find(q => q.id === session.quiz_id);
    if (!quiz) {
        return res.status(410).json({ error: "Quiz no longer available" });
    }

    const questionCount = quiz.questions.length;

    const players = db
        .prepare(`SELECT * FROM game WHERE session_id = ?`)
        .all(session.id) as Array<Record<string, unknown>>;

    // Build per-player answer arrays
    // - unanswered -> null
    // - non-integer / NaN -> null
    // - out-of-bounds -> null (and count as warning)
    let invalidIndexCount = 0;

    const playerResults = players.map((p) => {
        const answers: (number | null)[] = [];
        for (let i = 1; i <= questionCount; i++) {
            const raw = p[`answer_${i}` as const] as unknown;
            if (raw == null) {
                answers.push(null);
                continue;
            }
            const idx = typeof raw === "number" ? raw : Number(raw);
            if (!Number.isInteger(idx)) {
                answers.push(null);
                continue;
            }
            const q = quiz.questions[i - 1];
            if (idx < 0 || idx >= q.answers.length) {
                invalidIndexCount++;
                answers.push(null);
                continue;
            }
            answers.push(idx);
        }
        return {
            userCookie: String(p["user_cookie"] ?? ""),
            answers,
        };
    });

    // Per-question counters from sessions table
    const questionCounters = Array.from({ length: questionCount }, (_, i) =>
        Number((session as any)[`question_${i + 1}`] || 0)
    );

    // Aggregate trait totals across all players
    // As in ALL traitScores summed up for all answers!
    const aggregateScores: Record<string, number> = {};
    for (const t of quiz.resultLogic.traits) aggregateScores[t.id] = 0;

    for (const { answers } of playerResults) {
        const totals = computeTraitTotals(quiz, answers);
        for (const [traitId, v] of Object.entries(totals)) {
            aggregateScores[traitId] += v;
        }
    }

    const aggregateResult = computeResult(quiz, aggregateScores);

    // return everything
    return res.json({
        session: {
            id: session.id,
            code: session.join_code,
            quizId: session.quiz_id,
            createdAt: session.created_at,
        },
        questionCounters,
        players: playerResults, // answers are indices (or null);
        aggregate: {
            scores: aggregateScores,
            result: aggregateResult,
        },
        warnings: invalidIndexCount > 0 ? { invalidAnswerIndices: invalidIndexCount } : undefined,
    });
}

/**
 * End session (admin).
 * TODO: ADD WAY TO IMPORT CSV BEFORE DROPPING THIS FROM MEMORY
 */
export function endSession(req: Request, res: Response) {
    const session = req.admin!.session;
    const info = db.prepare(`DELETE FROM sessions WHERE id = ?`).run(session.id);
    return res.json({ success: true, deleted: info.changes || 0 });
}