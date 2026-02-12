import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField
} from "@mui/material";
import { ClientConfig } from "../config/clientConfig";

interface Message {
  id: string;
  chatId: string;
  ts: number;
  sender: string;
  body: string;
}

interface Props {
  chatId: string | null;
}

function formatTime(timestamp: number) {
  const date = new Date(timestamp);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}


export default function MessageView({ chatId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      const data = await window.api.getLatestMessages(chatId);
      setMessages(data);
    };

    loadMessages();
  }, [chatId]);

  const loadOlder = async () => {
    if (!chatId || messages.length === 0) return;

    const oldestTs = messages[messages.length - 1].ts;

    const older = await window.api.getOlderMessages(
      chatId,
      oldestTs
    );

    setMessages((prev) => [...prev, ...older]);
  };

  const handleSearch = async (query: string) => {
  setSearchQuery(query);

  if (!chatId) return;

  if (!query.trim()) {
    const data = await window.api.getLatestMessages(chatId);
    setMessages(data.reverse());
    return;
  }

  const results = await window.api.searchMessages(chatId, query);
  setMessages(results.reverse());
};


  if (!chatId) {
    return (
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography>Select a chat</Typography>
      </Box>
    );
  }

 return (
  <Box
    sx={{
      width: "70%",
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}
  >
<Box sx={{ p: 2, display: "flex", gap: 1 }}>
  <TextField
    size="small"
    label="Search"
    value={searchQuery}
    onChange={(e) => handleSearch(e.target.value)}
    sx={{ width: 400 }}   
  />
</Box>

    {/* Load Older Button */}
    <Box sx={{ px: 2 }}>
      <Button variant="outlined" onClick={loadOlder}>
        Load Older
      </Button>
    </Box>

    {/* Messages */}
    <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
      {messages.map((msg) => {
        const currentUser = ClientConfig.users.currentUser;
        const isCurrentUser = msg.sender === currentUser;

        return (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              justifyContent: isCurrentUser
                ? "flex-end"
                : "flex-start",
              mb: 1.5,
            }}
          >
            <Paper
              sx={{
                p: 1.5,
                maxWidth: "60%",
                backgroundColor: isCurrentUser
                  ? "#1976d2"
                  : "#f5f5f5",
                color: isCurrentUser
                  ? "#fff"
                  : "#000",
                borderRadius: isCurrentUser
                  ? "20px 20px 0 20px"
                  : "20px 20px 20px 0",
              }}
              elevation={1}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  display: "block",
                  mb: 0.5,
                  opacity: 0.8,
                }}
              >
                {msg.sender}
              </Typography>

              <Typography variant="body2">
                {msg.body}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "right",
                  mt: 0.5,
                  opacity: 0.7,
                }}
              >
                {formatTime(msg.ts)}
              </Typography>
            </Paper>
          </Box>
        );
      })}
    </Box>
  </Box>
);

}
