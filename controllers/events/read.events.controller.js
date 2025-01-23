import * as listService from "../../services/events/read.events.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

/**
 * query를 통해 category, cursor, limit를 받을 수 있습니다.
 */
export const listEvent = async (req, res, next) => {
  try {
    const { category, limit, cursor } = req.query;

    // limit 및 cursor 유효성 검증 (정수형 확인)
    const isInteger = (value) => /^\d+$/.test(value); // 정수만 허용

    if ((limit && !isInteger(limit)) || (cursor && !isInteger(cursor))) {
      return res.status(400).json({
        message: "잘못된 쿼리 매개변수입니다. 'limit' 및 'cursor'는 정수여야 합니다.",
      });
    }

    // 페이지네이션 기본값 설정
    const paginationOptions = {
      limit: limit ? parseInt(limit, 10) : 10, // 기본 limit은 10
      cursor: cursor ? parseInt(cursor, 10) : null, // cursor가 없으면 null
    };

    const { events, nextCursor, hasNextPage } = await listService.listEvent(category, paginationOptions);

    if (!events || events.length === 0) {
      return res.status(204).success({ events: [], nextCursor: null, hasNextPage: false });
    }
    
    // 200
    return res.status(200).success({ events, nextCursor, hasNextPage });
    
  } catch (error) {
    logError(error);
    next(error);
  }
};
