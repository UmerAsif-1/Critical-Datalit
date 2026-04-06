import type { QuestionCategory, SessionQuestion } from "../types/sessionQuestion";
import { QUESTION_CATEGORIES } from "../types/sessionQuestion";

const API_BASE = process.env.REACT_APP_API_URL ?? "";

// true → GET /api/sessions/:id/questions; false → local placeholders only.
export const USE_REMOTE_SESSION_QUESTIONS = process.env.REACT_APP_FETCH_SESSION_QUESTIONS === "true";

function isQuestionCategory(value: string): value is QuestionCategory {
    return (QUESTION_CATEGORIES as readonly string[]).includes(value);
}

// Maps API category strings to QuestionCategory.
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

    const resolved = aliases[key];
    if (resolved) {
        return resolved;
    }
    if (isQuestionCategory(key)) {
        return key;
    }
    return "gender";
}

function parseSessionQuestion(row: unknown): SessionQuestion | null {
    if (!row || typeof row !== "object") {
        return null;
    }
    const o = row as Record<string, unknown>;
    const id = typeof o.id === "string" ? o.id : typeof o.questionId === "string" ? o.questionId : "";
    const prompt =
        typeof o.prompt === "string"
            ? o.prompt
            : typeof o.text === "string"
              ? o.text
              : typeof o.question === "string"
                ? o.question
                : "";
    if (!id || !prompt) {
        return null;
    }
    return {
        id,
        category: normalizeQuestionCategory(o.category),
        prompt,
    };
}

function parseQuestionsPayload(data: unknown): SessionQuestion[] {
    if (!data || typeof data !== "object") {
        return [];
    }
    const o = data as Record<string, unknown>;
    const list = o.questions ?? o.items ?? o.data;
    if (!Array.isArray(list)) {
        return [];
    }
    return list.map(parseSessionQuestion).filter((q): q is SessionQuestion => q !== null);
}

// Stand-in list until API is on (REACT_APP_FETCH_SESSION_QUESTIONS=true).
export const PLACEHOLDER_SESSION_QUESTIONS: SessionQuestion[] = [
    {
        id: "placeholder-age",
        category: "age",
        prompt: "People rarely make assumptions about me online because of my age.",
    },
    {
        id: "placeholder-class",
        category: "class",
        prompt: "I can afford devices and data plans that keep me well connected online.",
    },
    {
        id: "placeholder-language",
        category: "language",
        prompt: "I can use the web comfortably in my preferred language.",
    },
    {
        id: "placeholder-gender",
        category: "gender",
        prompt: "My opinions online are rarely dismissed because of my gender.",
    },
    {
        id: "placeholder-race",
        category: "race_ethnicity",
        prompt: "I rarely see harmful stereotypes about my racial or ethnic background online.",
    },
    {
        id: "placeholder-ability",
        category: "ability",
        prompt: "Most websites and apps I need are usable with my abilities and assistive tools.",
    },
];

async function fetchRemoteSessionQuestions(sessionId: string): Promise<SessionQuestion[]> {
    const url = `${API_BASE}/api/sessions/${encodeURIComponent(sessionId)}/questions`;
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) {
        throw new Error(`Questions request failed (${res.status})`);
    }
    const data = await res.json().catch(() => ({}));
    const questions = parseQuestionsPayload(data);
    if (questions.length === 0) {
        throw new Error("No questions in response");
    }
    return questions;
}

// Fetches questions when USE_REMOTE_SESSION_QUESTIONS; on failure uses placeholders.
export async function fetchSessionQuestions(sessionId: string): Promise<SessionQuestion[]> {
    if (!USE_REMOTE_SESSION_QUESTIONS) {
        return PLACEHOLDER_SESSION_QUESTIONS;
    }

    try {
        return await fetchRemoteSessionQuestions(sessionId);
    } catch (e) {
        console.warn("[sessionQuestions] Remote questions failed; using placeholders:", sessionId, e);
        return PLACEHOLDER_SESSION_QUESTIONS;
    }
}
