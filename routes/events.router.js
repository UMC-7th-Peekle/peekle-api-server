import { Router } from "express";
import * as authMiddleware from "../middleware/authenticate.jwt.js";
import * as scrapEventController from "../controllers/events/scrap.events.controller.js";
import * as reportEventController from "../controllers/events/report.events.controller.js";

// import { notImplementedController } from "../controllers/empty.cotroller.js";

const router = Router();

// 이벤트 목록 조회
// query를 통해 scrapped 여부, category, page, size를 받을 수 있음
// router.get("/", notImplementedController);
// router.get("/:eventId", notImplementedController);

// 이벤트 스크랩하기
router.post("/:eventId/scrap", authMiddleware.authenticateAccessToken, scrapEventController.newScrap);       // 특정 이벤트 스크랩
router.delete("/:eventId/scrap", authMiddleware.authenticateAccessToken, scrapEventController.deleteScrap);     // 특정 이벤트를 스크랩 취소

// 이벤트 신고하기
router.post("/:eventId/report", authMiddleware.authenticateAccessToken, reportEventController.newReport);     // 특정 이벤트 신고고

export default router;
