import { Router } from "express";
import { notImplementedController } from "../controllers/empty.cotroller.js";

const router = Router();

/*
Peekling Chat과 개인 채팅을 모두 담당해야 함.

우선 개인 채팅을 위주로 먼저 만들어 봅시다.

개인 채팅방 생성 : senderId, receiverId 기반으로 생성,
chatroomId 기반으로 Room 생성

피클 채팅방 인원관리는 socket이 아닌 https로 하는 것이 좋아보임.

on connection 시에 user socket rooms에서 모든 room 연결 필요

*/

// 개인 채팅방 생성 요청
router.post("/dm");

router.get("/", notImplementedController);

export default router;
