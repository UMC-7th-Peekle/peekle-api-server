import models from "../../models/index.js";
import { Op } from "sequelize";
import { InvalidQueryError } from "../../utils/errors/errors.js";
import logger from "../../utils/logger/logger.js";
import { addBaseUrl } from "../../utils/upload/uploader.object.js";

// 이벤트 목록 조회
export const listEvent = async ({ paginationOptions }) => {
  const {
    limit,
    cursor,
    query,
    category,
    location,
    price,
    startDate,
    endDate,
  } = paginationOptions;

  // 커서 기준 조건 설정
  let cursorWhereClause = {};
  if (cursor) {
    cursorWhereClause = {
      eventId: { [Op.lt]: cursor }, // 해당 커서 기준, 더 과거의 값 (더 작은 값)
    };
  }

  // 카테고리 조건 설정
  let categoryWhereClause = {};
  if (!category || category.length === 0) {
    categoryWhereClause = {};
  } else if (Array.isArray(category)) {
    categoryWhereClause = {
      categoryId: {
        [Op.in]: category, // 배열인 카테고리로
      },
    };
  } else {
    categoryWhereClause = {
      categoryId: category, // 단일 카테고리
    };
  }

  // 검색어 조건 설정
  let queryWhereClause = {};
  if (query) {
    queryWhereClause = {
      [Op.or]: [
        {
          title: { [Op.like]: `%${query}%` }, // 제목에 검색어 포함
        },
        {
          content: { [Op.like]: `%${query}%` }, // 내용에 검색어 포함
        },
      ],
    };
  }

  // 지역 조건 설정
  let locationWhereClause = {};
  if (!location || location.length === 0) {
    locationWhereClause = {};
  } else if (Array.isArray(location)) {
    locationWhereClause = {
      locationGroupId: {
        [Op.in]: location, // 배열인 location
      },
    };
  } else {
    locationWhereClause = {
      locationGroupId: location, // 단일 location
    };
  }

  // 금액 조건 설정
  let priceWhereClause = {};
  if (price === "무료") {
    priceWhereClause = { price: 0 };
  } else if (price === "유료") {
    priceWhereClause = { price: { [Op.gt]: 0 } }; // price가 0보다 큰 값들
  }

  // 날짜 조건 설정
  let dateWhereClause = {};
  if (startDate)
    dateWhereClause.applicationStart = { [Op.gte]: startDate.split("T")[0] }; // 2025-01-28 같은 형식
  if (endDate)
    dateWhereClause.applicationEnd = { [Op.lte]: endDate.split("T")[0] };

  const events = await models.Events.findAll({
    where: {
      ...cursorWhereClause, // 커서 기준 조건 추가
      ...priceWhereClause, // 금액 기준 조건 추가
      // ...locationWhereClause, // 위치 기준 조건 추가 - 25.02.11 event 테이블 구조 변경에 따라 depracated
      ...dateWhereClause, // 날짜 기준 조건 추가
      ...queryWhereClause, // 검색어 기준 조건 추가
    },
    limit: limit + 1, // 다음 페이지 존재 여부 확인을 위해 하나 더 조회
    order: [["eventId", "DESC"]],

    attributes: ["eventId", "title", "price", "categoryId", "createdUserId"],
    include: [
      {
        model: models.EventCategory,
        as: "category",
        where: categoryWhereClause,
        attributes: ["name", "description"],
      },
      {
        model: models.EventImages,
        as: "eventImages",
        attributes: ["imageUrl", "sequence"],
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
      // 상세 주소 관련 위치 및 장소명
      {
        model: models.EventLocation,
        as: "eventLocation",
        where: {
          locationGroupId: location,
        },
        attributes: { exclude: ["eventId", "createdAt", "updatedAt"] },
        required: false,
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

  // 이미지 링크 첨부하도록 변환
  let modifiedEvents = events.map((event) => {
    const transformedImages = event.eventImages.map((image) => ({
      imageUrl: addBaseUrl(image.imageUrl),
      sequence: image.sequence,
    }));

    const parsedLocation = {
      coordinates: event.eventLocation?.position.coordinates,
      ...event.eventLocation?.dataValues,
    };
    delete parsedLocation.position;

    console.log(transformedImages);

    return {
      ...event.dataValues,
      eventImages: transformedImages,
      eventLocation: parsedLocation,
    };
  });

  // BE에서 sort 해서 준다는 전제 하에
  // 제목, location infos, 금액, images (thumbnail), category

  logger.debug("이벤트 조회 완료", {
    action: "events:getEvents",
    actionType: "success",
  });

  return { events: modifiedEvents, nextCursor, hasNextPage };
};

export const validateEventQuery = (queries) => {
  const {
    limit,
    cursor,
    query,
    category,
    location,
    price,
    startDate,
    endDate,
  } = queries;

  if (query !== undefined && query.trim().length < 2) {
    throw new InvalidQueryError(
      "검색어는 공백을 제외하고 2자 이상이여야 합니다."
    );
  }

  const isInteger = (value) => /^\d+$/.test(value); // 정수만 허용
  if (limit !== undefined && !isInteger(limit)) {
    throw new InvalidQueryError("limit는 정수여야 합니다.");
  }
  if (cursor !== undefined && !isInteger(cursor)) {
    throw new InvalidQueryError("cursor는 정수여야 합니다.");
  }

  // price 유효성 검증
  const pricePool = ["전체", "무료", "유료"];
  if (price !== undefined && (price === "" || !pricePool.includes(price))) {
    throw new InvalidQueryError(
      "올바르지 않은 가격입니다. 허용되는 값은 다음과 같습니다.",
      pricePool
    );
  }

  // 카테고리 검증
  const categoryPool = ["1", "2", "3"];

  if (!category || (Array.isArray(category) && category.length === 0)) {
    // 카테고리 값 없음. 즉 전체 카테고리 가져오기
  }
  // 중복인 경우와 중복이 아닌 경우 나누기
  else if (Array.isArray(category)) {
    category.forEach((cate) => {
      if (!categoryPool.includes(cate)) {
        throw new InvalidQueryError(
          "올바르지 않은 카테고리입니다. 허용되는 값은 다음과 같습니다.",
          categoryPool
        );
      }
    });
  } else if (!categoryPool.includes(category)) {
    throw new InvalidQueryError(
      "올바르지 않은 카테고리입니다. 허용되는 값은 다음과 같습니다.",
      categoryPool
    );
  }

  // 위치 검증
  const locationPool = ["1", "2", "3", "4", "5", "6", "7", "8"];
  if (!location || (Array.isArray(location) && location.length === 0)) {
    // location 값 없음. 즉 전체 location 가져오기
  }
  // 중복인 경우와 중복이 아닌 경우 나누기
  else if (Array.isArray(location)) {
    location.forEach((locate) => {
      if (!locationPool.includes(locate)) {
        throw new InvalidQueryError(
          "올바르지 않은 위치입니다. 허용되는 값은 다음과 같습니다.",
          locationPool
        );
      }
    });
  } else if (!locationPool.includes(location)) {
    throw new InvalidQueryError(
      "올바르지 않은 위치입니다. 허용되는 값은 다음과 같습니다.",
      locationPool
    );
  }

  // 날짜 형식 및 유효성 검증
  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // 2024-12-31
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  if (startDate !== undefined && !isValidDate(startDate)) {
    throw new InvalidQueryError("올바르지 않은 날짜 형식입니다.");
  }
  if (endDate !== undefined && !isValidDate(endDate)) {
    throw new InvalidQueryError("올바르지 않은 날짜 형식입니다.");
  }
  if (
    startDate !== undefined &&
    endDate !== undefined &&
    new Date(startDate) > new Date(endDate)
  ) {
    throw new InvalidQueryError("startDate가 endDate보다 미래일 수 없습니다.");
  }

  return;
};
