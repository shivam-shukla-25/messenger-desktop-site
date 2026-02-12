import { contextBridge, ipcRenderer } from "electron";


contextBridge.exposeInMainWorld("api", {
  getChats: (offset: number) =>
    ipcRenderer.invoke("chats:get", offset),

  getLatestMessages: (chatId: string) =>
    ipcRenderer.invoke("messages:getLatest", chatId),

  getOlderMessages: (chatId: string, beforeTs: number) =>
    ipcRenderer.invoke("messages:getOlder", chatId, beforeTs),

  searchMessages: (chatId: string, query: string) =>
    ipcRenderer.invoke("messages:search", chatId, query),

  handleIncomingMessage: (message: any) =>
  ipcRenderer.invoke("messages:incoming", message),

  onChatsUpdated: (callback: () => void) =>
  ipcRenderer.on("chats:updated", callback),

  markChatAsRead: (chatId: string) =>
  ipcRenderer.invoke("chats:markRead", chatId),

 

});
