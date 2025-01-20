import db from "../../models/index.js";

export const detailEvent = async (eventId) => {
  // eventId가 유효하지 않은 경우 400
  /**
   * 아직 Ajv로 유효성 검사 안했어요
   */

  const detail = await db.Events.findOne({
    where: { eventId: eventId }
  });

  return detail;
};