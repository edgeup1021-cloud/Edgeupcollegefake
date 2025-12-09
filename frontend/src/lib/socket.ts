import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

// Format token to ensure it has Bearer prefix (but not double)
const formatToken = (token: string): string => {
  if (!token) return token;
  return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
};

export function getSocket(token?: string): Socket {
  // If socket exists and token has changed, disconnect old socket
  if (socket && token) {
    const currentToken = (socket.auth as { token?: string } | undefined)?.token;
    const newToken = formatToken(token);
    if (currentToken && currentToken !== newToken) {
      console.log('Token changed, reconnecting socket...');
      disconnectSocket();
    }
  }

  // Return existing socket if already connected
  if (socket) return socket;

  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/api\/?$/, "");
  const formattedToken = token ? formatToken(token) : undefined;

  console.log('Creating new socket connection to:', `${base}/study-groups`);

  socket = io(`${base}/study-groups`, {
    transports: ["websocket", "polling"], // Add polling as fallback
    path: "/socket.io",
    extraHeaders: formattedToken ? { Authorization: formattedToken } : undefined,
    auth: formattedToken ? { token: formattedToken } : undefined,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    console.log('Disconnecting socket...');
    socket.disconnect();
    socket = null;
  }
}
