import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import http from "http";
import app from "../../backend/src/app";

let server: http.Server;

beforeAll(async () => {
    server = app.listen(0);
});

afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
});

describe("Quizzes API (metadata only)", () => {
    it("GET /api/quizzes returns summaries", async () => {
        const res = await request(server).get("/api/quizzes");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        for (const item of res.body) {
            expect(item).toHaveProperty("id");
            expect(item).toHaveProperty("title");
            expect(item).toHaveProperty("questionCount");
            expect(item).not.toHaveProperty("questions");
            expect(item).not.toHaveProperty("resultLogic");
        }
    });

    it("GET /api/quizzes/:id returns metadata detail without scoring internals", async () => {
        const res = await request(server).get("/api/quizzes/daily-data-privileges");
        expect(res.status).toBe(200);

        const q = res.body;
        expect(q).toEqual(
            expect.objectContaining({
                id: "daily-data-privileges",
                title: expect.any(String),
                questions: expect.any(Array),
            })
        );
        const firstQ = q.questions[0];
        expect(firstQ).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                prompt: expect.any(String),
                type: "single-choice",
                answers: expect.any(Array),
            })
        );
        const firstA = firstQ.answers[0];
        expect(firstA).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                label: expect.any(String),
            })
        );


        expect(q).not.toHaveProperty("resultLogic");
        for (const quest of q.questions) {
            expect(quest).not.toHaveProperty("traitEffects");
            for (const a of quest.answers) {
                expect(a).not.toHaveProperty("traitEffects");
            }
        }
    });

    it("GET /api/quizzes/:id 404 on missing quiz", async () => {
        const res = await request(server).get("/api/quizzes/does-not-exist");
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
    });
});