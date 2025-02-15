import TicketMessageImages from "../../models/database/TicketMessageImages.js";
import TicketMessages from "../../models/database/TicketMessages.js";
import models from "../../models/index.js";
import { NotAllowedError, NotExistsError } from "../../utils/errors/errors.js";
import logger from "../../utils/logger/logger.js";
import { addBaseUrl } from "../../utils/upload/uploader.object.js";

// 티켓 상태 수정
export const updateTicket = async ({ ticketId, userId, updateData }) => {
  try {
    const ticket = await models.Tickets.findOne({
      where: {
        ticketId,
      },
    });

    // 해당 티켓이 존재하지 않는 경우 404
    if (!ticket) {
      logger.warn("해당 티켓이 없습니다.", {
        action: "ticket:update",
        actionType: "error",
        message: "존재하지 않는 티켓에 대한 상태 수정 요청입니다.",
        userId: userId,
        data: updateData,
      });
      throw new NotExistsError("존재하지 않는 티켓입니다.");
    }

    // 해당 티켓 작성자가 수정을 요청한 게 아닌 경우 403
    if (ticket.createdUserId.toString() !== userId) {
      logger.error("본인의 티켓이 아닌 경우의 수정", {
        action: "ticket:update",
        actionType: "error",
        message: "타인이 작성한 티켓에 대한 수정 요청입니다.",
        data: {
          createdUserId: ticket.createdUserId,
          requestedUserId: userId,
          requestedData: updateData,
        },
      });
      throw new NotAllowedError(
        "본인이 작성하지 않은 티켓의 상태를 수정할 수 없습니다."
      );
    }

    await ticket.update({
      status: updateData.status, // status만 수정하기
    });

    logger.debug({
      action: "ticket:update",
      actionType: "success",
      message: "티켓 업데이트 완료",
      data: {
        requestedUserId: userId,
      },
    });
  } catch (error) {
    throw error;
  }
};

// 티켓 삭제하기
export const deleteTicket = async ({ ticketId, userId }) => {
  try {
    const ticket = await models.Tickets.findByPk(ticketId);

    if (!ticket) {
      throw new NotExistsError("존재하지 않는 티켓입니다.");
    }

    // 상태가 open이 아닌 경우 삭제할 수 없음 403
    if (ticket.status !== "open") {
      throw new NotAllowedError("open 상태의 티켓만 삭제할 수 있습니다.");
    }

    await ticket.destroy();

    logger.debug({
      action: "ticket:delete",
      actionType: "success",
      message: "티켓 삭제 완료",
      data: {
        ticketId,
        userId,
      },
    });
  } catch (error) {
    throw error;
  }
};

// 티켓 메시지 조회
export const detailTicket = async ({ paginationOptions, ticketId, userId }) => {
  const { limit, cursor } = paginationOptions;

  // 해당 ticketId가 존재하는지 확인
  const ticketExists = await models.Tickets.findOne({
    where: { ticketId },
  });

  if (!ticketExists) {
    logger.warn("존재하지 않는 티켓에 대한 조회 요청입니다.", {
      action: "ticket:getDetail",
      actionType: "error",
      data: { ticketId },
    });
    throw new NotExistsError("해당 티켓은 존재하지 않습니다.");
  }

  // 커서 기준 조건 설정
  let cursorWhereClause = {};
  if (cursor) {
    cursorWhereClause = {
      ticketMessageId: { [Op.lt]: cursor }, // 해당 커서 기준, 더 과거의 값 (더 작은 값)
    };
  }

  const ticketMessages = await models.TicketMessages.findAll({
    where: {
      ...cursorWhereClause,
      ticketId: ticketId,
      createdUserId: userId,
    },
    limit: limit + 1,
    order: [["ticketMessageId", "ASC"]],

    attributes: { exclude: ["createdAt", "ticketId", "updatedAt"] },
    include: [
      {
        model: TicketMessageImages,
        as: "ticketMessageImages",
        attributes: ["imageUrl", "sequence"],
      },
    ],
  });

  if (!ticketMessages || ticketMessages.length === 0) {
    logger.warn("존재하지 않는 티켓 메시지에 대한 조회 요청입니다.", {
      action: "ticket:getDetail",
      actionType: "error",
      data: { ticketId },
    });
    throw new NotExistsError("티켓 메시지가 존재하지 않는 티켓입니다.");
  }

  // 두 개 차이
  // console.log(ticketMessages[0].createdUserId);   // 반환
  // console.log(ticketMessages.createdUserId);      // undefined

  if (ticketMessages[0].createdUserId.toString() !== userId) {
    logger.warn("사용자가 해당 티켓을 조회할 권한이 없습니다.", {
      action: "ticket:getDetail",
      actionType: "error",
      data: { ticketId, userId },
    });
    throw new NotAllowedError("해당 티켓을 조회할 권한이 없습니다.");
  }

  let hasNextPage = false;

  // limit+1로 조회했을 때 초과된 데이터가 있으면, 다음 페이지가 있다는 뜻
  if (ticketMessages.length > limit) {
    hasNextPage = true;
    ticketMessages.pop(); // 초과된 마지막 레코드를 제거
  }

  // 더 과거의 이벤트가 있으면 nextCursor를 설정
  const nextCursor = hasNextPage
    ? ticketMessages[ticketMessages.length - 1].ticketMessageId
    : null;

  const modifiedTicketMessages = ticketMessages.map((message) => ({
    ...message.dataValues,
    ticketMessageImages: message.ticketMessageImages
      ? message.ticketMessageImages.map((image) => ({
          imageUrl: addBaseUrl(image.imageUrl),
          sequence: image.sequence,
        }))
      : [], // ticketMessageImages가 없으면 빈 배열로 처리
  }));

  return {
    ticketData: modifiedTicketMessages,
    nextCursor,
    hasNextPage,
  };
};
