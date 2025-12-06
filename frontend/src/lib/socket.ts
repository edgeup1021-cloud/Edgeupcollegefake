import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(token?: string): Socket {
  if (socket) return socket;
  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/api\/?$/, "");
  socket = io(`${base}/study-groups`, {
    transports: ["websocket"],
    path: "/socket.io",
    extraHeaders: token ? { Authorization: `Bearer ${token}` } : undefined,
    auth: token ? { token: `Bearer ${token}` } : undefined,
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
