import { useEffect, useState, useRef } from "react";
import {
  Box,
  ListItemButton,
  ListItemText,
  Badge,
  Typography,
  Button,
} from "@mui/material";
import { useVirtualizer } from "@tanstack/react-virtual";

interface Chat {
  id: string;
  title: string;
  lastMessageAt: number;
  unreadCount: number;
  lastMessage: string;
}


interface Props {
  onSelect: (chatId: string) => void;
}

function formatTime(timestamp: number) {
  const date = new Date(timestamp);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}


export default function ChatList({ onSelect }: Props) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [offset, setOffset] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);

  const loadChats = async () => {
    const data = await window.api.getChats(offset);
    setChats((prev) => [...prev, ...data]);
    setOffset((prev) => prev + 50);
  };

useEffect(() => {
  window.api.onChatsUpdated(() => {
    setChats([]);
    setOffset(0);
    loadChats();
  });
}, []);


  const rowVirtualizer = useVirtualizer({
    count: chats.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  });

  return (
    <Box
      sx={{
        width: "30%",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Typography variant="h6" sx={{ p: 2 }}>
        Chats
      </Typography>

      <Box
        ref={parentRef}
        sx={{
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const chat = chats[virtualRow.index];

            if (!chat) return null;

            return (
              <Box
                key={chat.id}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
<ListItemButton onClick={() => onSelect(chat.id)}>
  <Box sx={{ flexGrow: 1 }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="subtitle1" fontWeight={600}>
        {chat.title}
      </Typography>

      <Typography variant="caption" color="text.secondary">
        {formatTime(chat.lastMessageAt)}
      </Typography>
    </Box>

    <Typography
      variant="body2"
      color="text.secondary"
      noWrap
    >
      {chat.lastMessage || "No messages yet"}
    </Typography>
  </Box>

  {chat.unreadCount > 0 && (
    <Badge
      color="primary"
      badgeContent={chat.unreadCount}
      sx={{ ml: 1 }}
    />
  )}
</ListItemButton>

              </Box>
            );
          })}
        </Box>
      </Box>

      <Box sx={{ p: 1 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={loadChats}
        >
          Load More
        </Button>
      </Box>
    </Box>
  );
}
