// Description: 게시글 좋아요 관련 로직을 처리하는 서비스 파일입니다.
import {
  NotExistsError,
  UnauthorizedError,
  AlreadyExistsError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";

/**
 * 게시글 좋아요를 추가합니다
 */
export const likeArticle = async ({ communityId, articleId, likedUserId }) => {
  try {
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
      throw new NotExistsError("게시글이 존재하지 않습니다"); // 404
    }

    if (article.articleLikes.length > 0) {
      // 이미 좋아요가 눌린 경우
      throw new AlreadyExistsError("이미 좋아요를 누른 게시글입니다."); // 409
    }

    // 좋아요 추가
    const like = await models.ArticleLikes.create({
      articleId,
      likedUserId,
    });

    return { like };
  } catch (error) {
    throw error;
  }
};

/**
 * 게시글 좋아요를 취소합니다
 */
export const unlikeArticle = async ({
  communityId,
  articleId,
  likedUserId,
}) => {
  try {
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
      throw new NotExistsError("게시글이 존재하지 않습니다"); // 404
    }

    if (article.articleLikes.length === 0) {
      // 좋아요가 눌리지 않은 경우
      throw new AlreadyExistsError("이미 좋아요가 취소된 게시글입니다."); // 409
    }

    // 좋아요 삭제
    await models.ArticleLikes.destroy({
      where: {
        articleId,
        likedUserId,
      },
    });

    return;
  } catch (error) {
    throw error;
  }
};
