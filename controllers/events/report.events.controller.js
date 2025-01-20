import * as reportService from "../../services/events/report.events.service.js";
import { logError } from "../../utils/handlers/error.logger.js";

/**
 * reported_user_id는 JWT 토큰으로 전달 (현재 유저)
  targetId가 될 path_parameter는 신고 대상 이벤트의 ID입니다.
  한 대상에 대해서는 한 사용자 당 한 번의 신고 가능 (중복 에러)
 */
export const newReport = async(req, res, next) => {
  try {
    const { eventId } = req.params;
    const { reportedUserId } = req.user;
    const { reason } = req.body;    // 사용자가 적는거

    const report = await reportService.newReport(eventId, reportedUserId, reason);

    if (report) {   // 201
      return res.status(201).sucess({ "message": "Report created successfully" });
    }
  } catch (error) {
        logError(error);
        next(error);
    }
};