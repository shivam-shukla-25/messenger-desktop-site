import { ipcMain , BrowserWindow} from "electron";

import {
  getChats,
  getLatestMessages,
  getOlderMessages,
  searchMessages,
} from "../db/queries";
import { getDB } from "../db/database";


export function registerChatHandlers() {
  ipcMain.handle("chats:get", (_, offset: number) => {
    return getChats(offset);
  });

  ipcMain.handle("messages:getLatest", (_, chatId: string) => {
    return getLatestMessages(chatId);
  });

  ipcMain.handle(
    "messages:getOlder",
    (_, chatId: string, beforeTs: number) => {
      return getOlderMessages(chatId, beforeTs);
    }
  );

  ipcMain.handle(
    "messages:search",
    (_, chatId: string, query: string) => {
      return searchMessages(chatId, query);
    }
  );

ipcMain.handle("messages:incoming", (_, message) => {
  const db = getDB();

  const insertMessage = db.prepare(`
    INSERT INTO messages (id, chatId, ts, sender, body)
    VALUES (?, ?, ?, ?, ?)
  `);

  const updateChat = db.prepare(`
    UPDATE chats
    SET lastMessageAt = ?, unreadCount = unreadCount + 1
    WHERE id = ?
  `);

  insertMessage.run(
    message.messageId,
    message.chatId,
    message.ts,
    message.sender,
    message.body
  );

  updateChat.run(message.ts, message.chatId);

  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send("chats:updated");
  });
});

ipcMain.handle("chats:markRead", (_, chatId: string) => {
  const db = getDB();

  db.prepare(`
    UPDATE chats
    SET unreadCount = 0
    WHERE id = ?
  `).run(chatId);
});


}
