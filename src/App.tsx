import { useState, useEffect } from "react";
import { Box, Typography, Button, Chip } from "@mui/material";
import ChatList from "./components/ChatList";
import MessageView from "./components/MessageView";
import { connectWS } from "./services/wsClient";

function App() {
  const [selectedChat, setSelectedChat] =
    useState<string | null>(null);

  const [connectionState, setConnectionState] =
    useState<"connected" | "reconnecting" | "offline">("offline");

  useEffect(() => {
    connectWS(
      async (message) => {
        await window.api.handleIncomingMessage(message);
      },
      (state) => setConnectionState(state)
    );
  }, []);

  const handleSelectChat = async (chatId: string) => {
    setSelectedChat(chatId);
    await window.api.markChatAsRead(chatId);
  };

  const getStatusColor = () => {
    switch (connectionState) {
      case "connected":
        return "success";
      case "reconnecting":
        return "warning";
      case "offline":
      default:
        return "error";
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", position: "relative" }}>
      
      {/* Top Right Controls */}
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 20,
          display: "flex",
          alignItems: "center",
          gap: 2,
          zIndex: 1000,
        }}
      >
        <Chip
          label={connectionState.toUpperCase()}
          color={getStatusColor()}
          size="small"
        />

        <Button
          variant="outlined"
          size="small"
          onClick={() => window.api.simulateConnectionDrop()}
        >
          Simulate Drop
        </Button>
      </Box>

      <ChatList onSelect={handleSelectChat} />
      <MessageView chatId={selectedChat} />
    </Box>
  );
}

export default App;
