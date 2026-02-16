import fs from "node:fs";

export function resetDb() {
    const file = "temp.db";
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
}