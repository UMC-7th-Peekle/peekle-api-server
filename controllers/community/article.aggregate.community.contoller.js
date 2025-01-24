// Description: 커뮤니티의 게시글에 대한 집계를 다루는 컨트롤러 파일입니다.
import * as articleAggregateService from "../../services/community/article.aggregate.community.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

// 인기 게시글 조회
export const getPopularArticles = async (req, res, next) => {
  try {
    const { communityId } = req.params; // URL에서 communityId 추출
    const { startTime, endTime } = req.query; // 쿼리 파라미터에서 startTime과 endTime 추출

    const { articles } = await articleAggregateService.getPopularArticles(
      communityId,
      startTime,
      endTime
    );

    // 인기 게시글이 없는 경우
    if (!articles || articles.length === 0) {
      return res.status(204).json({ message: "No popular articles found." }); // 204 응답
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
