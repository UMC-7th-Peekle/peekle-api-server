import models from "../../models/index.js";
import { InvalidInputError } from "../../utils/errors/errors.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";

// 새로운 이벤트 생성
export const createEvent = async ({ userId, eventData }) => {
  // eventData는 기본적으로 형식 검증을 통해 유효한 값만이 전달된다고 가정.

  // title, content, price, categoryId, location, eventUrl,
  // applicationStart, applicationEnd,
  // schedules
  // imagePaths : multer가 req.files로 전달한 것을 parsing 후에 전달

  // 게시글 제목, 게시글 내용 누락 400
  if (!eventData.title || !eventData.content) {
    throw new InvalidInputError("게시글 제목 또는 내용이 누락되었습니다.");
  }

  const transaction = await models.sequelize.transaction();

  try {
    // 이벤트 생성
    const event = await models.Events.create(
      {
        ...eventData,
        createdUserId: userId,
      },
      { transaction }
    );

    // 이미지가 새로 들어온 경우에만 처리
    if (eventData.imagePaths.length > 0) {
      // 새로운 이미지 추가
      const eventImageData = eventData.imagePaths.map((path, index) => ({
        eventId: event.eventId,
        imageUrl: path,
        sequence: index + 1, // 이미지 순서 설정
      }));

      await models.EventImages.bulkCreate(eventImageData, { transaction });
    }

    // 해당 이벤트 스케줄 부분 튜플 생성
    const eventSchedules = eventData.schedules.map((schedule) => ({
      ...schedule,
      startTime: schedule.startTime.split("Z")[0],
      endTime: schedule.endTime.split("Z")[0],
      eventId: event.eventId,
    }));

    await models.EventSchedules.bulkCreate(eventSchedules, { transaction });

    await transaction.commit();

    logger.debug("이벤트 생성 성공", {
      action: "event:create",
      actionType: "success",
      userId: userId,
    });

    return event;
  } catch (error) {
    logError(error);
    logger.error("이벤트 생성 실패, Rollback 실행됨.", {
      action: "event:create",
      actionType: "error",
      userId: userId,
    });
    await transaction.rollback();
    throw error;
  }
};
