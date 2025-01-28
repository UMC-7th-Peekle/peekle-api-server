// Description: 댓글 관련 조회, 생성, 수정, 삭제와 관련된 컨트롤러 파일입니다.
import * as commentService from "../../services/community/comment.community.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

// 댓글 생성
export const createComment = async (req, res, next) => {
  try {
    // 입력 형식 검증은 완료된 상태로 들어온다고 가정.
    const { communityId, articleId, content, isAnonymous } = req.body;
    const authorId = req.user.userId; // JWT에서 사용자 ID 추출

    const comment = await commentService.createComment({
      communityId,
      articleId,
      authorId,
      content,
      isAnonymous,
    }); // 댓글 생성

    return res.status(201).success({
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
    const { communityId, articleId, commentId, content, isAnonymous } =
      req.body;
    const authorId = req.user.userId; // JWT에서 사용자 ID 추출

    const comment = await commentService.updateComment({
      communityId,
      articleId,
      commentId,
      authorId,
      content,
      isAnonymous,
    }); // 댓글 수정 (현재는 response에 article을 넣지 않지만, 추후에 넣을 상황이 생길 수도 있는 것을 고려해 article을 반환 받는 식으로 작성)

    return res.status(200).success({
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
    const { communityId, articleId, commentId } = req.body; // URL에서 communityId, articleId, commentId 추출
    const authorId = req.user.userId; // JWT에서 사용자 ID 추출

    await commentService.deleteComment({
      communityId,
      articleId,
      commentId,
      authorId,
    }); // 댓글 삭제

    return res.status(200).success({
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
    const { communityId, articleId, commentId, content, isAnonymous } =
      req.body;
    const authorId = req.user.userId; // JWT에서 사용자 ID 추출

    await commentService.createCommentReply({
      articleId,
      commentId,
      authorId,
      content,
      isAnonymous,
    }); // 대댓글 생성 (현재는 response에 article을 넣지 않지만, 추후에 넣을 상황이 생길 수도 있는 것을 고려해 article을 반환 받는 식으로 작성)

    return res.status(201).success({
      message: "대댓글 작성 성공",
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

// 댓글 조회
export const getComments = async (req, res, next) => {
  try {
    const { communityId, articleId } = req.body; // URL에서 communityId, articleId 추출

    const { comments } = await commentService.getComments({
      communityId,
      articleId,
    }); // 댓글 조회

    if (comments && comments.length === 0) {
      return res.status(204).end(); // 응답 본문 없이 204 반환
    }
    return res.status(200).success({
      message: "댓글 조회 성공",
      comments,
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};
