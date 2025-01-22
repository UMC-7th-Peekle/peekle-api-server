// Description: 게시글 좋아요 관련 로직을 처리하는 서비스 파일입니다.
import {
  NotExistsError,
  UnauthorizedError,
  AlreadyExistsError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";

/**
 * 게시글 좋아요를 추가합니다
 */
export const likeArticle = async ({ communityId, articleId, likedUserId }) => {
  logger.info(
    `[likeArticle] 좋아요 추가 요청 - communityId: ${communityId}, articleId: ${articleId}, likedUserId: ${likedUserId}`
  );
  // 게시글 조회
  const article = await models.Articles.findOne({
    where: {
      communityId,
      articleId,
    },
    include: [
      {
        model: models.ArticleLikes,
        as: "articleLikes",
        where: {
          likedUserId,
        },
        required: false, // 좋아요가 없는 경우도 조회 가능하도록 설정
      },
    ],
  });

  if (!article) {
    // 게시글이 존재하지 않는 경우
    logger.warn(
      `[likeArticle] 게시글이 존재하지 않음 - communityId: ${communityId}, articleId: ${articleId}`
    );
    throw new NotExistsError("게시글이 존재하지 않습니다"); // 404
  }

  if (article.articleLikes.length > 0) {
    // 이미 좋아요가 눌린 경우
    logger.warn(
      `[likeArticle] 이미 좋아요가 눌린 게시글 - articleId: ${articleId}, likedUserId: ${likedUserId}`
    );
    throw new AlreadyExistsError("이미 좋아요를 누른 게시글입니다."); // 409
  }

  // 좋아요 추가
  const like = await models.ArticleLikes.create({
    articleId,
    likedUserId,
  });

  logger.debug(
    `[likeArticle] 좋아요 추가 성공 - articleId: ${articleId}, likedUserId: ${likedUserId}`
  );
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
  logger.info(
    `[unlikeArticle] 좋아요 취소 요청 - communityId: ${communityId}, articleId: ${articleId}, likedUserId: ${likedUserId}`
  );
  // 게시글 조회
  const article = await models.Articles.findOne({
    where: {
      communityId,
      articleId,
    },
    include: [
      {
        model: models.ArticleLikes,
        as: "articleLikes",
        where: {
          likedUserId,
        },
        required: false, // 좋아요가 없는 경우도 조회 가능하도록 설정
      }, // true로 설정할 경우 좋아요가 없는 경우 조회되지 article 자체가 null이 되어 좋아요만 없어도 404 에러가 발생
    ],
  });

  console.log(article);

  if (!article) {
    // 게시글이 존재하지 않는 경우
    logger.warn(
      `[unlikeArticle] 게시글이 존재하지 않음 - communityId: ${communityId}, articleId: ${articleId}`
    );
    throw new NotExistsError("게시글이 존재하지 않습니다"); // 404
  }

  if (article.articleLikes.length === 0) {
    // 이미 좋아요가 취소된 경우
    logger.warn(
      `[unlikeArticle] 이미 좋아요가 취소된 게시글 - articleId: ${articleId}, likedUserId: ${likedUserId}`
    );
    throw new AlreadyExistsError("이미 좋아요가 취소된 게시글입니다."); // 409
  }

  // 좋아요 삭제
  await models.ArticleLikes.destroy({
    where: {
      articleId,
      likedUserId,
    },
  });

  logger.debug(
    `[unlikeArticle] 좋아요 취소 성공 - articleId: ${articleId}, likedUserId: ${likedUserId}`
  );

  return;
};
