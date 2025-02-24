// /socket/handlers/messageHandler.js
import models from "../../models/index.js";
import { getSocketIO } from "../index.js"; // socket.io 객체 가져오기
// io.emit 은 전체 socket에 전송하고,
// socket.emit 은 해당 socket 에만 전송
// to, broadcast 등도 존재함

export const handleMessage = (socket) => {
  socket.on("message", (msg) => {
    console.log(`Received message: ${msg}`);
    getSocketIO().emit("newMessage", msg); // 모든 클라이언트에 메시지 전송
  });

  socket.on("MESSAGE_TEXT", (msg) => {});
  socket.on("MESSAGE_EDIT", (msg) => {});
  socket.on("MESSAGE_DELETE", (msg) => {});
  socket.on("MESSAGE_REPLY", (msg) => {});
  socket.on("MESSAGE_NOTICE", (msg) => {});
};

const receiveTextMessage = async ({ peeklingId, message, authorId }) => {
  await models.Chats.create({
    authorId,
    type: "text",
    content: message,
  });
};
