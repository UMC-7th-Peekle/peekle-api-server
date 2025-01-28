// Description: 게시글 목록 조회를 위한 서비스 파일입니다.
import {
  InvalidQueryError,
  NotExistsError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";
import { Op } from "sequelize";
import { addBaseUrl } from "../../utils/upload/uploader.object.js";

export const validateArticleQuery = (queries) => {
  const { communityId, limit, cursor, query } = queries; // 쿼리 파라미터에서 limit와 cursor 추출

  const isInteger = (value) => /^\d+$/.test(value); // 정수만 허용
  if (!isInteger(limit) || !isInteger(cursor) || !isInteger(communityId)) {
    throw new InvalidQueryError(
      "limit, cursor, communityId는 정수여야 합니다."
    );
  }

  if (query && query.length < 2) {
    throw new InvalidQueryError("검색어는 2자 이상이여야 합니다.");
  }

  return;
};

/**
 * communityId에 해당하는 게시판의 게시글들을 가져옵니다
 */
export const getArticles = async (
  communityId,
  query,
  { limit, cursor = null }
) => {
  // 게시판 및 게시글 조회
  const community = await models.Communities.findOne({
    where: { ...(communityId && { communityId: communityId }) },
    include: [
      {
        model: models.Articles,
        as: "articles",
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${query}%`, // 제목에 검색어 포함
              },
            },
            {
              content: {
                [Op.like]: `%${query}%`, // 내용에 검색어 포함
              },
            },
          ],
          ...(cursor && { articleId: { [Op.lt]: cursor } }), // 커서 조건: articleId 기준
        },
        order: [["createdAt", "DESC"]], // 최신순 정렬
        limit: limit + 1, // 조회 개수 제한
        required: false, // 게시글이 없는 경우에도 커뮤니티는 반환
        include: [
          {
            model: models.ArticleComments,
            as: "articleComments",
            attributes: ["commentId"], // 댓글 개수만 가져오기 위해 commentId만 추출
            where: { status: { [Op.ne]: "deleted" } }, // 삭제되지 않은 댓글만 가져오기
            required: false, // 댓글이 없는 경우에도 커뮤니티는 반환
          },
          {
            model: models.ArticleLikes,
            as: "articleLikes",
            attributes: ["likedUserId"], // 좋아요 개수만 가져오기 위해 userId만 추출
            required: false, // 좋아요가 없는 경우에도 커뮤니티는 반환
          },
          {
            model: models.ArticleImages,
            as: "articleImages",
            attributes: ["imageUrl", "sequence"], // 필요한 필드만 가져오기
            where: { sequence: 1 }, // 대표 이미지만 가져오기
            limit: 1,
            required: false, // 이미지가 없는 경우에도 커뮤니티는 반환
          },
        ],
      },
    ],
  });

  if (!community) {
    // 게시판이 존재하지 않는 경우
    logger.error("존재하지 않은 게시판입니다.", {
      action: "community:getArticles",
      actionType: "error",
      communityId: communityId,
    });
    throw new NotExistsError("해당 게시판이 존재하지 않습니다.");
  }

  // 게시글만 추출
  const articles = community.articles;

  // 좋아요, 댓글 수 및 썸네일만을 반환하도록 가공
  articles.map((article) => {
    article = article.dataValues;
    article.articleComments = article.articleComments.length; // 댓글 개수만 추출
    article.articleLikes = article.articleLikes.length; // 좋아요 개수만 추출
    if (article.articleImages.length > 0) {
      article.articleImages = addBaseUrl(article.articleImages[0].imageUrl); // 대표 이미지 URL
    } else {
      article.articleImages = null;
    }
    article.thumbnail = article.articleImages;
    delete article.articleImages;
  });

  // 다음 커서 설정
  const hasNextPage = articles.length > limit; // limit + 1개를 가져왔으면 다음 페이지 있음
  const nextCursor = hasNextPage ? articles[limit - 1].articleId : null;
  if (hasNextPage) {
    articles.pop(); // limit + 1개를 가져왔으면 마지막 요소는 버림
  }

  logger.debug("게시글 조회 완료", {
    action: "community:getArticles",
    actionType: "success",
    data: {
      communityId: communityId,
      articleCount: articles.length,
      limit: limit,
      nextCursor: nextCursor,
      hasNextPage: hasNextPage,
    },
  });

  return {
    articles,
    nextCursor,
    hasNextPage,
  };
};

export const getLikedArticles = async (userId, { limit, cursor = null }) => {
  const likedArticles = await models.ArticleLikes.findAll({
    attributes: ["createdAt"],
    where: { likedUserId: userId },
    include: {
      model: models.Articles,
      as: "article",
      where: {
        ...(cursor && { articleId: { [Op.lt]: cursor } }), // 커서 조건: articleId 기준
      },
      order: [["createdAt", "DESC"]],
      limit: limit + 1, // 조회 개수 제한
      required: true, // 게시글이 없으면 안됨
      include: [
        {
          model: models.ArticleComments,
          as: "articleComments",
          attributes: ["commentId"],
          where: { status: { [Op.ne]: "deleted" } },
          required: false,
        },
        {
          model: models.ArticleLikes,
          as: "articleLikes",
          attributes: ["likedUserId"],
          required: false,
        },
        {
          model: models.ArticleImages,
          as: "articleImages",
          attributes: ["imageUrl", "sequence"],
          where: { sequence: 1 },
          limit: 1,
          required: false,
        },
      ],
    },
    order: [["createdAt", "DESC"]],
  });

  // 게시글만 추출
  const articles = likedArticles.articles;

  // 좋아요, 댓글 수 및 썸네일만을 반환하도록 가공
  articles.map((article) => {
    article = article.dataValues;
    article.articleComments = article.articleComments.length; // 댓글 개수만 추출
    article.articleLikes = article.articleLikes.length; // 좋아요 개수만 추출
    if (article.articleImages.length > 0) {
      article.articleImages = addBaseUrl(article.articleImages[0].imageUrl); // 대표 이미지 URL
    } else {
      article.articleImages = null;
    }
    article.thumbnail = article.articleImages;
    delete article.articleImages;
  });

  // 다음 커서 설정
  const hasNextPage = articles.length > limit; // limit + 1개를 가져왔으면 다음 페이지 있음
  const nextCursor = hasNextPage ? articles[limit - 1].articleId : null;
  if (hasNextPage) {
    articles.pop(); // limit + 1개를 가져왔으면 마지막 요소는 버림
  }

  logger.debug("게시글 조회 완료", {
    action: "community:getLikedArticles",
    actionType: "success",
    data: {
      communityId: communityId,
      articleCount: articles.length,
      limit: limit,
      nextCursor: nextCursor,
      hasNextPage: hasNextPage,
    },
  });

  return {
    articles,
    nextCursor,
    hasNextPage,
  };
};
