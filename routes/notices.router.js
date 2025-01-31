import e, { Router } from "express";
import * as readController from "../controllers/notices/read.notices.controller.js";
import * as cudController from "../controllers/notices/cud.notices.controller.js";
import * as authMiddleware from "../middleware/authenticate.jwt.js";
import * as fileUploadMiddleware from "../middleware/uploader.js"; // 사진 업로드 미들웨어
import { getNoticesByCategory } from "../services/notices/read.notices.service.js";

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
};

export const noticesSwagger = {
  "/notices/category/{categoryId}": {
    get: {
      tags: ["Notices - 공지사항 조회"],
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
  },
  "/notices": {
    get: {
      tags: ["Notices - 공지사항 조회"],
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
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "검색어가 누락되었습니다.",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/notices/{noticeId}": {
    get: {
      tags: ["Notices - 공지사항 조회"],
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
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "해당 공지사항이 존재하지 않습니다.",
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

export default router;
