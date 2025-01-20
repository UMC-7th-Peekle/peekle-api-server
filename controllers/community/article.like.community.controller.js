// Description: 게시글 좋아요 관련 로직을 처리하는 컨트롤러 파일입니다.
import articleLikeService from "../../services/community/article.like.community.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

// 게시글 좋아요
export const likeArticle = async (req, res, next) => {
  try {
    // 사용자 인증 검증 필요
    const { communityId, articleId } = req.params; // URL에서 communityId, articleId 추출
    //const authorId = req.user.userId; // JWT에서 사용자 ID 추출
    var likedUserId = 1; // 임시로 사용자 ID를 1로 설정

    const like = await articleLikeService.likeArticle(
      communityId,
      articleId,
      likedUserId
    ); // 게시글 좋아요

    return res.status(201).json({
      message: "게시글 좋아요 성공",
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

// 게시글 좋아요 취소
export const unlikeArticle = async (req, res, next) => {
  try {
    // 사용자 인증 검증 필요
    const { communityId, articleId } = req.params; // URL에서 communityId, articleId 추출
    //const authorId = req.user.userId; // JWT에서 사용자 ID 추출
    var likedUserId = 1; // 임시로 사용자 ID를 1로 설정

    const like = await articleLikeService.unlikeArticle(
      communityId,
      articleId,
      likedUserId
    ); // 게시글 좋아요 취소

    return res.status(200).json({
      message: "게시글 좋아요 취소 성공",
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

export default {
  likeArticle,
  unlikeArticle,
};