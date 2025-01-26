import * as scrapService from "../../services/events/scrap.events.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

/**
 * event_scraps 테이블에 주어진 event_Id와 JWT로 주어진 사용자 Id를 바탕으로 튜플을 추가
 * 특정 이벤트 스크랩
 */
export const newScrap = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const { userId } = req.user;

    const scrap = await scrapService.newScrap(eventId, userId);

    if (scrap) {
      // 201
      return res.status(201).success({ message: "이벤트 스크랩 성공" });
    }
  } catch (error) {
    logError(error);
    next(error);
  }
};

/**
 * event_scraps 테이블에서 주어진 event_Id와 JWT로 주어진 사용자 Id를 바탕으로 튜플을 제거
 * 특정 이벤트를 스크랩 취소
 */
export const deleteScrap = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const { userId } = req.user;

    const scrap = await scrapService.deleteScrap(eventId, userId);

    if (scrap) {
      return res.status(200).success({ message: "이벤트 스크랩 취소 성공" });
    }
  } catch (error) {
    logError(error);
    next(error);
  }
};
