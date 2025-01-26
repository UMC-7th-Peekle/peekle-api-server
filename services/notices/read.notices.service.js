// Description: 공지사항 조회와 관련된 서비스 파일입니다.
import { NotExistsError } from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";
import { Op } from "sequelize";

/**
 * 카테고리별 공지사항 조회
 */
export const getNoticesByCategory = async ({ categoryId, limit, cursor }) => {
};

/**
 * 카테고리와 검색어로 공지사항 검색
 */
export const searchNotices = async ({ category, query, limit, cursor }) => {
};

/**
 * 공지사항 세부 내용 조회
 */
export const getNoticesById = async ({ noticeId }) => {
  // 공지사항 조회
  const notice = await models.Notices.findOne({
    where: { noticeId },
  });

  // 공지사항이 존재하지 않는 경우
  if (!notice) {
    throw new NotExistsError("해당 공지사항이 존재하지 않습니다.");
  }

  return { notice };
};
