// Description: 게시글 신고와 관련된 컨트롤러 파일입니다.
import * as articleReportService from "../../services/community/article.report.community.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

export const reportArticle = async (req, res, next) => {
  // 형식 검증은 완료된 상태로 들어온다고 가정.
  try {
    const { communityId, articleId } = req.params;
    const { reason } = req.body;
    const reportedUserId = req.user.userId;

    const { articleReport } = await articleReportService.reportArticle({
      communityId,
      articleId,
      reportedUserId,
      reason,
    });

    res.status(201).success({
      message: "게시글 신고 성공",
      articleReport,
  });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};
