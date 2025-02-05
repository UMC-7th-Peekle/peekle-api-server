const community = {
  "/community": {
    post: {
      tags: ["Community/Admin"],
      summary: "게시판 생성",
      description: "게시판을 생성합니다.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/createCommunity",
            },
          },
        },
      },
      responses: {
        201: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "게시판 생성 성공",
                  },
                },
              },
            },
          },
        },
        409: {
          description: "게시판 이름이 중복된 경우",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "이미 존재하는 게시판 이름입니다.",
                  },
                },
              },
            },
          },
        },
      },
    },
    get: {
      tags: ["Community/Articles"],
      summary: "커뮤니티 게시글 목록 조회",
      description:
        "커뮤니티 ID를 통해 해당 커뮤니티의 게시글 목록을 조회합니다.",
      parameters: [
        {
          name: "limit",
          in: "query",
          required: false,
          description: "한 번에 가져올 게시글 수",
          schema: {
            type: "integer",
          },
        },
        {
          name: "cursor",
          in: "query",
          required: false,
          description: "페이지네이션을 위한 커서",
          schema: {
            type: "string",
          },
        },
        {
          name: "query",
          in: "query",
          required: false,
          description: "검색어",
          schema: {
            type: "string",
          },
        },
        {
          name: "communityId",
          in: "query",
          required: true,
          description: "커뮤니티 ID",
          schema: {
            type: "integer",
          },
        },
      ],
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  resultType: {
                    type: "string",
                    example: "SUCCESS",
                  },
                  error: {
                    type: ["string", "null"],
                    example: null,
                  },
                  success: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "게시글 목록 조회 성공",
                      },
                      articles: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            articleId: {
                              type: "number",
                              example: 769,
                            },
                            title: {
                              type: "string",
                              example: "1-769 제목",
                            },
                            content: {
                              type: "string",
                              example: "1-769 내용 | 피클이 최고!",
                            },
                            isAnonymous: {
                              type: "boolean",
                              example: true,
                            },
                            communityId: {
                              type: "number",
                              example: 1,
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
                              type: "number",
                              example: 49,
                            },
                            articleLikes: {
                              type: "number",
                              example: 1,
                            },
                            thumbnail: {
                              type: ["string", "null"],
                              example: null,
                            },
                            authorInfo: {
                              type: "object",
                              properties: {
                                nickname: {
                                  type: "string",
                                  example: "레일",
                                },
                                profileImage: {
                                  type: "string",
                                  format: "uri",
                                  example:
                                    "http://localhost:7777/uploads/default/peekle_default_profile_image.png",
                                },
                                authorId: {
                                  type: "number",
                                  example: 4,
                                },
                              },
                            },
                          },
                        },
                      },
                      nextCursor: {
                        type: "number",
                        example: 747,
                      },
                      hasNextPage: {
                        type: "boolean",
                        example: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        204: {
          description: "게시글이 존재하지 않는 경우",
        },
        400: {
          description: "형식에 맞지 않는 입력이 들어온 경우",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "검색어는 공백을 제외하고 2자 이상이여야 합니다.",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "커뮤니티 ID에 해당하는 게시판이 존재하지 않는 경우",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "존재하지 않는 게시판입니다.",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const article = {
  "/community/{communityId}/articles/{articleId}": {
    get: {
      tags: ["Community/Articles"],
      summary: "게시글 조회",
      description: "게시글 ID를 통해 해당 게시글을 조회합니다.",
      parameters: [
        {
          name: "communityId",
          in: "path",
          required: true,
          description: "커뮤니티 ID",
          schema: {
            type: "integer",
          },
        },
        {
          name: "articleId",
          in: "path",
          required: true,
          description: "게시글 ID",
          schema: {
            type: "integer",
          },
        },
      ],
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                message: {
                  type: "string",
                  example: "게시글 조회 성공",
                },
                $ref: "#/components/schemas/getArticle",
              },
            },
          },
        },
        400: {
          description: "실패",
        },
        404: {
          description: "게시글 ID에 해당하는 게시글이 존재하지 않습니다.",
        },
      },
    },
    patch: {
      tags: ["Community/Articles"],
      summary: "게시글 수정",
      description: "게시글 ID에 해당하는 게시글을 수정합니다.",
      parameters: [
        {
          name: "communityId",
          in: "path",
          required: true,
          description: "커뮤니티 ID",
          schema: {
            type: "integer",
          },
        },
        {
          name: "articleId",
          in: "path",
          required: true,
          description: "게시글 ID",
          schema: {
            type: "integer",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/patchArticle",
            },
          },
        },
      },
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                properties: {
                  message: {
                    type: "string",
                    example: "게시글 수정 성공",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "게시글 제목이나 내용이 누락된 경우",
        },
        401: {
          description: "사용자 인증 정보가 제공되지 않은 경우",
        },
        403: {
          description: "게시글 작성자가 아닌 경우.",
        },
      },
    },
  },
  "/community/{communityId}/articles": {
    post: {
      tags: ["Community/Articles"],
      summary: "게시글 작성",
      description: "커뮤니티 ID에 해당하는 게시판에 게시글을 작성합니다.",
      parameters: [
        {
          name: "communityId",
          in: "path",
          required: true,
          description: "커뮤니티 ID",
          schema: {
            type: "integer",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/postArticle",
            },
          },
        },
      },
      responses: {
        201: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                properties: {
                  message: {
                    type: "string",
                    example: "게시글 작성 성공",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "사용자 인증 정보가 제공되지 않은 경우",
        },
        404: {
          description: "커뮤니티 ID에 해당하는 게시판이 존재하지 않습니다.",
        },
      },
    },
  },
  "/community/articles": {
    delete: {
      tags: ["Community/Articles"],
      summary: "게시글 삭제",
      description: "게시글 ID에 해당하는 게시글을 삭제합니다.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/specificArticlePath",
            },
          },
        },
      },
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                properties: {
                  message: {
                    type: "string",
                    example: "게시글 삭제 성공",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "사용자 인증 정보가 제공되지 않은 경우",
        },
        403: {
          description: "게시글 작성자가 아닌 경우.",
        },
      },
    },
  },
};

const comments = {
  "/community/articles/comments": {
    get: {
      tags: ["Community/Article/Comments"],
      summary: "댓글 조회",
      description: "게시글 ID에 해당하는 게시글의 댓글을 조회합니다.",
      parameters: [
        {
          name: "communityId",
          in: "query",
          required: true,
          description: "커뮤니티 ID",
          schema: {
            type: "integer",
          },
        },
        {
          name: "articleId",
          in: "query",
          required: true,
          description: "게시글 ID",
          schema: {
            type: "integer",
          },
        },
      ],
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                properties: {
                  message: {
                    type: "string",
                    example: "댓글 조회 성공",
                  },
                  comments: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/getComment",
                    },
                  },
                },
              },
            },
          },
        },
        204: {
          description: "댓글이 존재하지 않음",
        },
        404: {
          description: "댓글 ID에 해당하는 댓글이 존재하지 않음",
        },
      },
    },
    post: {
      tags: ["Community/Article/Comments"],
      summary: "댓글 작성",
      description: "게시글 ID에 해당하는 게시글에 댓글을 작성합니다.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/createComment",
            },
          },
        },
      },
      responses: {
        201: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                properties: {
                  message: {
                    type: "string",
                    example: "댓글 작성 성공",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "사용자 인증 정보가 제공되지 않은 경우",
        },
        404: {
          description: "게시글 ID에 해당하는 게시글이 존재하지 않음",
        },
      },
    },
    patch: {
      tags: ["Community/Article/Comments"],
      summary: "댓글 수정",
      description: "댓글 ID에 해당하는 댓글을 수정합니다.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/updateOrReplyComment",
            },
          },
        },
      },
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                properties: {
                  message: {
                    type: "string",
                    example: "댓글 수정 성공",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "사용자 인증 정보가 제공되지 않은 경우",
        },
        403: {
          description: "댓글 작성자가 아닌 경우",
        },
        404: {
          description: "댓글 ID에 해당하는 댓글이 존재하지 않음",
        },
      },
    },
    delete: {
      tags: ["Community/Article/Comments"],
      summary: "댓글 삭제",
      description: "댓글 ID에 해당하는 댓글을 삭제합니다.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/specificArticleCommentPath",
            },
          },
        },
      },
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                properties: {
                  message: {
                    type: "string",
                    example: "댓글 삭제 성공",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "사용자 인증 정보가 제공되지 않은 경우",
        },
        403: {
          description: "댓글 작성자가 아닌 경우",
        },
        404: {
          description: "댓글 ID에 해당하는 댓글이 존재하지 않음",
        },
      },
    },
  },
  "/community/articles/comments/reply": {
    post: {
      tags: ["Community/Article/Comments"],
      summary: "대댓글 작성",
      description: "댓글 ID에 해당하는 댓글에 대댓글을 작성합니다.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/updateOrReplyComment",
            },
          },
        },
      },
      responses: {
        201: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                properties: {
                  message: {
                    type: "string",
                    example: "대댓글 작성 성공",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "사용자 인증 정보가 제공되지 않은 경우",
        },
        404: {
          description: "댓글 ID에 해당하는 댓글이 존재하지 않음",
        },
      },
    },
  },
};

const like = {
  "/community/article/like": {
    get: {
      tags: ["Community/Articles"],
      summary: "좋아요 누른 게시글 목록 조회",
      description: "사용자가 좋아요를 누른 게시글 목록을 조회합니다.",
      parameters: [
        {
          name: "limit",
          in: "query",
          required: false,
          description: "한 번에 가져올 게시글 수",
          schema: {
            type: "integer",
          },
        },
        {
          name: "cursor",
          in: "query",
          required: false,
          description: "페이지네이션을 위한 커서",
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  resultType: {
                    type: "string",
                    example: "SUCCESS",
                  },
                  error: {
                    type: ["string", "null"],
                    example: null,
                  },
                  success: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "좋아요한 게시글 목록 조회 성공",
                      },
                      articles: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            articleId: {
                              type: "number",
                              example: 35,
                            },
                            title: {
                              type: "string",
                              example: "2-35 제목",
                            },
                            content: {
                              type: "string",
                              example: "2-35 내용 | 피클이 최고!",
                            },
                            authorId: {
                              type: "number",
                              example: 4,
                            },
                            isAnonymous: {
                              type: "boolean",
                              example: true,
                            },
                            communityId: {
                              type: "number",
                              example: 2,
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
                              type: "number",
                              example: 52,
                            },
                            articleLikes: {
                              type: "number",
                              example: 1,
                            },
                            thumbnail: {
                              type: ["string", "null"],
                              example: null,
                            },
                          },
                        },
                      },
                      nextCursor: {
                        type: "number",
                        example: 30,
                      },
                      hasNextPage: {
                        type: "boolean",
                        example: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        204: {
          description: "좋아요한 게시글이 존재하지 않음",
        },
        400: {
          description: "실패",
        },
      },
    },
  },
  "/community/articles/like": {
    post: {
      tags: ["Community/Likes"],
      summary: "게시글 좋아요",
      description: "게시글에 좋아요를 누릅니다.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/specificArticlePath",
            },
          },
        },
      },
      responses: {
        201: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                properties: {
                  message: {
                    type: "string",
                    example: "게시글 좋아요 성공",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "사용자 인증 정보가 제공되지 않은 경우",
        },
        404: {
          description: "게시글 ID에 해당하는 게시글이 존재하지 않음",
        },
        409: {
          description: "이미 좋아요를 누른 경우",
        },
      },
    },
    delete: {
      tags: ["Community/Likes"],
      summary: "게시글 좋아요 취소",
      description: "게시글에 좋아요를 취소합니다.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/specificArticlePath",
            },
          },
        },
      },
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                properties: {
                  message: {
                    type: "string",
                    example: "게시글 좋아요 취소 성공",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "사용자 인증 정보가 제공되지 않은 경우",
        },
        404: {
          description: "게시글 ID에 해당하는 게시글이 존재하지 않음",
        },
        409: {
          description: "이미 좋아요를 취소한 경우",
        },
      },
    },
  },
  "/community/articles/comments/like": {
    post: {
      tags: ["Community/Likes"],
      summary: "댓글 좋아요",
      description: "댓글에 좋아요를 누릅니다.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/specificArticleCommentPath",
            },
          },
        },
      },
      responses: {
        201: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                properties: {
                  message: {
                    type: "string",
                    example: "댓글 좋아요 성공",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "사용자 인증 정보가 제공되지 않은 경우",
        },
        404: {
          description: "댓글 ID에 해당하는 댓글이 존재하지 않음",
        },
        409: {
          description: "이미 좋아요를 누른 경우",
        },
      },
    },
    delete: {
      tags: ["Community/Likes"],
      summary: "댓글 좋아요 취소",
      description: "댓글에 좋아요를 취소합니다.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/specificArticleCommentPath",
            },
          },
        },
      },
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                properties: {
                  message: {
                    type: "string",
                    example: "댓글 좋아요 취소 성공",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "사용자 인증 정보가 제공되지 않은 경우",
        },
        404: {
          description: "댓글 ID에 해당하는 댓글이 존재하지 않음",
        },
        409: {
          description: "이미 좋아요를 취소한 경우",
        },
      },
    },
  },
};

const reports = {
  "/community/articles/report": {
    post: {
      tags: ["Community/Report"],
      summary: "게시글 신고",
      description: "게시글을 신고합니다.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/reportArticle",
            },
          },
        },
      },
      responses: {
        201: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                properties: {
                  message: {
                    type: "string",
                    example: "게시글 신고 성공",
                  },
                  articleReport: {
                    type: "object",
                    properties: {
                      targetId: {
                        type: "integer",
                        example: 1,
                      },
                      reportedUserId: {
                        type: "integer",
                        example: 2,
                      },
                      reason: {
                        type: "string",
                        example: "욕설",
                      },
                      type: {
                        type: "string",
                        example: "article",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "신고 사유가 누락된 경우",
        },
        401: {
          description: "사용자 인증 정보가 제공되지 않은 경우",
        },
        403: {
          description: "게시글 작성자가 신고자인 경우",
        },
        404: {
          description: "게시글 ID에 해당하는 게시글이 존재하지 않음",
        },
        409: {
          description: "이미 신고 처리가 된 경우",
        },
      },
    },
  },
  "/community/articles/comments/report": {
    post: {
      tags: ["Community/Report"],
      summary: "댓글 신고",
      description: "댓글을 신고합니다.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/reportComment",
            },
          },
        },
      },
      responses: {
        201: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                properties: {
                  message: {
                    type: "string",
                    example: "댓글 신고 성공",
                  },
                  articleReport: {
                    type: "object",
                    properties: {
                      targetId: {
                        type: "integer",
                        example: 1,
                      },
                      reportedUserId: {
                        type: "integer",
                        example: 2,
                      },
                      reason: {
                        type: "string",
                        example: "욕설",
                      },
                      type: {
                        type: "string",
                        example: "comment",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "신고 사유가 누락된 경우",
        },
        401: {
          description: "사용자 인증 정보가 제공되지 않은 경우",
        },
        403: {
          description: "댓글 작성자가 신고자인 경우",
        },
        404: {
          description: "댓글 ID에 해당하는 댓글이 존재하지 않음",
        },
        409: {
          description: "이미 신고 처리가 된 경우",
        },
      },
    },
  },
};

const stats = {
  "/community/{communityId}/articles/popular": {
    get: {
      tags: ["Community/Statistics"],
      summary: "인기글 조회",
      description: "커뮤니티 ID에 해당하는 게시판의 인기글을 조회합니다.",
      parameters: [
        {
          name: "communityId",
          in: "path",
          required: true,
          description: "커뮤니티 ID",
          schema: {
            type: "integer",
          },
        },
        {
          name: "startTime",
          in: "query",
          required: true,
          description: "조회 시작 시간",
          schema: {
            type: "string",
          },
        },
        {
          name: "endTime",
          in: "query",
          required: true,
          description: "조회 종료 시간",
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "성공",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  resultType: {
                    type: "string",
                    example: "SUCCESS",
                  },
                  error: {
                    type: ["string", "null"],
                    example: null,
                  },
                  success: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "인기 게시글 조회 성공",
                      },
                      articles: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            articleId: {
                              type: "number",
                              example: 683,
                            },
                            title: {
                              type: "string",
                              example: "1-683 제목",
                            },
                            content: {
                              type: "string",
                              example: "1-683 내용 | 댓글도 맛있어라 얍",
                            },
                            authorId: {
                              type: "number",
                              example: 1,
                            },
                            isAnonymous: {
                              type: "boolean",
                              example: true,
                            },
                            communityId: {
                              type: "number",
                              example: 1,
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
                            likeCount: {
                              type: "number",
                              example: 1,
                            },
                            commentCount: {
                              type: "number",
                              example: 100,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        204: {
          description: "해당 시간대에 인기글이 존재하지 않음",
        },
        400: {
          description: "실패",
        },
      },
    },
  },
};

export default {
  ...community,
  ...article,
  ...comments,
  ...like,
  ...reports,
  ...stats,
};
