import Database from "better-sqlite3";
import path from "path";
import fs from "fs"

// TODO: Define the correct place for the db and give it a good name
const DB_PATH = path.join(process.cwd(), "temp.db");

if(!fs.existsSync(DB_PATH)){
    fs.writeFileSync(DB_PATH, "");
}
export const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
db.exec(schema);

export function transaction <T extends (...args: any[]) => any>(fn:T):T{
    return db.transaction(fn) as unknown as T;
}



