const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const { InvalidInputError } = require("../../errors");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const contestInputSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    subtitle: { type: "string" },
    description: { type: "string" },
    host: { type: "string" },
    location: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["Point"] },
        coordinates: {
          type: "array",
          items: { type: "number" },
          minItems: 2,
          maxItems: 2,
        },
      },
      required: ["type", "coordinates"],
    },
    online_offline_type: {
      type: "string",
      enum: ["online", "offline", "hybrid"],
    },
    application_start_date: { type: "string", format: "date-time" },
    application_end_date: { type: "string", format: "date-time" },
    start_date: { type: "string", format: "date-time" },
    end_date: { type: "string", format: "date-time" },
  },
  required: [
    "title",
    "subtitle",
    "description",
    "host",
    "location",
    "online_offline_type",
    "application_start_date",
    "application_end_date",
    "start_date",
    "end_date",
  ],
  additionalProperties: false,
};

const validateContestInput = (data) => {
  const { image_url, ...validationData } = data;

  const validate = ajv.compile(contestInputSchema);
  const valid = validate(validationData);

  if (!valid) {
    throw new InvalidInputError({
      errors: validate.errors,
      message: "입력값이 올바르지 않습니다.",
    });
  }

  return true;
};

module.exports = {
  validateContestInput,
};
