export {};

declare global {
  interface Window {
    api: {
      getChats: (offset: number) => Promise<any[]>;
      getLatestMessages: (chatId: string) => Promise<any[]>;
      getOlderMessages: (
        chatId: string,
        beforeTs: number
      ) => Promise<any[]>;
      searchMessages: (
        chatId: string,
        query: string
      ) => Promise<any[]>;
      handleIncomingMessage: (message: any) => Promise<void>; 
      onChatsUpdated: (callback: () => void) => void;
      markChatAsRead: (chatId: string) => Promise<void>;
      simulateConnectionDrop: () => Promise<void>;
    };
  }
}
