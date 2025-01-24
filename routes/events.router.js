import { Router } from "express";
import * as authMiddleware from "../middleware/authenticate.jwt.js";
import * as scrapEventController from "../controllers/events/scrap.events.controller.js";
import * as reportEventController from "../controllers/events/report.events.controller.js";
import * as detailEventController from "../controllers/events/detail.events.controller.js";
import * as listEventController from "../controllers/events/list.events.controller.js";
import * as createEventController from "../controllers/events/create.events.controller.js";
import * as categoryEventController from "../controllers/events/category.events.controller.js";

import * as fileUploadMiddleware from "../middleware/uploader.js"; // 사진 업로드 미들웨어

const router = Router();

// 이벤트 조회
router.get("/", listEventController.listEvent);   // 이벤트 목록 조회

// 이벤트 생성
router.post("/", authMiddleware.authenticateAccessToken, createEventController.createEvent);    // 이벤트 생성

// 이벤트 카테고리 조회
router.get("/category", categoryEventController.eventCategory);     // 이벤트 카테고리 조회

// 이벤트 스크랩
router.get("/:eventId", detailEventController.detailEvent);    // 이벤트 상세정보 조회

// 이벤트 수정
router.patch("/:eventId", authMiddleware.authenticateAccessToken, 
  fileUploadMiddleware.localStorage({
    restrictions: fileUploadMiddleware.restrictions("article"),
    field: [{ name: "article_images", maxCount: 5 }],
    destination: "uploads/articles",
  }),
  detailEventController.updateEvent);    // 이벤트 상세정보 수정

// 이벤트 스크랩
router.post("/:eventId/scrap", authMiddleware.authenticateAccessToken, scrapEventController.newScrap);       // 특정 이벤트 스크랩
router.delete("/:eventId/scrap", authMiddleware.authenticateAccessToken, scrapEventController.deleteScrap);     // 특정 이벤트를 스크랩 취소

// 이벤트 신고하기
router.post("/report", authMiddleware.authenticateAccessToken, reportEventController.newReport);     // 특정 이벤트 신고

export default router;
