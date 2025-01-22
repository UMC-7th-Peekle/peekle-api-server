import {
  AlreadyExistsError,
  NotExistsError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import { Sequelize } from "sequelize";

// 새로운 스크랩 생성
export const newScrap = async (eventId, userId) => {
  try {
    // 유니크 키 위반 발생 시 Sequelize가 UniqueConstraintError를 throw
    const newScrap = await models.EventScraps.create({ eventId, userId });
    return newScrap;
  } catch (error) {
    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      throw new NotExistsError("존재하지 않는 이벤트입니다.");
    } 
    else if (error instanceof Sequelize.UniqueConstraintError) {
      throw new AlreadyExistsError("이미 스크랩된 이벤트입니다.");
    }
    throw error;
  }
};

export const deleteScrap = async (eventId, userId) => {
  try {
    const event = await models.Events.findOne({ where: { eventId } });
    if (!event) {
      throw new NotExistsError("존재하지 않는 이벤트입니다.");
    }

    const deleteScrap = await models.EventScraps.destroy({
      where: { eventId, userId },
    });

    if (deleteScrap === 0) {    // 반환값이 0일 경우 404
      throw new NotExistsError("이미 스크랩 취소한 이벤트입니다.");
    }

    return true; 
  } catch (error) {
    throw error;
  }
};
