import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), "critdatalit.db");


export const db = new Database(DB_PATH);


db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
db.exec(schema);

// Migration: add ended_at to sessions if this is an existing DB without it.
const sessionCols = (db.pragma("table_info(sessions)") as Array<{ name: string }>);
if (!sessionCols.some(c => c.name === "ended_at")) {
    db.exec("ALTER TABLE sessions ADD COLUMN ended_at TEXT DEFAULT NULL");
}


