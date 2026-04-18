import type { Request, Response } from "express";
import { db } from "../db";
import { quizzes } from "../quizzes";
import type { Quiz } from "../quizzes/types";
import { computeTraitTotals, computeResult } from "../quizzes/engine";
import { SESSION_TTL_HOURS } from "../config/session";


//helpers


interface ParsedPlayer {
    answerLabels: (string | null)[];
    traits: Record<string, number>;
    result: string;
    completed: boolean;
}

function parsePlayer(quiz: Quiz, p: Record<string, unknown>): ParsedPlayer {
    const questionCount = quiz.questions.length;
    const answers: (number | null)[] = [];

    for (let i = 1; i <= questionCount; i++) {
        const raw = p[`answer_${i}`] as unknown;
        if (raw == null) { answers.push(null); continue; }
        const idx = typeof raw === "number" ? raw : Number(raw);
        if (!Number.isInteger(idx)) { answers.push(null); continue; }
        const q = quiz.questions[i - 1];
        if (idx < 0 || idx >= q.answers.length) { answers.push(null); continue; }
        answers.push(idx);
    }

    const completed = answers.every(a => a !== null);
    const answerLabels = answers.map((idx, qIdx) =>
        idx == null ? null : quiz.questions[qIdx]!.answers[idx]!.label
    );
    const traits = computeTraitTotals(quiz, answers);
    const result = completed ? computeResult(quiz, traits) : "";

    return { answerLabels, traits, result, completed };
}

function computeAggregate(quiz: Quiz, parsedPlayers: ParsedPlayer[]) {
    const scores: Record<string, number> = {};
    for (const t of quiz.resultLogic.traits) scores[t.id] = 0;

    for (const { traits } of parsedPlayers) {
        for (const [id, v] of Object.entries(traits)) scores[id] += v;
    }

    const n = Math.max(1, parsedPlayers.length);
    const averages: Record<string, number> = {};
    for (const [id, sum] of Object.entries(scores)) {
        averages[id] = parseFloat((sum / n).toFixed(2));
    }

    return { scores, averages, result: computeResult(quiz, scores) };
}

function sessionExpiresAtIso(createdAt: string): string {
    const normalized = createdAt.includes("T") ? createdAt : createdAt.replace(" ", "T");
    const ms = Date.parse(normalized);
    const base = Number.isNaN(ms) ? Date.now() : ms;
    return new Date(base + SESSION_TTL_HOURS * 3600 * 1000).toISOString();
}

function csvEscape(value: string): string {
    if (/[,"\r\n]/.test(value)) {
        return '"' + value.replace(/"/g, '""') + '"';
    }
    return value;
}


// Controllers


export function getSessionResults(req: Request, res: Response) {
    const session = req.admin!.session;

    const quiz = quizzes.find(q => q.id === session.quiz_id);
    if (!quiz) {
        return res.status(410).json({ error: "Quiz no longer available" });
    }

    const questionCount = quiz.questions.length;

    const rawPlayers = db
        .prepare(`SELECT * FROM game WHERE session_id = ?`)
        .all(session.id) as Array<Record<string, unknown>>;

    let invalidIndexCount = 0;

    // Keep existing shape for the live polling endpoint (userCookie + raw answers).
    const playerResults = rawPlayers.map((p) => {
        const answers: (number | null)[] = [];
        for (let i = 1; i <= questionCount; i++) {
            const raw = p[`answer_${i}`] as unknown;
            if (raw == null) { answers.push(null); continue; }
            const idx = typeof raw === "number" ? raw : Number(raw);
            if (!Number.isInteger(idx)) { answers.push(null); continue; }
            const q = quiz.questions[i - 1];
            if (idx < 0 || idx >= q.answers.length) { invalidIndexCount++; answers.push(null); continue; }
            answers.push(idx);
        }
        return { userCookie: String(p["user_cookie"] ?? ""), answers };
    });

    const questionCounters = Array.from({ length: questionCount }, (_, i) =>
        Number((session as any)[`question_${i + 1}`] || 0)
    );

    const aggregateScores: Record<string, number> = {};
    for (const t of quiz.resultLogic.traits) aggregateScores[t.id] = 0;
    for (const { answers } of playerResults) {
        const totals = computeTraitTotals(quiz, answers);
        for (const [id, v] of Object.entries(totals)) aggregateScores[id] += v;
    }

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
            result: computeResult(quiz, aggregateScores),
        },
        warnings: invalidIndexCount > 0 ? { invalidAnswerIndices: invalidIndexCount } : undefined,
    });
}

export function exportSessionCsv(req: Request, res: Response) {
    const session = req.admin!.session;

    const quiz = quizzes.find(q => q.id === session.quiz_id);
    if (!quiz) {
        return res.status(410).json({ error: "Quiz no longer available" });
    }

    const rawPlayers = db
        .prepare(`SELECT * FROM game WHERE session_id = ?`)
        .all(session.id) as Array<Record<string, unknown>>;

    const parsedPlayers = rawPlayers.map(p => parsePlayer(quiz, p));
    const completedCount = parsedPlayers.filter(p => p.completed).length;
    const incompleteCount = parsedPlayers.length - completedCount;
    const aggregate = computeAggregate(quiz, parsedPlayers);

    const traitIds = quiz.resultLogic.traits.map(t => t.id);
    const traitNames = quiz.resultLogic.traits.map(t => t.name);
    const questionCounters = Array.from({ length: quiz.questions.length }, (_, i) =>
        Number((session as any)[`question_${i + 1}`] || 0)
    );

    const rows: string[][] = [];

    // Metadata
    rows.push(["Session ID", session.id]);
    rows.push(["Quiz ID", session.quiz_id]);
    rows.push(["Created at", session.created_at]);
    rows.push(["Participants", String(parsedPlayers.length)]);
    rows.push(["Completed", String(completedCount)]);
    rows.push(["Incomplete", String(incompleteCount)]);
    rows.push([]);

    // Per-question answer count row
    const qCountHeader = ["Question answered counts", ""];
    const qCountValues = questionCounters.map(String);
    rows.push([...qCountHeader, ...qCountValues]);
    rows.push([]);

    // Player data
    const questionHeaders = quiz.questions.map((_, i) => `q${i + 1}`);
    rows.push(["player", "completed", ...questionHeaders, ...traitNames, "result"]);

    parsedPlayers.forEach((p, idx) => {
        const answerCells = p.answerLabels.map(l => l ?? "");
        const traitCells = traitIds.map(id => String(p.traits[id] ?? 0));
        rows.push([
            `Player ${idx + 1}`,
            p.completed ? "yes" : `no (${p.answerLabels.filter(l => l !== null).length}/${quiz.questions.length})`,
            ...answerCells,
            ...traitCells,
            p.result,
        ]);
    });

    // Aggregate / average row
    rows.push([]);
    const blankQCols = quiz.questions.map(() => "");
    const avgCells = traitIds.map(id => String(aggregate.averages[id] ?? 0));
    rows.push(["Average (all participants)", "", ...blankQCols, ...avgCells, aggregate.result]);

    const sumCells = traitIds.map(id => String(aggregate.scores[id] ?? 0));
    rows.push(["Total (sum)", "", ...blankQCols, ...sumCells, ""]);

    const csv = rows.map(row => row.map(csvEscape).join(",")).join("\r\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="session-${session.id}.csv"`);
    return res.send(csv);
}

export function endSession(req: Request, res: Response) {
    const session = req.admin!.session;

    const quiz = quizzes.find(q => q.id === session.quiz_id);
    if (!quiz) {
        db.prepare(`UPDATE sessions SET ended_at = datetime('now') WHERE id = ?`).run(session.id);
        return res.json({ success: true, results: null });
    }

    const questionCount = quiz.questions.length;

    const rawPlayers = db
        .prepare(`SELECT * FROM game WHERE session_id = ?`)
        .all(session.id) as Array<Record<string, unknown>>;

    const parsedPlayers = rawPlayers.map(p => parsePlayer(quiz, p));
    const completedCount = parsedPlayers.filter(p => p.completed).length;
    const aggregate = computeAggregate(quiz, parsedPlayers);

    const questionCounters = Array.from({ length: questionCount }, (_, i) =>
        Number((session as any)[`question_${i + 1}`] || 0)
    );

    db.prepare(`UPDATE sessions SET ended_at = datetime('now') WHERE id = ?`).run(session.id);

    return res.json({
        success: true,
        results: {
            session: {
                id: session.id,
                quizId: session.quiz_id,
                createdAt: session.created_at,
                ttlHours: SESSION_TTL_HOURS,
            },
            participantCount: parsedPlayers.length,
            completedCount,
            incompleteCount: parsedPlayers.length - completedCount,
            questionCounters,
            players: parsedPlayers.map(p => ({
                answerLabels: p.answerLabels,
                traits: p.traits,
                result: p.result,
                completed: p.completed,
            })),
            aggregate,
        },
    });
}
