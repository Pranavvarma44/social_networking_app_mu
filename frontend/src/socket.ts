import { io, Socket } from "socket.io-client";
import BASE_URL from "./api";

// 🔥 remove /api from URL
const SOCKET_URL = BASE_URL.replace("/api", "");

export const createSocket = (token: string): Socket => {
  const socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket"],
  });

  // 🔹 DEBUG
  socket.on("connect", () => {
    console.log("✅ SOCKET CONNECTED:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ SOCKET ERROR:", err.message);
  });

  return socket;
};