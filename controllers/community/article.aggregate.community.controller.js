// Description: 커뮤니티의 게시글에 대한 집계를 다루는 컨트롤러 파일입니다.
import * as articleAggregateService from "../../services/community/article.aggregate.community.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";

// 인기 게시글 조회
export const getPopularArticles = async (req, res, next) => {
  try {
    const { communityId } = req.params; // URL에서 communityId 추출

    articleAggregateService.validateStatisticsQuery(req.query); // 쿼리 파라미터 검증
    const { startTime, endTime } = req.query; // 쿼리 파라미터에서 startTime과 endTime 추출

    const threeHoursAgo = new Date(
      Date.now() - 3 * 60 * 60 * 1000
    ).toISOString();

    const isoStartTime = startTime
      ? new Date(startTime).toISOString()
      : threeHoursAgo;
    const isoEndTime = endTime
      ? new Date(endTime).toISOString()
      : new Date().toISOString();

    logger.debug("인기 게시글 조회 요청", {
      action: "article:getPopularArticles",
      actionType: "request",
      data: {
        communityId,
        input: { startTime, endTime },
        modified: { isoStartTime, isoEndTime },
      },
    });

    const { articles } = await articleAggregateService.getPopularArticles(
      communityId,
      isoStartTime,
      isoEndTime
    );

    // 인기 게시글이 없는 경우
    if (!articles || articles.length === 0) {
      return res.status(204).end(); // 204 응답
    }

    // 인기 게시글이 있는 경우
    return res.status(200).success({
      message: "인기 게시글 조회 성공",
      articles,
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};
