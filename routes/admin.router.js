import { Router } from "express";
import { notImplementedController } from "../controllers/empty.cotroller.js";
import * as termController from "../controllers/admin/terms.admin.controller.js";
import * as authenticatMiddleware from "../middleware/authenticate.jwt.js";

const router = Router();

/* 
  사용자 제재
*/
router.get("/users/status", notImplementedController);
router.post("/users/status", notImplementedController);
router.delete("/users/status", notImplementedController);

/*
  접수된 신고사항 조회
*/
router.get("/reports/user", notImplementedController);
router.get("/reports/article", notImplementedController);
router.get("/reports/comment", notImplementedController);

/*
  약관 관리
*/
router.patch(
  "/terms/:termId",
  authenticatMiddleware.authenticateAccessToken,
  termController.updateTerm
);
router.delete(
  "/terms/:termId",
  authenticatMiddleware.authenticateAccessToken,
  termController.deleteTerm
);
router.post(
  "/terms",
  authenticatMiddleware.authenticateAccessToken,
  termController.createTerm
);

/*
  서비스 통계
*/
router.get("/statistics/users", notImplementedController);
router.get("/statistics/articles", notImplementedController);
router.get("/statistics/events", notImplementedController);

/*
  관리자 추가, 삭제
*/

// 관리자 현황 가져오기
router.get("/", notImplementedController);

// 관리자 추가
router.post("/", notImplementedController);

// 관리자 권한 수정
router.patch("/", notImplementedController);

// 관리자 권한 삭제
router.delete("/", notImplementedController);

// 권한 목록 가져오기
router.get("/role", notImplementedController);
// 권한 추가
router.post("/role", notImplementedController);

export default router;
