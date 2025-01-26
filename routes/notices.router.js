import { Router } from "express";
import { notImplementedController } from "../controllers/empty.cotroller.js";
import * as noticeReadController from "../controllers/notices/read.notices.controller.js";

const router = Router();

// 공지사항 조회
router.get("/category/:categoryId", noticeReadController.getNoticesByCategory);
router.get("", noticeReadController.searchNotices);
router.get("/:noticeId", noticeReadController.getNoticeById);

// 공지사항 생성, 수정, 삭제
router.post("/category/:categoryId", notImplementedController);
router.patch(
  "/category/:categoryId/notice/:noticeId",
  notImplementedController
);
router.delete(
  "/category/:categoryId/notice/:noticeId",
  notImplementedController
);

export default router;
