const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const { InvalidInputError } = require("../../errors");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const accessTokenSchema = {
  type: "object",
  properties: {
    user_id: { type: "string" },
    name: { type: "string" },
    nickname: { type: "string" },
  },
  required: ["user_id", "name", "nickname"],
  additionalProperties: false,
};

const refreshTokenSchema = {
  type: "object",
  properties: {
    user_id: { type: "string" },
  },
  required: ["user_id"],
  additionalProperties: false,
};

const accessToken = ajv.compile(accessTokenSchema);
const refreshToken = ajv.compile(refreshTokenSchema);

module.exports = {
  accessToken,
  refreshToken,
};
