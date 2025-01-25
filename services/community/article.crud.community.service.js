// Description: 게시글 관련 조회, 생성, 수정, 삭제 로직을 처리하는 파일입니다.
import {
  InvalidInputError,
  NotAllowedError,
  NotExistsError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";
import fs from "fs/promises";
import path from "path";
import {
  addBaseUrl,
  deleteLocalFile,
} from "../../utils/upload/uploader.object.js";

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

    /*
        ** 이거 아님. 그냥 고민했던 흔적을 남기고 싶어서 남겨둠 **

        imageSequence field를 받아서 수정을 진행합니다.
        해당 field는 숫자들의 배열이며, 
        각 숫자는 이미지 순서 및 삭제/추가 여부를 나타냅니다.

        -1: 삭제된 이미지 (DB에서 삭제)
        삭제된 이미지의 경우 기존 이미지 개수와 
        동일한 길이의 배열이 들어왔을 때만 존재해야 합니다.
        (지금 이거 예외 처리 안되있음, 그렇지 않으면 말이 안됨)
        (한 번 종이에 써보면서 생각해보면 답 나옴)

        -2: 새로 추가된 이미지 (DB에 추가)
        imagePaths로 들어온 이미지 순서대로 넣어주면 됩니다.
        첫 번째 -2 순서에 첫 번째로 들어온 이미지, ... 와 같이

        나머지 숫자는 기존 이미지 순서를 나타냅니다.

        ex) 원래 DB에 3개의 이미지가 있던 게시글에서
        [2, 1, -2] 라는 배열이 들어온 경우
        1. [기존 2번] 이미지를 1번으로 변경
        2. [기존 1번] 이미지를 2번으로 변경
        3. [새로 추가된 이미지]를 3번으로 추가

        ex2) 원래 DB에 3개의 이미지가 있던 게시글에서
        [2, -1, -1] 라는 배열이 들어온 경우
        1. [기존 2번] 이미지를 1번으로 변경
        2. [기존 1번, 3번] 이미지를 DB에서 삭제
      */

    /*
        ** 이거 보면 됩니다 **

        기존 이미지 Sequence와
        Input으로 추가한 이미지의 Sequence를 
        모두 받아서 하는 방향으로 수정하자.

        existingImageSequence : 기존 파일들의 순서 및 삭제 여부
        newImageSequence : 새로 추가된 파일들의 순서 (들어갈 곳)


        동일하게 -1 삭제, 그 이외에는 수정하면 될듯.

        existingImageSequence: [2, 1, -2]
        newImageSequence: [4, 5, 6]

        TODO : DB에 Unique key를 안 걸어둬서, 
        eventId & sequence가 동일한 컬럼이 존재할 수 있지만 (가능하지만),
        Unique key를 걸어서 중복을 방지함과 동시에 데이터 무결성을 지켜야 함.
        아직 코드에선 해당 부분에 대한 예외 처리를 하지 않음.

        (client가 잘못된 데이터를 보내는 경우에 대한 처리를 하지 않았다는 말)
        근데 그냥 바로 해버림 6시 40분인데 자고 싶다
      */

    // 사용자가 보낸 이미지 순서가 이상한지 확인
    const filteredExisting = existingImageSequence.filter((seq) => seq !== -1);
    const combinedSequences = [...filteredExisting, ...newImageSequence];
    const uniqueSequences = new Set(combinedSequences);

    if (
      existingImageSequence.length !== existingImages.length || // 존재하는 이미지 개수가 다른 경우
      newImageSequence.length !== imagePaths.length || // 새로 추가된 이미지 개수가 다른 경우
      uniqueSequences.size !== combinedSequences.length || // 중복된 순서가 있는 경우
      Math.min(...combinedSequences) !== 1 || // 순서가 1부터 시작하지 않는 경우
      Math.max(...combinedSequences) !== combinedSequences.length // 순서가 중간에 빠진 경우
    ) {
      throw new InvalidInputError(
        "설명은 못하곘는데 이상한 입력 넣지 말아라 진짜"
      );
    }

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
