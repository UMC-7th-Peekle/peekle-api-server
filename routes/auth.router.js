import { Router } from "express";

import * as phoneController from "../controllers/auth/phone.auth.controller.js";
import * as registerController from "../controllers/auth/register.auth.controller.js";
import * as loginController from "../controllers/auth/login.auth.controller.js";
import * as kakaoController from "../controllers/auth/kakao.auth.controller.js";
import { authenticateRefreshToken } from "../middleware/authenticate.jwt.js";

import * as authSchema from "../utils/validators/auth/auth.validators.js";
import { validateRequestBody } from "../middleware/validate.js";

const router = Router();

/*
  회원가입
*/

// 현행 약관 조회
router.get("/terms", registerController.getTerms);
// 회원가입 (local)
router.post(
  "/register/local",
  validateRequestBody(authSchema.localRegisterSchema),
  registerController.register
);
// 회원가입 (oauth)
router.post(
  "/register/oauth",
  validateRequestBody(authSchema.oauthRegisterSchema),
  registerController.oauthRegister
);
// 닉네임 중복확인 제공
router.get("/register/nickname/check", registerController.checkNicknameUnique);

// 테스트용 회원가입
router.post("/register/test", registerController.testRegister);

/*
  로그인, 로그아웃, 토큰 재발급
*/

// 로그인 (local)
router.post(
  "/login/local",
  validateRequestBody(authSchema.phoneVerifySchema),
  loginController.localLogin
);
// 로그아웃
router.delete("/logout", loginController.logout);
// 토큰 재발급
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

/*
  휴대폰 인증
*/

// 휴대폰 번호로 계정 상태 확인
router.get("/phone/account/status", phoneController.checkAccountStatus);
// 휴대폰 번호로 인증번호 전송
router.post(
  "/phone/send",
  validateRequestBody(authSchema.sendTokenToPhoneSchema),
  phoneController.sendTokenToPhone
);
// 휴대폰 인증번호 확인
router.post(
  "/phone/verify",
  validateRequestBody(authSchema.phoneVerifySchema),
  phoneController.verifyToken
);

export const authSwaggerSchema = {
  PhoneVerify: {
    type: "object",
    properties: {
      phoneNumber: {
        type: "string",
        example: "01012345678",
      },
      token: {
        type: "string",
        example: "123456",
      },
    },
    required: ["phoneNumber", "token"],
  },
};

export const authSwagger = {
  "/phone/verify": {
    post: {
      tags: ["Auth"],
      summary: "휴대폰 인증",
      description: "휴대폰 인증을 진행합니다.",
      deprecated: false, // 사용하지 않는 API일 경우 true로 변경
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/PhoneVerify",
            },
          },
        },
      },
      responses: {
        200: {
          description: "성공",
        },
        400: {
          description: "실패",
        },
      },
    },
  },
};

// Yaml 형식으로 작성한 JSDoc을 swagger방식으로 변환

export default router;
