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
  const community = await models.Communities.findOne({
    // 게시판 조회
    where: {
      communityId,
    },
    include: [
      {
        model: models.Articles,
        as: "articles",
        where: {
          ...(cursor && { createdAt: { [Op.lt]: cursor } }), // 커서 조건이 있을 경우 추가
        },
        order: [["createdAt", "DESC"]], // 최신순 정렬
        limit, // 조회 개수 제한
        required: false, // 게시글이 없는 경우에도 커뮤니티는 반환
      },
    ],
  });

  if (!community) {
    // 게시판이 존재하지 않는 경우
    throw new NotExistsError("게시판이 존재하지 않습니다");
  }

// 게시글만 추출
  const articles = community.articles;

  const nextCursor =
    articles.length > 0 ? articles[articles.length - 1].createdAt : null;

  return {
    articles,
    nextCursor,
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
  // 게시글 검색
  const community = await models.Communities.findOne({
    where: {
      communityId,
    },
    include: [
      {
        model: models.Articles,
        as: "articles",
        where: {
          title: {
            [Op.like]: `%${query}%`, // 검색어 포함된 제목 검색
          },
          ...(cursor && { createdAt: { [Op.lt]: cursor } }), // 커서 조건이 있을 경우 추가
        },
        order: [["createdAt", "DESC"]], // 최신순 정렬
        limit, // 조회 개수 제한
        required: false, // 게시글이 없는 경우에도 커뮤니티는 반환
      },
    ],
  });

  if (!community) {
    // 게시판이 존재하지 않는 경우
    throw new NotExistsError("게시판이 존재하지 않습니다");
  }

// 게시글만 추출
  const articles = community.articles;
  
  // 다음 커서 계산: 마지막 게시글의 createdAt 값
  const nextCursor =
    articles.length > 0 ? articles[articles.length - 1].createdAt : null;

  return {
    articles, // 현재 페이지의 게시글 목록
    nextCursor, // 다음 페이지 요청에 사용할 커서
  };
};
