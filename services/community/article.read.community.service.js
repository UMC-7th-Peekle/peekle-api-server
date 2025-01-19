// Description: 게시글 목록 조회를 위한 서비스 파일입니다.
import {
  InvalidInputError,
  NotExistsError,
} from "../../utils/errors/errors.js";
import db from "../../models/index.js";
import { Op } from "sequelize";

/**
 * communityId에 해당하는 게시판의 게시글들을 가져옵니다
 */
export const getArticles = async (communityId, { limit, cursor = null }) => {
  try {
    // 게시글 목록 조회
    const articles = await db.Articles.findAll({
      where: {
        communityId, // communityId가 일치하는 게시글만 조회
        ...(cursor && { createdAt: { [Op.lt]: cursor } }), // cursor 조건이 있을 경우 추가 (스프레드 연산자)
      },
      order: [["createdAt", "DESC"]], // createdAt 활용하여 최신순 정렬
      limit, // limit 개수만큼 조회
    });

    if (articles.length === 0) {
      // 게시글이 존재하지 않는 경우
      throw new Error("게시글이 존재하지 않습니다"); // 204
    }

    // 다음 커서 계산: 현재 페이지에 게시글이 하나 이상 있으면 게시글의 마지막 항목의 createdAt을 다음 커서로 사용
    const nextCursor =
      articles.length > 0 ? articles[articles.length - 1].createdAt : null;

    return {
      articles,
      nextCursor, // 다음 커서 반환
    };
  } catch (error) {
    throw error;
  }
};

/**
 * communityId에 해당하는 게시판의 게시글들 중 검색어를 포함하는 게시글을 가져옵니다
 */
export const searchArticles = async (communityId, query, { limit, cursor = null }) => {
  try {
    // 검색어 형식 검증

    // 게시글 검색
    const articles = await db.Articles.findAll({
      where: {
        communityId,
        title: {
          [Op.like]: `%${query}%`, // 검색어 포함된 제목 검색
        },
        ...(cursor && { createdAt: { [Op.lt]: cursor } }), // 커서 조건 추가
      },
      order: [["createdAt", "DESC"]], // 최신순 정렬
      limit, // limit 개수만큼 조회
    });

    if (articles.length === 0) {
      // 게시글이 존재하지 않는 경우
      throw new Error("게시글이 존재하지 않습니다"); // 204
    }
    // 다음 커서 계산: 마지막 게시글의 createdAt 값
    const nextCursor =
      articles.length > 0 ? articles[articles.length - 1].createdAt : null;

    return {
      articles, // 현재 페이지의 게시글 목록
      nextCursor, // 다음 페이지 요청에 사용할 커서
    };
  } catch (error) {
    throw error;
  }
};

export default {
  getArticles,
  searchArticles,
};
