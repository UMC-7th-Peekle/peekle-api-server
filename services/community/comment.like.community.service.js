// Description: 댓글 좋아요 관련 로직을 처리하는 서비스 파일입니다.
import {
  NotExistsError,
  AlreadyExistsError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";

/**
 * 댓글이 존재하는지 확인합니다.
 */
const checkCommentExists = async (articleId, commentId) => {
  // 원래 ForeignKeyConstraintError를 처리하려 했지만, articleId에 대한 확인도 필요하여 이렇게 수정
  const comment = await models.ArticleComments.findOne({
    where: { articleId, commentId },
  });

  if (!comment) {
    logger.error(
      `[likeComment] 댓글이 존재하지 않음 - commentId: ${commentId}, articleId: ${articleId}`
    );
    throw new NotExistsError("해당 댓글이 존재하지 않습니다.");
  }
  return comment;
};

/**
 * 댓글 좋아요를 추가합니다
 */
export const likeComment = async ({
  communityId,
  articleId,
  commentId,
  likedUserId,
}) => {
  await checkCommentExists(articleId, commentId); // 댓글 존재 여부 확인

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
    if (error instanceof models.Sequelize.UniqueConstraintError) {
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
  await checkCommentExists(articleId, commentId); // 댓글 존재 여부 확인

  // 좋아요 여부 확인
  const like = await models.ArticleCommentLikes.findOne({
    where: { commentId, likedUserId },
  });
  // 좋아요가 눌리지 않은 경우
  if (!like) {
    logger.error(
      `[unlikeComment] 이미 좋아요가 취소된 댓글 - commentId: ${commentId}, likedUserId: ${likedUserId}`
    );
    throw new NotExistsError("이미 좋아요가 취소된 댓글입니다."); // 404
  }

  // 좋아요 삭제
  await like.destroy();
};
