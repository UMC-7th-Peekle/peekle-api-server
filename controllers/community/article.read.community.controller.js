// Description: 게시글 목록 조회와 관련된 컨트롤러 파일입니다.
import * as articleReadService from "../../services/community/article.read.community.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";

// 게시글 검색
export const getArticles = async (req, res, next) => {
  // 입력 형식 검증은 완료된 상태로 들어온다고 가정.
  try {
    articleReadService.validateArticleQuery(req.query);
    const { communityId, limit, cursor, query } = req.query; // 쿼리 파라미터에서 limit와 cursor 추출
    const userId = req.user ? req.user.userId : null;  // JWT에서 userId 추출 - 로그인되지 않은 경우를 위한 null

    logger.debug("게시글 목록 조회", {
      action: "article:getArticles",
      actionType: "request",
      communityId,
      limit,
      cursor,
      query,
    });

    // 페이지네이션 기본값 설정
    const paginationOptions = {
      limit: limit ? parseInt(limit, 10) : 10, // 기본 limit은 10
      cursor: cursor || null, // cursor가 없으면 null
    };

    const { articles, nextCursor, hasNextPage } =
      await articleReadService.getArticles(
        communityId,
        query,
        paginationOptions,
        userId
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

export const getLikedArticles = async (req, res, next) => {
  try {
    const { userId } = req.user;

    articleReadService.validateArticleQuery(req.query);
    const { limit, cursor } = req.query; // 쿼리 파라미터에서 limit와 cursor 추출

    // 페이지네이션 기본값 설정
    const paginationOptions = {
      limit: limit ? parseInt(limit, 10) : 10, // 기본 limit은 10
      cursor: cursor || null, // cursor가 없으면 null
    };

    const { articles, nextCursor, hasNextPage } =
      await articleReadService.getLikedArticles(userId, paginationOptions);

    // 게시글이 없는 경우
    if (articles.length === 0) {
      return res.status(204).end(); // 응답 본문 없이 204 반환
    }
    // 게시글이 있는 경우
    return res.status(200).success({
      message: "좋아요한 게시글 목록 조회 성공",
      articles,
      nextCursor,
      hasNextPage,
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};
