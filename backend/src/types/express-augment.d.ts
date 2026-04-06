import "express-serve-static-core";
import type { SessionRow, GameRow } from "./http";

declare module "express-serve-static-core" {
    interface Request {
        admin?: { session: SessionRow };
        user?: { session: SessionRow; game: GameRow };
    }
}