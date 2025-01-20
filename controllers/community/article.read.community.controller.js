// Description: 게시글 목록 조회와 관련된 컨트롤러 파일입니다.
import articleReadService from "../../services/community/article.read.community.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

// 게시글 목록 조회
export const getArticles = async (req, res, next) => {
  try {
    const { communityId } = req.params; // URL에서 communityId 추출
    const { limit, cursor } = req.query; // 쿼리 파라미터에서 limit와 cursor 추출

    // 페이지네이션 기본값 설정
    const paginationOptions = {
      limit: limit ? parseInt(limit, 10) : 10, // 기본 limit은 10
      cursor: cursor || null, // cursor가 없으면 null
    };

    const { articles, nextCursor } = await articleReadService.getArticles(
      communityId,
      paginationOptions
    );

    // 게시글이 없는 경우 204 응답
    if (articles.length === 0) {
      return res.status(204).send(); // 응답 본문 없이 204 반환
    }
    // 게시글이 있는 경우 200 응답
    return res.status(200).json({
      message: "게시글 목록 조회 성공",
      articles,
      nextCursor,
    });
    
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
}

// 게시글 검색
export const searchArticles = async (req, res, next) => {
  try {
    const { communityId } = req.params; // URL에서 communityId 추출
    const { query } = req.query; // Query에서 search 추출
    const { limit, cursor } = req.query; // 쿼리 파라미터에서 limit와 cursor 추출

    // 페이지네이션 기본값 설정
    const paginationOptions = {
      limit: limit ? parseInt(limit, 10) : 10, // 기본 limit은 10
      cursor: cursor || null, // cursor가 없으면 null
    };

    const { articles, nextCursor } = await articleReadService.searchArticles(
      communityId,
      query,
      paginationOptions
    );

    // 게시글이 없는 경우 204 응답
    if (articles.length === 0) {
      return res.status(204).send(); // 응답 본문 없이 204 반환
    }
    // 게시글이 있는 경우 200 응답
    return res.status(200).json({
      message: "게시글 목록 조회 성공",
      articles,
      nextCursor,
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
}

export default {
  getArticles,
  searchArticles,
};