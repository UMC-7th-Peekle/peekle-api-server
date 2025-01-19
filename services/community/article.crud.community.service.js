// Description: 게시글 관련 조회, 생성, 수정, 삭제 로직을 처리하는 파일입니다.
import {
  InvalidInputError,
  NotAllowedError,
  NotExistsError,
  UnauthorizedError,
} from "../../utils/errors/errors.js";
import db from "../../models/index.js";

/**
 * communityId와 articleId에 해당하는 게시글을 가져옵니다
 */
export const getArticleById = async (communityId, articleId) => {
  try {
    // 게시글 조회
    const article = await db.Articles.findOne({
      where: {
        communityId,
        articleId,
      },
    });

    if (!article) {
      // 게시글이 존재하지 않는 경우
      throw new NotExistsError("게시글이 존재하지 않습니다"); // 404
    }

    return article;
  } catch (error) {
    throw error;
  }
};

/**
 * communityId에 해당하는 게시판에 게시글을 추가합니다
 */
export const createArticle = async (communityId, authorId, title, content) => {
  // 형식 검증 로직 필요
  try {
    // 게시글 생성
    const article = await db.Articles.create({
      communityId,
      authorId,
      title,
      content,
    });
    // 로그인 되지 않은 사용자의 경우 UnathorizedError 발생
    return article;
  } catch (error) {
    throw error;
  }
};

/**
 * communityId와 articleId에 해당하는 게시글을 수정
 */
export const updateArticle = async (communityId, articleId, authorId, title, content) => {
  // 형식 검증 로직 필요

  // 게시글 검색
  const article = await db.Articles.findOne({
    where: {
      communityId,
      articleId,
    },
  });
  if (article.authorId !== authorId) {
    // 작성자와 요청자가 다른 경우
    throw new NotAllowedError("게시글 작성자만 수정할 수 있습니다");
  }

  // 게시글 수정
  if (title) {
    article.title = title;
  }
  if (content) {
    article.content = content;
  }

  await article.save(); // 수정된 내용 저장

  return article;
};

/**
 * communityId와 articleId에 해당하는 게시글을 삭제
 */
export const deleteArticle = async (communityId, articleId, authorId) => {
  // 게시글 검색
  const article = await db.Articles.findOne({
    where: {
      communityId,
      articleId,
    },
  });
  if (article.authorId !== authorId) {
    // 작성자와 요청자가 다른 경우
    throw new NotAllowedError("게시글 작성자만 삭제할 수 있습니다");
  }

  // 게시글 삭제
  await article.destroy();
};

// 모든 메서드를 하나의 객체로 묶어 default export
export default {
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
