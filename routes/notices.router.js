import { Router } from "express";
import * as readController from "../controllers/notices/read.notices.controller.js";
import * as cudController from "../controllers/notices/cud.notices.controller.js";
import * as authMiddleware from "../middleware/authenticate.jwt.js";
import * as fileUploadMiddleware from "../middleware/uploader.js"; // 사진 업로드 미들웨어

const router = Router();

// 공지사항 조회
router.get("/category/:categoryId", readController.getNoticesByCategory);
router.get("/", readController.searchNotices);
router.get("/:noticeId", readController.getNoticeById);

// 공지사항 생성
router.post(
  "/category/:categoryId",
  authMiddleware.authenticateAccessToken,
  fileUploadMiddleware.localStorage({
    restrictions: fileUploadMiddleware.restrictions("notice"),
    field: [{ name: "notice_images", maxCount: 5 }],
    destination: "uploads/notices",
  }),
  cudController.createNotice
);

// 공지사항 수정
router.patch(
  "/:noticeId",
  authMiddleware.authenticateAccessToken,
  fileUploadMiddleware.localStorage({
    restrictions: fileUploadMiddleware.restrictions("notice"),
    field: [{ name: "notice_images", maxCount: 5 }],
    destination: "uploads/notices",
  }),
  cudController.updateNotice
);

// 공지사항 삭제
router.delete(
  "/:noticeId",
  authMiddleware.authenticateAccessToken,
  cudController.deleteNotice
);

export default router;
