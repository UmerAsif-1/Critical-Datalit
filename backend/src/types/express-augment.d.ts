import "express-serve-static-core";
import type { SessionRow, GameRow } from "./http";

// Enforcing typing in the request itself. Necessary for The middleware cleanup to all controllers
declare module "express-serve-static-core" {
    interface Request {
        admin?: { session: SessionRow };
        user?: { session: SessionRow; game: GameRow };
    }
}