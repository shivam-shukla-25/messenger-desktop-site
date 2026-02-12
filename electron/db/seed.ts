import { getDB } from "./database";
import { randomUUID } from "crypto";
import { AppConfig } from "../config/appConfig";

export function seedDatabase() {
  const db = getDB();

  const chatCount = db.prepare("SELECT COUNT(*) as count FROM chats").get() as any;

  if (chatCount.count > 0) {
    console.log("Database already seeded");
    return;
  }

  const insertChat = db.prepare(`
    INSERT INTO chats (id, title, lastMessageAt, unreadCount)
    VALUES (?, ?, ?, ?)
  `);

  const insertMessage = db.prepare(`
    INSERT INTO messages (id, chatId, ts, sender, body)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction(() => {
    for (let i = 0; i < 200; i++) {
      const chatId = randomUUID();
      const now = Date.now();

      insertChat.run(chatId, `Chat ${i + 1}`, now, 0);

      const messageCount = 100;

      for (let j = 0; j < messageCount; j++) {
        insertMessage.run(
          randomUUID(),
          chatId,
          now - j * 1000,
          j % 2 === 0 ? AppConfig.users.otherUser : AppConfig.users.currentUser,
          `Message ${j} in chat ${i + 1}`
        );
      }
    }
  });

  insertMany();

  console.log("Database seeded with 200 chats and 20,000 messages");
}
