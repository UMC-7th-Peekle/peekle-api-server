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

    // limit 및 cursor 유효성 검증 (정수형 확인)
    const isInteger = (value) => /^\d+$/.test(value); // 정수만 허용
    if ((limit && !isInteger(limit)) || (cursor && !isInteger(cursor))) {
      throw new InvalidQueryError("limit, cursor는 정수여야 합니다.");
    }

    // 날짜 형식 및 유효성 검증
    // regex로 형식 검증 후 Date 객체로 변환하여 유효성 검증
    const isValidDate = (dateString) => {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(dateString)) return false;
      const date = new Date(dateString);
      return date instanceof Date && !isNaN(date);
    };

    if (
      (startDate && !isValidDate(startDate)) ||
      (endDate && !isValidDate(endDate))
    ) {
      throw new InvalidQueryError("올바르지 않은 날짜 형식입니다.");
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      throw new InvalidQueryError(
        "startDate가 endDate보다 미래일 수 없습니다."
      );
    }

    // 페이지네이션 기본값 설정
    const paginationOptions = {
      limit: limit ? parseInt(limit, 10) : 10, // 기본 limit은 10
      cursor: cursor ? parseInt(cursor, 10) : null, // cursor가 없으면 null
      location,
      price,
      startDate,
      endDate,
    };

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
