// Description: 댓글 관련 조회, 생성, 수정, 삭제와 관련된 컨트롤러 파일입니다.
import commentService from "../../services/community/comment.community.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

// 댓글 생성
export const createComment = async (req, res, next) => {
  try {
    // 입력 형식 검증은 완료된 상태로 들어온다고 가정.
    // 사용자 인증 검증
    const { communityId, articleId } = req.params; // URL에서 communityId, articleId 추출
    const { content } = req.body; // Request body에서 content 추출
    //const authorId = req.user.userId; // JWT에서 사용자 ID 추출
    var authorId = 1; // 임시로 사용자 ID를 1로 설정

    const comment = await commentService.createComment(
      communityId,
      articleId,
      authorId,
      content
    ); // 댓글 생성

    return res.status(201).json({
      message: "댓글 작성 성공",
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

// 댓글 수정
export const updateComment = async (req, res, next) => {
  try {
    // 입력 형식 검증은 완료된 상태로 들어온다고 가정.
    // 사용자 인증 검증
    const { communityId, articleId, commentId } = req.params; // URL에서 communityId, articleId, commentId 추출
    const { content } = req.body; // Request body에서 content 추출
    //const authorId = req.user.userId; // JWT에서 사용자 ID 추출
    var authorId = 1; // 임시로 사용자 ID를 1로 설정

    const comment = await commentService.updateComment(
      communityId,
      articleId,
      commentId,
      authorId,
      content
    ); // 댓글 수정

    return res.status(200).json({
      message: "댓글 수정 성공",
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

// 댓글 삭제
export const deleteComment = async (req, res, next) => {
  try {
    // 사용자 인증 검증
    const { communityId, articleId, commentId } = req.params; // URL에서 communityId, articleId, commentId 추출
    //const authorId = req.user.userId; // JWT에서 사용자 ID 추출
    var authorId = 1; // 임시로 사용자 ID를 1로 설정

    await commentService.deleteComment(
      communityId,
      articleId,
      commentId,
      authorId
    ); // 댓글 삭제

    return res.status(200).json({
      message: "댓글 삭제 성공",
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

// 대댓글 생성
export const createCommentReply = async (req, res, next) => {
  try {
    // 입력 형식 검증은 완료된 상태로 들어온다고 가정.
    // 사용자 인증 검증
    const { communityId, articleId, commentId } = req.params; // URL에서 communityId, articleId, commentId 추출
    const { content } = req.body; // Request body에서 content 추출
    //const authorId = req.user.userId; // JWT에서 사용자 ID 추출
    var authorId = 1; // 임시로 사용자 ID를 1로 설정

    const comment = await commentService.createCommentReply(
      articleId,
      commentId,
      authorId,
      content
    ); // 대댓글 생성

    return res.status(201).json({
      message: "대댓글 작성 성공",
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

export default {
  createComment,
  updateComment,
  deleteComment,
  createCommentReply,
};
