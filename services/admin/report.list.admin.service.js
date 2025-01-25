// Description: 관리자 페이지에서 신고 목록을 조회하는 서비스 파일입니다.
import { NotExistsError } from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";
import { Op } from "sequelize";


/**
 * 신고 목록을 조회합니다
 */
export const getReports = async (type, { limit, cursor = null }) => {
  // 신고 조회
  const reports = await models.Reports.findAll({
    where: {
      ...(cursor && { reportId: { [Op.lt]: cursor } }), // 커서 조건: reportId 기준
      ...(type && { type }), // 신고 타입
    },
    order: [["createdAt", "DESC"]], // 최신순 정렬
    limit: limit + 1, // 조회 개수 제한

  });

  // 다음 커서 설정
  const hasNextPage = reports.length > limit; // limit + 1개를 가져왔으면 다음 페이지 있음
  const nextCursor = hasNextPage ? reports[limit - 1].reportId : null;

  if (hasNextPage) {
    reports.pop(); // limit + 1개를 가져왔으면 마지막 요소는 버림
  }

  return {
    reports,
    nextCursor,
    hasNextPage,
  };
};
