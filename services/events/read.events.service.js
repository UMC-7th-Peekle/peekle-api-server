import models from "../../models/index.js";

// 이벤트 목록 조회
export const listEvent = async (category = "all", paginationOptions) => {
  const { limit, cursor } = paginationOptions;

  // 커서 기준 조건 설정
  let whereCursor = {};
  if (cursor) {
    whereCursor = {
      eventId: { [models.Sequelize.Op.gt]: cursor },    // 커서보다 큰 ID 값을 조회
    };
  }

  // 카테고리 조건 설정
  let whereCategory = {};
  if (category !== "all") {
    whereCategory = { name: category };   // 카테고리 이름으로 필터링
  }

  const event = await models.Events.findAll({
    where: whereCursor, // 커서 기준 조건 추가
    limit,

    attributes: { exclude: ["categoryId", "createdUserId", "columnName"] },
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

  return event;
};
