import * as detailService from "../../services/events/detail.events.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

/**
 * events 테이블 중 주어진 eventId에 해당하는 튜플의 정보를 반환
 */
export const detailEvent = async(req, res, next) => {
  try {
    const { eventId } = req.params;

    const detail = await detailService.detailEvent(eventId);

    if (!detail) return res.status(204).success({ message: "해당 이벤트의 상세 정보가 비어있습니다." });
    
    return res.status(200).success({ detail });
  } catch (error) {
    logError(error);
    next(error);
  }
};