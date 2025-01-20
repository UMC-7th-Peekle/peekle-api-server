// Description: 댓글 관련 조회, 생성, 수정, 삭제와 관련된 서비스 파일입니다.
import {
  InvalidInputError,
  NotAllowedError,
  NotExistsError,
  UnauthorizedError,
} from "../../utils/errors/errors.js";
import db from "../../models/index.js";

/**
 * communityId, articleId에 해당하는 게시글에 댓글을 추가합니다
 */
export const createComment = async (
  communityId,
  articleId,
  authorId,
  content,
  isAnonymous = true
) => {
  try {
    // 사용자 인증 검증 & 형식 검증 필요
    // 댓글 생성
    const status = "active";

    const comment = await db.ArticleComments.create({
      articleId,
      authorId,
      content,
      status,
      isAnonymous,
    });

    return comment;
  } catch (error) {
    throw error;
  }
};

/**
 * communityId, articleId, commentId에 해당하는 댓글을 수정합니다
 */
export const updateComment = async (
  communityId,
  articleId,
  commentId,
  authorId,
  content
) => {
  try {
    // 사용자 인증 검증 & 형식 검증 필요
    // 댓글 조회
    const comment = await db.ArticleComments.findOne({
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
      throw new NotAllowedError("댓글 작성자만 수정할 수 있습니다");
    }
    // 댓글 수정
    if (content) {
      comment.content = content;
    }
    await comment.save();

    return comment;
  } catch (error) {
    throw error;
  }
};

/**
 * communityId, articleId, commentId에 해당하는 댓글을 삭제합니다.
 */
export const deleteComment = async (
  communityId,
  articleId,
  commentId,
  authorId
) => {
  try {
    // 사용자 인증 검증 필요
    // 댓글 조회
    const comment = await db.ArticleComments.findOne({
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

    return comment;
  } catch (error) {
    throw error;
  }
};

/**
 * communityId, articleId, commentId에 해당하는 댓글에 대댓글을 작성합니다
 */
export const createCommentReply = async (
  articleId,
  commentId,
  authorId,
  content,
  isAnonymous = true
) => {
  try {
    // 사용자 인증 검증 & 형식 검증 필요
    // 댓글 생성
    const status = "active";
    const parentCommentId = commentId;

    const comment = await db.ArticleComments.create({
      articleId,
      parentCommentId,
      authorId,
      content,
      status,
      isAnonymous
    });

    if (!comment) {
      throw new NotExistsError("댓글이 존재하지 않습니다");
    }

    return comment;
  } catch (error) {
    throw error;
  }
};

export default {
  createComment,
  updateComment,
  deleteComment,
  createCommentReply,
};
