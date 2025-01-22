// Description: 게시글 목록 조회를 위한 서비스 파일입니다.
import {
  InvalidInputError,
  NotExistsError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import { Op } from "sequelize";

/**
 * communityId에 해당하는 게시판의 게시글들을 가져옵니다
 */
export const getArticles = async (communityId, { limit, cursor = null }) => {
  // 게시판과 게시글을 조인하여 조회
  const whereClause = {
    communityId,
  };

  // where 절에 cursor가 있을 경우 조건을 추가
  if (cursor) {
    whereClause.articleId = { [Op.lt]: cursor }; //articleId가 cursor보다 작은 게시글만 조회
  }

  // 게시글 목록 조회
  const articles = await models.Articles.findAll({
    where: whereClause,
    order: [["createdAt", "DESC"]], // 최신순 정렬
    limit: limit + 1, // limit + 1개 가져오기
  });

  // limit + 1개를 불러왔을 때, 초과한 경우에만 다음 커서 설정
  const nextCursor =
    articles.length > limit
      ? articles[limit - 1]?.articleId // 다음 커서를 limit번째 게시글의 id로 설정
      : null;

  // 사용자에게는 limit 개수만큼만 반환
  if (articles.length > limit) {
    articles.pop(); // 초과분 제거
  }

  return {
    articles,
    nextCursor, // 다음 커서 반환
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
  const whereClause = {
    communityId,
    [Op.or]: [
      {
        title: {
          // 제목에 검색어가 포함된 경우
          [Op.like]: `%${query}%`,
        },
      },
      {
        content: {
          // 내용에 검색어가 포함된 경우
          [Op.like]: `%${query}%`,
        },
      },
    ],
  };

  // where 절에 cursor가 있을 경우 조건을 추가
  if (cursor) {
    whereClause.articleId = { [Op.lt]: cursor }; //articleId가 cursor보다 작은 게시글만 조회
  }

  // 게시글 목록 조회
  const articles = await models.Articles.findAll({
    where: whereClause,
    order: [["createdAt", "DESC"]], // 최신순 정렬
    limit: limit + 1, // limit + 1개 가져오기
  });

  // limit + 1개를 불러왔을 때, 초과한 경우에만 다음 커서 설정
  const nextCursor =
    articles.length > limit
      ? articles[limit - 1]?.articleId // 다음 커서를 limit번째 게시글의 id로 설정
      : null;

  // 사용자에게는 limit 개수만큼만 반환
  if (articles.length > limit) {
    articles.pop(); // 초과분 제거
  }

  return {
    articles, // 현재 페이지의 게시글 목록
    nextCursor, // 다음 페이지 요청에 사용할 커서
  };
};
