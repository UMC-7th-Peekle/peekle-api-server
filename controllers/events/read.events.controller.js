import * as listService from "../../services/events/read.events.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

/**
 * query를 통해 category, cursor, limit를 받을 수 있습니다.
 */
export const listEvent = async(req, res, next) => {
  try {
    const { category } = req.query;
    const { limit, cursor } = req.query;

    // 페이지네이션 기본값 설정
    const paginationOptions = {
      limit: limit ? parseInt(limit, 10) : 10, // 기본 limit은 10
      cursor: cursor || null, // cursor가 없으면 null
    };

    const list = await listService.listEvent(category, paginationOptions);

    if (list && list.length > 0) {
      // 200
      return res.status(200).json({ message: "목록 조회 성공", data: list });
    } else {
      // 204
      return res.status(204).send();
    }
  } catch (error) {
    logError(error);
    next(error);
  }
};