import { Router } from "express";
import { notImplementedController } from "../controllers/empty.cotroller.js";

import * as termController from "../controllers/admin/terms.admin.controller.js";

import * as reportListController from "../controllers/admin/report.list.admin.controller.js";
import * as reportManageController from "../controllers/admin/report.manage.admin.controller.js";

import * as authenticatMiddleware from "../middleware/authenticate.jwt.js";
import * as acController from "../controllers/admin/ac.admin.controller.js";
import { checkPermission } from "../middleware/check.permission.js";

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
// 약관 내용을 수정합니다.
router.patch(
  "/terms/:termId",
  authenticatMiddleware.authenticateAccessToken,
  termController.updateTerm
);
// 약관을 삭제합니다.
router.delete(
  "/terms/:termId",
  authenticatMiddleware.authenticateAccessToken,
  termController.deleteTerm
);
// 약관을 생성합니다.
router.post(
  "/terms",
  authenticatMiddleware.authenticateAccessToken,
  termController.createTerm
);
// 약관 내용을 조회합니다.
router.get(
  "/terms/:termId",
  authenticatMiddleware.authenticateAccessToken,
  termController.getTermById
);
// 약관 목록을 조회합니다.
router.get(
  "/terms",
  authenticatMiddleware.authenticateAccessToken,
  termController.getTerms
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

// get all permissions
router.get(
  "/permissions",
  authenticatMiddleware.authenticateAccessToken,
  acController.getPermissions
);

// get all roles
router.get(
  "/roles",
  authenticatMiddleware.authenticateAccessToken,
  acController.getRoles
);

// create roles
router.post(
  "/roles",
  authenticatMiddleware.authenticateAccessToken,
  checkPermission("admin:super"),
  acController.createRole
);

// assign roles to users
router.post(
  "/roles/user",
  authenticatMiddleware.authenticateAccessToken,
  checkPermission("admin:super"),
  acController.assignRoleToUser
);

// delete roles from users
router.delete(
  "/roles/user",
  authenticatMiddleware.authenticateAccessToken,
  checkPermission("admin:super"),
  acController.deleteRoleFromUser
);

export default router;
