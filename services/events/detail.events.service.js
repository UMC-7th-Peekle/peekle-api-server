import path from "path";
import fs from "fs/promises";
import models from "../../models/index.js";
import {
  NotExistsError,
  NotAllowedError,
  InvalidInputError,
} from "../../utils/errors/errors.js";
import logger from "../../utils/logger/logger.js";
import { deleteLocalFile } from "../../utils/upload/uploader.object.js";

export const detailEvent = async (eventId) => {
  // eventId가 유효하지 않은 경우 400
  /**
   * 아직 Ajv로 유효성 검사 안했어요
   */

  const detail = await models.Events.findOne({
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

  return detail;
};

// 이벤트 내용 수정
export const updateEvent = async (eventId, userId, updateData) => {
  try {
    const event = await models.Events.findByPk(eventId);

    // 해당 이벤트가 존재하지 않는 경우
    if (!event) {
      logger.debug({
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

      // DB에 존재하지 않는 Sequence의 이미지를 요청한 경우
      const validImageCount = updateData.imageSequence.filter(
        (seq) => seq > 0
      ).length;
      if (existingImages.length < validImageCount) {
        logger.debug({
          action: "event:image:update",
          actionType: "error",
          message: "이미지 개수가 일치하지 않는 요청입니다.",
          data: {
            requestedUserId: userId,
            requestedData: updateData,
            lengths: {
              existingImages: existingImages.length,
              validImageCount,
            },
          },
        });
        throw new InvalidInputError("잘못된 입력입니다.");
      }

      console.log(existingImages);

      // 이미지 순서 변경
      let deletedImages = [];
      let changedImageIdx = 0;
      updateData.imageSequence.map(async (seq, idx) => {
        if (seq === -1) {
          // 삭제된 이미지
          deletedImages.push(existingImages[idx].imageUrl);
          await existingImages[idx].destroy();
        } else if (seq === -2) {
          // 새로 추가된 이미지
          await models.EventImages.create({
            eventId,
            imageUrl: updateData.imagePaths[changedImageIdx++],
            sequence: idx + 1,
          });
        } else {
          // 이미지 순서 변경
          await existingImages[idx].update({ sequence: seq });
        }
      });

      // 로컬 파일 삭제
      const deletePromises = deletedImages.map((img) => {
        deleteLocalFile(img);
      });
      await Promise.all(deletePromises);

      // 기존 이미지 데이터 삭제
      await models.EventImages.destroy({ where: { eventId } });

      // // 새로운 이미지 추가
      // const eventImageData = imagePaths.map((path, index) => ({
      //   eventId,
      //   imageUrl: path,
      //   sequence: index + 1, // 이미지 순서 설정
      // }));

      // await models.EventImages.bulkCreate(eventImageData);

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
