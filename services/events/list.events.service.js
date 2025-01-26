import models from "../../models/index.js";
import { Op } from "sequelize";
import { InvalidQueryError } from "../../utils/errors/errors.js";

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

  // TODO : category Id로 filtering 해도 되지 않을까 하는 생각

  const events = await models.Events.findAll({
    where: whereCursor, // 커서 기준 조건 추가
    limit: limit + 1, // 다음 페이지 존재 여부 확인을 위해 하나 더 조회
    order: [["eventId", "DESC"]],

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
    events.pop(); // 초과된 마지막 레코드를 제거
  }

  // 더 과거의 이벤트가 있으면 nextCursor를 설정
  const nextCursor = hasNextPage ? events[events.length - 1].eventId : null;

  return { events, nextCursor, hasNextPage };
};

export const validateQuery = (query) => {
  const { limit, cursor, category, location, price, startDate, endDate } =
    query;
  // limit 및 cursor 유효성 검증 (정수형 확인)
  const isInteger = (value) => /^\d+$/.test(value); // 정수만 허용
  if ((limit && !isInteger(limit)) || (cursor && !isInteger(cursor))) {
    throw new InvalidQueryError("limit, cursor는 정수여야 합니다.");
  }

  // 카테고리 검증
  const categoryPool = ["all", "education", "culture", "activity"];
  if (category && !categoryPool.includes(category)) {
    throw new InvalidQueryError(
      "올바르지 않은 카테고리입니다. 허용되는 값은 다음과 같습니다.",
      categoryPool
    );
  }

  // 날짜 형식 및 유효성 검증
  // regex로 형식 검증 후 Date 객체로 변환하여 유효성 검증
  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  if (
    (startDate && !isValidDate(startDate)) ||
    (endDate && !isValidDate(endDate))
  ) {
    throw new InvalidQueryError("올바르지 않은 날짜 형식입니다.");
  }

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    throw new InvalidQueryError("startDate가 endDate보다 미래일 수 없습니다.");
  }
};
