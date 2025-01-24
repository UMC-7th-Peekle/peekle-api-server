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
  } = eventData;

  // 게시글 제목, 게시글 내용 누락 400
  if (!title || !content) {
    throw new InvalidInputError("게시글 제목 또는 내용이 누락되었습니다.");
  }
  /**
   * 아직 Ajv로 유효성 검사 안했어요
   */

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

    // 해당 이벤트 스케줄 부분 튜플 생성
    const eventSchedules = schedules.map((schedule) => ({
      ...schedule,
      eventId: event.eventId
    }));

    await models.EventSchedules.bulkCreate(eventSchedules);

    return event;
  } catch (error) {
    throw error;
  }
};