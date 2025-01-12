const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const sendVerificationEmailSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
  },
  required: ["email"],
  additionalProperties: false,
};

const verifyEmailSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    code: { type: "string" },
  },
  required: ["id", "code"],
  additionalProperties: false,
};

const validateSendVerificationEmail = ajv.compile(sendVerificationEmailSchema);
const validateVerifyEmail = ajv.compile(verifyEmailSchema);

module.exports = {
  validateSendVerificationEmail,
  validateVerifyEmail,
};
