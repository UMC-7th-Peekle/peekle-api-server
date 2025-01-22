// Description: 댓글 좋아요 관련 로직을 처리하는 서비스 파일입니다.
import {
  NotExistsError,
  AlreadyExistsError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";

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
    const comment = await models.ArticleComments.findOne({
      where: {
        articleId,
        commentId,
      },
      include: [
        {
          model: models.ArticleCommentLikes,
          as: "articleCommentLikes",
          where: {
            likedUserId,
          },
          required: false, // 좋아요가 없는 경우도 조회 가능하도록 설정
        },
      ],
    });

    // 댓글이 존재하지 않는 경우
    if (!comment) {
      throw new NotExistsError("댓글이 존재하지 않습니다"); // 404
    }

    // 이미 좋아요가 눌린 경우
    if (comment.articleCommentLikes.length > 0) {
      throw new AlreadyExistsError("이미 좋아요가 처리되었습니다"); // 409
    }

    // 좋아요 추가
    const like = await models.ArticleCommentLikes.create({
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
    const comment = await models.ArticleComments.findOne({
      where: {
        articleId,
        commentId,
      },
      include: [
        {
          model: models.ArticleCommentLikes,
          as: "articleCommentLikes",
          where: {
            likedUserId,
          },
          required: false, // 좋아요가 없는 경우도 조회 가능하도록 설정
        },
      ],
    });

    // 댓글이 존재하지 않는 경우
    if (!comment) {
      throw new NotExistsError("댓글이 존재하지 않습니다"); // 404
    }

    // 좋아요가 눌리지 않은 경우
    if (comment.articleCommentLikes.length === 0) {
      throw new NotExistsError("좋아요가 존재하지 않습니다"); // 404
    }

    // 좋아요 삭제
    await models.ArticleCommentLikes.destroy({
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
