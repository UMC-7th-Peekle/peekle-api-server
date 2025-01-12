const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const { InvalidInputError } = require("../../errors");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const inquiryAnswerInputSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      minLength: 1,
      maxLength: 255,
    },
    content: {
      type: "string",
      minLength: 1,
    },
    image_url: {
      type: "string",
      format: "uri",
      nullable: true,
    },
    admin_id: {
      type: "integer",
      minimum: 0,
    }, // TODO
  },
  required: ["title", "content", "admin_id"],
  additionalProperties: false,
};

const validateInquiryAnswerInput = (data) => {
  const validate = ajv.compile(inquiryAnswerInputSchema);
  const valid = validate(data);

  if (!valid) {
    throw new InvalidInputError({
      errors: validate.errors,
      message: "입력값이 올바르지 않습니다.",
    });
  }

  return {
    isValid: true,
    errors: null,
  };
};

module.exports = {
  validateInquiryAnswerInput,
};
