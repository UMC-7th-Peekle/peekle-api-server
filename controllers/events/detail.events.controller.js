import * as detailService from "../../services/events/detail.events.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

/**
 * events 테이블 중 주어진 eventId에 해당하는 튜플의 정보를 반환
 */
export const detailEvent = async(req, res, next) => {
  try {
    const { eventId } = req.params;

    const detail = await detailService.detailEvent(eventId);

    if (!detail) return res.status(204).success({ message: "해당 이벤트의 상세 정보가 비어있습니다." });
    
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
    const updateData = req.body;
    // 업로드된 파일 정보 추출
    const uploadedFiles = req.files?.article_images || [];

    // 업로드된 파일이 없는 경우 고려
    let imagePaths = [];
    if (uploadedFiles.length > 0) {
      imagePaths = uploadedFiles.map((file) => {
        const filePath = file.path.replace(/^uploads/, "");   // 경로에서 'uploads/' 제거
        
        // 디버깅용
        console.debug(`[updateEvent] 업로드된 이미지 경로: ${filePath}`);

        return filePath;
      });
    }

    // 이미지 경로 추가
    updateData.imagePaths = imagePaths;

    const updateEvent = await detailService.updateEvent(eventId, userId, updateData);

    return res.status(200).success({ message: "이벤트 수정 완료" });
  } catch (error) {
    logError(error);
    next(error);
  }
};