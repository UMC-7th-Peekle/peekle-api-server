import { request, Router } from "express";
import * as authMiddleware from "../middleware/authenticate.jwt.js";
import * as scrapEventController from "../controllers/events/scrap.events.controller.js";
import * as reportEventController from "../controllers/events/report.events.controller.js";
import * as detailEventController from "../controllers/events/detail.events.controller.js";
import * as listEventController from "../controllers/events/list.events.controller.js";
import * as createEventController from "../controllers/events/create.events.controller.js";
import * as groupController from "../controllers/events/groups.events.controller.js";
import * as fileUploadMiddleware from "../middleware/uploader.js"; // 사진 업로드 미들웨어
import * as eventValidator from "../utils/validators/events/events.validators.js";

import {
  validateContentType,
  validateRequestBody,
} from "../middleware/validate.js";

const router = Router();

// 이벤트 조회
router.get("/", listEventController.listEvent);

// 이벤트 삭제
router.delete(
  "/",
  authMiddleware.authenticateAccessToken,
  detailEventController.deleteEvent
);

// 스크랩된 이벤트 조회
router.get(
  "/scrap",
  authMiddleware.authenticateAccessToken,
  scrapEventController.listScrap
);

// 이벤트 상세정보 조회
router.get("/:eventId", detailEventController.detailEvent);

// 이벤트 수정
router.patch(
  "/:eventId",
  validateContentType,
  authMiddleware.authenticateAccessToken,
  fileUploadMiddleware.localStorage({
    restrictions: fileUploadMiddleware.restrictions("event"),
    field: [{ name: "event_images", maxCount: 5 }],
    destination: "uploads/events",
  }),
  validateRequestBody(eventValidator.patchEventSchema, true),
  detailEventController.updateEvent
);

// 이벤트 생성
router.post(
  "/",
  validateContentType,
  authMiddleware.authenticateAccessToken,
  fileUploadMiddleware.localStorage({
    restrictions: fileUploadMiddleware.restrictions("event"),
    field: [{ name: "event_images", maxCount: 5 }],
    destination: "uploads/events",
  }),
  validateRequestBody(eventValidator.postEventSchema, true),
  createEventController.createEvent
);

// 이벤트 카테고리 조회
router.get("/groups/category", groupController.eventCategory); // 이벤트 카테고리 조회
router.get("/groups/location", groupController.eventLocation); // 이벤트 지역 조회

// 특정 이벤트 스크랩
router.post(
  "/scrap",
  validateRequestBody(eventValidator.scrapEventSchema),
  authMiddleware.authenticateAccessToken,
  scrapEventController.newScrap
);

// 특정 이벤트를 스크랩 취소
router.delete(
  "/scrap",
  validateRequestBody(eventValidator.scrapEventSchema),
  authMiddleware.authenticateAccessToken,
  scrapEventController.deleteScrap
);

// 이벤트 신고하기
router.post(
  "/report",
  validateRequestBody(eventValidator.reportEventSchema),
  authMiddleware.authenticateAccessToken,
  reportEventController.newReport
);

export const eventSwaggerSchema = {
  // GetEvents, DeleteEvents, CreateEvents, GetScrapEvents, ScrapEvents, DeleteScrapEvents,
  // GetDetailEvents, GetEventCategory, GetEventLocation, EventReport
  GetEvents: {
    type: "object",
    properties: {
      events: {
        type: "array",
        items: {
          type: "object",
          properties: {
            eventId: { type: "integer" },
            title: { type: "string" },
            content: { type: "string" },
            price: { type: "integer" },
            location: { type: "string" },
            locationGroupId: { type: "integer" },
            eventUrl: { type: "string" },
            applicationStart: {
              type: "string",
              format: "date-time",
              example: "2025-01-30T00:00:00.000Z",
            },
            applicationEnd: {
              type: "string",
              format: "date-time",
              example: "2025-01-30T00:00:00.000Z",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-01-30T00:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-01-30T00:00:00.000Z",
            },
            category: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
              },
            },
            eventImages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  imageUrl: {
                    type: "string",
                    example: "https://peekle.com/image.jpg",
                  },
                  sequence: { type: "integer" },
                },
              },
            },
            eventSchedules: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  repeatType: {
                    type: "string",
                    enum: [
                      "none",
                      "daily",
                      "weekly",
                      "monthly",
                      "yearly",
                      "custom",
                    ],
                  },
                  repeatEndDate: {
                    type: "string",
                    format: "date",
                    example: "2025-12-31",
                  },
                  isAllDay: {
                    type: "boolean",
                  },
                  customText: {
                    type: "string",
                    example: "매주 화요일마다 반복",
                  },
                  startDate: {
                    type: "string",
                    format: "date",
                    example: "2025-12-31",
                  },
                  endDate: {
                    type: "string",
                    format: "date",
                    example: "2025-12-31",
                  },
                  startTime: {
                    type: "string",
                    format: "time",
                    example: "10:45:46",
                  },
                  endTime: {
                    type: "string",
                    format: "time",
                    example: "10:45:46",
                  },
                },
              },
            },
          },
        },
      },
      nextCursor: { type: "integer", nullable: true },
      hasNextPage: { type: "boolean", example: true },
    },
  },

  DeleteEvents: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "이벤트 삭제 완료",
      },
      eventId: { type: "integer" },
    },
  },

  CreateEvents: {
    type: "object",
    properties: {
      title: { type: "string" },
      content: { type: "string" },
      price: { type: "integer" },
      categoryId: { type: "integer" },
      location: { type: "string" },
      eventUrl: {
        type: "string",
        example: "https://peekle.com/",
      },
      applicationStart: {
        type: "string",
        format: "date-time",
        example: "2025-01-10T00:00:00Z",
      },
      applicationEnd: {
        type: "string",
        format: "date-time",
        example: "2025-01-20T00:00:00Z",
      },
      schedules: {
        type: "array",
        items: {
          type: "object",
          properties: {
            repeatType: {
              type: "string",
              enum: ["none", "daily", "weekly", "monthly", "yearly", "custom"],
            },
            repeatEndDate: {
              type: "string",
              format: "date",
              example: "2025-12-31",
            },
            isAllDay: {
              type: "boolean",
            },
            customText: {
              type: "string",
              example: "매일",
            },
            startDate: {
              type: "string",
              format: "date",
              example: "2025-12-31",
            },
            endDate: {
              type: "string",
              format: "date",
              example: "2025-12-31",
            },
            startTime: {
              type: "string",
              format: "time",
              example: "10:45:46",
            },
            endTime: {
              type: "string",
              format: "time",
              example: "10:45:46",
            },
          },
        },
      },
      imagePaths: {
        type: "array",
        items: {
          type: "string",
          example: "https://peekle.com/image.jpg",
        },
      },
    },
    required: [
      // 이것들은 반드시 요청에 포함하기
      "title",
      "content",
      "categoryId",
      "location",
      "applicationStart",
      "applicationEnd",
    ],
  },

  GetScrapEvents: {
    type: "object",
    properties: {
      events: {
        type: "array",
        items: {
          type: "object",
          properties: {
            eventScrapId: { type: "integer" },
            eventId: { type: "integer" },
            title: { type: "string" },
            content: { type: "string" },
            price: { type: "integer" },
            location: { type: "string" },
            locationGroupId: { type: "integer" },
            eventUrl: {
              type: "string",
              example: "https://peekle.com/",
            },
            applicationStart: {
              type: "string",
              format: "date-time",
              example: "2025-01-10T00:00:00Z",
            },
            applicationEnd: {
              type: "string",
              format: "date-time",
              example: "2025-01-20T00:00:00Z",
            },
            category: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
              },
            },
            eventImages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  imageUrl: {
                    type: "string",
                    example: "https://peekle.com/image.jpg",
                  },
                  sequence: { type: "integer" },
                },
              },
            },
            eventSchedules: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  repeatType: {
                    type: "string",
                    enum: [
                      "none",
                      "daily",
                      "weekly",
                      "monthly",
                      "yearly",
                      "custom",
                    ],
                  },
                  repeatEndDate: {
                    type: "string",
                    format: "date",
                    example: "2025-12-31",
                  },
                  isAllDay: {
                    type: "boolean",
                  },
                  customText: {
                    type: "string",
                    example: "매주 화요일마다 반복",
                  },
                  startDate: {
                    type: "string",
                    format: "date",
                    example: "2025-12-31",
                  },
                  endDate: {
                    type: "string",
                    format: "date",
                    example: "2025-12-31",
                  },
                  startTime: {
                    type: "string",
                    format: "time",
                    example: "10:45:46",
                  },
                  endTime: {
                    type: "string",
                    format: "time",
                    example: "10:45:46",
                  },
                },
              },
            },
          },
        },
      },
      nextCursor: { type: "integer", nullable: true },
      hasNextPage: { type: "boolean", example: true },
    },
  },

  ScrapEvents: {
    type: "object",
    properties: {
      eventId: { type: "integer" },
      message: {
        type: "string",
        example: "이벤트 스크랩 성공",
      },
    },
    required: ["eventId"],
  },

  DeleteScrapEvents: {
    type: "object",
    properties: {
      eventId: { type: "integer" },
      message: {
        type: "string",
        example: "이벤트 스크랩 취소 성공",
      },
    },
    required: ["eventId"],
  },

  GetDetailEvents: {
    type: "object",
    properties: {
      event: {
        type: "array",
        items: {
          type: "object",
          properties: {
            eventId: { type: "integer" },
            title: { type: "string" },
            content: { type: "string" },
            price: { type: "integer" },
            location: { type: "string" },
            locationGroupId: { type: "integer" },
            eventUrl: { type: "string" },
            applicationStart: {
              type: "string",
              format: "date-time",
              example: "2025-01-30T00:00:00.000Z",
            },
            applicationEnd: {
              type: "string",
              format: "date-time",
              example: "2025-01-30T00:00:00.000Z",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-01-30T00:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-01-30T00:00:00.000Z",
            },
            category: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
              },
            },
            eventImages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  imageUrl: {
                    type: "string",
                    example: "https://peekle.com/image.jpg",
                  },
                  sequence: { type: "integer" },
                },
              },
            },
            eventSchedules: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  repeatType: {
                    type: "string",
                    enum: [
                      "none",
                      "daily",
                      "weekly",
                      "monthly",
                      "yearly",
                      "custom",
                    ],
                  },
                  repeatEndDate: {
                    type: "string",
                    format: "date",
                    example: "2025-12-31",
                  },
                  isAllDay: {
                    type: "boolean",
                  },
                  customText: {
                    type: "string",
                    example: "매주 화요일마다 반복",
                  },
                  startDate: {
                    type: "string",
                    format: "date",
                    example: "2025-12-31",
                  },
                  endDate: {
                    type: "string",
                    format: "date",
                    example: "2025-12-31",
                  },
                  startTime: {
                    type: "string",
                    format: "time",
                    example: "10:45:46",
                  },
                  endTime: {
                    type: "string",
                    format: "time",
                    example: "10:45:46",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  UpdateDetailEvents: {
    type: "object",
    properties: {
      title: { type: "string" },
      content: { type: "string" },
      price: { type: "integer" },
      location: { type: "string" },
      locationGroupId: { type: "integer" },
      eventUrl: { type: "string" },
      applicationStart: {
        type: "string",
        format: "date-time",
        example: "2025-01-30T00:00:00.000Z",
      },
      applicationEnd: {
        type: "string",
        format: "date-time",
        example: "2025-01-30T00:00:00.000Z",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        example: "2025-01-30T00:00:00.000Z",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        example: "2025-01-30T00:00:00.000Z",
      },
      category: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
        },
      },
      imagePaths: {
        type: "array",
        items: {
          type: "string",
          example: "https://peekle.com/image.jpg",
        },
      },
      existingImageSequence: {
        type: "array",
        items: { type: "integer" },
        example: [1, -1, 2],
        description: "기존 이미지 순서 (삭제는 -1)",
      },
      newImageSequence: {
        type: "array",
        items: { type: "integer" },
        example: [3, 4],
        description: "새로 추가된 이미지 순서",
      },
      message: {
        type: "string",
        example: "이벤트 수정 완료",
      },
    },
    required: [
      "title",
      "content",
      "category",
      "locationGroupId",
      "startDate",
      "endDate",
    ],
  },

  GetEventCategory: {
    type: "object",
    properties: {
      categories: {
        type: "array",
        items: {
          type: "object",
          properties: {
            categoryId: { type: "integer" },
            name: { type: "string" },
            description: { type: "string" },
          },
        },
      },
    },
  },

  GetEventLocation: {
    type: "object",
    properties: {
      locations: {
        type: "array",
        items: {
          type: "object",
          properties: {
            groupId: { type: "integer" },
            name: { type: "string" },
          },
        },
      },
    },
  },

  EventReport: {
    type: "object",
    properties: {
      eventId: { type: "integer" },
      reason: {
        type: "string",
        description: "신고 사유",
      },
    },
    required: ["eventId", "reason"],
  },

  // 400 에러
  InvalidInputError: {
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
              "게시글 제목 또는 내용이 누락되었습니다.",
              "쿼리문이 올바르지 않습니다.",
              "신고 사유가 누락되었습니다.",
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

  // 404 에러
  NotExistsError: {
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
            example: "존재하지 않는 이벤트입니다.",
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

  // 403 에러
  NotAllowedError: {
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
            example: "해당 권한이 없습니다.",
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

  // 409
  NotExistsError: {
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
            example: "ALREADY_EXISTS",
          },
          reason: {
            type: "string",
            enum: [
              "이미 존재하는 이벤트입니다.",
              "이미 스크랩된 이벤트입니다.",
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
};
// ----------------------------------------------------------------------
export const eventSwagger = {
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

export default router;
