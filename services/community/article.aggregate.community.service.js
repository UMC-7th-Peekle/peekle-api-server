// Description: 커뮤니티의 게시글에 대한 집계를 다루는 서비스 파일입니다.
import {
  InvalidInputError,
  InvalidQueryError,
  NotExistsError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";
import { Sequelize } from "sequelize";

export const validateStatisticsQuery = (queries) => {
  const { startTime, endTime } = queries;

  // 날짜 형식 및 유효성 검증
  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    console.error(date);
    return date instanceof Date && !isNaN(date);
  };

  if (startTime !== undefined && !isValidDate(startTime)) {
    throw new InvalidQueryError("올바르지 않은 날짜 형식입니다.");
  }
  if (endTime !== undefined && !isValidDate(endTime)) {
    throw new InvalidQueryError("올바르지 않은 날짜 형식입니다.");
  }
  if (
    startTime !== undefined &&
    endTime !== undefined &&
    new Date(startTime) > new Date(endTime)
  ) {
    throw new InvalidQueryError("startTime가 endTime보다 미래일 수 없습니다.");
  }
};

/**
 * 인기 게시글을 조회합니다
 */
export const getPopularArticles = async (communityId, startTime, endTime) => {
  // 커뮤니티 존재 여부 확인
  const communityExists = await models.Communities.findOne({
    where: { communityId },
  });

  if (!communityExists) {
    throw new NotExistsError("해당 커뮤니티가 존재하지 않습니다."); // 404
  }
  // 인기 게시글 조회 쿼리
  const popularArticles = await models.Articles.findAll({
    where: {
      communityId,
    },
    attributes: [
      "articleId",
      "title",
      "content",
      "authorId",
      "isAnonymous",
      "communityId",
      "createdAt",
      "updatedAt",
      [
        // 좋아요 수 계산
        Sequelize.literal(`(
          SELECT COUNT(*)
          FROM article_likes AS likes
          WHERE likes.article_id = Articles.article_id
          AND likes.created_at BETWEEN '${startTime}' AND '${endTime}'
        )`),
        "likeCount",
      ],
      [
        // 댓글 수 계산
        Sequelize.literal(`(
          SELECT COUNT(*)
          FROM article_comments AS comments
          WHERE comments.article_id = Articles.article_id
          AND comments.created_at BETWEEN '${startTime}' AND '${endTime}'
        )`),
        "commentCount",
      ],
    ],
    order: [
      // 좋아요 수 + 댓글 수로 정렬
      [Sequelize.literal("(likeCount + commentCount)"), "DESC"],
    ],
    having: Sequelize.literal("(likeCount + commentCount) > 0"), // 합계가 0 초과인 게시글만 가져옴
    limit: 2, // 상위 2개만 가져옴
  });

  return { articles: popularArticles };
};
