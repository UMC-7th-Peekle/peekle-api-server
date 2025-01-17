import { Router } from "express";
import { emptyController } from "../controllers/empty.cotroller.js";

const router = Router();

/**
 * 사용자의 계정 상태를 변동시킵니다.
 * suspend/ban 및 unsuspend/unban을 통합하여 지원합니다.
 */
router.patch("/users/:userId/status", emptyController);

/**
 * 게시판을 추가하는 API
 */
router.post("/community", emptyController);

/**
 * 공지사항 작성
 */
router.post("/notices", emptyController);

/**
 * 공지사항 수정
 */
router.patch("/notices/:noticeId", emptyController);

/**
 * 약관 수정
 * 내용 및 상태값을 수정할 수 있습니다.
 * 수정할 때마다 version값을 올려주어야 합니다.
 */
router.patch("/terms/:termsId", emptyController);

/**
 * 약관 삭제
 */
router.delete("/terms/:termsId", emptyController);

/**
 * 약관 추가
 */
router.post("/terms", emptyController);

// 통계 기능
// user, article, event 현황

/**
 * 통계 - 사용자 가입 현황
 */
router.get("/statistics/users", emptyController);

/**
 * 통계 - 게시글 현황
 */
router.get("/statistics/articles", emptyController);

/**
 * 통계 - 이벤트 현황
 */
router.get("/statistics/events", emptyController);

export default router;
