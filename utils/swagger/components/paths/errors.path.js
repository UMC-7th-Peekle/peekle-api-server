import { swaggerFormat } from "../formats.js";

const errorTags = {
  auth: "Errors: Auth",
  users: "Errors: Users",
  community: "Errors: Community",
  all: "Errors: 전체 에러 목록",
};

const responseContent = {
  "application/json": {
    schema: {
      type: "object",
      properties: {
        resultType: {
          type: "string",
          example: "FAIL",
          description: "요청 결과의 타입입니다.",
        },
        error: {
          type: ["object", "null"],
          example: {
            errorCode: "INVALID_INPUT",
            reason: "잘못된 입력입니다.",
            data: null,
          },
          description: "요청이 실패했을 경우 message 및 data가 반환됩니다.",
        },
        success: {
          type: ["object", "null"],
          example: null,
          description: "요청이 성공했을 경우 message 및 data가 반환됩니다.",
          properties: {},
        },
      },
    },
  },
};

const authErrors = {};

const errors = {
  INVALID_INPUT: {
    options: {
      tags: [errorTags.all],
      summary: "잘못된 입력이 들어온 경우",
      description: "잘못된 입력입니다.",
      responses: {
        400: {
          description: "잘못된 요청입니다.",
          content: responseContent,
        },
      },
    },
  },
  ALREADY_EXISTS: {
    options: {
      tags: [errorTags.all],
      summary: "요청한게 이미 존재하는 경우",
      description: "요청한게 이미 존재합니다.",
      responses: {
        400: {
          description: "잘못된 요청입니다.",
          content: responseContent,
        },
      },
    },
  },
  NOT_EXISTS: {
    options: {
      tags: [errorTags.all],
      summary: "요청한게 존재하지 않는 경우",
      description: "요청한게 존재하지 않습니다.",
      responses: {
        400: {
          description: "잘못된 요청입니다.",
          content: responseContent,
        },
      },
    },
  },
  NOT_ALLOWED: {
    options: {
      tags: [errorTags.all],
      summary: "인증은 되었으나 권한이 부족한 경우",
      description: "권한이 부족합니다.",
      responses: {
        400: {
          description: "잘못된 요청입니다.",
          content: responseContent,
        },
      },
    },
  },
  UNAUTHORIZED: {
    options: {
      tags: [errorTags.all],
      summary: "인증 정보가 제공되어 있지 않은 경우",
      description: "인증 정보가 제공되지 않았습니다.",
      responses: {
        400: {
          description: "잘못된 요청입니다.",
          content: responseContent,
        },
      },
    },
  },
  CHECK_JWT_TOKEN: {
    options: {
      tags: [errorTags.all],
      summary: "JWT 토큰에 문제가 있는 경우",
      description: "JWT 토큰에 문제가 있습니다.",
      responses: {
        400: {
          description: "잘못된 요청입니다.",
          content: responseContent,
        },
      },
    },
  },
  AJV_INVALID_INPUT: {
    options: {
      tags: [errorTags.all],
      summary: "request 형식이 올바르지 않은 경우",
      description: "request 형식이 올바르지 않습니다.",
      responses: {
        400: {
          description: "잘못된 요청입니다.",
          content: responseContent,
        },
      },
    },
  },
  UNKNOWN_ERROR: {
    options: {
      tags: [errorTags.all],
      summary: "디버깅용",
      description: "알 수 없는 오류입니다.",
      responses: {
        400: {
          description: "잘못된 요청입니다.",
          content: responseContent,
        },
      },
    },
  },
  SESSION_TIMEOUT: {
    options: {
      tags: [errorTags.all],
      summary: "전화번호 인증시간 만료",
      description: "전화번호 인증시간이 만료되었습니다.",
      responses: {
        400: {
          description: "잘못된 요청입니다.",
          content: responseContent,
        },
      },
    },
  },
  TOO_MANY_ATTEMPTS: {
    options: {
      tags: [errorTags.all],
      summary: "전화번호 최대 인증가능 횟수 초과",
      description: "전화번호 최대 인증가능 횟수를 초과했습니다.",
      responses: {
        400: {
          description: "잘못된 요청입니다.",
          content: responseContent,
        },
      },
    },
  },
  INVALID_CODE: {
    options: {
      tags: [errorTags.all],
      summary: "전화번호 인증코드 불일치",
      description: "전화번호 인증코드가 불일치합니다.",
      responses: {
        400: {
          description: "잘못된 요청입니다.",
          content: responseContent,
        },
      },
    },
  },
  CIPHER_ERROR: {
    options: {
      tags: [errorTags.all],
      summary: "Cipher 오류",
      description: "Cipher 오류가 발생했습니다.",
      responses: {
        400: {
          description: "잘못된 요청입니다.",
          content: responseContent,
        },
      },
    },
  },
  MULTER_ERROR: {
    options: {
      tags: [errorTags.all],
      summary: "Multer 오류",
      description: "Multer 오류가 발생했습니다.",
      responses: {
        400: {
          description: "잘못된 요청입니다.",
          content: responseContent,
        },
      },
    },
  },
  USER_RESTRICTED: {
    options: {
      tags: [errorTags.all],
      summary: "제재를 받은 사용자",
      description: "제재를 받은 사용자입니다.",
      responses: {
        400: {
          description: "잘못된 요청입니다.",
          content: responseContent,
        },
      },
    },
  },
  DORMANT_OR_TERMINATED: {
    options: {
      tags: [errorTags.all],
      summary: "탈퇴하거나 휴면 상태의 사용자",
      description: "탈퇴하거나 휴면 상태의 사용자입니다.",
      responses: {
        400: {
          description: "잘못된 요청입니다.",
          content: responseContent,
        },
      },
    },
  },
  NOT_VERIFIED: {
    options: {
      tags: [errorTags.all],
      summary: "핸드폰 번호가 인증되지 않은 경우",
      description: "핸드폰 번호가 인증되지 않았습니다.",
      responses: {
        400: {
          description: "잘못된 요청입니다.",
          content: responseContent,
        },
      },
    },
  },
  INVALID_QUERY: {
    options: {
      tags: [errorTags.all],
      summary: "올바르지 않은 쿼리문일 경우",
      description: "올바르지 않은 쿼리문입니다.",
      responses: {
        400: {
          description: "잘못된 요청입니다.",
          content: responseContent,
        },
      },
    },
  },
  INVALID_CONTENT_TYPE: {
    options: {
      tags: [errorTags.all],
      summary: "기대된 Content-Type가 아닌 경우",
      description: "기대된 Content-Type가 아닙니다.",
      responses: {
        400: {
          description: "잘못된 요청입니다.",
          content: responseContent,
        },
      },
    },
  },
};

export default {
  ...errors,
  ...authErrors,
};
