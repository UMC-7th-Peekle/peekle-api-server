export const localRegisterSchema = {
  type: "object",
  properties: {
    type: "object",
    properties: {
      name: { type: "string", example: "박경운" },
      nickname: { type: "string", example: "하늘" },
      birthdate: { type: "string", format: "date", example: "2001-12-09" },
      gender: { type: "string", enum: ["male", "female"], example: "male" },
      email: { type: "string", format: "email", example: "user@example.com" },
      phone: {
        type: "string",
        pattern: "^[0-9]{10,11}$",
        example: "01012345678",
      },
      phoneVerificationSessionId: {
        type: "string",
        example: "encrypted session ID",
      },
      terms: {
        type: "array",
        items: {
          type: "object",
          properties: {
            termId: { type: "integer", example: 1 },
            isAgreed: { type: "boolean", example: true },
          },
          required: ["termId", "isAgreed"],
        },
        example: [
          { termId: 1, isAgreed: true },
          { termId: 2, isAgreed: false },
        ],
      },
    },
  },
  required: [
    "name",
    "nickname",
    "birthdate",
    "gender",
    "email",
    "phone",
    "phoneVerificationSessionId",
    "terms",
  ],
  additionalProperties: false,
};

export const oauthRegisterSchema = {
  type: "object",
  properties: {
    oauthId: { type: "integer", example: 12345 },
    oauthType: {
      type: "string",
      enum: ["kakao", "google", "facebook"],
      example: "kakao",
    },
    name: { type: "string", example: "박경운" },
    nickname: { type: "string", example: "하늘" },
    birthdate: { type: "string", format: "date", example: "2001-12-09" },
    gender: { type: "string", enum: ["male", "female"], example: "male" },
    email: { type: "string", format: "email", example: "user@example.com" },
    phone: {
      type: "string",
      pattern: "^[0-9]{10,11}$",
      example: "01012345678",
    },
    phoneVerificationSessionId: {
      type: "string",
      example: "encrypted session ID",
    },
    terms: {
      type: "array",
      items: {
        type: "object",
        properties: {
          termId: { type: "integer", example: 1 },
          isAgreed: { type: "boolean", example: true },
        },
        required: ["termId", "isAgreed"],
      },
      example: [
        { termId: 3, isAgreed: true },
        { termId: 4, isAgreed: true },
      ],
    },
  },
  required: [
    "oauthId",
    "oauthType",
    "name",
    "nickname",
    "birthdate",
    "gender",
    "email",
    "phone",
    "phoneVerificationSessionId",
    "terms",
  ],
  additionalProperties: false,
};

export const phoneVerifySchema = {
  type: "object",
  properties: {
    phone: {
      type: "string",
      pattern: "^[0-9]{10,11}$",
      example: "01012345678",
    },
    phoneVerificationSessionId: {
      type: "string",
      example: "encrypted session ID",
    },
    phoneVerificationCode: {
      type: "string",
      pattern: "^[0-9]{4}$",
      example: "0000",
    },
  },
  required: ["phone", "phoneVerificationSessionId", "phoneVerificationCode"],
  additionalProperties: false,
};

export const sendTokenToPhoneSchema = {
  type: "object",
  properties: {
    phone: {
      type: "string",
      pattern: "^[0-9]{10,11}$",
      example: "01012345678",
    },
  },
  required: ["phone"],
  additionalProperties: false,
};
