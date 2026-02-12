import { WebSocketServer } from "ws";
import { getDB } from "../db/database";
import { randomUUID } from "crypto";
import { AppConfig } from "../config/appConfig";

let wss: WebSocketServer;

export function startWebSocketServer() {
  wss = new WebSocketServer({ port: AppConfig.websocket.port });

  wss.on("connection", (ws) => {
    console.log("Client connected to WS");

    const interval = setInterval(() => {
      const db = getDB();

      const chat = db
        .prepare("SELECT id FROM chats ORDER BY RANDOM() LIMIT 1")
        .get() as any;

      if (!chat) return;
      const { currentUser, otherUser } = AppConfig.users;

      const message = {
        chatId: chat.id,
        messageId: randomUUID(),
        ts: Date.now(),
        sender: Math.random() > 0.5 ? otherUser : currentUser,
        body: "Incoming message " + Math.floor(Math.random() * 1000),
      };

      ws.send(JSON.stringify(message));
    }, Math.floor(Math.random() * 2000) + 1000);

    ws.on("close", () => {
      clearInterval(interval);
      console.log("Client disconnected");
    });

    ws.on("message", (msg) => {
  if (msg.toString() === "ping") {
    ws.send("pong");
  }
});
  });
  console.log(`WebSocket server running on ws://localhost:${AppConfig.websocket.port}`);
}

export function closeWebSocketServer() {
  if (wss) {
    wss.clients.forEach((client) => client.close());
  }
}