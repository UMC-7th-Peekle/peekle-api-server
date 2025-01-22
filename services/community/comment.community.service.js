// Description: 댓글 관련 조회, 생성, 수정, 삭제와 관련된 서비스 파일입니다.
import {
  InvalidInputError,
  NotAllowedError,
  NotExistsError,
  UnauthorizedError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";

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
  try {
    // TODO : 형식 검증 필요

    try {
      const comment = await models.ArticleComments.create({
        articleId,
        authorId,
        content,
        status: "active",
        isAnonymous,
      });
    } catch (err) {
      if (err instanceof models.Sequelize.ForeignKeyConstraintError) {
        throw new InvalidInputError("존재하지 않는 사용자나 게시글입니다.");
      }
    }

    return { comment };
  } catch (error) {
    throw error;
  }
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
  try {
    // 형식 검증 필요
    // 댓글 조회
    const comment = await models.ArticleComments.findOne({
      where: {
        articleId,
        commentId,
        authorId,
      },
    });

    if (!comment) {
      throw new NotExistsError("댓글이 존재하지 않습니다");
    }

    if (authorId != comment.authorId) {
      throw new NotAllowedError("댓글 작성자만 수정할 수 있습니다");
    }
    // 댓글 수정
    await comment.update({ content });

    return { comment };
  } catch (error) {
    throw error;
  }
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
  try {
    // 댓글 조회
    const comment = await models.ArticleComments.findOne({
      where: {
        articleId,
        commentId,
        authorId,
      },
    });

    if (!comment) {
      throw new NotExistsError("댓글이 존재하지 않습니다");
    }
    if (authorId !== comment.authorId) {
      throw new NotAllowedError("댓글 작성자만 삭제할 수 있습니다");
    }

    // 댓글 삭제
    await comment.destroy();
  } catch (error) {
    throw error;
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
  try {
    // 형식 검증 필요
    // 댓글 생성
    const parentCommentId = commentId;

    const comment = await models.ArticleComments.create({
      articleId,
      parentCommentId,
      authorId,
      content,
      status: "active",
      isAnonymous,
    });

    if (!comment) {
      throw new NotExistsError("댓글이 존재하지 않습니다");
    }

    return { comment };
  } catch (error) {
    throw error;
  }
};
