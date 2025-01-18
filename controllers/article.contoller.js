// Description: 게시글 관련 조회, 생성, 수정, 삭제와 관련된 컨트롤러 파일입니다.
import articleService from "../services/article.service.js";

// 게시글 조회
export const getArticleById = async (req, res, next) => {
  try {
    const { communityId, articleId } = req.params; // URL에서 communityId, articleId 추출

    const article = await articleService.getArticleById(communityId, articleId); // 게시글 조회

    if (!article) {
      // 게시글이 존재하지 않는 경우
      return res.status(204).json({
        // 204: No Content
        message: "게시글이 존재하지 않습니다",
      });
    }
    // 게시글이 존재하는 경우
    return res.status(200).json({
      // 200: OK
      message: "게시글 조회 성공",
      article,
    });
  } catch (error) {
    next(error); // 에러 핸들러로 전달
  }
};

// 게시글 생성
export const createArticle = async (req, res, next) => {
  try {
    const { communityId } = req.params; // URL에서 communityId 추출
    const { title, content } = req.body; // Request body에서 title, content 추출
    //const authorId = req.user.userId; // JWT에서 사용자 ID 추출
    var authorId = 1; // 임시로 사용자 ID를 1로 설정

    const article = await articleService.createArticle(
      communityId,
      authorId,
      title,
      content
    ); // 게시글 생성

    return res.status(201).json(article).json({
      message: "게시글 작성 성공",
    });
  } catch (error) {
    next(error); // 에러 핸들러로 전달
  }
};

// 게시글 수정
export const updateArticle = async (req, res, next) => {
  try {
    const { communityId, articleId } = req.params; // URL에서 communityId, articleId 추출
    const { title, content } = req.body; // Request body에서 title, content 추출
    //const authorId = req.user.userId; // JWT에서 사용자 ID 추출
    var authorId = 1; // 임시로 사용자 ID를 1로 설정

    const article = await articleService.updateArticle(
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
    next(error); // 에러 핸들러로 전달
  }
};

// 게시글 삭제
export const deleteArticle = async (req, res, next) => {
  try {
    const { communityId, articleId } = req.params; // URL에서 communityId, articleId 추출
    //const authorId = req.user.userId; // JWT에서 사용자 ID 추출
    var authorId = 1; // 임시로 사용자 ID를 1로 설정

    await articleService.deleteArticle(communityId, articleId, authorId); // 게시글 삭제

    return res.status(200).json({
      message: "게시글 삭제 성공",
    });
  } catch (error) {
    next(error); // 에러 핸들러로 전달
  }
};

export default {
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
