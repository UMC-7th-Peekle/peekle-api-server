// Description: 게시글 관련 조회, 생성, 수정, 삭제 로직을 처리하는 파일입니다.
import { NotAllowedError, NotExistsError } from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";
import fs from "fs/promises";
import path from "path";
import { addBaseUrl } from "../../utils/upload/uploader.object.js";

/**
 * communityId와 articleId에 해당하는 게시글을 가져옵니다
 */
export const getArticleById = async ({ communityId, articleId }) => {
  // 게시글 조회 및 댓글 포함
  const articleWithComments = await models.Articles.findOne({
    where: {
      communityId,
      articleId,
    },
    include: [
      {
        model: models.ArticleComments,
        as: "articleComments",
      },
      {
        model: models.ArticleImages,
        as: "articleImages",
        attributes: ["imageUrl", "sequence"], // 필요한 필드만 가져오기
      },
    ],
  });

  if (!articleWithComments) {
    // 게시글이 존재하지 않는 경우
    logger.error(
      `[getArticleById] 게시글이 존재하지 않음 - communityId: ${communityId}, articleId: ${articleId}`
    );
    throw new NotExistsError("게시글이 존재하지 않습니다"); // 404
  }

  // 게시글 데이터와 댓글 데이터를 분리
  const { articleComments, articleImages, ...articleData } =
    articleWithComments.toJSON();

  // STATIC_FILE_BASE_URL 추가
  const transformedImages = articleImages.map((image) => ({
    ...image,
    imageUrl: addBaseUrl(image.imageUrl),
  }));

  // 결과 반환
  return {
    articleData, // 게시글 데이터
    articleImages: transformedImages, // URL이 수정된 이미지 데이터
    articleComments, // 댓글 데이터
  };
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
  imagePaths,
}) => {
  // 게시판 검색
  const community = await models.Communities.findOne({
    where: {
      communityId,
    },
  });

  // 게시글 생성
  let article;
  let articleImageData;

  /*
    try-catch 블록 외부에서 article 선언
    try-catch 블록 내부에서 article을 생성하고 반환하면
    "article is not defined" 에러가 발생합니다.
  */

  try {
    article = await models.Articles.create({
      communityId,
      authorId,
      title,
      content,
      isAnonymous,
    });

    // 이미지 경로를 ArticleImages 테이블에 저장
    if (imagePaths.length > 0) {
      articleImageData = imagePaths.map((path, index) => ({
        articleId: article.articleId,
        imageUrl: path,
        sequence: index + 1, // 이미지 순서 설정
      }));

      // 없는 경우 bulkCreate가 되지 않음 -> if문 안으로 이동
      await models.ArticleImages.bulkCreate(articleImageData);
    }
  } catch (error) {
    if (error instanceof models.Sequelize.ForeignKeyConstraintError) {
      // 게시판이 존재하지 않는 경우
      logger.error(
        `[createArticle] 존재하지 않는 communityId - ${communityId}`
      );
      throw new NotExistsError("해당 게시판이 존재하지 않습니다.");
    }
    throw error;
  }

  logger.debug(
    `[createArticle] 생성된 게시글 제목: ${article.title}, 생성된 내용: ${article.content}`
  );

  return { article };
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
  imagePaths,
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
    logger.error(
      `[updateArticle] 수정하려는 게시글이 존재하지 않음 - communityId: ${communityId}, articleId: ${articleId}`
    );
    throw new NotExistsError("게시글이 존재하지 않습니다");
  }

  // toString()으로 타입 변환 후 strict 하게 비교하도록 수정했습니다.
  if (article.authorId.toString() !== authorId.toString()) {
    // 작성자와 요청자가 다른 경우
    logger.error(
      `[updateArticle] 잘못된 수정 요청 - 작성자: ${article.authorId}, 요청자: ${authorId}`
    );

    throw new NotAllowedError("게시글 작성자만 삭제할 수 있습니다");
  }

  // 게시글 수정
  await article.update({
    title,
    content,
  });

  // 사진이 새로 들어온 경우에만 사진 업데이트
  // 기존 이미지 삭제
  if (imagePaths.length > 0) {
    // DB에서 기존 이미지 경로 가져오기
    const existingImages = await models.ArticleImages.findAll({
      where: { articleId },
      attributes: ["imageUrl"],
    });

    // 로컬 파일 삭제
    const deletePromises = existingImages.map(async (img) => {
      const filePath = path.join("uploads", img.imageUrl.replace(/^/, "")); // 경로에 uploads 추가
      try {
        await fs.unlink(filePath); // 로컬 파일 삭제
        logger.debug(`[updateArticle] 파일 삭제 성공: ${filePath}`);
      } catch (err) {
        logger.error(
          `[updateArticle] 파일 삭제 실패: ${filePath} - ${err.message}`
        );
      }
    });

    // 모든 파일 삭제 완료 대기
    await Promise.all(deletePromises);

    // 기존 이미지 데이터 삭제
    await models.ArticleImages.destroy({
      where: { articleId },
    });

    // 새로운 이미지 추가
    const articleImageData = imagePaths.map((path, index) => ({
      articleId,
      imageUrl: path,
      sequence: index + 1, // 이미지 순서 설정
    }));

    await models.ArticleImages.bulkCreate(articleImageData);
  }

  logger.debug(
    `[updateArticle] 수정된 게시글 제목: ${article.title}, 수정된 내용: ${article.content}`
  );
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
    logger.error(
      `[deleteArticle] 삭제하려는 게시글이 존재하지 않음 - communityId: ${communityId}, articleId: ${articleId}`
    );
    throw new NotExistsError("게시글이 존재하지 않습니다");
  }

  // toString()으로 타입 변환 후 strict 하게 비교하도록 수정했습니다.
  if (article.authorId.toString() !== authorId.toString()) {
    // 작성자와 요청자가 다른 경우
    logger.error(
      `[deleteArticle] 잘못된 삭제 요청 - 작성자: ${article.authorId}, 요청자: ${authorId}`
    );
    throw new NotAllowedError("게시글 작성자만 삭제할 수 있습니다");
  }

  // DB에서 기존 이미지 경로 가져오기
  const existingImages = await models.ArticleImages.findAll({
    where: { articleId },
    attributes: ["imageUrl"],
  });

  // 로컬 파일 삭제
  const deletePromises = existingImages.map(async (img) => {
    const filePath = path.join("uploads", img.imageUrl.replace(/^/, "")); // 경로에 uploads/ 추가
    try {
      await fs.unlink(filePath); // 로컬 파일 삭제
      logger.debug(`[updateArticle] 파일 삭제 성공: ${filePath}`);
    } catch (err) {
      logger.error(
        `[updateArticle] 파일 삭제 실패: ${filePath} - ${err.message}`
      );
    }
  });

  // 모든 파일 삭제 완료 대기
  await Promise.all(deletePromises);

  // 기존 이미지 데이터 삭제
  await models.ArticleImages.destroy({
    where: { articleId },
  });

  // 게시글 삭제
  await article.destroy();
};
