import { io, Socket } from "socket.io-client";
import BASE_URL from "./api";

export const createSocket = (token: string): Socket => {
  return io(BASE_URL, {
    auth: { token },
    transports: ["websocket"], // optional but recommended
  });
};