import {
  AlreadyExistsError,
  NotExistsError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import { Sequelize } from "sequelize";
import { addBaseUrl } from "../../utils/upload/uploader.object.js";

// 새로운 스크랩 생성
export const newScrap = async (eventId, userId) => {
  try {
    // 유니크 키 위반 발생 시 Sequelize가 UniqueConstraintError를 throw
    const newScrap = await models.EventScraps.create({ eventId, userId });
    return newScrap;
  } catch (error) {
    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      throw new NotExistsError("존재하지 않는 이벤트입니다.");
    } else if (error instanceof Sequelize.UniqueConstraintError) {
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

    if (deleteScrap === 0) {
      // 반환값이 0일 경우 404
      throw new NotExistsError("스크랩 되어 있지 않은 이벤트입니다.");
    }

    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * 스크랩한 이벤트 목록을 조회합니다.
 */
export const listScrap = async(paginationOptions, userId) => {
  const { 
    limit, 
    cursor, 
    scrap
  } = paginationOptions;

  // 커서 기준 조건 설정
  let cursorWhereClause = {};
  if (cursor) {
    cursorWhereClause = {
      eventId: { [Op.lt]: cursor }, // 해당 커서 기준, 더 과거의 값 (더 작은 값)
    };
  }

  // userId 조건 설정
  const userWhereClause = { userId };

  // 스크랩 조건 설정
  let scrapWhereClause = {};
  if (scrap === "true") {
    scrapWhereClause = {}; // 모든 튜플을 반환할 조건 (필터링 없음)
  }

  // 이벤트 불러오기
  const events = await models.EventScraps.findAll({
    where: {
      ...cursorWhereClause,
      ...userWhereClause,
      ...scrapWhereClause,
    },
    limit: limit + 1,
    order: ["eventScrapId", "DESC"],

    attributes: { exclude: ["userId", "createdAt", "updateAt"] },
    include: [
      {
        model: models.Events,
        as: "events",
        attributes: [
          "title", 
          "content", 
          "price", 
          "location", 
          "locationGroupId",
          "eventUrl", 
          "applicationStart",
          "applicationEnd",
        ]
      },
      {
        model: models.EventCategory,
        as: "category",
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
    ]
  });

  let hasNextPage = false;
  
  // limit+1로 조회했을 때 초과된 데이터가 있으면, 다음 페이지가 있다는 뜻
  if (events.length > limit) {
    hasNextPage = true;
    events.pop(); // 초과된 마지막 레코드를 제거
  }

  // 더 과거의 이벤트가 있으면 nextCursor를 설정
  const nextCursor = hasNextPage ? events[events.length - 1].eventScrapId : null;

  const modifiedEvents = events.map((event) => {
    const transformedImages = event.eventImages.map((image) => ({
      imageUrl: addBaseUrl(image.imageUrl),
      sequence: image.sequence,
    }));

    return {
      ...event.dataValues,
      eventImages: transformedImages,
    };
  });

  return { events: modifiedEvents, nextCursor, hasNextPage };

  // 쿼리 유효성 검증 부분
};