export const errorSchemas = {
  CustomError: {
    type: "object",
    properties: {
      reason: { type: "string" },
      name: { type: "string" },
      errorCode: { type: "string" },
      statusCode: { type: "integer" },
      data: { type: "object" },
    },
  },
  SampleError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "SAMPLE_ERROR" },
          statusCode: { example: 500 },
        },
      },
    ],
  },
  InvalidInputError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "INVALID_INPUT" },
          statusCode: { example: 400 },
        },
      },
    ],
  },
  AlreadyExistsError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "ALREADY_EXISTS" },
          statusCode: { example: 409 },
        },
      },
    ],
  },
  NotExistsError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "NOT_EXISTS" },
          statusCode: { example: 404 },
        },
      },
    ],
  },
  NotAllowedError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "NOT_ALLOWED" },
          statusCode: { example: 403 },
        },
      },
    ],
  },
  UnauthorizedError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "UNAUTHORIZED" },
          statusCode: { example: 401 },
        },
      },
    ],
  },
  TokenError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "CHECK_JWT_TOKEN" },
          statusCode: { example: 401 },
        },
      },
    ],
  },
  AjvError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "AJV_INVALID_INPUT" },
          statusCode: { example: 400 },
        },
      },
    ],
  },
  UnknownError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "UNKNOWN_ERROR" },
          statusCode: { example: 500 },
        },
      },
    ],
  },
  TimeOutError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "SESSION_TIMEOUT" },
          statusCode: { example: 400 },
        },
      },
    ],
  },
  TooManyRequest: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "TOO_MANY_ATTEMPTS" },
          statusCode: { example: 429 },
        },
      },
    ],
  },
  InvalidCodeError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "INVALID_CODE" },
          statusCode: { example: 400 },
        },
      },
    ],
  },
  CipherError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "CIPHER_ERROR" },
          statusCode: { example: 503 },
        },
      },
    ],
  },
  MulterError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "MULTER_ERROR" },
          statusCode: { example: 503 },
        },
      },
    ],
  },
  RestrictedUserError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "USER_RESTRICTED" },
          statusCode: { example: 403 },
        },
      },
    ],
  },
  UserStatusError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "DORMANT_OR_TERMINATED" },
          statusCode: { example: 403 },
        },
      },
    ],
  },
  NotVerifiedError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "NOT_VERIFIED" },
          statusCode: { example: 401 },
        },
      },
    ],
  },
  InvalidQueryError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "INVALID_QUERY" },
          statusCode: { example: 400 },
        },
      },
    ],
  },
  InvalidContentTypeError: {
    allOf: [
      { $ref: "#/components/schemas/CustomError" },
      {
        properties: {
          errorCode: { example: "INVALID_CONTENT_TYPE" },
          statusCode: { example: 415 },
        },
      },
    ],
  },
  Errors: {
    oneOf: [
      { $ref: "#/components/schemas/SampleError" },
      { $ref: "#/components/schemas/InvalidInputError" },
      { $ref: "#/components/schemas/AlreadyExistsError" },
      { $ref: "#/components/schemas/NotExistsError" },
      { $ref: "#/components/schemas/NotAllowedError" },
      { $ref: "#/components/schemas/UnauthorizedError" },
      { $ref: "#/components/schemas/TokenError" },
      { $ref: "#/components/schemas/AjvError" },
      { $ref: "#/components/schemas/UnknownError" },
      { $ref: "#/components/schemas/TimeOutError" },
      { $ref: "#/components/schemas/TooManyRequest" },
      { $ref: "#/components/schemas/InvalidCodeError" },
      { $ref: "#/components/schemas/CipherError" },
      { $ref: "#/components/schemas/MulterError" },
      { $ref: "#/components/schemas/RestrictedUserError" },
      { $ref: "#/components/schemas/UserStatusError" },
      { $ref: "#/components/schemas/NotVerifiedError" },
      { $ref: "#/components/schemas/InvalidQueryError" },
      { $ref: "#/components/schemas/InvalidContentTypeError" },
    ],
  },
};
