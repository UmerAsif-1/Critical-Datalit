import {Request, Response} from "express";
export function setCookie(res: Response, name: string, value: string) {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie(name, value, {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProd,
        path: '/',
    });
}
export function getCookie(req: Request, name: string) {
    return req.cookies?.[name] ?? null;
}
