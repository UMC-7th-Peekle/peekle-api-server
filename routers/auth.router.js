import { Router } from "express";
import { emptyController } from "../controllers/empty.cotroller.js";

const router = Router();

/**
 * 로컬 회원가입을 처리합니다.
 */
router.post("/register/local", emptyController);

/**
 * 약관을 조회합니다.
 */
router.get("/terms", emptyController);

/**
 * 로컬 로그인을 처리합니다.
 */
router.post("/login/local", emptyController);

/**
 * 카카오 로그인을 처리합니다.
 */
router.post("/login/kakao", emptyController);

/**
 * 카카오 로그인 콜백을 처리합니다.
 */
router.post("/login/kakao/callback", emptyController);

/**
 * 휴대폰 중복 여부를 확인합니다.
 */
router.post("/phone/unique", emptyController);

/**
 * 휴대폰 인증번호를 전송합니다.
 */
router.post("/phone/send", emptyController);

/**
 * 휴대폰 인증번호를 확인합니다.
 */
router.post("/phone/verify", emptyController);

/**
 * 토큰을 재발급합니다.
 */
router.get("/token/reissue", emptyController);

/**
 * 로그아웃을 처리합니다.
 */
router.delete("/logout", emptyController);

/**
 * 비밀번호를 초기화합니다.
 */
router.post("/password/reset", emptyController);

/**
 * 비밀번호를 변경합니다.
 */
router.patch("/password/change", emptyController);
