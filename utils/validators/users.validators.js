const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const { InvalidInputError } = require("../../errors");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const editUserInfoSchema = {
  type: "object",
  properties: {
    type: { type: "string" },
    content: { type: "string" },
  },
  required: ["type", "content"],
  additionalProperties: false,
};

const validateEditUserInfoSchemaService = (data) => {
  const validateEditUserInfoSchema = ajv.compile(editUserInfoSchema);
  const valid = validateEditUserInfoSchema(data);
  if (!valid) {
    throw new InvalidInputError({
      errors: validateEditUserInfoSchema.errors,
      message: "입력값이 올바르지 않습니다.",
    });
  }
  return {
    isValid: true,
    errors: null,
  };
};

module.exports = {
  validateEditUserInfoSchemaService,
};
