import path from "path";
import fs from "fs/promises";
import models from "../../models/index.js";
import {
  NotExistsError,
  NotAllowedError,
  InvalidInputError,
} from "../../utils/errors/errors.js";
import logger from "../../utils/logger/logger.js";
import {
  deleteLocalFile,
  isEditInputCorrect,
} from "../../utils/upload/uploader.object.js";

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
