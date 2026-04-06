import type { Request, Response } from "express";
import { db } from "../db";
import { quizzes } from "../quizzes";
import { computeTraitTotals, computeResult } from "../quizzes/engine";
import { SESSION_TTL_HOURS } from "../config/session";

function sessionExpiresAtIso(createdAt: string): string {
    const normalized = createdAt.includes("T") ? createdAt : createdAt.replace(" ", "T");
    const ms = Date.parse(normalized);
    const base = Number.isNaN(ms) ? Date.now() : ms;
    return new Date(base + SESSION_TTL_HOURS * 3600 * 1000).toISOString();
}

export function getSessionResults(req: Request, res: Response) {
    const session = req.admin!.session;

    const quiz = quizzes.find(q => q.id === session.quiz_id);
    if (!quiz) {
        return res.status(410).json({ error: "Quiz no longer available" });
    }

    const questionCount = quiz.questions.length;

    const players = db
        .prepare(`SELECT * FROM game WHERE session_id = ?`)
        .all(session.id) as Array<Record<string, unknown>>;

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

    const questionCounters = Array.from({ length: questionCount }, (_, i) =>
        Number((session as any)[`question_${i + 1}`] || 0)
    );

    const aggregateScores: Record<string, number> = {};
    for (const t of quiz.resultLogic.traits) aggregateScores[t.id] = 0;

    for (const { answers } of playerResults) {
        const totals = computeTraitTotals(quiz, answers);
        for (const [traitId, v] of Object.entries(totals)) {
            aggregateScores[traitId] += v;
        }
    }

    const aggregateResult = computeResult(quiz, aggregateScores);

    return res.json({
        session: {
            id: session.id,
            code: session.join_code,
            quizId: session.quiz_id,
            createdAt: session.created_at,
            ttlHours: SESSION_TTL_HOURS,
            expiresAt: sessionExpiresAtIso(session.created_at),
        },
        questionCounters,
        players: playerResults,
        aggregate: {
            scores: aggregateScores,
            result: aggregateResult,
        },
        warnings: invalidIndexCount > 0 ? { invalidAnswerIndices: invalidIndexCount } : undefined,
    });
}

function csvEscape(value: string): string {
    if (/[,"\r\n]/.test(value)) {
        return '"' + value.replace(/"/g, '""') + '"';
    }
    return value;
}

export function exportSessionCsv(req: Request, res: Response) {
    const session = req.admin!.session;

    const quiz = quizzes.find(q => q.id === session.quiz_id);
    if (!quiz) {
        return res.status(410).json({ error: "Quiz no longer available" });
    }

    const questionCount = quiz.questions.length;

    const players = db
        .prepare(`SELECT * FROM game WHERE session_id = ?`)
        .all(session.id) as Array<Record<string, unknown>>;

    const traitHeaders = quiz.resultLogic.traits.map(t => t.id);
    const questionHeaders = quiz.questions.map((_, i) => `q${i + 1}`);
    const headers = ["player", ...questionHeaders, ...traitHeaders, "result"];

    const rows: string[][] = [headers];

    players.forEach((p, playerIdx) => {
        const answers: (number | null)[] = [];
        for (let i = 1; i <= questionCount; i++) {
            const raw = p[`answer_${i}`] as unknown;
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
                answers.push(null); continue; }
            answers.push(idx);
        }

        const answerCells = answers.map((idx, qIdx) =>
            idx == null ? "" : quiz.questions[qIdx].answers[idx].label
        );

        const totals = computeTraitTotals(quiz, answers);
        const traitCells = quiz.resultLogic.traits.map(t => String(totals[t.id] ?? 0));
        const result = computeResult(quiz, totals);

        rows.push([`Player ${playerIdx + 1}`, ...answerCells, ...traitCells, result]);
    });

    const csv = rows.map(row => row.map(csvEscape).join(",")).join("\r\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="session-${session.id}.csv"`);
    return res.send(csv);
}

export function endSession(req: Request, res: Response) {
    const session = req.admin!.session;
    const info = db.prepare(`DELETE FROM sessions WHERE id = ?`).run(session.id);
    return res.json({ success: true, deleted: info.changes || 0 });
}