// /socket/handlers/messageHandler.js
import { getSocketIO } from "../index.js"; // socket.io 객체 가져오기

export const handleMessage = (socket) => {
  socket.on("message", (msg) => {
    console.log(`Received message: ${msg}`);
    getSocketIO().emit("newMessage", msg); // 모든 클라이언트에 메시지 전송
  });
};
