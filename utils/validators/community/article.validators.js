export const postArticleSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    content: { type: "string" },
    isAnonymous: { type: "boolean" },
  },
  required: ["title", "content"],
  additionalProperties: false,
};

export const patchArticleSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    content: { type: "string" },
  },
  required: [],
  additionalProperties: false,
};
