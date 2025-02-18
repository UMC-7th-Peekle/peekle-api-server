import { swaggerFormat } from "../formats.js";

const eventTags = {
  crud: "Events: 조회, 생성, 수정, 삭제",
  scrap: "Events: 스크랩",
  groups: "Events: 카테고리, 지역 조회",
  report: "Events: 신고",
};

const crudEvent = {
  // 이벤트 조회, 삭제, 생성
  "/": {
    get: swaggerFormat({
      tag: eventTags.crud,
      summary: "이벤트 조회",
      description: "이벤트 목록을 조회합니다.",
      params: [
        "events/limit",
        "events/cursor",
        "events/query",
        "events/category",
        "events/location",
        "events/price",
        "events/startDate",
        "events/endDate",
      ],
    }),

    delete: swaggerFormat({
      tag: eventTags.crud,
      summary: "이벤트 삭제",
      description: "이벤트를 삭제합니다.",
      requestBody: "events/deleteEventSchema",
    }),

    post: swaggerFormat({
      tag: eventTags.crud,
      summary: "이벤트 생성",
      description: "이벤트를 새로 생성합니다.",
      requestBody: "events/postEventSchema",
    }),
  },

  // 이벤트 상세정보 조회, 수정
  "/:eventId": {
    get: swaggerFormat({
      tag: eventTags.crud,
      summary: "이벤트 상세정보 조회",
      description: "이벤트 상세 정보를 조회합니다.",
      params: ["events/eventId"],
    }),

    patch: swaggerFormat({
      tag: eventTags.crud,
      summary: "이벤트 상세정보 수정",
      description: "이벤트 상세정보를 수정합니다.",
      params: ["events/eventId"],
      requestBody: "events/patchEventSchema",
    }),
  },
};

const scrapEvent = {
  // 스크랩된 이벤트 조회, 이벤트 스크랩, 스크랩 취소
  "/scrap": {
    get: swaggerFormat({
      tag: eventTags.scrap,
      summary: "스크랩된 이벤트 조회",
      description: "스크랩된 이벤트 목록을 조회합니다.",
      params: ["events/limit", "events/cursor", "events/scrap"],
    }),

    post: swaggerFormat({
      tag: eventTags.scrap,
      summary: "이벤트 스크랩",
      description: "이벤트를 스크랩 합니다.",
      requestBody: "events/scrapEventSchema",
    }),

    delete: swaggerFormat({
      tag: eventTags.scrap,
      summary: "스크랩 취소",
      description: "스크랩 했던 이벤트를 스크랩 취소합니다.",
      requestBody: "events/deleteEventSchema",
    }),
  },
};

const groups = {
  // 이벤트 카테고리 조회
  "/groups/category": {
    get: swaggerFormat({
      tag: eventTags.groups,
      summary: "이벤트 카테고리 조회",
      description: "이벤트 카테고리를 조회합니다.",
    }),
  },

  // 이벤트 지역 조회
  "/groups/location": {
    get: swaggerFormat({
      tag: eventTags.groups,
      summary: "이벤트 지역 조회",
      description: "이벤트 지역(그룹)을 조회합니다.",
    }),
  },
};

const report = {
  // 이벤트 신고
  "/report": {
    post: swaggerFormat({
      tag: eventTags.report,
      summary: "이벤트 신고",
      description: "이벤트를 신고합니다.",
      requestBody: "events/reportEventSchema",
    }),
  },
};

export default {
  ...crudEvent,
  ...scrapEvent,
  ...groups,
  ...report,
};
