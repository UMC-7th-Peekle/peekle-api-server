export const changeNicknameSchema = {
  type: "object",
  properties: {
    nickname: { type: "string", minLength: 2, maxLength: 20 },
  },
  required: ["nickname"],
  additionalProperties: false,
};

export const targetUserIdSchema = {
  type: "object",
  properties: {
    targetUserId: { type: "integer" },
  },
  required: ["targetUserId"],
  additionalProperties: false,
};

export const reportUserSchema = {
  type: "object",
  properties: {
    targetUserId: { type: "integer" },
    reason: { type: "string", minLength: 2 },
  },
  required: ["targetUserId", "reason"],
  additionalProperties: false,
};
