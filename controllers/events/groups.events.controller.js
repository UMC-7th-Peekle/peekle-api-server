import * as categoryService from "../../services/events/category.events.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

/**
 * 이벤트 카테고리 전체 항목 조회
 */
export const eventCategory = async (req, res, next) => {
  try {
    const category = await categoryService.eventCategory();

    if (!category) return res.status(204).end();

    return res.status(200).success({ category });
  } catch (error) {
    logError(error);
    next(error);
  }
};

/**
 * 이벤트 지역 설정 전체 항목 조회
 */
export const eventLocation = async (req, res, next) => {
  try {
    const location = await categoryService.eventLocation();

    if (!location) return res.status(204).end();

    return res.status(200).success({ location });
  } catch (error) {
    logError(error);
    next(error);
  }
};
