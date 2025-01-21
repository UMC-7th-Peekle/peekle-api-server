// Description: 댓글 좋아요 관련 로직을 처리하는 서비스 파일입니다.
import {
  NotExistsError,
  UnauthorizedError,
  AlreadyExistsError,
} from "../../utils/errors/errors.js";
import db from "../../models/index.js";

/**
 * 댓글 좋아요를 추가합니다
 */
export const likeComment = async ({
  communityId,
  articleId,
  commentId,
  likedUserId,
}) => {
  try {
    // 댓글 조회
    const comment = await db.ArticleComments.findOne({
      where: {
        articleId,
        commentId,
      },
    });

    if (!comment) {
      // 댓글이 존재하지 않는 경우
      throw new NotExistsError("댓글이 존재하지 않습니다"); // 404
    }

    // 이미 좋아요가 눌렸는지 확인
    const existingLike = await db.ArticleCommentLikes.findOne({
      where: {
        commentId,
        likedUserId,
      },
    });

    if (existingLike) {
      // 이미 좋아요가 눌린 경우
      throw new AlreadyExistsError("이미 좋아요가 처리되었습니다"); // 409
    }

    // 좋아요 추가
    const like = await db.ArticleCommentLikes.create({
      commentId,
      likedUserId,
    });

    return { like };
  } catch (error) {
    throw error;
  }
};

/**
 * 댓글 좋아요를 취소합니다
 */
export const unlikeComment = async ({
  communityId,
  articleId,
  commentId,
  likedUserId,
}) => {
  try {
    // 댓글 조회
    const comment = await db.ArticleComments.findOne({
      where: {
        articleId,
        commentId,
      },
    });

    if (!comment) {
      // 댓글이 존재하지 않는 경우
      throw new NotExistsError("댓글이 존재하지 않습니다"); // 404
    }
    // 이미 좋아요가 눌렸는지 확인
    const existingLike = await db.ArticleCommentLikes.findOne({
      where: {
        commentId,
        likedUserId,
      },
    });
    // 좋아요 삭제
    await db.ArticleCommentLikes.destroy({
      where: {
        commentId,
        likedUserId,
      },
    });

    return;
  } catch (error) {
    throw error;
  }
};

export default {
  likeComment,
  unlikeComment,
};
