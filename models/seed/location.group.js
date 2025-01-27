import logger from "../../utils/logger/logger.js";
import models from "../index.js";

const groups = [
  "잠실 / 송파 / 강동",
  "마포 / 서대문 / 은평",
  "강서 / 금천 / 양천",
  "광진 / 성동 / 중랑 / 동대문",
  "강남 / 서초 / 양재",
  "동작 / 관악 / 사당",
  "종로 / 중구 / 용산",
  "영등포 / 구로 / 신도림",
];

export const eventLocationGroup = async () => {
  try {
    await models.EventLocationGroups.bulkCreate(
      groups.map((group) => ({ name: group }))
    );
    logger.warn("EventLocationGroups에 대한 Seeding이 실행되었습니다.", {
      action: "seed:eventLocationGroups",
      actionType: "success",
    });
  } catch (error) {
    throw error;
  }
};
