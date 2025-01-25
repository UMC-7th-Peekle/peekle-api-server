import { Router } from "express";
import { notImplementedController } from "../controllers/empty.cotroller.js";
import * as reportListController from "../controllers/admin/report.list.admin.controller.js";
import * as reportManageController from "../controllers/admin/report.manage.admin.controller.js";
import * as authenticatMiddleware from "../middleware/authenticate.jwt.js";

const router = Router();

/* 
  사용자 제재
*/
router.get(
  "/users/status",
  authenticatMiddleware.authenticateAccessToken,
  reportManageController.getPenalizedUsers
);
router.post(
  "/users/status",
  authenticatMiddleware.authenticateAccessToken,
  reportManageController.penalizeUser
);
router.delete(
  "/users/status",
  authenticatMiddleware.authenticateAccessToken,
  reportManageController.unpenalizeUser
);

/*
  접수된 신고사항 조회
*/
router.get(
  "/reports",
  authenticatMiddleware.authenticateAccessToken,
  reportListController.getReports
);

/*
  약관 관리
*/
router.patch("/terms/:termsid", notImplementedController);
router.delete("/terms/:termsid", notImplementedController);
router.post("/terms", notImplementedController);

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
