// Description: 관리자 페이지에서 신고 목록을 조회하는 컨트롤러 파일입니다.
import { authenticateAccessToken } from "../../middleware/authenticate.jwt.js";
import * as reportListService from "../../services/admin/report.list.admin.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";


// TODO: admin 사용자 검증 로직 추가

// 신고 목록 조회
export const getReports = async (req, res, next) => {
  try {
    // 사용자 인증 확인
    const userId = req.user.userId; // JWT에서 사용자 ID 추출
    const { type, limit, cursor } = req.query; // 쿼리 파라미터에서 type, limit, cursor 추출 

    // 페이지네이션 기본값 설정
    const paginationOptions = {
      limit: limit ? parseInt(limit, 10) : 10, // 기본 limit은 10
      cursor: cursor || null, // cursor가 없으면 null
    };

    const { reports, nextCursor, hasNextPage } = await reportListService.getReports(
      type,
      paginationOptions
    );

    // 신고가 없는 경우
    if (reports.length === 0) {
      return res.status(204).success(); // 응답 본문 없이 204 반환
    }

    // 신고가 있는 경우
    logger.debug("신고 목록 조회", {
      action: "report: getReports",
      actionType: "success",
      reportsCount: reports.length,
      nextCursor,
      hasNextPage,
    });

    return res.status(200).success({
      message: "신고 목록 조회 성공",
      reports,
      nextCursor,
      hasNextPage,
    });
  } catch (error) {
    logError(error);
    next(error); // 에러 핸들러로 전달
  }
};