import { Router } from "express";
import { notImplementedController } from "../controllers/empty.cotroller.js";

const router = Router();

// 공지사항 조회
router.get("/category/:categoryId", notImplementedController);
router.get("/notices/search", notImplementedController);
router.get("/notice/:noticeId", notImplementedController);

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
