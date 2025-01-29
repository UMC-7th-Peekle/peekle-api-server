import { Router } from "express";

import * as profileController from "../controllers/users/profile.users.controller.js";
import { authenticateAccessToken } from "../middleware/authenticate.jwt.js";

const router = Router();

// 사용자 정보 조회
router.get("/me", authenticateAccessToken, profileController.getProfile);
router.get("/terms", authenticateAccessToken, profileController.getUserTerms);

// 사용자 정보 수정
router.patch(
  "/me/nickname",
  authenticateAccessToken,
  profileController.changeNickname
);
router.patch(
  "/me/profile-image",
  authenticateAccessToken,
  profileController.changeProfileImage
);
router.delete(
  "/me/profile-image",
  authenticateAccessToken,
  profileController.deleteProfileImage
);
router.patch(
  "/me/phone",
  authenticateAccessToken,
  profileController.changePhone
);

// 사용자 계정 상태 변경
router.post("/restore", profileController.restoreUser);
router.delete("/", authenticateAccessToken, profileController.terminateUser);

// 사용자 차단, 신고
router.get(
  "/block",
  authenticateAccessToken,
  profileController.getBlockedUsers
);
router.post("/block", authenticateAccessToken, profileController.blockUser);
router.delete("/block", authenticateAccessToken, profileController.unblockUser);

router.post("/report", authenticateAccessToken, profileController.reportUser);

export default router;
