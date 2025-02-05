export default {
  "/notices/category/{categoryId}": {
    get: {
      tags: ["Notices"],
      summary: "공지사항 목록 조회",
      description: "카테고리별 공지사항 조회",
      parameters: [
        {
          name: "limit",
          in: "query",
          required: false,
          description: "한 번에 가져올 게시글 수",
          schema: {
            type: "integer",
            example: 5,
          },
        },
        {
          name: "offset",
          in: "query",
          required: false,
          description: "페이지네이션을 위한 오프셋",
          schema: {
            type: "string",
            example: 2,
          },
        },
        {
          name: "categoryId",
          in: "path",
          required: true,
          description: "카테고리 ID",
          schema: {
            type: "integer",
            example: 1,
          },
        },
      ],
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/getNoticesByCategory",
              },
            },
          },
        },
        204: {
          description: "게시글이 존재하지 않는 경우",
        },
      },
    },
    post: {
      tags: ["Notices"],
      summary: "공지사항 생성",
      description: "공지사항 생성",
      parameters: [
        {
          name: "categoryId",
          in: "path",
          required: true,
          description: "카테고리 ID",
          schema: {
            type: "integer",
            example: 1,
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/createNotice",
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
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "새로운 공지 생성 완료",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "입력값이 누락된 경우",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/invalidInputError",
              },
            },
          },
        },
        401: {
          description: "인증이 필요한 경우",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/unauthorizedError",
              },
            },
          },
        },
        403: {
          // TODO: 추가한 403 Forbidden 에러 스키마 적용
          description: "권한이 없는 경우",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/notAllowedError",
              },
            },
          },
        },
      },
    },
  },
  "/notices": {
    get: {
      tags: ["Notices"],
      summary: "공지사항 검색",
      description: "카테고리와 검색어로 공지사항 검색",
      parameters: [
        {
          name: "category",
          in: "query",
          required: true,
          description: "카테고리 이름",
          schema: {
            type: "string",
            example: "공지 카테고리1",
          },
        },
        {
          name: "query",
          in: "query",
          required: true,
          description: "검색어",
          schema: {
            type: "string",
            example: "검색어",
          },
        },
        {
          name: "limit",
          in: "query",
          required: false,
          description: "한 번에 가져올 게시글 수",
          schema: {
            type: "integer",
            example: 3,
          },
        },
        {
          name: "offset",
          in: "query",
          required: false,
          description: "페이지네이션을 위한 오프셋",
          schema: {
            type: "string",
            example: 0,
          },
        },
      ],
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/searchNotices",
              },
            },
          },
        },
        204: {
          description: "게시글이 존재하지 않는 경우",
        },
        400: {
          description: "검색어가 누락된 경우",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/invalidInputError",
              },
            },
          },
        },
      },
    },
  },
  "/notices/{noticeId}": {
    get: {
      tags: ["Notices"],
      summary: "공지사항 세부 내용 조회",
      description: "공지사항 세부 내용 조회",
      parameters: [
        {
          name: "noticeId",
          in: "path",
          required: true,
          description: "공지사항 ID",
          schema: {
            type: "integer",
            example: 29,
          },
        },
      ],
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/getNoticeById",
              },
            },
          },
        },
        404: {
          description: "공지사항 ID에 해당하는 공지사항이 없는 경우",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/notExistError",
              },
            },
          },
        },
      },
    },
    patch: {
      tags: ["Notices"],
      summary: "공지사항 수정",
      description: "공지사항 수정",
      parameters: [
        {
          name: "noticeId",
          in: "path",
          required: true,
          description: "공지사항 ID",
          schema: {
            type: "integer",
            example: 29,
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/updateNotice",
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
                type: "object",
                properties: {
                  resultType: {
                    type: "string",
                    example: "SUCCESS",
                  },
                  success: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "공지사항 수정 성공",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "입력값이 누락된 경우",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/invalidInputError",
              },
            },
          },
        },
        401: {
          description: "인증이 필요한 경우",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/unauthorizedError",
              },
            },
          },
        },
        403: {
          // TODO: 추가한 403 Forbidden 에러 스키마 적용
          description: "권한이 없는 경우",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/notAllowedError",
              },
            },
          },
        },
        404: {
          description: "공지사항 ID에 해당하는 공지사항이 없는 경우",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/notExistError",
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ["Notices"],
      summary: "공지사항 삭제",
      description: "공지사항 삭제",
      parameters: [
        {
          name: "noticeId",
          in: "path",
          required: true,
          description: "공지사항 ID",
          schema: {
            type: "integer",
            example: 29,
          },
        },
      ],
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  resultType: {
                    type: "string",
                    example: "SUCCESS",
                  },
                  success: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "공지사항 삭제 성공",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: "인증이 필요한 경우",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/unauthorizedError",
              },
            },
          },
        },
        403: {
          // TODO: 추가한 403 Forbidden 에러 스키마 적용
          description: "권한이 없는 경우",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/notAllowedError",
              },
            },
          },
        },
        404: {
          description: "공지사항 ID에 해당하는 공지사항이 없는 경우",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/notExistError",
              },
            },
          },
        },
      },
    },
  },
};
