import { paramForm } from "../parameters.js";
import { requestBodyForm } from "../request.body.js";
import { generalResponse } from "../responses.js";

const responseRef = (path) => {
  return {
    $ref: `#/components/responses/${path}`,
  };
};

const swaggerFormat = ({
  tag,
  summary,
  requestBody,
  params = null,
  responses = generalResponse,
}) => {
  return {
    tags: [tag],
    summary,
    requestBody,
    parameters: paramForm(params),
    responses,
  };
};

const registerTag = "Auth: 회원가입";

const register = {
  "/auth/terms": {
    get: swaggerFormat({
      tag: registerTag,
      summary: "현행 약관 조회",
    }),
  },
  "/auth/register/local": {
    post: swaggerFormat({
      tag: registerTag,
      summary: "회원가입 (local)",
      requestBody: requestBodyForm("auth/localRegisterSchema"),
    }),
  },
  "/auth/register/oauth": {
    post: swaggerFormat({
      tag: registerTag,
      summary: "회원가입 (oauth)",
      requestBody: requestBodyForm("auth/oauthRegisterSchema"),
    }),
  },
  "/auth/register/nickname/check": {
    get: swaggerFormat({
      tag: registerTag,
      summary: "닉네임 중복확인 제공",
    }),
  },
  "/auth/register/test": {
    post: swaggerFormat({
      tag: registerTag,
      summary: "테스트용 회원가입",
    }),
  },
};

const loginTag = "Auth: 로그인, 로그아웃, 토큰 재발급";
const login = {
  "/auth/login/local": {
    post: swaggerFormat({
      tag: loginTag,
      summary: "로그인 (local)",
      requestBody: requestBodyForm("auth/phoneVerifySchema"),
    }),
  },
  "/auth/logout": {
    delete: swaggerFormat({
      tag: loginTag,
      summary: "로그아웃",
    }),
  },
  "/auth/token/reissue": {
    get: swaggerFormat({
      tag: loginTag,
      summary: "토큰 재발급",
    }),
  },
  "/auth/login/test/{userId}": {
    get: swaggerFormat({
      tag: loginTag,
      summary: "테스트 로그인",
      params: ["userId"],
    }),
  },
};

const kakaoTag = {
  tags: ["Auth: 카카오 로그인"],
};
const kakaoOAuth = {
  "/auth/login/kakao": {
    get: {
      ...kakaoTag,
      summary: "카카오 로그인",
      responses: generalResponse,
    },
  },
  "/auth/login/kakao/callback": {
    get: {
      ...kakaoTag,
      summary: "카카오 로그인 콜백",
      responses: generalResponse,
    },
  },
};

const phoneTag = "Auth: 휴대폰 인증";
const phone = {
  "/auth/phone/account/status": {
    get: swaggerFormat({
      tag: phoneTag,
      summary: "휴대폰 번호로 계정 상태 확인",
    }),
  },
  "/auth/phone/send": {
    post: swaggerFormat({
      tag: phoneTag,
      summary: "휴대폰 번호로 인증번호 전송",
      requestBody: requestBodyForm("auth/sendTokenToPhoneSchema"),
    }),
  },
  "/auth/phone/verify": {
    post: swaggerFormat({
      tag: phoneTag,
      summary: "휴대폰 인증번호 확인",
      requestBody: requestBodyForm("auth/phoneVerifySchema"),
    }),
  },
};

export default {
  ...register,
  ...login,
  ...kakaoOAuth,
  ...phone,
};
