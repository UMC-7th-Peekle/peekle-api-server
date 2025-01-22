import {
  AlreadyExistsError,
  NotExistsError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";

// eventId가 유효한지 확인 404
const isEventExists = async (eventId) => {
  const event = await models.Events.findOne({
    where: { eventId: eventId },
  });

  if (!event) {
    throw new NotExistsError("존재하지 않는 이벤트입니다.");
  }
};

// 중복 신고 여부를 확인 409 + 새로운 이벤트 스크랩
const createNewScrap = async (eventId, userId) => {
  try {
    return await models.EventScraps.create({
      eventId,
      userId,
    });
  } catch (error) {
    throw new AlreadyExistsError("이미 스크랩된 이벤트입니다.");
  }
};

export const newScrap = async (eventId, userId) => {
  // 중첩되어있는 부분 함수로 호출
  await isEventExists(eventId);
  const newScrap = await createNewScrap(eventId, userId);

  return newScrap;
};

export const deleteScrap = async (eventId, userId) => {
  // 중첩되어있는 부분 함수로 호출
  await isEventExists(eventId);

  // 스크랩이 존재하는지 확인하고 존재하지 않으면 404
  const existScrap = await models.EventScraps.findOne({
    where: { eventId, userId },
  });

  if (!existScrap) {
    throw new NotExistsError("이미 스크랩된 이벤트가 없습니다.");
  }

  // 스크랩 삭제하기
  const deleteScrap = await models.EventScraps.destroy({
    where: { eventId, userId },
  });

  return true;
};
