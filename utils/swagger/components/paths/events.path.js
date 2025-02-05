const crudEvent = {
  // 이벤트 조회, 삭제, 생성
  "/": {
    get: {
      tags: ["Events"],
      summary: "이벤트 조회",
      description: "이벤트 목록을 조회합니다.",
      parameters: [
        {
          name: "limit",
          in: "query",
          required: false,
          description: "한 화면에 가져올 게시글 개수",
          schema: {
            type: "integer",
          },
        },
        {
          name: "cursor",
          in: "query",
          required: false,
          description: "페이지네이션을 위한 커서",
          schema: {
            type: "integer",
          },
        },
        {
          name: "query",
          in: "query",
          required: false,
          description: "유저가 입력한 검색어",
          schema: {
            type: "string",
          },
        },
        {
          name: "category",
          in: "query",
          required: false,
          description: "유저가 선택한 카테고리",
          schema: {
            type: "array",
            items: {
              type: "string",
            },
            example: ["문화", "교육"],
          },
        },
        {
          name: "location",
          in: "query",
          required: false,
          description: "유저가 선택한 지역 그룹id",
          schema: {
            type: "array",
            items: {
              type: "string",
            },
            example: ["1", "3"],
          },
        },
        {
          name: "price",
          in: "query",
          required: false,
          description: "유저가 선택한 가격 정보",
          schema: {
            type: "string",
            enum: ["전체", "무료", "유료"],
          },
        },
        {
          name: "startDate",
          in: "query",
          required: false,
          description: "유저가 선택한 시작 날짜 (형식: YYYY-MM-DD)",
          schema: {
            type: "string",
            format: "date",
            example: "2023-12-21",
          },
        },
        {
          name: "endDate",
          in: "query",
          required: false,
          description: "유저가 선택한 끝 날짜 (형식: YYYY-MM-DD)",
          schema: {
            type: "string",
            format: "date",
            example: "2023-12-21",
          },
        },
      ],
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetEvents",
              },
            },
          },
        },
        204: {
          description: "해당 이벤트가 존재하지 않습니다.",
        },
        400: {
          description: "쿼리문이 올바르지 않습니다.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InvalidInputError",
              },
            },
          },
        },
      },
    },

    delete: {
      tags: ["Events"],
      summary: "이벤트 삭제",
      description: "이벤트를 삭제합니다.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/DeleteEvents",
            },
          },
        },
      },
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                properties: {
                  message: {
                    type: "string",
                    example: "이벤트 삭제 완료",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "이벤트가 존재하지 않습니다.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NotExistsError",
              },
            },
          },
        },
        403: {
          description: "해당 이벤트를 삭제할 권한이 없습니다.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NotAllowedError",
              },
            },
          },
        },
      },
    },
    post: {
      tags: ["Events"],
      summary: "이벤트 생성",
      description: "이벤트를 새로 생성합니다.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateEvents",
            },
          },
        },
      },
      responses: {
        201: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                properties: {
                  message: {
                    type: "string",
                    example: "새로운 이벤트 저장 완료",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "게시글 제목 또는 내용이 누락되었습니다.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InvalidInputError",
              },
            },
          },
        },
      },
    },
  },

  // 이벤트 상세정보 조회, 수정
  "/:eventId": {
    get: {
      tags: ["Events"],
      summary: "이벤트 상세정보 조회",
      description: "이벤트 상세 정보를 조회합니다.",
      parameters: [
        {
          name: "eventId",
          in: "path",
          required: true,
          description: "조회할 이벤트id",
          schema: {
            type: "integer",
          },
        },
      ],
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetDetailEvents",
              },
            },
          },
        },
        404: {
          description: "이벤트가 존재하지 않습니다.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NotExistsError",
              },
            },
          },
        },
      },
    },
    patch: {
      tags: ["Events"],
      summary: "이벤트 상세정보 수정",
      description: "이벤트 상세정보를 수정합니다.",
      parameters: [
        {
          name: "eventId",
          in: "path",
          required: true,
          description: "수정할 이벤트id",
          schema: {
            type: "integer",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateDetailEvents",
            },
          },
        },
      },
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                properties: {
                  message: {
                    type: "string",
                    example: "이벤트 수정 완료",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "이벤트가 존재하지 않습니다.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NotExistsError",
              },
            },
          },
        },
        403: {
          description: "본인이 작성하지 않은 게시글을 수정할 수 없습니다.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NotAllowedError",
              },
            },
          },
        },
      },
    },
  },
};
const scrapEvent = {
  // 스크랩된 이벤트 조회, 이벤트 스크랩, 스크랩 취소
  "/scrap": {
    get: {
      tags: ["Events"],
      summary: "스크랩된 이벤트 조회",
      description: "스크랩된 이벤트 목록을 조회합니다.",
      parameters: [
        {
          name: "limit",
          in: "query",
          required: false,
          description: "한 화면에 가져올 게시글 개수",
          schema: {
            type: "integer",
          },
        },
        {
          name: "cursor",
          in: "query",
          required: false,
          description: "페이지네이션을 위한 커서",
          schema: {
            type: "integer",
          },
        },
        {
          name: "scrap",
          in: "query",
          required: false,
          description:
            "유저가 본인이 스크랩한 게시물들을 확인하는지에 대한 여부..?", // 아 설명 머라해야대
          schema: {
            type: "boolean",
          },
        },
      ],
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetScrapEvents",
              },
            },
          },
        },
        204: {
          description: "스크랩한 이벤트가 존재하지 않습니다.",
        },
        400: {
          description: "쿼리문이 올바르지 않습니다.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InvalidInputError",
              },
            },
          },
        },
      },
    },
    post: {
      tags: ["Events"],
      summary: "이벤트 스크랩",
      description: "이벤트를 스크랩 합니다.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ScrapEvents",
            },
          },
        },
      },
      responses: {
        201: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                properties: {
                  message: {
                    type: "string",
                    example: "이벤트 스크랩 성공",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "존재하지 않는 이벤트입니다.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NotExistsError",
              },
            },
          },
        },
        409: {
          description: "이미 스크랩된 이벤트입니다.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NotExistsError",
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ["Events"],
      summary: "스크랩 취소",
      description: "스크랩 했던 이벤트를 스크랩 취소합니다.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/DeleteScrapEvents",
            },
          },
        },
      },
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                properties: {
                  message: {
                    type: "string",
                    example: "이벤트 스크랩 취소 성공",
                  },
                },
              },
            },
          },
        },
        404: {
          description:
            "이벤트가 존재하지 않거나, 스크랩되어 있지 않은 이벤트입니다.",
          content: {
            "application/json": {
              schema: {
                properties: {
                  message: {
                    type: "string",
                    enum: [
                      "존재하지 않는 이벤트입니다.",
                      "스크랩 되어 있지 않은 이벤트입니다.",
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
const groups = {
  // 이벤트 카테고리 조회
  "/groups/category": {
    get: {
      tags: ["Events"],
      summary: "이벤트 카테고리 조회",
      description: "이벤트 카테고리를 조회합니다.",
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetEventCategory",
              },
            },
          },
        },
        204: {
          description: "이벤트 카테고리가 존재하지 않습니다.",
        },
      },
    },
  },

  // 이벤트 지역 조회
  "/groups/location": {
    get: {
      tags: ["Events"],
      summary: "이벤트 지역 조회",
      description: "이벤트 지역(그룹)을 조회합니다.",
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GetEventLocation",
              },
            },
          },
        },
        204: {
          description: "이벤트 위치그룹이 존재하지 않습니다.",
        },
      },
    },
  },
};
const report = {
  // 이벤트 신고
  "/report": {
    post: {
      tags: ["Events"],
      summary: "이벤트 신고",
      description: "이벤트를 신고합니다.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/EventReport",
            },
          },
        },
      },
      responses: {
        201: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                properties: {
                  message: {
                    type: "string",
                    example: "해당 이벤트가 신고 처리 되었습니다.",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "신고 사유가 누락되었습니다.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/InvalidInputError",
              },
            },
          },
        },
        403: {
          description: "본인이 작성한 게시글을 신고할 수 없습니다.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NotAllowedError",
              },
            },
          },
        },
        409: {
          description: "이미 신고한 이벤트입니다.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NotExistsError",
              },
            },
          },
        },
      },
    },
  },
};

export default {
  ...crudEvent,
  ...scrapEvent,
  ...groups,
  ...report,
};
