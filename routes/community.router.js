import { Router } from "express";
import { emptyController } from "../controllers/empty.cotroller.js";
import articleController from "../controllers/article.contoller.js";


const router = Router();

/**
 * communityId에 해당하는 게시판의 게시글들을 가져옵니다, 좋아요 누른 게시글만 가져올 수도 있습니다
 */
router.get("/:communityId", emptyController);

/**
 * 검색어를 포함하는 게시글을 가져옵니다
 */
router.get("/:communityId/search", emptyController);

/**
 * communityId에 해당하는 게시판의 articleId에 해당하는 게시글을 가져옵니다
 */
router.get("/:communityId/articles/:articleId", articleController.getArticleById);

/**
 * communityId에 해당하는 게시판에 게시글을 추가합니다
 */
router.post("/:communityId/articles", articleController.createArticle);

/**
 * communityId에 해당하는 게시판의 articleId에 해당하는 게시글을 수정합니다
 */
router.patch("/:communityId/articles/:articleId", articleController.updateArticle); // jwtMiddleware 추가해야 함

/**
 * communityId에 해당하는 게시판의 articleId에 해당하는 게시글을 삭제합니다
 */
router.delete("/:communityId/articles/:articleId", articleController.deleteArticle); // jwtMiddleware 추가해야 함

/**
 * article에 좋아요 표시 및 취소
 */
router.patch("/:communityId/:articleId/like", emptyController);

/**
 * article에 댓글을 추가합니다
 */
router.post("/:communityId/:articleId/comments", emptyController);

/**
 * article에 댓글을 수정합니다. 대댓글도 포함
 */
router.patch("/:communityId/:articleId/comments/:commentId", emptyController);

/**
 * article에 댓글을 삭제합니다
 */
router.delete("/:communityId/:articleId/comments/:commentId", emptyController);

/**
 * article에 댓글에 대댓글을 추가합니다
 */
router.post("/:communityId/:articleId/comments/:commentId", emptyController);

export default router;
