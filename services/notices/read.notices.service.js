// Description: 공지사항 조회와 관련된 서비스 파일입니다.
import {
  NotExistsError,
  InvalidQueryError,
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";
import { Op } from "sequelize";
import { addBaseUrl } from "../../utils/upload/uploader.object.js";
import { paginateListBuckets } from "@aws-sdk/client-s3";

/**
 * 카테고리별 공지사항 조회
 */
export const getNoticesByCategory = async (categoryId, paginationOptions) => {
  const result = await models.Notices.findAndCountAll({
    where: { categoryId },
    order: [["createdAt", "DESC"]], // 최신순 정렬
    limit: paginationOptions.limit, // 조회 개수 제한
    offset: paginationOptions.offset, // 페이지네이션 옵션
  });

  return {
    notices: result.rows,
    totalCount: result.count,
  };
};

/**
 * 카테고리와 검색어로 공지사항 검색
 */
export const searchNotices = async (category, query, paginationOptions) => {
  // 검색어가 없는 경우
  if (!category.trim() || !query.trim()) {
    logger.error("검색어가 누락되었습니다.", {
      action: "notices:searchNotices",
      actionType: "error",
    });
    throw new InvalidQueryError("검색어가 누락되었습니다.");
  }

  // 참고: findAndCountAll을 사용할 수 없는 이유:
  // - include로 연관된 테이블을 사용할 경우, include로 연결된 테이블이 아닌 메인 테이블의 데이터를 count함

  // 1. 조건에 맞는 전체 개수를 구함
  const totalCount = await models.Notices.count({
    include: [
      {
        model: models.NoticeCategory,
        as: "category",
        where: { name: category },
      },
    ],
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${query}%`, // 제목에 검색어 포함
          },
        },
        {
          content: {
            [Op.like]: `%${query}%`, // 내용에 검색어 포함
          },
        },
      ],
    },
  });

  // 2. 페이지네이션 적용된 데이터 가져오기
  const notices = await models.NoticeCategory.findOne({
    where: { name: category },
    include: [
      {
        model: models.Notices,
        as: "notices",
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${query}%`, // 제목에 검색어 포함
              },
            },
            {
              content: {
                [Op.like]: `%${query}%`, // 내용에 검색어 포함
              },
            },
          ],
        },
        order: [["createdAt", "DESC"]], // 최신순 정렬
        limit: paginationOptions.limit, // 조회 개수 제한
        offset: paginationOptions.offset, // 페이지네이션 옵션
        required: false, // 검색 결과가 없는 경우에도 반환
      },
    ],
  });

  return {
    ...notices.dataValues,
    totalCount,
  };
};

/**
 * 공지사항 세부 내용 조회
 */
export const getNoticesById = async ({ noticeId }) => {
  // 공지사항 조회
  const data = await models.Notices.findOne({
    where: { noticeId },
    include: [
      {
        model: models.NoticeImages,
        as: "noticeImages",
        attributes: ["imageUrl", "sequence"], // 필요한 필드만 가져오기
      },
    ],
  });

  // 공지사항이 존재하지 않는 경우
  if (!data) {
    throw new NotExistsError("해당 공지사항이 존재하지 않습니다.");
  }

  // 이미지 URL에 STATIC_FILE_BASE_URL 추가
  const transformedImages = data.noticeImages.map((image) => ({
    imageUrl: addBaseUrl(image.imageUrl),
    sequence: image.sequence,
  }));

  return {
    ...data.dataValues, // 공지사항 데이터
    noticeImages: transformedImages, // 이미지 데이터
  };
};
