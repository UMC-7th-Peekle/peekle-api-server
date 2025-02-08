// 티켓 목록 조회 검증 스키마 (필터링을 위한 조건 추가 가능)
export const getTicketSchema = {
  type: "object",
  properties: {
    ticketId: { type: "number" },
    title: { type: "string" },
    status: {
      type: "string",
      enum: ["open", "closed", "in_progress"],
    },
    createdUserId: { type: "number" },
  },
  required: ["ticketId", "title", "status", "createdUserId"],
  additionalProperties: false,
};

// 특정 티켓 상세 조회 검증 스키마
export const getDetailTicketSchema = {
  type: "object",
  properties: {
    ticketId: { type: "number" },
    title: { type: "string" },
    status: { type: "string" },
    createdUserId: { type: "number" },
    ticketMessages: {
      type: "array",
      items: {
        type: "object",
        properties: {
          ticketMessageId: { type: "number" },
          title: { type: "string" },
          content: { type: "string" },
          createdUserId: { type: "number" },
          ticketMessageImages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                imageUrl: { type: "string" },
                sequence: { type: "number" },
              },
              additionalProperties: false,
            },
          },
        },
        required: ["ticketMessageId", "title", "content", "createdUserId"],
        additionalProperties: false,
      },
    },
  },
  required: ["ticketId", "title", "status", "createdUserId", "ticketMessages"],
  additionalProperties: false,
};

// 티켓 생성 검증 스키마
export const postTicketSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    status: {
      type: "string",
      enum: ["open", "closed", "in_progress"],
    },
  },
  required: ["title", "status"],
  additionalProperties: false,
};

// 티켓 상태 수정 검증 스키마
export const patchTicketSchema = {
  type: "object",
  properties: {
    status: { type: "string", enum: ["open", "closed", "in_progress"] },
  },
  required: ["status"],
  additionalProperties: false,
};

// 티켓 삭제 검증 스키마
export const deleteTicketSchema = {
  type: "object",
  properties: {
    ticketId: { type: "number" },
  },
  required: ["ticketId"],
  additionalProperties: false,
};

// 티켓 메시지 생성 검증 스키마
export const postTicketMessageSchema = {
  type: "object",
  properties: {
    ticketId: { type: "number" },
    title: { type: "string" },
    content: { type: "string" },
    ticketImages: {
      type: "array",
      items: {
        type: "object",
        properties: {
          imageUrl: {
            type: "string",
          },
          sequence: { type: "number" },
        },
      },
      required: ["imageUrl", "sequence"],
      nullable: true,
    },
  },
  required: ["ticketId", "title", "content"],
  additionalProperties: false,
};
