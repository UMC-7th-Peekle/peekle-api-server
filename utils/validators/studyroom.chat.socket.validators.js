const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const { InvalidInputError } = require("../../errors");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const userEnter = (data) => {
  const onlyStudyroomIdSchema = {
    type: "object",
    properties: {
      studyroom_id: { type: "string" },
    },
    required: ["studyroom_id"],
    additionalProperties: false,
  };

  const validateonlyStudyroomIdSchema = ajv.compile(onlyStudyroomIdSchema);
  const valid = validateonlyStudyroomIdSchema(data);
  if (!valid) {
    throw new InvalidInputError({
      errors: validateonlyStudyroomIdSchema.errors,
      message: "입력값이 올바르지 않습니다.",
    });
  }
  return {
    isValid: true,
    errors: null,
  };
};

const message = (data) => {
  const studyroomIdAndContentSchema = {
    type: "object",
    properties: {
      studyroom_id: { type: "string" },
      type: { type: "string", enum: ["text", "image"] },
      content: { type: "string" },
    },
    required: ["studyroom_id", "content", "type"],
    additionalProperties: false,
  };

  const validateStudyroomIdAndContentSchema = ajv.compile(
    studyroomIdAndContentSchema
  );
  const valid = validateStudyroomIdAndContentSchema(data);
  if (!valid) {
    throw new InvalidInputError({
      errors: validateStudyroomIdAndContentSchema.errors,
      message: "입력값이 올바르지 않습니다.",
    });
  }
  return {
    isValid: true,
    errors: null,
  };
};

module.exports = {
  userEnter,
  message,
};
