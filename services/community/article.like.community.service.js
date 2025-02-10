// Description: 게시글 좋아요 관련 로직을 처리하는 서비스 파일입니다.
import {
  NotExistsError,
  UnauthorizedError,
  AlreadyExistsError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";

/**
 * 게시글이 존재하는지 확인합니다
 */
const checkArticleExists = async (communityId, articleId) => {
  // 원래 ForeignKeyConstraintError를 처리하려 했지만, articleId에 대한 확인도 필요하여 이렇게 수정
  const article = await models.Articles.findOne({
    where: { communityId, articleId },
  });
  if (!article) {
    logger.error(
      `[likeArticle] 게시글이 존재하지 않음 - articleId: ${articleId}`
    );
    throw new NotExistsError("게시글이 존재하지 않습니다.");
  }
  return article;
};

/**
 * 게시글 좋아요를 추가합니다
 */
export const likeArticle = async ({ communityId, articleId, likedUserId }) => {
  await checkArticleExists(communityId, articleId); // 게시글이 존재하는지 확인

  let like;
  /* try-catch 블록 외부에서 like 선언
  try-catch 블록 내부에서 like를 생성하고 반환하면
  "like is not defined" 에러가 발생합니다.
  */
  try {
    // 좋아요 추가
    like = await models.ArticleLikes.create({
      articleId,
      likedUserId,
    });
  } catch (error) {
    if (error instanceof models.Sequelize.ForeignKeyConstraintError) {
      logger.error(
        `[likeArticle] 게시글 존재하지 않음 - articleId: ${articleId}`
      );
      throw new NotExistsError("게시글이 존재하지 않습니다");
    } else if (error instanceof models.Sequelize.UniqueConstraintError) {
      logger.error(
        `[likeArticle] 이미 좋아요가 눌린 게시글 - articleId: ${articleId}, likedUserId: ${likedUserId}`
      );
      throw new AlreadyExistsError("이미 좋아요를 누른 게시글입니다.");
    } else {
      throw error;
    }
  }
  return { like };
};

/**
 * 게시글 좋아요를 취소합니다
 */
export const unlikeArticle = async ({
  communityId,
  articleId,
  likedUserId,
}) => {
  // 게시글 조회
  await checkArticleExists(communityId, articleId); // 게시글이 존재하는지 확인

  // 좋아요 여부 확인
  const like = await models.ArticleLikes.findOne({
    where: { articleId, likedUserId },
  });

  if (!like) {
    // 이미 좋아요가 취소된 경우
    logger.error(
      `[unlikeArticle] 이미 좋아요가 취소된 게시글 - articleId: ${articleId}, likedUserId: ${likedUserId}`
    );
    throw new AlreadyExistsError("이미 좋아요가 취소된 게시글입니다."); // 409
  }

  // 좋아요 삭제
  await like.destroy();

  return;
};
