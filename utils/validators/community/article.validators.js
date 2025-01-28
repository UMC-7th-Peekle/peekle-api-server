export const postArticleSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    content: { type: "string" },
    isAnonymous: { type: "boolean" },
  },
  required: ["title", "content", "isAnonymous"],
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

export const createCommunitySchema = {
  type: "object",
  properties: {
    communityName: { type: "string" },
  },
  required: ["communityName"],
  additionalProperties: false,
};

export const specificArticlePathSchema = {
  type: "object",
  properties: {
    communityId: { type: "number" },
    articleId: { type: "number" },
  },
  required: ["communityId", "articleId"],
  additionalProperties: false,
};

export const specificArticleCommentPathSchema = {
  type: "object",
  properties: {
    communityId: { type: "number" },
    articleId: { type: "number" },
    commentId: { type: "number" },
  },
  required: ["communityId", "articleId", "commentId"],
  additionalProperties: false,
};

export const createCommentSchema = {
  type: "object",
  properties: {
    communityId: { type: "number" },
    articleId: { type: "number" },
    content: { type: "string" },
    isAnonymous: { type: "boolean" },
  },
  required: ["communityId", "articleId", "content", "isAnonymous"],
  additionalProperties: false,
};

export const rudCommentSchema = {
  type: "object",
  properties: {
    communityId: { type: "number" },
    articleId: { type: "number" },
    commentId: { type: "number" },
    content: { type: "string" },
    isAnonymous: { type: "boolean" },
  },
  required: ["communityId", "articleId", "commentId", "content", "isAnonymous"],
  additionalProperties: false,
};
