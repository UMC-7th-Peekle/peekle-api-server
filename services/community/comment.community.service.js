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

  // 테스트 코드에서 Mock으로 처리하는 부분은 DB의 FK 제약을 테스트하기 어려우므로 이 부분 다시 추가
  if (!article) {
    throw new NotExistsError("해당 게시글이 존재하지 않습니다");
  }

  let comment;
  /* try-catch 블록 외부에서 comment 선언
  try-catch 블록 내부에서 comment를 생성하고 반환하면
  "comment is not defined" 에러가 발생합니다.
  */
  // 댓글 생성
  try {
    comment = await models.ArticleComments.create({
      articleId,
      authorId,
      content,
      status: "active",
      isAnonymous,
    });
  } catch (error) {
    if (error instanceof models.Sequelize.ForeignKeyConstraintError) {
      logger.error(
        `[createComment] 게시글이 존재하지 않음 - articleId: ${articleId}`
      );
      throw new NotExistsError("해당 게시글이 존재하지 않습니다");
    }
    throw error;
  }

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
  isAnonymous,
}) => {
  // 댓글 조회
  const comment = await models.ArticleComments.findOne({
    where: {
      articleId,
      commentId,
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
  await comment.update({ content, isAnonymous });

  return { comment };
};

/**
 * 대댓글이 달려있는지 확인합니다.
 */
export const hasReplies = async (commentId) => {
  const replyCount = await models.ArticleComments.count({
    where: { parentCommentId: commentId },
  });
  return replyCount > 0;
};

/**
 * 댓글이 존재 여부와 댓글 작성자 여부를 확인합니다.
 */
export const validateAndFindComment = async ({
  articleId,
  commentId,
  authorId,
}) => {
  // 댓글 조회
  const comment = await models.ArticleComments.findOne({
    where: {
      articleId,
      commentId,
    },
  });

  if (!comment || comment.status === "deleted") {
    logger.error(
      `[deleteComment] 댓글이 존재하지 않음 - commentId: ${commentId}`
    );
    throw new NotExistsError("댓글이 존재하지 않습니다");
  }

  // 댓글 작성자와 요청자가 다른 경우
  // toString()으로 타입 변환 후 strict 하게 비교하도록 수정했습니다.
  if (authorId.toString() !== comment.authorId.toString()) {
    logger.error(
      `[deleteComment] 댓글 삭제 권한 없음 - 요청자: ${authorId}, 작성자: ${comment.authorId}`
    );
    throw new NotAllowedError("댓글 작성자만 삭제할 수 있습니다");
  }

  return comment;
};
/**
 * communityId, articleId, commentId에 해당하는 댓글을 삭제합니다.
 */
export const deleteComment = async ({ articleId, commentId, authorId }) => {
  // 댓글 조회 및 작성자 확인
  const comment = await validateAndFindComment({
    articleId,
    commentId,
    authorId,
  });
  // 댓글 삭제
  await comment.destroy();
};

/**
 * communityId, articleId, commentId에 해당하는 댓글의 status를 "deleted"로 변경합니다
 */
export const softDeleteComment = async ({ articleId, commentId, authorId }) => {
  // 댓글 조회 및 작성자 확인
  const comment = await validateAndFindComment({
    articleId,
    commentId,
    authorId,
  });
  // 댓글 상태를 "deleted"로 변경
  await models.ArticleComments.update(
    { status: "deleted" },
    { where: { commentId: commentId } }
  );
};

/**
 * communityId, articleId, commentId에 해당하는 댓글의 대댓글 ID를 조회합니다
 */
export const getParentCommentId = async (commentId) => {
  const comment = await models.ArticleComments.findOne({
    attributes: ["parentCommentId"],
    where: { commentId },
  });
  return comment ? comment.parentCommentId : null;
};

/**
 * parentCommentId에 해당하는 댓글의 대댓글을 조회하고, 대댓글이 없는 경우 부모 댓글을 삭제해야 하는지 확인합니다
 */
const checkParentCommentStatusAndReplies = async (parentCommentId) => {
  const parentComment = await models.ArticleComments.findOne({
    where: { commentId: parentCommentId },
  });
  // 부모 댓글 자체가 존재하지 않거나 부모 댓글이 있지만 삭제되지 않은 경우
  if (!parentComment || parentComment.status !== "deleted") {
    return false;
  }

  const replyCount = await models.ArticleComments.count({
    where: { parentCommentId: parentCommentId },
  });

  return replyCount === 1; // 부모 댓글에 남은 대댓글이 유일한 경우
};

/**
 * parentCommentId에 해당하는 댓글의 대댓글을 삭제합니다.
 */
export const deleteReply = async ({
  articleId,
  commentId,
  parentCommentId,
  authorId,
}) => {
  const comment = await validateAndFindComment({
    articleId,
    commentId,
    authorId,
  });

  // 부모 댓글을 삭제해야 하는지 확인
  const shouldDeleteParent =
    await checkParentCommentStatusAndReplies(parentCommentId);

  if (shouldDeleteParent) {
    // 부모 댓글과 대댓글을 함께 삭제 (ON DELETE CASCADE 적용)
    await models.ArticleComments.destroy({
      where: { commentId: parentCommentId },
    });
  } else {
    // 대댓글만 삭제
    await models.ArticleComments.destroy(
      { where: { commentId: commentId } }
    );
  }
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
  let comment;
  try {
    comment = await models.ArticleComments.create({
      articleId,
      parentCommentId: commentId,
      authorId,
      content,
      status: "active",
      isAnonymous,
    });
  } catch (error) {
    if (error instanceof models.Sequelize.ForeignKeyConstraintError) {
      logger.error(
        `[createCommentReply] 해당 댓글이 존재하지 않음 - parentCommentId: ${commentId}`
      );
      throw new NotExistsError("해당 댓글이 존재하지 않습니다");
    }
    throw error;
  }

  return { comment };
};

/**
 * communityId, articleId에 해당하는 댓글 목록을 조회합니다
 */
export const getComments = async ({ communityId, articleId, userId }) => {
  const articleWithComments = await models.Articles.findOne({
    where: {
      communityId,
      articleId,
    },
    include: [
      {
        model: models.ArticleComments,
        as: "articleComments",
        include: [
          {
            model: models.Users,
            as: "author",
            attributes: ["userId", "nickname", "profileImage"],
          },
          {
            model: models.ArticleCommentLikes, // 댓글 좋아요 모델 추가
            as: "articleCommentLikes",
            attributes: ["likedUserId"], // 좋아요를 누른 사용자 ID
          },
        ],
      },
    ],
  });

  // 게시글이 없는 경우 404 에러 반환
  if (!articleWithComments) {
    logger.error(
      `[getComments] 게시글이 존재하지 않음 - communityId: ${communityId}, articleId: ${articleId}`
    );
    throw new NotExistsError("게시글이 존재하지 않습니다");
  }

  // 댓글 정보에 좋아요 여부, 좋아요 개수 및 작성자 정보 추가
  const transformedComments = articleWithComments.articleComments.map(
    (comment) => {
      const { author, articleCommentLikes, ...commentData } =
        comment.dataValues;

      const isCommentLikedByUser = userId
        ? articleCommentLikes.some((like) => like.likedUserId === userId)
        : false;
      const commentLikesCount = articleCommentLikes.length;

      return {
        authorInfo: author,
        isLikedByUser: isCommentLikedByUser,
        commentLikesCount, // 댓글 좋아요 개수
        ...commentData,
      };
    }
  );
  return {
    comments: transformedComments,
  };
};
