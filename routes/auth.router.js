import { Router } from "express";
import { notImplementedController } from "../controllers/empty.cotroller.js";

const router = Router();

// 회원가입
router.get("/terms", notImplementedController);
router.post("/register/local", notImplementedController);

// 로그인, 로그아웃, 토큰 관리
router.post("/login/local", notImplementedController);
router.get("/login/kakao/callback", notImplementedController);
router.delete("/logout", notImplementedController);
router.get("/token/reissue", notImplementedController);

// 전화번호 인증
router.post("/phone/unique", notImplementedController);
router.post("/phone/send", notImplementedController);
router.post("/phone/verify", notImplementedController);

export default router;
