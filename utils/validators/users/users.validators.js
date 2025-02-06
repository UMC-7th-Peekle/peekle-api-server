export const changeNicknameSchema = {
  type: "object",
  properties: {
    nickname: { type: "string", minLength: 2, maxLength: 20, example: "하늘" },
  },
  required: ["nickname"],
  additionalProperties: false,
};

export const targetUserIdSchema = {
  type: "object",
  properties: {
    targetUserId: { type: "integer", example: "1" },
  },
  required: ["targetUserId"],
  additionalProperties: false,
};

export const reportUserSchema = {
  type: "object",
  properties: {
    targetUserId: { type: "integer", example: "1" },
    reason: {
      type: "string",
      minLength: 2,
      example: "그냥 마음에 안드는데요?",
    },
  },
  required: ["targetUserId", "reason"],
  additionalProperties: false,
};
