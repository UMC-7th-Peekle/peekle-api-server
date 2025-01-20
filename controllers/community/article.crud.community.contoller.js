// Description: 게시글 관련 조회, 생성, 수정, 삭제와 관련된 컨트롤러 파일입니다.
import articleCrudService from "../../services/community/article.crud.community.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

// 게시글 조회
// 댓글 가져오는 로직 추가해야 함
export const getArticleById = async (req, res, next) => {
  try {
    const { communityId, articleId } = req.params; // URL에서 communityId, articleId 추출

    const article = await articleCrudService.getArticleById(communityId, articleId); // 게시글 조회

    // 게시글이 존재하는 경우
    return res.status(200).json({
      // 200: OK
      message: "게시글 조회 성공",
      article,
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

// 게시글 생성
export const createArticle = async (req, res, next) => {
  try {
    // 사용자 인증 검증 & 형식 검증 필요
    const { communityId } = req.params; // URL에서 communityId 추출
    const { title, content } = req.body; // Request body에서 title, content 추출
    //const authorId = req.user.userId; // JWT에서 사용자 ID 추출
    var authorId = 1; // 임시로 사용자 ID를 1로 설정

    const article = await articleCrudService.createArticle(
      communityId,
      authorId,
      title,
      content
    ); // 게시글 생성

    return res.status(201).json(article).json({
      message: "게시글 작성 성공",
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

// 게시글 수정
export const updateArticle = async (req, res, next) => {
  // 사용자 인증 검증 & 입력 형식 검증 필요
  try {
    const { communityId, articleId } = req.params; // URL에서 communityId, articleId 추출
    const { title, content } = req.body; // Request body에서 title, content 추출
    //const authorId = req.user.userId; // JWT에서 사용자 ID 추출
    var authorId = 1; // 임시로 사용자 ID를 1로 설정

    const article = await articleCrudService.updateArticle(
      communityId,
      articleId,
      authorId,
      title,
      content
    ); // 게시글 수정

    return res.status(200).json(article).json({
      message: "게시글 수정 성공",
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

// 게시글 삭제
export const deleteArticle = async (req, res, next) => {
  // 사용자 인증 검증 필요
  try {
    const { communityId, articleId } = req.params; // URL에서 communityId, articleId 추출
    //const authorId = req.user.userId; // JWT에서 사용자 ID 추출
    var authorId = 1; // 임시로 사용자 ID를 1로 설정

    await articleCrudService.deleteArticle(communityId, articleId, authorId); // 게시글 삭제

    return res.status(200).json({
      message: "게시글 삭제 성공",
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

export default {
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
