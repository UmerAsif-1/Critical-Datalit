const API_BASE = process.env.REACT_APP_API_URL ?? "";

export interface JoinSessionResponse {
    sessionId: string;
    playUrl: string;
    quizId: string;
}

export interface CreateSessionResponse {
    sessionId: string;
    joinCode: string;
    adminUrl: string;
}

export interface GameResultTrait {
    id: string;
    name: string;
    description: string;
    score: number;
}

export interface GameResultResponse {
    pending: boolean;
    answered?: number;
    total?: number;
    result?: string;
    traits?: GameResultTrait[];
}

export async function joinSessionRequest(code: string): Promise<JoinSessionResponse> {
    const res = await fetch(`${API_BASE}/api/sessions/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code }),
    });

    const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
        sessionId?: string;
        playUrl?: string;
        quizId?: string;
    };

    if (!res.ok) {
        throw new Error(data.error || data.message || `Join failed (${res.status})`);
    }

    if (!data.sessionId || !data.playUrl || !data.quizId) {
        throw new Error("Invalid response from server");
    }

    return { sessionId: data.sessionId, playUrl: data.playUrl, quizId: data.quizId };
}

export async function createSessionRequest(quizId: string): Promise<CreateSessionResponse> {
    const res = await fetch(`${API_BASE}/api/sessions/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quizId }),
    });

    const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
        sessionId?: string;
        joinCode?: string;
        adminUrl?: string;
    };

    if (!res.ok) {
        throw new Error(data.error || data.message || `Create session failed (${res.status})`);
    }

    if (!data.sessionId || !data.joinCode) {
        throw new Error("Invalid response from server");
    }

    return {
        sessionId: data.sessionId,
        joinCode: data.joinCode,
        adminUrl: data.adminUrl ?? "",
    };
}

export async function submitGameAnswer(sessionId: string, questionIndex: number, answer: number): Promise<void> {
    const res = await fetch(`${API_BASE}/api/game/submit-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sessionId, questionIndex, answer }),
    });

    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
        throw new Error(data.error || `Submit failed (${res.status})`);
    }
}

export async function getGameResult(sessionId: string): Promise<GameResultResponse> {
    const q = new URLSearchParams({ sessionId });
    const res = await fetch(`${API_BASE}/api/game/result?${q}`, { credentials: "include" });

    const data = (await res.json().catch(() => ({}))) as GameResultResponse & { error?: string };
    if (!res.ok) {
        throw new Error(data.error || `Result failed (${res.status})`);
    }

    return data;
}

export interface AdminPlayerRow {
    userCookie: string;
    answers: (number | null)[];
}

export interface AdminSessionResultsResponse {
    session: {
        id: string;
        code: string;
        quizId: string;
        createdAt: string;
        ttlHours: number;
        expiresAt: string;
    };
    questionCounters: number[];
    players: AdminPlayerRow[];
    aggregate: { scores: Record<string, number>; result: string };
}

export async function getAdminSessionResults(sessionId: string): Promise<AdminSessionResultsResponse> {
    const res = await fetch(`${API_BASE}/api/admin/sessions/${encodeURIComponent(sessionId)}/results`, {
        credentials: "include",
    });
    const data = (await res.json().catch(() => ({}))) as AdminSessionResultsResponse & { error?: string };
    if (!res.ok) {
        throw new Error(data.error || `Admin results failed (${res.status})`);
    }
    return data;
}

export interface QuizDetailQuestion {
    id: string;
    prompt: string;
    category?: string;
    answers: { id: string; label: string }[];
}

export interface QuizDetailResponse {
    id: string;
    title: string;
    questions: QuizDetailQuestion[];
}

export async function getQuizDetail(quizId: string): Promise<QuizDetailResponse> {
    const res = await fetch(`${API_BASE}/api/quizzes/${encodeURIComponent(quizId)}`, {
        credentials: "include",
    });
    const data = (await res.json().catch(() => ({}))) as QuizDetailResponse & { error?: string };
    if (!res.ok) {
        throw new Error(data.error || `Quiz load failed (${res.status})`);
    }
    return data;
}

export async function postAdminEndSession(sessionId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/admin/sessions/${encodeURIComponent(sessionId)}/end`, {
        method: "POST",
        credentials: "include",
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
        throw new Error(data.error || `End session failed (${res.status})`);
    }
}

export async function downloadAdminSessionCsv(sessionId: string, filename: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/admin/sessions/${encodeURIComponent(sessionId)}/export`, {
        credentials: "include",
    });
    if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || `Export failed (${res.status})`);
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}
