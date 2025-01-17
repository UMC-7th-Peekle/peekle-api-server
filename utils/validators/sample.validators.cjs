const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

/*
  현재 비밀번호는 8자 이상, 숫자와 특수문자를 최소 하나 포함해야 합니다.
  약관 동의는 최소 1개 이상이어야 합니다.
  OAuth 로그인은 kakao만 지원합니다.
*/
const userRegisterSchema = {
  type: "object",
  properties: {
    register_type: { type: "string", enum: ["oauth", "local"] },
    oauth_type: { type: "string", enum: ["kakao"] },
    // OAuth 로그인 메소드가 추가되면 이부분이 수정되어야 합니다.
    oauth_id: { type: "string" },
    name: { type: "string" },
    nickname: { type: "string" },
    birthdate: { type: "string", format: "date" },
    phone_verification_session_id: { type: "string" },
    email: { type: "string", format: "email" },
    password: {
      type: "string",
      minLength: 8,
      pattern: "^(?=.*[0-9])(?=.*[!@#$%^&*]).+$", // 숫자와 특수문자 최소 하나 포함
    },
    terms: {
      type: "array",
      items: {
        type: "object",
        properties: {
          term_id: { type: "integer" },
          is_agreed: { type: "boolean" },
        },
        required: ["term_id", "is_agreed"],
        additionalProperties: false,
      },
      minItems: 1,
    },
  },
  required: [
    "register_type",
    "name",
    "nickname",
    "birthdate",
    "phone_verification_session_id",
    "email",
  ],
  additionalProperties: false,
  allOf: [
    {
      if: {
        properties: { register_type: { const: "oauth" } },
      },
      then: {
        required: ["oauth_type", "oauth_id", "terms"],
        properties: {
          oauth_type: { type: "string", enum: ["kakao"] },
          oauth_id: { type: "string" },
          terms: {
            type: "array",
            items: {
              type: "object",
              properties: {
                term_id: { type: "integer" },
                is_agreed: { type: "boolean" },
              },
              required: ["term_id", "is_agreed"],
              additionalProperties: false,
            },
            minItems: 1,
          },
        },
      },
    },
    {
      if: {
        properties: { register_type: { const: "local" } },
      },
      then: {
        required: ["password", "terms"],
        properties: {
          password: {
            type: "string",
            minLength: 8,
            pattern: "^(?=.*[0-9])(?=.*[!@#$%^&*]).+$", // 숫자와 특수문자 최소 하나 포함
          },
        },
      },
    },
  ],
};

const loginInputSchema = {
  type: "object",
  properties: {
    login_id: { type: "string", pattern: "^0[0-9]{9,10}$" },
    password: { type: "string" },
  },
  required: ["login_id", "password"],
  additionalProperties: false,
};

const resetPasswordSchema = {
  type: "object",
  properties: {
    phone_verification_session_id: { type: "string" },
    new_password: {
      type: "string",
      minLength: 8,
      pattern: "^(?=.*[0-9])(?=.*[!@#$%^&*]).+$", // 숫자와 특수문자 최소 하나 포함
    },
  },
  required: ["phone_verification_session_id", "new_password"],
  additionalProperties: false,
};

const changePasswordSchema = {
  type: "object",
  properties: {
    phone_verification_session_id: { type: "string" },
    old_password: {
      type: "string",
      minLength: 8,
      pattern: "^(?=.*[0-9])(?=.*[!@#$%^&*]).+$", // 숫자와 특수문자 최소 하나 포함
    },
    new_password: {
      type: "string",
      minLength: 8,
      pattern: "^(?=.*[0-9])(?=.*[!@#$%^&*]).+$", // 숫자와 특수문자 최소 하나 포함
    },
  },
  required: ["phone_verification_session_id", "old_password", "new_password"],
  additionalProperties: false,
};

const userRegister = ajv.compile(userRegisterSchema);
const userLogin = ajv.compile(loginInputSchema);
const resetPassword = ajv.compile(resetPasswordSchema);
const changePassword = ajv.compile(changePasswordSchema);

module.exports = {
  userRegister,
  userLogin,
  resetPassword,
  changePassword,
};
