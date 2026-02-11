
import { randomInt, randomUUID } from 'crypto';


export function generateJoinCode(): string {
    // Range: 100000..999999
    return randomInt(100_000, 1_000_000).toString();
}

export function generateSessionId(): string {
    return randomUUID();
}
