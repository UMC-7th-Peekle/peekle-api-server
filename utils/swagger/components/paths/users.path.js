export default {
  "/users/me": {
    get: {
      tags: ["Users"],
      summary: "사용자 정보 조회",
      description: "사용자 정보를 조회합니다.",
      responses: {
        200: {
          description: "사용자 정보 조회 성공",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  nickname: { type: "string" },
                  profile_image: { type: "string" },
                  phone: { type: "string" },
                  email: { type: "string" },
                  terms: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        termId: { type: "integer" },
                        isAgreed: { type: "boolean" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: "인증 실패",
        },
        500: {
          description: "서버 오류",
        },
      },
    },
  },
  "/users/me/nickname": {
    patch: {
      tags: ["Users"],
      summary: "닉네임 변경",
      description: "사용자의 닉네임을 변경합니다.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                nickname: { type: "string" },
              },
              required: ["nickname"],
              additionalProperties: false,
            },
          },
        },
      },
      responses: {
        200: {
          description: "닉네임 변경 성공",
        },
        400: {
          description: "입력값 오류",
        },
        401: {
          description: "인증 실패",
        },
        500: {
          description: "서버 오류",
        },
      },
    },
  },
  "/users/me/profile-image": {
    patch: {
      tags: ["Users"],
      summary: "프로필 이미지 변경",
      description: "사용자의 프로필 이미지를 변경합니다.",
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                profile_image: {
                  type: "string",
                  format: "binary",
                },
              },
              required: ["profile_image"],
              additionalProperties: false,
            },
          },
        },
      },
      responses: {
        200: {
          description: "프로필 이미지 변경 성공",
        },
        401: {
          description: "인증 실패",
        },
        500: {
          description: "서버 오류",
        },
      },
    },
    delete: {
      tags: ["Users"],
      summary: "프로필 이미지 삭제",
      description: "사용자의 프로필 이미지를 삭제합니다.",
      responses: {
        200: {
          description: "프로필 이미지 삭제 성공",
        },
        401: {
          description: "인증 실패",
        },
        500: {
          description: "서버 오류",
        },
      },
    },
  },
  "/users/me/phone": {
    patch: {
      tags: ["Users"],
      summary: "전화번호 변경",
      description: "사용자의 전화번호를 변경합니다.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                phone: { type: "string" },
                phoneVerificationSessionId: { type: "string" },
              },
              required: ["phone", "phoneVerificationSessionId"],
              additionalProperties: false,
            },
          },
        },
      },
      responses: {
        200: {
          description: "전화번호 변경 성공",
        },
        400: {
          description: "입력값 오류",
        },
        401: {
          description: "인증 실패",
        },
        500: {
          description: "서버 오류",
        },
      },
    },
  },
  "/users/restore": {
    post: {
      tags: ["Users"],
      summary: "회원 복구",
      description: "탈퇴한 회원을 복구합니다.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                targetUserId: { type: "integer" },
              },
              required: ["targetUserId"],
              additionalProperties: false,
            },
          },
        },
      },
      responses: {
        200: {
          description: "회원 복구 성공",
        },
        400: {
          description: "입력값 오류",
        },
        401: {
          description: "인증 실패",
        },
        500: {
          description: "서버 오류",
        },
      },
    },
  },
  "/users": {
    delete: {
      tags: ["Users"],
      summary: "회원 탈퇴",
      description: "회원을 탈퇴합니다.",
      responses: {
        200: {
          description: "회원 탈퇴 성공",
        },
        401: {
          description: "인증 실패",
        },
        500: {
          description: "서버 오류",
        },
      },
    },
  },
  "/users/immediately": {
    delete: {
      tags: ["Users"],
      summary: "즉시 회원 탈퇴",
      description: "회원을 즉시 탈퇴합니다.",
      responses: {
        200: {
          description: "회원 탈퇴 성공",
        },
        401: {
          description: "인증 실패",
        },
        500: {
          description: "서버 오류",
        },
      },
    },
  },
  "/users/block": {
    get: {
      tags: ["Users"],
      summary: "차단된 사용자 목록 조회",
      description: "사용자가 차단한 사용자 목록을 조회합니다.",
      responses: {
        200: {
          description: "차단된 사용자 목록 조회 성공",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    nickname: { type: "string" },
                    profile_image: { type: "string" },
                  },
                },
              },
            },
          },
        },
        401: {
          description: "인증 실패",
        },
        500: {
          description: "서버 오류",
        },
      },
    },
    post: {
      tags: ["Users"],
      summary: "사용자 차단",
      description: "사용자를 차단합니다.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                targetUserId: { type: "integer" },
              },
              required: ["targetUserId"],
              additionalProperties: false,
            },
          },
        },
      },
      responses: {
        200: {
          description: "사용자 차단 성공",
        },
        400: {
          description: "입력값 오류",
        },
        401: {
          description: "인증 실패",
        },
        500: {
          description: "서버 오류",
        },
      },
    },
    delete: {
      tags: ["Users"],
      summary: "사용자 차단 해제",
      description: "사용자의 차단을 해제합니다.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                targetUserId: { type: "integer" },
              },
              required: ["targetUserId"],
              additionalProperties: false,
            },
          },
        },
      },
      responses: {
        200: {
          description: "사용자 차단 해제 성공",
        },
        400: {
          description: "입력값 오류",
        },
        401: {
          description: "인증 실패",
        },
        500: {
          description: "서버 오류",
        },
      },
    },
  },
  "/users/report": {
    post: {
      tags: ["Users"],
      summary: "사용자 신고",
      description: "사용자를 신고합니다.",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                targetUserId: { type: "integer" },
                reason: { type: "string" },
              },
              required: ["targetUserId", "reason"],
              additionalProperties: false,
            },
          },
        },
      },
      responses: {
        200: {
          description: "사용자 신고 성공",
        },
        400: {
          description: "입력값 오류",
        },
        401: {
          description: "인증 실패",
        },
        500: {
          description: "서버 오류",
        },
      },
    },
  },
};
