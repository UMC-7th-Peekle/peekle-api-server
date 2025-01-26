// Description: 관리자 페이지에서 신고를 처리하는 컨트롤러 파일입니다.
import * as reportManageService from "../../services/admin/report.manage.admin.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";

// TODO: admin 사용자 검증 로직 추가

// 사용자 제재 내역 조회
export const getPenalizedUsers = async (req, res, next) => {
  try {
    const { limit, cursor } = req.query;

    // 페이지네이션 기본값 설정
    const paginationOptions = {
      limit: limit ? parseInt(limit, 10) : 10, // 기본 limit은 10
      cursor: cursor || null, // cursor가 없으면 null
    };

    const { penalizedUsers, nextCursor, hasNextPage } =
      await reportManageService.getPenalizedUsers(
        paginationOptions,
      );

    // 사용자 제재 내역이 없는 경우
    if (penalizedUsers.length === 0) {
      return res.status(204).success();
    }

    // 신고가 있는 경우
    logger.debug("사용자 제재 내역 조회", {
      action: "report: getPenalizedUsers",
      actionType: "success",
      penalizedUsersCount: penalizedUsers.length,
      nextCursor,
      hasNextPage,
    });


    // 사용자 제재 내역이 있는 경우
    return res.status(200).success({
      message: "사용자 제재 내역 조회 성공",
      penalizedUsers,
      nextCursor,
      hasNextPage,
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

// 사용자 제재
export const penalizeUser = async (req, res, next) => {
  try {
    // TODO: JWT 토큰에서 admin 사용자 ID 추출
    // 형식 검증은 완료된 상태로 들어온다고 가정 (type, reason, endsAt 등)
    // type이 'ban'인 경우 endsAt은 null로 들어온다고 가정
    const { userId, type, reason, endsAt } = req.body;

    await reportManageService.penalizeUser({
      userId,
      adminUserId: 1, // 임시로 1로 설정
      type,
      reason,
      endsAt,
    });

    logger.debug("사용자 제재 성공", {
      action: "report: penalizeUser",
      actionType: "success",
      userId,
      type,
      reason,
      endsAt,
    });

    return res.status(201).success({
      message: "사용자 제재 성공",
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};

// 사용자 제재 해제
export const unpenalizeUser = async (req, res, next) => {
  try {
    const { userId } = req.body;

    await reportManageService.unpenalizeUser({ userId });

    logger.debug("사용자 제재 해제 성공", {
      action: "report: unpenalizeUser",
      actionType: "success",
      userId,
    });

    return res.status(200).success({
      message: "사용자 제재 해제 성공",
    });
  } catch (error) {
    logError(error);
    next(error);
  }
};
