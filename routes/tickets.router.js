import { Router } from "express";
import { notImplementedController } from "../controllers/empty.cotroller.js";

const router = Router();

// tickets 조회
router.get("/", notImplementedController);
router.get("/:ticketId", notImplementedController);

// tickets 생성, 수정, 삭제
router.post("/", notImplementedController);
router.patch("/:ticketId", notImplementedController);
router.delete("/:ticketId", notImplementedController);

// tickets 메시지 생성, 수정, 삭제
router.post("/:ticketId/message", notImplementedController);
router.patch("/:ticketId/message/:messageId", notImplementedController);
router.delete("/:ticketId/message/:messageId", notImplementedController);

export default router;
