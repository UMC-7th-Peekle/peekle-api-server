import { Router } from "express";
import * as authMiddleware from "../middleware/authenticate.jwt.js";
import * as scrapEventController from "../controllers/events/scrap.events.controller.js";
import * as reportEventController from "../controllers/events/report.events.controller.js";
import * as detailEventController from "../controllers/events/crud.events.controller.js";
import * as listEventController from "../controllers/events/read.events.controller.js";

const router = Router();

// 이벤트 조회
// query를 통해 category, cursor, limit를 받을 수 있음
router.get("/", listEventController.listEvent);   // 이벤트 목록 조회
router.get("/:eventId", detailEventController.detailEvent);    // 이벤트 상세정보 조회

// 이벤트 스크랩
router.post("/:eventId/scrap", authMiddleware.authenticateAccessToken, scrapEventController.newScrap);       // 특정 이벤트 스크랩
router.delete("/:eventId/scrap", authMiddleware.authenticateAccessToken, scrapEventController.deleteScrap);     // 특정 이벤트를 스크랩 취소

// 이벤트 신고하기
router.post("/:eventId/report", authMiddleware.authenticateAccessToken, reportEventController.newReport);     // 특정 이벤트 신고고

export default router;
