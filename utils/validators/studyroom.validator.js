const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true }); // ajv instance
addFormats(ajv);

// after uploading image
const studyroomCreateSchema = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 1, maxLength: 40 },
    subtitle: { type: "string", minLength: 1, maxLength: 40 },
    area_id: { type: "string" },
    goal: { type: "string", minLength: 1 },
    goal_url: { type: "string", format: "uri" },
    todos: {
      type: "array",
    },
    profile_image: { type: "string" },
  },
  required: [
    "title",
    "subtitle",
    "area_id",
    "goal",
    // "goal_url",
    // "todos",
    // "profile_image",
  ],
  // additionalProperties: true,
  additionalProperties: false,
};

// const studyroomUpdateSchema = {}

const createStudyroom = ajv.compile(studyroomCreateSchema);
// const updateStudyroom = ajv.compile(studyroomUpdateSchema);

module.exports = {
  createStudyroom,
  // updateStudyroom,
};
