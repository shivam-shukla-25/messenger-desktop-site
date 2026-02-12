## Prerequisites
- Node.js (v18+ recommended)
- npm

## Install Dependencies
npm install

## Run in development mode
npm run dev

## Database indexes
CREATE INDEX IF NOT EXISTS idx_chats_lastMessageAt
ON chats(lastMessageAt DESC);

CREATE INDEX IF NOT EXISTS idx_messages_chatId_ts
ON messages(chatId, ts DESC);

CREATE INDEX IF NOT EXISTS idx_messages_body
ON messages(body);