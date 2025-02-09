// Description: 게시글 신고와 관련된 서비스 파일입니다.
import {
  NotAllowedError,
  AlreadyExistsError,
  NotExistsError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";

/**
 * 게시글이 존재하는지 확인합니다.
 */
const checkTargetExists = async (
  targetType,
  targetId,
  communityId,
  articleId
) => {
  let target;
  if (targetType === "article") {
    target = await models.Articles.findOne({
      where: { communityId, articleId: targetId }, // 게시글은 communityId와 articleId로 조회
    });
  } else if (targetType === "comment") {
    target = await models.ArticleComments.findOne({
      where: { articleId, commentId: targetId }, // 댓글은 articleId와 commentId로 조회
    });
  }

  if (!target) {
    throw new NotExistsError(`존재하지 않는 ${targetType}입니다.`);
  }
  return target;
};

/**
 * 이미 신고한 게시글인지 확인합니다.
 */
const checkIfAlreadyReported = async (targetId, reportedUserId, type) => {
  const isReported = await models.Reports.findOne({
    where: { targetId, reportedUserId, type },
  });

  if (isReported) {
    throw new AlreadyExistsError(
      `이미 신고한 ${type === "article" ? "게시글" : "댓글"}입니다.`
    );
  }
};

/**
 * 게시글을 신고합니다.
 */
const createReport = async ({ targetId, reportedUserId, reason, type }) => {
  return await models.Reports.create({
    targetId,
    reportedUserId,
    reason,
    type,
  });
};

/**
 * 게시글 및 댓글을 신고합니다.
 */
export const reportTarget = async ({
  targetType,
  communityId,
  articleId,
  commentId = null,
  reportedUserId,
  reason,
}) => {
  const targetId = targetType === "article" ? articleId : commentId;

  await checkTargetExists(targetType, targetId, communityId, articleId);

  if (targetType === "article") {
    const article = await models.Articles.findOne({ where: { articleId } });
    if (article.authorId === reportedUserId) {
      throw new NotAllowedError("자신이 작성한 게시글은 신고할 수 없습니다.");
    }
  } else if (targetType === "comment") {
    const comment = await models.ArticleComments.findOne({
      where: { commentId },
    });
    if (comment.authorId === reportedUserId) {
      throw new NotAllowedError("자신이 작성한 댓글은 신고할 수 없습니다.");
    }
  }

  await checkIfAlreadyReported(targetId, reportedUserId, targetType);

  const newReport = await createReport({
    targetId,
    reportedUserId,
    reason,
    type: targetType,
  });

  return { newReport };
};
