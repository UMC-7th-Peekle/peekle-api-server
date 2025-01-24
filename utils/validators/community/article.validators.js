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
    isAnonymous: { type: "boolean" },
    existingImageSequence: { type: "array", items: { type: "number" } },
    newImageSequence: { type: "array", items: { type: "number" } },
  },
  required: [],
  additionalProperties: false,
};
