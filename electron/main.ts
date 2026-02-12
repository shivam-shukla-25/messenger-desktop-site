import { app, BrowserWindow } from "electron";
import path from "path";
app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendSwitch("disable-software-rasterizer");
app.disableHardwareAcceleration();

import { initDB } from "./db/database";
import { seedDatabase } from "./db/seed";
import { registerChatHandlers } from "./ipc/chatHandlers";
import { startWebSocketServer } from "./websocket/server";


let mainWindow: BrowserWindow | null = null;

console.log("Preload path:", path.join(__dirname, "preload.js"));

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {
  initDB();
  seedDatabase();
  registerChatHandlers();
  startWebSocketServer();
  createWindow();
});

