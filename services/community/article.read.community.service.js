// Description: 게시글 목록 조회를 위한 서비스 파일입니다.
import {
  InvalidInputError,
  NotExistsError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";
import { Op } from "sequelize";

/**
 * communityId에 해당하는 게시판의 게시글들을 가져옵니다
 */
export const getArticles = async (communityId, { limit, cursor = null }) => {
  // 게시판 및 게시글 조회
  const community = await models.Communities.findOne({
    where: { communityId },
    include: [
      {
        model: models.Articles,
        as: "articles",
        where: {
          ...(cursor && { articleId: { [Op.lt]: cursor } }), // 커서 조건: articleId 기준
        },
        order: [["createdAt", "DESC"]], // 최신순 정렬
        limit: limit + 1, // 조회 개수 제한
        required: false, // 게시글이 없는 경우에도 커뮤니티는 반환
      },
    ],
  });

  if (!community) {
    // 게시판이 존재하지 않는 경우
    logger.error(`[getArticles] 존재하지 않는 communityId - ${communityId}`);
    throw new NotExistsError("해당 게시판이 존재하지 않습니다.");
  }

  // 게시글만 추출
  const articles = community.articles;

  logger.debug(
    `[getArticles] 조회된 데이터 개수 - 총 ${articles.length}개, 요청 limit: ${limit}`
  );

  // 다음 커서 설정
  const hasNextPage = articles.length > limit; // limit + 1개를 가져왔으면 다음 페이지 있음
  const nextCursor = hasNextPage ? articles[limit - 1].articleId : null;

  logger.debug(
    `[getArticles] 다음 커서 설정 - nextCursor: ${nextCursor || "커서 없음"}`
  );

  if (hasNextPage) {
    articles.pop(); // limit + 1개를 가져왔으면 마지막 요소는 버림
  }

  return {
    articles,
    nextCursor,
    hasNextPage,
  };
};

/**
 * communityId에 해당하는 게시판의 게시글들 중 검색어를 포함하는 게시글을 가져옵니다
 */
export const searchArticles = async (
  communityId,
  query,
  { limit, cursor = null }
) => {
  // 게시판 및 게시글 조회
  const community = await models.Communities.findOne({
    where: { communityId },
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
        required: false, // 검색 결과가 없는 경우에도 커뮤니티는 반환
      },
    ],
  });

  if (!community) {
    // 커뮤니티가 존재하지 않는 경우
    logger.error(`[searchArticles] 존재하지 않는 communityId - ${communityId}`);
    throw new NotExistsError("해당 게시판이 존재하지 않습니다.");
  }

  // 게시글만 추출
  const articles = community.articles;

  logger.debug(
    `[searchArticles] 조회된 데이터 개수 - 총 ${articles.length}개, 요청 limit: ${limit}`
  );

  // 다음 커서 설정
  const hasNextPage = articles.length > limit; // limit + 1개를 가져왔으면 다음 페이지 있음
  const nextCursor = hasNextPage ? articles[limit - 1].articleId : null;

  logger.debug(
    `[searchArticles] 다음 커서 설정 - nextCursor: ${nextCursor || "커서 없음"}`
  );

  if (hasNextPage) {
    articles.pop(); // limit + 1개를 가져왔으면 마지막 요소는 버림
  }

  return {
    articles,
    nextCursor,
    hasNextPage,
  };
};
