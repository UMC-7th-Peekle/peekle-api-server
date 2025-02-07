import { swaggerFormat } from "../formats.js";

const communityTags = {
  adminTag: "Community: 게시판 관리",
  communityTag: "Community: 게시글",
  commentTag: "Community: 댓글",
  likeTag: "Community: 좋아요",
  reportTag: "Community: 신고",
  statsTag: "Community: 통계",
};

const community = {
  "/community": {
    post: swaggerFormat({
      tag: communityTags.adminTag,
      summary: "게시판 생성",
      description: "게시판을 생성합니다.",
      requestBody: "community/getArticleSchema",
    }),
    get: swaggerFormat({
      tag: communityTags.communityTag,
      summary: "게시판 조회",
      description: "게시판을 조회합니다.",
      params: [
        "community/limit",
        "community/cursor",
        "community/query",
        "community/communityId",
      ],
    }),
  },
};

const article = {
  "/community/{communityId}/articles/{articleId}": {
    get: swaggerFormat({
      tag: communityTags.communityTag,
      summary: "게시글 조회",
      description: "게시글 ID에 해당하는 게시글을 조회합니다.",
      params: ["community/communityId", "community/articleId"],
    }),
    patch: swaggerFormat({
      tag: communityTags.communityTag,
      summary: "게시글 수정",
      description: "게시글 ID에 해당하는 게시글을 수정합니다.",
      requestBody: "community/patchArticle",
      params: ["community/communityId", "community/articleId"],
    }),
  },
  "/community/{communityId}/articles": {
    post: swaggerFormat({
      tag: communityTags.communityTag,
      summary: "게시글 작성",
      description: "커뮤니티 ID에 해당하는 게시판에 게시글을 작성합니다.",
      requestBody: "community/postArticle",
      params: ["community/communityId"],
    }),
  },
  "/community/articles": {
    delete: swaggerFormat({
      tag: communityTags.communityTag,
      summary: "게시글 삭제",
      description: "게시글 ID에 해당하는 게시글을 삭제합니다.",
      requestBody: "community/specificArticlePath",
    }),
  },
};

const comments = {
  "/community/articles/comments": {
    get: swaggerFormat({
      tag: communityTags.commentTag,
      summary: "댓글 조회",
      description: "게시글 ID에 해당하는 게시글의 댓글을 조회합니다.",
      params: ["community/communityId", "community/articleId"],
    }),
    post: swaggerFormat({
      tag: communityTags.commentTag,
      summary: "댓글 작성",
      description: "게시글 ID에 해당하는 게시글에 댓글을 작성합니다.",
      requestBody: "community/createComment",
    }),
    patch: swaggerFormat({
      tag: communityTags.commentTag,
      summary: "댓글 수정",
      description: "댓글 ID에 해당하는 댓글을 수정합니다.",
      requestBody: "community/updateOrReplyComment",
    }),
    delete: swaggerFormat({
      tag: communityTags.commentTag,
      summary: "댓글 삭제",
      description: "댓글 ID에 해당하는 댓글을 삭제합니다.",
      requestBody: "community/specificArticleCommentPath",
    }),
  },
  "/community/articles/comments/reply": {
    post: swaggerFormat({
      tag: communityTags.commentTag,
      summary: "대댓글 작성",
      description: "댓글 ID에 해당하는 댓글에 대댓글을 작성합니다.",
      requestBody: "community/updateOrReplyComment",
    }),
  },
};

const like = {
  "/community/article/like": {
    get: swaggerFormat({
      tag: communityTags.likeTag,
      summary: "좋아요 누른 게시글 목록 조회",
      description: "사용자가 좋아요를 누른 게시글 목록을 조회합니다.",
      params: ["community/limit", "community/cursor"],
    }),
  },
  "/community/articles/like": {
    post: swaggerFormat({
      tag: communityTags.likeTag,
      summary: "게시글 좋아요",
      description: "게시글에 좋아요를 누릅니다.",
      requestBody: "community/specificArticlePath",
    }),
    delete: swaggerFormat({
      tag: communityTags.likeTag,
      summary: "게시글 좋아요 취소",
      description: "게시글에 좋아요를 취소합니다.",
      requestBody: "community/specificArticlePath",
    }),
  },
  "/community/articles/comments/like": {
    post: swaggerFormat({
      tag: communityTags.likeTag,
      summary: "댓글 좋아요",
      description: "댓글에 좋아요를 누릅니다.",
      requestBody: "community/specificArticleCommentPath",
    }),
    delete: swaggerFormat({
      tag: communityTags.likeTag,
      summary: "댓글 좋아요 취소",
      description: "댓글에 좋아요를 취소합니다.",
      requestBody: "community/specificArticleCommentPath",
    }),
  },
};

const reports = {
  "/community/articles/report": {
    post: swaggerFormat({
      tag: communityTags.reportTag,
      summary: "게시글 신고",
      description: "게시글을 신고합니다.",
      requestBody: "community/reportArticle",
    }),
  },
  "/community/articles/comments/report": {
    post: swaggerFormat({
      tag: communityTags.reportTag,
      summary: "댓글 신고",
      description: "댓글을 신고합니다.",
      requestBody: "community/reportComment",
    }),
  },
};

const stats = {
  "/community/{communityId}/articles/popular": {
    get: swaggerFormat({
      tag: communityTags.statsTag,
      summary: "인기글 조회",
      description: "커뮤니티 ID에 해당하는 게시판의 인기글을 조회합니다.",
      params: [
        "community/communityId",
        "community/startTime",
        "community/endTime",
      ],
    }),
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
