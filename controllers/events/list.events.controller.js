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
    };

    // TODO : location, price, startDate, endDate에 대한 처리를 하고 있지 않음
    const { events, nextCursor, hasNextPage } =
      await listService.listEvent(paginationOptions);

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
