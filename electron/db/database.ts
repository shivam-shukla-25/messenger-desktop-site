import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";

let db: Database.Database;

export function initDB() {
  const dbPath = path.join(app.getPath("userData"), "messenger.db");

  db = new Database(dbPath);
  console.log("DB Path:", dbPath);


  createTables();
  createIndexes();
}

function createTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      lastMessageAt INTEGER,
      unreadCount INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      chatId TEXT,
      ts INTEGER,
      sender TEXT,
      body TEXT,
      FOREIGN KEY(chatId) REFERENCES chats(id)
    );
  `);
}

function createIndexes() {
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_chats_lastMessageAt
    ON chats(lastMessageAt DESC);

    CREATE INDEX IF NOT EXISTS idx_messages_chatId_ts
    ON messages(chatId, ts DESC);

    CREATE INDEX IF NOT EXISTS idx_messages_body
    ON messages(body);
  `);
}

export function getDB() {
  return db;
}
