export const postTicketSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
  },
  required: ["title"],
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
// export const deleteTicketSchema = {
//   type: "object",
//   properties: {
//     ticketId: { type: "number" },
//   },
//   required: ["ticketId"],
//   additionalProperties: false,
// };

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
