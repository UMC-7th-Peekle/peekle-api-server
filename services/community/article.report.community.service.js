// Description: 게시글 신고와 관련된 서비스 파일입니다.
import { InvalidInputError, UnauthorizedError, NotAllowedError, AlreadyExistsError, NotExistsError } from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";
import { ar } from "@faker-js/faker";

// 게시글 신고
export const reportArticle = async ({ communityId, articleId, reportedUserId, reason }) => {
  // 게시글 조회
  const article = await models.Articles.findOne({
    where: { communityId, articleId },
  });

  // 게시글이 존재하지 않는 경우: 404
  if (!article) {
    throw new NotExistsError("해당 게시글을 찾을 수 없습니다.");
  }

  // 신고자와 게시글 작성자가 같은 경우: 403
  if (article.authorId === reportedUserId) {
    throw new NotAllowedError("자신이 작성한 게시글은 신고할 수 없습니다.");
  }

  // 신고 내역 조회
  const isReported = await models.Reports.findOne({
    where: { targetId: articleId, reportedUserId, type: "article" },
  });
  
  // 이미 신고한 경우: 409
  if(isReported) {
    throw new AlreadyExistsError("이미 신고한 게시글입니다.");
  }
  
  // 신고 작성
  const newReport = await models.Reports.create({
    targetId: articleId,
    reportedUserId,
    reason,
    type: "article",
  });

  return { newReport };
};
