import * as createService from "../../services/events/create.events.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";
import { parseImagePaths } from "../../utils/upload/uploader.object.js";

/**
 * events 테이블에 createdUserId가 userId 인 튜플을 추가
 */
export const createEvent = async (req, res, next) => {
  try {
    const userId = req?.user?.userId || null;
    const eventData = JSON.parse(req.body.data);
    const uploadedFiles = req.files?.event_images || [];
    // 이미지 경로 추가
    eventData.imagePaths = parseImagePaths(uploadedFiles);

    // 위치 정보 (주소)
    // eventData.detailAddress = req.body.detailAddress;

    logger.debug({
      action: "event:create",
      userId: userId,
      data: eventData,
    });

    const event = await createService.createEvent({ userId, eventData });

    if (event) {
      // 201
      return res.status(201).success({ message: "새로운 이벤트 저장 완료" });
    }
  } catch (error) {
    logError(error);
    next(error);
  }
};
