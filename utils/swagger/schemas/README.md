swagger 파일에서 schema를 직접적으로 입력하지 않기 위해 사용하는 폴더입니다.
schema 폴더 안에 있는 schema들을 `swagger.js`에서 import 하여 사용합니다.

```js
const RegisterUserSchema = {
  type: "object",
  properties: {
    user_register_type: {
      type: "string",
      enum: ["local", "kakao"],
      description: "The type of user registration",
    },
    name: {
      type: "string",
      description: "The name of the user",
    },
    nickname: {
      type: "string",
      description: "The nickname of the user",
    },
    birthdate: {
      type: "string",
      format: "date",
      description: "The birthdate of the user",
    },
    phone_number: {
      type: "string",
      description: "The phone number of the user",
    },
    phone_number_verification_id: {
      type: "string",
      description: "The phone number verification ID",
    },
    email: {
      type: "string",
      format: "email",
      description: "The email of the user",
    },
    email_verification_id: {
      type: "string",
      description: "The email verification ID",
    },
    profile_image: {
      type: "string",
      format: "binary",
      description: "The profile image of the user",
    },
    password: {
      type: "string",
      description: "The password of the user",
    },
    terms: {
      type: "array",
      items: {
        type: "object",
        properties: {
          term_id: { type: "integer" },
          agreed: { type: "boolean" },
        },
        required: ["term_id", "agreed"],
      },
    },
  },
  required: [
    "userRegisterType",
    "name",
    "nickname",
    "birthdate",
    "phoneNumber",
    "phoneNumberVerificationId",
    "email",
    "emailVerificationId",
    "password",
    "terms",
  ],
};

const CreateTestUserSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "테스트 유저 이름",
    },
    email: {
      type: "string",
      format: "email",
      description: "테스트 유저 이메일, 중복되면 안됩니다.",
    },
    phone_number: {
      type: "string",
      description: "테스트 유저 전화번호, 중복되면 안됩니다.",
    },
  },
  required: ["name", "email", "phone_number"],
};

const LoginUserSchema = {
  type: "object",
  properties: {
    login_id: { type: "string", description: "로그인 아이디" },
    password: { type: "string", description: "비밀번호" },
  },
  required: ["loginId", "password"],
};

module.exports = {
  RegisterUserSchema,
  CreateTestUserSchema,
  LoginUserSchema,
};
```