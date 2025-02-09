// Description: 게시글 신고와 관련된 컨트롤러 파일입니다.
import * as reportService from "../../services/community/report.community.service.js";
import { InvalidInputError } from "../../utils/errors/errors.js";
import { logError } from "../../utils/handlers/error.logger.js";

export const reportArticle = async (req, res, next) => {
  // 형식 검증은 완료된 상태로 들어온다고 가정.
  try {
    const { communityId, articleId, reason } = req.body;
    const reportedUserId = req.user.userId;

    if (!reason) {
      throw new InvalidInputError("신고 사유를 입력해주세요.");
    }

    const { newReport } = await reportService.reportTarget({
      targetType: "article",
      communityId,
      articleId,
      reportedUserId,
      reason,
    });

    res.status(201).success({
      message: "게시글 신고 성공",
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

export const reportComment = async (req, res, next) => {
  try {
    const { communityId, articleId, commentId, reason } = req.body;
    const reportedUserId = req.user.userId;

    if (!reason) {
      throw new InvalidInputError("신고 사유를 입력해주세요.");
    }

    const { newReport } = await reportService.reportTarget({
      targetType: "comment",
      communityId,
      articleId,
      commentId,
      reportedUserId,
      reason,
    });

    res.status(201).success({
      message: "댓글 신고 성공",
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};
