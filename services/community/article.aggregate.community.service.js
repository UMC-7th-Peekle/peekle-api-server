// Description: 커뮤니티의 게시글에 대한 집계를 다루는 서비스 파일입니다.
import {
  InvalidInputError,
  InvalidQueryError,
  NotExistsError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";
import { Sequelize } from "sequelize";
import { Op, fn, col } from "sequelize";
import { addBaseUrl } from "../../utils/upload/uploader.object.js";
import config from "../../config/config.js";

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
    include: [
          {
            model: models.ArticleComments,
            as: "articleComments",
            attributes: ["commentId"], // 댓글 정보
            where: { status: { [Op.ne]: "deleted" } }, // 삭제된 댓글 제외
            required: false, // 댓글이 없어도 Article은 가져옴
          },
          {
            model: models.ArticleImages,
            as: "articleImages",
            attributes: ["imageUrl"], // 이미지 정보
            where: { sequence: 1 }, // 특정 조건(대표 이미지)
            required: false, // 이미지가 없어도 Article은 가져옴
          },
          {
            model: models.ArticleLikes,
            as: "articleLikes",
            attributes: ["likedUserId"], // 좋아요 개수
            separate: true, // 좋아요 수 계산을 위해 쿼리를 분리
            required: false,
          },
          {
            model: models.Users,
            as: "author",
            attributes: ["userId", "nickname", "profileImage"], // 필요한 필드만 가져오기
            required: true,
          },
        ],
    order: [
      // 좋아요 수 + 댓글 수로 정렬
      [Sequelize.literal("(likeCount + commentCount)"), "DESC"],
    ],
    having: Sequelize.literal("(likeCount + commentCount) > 0"), // 합계가 0 초과인 게시글만 가져옴
    limit: 2, // 상위 2개만 가져옴
  });

  // 게시글 데이터 가공
  popularArticles.map((article) => {
    article = article.dataValues;
    article.articleComments = article.articleComments.length; // 댓글 개수만 추출
    article.articleLikes = article.articleLikes.length; // 좋아요 개수만 추출
    if (article.articleImages.length > 0) {
      article.articleImages = addBaseUrl(
        article.articleImages[0].dataValues.imageUrl
      ); // 대표 이미지 URL
      // dataValues가 빠져 있어서 오류 발생했었음
    } else {
      article.articleImages = null;
    }
    article.thumbnail = article.articleImages;
    delete article.articleImages;


    // 작성자 정보 가공
    if (article.isAnonymous === true) {
      article.authorInfo = {
        nickname: null,
        profileImage: null, // 익명인 경우 기본 이미지 대신 null 반환
        authorId: null,
      };
    } else {
      article.author = article.author.dataValues;
      // 기본 이미지인 경우 null로 전송
      
      article.author.profileImage = article.author.profileImage === config.PEEKLE.DEFAULT_PROFILE_IMAGE ? null : addBaseUrl(article.author.profileImage),
      article.author.authorId = article.author.userId;
      delete article.author.userId;

      // 작성자 정보를 authorInfo로 변경
      article.authorInfo = article.author;
    }
    delete article.author;
  });

  return { articles: popularArticles };
};
