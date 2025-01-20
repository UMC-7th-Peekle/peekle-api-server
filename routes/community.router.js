import { Router } from "express";
import articleCrudController from "../controllers/community/article.crud.community.contoller.js";
import articleReadContoller from "../controllers/community/article.read.community.controller.js";
import commentController from "../controllers/community/comment.community.contorller.js";
import articleLikeController from "../controllers/community/article.like.community.controller.js";
import commentLikeController from "../controllers/community/comment.like.community.controller.js";


const router = Router();

/**
 * communityId에 해당하는 게시판의 게시글들을 가져옵니다, 좋아요 누른 게시글만 가져올 수도 있습니다
 */
router.get("/:communityId", articleReadContoller.getArticles);

/**
 * 검색어를 포함하는 게시글을 가져옵니다
 */
router.get("/:communityId/search", articleReadContoller.searchArticles);

/**
 * communityId에 해당하는 게시판의 articleId에 해당하는 게시글을 가져옵니다
 */
router.get(
  "/:communityId/articles/:articleId",
  articleCrudController.getArticleById
);

/**
 * communityId에 해당하는 게시판에 게시글을 추가합니다
 */
router.post("/:communityId/articles", articleCrudController.createArticle);

/**
 * communityId에 해당하는 게시판의 articleId에 해당하는 게시글을 수정합니다
 */
router.patch(
  "/:communityId/articles/:articleId",
  articleCrudController.updateArticle
); // jwtMiddleware 추가해야 함

/**
 * communityId에 해당하는 게시판의 articleId에 해당하는 게시글을 삭제합니다
 */
router.delete(
  "/:communityId/articles/:articleId",
  articleCrudController.deleteArticle
); // jwtMiddleware 추가해야 함

/**
 * article에 좋아요 표시합니다.
 */
router.post(
  "/:communityId/articles/:articleId/like",
  articleLikeController.likeArticle
);

/**
 * article에 좋아요를 취소합니다.
 */
router.delete(
  "/:communityId/articles/:articleId/like",
  articleLikeController.unlikeArticle
);

/**
 * article에 댓글을 추가합니다
 */
router.post(
  "/:communityId/articles/:articleId/comments",
  commentController.createComment
);

/**
 * article에 댓글을 수정합니다. 대댓글도 포함
 */
router.patch(
  "/:communityId/articles/:articleId/comments/:commentId",
  commentController.updateComment
);

/**
 * article에 댓글을 삭제합니다
 */
router.delete(
  "/:communityId/articles/:articleId/comments/:commentId",
  commentController.deleteComment
);

/**
 * article에 댓글에 대댓글을 추가합니다
 */
router.post(
  "/:communityId/articles/:articleId/comments/:commentId/reply",
  commentController.createCommentReply
);

/**
 * 댓글에 좋아요 표시합니다.
 */
router.post(
  "/:community/articles/:articleId/comments/:commentId/like",
  commentLikeController.likeComment
);

/**
 * 댓글 좋아요를 취소합니다.
 */
router.delete(
  "/:community/articles/:articleId/comments/:commentId/like",
  commentLikeController.unlikeComment
);

export default router;
