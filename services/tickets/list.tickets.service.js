import models from "../../models/index.js";

/**
 * 해당 유저의 모든 티켓 조회하기 (자기가 만든 티켓만 조회)
 */
export const listTicket = async ({ paginationOptions, userId }) => {
  const { limit, cursor } = paginationOptions;

  // 커서 기준 조건 설정
  let cursorWhereClause = {};
  if (cursor) {
    cursorWhereClause = {
      ticketId: { [Op.lt]: cursor }, // 해당 커서 기준, 더 과거의 값 (더 작은 값)
    };
  }

  const tickets = await models.Tickets.findAll({
    where: { ...cursorWhereClause, createdUserId: userId },
    limit: limit + 1,
    order: [["ticketId", "ASC"]],
    attributes: ["ticketId", "title", "status", "createdUserId"],
  });

  let hasNextPage = false;

  // limit+1로 조회했을 때 초과된 데이터가 있으면, 다음 페이지가 있다는 뜻
  if (tickets.length > limit) {
    hasNextPage = true;
    tickets.pop(); // 초과된 마지막 레코드를 제거
  }

  // 더 과거의 티켓이 있으면 nextCursor를 설정
  const nextCursor = hasNextPage ? tickets[tickets.length - 1].ticketId : null;

  return { tickets, nextCursor, hasNextPage };
};
