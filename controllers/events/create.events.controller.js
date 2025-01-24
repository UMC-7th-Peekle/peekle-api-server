import * as createService from "../../services/events/create.events.service.js";
import { logError } from "../../utils/handlers/error.logger.js";
import logger from "../../utils/logger/logger.js";

/**
 * events 테이블에 createdUserId가 userId 인 튜플을 추가
 */
export const createEvent = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const eventData = JSON.parse(req.body.data);
    const uploadedFiles = req.files?.event_images || [];

    // 업로드된 파일이 없는 경우 고려
    let imagePaths = [];
    if (uploadedFiles.length > 0) {
      imagePaths = uploadedFiles.map((file) => {
        const filePath = file.path.replace(/^uploads/, ""); // 경로에서 'uploads/' 제거

        // 디버깅용
        logger.debug(`[createEvent] 업로드된 이미지 경로: ${filePath}`);

        return filePath;
      });
    }

    // 이미지 경로 추가
    eventData.imagePaths = imagePaths;

    logger.debug({
      action: "event:create",
      userId: userId,
      data: eventData,
    });

    const event = await createService.newEvent(userId, eventData);

    if (event) {
      // 201
      return res.status(201).success({ message: "새로운 이벤트 저장 완료" });
    }
  } catch (error) {
    logError(error);
    next(error);
  }
};
