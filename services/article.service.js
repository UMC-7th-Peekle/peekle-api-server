// Description: 게시글 관련 조회, 생성, 수정, 삭제 로직을 처리하는 파일입니다.
import db from "../models/index.js";

export const getArticleById = async (communityId, articleId) => {
  try {
    // 게시글 조회
    const article = await db.Articles.findOne({
      where: {
        communityId,
        articleId,
      },
    });

    return article || null; // 게시글이 존재하지 않는 경우 null 반환
  } catch (error) {
    throw error;
  }
};

export const createArticle = async (communityId, authorId, title, content) => {
  // 검증 로직 필요
  try {
    // 게시글 생성
    const article = await db.Articles.create({
      communityId,
      authorId,
      title,
      content,
    });

    return article;
  } catch (error) {
    throw error;
  }
};

export const updateArticle = async (
  communityId,
  articleId,
  authorId,
  title,
  content
) => {
  // 검증 로직 필요
  // 게시글 검색
  const article = await db.Articles.findOne({
    where: {
      communityId,
      articleId,
    },
  });
  if (article.authorId !== authorId) {
    // 작성자와 요청자가 다른 경우
    throw new Error("게시글 작성자만 수정할 수 있습니다");
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
    throw new Error("게시글 작성자만 삭제할 수 있습니다");
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
