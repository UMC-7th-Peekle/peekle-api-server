import { Router } from "express";
import { notImplementedController } from "../controllers/empty.cotroller.js";

import * as phoneController from "../controllers/auth/phone.auth.controller.js";
import * as registerController from "../controllers/auth/register.auth.controller.js";

const router = Router();

// 회원가입
router.get("/terms", notImplementedController);
router.post("/register/local", registerController.register);

// 로그인, 로그아웃, 토큰 관리
router.post("/login/local", notImplementedController);
router.get("/login/kakao/callback", notImplementedController);
router.delete("/logout", notImplementedController);
router.get("/token/reissue", notImplementedController);

// 전화번호 인증
router.post("/phone/unique", phoneController.phoneUnique);
router.post("/phone/send", phoneController.sendTokenToPhone);
router.post("/phone/verify", phoneController.verifyToken);

export default router;
