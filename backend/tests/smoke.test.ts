import request from "supertest";
import app from "../src/app";
import { resetDb } from "./utils/resetDB";
import { db } from "../src/db";
import { beforeAll } from "vitest";

interface QuestionCounterRow {
    question_1: number;
}

describe("Smoke Test: CriticalDatalit backend", () => {
    beforeAll(() => {
        resetDb();
    });

    let sessionId: string;
    let joinCode: string;
    let userCookie: string; // "name=value"

    // Small helper: find a cookie by name and return only "name=value"
    function pickCookie(setCookieHeader: string[] | string | undefined, name: string): string | undefined {
        const arr = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader].filter(Boolean) as string[];
        const hit = arr.find(h => h?.startsWith(`${name}=`));
        return hit ? hit.split(";")[0] : undefined;
    }

    test("Create session", async () => {
        const res = await request(app)
            .post("/api/sessions/create")
            .send({ quizId: "foo" })
            .expect(200);

        expect(res.body.sessionId).toBeDefined();
        expect(res.body.joinCode).toMatch(/^\d{6}$/);

        sessionId = res.body.sessionId;
        joinCode = res.body.joinCode;

        // admin cookie present
        const adminCookie = pickCookie(res.headers["set-cookie"], "__Host-admin_token");
        expect(adminCookie).toBeDefined();
    });

    test("Join session", async () => {
        const res = await request(app)
            .post("/api/sessions/join")
            .send({ code: joinCode })
            .expect(200);

        // sessionId matches the one from create
        expect(res.body.sessionId).toBe(sessionId);

        // NEW: playUrl is sessionId-based
        expect(res.body.playUrl).toMatch(new RegExp(`^/session/${sessionId}/play$`));

        // capture user cookie as "name=value"
        userCookie = pickCookie(res.headers["set-cookie"], "__Host-user_token")!;
        expect(userCookie).toBeDefined();
    });

    test("Submit answer increments only on first submit", async () => {
        // first submit
        await request(app)
            .post("/api/game/submit-answer")
            .set("Cookie", userCookie)
            .send({ sessionId, questionIndex: 1, answer: 0 })
            .expect(200);

        const first = (db
            .prepare(`SELECT question_1 FROM sessions WHERE id = ?`)
            .get(sessionId) as QuestionCounterRow) || undefined;

        expect(first.question_1).toBe(1);

        // second submit should NOT increment
        await request(app)
            .post("/api/game/submit-answer")
            .set("Cookie", userCookie)
            .send({ sessionId, questionIndex: 1, answer: 1 })
            .expect(200);

        const second = (db
            .prepare("SELECT question_1 FROM sessions WHERE id = ?")
            .get(sessionId) as QuestionCounterRow) || undefined;

        expect(second.question_1).toBe(1);
    });

    test("Result endpoint: pending -> final", async () => {
        // Discover quiz length from metadata (id "foo" was used to create the session)
        const quizMeta = await request(app).get("/api/quizzes/foo").expect(200);
        const questionCount: number = quizMeta.body.questions.length;
        expect(questionCount).toBeGreaterThanOrEqual(1);

        // After answering only Q1 above, result should be pending
        const pendingRes = await request(app)
            .get(`/api/game/result?sessionId=${encodeURIComponent(sessionId)}`)
            .set("Cookie", userCookie)
            .expect(200);

        expect(pendingRes.body).toMatchObject({
            pending: true,
            total: questionCount,
        });
        // answered count should be >=1 (we answered Q1 already)
        expect(pendingRes.body.answered).toBeGreaterThanOrEqual(1);

        // Answer remaining questions (2..N) with answer index 0
        for (let q = 2; q <= questionCount; q++) {
            await request(app)
                .post("/api/game/submit-answer")
                .set("Cookie", userCookie)
                .send({ sessionId, questionIndex: q, answer: 0 })
                .expect(200);
        }

        // Now all answered -> final result
        const finalRes = await request(app)
            .get(`/api/game/result?sessionId=${encodeURIComponent(sessionId)}`)
            .set("Cookie", userCookie)
            .expect(200);

        expect(finalRes.body.pending).toBe(false);
        expect(typeof finalRes.body.result).toBe("string");
        expect(Array.isArray(finalRes.body.traits)).toBe(true);
        // traits array should have at least one entry with id/name/description/score
        if (finalRes.body.traits.length > 0) {
            const t0 = finalRes.body.traits[0];
            expect(t0).toHaveProperty("id");
            expect(t0).toHaveProperty("name");
            expect(t0).toHaveProperty("description");
            expect(t0).toHaveProperty("score");
        }
    });
});
