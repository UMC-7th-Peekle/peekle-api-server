const responseRef = (path) => {
  return {
    $ref: `#/components/responses/${path}`,
  };
};

const successResponse = responseRef("successResponse");

const register = {
  "/auth/terms": {
    get: {
      tags: ["Auth: 회원가입"],
      summary: "현행 약관을 가져옵니다. 회원가입 시 활용합니다.",
      responses: successResponse,
    },
  },
  "/auth/register/local": {
    post: {
      tags: ["Auth: 회원가입"],
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
      tags: ["Auth: 회원가입"],
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
      tags: ["Auth: 회원가입"],
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
      tags: ["Auth: 회원가입"],
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
};

const login = {
  "/auth/login/local": {
    post: {
      tags: ["Auth: 로그인/로그아웃/AT 재발급"],
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
      tags: ["Auth: 로그인/로그아웃/AT 재발급"],
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
      tags: ["Auth: 로그인/로그아웃/AT 재발급"],
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
      tags: ["Auth: 로그인/로그아웃/AT 재발급"],
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
};

const kakaoOAuth = {
  "/auth/login/kakao": {
    get: {
      tags: ["Auth: 카카오 로그인"],
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
      tags: ["Auth: 카카오 로그인"],
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
};

const phone = {
  "/auth/phone/account/status": {
    get: {
      tags: ["Auth: 휴대폰 인증"],
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
      tags: ["Auth: 휴대폰 인증"],
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
      tags: ["Auth: 휴대폰 인증"],
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

export default {
  ...register,
  ...login,
  ...kakaoOAuth,
  ...phone,
};
