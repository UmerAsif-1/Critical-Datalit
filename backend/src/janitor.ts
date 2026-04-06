import { db } from "./db";
import { SESSION_TTL_HOURS } from "./config/session";

const RUN_INTERVAL_MS = 60 * 60 * 1000;

function purgeExpiredSessions(): void {
    const result = db
        .prepare(
            `DELETE FROM sessions WHERE created_at <= datetime('now', '-${SESSION_TTL_HOURS} hours')`,
        )
        .run();

    if (result.changes > 0) {
        console.log(`[janitor] Purged ${result.changes} expired session(s)`);
    }
}

export function startJanitor(): void {
    purgeExpiredSessions();
    setInterval(purgeExpiredSessions, RUN_INTERVAL_MS);
}
