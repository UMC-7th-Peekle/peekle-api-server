import { Router } from "express";
import { emptyController } from "../controllers/empty.cotroller.js";

const router = Router();

/**
 * 내 티켓 가져오기
 */
router.get("/", emptyController);

/**
 * 티켓 생성
 */
router.post("/", emptyController);

/**
 * 티켓 삭제
 */
router.delete("/tickets/:ticketId", emptyController);

/**
 * 티켓 정보 가져오기
 */
router.get("/tickets/:ticketId", emptyController);

/**
 * 티켓 메시지 추가
 */
router.post("/tickets/:ticketId/message", emptyController);

/**
 * 티켓 메시지 수정
 */
router.patch("/tickets/:ticketId/message/:messageId", emptyController);

/**
 * 티켓 메시지 삭제
 */
router.delete("/tickets/:ticketId/message/:messageId", emptyController);

export default router;
