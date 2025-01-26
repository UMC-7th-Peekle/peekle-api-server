import { Router } from "express";
import * as authMiddleware from "../middleware/authenticate.jwt.js";
import * as scrapEventController from "../controllers/events/scrap.events.controller.js";
import * as reportEventController from "../controllers/events/report.events.controller.js";
import * as detailEventController from "../controllers/events/detail.events.controller.js";
import * as listEventController from "../controllers/events/list.events.controller.js";
import * as createEventController from "../controllers/events/create.events.controller.js";
import * as groupController from "../controllers/events/groups.events.controller.js";
import * as fileUploadMiddleware from "../middleware/uploader.js"; // 사진 업로드 미들웨어
import * as eventValidator from "../utils/validators/events/events.validators.js";

import { validateRequestBody } from "../middleware/validate.js";

const router = Router();

// 이벤트 조회
router.get("/", listEventController.listEvent);
router.get("/:eventId", detailEventController.detailEvent); // 이벤트 상세정보 조회

// 이벤트 수정
router.patch(
  "/:eventId",
  authMiddleware.authenticateAccessToken,
  fileUploadMiddleware.localStorage({
    restrictions: fileUploadMiddleware.restrictions("event"),
    field: [{ name: "event_images", maxCount: 5 }],
    destination: "uploads/events",
  }),
  validateRequestBody(eventValidator.patchEventSchema, true),
  detailEventController.updateEvent
);

// 이벤트 생성
router.post(
  "/",
  authMiddleware.authenticateAccessToken,
  fileUploadMiddleware.localStorage({
    restrictions: fileUploadMiddleware.restrictions("event"),
    field: [{ name: "event_images", maxCount: 5 }],
    destination: "uploads/events",
  }),
  validateRequestBody(eventValidator.postEventSchema, true),
  createEventController.createEvent
);

// 이벤트 카테고리 조회
router.get("/groups/category", groupController.eventCategory); // 이벤트 카테고리 조회
router.get("/groups/location", groupController.eventLocation); // 이벤트 지역 조회

// 이벤트 스크랩
router.post(
  "/:eventId/scrap",
  authMiddleware.authenticateAccessToken,
  scrapEventController.newScrap
); // 특정 이벤트 스크랩
router.delete(
  "/:eventId/scrap",
  authMiddleware.authenticateAccessToken,
  scrapEventController.deleteScrap
); // 특정 이벤트를 스크랩 취소

// 이벤트 신고하기
router.post(
  "/report",
  authMiddleware.authenticateAccessToken,
  reportEventController.newReport
); // 특정 이벤트 신고

export default router;
