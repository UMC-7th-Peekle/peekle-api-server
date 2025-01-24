import * as detailService from "../../services/events/detail.events.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";
import { getUploadedImagePaths } from "../../utils/upload/uploader.object.js";

/**
 * events 테이블 중 주어진 eventId에 해당하는 튜플의 정보를 반환
 */
export const detailEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const detail = await detailService.detailEvent(eventId);

    if (!detail)
      return res
        .status(204)
        .success({ message: "해당 이벤트의 상세 정보가 비어있습니다." });

    return res.status(200).success({ detail });
  } catch (error) {
    logError(error);
    next(error);
  }
};

/**
 * 이벤트 상세정보 수정하기
 */
export const updateEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.user;
    const updateData = JSON.parse(req.body.data || "{}");
    // 업로드된 파일 정보 추출
    const uploadedFiles = req.files?.event_images || [];
    // 이미지 경로 추가
    updateData.imagePaths = getUploadedImagePaths(uploadedFiles);

    logger.debug({
      action: "event:update",
      actionType: "log",
      userId: userId,
      data: updateData,
    });

    const updateEvent = await detailService.updateEvent(
      eventId,
      userId,
      updateData
    );

    return res.status(200).success({ message: "이벤트 수정 완료" });
  } catch (error) {
    logError(error);
    next(error);
  }
};
