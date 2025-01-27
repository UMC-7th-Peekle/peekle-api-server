import * as updateService from "../../services/notices/update.notices.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";
import { parseImagePaths } from "../../utils/upload/uploader.object.js";

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

    await updateService.updateNotice({ noticeId, userId, updateData });

    return res.status(200).success({ message: "공지사항 수정 완료" });
  } catch (error) {
    logError(error);
    next(error);
  }
};
