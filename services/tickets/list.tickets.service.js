import Tickets from "../../models/database/Tickets.js";

/**
 * 해당 유저의 모든 티켓 조회하기 (자기가 만든 티켓만 조회)
 */
export const listTicket = async ({ userId }) => {
  return await Tickets.findAll({
    where: { createdUserId: userId },
    attributes: ["ticketId", "title", "status", "createdUserId"],
  });
};
