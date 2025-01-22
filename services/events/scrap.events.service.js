import {
  AlreadyExistsError,
  NotExistsError,
  UnauthorizedError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";

// 알맞은 유저인지 확인 401
const checkUser = async (userId) => {
  const user = await models.Users.findOne({
    where: { userId: userId },
  });

  if (!user) {
    throw new UnauthorizedError("로그인하지 않은 사용자의 접근입니다.");
  }
};

// eventId가 유효한지 확인 404
const existEvent = async (eventId) => {
  const event = await models.Events.findOne({
    where: { eventId: eventId },
  });

  if (!event) {
    throw new NotExistsError("존재하지 않는 이벤트입니다.");
  }
};

export const newScrap = async (eventId, userId) => {
  // 중첩되어있는 부분 함수로 호출
  await checkUser(userId);
  await existEvent(eventId);

  // 이미 이벤트가 스크랩 되어 있는지 확인 409
  const existScrap = await models.EventScraps.findOne({
    where: { eventId, userId },
  });

  if (existScrap) {
    throw new AlreadyExistsError("이미 스크랩된 이벤트입니다.");
  }

  // 스크랩 추가
  const newScrap = await models.EventScraps.create({
    eventId,
    userId,
  });

  return newScrap;
};

export const deleteScrap = async (eventId, userId) => {
  // 중첩되어있는 부분 함수로 호출
  await checkUser(userId);
  await existEvent(eventId);

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

  return deleteScrap;
};
