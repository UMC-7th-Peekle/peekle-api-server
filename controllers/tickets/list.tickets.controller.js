import logger from "../../utils/logger/logger.js";
import * as listService from "../../services/tickets/list.tickets.service.js";

/**
 * 티켓 목록 조회 컨트롤러
 */
export const listTicket = async (req, res, next) => {
  try {
    const userId = req?.user?.userId || null;
    const tickets = await listService.listTicket({ userId });

    if (!tickets || tickets.length === 0) {
      return res.status(204).end();
    }

    // 200
    return res.status(200).success({ tickets });
  } catch (error) {
    logger(error);
    next(error);
  }
};
