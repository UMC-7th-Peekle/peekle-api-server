import * as detailService from "../../services/tickets/detail.tickets.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";

/**
 * 티켓 수정하기
 * 티켓의 필드: title, status 중 'status'만 수정이 가능합니다.
 */
export const updateTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const userId = req?.user?.userId || null;
    const updateData = req.body;

    logger.debug("티켓 상태 수정", {
      action: "ticket:update",
      actionType: "log",
      userId: userId,
      data: updateData,
    });

    await detailService.updateTicket({ ticketId, userId, updateData }); // RORO 지키기

    return res.status(200).success({ message: "티켓 수정 완료" });
  } catch (error) {
    logError(error);
    next(error);
  }
};

/**
 * 티켓 삭제하기
 * 상태가 open인 경우에만 티켓 삭제가 가능합니다.
 * ticketId는 req에서 body로 받아오는 것으로 수정하였습니다.
 */
// export const deleteTicket = async (req, res, next) => {
//   try {
//     await detailService.deleteTicket({
//       ticketId: req.body.ticketId,
//       userId: req?.user?.userId || null,
//     });

//     return res.status(200).success({ message: "티켓 삭제 완료" });
//   } catch (error) {
//     logError(error);
//     next(error);
//   }
// };

/**
 * 해당 티켓 속 메시지들 모두 조회 (본인 티켓에서~)
 */
export const detailTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const userId = req?.user?.userId || null;

    const ticketData = await detailService.detailTicket({ ticketId, userId });

    if (ticketData) {
      return res.status(200).success({ ticketData });
    }
  } catch (error) {
    logError(error);
    next(error);
  }
};
