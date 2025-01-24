import models from "../../models/index.js";
import { InvalidInputError } from "../../utils/errors/errors.js";
// 새로운 이벤트 생성
export const newEvent = async (userId, eventData) => {
  const {
    title,
    content,
    price,
    categoryId,
    location,
    eventUrl,
    createdUserId = userId,
    applicationStart,
    applicationEnd,
    schedules,
    imagePaths = [],
  } = eventData;

  // 게시글 제목, 게시글 내용 누락 400
  if (!title || !content) {
    throw new InvalidInputError("게시글 제목 또는 내용이 누락되었습니다.");
  }

  try {
    // 이벤트 생성
    const event = await models.Events.create({
      title,
      content,
      price,
      categoryId,
      location,
      eventUrl,
      createdUserId: userId,
      applicationStart,
      applicationEnd,
    });

    // 이미지가 새로 들어온 경우에만 처리
    if (imagePaths.length > 0) {
      // 새로운 이미지 추가
      const eventImageData = imagePaths.map((path, index) => ({
        eventId: event.eventId,
        imageUrl: path,
        sequence: index + 1, // 이미지 순서 설정
      }));

      await models.EventImages.bulkCreate(eventImageData);
    }

    // 해당 이벤트 스케줄 부분 튜플 생성
    const eventSchedules = schedules.map((schedule) => ({
      ...schedule,
      startTime: schedule.startTime.split("Z")[0],
      endTime: schedule.endTime.split("Z")[0],
      eventId: event.eventId,
    }));

    await models.EventSchedules.bulkCreate(eventSchedules);

    return event;
  } catch (error) {
    throw error;
  }
};
