import {
  UnauthorizedError,
  NotAllowedError,
  NotExistsError,
  AlreadyExistsError
} from "../../utils/errors/errors.js";
import models from "../../models/index.js";

export const newReport = async (eventId, userId, reason) => {
  // 잘못된 요청 reason 누락 400
  /**
   * 아직 Ajv로 유효성 검사 안했어요
   */

  // 신고 권한 (자기자신 신고할 경우 에러) 403
  const auth = await models.Events.findOne({
    where: { eventId: eventId, createdUserId: userId }
  })

  if (auth) {
    throw new NotAllowedError("본인이 작성한 게시글을 삭제할 수 없습니다.");
  }

  // eventId가 유효한지 확인 404
  const event = await models.Events.findOne({
    where: { eventId: eventId },
  });

  if (!event) {
    throw new NotExistsError("존재하지 않는 이벤트입니다.");
  }

  // const event = await db.Events.findOne({
  //   where: { eventId: eventId },
  //   attributes: ['eventId', 'createdUserId']
  // });

  // if (!event) {
  //   throw new NotExistsError("존재하지 않는 이벤트입니다.");
  // }

  // if (event.createdUserId === userId) {
  //   throw new NotAllowedError("본인이 작성한 게시글을 삭제할 수 없습니다.");
  // }

  // 중복 신고인지 확인 409
  const existReport = await models.Reports.findOne({
    where: 
    { type: "event", 
      targetId: eventId,
      reportedUserId: userId,
    },
  });

  if (existReport) {   // 해당 이벤트가 신고 상태이면
    throw new AlreadyExistsError("이미 신고한 이벤트입니다.");
  }

  // 해당 이벤트 신고하기
  const newReport = await models.Reports.create({
    type: "event",
    targetId: eventId,
    reportedUserId: userId,
    reason: reason,
  });

  return newReport;
};