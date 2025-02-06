import { swaggerFormat } from "../formats.js";

const authTags = {
  registerTag: "Auth: 회원가입",
  loginTag: "Auth: 로그인, 로그아웃, 토큰 재발급",
  kakaoTag: "Auth: 카카오 로그인",
  phoneTag: "Auth: 휴대폰 인증",
};

const register = {
  "/auth/terms": {
    get: swaggerFormat({
      tag: authTags.registerTag,
      summary: "현행 약관 조회",
      description:
        "회원가입 시 사용합니다. 조회 시점에 `active` 상태인 모든 약관을 조회합니다.",
    }),
  },
  "/auth/register/local": {
    post: swaggerFormat({
      tag: authTags.registerTag,
      summary: "로컬 회원가입",
      description:
        "Peekle의 자체 회원가입 과정을 통한 (OAuth가 아닌) 회원가입을 진행합니다.",
      requestBody: "auth/localRegisterSchema",
    }),
  },
  "/auth/register/oauth": {
    post: swaggerFormat({
      tag: authTags.registerTag,
      summary: "회원가입 (oauth)",
      requestBody: "auth/oauthRegisterSchema",
    }),
  },
  "/auth/register/nickname/check": {
    get: swaggerFormat({
      tag: authTags.registerTag,
      summary: "닉네임 중복확인 제공",
    }),
  },
  "/auth/register/test": {
    post: swaggerFormat({
      tag: authTags.registerTag,
      summary: "테스트용 회원가입",
    }),
  },
};

const loginTag = "Auth: 로그인, 로그아웃, 토큰 재발급";
const login = {
  "/auth/login/local": {
    post: swaggerFormat({
      tag: authTags.loginTag,
      summary: "로그인 (local)",
      requestBody: "auth/phoneVerifySchema",
    }),
  },
  "/auth/logout": {
    delete: swaggerFormat({
      tag: authTags.loginTag,
      summary: "로그아웃",
    }),
  },
  "/auth/token/reissue": {
    get: swaggerFormat({
      tag: authTags.loginTag,
      summary: "토큰 재발급",
    }),
  },
  "/auth/login/test/{userId}": {
    get: swaggerFormat({
      tag: authTags.loginTag,
      summary: "테스트 로그인",
      params: ["auth/userId"],
    }),
  },
};

const kakaoOAuth = {
  "/auth/login/kakao": {
    get: swaggerFormat({
      tag: authTags.kakaoTag,
      summary: "kakao 로그인",
    }),
  },
  "/auth/login/kakao/callback": {
    get: swaggerFormat({
      tag: authTags.kakaoTag,
      summary: "kakao callback",
    }),
  },
};

const phone = {
  "/auth/phone/account/status": {
    get: swaggerFormat({
      tag: authTags.phoneTag,
      summary: "휴대폰 번호로 계정 상태 확인",
      params: ["auth/phone"],
    }),
  },
  "/auth/phone/send": {
    post: swaggerFormat({
      tag: authTags.phoneTag,
      summary: "휴대폰 번호로 인증번호 전송",
      requestBody: "auth/sendTokenToPhoneSchema",
      responses: {
        200: {
          description: "게시글 목록 조회 성공",
        },
      },
    }),
  },
  "/auth/phone/verify": {
    post: swaggerFormat({
      tag: authTags.phoneTag,
      operationId: "phoneVerify",
      summary: "휴대폰 인증번호 확인",
      requestBody: "auth/phoneVerifySchema",
    }),
  },
};

export default {
  ...register,
  ...login,
  ...kakaoOAuth,
  ...phone,
};
