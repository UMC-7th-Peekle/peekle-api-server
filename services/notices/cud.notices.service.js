import models from "../../models/index.js";
import {
  InvalidInputError,
  NotExistsError,
  NotAllowedError,
} from "../../utils/errors/errors.js";
import logger from "../../utils/logger/logger.js";
import {
  deleteLocalFile,
  isEditInputCorrect,
} from "../../utils/upload/uploader.object.js";

// 공지사항 생성
export const newNotice = async ({ userId, categoryId, noticeData }) => {
  // 게시글 제목, 게시글 내용 누락 400
  if (!noticeData.title || !noticeData.content || !categoryId) {
    logger.debug("게시글 제목 또는 내용 누락", {
      action: "notice:create",
      actionType: "error",
      userId: userId,
    });
    throw new InvalidInputError("게시글 제목 또는 내용이 누락되었습니다.");
  }

  // 카테고리id
  const category = await models.NoticeCategory.findOne({
    where: { categoryId: categoryId },
  });
  if (!category) {
    logger.debug("존재하지 않는 공지 카테고리", {
      action: "notice: create",
      actionType: "error",
      userId: userId,
    });
    throw new InvalidInputError("해당 카테고리가 존재하지 않습니다.");
  }

  logger.debug("공지사항 생성", {
    action: "notice:create",
    actionType: "log",
    userId: userId,
    data: noticeData,
  });

  // 트랙잭션 시작
  const transaction = await models.sequelize.transaction();

  try {
    // 공지 생성
    const notice = await models.Notices.create(
      {
        ...noticeData,
        authorId: userId,
        categoryId: categoryId,
      },
      { transaction }
    );

    // 이미지가 새로 들어온 경우에만 처리
    if (noticeData.imagePaths.length > 0) {
      // 새로운 이미지 추가
      const noticeImageData = noticeData.imagePaths.map((path, index) => ({
        noticeId: notice.noticeId,
        imageUrl: path,
        sequence: index + 1, // 이미지 순서 설정
      }));

      await models.NoticeImages.bulkCreate(noticeImageData, { transaction });
    }

    // 트랜잭션 커밋
    await transaction.commit();

    logger.debug("공지사항 생성 성공", {
      action: "notice:create",
      actionType: "success",
      userId: userId,
    });

    return notice;
  } catch (error) {
    // 트랜잭션 롤백
    await transaction.rollback();
    logger.error("공지사항 생성 실패, Rollback 실행됨.", {
      action: "notice:create",
      actionType: "error",
      userId: userId,
    });
    throw error;
  }
};

// 공지 수정
export const updateNotice = async ({ noticeId, userId, updateData }) => {
  try {
    const notice = await models.Notices.findByPk(noticeId);

    // 해당 공지사항이 존재하지 않는 경우
    if (!notice) {
      logger.debug("존재하지 않는 공지사항 수정", {
        action: "notice:update",
        actionType: "error",
        userId: userId,
        data: updateData,
      });
      throw new NotExistsError("존재하지 않는 공지사항입니다.");
    }

    // 작성자가 수정을 요청한게 아닌 경우
    if (notice.authorId.toString() !== userId) {
      logger.error("타인이 작성한 공지사항 수정", {
        action: "event:update",
        actionType: "error",
        authorId: notice.authorId,
        requestedUserId: userId,
        requestedData: updateData,
      });
      throw new NotAllowedError(
        "본인이 작성하지 않은 게시글을 수정할 수 없습니다."
      );
    }

    // 공지사항 수정
    await notice.update({
      updateData,
    });

    // update를 쓴 이상 사용할 필요가 없음
    // await notice.save();

    logger.debug("공지사항 수정 완료", {
      action: "notice:update",
      actionType: "sucess",
      requestedUserId: userId,
      updatedData: updateData,
    });

    // 사진이 새로 들어온 경우에만 사진 업데이트
    // 기존 이미지 삭제
    if (updateData.imagePaths.length > 0) {
      // DB에서 기존 이미지 경로 가져오기
      const existingImages = await models.NoticeImages.findAll({
        where: { noticeId },
        attributes: ["imageId", "imageUrl", "sequence"],
      });

      logger.silly("기존 이미지 조회", {
        action: "notice:image:getCurrent",
        actionType: "log",
        data: {
          requestedUserId: notice.authorId,
          existingImages,
        },
      });

      // 사용자가 보낸 이미지 순서가 이상한지 확인
      isEditInputCorrect({
        existingImageSequence: updateData.existingImageSequence,
        newImageSequence: updateData.newImageSequence,
        existingImagesLength: existingImages.length,
        newImageLength: updateData.imagePaths.length,
      });

      // 기존 이미지 순서 변경
      updateData.existingImageSequence.map(async (seq, idx) => {
        if (seq === -1) {
          // 삭제할 이미지
          logger.silly("삭제할 이미지", {
            action: "notice:image:update:delete",
            actionType: "log",
            requestedUserId: notice.authorId,
            originalSequence: idx + 1,
            newSequence: seq,
          });
          await existingImages[idx].destroy();
          await deleteLocalFile(existingImages[idx].imageUrl);
        } else {
          // 이미지 순서 변경
          logger.silly("이미지 순서 변경", {
            action: "notice:image:update:modify",
            actionType: "log",
            requestedUserId: notice.authorId,
            originalSequence: existingImages[idx].sequence,
            newSequence: seq,
          });
          await existingImages[idx].update({ sequence: seq });
        }
      });

      // 새로 추가된 이미지
      updateData.newImageSequence.map(async (seq, idx) => {
        logger.silly("새로 추가된 이미지", {
          action: "notice:image:update:create",
          actionType: "log",
          requestedUserId: notice.authorId,
          imageUrl: updateData.imagePaths[idx],
          newSequence: seq,
        });
        await models.NoticeImages.create({
          noticeId,
          imageUrl: updateData.imagePaths[idx],
          sequence: seq,
        });
      });

      logger.debug("이미지 업데이트 완료", {
        action: "notice:image:update",
        actionType: "success",
        requestedUserId: notice.authorId,
      });
    }

    return { notice };
  } catch (error) {
    throw error;
  }
};

// 공지 삭제
export const deleteNotice = async ({ noticeId, userId }) => {
  try {
    const notice = await models.Notices.findByPk(noticeId);

    // 해당 공지사항이 존재하지 않는 경우
    if (!notice) {
      logger.debug("존재하지 않는 공지사항 삭제", {
        action: "notice:delete",
        actionType: "error",
        // authorId: notice.authorId,
        requestedUserId: userId,
      });
      throw new NotExistsError("존재하지 않는 공지사항입니다.");
    }

    // 작성자가 삭제를 요청한게 아닌 경우
    if (notice.authorId.toString() !== userId) {
      logger.error("타인이 작성한 공지사항 삭제", {
        action: "event:delete",
        actionType: "error",
        authorId: notice.authorId,
        requestedUserId: userId,
      });
      throw new NotAllowedError(
        "본인이 작성하지 않은 게시글을 삭제할 수 없습니다."
      );
    }

    // 공지 삭제하기
    await models.Notices.destroy({
      where: { noticeId, authorId: userId },
    });

    // if (deleteNotice === 0) {    // 반환값이 0일 경우 404
    // // --> 이거 그냥 존재하지 않는 공지사항입니다.로 되고 적용 안되는 것 같아요
    //   throw new NotExistsError("이미 삭제한 공지사항입니다.");
    // }

    return true;
  } catch (error) {
    throw error;
  }
};
