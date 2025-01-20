import db from "../../models/index.js";

export const detailEvent = async (eventId) => {
  const detail = await db.Events.findOne({
    where: { eventId: eventId }
  });

  return detail;
};

// eventId가 유효하지 않은 경우 400