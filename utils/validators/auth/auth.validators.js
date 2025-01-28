export const localRegisterSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    nickname: { type: "string" },
    birthdate: { type: "string", format: "date" },
    gender: { type: "string", enum: ["male", "female"] },
    email: { type: "string", format: "email" },
    phone: { type: "string", pattern: "^[0-9]{10,11}$" },
    phoneVerificationSessionId: { type: "string" },
    terms: {
      type: "array",
      items: {
        type: "object",
        properties: {
          termId: { type: "integer" },
          isAgreed: { type: "boolean" },
        },
        required: ["termId", "isAgreed"],
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
    oauthId: { type: "integer" },
    oauthType: { type: "string", enum: ["kakao", "google", "facebook"] },
    name: { type: "string" },
    nickname: { type: "string" },
    birthdate: { type: "string", format: "date" },
    gender: { type: "string", enum: ["male", "female"] },
    email: { type: "string", format: "email" },
    phone: { type: "string", pattern: "^[0-9]{10,11}$" },
    phoneVerificationSessionId: { type: "string" },
    terms: {
      type: "array",
      items: {
        type: "object",
        properties: {
          termId: { type: "integer" },
          isAgreed: { type: "boolean" },
        },
        required: ["termId", "isAgreed"],
      },
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
    phone: { type: "string", pattern: "^[0-9]{10,11}$" },
    phoneVerificationSessionId: { type: "string" },
    phoneVerificationCode: { type: "string", pattern: "^[0-9]{4}$" },
  },
  required: ["phone", "phoneVerificationSessionId", "phoneVerificationCode"],
  additionalProperties: false,
};

export const sendTokenToPhoneSchema = {
  type: "object",
  properties: {
    phone: { type: "string", pattern: "^[0-9]{10,11}$" },
  },
  required: ["phone"],
  additionalProperties: false,
};
