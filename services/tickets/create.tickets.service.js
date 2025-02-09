import models from "../../models/index.js";
import {
  InvalidInputError,
  NotExistsError,
  NotAllowedError,
} from "../../utils/errors/errors.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";

// 새로운 티켓 생성
export const createTicket = async ({ userId, ticketTitle }) => {
  // 티켓 제목, 티켓 상태 누락 400
  if (!ticketTitle) {
    throw new InvalidInputError("티켓 제목이 누락되었습니다.");
  }

  const transaction = await models.sequelize.transaction();

  try {
    // 티켓 생성
    const ticket = await models.Tickets.create(
      {
        title: ticketTitle,
        status: "open", // status를 항상 open으로 설정
        createdUserId: userId,
      },
      { transaction }
    );

    await transaction.commit();

    logger.debug("티켓 생성 성공", {
      action: "ticket:create",
      actionType: "success",
      userId: userId,
    });

    return { ticket };
  } catch (error) {
    logError(error);
    logger.error("티켓 생성 실패, Rollback 실행됨.", {
      action: "ticket:create",
      actionType: "error",
      userId: userId,
    });
    await transaction.rollback();
    throw error;
  }
};

// 새로운 티켓 메시지 생성
export const createTicketMessage = async ({ userId, ticketMessageData }) => {
  // 티켓 메시지 제목, 내용 누락 400
  if (!ticketMessageData.title || !ticketMessageData.content) {
    throw new InvalidInputError("티켓 메시지 제목 또는 내용이 누락되었습니다.");
  }

  // 티켓 존재 여부 확인 404
  const ticket = await models.Tickets.findByPk(ticketMessageData.ticketId);
  if (!ticket) {
    throw new NotExistsError("해당 티켓이 없습니다.");
  }

  const transaction = await models.sequelize.transaction();

  try {
    // 해당 티켓 메시지 생성 권한이 없는 경우 403
    if (ticket.createdUserId.toString() !== userId) {
      logger.error(
        "관리자가 아니거나 해당 티켓을 생성한 유저가 아닌 경우의 에러",
        {
          action: "ticketMessage:create",
          actionType: "error",
          message:
            "관리자가 아니거나 해당 티켓을 생성한 유저가 아닌 경우의 에러입니다.",
          data: {
            createdUserId: ticket.createdUserId,
            requestedUserId: userId,
            requestedData: ticketMessageData,
          },
        }
      );
      throw new NotAllowedError(
        "본인이 작성하지 않은 티켓에 메시지를 추가할 수 없습니다."
      );
    }

    // 티켓 메시지 생성
    const ticketMessage = await models.TicketMessages.create(
      {
        ...ticketMessageData,
        createdUserId: userId,
      },
      { transaction }
    );

    // 이미지가 새로 들어온 경우에만 처리
    if (ticketMessageData.imagePaths.length > 0) {
      // 새로운 이미지 추가
      const ticketMessageImageData = ticketMessageData.imagePaths.map(
        (path, index) => ({
          ticketMessageId: ticketMessage.ticketMessageId,
          imageUrl: path,
          sequence: index + 1, // 이미지 순서 설정
        })
      );

      await models.TicketMessageImages.bulkCreate(ticketMessageImageData, {
        transaction,
      });
    }

    await transaction.commit();

    logger.debug("티켓 메시지 생성 성공", {
      action: "ticketMessage:create",
      actionType: "success",
      userId: userId,
    });

    return { ticketMessage };
  } catch (error) {
    logError(error);
    logger.error("티켓 메시지 생성 실패, Rollback 실행됨.", {
      action: "ticketMessage:create",
      actionType: "error",
      userId: userId,
    });
    await transaction.rollback();
    throw error;
  }
};
