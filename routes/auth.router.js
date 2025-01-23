import { Router } from "express";
import { notImplementedController } from "../controllers/empty.cotroller.js";

import * as phoneController from "../controllers/auth/phone.auth.controller.js";
import * as registerController from "../controllers/auth/register.auth.controller.js";
import * as loginController from "../controllers/auth/login.auth.controller.js";
import * as kakaoController from "../controllers/auth/kakao.auth.controller.js";
import { authenticateRefreshToken } from "../middleware/authenticate.jwt.js";

const router = Router();

// 회원가입
router.get("/terms", registerController.getTerms);
router.post("/register/local", registerController.register);
router.post("/register/oauth", registerController.oauthRegister);

// 테스트용 회원가입
router.post("/register/test", registerController.testRegister);

// 로그인, 로그아웃, 토큰 관리
router.post("/login/local", loginController.localLogin);
router.delete("/logout", loginController.logout);
router.get(
  "/token/reissue",
  authenticateRefreshToken,
  loginController.reissueToken
);

// 테스트 로그인
router.get("/login/test/:userId", loginController.testLogin);

// kakao 로그인
router.get("/login/kakao", kakaoController.kakaoLogin);
router.get("/login/kakao/callback", kakaoController.kakaoCallback);

// 전화번호 인증
router.get("/phone/account/status", phoneController.checkAccountStatus);
router.post("/phone/send", phoneController.sendTokenToPhone);
router.post("/phone/verify", phoneController.verifyToken);

export default router;
