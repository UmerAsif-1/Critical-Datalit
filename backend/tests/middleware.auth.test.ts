import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import app from "../src/app";
import { resetDb } from "./utils/resetDB";
import {
    requireUserBySessionIdFromBody,
    requireUserBySessionIdFromQuery,
    requireAdminByJoinCode,
    requireAdminBySessionId,
} from "../src/middleware/auth";

const testApp = (() => {
    const a = express();
    a.use(express.json());
    a.use(cookieParser());
    a.use(app);

    a.post("/test/user/body", requireUserBySessionIdFromBody, (req, res) => {
        res.json({
            ok: true,
            sessionId: req.user!.session.id,
            userCookie: req.user!.game.user_cookie,
        });
    });

    a.get("/test/user/query", requireUserBySessionIdFromQuery, (req, res) => {
        res.json({
            ok: true,
            sessionId: req.user!.session.id,
            userCookie: req.user!.game.user_cookie,
        });
    });

    a.get("/test/admin/code/:code", requireAdminByJoinCode, (req, res) => {
        res.json({
            ok: true,
            sessionId: req.admin!.session.id,
            joinCode: req.admin!.session.join_code,
        });
    });

    a.get("/test/admin/session/:sessionId", requireAdminBySessionId, (req, res) => {
        res.json({
            ok: true,
            sessionId: req.admin!.session.id,
        });
    });

    return a;
})();

function pickCookie(setCookieHeader: string[] | string | undefined, name: string): string | undefined {
    const arr = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader].filter(Boolean) as string[];
    const hit = arr.find(h => h?.startsWith(`${name}=`));
    return hit ? hit.split(";")[0] : undefined;
}

describe("Auth middleware", () => {
    let sessionId: string;
    let joinCode: string;
    let userCookie: string;
    let adminCookie: string;

    beforeAll(async () => {
        resetDb();

        const createRes = await request(testApp)
            .post("/api/sessions/create")
            .send({ quizId: "daily-data-privileges" })
            .expect(200);

        sessionId = createRes.body.sessionId;
        joinCode = createRes.body.joinCode;

        adminCookie = pickCookie(createRes.headers["set-cookie"], "__Host-admin_token")!;
        expect(adminCookie).toBeDefined();

        const joinRes = await request(testApp)
            .post("/api/sessions/join")
            .send({ code: joinCode })
            .expect(200);

        userCookie = pickCookie(joinRes.headers["set-cookie"], "__Host-user_token")!;
        expect(userCookie).toBeDefined();

        expect(joinRes.body.sessionId).toBe(sessionId);
    });

    describe("requireUserBySessionIdFromBody", () => {
        it("401 when missing user cookie", async () => {
            await request(testApp)
                .post("/test/user/body")
                .send({ sessionId })
                .expect(401);
        });

        it("400 when missing/invalid sessionId in body", async () => {
            await request(testApp)
                .post("/test/user/body")
                .set("Cookie", userCookie)
                .send({})
                .expect(400);
        });

        it("404 when sessionId unknown", async () => {
            await request(testApp)
                .post("/test/user/body")
                .set("Cookie", userCookie)
                .send({ sessionId: "00000000-0000-0000-0000-000000000000" })
                .expect(404);
        });

        it("200 and exposes resolved context when valid", async () => {
            const res = await request(testApp)
                .post("/test/user/body")
                .set("Cookie", userCookie)
                .send({ sessionId })
                .expect(200);

            expect(res.body.ok).toBe(true);
            expect(res.body.sessionId).toBe(sessionId);
            expect(typeof res.body.userCookie).toBe("string");
        });
    });

    describe("requireUserBySessionIdFromQuery", () => {
        it("401 when missing user cookie", async () => {
            await request(testApp)
                .get(`/test/user/query?sessionId=${encodeURIComponent(sessionId)}`)
                .expect(401);
        });

        it("400 when missing sessionId", async () => {
            await request(testApp)
                .get(`/test/user/query`)
                .set("Cookie", userCookie)
                .expect(400);
        });

        it("404 when unknown sessionId", async () => {
            await request(testApp)
                .get(`/test/user/query?sessionId=${encodeURIComponent("00000000-0000-0000-0000-000000000000")}`)
                .set("Cookie", userCookie)
                .expect(404);
        });

        it("200 when valid", async () => {
            const res = await request(testApp)
                .get(`/test/user/query?sessionId=${encodeURIComponent(sessionId)}`)
                .set("Cookie", userCookie)
                .expect(200);

            expect(res.body.ok).toBe(true);
            expect(res.body.sessionId).toBe(sessionId);
        });

        it("uses only the first value when sessionId is provided as an array", async () => {
            const res = await request(testApp)
                .get(`/test/user/query?sessionId=${encodeURIComponent(sessionId)}&sessionId=should_be_ignored`)
                .set("Cookie", userCookie)
                .expect(200);

            expect(res.body.ok).toBe(true);
            expect(res.body.sessionId).toBe(sessionId);
        });
    });

    describe("requireAdminByJoinCode", () => {
        it("401 when missing admin cookie", async () => {
            await request(testApp)
                .get(`/test/admin/code/${joinCode}`)
                .expect(401);
        });

        it("400 when code format invalid", async () => {
            await request(testApp)
                .get(`/test/admin/code/not6`)
                .set("Cookie", adminCookie)
                .expect(400);
        });

        it("404 when cookie does not match session admin", async () => {
            await request(testApp)
                .get(`/test/admin/code/${joinCode}`)
                .set("Cookie", "__Host-admin_token=00000000-0000-4000-8000-000000000000")
                .expect(404);
        });

        it("200 when valid", async () => {
            const res = await request(testApp)
                .get(`/test/admin/code/${joinCode}`)
                .set("Cookie", adminCookie)
                .expect(200);

            expect(res.body.ok).toBe(true);
            expect(res.body.sessionId).toBe(sessionId);
            expect(res.body.joinCode).toBe(joinCode);
        });
    });

    describe("requireAdminBySessionId", () => {
        it("401 when missing admin cookie", async () => {
            await request(testApp)
                .get(`/test/admin/session/${encodeURIComponent(sessionId)}`)
                .expect(401);
        });

        it("404 when sessionId unknown", async () => {
            await request(testApp)
                .get(`/test/admin/session/${encodeURIComponent("00000000-0000-0000-0000-000000000000")}`)
                .set("Cookie", adminCookie)
                .expect(404);
        });

        it("200 when valid", async () => {
            const res = await request(testApp)
                .get(`/test/admin/session/${encodeURIComponent(sessionId)}`)
                .set("Cookie", adminCookie)
                .expect(200);

            expect(res.body.ok).toBe(true);
            expect(res.body.sessionId).toBe(sessionId);
        });
    });
});