import * as listService from "../../services/events/list.events.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";

/**
 * 이벤트 목록 조회 컨트롤러
 */
export const listEvent = async (req, res, next) => {
  try {
    listService.validateEventQuery(req.query);
    const {
      limit,
      cursor,
      query,
      category,
      location,
      price,
      startDate,
      endDate,
      sort, // '가까운 날짜순', '낮은 금액순', '가까운 거리순'
      lat,
      lng,
      southWest,
      northEast,
    } = req.query;

    // 중복 선택 받아오는 배열로
    const categories = Array.isArray(category)
      ? category
      : category
        ? [category]
        : [];
    const locations = Array.isArray(location)
      ? location
      : location
        ? [location]
        : [];

    logger.debug("이벤트 목록 조회", {
      action: "events:getEvents",
      actionType: "request",
      limit,
      cursor,
      query,
      category: categories,
      location: locations,
      price,
      startDate,
      endDate,
      sort,
      lat, // 유저 위치 위경도
      lng,
      southWest, // 해당 객체로 이벤트 반경
      northEast,
    });

    // 페이지네이션 기본값 설정
    const paginationOptions = {
      limit: limit ? parseInt(limit, 10) : 10, // 기본 limit은 10
      cursor: cursor ? parseInt(cursor, 10) : null, // cursor가 없으면 null
      query,
      category: categories,
      location: locations,
      price,
      startDate,
      endDate,
      sort,
      userLocation:
        lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null,
      southWest,
      northEast,
    };

    const { events, nextCursor, hasNextPage } = await listService.listEvent({
      paginationOptions,
    });

    if (!events || events.length === 0) {
      return res.status(204).end();
      // .success({ events: [], nextCursor: null, hasNextPage: false });
    }

    // 200
    return res.status(200).success({ events, nextCursor, hasNextPage });
  } catch (error) {
    logError(error);
    next(error);
  }
};
