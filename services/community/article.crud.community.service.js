// Description: 게시글 관련 조회, 생성, 수정, 삭제 로직을 처리하는 파일입니다.
import { NotAllowedError, NotExistsError } from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";

/**
 * communityId와 articleId에 해당하는 게시글을 가져옵니다
 */
export const getArticleById = async ({ communityId, articleId }) => {
  try {
    // 게시글 조회
    const article = await models.Articles.findOne({
      where: {
        communityId,
        articleId,
      },
    });

    if (!article) {
      // 게시글이 존재하지 않는 경우
      throw new NotExistsError("게시글이 존재하지 않습니다"); // 404
    }

    // TODO : include 활용해서 JOIN으로 쿼리문 한번에 끝내주세요.
    // 그렇게 되면 Depth 구조가 전체적으로 바뀔거라,
    // 따로 건들지 않겠습니다. 직접 해보세요 !

    // 댓글 조회
    const comments = await models.ArticleComments.findAll({
      where: {
        articleId,
      },
    });

    // 게시글 및 댓글 반환
    return { article, comments };
  } catch (error) {
    throw error;
  }
};

/**
 * communityId에 해당하는 게시판에 게시글을 추가합니다
 */
export const createArticle = async ({
  communityId,
  authorId,
  title,
  content,
  isAnonymous = true,
}) => {
  try {
    // 게시글 생성
    const article = await models.Articles.create({
      communityId,
      authorId,
      title,
      content,
      isAnonymous,
    });
    return { article };
  } catch (error) {
    throw error;
  }
};

/**
 * communityId와 articleId에 해당하는 게시글을 수정
 */
export const updateArticle = async ({
  communityId,
  articleId,
  authorId,
  title,
  content,
}) => {
  // 게시글 검색
  const article = await models.Articles.findOne({
    where: {
      communityId,
      articleId,
    },
  });

  // 게시글이 존재하지 않는 경우 예외처리 추가했습니다.
  if (!article) {
    // 게시글이 존재하지 않는 경우
    throw new NotExistsError("게시글이 존재하지 않습니다");
  }

  // !== 대신 !=로 수정했습니다. 둘이 type이 달라요.
  if (article.authorId != authorId) {
    // 작성자와 요청자가 다른 경우
    logger.debug(
      `[deleteArticle] 잘못된 수정 요청 - 작성자: ${article.authorId}, 요청자: ${authorId}`
    );
    throw new NotAllowedError("게시글 작성자만 삭제할 수 있습니다");
  }

  // 게시글 수정
  await article.update({
    title,
    content,
  });

  return { article };
};

/**
 * communityId와 articleId에 해당하는 게시글을 삭제
 */
export const deleteArticle = async ({ communityId, articleId, authorId }) => {
  // 게시글 검색
  const article = await models.Articles.findOne({
    where: {
      communityId,
      articleId,
    },
  });

  // 게시글이 존재하지 않는 경우 예외처리 추가했습니다.
  if (!article) {
    // 게시글이 존재하지 않는 경우
    throw new NotExistsError("게시글이 존재하지 않습니다");
  }

  // !== 대신 !=로 수정했습니다. 둘이 type이 달라요.
  if (article.authorId != authorId) {
    // 작성자와 요청자가 다른 경우
    logger.debug(
      `[deleteArticle] 잘못된 삭제 요청 - 작성자: ${article.authorId}, 요청자: ${authorId}`
    );
    throw new NotAllowedError("게시글 작성자만 삭제할 수 있습니다");
  }

  // 게시글 삭제
  await article.destroy();
};
