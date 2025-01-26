import * as listService from "../../services/events/list.events.service.js";
import { InvalidQueryError } from "../../utils/errors/errors.js";
import { logError } from "../../utils/handlers/error.logger.js";

/**
 * query를 통해 category, cursor, limit를 받을 수 있습니다.
 */
export const listEvent = async (req, res, next) => {
  try {
    const { limit, cursor, category, location, price, startDate, endDate } =
      req.query;

    listService.validateQuery(req.query);
    // 페이지네이션 기본값 설정
    const paginationOptions = {
      limit: limit ? parseInt(limit, 10) : 10, // 기본 limit은 10
      cursor: cursor ? parseInt(cursor, 10) : null, // cursor가 없으면 null
      location,
      price,
      startDate,
      endDate,
    };

    // TODO : location, price, startDate, endDate에 대한 처리를 하고 있지 않음
    const { events, nextCursor, hasNextPage } = await listService.listEvent(
      category,
      paginationOptions
    );

    if (!events || events.length === 0) {
      return res
        .status(204)
        .success({ events: [], nextCursor: null, hasNextPage: false });
    }

    // 200
    return res.status(200).success({ events, nextCursor, hasNextPage });
  } catch (error) {
    logError(error);
    next(error);
  }
};
