// Description: 공지사항 조회와 관련된 컨트롤러 파일입니다.
import * as readNoticesService from "../../services/notices/read.notices.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";

// 카테고리별 공지사항 조회
export const getNoticesByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params; // URL에서 categoryId 추출
    const { limit, cursor } = req.query; // 쿼리 파라미터에서 limit와 cursor 추출

    const notices = await readNoticesService.getNoticesByCategory({
      categoryId,
      limit,
      cursor,
    }); // 카테고리별 공지사항 조회

    return res.status(200).success({
      message: "카테고리별 공지사항 조회 성공",
      notices,
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

// 카테고리와 검색어로 공지사항 검색
export const searchNotices = async (req, res, next) => {
  try {
    const { category, query, limit, cursor } = req.query; // Query에서 category, query, limit, cursor 추출

    const notices = await readNoticesService.searchNotices({
      category,
      query,
      limit,
      cursor,
    });

    return res.status(200).success({
      message: "공지사항 검색 성공",
      notices,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

// 공지사항 세부 내용 조회
export const getNoticesById = async (req, res, next) => {
  try {
    const { noticeId } = req.params; // URL에서 noticeId 추출

    const notice = await readNoticesService.getNoticesById({ noticeId }); // 공지사항 세부 내용 조회

    return res.status(200).success({
      message: "공지사항 세부 내용 조회 성공",
      notice,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};