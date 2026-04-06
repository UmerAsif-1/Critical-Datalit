import { randomInt, randomUUID } from "crypto";

export function generateJoinCode(): string {
    return randomInt(100_000, 1_000_000).toString();
}

export function generateSessionId(): string {
    return randomUUID();
}
export function isValidJoinCode(code: string): boolean {
    return /^\d{6}$/.test(code);
}
