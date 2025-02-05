// Description: 게시글 관련 조회, 생성, 수정, 삭제 로직을 처리하는 파일입니다.
import {
  AlreadyExistsError,
  NotAllowedError,
  NotExistsError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";
import {
  addBaseUrl,
  deleteLocalFile,
  isEditInputCorrect,
} from "../../utils/upload/uploader.object.js";

export const createCommunity = async ({ communityName }) => {
  // 게시판 생성
  try {
    await models.Communities.create({
      title: communityName,
    });
  } catch (err) {
    if (err instanceof models.Sequelize.UniqueConstraintError) {
      // 게시판 이름이 중복되는 경우
      logger.error({
        layer: "service",
        action: "community:create",
        actionType: "error",
        message: "중복된 게시판 이름으로 생성하려 시도했습니다.",
        data: { title: communityName },
      });
      throw new AlreadyExistsError("이미 존재하는 게시판 이름입니다.");
    }
    logger.error("게시판 생성 실패", {
      layer: "service",
      action: "community:create",
      actionType: "error",
      data: { title: communityName },
    });
    throw err;
  }

  logger.debug({
    layer: "service",
    action: "community:create",
    actionType: "success",
    message: "게시판 생성 완료",
    data: { title: communityName },
  });

  return;
};

/**
 * communityId와 articleId에 해당하는 게시글을 가져옵니다
 */
export const getArticleById = async ({ communityId, articleId }) => {
  // 게시글 조회 및 댓글 포함
  const data = await models.Articles.findOne({
    where: {
      communityId,
      articleId,
    },
    include: [
      {
        model: models.ArticleComments,
        as: "articleComments",
        include: [
          {
            model: models.Users,
            as: "author",
            attributes: ["userId", "nickname", "profileImage"], // 댓글 작성자의 정보만 선택
          },
        ],
      },
      {
        model: models.ArticleImages,
        as: "articleImages",
        attributes: ["imageUrl", "sequence"], // 필요한 필드만 가져오기
      },
      {
        model: models.Users,
        as: "author",
        attributes: ["userId", "nickname", "profileImage"],
      },
    ],
  });

  if (!data) {
    // 게시글이 존재하지 않는 경우
    logger.error(
      `[getArticleById] 게시글이 존재하지 않음 - communityId: ${communityId}, articleId: ${articleId}`
    );
    throw new NotExistsError("게시글이 존재하지 않습니다"); // 404
  }

  // 게시글 데이터와 댓글 데이터를 분리
  // const { articleComments, articleImages, ...articleData } =
  //   data;

  // STATIC_FILE_BASE_URL 추가
  const transformedImages = data.articleImages.map((image) => ({
    imageUrl: addBaseUrl(image.imageUrl),
    sequence: image.sequence,
  }));

  // 댓글 정보에 댓글 작성자 정보 추가 및 중복된 author 제거
  const transformedComments = data.articleComments.map((comment) => {
    const { author, ...commentData } = comment.dataValues; // author 제거
    return {
      authorInfo: author,
      ...commentData,
    };
  });

  // author, article 데이터 분리
  const { author, ...articleData } = data.dataValues;

  let transformedAuthorInfo = author;

  // 익명 상태일 경우 작성자 정보를 null로 설정
  if (articleData.isAnonymous === true) {
    transformedAuthorInfo = {
      nickname: null,
      profileImage: null,
      authorId: null,
    };

    // 모든 댓글의 작성자 정보도 null로 설정
    transformedComments.forEach((comment) => {
      if (comment.isAnonymous === true) {
        comment.authorInfo = {
          nickname: null,
          profileImage: null,
          authorId: null,
        };
      }
    });
  }

  const ret = {
    authorInfo: transformedAuthorInfo,
    ...articleData,
    articleComments: transformedComments,
    articleImages: transformedImages,
  };
  // 결과 반환
  return ret;
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

  // 테스트 코드에서 Mock으로 처리하는 부분은 DB의 FK 제약을 테스트하기 어려우므로 이 부분 다시 추가
  if (!community) {
    throw new NotExistsError("존재하지 않는 게시판입니다.");
  }

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
      logger.error({
        layer: "service",
        action: "article:create",
        actionType: "error",
        message: "존재하지 않는 게시판에 게시글을 생성하려 시도했습니다.",
        data: { communityId },
      });
      throw new NotExistsError("존재하지 않는 게시판입니다.");
    }
    throw error;
  }

  logger.debug({
    layer: "service",
    action: "article:create",
    actionType: "success",
    message: "게시글 생성 완료",
    data: { ...article.dataValues },
  });

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
  existingImageSequence,
  newImageSequence,
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

    throw new NotAllowedError("게시글 작성자만 수정할 수 있습니다");
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
      attributes: ["articleImageId", "imageUrl", "sequence"],
    });

    logger.silly({
      action: "article:image:getCurrent",
      actionType: "log",
      data: {
        requestedUserId: authorId,
        existingImages,
      },
    });

    // 이미지 순서 변경
    isEditInputCorrect({
      existingImageSequence,
      newImageSequence,
      existingImagesLength: existingImages.length,
      newImageLength: imagePaths.length,
    });

    // 기존 이미지 순서 변경
    existingImageSequence.map(async (seq, idx) => {
      if (seq === -1) {
        // 삭제할 이미지
        logger.silly({
          action: "article:image:update:delete",
          actionType: "log",
          data: {
            requestedUserId: authorId,
            originalSequence: idx + 1,
            newSequence: seq,
          },
        });
        await existingImages[idx].destroy();
        await deleteLocalFile(existingImages[idx].imageUrl);
      } else {
        // 이미지 순서 변경
        logger.silly({
          action: "article:image:update:modify",
          actionType: "log",
          data: {
            requestedUserId: authorId,
            originalSequence: existingImages[idx].sequence,
            newSequence: seq,
          },
        });
        await existingImages[idx].update({ sequence: seq });
      }
    });

    // 새로 추가된 이미지
    newImageSequence.map(async (seq, idx) => {
      logger.silly({
        action: "article:image:update:create",
        actionType: "log",
        data: {
          requestedUserId: authorId,
          imageUrl: imagePaths[idx],
          newSequence: seq,
        },
      });
      await models.ArticleImages.create({
        articleId,
        imageUrl: imagePaths[idx],
        sequence: seq,
      });
    });

    logger.debug({
      action: "article:image:update",
      actionType: "success",
      message: "이미지 업데이트 완료",
      data: {
        requestedUserId: authorId,
      },
    });
  }

  logger.debug(
    `[updateArticle] [DB 기준] 수정된 게시글 제목: ${article.title} | 수정된 내용: ${article.content}`
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
  const deletePromises = existingImages.map((img) =>
    deleteLocalFile(img.imageUrl)
  );

  // 모든 파일 삭제 완료 대기
  // because, deletePromises 안에 있는 비동기 작업들을
  // await을 걸어서 처리하지 않았기에
  await Promise.all(deletePromises);

  // 기존 이미지 데이터 삭제
  // ON DELETE CASCADE 를 통해서 자동으로 삭제되는 것으로 변경
  // await models.ArticleImages.destroy({
  //   where: { articleId },
  // });

  // 게시글 삭제
  await article.destroy();
};
