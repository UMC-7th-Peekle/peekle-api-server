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
  // 게시글 조회
  const article = await models.Articles.findOne({
    where: {
      articleId,
    },
  });
  // 게시글이 존재하지 않는 경우
  if (!article) {
    logger.error(
      `[createComment] 게시글이 존재하지 않음 - communityId: ${communityId}, articleId: ${articleId}`
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
  // 댓글 조회
  const comment = await models.ArticleComments.findOne({
    where: {
      articleId,
      commentId,
      authorId,
    },
  });

  if (!comment) {
    logger.error(
      `[updateComment] 댓글이 존재하지 않음 - commentId: ${commentId}`
    );
    throw new NotExistsError("댓글이 존재하지 않습니다");
  }

  // 댓글 작성자와 요청자가 다른 경우
  // toString()으로 타입 변환 후 strict 하게 비교하도록 수정했습니다.
  if (authorId.toString() !== comment.authorId.toString()) {
    logger.error(
      `[updateComment] 댓글 수정 권한 없음 - 요청자: ${authorId}, 작성자: ${comment.authorId}`
    );
    throw new NotAllowedError("댓글 작성자만 수정할 수 있습니다");
  }
  // 댓글 수정
  await comment.update({ content });

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
  // 댓글 조회
  const comment = await models.ArticleComments.findOne({
    where: {
      articleId,
      commentId,
      authorId,
    },
  });

  if (!comment) {
    logger.error(
      `[deleteComment] 댓글이 존재하지 않음 - commentId: ${commentId}`
    );
    throw new NotExistsError("댓글이 존재하지 않습니다");
  }

  // 댓글 작성자와 요청자가 다른 경우
  // toString()으로 타입 변환 후 strict 하게 비교하도록 수정했습니다.
  if (authorId.toString !== comment.authorId.toString()) {
    logger.error(
      `[deleteComment] 댓글 삭제 권한 없음 - 요청자: ${authorId}, 작성자: ${comment.authorId}`
    );
    throw new NotAllowedError("댓글 작성자만 삭제할 수 있습니다");
  }

  // 댓글 삭제
  await comment.destroy();
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
    logger.error(
      `[createCommentReply] 댓글 생성 실패 - parentCommentId: ${commentId}`
    );

    throw new NotExistsError("댓글이 존재하지 않습니다");
  }


  return { comment };
};
