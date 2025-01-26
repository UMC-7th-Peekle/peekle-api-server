import { Router } from "express";
import * as authMiddleware from "../middleware/authenticate.jwt.js";
import * as createNoticeController from "../controllers/notices/create.notices.controller.js";
import * as updateNoticeController from "../controllers/notices/update.notices.controller.js";
import * as deleteNoticeController from "../controllers/notices/delete.notices.controller.js";
import * as fileUploadMiddleware from "../middleware/uploader.js"; // 사진 업로드 미들웨어

const router = Router();

// 공지사항 조회
// router.get("/category/:categoryId", notImplementedController);
// router.get("/category/:categoryId/notice/:noticeId", notImplementedController);

// 공지사항 생성, 수정, 삭제
router.post("/category/:categoryId", 
  authMiddleware.authenticateAccessToken,
  fileUploadMiddleware.localStorage({
    restrictions: fileUploadMiddleware.restrictions("notice"),
    field: [{ name: "notice_images", maxCount: 5 }],
    destination: "uploads/notices",
  }),
  createNoticeController.createNotice
);   // 생성
router.patch(
  "/category/:categoryId/notice/:noticeId",
  authMiddleware.authenticateAccessToken,
  fileUploadMiddleware.localStorage({
    restrictions: fileUploadMiddleware.restrictions("notice"),
    field: [{ name: "notice_images", maxCount: 5 }],
    destination: "uploads/notices",
  }),
  updateNoticeController.updateNotice
);    // 수정
router.delete(
  "/category/:categoryId/notice/:noticeId",
  authMiddleware.authenticateAccessToken,
  deleteNoticeController.deleteNotice
);    // 삭제

export default router;
