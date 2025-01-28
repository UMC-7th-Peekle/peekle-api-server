// Description: 공지사항 조회와 관련된 컨트롤러 파일입니다.
import * as readNoticesService from "../../services/notices/read.notices.service.js";
import { InvalidQueryError } from "../../utils/errors/errors.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";

// 카테고리별 공지사항 조회
export const getNoticesByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params; // URL에서 categoryId 추출
    const { limit, offset } = req.query; // 쿼리 파라미터에서 limit와 offset 추출

    // 페이지네이션 기본값 설정
    const paginationOptions = {
      limit: limit ? parseInt(limit, 10) : 10, // 기본 limit은 10
      offset: offset ? parseInt(offset, 10) : 0, // 기본 limit은 10
    };

    const { notices, totalCount } =
      await readNoticesService.getNoticesByCategory(
        categoryId,
        paginationOptions
      ); // 카테고리별 공지사항 조회

    // 공지사항이 없는 경우
    if (notices && notices.length === 0) {
      return res.status(204).end(); // 응답 본문 없이 204 반환
    }

    // 페이지 계산
    const currentPage =
      Math.floor(paginationOptions.offset / paginationOptions.limit) + 1;
    const totalPages = Math.ceil(totalCount / paginationOptions.limit);

    logger.debug("공지사항 목록 조회 성공", {
      action: "notices:getNoticesByCategory",
      actionType: "success",
      categoryId,
      noticesCount: notices.length,
    });

    return res.status(200).success({
      message: "카테고리별 공지사항 조회 성공",
      notices,
      totalCount,
      currentPage,
      totalPages,
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};

// 카테고리와 검색어로 공지사항 검색
export const searchNotices = async (req, res, next) => {
  try {
    const { category, query, limit, offset } = req.query; // Query에서 category, query, limit, offset 추출

    if (category === "" || query === "") {
      logger.debug("검색어 누락");
      throw new InvalidQueryError("Query string should NOT BE EMPTY.");
    }

    if (category === "" || query === "") {
      logger.debug("검색어 누락");
      throw new InvalidQueryError("Query string should NOT BE EMPTY.");
    }

    // 페이지네이션 기본값 설정
    const paginationOptions = {
      limit: limit ? parseInt(limit, 10) : 10, // 기본 limit은 10
      offset: offset ? parseInt(offset, 10) : 0, // 기본 offset은 0
    };

    const { notices, totalCount } = await readNoticesService.searchNotices(
      category,
      query,
      paginationOptions
    );

    // 공지사항이 없는 경우
    if (notices && notices.length === 0) {
      return res.status(204).success(); // 응답 본문 없이 204 반환
    }

    // 페이지 계산
    const currentPage =
      Math.floor(paginationOptions.offset / paginationOptions.limit) + 1;
    const totalPages = Math.ceil(totalCount / paginationOptions.limit);

    logger.debug("공지사항 검색 성공", {
      action: "notices:searchNotices",
      actionType: "success",
      category,
      query,
      noticesCount: notices.length,
    });

    return res.status(200).success({
      message: "공지사항 검색 성공",
      notices,
      totalCount,
      currentPage,
      totalPages,
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
