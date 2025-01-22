import {
  AlreadyExistsError,
  NotExistsError,
  UnauthorizedError,
} from "../../utils/errors/errors.js";
import db from "../../models/index.js";

// eventId가 유효한지 확인 404
const isEventExists = async (eventId) => {
  const event = await db.Events.findOne({
    where: { eventId: eventId },
  });

  if (!event) {
    throw new NotExistsError("존재하지 않는 이벤트입니다.");
  }
};

export const newScrap = async (eventId, userId) => {
  // 중첩되어있는 부분 함수로 호출
  await isEventExists(eventId);

  // 이미 이벤트가 스크랩 되어 있는지 확인 409
  const existScrap = await db.EventScraps.findOne({
    where: { eventId, userId },
  });

  if (existScrap) {
    throw new AlreadyExistsError("이미 스크랩된 이벤트입니다.");
  }

  // 스크랩 추가
  const newScrap = await db.EventScraps.create({
    eventId,
    userId,
  });

  return newScrap;
};

export const deleteScrap = async (eventId, userId) => {
  // 중첩되어있는 부분 함수로 호출
  await isEventExists(eventId);

  // 스크랩이 존재하는지 확인하고 존재하지 않으면 404
  const existScrap = await db.EventScraps.findOne({
    where: { eventId, userId },
  });

  if (!existScrap) {
    throw new NotExistsError("이미 스크랩된 이벤트가 없습니다.");
  }

  // 스크랩 삭제하기
  const deleteScrap = await db.EventScraps.destroy({
    where: { eventId, userId },
  });

  return deleteScrap;
};
