// Description: 공지사항 조회와 관련된 서비스 파일입니다.
import { NotExistsError } from "../../utils/errors/errors.js";
import models from "../../models/index.js";
import logger from "../../utils/logger/logger.js";
import { Op } from "sequelize";
import { addBaseUrl } from "../../utils/upload/uploader.object.js";

/**
 * 카테고리별 공지사항 조회
 */
export const getNoticesByCategory = async ({ categoryId }) => {
  // 공지사항 조회
  const notices = await models.Notices.findAll({
    where: { categoryId },
    order: [["createdAt", "DESC"]], // 최신순 정렬
  });

  return {
    notices,
  };
};

/**
 * 카테고리와 검색어로 공지사항 검색
 */
export const searchNotices = async ({ category, query, limit, cursor }) => {
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
         
        },
      ],
    });

    return {
      notices,
    }
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
