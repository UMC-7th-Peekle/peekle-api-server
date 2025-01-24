// Description: 댓글 신고와 관련된 컨트롤러 파일입니다.
import * as commentReportService from "../../services/community/comment.report.community.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

export const reportComment = async (req, res, next) => {
  try {
    const { communityId, articleId, commentId } = req.params;
    const { reason } = req.body;
    const reportedUserId = req.user.userId;

    const { commentReport } = await commentReportService.reportComment({
      communityId,
      articleId,
      commentId,
      reportedUserId,
      reason,
    });

    res.status(201).success({
      message: "댓글 신고 성공",
      commentReport,
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};