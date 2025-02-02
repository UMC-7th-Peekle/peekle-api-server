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
      name: { type: "string", example: "박경운" },
      nickname: { type: "string", example: "하늘" },
      birthdate: { type: "string", format: "date", example: "2001-12-09" },
      gender: { type: "string", enum: ["male", "female"], example: "male" },
      email: { type: "string", format: "email", example: "user@example.com" },
      phone: {
        type: "string",
        pattern: "^[0-9]{10,11}$",
        example: "01012345678",
      },
      phoneVerificationSessionId: {
        type: "string",
        example: "encrypted session ID",
      },
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
      name: { type: "string", example: "박경운" },
      nickname: { type: "string", example: "하늘" },
      birthdate: { type: "string", format: "date", example: "2001-12-09" },
      gender: { type: "string", enum: ["male", "female"], example: "male" },
      email: { type: "string", format: "email", example: "user@example.com" },
      phone: {
        type: "string",
        pattern: "^[0-9]{10,11}$",
        example: "01012345678",
      },
      phoneVerificationSessionId: {
        type: "string",
        example: "encrypted session ID",
      },
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
        example: "01012345678",
      },
      phoneVerificationSessionId: {
        type: "string",
        example: "encrypted session ID",
      },
      phoneVerificationCode: {
        type: "string",
        pattern: "^[0-9]{4}$",
        example: "0000",
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
        example: "01012345678",
      },
    },
    required: ["phone"],
    additionalProperties: false,
  },
};

export const authSwagger = {
  "/auth/terms": {
    get: {
      tags: ["Auth"],
      summary: "현행 약관을 가져옵니다. 회원가입 시 활용합니다.",
      responses: {
        200: {
          description: "성공",
        },
      },
    },
  },
  "/auth/register/local": {
    post: {
      tags: ["Auth"],
      summary: "회원가입 (local)",
      requestBody: {
        $ref: "#/components/requestBodies/sample",
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
  "/auth/register/oauth": {
    post: {
      tags: ["Auth"],
      summary: "회원가입 (OAuth)",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/auth/oauthRegisterSchema",
            },
          },
        },
        required: true,
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
  "/auth/register/nickname/check": {
    get: {
      tags: ["Auth"],
      summary: "닉네임 중복확인",
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
  "/auth/register/test": {
    post: {
      tags: ["Auth"],
      summary: "테스트 회원가입",
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
  "/auth/login/local": {
    post: {
      tags: ["Auth"],
      summary: "로그인 (local)",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/phoneVerifySchema",
            },
          },
        },
        required: true,
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
  "/auth/logout": {
    delete: {
      tags: ["Auth"],
      summary: "로그아웃",
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
  "/auth/token/reissue": {
    get: {
      tags: ["Auth"],
      summary: "토큰 재발급",
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
  "/auth/login/test/{userId}": {
    get: {
      tags: ["Auth"],
      summary: "테스트 로그인",
      parameters: [
        {
          $ref: "#/components/parameters/userId",
        },
      ],
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
  "/auth/login/kakao": {
    get: {
      tags: ["Auth"],
      summary: "카카오 로그인",
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
  "/auth/login/kakao/callback": {
    get: {
      tags: ["Auth"],
      summary: "카카오 로그인 콜백",
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
  "/auth/phone/account/status": {
    get: {
      tags: ["Auth"],
      summary: "휴대폰 번호로 계정 상태 확인",
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
  "/auth/phone/send": {
    post: {
      tags: ["Auth"],
      summary: "휴대폰 번호로 인증번호 전송",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/sendTokenToPhoneSchema",
            },
          },
        },
        required: true,
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
  "/auth/phone/verify": {
    post: {
      tags: ["Auth"],
      summary: "휴대폰 인증번호 확인",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/phoneVerifySchema",
            },
          },
        },
        required: true,
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
