// Description: 댓글 좋아요 관련 로직을 처리하는 컨트롤러 파일입니다.
import commentLikeService from "../../services/community/comment.like.community.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

// 댓글 좋아요
export const likeComment = async (req, res, next) => {
  try {
    const { communityId, articleId, commentId } = req.params; // URL에서 communityId, articleId, commentId 추출
    const likedUserId = req.user.userId; // JWT에서 사용자 ID 추출

    const like = await commentLikeService.likeComment({
      communityId,
      articleId,
      commentId,
      likedUserId,
    }); // 댓글 좋아요 (현재는 response에 article을 넣지 않지만, 추후에 넣을 상황이 생길 수도 있는 것을 고려해 article을 반환 받는 식으로 작성)

    return res.status(201).success({
      message: "댓글 좋아요 성공",
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

// 댓글 좋아요 취소
export const unlikeComment = async (req, res, next) => {
  try {
    const { communityId, articleId, commentId } = req.params; // URL에서 communityId, articleId, commentId 추출
    const likedUserId = req.user.userId; // JWT에서 사용자 ID 추출

    await commentLikeService.unlikeComment({
      communityId,
      articleId,
      commentId,
      likedUserId,
    }); // 댓글 좋아요 취소

    return res.status(200).success({
      message: "댓글 좋아요 취소 성공",
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

export default {
  likeComment,
  unlikeComment,
};
