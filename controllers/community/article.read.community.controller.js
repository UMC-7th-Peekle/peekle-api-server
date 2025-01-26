// Description: 게시글 목록 조회와 관련된 컨트롤러 파일입니다.
import * as articleReadService from "../../services/community/article.read.community.service.js";
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

    const { articles, nextCursor, hasNextPage } =
      await articleReadService.getArticles(communityId, paginationOptions);

    // 게시글이 없는 경우
    if (articles && articles.length === 0) {
      // articles가 존재하지 않거나 길이가 0인 경우, findAll에서는 null이 아니라 빈 배열을 반환
      return res.status(204).end(); // 응답 본문 없이 204 반환
    }
    // 게시글이 있는 경우
    return res.status(200).success({
      message: "게시글 목록 조회 성공",
      articles,
      nextCursor,
      hasNextPage,
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

// 게시글 검색
export const searchArticles = async (req, res, next) => {
  // 입력 형식 검증은 완료된 상태로 들어온다고 가정.
  try {
    const { communityId } = req.params; // URL에서 communityId 추출
    const { query } = req.query; // Query에서 search 추출
    const { limit, cursor } = req.query; // 쿼리 파라미터에서 limit와 cursor 추출

    // 페이지네이션 기본값 설정
    const paginationOptions = {
      limit: limit ? parseInt(limit, 10) : 10, // 기본 limit은 10
      cursor: cursor || null, // cursor가 없으면 null
    };

    const { articles, nextCursor, hasNextPage } =
      await articleReadService.searchArticles(
        communityId,
        query,
        paginationOptions
      );

    // 게시글이 없는 경우
    if (articles.length === 0) {
      return res.status(204).end(); // 응답 본문 없이 204 반환
    }
    // 게시글이 있는 경우
    return res.status(200).success({
      message: "게시글 목록 조회 성공",
      articles,
      nextCursor,
      hasNextPage,
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};
