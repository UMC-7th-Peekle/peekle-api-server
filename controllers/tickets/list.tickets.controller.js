import logger from "../../utils/logger/logger.js";
import * as listService from "../../services/tickets/list.tickets.service.js";

/**
 * 티켓 목록 조회 컨트롤러
 */
export const listTicket = async (req, res, next) => {
  try {
    const { limit, cursor } = req.query;
    const userId = req?.user?.userId || null;

    // 페이지네이션 기본값 설정
    const paginationOptions = {
      limit: limit ? parseInt(limit, 10) : 10, // 기본 limit은 10
      cursor: cursor ? parseInt(cursor, 10) : null, // cursor가 없으면 null
    };

    const { tickets, nextCursor, hasNextPage } = await listService.listTicket({
      paginationOptions,
      userId,
    });

    if (!tickets || tickets.length === 0) {
      return res.status(204).end();
    }

    // 200
    return res.status(200).success({ tickets, nextCursor, hasNextPage });
  } catch (error) {
    logger(error);
    next(error);
  }
};
