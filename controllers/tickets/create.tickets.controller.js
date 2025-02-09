import * as createService from "../../services/tickets/create.tickets.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";
import { parseImagePaths } from "../../utils/upload/uploader.object.js";

/**
 * Ticket 생성하기
 */
export const createTicket = async (req, res, next) => {
  try {
    const userId = req?.user?.userId || null;
    const ticketTitle = req.body.title;

    logger.debug("티켓 생성", {
      action: "ticket:create",
      userId: userId,
      data: ticketTitle,
    });

    const ticket = await createService.createTicket({ userId, ticketTitle });

    if (ticket) {
      // 201
      return res.status(201).success({ message: "새로운 티켓 생성 완료" });
    }
  } catch (error) {
    logError(error);
    next(error);
  }
};

/**
{
	"title": "티켓제목"
},
 */

/**
 * 티켓 메시지 생성하기
 */
export const createTicketMessage = async (req, res, next) => {
  try {
    const userId = req?.user?.userId || null;
    const ticketMessageData = JSON.parse(req.body.data);
    const uploadedFiles = req.files?.ticket_images || [];
    // 이미지 경로 추가
    ticketMessageData.imagePaths = parseImagePaths(uploadedFiles);

    logger.debug({
      action: "ticketMessage:create",
      userId: userId,
      data: ticketMessageData,
    });

    const ticketMessage = await createService.createTicketMessage({
      userId,
      ticketMessageData,
    });

    if (ticketMessage) {
      // 201
      return res.status(201).success({ message: "티켓 메시지 저장 완료" });
    }
  } catch (error) {
    logError(error);
    next(error);
  }
};
