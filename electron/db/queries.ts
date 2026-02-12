import { getDB } from "./database";

const PAGE_SIZE = 50;

export function getChats(offset: number = 0) {
  const db = getDB();

  const stmt = db.prepare(`
    SELECT 
      c.id,
      c.title,
      c.lastMessageAt,
      c.unreadCount,
      (
        SELECT body 
        FROM messages m 
        WHERE m.chatId = c.id 
        ORDER BY ts DESC 
        LIMIT 1
      ) as lastMessage
    FROM chats c
    ORDER BY c.lastMessageAt DESC
    LIMIT ? OFFSET ?
  `);

  return stmt.all(50, offset);
}


export function getLatestMessages(chatId: string) {
  const db = getDB();

  const stmt = db.prepare(`
    SELECT id, chatId, ts, sender, body
    FROM messages
    WHERE chatId = ?
    ORDER BY ts DESC
    LIMIT ?
  `);

  return stmt.all(chatId, PAGE_SIZE);
}

export function getOlderMessages(chatId: string, beforeTs: number) {
  const db = getDB();

  const stmt = db.prepare(`
    SELECT id, chatId, ts, sender, body
    FROM messages
    WHERE chatId = ?
      AND ts < ?
    ORDER BY ts DESC
    LIMIT ?
  `);

  return stmt.all(chatId, beforeTs, PAGE_SIZE);
}

export function searchMessages(chatId: string, query: string) {
  const db = getDB();

  const stmt = db.prepare(`
    SELECT id, chatId, ts, sender, body
    FROM messages
    WHERE chatId = ?
      AND body LIKE ?
    ORDER BY ts DESC
    LIMIT 50
  `);

  return stmt.all(chatId, `%${query}%`);
}
