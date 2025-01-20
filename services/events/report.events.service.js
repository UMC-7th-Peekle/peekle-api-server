import {
  UnauthorizedError,
  NotAllowedError,
  AlreadyExistsError
} from "../../utils/errors/errors.js";
import db from "../../models/index.js";

export const newReport = async (eventId, reportedUserId, reason) => {
  // 알맞은 유저인지 확인 401
  const user = await db.Users.findOne({
    where: { userId: reportedUserId },
  });

  if (!user) {
    throw new UnauthorizedError("인증되지 않은 사용자입니다.");
  }

  // 잘못된 요청 reason 누락 400
  /**
   * 아직 Ajv로 유효성 검사 안했어요
   */

  // 신고 권한 (자기자신 신고할 경우 에러) 403
  const auth = await db.Events.findOne({
    where: { eventId: eventId, createUserId: reportedUserId }
  })

  if (auth) {
    throw new NotAllowedError("신고 권한이 존재하지 않습니다.");
  }

  // 중복 신고인지 확인 409
  const existReport = await db.Reports.findOne({
    where: 
    { type: "event", 
      targetId: eventId,
      reportedUserId: reportedUserId,
    },
  });

  if (existReport) {   // 해당 이벤트가 신고 상태이면
    throw new AlreadyExistsError("이미 신고한 이벤트입니다.");
  }

  // 해당 이벤트 신고하기
  const newReport = await db.Reports.create({
    type: "event",
    targetId: eventId,
    reportedUserId: reportedUserId,
    reason: reason,
  });

  return newReport;
};