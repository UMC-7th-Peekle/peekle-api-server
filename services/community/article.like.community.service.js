// Description: 게시글 좋아요 관련 로직을 처리하는 서비스 파일입니다.
import {
  NotExistsError,
  UnauthorizedError,
  AlreadyExistsError,
} from "../../utils/errors/errors.js";
import db from "../../models/index.js";

/**
 * 게시글 좋아요를 추가합니다
 */
export const likeArticle = async ({ communityId, articleId, likedUserId }) => {
  try {
    // 게시글 조회
    const article = await db.Articles.findOne({
      where: {
        communityId,
        articleId,
      },
    });

    if (!article) {
      // 게시글이 존재하지 않는 경우
      throw new NotExistsError("게시글이 존재하지 않습니다"); // 404
    }

    // 이미 좋아요가 눌렸는지 확인
    const existingLike = await db.ArticleLikes.findOne({
      where: {
        articleId,
        likedUserId,
      },
    });

    if (existingLike) {
      // 이미 좋아요가 눌린 경우
      throw new AlreadyExistsError("이미 좋아요가 처리되었습니다"); // 409
    }

    // 좋아요 추가
    const like = await db.ArticleLikes.create({
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
    const article = await db.Articles.findOne({
      where: {
        communityId,
        articleId,
      },
    });

    if (!article) {
      // 게시글이 존재하지 않는 경우
      throw new NotExistsError("게시글이 존재하지 않습니다"); // 404
    }

    // 좋아요 삭제
    await db.ArticleLikes.destroy({
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

export default {
  likeArticle,
  unlikeArticle,
};
