import { ClientConfig } from "../config/clientConfig";
let socket: WebSocket | null = null;
let reconnectAttempts = 0;
let heartbeatInterval: any = null;
let heartbeatTimeout: any = null;

type ConnectionState = "connected" | "reconnecting" | "offline";

export function connectWS(
  onMessage: (data: any) => void,
  onStatusChange: (state: ConnectionState) => void
) {
  socket = new WebSocket(`ws://localhost:${ClientConfig.websocket.port}`);

  socket.onopen = () => {
    reconnectAttempts = 0;
    onStatusChange("connected");
    startHeartbeat();
  };

  socket.onmessage = (event) => {
    if (event.data === "pong") {
      resetHeartbeatTimeout();
      return;
    }

    const data = JSON.parse(event.data);
    onMessage(data);
  };

  socket.onclose = () => {
    stopHeartbeat();
    handleReconnectFlow(onMessage, onStatusChange);
  };

  socket.onerror = () => {
    socket?.close();
  };
}


function startHeartbeat() {
  heartbeatInterval = setInterval(() => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send("ping");
      heartbeatTimeout = setTimeout(() => {
        socket?.close();
      }, 5000);
    }
  }, 10000);
}

function resetHeartbeatTimeout() {
  if (heartbeatTimeout) clearTimeout(heartbeatTimeout);
}

function stopHeartbeat() {
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  if (heartbeatTimeout) clearTimeout(heartbeatTimeout);
}

function handleReconnectFlow(
  onMessage: any,
  onStatusChange: any
) {
  reconnectAttempts++;

  onStatusChange("offline");

  setTimeout(() => {

    onStatusChange("reconnecting");

    setTimeout(() => {

const delay = Math.min(
  1000 * 2 ** reconnectAttempts,
  1000
);

      setTimeout(() => {
        connectWS(onMessage, onStatusChange);
      }, delay);

    }, 1000);

  }, 1000);
}
