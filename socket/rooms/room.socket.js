// /socket/rooms/roomHandler.js
import { getSocketIO } from "../index.js";

// TEST 용 Methods

export const sendMessageToRoom = ({ roomId, event, message }) => {
  const io = getSocketIO();
  io.to(roomId).emit(event, message);
};

export const joinRoom = (socket, roomId) => {
  socket.join(roomId);
};

export const leaveRoom = (socket, roomId) => {
  socket.leave(roomId);
};

/*
Peekling 채팅방용 Room

1. 사용자 로그인 시 자동으로 자신이 들어가 있는 모든 방에 입장시키기
2. 

단순 동작으로 Room 에 진입시키는 함수가 필요할 듯?
io.to.emit 은 나중에 처리하는게 나을지도
*/

/**
 * 피클링 Socket Room에 진입
 */
export const joinPeeklingChatroom = ({ socket, peeklingId }) => {
  const peeklingRoom = getPeeklingChatroomName(peeklingId);
  socket.join(peeklingRoom);
};

export const leavePeeklingChatroom = ({ socket, peeklingId }) => {
  const peeklingRoom = getPeeklingChatroomName(peeklingId);
  socket.leave(peeklingRoom);
};

// 알람용 Room임, 사용자 로그인 시 진입하도록 함

export const joinUserRoom = ({ socket, userId }) => {
  const userRoom = `USER:${userId}`;
  socket.join(userRoom);
};

export const leaveUserRoom = ({ socket, userId }) => {
  const userRoom = `USER:${userId}`;
  socket.leave(userRoom);
};

// 개인 채팅방용 Room들 (1:1 채팅)

export const joinChatroom = ({ socket, chatroomId }) => {
  const chatroomName = getPersonalChatroomName(chatroomId);
  socket.join(chatroomName);
};

export const leaveChatroom = ({ socket, chatroomId }) => {
  const chatroomName = getPersonalChatroomName(chatroomId);
  socket.leave(chatroomName);
};

export const getPersonalChatroomName = (chatroomId) => `CHATROOM:${chatroomId}`;
export const getPeeklingChatroomName = (chatroomId) => `PEEKLING:${chatroomId}`;
