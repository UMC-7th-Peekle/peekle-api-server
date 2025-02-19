import { Server } from "socket.io"; // socket을 사용하려면 주석 해제
import { corsOptions } from "../utils/options/options.js";
import { handleMessage } from "./handlers/message.socket.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, { cors: corsOptions });
  console.log(`✅ SOCKET.IO INITIALIZED => ${!!io}`);

  io.on("connection", (socket) => {
    console.log(`🔗 [SOCKET] User connected: ${socket.id}`);
    handleMessage(socket);
    socket.on("disconnect", () =>
      console.log(`❌ [SOCKET] User disconnected: ${socket.id}`)
    );
  });
};

export const getSocketIO = () => {
  if (!io) throw new Error("❌ Socket.io not initialized");
  return io;
};
