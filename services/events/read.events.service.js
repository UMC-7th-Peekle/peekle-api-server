import models from "../../models/index.js";
import { Op } from "sequelize";

// 이벤트 목록 조회
export const listEvent = async (category = "all", paginationOptions) => {
  const { limit, cursor } = paginationOptions;

  // 커서 기준 조건 설정
  let whereCursor = {};
  if (cursor) {
    whereCursor = {
      eventId: { [Op.lt]: cursor }, // 해당 커서 기준, 더 과거의 값 (더 작은 값)
    };
  }

  // 카테고리 조건 설정
  let whereCategory = {};
  if (category !== "all") {
    whereCategory = { name: category }; // 카테고리 이름으로 필터링
  }

  const events = await models.Events.findAll({
    where: whereCursor,   // 커서 기준 조건 추가
    limit: limit + 1,     // 다음 페이지 존재 여부 확인을 위해 하나 더 조회
    order: [['eventId', 'DESC']],

    attributes: { exclude: ["categoryId", "createdUserId"] },
    include: [
      {
        model: models.EventCategory,
        as: "category",
        where: whereCategory,
        attributes: ["name", "description"],
      },
      {
        model: models.EventImages,
        as: "eventImages",
        attributes: ["imageUrl", "sequence", "createdAt", "updatedAt"],
      },
      {
        model: models.EventSchedules,
        as: "eventSchedules",
        attributes: [
          "repeatType",
          "repeatEndDate",
          "isAllDay",
          "customText",
          "startDate",
          "endDate",
          "startTime",
          "endTime",
        ],
      },
    ],
  });

  let hasNextPage = false;

  // limit+1로 조회했을 때 초과된 데이터가 있으면, 다음 페이지가 있다는 뜻
  if (events.length > limit) {
    hasNextPage = true;
    events.pop(); // 초과된 첫 번째 레코드를 제거
  }

  // 더 과거의 이벤트가 있으면 nextCursor를 설정
  const nextCursor = hasNextPage ? events[events.length - 1].eventId : null;

  return { events, nextCursor, hasNextPage };
};
