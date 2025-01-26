// Description: 공지사항 조회와 관련된 컨트롤러 파일입니다.
import * as readNoticesService from "../../services/notices/read.notices.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";

// 카테고리별 공지사항 조회
export const getNoticesByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params; // URL에서 categoryId 추출
    const { limit, cursor } = req.query; // 쿼리 파라미터에서 limit와 cursor 추출

    // 페이지네이션 기본값 설정
    const paginationOptions = {
      limit: limit ? parseInt(limit, 10) : 10, // 기본 limit은 10
      cursor: cursor || null, // cursor가 없으면 null
    };

    const { notices, nextCursor, hasNextPage } =
      await readNoticesService.getNoticesByCategory(
        categoryId,
        paginationOptions
      ); // 카테고리별 공지사항 조회

    // 공지사항이 없는 경우
    if (notices && notices.length === 0) {
      return res.status(204).success(); // 응답 본문 없이 204 반환
    }

    return res.status(200).success({
      message: "카테고리별 공지사항 조회 성공",
      notices,
      nextCursor,
      hasNextPage,
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

// 카테고리와 검색어로 공지사항 검색
export const searchNotices = async (req, res, next) => {
  try {
    const { category, query } = req.query; // Query에서 category, query, limit, cursor 추출
    const { limit, cursor } = req.query; // 쿼리 파라미터에서 limit와 cursor 추출

    // 페이지네이션 기본값 설정
    const paginationOptions = {
      limit: limit ? parseInt(limit, 10) : 10, // 기본 limit은 10
      cursor: cursor || null, // cursor가 없으면 null
    };

    const { notices } = await readNoticesService.searchNotices(
      category,
      query,
      paginationOptions
    );

    // 공지사항이 없는 경우
    if (notices && notices.length === 0) {
      return res.status(204).success(); // 응답 본문 없이 204 반환
    }

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
export const getNoticeById = async (req, res, next) => {
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
