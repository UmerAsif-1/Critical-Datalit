import type { Request, Response } from "express";

const COOKIE_ADMIN = "__Host-admin_token" as const;
const COOKIE_USER  = "__Host-user_token"  as const;

export function useHostPrefix(): boolean {
    return (process.env.COOKIE_USE_HOST_PREFIX ?? "true") === "true";
}

export function adminCookieName(): string {
    return useHostPrefix() ? COOKIE_ADMIN : "admin_token";
}
export function userCookieName(): string {
    return useHostPrefix() ? COOKIE_USER : "user_token";
}


export function cookieWriteOptions() {
    const secure = (process.env.COOKIE_SECURE ?? "true") === "true";
    const sameSite = (process.env.COOKIE_SAMESITE ?? "lax").toLowerCase() as
        | "lax"
        | "strict"
        | "none";

    const effectiveSecure = sameSite === "none" ? true : secure;

    return {
        httpOnly: true as const,
        secure: effectiveSecure,
        sameSite,
        path: "/" as const,

    };
}


export function setCookie(res: Response, name: string, value: string) {
    res.cookie(name, value, cookieWriteOptions());
}


export function setAdminCookie(res: Response, token: string) {
    setCookie(res, adminCookieName(), token);
}
export function setUserCookie(res: Response, token: string) {
    setCookie(res, userCookieName(), token);
}


export function getCookie(req: Request, name: string): string | undefined {
    return req.cookies?.[name];
}


export function getAdminCookie(req: Request): string | undefined {
    return getCookie(req, adminCookieName());
}
export function getUserCookie(req: Request): string | undefined {
    return getCookie(req, userCookieName());
}


const UUID_V4 =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getAdminUuid(req: Request): string | undefined {
    const val = getAdminCookie(req);
    return val && UUID_V4.test(val) ? val : undefined;
}
export function getUserUuid(req: Request): string | undefined {
    const val = getUserCookie(req);
    return val && UUID_V4.test(val) ? val : undefined;
}