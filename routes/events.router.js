import { Router } from "express";
import { notImplementedController } from "../controllers/empty.cotroller.js";

const router = Router();

// 이벤트 목록 조회
// query를 통해 scrapped 여부, category, page, size를 받을 수 있음
router.get("/", notImplementedController);
router.get("/:eventId", notImplementedController);

// 이벤트 스크랩하기
router.post("/:eventId/scrap", notImplementedController);
router.delete("/:eventId/scrap", notImplementedController);

// 이벤트 신고하기
router.post("/:eventId/report", notImplementedController);

export default router;
