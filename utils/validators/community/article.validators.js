export const postArticleSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      example: "참외 피클 레시피",
    },
    content: {
      type: "string",
      example: "참외 피클 레시피입니다.",
    },
    isAnonymous: {
      type: "boolean",
      example: true,
    },
  },
  required: ["title", "content", "isAnonymous"],
  additionalProperties: false,
};

export const patchArticleSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      example: "참외 피클 레시피(수정)",
    },
    content: {
      type: "string",
      example: "참외로는 피클을 만들지 않습니다.(수정)",
    },
    isAnonymous: {
      type: "boolean",
      example: true,
    },
    existingImageSequence: {
      type: "array",
      items: { type: "number" },
      example: [1, 2, 3],
    },
    newImageSequence: {
      type: "array",
      items: { type: "number" },
      example: [4, 5, 6],
    },
  },
  required: [],
  additionalProperties: false,
};

export const getArticleSchema = {
  type: "object",
  properties: {
    article: {
      type: "object",
      properties: {
        articleId: {
          type: "number",
          example: 1,
        },
        title: {
          type: "string",
          example: "게시글 제목",
        },
        content: {
          type: "string",
          example: "게시글 내용입니다.",
        },
        authorId: {
          type: "number",
          example: 3,
        },
        isAnonymous: {
          type: "boolean",
          example: true,
        },
        communityId: {
          type: "number",
          example: 4,
        },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2025-01-29T20:02:18.677Z",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
          example: "2025-01-29T20:02:18.677Z",
        },
        articleComments: {
          type: "array",
          items: {
            type: "object",
            properties: {
              commentId: {
                type: "number",
                example: 1,
              },
              articleId: {
                type: "number",
                example: 1,
              },
              parentCommentId: {
                type: ["number", "null"],
                example: null,
              },
              status: {
                type: "string",
                example: "active",
              },
              authorId: {
                type: "number",
                example: 4,
              },
              isAnonymous: {
                type: "boolean",
                example: true,
              },
              content: {
                type: "string",
                example: "댓글 내용입니다.",
              },
              createdAt: {
                type: "string",
                format: "date-time",
                example: "2025-01-29T20:02:19.203Z",
              },
              updatedAt: {
                type: "string",
                format: "date-time",
                example: "2025-01-29T20:02:19.203Z",
              },
            },
          },
        },
        articleImages: {
          type: "array",
          items: {
            type: "string",
            example: "http://localhost:3000/uploads/1.jpg",
          },
        },
      },
    },
  },
};

export const createCommunitySchema = {
  type: "object",
  properties: {
    communityName: {
      type: "string",
      example: "피클 레시피 게시판",
    },
  },
  required: ["communityName"],
  additionalProperties: false,
};

export const specificArticlePathSchema = {
  type: "object",
  properties: {
    communityId: {
      type: "number",
      example: 1,
    },
    articleId: {
      type: "number",
      example: 123,
    },
  },
  required: ["communityId", "articleId"],
  additionalProperties: false,
};

export const specificArticleCommentPathSchema = {
  type: "object",
  properties: {
    communityId: {
      type: "number",
      example: 1,
    },
    articleId: {
      type: "number",
      example: 123,
    },
    commentId: {
      type: "number",
      example: 456,
    },
  },
  required: ["communityId", "articleId", "commentId"],
  additionalProperties: false,
};

export const createCommentSchema = {
  type: "object",
  properties: {
    communityId: {
      type: "number",
      example: 1,
    },
    articleId: {
      type: "number",
      example: 123,
    },
    content: {
      type: "string",
      example: "참외 피클 맛있나요?.",
    },
    isAnonymous: {
      type: "boolean",
      example: true,
    },
  },
  required: ["communityId", "articleId", "content", "isAnonymous"],
  additionalProperties: false,
};

export const updateOrReplyCommentSchema = {
  type: "object",
  properties: {
    communityId: {
      type: "number",
      example: 1,
    },
    articleId: {
      type: "number",
      example: 123,
    },
    commentId: {
      type: "number",
      example: 456,
    },
    content: {
      type: "string",
      example: "수정할 내용 || 대댓글 내용",
    },
    isAnonymous: {
      type: "boolean",
      example: true,
    },
  },
  required: ["communityId", "articleId", "commentId", "content", "isAnonymous"],
  additionalProperties: false,
};

export const getCommentSchema = {
  type: "object",
  properties: {
    comment: {
      type: "object",
      properties: {
        commentId: {
          type: "number",
          example: 1,
        },
        articleId: {
          type: "number",
          example: 1,
        },
        parentCommentId: {
          type: ["number", "null"],
          example: null,
        },
        status: {
          type: "string",
          example: "active",
        },
        authorId: {
          type: "number",
          example: 4,
        },
        isAnonymous: {
          type: "boolean",
          example: true,
        },
        content: {
          type: "string",
          example: "댓글 내용입니다.",
        },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2025-01-29T20:02:19.203Z",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
          example: "2025-01-29T20:02:19.203Z",
        },
      },
    },
  },
};

export const reportArticleSchema = {
  type: "object",
  properties: {
    communityId: {
      type: "number",
      example: 1,
    },
    articleId: {
      type: "number",
      example: 123,
    },
    reason: {
      type: "string",
      example: "부적절한 게시글입니다.",
    },
  },
  required: ["communityId", "articleId", "reason"],
  additionalProperties: false,
};

export const reportCommentSchema = {
  type: "object",
  properties: {
    communityId: {
      type: "number",
      example: 1,
    },
    articleId: {
      type: "number",
      example: 123,
    },
    commentId: {
      type: "number",
      example: 456,
    },
    reason: {
      type: "string",
      example: "부적절한 댓글입니다.",
    },
  },
  required: ["communityId", "articleId", "commentId", "reason"],
  additionalProperties: false,
};
