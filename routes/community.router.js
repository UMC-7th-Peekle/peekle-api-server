import { Router } from "express";
import { notImplementedController } from "../controllers/empty.cotroller.js";

const router = Router();

// 관리자 메뉴 : 게시판 생성
router.post("/", notImplementedController);

// 게시글 조회
router.get("/:communityId", notImplementedController);
router.get("/:communityId/search", notImplementedController);

// 게시글 생성, 수정, 삭제
router.get("/:communityId/articles/:articleId", notImplementedController);
router.post("/:communityId/articles", notImplementedController);
router.patch("/:communityId/articles/:articleId", notImplementedController);
router.delete("/:communityId/articles/:articleId", notImplementedController);

// 게시글 좋아요 및 좋아요 취소
router.post("/:communityId/articles/:articleId/like", notImplementedController);
router.delete(
  "/:communityId/articles/:articleId/like",
  notImplementedController
);

// 댓글 생성, 수정, 삭제, 대댓글
router.post(
  "/:communityId/articles/:articleId/comments",
  notImplementedController
);
router.patch(
  "/:communityId/articles/:articleId/comments/:commentId",
  notImplementedController
);
router.delete(
  "/:communityId/articles/:articleId/comments/:commentId",
  notImplementedController
);

router.post(
  "/:communityId/articles/:articleId/comments/:commentId/reply",
  notImplementedController
);

// 게시글 신고
router.post(
  "/:communityId/articles/:articleId/report",
  notImplementedController
);

export default router;
