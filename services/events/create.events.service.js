import models from "../../models/index.js";
import { Sequelize } from "sequelize";

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
    throw new Error("게시글 제목 또는 내용이 누락되었습니다.");
  }

  // schedules랑 image는 조인해서 가져와야 합니다.
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
      eventId: event.eventId,
    }));

    await models.EventSchedules.bulkCreate(eventSchedules);

    return event;
  } catch (error) {
    throw new Sequelize.DatabaseError(error);
  }
};