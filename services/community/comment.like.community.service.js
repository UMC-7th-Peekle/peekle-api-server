// Description: 댓글 좋아요 관련 로직을 처리하는 서비스 파일입니다.
import {
  NotExistsError,
  AlreadyExistsError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";

/**
 * 댓글 좋아요를 추가합니다
 */
export const likeComment = async ({
  communityId,
  articleId,
  commentId,
  likedUserId,
}) => {
  let like;
  /* try-catch 블록 외부에서 like 선언
  try-catch 블록 내부에서 like를 생성하고 반환하면
  "like is not defined" 에러가 발생합니다.
  */
  try {
    // 좋아요 추가 (Unique 제약 조건으로 중복 방지)
    like = await models.ArticleCommentLikes.create({
      commentId,
      likedUserId,
    });
  } catch (error) {
    if (error instanceof models.Sequelize.ForeignKeyConstraintError) {
      logger.error(
        `[likeComment] 댓글이 존재하지 않음 - commentId: ${commentId}`
      );
      throw new NotExistsError("해당 댓글이 존재하지 않습니다");
    } else if (error instanceof models.Sequelize.UniqueConstraintError) {
      // 이미 좋아요가 눌린 경우
      logger.error(
        `[likeComment] 이미 좋아요가 눌린 댓글 - commentId: ${commentId}, likedUserId: ${likedUserId}`
      );
      throw new AlreadyExistsError("이미 좋아요를 누른 댓글입니다.");
    } else {
      throw error;
    }
  }
  return { like };
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
    logger.error(
      `[unlikeComment] 댓글이 존재하지 않음 - commentId: ${commentId}`
    );
    throw new NotExistsError("댓글이 존재하지 않습니다"); // 404
  }

  // 좋아요가 눌리지 않은 경우
  if (comment.articleCommentLikes.length === 0) {
    logger.error(
      `[unlikeComment] 이미 좋아요가 취소된 댓글 - commentId: ${commentId}, likedUserId: ${likedUserId}`
    );
    throw new NotExistsError("이미 좋아요가 취소된 댓글입니다."); // 404
  }

  // 좋아요 삭제
  await models.ArticleCommentLikes.destroy({
    where: {
      commentId,
      likedUserId,
    },
  });

  logger.debug(
    `[unlikeComment] 댓글 좋아요 취소 성공 - commentId: ${commentId}, likedUserId: ${likedUserId}`
  );

  return;
};
