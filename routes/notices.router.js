import e, { Router } from "express";
import * as readController from "../controllers/notices/read.notices.controller.js";
import * as cudController from "../controllers/notices/cud.notices.controller.js";
import * as authMiddleware from "../middleware/authenticate.jwt.js";
import * as fileUploadMiddleware from "../middleware/uploader.js"; // 사진 업로드 미들웨어
import { getNoticesByCategory } from "../services/notices/read.notices.service.js";
import { updateNotice } from "../services/notices/cud.notices.service.js";

const router = Router();

// 공지사항 조회
router.get("/category/:categoryId", readController.getNoticesByCategory);
router.get("/", readController.searchNotices);
router.get("/:noticeId", readController.getNoticeById);

// 공지사항 생성
router.post(
  "/category/:categoryId",
  authMiddleware.authenticateAccessToken,
  fileUploadMiddleware.localStorage({
    restrictions: fileUploadMiddleware.restrictions("notice"),
    field: [{ name: "notice_images", maxCount: 5 }],
    destination: "uploads/notices",
  }),
  cudController.createNotice
);

// 공지사항 수정
router.patch(
  "/:noticeId",
  authMiddleware.authenticateAccessToken,
  fileUploadMiddleware.localStorage({
    restrictions: fileUploadMiddleware.restrictions("notice"),
    field: [{ name: "notice_images", maxCount: 5 }],
    destination: "uploads/notices",
  }),
  cudController.updateNotice
);

// 공지사항 삭제
router.delete(
  "/:noticeId",
  authMiddleware.authenticateAccessToken,
  cudController.deleteNotice
);

export const noticesSwaggerSchema = {
  unauthorizedError: {
    type: "object",
    properties: {
      resultType: {
        type: "string",
        example: "FAIL",
      },
      error: {
        type: "object",
        properties: {
          errorCode: {
            type: "string",
            example: "UNAUTHORIZED",
          },
          reason: {
            type: "string",
            example: "Authorization 헤더가 제공되지 않았습니다.",
          },
          data: {
            type: "object",
            example: null,
          },
        },
      },
      success: {
        type: "object",
        example: null,
      },
    },
  },
  notExistError: {
    type: "object",
    properties: {
      resultType: {
        type: "string",
        example: "FAIL",
      },
      error: {
        type: "object",
        properties: {
          errorCode: {
            type: "string",
            example: "NOT_EXISTS",
          },
          reason: {
            type: "string",
            example: "존재하지 않는 공지사항입니다.",
          },
          data: {
            type: "object",
            example: null,
          },
        },
      },
      success: {
        type: "object",
        example: null,
      },
    },
  },
  // TODO: 403 Forbidden 에러 스키마 추가
  notAllowedError: {
    type: "object",
    properties: {
      resultType: {
        type: "string",
        example: "FAIL",
      },
      error: {
        type: "object",
        properties: {
          errorCode: {
            type: "string",
            example: "NOT_ALLOWED",
          },
          reason: {
            type: "string",
            enum: [
              "본인이 작성하지 않은 게시글을 수정할 수 없습니다.",
              "본인이 작성하지 않은 게시글을 삭제할 수 없습니다.",
            ],
          },
          data: {
            type: "object",
            example: null,
          },
        },
      },
      success: {
        type: "object",
        example: null,
      },
    },
  },

  // 400 에러
  invalidInputError: {
    type: "object",
    properties: {
      resultType: {
        type: "string",
        example: "FAIL",
      },
      error: {
        type: "object",
        properties: {
          errorCode: {
            type: "string",
            example: "INVALID_INPUT",
          },
          reason: {
            type: "string",
            enum: [
              "공지사항 제목 또는 내용이 누락되었습니다.",
              "검색어가 누락되었습니다.",
            ],
          },
          data: {
            type: "object",
            example: null,
          },
        },
      },
      success: {
        type: "object",
        example: null,
      },
    },
  },

  getNoticesByCategory: {
    type: "object",
    properties: {
      resultType: {
        type: "string",
        example: "SUCCESS",
      },
      error: {
        type: ["string", "null"],
        example: null,
      },
      success: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "카테고리별 공지사항 조회 성공",
          },
          articles: {
            type: "array",
            items: {
              type: "object",
              properties: {
                noticeId: {
                  type: "number",
                  example: 51,
                },
                categoryId: {
                  type: "number",
                  example: 1,
                },
                title: {
                  type: "string",
                  example: "공지사항 제목",
                },
                content: {
                  type: "string",
                  example: "공지사항 내용",
                },
                isNotice: {
                  type: "boolean",
                  example: true,
                },
                createdAt: {
                  type: "string",
                  format: "date-time",
                  example: "2025-01-29T20:02:18.677Z",
                },
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  example: "2025-01-29T20:02:18.677Z",
                },
              },
            },
          },
          totalCount: {
            type: "number",
            example: 16,
          },
          currentPage: {
            type: "number",
            example: 1,
          },
          totalPages: {
            type: "number",
            example: 4,
          },
        },
      },
    },
  },
  searchNotices: {
    type: "object",
    properties: {
      resultType: {
        type: "string",
        example: "SUCCESS",
      },
      error: {
        type: ["string", "null"],
        example: null,
      },
      success: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "공지사항 검색 성공",
          },
          articles: {
            type: "array",
            items: {
              type: "object",
              properties: {
                noticeId: {
                  type: "number",
                  example: 51,
                },
                categoryId: {
                  type: "number",
                  example: 1,
                },
                title: {
                  type: "string",
                  example: "검색된 공지사항 제목",
                },
                content: {
                  type: "string",
                  example: "검색된 공지사항 내용",
                },
                isNotice: {
                  type: "boolean",
                  example: true,
                },
                createdAt: {
                  type: "string",
                  format: "date-time",
                  example: "2025-01-29T20:02:18.677Z",
                },
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  example: "2025-01-29T20:02:18.677Z",
                },
              },
            },
          },
          totalCount: {
            type: "number",
            example: 16,
          },
          currentPage: {
            type: "number",
            example: 1,
          },
          totalPages: {
            type: "number",
            example: 4,
          },
        },
      },
    },
  },
  getNoticeById: {
    type: "object",
    properties: {
      resultType: {
        type: "string",
        example: "SUCCESS",
      },
      error: {
        type: ["string", "null"],
        example: null,
      },
      success: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "공지사항 세부 내용 조회 성공",
          },
          article: {
            type: "object",
            properties: {
              noticeId: {
                type: "number",
                example: 51,
              },
              categoryId: {
                type: "number",
                example: 1,
              },
              title: {
                type: "string",
                example: "공지사항 제목",
              },
              content: {
                type: "string",
                example: "공지사항 내용",
              },
              isNotice: {
                type: "boolean",
                example: true,
              },
              createdAt: {
                type: "string",
                format: "date-time",
                example: "2025-01-29T20:02:18.677Z",
              },
              updatedAt: {
                type: "string",
                format: "date-time",
                example: "2025-01-29T20:02:18.677Z",
              },
              noticesImages: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    imageUrl: {
                      type: "string",
                      example: "https://example.com/image.jpg",
                    },
                    sequence: {
                      type: "number",
                      example: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  createNotice: {
    properties: {
      data: {
        type: "object",
        properties: {
          title: {
            type: "string",
            example: "새 공지사항 제목",
          },
          content: {
            type: "string",
            example: "새 공지사항 내용",
          },
          isNotice: {
            type: "boolean",
            example: true,
          },
        },
      },
      noticesImages: {
        type: "array",
        items: {
          type: "object",
          properties: {
            imageUrl: {
              type: "string",
              example: "https://example.com/notice1.jpg",
            },
          },
        },
      },
    },
  },
  updateNotice: {
    properties: {
      data: {
        type: "object",
        properties: {
          title: {
            type: "string",
            example: "새 공지사항 제목",
          },
          content: {
            type: "string",
            example: "새 공지사항 내용",
          },
          isNotice: {
            type: "boolean",
            example: true,
          },
          existingImageSequence: {
            type: "array",
            items: {
              type: "number",
              example: 1,
            },
          },
          newImageSequence: {
            type: "array",
            items: {
              type: "number",
              example: 2,
            },
          },
        },
      },
      noticesImages: {
        type: "array",
        items: {
          type: "object",
          properties: {
            imageUrl: {
              type: "string",
              example: "https://example.com/notice1.jpg",
            },
          },
        },
      },
    },
  },
};
// ------------------------------------------------------------------------------------------------
export const noticesSwagger = {
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

export default router;
