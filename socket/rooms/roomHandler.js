// /socket/rooms/roomHandler.js
import { getSocketIO } from "../index.js";

export const joinRoom = (socket, roomId) => {
  socket.join(roomId);
  getSocketIO()
    .to(roomId)
    .emit("userJoined", `${socket.id} has joined the room`);
};

export const leaveRoom = (socket, roomId) => {
  socket.leave(roomId);
  getSocketIO().to(roomId).emit("userLeft", `${socket.id} has left the room`);
};
