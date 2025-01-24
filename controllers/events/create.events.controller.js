import * as createService from "../../services/events/create.events.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

/**
 * events 테이블에 createdUserId가 userId 인 튜플을 추가
 */
export const createEvent = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const eventData = req.body;

    const event = await createService.newEvent(userId, eventData);

    if (event) {
      // 201
      return res.status(201).success({ message: "새로운 이벤트 저장 완료" });
    }
  } catch (error) {
    logError(error);
    next(error);
  }
};