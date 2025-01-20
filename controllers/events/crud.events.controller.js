import * as detailService from "../../services/events/crud.events.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

export const detailEvent = async(req, res, next) => {
  try {
    const { eventId } = req.params;

    const detail = await detailService.detailEvent(eventId);

    if (detail) {
      // 200
      return res.status(200).success({ message: "이벤트 상세 정보 조회 성공" });
    }
    else if (!detail) {
      // 204
      return res.status(204).send();
    }
  } catch (error) {
    logError(error);
    next(error);
  }
};