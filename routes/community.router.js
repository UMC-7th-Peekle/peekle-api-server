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
router.get(
  "/articles/comments",
  validateRequestBody(articleValidator.specificArticlePathSchema),
  commentController.getComments
);

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
  validateRequestBody(articleValidator.rudCommentSchema),
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
  validateRequestBody(articleValidator.createReplySchema),
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
  "/:communityId/articles/:articleId/report",
  authenticateAccessToken,
  reportController.reportArticle
);

// 댓글을 신고합니다.
router.post(
  "/:communityId/articles/:articleId/comments/:commentId/report",
  authenticateAccessToken,
  reportController.reportComment
);

/*
  인기글 집계
*/

// 특정 communityId에 startTime부터 endTime까지의 인기글을 가져옵니다.
router.get(
  "/:communityId/popular-articles",
  articleAggregateController.getPopularArticles
);

export default router;
