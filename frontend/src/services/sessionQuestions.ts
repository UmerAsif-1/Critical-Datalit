import type { QuestionCategory, SessionQuestion } from "../types/sessionQuestion";
import { QUESTION_CATEGORIES } from "../types/sessionQuestion";

const API_BASE = process.env.REACT_APP_API_URL ?? "";

function isQuestionCategory(value: string): value is QuestionCategory {
    return (QUESTION_CATEGORIES as readonly string[]).includes(value);
}

export function normalizeQuestionCategory(raw: unknown): QuestionCategory {
    if (typeof raw !== "string") {
        return "gender";
    }
    const key = raw
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/\//g, "_");

    const aliases: Record<string, QuestionCategory> = {
        age: "age",
        class: "class",
        language: "language",
        gender: "gender",
        race_ethnicity: "race_ethnicity",
        ability: "ability",
    };

    if (aliases[key]) {
        return aliases[key];
    }
    if (isQuestionCategory(key)) {
        return key;
    }
    return "gender";
}

function parsePublicQuestion(row: unknown): SessionQuestion | null {
    if (!row || typeof row !== "object") {
        return null;
    }
    const o = row as Record<string, unknown>;
    const id = typeof o.id === "string" ? o.id : "";
    const prompt = typeof o.prompt === "string" ? o.prompt : "";
    if (!id || !prompt) {
        return null;
    }
    return {
        id,
        category: normalizeQuestionCategory(o.category),
        prompt,
    };
}

export function likertValueToAnswerIndex(value: string): number {
    const map: Record<string, number> = {
        completely_agree: 0,
        somewhat_agree: 1,
        somewhat_disagree: 2,
        completely_disagree: 3,
    };
    return map[value] ?? 0;
}

export async function fetchFirstQuizId(): Promise<string> {
    const res = await fetch(`${API_BASE}/api/quizzes`, { credentials: "include" });
    if (!res.ok) {
        throw new Error(`Quiz list failed (${res.status})`);
    }
    const list = (await res.json().catch(() => [])) as unknown;
    if (!Array.isArray(list) || !list[0] || typeof (list[0] as { id?: string }).id !== "string") {
        throw new Error("No quizzes configured");
    }
    return (list[0] as { id: string }).id;
}

export function traitsToScoresByCategory(
    traits: { id: string; score: number }[],
): Partial<Record<QuestionCategory, number>> {
    const out: Partial<Record<QuestionCategory, number>> = {};
    for (const t of traits) {
        if (isQuestionCategory(t.id)) {
            out[t.id] = t.score;
        }
    }
    return out;
}

export async function fetchQuizQuestions(quizId: string): Promise<SessionQuestion[]> {
    const res = await fetch(`${API_BASE}/api/quizzes/${encodeURIComponent(quizId)}`, {
        credentials: "include",
    });
    if (!res.ok) {
        throw new Error(`Quiz load failed (${res.status})`);
    }
    const data = (await res.json().catch(() => ({}))) as { questions?: unknown };
    const list = data.questions;
    if (!Array.isArray(list)) {
        throw new Error("Invalid quiz response");
    }
    const out = list.map(parsePublicQuestion).filter((q): q is SessionQuestion => q !== null);
    if (out.length === 0) {
        throw new Error("Quiz has no questions");
    }
    return out;
}
