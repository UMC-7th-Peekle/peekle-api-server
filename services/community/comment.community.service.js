// Description: 댓글 관련 조회, 생성, 수정, 삭제와 관련된 서비스 파일입니다.
import {
  InvalidInputError,
  NotAllowedError,
  NotExistsError,
  UnauthorizedError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";

/**
 * communityId, articleId에 해당하는 게시글에 댓글을 추가합니다
 */
export const createComment = async ({
  communityId, // 현재는 사용하지는 않음
  articleId,
  authorId,
  content,
  isAnonymous = true,
}) => {
  // TODO : 형식 검증 필요
  logger.info(
    `[createComment] 댓글 생성 요청 - articleId: ${articleId}, authorId: ${authorId}`
  );

  // 게시글 조회
  const article = await models.Articles.findOne({
    where: {
      articleId,
    },
  });
  // 게시글이 존재하지 않는 경우
  if (!article) {
    logger.warn(
      `[createComment] 게시글이 존재하지 않음 - articleId: ${articleId}`
    );
    throw new NotExistsError("게시글이 존재하지 않습니다");
  }

  // 댓글 생성
  const comment = await models.ArticleComments.create({
    articleId,
    authorId,
    content,
    status: "active",
    isAnonymous,
  });

  logger.debug(
    `[createComment] 댓글 생성 성공 - commentId: ${comment.commentId}`
  );

  return { comment };
};

/**
 * communityId, articleId, commentId에 해당하는 댓글을 수정합니다
 */
export const updateComment = async ({
  communityId, // 현재는 사용하지는 않음
  articleId,
  commentId,
  authorId,
  content,
}) => {
  // 형식 검증 필요
  logger.info(
    `[updateComment] 댓글 수정 요청 - articleId: ${articleId}, commentId: ${commentId}, authorId: ${authorId}`
  );

  // 댓글 조회
  const comment = await models.ArticleComments.findOne({
    where: {
      articleId,
      commentId,
      authorId,
    },
  });

  if (!comment) {
    logger.warn(
      `[updateComment] 댓글이 존재하지 않음 - commentId: ${commentId}`
    );
    throw new NotExistsError("댓글이 존재하지 않습니다");
  }

  if (authorId != comment.authorId) {
    logger.warn(
      `[updateComment] 댓글 수정 권한 없음 - 요청자: ${authorId}, 작성자: ${comment.authorId}`
    );
    throw new NotAllowedError("댓글 작성자만 수정할 수 있습니다");
  }
  // 댓글 수정
  await comment.update({ content });

  logger.debug(`[updateComment] 댓글 수정 성공 - commentId: ${commentId}`);

  return { comment };
};

/**
 * communityId, articleId, commentId에 해당하는 댓글을 삭제합니다.
 */
export const deleteComment = async ({
  communityId, // 현재는 사용하지는 않음
  articleId,
  commentId,
  authorId,
}) => {
  logger.info(
    `[deleteComment] 댓글 삭제 요청 - articleId: ${articleId}, commentId: ${commentId}, authorId: ${authorId}`
  );

  // 댓글 조회
  const comment = await models.ArticleComments.findOne({
    where: {
      articleId,
      commentId,
      authorId,
    },
  });

  if (!comment) {
    logger.warn(
      `[deleteComment] 댓글이 존재하지 않음 - commentId: ${commentId}`
    );
    throw new NotExistsError("댓글이 존재하지 않습니다");
  }
  if (authorId !== comment.authorId) {
    logger.warn(
      `[deleteComment] 댓글 삭제 권한 없음 - 요청자: ${authorId}, 작성자: ${comment.authorId}`
    );
    throw new NotAllowedError("댓글 작성자만 삭제할 수 있습니다");
  }

  // 댓글 삭제
  await comment.destroy();

  logger.debug(`[deleteComment] 댓글 삭제 성공 - commentId: ${commentId}`);
};

/**
 * communityId, articleId, commentId에 해당하는 댓글에 대댓글을 작성합니다
 */
export const createCommentReply = async ({
  articleId,
  commentId,
  authorId,
  content,
  isAnonymous = true,
}) => {
  // 형식 검증 필요
  logger.info(
    `[createCommentReply] 대댓글 생성 요청 - articleId: ${articleId}, parentCommentId: ${commentId}, authorId: ${authorId}`
  );

  // 댓글 생성

  const comment = await models.ArticleComments.create({
    articleId,
    parentCommentId: commentId,
    authorId,
    content,
    status: "active",
    isAnonymous,
  });

  if (!comment) {
    logger.warn(
      `[createCommentReply] 댓글 생성 실패 - parentCommentId: ${commentId}`
    );

    throw new NotExistsError("댓글이 존재하지 않습니다");
  }

  logger.debug(
    `[createCommentReply] 대댓글 생성 성공 - commentId: ${comment.commentId}`
  );

  return { comment };
};
