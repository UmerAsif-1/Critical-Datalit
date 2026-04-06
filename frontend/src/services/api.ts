const API_BASE = process.env.REACT_APP_API_URL ?? "";

export interface JoinSessionResponse {
    sessionId: string;
    playUrl: string;
}

// POST /api/sessions/join (cookie session).
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
    };

    if (!res.ok) {
        throw new Error(data.error || data.message || `Join failed (${res.status})`);
    }

    if (!data.sessionId || !data.playUrl) {
        throw new Error("Invalid response from server");
    }

    return { sessionId: data.sessionId, playUrl: data.playUrl };
}
