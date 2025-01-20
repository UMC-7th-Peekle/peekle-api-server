import EventCategory from "../../models/database/EventCategory.js";
import db from "../../models/index.js";

// 전체 이벤트 목록
export const listEvent = async (category, paginationOptions) => {
  const { limit, cursor } = paginationOptions;

  if (category = "all") {
    const event = await db.Events.findAll({
      limit,
      cursor,
    });

    return event;
  } 
  else {
    const event = await db.Events.findAll({
      limit,
      cursor,
      
      include: [{
        model: EventCategory,
        where: {
          title: category
        }
      }]
    });

    return event;
  }
};