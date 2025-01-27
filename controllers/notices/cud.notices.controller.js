import * as noticeService from "../../services/notices/cud.notices.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";
import { parseImagePaths } from "../../utils/upload/uploader.object.js";

/**
 * notices 테이블에 authorId가 userId 인 튜플을 추가
 */
export const createNotice = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { categoryId } = req.params;
    const noticeData = JSON.parse(req.body.data);
    const uploadedFiles = req.files?.notice_images || [];
    // 이미지 경로 추가
    noticeData.imagePaths = parseImagePaths(uploadedFiles);

    // 로깅해서 이미지 경로 확인 (확인용)
    logger.debug("업로드된 이미지 경로", {
      action: "notice:create",
      actionType: "success",
      userId: userId,
      imagePaths: noticeData.imagePaths,
    });

    logger.debug("공지사항 생성", {
      action: "notice:create",
      actionType: "success",
      userId: userId,
      data: noticeData,
    });

    const notice = await noticeService.newNotice(
      userId,
      categoryId,
      noticeData
    );

    if (notice) {
      // 201
      return res.status(201).success({ message: "새로운 공지 생성 완료" });
    }
  } catch (error) {
    logError(error);
    next(error);
  }
};

export const updateNotice = async (req, res, next) => {
  try {
    const { noticeId } = req.params;
    const { userId } = req.user;
    const updateData = JSON.parse(req.body.data);
    // 업로드된 파일 정보 추출
    const uploadedFiles = req.files?.notice_images || [];
    // 이미지 경로 추가
    updateData.imagePaths = parseImagePaths(uploadedFiles);

    logger.debug("공지사항 수정", {
      action: "notice:update",
      actionType: "log",
      userId: userId,
      data: updateData,
    });

    await noticeService.updateNotice({ noticeId, userId, updateData });

    return res.status(200).success({ message: "공지사항 수정 완료" });
  } catch (error) {
    logError(error);
    next(error);
  }
};

export const deleteNotice = async (req, res, next) => {
  try {
    const { noticeId } = req.params;
    const { userId } = req.user;

    logger.debug("공지사항 삭제", {
      action: "notice: delete",
      actionType: "success",
      userId: userId,
    });

    const notice = await noticeService.deleteNotice(noticeId, userId);

    if (notice)
      return res.status(200).success({ message: "공지사항 삭제 완료" });
  } catch (error) {
    logError(error);
    next(error);
  }
};
