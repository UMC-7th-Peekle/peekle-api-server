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

// export const authSwaggerSchema = { ...authSchema };

export const authSwaggerSchema = {
  localRegisterSchema: {
    type: "object",
    properties: {
      name: { type: "string", example: "김철수" },
      nickname: { type: "string", example: "철수야" },
      birthdate: { type: "string", format: "date", example: "1995-05-15" },
      gender: { type: "string", enum: ["male", "female"], example: "male" },
      email: { type: "string", format: "email", example: "user@example.com" },
      phone: {
        type: "string",
        pattern: "^[0-9]{10,11}$",
        example: "01012345678",
      },
      phoneVerificationSessionId: { type: "string", example: "session_5678" },
      terms: {
        type: "array",
        items: {
          type: "object",
          properties: {
            termId: { type: "integer", example: 1 },
            isAgreed: { type: "boolean", example: true },
          },
          required: ["termId", "isAgreed"],
        },
        example: [
          { termId: 1, isAgreed: true },
          { termId: 2, isAgreed: false },
        ],
      },
    },
    required: [
      "name",
      "nickname",
      "birthdate",
      "gender",
      "email",
      "phone",
      "phoneVerificationSessionId",
      "terms",
    ],
    additionalProperties: false,
  },

  oauthRegisterSchema: {
    type: "object",
    properties: {
      oauthId: { type: "integer", example: 12345 },
      oauthType: {
        type: "string",
        enum: ["kakao", "google", "facebook"],
        example: "kakao",
      },
      name: { type: "string", example: "이영희" },
      nickname: { type: "string", example: "영희양" },
      birthdate: { type: "string", format: "date", example: "2000-12-25" },
      gender: { type: "string", enum: ["male", "female"], example: "female" },
      email: { type: "string", format: "email", example: "user@social.com" },
      phone: {
        type: "string",
        pattern: "^[0-9]{10,11}$",
        example: "01087654321",
      },
      phoneVerificationSessionId: { type: "string", example: "session_abcd" },
      terms: {
        type: "array",
        items: {
          type: "object",
          properties: {
            termId: { type: "integer", example: 1 },
            isAgreed: { type: "boolean", example: true },
          },
          required: ["termId", "isAgreed"],
        },
        example: [
          { termId: 3, isAgreed: true },
          { termId: 4, isAgreed: true },
        ],
      },
    },
    required: [
      "oauthId",
      "oauthType",
      "name",
      "nickname",
      "birthdate",
      "gender",
      "email",
      "phone",
      "phoneVerificationSessionId",
      "terms",
    ],
    additionalProperties: false,
  },
  phoneVerifySchema: {
    type: "object",
    properties: {
      phone: {
        type: "string",
        pattern: "^[0-9]{10,11}$",
        example: "01011223344",
      },
      phoneVerificationSessionId: { type: "string", example: "session_efgh" },
      phoneVerificationCode: {
        type: "string",
        pattern: "^[0-9]{4}$",
        example: "9876",
      },
    },
    required: ["phone", "phoneVerificationSessionId", "phoneVerificationCode"],
    additionalProperties: false,
  },
  sendTokenToPhoneSchema: {
    type: "object",
    properties: {
      phone: {
        type: "string",
        pattern: "^[0-9]{10,11}$",
        example: "01055667788",
      },
    },
    required: ["phone"],
    additionalProperties: false,
  },
};

export const authSwagger = {
  "/phone/verify": {
    post: {
      tags: ["회원가입"],
      summary: "휴대폰 인증",
      description: "휴대폰 인증을 진행합니다.",
      deprecated: false, // 사용하지 않는 API일 경우 true로 변경
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/localRegisterSchema",
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
