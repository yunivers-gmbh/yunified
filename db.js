import * as dotenv from "dotenv";
dotenv.default.config();
import sqlite3 from "sqlite3";

const db = new sqlite3.Database(process.env.DATABASE_NAME);
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS tokens (token TEXT PRIMARY KEY, validUntil INTEGER NOT NULL)"
  );
});
export { db };
