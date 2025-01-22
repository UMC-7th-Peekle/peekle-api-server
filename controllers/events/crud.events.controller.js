import * as detailService from "../../services/events/crud.events.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

/**
 * events 테이블 중 주어진 eventId에 해당하는 튜플의 정보를 반환
 */
export const detailEvent = async(req, res, next) => {
  try {
    const { eventId } = req.params;

    const detail = await detailService.detailEvent(eventId);

    if (!detail) return res.status(204).success();
    
    return res.status(200).success({ detail });
  } catch (error) {
    logError(error);
    next(error);
  }
};