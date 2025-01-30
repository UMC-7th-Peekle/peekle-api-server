import { Router } from "express";
import * as articleCrudController from "../controllers/community/article.crud.community.controller.js";
import * as articleReadController from "../controllers/community/article.read.community.controller.js";
import * as commentController from "../controllers/community/comment.community.controller.js";
import * as articleLikeController from "../controllers/community/article.like.community.controller.js";
import * as commentLikeController from "../controllers/community/comment.like.community.controller.js";
import * as reportController from "../controllers/community/report.community.controller.js";
import * as articleAggregateController from "../controllers/community/article.aggregate.community.controller.js";
// 사용자 인증 미들웨어 (추후 네임스페이스 방식으로 변경 필요)
import * as articleValidator from "../utils/validators/community/article.validators.js";

// 사용자 인증 미들웨어 (추후 네임스페이스 방식으로 변경 필요)
import { authenticateAccessToken } from "../middleware/authenticate.jwt.js";
import * as fileUploadMiddleware from "../middleware/uploader.js"; // 사진 업로드 미들웨어
import { validateRequestBody } from "../middleware/validate.js";
import * as aritcleSchema from "../utils/validators/community/article.validators.js";

const router = Router();

/*
  관리자 메뉴 : 게시판 생성
*/

router.post(
  "/",
  validateRequestBody(articleValidator.createCommunitySchema),
  authenticateAccessToken,
  articleCrudController.createCommunity
);

/*
  게시판 조회
*/

// communityId에 해당하는 게시판의 게시글들을 가져옵니다, 좋아요 누른 게시글만 가져올 수도 있습니다
router.get("/", articleReadController.getArticles);
router.get(
  "/article/like",
  authenticateAccessToken,
  articleReadController.getLikedArticles
);

/*
  인기글 집계
*/

// 특정 communityId에 startTime부터 endTime까지의 인기글을 가져옵니다.
router.get(
  "/:communityId/articles/popular",
  articleAggregateController.getPopularArticles
);

/*
  게시글 CREATE, READ, UPDATE, DELETE
*/

// communityId에 해당하는 게시판의 articleId에 해당하는 게시글을 가져옵니다
router.get(
  "/:communityId/articles/:articleId",
  articleCrudController.getArticleById
);

// TODO : 형식에 맞지 않는 요청의 사진도 우선 업로드가 되는 문제가 발생함

// communityId에 해당하는 게시판에 새로운 게시글을 추가합니다
router.post(
  "/:communityId/articles",
  authenticateAccessToken,
  fileUploadMiddleware.localStorage({
    restrictions: fileUploadMiddleware.restrictions("article"),
    field: [{ name: "article_images", maxCount: 5 }], // `field`에 따라 다중 업로드 설정
    destination: "uploads/articles", // 저장 경로 설정
  }),
  // validator는 body를 검증하기에 순서에 유의
  // form-data의 경우 multer가 body에 채워주는 것임
  validateRequestBody(articleValidator.postArticleSchema, true),
  articleCrudController.createArticle
);

// communityId에 해당하는 게시판의 articleId에 해당하는 게시글을 수정합니다
router.patch(
  "/:communityId/articles/:articleId",
  authenticateAccessToken,
  fileUploadMiddleware.localStorage({
    restrictions: fileUploadMiddleware.restrictions("article"),
    field: [{ name: "article_images", maxCount: 5 }], // 다중 파일 업로드 설정
    destination: "uploads/articles", // 저장 경로 설정
  }),
  // validator는 body를 검증하기에 순서에 유의
  // form-data의 경우 multer가 body에 채워주는 것임
  validateRequestBody(articleValidator.patchArticleSchema, true),
  articleCrudController.updateArticle
);

// communityId에 해당하는 게시판의 articleId에 해당하는 게시글을 삭제합니다
router.delete(
  "/articles",
  validateRequestBody(articleValidator.specificArticlePathSchema),
  authenticateAccessToken,
  articleCrudController.deleteArticle
);

/*
  게시글 좋아요
*/

// article에 좋아요를 표시합니다.
router.post(
  "/articles/like",
  validateRequestBody(articleValidator.specificArticlePathSchema),
  authenticateAccessToken,
  articleLikeController.likeArticle
);

// article에 좋아요를 취소합니다.
router.delete(
  "/articles/like",
  validateRequestBody(articleValidator.specificArticlePathSchema),
  authenticateAccessToken,
  articleLikeController.unlikeArticle
);

/*
  게시글 댓글
*/

// communityId에 해당하는 게시판의 articleId에 해당하는 게시글의 댓글 정보를 가져옵니다.
router.get("/articles/comments", commentController.getComments);

// article에 댓글을 추가합니다.
router.post(
  "/articles/comments",
  validateRequestBody(articleValidator.createCommentSchema),
  authenticateAccessToken,
  commentController.createComment
);

// article에 댓글을 수정합니다.
router.patch(
  "/articles/comments",
  validateRequestBody(articleValidator.updateOrReplyCommentSchema),
  authenticateAccessToken,
  commentController.updateComment
);

// article에 댓글을 삭제합니다.
router.delete(
  "/articles/comments",
  validateRequestBody(articleValidator.specificArticleCommentPathSchema),
  authenticateAccessToken,
  commentController.deleteComment
);

// 댓글에 대댓글을 추가합니다.
router.post(
  "/articles/comments/reply",
  validateRequestBody(articleValidator.updateOrReplyCommentSchema),
  authenticateAccessToken,
  commentController.createCommentReply
);

/*
  게시글 댓글 좋아요
*/

// 댓글에 좋아요를 표시합니다.
router.post(
  "/articles/comments/like",
  validateRequestBody(articleValidator.specificArticleCommentPathSchema),
  authenticateAccessToken,
  commentLikeController.likeComment
);

// 댓글에 좋아요를 취소합니다.
router.delete(
  "/articles/comments/like",
  validateRequestBody(articleValidator.specificArticleCommentPathSchema),
  authenticateAccessToken,
  commentLikeController.unlikeComment
);

/*
  게시글 신고
*/

// 게시글을 신고합니다.
router.post(
  "/articles/report",
  validateRequestBody(articleValidator.reportArticleSchema),
  authenticateAccessToken,
  reportController.reportArticle
);

// 댓글을 신고합니다.
router.post(
  "/articles/comments/report",
  validateRequestBody(articleValidator.reportCommentSchema),
  authenticateAccessToken,
  reportController.reportComment
);

export const communitySwagger = {
  "/community": {
    get: {
      tags: ["Community"],
      summary: "커뮤니티 게시글 목록 조회",
      description: "커뮤니티 ID를 통해 해당 커뮤니티의 게시글 목록을 조회합니다.",
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
      requestBody: { // TODO: 마지막에 상세 정보 추가
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: aritcleSchema.postArticleSchema // getArticle에 대한 스키마 지정이 필요한가?
            },
          },
        },
      },
      responses: {
        200: {
          description: "성공",
        },
        400: {
          description: "실패",
        },
        404: {
          description: "커뮤니티 ID에 해당하는 게시판이 존재하지 않습니다.",
        },
      },
    },
  },
  "/community/article/like": {
    get: {
      tags: ["Community"],
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
        },
        400: {
          description: "실패",
        },
      },
    },
  },
  "/community/:communityId/articles/:articleId": {
    get: {
      tags: ["Community"],
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
        },
        400: {
          description: "실패",
        },
        404: {
          description: "게시글 ID에 해당하는 게시글이 존재하지 않습니다.",
        },
      },
    },
  },
  "/community/:communityId/articles": {
    post: {
      tags: ["Community"],
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
      requestBody: { // TODO: 마지막에 상세 정보 추가
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: aritcleSchema.postArticleSchema,
            },
          },
        },
      },
      responses: {
        201: {
          description: "성공",
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
  "/community/:communityId/articles/:articleId": {
    patch: {
      tags: ["Community"],
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
      requestBody: { // TODO: 마지막에 상세 정보 추가
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: aritcleSchema.patchArticleSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: "성공",
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
  "/community/articles": {
    delete: {
      tags: ["Community"],
      summary: "게시글 삭제",
      description: "게시글 ID에 해당하는 게시글을 삭제합니다.",
      requestBody: { // TODO: 마지막에 상세 정보 추가
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: aritcleSchema.specificArticlePathSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: "성공",
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

export default router;

