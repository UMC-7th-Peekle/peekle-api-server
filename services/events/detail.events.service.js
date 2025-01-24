import path from "path";
import fs from "fs/promises";
import models from "../../models/index.js";
import { NotExistsError, NotAllowedError } from "../../utils/errors/errors.js";
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
  const {
    title,
    content,
    price,
    categoryId,
    location,
    eventUrl,
    applicationStart,
    applicationEnd,
    imagePaths = [],
  } = updateData;

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
    if (imagePaths.length > 0) {
      // DB에서 기존 이미지 경로 가져오기
      const existingImages = await models.EventImages.findAll({
        where: { eventId },
        attributes: ["imageUrl"],
      });

      // 로컬 파일 삭제
      const deletePromises = existingImages.map((img) => {
        deleteLocalFile(img.imageUrl);
      });
      await Promise.all(deletePromises);

      // 기존 이미지 데이터 삭제
      await models.EventImages.destroy({ where: { eventId } });

      // 새로운 이미지 추가
      const eventImageData = imagePaths.map((path, index) => ({
        eventId,
        imageUrl: path,
        sequence: index + 1, // 이미지 순서 설정
      }));

      await models.EventImages.bulkCreate(eventImageData);

      logger.debug({
        action: "event:image:update",
        actionType: "success",
        message: "이미지 업데이트 완료",
        data: {
          requestedUserId: userId,
          updatedData: imagePaths,
        },
      });
    }

    return { event };
  } catch (error) {
    throw error;
  }
};
