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
  addBaseUrl,
  deleteLocalFile,
  isEditInputCorrect,
} from "../../utils/upload/uploader.object.js";

export const detailEvent = async (eventId) => {
  // eventId가 유효하지 않은 경우 400
  /**
   * 아직 Ajv로 유효성 검사 안했어요
   */

  const data = await models.Events.findOne({
    where: { eventId: eventId },

    attributes: { exclude: ["categoryId", "createdUserId"] },
    include: [
      {
        model: models.EventCategory,
        as: "category",
        attributes: ["name", "description"],
      },
      {
        model: models.EventImages,
        as: "eventImages",
        attributes: ["imageUrl", "sequence"],
      },
      {
        model: models.EventSchedules,
        as: "eventSchedules",
        attributes: [
          "repeatType",
          "repeatEndDate",
          "isAllDay",
          "customText",
          "startDate",
          "endDate",
          "startTime",
          "endTime",
        ],
      },
    ],
  });

  if (!data) {
    logger.warn("존재하지 않는 이벤트에 대한 조회 요청입니다.", {
      action: "event:getDetail",
      actionType: "error",
      data: {
        eventId,
      },
    });
    throw new NotExistsError("존재하지 않는 이벤트입니다.");
  }

  const transformedImages = data.eventImages.map((image) => ({
    imageUrl: addBaseUrl(image.imageUrl),
    sequence: image.sequence,
  }));

  return { ...data.dataValues, eventImages: transformedImages };
};

// 이벤트 내용 수정
export const updateEvent = async (eventId, userId, updateData) => {
  try {
    const event = await models.Events.findByPk(eventId);

    // 해당 이벤트가 존재하지 않는 경우
    if (!event) {
      logger.warn({
        action: "event:update",
        actionType: "error",
        message: "존재하지 않는 이벤트에 대한 수정 요청입니다.",
        userId: userId,
        data: updateData,
      });
      throw new NotExistsError("존재하지 않는 이벤트입니다.");
    }

    // 작성자가 수정을 요청한게 아닌 경우
    if (event.createdUserId.toString() !== userId) {
      logger.error({
        action: "event:update",
        actionType: "error",
        message: "타인이 작성한 글에 대한 수정 요청",
        data: {
          authorId: event.createdUserId,
          requestedUserId: userId,
          requestedData: updateData,
        },
      });
      throw new NotAllowedError(
        "본인이 작성하지 않은 게시글을 수정할 수 없습니다."
      );
    }

    // 필요한 필드만 업데이트
    // shallow copy
    Object.assign(event, updateData);

    await event.save();
    logger.debug({
      action: "event:update",
      actionType: "sucess",
      message: "이벤트 수정 완료",
      data: {
        requestedUserId: userId,
        updatedData: updateData,
      },
    });

    // 이미지가 새로 들어온 경우에만 처리
    if (updateData.imagePaths.length > 0) {
      // DB에서 기존 이미지 경로 가져오기
      const existingImages = await models.EventImages.findAll({
        where: { eventId },
        attributes: ["imageId", "imageUrl", "sequence"],
      });

      logger.silly({
        action: "event:image:getCurrent",
        actionType: "log",
        data: {
          requestedUserId: userId,
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
          logger.silly({
            action: "event:image:update:delete",
            actionType: "log",
            data: {
              requestedUserId: userId,
              imageId: existingImages[idx].imageId,
              originalSequence: idx + 1,
              newSequence: seq,
            },
          });
          await existingImages[idx].destroy();
          await deleteLocalFile(existingImages[idx].imageUrl);
        } else {
          // 이미지 순서 변경
          logger.silly({
            action: "event:image:update:modify",
            actionType: "log",
            data: {
              requestedUserId: userId,
              imageId: existingImages[idx].imageId,
              originalSequence: existingImages[idx].sequence,
              newSequence: seq,
            },
          });
          await existingImages[idx].update({ sequence: seq });
        }
      });

      // 새로 추가된 이미지
      updateData.newImageSequence.map(async (seq, idx) => {
        logger.silly({
          action: "event:image:update:create",
          actionType: "log",
          data: {
            requestedUserId: userId,
            imageUrl: updateData.imagePaths[idx],
            newSequence: seq,
          },
        });
        await models.EventImages.create({
          eventId,
          imageUrl: updateData.imagePaths[idx],
          sequence: seq,
        });
      });

      logger.debug({
        action: "event:image:update",
        actionType: "success",
        message: "이미지 업데이트 완료",
        data: {
          requestedUserId: userId,
          updatedData: updateData,
        },
      });
    }

    return { event };
  } catch (error) {
    throw error;
  }
};

export const deleteEvent = async ({ eventId, userId }) => {
  try {
    const event = await models.Events.findByPk(eventId, {
      include: [
        {
          model: models.EventImages,
          as: "eventImages",
          attributes: ["imageId", "imageUrl"],
        },
      ],
    });

    if (!event) {
      logger.warn({
        action: "event:delete",
        actionType: "error",
        message: "존재하지 않는 이벤트에 대한 삭제 요청입니다.",
        userId: userId,
      });
      throw new NotExistsError("존재하지 않는 이벤트입니다.");
    }

    if (event.createdUserId.toString() !== userId) {
      logger.warn({
        action: "event:delete",
        actionType: "error",
        message: "권한이 없는 이벤트에 대한 삭제 요청입니다.",
        data: {
          authorId: event.createdUserId,
          requestedUserId: userId,
        },
      });
      throw new NotAllowedError("이벤트 삭제 권한이 없습니다.");
    }

    // 로컬 파일 삭제
    const deletePromises = event.eventImages.map((img) =>
      deleteLocalFile(img.imageUrl)
    );

    // 모든 파일 삭제 완료 대기
    // because, deletePromises 안에 있는 비동기 작업들을
    // await을 걸어서 처리하지 않았기에
    await Promise.all(deletePromises);

    // TODO : 로컬에 저장된 이미지 또한 삭제하여야 함
    await event.destroy();

    logger.debug({
      action: "event:delete",
      actionType: "success",
      message: "이벤트 삭제 완료",
      data: {
        requestedUserId: userId,
        eventId,
      },
    });

    return;
  } catch (error) {
    throw error;
  }
};
