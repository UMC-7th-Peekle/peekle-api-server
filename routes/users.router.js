import { Router } from "express";

import * as profileController from "../controllers/users/profile.users.controller.js";
import { authenticateAccessToken } from "../middleware/authenticate.jwt.js";
import { validateRequestBody } from "../middleware/validate.js";

import * as usersSchema from "../utils/validators/users/users.validators.js";
import { phoneVerifySchema } from "../utils/validators/auth/auth.validators.js";
import { localStorage, restrictions } from "../middleware/uploader.js";

const router = Router();

// 사용자 정보 조회
router.get("/me", authenticateAccessToken, profileController.getProfile);
router.get("/terms", authenticateAccessToken, profileController.getUserTerms);

// 사용자 정보 수정
router.patch(
  "/me/nickname",
  validateRequestBody(usersSchema.changeNicknameSchema),
  authenticateAccessToken,
  profileController.changeNickname
);

router.patch(
  "/me/profile-image",
  authenticateAccessToken,
  localStorage({
    restrictions: restrictions("profile"),
    field: [{ name: "profile_image", maxCount: 1 }],
    destination: "uploads/profile",
  }),
  profileController.changeProfileImage
);
router.delete(
  "/me/profile-image",
  authenticateAccessToken,
  profileController.deleteProfileImage
);
router.patch(
  "/me/phone",
  validateRequestBody(phoneVerifySchema),
  authenticateAccessToken,
  profileController.changePhone
);

// 사용자 계정 상태 변경
router.post(
  "/restore",
  validateRequestBody(usersSchema.targetUserIdSchema),
  profileController.restoreUser
);
router.delete("/", authenticateAccessToken, profileController.terminateUser);
router.delete(
  "/immediately",
  authenticateAccessToken,
  profileController.terminateUserImmediately
);

// 사용자 차단, 신고
router.get(
  "/block",
  authenticateAccessToken,
  profileController.getBlockedUsers
);
router.post(
  "/block",
  validateRequestBody(usersSchema.targetUserIdSchema),
  authenticateAccessToken,
  profileController.blockUser
);
router.delete(
  "/block",
  validateRequestBody(usersSchema.targetUserIdSchema),
  authenticateAccessToken,
  profileController.unblockUser
);

router.post(
  "/report",
  validateRequestBody(usersSchema.reportUserSchema),
  authenticateAccessToken,
  profileController.reportUser
);

export default router;
