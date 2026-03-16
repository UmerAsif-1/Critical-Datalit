import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import http from "http";
import app from "../../backend/src/app"; // adjust if needed

let server: http.Server;
let baseUrl: string;

beforeAll(() => {
    server = app.listen(0);
    const addr = server.address();
    if (typeof addr === "object" && addr && addr.port) {
        baseUrl = `http://127.0.0.1:${addr.port}`;
    } else {
        throw new Error("Unable to determine dynamic test port");
    }
});

afterAll(() => {
    server.close();
});

describe("Player final results API", () => {
    it("returns pending until all questions answered, then final result", async () => {
        const createRes = await request(baseUrl)
            .post("/api/sessions/create")
            .send({ quizId: "foo" });
        expect(createRes.status).toBe(200);

        const { joinCode } = createRes.body;
        expect(joinCode).toBeDefined();

        const joinRes = await request(baseUrl)
            .post("/api/sessions/join")
            .send({ code: joinCode });
        expect(joinRes.status).toBe(200);

        const playerSessionId = joinRes.body.sessionId;
        expect(playerSessionId).toBeDefined();

        // NEW: playUrl should now be sessionId-based
        expect(joinRes.body.playUrl).toBe(`/session/${playerSessionId}/play`);

        const rawCookies = joinRes.headers["set-cookie"];
        const cookies: string[] = Array.isArray(rawCookies)
            ? rawCookies
            : rawCookies
                ? [rawCookies]
                : [];

        const rawCookie = cookies.find((c) =>
            c.startsWith("__Host-user_token=")
        );
        expect(rawCookie).toBeDefined();

        // send back only "name=value"
        const playerCookieValue = rawCookie!.split(";")[0];

        const quizzesList = await request(baseUrl).get("/api/quizzes");
        expect(quizzesList.status).toBe(200);

        const quizId = quizzesList.body[0].id;
        const quizRes = await request(baseUrl).get(`/api/quizzes/${quizId}`);
        expect(quizRes.status).toBe(200);

        const totalQuestions = quizRes.body.questions.length;
        expect(totalQuestions).toBeGreaterThan(0);

        // Answer Q1
        await request(baseUrl)
            .post("/api/game/submit-answer")
            .set("Cookie", playerCookieValue)
            .send({
                sessionId: playerSessionId,
                questionIndex: 1,
                answer: 0,
            })
            .expect(200);

        // Pending after partial
        const pendingRes = await request(baseUrl)
            .get(`/api/game/result?sessionId=${encodeURIComponent(playerSessionId)}`) // encode sessionId
            .set("Cookie", playerCookieValue);

        expect(pendingRes.status).toBe(200);
        expect(pendingRes.body.pending).toBe(true);
        expect(pendingRes.body.answered).toBe(1);
        expect(pendingRes.body.total).toBe(totalQuestions);

        // Answer remaining questions
        for (let i = 2; i <= totalQuestions; i++) {
            await request(baseUrl)
                .post("/api/game/submit-answer")
                .set("Cookie", playerCookieValue)
                .send({
                    sessionId: playerSessionId,
                    questionIndex: i,
                    answer: 0,
                })
                .expect(200);
        }

        // Final after all answered
        const finalRes = await request(baseUrl)
            .get(`/api/game/result?sessionId=${encodeURIComponent(playerSessionId)}`) // encode sessionId
            .set("Cookie", playerCookieValue);

        expect(finalRes.status).toBe(200);
        expect(finalRes.body.pending).toBe(false);
        expect(finalRes.body.result).toBeDefined();
        expect(Array.isArray(finalRes.body.traits)).toBe(true);
        expect(finalRes.body.traits.length).toBeGreaterThan(0);

        for (const trait of finalRes.body.traits) {
            expect(trait).toHaveProperty("id");
            expect(trait).toHaveProperty("name");
            expect(trait).toHaveProperty("description");
            expect(typeof trait.score).toBe("number");
        }
    });
});