import * as scrapService from "../../services/events/scrap.events.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

/**
 * event_scraps 테이블에 주어진 event_Id와 JWT로 주어진 사용자 Id를 바탕으로 튜플을 추가
 * 특정 이벤트 스크랩
 */
export const newScrap = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const userId = req?.user?.userId || null;

    const scrap = await scrapService.newScrap({ eventId, userId });

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
    const userId = req?.user?.userId || null;

    const scrap = await scrapService.deleteScrap({ eventId, userId });

    if (scrap) {
      return res.status(200).success({ message: "이벤트 스크랩 취소 성공" });
    }
  } catch (error) {
    logError(error);
    next(error);
  }
};

/**
 * 스크랩한 이벤트 목록을 조회합니다.
 * scrap 쿼리로 가져와서 확인합니다. scrap = true..? --> /events/scrap?scrap=true
 */
export const listScrap = async (req, res, next) => {
  try {
    const { scrap, category, limit, cursor } = req.query;
    const userId = req?.user?.userId || null;

    // 중복 선택 받아오는 배열로
    const categories = Array.isArray(category)
      ? category
      : category
        ? [category]
        : [];

    // 페이지네이션 기본값 설정
    const paginationOptions = {
      limit: limit ? parseInt(limit, 10) : 10, // 기본 limit은 10
      cursor: cursor ? parseInt(cursor, 10) : null, // cursor가 없으면 null
      scrap,
      category: categories,
    };

    const { events, nextCursor, hasNextPage } = await scrapService.listScrap({
      paginationOptions,
      userId,
    });

    if (!events || events.length === 0) {
      return res.status(204).end();
    }

    // 200
    return res.status(200).success({ events, nextCursor, hasNextPage });
  } catch (error) {
    logError(error);
    next(error);
  }
};
