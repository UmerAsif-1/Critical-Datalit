import request from "supertest";
import app from "../src/app";
import { resetDb } from "./utils/resetDB";
import {db} from "../src/db";
import {beforeAll} from "vitest";

interface QuestionCounterRow {
    question_1: number;
}

describe("Smoke Test: CriticalDatalit backend", () => {
    beforeAll(() =>{
        resetDb();
    })


    let sessionId: string;
    let joinCode: string;
    let userCookie: string;

    test("Create session", async () => {
        const res = await request(app)
            .post("/api/sessions/create")
            .send({ quizId: "foo" })
            .expect(200);

        expect(res.body.sessionId).toBeDefined();
        expect(res.body.joinCode).toMatch(/^\d{6}$/);

        sessionId = res.body.sessionId;
        joinCode = res.body.joinCode;
        const cookies = res.headers["set-cookie"];
        const cookieArray = Array.isArray(cookies) ? cookies : [cookies];

        const adminCookie = cookieArray.find(c => c.startsWith("__Host-admin_token"));



        expect(adminCookie).toBeDefined();
    });

    test("Join session", async () => {
        const res = await request(app)
            .post("/api/sessions/join")
            .send({ code: joinCode })
            .expect(200);

        expect(res.body.sessionId).toBe(sessionId);

        const cookies = res.headers["set-cookie"];
        const cookieArray = Array.isArray(cookies) ? cookies : [cookies];

        const cookie = cookieArray.find(c => c.startsWith("__Host-user_token"));

        expect(cookie).toBeDefined();

        userCookie = cookie!;
    });

    test("Submit answer increments only on first submit", async () => {
        // first submit
        await request(app)
            .post("/api/game/submit-answer")
            .set("Cookie", userCookie)
            .send({ sessionId, questionIndex: 1, answer: 0 })
            .expect(200);

        const first = db
            .prepare(`SELECT question_1 FROM sessions WHERE id = ?`)
            .get(sessionId) as QuestionCounterRow || undefined;

        expect(first.question_1).toBe(1);

        // second submit should NOT increment
        await request(app)
            .post("/api/game/submit-answer")
            .set("Cookie", userCookie)
            .send({ sessionId, questionIndex: 1, answer: 1 })
            .expect(200);

        const second = db
            .prepare("SELECT question_1 FROM sessions WHERE id = ?")
            .get(sessionId) as QuestionCounterRow || undefined;

        expect(second.question_1).toBe(1);
    });
});