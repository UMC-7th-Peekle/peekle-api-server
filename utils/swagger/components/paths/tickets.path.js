import { swaggerFormat } from "../formats.js";

// 티켓 조회, 티켓 속 메시지 조회, 티켓 생성, 티켓 상태 수정, 티켓 속 메시지 생성
const ticketTags = {
  ticketTag: "Ticket: 티켓 조회, 생성, 상태 수정",
  ticketMessageTag: "TicketMessage: 티켓 메시지 조회, 생성",
};

const ticketTag = {
  "/": {
    post: swaggerFormat({
      tag: ticketTags.ticketTag,
      summary: "티켓 생성",
      description: "티켓을 생성합니다.",
      requestBody: "tickets/postTicketSchema",
    }),

    get: swaggerFormat({
      tag: ticketTags.ticketTag,
      summary: "티켓 조회",
      description: "티켓을 조회합니다.",
      params: ["tickets/limit", "tickets/cursor"],
    }),
  },

  "/:ticketId": {
    patch: swaggerFormat({
      tag: ticketTags.ticketTag,
      summary: "티켓 상태 수정",
      description: "티켓 상태를 수정합니다.",
      requestBody: "tickets/patchTicketSchema",
      params: ["tickets/ticketId"],
    }),
  },
};

// 티켓 메시지 관련 (생성, 조회)
const ticketMessageTag = {
  "/message": {
    post: swaggerFormat({
      tag: ticketTags.ticketMessageTag,
      summary: "티켓 메시지 생성",
      description: "티켓 메시지를 새로 생성합니다.",
      requestBody: "tickets/postTicketMessageSchema",
    }),
  },

  "/:ticketId": {
    get: swaggerFormat({
      tag: ticketTags.ticketMessageTag,
      summary: "티켓 메시지 조회",
      description: "ticketId에 해당하는 티켓 메시지를 조회합니다.",
      params: ["tickets/limit", "tickets/cursor", "tickets/ticketId"],
    }),
  },
};

export default {
  ...ticketTag,
  ...ticketMessageTag,
};
